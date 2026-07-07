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
