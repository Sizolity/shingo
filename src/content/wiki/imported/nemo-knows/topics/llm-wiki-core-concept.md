---
title: LLM Wiki Core Concept
kind: topic
created: 2026-05-16
updated: 2026-05-16
sources:
  - raw/llm-wiki.md
  - wiki/sources/llm-wiki.md
tags: [llm, wiki, knowledge-management]
confidence: high
summary: "An LLM wiki is a local Markdown knowledge base where the LLM maintains the wiki as a persistent layer between raw sources and the human reader."
sourceProject: "nemo-knows"
sourcePath: "topics/llm-wiki-core-concept.md"
---

# LLM Wiki Core Concept

An LLM wiki is a local Markdown knowledge base where the LLM maintains the wiki as a persistent layer between raw sources and the human reader.

The core difference from query-time RAG is accumulation. In RAG, the model retrieves chunks from raw documents every time a question is asked and rebuilds the answer from scratch. In an LLM wiki, the model ingests sources once, updates durable pages, cross-links concepts, records contradictions, and keeps prior synthesis available for future work.

## Mental Model

The source describes three layers:

1. `raw/` stores immutable source material. It is the source of truth.
2. `wiki/` stores LLM-written summaries, entities, concepts, topics, comparisons, and syntheses.
3. The schema file, such as `AGENTS.md`, tells the LLM how to maintain the wiki.

The human curates sources, asks questions, and steers what matters. The LLM does the maintenance work: summarising, filing, linking, updating, and checking consistency.

## Operating Loop

The basic loop is:

```text
source -> ingest -> wiki pages -> query -> filed synthesis -> lint
```

`[ingest](/wiki/imported/nemo-knows/concepts/ingest/)` turns raw material into source, concept, entity, or topic pages. `[query](/wiki/imported/nemo-knows/concepts/query/)` answers from the existing wiki and can save valuable answers back into it. `[lint](/wiki/imported/nemo-knows/concepts/lint/)` periodically checks the wiki for contradictions, missing links, stale claims, and gaps.

## Why It Matters

The wiki is a `[wiki-as-compounding-artifact](/wiki/imported/nemo-knows/concepts/wiki-as-compounding-artifact/)`: every source and useful question can improve the shared knowledge structure instead of disappearing into chat history.

This works because the tedious part of a knowledge base is not reading; it is maintenance. The LLM can update cross-references, revise summaries, and touch many pages in one pass, while the human keeps control over source selection and interpretation.

## Related

- [persistent-wiki](/wiki/imported/nemo-knows/concepts/persistent-wiki/)
- [ingest](/wiki/imported/nemo-knows/concepts/ingest/)
- [query](/wiki/imported/nemo-knows/concepts/query/)
- [lint](/wiki/imported/nemo-knows/concepts/lint/)
- [nemo-knows-mvp](/wiki/imported/nemo-knows/topics/nemo-knows-mvp/)
