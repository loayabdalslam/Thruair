export interface Stock {
  symbol: string;
  name: string;
  price: number;
  change: number;
  marketCap: string;
  prediction: 'bullish' | 'bearish' | 'neutral';
}

export interface StockDetail {
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface AstroEvent {
  date: string;
  event: string;
  impact: 'high' | 'medium' | 'low';
  description: string;
  affectedSectors: string[];
}

export interface AstroPosition {
  planet: string;
  sign: string;
  degree: number;
  house: number;
  aspect: string;
  influence: 'positive' | 'negative' | 'neutral';
}