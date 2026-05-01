# Quran Journey Tracker

> Built for the **Quran Foundation Hackathon** — then extended far beyond.

A full-featured Quran companion app that lets you browse all 114 surahs, read verses with AI-powered explanations, track your reading progress, and export your journey.

## Tech Stack

| Technology | Purpose |
|-----------|---------|
| **[Quran Foundation API](https://api.quran.com)** | All Quranic content — chapters, verses, Arabic text, English translations |
| **[DeepSeek API](https://deepseek.com)** | AI-powered verse explanations with context, themes, and insights |
| **React 18 + TypeScript** | Frontend framework with full type safety |
| **Framer Motion** | Smooth animations, page transitions, and micro-interactions |
| **jsPDF** | Native programmatic PDF generation (no DOM rendering) |
| **React Router v7** | Client-side routing between Home, Progress, and About pages |
| **localStorage** | Client-side persistence of reading progress |

## Features

- **114 Surahs** — Browse all chapters with Arabic text and English translations
- **AI Explanations** — Get deep context, themes, and explanations for any verse via DeepSeek
- **Progress Tracking** — Mark surahs as completed, track overall progress
- **Completion Map** — Visual 19-column grid showing all surahs completed/not started
- **Surah Filters** — Filter the surah list by All, Completed, or Not Completed
- **Emotion-Based Search** — Type how you feel and get AI-recommended surahs
- **Export Data** — Download your progress as CSV, TXT, or a beautifully styled PDF
- **Daily Motivation** — Rotating Quranic verses and hadith to encourage daily reading
- **Streak Tracking** — Current streak, longest streak, and last read date to build habits
- **Bookmarks & Notes** — Save meaningful verses with personal reflections and AI explanations
- **Verse of the Day** — Daily rotating Quranic verses on the home page
- **Animated Lantern** — Visual progress representation with an Islamic lantern motif
- **Modern Footer** — Dark-themed animated footer with wave separator, social links, and CTA
- **Fully Responsive** — Works on desktop, tablet, and mobile

## Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm start

# Build for production
npm run build
```

## Project Structure

```
src/
├── components/           # Reusable UI components
│   ├── sections/         # Page sections (Hero, Chapters, Search)
│   ├── Navigation.tsx
│   ├── Footer.tsx
│   ├── SurahModal.tsx
│   └── ProgressJourney.tsx
├── pages/                # Route pages
│   ├── HomePage.tsx
│   ├── ProgressPage.tsx
│   └── AboutPage.tsx
├── context/              # React Context providers
│   ├── ProgressContext.tsx
│   └── BookmarkContext.tsx
├── hooks/                # Custom hooks
│   ├── useReadingProgress.ts
│   ├── useBookmarks.ts
│   ├── useLocalStorage.ts
│   └── useAnimations.ts
├── services/             # API clients (Quran API, DeepSeek API)
├── types/                # TypeScript interfaces
└── styles/               # Global CSS
```

## APIs Used

### Quran Foundation API
- `GET /api/v4/chapters` — Fetch all 114 surahs
- `GET /api/v4/chapters/:id/verses` — Fetch verses for a specific surah

### DeepSeek API
- Verse explanations with context, themes, and detailed breakdowns
- Powered by the `deepseek-v4-flash` model

## Deployment

The app is deployed on **Vercel**. Any push to the `master` branch triggers a new deployment.

## License

MIT

---

*"The best of you are those who learn the Quran and teach it." — Prophet Muhammad (PBUH)*
