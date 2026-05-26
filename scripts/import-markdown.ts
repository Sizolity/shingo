import { mkdir, readFile, readdir, rm, stat, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { findContentSource } from './content-sources';

interface ImportOptions {
  source: string;
  target: string;
  sourceProject: string;
  clean: boolean;
  routeTarget: string;
}

interface SourceDocument {
  absolutePath: string;
  relativePath: string;
  updated: Date;
}

interface PreparedDocument extends SourceDocument {
  outputPath: string;
  route: string;
}

interface ParsedMarkdown {
  frontmatter: string;
  body: string;
}

const defaultOptions: ImportOptions = {
  source: '../shingo-docs',
  target: 'src/content/posts/imported/external-docs',
  sourceProject: 'external-docs',
  clean: false,
  routeTarget: 'src/content/posts/imported/external-docs',
};

const ignoredDirs = new Set(['.git', 'node_modules', 'dist', '.astro']);

function readArg(name: string): string | undefined {
  const index = process.argv.indexOf(name);
  return index >= 0 ? process.argv[index + 1] : undefined;
}

function hasFlag(name: string): boolean {
  return process.argv.includes(name);
}

async function getOptions(): Promise<ImportOptions> {
  const sourceName = readArg('--source-name');

  if (sourceName) {
    const source = await findContentSource(sourceName);
    return {
      source: readArg('--source') ?? source.source,
      target: readArg('--target') ?? source.target,
      sourceProject: readArg('--source-project') ?? source.sourceProject,
      clean: hasFlag('--clean'),
      routeTarget: readArg('--route-target') ?? source.target,
    };
  }

  return {
    source: readArg('--source') ?? defaultOptions.source,
    target: readArg('--target') ?? defaultOptions.target,
    sourceProject: readArg('--source-project') ?? defaultOptions.sourceProject,
    clean: hasFlag('--clean') || defaultOptions.clean,
    routeTarget: readArg('--route-target') ?? readArg('--target') ?? defaultOptions.routeTarget,
  };
}

async function listMarkdownFiles(root: string, current = root): Promise<SourceDocument[]> {
  const entries = await readdir(current, { withFileTypes: true });
  const documents: SourceDocument[] = [];

  for (const entry of entries) {
    if (entry.isDirectory()) {
      if (ignoredDirs.has(entry.name)) continue;
      documents.push(...(await listMarkdownFiles(root, path.join(current, entry.name))));
      continue;
    }

    if (!entry.isFile() || !entry.name.match(/\.mdx?$/i)) continue;

    const absolutePath = path.join(current, entry.name);
    const fileInfo = await stat(absolutePath);
    documents.push({
      absolutePath,
      relativePath: path.relative(root, absolutePath),
      updated: fileInfo.mtime,
    });
  }

  return documents.sort((a, b) => a.relativePath.localeCompare(b.relativePath));
}

function parseMarkdown(markdown: string): ParsedMarkdown {
  if (!markdown.startsWith('---\n')) {
    return { frontmatter: '', body: markdown };
  }

  const end = markdown.indexOf('\n---\n', 4);
  if (end < 0) {
    return { frontmatter: '', body: markdown };
  }

  return {
    frontmatter: markdown.slice(4, end),
    body: markdown.slice(end + 5).trimStart(),
  };
}

function readFrontmatterValue(frontmatter: string, key: string): string | undefined {
  const match = frontmatter.match(new RegExp(`^${key}:\\s*["']?(.+?)["']?\\s*$`, 'm'));
  return match?.[1]?.trim();
}

function hasFrontmatterKey(frontmatter: string, key: string): boolean {
  return new RegExp(`^${key}:`, 'm').test(frontmatter);
}

function titleFromPath(relativePath: string): string {
  return path
    .basename(relativePath, path.extname(relativePath))
    .replace(/[-_]+/g, ' ')
    .replace(/\b\w/g, (char: string) => char.toUpperCase());
}

function firstHeading(body: string): string | undefined {
  return body.match(/^#{1,6}\s+(.+)$/m)?.[1]?.trim();
}

function ensureTopHeading(body: string, title: string): string {
  const trimmed = body.trim();
  if (trimmed.match(/^#{1,6}\s+.+$/m)) {
    return trimmed.replace(/^#{1,6}\s+.+$/m, `# ${title}`);
  }
  return `# ${title}\n\n${body.trim()}`;
}

function firstParagraph(body: string): string | undefined {
  const withoutTitle = body.replace(/^#{1,6}\s+.+$/gm, '').trim();
  const paragraph = withoutTitle
    .split(/\n\s*\n/)
    .map((block) => block.trim())
    .find((block) => block && !block.startsWith('```') && !block.startsWith('|'));

  return paragraph?.replace(/\s+/g, ' ').slice(0, 180);
}

function yamlString(value: string): string {
  return JSON.stringify(value);
}

function yamlDate(value: Date): string {
  return value.toISOString().slice(0, 10);
}

function buildFrontmatter(
  parsed: ParsedMarkdown,
  title: string,
  summary: string | undefined,
  tags: string[],
  source: SourceDocument,
  options: ImportOptions,
): string[] {
  if (parsed.frontmatter.trim()) {
    const lines = ['---', parsed.frontmatter.trim()];

    if (!hasFrontmatterKey(parsed.frontmatter, 'title')) {
      lines.push(`title: ${yamlString(title)}`);
    }

    if (summary && !hasFrontmatterKey(parsed.frontmatter, 'summary')) {
      lines.push(`summary: ${yamlString(summary)}`);
    }

    if (tags.length > 0 && !hasFrontmatterKey(parsed.frontmatter, 'tags')) {
      lines.push(`tags: [${tags.map(yamlString).join(', ')}]`);
    }

    if (!hasFrontmatterKey(parsed.frontmatter, 'date') && !hasFrontmatterKey(parsed.frontmatter, 'updated')) {
      lines.push(`updated: ${yamlDate(source.updated)}`);
    }

    if (!hasFrontmatterKey(parsed.frontmatter, 'sourceProject')) {
      lines.push(`sourceProject: ${yamlString(options.sourceProject)}`);
    }

    if (!hasFrontmatterKey(parsed.frontmatter, 'sourcePath')) {
      lines.push(`sourcePath: ${yamlString(source.relativePath)}`);
    }

    lines.push('---');
    return lines;
  }

  return [
    '---',
    `title: ${yamlString(title)}`,
    summary ? `summary: ${yamlString(summary)}` : undefined,
    tags.length > 0 ? `tags: [${tags.map(yamlString).join(', ')}]` : undefined,
    `updated: ${yamlDate(source.updated)}`,
    `sourceProject: ${yamlString(options.sourceProject)}`,
    `sourcePath: ${yamlString(source.relativePath)}`,
    '---',
  ].filter((line): line is string => Boolean(line));
}

function toOutputRelativePath(relativePath: string): string {
  const parsed = path.parse(relativePath);
  const safeName = parsed.name.toLowerCase().replace(/\s+/g, '-');
  return path.join(parsed.dir, `${safeName}${parsed.ext.toLowerCase()}`);
}

function toOutputPath(targetRoot: string, relativePath: string): string {
  return path.join(targetRoot, toOutputRelativePath(relativePath));
}

function routeFromOutputPath(outputPath: string): string {
  const contentRoot = path.resolve(process.cwd(), 'src/content');
  const relativePath = path.relative(contentRoot, outputPath);
  const [collection, ...rest] = relativePath.split(path.sep);
  const contentPath = rest.join(path.sep);
  const routePrefix = collection === 'posts' ? 'posts' : 'wiki';
  const parsed = path.parse(contentPath);
  const routeSegments = parsed.name === 'index' ? parsed.dir : path.join(parsed.dir, parsed.name);
  return `/${routePrefix}/${routeSegments.split(path.sep).filter(Boolean).join('/')}/`;
}

function slugFromRelativePath(relativePath: string): string {
  return path.basename(relativePath, path.extname(relativePath)).toLowerCase();
}

function buildWikiRouteMap(documents: PreparedDocument[]): Map<string, string> {
  const routes = new Map<string, string>();

  for (const document of documents) {
    routes.set(slugFromRelativePath(document.relativePath), document.route);
  }

  return routes;
}

function transformWikiLinks(body: string, routes: Map<string, string>): string {
  return body.replace(/\[\[([^\]|]+)(?:\|([^\]]+))?\]\]/g, (match, rawSlug: string, rawLabel?: string) => {
    const slug = rawSlug.trim().toLowerCase();
    const label = rawLabel?.trim() || rawSlug.trim();
    const route = routes.get(slug);

    return route ? `[${label}](${route})` : match;
  });
}

function buildDocument(
  source: SourceDocument,
  parsed: ParsedMarkdown,
  options: ImportOptions,
  routes: Map<string, string>,
): string {
  const title =
    readFrontmatterValue(parsed.frontmatter, 'title') ??
    firstHeading(parsed.body) ??
    titleFromPath(source.relativePath);
  const summary = readFrontmatterValue(parsed.frontmatter, 'summary') ?? firstParagraph(parsed.body);
  const tags: string[] = [];

  const frontmatter = buildFrontmatter(parsed, title, summary, tags, source, options);

  const body = transformWikiLinks(ensureTopHeading(parsed.body, title), routes);

  return `${frontmatter.join('\n')}\n\n${body}\n`;
}

async function main(): Promise<void> {
  const options = await getOptions();
  const sourceRoot = path.resolve(process.cwd(), options.source);
  const targetRoot = path.resolve(process.cwd(), options.target);
  const routeTargetRoot = path.resolve(process.cwd(), options.routeTarget);
  const sourceInfo = await stat(sourceRoot);

  if (!sourceInfo.isDirectory()) {
    throw new Error(`Source is not a directory: ${sourceRoot}`);
  }

  const documents = (await listMarkdownFiles(sourceRoot)).map((document): PreparedDocument => {
    const outputPath = toOutputPath(targetRoot, document.relativePath);
    const routeOutputPath = toOutputPath(routeTargetRoot, document.relativePath);

    return {
      ...document,
      outputPath,
      route: routeFromOutputPath(routeOutputPath),
    };
  });
  const routes = buildWikiRouteMap(documents);

  if (options.clean) {
    await rm(targetRoot, { recursive: true, force: true });
  }

  for (const document of documents) {
    const markdown = await readFile(document.absolutePath, 'utf8');
    const parsed = parseMarkdown(markdown);
    const output = buildDocument(document, parsed, options, routes);
    const outputPath = document.outputPath;

    await mkdir(path.dirname(outputPath), { recursive: true });
    await writeFile(outputPath, output);
  }

  console.log(`Imported ${documents.length} Markdown file(s).`);
  console.log(`Source: ${sourceRoot}`);
  console.log(`Target: ${targetRoot}`);
}

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
