# 🔌 GeoQuest - Plan Integracji Nowych Usług

## Spis Treści
- [Przegląd](#przegląd)
- [Priorytetyzacja Integracji](#priorytetyzacja-integracji)
- [PostHog - Analytics](#posthog---analytics)
- [Sentry - Error Tracking](#sentry---error-tracking)
- [Upstash Redis - Rozszerzenie](#upstash-redis---rozszerzenie)
- [Stripe - Payment System](#stripe---payment-system)
- [Loops - Email Marketing](#loops---email-marketing)
- [Timeline Implementacji](#timeline-implementacji)
- [Koszty i ROI](#koszty-i-roi)

---

## Przegląd

Ten dokument opisuje szczegółowy plan integracji pięciu nowych usług w aplikacji GeoQuest:

1. **PostHog** - Product analytics i event tracking
2. **Sentry** - Error monitoring i performance tracking
3. **Upstash Redis** - Rozszerzenie (caching, session storage)
4. **Stripe** - Payment processing dla premium features
5. **Loops** - Email marketing automation

### Cele Integracji

- **Observability**: Lepszy wgląd w zachowania użytkowników i błędy
- **Monetizacja**: Możliwość oferowania premium features
- **Engagement**: Budowanie relacji z użytkownikami przez email
- **Performance**: Optymalizacja wydajności przez caching

### Zasady Implementacji

✅ **Stopniowe wdrażanie** - jedna usługa na raz
✅ **Graceful degradation** - aplikacja działa bez integracji
✅ **Privacy first** - zgoda na tracking, GDPR compliance
✅ **Free tier focus** - maksymalne wykorzystanie darmowych planów
✅ **Dokumentacja** - każda integracja z pełną dokumentacją

---

## Priorytetyzacja Integracji

### Faza 1: Observability (Tydzień 1-2)
**Priorytet**: 🔴 CRITICAL

#### 1.1 PostHog - Analytics
- **Czas implementacji**: 2-3 dni
- **Wartość biznesowa**: ⭐⭐⭐⭐⭐
- **Złożoność techniczna**: ⭐⭐☆☆☆
- **Uzasadnienie**: Kluczowe dla zrozumienia user behavior i optymalizacji

#### 1.2 Sentry - Error Tracking
- **Czas implementacji**: 2-3 dni
- **Wartość biznesowa**: ⭐⭐⭐⭐⭐
- **Złożoność techniczna**: ⭐⭐☆☆☆
- **Uzasadnienie**: Niezbędne do szybkiego wykrywania i naprawiania błędów

### Faza 2: Performance (Tydzień 3)
**Priorytet**: 🟡 HIGH

#### 2.1 Upstash Redis - Rozszerzenie
- **Czas implementacji**: 3-4 dni
- **Wartość biznesowa**: ⭐⭐⭐⭐☆
- **Złożoność techniczna**: ⭐⭐⭐☆☆
- **Uzasadnienie**: Poprawa wydajności i user experience

### Faza 3: Monetization (Tydzień 4-6)
**Priorytet**: 🟢 MEDIUM

#### 3.1 Stripe - Payments
- **Czas implementacji**: 5-7 dni
- **Wartość biznesowa**: ⭐⭐⭐⭐⭐
- **Złożoność techniczna**: ⭐⭐⭐⭐☆
- **Uzasadnienie**: Umożliwia monetyzację i rozwój produktu

#### 3.2 Loops - Email Marketing
- **Czas implementacji**: 2-3 dni
- **Wartość biznesowa**: ⭐⭐⭐⭐☆
- **Złożoność techniczna**: ⭐⭐☆☆☆
- **Uzasadnienie**: Budowanie bazy użytkowników i retention

---

## PostHog - Analytics

### Przegląd Implementacji

PostHog będzie używany do:
- Tracking user behavior (quiz starts, completions, difficulty selection)
- A/B testing nowych features
- Funnel analysis (completion rates)
- Heatmaps i session recordings
- Feature flags

### Architektura

```
┌─────────────────┐
│   Browser       │
│  (Client Side)  │
└────────┬────────┘
         │
         │ posthog.capture()
         ├─────────────────────────┐
         │                         │
         ▼                         ▼
┌─────────────────┐      ┌─────────────────┐
│  PostHog SDK    │      │  React Hooks    │
│   (posthog-js)  │      │  usePostHog()   │
└────────┬────────┘      └─────────────────┘
         │
         │ HTTPS
         ▼
┌─────────────────┐
│  PostHog Cloud  │
│ app.posthog.com │
└─────────────────┘
```

### Plan Implementacji

#### Krok 1: Instalacja i Setup (30 min)

```bash
# Install dependencies
npm install posthog-js posthog-node
```

**Pliki do utworzenia**:
- `lib/posthog/client.ts` - Client-side PostHog instance
- `lib/posthog/server.ts` - Server-side PostHog instance
- `app/providers.tsx` - PostHog Provider wrapper

#### Krok 2: Provider Setup (45 min)

**app/providers.tsx**:
```typescript
'use client'

import posthog from 'posthog-js'
import { PostHogProvider } from 'posthog-js/react'
import { useEffect } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'

if (typeof window !== 'undefined') {
  posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY!, {
    api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://app.posthog.com',
    capture_pageview: false, // Disable automatic pageview capture
    capture_pageleave: true,
    loaded: (posthog) => {
      if (process.env.NODE_ENV === 'development') posthog.debug()
    },
  })
}

export function PHProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  // Track pageviews
  useEffect(() => {
    if (pathname) {
      let url = window.origin + pathname
      if (searchParams && searchParams.toString()) {
        url = url + `?${searchParams.toString()}`
      }
      posthog.capture('$pageview', {
        '$current_url': url,
      })
    }
  }, [pathname, searchParams])

  return <PostHogProvider client={posthog}>{children}</PostHogProvider>
}
```

**app/layout.tsx** (update):
```typescript
import { PHProvider } from './providers'

export default function RootLayout({ children }) {
  return (
    <html lang="pl">
      <body>
        <PHProvider>
          <QuizProvider>
            {children}
          </QuizProvider>
        </PHProvider>
      </body>
    </html>
  )
}
```

#### Krok 3: Event Tracking (2 godziny)

**lib/posthog/events.ts**:
```typescript
import posthog from 'posthog-js'

// Event types
export const EVENTS = {
  // Quiz lifecycle
  QUIZ_STARTED: 'quiz_started',
  QUIZ_COMPLETED: 'quiz_completed',
  QUIZ_ABANDONED: 'quiz_abandoned',

  // Question events
  QUESTION_ANSWERED: 'question_answered',
  QUESTION_SKIPPED: 'question_skipped',
  QUESTION_TIMEOUT: 'question_timeout',

  // Badge events
  BADGE_EARNED: 'badge_earned',
  BADGE_SHARED: 'badge_shared',

  // Engagement
  DIFFICULTY_SELECTED: 'difficulty_selected',
  SHARE_CLICKED: 'share_clicked',
  PLAY_AGAIN: 'play_again',
} as const

export type EventName = typeof EVENTS[keyof typeof EVENTS]

// Event properties interfaces
interface QuizStartedProps {
  difficulty: 'easy' | 'medium' | 'hard'
  sessionId: string
}

interface QuizCompletedProps {
  difficulty: 'easy' | 'medium' | 'hard'
  score: number
  correctAnswers: number
  totalQuestions: number
  timeSpent: number // seconds
  badge: string
  sessionId: string
}

interface QuestionAnsweredProps {
  questionId: string
  questionType: string
  difficulty: string
  isCorrect: boolean
  timeSpent: number
  questionNumber: number
  sessionId: string
}

// Tracking functions
export const trackQuizStarted = (props: QuizStartedProps) => {
  posthog.capture(EVENTS.QUIZ_STARTED, props)
}

export const trackQuizCompleted = (props: QuizCompletedProps) => {
  posthog.capture(EVENTS.QUIZ_COMPLETED, props)

  // Set user properties
  posthog.people.set({
    last_quiz_completed: new Date().toISOString(),
    last_score: props.score,
    last_badge: props.badge,
  })

  // Increment quiz count
  posthog.people.increment('total_quizzes_completed')
}

export const trackQuestionAnswered = (props: QuestionAnsweredProps) => {
  posthog.capture(EVENTS.QUESTION_ANSWERED, props)
}

// ... more tracking functions
```

#### Krok 4: Integration w QuizContext (1 godzina)

**lib/context/QuizContext.tsx** (updates):
```typescript
import { trackQuizStarted, trackQuizCompleted, trackQuestionAnswered } from '@/lib/posthog/events'

// In startQuiz function:
const startQuiz = async (difficulty: Difficulty) => {
  // ... existing code

  // Track quiz start
  trackQuizStarted({
    difficulty,
    sessionId: newSession.sessionId,
  })
}

// In submitAnswer function:
const submitAnswer = (userAnswer: string | Coordinates | null) => {
  // ... existing code

  // Track question answered
  trackQuestionAnswered({
    questionId: currentQuestion.id,
    questionType: currentQuestion.type,
    difficulty: session.difficulty,
    isCorrect: isCorrect,
    timeSpent: timeTaken,
    questionNumber: session.currentIndex + 1,
    sessionId: session.sessionId,
  })
}

// In getResults function:
const getResults = (): QuizResults | null => {
  // ... existing code

  // Track quiz completion
  trackQuizCompleted({
    difficulty: session.difficulty,
    score: results.score,
    correctAnswers: results.correctAnswers,
    totalQuestions: results.totalQuestions,
    timeSpent: Math.floor((Date.now() - session.startTime) / 1000),
    badge: results.badge,
    sessionId: session.sessionId,
  })

  return results
}
```

#### Krok 5: Privacy & GDPR Compliance (1 godzina)

**components/CookieConsent.tsx** (nowy plik):
```typescript
'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import posthog from 'posthog-js'

export function CookieConsent() {
  const [show, setShow] = useState(false)

  useEffect(() => {
    // Check if user has already consented
    const consent = localStorage.getItem('cookie-consent')
    if (!consent) {
      setShow(true)
    }
  }, [])

  const acceptAll = () => {
    localStorage.setItem('cookie-consent', 'all')
    posthog.opt_in_capturing()
    setShow(false)
  }

  const acceptEssential = () => {
    localStorage.setItem('cookie-consent', 'essential')
    posthog.opt_out_capturing()
    setShow(false)
  }

  if (!show) return null

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 md:left-auto md:right-4 md:max-w-md">
      <Card className="p-6">
        <h3 className="text-lg font-bold mb-2">Ciasteczka 🍪</h3>
        <p className="text-sm text-text-secondary mb-4">
          Używamy ciasteczek do analizy użytkowania i poprawy aplikacji.
          Możesz zaakceptować wszystkie lub tylko niezbędne.
        </p>
        <div className="flex gap-2">
          <Button variant="secondary" onClick={acceptEssential}>
            Tylko niezbędne
          </Button>
          <Button onClick={acceptAll}>
            Akceptuj wszystkie
          </Button>
        </div>
      </Card>
    </div>
  )
}
```

Dodaj do **app/layout.tsx**:
```typescript
import { CookieConsent } from '@/components/CookieConsent'

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {/* ... */}
        <CookieConsent />
      </body>
    </html>
  )
}
```

#### Krok 6: Dashboards & Insights (30 min)

W PostHog Dashboard utwórz:

1. **Quiz Funnel**:
   - Home screen view → Difficulty selected → Quiz started → Quiz completed

2. **Key Metrics Dashboard**:
   - Daily Active Users (DAU)
   - Quiz completion rate
   - Average score by difficulty
   - Time spent per quiz
   - Badge distribution

3. **Retention Analysis**:
   - D1, D7, D30 retention
   - Cohort analysis

### Zmienne Środowiskowe

```bash
# .env.local
NEXT_PUBLIC_POSTHOG_KEY=phc_xxxxxxxxxxxxxxxxxxxxxxxxx
NEXT_PUBLIC_POSTHOG_HOST=https://app.posthog.com

# .env.production (Vercel)
NEXT_PUBLIC_POSTHOG_KEY=[production_key]
NEXT_PUBLIC_POSTHOG_HOST=https://app.posthog.com
```

### Testing Plan

1. **Local Testing**:
   ```bash
   # Enable debug mode
   posthog.debug()

   # Complete quiz flow and check console
   # Verify events in PostHog dashboard (Live events)
   ```

2. **Staging Testing**:
   - Deploy to preview branch
   - Complete 5-10 quiz sessions
   - Verify events appear in dashboard
   - Check funnel visualization

3. **Production Rollout**:
   - Deploy to production
   - Monitor first 24 hours
   - Check for any errors in Sentry (when integrated)

### Success Metrics

- ✅ All events tracking correctly
- ✅ Funnel analysis showing completion rate
- ✅ No performance impact (<50ms overhead)
- ✅ GDPR compliant (cookie consent)
- ✅ Dashboard insights actionable

### Maintenance

- **Weekly**: Review key metrics, identify drop-off points
- **Monthly**: Analyze trends, A/B test results
- **Quarterly**: Review event taxonomy, deprecate unused events

---

## Sentry - Error Tracking

### Przegląd Implementacji

Sentry będzie używany do:
- Real-time error tracking
- Performance monitoring (transaction tracking)
- Release tracking
- User feedback
- Source maps dla lepszego debugowania

### Architektura

```
┌──────────────────────────────────────┐
│         Application                  │
├──────────────────────────────────────┤
│                                      │
│  ┌────────────┐    ┌──────────────┐ │
│  │  Client    │    │   Server     │ │
│  │  (Browser) │    │   (Node.js)  │ │
│  └─────┬──────┘    └──────┬───────┘ │
│        │                  │         │
│        │  Errors/Perf     │         │
└────────┼──────────────────┼─────────┘
         │                  │
         │   HTTPS          │
         ▼                  ▼
┌──────────────────────────────────────┐
│         Sentry Platform              │
├──────────────────────────────────────┤
│  • Error aggregation                 │
│  • Source maps processing            │
│  • Issue tracking                    │
│  • Performance insights              │
│  • Alerts & notifications            │
└──────────────────────────────────────┘
```

### Plan Implementacji

#### Krok 1: Instalacja via Wizard (15 min)

```bash
# Install Sentry SDK and run wizard
npm install @sentry/nextjs
npx @sentry/wizard@latest -i nextjs
```

Wizard automatycznie utworzy:
- `sentry.client.config.ts`
- `sentry.server.config.ts`
- `sentry.edge.config.ts`
- `instrumentation.ts`
- `next.config.js` (update)

#### Krok 2: Konfiguracja Client-Side (30 min)

**sentry.client.config.ts**:
```typescript
import * as Sentry from '@sentry/nextjs'

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,

  // Environment
  environment: process.env.NODE_ENV,

  // Performance Monitoring
  tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,

  // Session Replay
  replaysOnErrorSampleRate: 1.0, // Capture 100% of sessions with errors
  replaysSessionSampleRate: 0.1,  // Capture 10% of normal sessions

  // Error filtering
  beforeSend(event, hint) {
    // Filter out non-critical errors
    const error = hint.originalException

    // Ignore cancelled fetch requests
    if (error && error.toString().includes('AbortError')) {
      return null
    }

    // Ignore network errors
    if (event.exception?.values?.[0]?.type === 'NetworkError') {
      return null
    }

    return event
  },

  // Integrations
  integrations: [
    new Sentry.BrowserTracing({
      // Custom instrumentation
      tracingOrigins: ['localhost', 'geoquest.vercel.app'],

      // Disable automatic instrumentation for certain routes
      shouldCreateSpanForRequest: (url) => {
        // Don't trace static assets
        return !url.includes('/_next/static/')
      },
    }),
    new Sentry.Replay({
      maskAllText: false,
      blockAllMedia: false,
    }),
  ],

  // Release tracking
  release: process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA,

  // Source maps
  // Automatically handled by Sentry webpack plugin
})
```

#### Krok 3: Konfiguracja Server-Side (30 min)

**sentry.server.config.ts**:
```typescript
import * as Sentry from '@sentry/nextjs'

Sentry.init({
  dsn: process.env.SENTRY_DSN,

  environment: process.env.NODE_ENV,

  // Performance Monitoring
  tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,

  // Error filtering
  beforeSend(event) {
    // Filter server-side errors
    return event
  },

  // Release tracking
  release: process.env.VERCEL_GIT_COMMIT_SHA,
})
```

#### Krok 4: Error Boundary (45 min)

**app/error.tsx** (Next.js Error Boundary):
```typescript
'use client'

import { useEffect } from 'react'
import * as Sentry from '@sentry/nextjs'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log error to Sentry
    Sentry.captureException(error)
  }, [error])

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="max-w-md w-full p-8 text-center">
        <div className="text-6xl mb-4">😕</div>
        <h2 className="text-2xl font-bold mb-2">Coś poszło nie tak</h2>
        <p className="text-text-secondary mb-6">
          Przepraszamy za problemy. Nasz zespół został powiadomiony i pracuje nad rozwiązaniem.
        </p>
        <div className="flex gap-2 justify-center">
          <Button onClick={() => reset()}>
            Spróbuj ponownie
          </Button>
          <Button variant="secondary" onClick={() => window.location.href = '/'}>
            Wróć do strony głównej
          </Button>
        </div>
        {error.digest && (
          <p className="mt-4 text-xs text-text-tertiary">
            Error ID: {error.digest}
          </p>
        )}
      </Card>
    </div>
  )
}
```

**app/global-error.tsx** (Root Error Boundary):
```typescript
'use client'

import { useEffect } from 'react'
import * as Sentry from '@sentry/nextjs'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    Sentry.captureException(error)
  }, [error])

  return (
    <html>
      <body>
        <div style={{ padding: '20px', textAlign: 'center' }}>
          <h2>Something went wrong!</h2>
          <button onClick={() => reset()}>Try again</button>
        </div>
      </body>
    </html>
  )
}
```

#### Krok 5: Performance Monitoring (1 godzina)

**lib/sentry/performance.ts**:
```typescript
import * as Sentry from '@sentry/nextjs'

// Custom transaction tracking
export const trackQuizPerformance = (sessionId: string) => {
  const transaction = Sentry.startTransaction({
    op: 'quiz',
    name: 'Quiz Session',
    data: { sessionId },
  })

  return {
    // Track question loading
    trackQuestionLoad: (questionId: string) => {
      const span = transaction.startChild({
        op: 'question.load',
        description: `Load question ${questionId}`,
      })
      return () => span.finish()
    },

    // Track answer submission
    trackAnswerSubmit: (questionId: string) => {
      const span = transaction.startChild({
        op: 'answer.submit',
        description: `Submit answer for ${questionId}`,
      })
      return () => span.finish()
    },

    // Finish transaction
    finish: () => transaction.finish(),
  }
}

// API performance monitoring
export const trackAPICall = async <T>(
  endpoint: string,
  operation: () => Promise<T>
): Promise<T> => {
  const transaction = Sentry.startTransaction({
    op: 'http.client',
    name: `API ${endpoint}`,
  })

  try {
    const result = await operation()
    transaction.setStatus('ok')
    return result
  } catch (error) {
    transaction.setStatus('internal_error')
    Sentry.captureException(error)
    throw error
  } finally {
    transaction.finish()
  }
}
```

Integration w **lib/context/QuizContext.tsx**:
```typescript
import { trackQuizPerformance } from '@/lib/sentry/performance'

const startQuiz = async (difficulty: Difficulty) => {
  const performance = trackQuizPerformance(newSession.sessionId)

  // ... quiz logic

  // When quiz completes
  performance.finish()
}
```

#### Krok 6: User Context & Breadcrumbs (30 min)

**lib/sentry/context.ts**:
```typescript
import * as Sentry from '@sentry/nextjs'

// Set user context (after user action)
export const setSentryUser = (userId: string, email?: string) => {
  Sentry.setUser({
    id: userId,
    email: email,
  })
}

// Clear user context (on logout/reset)
export const clearSentryUser = () => {
  Sentry.setUser(null)
}

// Add custom breadcrumb
export const addBreadcrumb = (
  message: string,
  category: string,
  level: 'info' | 'warning' | 'error' = 'info'
) => {
  Sentry.addBreadcrumb({
    message,
    category,
    level,
    timestamp: Date.now() / 1000,
  })
}
```

Usage przykład:
```typescript
// In QuizContext
import { addBreadcrumb } from '@/lib/sentry/context'

const startQuiz = (difficulty: Difficulty) => {
  addBreadcrumb(
    `Started ${difficulty} quiz`,
    'quiz',
    'info'
  )

  // ... rest of logic
}
```

#### Krok 7: Source Maps Configuration (15 min)

**next.config.js** (aktualizacja automatyczna przez wizard):
```javascript
const { withSentryConfig } = require('@sentry/nextjs')

const nextConfig = {
  // ... existing config
}

module.exports = withSentryConfig(
  nextConfig,
  {
    // Sentry webpack plugin options
    silent: true,
    org: process.env.SENTRY_ORG,
    project: process.env.SENTRY_PROJECT,
  },
  {
    // Upload source maps
    widenClientFileUpload: true,
    transpileClientSDK: true,
    hideSourceMaps: true,
    disableLogger: true,
  }
)
```

### Zmienne Środowiskowe

```bash
# .env.local
SENTRY_DSN=https://xxxxx@oxxxxx.ingest.sentry.io/xxxxx
SENTRY_AUTH_TOKEN=sntrys_xxxxxxxxxxxxxxxxxxxxx
SENTRY_ORG=your-org-slug
SENTRY_PROJECT=geo-quest

# .env.production (Vercel)
SENTRY_DSN=[production_dsn]
SENTRY_AUTH_TOKEN=[auth_token]
SENTRY_ORG=your-org-slug
SENTRY_PROJECT=geo-quest
NEXT_PUBLIC_SENTRY_DSN=[production_dsn]
```

### Alerting Configuration

W Sentry Dashboard:

1. **Error Alerts**:
   - New issue in production
   - Issue frequency spike (>10 events/min)
   - Regression (reopened issue)

2. **Performance Alerts**:
   - P95 transaction duration > 3s
   - Throughput spike
   - Failure rate > 5%

3. **Integration**:
   - Slack notifications
   - Email alerts (critical only)

### Testing Plan

```typescript
// Test error capturing
try {
  throw new Error('Test Sentry error')
} catch (error) {
  Sentry.captureException(error)
}

// Test performance tracking
const transaction = Sentry.startTransaction({ name: 'Test Transaction' })
// ... operations
transaction.finish()

// Verify in Sentry Dashboard → Issues & Performance
```

### Success Metrics

- ✅ All errors captured with stack traces
- ✅ Source maps working (readable stack traces)
- ✅ Performance transactions tracking
- ✅ Alerts configured and working
- ✅ <1% overhead on application performance

---

## Upstash Redis - Rozszerzenie

### Obecny Stan

Obecnie Redis jest używany tylko do **rate limiting** (`/api/rate-limit`).

### Nowe Use Cases

1. **Session Storage** - Przechowywanie quiz sessions
2. **Leaderboard** - Global rankings
3. **Caching** - Questions cache, results cache
4. **Real-time Stats** - Live quiz statistics

### Plan Rozszerzenia

#### Use Case 1: Session Storage (2 godziny)

**lib/redis/session.ts**:
```typescript
import { Redis } from '@upstash/redis'

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
})

export interface QuizSession {
  sessionId: string
  difficulty: string
  questions: Question[]
  currentIndex: number
  answers: Answer[]
  startTime: number
}

// Save session (TTL: 1 hour)
export async function saveSession(session: QuizSession): Promise<void> {
  const key = `session:${session.sessionId}`
  await redis.setex(key, 3600, JSON.stringify(session))
}

// Get session
export async function getSession(sessionId: string): Promise<QuizSession | null> {
  const key = `session:${sessionId}`
  const data = await redis.get(key)
  return data ? JSON.parse(data as string) : null
}

// Delete session
export async function deleteSession(sessionId: string): Promise<void> {
  const key = `session:${sessionId}`
  await redis.del(key)
}

// Extend session TTL
export async function extendSession(sessionId: string): Promise<void> {
  const key = `session:${sessionId}`
  await redis.expire(key, 3600)
}
```

**Benefit**: Persystencja quizów między refreshami

#### Use Case 2: Global Leaderboard (3 godziny)

**lib/redis/leaderboard.ts**:
```typescript
import { Redis } from '@upstash/redis'

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
})

export interface LeaderboardEntry {
  userId: string
  nickname: string
  score: number
  difficulty: string
  completedAt: string
}

// Add score to leaderboard
export async function addScore(entry: LeaderboardEntry): Promise<void> {
  const key = `leaderboard:${entry.difficulty}`

  // Use sorted set (ZADD)
  await redis.zadd(key, {
    score: entry.score,
    member: JSON.stringify({
      userId: entry.userId,
      nickname: entry.nickname,
      completedAt: entry.completedAt,
    }),
  })

  // Keep only top 100
  await redis.zremrangebyrank(key, 0, -101)
}

// Get top N scores
export async function getTopScores(
  difficulty: string,
  limit: number = 10
): Promise<LeaderboardEntry[]> {
  const key = `leaderboard:${difficulty}`

  // Get top scores (reverse order)
  const results = await redis.zrevrange(key, 0, limit - 1, {
    withScores: true,
  })

  return results.map((item: any) => ({
    ...JSON.parse(item.member),
    score: item.score,
    difficulty,
  }))
}

// Get user rank
export async function getUserRank(
  userId: string,
  difficulty: string
): Promise<number | null> {
  const key = `leaderboard:${difficulty}`

  // This requires iterating, not efficient
  // Better: use separate key per user
  const allScores = await redis.zrevrange(key, 0, -1)

  const rank = allScores.findIndex((item: any) => {
    const data = JSON.parse(item)
    return data.userId === userId
  })

  return rank === -1 ? null : rank + 1
}

// Get scores around user
export async function getScoresAroundUser(
  userId: string,
  difficulty: string,
  range: number = 5
): Promise<LeaderboardEntry[]> {
  // Implementation similar to getUserRank + range
  // Returns [user-range, ..., user, ..., user+range]
  return []
}
```

**Nowe API Routes**:
- `POST /api/leaderboard` - Submit score
- `GET /api/leaderboard?difficulty=medium&limit=10` - Get top scores
- `GET /api/leaderboard/user/:userId?difficulty=medium` - Get user rank

**Nowy Component**:
- `components/Leaderboard.tsx` - Display rankings

#### Use Case 3: Questions Caching (1 godzina)

**lib/redis/cache.ts**:
```typescript
import { Redis } from '@upstash/redis'

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
})

// Cache questions (TTL: 24 hours)
export async function cacheQuestions(questions: Question[]): Promise<void> {
  const key = 'questions:all'
  await redis.setex(key, 86400, JSON.stringify(questions))
}

// Get cached questions
export async function getCachedQuestions(): Promise<Question[] | null> {
  const key = 'questions:all'
  const data = await redis.get(key)
  return data ? JSON.parse(data as string) : null
}

// Invalidate cache (on questions update)
export async function invalidateQuestionsCache(): Promise<void> {
  const key = 'questions:all'
  await redis.del(key)
}
```

**Benefit**: Szybsze ładowanie pytań, redukcja parsowania JSON

#### Use Case 4: Real-time Stats (2 godziny)

**lib/redis/stats.ts**:
```typescript
import { Redis } from '@upstash/redis'

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
})

// Increment stat counter
export async function incrementStat(key: string, value: number = 1): Promise<void> {
  await redis.incrby(`stats:${key}`, value)
}

// Get stat
export async function getStat(key: string): Promise<number> {
  const value = await redis.get(`stats:${key}`)
  return value ? parseInt(value as string) : 0
}

// Track daily stats
export async function trackDailyQuizCompleted(difficulty: string): Promise<void> {
  const today = new Date().toISOString().split('T')[0]
  await incrementStat(`daily:${today}:quizzes:${difficulty}`)
  await incrementStat(`daily:${today}:quizzes:total`)
}

// Get daily stats
export async function getDailyStats(date: string): Promise<Record<string, number>> {
  const keys = [
    `stats:daily:${date}:quizzes:easy`,
    `stats:daily:${date}:quizzes:medium`,
    `stats:daily:${date}:quizzes:hard`,
    `stats:daily:${date}:quizzes:total`,
  ]

  const values = await redis.mget(...keys)

  return {
    easy: parseInt(values[0] as string) || 0,
    medium: parseInt(values[1] as string) || 0,
    hard: parseInt(values[2] as string) || 0,
    total: parseInt(values[3] as string) || 0,
  }
}
```

**Nowy Component**:
- `components/LiveStats.tsx` - Real-time statistics display

### Data Retention Policy

- **Rate limits**: 15 minutes TTL
- **Sessions**: 1 hour TTL
- **Leaderboard**: Permanent (top 100)
- **Questions cache**: 24 hours TTL
- **Daily stats**: 90 days retention

### Success Metrics

- ✅ Session persistence working
- ✅ Leaderboard performant (<100ms)
- ✅ Cache hit ratio > 80%
- ✅ Redis usage < 10k commands/day (free tier)

---

## Stripe - Payment System

### Business Model

#### Free Tier
- 5 quizzes/dzień
- Basic badges
- Ads displayed

#### Premium - 19 PLN/miesiąc (~$5)
- Unlimited quizzes
- Exclusive badges
- Advanced stats & insights
- Ad-free experience
- Priority support

### Architektura

```
┌────────────────────────────────────────────┐
│           Frontend (React)                 │
├────────────────────────────────────────────┤
│  ┌──────────────┐      ┌────────────────┐ │
│  │   Pricing    │      │   Checkout     │ │
│  │   Page       │─────▶│   Button       │ │
│  └──────────────┘      └────────┬───────┘ │
│                                 │         │
└─────────────────────────────────┼─────────┘
                                  │
                                  │ Create Checkout Session
                                  ▼
┌────────────────────────────────────────────┐
│       API Route: /api/checkout/create      │
│  • Create Stripe Checkout Session          │
│  • Return checkout URL                     │
└────────────────┬───────────────────────────┘
                 │
                 │ Redirect to Stripe Checkout
                 ▼
┌────────────────────────────────────────────┐
│         Stripe Hosted Checkout             │
│  • Secure payment form                     │
│  • PCI compliant                           │
│  • Multiple payment methods                │
└────────────────┬───────────────────────────┘
                 │
                 │ On success
                 ▼
┌────────────────────────────────────────────┐
│     Stripe Webhook: /api/webhooks/stripe   │
│  • Verify signature                        │
│  • Handle events:                          │
│    - checkout.session.completed            │
│    - customer.subscription.updated         │
│    - customer.subscription.deleted         │
└────────────────┬───────────────────────────┘
                 │
                 │ Update user status
                 ▼
┌────────────────────────────────────────────┐
│          Database (Future: Supabase)       │
│  • User premium status                     │
│  • Subscription details                    │
│  • Payment history                         │
└────────────────────────────────────────────┘
```

### Plan Implementacji

#### Krok 1: Stripe Setup (30 min)

1. Create Stripe account: stripe.com
2. Get API keys (Test mode)
3. Create Product:   - Name: "GeoQuest Premium"
   - Pricing: 19 PLN/month recurring

4. Configure webhooks:
   - Endpoint: `https://geoquest.vercel.app/api/webhooks/stripe`
   - Events: `checkout.session.completed`, `customer.subscription.*`

#### Krok 2: API Routes (3 godziny)

**app/api/checkout/create/route.ts**:
```typescript
import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
})

export async function POST(req: NextRequest) {
  try {
    const { priceId, userId, email } = await req.json()

    // Create Checkout Session
    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card', 'p24', 'blik'], // Polish payment methods
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      customer_email: email,
      client_reference_id: userId,
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/premium/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/premium`,
      metadata: {
        userId,
      },
      allow_promotion_codes: true,
      billing_address_collection: 'required',
      locale: 'pl',
    })

    return NextResponse.json({ url: session.url })
  } catch (error) {
    console.error('Stripe checkout error:', error)
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    )
  }
}
```

**app/api/webhooks/stripe/route.ts**:
```typescript
import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { headers } from 'next/headers'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
})

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!

export async function POST(req: NextRequest) {
  const body = await req.text()
  const signature = headers().get('stripe-signature')!

  let event: Stripe.Event

  try {
    // Verify webhook signature
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
  } catch (err) {
    console.error('Webhook signature verification failed:', err)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  // Handle events
  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.Checkout.Session

      // Activate premium for user
      const userId = session.client_reference_id!
      const customerId = session.customer as string
      const subscriptionId = session.subscription as string

      // TODO: Save to database
      // await activatePremium(userId, customerId, subscriptionId)

      console.log(`✅ Premium activated for user: ${userId}`)
      break
    }

    case 'customer.subscription.updated': {
      const subscription = event.data.object as Stripe.Subscription

      // Update subscription status
      const customerId = subscription.customer as string
      const status = subscription.status

      // TODO: Update in database
      // await updateSubscriptionStatus(customerId, status)

      console.log(`📝 Subscription updated: ${customerId} - ${status}`)
      break
    }

    case 'customer.subscription.deleted': {
      const subscription = event.data.object as Stripe.Subscription

      // Deactivate premium
      const customerId = subscription.customer as string

      // TODO: Deactivate in database
      // await deactivatePremium(customerId)

      console.log(`❌ Premium deactivated for: ${customerId}`)
      break
    }

    default:
      console.log(`Unhandled event type: ${event.type}`)
  }

  return NextResponse.json({ received: true })
}
```

**app/api/subscription/portal/route.ts** (Customer Portal):
```typescript
import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
})

