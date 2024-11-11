import axios from 'axios';

const API_KEY = 'UEPP207IBHWRVEA6';
const BASE_URL = 'https://www.alphavantage.co/query';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const getStockData = async (symbol: string) => {
  try {
    const response = await axios.get(BASE_URL, {
      params: {
        function: 'TIME_SERIES_DAILY',
        symbol,
        apikey: API_KEY,
        outputsize: 'compact'
      }
    });

    if (response.data['Error Message']) {
      throw new Error(response.data['Error Message']);
    }

    if (!response.data['Time Series (Daily)']) {
      throw new Error('No data available for this stock');
    }

    const timeSeries = response.data['Time Series (Daily)'];
    return Object.entries(timeSeries).map(([date, values]: [string, any]) => ({
      date,
      open: parseFloat(values['1. open']),
      high: parseFloat(values['2. high']),
      low: parseFloat(values['3. low']),
      close: parseFloat(values['4. close']),
      volume: parseInt(values['5. volume'])
    }));
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 429) {
        throw new Error('API rate limit exceeded. Please try again later.');
      }
    }
    throw error;
  }
};

export const getFAANGData = async () => {
  const symbols = ['META', 'AAPL', 'AMZN', 'NFLX', 'GOOGL'];
  const results = [];

  for (const symbol of symbols) {
    try {
      const data = await getStockData(symbol);
      if (data.length > 0) {
        results.push({
          symbol,
          data: data[0] // Get the latest data point
        });
      }
      // Add a small delay between requests to avoid rate limiting
      await delay(1000);
    } catch (error) {
      console.error(`Error fetching data for ${symbol}:`, error);
    }
  }

  return results;
};