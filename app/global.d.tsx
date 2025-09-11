// global.d.ts

type InvoiceClosedEvent = {
  status: 'paid' | 'cancelled';
  slug: string;
};


declare global {
    interface Window {
      Telegram: {
        WebApp: {
          initDataUnsafe: {
            user: {
              id: number;
              username: string;
              photo_url: string;
              is_bot: boolean;
            };
          };
          ready: () => void;

          openInvoice: (invoiceLink: string) => void;

          onEvent(event: 'invoiceClosed', listener: (event: InvoiceClosedEvent) => Promise<void>): void;
          offEvent(event: 'invoiceClosed', listener: (event: InvoiceClosedEvent) => Promise<void>): void;
        };
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