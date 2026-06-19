---
title: "Building an MCP server and wiring it to an agent"
description: "Build a typed MCP server in Python, run it over stdio and HTTP, wire it into Cursor, and drive it from a custom client and an OpenAI-compatible model."
pubDate: "Jun 19 2026"
tags: [mcp, agents, tools]
---

## Why MCP exists

Before the Model Context Protocol, every agent integration was a one-off. If I wanted a model to read my issue tracker, run a database query, or fetch a file, I wrote bespoke glue for that specific agent runtime and that specific tool. Swap the runtime and I rewrote everything.

MCP standardizes that contract. A server exposes **tools** (functions the agent can call), **resources** (read-only data the agent can pull in, addressed by URI), and **prompts** (reusable templates). A client speaks the same protocol regardless of who wrote the server. Build one server and it works in any MCP-aware host: an IDE like Cursor, or your own Python process.

In this post I stand up a real server, run it over both stdio and HTTP, wire it into Cursor, then drive it from a custom Python client. Everything below is runnable, and I ran it against `mcp` 1.28 to confirm the output.

## Install and pin

I use `uv`, but `pip` works identically. The package is `mcp`, which ships the `FastMCP` server class and the client primitives. The protocol still evolves, so I pin a lower and upper bound rather than chasing latest.

```bash
uv init mcp-demo && cd mcp-demo
uv add "mcp[cli]>=1.26,<2.0"
# or: pip install "mcp[cli]>=1.26,<2.0"
```

The `[cli]` extra pulls in the `mcp` command used for the dev inspector. Confirm it imports:

```bash
uv run python -c "from mcp.server.fastmcp import FastMCP; print('ok')"
```

## A real server: typed tool + resource

Here is `server.py`. It exposes one tool that does something non-trivial (word frequency over text) and one resource (a parameterized lookup). The point is the **typing**: FastMCP reads the Python signature and type hints, generates the JSON Schema the agent sees, and validates incoming arguments against it. I add explicit guards on top because schema validation is necessary but not sufficient.

```python
# server.py
from collections import Counter
from pydantic import BaseModel, Field
from mcp.server.fastmcp import FastMCP

mcp = FastMCP("text-tools")

# Tiny in-memory "database" the resource reads from.
NOTES = {
    "welcome": "MCP standardizes tools and resources for agents.",
    "pin": "Always bound your protocol dependency version.",
}


class WordCount(BaseModel):
    """Structured result so the client gets typed output, not just a string."""
    total_words: int = Field(description="Total word count")
    unique_words: int = Field(description="Distinct words")
    top: list[tuple[str, int]] = Field(description="Most common words")


@mcp.tool()
def word_frequency(text: str, top_n: int = 3) -> WordCount:
    """Count words in `text` and return the `top_n` most common."""
    # Validate args yourself: never trust the caller, even with a schema.
    if not text.strip():
        raise ValueError("text must not be empty")
    if not 1 <= top_n <= 50:
        raise ValueError("top_n must be between 1 and 50")

    words = [w.lower() for w in text.split() if w.isalpha()]
    counts = Counter(words)
    return WordCount(
        total_words=len(words),
        unique_words=len(counts),
        top=counts.most_common(top_n),
    )


@mcp.resource("note://{key}")
def get_note(key: str) -> str:
    """Return a stored note by key."""
    if key not in NOTES:
        raise ValueError(f"unknown note: {key}")
    return NOTES[key]


if __name__ == "__main__":
    mcp.run()  # defaults to stdio
```

Because the tool returns a Pydantic model, FastMCP emits both a human-readable text block and a `structuredContent` payload the client can parse directly. That is the difference between an agent guessing at a string and getting real fields back.

## Run it: stdio and HTTP

**stdio** is the default. The host launches your script as a subprocess and talks over stdin/stdout. This is what an IDE uses for a local server, and it needs no network.

```bash
uv run python server.py
```

For a server that runs as a standalone service (containerized, shared across machines), use **streamable HTTP**. Change the run call:

```python
if __name__ == "__main__":
    mcp.run(transport="streamable-http")  # serves on http://127.0.0.1:8000/mcp
```

```bash
uv run python server.py
# now listening on http://127.0.0.1:8000/mcp
```

Pick stdio for local, single-user tools; pick HTTP when the server is a deployed service. The tool and resource code is identical either way — only the transport changes.

## Debug with the inspector first

Before wiring any agent in, I always confirm the server works in isolation. The inspector is a web UI that connects, lists everything, and lets me invoke tools by hand. It runs through `npx`, so you need Node.js (18+) on `PATH` for this step.

```bash
uv run mcp dev server.py
```

That launches the server and opens the inspector in a browser. Click into **Tools**, call `word_frequency` with sample text, and watch both the text result and the structured output. Open **Resources** and read `note://welcome`. If it works here and fails in an agent, the problem is the wiring, not the server — that split saves real time.

