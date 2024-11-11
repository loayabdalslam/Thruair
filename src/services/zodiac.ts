declare global {
  interface Window {
    ZodiacSign: any;
  }
}

export interface ZodiacInfo {
  sign: string;
  chinese: string;
  element: string;
  quality: string;
}

export const getZodiacSign = (date: string): ZodiacInfo | null => {
  if (typeof window !== 'undefined' && window.ZodiacSign) {
    try {
      const zodiac = new window.ZodiacSign(date);
      return {
        sign: zodiac.sign,
        chinese: zodiac.chinese,
        element: zodiac.element,
        quality: zodiac.quality
      };
    } catch (error) {
      console.error('Error getting zodiac sign:', error);
      return null;
    }
  }
  return null;
};

export const loadZodiacScript = (): Promise<void> => {
  if (document.querySelector('script[src*="zodiacsigns"]')) {
    return Promise.resolve();
  }

  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/gh/besrourms/zodiacsigns@latest/index.min.js';
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Failed to load zodiac script'));
    document.head.appendChild(script);
  });
};