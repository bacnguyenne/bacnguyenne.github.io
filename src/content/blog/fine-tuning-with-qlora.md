---
title: "Fine-tuning an open model with QLoRA"
description: "A hands-on QLoRA fine-tuning walkthrough: dataset prep, 4-bit training with peft and trl, merging, and vLLM serving behind an OpenAI-compatible API."
pubDate: "Jun 11 2026"
tags: [fine-tuning, training, llmops]
---

## Decide first: fine-tune, RAG, or just a better prompt

Before I touch a GPU, I make myself answer one question: what is actually failing? Fine-tuning is the wrong reflex for most problems people reach for it with.

- **The model lacks *knowledge* (facts, docs, fresh data).** That's retrieval, not fine-tuning. Weights are a terrible database — they go stale, they hallucinate, and you can't cite them. Use RAG.
- **The model can do the task but won't reliably follow the *format/style/policy*.** Try the prompt first: a system prompt, a few in-context examples, and structured decoding (`outlines`, or the constrained-decoding path in your serving stack) solve a surprising amount.
- **The model knows the domain but the *behavior* is wrong** — wrong tone, wrong output shape every time, a narrow task you call thousands of times a day and want cheaper, faster, and more consistent. That's what fine-tuning is for.

QLoRA fits the last bucket: you're teaching behavior, not facts, and you want it on one consumer-ish GPU. If you can't write 200 good examples of the behavior you want, you're not ready to fine-tune — you have a spec problem, not a training problem.

## Prepare a small instruction dataset

Format matters more than volume. I use the chat format and let the tokenizer's chat template handle special tokens — never hand-roll `<|im_start|>` strings, you'll get them subtly wrong.

A record is just a list of messages:

```json
{"messages": [
  {"role": "system", "content": "You extract structured fields from maintenance logs."},
  {"role": "user", "content": "Log: oil pressure low at 80C, idle rough since Tuesday."},
  {"role": "assistant", "content": "{\"symptom\": \"low oil pressure\", \"temp_c\": 80, \"since\": \"Tuesday\"}"}
]}
```

Here's a small builder that writes JSONL. In practice these come from curated examples, accepted production outputs, or human-corrected ones — not synthetic slop you never read.

```python
# build_dataset.py
import json
import random

SYSTEM = "You extract structured fields from maintenance logs. Reply with JSON only."

raw = [
    ("oil pressure low at 80C, idle rough since Tuesday",
     {"symptom": "low oil pressure", "temp_c": 80, "since": "Tuesday"}),
    ("coolant leak under the water pump, smell of antifreeze",
     {"symptom": "coolant leak", "temp_c": None, "since": None}),
    # ... aim for a few hundred real, varied examples
]

def to_record(user_text, fields):
    return {"messages": [
        {"role": "system", "content": SYSTEM},
        {"role": "user", "content": f"Log: {user_text}"},
        {"role": "assistant", "content": json.dumps(fields, ensure_ascii=False)},
    ]}

random.seed(0)
records = [to_record(u, f) for u, f in raw]
random.shuffle(records)
n_val = max(1, len(records) // 10)

with open("train.jsonl", "w") as f:
    for r in records[n_val:]:
        f.write(json.dumps(r, ensure_ascii=False) + "\n")
with open("val.jsonl", "w") as f:
    for r in records[:n_val]:
        f.write(json.dumps(r, ensure_ascii=False) + "\n")
```

```bash
python build_dataset.py
```

Hold out a real validation split and actually look at it. Deduplicate near-identical rows; they inflate your loss curve and teach nothing.

## The QLoRA stack

QLoRA = load the base model in 4-bit (NF4), freeze it, and train small low-rank adapters on top in higher precision. Memory drops enough to fit a 7-8B model on a single 16-24 GB GPU.

```bash
python -m venv .venv && source .venv/bin/activate
pip install --upgrade pip

# Match the CUDA build to your driver; cu124 wheels work on most current setups.
pip install "torch>=2.5" --index-url https://download.pytorch.org/whl/cu124
pip install "transformers>=4.46" "trl>=0.12" "peft>=0.13" \
            "bitsandbytes>=0.44" "datasets>=3.0" "accelerate>=1.0"
```

The two configs that define a QLoRA run:

```python
# qlora_config.py
import torch
from transformers import BitsAndBytesConfig
from peft import LoraConfig

bnb_config = BitsAndBytesConfig(
    load_in_4bit=True,
    bnb_4bit_quant_type="nf4",          # NF4 beats plain int4 for weights
    bnb_4bit_use_double_quant=True,     # quantize the quant constants too
    bnb_4bit_compute_dtype=torch.bfloat16,
)

lora_config = LoraConfig(
    r=16,                # rank: 8-32 is the useful range
    lora_alpha=32,       # alpha ~= 2*r is a sane default
    lora_dropout=0.05,
    bias="none",
    task_type="CAUSAL_LM",
    target_modules=[     # attention + MLP projections
        "q_proj", "k_proj", "v_proj", "o_proj",
        "gate_proj", "up_proj", "down_proj",
    ],
)
```

`target_modules` is the lever people get wrong. Adapting only attention is cheap but often underfits; including the MLP projections (`gate/up/down`) usually helps for behavior changes. Use `bfloat16` for compute if your GPU supports it (Ampere or newer); on older cards fall back to `torch.float16`.

## The training script

`trl`'s `SFTTrainer` handles chat templating, packing, and the masking so loss is computed on assistant turns. The cleanest path now is to hand the trainer your `LoraConfig` via `peft_config` — it wraps the quantized model and prepares it for k-bit training internally, so I don't call `get_peft_model` myself. I keep the script boring on purpose.

