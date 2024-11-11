import { StockData } from './yahoo';
import { format, subDays } from 'date-fns';

const generateMockPrice = (basePrice: number) => {
  const variation = basePrice * 0.02; // 2% variation
  return Number((basePrice + (Math.random() * variation * 2 - variation)).toFixed(2));
};

const generateMockData = (symbol: string): StockData => {
  const basePrices: Record<string, number> = {
    'AAPL': 175.50,
    'GOOGL': 147.68,
    'META': 505.95,
    'AMZN': 178.35,
    'NFLX': 628.80
  };

  const basePrice = basePrices[symbol] || 100;
  const open = generateMockPrice(basePrice);
  const close = generateMockPrice(basePrice);
  const high = Math.max(open, close) + generateMockPrice(basePrice * 0.01);
  const low = Math.min(open, close) - generateMockPrice(basePrice * 0.01);

  return {
    date: format(new Date(), 'yyyy-MM-dd'),
    open,
    high,
    low,
    close,
    volume: Math.floor(1000000 + Math.random() * 9000000)
  };
};

export const getMockStockData = (symbol: string): StockData[] => {
  const today = new Date();
  return Array.from({ length: 30 }, (_, i) => ({
    ...generateMockData(symbol),
    date: format(subDays(today, i), 'yyyy-MM-dd')
  }));
};

export const getMockFAANGData = () => {
  const symbols = ['META', 'AAPL', 'AMZN', 'NFLX', 'GOOGL'];
  return symbols.map(symbol => ({
    symbol,
    data: getMockStockData(symbol)[0]
  }));
};