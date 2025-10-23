'use client';
import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';

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
      tg.CloseButton.show();
    } else {
      // Show Back button on other pages
      tg.CloseButton.hide();
      tg.BackButton.show();
      tg.BackButton.onClick(() => router.back());
    }

    return () => {
      tg.BackButton.offClick();
      tg.BackButton.hide();
      tg.CloseButton.hide();
    };
  }, [pathname, router]);

  return null;
}