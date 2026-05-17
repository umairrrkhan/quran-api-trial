# QuranHub

> Built for the **Quran Foundation Hackathon**.

Browse 114 surahs, read verses with AI explanations, track progress, and sync data via Quran Foundation OAuth.

## Tech Stack

React 18, TypeScript, Framer Motion, Firebase Hosting + Functions, Quran Foundation API, DeepSeek API

## Workflow

```
User clicks Sign In → OAuth2 PKCE flow → Quran Foundation login → 
Redirects back → Token exchanged via Firebase Function → 
User APIs called with x-auth-token + x-client-id
```

- Auth: Authorization Code + PKCE + OpenID Connect (confidential client)
- Backend: Firebase Cloud Function proxies token exchange & refresh
- Tokens: Auto-refresh on expiry, stored in sessionStorage
- APIs: Quran Foundation User APIs for synced reading progress

## Setup

```bash
npm install
npm start         # local dev at localhost:3000
npm run build     # production build
firebase deploy   # deploy to Firebase
```

## Project Structure

```
src/
├── components/     # Navigation, Footer, SurahModal, sections
├── pages/          # Home, Progress, Bookmarks, About, Profile, Callback
├── context/        # Auth, Progress, Bookmark providers
├── services/       # qfOAuth.ts, quranApi.ts, deepseekApi.ts
├── hooks/          # Custom React hooks
├── types/          # TypeScript interfaces
└── styles/         # Global CSS
functions/          # Firebase Cloud Functions for OAuth proxy
```

## OAuth Flow

| Step | Description |
|------|-------------|
| Login | PKCE challenge + state/nonce → redirected to Quran Foundation |
| Callback | Code exchanged via Firebase Function with client_secret |
| Refresh | Access token auto-refreshed before expiry |
| Headers | User APIs called with `x-auth-token` + `x-client-id` |

## Deployment

Hosted on **Firebase** with custom domain `umair.sbs`.

---

*"The best of you are those who learn the Quran and teach it."*
