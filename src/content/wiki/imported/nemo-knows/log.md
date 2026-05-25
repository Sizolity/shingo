---
title: Log
kind: log
summary: "Append-only record of every ingest, filed query answer, lint pass, and schema change. Each entry begins with a heading in the canonical format so it is greppable:"
tags: ["nemo-knows", "log.md"]
sourceProject: "nemo-knows"
sourcePath: "log.md"
---

# Log

Append-only record of every ingest, filed query answer, lint pass, and
schema change. Each entry begins with a heading in the canonical
format so it is greppable:

```
## [YYYY-MM-DD] <action> | <subject>
```

`<action>` is one of: `ingest`, `query-filed`, `lint`, `schema-change`,
`note`. The full format and conventions are defined in
[`AGENTS.md`](../AGENTS.md) §6.

To skim recent activity:

```sh
grep "^## \[" wiki/log.md | tail -10
```

---

## [2026-04-22] note | repository bootstrap

Initial scaffold created: `README.md`, `AGENTS.md`, empty `raw/`, and
`wiki/` with `index.md` plus this `log.md`. No sources ingested yet —
the next entry should be the first real `ingest`.

## [2026-05-16] query-filed | LLM wiki core concept

Filed a quick-reference explanation of the LLM wiki pattern and filled
missing concept pages referenced by the index.
Touched:
- wiki/topics/llm-wiki-core-concept.md (created)
- wiki/concepts/ingest.md (created)
- wiki/concepts/query.md (created)
- wiki/concepts/lint.md (created)
- wiki/concepts/wiki-as-compounding-artifact.md (created)
- wiki/concepts/persistent-wiki.md (updated)
- wiki/sources/llm-wiki.md (updated)
- wiki/topics/nemo-knows-mvp.md (updated)
- wiki/index.md (updated)
- wiki/log.md (updated)
Open: none.

## [2026-05-16] ingest | drafts/actual-use-llm-wiki
Touched:
- wiki/sources/llm-wiki.md
- skipped: wiki/concepts/llm-maintenance-pattern.md — manual reviewed content required
- skipped: wiki/topics/persistent-wiki-architecture.md — manual reviewed content required
Open: review skipped candidates before creating concept or topic pages.

## [2026-05-16] ingest | drafts/actual-use-llm-wiki
Touched:
- wiki/concepts/llm-maintenance-pattern.md
- wiki/index.md
- wiki/sources/llm-wiki.md
- wiki/topics/persistent-wiki-architecture.md
Open: review skipped candidates before creating concept or topic pages.

## [2026-05-16] lint | wiki confidence frontmatter
Touched:
- wiki/sources/llm-wiki.md (updated)
- wiki/log.md (updated)
Open: none.
