import React from 'react';
import { Stock } from '../types';
import { TrendingUp, TrendingDown, Star } from 'lucide-react';
import { Link } from 'react-router-dom';

interface StockTableProps {
  stocks: Stock[];
}

export const StockTable: React.FC<StockTableProps> = ({ stocks }) => {
  return (
    <div className="overflow-x-auto bg-white dark:bg-gray-800 rounded-lg shadow-lg">
      <table className="min-w-full">
        <thead>
          <tr className="bg-gray-50 dark:bg-gray-700">
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Symbol</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Name</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Price</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Change</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Market Cap</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Prediction</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
          {stocks.map((stock) => (
            <tr key={stock.symbol} className="hover:bg-gray-50 dark:hover:bg-gray-700">
              <td className="px-6 py-4 whitespace-nowrap">
                <Link to={`/stock/${stock.symbol}`} className="flex items-center hover:text-indigo-600">
                  <Star className="h-4 w-4 text-yellow-400 mr-2" />
                  <span className="font-medium text-gray-900 dark:text-white">{stock.symbol}</span>
                </Link>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-gray-700 dark:text-gray-300">{stock.name}</td>
              <td className="px-6 py-4 whitespace-nowrap text-gray-700 dark:text-gray-300">${stock.price.toFixed(2)}</td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className={`flex items-center ${stock.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {stock.change >= 0 ? <TrendingUp className="h-4 w-4 mr-1" /> : <TrendingDown className="h-4 w-4 mr-1" />}
                  {stock.change > 0 ? '+' : ''}{stock.change}%
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-gray-700 dark:text-gray-300">{stock.marketCap}</td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                  ${stock.prediction === 'bullish' ? 'bg-green-100 text-green-800' : 
                    stock.prediction === 'bearish' ? 'bg-red-100 text-red-800' : 
                    'bg-yellow-100 text-yellow-800'}`}>
                  {stock.prediction.charAt(0).toUpperCase() + stock.prediction.slice(1)}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};