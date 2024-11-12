import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { format } from 'date-fns';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { ArrowLeft, Calendar, TrendingUp, TrendingDown, Moon } from 'lucide-react';
import { getZodiacSign } from '../services/zodiac';
import { getGeminiZodiacImpact } from '../services/gemini';

interface StockData {
  date: string;
  price: number;
  open: number;
  high: number;
  low: number;
  close: number;
}

export const StockDetail: React.FC = () => {
  const { symbol } = useParams<{ symbol: string }>();
  const [historicalData, setHistoricalData] = useState<StockData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [zodiacImpact, setZodiacImpact] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!symbol) return;

      try {
        setLoading(true);
        const response = await fetch(`http://localhost:5000/api/stock/${symbol}/history`);
        const data = await response.json();

        if (data.error) {
          throw new Error(data.error);
        }

        const timestamps = data.timestamp;
        const quotes = data.indicators.quote[0];

        const formattedData = timestamps.map((time: number, index: number) => ({
          date: format(new Date(time * 1000), 'yyyy-MM-dd'),
          open: quotes.open[index],
          high: quotes.high[index],
          low: quotes.low[index],
          close: quotes.close[index],
          price: quotes.close[index]
        }));

        setHistoricalData(formattedData);

        // Fetch zodiac impact
        const zodiacInfo = getZodiacSign(selectedDate);
        if (zodiacInfo) {
          const impact = await getGeminiZodiacImpact(zodiacInfo.sign, selectedDate);
          setZodiacImpact(impact);
        }
      } catch (err) {
        console.error('Error fetching data:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [symbol, selectedDate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-6">
        <div className="max-w-7xl mx-auto flex items-center justify-center min-h-[50vh]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <p className="text-red-600 dark:text-red-400">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  const latestData = historicalData[historicalData.length - 1];
  const priceChange = latestData ? latestData.close - latestData.open : 0;
  const priceChangePercent = latestData ? (priceChange / latestData.open) * 100 : 0;
  const zodiacInfo = getZodiacSign(selectedDate);

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <Link to="/" className="flex items-center text-indigo-600 hover:text-indigo-700">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Link>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{symbol}</h1>
              <div className={`flex items-center mt-2 ${priceChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {priceChange >= 0 ? <TrendingUp className="h-5 w-5 mr-2" /> : <TrendingDown className="h-5 w-5 mr-2" />}
                <span className="text-lg font-semibold">
                  ${latestData?.close.toFixed(2)} ({priceChangePercent > 0 ? '+' : ''}{priceChangePercent.toFixed(2)}%)
                </span>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Calendar className="h-5 w-5 text-gray-500" />
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              />
            </div>
          </div>

          <div className="h-[400px] mb-6">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={historicalData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis domain={['auto', 'auto']} />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="close" stroke="#6366f1" name="Price" />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {zodiacInfo && zodiacImpact && (
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
              <div className="flex items-center mb-4">
                <Moon className="h-6 w-6 text-indigo-600 mr-2" />
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  {zodiacInfo.sign} Influence
                </h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Trading Style</h3>
                  <p className="text-gray-600 dark:text-gray-300">{zodiacImpact.tradingStyle}</p>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Market Outlook</h3>
                  <p className="text-gray-600 dark:text-gray-300">{zodiacImpact.description}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};