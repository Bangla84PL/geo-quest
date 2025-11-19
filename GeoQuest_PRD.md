# Product Requirements Document: GeoQuest

## 1. Executive Summary

**GeoQuest** to nowoczesna aplikacja webowa wykorzystująca Cesium.js do renderowania interaktywnego globu 3D w centrum ekranu. Aplikacja łączy edukację geograficzną z grywalizacją poprzez quiz, w którym użytkownicy odpowiadają na pytania geograficzne lub wskazują lokalizacje bezpośrednio na obracającym się globusie.

**Kluczowe cechy:**
- Bez rejestracji/logowania - instant play
- Ultra-nowoczesny, futurystyczny UI/UX
- Rate limiting przez Redis (ochrona przed spamem)
- Responsywny design (desktop priority)
- Hostowanie: Vercel (frontend) + zewnętrzny Redis

## 2. Problem Statement

Nauka geografii jest nudna i statyczna. Tradycyjne mapy 2D nie angażują użytkowników. GeoQuest rozwiązuje ten problem poprzez:
- Immersyjną wizualizację 3D świata
- Grywalizację wiedzy geograficznej
- Instant access bez barier wejścia

## 3. Target Users

**Primary:**
- Uczniowie (12-25 lat) - nauka geografii
- Pasjonaci geografii i podróży
- Nauczyciele - narzędzie edukacyjne

**Secondary:**
- Casual gamers szukający quick brain teasers
- Travel enthusiasts testujący swoją wiedzę

## 4. Goals & Success Metrics

**Business Goals:**
- Zbudować portfolio piece dla SmartCamp.AI
- Zaprezentować umiejętności 3D web development
- Stworzyć viralny, shareable content

**Success Metrics:**
- 1000+ unique visitors w pierwszym miesiącu
- Avg session duration > 5 minut
- Quiz completion rate > 60%
- <2s initial load time

## 5. User Stories

**As a player:**
- Wchodzę na stronę i widzę obracający się glob 3D
- Klikam "Start Quiz" i dostaję pytanie geograficzne
- Odpowiadam klikając na globie lub wybierając z opcji
- Dostaję instant feedback (prawidłowa/błędna odpowiedź)
- Widzę swój wynik na końcu quizu
- Mogę zagrać ponownie lub podzielić się wynikiem

## 6. Functional Requirements

### 6.1 Core Features (MVP)

**A. Interactive 3D Globe (Cesium.js)**
- Centralny element UI - duży glob zajmujący 60-70% viewportu
- Smooth rotation (auto-rotate 0.2°/s gdy nieaktywny)
- Zoom controls (scroll/pinch)
- Pan controls (click & drag)
- High-res satellite imagery
- Country borders overlay
- City markers dla głównych miast (100+ locations)

**B. Quiz System**
- 3 typy pytań:
  1. **Multiple choice** - "Które państwo jest zaznaczone?" (4 opcje)
  2. **Click-to-answer** - "Wskaż na globie: Paryż"
  3. **True/False** - "Czy Nowy Jork jest stolicą USA?"
- 10 pytań na sesję
- Randomizacja kolejności
- 20s timer na pytanie
- Score tracking (0-100 points)
- Difficulty levels: Easy / Medium / Hard

**C. Question Bank**
- Minimum 200 pytań w bazie
- Kategorie:
  - Stolice świata
  - Największe miasta
  - Góry i rzeki
  - Krainy geograficzne
  - Fun facts
- JSON format przechowywany w `/data/questions.json`

**D. Rate Limiting**
- Redis-based
- Limit: 50 requests/15min per IP
- Graceful error handling (429 status)
- Toast notification: "Too many requests, try again in X minutes"

**E. Results Screen**
- Final score display (X/10 correct)
- Performance badge (Bronze/Silver/Gold/Platinum)
- Statistics:
  - Accuracy percentage
  - Average response time
  - Correct/incorrect breakdown
- "Play Again" CTA
- Share button (copy score to clipboard)

### 6.2 Future Features (Post-MVP)
- Multiplayer mode (real-time races)
- Leaderboards (requires auth)
- Custom quiz creation
- More question types (estimate distance, population)
- AR mode (mobile camera overlay)
- Audio pronunciation dla nazw miejsc
- Achievement system

