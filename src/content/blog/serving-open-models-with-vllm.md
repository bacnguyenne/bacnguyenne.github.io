---
title: "Serving open models with vLLM"
description: "Hands-on guide to self-hosting open-weights LLMs with vLLM: install, serve an OpenAI-compatible API, quantize, benchmark, and manage VRAM."
pubDate: "Jun 20 2026"
tags: [llmops, inference, self-hosting]
---

## Why run it yourself

If you ship anything privacy-sensitive (medical transcripts, in-car data, proprietary documents) or you need predictable cost at high volume, self-hosting an open-weights model starts to make sense. vLLM is the tool I reach for. It serves an OpenAI-compatible API, so your existing client code doesn't change, and it's built around the throughput tricks (continuous batching, paged attention) that make a single GPU go a long way.

This is the end-to-end version: install, serve, call, quantize, measure, and know when to walk away and use a hosted API instead.

## Install

vLLM ships prebuilt CUDA wheels. The only hard prerequisite is a recent NVIDIA driver; the CUDA runtime is bundled in the wheel, so you don't need a system CUDA toolkit for inference. Python 3.10 or newer.

```bash
python -m venv .venv
source .venv/bin/activate
pip install -U pip
# include the bench extra now so the load test later just works
pip install "vllm[bench]"
```

Sanity-check the GPU and the installed version:

```bash
nvidia-smi
python -c "import vllm; print(vllm.__version__)"
```

If you're on a locked-down cluster with an older driver, the Docker image is the path of least resistance because it pins a known-good CUDA stack:

```bash
docker run --gpus all --ipc=host -p 8000:8000 \
  -v ~/.cache/huggingface:/root/.cache/huggingface \
  vllm/vllm-openai:latest \
  --model Qwen/Qwen2.5-7B-Instruct
```

Mount the Hugging Face cache so you don't re-download weights on every container restart. For gated models, add `-e HF_TOKEN=...`.

## Start the server

The command is `vllm serve`. Everything else is flags.

```bash
vllm serve Qwen/Qwen2.5-7B-Instruct \
  --max-model-len 8192 \
  --gpu-memory-utilization 0.90 \
  --port 8000
```

The flags that actually matter:

- `--max-model-len` caps the context window (prompt + output). It directly sizes the KV cache. Asking for the model's full 128k context when you only ever send 8k of prompt wastes enormous VRAM. Set it to what you actually need.
- `--gpu-memory-utilization` is the fraction of VRAM vLLM is allowed to claim (default 0.9). Weights load first; the rest becomes KV cache. Push it to 0.92-0.95 if the box does nothing else; drop it if you share the GPU.
- `--tensor-parallel-size` shards the model across N GPUs. Use it when one model doesn't fit on one card. It must divide the attention-head count evenly; in practice keep it a power of two.
- `--quantization` selects the quant scheme (more below). It's auto-detected from the checkpoint, so you only set it explicitly for runtime quant like FP8.

A 70B across two cards looks like this:

```bash
vllm serve meta-llama/Llama-3.3-70B-Instruct \
  --tensor-parallel-size 2 \
  --max-model-len 8192 \
  --gpu-memory-utilization 0.92
```

Wait for the `Application startup complete` log line and confirm the server is live before you point clients at it:

```bash
curl http://localhost:8000/v1/models
```

## Call it with the OpenAI SDK

vLLM speaks the OpenAI Chat Completions API. Point the SDK at your `base_url`. The `api_key` is whatever you set with `--api-key` on the server, or any non-empty string if you didn't set one.

```bash
pip install openai
```

```python
from openai import OpenAI

client = OpenAI(base_url="http://localhost:8000/v1", api_key="local-key")

resp = client.chat.completions.create(
    model="Qwen/Qwen2.5-7B-Instruct",  # must match what you served
    messages=[
        {"role": "system", "content": "You are concise."},
        {"role": "user", "content": "Explain paged attention in two sentences."},
    ],
    temperature=0.2,
    max_tokens=200,
)
print(resp.choices[0].message.content)
```

Streaming is the same call with `stream=True`:

```python
stream = client.chat.completions.create(
    model="Qwen/Qwen2.5-7B-Instruct",
    messages=[{"role": "user", "content": "Write a short poem about the KV cache."}],
    stream=True,
)
for chunk in stream:
    delta = chunk.choices[0].delta.content
    if delta:
        print(delta, end="", flush=True)
print()
```

