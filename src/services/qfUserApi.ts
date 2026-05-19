import type { QfUser, TokenSet } from './qfOAuth';

const FUNCTIONS_BASE = 'https://us-central1-sample-firebase-ai-appj-9c9fa.cloudfunctions.net';

interface UserApiResponse<T> {
  data?: T;
  error?: string;
}

function getStoredTokens(): TokenSet | null {
  try {
    const raw = localStorage.getItem('qf_tokens');
    return raw ? JSON.parse(raw) : null;
  } catch { return null; }
}

async function userApi<T>(
  endpoint: string,
  options?: { method?: string; body?: unknown; accessToken?: string }
): Promise<UserApiResponse<T>> {
  const token = options?.accessToken || getStoredTokens()?.accessToken;
  if (!token) return { error: 'Not authenticated' };

  try {
    const params: Record<string, string> = { endpoint, accessToken: token, method: options?.method || 'GET' };
    if (options?.body) params.body = JSON.stringify(options.body);

    const res = await fetch(`${FUNCTIONS_BASE}/exchange`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams(params).toString(),
    });
    const data = await res.json();
    if (!res.ok) return { error: data.message || data.error_description || 'API error' };
    return { data };
  } catch {
    return { error: 'Network error' };
  }
}

export interface QfBookmark {
  id: string;
  verseKey: string;
  surahId: number;
  verseNumber: number;
  note?: string;
  createdAt: string;
}

export interface QfCollection {
  id: string;
  name: string;
  description?: string;
  createdAt: string;
}

export interface QfActivityDay {
  id: string;
  date: string;
  progress: number;
  type: string;
  ranges: string[];
  secondsRead: number;
  versesRead: number;
  mushafId: number;
}

export interface QfStreak {
  id: string;
  startDate: string;
  endDate: string;
  type: string;
  status: string;
  days: number;
}

export interface QfReadingSession {
  id?: string;
  date: string;
  ranges: string[];
  seconds?: number;
  versesRead?: number;
}

export interface QfSimpleReadingSession {
  id: string;
  chapterNumber: number;
  verseNumber: number;
  updatedAt: string;
}

export async function getBookmarks(accessToken?: string, after?: string): Promise<UserApiResponse<QfBookmark[]>> {
  let endpoint = '/auth/v1/bookmarks?type=ayah&mushafId=4&first=10';
  if (after) endpoint += `&after=${after}`;
  return userApi(endpoint, { accessToken });
}

export async function getCollections(accessToken?: string): Promise<UserApiResponse<QfCollection[]>> {
  return userApi('/auth/v1/collections', { accessToken });
}

export async function getUserProfile(accessToken?: string): Promise<UserApiResponse<QfUser>> {
  return userApi('/auth/v1/user', { accessToken });
}

export async function getActivityDays(accessToken?: string, from?: string, to?: string): Promise<UserApiResponse<QfActivityDay[]>> {
  let endpoint = '/v1/activity-days?type=QURAN';
  if (from) endpoint += `&from=${from}`;
  if (to) endpoint += `&to=${to}`;
  return userApi(endpoint, { accessToken });
}

export async function addActivityDay(accessToken: string, data: { ranges: string[]; seconds: number; date: string; mushafId?: number }): Promise<UserApiResponse<any>> {
  return userApi('/v1/activity-days', {
    method: 'POST',
    accessToken,
    body: { type: 'QURAN', ...data, mushafId: data.mushafId || 4 },
  });
}

export async function addOrUpdateUserReadingSession(
  accessToken: string,
  data: { ranges: string[]; seconds: number; date: string; mushafId?: number }
): Promise<UserApiResponse<any>> {
  return userApi('/auth/v1/reading-sessions', {
    method: 'POST',
    accessToken,
    body: { type: 'QURAN', ...data, mushafId: data.mushafId || 4 },
  });
}

export async function getUserReadingSessions(accessToken?: string): Promise<UserApiResponse<QfReadingSession[]>> {
  return userApi('/auth/v1/reading-sessions?type=QURAN&mushafId=4&first=20', { accessToken });
}

export async function getStreaks(accessToken?: string): Promise<UserApiResponse<QfStreak[]>> {
  return userApi('/auth/v1/streaks?type=QURAN&sortOrder=desc&orderBy=days&first=20', { accessToken });
}

export async function getCurrentStreakDays(accessToken: string): Promise<UserApiResponse<{ days: number }>> {
  return userApi('/auth/v1/streaks/current-streak-days?type=QURAN', {
    method: 'GET',
    accessToken,
  });
}

export async function createBookmark(accessToken: string, surahId: number, verseNumber: number): Promise<UserApiResponse<any>> {
  return userApi('/auth/v1/bookmarks', {
    method: 'POST',
    accessToken,
    body: { key: surahId, type: 'ayah', verseNumber, mushafId: 4 },
  });
}

export async function deleteBookmark(accessToken: string, bookmarkId: string): Promise<UserApiResponse<any>> {
  return userApi(`/auth/v1/bookmarks/${bookmarkId}`, {
    method: 'DELETE',
    accessToken,
  });
}

export async function updateReadingSession(accessToken: string, chapterNumber: number, verseNumber: number): Promise<UserApiResponse<QfSimpleReadingSession>> {
  return userApi('/v1/reading-sessions', {
    method: 'POST',
    accessToken,
    body: { chapterNumber, verseNumber },
  });
}

export async function getReadingSessions(accessToken: string, first?: number, after?: string): Promise<UserApiResponse<QfSimpleReadingSession[]>> {
  let endpoint = '/v1/reading-sessions';
  const params: string[] = [];
  if (first) params.push(`first=${first}`);
  if (after) params.push(`after=${after}`);
  if (params.length) endpoint += '?' + params.join('&');
  return userApi(endpoint, { accessToken });
}