### 6.3 User Flows

**Main Flow:**
```
1. Land on homepage → See rotating globe + "Start Quiz" button
2. Click "Start Quiz" → Difficulty selection overlay
3. Select difficulty → Quiz begins, globe zooms to relevant region
4. Question appears in overlay panel (bottom 25% of screen)
5. User answers → Instant feedback animation on globe
6. Next question → Repeat steps 4-5 (10x)
7. Quiz ends → Results screen with score
8. Click "Play Again" or "Home" → Loop back
```

**Error Flow:**
```
1. Rate limit exceeded → Toast notification appears
2. User waits or closes tab
3. After cooldown → Can play again
```

## 7. Technical Requirements

### 7.1 Platform
- **Type:** Progressive Web App (PWA)
- **Primary:** Desktop browsers (Chrome, Firefox, Safari, Edge)
- **Secondary:** Mobile browsers (responsive, touch-optimized)
- **Min requirements:** WebGL 2.0 support

### 7.2 Architecture

**Frontend:**
- **Framework:** Next.js 14+ (App Router)
- **Language:** TypeScript
- **3D Engine:** Cesium.js (latest stable)
- **Styling:** Tailwind CSS v4 + provided design tokens
- **State:** React Context API (no Redux needed for MVP)
- **Animations:** Framer Motion

**Backend:**
- **API Routes:** Next.js API routes (`/api/*`)
- **Rate Limiting:** Upstash Redis (serverless Redis)
- **Question Storage:** Static JSON file (`/public/data/questions.json`)

### 7.3 Integrations
- **Cesium Ion** - Asset streaming (free tier: 5GB/month)
- **Upstash Redis** - Rate limiting (free tier: 10k commands/day)
- No other external APIs for MVP

### 7.4 Infrastructure & Hosting

**Hosting:** Vercel
- Free tier sufficient for MVP
- Auto-scaling
- Edge functions dla API routes
- CDN for static assets

**Redis:** Upstash (serverless Redis)
- No dedicated VPS needed
- REST API access from Vercel edge functions
- Auto-scaling, pay-per-request

**Deployment:**
- CI/CD via GitHub → Vercel
- Preview deployments for PRs
- Production domain: `geoquest.vercel.app` (custom domain optional)

**Environment Variables:**
```
CESIUM_ION_ACCESS_TOKEN=<token>
UPSTASH_REDIS_REST_URL=<url>
UPSTASH_REDIS_REST_TOKEN=<token>
```

### 7.5 Authentication & Security
- **No authentication** for MVP
- Rate limiting via IP address (Vercel provides `x-forwarded-for`)
- Input sanitization for any future user-generated content
- CORS configured for Vercel domain only
- CSP headers dla XSS protection

## 8. Data Model

```typescript
// Question Type
interface Question {
  id: string;
  type: 'multiple-choice' | 'click-to-answer' | 'true-false';
  difficulty: 'easy' | 'medium' | 'hard';
  category: string;
  question: string;
  options?: string[]; // for multiple-choice
  correctAnswer: string | Coordinates; // string for MC/TF, coords for click
  explanation?: string;
  targetLocation?: Coordinates; // for globe zoom/highlight
}

interface Coordinates {
  lat: number;
  lon: number;
  radius?: number; // acceptable answer radius in km
}

// Quiz Session (client-side only)
interface QuizSession {
  sessionId: string;
  difficulty: string;
  questions: Question[];
  currentIndex: number;
  answers: Answer[];
  startTime: number;
  score: number;
}

interface Answer {
  questionId: string;
  userAnswer: string | Coordinates;
  isCorrect: boolean;
  timeSpent: number; // seconds
}
```

## 9. UI/UX Requirements

### Design Principles
- **Futuristic & Minimalistic** - clean lines, subtle gradients, glass morphism
- **Dark theme primary** - provided color scheme (dark mode tokens)
- **Smooth animations** - 60fps transitions, easing functions
- **Focus on globe** - UI elements should not distract from 3D view
- **Accessibility** - WCAG AA compliant, keyboard navigation

### Key Screens

