---
title: 'The XP practices that outlived the hype'
description: 'A practice-by-practice look at Extreme Programming: what became the industry default, what stayed niche, and why the split is mostly about tooling.'
pubDate: 'Jul 19 2026'
tags: [engineering-practice, agile]
---

## The trick XP played on everyone

Extreme Programming came out of a payroll project at Chrysler in the late 90s, and Kent Beck wrote it up in *Extreme Programming Explained* (1999; the 2004 second edition is the one worth reading). One generating idea: take practices everyone already agrees are good and turn the dial until they change shape.

Code review is good, so review continuously — that is pair programming. Tests are good, so write them first. Integration is risky, so integrate several times a day. Design is good, so design a little every day rather than all of it up front.

XP predates the [Agile Manifesto](https://agilemanifesto.org) by a couple of years, and Beck signed it. Scrum won the org-chart war — it tells managers what meetings to hold. XP won the keyboard war by stealth: much of what you do in a normal repo today came from XP, and nobody calls it XP anymore.

Under the practices sits a layer people skip: five values — communication, simplicity, feedback, courage, respect. It reads like poster material, but it is the debugging tool. When a practice stops working, the values tell you what it was buying, so you can buy that another way. Pair programming everyone hates is no longer a communication practice; it's theatre. Drop it and get the feedback elsewhere.

## The scoreboard

Here is my honest read on where each practice landed, twenty-plus years on.

| XP practice | Status in 2026 | Why it landed there |
| --- | --- | --- |
| Continuous integration | Universal default | Hosted CI made it nearly free. You have to work to *avoid* it. |
| Small, frequent releases | Default on the web, contested elsewhere | Deploy is cheap when you own the server; expensive when it's a car in a customer's driveway. |
| Refactoring as a routine | Default in name, uneven in practice | IDEs automated the mechanics; doing it *before* adding a feature never took. |
| Coding standards | Solved and forgotten | `ruff format`, `clang-format`, `gofmt`. Machines ended the argument. |
| Collective code ownership | Default, via pull requests | Git plus review gave everyone write access without the anarchy people feared. |
| Single code base, short-lived branches | Split verdict | Trunk-based won at large scale; long-lived feature branches are still everywhere else. |
| User stories, planning game | Default vocabulary | Absorbed into Scrum and Jira, minus the conversation that made them useful. |
| Test-first programming | Widely known, unevenly done | Tests are default; *tests first* is a minority habit. See below. |
| Incremental / simple design | Preached, rarely practised | Nothing enforces it. Speculative abstraction has no linter. |
| Ten-minute build | Aspiration | Build times grew faster than machines did. Most teams have quietly accepted 40 minutes. |
| Pair programming | Niche | Expensive, exhausting, and hard to schedule across time zones. |
| Sit together, informative workspace | Overtaken by events | Remote work ended the premise; the substitutes are worse but the trade was worth it. |
| Real customer on the team | Rare | Nobody can get a real user full time. A product manager is a proxy, not a replacement. |
| Sustainable pace, slack | Talked about, budgeted away | First thing cut when a date slips, which is exactly when it's needed. |
| Shrinking teams | Effectively dead | No organisation rewards a manager for reducing headcount. |
| Negotiated scope contract | Niche | Legal and procurement departments prefer fixed scope, even when it demonstrably fails. |

The pattern is not subtle. **Practices that could be moved into tooling became universal. Practices that require sustained human discipline or organisational courage stayed niche.** That is the single most useful thing to notice about XP's afterlife.

## Continuous integration won because it stopped being a practice

Beck's version of CI was a social agreement: finish a task, integrate it, run every test, several times a day. See [Fowler's article](https://martinfowler.com/bliki/ContinuousIntegration.html) for the canonical description. Today it's a YAML file.

```yaml
# .github/workflows/ci.yml
name: ci
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    timeout-minutes: 10          # the ten-minute build, enforced
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-python@v5
        with:
          python-version: '3.12'
          cache: pip
      - run: pip install -e '.[test]'
      - run: pytest -x -q --durations=10
```

The `timeout-minutes: 10` line is what most teams delete when it starts failing. Don't. Treat a timeout as a real bug; `--durations=10` tells you which tests to fix. A build you run six times a day and one you run once a day are different tools, and the threshold sits somewhere around the length of a coffee break.

Teams still get the other half wrong. Running CI on a branch that has been open three weeks is not continuous integration — it's a late-arriving merge report. To find out whether you actually do CI, measure branch age:

```bash
git fetch --quiet origin
for b in $(git for-each-ref --format='%(refname:short)' refs/remotes/origin); do
  base=$(git merge-base origin/main "$b" 2>/dev/null) || continue
  printf '%s\t%s\t%s\n' "$(git log -1 --format=%ct "$base")" \
                        "$(git log -1 --format=%cr "$base")" "$b"
done | sort -n | head
```

That lists branches by how long ago they last shared history with `main`, oldest first. If the first lines say "3 weeks ago", you are doing integration, not continuous integration. Fowler's [FeatureBranch](https://martinfowler.com/bliki/FeatureBranch.html) piece lays out the trade honestly, including the case where branches are the right call.

## TDD: the practice everyone knows and few do

Writing the test first is a design technique, not a testing technique. The test is the first caller of your API, so a bad signature hurts before anything is built on top of it.

Concretely, decoding a CAN signal. I write this before `decode_speed` exists:

```python
# test_can_frame.py
import pytest
from canlib.frame import decode_speed

def test_decode_speed_scales_raw_counts():
    # u16 little-endian at byte 2, 0.01 km/h per count -> 0x2710 = 100.00 km/h
    assert decode_speed(bytes([0x00, 0x00, 0x10, 0x27, 0, 0, 0, 0])) == 100.0

def test_decode_speed_rejects_short_frame():
    with pytest.raises(ValueError):
        decode_speed(b"\x00\x00")
```

Writing that first forces a decision I'd otherwise defer: what happens on a truncated frame? Raise, or return `None`, or clamp? Test-after almost never asks that question, because by then the code has already answered it by accident.

TDD stayed niche because its cost is immediate and its payoff is invisible: slower for the first hour, faster for the next six months, and nobody gets promoted for the next six months. It's also genuinely bad at some things — exploratory work, UI layout, most ML experimentation. Training-loop code has tests; "does this architecture work" has no red-green cycle. The [Is TDD Dead?](https://martinfowler.com/articles/is-tdd-dead/) conversations between Beck, Fowler and DHH air both sides fairly.

The failure mode I see most often is teams calling test-after "TDD" and then concluding TDD doesn't help. It doesn't, done that way. You get the regression net without the design pressure, which is half the value at full price.

## Simple design is the one still worth fighting for

Beck's [four rules](https://martinfowler.com/bliki/BeckDesignRules.html), in priority order: passes the tests, reveals intention, no duplication, fewest elements. Everything else — the plugin system for one plugin, the config option nobody sets, the interface with a single implementation — is a bet on a future you can't see.

This is the hardest XP practice to keep, because nothing enforces it. CI catches a broken build; a formatter catches style. Nothing fails when you add an abstraction layer for a second backend that never arrives. Only a reviewer asking "what breaks if we delete this?" catches that — and then actually deleting it.

Pair programming went niche for logistics, not principle. Two engineers on one problem across a six-hour time difference doesn't work, and full-time pairing is more exhausting than its advocates admit. What survived is the mechanism rather than the ritual: pull request review, ad-hoc screen shares on the genuinely hard parts, and increasingly a model in the second seat that never tires and never takes the keyboard personally.

## Monday

- Run the branch-age loop above on your main repo. Anything older than a week gets merged, split, or deleted this week.
- Put a hard timeout on your CI job at whatever your build currently takes, and treat any increase as a failure rather than weather.
- Pick your next small, well-understood function and write the test first. Once. Notice which API questions the test asked that you would have skipped.
- In your next review, find one abstraction with exactly one implementation and ask whether deleting it makes the code shorter. If yes, delete it in that PR.
- Don't try to adopt "XP". Adopt one practice, keep it for a quarter, and judge it on whether the next change to that code got easier.