export async function POST(req: NextRequest) {
  try {
    const { customerId } = await req.json()

    // Create portal session
    const session = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: `${process.env.NEXT_PUBLIC_APP_URL}/premium`,
    })

    return NextResponse.json({ url: session.url })
  } catch (error) {
    console.error('Portal session error:', error)
    return NextResponse.json(
      { error: 'Failed to create portal session' },
      { status: 500 }
    )
  }
}
```

#### Krok 3: Frontend Components (4 godziny)

**app/premium/page.tsx** (Pricing Page):
```typescript
'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'

export default function PremiumPage() {
  const [loading, setLoading] = useState(false)

  const handleCheckout = async () => {
    setLoading(true)

    try {
      const res = await fetch('/api/checkout/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          priceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_ID,
          userId: 'anonymous', // TODO: Get from auth
          email: '', // TODO: Get from user
        }),
      })

      const { url } = await res.json()

      // Redirect to Stripe Checkout
      window.location.href = url
    } catch (error) {
      console.error('Checkout error:', error)
      alert('Błąd podczas tworzenia sesji płatności')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-12">
          Wybierz Plan
        </h1>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Free Tier */}
          <Card className="p-8">
            <h2 className="text-2xl font-bold mb-4">Darmowy</h2>
            <p className="text-4xl font-bold mb-6">
              0 PLN<span className="text-lg text-text-secondary">/miesiąc</span>
            </p>

            <ul className="space-y-3 mb-8">
              <li className="flex items-center gap-2">
                <span className="text-primary">✓</span>
                5 quizów dziennie
              </li>
              <li className="flex items-center gap-2">
                <span className="text-primary">✓</span>
                Podstawowe odznaki
              </li>
              <li className="flex items-center gap-2">
                <span className="text-text-tertiary">✗</span>
                Zaawansowane statystyki
              </li>
              <li className="flex items-center gap-2">
                <span className="text-text-tertiary">✗</span>
                Tryb bez reklam
              </li>
            </ul>

            <Button variant="secondary" disabled className="w-full">
              Obecny Plan
            </Button>
          </Card>

          {/* Premium Tier */}
          <Card className="p-8 border-2 border-primary">
            <div className="inline-block bg-primary text-white px-3 py-1 rounded-full text-sm mb-4">
              Najpopularniejszy
            </div>

            <h2 className="text-2xl font-bold mb-4">Premium</h2>
            <p className="text-4xl font-bold mb-6">
              19 PLN<span className="text-lg text-text-secondary">/miesiąc</span>
            </p>

            <ul className="space-y-3 mb-8">
              <li className="flex items-center gap-2">
                <span className="text-primary">✓</span>
                Nieograniczone quizy
              </li>
              <li className="flex items-center gap-2">
                <span className="text-primary">✓</span>
                Ekskluzywne odznaki
              </li>
              <li className="flex items-center gap-2">
                <span className="text-primary">✓</span>
                Zaawansowane statystyki
              </li>
              <li className="flex items-center gap-2">
                <span className="text-primary">✓</span>
                Tryb bez reklam
              </li>
              <li className="flex items-center gap-2">
                <span className="text-primary">✓</span>
                Priorytetowe wsparcie
              </li>
            </ul>

            <Button
              className="w-full"
              onClick={handleCheckout}
              disabled={loading}
            >
              {loading ? 'Ładowanie...' : 'Rozpocznij Premium'}
            </Button>
          </Card>
        </div>
      </div>
    </div>
  )
}
```

**components/PremiumBadge.tsx**:
```typescript
export function PremiumBadge() {
  return (
    <div className="inline-flex items-center gap-2 bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
      <span>⭐</span>
      <span>Premium</span>
    </div>
  )
}
```

#### Krok 4: Premium Features (2 godziny)

**lib/premium/check.ts**:
```typescript
// Check if user has premium
export async function isPremiumUser(userId: string): Promise<boolean> {
  // TODO: Check in database
  // For now, return false
  return false
}

