export interface PkcePair {
  codeVerifier: string;
  codeChallenge: string;
}

export interface AuthSession {
  state: string;
  nonce: string;
  codeVerifier: string;
  redirectUri: string;
}

export interface TokenSet {
  accessToken: string;
  refreshToken?: string;
  idToken?: string;
  expiresIn: number;
  scope?: string;
}

export interface QfUser {
  sub: string;
  email?: string;
  first_name?: string;
  last_name?: string;
}

const CLIENT_ID = '8970e1e8-abdd-4f49-8f0e-94919142f12b';

function base64url(buf: ArrayBuffer): string {
  const bytes = new Uint8Array(buf);
  let binary = '';
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary)
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

export function randomString(bytes = 16): string {
  const buf = new Uint8Array(bytes);
  crypto.getRandomValues(buf);
  let result = '';
  for (let i = 0; i < buf.length; i++) {
    result += buf[i].toString(16).padStart(2, '0');
  }
  return result;
}

export async function generatePkcePair(): Promise<PkcePair> {
  const codeVerifierBuf = new Uint8Array(32);
  crypto.getRandomValues(codeVerifierBuf);
  const codeVerifier = base64url(codeVerifierBuf.buffer);
  const hash = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(codeVerifier));
  const codeChallenge = base64url(hash);
  return { codeVerifier, codeChallenge };
}

const AUTH_BASE = 'https://prelive-oauth2.quran.foundation';

export async function buildLoginUrl(): Promise<{ url: string; session: AuthSession }> {
  const redirectUri = `${window.location.origin}/callback`;
  const { codeVerifier, codeChallenge } = await generatePkcePair();
  const state = randomString(16);
  const nonce = randomString(16);

  const params = new URLSearchParams();
  params.set('response_type', 'code');
  params.set('client_id', CLIENT_ID);
  params.set('redirect_uri', redirectUri);
  params.set('scope', 'openid offline_access bookmark');
  params.set('state', state);
  params.set('nonce', nonce);
  params.set('code_challenge', codeChallenge);
  params.set('code_challenge_method', 'S256');
  params.set('prompt', 'consent');

  const url = `${AUTH_BASE}/oauth2/auth?${params.toString()}`;
  const session: AuthSession = { state, nonce, codeVerifier, redirectUri };
  return { url, session };
}

export async function exchangeCodeForTokens(
  code: string,
  codeVerifier: string,
  redirectUri: string
): Promise<TokenSet | null> {
  try {
    const res = await fetch('/api/exchange', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({ code, codeVerifier, redirectUri }).toString(),
    });

    if (!res.ok) return null;

    const data = await res.json();
    return {
      accessToken: data.accessToken,
      refreshToken: data.refreshToken,
      idToken: data.idToken,
      expiresIn: data.expiresIn,
      scope: data.scope,
    };
  } catch {
    return null;
  }
}

export async function refreshAccessToken(refreshToken: string): Promise<TokenSet | null> {
  try {
    const res = await fetch('/api/refresh', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({ refreshToken }).toString(),
    });

    if (!res.ok) return null;

    const data = await res.json();
    return {
      accessToken: data.accessToken,
      refreshToken: data.refreshToken || refreshToken,
      idToken: data.idToken,
      expiresIn: data.expiresIn,
      scope: data.scope,
    };
  } catch {
    return null;
  }
}
