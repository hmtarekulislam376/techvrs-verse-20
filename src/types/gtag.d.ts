declare global {
  function gtag(command: 'config' | 'event', targetId: string, config?: any): void;
  interface Window {
    gtag: typeof gtag;
    dataLayer: any[];
  }
}

export {};