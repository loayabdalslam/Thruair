import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { format } from 'date-fns';
import { CandlestickChart } from '../components/CandlestickChart';
import { ZodiacImpactChart } from '../components/ZodiacImpactChart';
import { ZodiacImpactModal } from '../components/ZodiacImpactModal';
import { getStockData } from '../services/alphaVantage';
import { getZodiacSign } from '../services/zodiac';
import { ArrowLeft, Calendar } from 'lucide-react';
import { GeminiZodiacImpact } from '../services/gemini';

export const StockDetail: React.FC = () => {
  const { symbol } = useParams<{ symbol: string }>();
  const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [stockDetails, setStockDetails] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImpact, setSelectedImpact] = useState<GeminiZodiacImpact | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (symbol) {
        try {
          setLoading(true);
          setError(null);
          const data = await getStockData(symbol);
          if (data.length === 0) {
            throw new Error('No data available for this stock');
          }
          setStockDetails(data);
        } catch (error) {
          console.error('Error fetching stock details:', error);
          setError(error instanceof Error ? error.message : 'Failed to fetch stock data');
        } finally {
          setLoading(false);
        }
      }
    };

    fetchData();
  }, [symbol]);

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
          <div className="mb-6">
            <Link to="/" className="flex items-center text-indigo-600 hover:text-indigo-700">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Link>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <p className="text-red-600 dark:text-red-400">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!stockDetails.length) {
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-6">
            <Link to="/" className="flex items-center text-indigo-600 hover:text-indigo-700">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Link>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <p className="text-gray-600 dark:text-gray-400">No data available for this stock</p>
          </div>
        </div>
      </div>
    );
  }

  const latestData = stockDetails[0];
  const zodiacInfo = getZodiacSign(selectedDate);

  const metrics = [
    { label: 'Open', value: `$${latestData.open.toFixed(2)}` },
    { label: 'High', value: `$${latestData.high.toFixed(2)}` },
    { label: 'Low', value: `$${latestData.low.toFixed(2)}` },
    { label: 'Close', value: `$${latestData.close.toFixed(2)}` },
    { label: 'Volume', value: latestData.volume.toLocaleString() },
    { label: 'Zodiac Sign', value: zodiacInfo?.sign || 'N/A' }
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
              {symbol}
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

        {zodiacInfo && (
          <>
            <ZodiacImpactChart
              sign={zodiacInfo.sign}
              date={selectedDate}
              onShowDetails={(impact) => setSelectedImpact(impact)}
            />
            {selectedImpact && (
              <ZodiacImpactModal
                impact={selectedImpact}
                onClose={() => setSelectedImpact(null)}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
};