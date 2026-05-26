import type { CollectionEntry } from 'astro:content';
import { getEntryTitle } from './content';

export type WikiEntry = CollectionEntry<'wiki'>;

const standaloneWikiTitles: Record<string, string> = {
  index: '快速导航',
  log: '维护日志',
};

export function getWikiStandaloneTitle(entry: WikiEntry): string | undefined {
  return standaloneWikiTitles[entry.data.kind ?? ''];
}

export function getWikiDisplayTitle(entry: WikiEntry): string {
  return getWikiStandaloneTitle(entry) ?? getEntryTitle(entry);
}

export function getWikiHref(entry: WikiEntry): string {
  return entry.data.kind === 'index' ? '/wiki/' : `/wiki/${entry.id}/`;
}

export function getWikiCategory(entry: WikiEntry): string {
  if (!entry.data.sourceProject) return 'Shingo 本地说明';

  const standaloneTitle = getWikiStandaloneTitle(entry);
  if (standaloneTitle) return standaloneTitle;

  switch (entry.data.kind) {
    case 'source':
      return '来源文献';
    case 'entity':
      return '核心实体';
    case 'concept':
      return '技术概念';
    case 'topic':
      return '综合主题';
    default:
      return '其他页面';
  }
}

export function groupWikiEntries(entries: WikiEntry[]): Map<string, WikiEntry[]> {
  const groups = new Map<string, WikiEntry[]>();

  for (const entry of entries) {
    const category = getWikiCategory(entry);
    groups.set(category, [...(groups.get(category) ?? []), entry]);
  }

  return groups;
}

export function sortWikiEntries(entries: WikiEntry[]): WikiEntry[] {
  return [...entries].sort((a, b) => {
    const orderDiff = (a.data.order ?? 999) - (b.data.order ?? 999);
    if (orderDiff !== 0) return orderDiff;
    return getWikiDisplayTitle(a).localeCompare(getWikiDisplayTitle(b));
  });
}
