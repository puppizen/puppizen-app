'use client';
import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { BackButton } from '@twa-dev/sdk/react';

export default function TelegramInit() {
  const pathname = usePathname();
  const isHome = pathname === '/' || pathname === '/home';

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const tg = window.Telegram?.WebApp;
    if (!tg) return;

    tg.ready();
    tg.expand();

    if (isHome) {
      tg.MainButton.setText("Close");
      tg.MainButton.show();
      tg.MainButton.onClick(() => tg.close());
    } else {
      tg.MainButton.hide();
      tg.MainButton.offClick();
    }

    return () => {
      tg.MainButton.offClick();
      tg.MainButton.hide();
    };
  }, [isHome]);

  return (
    <>
      {!isHome && <BackButton onClick={() => window.history.back()} />}
    </>
  );
}