// Get premium features
export function getPremiumFeatures() {
  return {
    unlimitedQuizzes: true,
    exclusiveBadges: ['🏆 Master', '🌟 Legend', '👑 Champion'],
    advancedStats: true,
    adFree: true,
    prioritySupport: true,
  }
}

// Check quiz limit
export async function checkQuizLimit(userId: string): Promise<{
  canPlay: boolean
  remainingToday: number
  resetAt: Date
}> {
  const isPremium = await isPremiumUser(userId)

  if (isPremium) {
    return {
      canPlay: true,
      remainingToday: Infinity,
      resetAt: new Date(),
    }
  }

  // Check daily limit (5 quizzes for free users)
  const today = new Date().toISOString().split('T')[0]
  // TODO: Get from Redis
  const quizzesToday = 0 // await getQuizCount(userId, today)

  const remaining = 5 - quizzesToday
  const resetAt = new Date()
  resetAt.setHours(24, 0, 0, 0)

  return {
    canPlay: remaining > 0,
    remainingToday: Math.max(0, remaining),
    resetAt,
  }
}
```

Integration w **components/screens/HomeScreen.tsx**:
```typescript
import { checkQuizLimit } from '@/lib/premium/check'

export function HomeScreen() {
  const [limit, setLimit] = useState<any>(null)

  useEffect(() => {
    checkQuizLimit('anonymous').then(setLimit)
  }, [])

  if (limit && !limit.canPlay) {
    return (
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-4">
          Osiągnąłeś dzienny limit quizów
        </h2>
        <p className="text-text-secondary mb-6">
          Masz {limit.remainingToday} pozostałe quizy.
          Reset: {limit.resetAt.toLocaleTimeString('pl-PL')}
        </p>
        <Button onClick={() => router.push('/premium')}>
          Przejdź na Premium
        </Button>
      </div>
    )
  }

  // ... rest of component
}
```

### Zmienne Środowiskowe

```bash
# .env.local (Test Mode)
STRIPE_SECRET_KEY=sk_test_xxxxxxxxxxxxx
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_xxxxxxxxxxxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxx
NEXT_PUBLIC_STRIPE_PRICE_ID=price_xxxxxxxxxxxxx

