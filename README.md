# Shingo

Personal website built with Astro, TypeScript, and Markdown.

## Requirements

- Node.js >= 22.12.0
- pnpm 11.x

This repository includes `.node-version` for local Node version managers. In this WSL environment, Node 22 was installed under the user directory.

## Commands

```sh
pnpm install
pnpm dev
pnpm build
pnpm preview
pnpm check
pnpm content:fetch:plan
pnpm content:nemo:plan
pnpm content:import:external
pnpm content:import:nemo
pnpm content:import:all
pnpm content:test
pnpm content:sync
pnpm content:trigger:plan
pnpm content:trigger
```

## Content

- `src/content/posts/`: articles, notes, and logs
- `src/content/wiki/`: wiki pages and imported knowledge notes
- `src/content/projects/`: personal project showcases

Frontmatter is intentionally light. Pages can render with only Markdown content, while scripts or LLM workflows can fill in `title`, `summary`, `tags`, and dates later.

Content sources are configured in `content-sources.json`. The intended automation
model is one content event with two independent repository workflows:

```text
content.published
├─ shingo: render Markdown into /posts/
└─ nemo-knows: ingest the same source into its own wiki

nemo-knows wiki published/available
└─ shingo: embed the processed wiki under /wiki/
```

The independent document repository is expected at `../shingo-docs` for local
development. In deployment, Shingo and nemo-knows should not depend on each
other's working tree. They should receive the same trigger event, or Shingo can
notify nemo-knows through a webhook.

`pnpm content:fetch:plan` prints the git commands to run for each content source.
The site does not run `git pull` automatically unless that behavior is explicitly
approved.

`pnpm content:nemo:plan` prints the parallel automation plan for rendering
external docs in Shingo and ingesting the same source into nemo-knows. The actual
nemo-knows ingest remains explicit and reviewable.

`pnpm content:trigger` is the shared trigger entrypoint for Shingo. It runs
`pnpm content:sync` for Shingo and then notifies nemo-knows if
`NEMO_KNOWS_WEBHOOK_URL` is configured. Use `pnpm content:trigger:plan` to see
the payload without running the workflows.

`pnpm content:import:all` imports all enabled local sources that exist. The main
external-docs source is imported into `src/content/posts/imported/external-docs`.
The embedded Wiki source is `../nemo-knows/wiki`, imported into
`src/content/wiki/imported/nemo-knows`.

`pnpm content:sync` is Shingo's local render flow after external Markdown or a
nemo-knows Wiki artifact becomes available: import, stability test, check, and
build. The stability test regenerates `../nemo-knows/wiki` into `.tmp/` and
compares it with `src/content/wiki/imported/nemo-knows`.

Later this can become the LLM-driven maintenance flow for classification,
tagging, summaries, and wiki organization.

For periodic sync, use an external scheduler such as cron, systemd timer, or a
server-side deployment script to run:

```sh
pnpm content:sync
```