**1. Home Screen**
```
┌────────────────────────────────────┐
│   [Logo: GeoQuest]    [Info Icon]  │ ← Minimalist header
│                                    │
│          ╔════════════╗            │
│          ║            ║            │
│          ║   GLOBE    ║            │ ← 70% viewport height
│          ║   CESIUM   ║            │
│          ║    3D      ║            │
│          ╚════════════╝            │
│                                    │
│       [START QUIZ BUTTON]          │ ← Glowing CTA button
│                                    │
│   © Created with ❤️ by SmartCamp.AI │ ← Footer link
└────────────────────────────────────┘
```

**2. Quiz Screen**
```
┌────────────────────────────────────┐
│ Q 5/10  [Progress: ████░░] ⏱ 15s  │ ← Top bar
│                                    │
│          ╔════════════╗            │
│          ║   GLOBE    ║            │
│          ║  (zoomed   ║            │ ← Globe active/highlighted
│          ║   to area) ║            │
│          ╚════════════╝            │
│                                    │
│ ┌──────────────────────────────┐  │
│ │ Question: Which country is   │  │ ← Bottom overlay panel
│ │ highlighted in yellow?       │  │   (glass morphism effect)
│ │                              │  │
│ │ ○ Poland                     │  │
│ │ ○ Germany    [SUBMIT BUTTON] │  │
│ │ ○ France                     │  │
│ │ ○ Italy                      │  │
│ └──────────────────────────────┘  │
└────────────────────────────────────┘
```

**3. Results Screen**
```
┌────────────────────────────────────┐
│                                    │
│     🏆 QUIZ COMPLETE!              │
│                                    │
│     Score: 8/10 (80%)              │ ← Large, animated
│     Badge: ⭐ GOLD EXPLORER        │
│                                    │
│     Accuracy: 80%                  │
│     Avg Time: 12s/question         │
│                                    │
│  [PLAY AGAIN]  [SHARE SCORE]      │
│                                    │
│   © Created with ❤️ by SmartCamp.AI │
└────────────────────────────────────┘
```

### Color Scheme
Use provided CSS variables (dark mode):
- **Background:** `var(--background)` - dark base
- **Primary:** `var(--primary)` - accent color for buttons
- **Foreground:** `var(--foreground)` - text color
- **Card:** `var(--card)` - overlay panels (with backdrop blur)
- **Border:** `var(--border)` - subtle outlines

### Typography
- **Font family:** `var(--font-sans)` (system fonts)
- **Headings:** Bold, large, tracking-tight
- **Body:** Regular weight, comfortable line-height (1.6)
- **Monospace:** `var(--font-mono)` for timer/score

### Interaction Patterns
- **Hover states:** Subtle scale (1.02x), glow effect
- **Click feedback:** Scale down (0.98x), haptic feel
- **Loading states:** Skeleton loaders, spinning globe
- **Transitions:** 200-300ms ease-in-out
- **Globe interaction:**
  - Click = select location
  - Drag = rotate manually
  - Scroll = zoom
  - Double-click = zoom to location

### Global Footer Requirement
Every screen must display:
```html
<footer>
  <a href="https://smartcamp.ai" target="_blank">
    © Created with ❤️ by SmartCamp.AI
  </a>
</footer>
```
- Positioned at bottom center
- Small, unobtrusive text
- White color with opacity 0.7
- Links to https://smartcamp.ai

### Accessibility
- Keyboard navigation (Tab, Enter, Arrow keys)
- Screen reader labels dla wszystkich interactive elements
- Focus indicators (visible outline)
- Color contrast ratio ≥ 4.5:1
- Alt text dla visual feedback
- ARIA labels dla quiz state

## 10. Non-Functional Requirements

**Performance:**
- Initial load: <2s (3G connection)
- Globe render: <1s after Cesium load
- Interaction lag: <100ms
- Lighthouse score: >90 (Performance, Accessibility)

**Scalability:**
- Handle 10k concurrent users (Vercel auto-scales)
- Redis handles 10k req/day (Upstash free tier)
- Static JSON scales infinitely via CDN