# .env.production (Live Mode)
STRIPE_SECRET_KEY=sk_live_xxxxxxxxxxxxx
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_xxxxxxxxxxxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxx
NEXT_PUBLIC_STRIPE_PRICE_ID=price_xxxxxxxxxxxxx
```

### Testing Plan

1. **Test Mode Testing**:
   - Use test card: `4242 4242 4242 4242`
   - CVC: any 3 digits
   - Expiry: any future date
   - Complete checkout flow
   - Verify webhook events

2. **Webhook Testing**:
   ```bash
   # Install Stripe CLI
   brew install stripe/stripe-cli/stripe

   # Login
   stripe login

   # Forward webhooks to local
   stripe listen --forward-to localhost:3000/api/webhooks/stripe

   # Trigger test events
   stripe trigger checkout.session.completed
   ```

3. **Production Testing**:
   - Start with very small amount (1 PLN test)
   - Verify full flow
   - Test refunds
   - Test subscription cancellation

### Success Metrics

- ✅ Checkout flow working
- ✅ Webhooks handling correctly
- ✅ Premium features gated properly
- ✅ Customer portal accessible
- ✅ Payment success rate > 95%

### Financial Projections

**Costs**:
- Stripe fees: 1.4% + 1 PLN per transaction
- Monthly subscription @ 19 PLN:
  - Stripe fee: ~1.27 PLN
  - Net revenue: ~17.73 PLN

**Break-even Analysis**:
- Infrastructure costs: ~$20/month (after free tiers)
- Break-even: ~5 premium users

**Revenue Goals**:
- Year 1: 50 premium users = 950 PLN/month
- Year 2: 200 premium users = 3,800 PLN/month

---

## Loops - Email Marketing

### Przegląd Implementacji

Loops będzie używany do:
- Welcome emails dla nowych użytkowników
- Weekly quiz digest
- Achievement notifications
- Feature announcements
- Re-engagement campaigns

### Email Campaigns

#### 1. Welcome Series
- **Email 1**: Welcome + tips for first quiz
- **Email 2** (Day 2): Share your first badge
- **Email 3** (Day 7): Weekly challenge invitation

#### 2. Engagement
- **Weekly Digest**: Personal stats + new questions
- **Achievement Unlocked**: Badge earned notifications
- **Streak Reminder**: Keep your streak alive

#### 3. Monetization
- **Premium Tease**: Upgrade benefits (after 10 quizzes)
- **Abandoned Cart**: Didn't complete premium checkout

#### 4. Retention
- **Re-engagement** (30 days inactive): We miss you
- **New Features**: Product updates

### Plan Implementacji

#### Krok 1: Loops Setup (30 min)

1. Create account: loops.so
2. Create contact properties:
   - `email` (required)
   - `firstName`
   - `quizzesCompleted`
   - `lastQuizDate`
   - `averageScore`
   - `favoriteDifficulty`
   - `isPremium`

3. Create forms:
   - "Newsletter Signup"
   - "Quiz Completion"

#### Krok 2: API Integration (2 godziny)

**lib/loops/client.ts**:
```typescript
const LOOPS_API_KEY = process.env.LOOPS_API_KEY!
const LOOPS_API_URL = 'https://app.loops.so/api/v1'

