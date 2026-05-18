const functions = require('firebase-functions');

const CLIENT_ID = '8970e1e8-abdd-4f49-8f0e-94919142f12b';
const CLIENT_SECRET = 'w8kuv_csjmI_pyw_r~kefEBsX6';
const AUTH_BASE = 'https://prelive-oauth2.quran.foundation';
const API_BASE = 'https://apis-prelive.quran.foundation';

function b64(s) { return Buffer.from(s).toString('base64'); }

async function proxy(bodyMap) {
  const res = await fetch(`${AUTH_BASE}/oauth2/token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded', 'Authorization': `Basic ${b64(`${CLIENT_ID}:${CLIENT_SECRET}`)}` },
    body: new URLSearchParams(bodyMap).toString(),
  });
  const json = await res.json();
  return { ok: res.status === 200, status: res.status, data: json };
}

exports.exchange = functions.https.onRequest(async (req, res) => {
  res.set('Access-Control-Allow-Origin', '*');
  if (req.method === 'OPTIONS') { res.status(204).end(); return; }
  try {
    const { code, codeVerifier, redirectUri } = req.body || {};
    if (!code || !codeVerifier || !redirectUri) { res.status(400).json({ error: 'Missing fields' }); return; }
    const r = await proxy({ grant_type: 'authorization_code', code, redirect_uri: redirectUri, code_verifier: codeVerifier });
    if (!r.ok) { res.status(500).json({ error: 'Exchange failed' }); return; }
    res.json({ accessToken: r.data.access_token, refreshToken: r.data.refresh_token, idToken: r.data.id_token, expiresIn: r.data.expires_in, scope: r.data.scope });
  } catch (e) { res.status(500).json({ error: 'Error' }); }
});

exports.refresh = functions.https.onRequest(async (req, res) => {
  res.set('Access-Control-Allow-Origin', '*');
  if (req.method === 'OPTIONS') { res.status(204).end(); return; }
  try {
    const { refreshToken } = req.body || {};
    if (!refreshToken) { res.status(400).json({ error: 'Missing refreshToken' }); return; }
    const r = await proxy({ grant_type: 'refresh_token', refresh_token: refreshToken });
    if (!r.ok) { res.status(500).json({ error: 'Refresh failed' }); return; }
    res.json({ accessToken: r.data.access_token, refreshToken: r.data.refresh_token || refreshToken, idToken: r.data.id_token, expiresIn: r.data.expires_in, scope: r.data.scope });
  } catch (e) { res.status(500).json({ error: 'Error' }); }
});

exports.user = functions.https.onRequest(async (req, res) => {
  res.set('Access-Control-Allow-Origin', '*');
  if (req.method === 'OPTIONS') { res.status(204).end(); return; }
  try {
    const { endpoint, accessToken, method, body } = req.body || {};
    if (!endpoint || !accessToken) { res.status(400).json({ error: 'Missing endpoint or accessToken' }); return; }
    const opts = { method: method || 'GET', headers: { 'x-auth-token': accessToken, 'x-client-id': CLIENT_ID } };
    if (body && method !== 'GET') { opts.headers['Content-Type'] = 'application/json'; opts.body = JSON.stringify(body); }
    const apiRes = await fetch(`${API_BASE}${endpoint}`, opts);
    res.status(apiRes.status).json(await apiRes.json());
  } catch (e) { res.status(500).json({ error: 'Error' }); }
});
