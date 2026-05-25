---
title: Nemo Knows MVP
kind: topic
created: 2026-05-15
updated: 2026-05-16
sources:
  - raw/llm-wiki.md
  - wiki/sources/llm-wiki.md
tags: [architecture, mvp]
confidence: high
summary: "The minimal implementation of `nemo-knows` is a local Markdown knowledge system with three layers:"
sourceProject: "nemo-knows"
sourcePath: "topics/nemo-knows-mvp.md"
---

# Nemo Knows MVP

The minimal implementation of `nemo-knows` is a local Markdown knowledge system with three layers:

1. `raw/` stores immutable source material.
2. `wiki/` stores LLM-maintained summaries and syntheses.
3. `AGENTS.md` defines maintenance rules.

The first usable loop is ingest -> query -> file useful answers back into the wiki. This implements the [llm-wiki-core-concept](/wiki/imported/nemo-knows/topics/llm-wiki-core-concept/) at a small local scale.

## Minimal Flow

```text
raw source -> source page -> concept/topic pages -> index -> log
```

Useful query answers can then be filed back as topic pages, making the wiki a [wiki-as-compounding-artifact](/wiki/imported/nemo-knows/concepts/wiki-as-compounding-artifact/).

## Related

- [llm-wiki-core-concept](/wiki/imported/nemo-knows/topics/llm-wiki-core-concept/)
- [persistent-wiki](/wiki/imported/nemo-knows/concepts/persistent-wiki/)
