import express from 'express';
import cors from 'cors';
import axios from 'axios';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import * as yahooFinancex from 'yahoo-finance2';
import yahooFinance from 'yahoo-finance2';

const app = express();
const PORT = 6661;
const RAPIDAPI_KEY = 'ac88abcf6fmshd650fdd877ac37ap18fc2fjsnabe68a7b145d';

// Fix for __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const NEWS_DB_PATH = path.resolve(__dirname, 'newsData.json'); // Path to JSON file for storing news data

app.use(cors());
app.use(express.json());

const TOP_SYMBOLS = [
  'AAPL', 'MSFT', 'GOOGL', 'AMZN', 'META',
  'NVDA', 'TSLA', 'JPM', 'V', 'WMT',
  'PG', 'MA', 'UNH', 'XOM', 'JNJ',
  'BAC', 'HD', 'CVX', 'PFE', 'KO'
];

// Function to read JSON database
const readNewsData = () => {
  if (fs.existsSync(NEWS_DB_PATH)) {
    const data = fs.readFileSync(NEWS_DB_PATH, 'utf8');
    return JSON.parse(data);
  }
  return {};
};

// Function to write data to JSON database
const writeNewsData = (data) => {
  fs.writeFileSync(NEWS_DB_PATH, JSON.stringify(data, null, 2), 'utf8');
};

// Endpoint to fetch stock data for top symbols using yahoo-finance2
app.get('/api/stocks', async (req, res) => {
  try {
    const stockData = await Promise.all(
      TOP_SYMBOLS.map(symbol => yahooFinancex.default.quote(symbol))
    );
    res.json(stockData);
  } catch (error) {
    console.error('Error fetching stock data:', error);
    res.status(500).json({ error: 'Failed to fetch stock data' });
  }
});

// Endpoint to fetch historical data for a specific stock symbol
app.get('/api/stock/:symbol/history', async (req, res) => {
  const { symbol } = req.params;

  try {
    const history = await yahooFinance.historical(symbol, {
      period1: '2023-11-01',
      period2: '2024-12-01',
      interval: '1d',
    });
    res.json(history);
  } catch (error) {
    console.error('Error fetching historical data:', error);
    res.status(500).json({ error: 'Failed to fetch historical data' });
  }
});

// Endpoint to fetch news for specified stock symbols
app.get('/api/stock/:symbols/news', async (req, res) => {
  try {
    const {symbols} = req.query.tickers || 'AAPL,TSLA';
    const today = new Date().toISOString().split('T')[0];
    const newsData = readNewsData();

    if (newsData[today] && newsData[today][symbols]) {
      console.log('Serving news from the local JSON database');
      return res.json(newsData[today][symbols]);
    }

    const response = await axios.get('https://yahoo-finance15.p.rapidapi.com/api/v1/markets/news', {
      params: { tickers: symbols },
      headers: {
        'x-rapidapi-host': 'yahoo-finance15.p.rapidapi.com',
        'x-rapidapi-key': RAPIDAPI_KEY,
      }
    });

    const newsResult = response.data;

    if (!newsData[today]) {
      newsData[today] = {};
    }
    newsData[today][symbols] = newsResult;
    writeNewsData(newsData);

    res.json(newsResult);

  } catch (error) {
    console.error('Error fetching news:', error);
    res.status(500).json({ error: 'Failed to fetch news' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
