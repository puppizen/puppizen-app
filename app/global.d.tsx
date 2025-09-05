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
        };
      };
      Adsgram: {
        init: (config: { blockId: string }) => {
          show: () => Promise<{
            done: boolean;
            error: boolean;
            state: 'load' | 'render' | 'playing' | 'destroy';
            description?: string;
          }>;
        };
      };
    }
  }
  
  export {};