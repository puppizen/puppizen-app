'use client'
import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";

export default function TelegramInit(){
  const router = useRouter();
  const pathname = usePathname();

   useEffect(() => {
    const tg = window.Telegram?.WebApp;
    if (!tg) return;

    tg.ready();
    tg.expand();

    if (pathname === "/" || pathname === "/home") {
      tg.BackButton.hide();
      tg.CloseButton.show();
    } else {
      tg.CloseButton.hide()
      tg.BackButton.onClick(() => {
        router.back() 
      });
      tg.BackButton.show();
    }
    

    return () => {
      tg.BackButton.hide();
      tg.BackButton.offClick();
    };

    // const root = document.documentElement;
    // root.style.setProperty('--tg-bg-color', tg.themeParams?.bg_color || '#000000');
    // root.style.setProperty('--tg-text-color', tg.themeParams?.text_color || '#ffffff');
    // root.style.setProperty('--tg-button-color', tg.themeParams?.button_color || '#00bfa5');
    // root.style.setProperty('--tg-button-text-color', tg.themeParams?.button_text_color || '#ffffff');
  }, [pathname, router]);

  return (
    <>
    </>
  );
}
