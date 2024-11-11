import axios from 'axios';
import { format, subDays } from 'date-fns';
import { getMockStockData, getMockFAANGData } from './mockData';

export interface StockData {
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

const PROXY_URL = 'https://query1.finance.yahoo.com/v8/finance/chart';

const createErrorMessage = (symbol: string, error: unknown): string => {
  if (axios.isAxiosError(error)) {
    return `Failed to fetch data for ${symbol}: ${error.message}`;
  }
  return `Unknown error fetching data for ${symbol}`;
};

export const getStockData = async (symbol: string, range = '30d'): Promise<StockData[]> => {
  const endDate = new Date();
  const startDate = range === '30d' ? subDays(endDate, 30) : subDays(endDate, 365);

  try {
    const response = await axios.get(`${PROXY_URL}/${symbol}`, {
      params: {
        period1: Math.floor(startDate.getTime() / 1000),
        period2: Math.floor(endDate.getTime() / 1000),
        interval: '1d',
        includePrePost: false,
        events: 'div,split'
      }
    });

    const result = response.data.chart.result[0];
    if (!result?.timestamp || !result?.indicators?.quote?.[0]) {
      console.warn(`Using mock data for ${symbol} due to invalid API response`);
      return getMockStockData(symbol);
    }

    const { timestamp, indicators: { quote: [quotes] } } = result;

    return timestamp.map((time: number, index: number) => ({
      date: format(new Date(time * 1000), 'yyyy-MM-dd'),
      open: Number(quotes.open[index]) || 0,
      high: Number(quotes.high[index]) || 0,
      low: Number(quotes.low[index]) || 0,
      close: Number(quotes.close[index]) || 0,
      volume: Number(quotes.volume[index]) || 0
    }));
  } catch (error) {
    console.warn(createErrorMessage(symbol, error));
    return getMockStockData(symbol);
  }
};

export const getFAANGData = async () => {
  try {
    const symbols = ['META', 'AAPL', 'AMZN', 'NFLX', 'GOOGL'];
    const results = await Promise.all(
      symbols.map(async (symbol) => {
        try {
          const data = await getStockData(symbol, '1d');
          return data.length > 0 ? { symbol, data: data[0] } : null;
        } catch {
          return null;
        }
      })
    );

    const validResults = results.filter((result): result is { symbol: string; data: StockData } => 
      result !== null
    );

    if (validResults.length === 0) {
      console.warn('Using mock data for all stocks due to API failures');
      return getMockFAANGData();
    }

    return validResults;
  } catch (error) {
    console.warn('Falling back to mock data due to API error:', error);
    return getMockFAANGData();
  }
};