export interface Contact {
  email: string
  firstName?: string
  quizzesCompleted?: number
  lastQuizDate?: string
  averageScore?: number
  favoriteDifficulty?: string
  isPremium?: boolean
}

// Create or update contact
export async function upsertContact(contact: Contact): Promise<void> {
  const res = await fetch(`${LOOPS_API_URL}/contacts/update`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${LOOPS_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(contact),
  })

  if (!res.ok) {
    throw new Error(`Loops API error: ${res.statusText}`)
  }
}

// Send transactional email
export async function sendEmail(
  email: string,
  transactionalId: string,
  dataVariables?: Record<string, any>
): Promise<void> {
  const res = await fetch(`${LOOPS_API_URL}/transactional`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${LOOPS_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email,
      transactionalId,
      dataVariables,
    }),
  })

  if (!res.ok) {
    throw new Error(`Loops email error: ${res.statusText}`)
  }
}

// Trigger event
export async function triggerEvent(
  email: string,
  eventName: string,
  properties?: Record<string, any>
): Promise<void> {
  const res = await fetch(`${LOOPS_API_URL}/events/send`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${LOOPS_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email,
      eventName,
      ...properties,
    }),
  })

  if (!res.ok) {
    throw new Error(`Loops event error: ${res.statusText}`)
  }
}
```

#### Krok 3: Newsletter Component (1 godzina)

**components/NewsletterSignup.tsx**:
```typescript
'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'

