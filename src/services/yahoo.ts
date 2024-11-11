import yahooFinance from 'yahoo-finance2';

export const getStockData = async (symbol: string, range = '30d') => {
  try {
    const result = await yahooFinance.historical(symbol, {
      period1: range === '30d' ? 
        new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) : 
        new Date(Date.now() - 365 * 24 * 60 * 60 * 1000),
      period2: new Date(),
      interval: '1d'
    });

    return result.map(item => ({
      date: item.date.toISOString().split('T')[0],
      open: item.open,
      high: item.high,
      low: item.low,
      close: item.close,
      volume: item.volume
    }));
  } catch (error) {
    console.error(`Error fetching data for ${symbol}:`, error);
    throw error;
  }
};

export const getFAANGData = async () => {
  const symbols = ['META', 'AAPL', 'AMZN', 'NFLX', 'GOOGL'];
  const results = [];

  for (const symbol of symbols) {
    try {
      const data = await getStockData(symbol, '1d');
      if (data.length > 0) {
        results.push({
          symbol,
          data: data[0]
        });
      }
    } catch (error) {
      console.error(`Error fetching data for ${symbol}:`, error);
    }
  }

  return results;
};