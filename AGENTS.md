# AGENTS.md

Guidance for AI agents working in this repository.

## What this is

A hand-built static blog published to GitHub Pages at **blog.arunmalik.dev**.
No framework and no build step: each post is a self-contained
`posts/<slug>/index.html`, shared behavior lives in `/assets/*.js`, and series
live under `/series/`. Preview locally with:

```
python -m http.server 8899
```

then open `http://localhost:8899/`.

When you add a post, register it in `posts/index.html`, `feed.xml`, and
`sitemap.xml`. Series membership is defined in `series/series-data.js`.

## Keep the index pages in sync (do this every time)

The listing pages are hand-maintained static HTML. They do **not** auto-update
from post files, so they drift unless you update them by hand. After you add,
rename, retitle, re-slug, re-tag, or change the status of any post or series,
re-check these three live pages and their source files, and update whatever is
stale:

- **Home** (`index.html`, live at `https://blog.arunmalik.dev/`): the Featured
  card, the "Recent Writing" grid (add the new post, newest first), and the
  "Active Series" grid (add/refresh the series card and its part count/status).
- **Writing listing** (`posts/index.html`, live at `/posts/`): add or update the
  post card, its date, excerpt, and tags. If the post belongs to a series, give
  it a **`Series`** tag like the other series posts carry.
- **Series** (`series/index.html`, live at `/series/`, plus the specific
  `series/<id>/index.html`): the series card status (Research / In Progress),
  the "N parts" / meta line, and the per-post list (link published posts, mark
  the rest "coming soon"). Update `series/series-data.js` for membership.

Also update the machine-readable indexes: `feed.xml` (new `<entry>`) and
`sitemap.xml` (new `<url>`).

Consistency checks to run each time:

- **Tags** match across the post page, the writing card, and `series-data.js`.
- **Titles, slugs, dates, and excerpts** are identical everywhere they appear.
- **Series status and part counts** agree between `series-data.js`,
  `series/<id>/index.html`, `series/index.html`, and the home page.
- **No dangling links**: every URL you reference resolves.

Verify against the running local server (or the live site) before committing.

## Writing skills (in `skills/`)

Two portable `SKILL.md` skills support the writing workflow. Read the file and
follow it when the trigger applies.

- **`skills/grill-me/SKILL.md`**: a relentless, one-question-at-a-time interview
  that stress-tests a post's thesis, evidence, structure, and originality.
  **User-invoked only**: run it when the user says "grill me", "poke holes in
  this", "stress-test my argument", or is outlining a new post and wants the weak
  spots found before drafting. Do not launch it on your own.
- **`skills/humanize-writing/SKILL.md`**: audits and rewrites a draft to remove
  AI writing patterns so a strict editor won't flag it as machine-generated.
  Run it before publishing any post, or when the user says "de-AI this", "make
  this sound human", "check for em-dashes", or "does this read as AI-written".

A good flow for a new post: **grill-me** (sharpen the argument) → draft →
**humanize-writing** (strip AI tells) → publish.

For the GitHub Copilot runtime, these are also exposed as slash commands via
`.github/prompts/grill-me.prompt.md` and `.github/prompts/humanize-writing.prompt.md`
(they point back to the `SKILL.md` files as the single source of truth), and a
Copilot-native mirror of this guidance lives in `.github/copilot-instructions.md`.

## House writing style

The full ruleset is in `skills/humanize-writing/SKILL.md`. The essentials:

- **No em-dashes.** Target zero (— and --). Use commas, periods, colons,
  parentheses, or two sentences. The editor here treats em-dashes as an
  AI giveaway. This is the most important rule.
- **Preserve the author's (Arun's) voice.** Natural, human, grammatically
  correct English. Keep deliberate fragments and sentences that open with "And"
  or "But". Do not flatten the prose into corporate-neutral tone.
- **Cite real, checkable sources.** Never "studies show" or "experts believe",
  and never invent or launder numbers.
- **Lead with the point.** No generic scene-setting openers or restated
  conclusions. Vary paragraph length. Sentence-case headings, used sparingly.
- **Prefer prose over bullet lists** unless the content is genuinely a list.

## Editing conventions

- Edit existing files in place; do not regenerate whole pages.
- Do not commit or push unless the user asks.
- When creating commits, add the trailer:
  `Co-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>`
