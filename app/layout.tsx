import type { Metadata } from "next";
import { Righteous } from "next/font/google";
import "./globals.css";
import Script from "next/script";

import { TonProvider } from "./components/TonProvider";

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
