// AnalyticsTracker: Initializes PostHog and tracks pageviews, clicks, sessions, and custom events (but not scrolls).
// Add custom event tracking in your components using posthog.capture('event_name', {...}).
"use client";
import { usePathname } from 'next/navigation';
import { useEffect } from 'react';
import posthog from 'posthog-js';

const POSTHOG_KEY = process.env.NEXT_PUBLIC_POSTHOG_KEY;
const POSTHOG_HOST = process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://app.posthog.com';

export default function AnalyticsTracker() {
  const pathname = usePathname();

  // Initialize PostHog once
  useEffect(() => {
    if (typeof window !== 'undefined' && POSTHOG_KEY && !posthog.__initialized) {
      posthog.init(POSTHOG_KEY, {
        api_host: POSTHOG_HOST,
        autocapture: false, // We'll manually capture events
      });
      posthog.__initialized = true;
      posthog.capture('session_start', { pathname });
    } else if (typeof window !== 'undefined' && !POSTHOG_KEY) {
      // eslint-disable-next-line no-console
      console.warn('PostHog key is missing. Set NEXT_PUBLIC_POSTHOG_KEY in your environment.');
    }
  }, []);

  // Track page views
  useEffect(() => {
    if (typeof window !== 'undefined' && posthog.__initialized) {
      posthog.capture('$pageview', { pathname });
    }
  }, [pathname]);

  // Track all click events (but not scroll)
  useEffect(() => {
    if (!posthog.__initialized) return;
    const handleClick = (e) => {
      // Find a useful label for the click
      let label = e.target?.innerText || e.target?.ariaLabel || e.target?.alt || e.target?.id || e.target?.className || e.target?.tagName;
      if (typeof label === 'object') label = undefined;
      posthog.capture('click', {
        label,
        tag: e.target?.tagName,
        id: e.target?.id,
        class: e.target?.className,
        pathname: window.location.pathname,
      });
    };
    window.addEventListener('click', handleClick, true);
    return () => window.removeEventListener('click', handleClick, true);
  }, []);

  return null;
} 