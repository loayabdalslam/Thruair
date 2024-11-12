import express from 'express';
import cors from 'cors';
import * as yahooFinance from 'yahoo-finance2'; // Import all methods from yahoo-finance2
import yahooFinancex from 'yahoo-finance2'; // Import all methods from yahoo-finance2

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

const TOP_SYMBOLS = [
  'AAPL', 'MSFT', 'GOOGL', 'AMZN', 'META',
  'NVDA', 'TSLA', 'JPM', 'V', 'WMT',
  'PG', 'MA', 'UNH', 'XOM', 'JNJ',
  'BAC', 'HD', 'CVX', 'PFE', 'KO'
];

// Endpoint to fetch stock data for top symbols using yahoo-finance2
app.get('/api/stocks', async (req, res) => {
  try {
    const stockData = await Promise.all(
      TOP_SYMBOLS.map(symbol => yahooFinance.default.quote(symbol)) // Use yahooFinance to get stock data
    );

    res.json(stockData);
  } catch (error) {
    console.error('Error fetching stock data:', error);
    res.status(500).json({ error: 'Failed to fetch stock data' });
  }
});

// Endpoint to fetch historical data for a specific stock symbol using yahoo-finance2
app.get('/api/stock/:symbol/history', async (req, res) => {
  const { symbol } = req.params;

  try {
    const history = await yahooFinancex.historical(symbol, {
      period1: '2023-11-01', // Set the start date for historical data (e.g., 30 days ago)
      period2: '2024-12-01', // Set the end date for historical data
      interval: '1d', // Interval of data points (1 day in this case)
    });

    res.json(history);
  } catch (error) {
    console.error('Error fetching historical data:', error);
    res.status(500).json({ error: 'Failed to fetch historical data' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
