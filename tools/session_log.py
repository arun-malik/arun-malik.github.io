"""Record Copilot session metadata beside edited files, rolling up asset folders."""

import argparse
import datetime as dt
import os
from pathlib import Path, PurePosixPath
import subprocess


ROOT = Path(__file__).resolve().parents[1]
LOG = "session.txt"
HEADER = (
    "# Copilot sessions that edited files in this folder (managed by tools/session_log.py)\n"
    "# first_seen       | last_seen        | updates | session_id                           | session_name\n"
)
ASSET_DIRS = {
    "figures", "figs", "assets", "images", "img", "imgs", "media", "photos",
    "screenshots", "fonts", "css", "js", "static", "out", "output", "build",
    "dist", "preview", "previews", "__pycache__",
}
SKIP_TOP = {
    ".git", ".worktrees", "copilot-worktrees", ".playwright-mcp",
    "node_modules", "archive",
}


def git(*args):
    return subprocess.run(
        ["git", *args], cwd=ROOT, capture_output=True, check=True,
    ).stdout


def changed_files():
    entries = iter(git("status", "--porcelain=v1", "-z", "-uall").split(b"\0"))
    files = []
    for entry in entries:
        if not entry:
            continue
        files.append(os.fsdecode(entry[3:]))
        if b"R" in entry[:2] or b"C" in entry[:2]:
            next(entries)  # In NUL mode, the destination precedes the source.
    return files


def session_name(sid):
    workspace = Path.home() / ".copilot" / "session-state" / sid / "workspace.yaml"
    if workspace.exists():
        for line in workspace.read_text(encoding="utf-8").splitlines():
            if line.startswith("name:"):
                return line.split(":", 1)[1].strip()
    return "(unnamed)"


def project_folder(rel):
    parts = PurePosixPath(rel.replace("\\", "/")).parts
    if not parts or parts[0].lower() in SKIP_TOP or parts[-1].lower() == LOG:
        return None
    folder_parts = []
    for part in parts[:-1]:
        if part.lower() in ASSET_DIRS:
            break
        folder_parts.append(part)
    folder = ROOT.joinpath(*folder_parts).resolve()
    if not folder.is_relative_to(ROOT):
        raise ValueError(f"Path is outside this checkout: {rel}")
    while not folder.is_dir():
        folder = folder.parent
    return folder


def read_rows(path):
    """Accept legacy four-column logs with an initial update count of one."""
    rows = []
    if not path.exists():
        return rows
    for number, line in enumerate(path.read_text(encoding="utf-8").splitlines(), 1):
        if not line.strip() or line.startswith("#"):
            continue
        columns = [column.strip() for column in line.split("|")]
        if len(columns) == 4:
            columns.insert(2, "1")
        if len(columns) != 5 or not columns[2].isdecimal() or int(columns[2]) < 1:
            raise ValueError(f"Invalid session log row at {path}:{number}")
        first, last, updates, sid, name = columns
        rows.append([first, last, int(updates), sid, name])
    return rows


def record(folder, sid, name, now):
    path = folder / LOG
    if path.is_symlink():
        raise ValueError(f"Refusing to write a symlink: {path}")
    rows = read_rows(path)
    for row in rows:
        if row[3] == sid:
            row[1] = now
            row[2] += 1
            break
    else:
        rows.append([now, now, 1, sid, name])
    path.write_text(
        HEADER + "".join(
            f"{first:<16} | {last:<16} | {updates:>7} | {row_sid:<36} | {row_name}\n"
            for first, last, updates, row_sid, row_name in rows
        ),
        encoding="utf-8",
    )
    return path


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("paths", nargs="*", help="edited files (default: git status)")
    parser.add_argument("--id", default=os.environ.get("COPILOT_AGENT_SESSION_ID"))
    parser.add_argument("--name")
    parser.add_argument("--stage", action="store_true", help="stage the updated session.txt files")
    args = parser.parse_args()
    if not args.id:
        parser.error("Set COPILOT_AGENT_SESSION_ID or pass --id")
    if any(char in args.id for char in "\\/|\r\n") or args.id in {".", ".."}:
        parser.error("Session ID must not contain path separators, pipes, or newlines")
    name = args.name or session_name(args.id)
    if any(char in name for char in "|\r\n"):
        parser.error("Session name must not contain pipes or newlines")
    paths = []
    for raw in args.paths or changed_files():
        path = Path(raw).resolve() if args.paths else (ROOT / raw).resolve()
        if not path.is_relative_to(ROOT):
            parser.error(f"Path is outside this checkout: {raw}")
        paths.append(path.relative_to(ROOT).as_posix())
    folders = sorted({folder for rel in paths if (folder := project_folder(rel)) is not None})
    now = dt.datetime.now().strftime("%Y-%m-%d %H:%M")
    written = [record(folder, args.id, name, now) for folder in folders]
    for path in written:
        print(path.relative_to(ROOT))
    if args.stage and written:
        git("add", "--", *[str(path.relative_to(ROOT)) for path in written])


if __name__ == "__main__":
    main()
