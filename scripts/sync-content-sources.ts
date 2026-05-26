import { execFile } from 'node:child_process';
import { access, rm } from 'node:fs/promises';
import { promisify } from 'node:util';
import { readContentSources } from './content-sources';

const execFileAsync = promisify(execFile);
const cleanupTargets = [
  '.astro',
  'dist',
  'node_modules/.astro',
  'src/content/posts/imported/external-docs',
  'src/content/posts/record',
  'src/content/projects/toy',
  'src/content/wiki/imported/nemo-knows',
];

async function exists(path: string): Promise<boolean> {
  try {
    await access(path);
    return true;
  } catch {
    return false;
  }
}

async function main(): Promise<void> {
  const sources = await readContentSources();
  let imported = 0;

  for (const target of cleanupTargets) {
    await rm(target, { recursive: true, force: true });
  }

  for (const source of sources) {
    if (!(await exists(source.source))) {
      console.warn(`Skipping missing content source "${source.name}": ${source.source}`);
      continue;
    }

    await execFileAsync('pnpm', [
      'exec',
      'tsx',
      'scripts/import-markdown.ts',
      '--source-name',
      source.name,
      '--clean',
    ]);
    imported += 1;
  }

  console.log(`Synced ${imported} content source(s).`);
}

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
