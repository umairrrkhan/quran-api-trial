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
    const res = await fetch('/api/user', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        endpoint,
        accessToken: token,
        method: options?.method || 'GET',
      }).toString(),
    });
    const data = await res.json();
    if (!res.ok) return { error: data.error || 'API error' };
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

export async function getBookmarks(accessToken?: string): Promise<UserApiResponse<QfBookmark[]>> {
  return userApi('/auth/v1/bookmarks', { accessToken });
}

export async function getCollections(accessToken?: string): Promise<UserApiResponse<QfCollection[]>> {
  return userApi('/auth/v1/collections', { accessToken });
}

export async function getUserProfile(accessToken?: string): Promise<UserApiResponse<QfUser>> {
  return userApi('/auth/v1/user', { accessToken });
}
