import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { TrendingUp, TrendingDown, Star, RefreshCw } from 'lucide-react';
import { getZodiacSign } from '../services/zodiac';
import { fetchStocks } from '../services/api';
import { StockData } from '../types';

export const StockTable: React.FC = () => {
  const [stocks, setStocks] = useState<StockData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  const fetchStockData = async () => {
    try {
      setLoading(true);
      const stocksData = await fetchStocks();
      setStocks(stocksData);
      setLastUpdate(new Date());
      setError(null);
    } catch (err) {
      console.error('Error fetching stock data:', err);
      setError(err instanceof Error ? err.message : 'Failed to load stock data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStockData();
    const interval = setInterval(fetchStockData, 30000);
    return () => clearInterval(interval);
  }, []);

  const zodiacInfo = getZodiacSign(new Date().toISOString().split('T')[0]);
  const zodiacMood = zodiacInfo?.quality?.toLowerCase() || 'neutral';

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center space-x-2">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Top Market Movers</h2>
          <span className="text-sm text-gray-500">
            Last update: {lastUpdate.toLocaleTimeString()}
          </span>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Star className={`h-5 w-5 ${
              zodiacMood === 'positive' ? 'text-green-500' :
              zodiacMood === 'negative' ? 'text-red-500' :
              'text-yellow-500'
            }`} />
            <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
              {zodiacInfo?.sign} Mood
            </span>
          </div>
          <button
            onClick={fetchStockData}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <RefreshCw className="h-5 w-5 text-gray-600 dark:text-gray-300" />
          </button>
        </div>
      </div>

      {error && (
        <div className="p-4 mb-4 text-amber-700 bg-amber-50 rounded-lg">
          {error}
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr className="bg-gray-50 dark:bg-gray-700">
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Symbol</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Price</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Change</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Market Cap</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Volume</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Zodiac Impact</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
            {stocks.map((stock) => {
              const zodiacImpact = Math.random() > 0.5 ? 'positive' : 'negative';

              return (
                <tr key={stock.symbol} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Link to={`/stock/${stock.symbol}`} className="flex items-center text-gray-900 dark:text-white hover:text-indigo-600 dark:hover:text-indigo-400">
                      <Star className="h-4 w-4 text-yellow-400 mr-2" />
                      <span className="font-medium">{stock.symbol}</span>
                    </Link>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-700 dark:text-gray-300">
                    ${stock.price.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className={`flex items-center ${stock.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {stock.change >= 0 ? <TrendingUp className="h-4 w-4 mr-1" /> : <TrendingDown className="h-4 w-4 mr-1" />}
                      {stock.change > 0 ? '+' : ''}{stock.changePercent.toFixed(2)}%
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-700 dark:text-gray-300">
                    ${(stock.marketCap / 1e9).toFixed(2)}B
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-700 dark:text-gray-300">
                    {stock.volume.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      zodiacImpact === 'positive' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {zodiacImpact.charAt(0).toUpperCase() + zodiacImpact.slice(1)}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};