// global.d.ts

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

          openInvoice: (params: {
            slug: string;
            amount: number;
            currency: 'stars';
            description: string;
          }) => void;
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