# QuranHub — Your AI-Powered Quran Reading Companion

> **Quran Foundation Hackathon** — Full-stack Quran reading platform with OAuth2 SSO, cloud-synced bookmarks, streak tracking, and AI-powered verse explanations.

---

## 10-Second Pitch

QuranHub is a modern web app that lets you **read all 114 surahs** with Arabic text + English translation, **bookmark verses** synced to your Quran Foundation account, **track reading streaks**, and get **AI-generated explanations** for any verse — all secured with **OAuth2 + OpenID Connect**.

---

## APIs Used

### 1. Quran Foundation Content API (Public — No Auth Required)
| Endpoint | Purpose |
|----------|---------|
| `GET /api/v4/chapters` | Fetch all 114 surahs |
| `GET /api/v4/verses/by_chapter/:id` | Fetch verses with words & translations |
| `GET /api/v4/verses/by_key/:key` | Fetch a single verse by key |
| `GET /api/v4/chapters/:id` | Fetch surah details |

Used for: Browsing surahs, reading verses with Arabic text and English translations (translation 131).

### 2. Quran Foundation User API (OAuth2 Protected)
| Endpoint | Method | Scope | Purpose |
|----------|--------|-------|---------|
| `/auth/v1/bookmarks` | POST | `bookmark` | Save a verse bookmark |
| `/auth/v1/bookmarks` | GET | `bookmark` | Fetch all user bookmarks |
| `/auth/v1/streaks/current-streak-days` | GET | `streak` | Get current reading streak |
| `/auth/v1/streaks` | GET | `streak` | Get streak history |

Used for: Cloud-synced bookmarks (add/list) and reading streak tracking via the User API.

### 3. OAuth2 / OpenID Connect (Authentication)
| Component | Protocol | Purpose |
|-----------|----------|---------|
| Authorization | OAuth2 Authorization Code + PKCE | Secure login flow |
| Identity | OpenID Connect (ID token) | Decode user profile (name, email, sub) |
| Token Refresh | Refresh Token (offline_access) | Persistent sessions across page refreshes |
| Scopes Requested | `openid offline_access bookmark streak` | Least-privilege access to required APIs |

The OAuth flow is proxied through Firebase Cloud Functions to keep the client secret server-side (confidential client pattern).

### 4. DeepSeek AI API (Verse Explanations)
| Model | Purpose |
|-------|---------|
| `deepseek-v4-flash` | Verse context, thematic analysis, historical background |

Used for: Generating detailed explanations for any verse with context, themes, and insights.

---

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Browser (React SPA)                       │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌────────────┐ │
│  │ Auth     │  │ Reader   │  │ Progress │  │ Bookmarks  │ │
│  │ (OAuth2) │  │ (Surahs) │  │ (Streaks)│  │ (Cloud)    │ │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘  └─────┬──────┘ │
│       │             │             │              │         │
│       ▼             ▼             ▼              ▼         │
│  ┌──────────────────────────────────────────────────────┐  │
│  │              Firebase Cloud Functions                 │  │
│  │  ┌─────────────┐    ┌─────────────────────────────┐  │  │
│  │  │ /exchange   │    │ /refresh                    │  │  │
│  │  │ (Token Proxy)│    │ (Token Refresher)           │  │  │
│  │  └──────┬──────┘    └──────┬──────────────────────┘  │  │
│  └─────────┼──────────────────┼─────────────────────────┘  │
│            │                  │                             │
└────────────┼──────────────────┼─────────────────────────────┘
             │                  │
             ▼                  ▼
┌──────────────────────┐  ┌──────────────────────────┐
│ Quran Foundation     │  │ Quran Foundation          │
│ OAuth2 Provider      │  │ User API                  │
│ (Hydra)              │  │ (Bookmarks, Streaks, etc.)│
└──────────────────────┘  └──────────────────────────┘

┌─────────────────────────────────────────────┐
│  Direct Browser → API (No Proxy Required)    │
│                                             │
│  Quran Foundation Content API               │
│  https://api.quran.com/api/v4/...           │
│                                             │
│  DeepSeek AI API                            │
│  https://api.deepseek.com/...               │
└─────────────────────────────────────────────┘
```

---

## Features

| Feature | Description | API |
|---------|-------------|-----|
| **Read 114 Surahs** | Arabic text + English translation with word-by-word breakdown | Content API |
| **AI Explanations** | DeepSeek generates context, themes, and historical background | DeepSeek AI |
| **Cloud Bookmarks** | Save verses to your Quran Foundation account, synced everywhere | User API + OAuth2 |
| **Reading Streaks** | Track current streak via User API instead of local storage | User API (streaks) |
| **Progress Tracking** | Mark surahs as completed, daily goals, completion heatmap | Local + User API |
| **Emotion Search** | Find surahs based on how you feel | Client-side |
| **Pagination** | Bookmarks load 10 at a time with cursor-based pagination | User API |
| **Export** | Download progress as CSV, TXT, or styled PDF | Client-side |
| **OAuth2 SSO** | Sign in with Quran Foundation account, PKCE-secured | OAuth2 + OIDC |

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 18, TypeScript, Framer Motion, React Router 7 |
| **Auth** | OAuth2 Authorization Code + PKCE + OpenID Connect |
| **Backend** | Firebase Cloud Functions (Node.js 20) — confidential client proxy |
| **Hosting** | Firebase Hosting with custom domain |
| **APIs** | Quran Foundation Content API, User API, DeepSeek AI |
| **Styling** | Custom CSS with glassmorphism + gold accent theme |

---

## Quick Start

```bash
npm install
npm start              # local dev at localhost:3000
npm run build          # production build
firebase deploy        # deploy hosting + functions
```

## Deployment

```bash
firebase deploy --only hosting     # frontend
firebase deploy --only functions   # backend proxy
```

**Live:** [https://sample-firebase-ai-appj-9c9fa.web.app](https://sample-firebase-ai-appj-9c9fa.web.app)

---

## Security

- OAuth2 client secret kept server-side in Firebase Functions (confidential client pattern)
- PKCE prevents authorization code interception
- State parameter prevents CSRF attacks
- Nonce validation for ID tokens
- Tokens stored in localStorage with automatic refresh before expiry
- All User API calls proxied through Firebase Functions — never expose tokens to third parties

---

*"The best of you are those who learn the Quran and teach it." — Prophet Muhammad (PBUH)*
