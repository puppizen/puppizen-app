import type { Metadata } from "next";
import { Madimi_One } from "next/font/google";
import "./globals.css";
import Script from "next/script";

import { TonProvider } from "./components/TonProvider";

const madimiOne = Madimi_One({
  subsets: ["latin"],
  weight: "400", // This font only has 400
  variable: "--font-madimi-one",
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
        className={`${madimiOne.variable} antialiased`}
      >
        <TonProvider>{children}</TonProvider>
      </body>
    </html>
  );
}
