---
title: 'Eight standards for checking your own reasoning'
description: 'A review checklist for design docs, bug diagnoses and estimates, plus the five biases that quietly get past it.'
pubDate: 'Aug 4 2026'
tags: [soft-skills, thinking]
---

## Reasoning is reviewable, same as code

We have decent habits for reviewing artifacts. Nobody merges without a diff review, a CI run, a look at the test names. We have almost no habits for reviewing the reasoning that produced the artifact — the argument in the design doc, the causal story in the bug ticket, the mental arithmetic behind "about three weeks".

That reasoning fails in patterns. The patterns are boring, repeatable, and therefore checkable. That is the whole case for treating critical thinking as an engineering skill rather than a personality trait: it gives you a checklist you can run at the bottom of a document, in the twenty minutes before you send it.

The checklist below is the set of intellectual standards from the Paul–Elder framework, developed by Richard Paul and Linda Elder at the Foundation for Critical Thinking ([criticalthinking.org](https://www.criticalthinking.org)). I've kept their standards and their probing questions, and swapped the examples for ones from my own working week — ECUs, latency budgets, model regressions, supplier timelines.

## The eight standards, as review questions

Each standard is one question you ask about a claim. Not about the person making it.

| Standard | Probing question | What it catches |
| --- | --- | --- |
| Clarity | Can you say that another way, or give me one example? | "We need better observability" — nobody can act on it, and nobody can disagree with it either |
| Accuracy | Is that actually true, and how would we check? | "The bus is saturated" in a postmortem, when nobody has looked at a load trace |
| Precision | Can you give the number, the unit, the condition? | "Startup got slower" instead of "cold-start p99 went 340 ms → 910 ms after the OTA" |
| Relevance | How does that bear on the question we're deciding? | Benchmarking on a workstation GPU when the target is a 20 W automotive SoC |
| Depth | Does this address the complications, or route around them? | "Just add a retry" for a failure whose cause is a duplicated command at the actuator |
| Breadth | Whose view is missing from this? | A rollout plan that never asks the field-service team how they flash a car with no network |
| Logic | Does the conclusion follow from what you just said? | "Errors dropped after the deploy, so the deploy fixed it" — traffic also dropped, it was a holiday |
| Fairness | Would this hold up if the person I'm arguing against wrote it? | Weighing a vendor's outage as fatal and your own team's identical outage as an unlucky week |

Clarity comes first for a mechanical reason: you cannot evaluate a claim you can't restate. If a sentence in a design doc can't be paraphrased, the rest of the checklist has nothing to bite on.

## The failure chain: each standard only holds if the previous one did

The standards are cumulative, and that is the useful part. Satisfying one buys you nothing about the next, so a claim can pass an early gate and leak out at the following one.

<figure>
<svg viewBox="0 0 790 250" role="img" aria-label="A chain of six gates labelled clear, accurate, precise, relevant, deep and broad, each with a downward arrow to the way reasoning leaks out at that stage, above a band noting that logic and fairness apply to the whole chain." xmlns="http://www.w3.org/2000/svg">
  <defs>
    <marker id="ct-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
      <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--accent)" />
    </marker>
  </defs>
  <g fill="var(--surface-2)" stroke="var(--border-strong)" stroke-width="1.5">
    <rect x="15" y="14" width="110" height="46" rx="8" />
    <rect x="145" y="14" width="110" height="46" rx="8" />
    <rect x="275" y="14" width="110" height="46" rx="8" />
    <rect x="405" y="14" width="110" height="46" rx="8" />
    <rect x="535" y="14" width="110" height="46" rx="8" />
    <rect x="665" y="14" width="110" height="46" rx="8" />
  </g>
  <g fill="var(--heading)" font-size="15" font-family="inherit" text-anchor="middle">
    <text x="70" y="43">Clear</text>
    <text x="200" y="43">Accurate</text>
    <text x="330" y="43">Precise</text>
    <text x="460" y="43">Relevant</text>
    <text x="590" y="43">Deep</text>
    <text x="720" y="43">Broad</text>
  </g>
  <g stroke="var(--accent)" stroke-width="2" marker-end="url(#ct-arrow)" fill="none">
    <line x1="127" y1="37" x2="141" y2="37" />
    <line x1="257" y1="37" x2="271" y2="37" />
    <line x1="387" y1="37" x2="401" y2="37" />
    <line x1="517" y1="37" x2="531" y2="37" />
    <line x1="647" y1="37" x2="661" y2="37" />
    <line x1="70" y1="62" x2="70" y2="84" />
    <line x1="200" y1="62" x2="200" y2="84" />
    <line x1="330" y1="62" x2="330" y2="84" />
    <line x1="460" y1="62" x2="460" y2="84" />
    <line x1="590" y1="62" x2="590" y2="84" />
  </g>
  <g fill="var(--text-muted)" font-size="12" font-family="inherit" text-anchor="middle">
    <text x="70" y="103">clear but<tspan x="70" dy="15">not true</tspan></text>
    <text x="200" y="103">true but<tspan x="200" dy="15">vague</tspan></text>
    <text x="330" y="103">exact but<tspan x="330" dy="15">off-topic</tspan></text>
    <text x="460" y="103">on-topic but<tspan x="460" dy="15">shallow</tspan></text>
    <text x="590" y="103">deep but<tspan x="590" dy="15">one-sided</tspan></text>
  </g>
  <g>
    <rect x="15" y="160" width="760" height="76" rx="8" fill="var(--surface-2)" stroke="var(--border)" stroke-width="1.5" />
    <text x="395" y="190" fill="var(--heading)" font-size="14" font-family="inherit" text-anchor="middle">Logic and fairness are not the last two links</text>
    <text x="395" y="215" fill="var(--text)" font-size="13" font-family="inherit" text-anchor="middle">they are run over the whole chain: do the steps hold together, and would the other side accept them?</text>
  </g>
</svg>
<figcaption>Each gate can pass while the next one fails. Find the first leak, not the loudest one.</figcaption>
</figure>

Walk it with one real ticket. "Charging sessions sometimes fail" is clear and, as far as anyone knows, true — but imprecise, so nobody can tell whether "sometimes" means one car or a fleet. Tighten it: "0.4 % of DC sessions abort within 5 s of handshake, only above 40 °C ambient." Precise, and now accurate too. Still possibly irrelevant: if the release you're deciding on doesn't touch the charging stack, this number is not an argument for slipping the date, however alarming it looks on a chart.

Suppose it is relevant. The shallow version stops at "thermal issue, add a derating step." The deep version asks which of the several things that co-vary with ambient temperature is doing the work — contactor resistance, a timeout that was tuned at 20 °C, or a fan that only runs when the HVAC is on. And the narrow version does all of that inside the vehicle team, never asking the charge-point vendor whether their stations behave differently in the heat. Deep and wrong is a specific, expensive failure, and it's the one senior engineers produce most.

## Five ways the checklist gets bypassed

A checklist only helps if you actually run it against your own conclusion. Five well-documented barriers stop you doing that, and each one shows up in a recognisable meeting.

**Egocentrism — self-serving reasoning.** In a postmortem, the root cause tends to migrate towards whichever component is owned by whoever isn't in the room. Your service's 8-second timeout is "a reasonable default"; their retry storm is "clearly the trigger". Both statements can be clear, accurate and precise, and the conclusion still be shaped by who has to do the work afterwards. The tell: your proposed action items all live in someone else's repo.

**Sociocentrism — group thinking.** Architecture decisions are where this lands. "We do everything on the internal broker" is a real constraint on Tuesday and an unexamined belief by the following quarter. Nobody lies; the alternative simply never gets a fair evaluation, because arguing for it costs social capital and arguing for the house choice costs nothing. Watch for decisions where the doc's "alternatives considered" section is a paragraph long and the chosen option is four pages.

**Unwarranted assumptions and stereotyping.** Estimates run on these. "It's just a config change" assumes the config isn't parsed by three services with different defaults. "That supplier is always late" is a stereotype doing the work of a schedule: maybe they were late twice, on the two occasions our own spec changed mid-flight. An estimate is a claim about the world, so it takes the same accuracy question as any other: how would we check this?

**Wishful thinking — believing it because you want it.** Vendor evaluations are the natural habitat. Once you've spent six weeks on a proof of concept, the demo's 12 ms detection latency becomes "12 ms" in the summary slide, even though it was measured on one recorded log, single stream, no other load on the box. The wish isn't for the vendor to succeed; it's for the six weeks not to have been wasted. Sunk cost arrives disguised as optimism.

**Relativistic thinking — "that's just, like, your opinion".** Code review is where this dissolves an argument. Some review comments genuinely are preference: brace style, whether a helper deserves a name. Others are not: an unbounded queue, a `catch` that swallows, a unit mismatch between a signal in km/h and a threshold in m/s. Treating the second kind as taste is how a real defect gets closed as "subjective". The fix is to make the difference explicit — say which comments are blocking and why, and let the rest be preference out loud.

## Creative and critical thinking are two passes, not two camps

The usual framing puts these in opposition: the creative people generate, the critical people shoot down. That framing produces bad meetings. They're better understood as two passes over the same problem, feeding the same two outputs — solving the problem, and deciding what to do.

The generative pass widens the option set: five ways to hit the latency budget, including the stupid ones — precompute it, move it off the vehicle, drop the feature, change the requirement, buy a bigger SoC. The evaluative pass applies the standards to each: is that claim precise, is that comparison fair, does that conclusion follow.

The failure is running both passes at once. Evaluate during generation and you get three options, all safe. Generate during evaluation and the meeting never ends. Split them explicitly — even just "next fifteen minutes we only list, no objections" — and both get better. Options come from the first pass; the decision comes from the second; neither is optional.

## On Monday

- Put the eight questions at the bottom of your design doc template. Run them on your own draft before anyone else sees it, and delete any sentence that can't survive the clarity question.
- Replace one vague quantity per document with a number, a unit and a condition. "Slow" is not a finding.
- In your next postmortem, write the action items first and check where they land. If they're all on other teams, run the accuracy question again on the timeline.
- In your next architecture doc, give the rejected option an honest paragraph, written as if you preferred it. If you can't, you haven't evaluated it.
- In code review, label each comment blocking or preference. It costs five seconds and removes the "that's subjective" exit.
- Before signing off on a vendor number, ask what the measurement conditions were. If the answer is a single recorded run, it's a demo, not a benchmark.
