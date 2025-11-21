# 🚀 GeoQuest - Instrukcja Wdrożenia i Konfiguracji

## Spis Treści
- [Wymagania Systemowe](#wymagania-systemowe)
- [Architektura Aplikacji](#architektura-aplikacji)
- [Konfiguracja Środowiska Lokalnego](#konfiguracja-środowiska-lokalnego)
- [Zmienne Środowiskowe](#zmienne-środowiskowe)
- [Wdrożenie na Vercel](#wdrożenie-na-vercel)
- [Konfiguracja Zewnętrznych Usług](#konfiguracja-zewnętrznych-usług)
- [Weryfikacja Wdrożenia](#weryfikacja-wdrożenia)
- [Rozwiązywanie Problemów](#rozwiązywanie-problemów)

---

## Wymagania Systemowe

### Minimalne Wymagania
- **Node.js**: 18.x lub nowszy
- **npm**: 9.x lub nowszy (lub yarn/pnpm)
- **Git**: 2.x lub nowszy
- **System Operacyjny**: macOS, Linux, Windows (WSL2 zalecany)

### Rekomendowane Narzędzia
- **IDE**: Visual Studio Code z rozszerzeniami:
  - ESLint
  - Tailwind CSS IntelliSense
  - Pretty TypeScript Errors
- **Browser**: Chrome/Edge (DevTools)
- **Terminal**: iTerm2 / Windows Terminal

---

## Architektura Aplikacji

### Stack Technologiczny

#### Frontend
- **Framework**: Next.js 14.2.18 (App Router)
- **Language**: TypeScript 5.0
- **UI Framework**: React 18.3.1
- **Styling**: Tailwind CSS v4.0.0-beta.7
- **Animations**: Framer Motion 11.15.0
- **3D Globe**: Cesium.js (konfiguracja gotowa, implementacja w toku)

#### Backend
- **Runtime**: Node.js (Next.js API Routes)
- **Rate Limiting**: Upstash Redis 1.34.3

#### Deployment
- **Platform**: Vercel (rekomendowane)
- **CDN**: Vercel Edge Network
- **DNS**: Vercel DNS lub własna domena

### Struktura Projektu

```
geo-quest/
├── app/                          # Next.js App Router
│   ├── api/                      # API Routes
│   │   └── rate-limit/           # Rate limiting endpoint
│   ├── layout.tsx                # Root layout + metadata
│   ├── page.tsx                  # Main app
│   └── globals.css               # Global styles
│
├── components/                   # React Components
│   ├── screens/                  # Page-level screens
│   │   ├── HomeScreen.tsx        # Landing screen
│   │   ├── QuizScreen.tsx        # Quiz gameplay
│   │   └── ResultsScreen.tsx     # Results display
│   └── ui/                       # Reusable UI
│       ├── Button.tsx
│       └── Card.tsx
│
├── lib/                          # Utilities
│   ├── context/
│   │   └── QuizContext.tsx       # Global state management
│   └── utils.ts                  # Helper functions
│
├── types/                        # TypeScript definitions
│   └── quiz.ts
│
├── public/                       # Static assets
│   └── data/
│       └── questions.json        # 250+ quiz questions
│
└── Configuration Files
    ├── next.config.js            # Next.js config
    ├── tailwind.config.ts        # Tailwind config
    ├── tsconfig.json             # TypeScript config
    └── .env.example              # Environment template
```

### Model Danych

#### Questions (Static JSON)
Aplikacja używa statycznych danych z `/public/data/questions.json`:

```typescript
interface Question {
  id: string;                    // "q001"
  type: QuestionType;            // "multiple-choice" | "click-to-answer" | "true-false"
  difficulty: Difficulty;        // "easy" | "medium" | "hard"
  category: Category;            // "capitals" | "cities" | "mountains" | etc.
  question: string;
  options?: string[];
  correctAnswer: string | Coordinates;
  explanation?: string;
  targetLocation?: Coordinates;
}
```

**Uwaga**: Brak bazy danych - wszystkie dane są statyczne i ładowane po stronie klienta.

---

## Konfiguracja Środowiska Lokalnego

### 1. Klonowanie Repozytorium

```bash
# Sklonuj repozytorium
git clone https://github.com/Bangla84PL/geo-quest.git
cd geo-quest

# Sprawdź aktualną gałąź
git status
```

### 2. Instalacja Zależności

```bash
# Użyj npm (rekomendowane)
npm install

# Lub yarn
yarn install

# Lub pnpm
pnpm install
```

### 3. Konfiguracja Zmiennych Środowiskowych

```bash
# Skopiuj przykładowy plik
cp .env.example .env.local

# Edytuj plik .env.local
nano .env.local  # lub code .env.local
```

### 4. Uruchomienie Serwera Deweloperskiego

```bash
# Start development server
npm run dev

# Otwórz w przeglądarce
# http://localhost:3000
```

### 5. Weryfikacja Instalacji

Sprawdź, czy:
- ✅ Aplikacja otwiera się na `http://localhost:3000`
- ✅ Nie ma błędów w konsoli przeglądarki
- ✅ Ekran startowy wyświetla się poprawnie
- ✅ Możesz rozpocząć quiz

---

## Zmienne Środowiskowe

### Plik `.env.local` (Development)

```bash
# ============================================
# CESIUM.JS - 3D GLOBE
# ============================================
# Wymagane dla renderowania interaktywnej kuli ziemskiej
# Uzyskaj darmowy token: https://cesium.com/ion/tokens
NEXT_PUBLIC_CESIUM_ION_ACCESS_TOKEN=your_cesium_token_here

# ============================================
# UPSTASH REDIS - RATE LIMITING (Opcjonalne)
# ============================================
# Jeśli nie skonfigurujesz, rate limiting będzie wyłączony
# Uzyskaj darmowe konto: https://upstash.com
UPSTASH_REDIS_REST_URL=https://your-redis.upstash.io
UPSTASH_REDIS_REST_TOKEN=your_redis_token_here

# ============================================
# POSTHOG - ANALYTICS (Opcjonalne)
# ============================================
# Analityka użytkowania i event tracking
# Uzyskaj: https://posthog.com
NEXT_PUBLIC_POSTHOG_KEY=phc_your_posthog_key
NEXT_PUBLIC_POSTHOG_HOST=https://app.posthog.com

# ============================================
# SENTRY - ERROR TRACKING (Opcjonalne)
# ============================================
# Monitoring błędów i performance
# Uzyskaj: https://sentry.io
SENTRY_DSN=https://your_dsn@sentry.io/project_id
SENTRY_AUTH_TOKEN=your_auth_token
SENTRY_ORG=your_org_name
SENTRY_PROJECT=geo-quest

# ============================================
# STRIPE - PAYMENTS (Opcjonalne)
# ============================================
# Jeśli planujesz dodać płatności/premium features
# Uzyskaj: https://stripe.com
STRIPE_SECRET_KEY=sk_test_your_secret_key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_publishable_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret

# ============================================
# LOOPS - EMAIL MARKETING (Opcjonalne)
# ============================================
# Email automation i newslettery
# Uzyskaj: https://loops.so
LOOPS_API_KEY=your_loops_api_key

# ============================================
# INNE KONFIGURACJE
# ============================================
# URL aplikacji (zmień na produkcyjną domenę)
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Poziom logowania (development|production)
NODE_ENV=development
```

### Opis Zmiennych

#### ✅ WYMAGANE

| Zmienna | Opis | Gdzie Uzyskać | Uwagi |
|---------|------|---------------|-------|
| `NEXT_PUBLIC_CESIUM_ION_ACCESS_TOKEN` | Token do Cesium.js 3D globe | [cesium.com/ion](https://cesium.com/ion/tokens) | Darmowy tier: 50k requests/miesiąc |

#### ⚠️ OPCJONALNE (ale rekomendowane dla produkcji)

| Zmienna | Opis | Gdzie Uzyskać | Uwagi |
|---------|------|---------------|-------|
| `UPSTASH_REDIS_REST_URL` | URL do Upstash Redis | [upstash.com](https://upstash.com) | Darmowy tier: 10k requests/dzień |
| `UPSTASH_REDIS_REST_TOKEN` | Token autoryzacyjny Redis | Dashboard Upstash | Trzymaj w tajemnicy |
| `NEXT_PUBLIC_POSTHOG_KEY` | Klucz projektu PostHog | [posthog.com](https://posthog.com) | Darmowy tier: 1M events/miesiąc |
| `NEXT_PUBLIC_POSTHOG_HOST` | Host instancji PostHog | Dashboard PostHog | Domyślnie: app.posthog.com |
| `SENTRY_DSN` | Data Source Name Sentry | [sentry.io](https://sentry.io) | Darmowy tier: 5k errors/miesiąc |
| `SENTRY_AUTH_TOKEN` | Token autoryzacyjny | Sentry Settings | Do deploymentu source maps |
| `STRIPE_SECRET_KEY` | Klucz tajny Stripe | [stripe.com](https://stripe.com) | Użyj `sk_test_` dla testów |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Klucz publiczny Stripe | Dashboard Stripe | Bezpieczne do ekspozycji |
| `STRIPE_WEBHOOK_SECRET` | Secret dla webhooków | Stripe Webhooks | Weryfikacja podpisów |
| `LOOPS_API_KEY` | Klucz API Loops | [loops.so](https://loops.so) | Email automation |

### Uwagi Bezpieczeństwa

#### ⚠️ NIGDY NIE COMMITUJ
- `.env.local` - lokalny plik ze zmiennymi
- `.env.production` - produkcyjny plik
- Jakichkolwiek plików zawierających sekrety

#### ✅ COMMITUJ
- `.env.example` - szablon bez wrażliwych danych

#### 🔒 Prefiks `NEXT_PUBLIC_`
- Zmienne z tym prefiksem są **PUBLICZNE**
- Dostępne po stronie klienta (browser)
- Używaj tylko dla tokenów publicznych (Cesium, Stripe publishable key)

#### 🔐 Bez Prefiksu
- Zmienne dostępne **TYLKO po stronie serwera**
- Bezpieczne dla kluczy tajnych (Stripe secret, Redis token)

---

## Wdrożenie na Vercel

### Metoda 1: Deploy przez GitHub (Rekomendowane)

#### Krok 1: Połącz Repozytorium z Vercel

```bash
# 1. Zaloguj się na https://vercel.com
# 2. Kliknij "Add New Project"
# 3. Import Git Repository
# 4. Wybierz: Bangla84PL/geo-quest
# 5. Configure Project:
```

#### Krok 2: Konfiguracja Projektu

**Framework Preset**: Next.js ✅ (auto-detected)

**Build Settings**:
- Build Command: `npm run build`
- Output Directory: `.next` (default)
- Install Command: `npm install`

**Root Directory**: `./` (default)

#### Krok 3: Dodaj Zmienne Środowiskowe

W Vercel Dashboard → Project Settings → Environment Variables:

```
# WYMAGANE
NEXT_PUBLIC_CESIUM_ION_ACCESS_TOKEN = [your_token]

# OPCJONALNE (dodaj stopniowo)
UPSTASH_REDIS_REST_URL = [your_url]
UPSTASH_REDIS_REST_TOKEN = [your_token]
NEXT_PUBLIC_POSTHOG_KEY = [your_key]
NEXT_PUBLIC_POSTHOG_HOST = https://app.posthog.com
SENTRY_DSN = [your_dsn]
# ... itd.
```

**Environments**: Wybierz dla każdej zmiennej:
- ✅ Production
- ✅ Preview
- ✅ Development

#### Krok 4: Deploy

```bash
# Kliknij "Deploy"
# Vercel automatycznie:
# 1. Sklonuje repo
# 2. Zainstaluje zależności
# 3. Zbuduje projekt
# 4. Wdroży na globalny CDN
```

#### Krok 5: Weryfikacja

Po zakończeniu deploymentu:
- Kliknij "Visit" aby otworzyć aplikację
- URL: `https://geo-quest.vercel.app` (lub twoja domena)
- Sprawdź console przeglądarki na błędy

### Metoda 2: Deploy przez CLI

```bash
# Zainstaluj Vercel CLI
npm install -g vercel

# Zaloguj się
vercel login

# Deploy
vercel

# Odpowiedz na pytania:
# Set up and deploy? [Y/n] y
# Which scope? [Your Account]
# Link to existing project? [n] n
# What's your project's name? geo-quest
# In which directory is your code located? ./
# Auto-detected Project Settings (Next.js) [Y/n] y

# Deploy do produkcji
vercel --prod
```

### Automatyczne Deploymenty

Po połączeniu z GitHub, Vercel automatycznie deployuje:

- **Production**: Push do gałęzi `main`
  ```bash
  git push origin main
  # → Auto-deploy na https://geo-quest.vercel.app
  ```

- **Preview**: Push do innej gałęzi lub PR
  ```bash
  git push origin feature-branch
  # → Auto-deploy na https://geo-quest-git-feature-branch.vercel.app
  ```

### Konfiguracja Własnej Domeny

1. **Vercel Dashboard** → Project → Settings → Domains
2. Dodaj domenę: `geoquest.pl`
3. Skonfiguruj DNS:
   ```
   Type: A
   Name: @
   Value: 76.76.21.21

   Type: CNAME
   Name: www
   Value: cname.vercel-dns.com
   ```
4. Poczekaj na propagację DNS (do 48h)

---

## Konfiguracja Zewnętrznych Usług

### 1. Cesium.js - 3D Globe

#### Rejestracja

1. Odwiedź: https://cesium.com/ion/signup
2. Wybierz darmowy plan (Community)
3. Potwierdź email

#### Uzyskanie Tokenu

1. Zaloguj się na https://cesium.com/ion
2. Przejdź do: **Access Tokens**
3. Kliknij **Create Token**
4. Nazwa: `GeoQuest Production`
5. Scopes:
   - ✅ assets:read
   - ✅ assets:list
6. Skopiuj token (pokazuje się tylko raz!)

#### Dodanie do Projektu

```bash
# .env.local
NEXT_PUBLIC_CESIUM_ION_ACCESS_TOKEN=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Vercel Dashboard
# Settings → Environment Variables → Add
# Key: NEXT_PUBLIC_CESIUM_ION_ACCESS_TOKEN
# Value: [wklej token]
```

#### Weryfikacja

```typescript
// Sprawdź w DevTools Console
console.log(process.env.NEXT_PUBLIC_CESIUM_ION_ACCESS_TOKEN);
// Powinno wyświetlić token (w development)
```

#### Limity (Free Tier)
- 50,000 requests/miesiąc
- Unlimited terrain/imagery tiles
- Community support

---

### 2. Upstash Redis - Rate Limiting

#### Rejestracja

1. Odwiedź: https://console.upstash.com
2. Zaloguj się przez GitHub
3. Wybierz darmowy plan

#### Utworzenie Bazy Redis

1. Kliknij **Create Database**
2. Konfiguracja:
   - **Name**: `geoquest-rate-limit`
   - **Type**: Regional (tańszy) lub Global (szybszy)
   - **Region**: Wybierz najbliższy użytkownikom (np. `eu-west-1`)
   - **TLS**: ✅ Enabled
   - **Eviction**: ✅ Enabled
3. Kliknij **Create**

#### Uzyskanie Credentials

W Dashboard bazy:

```bash
# REST API (używane w projekcie)
UPSTASH_REDIS_REST_URL=https://unique-name-12345.upstash.io
UPSTASH_REDIS_REST_TOKEN=AXXXaaaaBBBBccccDDDDeee...
```

#### Dodanie do Projektu

```bash
# .env.local
UPSTASH_REDIS_REST_URL=https://your-db.upstash.io
UPSTASH_REDIS_REST_TOKEN=your_token_here

# Deploy na Vercel
vercel env add UPSTASH_REDIS_REST_URL
vercel env add UPSTASH_REDIS_REST_TOKEN
```

#### Testowanie

```bash
# Uruchom dev server
npm run dev

# Test endpoint
curl http://localhost:3000/api/rate-limit

# Oczekiwany output:
{
  "status": "ok",
  "rateLimiting": "enabled",
  "limit": 50,
  "window": "15 minutes"
}
```

#### Limity (Free Tier)
- 10,000 commands/dzień
- 256 MB storage
- Wystarczające dla ~1000 użytkowników/dzień

---

### 3. PostHog - Analytics (Planowane)

#### Rejestracja

1. Odwiedź: https://posthog.com/signup
2. Utwórz konto
3. Wybierz **Cloud** hosting (rekomendowane)

#### Utworzenie Projektu

1. **Project Name**: GeoQuest
2. **Project Type**: Web App
3. Skopiuj:
   - **Project API Key**: `phc_xxxxxx`
   - **Host**: `https://app.posthog.com`

#### Konfiguracja

```bash
# .env.local
NEXT_PUBLIC_POSTHOG_KEY=phc_your_key_here
NEXT_PUBLIC_POSTHOG_HOST=https://app.posthog.com
```

#### Implementacja (Do wykonania)

```typescript
// app/providers.tsx (do utworzenia)
import posthog from 'posthog-js'
import { PostHogProvider } from 'posthog-js/react'

if (typeof window !== 'undefined') {
  posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY!, {
    api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST,
  })
}
```

#### Planowane Eventy
- `quiz_started` - Rozpoczęcie quizu
- `question_answered` - Odpowiedź na pytanie
- `quiz_completed` - Zakończenie quizu
- `badge_earned` - Zdobycie odznaki
- `share_clicked` - Kliknięcie share

#### Limity (Free Tier)
- 1M events/miesiąc
- 1 rok data retention
- Unlimited users

---

### 4. Sentry - Error Tracking (Planowane)

#### Rejestracja

1. Odwiedź: https://sentry.io/signup
2. Utwórz konto
3. Wybierz **Next.js** platform

#### Utworzenie Projektu

1. **Platform**: Next.js
2. **Project Name**: geo-quest
3. **Team**: Personal (lub utwórz team)

#### Uzyskanie DSN

```bash
# Format DSN
https://abc123def456@o123456.ingest.sentry.io/7891011
```

#### Instalacja (Do wykonania)

```bash
# Install Sentry SDK
npm install @sentry/nextjs

# Run setup wizard
npx @sentry/wizard@latest -i nextjs
```

Wizard utworzy automatycznie:
- `sentry.client.config.ts`
- `sentry.server.config.ts`
- `sentry.edge.config.ts`
- `instrumentation.ts`

#### Konfiguracja

```bash
# .env.local
SENTRY_DSN=https://your_dsn@sentry.io/project_id
SENTRY_AUTH_TOKEN=your_auth_token
SENTRY_ORG=your_org
SENTRY_PROJECT=geo-quest

# Vercel (automatycznie przez Sentry wizard)
```

#### Testowanie

```typescript
// Test error
Sentry.captureException(new Error('Test Sentry'));
```

#### Limity (Free Tier)
- 5,000 errors/miesiąc
- 30 dni retention
- Basic alerts

---

### 5. Stripe - Payments (Planowane dla Premium)

#### Rejestracja

1. Odwiedź: https://stripe.com
2. Utwórz konto
3. Przejdź przez weryfikację firmy (dla produkcji)

#### Uzyskanie Kluczy

Dashboard → Developers → API keys:

```bash
# Test Mode (development)
STRIPE_SECRET_KEY=sk_test_xxxxx
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_xxxxx

# Live Mode (production) - aktywuj po weryfikacji
STRIPE_SECRET_KEY=sk_live_xxxxx
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_xxxxx
```

#### Konfiguracja Webhooków

1. Dashboard → Developers → Webhooks
2. Add endpoint: `https://geoquest.vercel.app/api/webhooks/stripe`
3. Events:
   - `checkout.session.completed`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
4. Skopiuj **Signing secret**: `whsec_xxxxx`

```bash
# .env.local
STRIPE_WEBHOOK_SECRET=whsec_xxxxx
```

#### Instalacja (Do wykonania)

```bash
npm install stripe @stripe/stripe-js
```

#### Planowane Produkty
- **Premium Monthly**: 19 PLN/miesiąc
  - Unlimited quizzes
  - Advanced stats
  - Custom badges
  - Ad-free

---

### 6. Loops - Email Marketing (Planowane)

#### Rejestracja

1. Odwiedź: https://loops.so
2. Utwórz konto
3. Potwierdź email

#### Uzyskanie API Key

1. Dashboard → Settings → API
2. Skopiuj **API Key**

```bash
# .env.local
LOOPS_API_KEY=your_loops_api_key
```

#### Instalacja

```bash
npm install loops
```

#### Konfiguracja Formularzy

W Loops Dashboard:
1. Utwórz **Contact Form**: "Newsletter Signup"
2. Dodaj pola:
   - Email (required)
   - Name (optional)
   - Source: "GeoQuest Results"

#### Planowane Kampanie
- Welcome email po zapisie
- Weekly quiz digest
- New features announcements
- Achievement congratulations

---

## Weryfikacja Wdrożenia

### Checklist Pre-Deployment

Przed wdrożeniem na produkcję, sprawdź:

#### 1. Zmienne Środowiskowe
```bash
# Sprawdź w Vercel Dashboard
✅ NEXT_PUBLIC_CESIUM_ION_ACCESS_TOKEN - ustawione
✅ UPSTASH_REDIS_REST_URL - ustawione
✅ UPSTASH_REDIS_REST_TOKEN - ustawione
✅ Wszystkie zmienne mają scope: Production + Preview
```

#### 2. Build Lokalny
```bash
# Test production build
npm run build

# Oczekiwany output:
# ✓ Compiled successfully
# ✓ Linting and checking validity of types
# ✓ Collecting page data
# ✓ Generating static pages (4/4)
# ✓ Finalizing page optimization

# Start production server
npm run start

# Test na http://localhost:3000
```

#### 3. TypeScript Errors
```bash
# Sprawdź typy
npx tsc --noEmit

# Powinno być 0 błędów
```

#### 4. ESLint
```bash
npm run lint

# Powinno być: ✓ No ESLint warnings or errors
```

#### 5. Tests (jeśli są)
```bash
npm run test
```

### Checklist Post-Deployment

Po wdrożeniu, zweryfikuj:

#### 1. Aplikacja Działa
- [ ] Strona główna ładuje się poprawnie
- [ ] Nie ma błędów w console
- [ ] Wszystkie obrazy/ikony są widoczne

#### 2. Funkcjonalność Quiz
- [ ] Można wybrać poziom trudności
- [ ] Quiz się rozpoczyna
- [ ] Timer działa poprawnie
- [ ] Można odpowiedzieć na pytania
- [ ] Wyniki się wyświetlają
- [ ] Można rozpocząć nowy quiz

#### 3. Rate Limiting
```bash
# Test endpoint
curl https://geoquest.vercel.app/api/rate-limit

# Expected:
{
  "status": "ok",
  "rateLimiting": "enabled",
  "limit": 50,
  "window": "15 minutes"
}
```

#### 4. Performance
- [ ] Lighthouse Score > 90
- [ ] First Contentful Paint < 1.5s
- [ ] Time to Interactive < 3s

#### 5. SEO
- [ ] Meta tags są poprawne
- [ ] Open Graph działa (test: https://www.opengraph.xyz)
- [ ] robots.txt dostępny
- [ ] sitemap.xml dostępny

#### 6. Mobile
- [ ] Responsive design działa
- [ ] Touch interactions działają
- [ ] Nie ma horizontal scroll

### Narzędzia Diagnostyczne

#### 1. Vercel Logs
```bash
# CLI
vercel logs

# Dashboard
https://vercel.com/your-project/logs
```

#### 2. Lighthouse Audit
```bash
# Chrome DevTools → Lighthouse → Generate report
# Lub:
npm install -g lighthouse
lighthouse https://geoquest.vercel.app
```

#### 3. Next.js Build Analyzer
```bash
# Dodaj do package.json
"analyze": "ANALYZE=true next build"

# Zainstaluj
npm install @next/bundle-analyzer

# Uruchom
npm run analyze
```

---

## Rozwiązywanie Problemów

### Problem: Cesium Token Nie Działa

**Objawy**:
- Console error: "Cesium Ion authentication failed"
- 401 Unauthorized errors

**Rozwiązanie**:
```bash
# 1. Sprawdź czy token jest ustawiony
echo $NEXT_PUBLIC_CESIUM_ION_ACCESS_TOKEN

# 2. Sprawdź w przeglądarce
console.log(process.env.NEXT_PUBLIC_CESIUM_ION_ACCESS_TOKEN)

# 3. Zweryfikuj na Cesium.com czy token jest aktywny
# Dashboard → Access Tokens → Status: Active

# 4. Regeneruj token jeśli potrzeba
# 5. Restart dev server
npm run dev
```

### Problem: Rate Limiting Nie Działa

**Objawy**:
- API endpoint zwraca `"rateLimiting": "disabled"`
- Brak ograniczeń requestów

**Rozwiązanie**:
```bash
# 1. Sprawdź czy Redis credentials są ustawione
echo $UPSTASH_REDIS_REST_URL
echo $UPSTASH_REDIS_REST_TOKEN

# 2. Test połączenia z Redis
curl https://your-redis.upstash.io \
  -H "Authorization: Bearer $UPSTASH_REDIS_REST_TOKEN"

# Expected: {"result":"PONG"}

# 3. Sprawdź logi Vercel
vercel logs --follow

# 4. Upewnij się że zmienne są w Production environment
```

### Problem: Build Fails na Vercel

**Objawy**:
- Deployment fails with "Build Error"
- TypeScript errors during build

**Rozwiązanie**:
```bash
# 1. Test build lokalnie
npm run build

# 2. Sprawdź logi buildów
# Vercel Dashboard → Deployments → [Failed Deployment] → Build Logs

# 3. Częste przyczyny:
# - TypeScript errors (fix with npx tsc --noEmit)
# - ESLint errors (fix with npm run lint)
# - Missing dependencies (check package.json)

# 4. Force redeploy
git commit --allow-empty -m "Trigger rebuild"
git push
```

### Problem: Zmienne Środowiskowe Nie Są Widoczne

**Objawy**:
- `process.env.VARIABLE` is undefined
- Console shows `undefined`

**Rozwiązanie**:
```bash
# 1. Sprawdź prefiks dla client-side zmiennych
# ❌ BAD
CESIUM_TOKEN=xxx

# ✅ GOOD
NEXT_PUBLIC_CESIUM_TOKEN=xxx

# 2. Restart dev server po zmianie .env
npm run dev

# 3. W Vercel: sprawdź czy zmienne mają właściwy environment
# Settings → Environment Variables → [Variable] → Edit
# ✅ Production
# ✅ Preview
# ✅ Development

# 4. Redeploy po dodaniu zmiennych
```

### Problem: Aplikacja Wolno Się Ładuje

**Objawy**:
- First Load > 5s
- Lighthouse Performance < 70

**Diagnostyka**:
```bash
# 1. Analyze bundle
npm run analyze

# 2. Check bundle size
npm run build
# Look for "First Load JS" in output

# 3. Lighthouse audit
lighthouse https://geoquest.vercel.app --view
```

**Optymalizacje**:
```typescript
// 1. Dynamic imports dla heavy components
const CesiumGlobe = dynamic(() => import('@/components/CesiumGlobe'), {
  ssr: false,
  loading: () => <Spinner />
});

// 2. Image optimization
<Image
  src="/logo.png"
  width={200}
  height={200}
  priority={true}
/>

// 3. Code splitting
// Automatic with App Router
```

### Problem: Tailwind Classes Nie Działają

**Objawy**:
- Brak styli
- Classes not applied

**Rozwiązanie**:
```bash
# 1. Sprawdź czy Tailwind jest skompilowany
# Look for .next/static/css/*.css

# 2. Verify tailwind.config.ts content paths
content: [
  './app/**/*.{js,ts,jsx,tsx,mdx}',
  './components/**/*.{js,ts,jsx,tsx,mdx}',
  './lib/**/*.{js,ts,jsx,tsx,mdx}',
]

# 3. Clear Next.js cache
rm -rf .next
npm run dev

# 4. Check globals.css import in layout.tsx
import './globals.css'
```

### Problem: 404 na API Routes

**Objawy**:
- `/api/rate-limit` returns 404
- API routes not found

**Rozwiązanie**:
```bash
# 1. Verify file structure
# Should be: app/api/rate-limit/route.ts
# NOT: app/api/rate-limit.ts

# 2. Check export
# Must export: GET, POST, etc.
export async function POST(req: Request) {}

# 3. Restart dev server
npm run dev

# 4. Check Vercel Functions
# Dashboard → Functions → Should see /api/rate-limit
```

---

## Monitoring i Maintenance

### Daily Checks

#### 1. Error Monitoring (gdy Sentry będzie aktywny)
- Sprawdź Sentry dashboard
- Resolve critical errors
- Monitor performance metrics

#### 2. Analytics (gdy PostHog będzie aktywny)
- Daily active users
- Quiz completion rate
- Most popular difficulty levels
- Average quiz scores

#### 3. Rate Limiting
```bash
# Check Redis usage
# Upstash Dashboard → Database → Metrics
# - Commands/day
# - Storage used
# - Peak connections
```

### Weekly Maintenance

#### 1. Dependencies Update
```bash
# Check outdated packages
npm outdated

# Update (carefully, test locally)
npm update

# Major updates (read changelogs first)
npm install package@latest
```

#### 2. Database Cleanup (gdy Redis będzie aktywny)
```bash
# Monitor Redis memory
# Upstash Dashboard → Metrics
# Set TTL for rate limit keys (już ustawione: 15 min)
```

#### 3. Performance Review
```bash
# Weekly Lighthouse audit
lighthouse https://geoquest.vercel.app --view

# Check Vercel Analytics
# Dashboard → Analytics → Overview
```

### Monthly Tasks

#### 1. Security Audit
```bash
# Check vulnerabilities
npm audit

# Fix automatically
npm audit fix

# Manual review for breaking changes
npm audit fix --force  # be careful
```

#### 2. Backup
```bash
# Questions data
cp public/data/questions.json backups/questions-$(date +%Y%m%d).json

# Environment variables
# Export from Vercel Dashboard manually
```

#### 3. Cost Review
- Vercel usage (should be in free tier)
- Upstash Redis (should be < 10k commands/day)
- Cesium Ion (should be < 50k requests/month)
- PostHog (should be < 1M events/month)

---

## Support i Dokumentacja

### Oficjalna Dokumentacja

- **Next.js**: https://nextjs.org/docs
- **Vercel**: https://vercel.com/docs
- **Cesium.js**: https://cesium.com/docs
- **Upstash**: https://docs.upstash.com
- **PostHog**: https://posthog.com/docs
- **Sentry**: https://docs.sentry.io
- **Stripe**: https://stripe.com/docs
- **Loops**: https://loops.so/docs

### Community

- **Next.js Discord**: https://nextjs.org/discord
- **Vercel Community**: https://github.com/vercel/vercel/discussions
- **Stack Overflow**: Tag `next.js`, `vercel`

### Kontakt

- **GitHub Issues**: https://github.com/Bangla84PL/geo-quest/issues
- **Repository**: https://github.com/Bangla84PL/geo-quest

---

## Changelog

- **2025-11-21**: Initial deployment documentation created
  - Architecture overview
  - Environment variables setup
  - Vercel deployment guide
  - External services configuration
  - Troubleshooting guide

---

**Ostatnia aktualizacja**: 2025-11-21
**Wersja**: 1.0.0
**Status**: ✅ Ready for deployment
