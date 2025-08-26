'use client';
import { TonConnectUIProvider } from '@tonconnect/ui-react';

const manifestUrl = 'https://puppizen.github.io/ton-connect-manifest/tonconnect-manifest.json'

export function TonProvider({ children }: { children: React.ReactNode }) {
  return (
    <TonConnectUIProvider manifestUrl={manifestUrl}
        actionsConfiguration={{
            twaReturnUrl: 'http://t.me/PuppizenBot/Earn. '
        }}
    >
      {children}
    </TonConnectUIProvider>
  );
}