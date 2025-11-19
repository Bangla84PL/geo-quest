import { NextRequest, NextResponse } from 'next/server';
import { Redis } from '@upstash/redis';

/**
 * Rate Limiting API Route
 * Uses Upstash Redis to limit requests per IP
 * Limit: 50 requests per 15 minutes per IP
 */

// Initialize Redis client (only if env vars are set)
let redis: Redis | null = null;
if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
  redis = new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL,
    token: process.env.UPSTASH_REDIS_REST_TOKEN,
  });
}

const RATE_LIMIT = 50; // requests
const WINDOW = 900; // 15 minutes in seconds

export async function POST(req: NextRequest) {
  try {
    // If Redis is not configured, allow request (development mode)
    if (!redis) {
      console.warn('Redis not configured - rate limiting disabled');
      return NextResponse.json({ ok: true, remaining: RATE_LIMIT });
    }

    // Get IP address
    const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown';
    const key = `ratelimit:${ip}`;

    // Increment counter
    const requests = await redis.incr(key);

    // Set expiry on first request
    if (requests === 1) {
      await redis.expire(key, WINDOW);
    }

    // Check if limit exceeded
    if (requests > RATE_LIMIT) {
      const ttl = await redis.ttl(key);
      const minutesRemaining = Math.ceil(ttl / 60);

      return NextResponse.json(
        {
          error: 'Rate limit exceeded',
          message: `Too many requests. Please try again in ${minutesRemaining} minute${minutesRemaining !== 1 ? 's' : ''}.`,
          retryAfter: ttl,
        },
        { status: 429 }
      );
    }

    // Return success with remaining requests
    const remaining = RATE_LIMIT - requests;
    return NextResponse.json({
      ok: true,
      remaining,
      limit: RATE_LIMIT,
      window: WINDOW,
    });
  } catch (error) {
    console.error('Rate limit error:', error);
    // On error, allow the request to proceed
    return NextResponse.json({ ok: true, error: 'Rate limit check failed' });
  }
}

// Health check endpoint
export async function GET() {
  const isConfigured = redis !== null;
  return NextResponse.json({
    status: 'ok',
    rateLimiting: isConfigured ? 'enabled' : 'disabled',
    limit: RATE_LIMIT,
    window: `${WINDOW / 60} minutes`,
  });
}
