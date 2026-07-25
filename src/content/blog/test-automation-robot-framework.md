---
title: 'Test automation that survives contact with a real project'
description: 'How keyword-driven suites in Robot Framework are built, how they rot, and the maintenance rules that keep them running past month three.'
pubDate: 'Jul 22 2026'
tags: [engineering-practice, testing]
---

## Keyword-driven means the test reads like the test plan

Most automated tests are written in a programming language and then explained to everyone else in a meeting. Keyword-driven testing inverts that: the test case is a list of named actions, and the code that performs those actions lives one layer down where only engineers look.

[Robot Framework](https://robotframework.org) is the most widely used implementation of this idea. It is a Python program. Your test suites are plain-text `.robot` files; your keywords are either shipped by a library or written by you in Python. Install it the boring way:

```bash
python -m venv .venv && source .venv/bin/activate
pip install robotframework robotframework-requests
robot --version
```

That is the whole setup. There is no project scaffold, no config file you must have, no plugin system to learn before the first test runs.

The claim I would push back on is that this makes tests "readable by non-programmers so QA can write them." In practice, non-programmers can *read* a suite fine and almost never maintain one. The real payoff is different: keywords force you to separate *what is being verified* from *how the system is poked*, and that separation is what lets a suite survive a hardware revision or a UI rewrite.

## The five sections

A `.robot` file is divided into sections marked with `*** Name ***`. You will use these:

- `*** Settings ***` — imports, documentation, and the setup/teardown wiring for the suite.
- `*** Variables ***` — scalars `${LIKE_THIS}`, lists `@{LIKE_THIS}`, dictionaries `&{LIKE_THIS}`.
- `*** Test Cases ***` — one indented block per test.
- `*** Keywords ***` — keywords built from other keywords, local to this file.
- `*** Comments ***` — free text the parser ignores. Rarely needed; `#` works anywhere.

Arguments are separated from keyword names by **two or more spaces**. One space is part of the name. This bites everyone once, and the error message is unhelpful, so configure your editor to show whitespace and use four spaces everywhere.

Here is a suite in the shape I actually ship — an EV charge-port controller talking over a diagnostic serial link:

```robotframework
*** Settings ***
Documentation     Charge-port lock actuator behaviour over the diagnostic link.
Resource          ../resources/charge_port.resource
Library           ../libraries/UartDevice.py    ${SERIAL_PORT}    ${BAUD}
Suite Setup       Open Diagnostic Session
Suite Teardown    Close Diagnostic Session
Test Teardown     Dump Fault Memory On Failure
Force Tags        charge_port

*** Variables ***
${SERIAL_PORT}    /dev/ttyUSB0
${BAUD}           115200
&{BUDGET_MS}      lock=400    unlock=400

*** Test Cases ***
Port Locks When Charging Starts
    [Documentation]    Actuator must engage inside the timing budget from ECU spec 4.2.1.
    [Tags]    smoke    actuator
    Given The Port Is    unlocked
    When Charging Is Requested
    Then The Port Reports    locked    within=${BUDGET_MS}[lock]

Lock Command Is Rejected Below Minimum Supply Voltage
    [Tags]    robustness
    Given The Port Is    unlocked
    Set Supply Voltage    8.5
    Run Keyword And Expect Error    *NRC 0x22*    Send Lock Command
```

`Given`, `When`, `Then`, and `And` are stripped before keyword lookup, so `Given The Port Is` resolves to a keyword named `The Port Is`. That is a formatting convenience, not a BDD framework.

The keywords behind it live in the resource file:

```robotframework
*** Keywords ***
The Port Is
    [Arguments]    ${state}
    Send Command    ${state}
    Wait Until Keyword Succeeds    2x    200ms    Port State Should Be    ${state}

The Port Reports
    [Arguments]    ${expected}    ${within}=1000
    Wait Until Keyword Succeeds    ${within}ms    50ms    Port State Should Be    ${expected}

Dump Fault Memory On Failure
    ${dtcs} =    Read Stored Fault Codes
    Run Keyword If Test Failed    Log    Fault codes at failure: ${dtcs}    level=WARN
    Clear Fault Memory
```

Note the split: `Suite Setup` opens the serial session once, `Test Teardown` runs after every test. Getting this wrong is the most common source of "passes alone, fails in the suite." Session-scoped state that mutates during tests belongs in test-level teardown, not suite-level.

## Data-driven tests: use a template, not a loop

When ten tests differ only by input, do not copy the block ten times and do not write a `FOR` loop inside one test — a loop gives you one pass/fail for ten cases, so a report tells you nothing about which input broke.

```robotframework
*** Settings ***
Test Template     Transition Should Result In

*** Test Cases ***    START       COMMAND    EXPECTED
Lock From Unlocked    unlocked    lock       locked
Unlock From Locked    locked      unlock     unlocked
Lock Is Idempotent    locked      lock       locked
Unlock Is Idempotent  unlocked    unlock     unlocked

*** Keywords ***
Transition Should Result In
    [Arguments]    ${start}    ${command}    ${expected}
    The Port Is    ${start}
    Send Command    ${command}
    Port State Should Be    ${expected}
```

Every row is a separate test case with its own result, and all four run even if the first fails.

## Tags are the scheduler

Tags are how you carve one suite into several test runs without splitting files. Decide the taxonomy before you have 300 tests, because retagging later is a tedious pull request nobody reviews properly. A workable set: one tag for speed (`smoke`), one for the resource required (`hil`, `network`), one for the feature area, and a requirement ID if you are in a regulated domain.

| Goal | Command |
| --- | --- |
| Run everything | `robot tests/` |
| One named test | `robot -t "Port Locks When Charging Starts" tests/charge_port.robot` |
| Pre-merge gate | `robot -i smoke tests/` |
| CI without hardware attached | `robot -e hil tests/` |
| Point at a different board | `robot -v SERIAL_PORT:/dev/ttyACM0 tests/` |
| Keep results out of the repo root | `robot -d results/nightly tests/` |
| Find your Python libraries | `robot --pythonpath libraries tests/` |

Every run writes `report.html`, `log.html`, and `output.xml`. The XML is the useful one: `rebot` merges runs, and CI servers parse it for trends. Archive it as a build artifact from day one — nobody reconstructs a flake that was only visible in a console log.

## Resource files are page objects

Martin Fowler's [PageObject](https://martinfowler.com/bliki/PageObject.html) argument was about web UIs, but it applies to any system with a fiddly interface: wrap the mechanics behind an API that speaks the domain's language, and let tests use only that API. In Robot Framework, a `.resource` file is that wrapper.

The rule that makes it work: **a test case must contain no locators, no pin numbers, no register addresses, no raw HTTP paths.** If `tests/` mentions `//div[@id='cart']/button[2]`, the abstraction has leaked and you have signed up for a rewrite the next time the frontend team ships.

The rule that makes it fail: a "common" resource file that every suite imports and every team edits. It reaches 2,000 lines, half the keywords have four optional arguments, and changing one breaks a suite you have never opened. Split by domain — `charge_port.resource`, `diagnostics.resource` — and let a small amount of duplication stand rather than build a keyword with a `mode=` argument that switches behaviour.

## The maintenance discipline

Suites die from neglect, not from bad frameworks. What kills them, and what to do:

| Symptom | Actual cause | Fix |
| --- | --- | --- |
| Flaky tests get re-run until green | No wait strategy; tests race the system | Replace `Sleep` with `Wait Until Keyword Succeeds` on a real condition |
| Nobody trusts the nightly result | Known failures left red for weeks | Quarantine with a tag and a ticket, or delete the test |
| One-line spec change breaks 40 tests | Details duplicated across test cases | Move them behind one keyword |
| Test passes but verifies nothing | Assertion removed to "unblock the pipeline" | Review test diffs like production diffs |
| Suite takes 90 minutes, so it runs weekly | Everything at the highest level | Tag a sub-5-minute `smoke` set for every merge |

Two habits carry most of the weight. First, tests go through code review — a test that no one reviewed is a test that will assert `True == True` within six months. Second, when a test fails in CI, the fix is either a product bug or a test bug, and someone names which one that day. "It's just flaky" is a decision to delete the suite over 18 months.

## When to skip Robot Framework and write pytest

Robot Framework buys you a readable execution layer, tagging, HTML reports, and a large library ecosystem. It costs you real programming ergonomics: refactoring is text-based, the type system is strings, and control flow is clumsy on purpose.

| Situation | Better choice |
| --- | --- |
| End-to-end tests on hardware or a deployed system, run by more than one team | Robot Framework |
| Acceptance criteria traced to requirement IDs for an audit | Robot Framework |
| Unit tests, or anything inside one Python package | pytest |
| Tests needing real logic: property-based, fuzzing, numeric tolerances | pytest |
| Heavy fixture graphs, parametrised matrices, mocking | pytest |
| A team of three Python engineers and no external readers | pytest |

Mixing both is fine and common: `pytest` for unit and integration, Robot Framework for the system-level suite that a test engineer and a supplier both need to read. What is not fine is using Robot Framework for unit tests because it is "the company standard" — you will write Python inside string arguments and hate it.

## On Monday

- Open your largest suite and grep the test cases for locators, pin numbers, and URLs. Every hit is a scheduled outage; move it into a resource file this week.
- Add a `smoke` tag to the ten tests that would catch a genuinely broken build, and wire `robot -i smoke` into the pre-merge gate. Leave the full suite nightly.
- Replace every `Sleep` with a `Wait Until Keyword Succeeds` on an observable condition. Count them first — the number is usually worse than you expect.
- Pick the oldest permanently-red test. Fix it or delete it today. A suite with one accepted failure has no gate at all.
- Archive `output.xml` from CI. The first time you need to prove a regression appeared in a specific build, you will have the data.
