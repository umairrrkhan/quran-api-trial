# QuranHub

> Built for the **Quran Foundation Hackathon** — OAuth2, User APIs, AI-powered verse explanations, progress tracking, and cloud sync.

Browse all 114 surahs, read verses with English translations, get AI-powered explanations via DeepSeek, track reading progress with streaks and heatmaps, bookmark verses with personal notes, and sign in with Quran Foundation OAuth2 for cloud-synced bookmarks.

## Features

- **114 Surahs** — Browse chapters with Arabic text + English translations
- **AI Explanations** — DeepSeek-powered verse context, themes & insights
- **Progress Tracking** — Mark surahs completed, streaks, daily goals, reading stats
- **Completion Heatmap** — 365-day visual of reading history
- **Bookmarks & Notes** — Save verses with personal reflections & AI explanations
- **Emotion Search** — Find surahs based on how you feel
- **Export** — Progress as CSV, TXT, or styled PDF
- **OAuth2 Login** — Authorization Code + PKCE + OpenID Connect with Quran Foundation
- **Cloud Sync** — User API proxy for bookmarks via Quran Foundation APIs
- **Firebase Hosting + Functions** — Live at umair.sbs

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, TypeScript, Framer Motion |
| Auth | OAuth2 Authorization Code + PKCE, OpenID Connect |
| Backend | Firebase Cloud Functions (Node.js 20) |
| Hosting | Firebase Hosting + custom domain |
| APIs | Quran Foundation Content API, Quran Foundation User API, DeepSeek AI |

## Project Structure

```
src/
├── components/     # Navigation, Footer, SurahModal, sections
├── pages/          # Home, Progress, Bookmarks, About, Profile, Callback
├── context/        # AuthContext, ProgressContext, BookmarkContext
├── services/       # quranApi.ts, deepseekApi.ts, qfOAuth.ts, qfUserApi.ts
├── hooks/          # useReadingProgress, useBookmarks, useLocalStorage
├── types/          # TypeScript interfaces
└── styles/         # Global CSS
functions/          # Firebase Cloud Functions — OAuth token proxy + User API proxy
```

## APIs

| API | Endpoints | Purpose |
|-----|-----------|---------|
| Quran Foundation Content | `GET /chapters`, `GET /verses` | Chapters + verses + translations |
| Quran Foundation User | `POST /auth/v1/bookmarks`, `GET /v1/streaks`, etc. | Bookmarks, collections, streaks |
| DeepSeek AI | Chat completions | Verse explanations with context/themes |

## Auth Flow

### OAuth2 Authorization Code + PKCE

```
1. User clicks "Sign In"
2. App generates PKCE code_challenge + state + nonce
3. Redirects to Quran Foundation authorization endpoint
4. User logs in at Quran Foundation
5. Redirects back to /callback with authorization code
6. Firebase Function exchanges code + client_secret for tokens
7. Access token stored in sessionStorage
8. User APIs called with x-auth-token + x-client-id headers
```

### Backend Architecture

```
Browser → POST /api/exchange → Firebase Function → Hydra OAuth server (with Basic auth)
Browser → POST /api/refresh  → Firebase Function → Hydra OAuth server (with Basic auth)
Browser → POST /api/user     → Firebase Function → Quran Foundation User API (with x-auth-token + x-client-id)
```

## User API Endpoints

| Function | Method | Endpoint | Description |
|----------|--------|----------|-------------|
| `getBookmarks` | GET | `/auth/v1/bookmarks` | Fetch user bookmarks |
| `createBookmark` | POST | `/auth/v1/bookmarks` | Save a new bookmark |
| `deleteBookmark` | DELETE | `/auth/v1/bookmarks/{id}` | Remove a bookmark |
| `getCollections` | GET | `/auth/v1/collections` | Fetch collections |
| `getActivityDays` | GET | `/v1/activity-days` | Fetch reading activity |
| `addActivityDay` | POST | `/v1/activity-days` | Log reading session |
| `getStreaks` | GET | `/v1/streaks` | Fetch streak data |

## Setup

```bash
npm install
npm start              # local dev at localhost:3000
npm run build          # production build
firebase deploy        # deploy hosting + functions
```

## Environment Variables

Set these in your local `.env` or Firebase project:

```
REACT_APP_QF_CLIENT_ID=your_client_id
REACT_APP_QF_REDIRECT_URI=https://your-domain.com/callback
```

For Cloud Functions (Vercel/Firebase env):

```
QF_CLIENT_ID=your_client_id
QF_CLIENT_SECRET=your_client_secret
```

## Deployment

Hosted on **Firebase** with custom domain **umair.sbs**.

```bash
firebase deploy --only hosting     # frontend
firebase deploy --only functions   # backend
```

---

*"The best of you are those who learn the Quran and teach it."*
