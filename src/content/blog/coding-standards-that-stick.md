---
title: 'Coding standards people actually follow'
description: 'What belongs in a coding standard, what belongs in a config file, and how to enforce the difference with formatters, hooks and CI gates.'
pubDate: 'Aug 2 2026'
tags: [engineering-practice, code-quality]
---

## The one line worth remembering

A rule that no tool checks is not a standard. It is a preference with good intentions.

I have watched a team spend an afternoon agreeing on brace placement, write it into a wiki, then merge non-conforming code for two years. Nobody was hostile or lazy. The rule just had no way to announce itself at the moment someone was typing.

Everything below follows from that.

## Why standards exist

Not for beauty. Three practical reasons.

**Reading.** Most of the code you read is code you did not write. Consistency means your eyes stop parsing style and start parsing logic: when constants are always named the same way, a `MAX_RETRIES` reads as configuration without you thinking about it.

**Reviewing.** Review attention is a fixed, small budget. Eight comments spent on import ordering are eight comments not spent on the off-by-one in the retry loop. Automating style is not about style. It protects reviewer attention for the things a machine cannot check.

**Onboarding.** A new engineer's first week is spent inferring the rules. In a formatter config, they learn them by saving a file. In a senior engineer's head, they learn them by getting a PR torn apart.

In some industries you also have no choice: automotive work sits under MISRA and ISO 26262, and non-compliance needs a written deviation. That makes the automation argument stronger, because auditors want evidence and tool output is evidence.

## What actually belongs in the document

Most coding standards are too long, because they contain text a config file should be enforcing. My split:

**Delete it from prose, put it in a tool:** indentation, line length, brace style, import order, trailing whitespace, quote style, spacing around operators. Nobody should have an opinion about these. Pick a formatter, accept its defaults, move on.

**Keep it in prose, because judgement is involved:**

- **Naming.** Not `camelCase` vs `snake_case` (that is a linter rule), but what a good name contains. A function name should say what it returns or what it changes, and units belong in the name when the value has units.

```python
# what does this return, and what is t?
def proc(d, t=0.5):
    return [x for x in d if x["s"] > t]

# same code, readable without context
def filter_detections_by_confidence(
    detections: list[Detection], min_confidence: float = 0.5
) -> list[Detection]:
    return [d for d in detections if d.confidence >= min_confidence]
```

On a perception pipeline I once spent two hours on a bug where one function took a timeout in seconds and its caller passed milliseconds. `timeout_s` in the signature would have made it visible in the diff.

- **Structure.** Where a new file goes and what a module may import. Keep it directional: "anything that talks to hardware lives under `drivers/` and is importable only from `hal/`" is a rule people can follow. "Functions should be small" is not.

- **Comments.** The rule is: comments explain why, never what. If a comment restates the code, it will go stale and then lie to you.

```c
// useless: the code already says this
i += 1;  // increment i

// useful: encodes a fact you cannot read off the code
// IMU reports at 99.6 Hz, not the 100 Hz in the datasheet. Measured across
// 12 units, 2026-03. Resample to the vehicle clock before fusing.
resample_to_vehicle_clock(&imu_sample);
```

- **Error handling.** This is the highest-value section and the one most standards skip. Say explicitly: which errors are recoverable, what the catch-all policy is, whether you log-and-continue or fail fast. The common disaster is a broad swallow that destroys the cause:

```python
# the caller gets an empty list and no idea why
try:
    frames = decode(path)
except Exception:
    frames = []
```

versus preserving the chain so the traceback still names the real failure:

```python
try:
    frames = decode(path)
except DecodeError as exc:
    raise PipelineError(f"cannot decode {path}") from exc
```

