---
title: 'Communicating so people actually understand you'
description: 'Treat miscommunication like a pipeline bug: find the stage that failed, then apply the fix that actually belongs there.'
pubDate: 'Jul 30 2026'
tags: [soft-skills, communication]
---

## Miscommunication is usually a pipeline bug, not a personality clash

When a thread goes sideways — the reviewer sounds annoyed, the other team says they never got the request, the PM thinks the feature shipped — the reflex diagnosis is "we just don't click". That's almost always wrong, and worse, it's unactionable. You can't fix a personality in a sprint.

What you can do is treat the exchange as a pipeline and find the stage that failed. Someone decides *why* they're speaking, turns intent into words (encode), pushes it down a channel, the other person parses it (decode) and interprets it against everything they already believe, then sends something back. Every stage can silently corrupt the payload, and the error usually surfaces far from where it was introduced.

<figure>
<svg viewBox="0 0 780 250" role="img" aria-label="A pipeline diagram: sender, encode, channel, decode, receiver connected left to right by arrows, with noise entering at the channel and a feedback arrow returning from receiver to sender." xmlns="http://www.w3.org/2000/svg">
  <defs>
    <marker id="ce-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
      <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--accent)" />
    </marker>
  </defs>
  <g fill="var(--surface-2)" stroke="var(--border-strong)" stroke-width="1.5">
    <rect x="8" y="70" width="118" height="52" rx="8" />
    <rect x="166" y="70" width="118" height="52" rx="8" />
    <rect x="324" y="70" width="118" height="52" rx="8" />
    <rect x="482" y="70" width="118" height="52" rx="8" />
    <rect x="640" y="70" width="118" height="52" rx="8" />
  </g>
  <g fill="var(--heading)" font-size="15" font-family="inherit" text-anchor="middle">
    <text x="67" y="101">Sender</text>
    <text x="225" y="101">Encode</text>
    <text x="383" y="101">Channel</text>
    <text x="541" y="101">Decode</text>
    <text x="699" y="101">Receiver</text>
  </g>
  <g stroke="var(--accent)" stroke-width="2" marker-end="url(#ce-arrow)" fill="none">
    <line x1="128" y1="96" x2="162" y2="96" />
    <line x1="286" y1="96" x2="320" y2="96" />
    <line x1="444" y1="96" x2="478" y2="96" />
    <line x1="602" y1="96" x2="636" y2="96" />
    <path d="M 699 130 L 699 190 L 67 190 L 67 130" />
    <line x1="383" y1="34" x2="383" y2="64" />
  </g>
  <g fill="var(--text-muted)" font-size="13" font-family="inherit" text-anchor="middle">
    <text x="383" y="26">noise: wrong tool, bad timing, 40 unread messages</text>
    <text x="383" y="210">feedback — the only stage that tells you the rest worked</text>
  </g>
  <g fill="var(--text)" font-size="12" font-family="inherit" text-anchor="middle">
    <text x="225" y="142">intent → words</text>
    <text x="541" y="142">words → meaning</text>
  </g>
</svg>
<figcaption>The stages a message passes through. Bisect them the way you bisect a build.</figcaption>
</figure>

The value of the model is diagnostic. Before you rewrite the message louder, ask which stage broke.