**Browser Compatibility:**
- Chrome 90+ ✅
- Firefox 88+ ✅
- Safari 14+ ✅
- Edge 90+ ✅
- Mobile browsers: iOS Safari 14+, Chrome Android 90+

**SEO:**
- Meta tags (title, description, OG tags)
- Semantic HTML
- robots.txt allowing crawlers
- Sitemap.xml

## 11. Constraints & Assumptions

**Constraints:**
- No backend database (static questions only)
- Cesium Ion free tier: 5GB/month bandwidth
- Upstash Redis free tier: 10k commands/day
- No user accounts = no progress persistence
- WebGL required (10% users may not have support)

**Assumptions:**
- Users have stable internet (Cesium streams tiles)
- Majority desktop users (optimized for >1024px width)
- Users okay with anonymous play (no login friction)
- Question bank manually curated (no UGC for MVP)

## 12. Out of Scope (MVP)

❌ User authentication/accounts
❌ Progress saving/history
❌ Multiplayer/real-time features
❌ Leaderboards
❌ Custom quiz creation by users
❌ Mobile app (native iOS/Android)
❌ Offline mode
❌ Admin panel dla question management
❌ Analytics dashboard
❌ Payment/monetization
❌ Social media integration (beyond clipboard share)

## 13. Development Phases

**Phase 1: Foundation (Week 1)**
- Next.js setup + TypeScript config
- Cesium.js integration + basic globe render
- Responsive layout + dark theme
- Question JSON structure

**Phase 2: Quiz Logic (Week 1)**
- Quiz state management
- Question display logic
- Answer validation
- Score calculation
- Results screen

**Phase 3: Polish (Week 2)**
- Animations (Framer Motion)
- Rate limiting (Redis integration)
- Error handling
- Loading states
- Accessibility audit

**Phase 4: Deploy (Week 2)**
- Vercel deployment
- Environment variable setup
- Performance optimization
- SEO implementation
- Final QA testing

**Total Timeline:** 2 weeks for full MVP

## 14. Appendix

### Tech Stack Summary
```
Frontend: Next.js 14 + TypeScript + Tailwind v4
3D Engine: Cesium.js
Hosting: Vercel (Free tier)
Rate Limiting: Upstash Redis (Serverless)
CI/CD: GitHub → Vercel
Design: Provided CSS tokens (dark theme)
```

### Question Bank Example
```json
{
  "questions": [
    {
      "id": "q001",
      "type": "multiple-choice",
      "difficulty": "easy",
      "category": "capitals",
      "question": "Which is the capital of France?",
      "options": ["Paris", "Berlin", "Rome", "Madrid"],
      "correctAnswer": "Paris",
      "explanation": "Paris has been the capital since 987 AD.",
      "targetLocation": { "lat": 48.8566, "lon": 2.3522 }
    },
    {
      "id": "q002",
      "type": "click-to-answer",
      "difficulty": "medium",
      "category": "cities",
      "question": "Click on Tokyo on the globe",
      "correctAnswer": { "lat": 35.6762, "lon": 139.6503, "radius": 50 },
      "explanation": "Tokyo is located on Japan's main island, Honshu."
    }
  ]
}
```

### Cesium.js Key Features to Use
- `Viewer` widget (main globe component)
- `ImageryLayer` (satellite tiles)
- `Entity` API (markers, polylines)
- `Camera` controls (flyTo, lookAt)
- `ScreenSpaceEventHandler` (click detection)
- `GeoJsonDataSource` (country borders)

### Rate Limiting Implementation (Pseudocode)
```typescript
// /app/api/check-rate-limit/route.ts
import { Redis } from '@upstash/redis'

export async function POST(req: Request) {
  const ip = req.headers.get('x-forwarded-for')
  const key = `ratelimit:${ip}`
  
  const requests = await redis.incr(key)
  if (requests === 1) {
    await redis.expire(key, 900) // 15min TTL
  }
  
  if (requests > 50) {
    return Response.json({ error: 'Rate limit exceeded' }, { status: 429 })
  }
  
  return Response.json({ ok: true })
}
```

---

**Document Size:** ~9.8kB
**Ready for:** Claude Code autonomous development
**Contact:** SmartCamp.AI - https://smartcamp.ai
