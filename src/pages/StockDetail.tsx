import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { format } from 'date-fns';
import { CandlestickChart } from '../components/CandlestickChart';
import { AstroPositionsTable } from '../components/AstroPositionsTable';
import { getStockDetails, getAstroPositions, stockData } from '../data/mockData';
import { ArrowLeft, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';

export const StockDetail: React.FC = () => {
  const { symbol } = useParams<{ symbol: string }>();
  const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  
  const stock = stockData.find(s => s.symbol === symbol);
  const stockDetails = getStockDetails(symbol || '');
  const astroPositions = getAstroPositions(selectedDate);

  if (!stock) return <div>Stock not found</div>;

  const metrics = [
    { label: 'Open', value: `$${stockDetails[0].open.toFixed(2)}` },
    { label: 'High', value: `$${stockDetails[0].high.toFixed(2)}` },
    { label: 'Low', value: `$${stockDetails[0].low.toFixed(2)}` },
    { label: 'Close', value: `$${stockDetails[0].close.toFixed(2)}` },
    { label: 'Volume', value: stockDetails[0].volume.toLocaleString() },
    { label: 'Market Cap', value: stock.marketCap },
  ];

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
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              {stock.name} ({stock.symbol})
            </h1>
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

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
            {metrics.map((metric, index) => (
              <div key={index} className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                <div className="text-sm text-gray-500 dark:text-gray-400">{metric.label}</div>
                <div className="text-lg font-semibold text-gray-900 dark:text-white">{metric.value}</div>
              </div>
            ))}
          </div>

          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Price History</h2>
            <CandlestickChart data={stockDetails} />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Astrological Positions</h2>
          <AstroPositionsTable positions={astroPositions} />
        </div>
      </div>
    </div>
  );
};