import type { Metadata } from "next";
import { Righteous } from "next/font/google";
import "./globals.css";
import Script from "next/script";

import { TonProvider } from "./components/TonProvider";
import TelegramInit from "./components/TelegramInit";
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
        <TonProvider>
          <TelegramInit />
          {children}
          
        </TonProvider>
      </body>
    </html>
  );
}
