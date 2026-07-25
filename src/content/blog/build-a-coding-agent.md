---
title: 'Write your own coding agent in an afternoon'
description: 'A complete, runnable Python coding agent — loop, tool schemas, read/write/edit/bash, permission prompt — plus the failure modes nobody warns you about.'
pubDate: '2026-08-07'
tags: [llm, coding-agents, python]
---

## The loop is not the hard part

Thorsten Ball's line stuck: ["It's an LLM, a loop, and enough tokens."](https://ampcode.com/notes/how-to-build-an-agent) His demo agent was ~400 lines of Go with three tools. [mini-swe-agent](https://github.com/SWE-agent/mini-swe-agent) is ~100 lines of Python and hands the model nothing but `bash`; its README self-reports over 74% on SWE-bench verified — self-reported, not independent, but the shape is right.

The loop: send the conversation plus tool definitions, run the tools that come back, append results, send again. Anthropic writes the same cycle as [gather context → take action → verify work → repeat](https://claude.com/blog/building-agents-with-the-claude-agent-sdk). Build one — not to replace your work harness, but to demystify it.

## Four tools

`read_file`, `write_file`, `edit_file`, `bash`. That quartet keeps reappearing because `bash` covers listing, searching, testing and git; the file tools cover what shelling out does badly.

Skip embeddings: the PwC study *Is Grep All You Need?* found that with inline tool results, [lexical grep beat dense vector retrieval for every harness–model pair tested](https://arxiv.org/pdf/2605.15184).

## agent.py

`pip install anthropic`, set `ANTHROPIC_API_KEY`, set `AGENT_MODEL` to a current model id — I'm not hardcoding one, they churn faster than blog posts.

```python
import json, os, subprocess
from pathlib import Path
from anthropic import Anthropic

ROOT = Path.cwd().resolve()
MODEL = os.environ["AGENT_MODEL"]
MAX_CHARS = 20_000
client = Anthropic()

def resolve(path: str) -> Path:
    """All model-supplied paths go through here. No exceptions."""
    p = (ROOT / path).resolve()
    if p != ROOT and ROOT not in p.parents:
        raise ValueError(f"path escapes the project root: {path}")
    return p

def clip(text: str) -> str:
    if len(text) <= MAX_CHARS:
        return text
    half = MAX_CHARS // 2
    dropped = len(text) - MAX_CHARS
    return (f"{text[:half]}\n\n... [{dropped} chars omitted — narrow the "
            f"command, e.g. pipe through grep] ...\n\n{text[-half:]}")
```

`resolve()` does more than it looks. `ROOT / "/etc/passwd"` evaluates to `/etc/passwd` — `/` discards the left side when the right is absolute. The parent check catches that, catches `../../`, and since `.resolve()` follows symlinks, catches a symlink out of the tree.

```python
def read_file(path, offset=1, limit=200):
    lines = resolve(path).read_text(encoding="utf-8", errors="replace").splitlines()
    if not lines:
        return "(file exists but is empty)"
    start = max(1, offset) - 1
    chunk = lines[start:start + limit]
    if not chunk:
        return f"(offset {offset} is past EOF; the file has {len(lines)} lines)"
    body = "\n".join(f"{start+i+1:>6}\t{l}" for i, l in enumerate(chunk))
    end = start + len(chunk)
    if end < len(lines):
        body += (f"\n\n(showing {start+1}-{end} of {len(lines)} lines; "
                 f"call again with offset={end+1})")
    return body

def write_file(path, content):
    p = resolve(path)
    p.parent.mkdir(parents=True, exist_ok=True)
    p.write_text(content, encoding="utf-8")
    return f"wrote {len(content)} bytes to {path}"

def edit_file(path, old_str, new_str):
    p = resolve(path)
    text = p.read_text(encoding="utf-8")
    n = text.count(old_str)
    if n == 0:
        return ("ERROR: old_str not found. It must match byte-for-byte including "
                "indentation. Read the file again and copy the exact text.")
    if n > 1:
        return (f"ERROR: old_str appears {n} times and must be unique. "
                "Include more surrounding lines.")
    p.write_text(text.replace(old_str, new_str), encoding="utf-8")
    return f"edited {path}"

def bash(command, timeout=120):
    try:
        r = subprocess.run(command, shell=True, cwd=ROOT, capture_output=True,
                           text=True, timeout=timeout)
    except subprocess.TimeoutExpired:
        return f"ERROR: command exceeded {timeout}s and was killed."
    return f"exit={r.returncode}\n" + ((r.stdout + r.stderr).strip() or "(no output)")
```

Line numbers aren't decoration — they make the next `edit_file` land, the same reason SWE-agent built [a file viewer instead of `cat`](https://github.com/SWE-agent/SWE-agent/blob/main/docs/background/aci.md). `edit_file` returns strings on failure rather than raising, because those strings tell the model what to do next.

### Schemas

The description is the API. Anthropic reports spending [more optimisation time on tools than on the overall prompt](https://www.anthropic.com/engineering/building-effective-agents) for their SWE-bench agent.

```python
def obj(props, required):
    return {"type": "object", "properties": props, "required": required}

S = lambda d: {"type": "string", "description": d}
I = lambda d: {"type": "integer", "description": d}

TOOLS = [
 {"name": "read_file",
  "description": "Read a text file, relative to the project root. Returns numbered "
                 "lines. Read a file before editing it.",
  "input_schema": obj({"path": S("e.g. src/main.py"),
                       "offset": I("1-based start line"),
                       "limit": I("max lines")}, ["path"])},
 {"name": "write_file",
  "description": "Create a file or overwrite it completely. For existing files "
                 "prefer edit_file — this clobbers anything you did not read.",
  "input_schema": obj({"path": S("relative path"),
                       "content": S("full file contents")}, ["path", "content"])},
 {"name": "edit_file",
  "description": "Replace one exact, unique occurrence of old_str with new_str. "
                 "No regex, no fuzzy matching.",
  "input_schema": obj({"path": S("relative path"),
                       "old_str": S("exact text to replace, must occur once"),
                       "new_str": S("replacement text")},
                      ["path", "old_str", "new_str"])},
 {"name": "bash",
  "description": "Run a shell command in the project root: ls, grep, tests, git. "
                 "Each call is a fresh process, so cd and environment variables "
                 "do not persist.",
  "input_schema": obj({"command": S("the command line"),
                       "timeout": I("seconds")}, ["command"])},
]
```

That `cd` note isn't filler. Claude Code's `Bash` behaves the same — [separate process per command, no environment carried over](https://code.claude.com/docs/en/tools-reference) — and a model that doesn't know runs `cd build`, then `make`, then can't explain the failure.

### The permission gate

```python
SAFE = ("ls", "cat", "head", "tail", "grep", "rg", "pytest",
        "git status", "git diff", "git log")
HANDLERS = {"read_file": read_file, "write_file": write_file,
            "edit_file": edit_file, "bash": bash}
_always = set()

def needs_approval(name, args):
    if name in ("write_file", "edit_file"):
        return True
    if name == "bash":
        cmd = args["command"].strip()
        return not (cmd.startswith(SAFE) and not any(c in cmd for c in ";|&><`$"))
    return False

def run_tool(name, args):
    if needs_approval(name, args) and name not in _always:
        print(f"\ntool: {name}\n{json.dumps(args, indent=2)}")
        ans = input("run it? [y]es / [n]o / [a]lways this tool: ").strip().lower()
        if ans == "a":
            _always.add(name)
        elif ans != "y":
            return "The user denied this call. Ask what to do instead; do not retry.", True
    try:
        return HANDLERS[name](**args), False
    except FileNotFoundError:
        return f"ERROR: no such file: {args.get('path')}. Use bash `ls` to see what exists.", True
    except Exception as e:
        return f"ERROR {type(e).__name__}: {e}", True
```

Be honest: this is prefix matching on a shell string. Rejecting metacharacters stops `grep foo; rm -rf ~`, but `find . -delete` sails through. Real harnesses don't rely on strings — Claude Code pairs rules with an [OS-level sandbox](https://code.claude.com/docs/en/sandboxing), and its docs state plainly that [permission rules are enforced by the harness, not by the model](https://code.claude.com/docs/en/permissions.md). Run yours on a scratch repo, in a container, with no credentials in the environment.

### The loop

```python
SYSTEM = ("You are a coding agent in {root}. Read files before editing them. "
          "Prefer edit_file for existing files. Run the project's tests with "
          "bash before claiming to be done. When finished, reply in plain text "
          "with no tool calls.")

def turn(messages, max_steps=25):
    for _ in range(max_steps):
        resp = client.messages.create(model=MODEL, max_tokens=8000,
                                      system=SYSTEM.format(root=ROOT),
                                      tools=TOOLS, messages=messages)
        messages.append({"role": "assistant", "content": resp.content})
        for b in resp.content:
            if b.type == "text" and b.text.strip():
                print(f"\nassistant: {b.text}")
        if resp.stop_reason != "tool_use":
            return
        results = []
        for b in (b for b in resp.content if b.type == "tool_use"):
            print(f"  -> {b.name} {json.dumps(b.input)[:100]}")
            out, err = run_tool(b.name, b.input)
            results.append({"type": "tool_result", "tool_use_id": b.id,
                            "content": clip(out), "is_error": err})
        messages.append({"role": "user", "content": results})
    messages.append({"role": "user", "content":
        f"You hit the {max_steps}-step limit. Do not call more tools. Summarise "
        "what you changed and what is still broken."})
    final = client.messages.create(model=MODEL, max_tokens=1000, tools=TOOLS,
                                   system=SYSTEM.format(root=ROOT), messages=messages)
    for b in final.content:
        if b.type == "text":
            print(f"\nassistant: {b.text}")

if __name__ == "__main__":
    messages = []
    print(f"agent in {ROOT} — ctrl-d to quit")
    while True:
        try:
            user = input("\nyou: ").strip()
        except (EOFError, KeyboardInterrupt):
            break
        if user:
            messages.append({"role": "user", "content": user})
            turn(messages)
```

That's the whole agent. Point it at a repo with a failing test.

## The parts nobody warns you about

| Symptom | Cause | Fix |
| --- | --- | --- |
| One `pytest` run eats the window | Unbounded results | Clip; say what you dropped |
| `edit_file` fails three times running | Whitespace mismatch, silent about it | Errors naming cause and next action |
| Agent writes outside the repo | `ROOT / path` returns `path` when absolute | One `resolve()` chokepoint |
| Same `ls` five times | No cap; uninformative results | `max_steps`, better results |
| Quality collapses mid-session | Context rot | Start fresh |

**Result size is the whole game.** Anthropic caps tool responses at [roughly 25,000 tokens by default in Claude Code](https://www.anthropic.com/engineering/writing-tools-for-agents); `Bash` output past 30,000 characters goes to a file and the model gets a path plus a short view. `clip()` is the crude version.

**Context rot is real and not a bug you can fix.** As the window fills, [recall of what's already in it degrades](https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents) — all models, different rates. Production answers: compaction, notes on disk, subagents returning 1,000–2,000-token summaries. The afternoon answer: restart.

**Infinite tool loops are usually your fault.** A model repeating a call is nearly always getting a result it can't act on — empty string, opaque exception, truncation with no hint. The step cap is a seatbelt; [explicit stopping conditions](https://www.anthropic.com/engineering/building-effective-agents) belong in every loop, but fix the results first.

**Don't point this at anything that matters.** Willison's [lethal trifecta](https://simonwillison.net/2025/Jun/16/the-lethal-trifecta/) — private data, untrusted content, external communication — is what an agent with `bash` and a network becomes the moment it reads a file containing instructions.

## What to do with it

The loop is commodity; the harness isn't. On the official [Terminal-Bench 2.0 leaderboard](https://www.tbench.ai/leaderboard/terminal-bench/2.0) the same Claude Opus 4.6 backbone spans 62.9% under one harness and 76.4% under another — sandboxing, context management, hooks, subagents, retrieval. So:

- Build it once, then read your harness's docs with this code in mind. The tool reference stops reading as trivia.
- When the agent misbehaves, suspect the tool result before the model. Print every result before it re-enters the conversation.
- Spend tuning time on tool descriptions and error strings, not the system prompt.
- Keep the permission prompt even when it annoys you. Deleting it is how you learn why file modification is gated by default.
