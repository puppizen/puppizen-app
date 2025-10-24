'use client';
import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import TelegramAnalytics from '@telegram-apps/analytics'

export default function TelegramInit() {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const tg = window.Telegram?.WebApp;
    if (!tg) return;

    tg.ready();
    tg.expand();

    if (pathname === '/' || pathname === '/home') {
      // Show Close button on home page
      tg.BackButton.hide();
    } else {
      // Show Back button on other pages
      tg.BackButton.show();
      tg.BackButton.onClick(() => router.back());
    }

    return () => {
      tg.BackButton.offClick();
      tg.BackButton.hide();
    };
  }, [pathname, router]);

  useEffect(() => {
    TelegramAnalytics.init({
        token: 'eyJhcHBfbmFtZSI6InB1cHBpemVuIiwiYXBwX3VybCI6Imh0dHBzOi8vdC5tZS9QdXBwaXplbkJvdCIsImFwcF9kb21haW4iOiJodHRwczovL3B1cHBpemVuLWFwcC52ZXJjZWwuYXBwLyJ9!USCqBE5HvhCDrqFw7BtISkeaRLWhTzUn1mGTywNIwj0=',
        appName: 'Puppizen',
    });
  }, [])

  return null;
}