```python
# train.py
import torch
from datasets import load_dataset
from transformers import AutoModelForCausalLM, AutoTokenizer
from trl import SFTConfig, SFTTrainer
from qlora_config import bnb_config, lora_config

BASE = "your-org/your-base-model"   # any open 7-8B chat/base model on the Hub

tok = AutoTokenizer.from_pretrained(BASE)
if tok.pad_token is None:
    tok.pad_token = tok.eos_token

model = AutoModelForCausalLM.from_pretrained(
    BASE,
    quantization_config=bnb_config,
    device_map="auto",
    dtype=torch.bfloat16,   # `torch_dtype` is deprecated in current transformers
)

ds = load_dataset("json", data_files={"train": "train.jsonl", "val": "val.jsonl"})

args = SFTConfig(
    output_dir="out",
    num_train_epochs=3,
    per_device_train_batch_size=2,
    gradient_accumulation_steps=8,      # effective batch = 16
    learning_rate=2e-4,                 # LoRA tolerates higher LR than full FT
    lr_scheduler_type="cosine",
    warmup_ratio=0.03,
    logging_steps=10,
    eval_strategy="epoch",
    save_strategy="epoch",
    bf16=True,
    max_length=1024,                    # renamed from max_seq_length in trl 0.12+
    packing=True,                       # pack short samples to fill the window
    gradient_checkpointing=True,
    gradient_checkpointing_kwargs={"use_reentrant": False},  # avoids the QLoRA grad bug
    report_to="none",
)

trainer = SFTTrainer(
    model=model,
    args=args,
    train_dataset=ds["train"],
    eval_dataset=ds["val"],
    processing_class=tok,
    peft_config=lora_config,            # trainer attaches LoRA + preps for k-bit
)
trainer.train()
trainer.save_model("out/adapter")       # saves the LoRA adapter only
tok.save_pretrained("out/adapter")
```

```bash
python train.py
```

A couple of gotchas that cost me real time. `gradient_checkpointing_kwargs={"use_reentrant": False}` is not optional with QLoRA — the reentrant default silently breaks gradient flow through the adapters and you get a flat loss. And watch eval loss, not just train loss: if eval turns up while train keeps falling, you're memorizing — cut epochs or add data. With a few hundred clean examples, 2-3 epochs is usually plenty.

## Merge the adapter back

For serving I merge the adapter into the base weights and save fp16. You merge into the *un-quantized* base, not the 4-bit one — merging into a quantized model is lossy and not what you want.

```python
# merge.py
import torch
from transformers import AutoModelForCausalLM, AutoTokenizer
from peft import PeftModel

BASE = "your-org/your-base-model"

base = AutoModelForCausalLM.from_pretrained(
    BASE, dtype=torch.float16, device_map="cpu",
)
merged = PeftModel.from_pretrained(base, "out/adapter").merge_and_unload()
merged.save_pretrained("merged-model", safe_serialization=True)
AutoTokenizer.from_pretrained("out/adapter").save_pretrained("merged-model")
```

```bash
python merge.py
```

You can also skip merging and serve the adapter directly — vLLM loads LoRA adapters at runtime, which is handy when you have many adapters over one base. For a single tuned model, merging is simpler.

## Serve with vLLM

```bash
pip install vllm
vllm serve ./merged-model \
  --served-model-name your-model \
  --max-model-len 4096
```

That exposes an OpenAI-compatible endpoint. I hit it with the OpenAI SDK so the same client code runs against self-hosted vLLM or any compatible provider — only `base_url` and `api_key` change:

```python
# call.py
from openai import OpenAI

client = OpenAI(base_url="http://localhost:8000/v1", api_key="not-needed")

resp = client.chat.completions.create(
    model="your-model",
    messages=[
        {"role": "system", "content": "You extract structured fields from maintenance logs. Reply with JSON only."},
        {"role": "user", "content": "Log: brake pads worn, squealing on left front for two weeks."},
    ],
    temperature=0,
)
print(resp.choices[0].message.content)
```

## Quick before/after eval

Don't trust vibes. Run the same held-out prompts through the base model and the tuned one, and score them with something concrete. For JSON extraction I check parse rate and exact-field match:

```python
# eval.py
import json
from openai import OpenAI

client = OpenAI(base_url="http://localhost:8000/v1", api_key="not-needed")

def score(model, rows):
    parsed = exact = 0
    for msgs, gold in rows:
        out = client.chat.completions.create(
            model=model, messages=msgs, temperature=0,
        ).choices[0].message.content
        try:
            pred = json.loads(out)
        except json.JSONDecodeError:
            continue
        parsed += 1
        exact += int(pred == gold)
    n = len(rows)
    return {"parse_rate": parsed / n, "exact_match": exact / n}

# load a few dozen held-out (messages, gold_dict) pairs, then:
# print(score("your-model", rows))
```

Serve the base model under a different name and compare on the *same* rows. A real win looks like a jump in parse rate plus higher exact-match, not a cherry-picked example.

## When QLoRA is enough — and when it isn't

QLoRA is the right tool when you're shaping behavior: output format, tone, a narrow repeated task, light domain adaptation. It's cheap, fast, and the adapters are tiny to store and swap.

Reach for **full fine-tuning** when you need to move the model's core capabilities — large-scale domain shift (a new language, a very different code distribution) or pretraining-scale continued training. At that point the low-rank bottleneck of LoRA is the limitation, and you have the budget anyway.

And the part nobody wants to hear: I've never once been saved by a clever learning-rate schedule. Every meaningful jump came from fixing the data — removing contradictory labels, balancing the cases, writing harder examples, looking at what the model got wrong and adding exactly those. Spend your time there. Hyperparameters are rounding error next to label quality.
