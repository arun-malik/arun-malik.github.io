---
mode: agent
description: Audit and rewrite a draft to remove AI writing tells (em-dashes, AI-isms, generic structure) so it passes a strict editor. Preserves my voice.
---

Run the audit-and-rewrite defined in [`skills/humanize-writing/SKILL.md`](../../skills/humanize-writing/SKILL.md).

Read that file and follow it exactly. Enforce the house rules: em-dashes target
zero, preserve the author's voice, cite real sources, never touch quotes or code.
Default to rewrite mode; use detect mode if I say "flag only" or "scan", and
edit-in-place mode if I name a file to fix.

If I named a file or pasted text below, work on that. Otherwise ask which post or
text to clean.

${input:target}
