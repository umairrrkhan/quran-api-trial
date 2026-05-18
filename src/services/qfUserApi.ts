import type { QfUser } from './qfOAuth';
import { getStoredTokens } from '../context/AuthContext';

interface UserApiResponse<T> {
  data?: T;
  error?: string;
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

    const res = await fetch('/api/exchange', {
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

export async function getBookmarks(accessToken?: string): Promise<UserApiResponse<QfBookmark[]>> {
  return userApi('/auth/v1/bookmarks?type=ayah&mushafId=4&first=50', { accessToken });
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

export async function getStreaks(accessToken?: string): Promise<UserApiResponse<QfStreak[]>> {
  return userApi('/v1/streaks?type=QURAN', { accessToken });
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
