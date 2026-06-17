---
marp: true
theme: ai-night
paginate: true
title: Open Source AI Builder Landscape
description: Ten OSS projects across agent loops, token filters, research tools, local voice, and dev-environment utilities
author: AI Night
footer: AI Night Meetup | June 2026
---

<!-- _class: lead -->

# Open Source AI Builder Landscape

A grouped scan of ten OSS tools for AI builders

June 2026

<!-- cover-links -->

---

## Agent Workflow Systems

- GSD Core — A spec-driven context-engineering framework that drives coding agents through disciplined phase loops in fresh-context subagents. [https://github.com/open-gsd/gsd-core](https://github.com/open-gsd/gsd-core)
- Ponytail — A plugin and ruleset that makes coding agents stop at the first simpler solution that actually works. [https://github.com/DietrichGebert/ponytail](https://github.com/DietrichGebert/ponytail)
- Loop Engineering — A reference repo of patterns, starters, and CLIs for designing recurring control loops around coding agents. [https://github.com/cobusgreyling/loop-engineering](https://github.com/cobusgreyling/loop-engineering)

---

## Token Discipline And Context Compression

- Zap — A Rust CLI proxy that filters noisy shell output before it reaches your coding agent to save 60 to 90 percent of tokens. [https://github.com/bitan-del/zap](https://github.com/bitan-del/zap)
- Lowfat — A lightweight CLI and hook pipeline that compresses command output and file reads before they enter an agent context. [https://github.com/zdk/lowfat](https://github.com/zdk/lowfat)

---

## Research And Knowledge Workbenches

- Open Notebook — A privacy-focused, multi-model, self-hosted alternative to NotebookLM for organizing sources, chatting with research, and generating podcasts. [https://github.com/lfnovo/open-notebook](https://github.com/lfnovo/open-notebook)
- patent — A plain-English prior-art search for dev-tool ideas across open-source registries, with verdicts like Open, Crowded, or Saturated. [https://github.com/r14dd/patent](https://github.com/r14dd/patent)

---

## Platform And Runtime Utilities

- Foundation Models Utilities — Swift utilities for Apple's Foundation Models framework, including chat-completions adapters, history controls, and just-in-time skills. [https://github.com/apple/foundation-models-utilities](https://github.com/apple/foundation-models-utilities)
- Windows Developer Config — Declarative, CI-tested configs that bootstrap a repeatable Windows dev box, WSL shell, or language workload in one command. [https://github.com/microsoft/WindowsDeveloperConfig](https://github.com/microsoft/WindowsDeveloperConfig)

---

## Local Voice Interface

- Voicebox — A local-first AI voice studio for cloning voices, generating speech, dictating into apps, and giving MCP-aware agents a voice. [https://github.com/jamiepine/voicebox](https://github.com/jamiepine/voicebox)
