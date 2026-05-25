---
title: LLM Maintenance Pattern
kind: concept
created: 2026-05-16
updated: 2026-05-16
sources:
  - raw/llm-wiki.md
  - wiki/sources/llm-wiki.md
tags: [llm, wiki, maintenance]
confidence: medium
summary: "The LLM maintenance pattern is the division of labour where the human provides sources and intent while an LLM maintains the wiki's structure, links, summaries, and operational boo"
sourceProject: "nemo-knows"
sourcePath: "concepts/llm-maintenance-pattern.md"
---

# LLM Maintenance Pattern

The LLM maintenance pattern is the division of labour where the human provides
sources and intent while an LLM maintains the wiki's structure, links, summaries,
and operational bookkeeping.

In the LLM wiki source, this pattern is framed as a way to make a knowledge base
compound over time. The LLM does not merely answer a single question; it updates
source summaries, concept pages, topic syntheses, the index, and the operation
log so later work starts from maintained knowledge rather than raw context.

This pattern depends on explicit constraints: `raw/` remains immutable,
`wiki/` is maintained through reviewed edits, and `AGENTS.md` defines the schema
for frontmatter, links, confidence, and logging.
