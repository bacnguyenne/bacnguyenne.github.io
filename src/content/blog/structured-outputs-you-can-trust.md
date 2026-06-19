---
title: "Structured outputs you can trust"
description: "A layered, runnable approach to reliable structured LLM outputs: pydantic schemas, json_schema enforcement, bounded validate-and-retry, and constrained decoding."
pubDate: "Jun 9 2026"
tags: [structured-output, tool-use, json]
---

## Why free-text parsing breaks

The first version of every extraction pipeline I write looks like this: prompt the model, get back text, run a regex or `json.loads`. It works in the demo and breaks in production. The model wraps JSON in ```` ```json ```` fences. It adds a chatty preamble ("Here is the data you requested:"). It emits trailing commas, single quotes, or `NaN`. It invents a field you didn't ask for and drops one you need. It returns a date as "next Tuesday". Every one of those is a parse failure or, worse, a silent type error three functions downstream.

The fix is not a better regex. It's to stop treating the output as text and start treating it as a typed value with a contract enforced at every layer the model passes through: define the shape, ask the server to enforce it, validate at the boundary, and retry deterministically when validation fails. For models you host yourself you can go one step further and make invalid tokens literally impossible to sample.

Here's the whole thing, end to end.

## Define the shape with pydantic

```bash
pip install "pydantic>=2.7" "openai>=1.40"
```

The schema is the source of truth. Use pydantic so the same object gives you the JSON Schema to send to the model *and* the runtime validator to check what comes back.

```python
from enum import Enum
from pydantic import BaseModel, Field, field_validator


class Priority(str, Enum):
    low = "low"
    medium = "medium"
    high = "high"


class Ticket(BaseModel):
    title: str = Field(..., min_length=3, max_length=120)
    priority: Priority
    component: str
    estimate_hours: float = Field(..., ge=0, le=200)
    blocked: bool = False

    @field_validator("component")
    @classmethod
    def lowercase_component(cls, v: str) -> str:
        return v.strip().lower()
```

`Ticket.model_json_schema()` emits a Draft 2020-12 schema. Constraints like `min_length`, `ge`, and the enum become part of that schema, so the server sees them too, not just your validator.

## Server-side enforcement on an OpenAI-compatible API

Don't ask for JSON in the prompt and hope. Pass the schema as a response format. Any endpoint that speaks the OpenAI protocol, a hosted provider or your own vLLM server, accepts `response_format` with `json_schema`.

```python
import os
from openai import OpenAI

client = OpenAI(
    base_url=os.environ.get("LLM_BASE_URL", "http://localhost:8000/v1"),
    api_key=os.environ.get("LLM_API_KEY", "not-needed-for-local"),
)
MODEL = os.environ.get("LLM_MODEL", "your-model")

schema = Ticket.model_json_schema()

resp = client.chat.completions.create(
    model=MODEL,
    messages=[
        {"role": "system", "content": "Extract a ticket from the user's report."},
        {"role": "user", "content": "Login page 500s on Safari after the SSO change. Urgent."},
    ],
    response_format={
        "type": "json_schema",
        "json_schema": {"name": "Ticket", "schema": schema, "strict": True},
    },
    temperature=0,
)
raw = resp.choices[0].message.content
```

`strict: True` tells compliant backends to honor the schema exactly. This dramatically cuts malformed output, but it is not a guarantee everywhere: some servers treat `json_schema` as a strong hint, older models ignore unknown keywords, and `additionalProperties` handling varies. So this layer reduces failures; it does not let you skip validation.

## Validate at the boundary with a bounded retry loop

The boundary is the one place where untrusted model output becomes a typed Python object. Validate there, and when it fails, feed the *exact validation error* back to the model so it can self-correct. The key is that the loop is bounded and every outcome is explicit: no infinite retries, no silent fallback.

```python
from pydantic import ValidationError


class Refusal(Exception):
    """Model declined or could not produce the data."""


class Truncated(Exception):
    """Output was cut off before completion."""


