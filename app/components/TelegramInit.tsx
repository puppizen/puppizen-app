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
      // Show MainButton as Close
      tg.BackButton.hide();
      tg.MainButton.setText("Close");
      tg.MainButton.show()
      tg.MainButton.onClick(() => tg.close());
    } else {
      // Show BackButton
      tg.MainButton.hide();
      tg.BackButton.show();
      tg.BackButton.onClick(() => router.back());
    }

    return () => {
      tg.BackButton.offClick();
      tg.BackButton.hide();
      tg.MainButton.offClick();
      tg.MainButton.hide();
    };
  }, [pathname, router]);

  return null;
}