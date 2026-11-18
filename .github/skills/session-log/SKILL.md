---
name: session-log
description: Record Copilot session metadata in each edited folder. Use whenever a session finishes editing files and before every authorized commit or push.
---

# Session log

Each edited folder carries a `session.txt` with one row per Copilot session:
first seen, last seen, session ID, and session name. Log changes before finishing
a file-editing session, even when no commit is requested.

```powershell
python tools/session_log.py AGENTS.md posts/example/index.html
```

Before an authorized commit, add `--stage` to stage the updated logs alongside
the changes. Never commit or push unless the user asks.

With no file arguments the script reads staged, unstaged, and untracked paths
from git status. In a dirty worktree, pass only files edited by this session so
unrelated changes are not attributed to it. Paths are relative to the current
working directory, or absolute, and must stay inside this checkout.

The session ID comes from `COPILOT_AGENT_SESSION_ID`; the name comes from the
session's local `workspace.yaml`. Use `--id` and `--name` to override them.
Re-running updates the session's last-seen timestamp without adding another row.

## Folder rules

- Post edits log to `posts/<slug>/session.txt`; series edits log to
  `series/<id>/session.txt`. Other files log beside the edited file.
- Asset-style directories (`assets`, `images`, `figures`, `css`, `js`, and similar
  folders listed in the script) roll up to the folder above the asset tree,
  including nested image directories. They do not get separate logs.
- Shared root assets and root files log to the root `session.txt`.
- Deleted folders log to the nearest surviving parent, without recreating them.
- `.git`, `.worktrees`, `copilot-worktrees`, `.playwright-mcp`, `node_modules`,
  and `archive` are skipped. Changes to `session.txt` itself are not logged.

The script owns the format. Do not hand-edit or delete rows. If a commit omitted
the logs, update them in a follow-up commit before pushing.

This is an instruction-driven workflow, not an installed Git hook. Logs are
tracked public files on this blog: record only the session metadata, never
conversation transcripts, credentials, or private details. Use a public-safe
session name (or `--name`) before recording it.
