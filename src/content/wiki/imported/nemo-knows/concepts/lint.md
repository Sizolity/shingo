---
title: Lint
kind: concept
created: 2026-05-16
updated: 2026-05-16
sources:
  - raw/llm-wiki.md
  - wiki/sources/llm-wiki.md
tags: [workflow, wiki-maintenance]
confidence: high
summary: "Lint is the workflow for health-checking the wiki as it grows."
sourceProject: "nemo-knows"
sourcePath: "concepts/lint.md"
---

# Lint

Lint is the workflow for health-checking the wiki as it grows.

A lint pass looks for contradictions, stale claims, orphan pages, missing cross-references, missing concept pages, and data gaps. It keeps the wiki useful by making maintenance explicit instead of waiting for drift to accumulate.

The source describes lint as a periodic operation: the LLM suggests problems, questions, and possible sources, while the human decides which fixes or investigations to pursue.

## Related

- [persistent-wiki](/wiki/imported/nemo-knows/concepts/persistent-wiki/)
- [llm-wiki-core-concept](/wiki/imported/nemo-knows/topics/llm-wiki-core-concept/)
- [ingest](/wiki/imported/nemo-knows/concepts/ingest/)
- [query](/wiki/imported/nemo-knows/concepts/query/)
