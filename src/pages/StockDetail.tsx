import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { format, subDays } from 'date-fns';
import { ArrowLeft, TrendingUp, TrendingDown } from 'lucide-react';
import { getZodiacSign } from '../services/zodiac';
import { getGeminiZodiacImpact } from '../services/gemini';
import { CandlestickChart } from '../components/CandlestickChart';
import { PredictionChart } from '../components/PredictionChart';
import { ZodiacImpactChart } from '../components/ZodiacImpactChart';
import { ZodiacImpactModal } from '../components/ZodiacImpactModal';
import { DateRangeSelector } from '../components/DateRangeSelector';
import { GeminiZodiacImpact } from '../services/gemini';

interface StockData {
  date: string;
  price: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

const DATE_RANGES = [
  { label: '1W', days: 7 },
  { label: '1M', days: 30 },
  { label: '3M', days: 90 },
  { label: '6M', days: 180 },
  { label: '1Y', days: 365 },
];

export const StockDetail: React.FC = () => {
  const { symbol } = useParams<{ symbol: string }>();
  const [historicalData, setHistoricalData] = useState<StockData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [startDate, setStartDate] = useState(format(subDays(new Date(), 30), 'yyyy-MM-dd'));
  const [endDate, setEndDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [zodiacImpact, setZodiacImpact] = useState<GeminiZodiacImpact | null>(null);
  const [showImpactModal, setShowImpactModal] = useState(false);

  const handleRangeSelect = (days: number) => {
    setStartDate(format(subDays(new Date(), days), 'yyyy-MM-dd'));
    setEndDate(format(new Date(), 'yyyy-MM-dd'));
  };

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

        const formattedData = data.map((item: any) => ({
          date: format(new Date(item.date), 'yyyy-MM-dd'),
          open: Number(item.open),
          high: Number(item.high),
          low: Number(item.low),
          close: Number(item.close),
          volume: Number(item.volume),
          price: Number(item.close)
        }));

        setHistoricalData(formattedData);

        const zodiacInfo = getZodiacSign(endDate);
        if (zodiacInfo) {
          const impact = await getGeminiZodiacImpact(zodiacInfo.sign, endDate);
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
  }, [symbol, startDate, endDate]);

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
  const zodiacInfo = getZodiacSign(endDate);

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
          <div className="flex flex-col gap-6">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{symbol}</h1>
                <div className={`flex items-center mt-2 ${priceChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {priceChange >= 0 ? <TrendingUp className="h-5 w-5 mr-2" /> : <TrendingDown className="h-5 w-5 mr-2" />}
                  <span className="text-lg font-semibold">
                    ${latestData?.close.toFixed(2)} ({priceChangePercent > 0 ? '+' : ''}{priceChangePercent.toFixed(2)}%)
                  </span>
                </div>
              </div>
            </div>

            <DateRangeSelector
              startDate={startDate}
              endDate={endDate}
              onStartDateChange={setStartDate}
              onEndDateChange={setEndDate}
              ranges={DATE_RANGES}
              onRangeSelect={handleRangeSelect}
            />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <h2 className="text-lg font-semibold mb-4">Price History</h2>
                <CandlestickChart data={historicalData} />
              </div>
              <div>
                <PredictionChart historicalData={historicalData} />
              </div>
            </div>
          </div>
        </div>

        {zodiacInfo && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <ZodiacImpactChart
              sign={zodiacInfo.sign}
              date={endDate}
              onShowDetails={(impact) => {
                setZodiacImpact(impact);
                setShowImpactModal(true);
              }}
            />
          </div>
        )}
      </div>

      {showImpactModal && zodiacImpact && (
        <ZodiacImpactModal
          impact={zodiacImpact}
          onClose={() => setShowImpactModal(false)}
        />
      )}
    </div>
  );
};