'use client'
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function TelegramInit(){
  const router = useRouter();

   useEffect(() => {
    const tg = window.Telegram?.WebApp;
    if (!tg) return;

    tg.ready();
    tg.expand();
    tg.BackButton.show();
    tg.BackButton.onClick(() => {
      router.back() // or use router.back() if you prefer navigation
    });

    return () => {
      tg.BackButton.hide();
      tg.BackButton.offClick();
    };

    // const root = document.documentElement;
    // root.style.setProperty('--tg-bg-color', tg.themeParams?.bg_color || '#000000');
    // root.style.setProperty('--tg-text-color', tg.themeParams?.text_color || '#ffffff');
    // root.style.setProperty('--tg-button-color', tg.themeParams?.button_color || '#00bfa5');
    // root.style.setProperty('--tg-button-text-color', tg.themeParams?.button_text_color || '#ffffff');
  }, [router]);

  return null;
}