export function NewsletterSignup() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })

      if (!res.ok) {
        throw new Error('Subscription failed')
      }

      setSuccess(true)
      setEmail('')
    } catch (err) {
      setError('Coś poszło nie tak. Spróbuj ponownie.')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <Card className="p-6 text-center">
        <div className="text-4xl mb-2">✅</div>
        <h3 className="font-bold mb-2">Dziękujemy!</h3>
        <p className="text-text-secondary">
          Sprawdź swoją skrzynkę email.
        </p>
      </Card>
    )
  }

  return (
    <Card className="p-6">
      <h3 className="text-xl font-bold mb-2">
        Dołącz do Newslettera
      </h3>
      <p className="text-text-secondary mb-4">
        Otrzymuj cotygodniowe wyzwania i nowe pytania.
      </p>

      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="twoj@email.pl"
          required
          className="flex-1 px-4 py-2 rounded-lg bg-surface border border-border focus:outline-none focus:border-primary"
        />
        <Button type="submit" disabled={loading}>
          {loading ? 'Zapisywanie...' : 'Zapisz się'}
        </Button>
      </form>

      {error && (
        <p className="text-error text-sm mt-2">{error}</p>
      )}
    </Card>
  )
}
```

#### Krok 4: API Route (30 min)

**app/api/newsletter/subscribe/route.ts**:
```typescript
import { NextRequest, NextResponse } from 'next/server'
import { upsertContact } from '@/lib/loops/client'