| Symptom on the team | Stage that failed | Fix that actually works |
| --- | --- | --- |
| "Why are we even doing this?" after a long design doc | Sender — no stated purpose | One sentence at the top: what decision this doc is asking for |
| Reviewer misreads your PR intent | Encoding — no context, only diff | PR body: problem, approach, what you deliberately skipped |
| Nobody saw the deploy freeze notice | Channel — buried in a chat thread | Same message on the channel people are paged from |
| Two teams build the same field with different meanings | Decoding — shared word, different model | Write the term down with an example value; see [Ubiquitous Language](https://martinfowler.com/bliki/UbiquitousLanguage.html) |
| "You never told me" though you did | Receiver — noise, overload, prior belief | Ask for a read-back, not an acknowledgement emoji |
| Silence after a request | Feedback — none requested | Ask a closed question with a date attached |

## Active listening: hearing is free, listening costs attention

Hearing is passive. Listening is work, and the reason is mechanical: you think several times faster than anyone speaks, and that spare capacity gets spent drafting your rebuttal instead of parsing their sentence.

In a design review it looks like this. Someone says "the batch job takes eleven minutes", and three seconds in you've decided they want more CPU, so you spend the rest of their explanation preparing the "we can't just scale it" answer — and miss that the eleven minutes only happens after a schema migration. You solved a problem nobody had.

The cheap countermeasure is to spend your first sentence restating theirs: *"So the eleven minutes is post-migration only, not steady state?"* If your restatement is wrong, you just found the bug for free.

The usual barriers are worth naming so you can catch yourself in them: defensiveness (you heard criticism of you, not of the code), the halo effect (a staff engineer said it, so it's fine), and hearing what you expected instead of what was said.

## Clarity and conciseness are different things and both are edits

Clarity is being hard to misread. Conciseness is being short. You can be short and unclear ("doesn't work on prod"), or clear and unbearable — a 900-word message with the ask in paragraph six.

Clarity comes from specificity. Compare a bug report:

```bash
# vague: "the detections endpoint is broken on staging"

# clear: exact call, expected, actual
curl -sS -X POST https://staging.internal/v1/detections \
  -H 'content-type: application/json' \
  -d '{"frame_id": 41203, "sensor": "cam_front"}' | jq .
# expected: 200 with a non-empty "boxes" array
# actual:   422 {"error": "sensor 'cam_front' not registered", "code": 422}
# started:  2026-07-28 after release 4.11.0; 4.10.3 returns 200
```

That block costs you two minutes and saves the on-call engineer twenty. It also kills the round trip where they ask "which environment?" and you're at lunch.

Conciseness comes from deletion after the fact. Write the message, then cut the throat-clearing ("Hi team, hope you're all doing well, I wanted to reach out regarding…"), cut the passive voice ("it was observed that the job was failing" → "the job failed"), and move the ask to line one.

The test for any written request: if the reader can't tell **what they must do** and **by when** from the first two lines, it isn't finished.

## Empathy is a modelling skill, not a soft one

Empathy in engineering rarely means comforting anyone. It means correctly modelling the person's state before you send: what do they already know, what are they under pressure from, what will this message cost them?

Concretely, the difference between two review comments on the same line:

```markdown
<!-- lands as an attack on the author -->
Why would you ever parse timestamps by hand here?

<!-- same objection, aimed at the code and carrying the reason -->
This hand-rolled parse will break on the `+07:00` offsets we get from the
Hanoi fleet — `datetime.fromisoformat` handles those. Non-blocking if you
have a reason to avoid stdlib here.
```

The second one isn't nicer for its own sake. It's more useful: it names the failure case, gives the fix, and states its own severity so the author knows whether they're allowed to disagree. Aim at the artefact, not the person. The [Agile Manifesto](https://agilemanifesto.org) put individuals and interactions above processes for this reason, and it's still the part teams skip while adopting the ceremonies.

## Open-mindedness: the cost of being right too early

The common failure is confirmation bias with a profiler attached: you already believe the queue is the bottleneck, so every trace you read confirms it. Ego and overconfidence are the classic barriers, but the practical one is *exposure* — review only your own sub-team's code and you'll mistake local conventions for universal ones.

Two habits that cost nothing: ask "what would have to be true for your approach to win?" before arguing, and write down the assumption your design rests on. When it's challenged later you can check the note instead of defending your memory.

## Purpose, timeliness, feedback

**Purpose.** Every message should have a goal you could state out loud: I want a decision, I want a review, I want to inform, I want to be unblocked. If you can't state it, the reader can't either. Put it in the subject line: `[decision needed by Fri] Kafka vs. Postgres queue for the ingest path`.

**Timeliness.** Information decays. A perfect status update after the release is worthless; a rough one before it is gold. That's the entire point of the daily scrum in the [Scrum Guide](https://scrumguides.org) — not status theatre for a manager, but early exposure of what will hurt later. If you know on Tuesday you'll miss Friday, say it on Tuesday. Bad news never improves with age, and delivering it late converts a scheduling problem into a trust problem.

Match urgency to channel. A five-minute call beats a fourteen-message thread; a written doc beats a call for anything three people must recall next month. Async by default, synchronous when the thread has looped twice.

**Feedback.** Feedback is the only stage that closes the loop. Ask for it in a form that can fail: "does this design cover the offline case?" gets you a real answer, "any thoughts?" gets you silence. When receiving it, the first job is to understand, not to respond — ask for the concrete example before you explain yourself. And skip the compliment sandwich; experienced people hear the bread as noise and only remember the filling anyway.

## What to change on Monday

- Rewrite the first line of your next long message so it states the ask and the deadline. Delete your greeting paragraph.
- In your next PR description, add a "what I deliberately did not do" section. It prevents half the review comments you'd otherwise get.
- In your next meeting, restate one person's point in your own words before responding to it. Once. See if they correct you.
- Replace one "any thoughts?" with a closed question naming the risk you actually worry about.
- If you're behind on something due this week, say so today — in the channel where the people affected already are, not in a DM to your lead.
- Write down the one word your team uses with two different meanings. Define it in the repo README with an example value.