def extract_ticket(report: str, max_attempts: int = 3) -> Ticket:
    messages = [
        {"role": "system", "content": "Extract a ticket. If the report has no ticket, reply exactly REFUSE."},
        {"role": "user", "content": report},
    ]
    last_error = None

    for _ in range(max_attempts):
        resp = client.chat.completions.create(
            model=MODEL,
            messages=messages,
            response_format={
                "type": "json_schema",
                "json_schema": {"name": "Ticket", "schema": schema, "strict": True},
            },
            temperature=0,
            max_tokens=512,
        )
        choice = resp.choices[0]

        # Truncation is a first-class outcome, not a parse error.
        if choice.finish_reason == "length":
            raise Truncated("Hit max_tokens before finishing; raise the budget.")

        content = (choice.message.content or "").strip()
        if content == "REFUSE" or content == "":
            raise Refusal("Model declined to extract a ticket.")

        try:
            return Ticket.model_validate_json(content)
        except ValidationError as e:
            last_error = e
            # Append the bad output and the precise reason, then let it fix itself.
            messages.append({"role": "assistant", "content": content})
            messages.append({
                "role": "user",
                "content": (
                    "That response failed validation. Fix ONLY these errors and "
                    f"return valid JSON:\n{e}"
                ),
            })

    raise ValueError(f"Failed after {max_attempts} attempts: {last_error}")
```

Three things make this trustworthy. First, `finish_reason == "length"` is caught *before* parsing: a truncated object often parses as half-valid JSON and corrupts your data, so treat it as its own failure mode. Second, refusals are caught explicitly; a model that won't answer should raise, not return an empty `Ticket()`. Third, the retry feeds back `str(e)`, and pydantic's error messages name the field and the rule that broke ("estimate_hours: Input should be less than or equal to 200"), which is exactly the signal the model needs.

## Constrained decoding for models you host

Server enforcement plus validation handles hosted APIs. When you run the model yourself, you can remove the broken-JSON failure mode entirely. Constrained (guided) decoding masks the token logits at each step so only tokens that keep the output schema-valid can be sampled. The model *cannot* produce a missing brace or a string where an int belongs.

With vLLM, the portable path is the same `response_format` shown above, since vLLM's OpenAI-compatible server enforces it with a structured-outputs backend. Start the server:

```bash
pip install vllm
vllm serve your-org/your-model --port 8000
```

That alone makes the earlier `extract_ticket` enforce the schema during decoding. vLLM also accepts a `guided_json` field for the same effect when you want to bypass `response_format`; pass it through `extra_body`:

```python
resp = client.chat.completions.create(
    model=MODEL,
    messages=[
        {"role": "system", "content": "Extract a ticket from the user's report."},
        {"role": "user", "content": "DB migration failed in staging, low urgency."},
    ],
    extra_body={"guided_json": schema},
    temperature=0,
)
ticket = Ticket.model_validate_json(resp.choices[0].message.content)
```

If you're driving generation in-process instead of over HTTP, `outlines` does the same masking directly against a Hugging Face model. Note the v1 API: you build the model from an already-loaded model and tokenizer, then call it with `output_type`.

```bash
pip install outlines transformers torch
```

```python
import outlines
from transformers import AutoModelForCausalLM, AutoTokenizer

name = "your-org/your-model"
model = outlines.from_transformers(
    AutoModelForCausalLM.from_pretrained(name, device_map="auto"),
    AutoTokenizer.from_pretrained(name),
)

raw = model(
    "DB migration failed in staging, low urgency.",
    output_type=Ticket,
    max_new_tokens=512,
)
ticket = Ticket.model_validate_json(raw)  # outlines returns a JSON string
```

Constrained decoding guarantees the output *matches the grammar of the schema*: correct shape, correct types, valid enum members. It does not guarantee the values are semantically right; a constrained model can still pick the wrong `priority`. So you still validate, and you still keep the retry loop, but now the retries fire on semantics and `field_validator` logic, not on broken JSON. Two gotchas worth knowing: schema compilation adds a small startup cost (it's cached per schema, so warm the common ones), and deeply nested or recursive schemas compile slowly, so keep the shape flat where you can.

## Putting it together

The reliable stack is layered, and each layer does a job the others can't:

- **pydantic** — one definition gives you the wire schema and the runtime validator.
- **`response_format` / `json_schema`** — server-side enforcement; cuts most malformed output on any OpenAI-compatible endpoint.
- **validate-and-retry** — the boundary where text becomes a typed object; bounded loop that feeds the validation error back.
- **`guided_json` / outlines** — for self-hosted models, makes schema-invalid tokens unsamplable.
- **explicit refusal and truncation handling** — so "no answer" and "cut off" never masquerade as data.

What changed in my own code after adopting this: I stopped writing `try: json.loads(...) except: retry` and started returning typed objects with a guarantee. Downstream code can finally trust its inputs. The model is still allowed to be wrong about the world, but it is no longer allowed to be wrong about the *shape*, and that is the difference between a pipeline you babysit and one you forget about.
