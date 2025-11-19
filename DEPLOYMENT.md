# 🚀 Deployment Guide - GeoQuest

This guide covers deploying GeoQuest to production using Vercel (recommended) or other platforms.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Deploy to Vercel (Recommended)](#deploy-to-vercel-recommended)
- [Alternative Platforms](#alternative-platforms)
- [Environment Variables](#environment-variables)
- [Post-Deployment](#post-deployment)
- [Troubleshooting](#troubleshooting)

## Prerequisites

Before deploying, ensure you have:

1. **Cesium Ion Access Token**
   - Sign up at https://cesium.com/ion/
   - Create a new access token (free tier available)
   - Keep this token handy for environment variables

2. **(Optional) Upstash Redis**
   - Sign up at https://upstash.com/
   - Create a new Redis database
   - Copy the REST API URL and token

3. **Git Repository**
   - Push your code to GitHub, GitLab, or Bitbucket

## Deploy to Vercel (Recommended)

Vercel is the recommended platform as it's created by the Next.js team and offers excellent performance.

### Method 1: One-Click Deploy

1. Click the deploy button:
   [![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/Bangla84PL/geo-quest)

2. Follow the prompts to:
   - Connect your GitHub account
   - Name your project
   - Configure environment variables (see below)

3. Click **Deploy** and wait for the build to complete

### Method 2: Vercel CLI

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel**
   ```bash
   vercel login
   ```

3. **Deploy**
   ```bash
   vercel
   ```

4. **Add Environment Variables**
   ```bash
   vercel env add NEXT_PUBLIC_CESIUM_ION_ACCESS_TOKEN
   ```

5. **Deploy to Production**
   ```bash
   vercel --prod
   ```

### Method 3: Vercel Dashboard

1. Go to [vercel.com](https://vercel.com/)
2. Click **New Project**
3. Import your Git repository
4. Configure:
   - **Framework Preset**: Next.js
   - **Root Directory**: `./`
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next`
5. Add environment variables (see below)
6. Click **Deploy**

## Alternative Platforms

### Netlify

1. Create `netlify.toml` in project root:
   ```toml
   [build]
     command = "npm run build"
     publish = ".next"

   [[plugins]]
     package = "@netlify/plugin-nextjs"
   ```

2. Deploy:
   - Connect repository in Netlify dashboard
   - Add environment variables
   - Deploy

### Docker

1. Create `Dockerfile`:
   ```dockerfile
   FROM node:18-alpine AS base

   WORKDIR /app
   COPY package*.json ./
   RUN npm ci

   COPY . .
   RUN npm run build

   EXPOSE 3000
   CMD ["npm", "start"]
   ```

2. Build and run:
   ```bash
   docker build -t geoquest .
   docker run -p 3000:3000 -e NEXT_PUBLIC_CESIUM_ION_ACCESS_TOKEN=your_token geoquest
   ```

### VPS (Ubuntu/Debian)

1. **Install Node.js 18+**
   ```bash
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt-get install -y nodejs
   ```

2. **Clone and build**
   ```bash
   git clone https://github.com/Bangla84PL/geo-quest.git
   cd geo-quest
   npm install
   npm run build
   ```

3. **Set up environment variables**
   ```bash
   nano .env.local
   # Add your variables
   ```

4. **Use PM2 for process management**
   ```bash
   npm install -g pm2
   pm2 start npm --name "geoquest" -- start
   pm2 save
   pm2 startup
   ```

5. **Configure Nginx reverse proxy**
   ```nginx
   server {
       listen 80;
       server_name your-domain.com;

       location / {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

## Environment Variables

### Required Variables

```env
# Cesium Ion Access Token (Required)
NEXT_PUBLIC_CESIUM_ION_ACCESS_TOKEN=your_cesium_token_here
```

### Optional Variables

```env
# Upstash Redis (Optional - for rate limiting)
UPSTASH_REDIS_REST_URL=https://your-redis-url.upstash.io
UPSTASH_REDIS_REST_TOKEN=your_upstash_token_here
```

### Adding Variables in Vercel

1. Go to your project dashboard
2. Click **Settings** → **Environment Variables**
3. Add each variable:
   - **Key**: Variable name (e.g., `NEXT_PUBLIC_CESIUM_ION_ACCESS_TOKEN`)
   - **Value**: Your token/value
   - **Environments**: Select Production, Preview, and Development
4. Click **Save**
5. Redeploy for changes to take effect

## Post-Deployment

### 1. Verify Deployment

- Visit your deployed URL
- Test quiz flow: Home → Quiz → Results
- Check browser console for errors
- Test on multiple devices

### 2. Configure Custom Domain (Optional)

**Vercel:**
1. Go to **Settings** → **Domains**
2. Add your custom domain
3. Update DNS records as instructed
4. Wait for SSL certificate provisioning

### 3. Set Up Analytics (Optional)

**Vercel Analytics:**
```bash
npm install @vercel/analytics
```

Add to `app/layout.tsx`:
```tsx
import { Analytics } from '@vercel/analytics/react';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
```

### 4. Enable Rate Limiting

If you haven't set up Redis yet:

1. Create Upstash account: https://upstash.com/
2. Create new Redis database
3. Copy REST API credentials
4. Add to environment variables
5. Redeploy

### 5. Monitor Performance

- Check Vercel Analytics dashboard
- Monitor Core Web Vitals
- Review error logs in Vercel dashboard

## Troubleshooting

### Build Failures

**Problem**: Build fails with "Module not found"
**Solution**:
```bash
npm install
npm run build
# If successful, commit package-lock.json and redeploy
```

**Problem**: TypeScript errors
**Solution**:
```bash
npm run type-check
# Fix all TypeScript errors before deploying
```

### Runtime Errors

**Problem**: Globe not loading
**Solution**:
- Verify `NEXT_PUBLIC_CESIUM_ION_ACCESS_TOKEN` is set correctly
- Check token has not expired
- Ensure token has access to Cesium Ion assets

**Problem**: Rate limiting not working
**Solution**:
- Verify Redis credentials are correct
- Check Redis database is active in Upstash dashboard
- Rate limiting gracefully degrades if Redis is unavailable

### Performance Issues

**Problem**: Slow initial load
**Solution**:
- Enable Vercel Analytics to identify bottlenecks
- Check Cesium.js is loading efficiently
- Ensure images are optimized

**Problem**: API routes timing out
**Solution**:
- Increase timeout in `vercel.json`:
  ```json
  {
    "functions": {
      "app/api/**/*.ts": {
        "maxDuration": 10
      }
    }
  }
  ```

## Maintenance

### Updating Dependencies

```bash
npm update
npm audit fix
git commit -am "Update dependencies"
git push
```

### Updating Questions

1. Edit `/public/data/questions.json`
2. Commit changes
3. Push to trigger automatic redeployment

### Monitoring

- Set up Vercel Monitoring for alerts
- Check error logs regularly
- Monitor Redis usage in Upstash dashboard

## Support

For deployment issues:
- Check [Vercel Documentation](https://vercel.com/docs)
- Review [Next.js Deployment Guide](https://nextjs.org/docs/deployment)
- Open an issue on [GitHub](https://github.com/Bangla84PL/geo-quest/issues)

---

© Created with ❤️ by [SmartCamp.AI](https://smartcamp.ai)
