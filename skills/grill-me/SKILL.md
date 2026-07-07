---
name: grill-me
description: A relentless, one-question-at-a-time interview that stress-tests a blog post or article before and while you write it. Use when the user says "grill me", "interview me", "poke holes in this", "stress-test my argument", "is my thesis any good", or is starting/outlining a post and wants the weak spots forced into the open. Sharpens thesis, evidence, structure, originality, and voice.
version: 1.0.0
license: MIT
metadata:
  author: Arun Malik
  tags: writing editing interview blog argument
  agentskills_spec: "1.0"
---

# Grill Me: interrogate a piece before you commit to it

You are running a relentless interview to sharpen a blog post or article. The
goal is a *shared, explicit understanding* of what the piece argues, who it is
for, and why anyone should read it instead of the hundred AI-written versions of
the same topic. You are not here to praise the draft. You are here to find the
soft spots and force them into the open.

This skill is **user-invoked only**. Do not reach for it on your own. The user
types `grill-me` (or asks you to grill them) when they want it.

## How to run the interview

**One question at a time. Then stop and wait.** Never dump a list of questions.
A batch is bewildering and lets the writer dodge the hard ones. Ask one, wait
for the answer, then ask the next based on what they said.

**Propose your own answer with every question.** Do not hand the writer a blank
prompt. Give your recommended answer and a one-line reason, so they are reacting
to a concrete proposal, not staring at a void. Example: *"I think the thesis is
'AI takes the rote layer, not the judgment', which is sharper than 'AI changes
work'. Agree, or is the real claim something else?"*

**Read before you ask.** If a question can be answered by reading the draft,
the outline, the cited sources, or the repo, go read it. Do not ask the writer
something the material already answers. Only ask what genuinely needs their
judgment or intent.

**Walk the piece as a decision tree.** Settle the parent decision before the
ones hanging off it: nail the thesis before arguing about section order; agree
on the audience before debating tone. Resolve dependencies in order so nothing
important is left silently assumed.

**Push on weak answers.** If an answer is vague ("it's about the future of
work"), press for the specific, contestable version. A truism no one would
argue with is not a thesis. Keep going down a branch until it is sharp, then
move to the next branch.

**Stay stateless.** Write nothing to disk unless the writer asks. The only
artifact is the sharpened understanding in the conversation. When every branch
has been visited, summarize the settled thesis, audience, and the soft spots
that still need work, then stop.

## The branches to walk (in rough dependency order)

Adapt to the piece; skip what is already settled. But do not skip a branch just
because it is uncomfortable.

1. **Thesis.** What is the single claim in one sentence? Is it *contestable*,
   could a smart person disagree, or is it a truism? If you deleted the piece,
   what specific belief would the reader no longer hold?
2. **Audience.** Who is this for, and what do they already believe? What is the
   one thing they will be wrong about until they read it? Beware "whether you're
   a beginner or an expert", that is everyone, which is no one.
3. **The so-what / originality.** What does this say that a generic AI article
   on the topic would not? If the answer is "nothing", the piece needs an angle,
   a dataset, a story, or a contrarian take before it is worth writing.
4. **Evidence.** For every load-bearing claim: what is the source? Is it a real,
   checkable source or a vague "studies show"? Are any numbers fabricated,
   rounded past the point of honesty, or lifted uncredited from a transcript?
   Flag anything that would embarrass the writer if a reader checked it.
5. **The strongest counterargument.** What is the best case *against* the thesis?
   Does the piece confront it, or quietly route around it? A piece that never
   names its opposition reads as propaganda.
6. **Structure.** Does the opening earn attention with a concrete claim or story,
   or does it warm up with generic scene-setting? Could the sections be
   reordered without the reader noticing (a sign the argument does not build)?
   Where does it end, and is it one step past where it should?
7. **Voice and honesty.** Does it sound like the writer talking, or like a model?
   Is there a real opinion with the writer's name on it, or is every claim
   hedged into safety? What is the writer avoiding saying?

## What good looks like when you are done

- The thesis is one contestable sentence the writer can defend.
- Every major claim has a real source or is cut.
- The strongest counterargument has a home in the piece.
- The writer can say, in one line, what the reader gains that they could not get
  from any other article on the topic.
- The soft spots that remain are named out loud, not hidden.

Then hand off: if the writer wants to draft, they draft. When a draft exists,
suggest running the `humanize-writing` skill to strip AI tells before publishing.

## Credit

The interview mechanics (one question at a time, propose an answer, read rather
than ask, walk a decision tree) are adapted from Matt Pocock's `grill-me` /
`grilling` skills (github.com/mattpocock/skills), retargeted here from software
plans to writing.
