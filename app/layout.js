import {
  ClerkProvider
} from '@clerk/nextjs';
import { Geist, Geist_Mono } from "next/font/google";
import Script from 'next/script';
import AnalyticsTracker from './components/AnalyticsTracker';
import { SocketProvider } from "./context/SocketContext";
import "./globals.css";
import UserPlanProvider from './context/UserPlanProvider';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: 'ShareMyTimer - Real-Time Online Timer Sharing',
  description: 'ShareMyTimer lets you create, control, and share real-time synchronized timers for teams, events, and classrooms. No sign up required. Free and easy to use.',
  keywords: [
    'timer', 'online timer', 'share timer', 'real-time timer', 'synchronized timer', 'event timer', 'classroom timer', 'countdown', 'count up', 'remote timer', 'presentation timer', 'meeting timer', 'ShareMyTimer'
  ],
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/favicon.ico',
  },
  openGraph: {
    title: 'ShareMyTimer - Real-Time Online Timer Sharing',
    description: 'Create and share real-time synchronized timers for teams, events, and classrooms. Free, no sign up required.',
    url: 'https://sharemytimer.live',
    siteName: 'ShareMyTimer',
    images: [
      {
        url: '/shareMyTimerWithoutTxt.png',
        width: 1200,
        height: 630,
        alt: 'ShareMyTimer Logo',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ShareMyTimer - Real-Time Online Timer Sharing',
    description: 'Create and share real-time synchronized timers for teams, events, and classrooms. Free, no sign up required.',
    images: ['/shareMyTimerWithoutTxt.png'],
    site: '@RajneeshMi436',
  },
};

export default function RootLayout({ children }) {

  return (
    <ClerkProvider>
    <html lang="en">
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
