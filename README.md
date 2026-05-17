# QuranHub

> Built for the **Quran Foundation Hackathon**.

Browse 114 surahs, read verses with AI explanations, track reading progress, bookmark with notes, authenticate via OAuth2, and sync data across devices.

## Features

- **114 Surahs** — Browse chapters with Arabic text & English translations via Quran Content API
- **AI Explanations** — DeepSeek-powered verse context, themes & insights
- **Progress Tracking** — Mark surahs completed, streaks, reading stats
- **Completion Heatmap** — Visualize reading history over time
- **Bookmarks & Notes** — Save verses with personal reflections
- **Emotion Search** — Find surahs based on how you feel
- **Export** — Progress as CSV, TXT, or styled PDF
- **OAuth2 Login** — Sign in with Quran Foundation account (Authorization Code + PKCE + OpenID Connect)
- **Cloud Sync** — Progress synced via Quran Foundation User APIs
- **Firebase Hosting** — Live at umair.sbs

## Tech Stack

React 18, TypeScript, Framer Motion, Firebase Hosting & Functions, Quran Foundation APIs (Content + User), DeepSeek AI

## Project Structure

```
src/
├── components/     # Navigation, Footer, SurahModal, sections
├── pages/          # Home, Progress, Bookmarks, About, Profile, Callback
├── context/        # Auth, Progress, Bookmark providers
├── services/       # quranApi (content), deepseekApi (AI), qfOAuth (auth)
├── hooks/          # Custom React hooks
├── types/          # TypeScript interfaces
└── styles/         # Global CSS
functions/          # Firebase Cloud Functions — OAuth token proxy
```

## APIs

| API | Usage |
|-----|-------|
| Quran Foundation Content API | Chapters, verses, translations |
| Quran Foundation User API | Synced bookmarks, progress, collections (via OAuth2) |
| DeepSeek AI | Verse explanations with context & themes |

## Auth Flow

```
User clicks Sign In → PKCE + state/nonce → Quran Foundation login →
Redirects back → Firebase Function exchanges code with client_secret →
Tokens stored → User APIs called with x-auth-token + x-client-id
```

## Setup

```bash
npm install
npm start         # local dev
npm run build     # production build
firebase deploy   # deploy to Firebase
```

## Deployment

Firebase Hosting — custom domain **umair.sbs**

---

*"The best of you are those who learn the Quran and teach it."*
