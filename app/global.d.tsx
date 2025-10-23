// global.d.ts

type InvoiceClosedEvent = {
  status: 'paid' | 'cancelled';
  slug: string;
};

interface TelegramWebAppThemeParams {
  bg_color?: string;
  text_color?: string;
  hint_color?: string;
  link_color?: string;
  button_color?: string;
  button_text_color?: string;
}

interface TelegramWebAppBackButton {
  isVisible: boolean;
  show(): void;
  hide(): void;
  onClick(callback: () => void): void;
  offClick(callback?: () => void): void;
}

interface TelegramWebAppMainButton {
  text: string;
  color?: string;
  textColor?: string;
  isVisible: boolean;
  isActive: boolean;
  show(): void;
  hide(): void;
  enable(): void;
  disable(): void;
  setText(text: string): void;
  onClick(callback: () => void): void;
  offClick(callback?: () => void): void;
}

interface TelegramWebApp {
  initDataUnsafe: {
    user: {
      id: number;
      username: string;
      photo_url: string;
      is_bot: boolean;
    };
  };
  ready(): void;
  expand(): void;
  close(): void;
  themeParams: TelegramWebAppThemeParams;
  BackButton: TelegramWebAppBackButton;
  MainButton: TelegramWebAppMainButton;
  openInvoice(invoiceLink: string): void;
  onEvent(event: 'invoiceClosed', listener: (event: InvoiceClosedEvent) => Promise<void>): void;
  offEvent(event: 'invoiceClosed', listener: (event: InvoiceClosedEvent) => Promise<void>): void;
}

declare global {
  interface Window {
    Telegram: {
      WebApp: TelegramWebApp;
    };
    Adsgram: {
      init: (config: { blockId: string }) => {
        show: () => Promise<{
          done: boolean;
          error: boolean;
          state: string;
          description?: string;
        }>;
      };
    };
  }
}
  
  export {};