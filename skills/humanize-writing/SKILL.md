---
name: humanize-writing
description: Audit and rewrite a blog post or article to remove AI writing patterns ("AI-isms") so a strict editor won't flag it as machine-generated. Use when the user says "remove AI-isms", "make this sound human", "de-AI this", "does this read as AI-written", "clean up the writing", "check for em-dashes", or is about to publish a post. Supports detect / rewrite / edit-in-place modes. Preserves the author's voice and never touches quotes or code.
version: 1.0.0
license: MIT
metadata:
  author: Arun Malik
  tags: writing editing voice quality de-ai
  agentskills_spec: "1.0"
---

# Humanize Writing: audit and rewrite to remove AI tells

You are editing a blog post or article to remove the patterns that make prose
read as machine-generated, so it passes a strict human editor who demotes
AI-written work. Two failure modes matter equally: obvious word-level tells
(em-dashes, "delve", "robust") and the deeper structural tells (tidy five-part
essay arc, uniform paragraphs, generic intro and conclusion). Fix both. Cleaning
the vocabulary while leaving the skeleton intact still reads as AI.

## House rules for this blog (non-negotiable)

- **Em-dashes: target zero. Hard max one per 1,000 words.** Catch the Unicode em
  dash (—) and the double-hyphen (--). Replace with a comma, period, colon,
  parentheses, or split into two sentences. This applies to headings too. This
  is the single most important rule; the editor here treats em-dashes as a
  giveaway.
- **Preserve the author's voice.** Do not sand the piece into corporate-neutral
  prose. Fragments, sentences opening with "And" or "But", and the occasional
  aside are the author's style, keep them.
- **Cite real, checkable sources.** Never "studies show" or "experts believe".
  If a claim needs support, name the source or cut the claim. Never invent a
  number; flag any figure that looks fabricated or lifted uncredited.
- **Never rewrite quotes, code blocks, or text attributed to someone else.**
  Flag issues inside them instead.
- **Grammatically correct, natural English.** Human, not stiff.

## Modes

**`rewrite`** (default): flag every AI-ism with the quoted text, return a clean
version, then run one corrective second pass over your own rewrite to catch tells
that survived (recycled transitions, lingering inflation, copula swaps). Report
a short diff summary of what changed and why.

**`detect`**: flag only, no rewriting. Say which flags are real problems versus
judgment calls that may be intentional. Use for published content, someone
else's writing, or a quick scan.

**`edit`**: edit the named file in place with minimal, targeted edits to the
flagged spans. Leave already-human paragraphs untouched. Re-read the file
afterward and confirm the flagged patterns are resolved. Use when the user points
at a file ("clean up posts/foo/index.html").

Default to `rewrite` unless the user says "detect", "flag only", "scan", or names
a file to fix in place.

## Structural tells (fix these first, they matter most)

Do a structure pass before a word pass. Summarize each paragraph in one line and
read the summaries as an outline. If it reads "definition → list → recap → vague
future", it is the default AI shape and needs reshaping.

- **The five-part essay arc.** Generic intro that announces the topic, three
  symmetrical body sections that mirror it, a conclusion that restates the
  headings. Break the symmetry: merge or cut sections, demote weak headings into
  prose, end one step earlier.
- **Uniform paragraph length.** Vary it on purpose. Include a one-sentence
  paragraph and a longer one. If every paragraph is the same size, fix it.
- **Generic scene-setting openers.** "In today's fast-paced world", "In the
  rapidly evolving landscape of", "As we navigate the complexities of". Cut them.
  Open with a concrete claim, a number, or a story.
- **Generic conclusions.** "In conclusion", "As AI continues to evolve", "only
  time will tell", "the future looks bright". Cut. End where the argument ends,
  with one specific closing thought.
- **Meta / signposting.** "In this section we will", "Now that we've explored",
  "As mentioned earlier", "Let's dive in". Delete. Explain the topic, don't
  narrate the article.
- **Heading sprawl.** A subheading every two paragraphs, all the same shape
  ("Understanding X", "The importance of Y"). Use headings sparingly and in
  sentence case, not title case.
- **Bullet overuse.** Convert bullet-heavy sections to prose. Keep bullets only
  for genuinely list-like content (steps, parameters, comparisons).
- **Analogy padding.** At most one analogy in a piece unless the author asks for
  more, and only when it genuinely clarifies.

## Word- and sentence-level tells

**Match inflected forms** (delve/delving, meticulous/meticulously, leverage/
leveraging). Three tiers:

