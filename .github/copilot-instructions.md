# Copilot instructions

Repo-wide instructions for GitHub Copilot. This file is auto-loaded by Copilot
across the CLI, VS Code Chat, and the coding agent. The full guidance lives in
[`/AGENTS.md`](../AGENTS.md); this is the Copilot-native entry point.

## About this repo

A hand-built static blog published to GitHub Pages at **blog.arunmalik.dev**.
No framework, no build step. Each post is a self-contained
`posts/<slug>/index.html`; shared behavior is in `/assets/*.js`; series live
under `/series/`. Preview locally with `python -m http.server 8899`.

## House writing style (most important)

- **No em-dashes.** Target zero (— and --). Use commas, periods, colons,
  parentheses, or two sentences. A strict editor treats em-dashes as an AI
  giveaway. This is the top rule.
- **Preserve the author's (Arun's) voice.** Natural, human, grammatically
  correct English. Keep deliberate fragments and sentences that open with "And"
  or "But". Do not flatten to corporate-neutral tone.
- **Cite real, checkable sources.** Never "studies show" or "experts believe",
  and never invent or launder numbers.
- **Lead with the point.** No generic scene-setting openers or restated
  conclusions. Vary paragraph length. Sentence-case headings, used sparingly.
- Prefer prose over bullet lists unless the content is genuinely a list.

## Skills (invoke on demand)

Two skills back the writing workflow. Read the file and follow it when relevant.
They are also available as the `/grill-me` and `/humanize-writing` prompt files
in `.github/prompts/`.

- `skills/grill-me/SKILL.md`: a relentless, one-question-at-a-time interview
  that stress-tests a post's thesis, evidence, structure, and originality.
  User-invoked only (when the user says "grill me", "poke holes in this", etc.).
- `skills/humanize-writing/SKILL.md`: audits and rewrites a draft to remove AI
  writing patterns before publishing.

Flow for a new post: grill-me (sharpen) → draft → humanize-writing (de-AI) →
publish.

## Keep the index pages in sync (every content change)

The listing pages are hand-maintained and do not auto-update. After you add,
rename, retitle, re-slug, re-tag, or change the status of any post or series,
update all of these and check they agree:

- Home `index.html` (Featured, Recent Writing, Active Series).
- `posts/index.html` (card, date, excerpt, tags; add a `Series` tag for series
  posts).
- `series/index.html` and the specific `series/<id>/index.html`, plus
  `series/series-data.js` (membership, status, part counts).
- `feed.xml` and `sitemap.xml`.

Verify tags, titles, slugs, dates, and series status match everywhere, and that
no referenced URL is dead. See `/AGENTS.md` for the full checklist.

## Conventions

- Edit existing files in place; do not regenerate whole pages.
- Do not commit or push unless the user asks.
- On commit, add: `Co-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>`
