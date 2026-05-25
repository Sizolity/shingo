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
```

## Content

- `src/content/posts/`: articles, notes, and logs
- `src/content/docs/`: documentation and references
- `src/content/projects/`: personal project showcases

Frontmatter is intentionally light. Pages can render with only Markdown content, while scripts or LLM workflows can fill in `title`, `summary`, `tags`, and dates later.