- **Tier 1, replace on sight:** delve / delve into, landscape (metaphor), realm,
  tapestry, paradigm, embark, testament to, robust, comprehensive, cutting-edge,
  leverage (verb) → use, pivotal, underscores, meticulous, seamless,
  game-changer, utilize → use, watershed moment, nestled, vibrant, thriving,
  showcasing, deep dive / dive into, unpack, ever-evolving, daunting, holistic,
  actionable, impactful, learnings, best practices, at its core, synergy,
  in order to → to, due to the fact that → because, serves as → is, boasts → has,
  commence → start, "the future looks bright", "only time will tell".
- **Tier 2, flag when 2+ cluster in a paragraph:** harness, navigate, foster,
  elevate, unleash, streamline, empower, bolster, spearhead, resonate,
  revolutionize, facilitate, nuanced, crucial, multifaceted, ecosystem (metaphor),
  myriad, plethora, encompass, catalyze, reimagine, cultivate, illuminate,
  transformative, cornerstone, paramount, poised to, burgeoning, nascent,
  overarching.
- **Tier 3, flag only at high density:** significant, innovative, effective,
  dynamic, scalable, compelling, unprecedented, exceptional, remarkable,
  sophisticated, world-class / state-of-the-art. Replace some with specifics
  (numbers, comparisons, examples).

Sentence-level:

- **"It's not X, it's Y" / "This isn't about X, it's about Y".** Rewrite as a
  direct positive statement. Max one per piece. Catch the split-sentence form too
  ("The headline isn't the speed. The real story is Y").
- **Hollow intensifiers:** genuine(ly), truly, "real" improvement, "to be honest",
  "let's be clear", "it's worth noting that". Cut; state the fact.
- **Hedging and hedge stacks:** perhaps, could potentially, may eventually, might
  ultimately. Pick one word or cut.
- **Rule of three.** Vary it. Max one "adjective, adjective, and adjective" per
  piece.
- **Copula avoidance:** "serves as", "features", "boasts", "presents",
  "represents" → default to "is" / "has" unless a specific verb adds meaning.
- **Vague attribution:** "experts believe", "studies show", "research suggests".
  Name the source or cut.
- **Transition filler:** "Moreover", "Furthermore", "Additionally", "That said",
  "When it comes to", "At the end of the day". Restructure or use "and" / "also"
  / "but".
- **Reader-steering frames:** "Here's what's interesting", "Here's the twist",
  "Here's what caught my eye". Let the content signal its own importance.
- **Significance inflation:** "marking a pivotal moment in the evolution of",
  "a watershed moment for the industry". State what happened; let the reader judge.

## Fingerprints (near-proof of paste-from-chat; strip mechanically)

- Chatbot tics: "Certainly!", "Absolutely!", "Great question!", "I hope this
  helps!", "Feel free to reach out", "Let me know if you need anything else".
- Citation markup leaks: `citeturn0search0`, `contentReference[oaicite:0]`,
  `oai_citation`, `[attached_file:1]`.
- AI-tool URL params: `utm_source=chatgpt.com`, `utm_source=copilot.com`,
  `utm_source=claude.ai`, `utm_source=perplexity.ai`.
- Unfilled placeholders: `[Your Name]`, `[INSERT SOURCE]`, `2025-XX-XX`,
  `<!-- add citation -->`. Fill or delete.
- Cutoff disclaimers: "as of my last update", "I don't have access to real-time
  data". Remove; look the fact up instead.

## Output format

**rewrite mode:**
1. **Audit**: list each AI-ism found with the quoted text and why it flags.
2. **Rewrite**: the clean version.
3. **Second pass**: what the corrective pass caught in your own rewrite.
4. **Diff summary**: a few lines on what changed. Report em-dash count (should
   be 0).

**detect mode:** audit + an assessment of which flags are real vs. judgment calls.
No rewrite.

**edit mode:** an edits-made list + a verification note that you re-read the file
and the patterns are resolved. Do not paste the whole file back.

## A caution

These are signals, not proof. Second-language writers, deadline-pressed humans,
and technical genres produce the same shapes, and AI detectors have high
false-positive rates. Use the patterns to improve writing, not to accuse anyone.
In small doses some of these patterns are fine; the problem is density and the
default skeleton.

## Credit

The pattern catalog and tiered word lists are adapted, with condensation, from
Conor Bronsdon's `avoid-ai-writing` skill (github.com/conorbronsdon/avoid-ai-writing,
MIT). The structure-first approach is drawn from Louis Bouchard / Towards AI,
"How to Edit AI Writing" (louisbouchard.ai/ai-editing).
