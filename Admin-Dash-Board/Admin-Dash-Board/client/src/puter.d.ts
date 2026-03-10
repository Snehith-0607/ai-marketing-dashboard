declare global {
  interface Window {
    puter: {
      ai: {
        chat: (
          prompt: string,
          options?: {
            model?: string;
            temperature?: number;
            max_tokens?: number;
            stream?: boolean;
          }
        ) => Promise<string>;
      };
    };
  }

  // Optional global shortcut if you want to use `puter` directly
  // (TypeScript will treat this as the same shape as window.puter)
  const puter: Window["puter"];
}

export {};

