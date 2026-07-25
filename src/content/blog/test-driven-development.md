---
title: 'TDD without the dogma'
description: 'Red-green-refactor with a worked Python example, what test-first actually buys you, and the places where it earns its keep least.'
pubDate: 'Jul 20 2026'
tags: [engineering-practice, testing]
---

## The loop is smaller than you think

Test-driven development is one rule: you do not write production code until a failing test asks for it. Everything else — the ceremony, the arguments, the conference talks — is commentary.

The rule runs as a three-beat loop:

**Red.** Write one small test for behaviour that does not exist. Run it. It fails, usually with an import error, and that failure is information: it proves the test is actually wired to the thing you are about to build.

**Green.** Write the least code that makes it pass. Not the design you have in your head. The least. Hardcoding a return value is legal here.

**Refactor.** Now that the behaviour is pinned by a test, clean up. Rename, extract, remove duplication. Run the tests again. If they still pass, your cleanup was safe.

Then repeat, in loops of a minute or two. Kent Beck's [*Test-Driven Development: By Example*](https://www.oreilly.com/library/view/test-driven-development/0321146530/) is still the shortest way to see the rhythm; he restated the minimal version in [Canon TDD](https://tidyfirst.substack.com/p/canon-tdd) after two decades of people adding things to it that were never in it.

The part people skip is refactor. TDD without refactoring is just writing tests in an unusual order, and it produces the same tangle as writing them last.

## A worked example

A sensor reads out of range. You do not want to raise a fault on a single sample — noise happens. You want a fault after N consecutive bad samples.

My first instinct on a bad day is this:

```python
def check_fault():
    value = read_adc()          # talks to hardware
    if not (0.5 < value < 4.5):
        global bad_count
        bad_count += 1
    ...
```

That function can only be tested with hardware attached, or with three mocks. Writing the test first makes that pain arrive before the code does, which is the whole point.

So start with the test:

```python
# test_debounce.py
from debounce import FaultDebouncer

def test_one_bad_sample_is_not_a_fault():
    d = FaultDebouncer(threshold=3)
    assert d.update(in_range=False) is False
```

```
$ pytest -q
E   ModuleNotFoundError: No module named 'debounce'
```

Red. Note what the test already decided: the debouncer takes samples as arguments and owns no clock and no ADC. That decision was forced by wanting to write a test at all. This is the "design pressure" people mean — testability and loose coupling are close to the same property, so pulling on one pulls the other.

Green, in the dumbest way that works:

```python
# debounce.py
class FaultDebouncer:
    def __init__(self, threshold):
        self.threshold = threshold

    def update(self, in_range):
        return False
```

Yes, really. It passes. Now the next test makes the fake untenable:

```python
def test_three_consecutive_bad_samples_trip_the_fault():
    d = FaultDebouncer(threshold=3)
    assert [d.update(in_range=False) for _ in range(3)] == [False, False, True]
```

```python
class FaultDebouncer:
    def __init__(self, threshold):
        self.threshold = threshold
        self._bad = 0

    def update(self, in_range):
        if in_range:
            self._bad = 0
        else:
            self._bad += 1
        return self._bad >= self.threshold
```

Green. One more test, for the case that actually bites in the field:

```python
def test_a_good_sample_resets_the_count():
    d = FaultDebouncer(threshold=3)
    d.update(in_range=False)
    d.update(in_range=False)
    d.update(in_range=True)
    assert d.update(in_range=False) is False
```

This one passes without any change. That is fine and worth doing anyway: you were not sure, now the file says so, and the next person cannot break the reset behaviour silently.

Refactor. The counter grows without bound during a long fault, which is ugly and, on a 16-bit target, eventually wrong:

```python
    def update(self, in_range: bool) -> bool:
        self._bad = 0 if in_range else min(self._bad + 1, self.threshold)
        return self._bad >= self.threshold
```

Same three tests, still green, behaviour unchanged, bug removed before it existed. That is the loop.

Notice what never came up: latching. Should the fault stay set after the signal recovers? The tests forced me to answer a contract question early, in a file, instead of discovering the ambiguity in an integration lab three weeks later.

## What it actually buys you

Three things, in order of how much I trust them.

**A safety net that makes refactoring cheap.** This is the big one and it is not really about bugs. It is about the willingness to change code. Without tests, every rename is a small gamble, so nobody renames anything, and the code rots by neglect. Martin Fowler's [refactoring catalogue](https://martinfowler.com/bliki/Refactoring.html) assumes the net exists; without it, none of those moves are safe.

**Fast feedback.** A unit test that runs in 40 ms tells you about a mistake before you have context-switched away. The same mistake found in a nightly HIL run costs an afternoon of log archaeology.

**Design pressure.** Awkward-to-test usually means awkward-to-use. A test that needs six lines of setup is telling you the constructor has too many collaborators.

What TDD does *not* buy you: correctness. Your tests encode your understanding of the requirement. If you misunderstood the requirement, you now have a green suite and a wrong feature.

## Where it goes wrong

| Symptom | Cause | Fix |
| --- | --- | --- |
| One small change breaks 40 tests | Tests assert on internals — private methods, call order, mock invocations | Assert on observable outputs. See [Mocks Aren't Stubs](https://martinfowler.com/articles/mocksArentStubs.html) |
| Nobody runs the suite | It takes 11 minutes | Split fast unit tests from slow integration tests; the fast set must stay under ~10 s |
| "We can't TDD, it's legacy code" | Nothing is injectable | Do not convert the codebase. Write a characterisation test around the seam you are about to touch, then work test-first inside it |
| Tests pass but production breaks | Everything is mocked, including the thing that was wrong | Keep a thin layer of tests that exercise the real adapter against a real (or containerised) dependency |
| Coverage is 90%, confidence is 0 | Tests written to hit lines, not behaviours | Delete assertion-free tests. Coverage is a leak detector, not a target |

The "TDD is slow" objection is usually a measurement error: it compares typing time against typing time and ignores debugging time. But it is not always wrong. On a spike where you throw away the code, it *is* slower, because you paid for a net you then binned.

## Where TDD helps least

Be honest about this or people will correctly stop believing you.

**Exploratory work.** You cannot write a test for a behaviour you cannot yet describe. Spike freely with no tests, learn the shape of the problem, then throw the spike away and rebuild it test-first. The throwing away is not optional; that is what keeps the spike honest.

**UI.** Test-driving "does this look right" does not work. Test-drive the logic behind the view — formatting, state transitions, enablement rules — and cover the pixels with a small number of end-to-end or snapshot tests you accept will be brittle.

**Machine learning.** There is no expected value to assert. `assert model.predict(x) == 1` is a test of your seed, not your model. What *is* test-drivable is everything around the model: data loading, feature transforms, label alignment, the metric implementation, checkpoint round-tripping. In my experience most ML bugs live there anyway. Model quality belongs in an evaluation harness with thresholds, not in the unit suite.

**Genuinely unstable requirements.** If the spec changes weekly, the tests churn as fast as the code. Test-drive the parts that are stable — the money maths, the protocol codec — and stay light elsewhere.

## On Monday

- Pick one small function you were about to write and write its test first. One function, not a policy for the team.
- Time your fastest test suite. If it is over ten seconds, that is the thing to fix before anything else.
- Find a test that asserts a mock was called. Rewrite it to assert on a return value or a visible state change instead.
- Next time you fix a bug, write the failing test that reproduces it *before* the fix. This is the highest-value TDD there is, and it works even on code that has no other tests.
- Stop reporting coverage percentages in stand-up. Report which behaviours are pinned.
