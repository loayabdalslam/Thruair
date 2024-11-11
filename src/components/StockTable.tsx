import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { TrendingUp, TrendingDown, Star } from 'lucide-react';
import { getFAANGData, StockData } from '../services/yahoo';
import { getZodiacSign, loadZodiacScript } from '../services/zodiac';

interface StockEntry {
  symbol: string;
  data: StockData;
}

export const StockTable: React.FC = () => {
  const [stocks, setStocks] = useState<StockEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initializeData = async () => {
      try {
        await loadZodiacScript();
        const data = await getFAANGData();
        setStocks(data);
      } catch (err) {
        setError('Failed to load stock data');
        console.error('Error loading data:', err);
      } finally {
        setLoading(false);
      }
    };

    initializeData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-red-600 bg-red-50 rounded-lg">
        {error}
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full">
        <thead>
          <tr className="bg-gray-50 dark:bg-gray-700">
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Symbol</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Price</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Change</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Volume</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Zodiac</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
          {stocks.map((stock) => {
            const zodiacInfo = getZodiacSign(stock.data.date);
            const change = ((stock.data.close - stock.data.open) / stock.data.open) * 100;

            return (
              <tr key={stock.symbol} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200">
                <td className="px-6 py-4 whitespace-nowrap">
                  <Link to={`/stock/${stock.symbol}`} className="flex items-center text-gray-900 dark:text-white hover:text-indigo-600 dark:hover:text-indigo-400">
                    <Star className="h-4 w-4 text-yellow-400 mr-2" />
                    <span className="font-medium">{stock.symbol}</span>
                  </Link>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-700 dark:text-gray-300">
                  ${stock.data.close.toFixed(2)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className={`flex items-center ${change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {change >= 0 ? <TrendingUp className="h-4 w-4 mr-1" /> : <TrendingDown className="h-4 w-4 mr-1" />}
                    {change > 0 ? '+' : ''}{change.toFixed(2)}%
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-700 dark:text-gray-300">
                  {stock.data.volume.toLocaleString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {zodiacInfo && (
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-indigo-600 dark:text-indigo-400">
                        {zodiacInfo.sign}
                      </span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {zodiacInfo.element} • {zodiacInfo.quality}
                      </span>
                    </div>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};