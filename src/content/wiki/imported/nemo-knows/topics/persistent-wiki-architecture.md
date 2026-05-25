---
title: Persistent Wiki Architecture
kind: topic
created: 2026-05-16
updated: 2026-05-16
sources:
  - raw/llm-wiki.md
  - wiki/sources/llm-wiki.md
tags: [architecture, llm, wiki]
confidence: medium
summary: "Persistent wiki architecture treats maintained Markdown pages as the durable knowledge layer of an LLM-assisted system. The raw source remains available for audit, but day-to-day q"
sourceProject: "nemo-knows"
sourcePath: "topics/persistent-wiki-architecture.md"
---

# Persistent Wiki Architecture

Persistent wiki architecture treats maintained Markdown pages as the durable
knowledge layer of an LLM-assisted system. The raw source remains available for
audit, but day-to-day queries start from wiki pages that have already been
summarised, linked, and checked against the project schema.

This differs from retrieval-only workflows. A retrieval system repeatedly pulls
source chunks into context and asks the model to synthesize an answer each time.
A persistent wiki workflow turns reviewed synthesis into a reusable artifact:
source pages capture individual inputs, concept pages define recurring ideas,
topic pages connect multiple ideas, and `wiki/index.md` provides the catalogue.

For `nemo-knows`, the architecture is intentionally file-first: immutable
`raw/`, maintained `wiki/`, append-only `wiki/log.md`, and deterministic CLI
checks around draft generation, review, evaluation, and approved apply.