Because it's the standard API, the same code runs against a hosted provider by swapping `base_url` and `api_key`. That portability is the whole point: I keep one client and decide where it points per workload.

## Quantization: the memory/quality tradeoff

Quantization shrinks weights so a bigger model fits, or a smaller one frees up VRAM for more KV cache (more concurrent requests). The two schemes I reach for:

- **AWQ / GPTQ (4-bit)**: roughly a 4x reduction in weight memory. You serve a pre-quantized checkpoint from Hugging Face and vLLM detects the scheme. There's a measurable quality drop, usually small on instruction-following, larger on hard reasoning and code. AWQ kernels tend to be the faster of the two in vLLM.
- **FP8**: near-lossless on Hopper-class and newer GPUs, with a throughput win because the hardware has native FP8 paths. Roughly half the weight memory of FP16. This is my default when the GPU supports it and I care about quality.

Serving a pre-quantized 4-bit checkpoint needs no special flag, since the scheme is recorded in the checkpoint config:

```bash
vllm serve Qwen/Qwen2.5-7B-Instruct-AWQ \
  --max-model-len 8192 \
  --gpu-memory-utilization 0.90
```

Runtime FP8 (quantize an FP16 checkpoint on load) is one flag:

```bash
vllm serve Qwen/Qwen2.5-7B-Instruct \
  --quantization fp8 \
  --max-model-len 8192
```

You can also quantize the KV cache with `--kv-cache-dtype fp8`, which roughly doubles how many tokens fit in cache. Worth it for long-context, high-concurrency workloads, but test quality first since it touches every cached token.

The honest summary: FP8 when the hardware supports it and quality matters; 4-bit AWQ when you need a model that otherwise won't fit. Always eval on your own task before and after, not on a leaderboard.

## What actually drives throughput

The headline feature is continuous batching. Instead of waiting for a fixed batch to finish, vLLM admits new requests every decoding step and evicts finished ones, which keeps the GPU saturated under concurrent load. Paged attention is what makes that work without fragmenting memory: it manages the KV cache in fixed-size blocks like OS virtual memory, so there's little waste and sequences can share prefixes. More free VRAM for KV cache means more concurrent sequences, which means higher aggregate tokens/sec.

The practical takeaway: throughput is about concurrency, not single-request speed. Measure it under load, not with one prompt. The `vllm bench serve` subcommand drives the running server (this is why we installed the `[bench]` extra):

```bash
vllm bench serve \
  --model Qwen/Qwen2.5-7B-Instruct \
  --base-url http://localhost:8000 \
  --dataset-name random \
  --num-prompts 200 \
  --max-concurrency 32
```

That reports request throughput, output tokens/sec, and the latency percentiles that actually matter: time-to-first-token and inter-token latency. One request is a vanity metric; the system shines at 16-64 in flight.

## VRAM math and OOM gotchas

A rough budget: weights + KV cache + activation overhead must fit in `gpu_memory_utilization * total_VRAM`.

- Weights: params x bytes-per-param. A 7B model is ~14 GB at FP16, ~7 GB at FP8, ~4 GB at 4-bit.
- KV cache: scales with `max_model_len x concurrent sequences x model depth`. This is the part people forget, and it's why a model that "fits" still OOMs under load.

The OOM I hit most often is at startup with a context window that's too large: the weights load, vLLM tries to reserve KV cache for `--max-model-len`, and there's nothing left. Fixes, in order: lower `--max-model-len`, lower `--gpu-memory-utilization` if something else shares the card, add `--kv-cache-dtype fp8`, quantize the weights, or add a GPU with `--tensor-parallel-size`. If you OOM only under heavy concurrency, you're out of KV cache, not weight memory; shrink context or quantize the cache.

## When a hosted API is the better call

Self-hosting wins on data control, steady high-volume cost, and customization. It loses when:

- Traffic is spiky or low. A GPU idling at 3 a.m. still costs money; per-token billing doesn't.
- You need frontier quality and the open model isn't close enough for your task.
- You don't want to own driver upgrades, OOM debugging, and on-call.

Because the client code is identical OpenAI-SDK calls either way, this isn't a one-way door. I prototype against a hosted endpoint, then point `base_url` at my own vLLM server once the volume and privacy requirements justify the GPU. Keep both paths working and choose per workload.
