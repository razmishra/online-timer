"use client";
import { usePathname } from 'next/navigation';
import { useEffect } from 'react';

export default function AnalyticsTracker() {
  const pathname = usePathname();

  useEffect(() => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('config', 'G-599CEW0ESH', {
        page_path: pathname,
      });
    }
  }, [pathname]);

  return null;
} 