Do not write your own standard from scratch. Adopt [PEP 8](https://peps.python.org/pep-0008/), the [Google style guides](https://google.github.io/styleguide/), or rustfmt defaults, then write one short page of the deltas your team actually cares about. A twelve-page in-house standard is a document nobody finishes reading.

## The enforcement ladder

Feedback speed is everything. The same rule costs seconds in the editor and hours in CI.

| Layer | Feedback arrives | Good for | Failure mode if it is your only layer |
| --- | --- | --- | --- |
| Editor (format-on-save, LSP) | Instantly | Formatting, obvious lints | Silently off on someone's machine |
| Pre-commit hook | ~2 seconds, on commit | Formatting, fast lints, secrets | Bypassable with `--no-verify` |
| CI gate on PR | 1-5 minutes | Everything, including slow static analysis | Too late to be pleasant, but it is the only layer that cannot be skipped |
| Nightly / scheduled | Hours | Deep analysis, full-repo security scans | Nobody reads the report |

You want all four, and you want the same rule set in each so they never disagree. The concrete way to get that is one config that every layer runs. [pre-commit](https://pre-commit.com/) is the boring, effective choice:

```yaml
# .pre-commit-config.yaml
repos:
  - repo: https://github.com/pre-commit/pre-commit-hooks
    rev: v5.0.0
    hooks:
      - id: trailing-whitespace
      - id: end-of-file-fixer
      - id: check-merge-conflict
  - repo: https://github.com/astral-sh/ruff-pre-commit
    rev: v0.6.9
    hooks:
      - id: ruff
        args: [--fix]
      - id: ruff-format
  - repo: https://github.com/pre-commit/mirrors-clang-format
    rev: v18.1.8
    hooks:
      - id: clang-format
        types_or: [c, c++]
```

Then CI runs the identical thing, so "works on my machine" cannot happen:

```yaml
# .github/workflows/lint.yml
name: lint
on: [pull_request]
jobs:
  pre-commit:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-python@v5
        with: { python-version: '3.12' }
      - run: pip install pre-commit
      - run: pre-commit run --all-files --show-diff-on-failure
```

Two details that decide whether this survives contact with a real team:

**Make the gate blocking, but only for new code.** A gate that is red for reasons nobody caused gets ignored within a week, and then it is worse than no gate. Most tools support a baseline; `ruff` and `clang-tidy` can be scoped to changed files, and `git diff --name-only origin/main...HEAD` is enough to build that yourself.

**Give people a documented escape hatch.** Rules have exceptions and pretending otherwise makes people disable the whole tool. Require a reason, not just a suppression:

```python
url = "https://example.com/a/very/long/path"  # noqa: E501 - URL, cannot wrap
```

## Retrofitting a codebase that predates the standard

The realistic objection is legacy code: reformatting 400,000 lines destroys `git blame`. The fix is one line of git config. Reformat in a single commit that touches nothing but whitespace, then tell blame to skip it.

```bash
git commit -am "style: apply clang-format tree-wide (no behaviour change)"
git rev-parse HEAD >> .git-blame-ignore-revs
git config blame.ignoreRevsFile .git-blame-ignore-revs
```

Commit `.git-blame-ignore-revs`; GitHub honours it too. Do it on a quiet day with no other PRs in flight, and for compiled code compare stripped object hashes before and after to prove nothing moved.

For real restructuring, not formatting, do not attempt a rewrite. Change code as you touch it for other reasons. Martin Fowler's [Is High Quality Software Worth the Cost?](https://martinfowler.com/articles/is-quality-worth-cost.html) is the honest version: internal quality pays off in weeks, but only when bought incrementally.

## Symptom to cause

| What you see | Real cause | What to change |
| --- | --- | --- |
| Review comments are mostly formatting | No formatter in the loop | Add format-on-save plus a pre-commit hook; ban style comments in review |
| "The lint job is always red, ignore it" | Rules turned on without clearing the backlog | Baseline existing violations, gate only changed files |
| Standard exists, nobody follows it | The document is prose a machine cannot read | Move every mechanical rule into config; delete it from the doc |
| Everyone reformats whole files in unrelated PRs | Editor configs differ per person | Commit the tool config to the repo; pin the tool version |
| New hire's first PR gets 40 comments | Rules live in senior engineers' heads | Write the five non-obvious ones down; automate the rest |
| Same class of bug recurs | Standard covers style but not error handling | Add a static analysis rule for that class, not another wiki paragraph |

## What to do on Monday

1. Open your standard document. Move every rule a formatter could enforce into the formatter config, then delete the paragraph. The document should halve.
2. Add `.pre-commit-config.yaml` with a formatter and one linter. Run `pre-commit run --all-files` once; ship the result as a pure-formatting commit with `.git-blame-ignore-revs` in the same PR.
3. Make the CI lint job blocking on changed files only, and announce the switch-on date a week ahead.
4. Write the error-handling section you probably do not have. Half a page: what gets retried, what gets logged, what crashes the process, and the rule that a caught exception is re-raised with context or handled completely.
5. Next review, stop yourself before leaving a style comment. If you still want to leave it, that is a missing lint rule.

Success is not a complete standard. It is that six months from now nobody has read it and the code still complies.
