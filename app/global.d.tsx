// global.d.ts

declare global {
    interface Window {
      Telegram: {
        WebApp: {
          onEvent(arg0: string, listener: (status: string) => Promise<void>): unknown;
          offEvent(arg0: string, listener: (status: string) => Promise<void>): unknown;
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