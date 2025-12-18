import {
  ClerkProvider
} from '@clerk/nextjs';
import { Geist, Geist_Mono } from "next/font/google";
import Script from 'next/script';
import AnalyticsTracker from './components/AnalyticsTracker';
import { SocketProvider } from "./context/SocketContext";
import "./globals.css";
import UserPlanProvider from './context/UserPlanProvider';
import { Dancing_Script } from 'next/font/google';

const dancingScript = Dancing_Script({
  subsets: ['latin'],
  display: 'swap',
  weight: ['400', '700'], // specify weights if needed
});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  metadataBase: new URL('https://sharemytimer.live'),
  title: 'ShareMyTimer - Real-Time Collaborative Synchronized Timers',
  description: 'Create and share synchronized timers for teams and events. Control from your phone, display fullscreen anywhere. Zero friction, no sign up required.',
  keywords: [
    'timer', 'online timer', 'share timer', 'real-time timer', 'synchronized timer', 'event timer', 'classroom timer', 'countdown', 'count up', 'remote timer', 'presentation timer', 'meeting timer', 'ShareMyTimer', 'sharable timer', 'free timer', 'team timer', 'collaborative timer'
  ],
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/favicon.ico',
  },
  openGraph: {
    title: 'ShareMyTimer - Real-Time Collaborative Synchronized Timers',
    description: 'Create and share synchronized timers for teams and events. Control from your phone, display fullscreen anywhere. Zero friction, no sign up required.',
    url: 'https://sharemytimer.live',
    siteName: 'ShareMyTimer',
    images: [
      {
        url: '/landingPage.png',
        width: 1200,
        height: 630,
        alt: 'ShareMyTimer - Real-time collaborative timer interface showing live timer display',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
};

export default function RootLayout({ children }) {

  return (
    <ClerkProvider>
    <html lang="en" className={dancingScript.className}>
      <head>
        {/* Google Analytics */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-599CEW0ESH"
          strategy="afterInteractive"
        />
        <Script id="gtag-init" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-599CEW0ESH');
          `}
        </Script>
      </head>
      <body
        className={`${geistSans.variable} antialiased`}
      >
        <UserPlanProvider>
          <SocketProvider>
            <AnalyticsTracker />
            {children}
          </SocketProvider>
        </UserPlanProvider>
      </body>
    </html>
    </ClerkProvider>
  );
}
