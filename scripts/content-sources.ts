import { readFile } from 'node:fs/promises';
import path from 'node:path';

export interface ContentSource {
  name: string;
  source: string;
  target: string;
  sourceProject: string;
  enabled?: boolean;
  stabilitySample?: boolean;
}

interface ContentSourcesConfig {
  sources: ContentSource[];
}

const defaultConfigPath = 'content-sources.json';
const localConfigPath = '.content-sources.local.json';

async function readJsonConfig(configPath: string): Promise<ContentSourcesConfig | undefined> {
  try {
    const absolutePath = path.resolve(process.cwd(), configPath);
    const raw = await readFile(absolutePath, 'utf8');
    return JSON.parse(raw) as ContentSourcesConfig;
  } catch (error) {
    if (error instanceof Error && 'code' in error && error.code === 'ENOENT') {
      return undefined;
    }

    throw error;
  }
}

export async function readContentSources(): Promise<ContentSource[]> {
  const baseConfig = await readJsonConfig(defaultConfigPath);
  const localConfig = await readJsonConfig(localConfigPath);
  const sources = localConfig?.sources ?? baseConfig?.sources ?? [];

  return sources.filter((source) => source.enabled !== false);
}

export async function findContentSource(name: string): Promise<ContentSource> {
  const sources = await readContentSources();
  const source = sources.find((candidate) => candidate.name === name);

  if (!source) {
    throw new Error(`Content source not found: ${name}`);
  }

  return source;
}