## Wire it into Cursor

Cursor reads MCP config from a project file: `.cursor/mcp.json`. For the stdio server, point it at the script. Because Cursor does not run inside your project's virtualenv, give it a command that resolves the environment itself — `uv run` from the project root does that.

```json
{
  "mcpServers": {
    "text-tools": {
      "command": "uv",
      "args": ["run", "python", "server.py"],
      "env": {}
    }
  }
}
```

If you went the HTTP route instead, start the server first, then reference the URL:

```json
{
  "mcpServers": {
    "text-tools": {
      "url": "http://127.0.0.1:8000/mcp"
    }
  }
}
```

Reload Cursor, open Settings and find the MCP section — the server should show green with its tools listed. Now the agent can call `word_frequency` and read `note://` resources in chat.

## Drive it from a custom Python client

The same server is callable from plain Python. This client launches the stdio server, lists tools, and makes one real typed call. No agent framework, just the protocol.

```python
# client.py
import asyncio
from mcp import ClientSession, StdioServerParameters, types
from mcp.client.stdio import stdio_client

params = StdioServerParameters(command="uv", args=["run", "python", "server.py"])


async def main() -> None:
    async with stdio_client(params) as (read, write):
        async with ClientSession(read, write) as session:
            await session.initialize()

            tools = await session.list_tools()
            print("tools:", [t.name for t in tools.tools])

            result = await session.call_tool(
                "word_frequency",
                {"text": "mcp makes agents portable and mcp is simple", "top_n": 2},
            )
            # Structured output comes back as parsed fields:
            print("structured:", result.structuredContent)

            # Resources are read by URI:
            note = await session.read_resource(types.AnyUrl("note://pin"))
            print("note:", note.contents[0].text)


if __name__ == "__main__":
    asyncio.run(main())
```

```bash
uv run python client.py
# tools: ['word_frequency']
# structured: {'total_words': 8, 'unique_words': 7, 'top': [['mcp', 2], ['makes', 1]]}
# note: Always bound your protocol dependency version.
```

Note that `top` returns as nested lists, not tuples — JSON has no tuple type, so the round-trip flattens them. To connect a client to the **HTTP** server instead, swap the transport; everything after `session.initialize()` is unchanged:

```python
from mcp.client.streamable_http import streamablehttp_client

async with streamablehttp_client("http://127.0.0.1:8000/mcp") as (read, write, _):
    async with ClientSession(read, write) as session:
        await session.initialize()
        ...
```

## Connecting it to a model

The client above lists and calls tools deterministically. To let a model decide, hand the tool list to any OpenAI-compatible endpoint — a self-hosted vLLM server or any provider — and execute the calls it returns. The MCP tool schema maps straight onto the function-calling format. I run the model on a different port than the MCP HTTP server (8000) to avoid a collision:

```python
import json
from openai import OpenAI

llm = OpenAI(base_url="http://localhost:8001/v1", api_key="not-needed-locally")

# tools.tools comes from session.list_tools() above
oai_tools = [
    {
        "type": "function",
        "function": {
            "name": t.name,
            "description": t.description,
            "parameters": t.inputSchema,
        },
    }
    for t in tools.tools
]

resp = llm.chat.completions.create(
    model="your-model",
    messages=[{"role": "user", "content": "Count words in: hello hello world"}],
    tools=oai_tools,
)

# For each tool call the model returns, dispatch it back through MCP:
for call in resp.choices[0].message.tool_calls or []:
    args = json.loads(call.function.arguments)
    out = await session.call_tool(call.function.name, args)
    print(out.structuredContent)  # feed this back into the next messages turn
```

That loop — model picks a tool, you execute it via MCP, return the result — is the whole agent pattern. MCP is the part that stays stable while models and runtimes churn.

## Security gotchas

A few things I've been burned by, worth getting right from the start:

- **Validate arguments in the function body.** The JSON Schema constrains types, not intent. My `top_n` bound and empty-text check live in Python because the schema can't express "this would be expensive" or "this is nonsense."
- **Don't expose dangerous tools.** A tool that runs shell commands or arbitrary SQL is a remote-code-execution primitive the moment an agent (or a prompt injection feeding it) calls it. If you must, allowlist exact operations — never pass through free-form input to `os.system` or an unparameterized query.
- **Resources can leak.** `note://{key}` only reads a fixed dict. The instant a resource maps a parameter to a filesystem path, you've built a path-traversal hole — `note://../../etc/passwd`. Resolve and confirm the path stays inside an allowed root.
- **Treat the host as untrusted.** Your server may be invoked by an agent acting on adversarial input. Assume every argument is hostile and fail loudly with a clear error rather than doing something destructive quietly.

You now have a typed MCP server running over stdio and HTTP, verified in the inspector, callable from Cursor and from your own Python — with the validation discipline to keep it safe.
