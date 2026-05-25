---
title: Query
kind: concept
created: 2026-05-16
updated: 2026-05-16
sources:
  - raw/llm-wiki.md
  - wiki/sources/llm-wiki.md
tags: [workflow, synthesis]
confidence: high
summary: "Query is the workflow for answering questions from the existing wiki."
sourceProject: "nemo-knows"
sourcePath: "concepts/query.md"
---

# Query

Query is the workflow for answering questions from the existing wiki.

The LLM starts from the index, reads relevant pages, and synthesises an answer with citations. The important pattern is that valuable answers should not remain only in chat: they can be filed back into the wiki as new topic pages.

This makes exploration cumulative. A comparison, connection, or derived insight discovered during a query becomes part of the maintained knowledge base.

## Related

- [persistent-wiki](/wiki/imported/nemo-knows/concepts/persistent-wiki/)
- [llm-wiki-core-concept](/wiki/imported/nemo-knows/topics/llm-wiki-core-concept/)
- [ingest](/wiki/imported/nemo-knows/concepts/ingest/)
- [lint](/wiki/imported/nemo-knows/concepts/lint/)
