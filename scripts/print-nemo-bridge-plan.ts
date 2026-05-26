import { readContentSources } from './content-sources';

async function main(): Promise<void> {
  const sources = await readContentSources();
  const externalSources = sources.filter((source) => source.sourceProject !== 'nemo-knows');

  console.log('Shared content trigger plan:');
  console.log('');
  console.log('1. A content.published event is emitted by the external document repository.');
  console.log('2. Shingo handles the event by rendering Markdown into /record/ and /toy/.');
  console.log('3. nemo-knows handles the same event by running its own ingest/wiki maintenance.');
  console.log('4. Shingo /wiki/ embeds the nemo-knows wiki artifact after it is updated.');

  for (const source of externalSources) {
    console.log('');
    console.log(`# Source: ${source.name}`);
    console.log(`External docs path: ${source.source}`);
    console.log(`Shingo render target: ${source.target}`);
    console.log('nemo-knows should ingest the same source through its own automation.');
  }

  console.log('');
  console.log('Shingo trigger command:');
  console.log('pnpm content:trigger');
  console.log('');
  console.log('Set NEMO_KNOWS_WEBHOOK_URL when Shingo should notify a separately deployed nemo-knows service.');
}

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
