import type { CollectionEntry } from 'astro:content';

type DatedEntry = CollectionEntry<'posts'> | CollectionEntry<'docs'> | CollectionEntry<'projects'>;

export function getEntryTitle(entry: DatedEntry): string {
  return entry.data.title ?? entry.id.replace(/-/g, ' ');
}

export function getEntryDate(entry: DatedEntry): Date | undefined {
  return entry.data.date ?? entry.data.updated;
}

export function sortByDateDesc<T extends DatedEntry>(entries: T[]): T[] {
  return [...entries].sort((a, b) => {
    const aTime = getEntryDate(a)?.getTime() ?? 0;
    const bTime = getEntryDate(b)?.getTime() ?? 0;
    return bTime - aTime;
  });
}

export function formatDate(date: Date | undefined): string {
  if (!date) return 'Undated';

  return new Intl.DateTimeFormat('zh-CN', {
    dateStyle: 'medium',
  }).format(date);
}

export function isPublished(entry: DatedEntry): boolean {
  return !entry.data.draft;
}
