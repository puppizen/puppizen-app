import type { Metadata } from "next";
import { Righteous } from "next/font/google";
import "./globals.css";
import Script from "next/script";

import { TonProvider } from "./components/TonProvider";
import { useEffect } from "react";
import router from "next/router";

const righteous = Righteous({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-righteous",
});

export const metadata: Metadata = {
  title: "Puppizen",
  description: "Telegram mini-app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  useEffect(() => {
    const tg = window.Telegram?.WebApp;
    if (!tg) return;

    tg.ready();
    tg.expand();
    tg.close();
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
  }, []);


  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"></meta>
        
        <Script src="https://telegram.org/js/telegram-web-app.js" strategy="beforeInteractive" />

        <Script src="https://sad.adsgram.ai/js/sad.min.js"></Script>
      </head>
      <body
        className={`${righteous.className} antialiased`}
      >
        <TonProvider>{children}</TonProvider>
      </body>
    </html>
  );
}
