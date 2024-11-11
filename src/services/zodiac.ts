declare global {
  interface Window {
    ZodiacSign: any;
  }
}

export const getZodiacSign = (date: string) => {
  if (typeof window !== 'undefined' && window.ZodiacSign) {
    const zodiac = new window.ZodiacSign(date);
    return {
      sign: zodiac.sign,
      chinese: zodiac.chinese
    };
  }
  return null;
};

export const loadZodiacScript = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/gh/besrourms/zodiacsigns@latest/index.min.js';
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject();
    document.head.appendChild(script);
  });
};