export async function POST(req: NextRequest) {
  try {
    const { email, firstName } = await req.json()

    // Validate email
    if (!email || !email.includes('@')) {
      return NextResponse.json(
        { error: 'Invalid email' },
        { status: 400 }
      )
    }

    // Add to Loops
    await upsertContact({
      email,
      firstName,
      quizzesCompleted: 0,
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Newsletter subscription error:', error)
    return NextResponse.json(
      { error: 'Subscription failed' },
      { status: 500 }
    )
  }
}
```

#### Krok 5: Event Tracking Integration (1 godzina)

**Integration w QuizContext**:
```typescript
import { upsertContact, triggerEvent } from '@/lib/loops/client'

// After quiz completion
const trackQuizCompletion = async (results: QuizResults, userEmail?: string) => {
  if (!userEmail) return

  // Update contact properties
  await upsertContact({
    email: userEmail,
    quizzesCompleted: results.totalCompleted, // from user data
    lastQuizDate: new Date().toISOString(),
    averageScore: results.averageScore,
    favoriteDifficulty: results.difficulty,
  })

  // Trigger event for campaign
  await triggerEvent(userEmail, 'quiz_completed', {
    score: results.score,
    badge: results.badge,
    difficulty: results.difficulty,
  })
}
```

#### Krok 6: Email Templates (2 godziny)

W Loops Dashboard, utwórz szablony:

**1. Welcome Email**:
```
Subject: Witaj w GeoQuest! 🌍

Hi {{firstName}},

Dziękujemy za dołączenie do GeoQuest!

Gotowy na geograficzną przygodę? Oto kilka wskazówek:

1. Zacznij od poziomu Easy
2. Czytaj wyjaśnienia po każdym pytaniu
3. Zdobądź swoje pierwsze odznaki

[Rozpocznij Quiz] → {{app_url}}

Happy exploring!
Team GeoQuest
```

**2. Quiz Completed**:
```
Subject: Gratulacje! Zdobyłeś odznakę {{badge}}

Świetna robota, {{firstName}}!

Twój wynik: {{score}}/100
Poprawnych odpowiedzi: {{correctAnswers}}/{{totalQuestions}}
Odznaka: {{badge}}

Podziel się wynikiem:
[Share on Twitter] [Share on Facebook]

Gotowy na następne wyzwanie?
[Zagraj ponownie]

GeoQuest Team
```

**3. Weekly Digest**:
```
Subject: Twój tydzień w GeoQuest 📊

Hi {{firstName}},

Oto podsumowanie twojego tygodnia:

🎯 Ukończone quizy: {{weeklyQuizzes}}
⭐ Średni wynik: {{averageScore}}
🏆 Zdobyte odznaki: {{badgesEarned}}

Nowe pytania dodane: 15
Twój ranking: #{{rank}}

[Zobacz pełne statystyki]

Do zobaczenia w następnym tygodniu!
GeoQuest Team
```

### Email Automation Workflows

W Loops, ustaw automation:

1. **New Subscriber**:
   - Trigger: Contact created
   - Action: Send "Welcome Email" immediately
   - Action: Send "Tips Email" after 2 days
   - Action: Send "Challenge Email" after 7 days

2. **Quiz Milestone**:
   - Trigger: quizzesCompleted = 10
   - Action: Send "Premium Offer"

3. **Inactive User**:
   - Trigger: lastQuizDate > 30 days ago
   - Action: Send "We Miss You" email

### Zmienne Środowiskowe

```bash
# .env.local
LOOPS_API_KEY=your_loops_api_key_here

# .env.production (Vercel)
LOOPS_API_KEY=[production_key]
```

### Success Metrics

- ✅ Email delivery rate > 98%
- ✅ Open rate > 25%
- ✅ Click rate > 5%
- ✅ Unsubscribe rate < 1%
- ✅ Newsletter signups from results screen > 15%

---

## Timeline Implementacji

### Phase 1: Observability (2 tygodnie)

#### Tydzień 1: PostHog
- **Dzień 1-2**: Setup & provider configuration
- **Dzień 3**: Event tracking implementation
- **Dzień 4**: GDPR compliance (cookie consent)
- **Dzień 5**: Dashboard setup & testing

#### Tydzień 2: Sentry
- **Dzień 1**: Installation & configuration
- **Dzień 2**: Error boundaries
- **Dzień 3**: Performance monitoring
- **Dzień 4**: Alerting setup
- **Dzień 5**: Testing & documentation

**Deliverables**:
- ✅ PostHog tracking all key events
- ✅ Sentry catching all errors
- ✅ Dashboards configured
- ✅ Alerts set up

### Phase 2: Performance (1 tydzień)

#### Tydzień 3: Upstash Redis Extension
- **Dzień 1-2**: Session storage implementation
- **Dzień 3-4**: Leaderboard system
- **Dzień 5**: Caching & optimization

**Deliverables**:
- ✅ Quiz sessions persist across refreshes
- ✅ Global leaderboard working
- ✅ Questions cached
- ✅ Performance improved

### Phase 3: Monetization (3 tygodnie)

#### Tydzień 4-5: Stripe Integration
- **Dzień 1-2**: Stripe setup & API routes
- **Dzień 3-4**: Frontend checkout flow
- **Dzień 5-6**: Webhook handling
- **Dzień 7-8**: Premium features gating
- **Dzień 9-10**: Testing & refinement

#### Tydzień 6: Loops Integration
- **Dzień 1-2**: Loops setup & API integration
- **Dzień 3**: Newsletter component
- **Dzień 4**: Email templates
- **Dzień 5**: Automation workflows

**Deliverables**:
- ✅ Payment system working
- ✅ Premium features implemented
- ✅ Email campaigns running
- ✅ User can subscribe to newsletter

### Phase 4: Polish & Launch (1 tydzień)

#### Tydzień 7: Final Polish
- **Dzień 1**: End-to-end testing
- **Dzień 2**: Performance optimization
- **Dzień 3**: Bug fixes
- **Dzień 4**: Documentation
- **Dzień 5**: Soft launch

**Deliverables**:
- ✅ All integrations tested
- ✅ No critical bugs
- ✅ Documentation complete
- ✅ Ready for production

---

## Koszty i ROI

### Monthly Costs (Free Tiers)

| Service | Free Tier | Usage @ 1000 DAU | Paid Cost |
|---------|-----------|------------------|-----------|
| **PostHog** | 1M events/month | ~800k events | $0 |
| **Sentry** | 5k errors/month | ~2k errors | $0 |
| **Upstash Redis** | 10k commands/day | ~8k commands | $0 |
| **Stripe** | No base fee | 2.9% + $0.30 per transaction | Variable |
| **Loops** | 2k contacts | 500 contacts | $0 |
| **Vercel** | 100 GB bandwidth | ~80 GB | $0 |
| **Cesium** | 50k requests/month | ~40k requests | $0 |

**Total Monthly Cost**: $0 (w free tiers)
**Cost at Scale** (10k DAU): ~$50/month

### Revenue Projections

**Assumptions**:
- 1% free-to-premium conversion rate
- Average subscription: 3 months

| Month | DAU | Premium Users | MRR | Costs | Profit |
|-------|-----|---------------|-----|-------|--------|
| 1 | 100 | 1 | 19 PLN | 0 PLN | 19 PLN |
| 3 | 500 | 5 | 95 PLN | 0 PLN | 95 PLN |
| 6 | 2000 | 20 | 380 PLN | 0 PLN | 380 PLN |
| 12 | 10000 | 100 | 1900 PLN | 150 PLN | 1750 PLN |

### ROI Analysis

**Development Costs**:
- Time investment: ~80 hours
- Opportunity cost: varies

**Break-even**:
- Premium users needed: ~5 (covers future infrastructure)
- Estimated time to break-even: 3-6 months

**Long-term Value**:
- Scalable revenue stream
- Better product insights
- Improved user experience
- Professional infrastructure

---

## Risk Management

### Technical Risks

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| API rate limiting | Medium | Medium | Implement caching, graceful degradation |
| Payment failures | Low | High | Comprehensive error handling, retry logic |
| Email deliverability | Medium | Medium | Use reputable service (Loops), monitor rates |
| Performance degradation | Low | High | Load testing, performance monitoring |

### Business Risks

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| Low conversion rate | High | High | A/B test pricing, improve value prop |
| High churn rate | Medium | High | Engagement emails, improve product |
| Competition | Medium | Medium | Focus on unique value, iterate quickly |

### Compliance Risks

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| GDPR violations | Low | Very High | Cookie consent, data minimization, privacy policy |
| Payment regulations | Low | High | Use Stripe (PCI compliant), follow best practices |

---

## Success Criteria

### Technical Success

- ✅ All integrations working without errors
- ✅ <1% error rate in production
- ✅ <100ms overhead from integrations
- ✅ 99.9% uptime
- ✅ All tests passing

### Business Success

- ✅ >1% free-to-premium conversion
- ✅ <5% monthly churn rate
- ✅ >25% email open rate
- ✅ >80% quiz completion rate
- ✅ Positive ROI within 6 months

### User Success

- ✅ Clear value proposition
- ✅ Smooth checkout experience
- ✅ No user-facing errors
- ✅ Fast application performance
- ✅ Positive user feedback

---

## Maintenance Plan

### Daily
- Monitor Sentry for critical errors
- Check Stripe for failed payments
- Review PostHog for anomalies

### Weekly
- Analyze PostHog insights
- Review email campaign performance
- Check Redis usage
- Optimize underperforming features

### Monthly
- Review all integration costs
- Analyze premium conversion funnel
- A/B test improvements
- Update email campaigns
- Security audit

### Quarterly
- Major feature additions
- Pricing strategy review
- Comprehensive performance audit
- User satisfaction survey

---

**Ostatnia aktualizacja**: 2025-11-21
**Wersja**: 1.0.0
**Status**: 📋 Ready for implementation
