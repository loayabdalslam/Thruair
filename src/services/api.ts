import { StockData } from '../types';

const API_BASE_URL = 'http://localhost:6661';

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  
  const contentType = response.headers.get('content-type');
  if (!contentType || !contentType.includes('application/json')) {
    throw new Error('Invalid response format: Expected JSON');
  }

  try {
    return await response.json();
  } catch (error) {
    throw new Error('Failed to parse JSON response');
  }
}

export async function fetchStocks(): Promise<StockData[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/stocks`);
    const data = await handleResponse<any[]>(response);
    
    return data.map(quote => ({
      symbol: quote.symbol,
      price: quote.regularMarketPrice,
      change: quote.regularMarketChange,
      changePercent: quote.regularMarketChangePercent,
      marketCap: quote.marketCap,
      volume: quote.regularMarketVolume,
    }));
  } catch (error) {
    console.error('Error fetching stocks:', error);
    throw error;
  }
}

export async function fetchStockHistory(symbol: string): Promise<StockData[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/stock/${symbol}/history`);
    const data = await handleResponse<any[]>(response);
    
    return data.map(item => ({
      date: item.date,
      open: Number(item.open),
      high: Number(item.high),
      low: Number(item.low),
      close: Number(item.close),
      volume: Number(item.volume),
      price: Number(item.close)
    }));
  } catch (error) {
    console.error(`Error fetching history for ${symbol}:`, error);
    throw error;
  }
}