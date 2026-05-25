---
title: Index
kind: index
updated: 2026-05-16
summary: "The catalogue of every page in this wiki, organised by category. The LLM updates this file on every ingest; humans read it first when navigating."
tags: ["nemo-knows", "index.md"]
sourceProject: "nemo-knows"
sourcePath: "index.md"
---

# Index

The catalogue of every page in this wiki, organised by category. The
LLM updates this file on every ingest; humans read it first when
navigating.

When this file outgrows its useful size (rough threshold: it stops
fitting comfortably in an LLM context window), split each category
into its own `index-<category>.md` and have this file link to them.

## Sources

_Pages summarising material from `raw/`. Each entry: `[[slug]]` — one-line description._
- [llm-wiki](/wiki/imported/nemo-knows/sources/llm-wiki/) — Source summary for Karpathy's LLM-maintained wiki pattern.


## Entities

_People, organisations, products, places. One page per entity._

(none yet)

## Concepts

_Ideas, mechanisms, definitions. One page per concept._
- [persistent-wiki](/wiki/imported/nemo-knows/concepts/persistent-wiki/) — A durable Markdown knowledge layer maintained by an LLM.
- [wiki-as-compounding-artifact](/wiki/imported/nemo-knows/concepts/wiki-as-compounding-artifact/) — The idea that maintained wiki pages let knowledge accumulate across sources and questions.
- [ingest](/wiki/imported/nemo-knows/concepts/ingest/) — The process of integrating a raw source into the wiki.
- [query](/wiki/imported/nemo-knows/concepts/query/) — The process of answering from existing wiki pages.
- [lint](/wiki/imported/nemo-knows/concepts/lint/) — A maintenance pass for contradictions, orphans, stubs, and stale claims.
- [llm-maintenance-pattern](/wiki/imported/nemo-knows/concepts/llm-maintenance-pattern/) — LLM Maintenance Pattern.

## Topics

_Cross-cutting syntheses, comparisons, derived insights — including
high-value query answers filed back from chat._
- [llm-wiki-core-concept](/wiki/imported/nemo-knows/topics/llm-wiki-core-concept/) — Quick explanation of the LLM wiki pattern and its operating loop.
- [nemo-knows-mvp](/wiki/imported/nemo-knows/topics/nemo-knows-mvp/) — Minimal architecture and first working loop for this repository.
- [persistent-wiki-architecture](/wiki/imported/nemo-knows/topics/persistent-wiki-architecture/) — Persistent Wiki Architecture.
