import { spawn } from 'node:child_process';

interface ContentEventPayload {
  event: 'content.published';
  source: string;
  repository?: string;
  ref?: string;
  timestamp: string;
  shingo: {
    action: 'render';
    command: 'pnpm content:sync';
  };
}

function readArg(name: string): string | undefined {
  const index = process.argv.indexOf(name);
  return index >= 0 ? process.argv[index + 1] : undefined;
}

function hasFlag(name: string): boolean {
  return process.argv.includes(name);
}

function buildPayload(): ContentEventPayload {
  return {
    event: 'content.published',
    source: readArg('--source') ?? 'shingo-docs',
    repository: readArg('--repository') ?? process.env.CONTENT_REPOSITORY,
    ref: readArg('--ref') ?? process.env.CONTENT_REF,
    timestamp: new Date().toISOString(),
    shingo: {
      action: 'render',
      command: 'pnpm content:sync',
    },
  };
}

async function runShingoRender(dryRun: boolean): Promise<void> {
  if (dryRun) {
    console.log('[dry-run] pnpm content:sync');
    return;
  }

  await new Promise<void>((resolve, reject) => {
    const child = spawn('pnpm', ['content:sync'], { stdio: 'inherit' });

    child.on('error', reject);
    child.on('exit', (code) => {
      if (code === 0) {
        resolve();
        return;
      }

      reject(new Error(`pnpm content:sync failed with exit code ${code}`));
    });
  });
}

async function notifyNemoKnows(payload: ContentEventPayload, dryRun: boolean): Promise<void> {
  const webhookUrl = process.env.NEMO_KNOWS_WEBHOOK_URL;

  if (!webhookUrl) {
    console.log('NEMO_KNOWS_WEBHOOK_URL is not set; nemo-knows notification skipped.');
    console.log('Payload that would be sent:');
    console.log(JSON.stringify(payload, null, 2));
    return;
  }

  if (dryRun) {
    console.log(`[dry-run] POST ${webhookUrl}`);
    console.log(JSON.stringify(payload, null, 2));
    return;
  }

  const headers: Record<string, string> = {
    'content-type': 'application/json',
  };
  const token = process.env.NEMO_KNOWS_WEBHOOK_TOKEN;

  if (token) {
    headers.authorization = `Bearer ${token}`;
  }

  const response = await fetch(webhookUrl, {
    method: 'POST',
    headers,
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(`nemo-knows webhook failed: ${response.status} ${response.statusText}`);
  }

  console.log(`Notified nemo-knows: ${response.status}`);
}

async function main(): Promise<void> {
  const dryRun = hasFlag('--dry-run');
  const skipShingo = hasFlag('--skip-shingo');
  const skipNemo = hasFlag('--skip-nemo');
  const payload = buildPayload();

  if (!skipShingo) {
    await runShingoRender(dryRun);
  }

  if (!skipNemo) {
    await notifyNemoKnows(payload, dryRun);
  }
}

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
