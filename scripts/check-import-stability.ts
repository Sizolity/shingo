import { execFile } from 'node:child_process';
import { mkdir, readFile, readdir, rm, stat } from 'node:fs/promises';
import path from 'node:path';
import { promisify } from 'node:util';
import { readContentSources } from './content-sources';

const execFileAsync = promisify(execFile);

const actualRoot = '.tmp/content-import-stability';

async function listFiles(root: string, current = root): Promise<string[]> {
  const entries = await readdir(current, { withFileTypes: true });
  const files: string[] = [];

  for (const entry of entries) {
    const absolutePath = path.join(current, entry.name);

    if (entry.isDirectory()) {
      files.push(...(await listFiles(root, absolutePath)));
      continue;
    }

    if (entry.isFile()) {
      files.push(path.relative(root, absolutePath));
    }
  }

  return files.sort((a, b) => a.localeCompare(b));
}

async function readComparableFiles(root: string): Promise<Map<string, string>> {
  const absoluteRoot = path.resolve(process.cwd(), root);
  const rootInfo = await stat(absoluteRoot);

  if (!rootInfo.isDirectory()) {
    throw new Error(`Expected directory does not exist: ${absoluteRoot}`);
  }

  const files = await listFiles(absoluteRoot);
  const contents = new Map<string, string>();

  for (const file of files) {
    contents.set(file, await readFile(path.join(absoluteRoot, file), 'utf8'));
  }

  return contents;
}

function compareFiles(expected: Map<string, string>, actual: Map<string, string>): string[] {
  const failures: string[] = [];
  const fileSet = new Set([...expected.keys(), ...actual.keys()]);

  for (const file of [...fileSet].sort((a, b) => a.localeCompare(b))) {
    if (!expected.has(file)) {
      failures.push(`Unexpected generated file: ${file}`);
      continue;
    }

    if (!actual.has(file)) {
      failures.push(`Missing generated file: ${file}`);
      continue;
    }

    if (expected.get(file) !== actual.get(file)) {
      failures.push(`Changed generated content: ${file}`);
    }
  }

  return failures;
}

async function main(): Promise<void> {
  const samples = (await readContentSources()).filter((source) => source.stabilitySample);
  const failures: string[] = [];

  await rm(actualRoot, { recursive: true, force: true });
  await mkdir(actualRoot, { recursive: true });

  for (const sample of samples) {
    const actualDir = path.join(actualRoot, sample.name);

    await execFileAsync('pnpm', [
      'exec',
      'tsx',
      'scripts/import-markdown.ts',
      '--source-name',
      sample.name,
      '--source',
      sample.source,
      '--target',
      actualDir,
      '--route-target',
      sample.target,
      '--clean',
    ]);

    const expected = await readComparableFiles(sample.target);
    const actual = await readComparableFiles(actualDir);
    const sampleFailures = compareFiles(expected, actual).map((failure) => `${sample.name}: ${failure}`);

    failures.push(...sampleFailures);
  }

  if (failures.length > 0) {
    console.error('Markdown import stability check failed:');
    for (const failure of failures) {
      console.error(`- ${failure}`);
    }
    process.exitCode = 1;
    return;
  }

  console.log(`Markdown import stability check passed for ${samples.length} source(s).`);
}

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
