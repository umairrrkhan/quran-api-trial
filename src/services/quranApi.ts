import type { Chapter, Verse } from '../types/quran';

const BASE_URL = 'https://api.quran.com/api/v4';

export async function fetchChapters(): Promise<Chapter[]> {
  const response = await fetch(`${BASE_URL}/chapters`);
  if (!response.ok) throw new Error('Failed to fetch chapters');
  const data = await response.json();
  return data.chapters || [];
}

export async function fetchChapterVerses(
  chapterId: number,
  perPage: number = 50
): Promise<Verse[]> {
  const response = await fetch(
    `${BASE_URL}/verses/by_chapter/${chapterId}?language=en&per_page=${perPage}&words=true&word_fields=text_uthmani&translations=131`
  );
  if (!response.ok) throw new Error('Failed to fetch verses');
  const data = await response.json();
  return data.verses || [];
}

export async function fetchChapterDetails(chapterId: number): Promise<Chapter> {
  const response = await fetch(`${BASE_URL}/chapters/${chapterId}`);
  if (!response.ok) throw new Error('Failed to fetch chapter details');
  const data = await response.json();
  return data.chapter;
}

export async function fetchVerseByKey(verseKey: string): Promise<Verse | null> {
  const response = await fetch(
    `${BASE_URL}/verses/by_key/${verseKey}?language=en&words=true&word_fields=text_uthmani&translations=131`
  );
  if (!response.ok) return null;
  const data = await response.json();
  return data.verse || null;
}

