import { readContentSources } from './content-sources';

async function main(): Promise<void> {
  const sources = await readContentSources();

  console.log('Content source fetch plan:');
  console.log('Run these commands yourself before content sync when the source is a git repository.');

  for (const source of sources) {
    console.log('');
    console.log(`# ${source.name}`);
    console.log(`cd ${source.source}`);
    console.log('git status');
    console.log('git pull --ff-only');
  }
}

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
