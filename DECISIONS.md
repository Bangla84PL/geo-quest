# Technical Decisions & Assumptions

## Document Purpose
This document tracks all autonomous technical decisions made during development based on the PRD requirements.

## Key Decisions

### 1. Technology Stack
**Decision**: Next.js 14.2+ with App Router, TypeScript, Tailwind CSS v4, Cesium.js
**Rationale**:
- PRD explicitly requires Next.js 14+ with App Router
- TypeScript for type safety and better developer experience
- Tailwind v4 for modern CSS with provided design tokens
- Cesium.js for interactive 3D globe rendering

### 2. No Database/Authentication
**Decision**: Static JSON question bank, no Supabase, no auth system
**Rationale**:
- PRD explicitly states "No authentication" and "static questions only"
- Instant play without friction is core requirement
- Question bank stored in `/public/data/questions.json`
- No user accounts = no progress persistence

### 3. Rate Limiting Strategy
**Decision**: Upstash Redis with serverless REST API
**Rationale**:
- PRD specifies Upstash Redis (not Supabase)
- 50 requests per 15 minutes per IP
- Vercel edge functions can access Redis via REST API
- Free tier: 10k commands/day sufficient for MVP

### 4. Hosting & Deployment
**Decision**: Vercel (frontend + API routes) + Upstash Redis
**Rationale**:
- PRD specifies Vercel hosting
- No VPS needed - fully serverless architecture
- Auto-scaling, CDN, edge functions included
- GitHub integration for CI/CD

### 5. Cesium.js Integration
**Decision**: Client-side Cesium Ion with free tier
**Rationale**:
- Cesium Ion free tier: 5GB/month bandwidth
- High-res satellite imagery included
- Asset streaming for optimal performance
- Requires CESIUM_ION_ACCESS_TOKEN environment variable

### 6. Question Bank Size
**Decision**: Generate 250+ questions across 5 categories
**Rationale**:
- PRD requires minimum 200 questions
- Categories: Capitals, Cities, Mountains/Rivers, Geographic Regions, Fun Facts
- JSON format for easy editing and CDN caching
- Each question has difficulty level and explanation

### 7. Quiz Logic
**Decision**: Client-side state management with React Context API
**Rationale**:
- No need for Redux/Zustand for simple quiz state
- Context API sufficient for 3-4 components
- LocalStorage for session persistence (optional)
- No server-side state needed

### 8. Responsive Design Priority
**Decision**: Desktop-first, mobile-optimized
**Rationale**:
- PRD states "desktop priority"
- Globe interaction better on larger screens
- Mobile: simplified controls, smaller question panel
- Breakpoints: 1024px+ (desktop), 768px+ (tablet), <768px (mobile)

### 9. Performance Optimizations
**Decision**:
- Lazy load Cesium.js (heavy library ~10MB)
- Dynamic imports for quiz screens
- Image optimization with Next.js Image
- Static generation where possible

**Rationale**:
- Target: <2s initial load on 3G
- Cesium only loads on globe interaction
- Lighthouse score >90 requirement

### 10. Accessibility
**Decision**: WCAG AA compliance
- Keyboard navigation (Tab, Enter, Arrow keys)
- ARIA labels for quiz state
- Focus indicators on all interactive elements
- Color contrast ratio ≥4.5:1
- Screen reader support

**Rationale**: PRD requirement + best practices

### 11. SEO Strategy
**Decision**:
- Static meta tags in layout
- Open Graph tags for social sharing
- JSON-LD structured data
- robots.txt and sitemap.xml

**Rationale**: PRD requires SEO optimization for viral potential

### 12. Animations
**Decision**: Framer Motion for UI, native Cesium animations for globe
**Rationale**:
- PRD specifies Framer Motion
- Smooth 60fps transitions required
- Globe: auto-rotate 0.2°/s, flyTo animations
- UI: scale, fade, slide transitions

### 13. Error Handling
**Decision**:
- Toast notifications for rate limits
- Fallback UI for WebGL unsupported browsers
- Graceful degradation for slow connections
- Error boundaries for React components

**Rationale**: Production-ready error handling required

### 14. Environment Variables
**Decision**:
```
NEXT_PUBLIC_CESIUM_ION_ACCESS_TOKEN
UPSTASH_REDIS_REST_URL
UPSTASH_REDIS_REST_TOKEN
```

**Rationale**:
- NEXT_PUBLIC_ prefix for client-side Cesium token
- Private tokens for server-side Redis API routes

### 15. Branding Implementation
**Decision**: Use provided index.css design tokens + SmartCamp.AI footer
**Rationale**:
- Dark theme as primary (`.dark` class)
- CSS variables for all colors (oklch format)
- Glass morphism effects for overlays
- Footer: "© Created with ❤️ by SmartCamp.AI" linking to smartcamp.ai

### 16. Testing Strategy
**Decision**: Manual testing for MVP, Vitest setup for future
**Rationale**:
- 2-week timeline, focus on features first
- Vitest config included for future unit tests
- E2E testing out of scope for MVP

## Assumptions Made

1. **Internet Connectivity**: Users have stable internet (Cesium streams tiles)
2. **Browser Support**: 90%+ users have WebGL 2.0 support
3. **Geographic Coverage**: Focus on well-known locations (capitals, major cities)
4. **Question Accuracy**: Manual curation ensures correctness
5. **Free Tier Limits**: Traffic stays within Cesium (5GB/month) and Upstash (10k/day) limits
6. **No Monetization**: MVP is portfolio piece, not commercial product
7. **User Behavior**: Average session 5-10 minutes, single quiz per visit
8. **Content Updates**: Question bank manually updated via JSON edits

## Non-Implemented Features (Per PRD)
- ❌ User authentication/accounts
- ❌ Leaderboards (requires auth)
- ❌ Multiplayer mode
- ❌ Custom quiz creation
- ❌ Admin panel
- ❌ Analytics dashboard
- ❌ Offline mode/PWA
- ❌ Native mobile apps
- ❌ Social media integration beyond clipboard share

## Future Enhancements (Post-MVP)
- Real-time multiplayer races
- Achievement system
- Audio pronunciation for place names
- AR mode for mobile
- Distance/population estimation questions
- Custom quiz builder

---

**Last Updated**: 2025-11-19
**Document Version**: 1.0
