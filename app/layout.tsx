import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'GeoQuest - Interactive 3D Geography Quiz',
  description: 'Test your geography knowledge with an immersive 3D globe. Explore countries, capitals, and landmarks in an engaging quiz experience.',
  keywords: ['geography', 'quiz', 'education', '3D globe', 'Cesium', 'interactive learning'],
  authors: [{ name: 'SmartCamp.AI', url: 'https://smartcamp.ai' }],
  creator: 'SmartCamp.AI',
  publisher: 'SmartCamp.AI',
  openGraph: {
    title: 'GeoQuest - Interactive 3D Geography Quiz',
    description: 'Test your geography knowledge with an immersive 3D globe',
    url: 'https://geoquest.vercel.app',
    siteName: 'GeoQuest',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'GeoQuest - Interactive 3D Geography Quiz',
    description: 'Test your geography knowledge with an immersive 3D globe',
  },
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className="antialiased">
        {children}
        <footer>
          <a
            href="https://smartcamp.ai"
            target="_blank"
            rel="noopener noreferrer"
          >
            © Created with ❤️ by SmartCamp.AI
          </a>
        </footer>
      </body>
    </html>
  );
}
