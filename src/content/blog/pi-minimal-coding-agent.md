---
title: 'Pi: a coding agent small enough to read'
description: 'A hands-on tour of Pi 0.82.1 — install, the four default tools, session trees, all five extension points, and when a bigger harness wins.'
pubDate: 'Jul 24 2026'
tags: [llm, coding-agents, developer-tools]
---

## Why bother with a small harness

Most of what makes a coding agent good or bad is not the model. It's the harness — system prompt, tool definitions, the loop, how tool output gets rendered back into context. Vivek Trivedy's [anatomy of an agent harness](https://www.langchain.com/blog/the-anatomy-of-an-agent-harness) puts it as `Agent = Model + Harness`, and the [Terminal-Bench 2.0 leaderboard](https://www.tbench.ai/leaderboard/terminal-bench/2.0) backs the split: the same backbone moves several points depending on which harness drives it.

If the harness matters that much, it's worth using at least one you can read end to end. [Pi](https://github.com/earendil-works/pi) is that one: MIT, TypeScript, terminal-only, BYOK, by Mario Zechner (of libGDX), now developed at Earendil — he [wrote up the acquisition](https://mariozechner.at/posts/2026-04-08-ive-sold-out/) and committed to MIT staying permanent. 77,362 stars as of 25 July 2026, created August 2025.

I use Claude Code for my day job. I keep Pi installed because when something goes wrong, I can open the file that did it.

## Install and first run

Node 22.19.0 or newer is a hard requirement (`engines` in the package). There's a `legacy-node20` dist-tag pinned at 0.74.2 if you're stuck.

```bash
npm install -g --ignore-scripts @earendil-works/pi-coding-agent
# or: curl -fsSL https://pi.dev/install.sh | sh
pi --version   # 0.82.1 at the time of writing
```

The `--ignore-scripts` is not cargo-culting — the repo enforces it in its own build and pins external deps to exact versions.

Auth is BYOK, and "your K" can be a subscription. `/login` runs OAuth flows for ChatGPT Plus/Pro (Codex), Claude Pro/Max, GitHub Copilot, xAI, OpenRouter and Radius; tokens land in `~/.pi/agent/auth.json` at mode 0600 and refresh themselves. Or export a key — [the providers doc](https://pi.dev/docs/latest) lists 33 API-key providers (the landing page's "15+" undersells it). One caveat on Claude Pro/Max: pi's docs say third-party harness usage bills per token against Anthropic *extra usage*, not plan limits.

```bash
cd ~/work/canbus-tools
export ANTHROPIC_API_KEY=sk-ant-...
pi
```

Then the docs' own opening prompt, a decent smoke test for any harness:

```text
Summarize this repository and tell me how to run its checks.
```

Non-interactive modes are where it earns its keep in scripts:

```bash
pi -p "Summarize this codebase"                  # one-shot print
cat README.md | pi -p "Summarize this text"      # stdin merges into the prompt
pi @src/app.ts @src/app.test.ts "Review these together"
pi --model sonnet:high "Solve this complex problem"
```

Inside a session, `!npm run lint` runs a shell command and feeds the output to the model; `!!npm run lint` runs it and *doesn't*. That second one gets more use than I expected.

## Four tools, and three you have to ask for

Default tool set: `read`, `write`, `edit`, `bash`. That's it. Three more read-only built-ins ship but are off by default — `grep`, `find`, `ls` — because with `bash` on, the prompt just says "use bash for file operations like ls, rg, find."

That prompt is assembled from the tools you actually enabled. I pulled the template out of the installed `dist/core/system-prompt.js`: it opens with "You are an expert coding assistant operating inside pi, a coding agent harness", lists the enabled tools, derives its guidelines from that same list, then appends absolute paths to pi's own README and docs so the agent can read its own manual on demand. About 178 words before substitution. Zechner's [origin post](https://mariozechner.at/posts/2025-11-30-pi-coding-agent/) claims prompt plus tool definitions come in under 1000 tokens — I didn't token-count it, but the shape is consistent. In the same post he measures Playwright MCP at 21 tools / 13.7k tokens and Chrome DevTools MCP at 26 tools / 18k: 7–9% of a context window spent before you type anything.

Narrow it further per run:

```bash
pi --tools read,grep,find,ls -p "Review the code in src/"   # read-only audit
pi --no-builtin-tools                                        # keep only your own tools
```

## Sessions are a tree, not a log

The feature I'd steal for my own harness. Sessions auto-save to `~/.pi/agent/sessions/`, one JSONL file per session, organised by working directory. Every entry carries `id` and `parentId` — the file is a tree, your position is the active leaf.

`/tree` navigates it in place. Select a *user* message and the leaf moves to its parent with that text back in the editor, ready to edit and resubmit as a new branch. Select an assistant or tool entry and you continue from there. `Ctrl+O` cycles filter modes, `Shift+L` labels a node, and leaving a branch offers to attach a summary of what it found. `/fork` and `/clone` do the same thing into a *new* file — from a user-message selector and from the current branch respectively.

From the CLI:

```bash
pi -c                            # continue most recent
pi -r                            # browse and pick
pi --session 3f2a               # partial UUID works
pi --session-id nightly-audit   # exact ID, created if missing
pi --fork 3f2a
pi --no-session                 # write nothing
pi --name "release audit" -p "Audit this repository"
```

`--session-id` is the one to know for automation — deterministic identity, so a cron job resumes its own thread. It's in `pi --help` for 0.82.1 but absent from `usage.md`, `sessions.md` and the READMEs — treat the help string as the spec.

Bash calls also get session metadata as env vars: `PI_SESSION_ID`, `PI_SESSION_FILE`, `PI_PROVIDER`, `PI_MODEL`, `PI_REASONING_LEVEL`. That's what makes "spawn `pi` from bash instead of building a sub-agent tool" workable — every step stays in the parent's visible transcript.

## The five extension points

Pi's [design principles](https://pi.dev/docs/latest) are explicit: keep the core small, push workflow-specific behaviour out. No built-in MCP, sub-agents, permission popups, plan mode, to-dos, background bash. Armin Ronacher's [write-up](https://lucumr.pocoo.org/2026/1/31/pi/) describes the intended loop as asking the agent to extend itself rather than installing someone else's extension — what the [Pragmatic Engineer piece](https://newsletter.pragmaticengineer.com/p/building-pi-and-what-makes-self-modifying) calls self-modifying software.

**1. Prompt templates.** Cheapest thing that works. Markdown in `~/.pi/agent/prompts/` or `.pi/prompts/`; filename becomes the command. Discovery is non-recursive.

```markdown
---
description: Review a diff against our CAN-stack conventions
argument-hint: <base-ref> [path]
---
Diff `${2:-.}` against $1. Flag: blocking calls in ISR paths,
unchecked DBC signal ranges, and any `float` in a message struct.
```

Save as `review.md`, get `/review origin/main src/can/`. Arguments support `$1`, `$@`, `${1:-default}`, `${@:N:L}`.

**2. Skills.** Pi implements the [Agent Skills standard](https://agentskills.io/specification): a directory with a `SKILL.md` whose frontmatter needs `name` and `description`. Only those two go into the system prompt; the model `read`s the body when it looks relevant, or you force it with `/skill:name`.

```bash
mkdir -p .pi/skills/dbc-decode
cat > .pi/skills/dbc-decode/SKILL.md <<'EOF'
---
name: dbc-decode
description: Decode raw CAN frames using the DBC files in vehicle/dbc/. Use when the user pastes hex frames or asks what a CAN ID means.
---
# Decoding
1. `rg "^BO_ <id>" vehicle/dbc/*.dbc` to find the message.
2. Signals are `SG_ name : start|len@order+/- (factor,offset) [min|max]`.
3. Little-endian is `@1`, big-endian `@0`. Report physical units, not raw counts.
EOF
```

The underrated part is portability: pi's docs show putting `~/.claude/skills` and `~/.codex/skills` straight into the `skills` array of `settings.json`. Same directories, three agents.

**3. TypeScript extensions.** The real API. Modules in `~/.pi/agent/extensions/*.ts` (global) or `.pi/extensions/` (project, loaded only after you trust it), exporting a default function that receives an `ExtensionAPI`.

```ts
// ~/.pi/agent/extensions/no-generated-writes.ts
import type { ExtensionAPI } from "@earendil-works/pi-coding-agent";

export default function (pi: ExtensionAPI) {
  // Subscribe to tool_call and return { block: true, reason } to veto.
  // Exact subscription signature: read examples/extensions/dirty-repo-guard.ts
  // in the installed package — it changes faster than any blog post.
}
```

Try it without installing anything: `pi -e ./no-generated-writes.ts`; `/reload` hot-reloads the auto-discovered locations. What the API gives you: `pi.registerTool()` with typebox schemas, `pi.registerCommand()` for slash commands, event subscriptions (`session_start`, `tool_call`, model/agent/session events), blocking or rewriting tool calls, `ctx.ui` for select/confirm/input and full custom TUI components, custom renderers, session-persistent state via `pi.appendEntry()`, custom compaction, and extension-registered CLI flags.

Read the ~50 shipped examples first — they're the actual documentation:

```bash
ls "$(npm root -g)/@earendil-works/pi-coding-agent/examples/extensions"
# confirm-destructive.ts  git-checkpoint.ts  dirty-repo-guard.ts
# custom-compaction.ts  dynamic-tools.ts  handoff.ts  modal-editor.ts ...
```

**4. Themes.** JSON files against a published schema, built-in `dark` and `light`, `--theme <path>` or `~/.pi/agent/themes/*.json`, hot-reloaded by `/reload`. Nothing more to say — that's the point.

**5. Packages.** Bundle any of the above for npm or git distribution.

```bash
pi install npm:@foo/bar@1.0.0
pi install git:github.com/user/repo@v1
pi install ./relative/path
pi -e npm:@foo/bar          # try it for one run, temp dir, no install
pi list
pi config                   # TUI to enable/disable resources
```

The [gallery at pi.dev/packages](https://pi.dev/packages) lists roughly 48, and what it reveals is that the community is systematically re-adding what the core refuses to ship — `pi-mcp-adapter`, `pi-subagents`, `@narumitw/pi-plan-mode`, `@gotgenes/pi-permission-system`, `@juicesharp/rpiv-todo`, `pi-lens` for LSP and linters, tracing from Braintrust and Raindrop. That's the design working, not failing: the core stays tiny, and you pay the 18k-token MCP tax only in the repo that needs it.

## Where a bigger harness is the better call

| You want | Claude Code / Codex | Pi 0.82.1 |
| --- | --- | --- |
| OS-level sandbox | Seatbelt / bubblewrap, network proxy, credential masking | **None, by design** — containers or a Gondolin micro-VM |
| Permission prompts | deny→ask→allow rules, permission modes, classifiers | None in core; community `pi-permission-system` |
| MCP servers | built in | `pi-mcp-adapter` package |
| Sub-agents | `Agent` tool, 20 concurrent, worktree isolation | spawn `pi` from bash |
| Plan mode / to-dos | built in | community packages |
| Background work | background agents | tmux |
| IDE / web / mobile / CI surfaces | all of them | terminal, SDK, RPC |
| Skills | yes | yes — reads `~/.claude/skills` directly |

The sandbox row should decide it. Pi's security doc says flatly: "Pi does not include a built-in sandbox." Tools and extensions run with the pi process's permissions, and prompt injection from repo content is described as expected local-agent risk. The reasoning is defensible — a partial in-process sandbox is worse than none because people mistake it for a boundary — but the isolation becomes your job. Compare [Claude Code's sandboxing docs](https://code.claude.com/docs/en/sandboxing), candid about the limits of even a real sandbox (domain fronting, `docker.sock` escapes), and its [permission model](https://code.claude.com/docs/en/permissions.md), whose key sentence is "permission rules are enforced by Claude Code, not by the model."

Point an agent at a repo you didn't write, with credentials on the box and network egress, and you have assembled Simon Willison's [lethal trifecta](https://simonwillison.net/2025/Jun/16/the-lethal-trifecta/). Pi won't save you. Run it in a container.

Two more limits. Cadence: roughly ten releases in the past month (0.80.3 on 30 June through 0.82.1 on 25 July). Small and readable does not mean stable — pin a version in CI. And benchmarks: Zechner ran pi on Terminal-Bench 2.0 with Claude Opus 4.5, five trials per task, and reported placing competitively — but no numeric score appears in readable text in that post. Anyone quoting you a pi Terminal-Bench percentage is quoting an image.

Note where this code has landed already: [OpenClaw](https://github.com/openclaw/openclaw) credits Zechner in its README and pins `@earendil-works/pi-tui` at 0.81.1. Reading pi is partly reading the plumbing under other tools.

## What to actually do

Run it against a scratch repo first, read-only: `pi --tools read,grep,find,ls -p "Explain the build"`. No surprises, and you see the whole loop in one screen.

Move one workflow you currently paste from a notes file into a prompt template. Ten minutes, and it works in every session afterwards.

If you already keep skills for Claude Code or Codex, point pi's `skills` setting at those directories instead of copying them. One source of truth across three agents is the highest-value item here.

Read `examples/extensions/` before writing an extension, and read `dist/core/system-prompt.js` once regardless. Knowing exactly what your agent was told beats guessing at it.

And when you're cleaning up after a bad run, use `/tree` instead of scrolling — branching off the message where it went wrong beats re-explaining context to a fresh session.
