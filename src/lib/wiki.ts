import type { CollectionEntry } from 'astro:content';
import { getEntryTitle } from './content';

export type WikiEntry = CollectionEntry<'wiki'>;

export function getWikiCategory(entry: WikiEntry): string {
  if (!entry.data.sourceProject) return 'Shingo 本地说明';

  switch (entry.data.kind) {
    case 'source':
      return '来源文献';
    case 'entity':
      return '核心实体';
    case 'concept':
      return '技术概念';
    case 'topic':
      return '综合主题';
    case 'index':
      return '快速导航';
    case 'log':
      return '维护记录';
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
    return getEntryTitle(a).localeCompare(getEntryTitle(b));
  });
}
