# 🌍 GeoQuest - Interactive 3D Geography Quiz

[![Next.js](https://img.shields.io/badge/Next.js-14+-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4-38bdf8)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/license-MIT-green)](./LICENSE)

> Test your geography knowledge with an immersive 3D globe powered by Cesium.js. No login required - instant play!

## ✨ Features

- **🌐 Interactive 3D Globe** - Powered by Cesium.js with high-res satellite imagery
- **📚 250+ Questions** - Capitals, cities, mountains, rivers, and fun facts
- **⚡ Instant Play** - No authentication required
- **🎯 3 Difficulty Levels** - Easy, Medium, and Hard
- **🏆 Performance Badges** - Bronze, Silver, Gold, and Platinum
- **📊 Detailed Statistics** - Track your accuracy and average response time
- **🎨 Dark Theme** - Beautiful, futuristic UI with glass morphism effects
- **📱 Responsive Design** - Optimized for desktop and mobile
- **⌨️ Keyboard Navigation** - Full accessibility support
- **🚀 Lightning Fast** - Optimized for <2s initial load time

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm
- Cesium Ion access token (free tier available)
- (Optional) Upstash Redis for rate limiting

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Bangla84PL/geo-quest.git
   cd geo-quest
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```

   Edit `.env.local` and add your Cesium Ion access token:
   ```env
   NEXT_PUBLIC_CESIUM_ION_ACCESS_TOKEN=your_token_here
   ```

   Get your free token at: https://cesium.com/ion/tokens

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📖 Usage

### Playing the Quiz

1. **Select Difficulty** - Choose Easy, Medium, or Hard
2. **Answer Questions** - 10 questions per session with 20s timer each
3. **View Results** - See your score, badge, and statistics
4. **Share Score** - Copy your results to clipboard or use native share

### Question Types

- **Multiple Choice** - Select from 4 options
- **True/False** - Simple binary questions

### Difficulty Levels

- **🟢 Easy** - Common capitals and major cities
- **🟡 Medium** - Lesser-known capitals and geographic features
- **🔴 Hard** - Challenging questions requiring deep knowledge

## 🏗️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **3D Rendering**: Cesium.js
- **Animations**: Framer Motion
- **State Management**: React Context API
- **Rate Limiting**: Upstash Redis
- **Hosting**: Vercel

## 📁 Project Structure

```
geo-quest/
├── app/                      # Next.js app directory
│   ├── api/rate-limit/       # Rate limiting endpoint
│   ├── layout.tsx            # Root layout
│   ├── page.tsx              # Main app
│   └── globals.css           # Global styles
├── components/
│   ├── screens/              # Screen components
│   └── ui/                   # UI components
├── lib/
│   ├── context/              # React contexts
│   └── utils.ts              # Utilities
├── public/data/
│   └── questions.json        # 250+ questions
├── types/
│   └── quiz.ts               # Type definitions
└── ...config files
```

## 🔧 Configuration

### Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `NEXT_PUBLIC_CESIUM_ION_ACCESS_TOKEN` | Yes | Cesium Ion access token |
| `UPSTASH_REDIS_REST_URL` | No | Redis URL (optional) |
| `UPSTASH_REDIS_REST_TOKEN` | No | Redis token (optional) |

## 📦 Deployment

### Deploy to Vercel (Recommended)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/Bangla84PL/geo-quest)

1. Click the button above
2. Add environment variables in Vercel dashboard
3. Deploy!

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed instructions.

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- **Cesium.js** - 3D globe rendering
- **Vercel** - Hosting platform
- **Upstash** - Serverless Redis
- **Tailwind CSS** - Styling
- **SmartCamp.AI** - Project sponsor

---

<p align="center">
  © Created with ❤️ by <a href="https://smartcamp.ai">SmartCamp.AI</a>
</p>
