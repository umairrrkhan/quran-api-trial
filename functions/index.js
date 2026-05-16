const functions = require('firebase-functions');

const CLIENT_ID = '8970e1e8-abdd-4f49-8f0e-94919142f12b';
const CLIENT_SECRET = 'w8kuv_csjmI_pyw_r~kefEBsX6';
const AUTH_BASE = 'https://prelive-oauth2.quran.foundation';

exports.exchange = functions.https.onRequest(async (req, res) => {
  try {
    res.set('Access-Control-Allow-Origin', '*');
    if (req.method === 'OPTIONS') {
      res.set('Access-Control-Allow-Methods', 'POST');
      res.set('Access-Control-Allow-Headers', 'Content-Type');
      res.status(204).end(); return;
    }
    const { code, codeVerifier, redirectUri } = req.body || {};
    if (!code || !codeVerifier || !redirectUri) {
      res.status(400).json({ error: 'Missing required fields' }); return;
    }
    const params = new URLSearchParams({
      grant_type: 'authorization_code', code,
      redirect_uri: redirectUri, code_verifier: codeVerifier,
    }).toString();
    const basic = Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64');
    const hydraRes = await fetch(`${AUTH_BASE}/oauth2/token`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded', 'Authorization': `Basic ${basic}` },
      body: params,
    });
    const data = await hydraRes.json();
    if (hydraRes.status !== 200) {
      res.status(500).json({ error: 'Hydra rejected', status: hydraRes.status, detail: data }); return;
    }
    res.json({
      accessToken: data.access_token, refreshToken: data.refresh_token,
      idToken: data.id_token, expiresIn: data.expires_in, scope: data.scope,
    });
  } catch (e) {
    res.status(500).json({ error: e.message, stack: e.stack?.split('\n').slice(0, 3).join(' | ') });
  }
});

exports.refresh = functions.https.onRequest(async (req, res) => {
  try {
    res.set('Access-Control-Allow-Origin', '*');
    if (req.method === 'OPTIONS') {
      res.set('Access-Control-Allow-Methods', 'POST');
      res.set('Access-Control-Allow-Headers', 'Content-Type');
      res.status(204).end(); return;
    }
    const { refreshToken } = req.body || {};
    if (!refreshToken) {
      res.status(400).json({ error: 'Missing refreshToken' }); return;
    }
    const basic = Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64');
    const hydraRes = await fetch(`${AUTH_BASE}/oauth2/token`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded', 'Authorization': `Basic ${basic}` },
      body: new URLSearchParams({ grant_type: 'refresh_token', refresh_token: refreshToken }).toString(),
    });
    const data = await hydraRes.json();
    if (hydraRes.status !== 200) {
      res.status(500).json({ error: 'Hydra rejected', status: hydraRes.status, detail: data }); return;
    }
    res.json({
      accessToken: data.access_token, refreshToken: data.refresh_token || refreshToken,
      idToken: data.id_token, expiresIn: data.expires_in, scope: data.scope,
    });
  } catch (e) {
    res.status(500).json({ error: e.message, stack: e.stack?.split('\n').slice(0, 3).join(' | ') });
  }
});
