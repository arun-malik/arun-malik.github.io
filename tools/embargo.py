"""Hide scheduled content from the deployed site until its publish time.

Runs in the Pages deploy workflow on the checked-out copy, before the artifact upload:

    python tools/embargo.py --apply

Content is committed ahead of time and marked by the data-stories build:
  * a page with <meta name="publish-at" content="2026-11-30T06:00-08:00"> is removed (its folder, for index.html)
  * a block between <!-- embargo:2026-11-30T06:00-08:00 --> and <!-- /embargo --> is removed
Once the time has passed the markers are stripped and the content ships. Blocks can nest.
The feed-level <updated> in feed.xml is recomputed from the entries that remain.

Without --apply it only reports what would be hidden (safe to run locally).
"""
import argparse
import datetime as dt
import re
import shutil
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
META = re.compile(r'<meta name="publish-at" content="([^"]+)">')
BLOCK = re.compile(r"<!-- embargo:(\S+) -->((?:(?!<!-- embargo:).)*?)<!-- /embargo -->", re.S)
SKIP = {".git", "node_modules", ".worktrees", ".playwright-mcp", ".pytest_cache", "drafts", "social"}


def due(stamp, now):
    t = dt.datetime.fromisoformat(stamp)
    if not t.tzinfo:
        raise ValueError(f"publish time without a timezone: {stamp}")
    return t <= now


def files(root):
    for p in root.rglob("*"):
        if p.suffix in (".html", ".xml") and p.is_file() and not SKIP.intersection(p.relative_to(root).parts):
            yield p


def process(text, now):
    hidden = []
    while True:
        m = BLOCK.search(text)
        if not m:
            return text, hidden
        if due(m.group(1), now):
            text = text[:m.start()] + m.group(2) + text[m.end():]
        else:
            hidden.append(m.group(1))
            text = text[:m.start()] + text[m.end():]


def fix_feed_updated(text):
    stamps = re.findall(r"<entry>.*?<updated>([^<]+)</updated>", text, re.S)
    if not stamps:
        return text
    latest = max(stamps, key=lambda s: dt.datetime.fromisoformat(s.replace("Z", "+00:00")))
    head = re.search(r"<updated>[^<]+</updated>", text)
    return text[:head.start()] + f"<updated>{latest}</updated>" + text[head.end():]


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--apply", action="store_true", help="modify files (CI only)")
    ap.add_argument("--now", help="pretend it is this ISO time (testing)")
    a = ap.parse_args()
    now = dt.datetime.fromisoformat(a.now) if a.now else dt.datetime.now(dt.timezone.utc)
    removed_pages, removed_blocks = [], 0
    for p in list(files(ROOT)):
        if not p.exists():
            continue
        text = p.read_text(encoding="utf-8")
        m = META.search(text)
        if m and not due(m.group(1), now):
            target = p.parent if p.name == "index.html" else p
            removed_pages.append(f"{target.relative_to(ROOT)} (until {m.group(1)})")
            if a.apply:
                shutil.rmtree(target) if target.is_dir() else target.unlink()
            continue
        if "<!-- embargo:" not in text:
            continue
        new, hidden = process(text, now)
        removed_blocks += len(hidden)
        if p.name == "feed.xml":
            new = fix_feed_updated(new)
        if a.apply and new != text:
            with open(p, "w", encoding="utf-8", newline="") as f:
                f.write(new)
    mode = "removed" if a.apply else "would remove"
    print(f"embargo: {mode} {len(removed_pages)} page(s) and {removed_blocks} block(s) not yet due (now {now.isoformat(timespec='minutes')})")
    for x in removed_pages:
        print(f"  {x}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
