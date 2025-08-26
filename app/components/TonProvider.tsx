'use client';
import { TonConnectUIProvider } from '@tonconnect/ui-react';

const manifestUrl = 'https://kingofoc.github.io/ton-connect-manifest/tonconnect-manifest.json'

export function TonProvider({ children }: { children: React.ReactNode }) {
  return (
    <TonConnectUIProvider manifestUrl={manifestUrl}
        actionsConfiguration={{
            twaReturnUrl: 'http://t.me/puppizen_bot/earn'
        }}
    >
      {children}
    </TonConnectUIProvider>
  );
}