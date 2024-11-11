import React, { useEffect, useState } from 'react';
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
  Tooltip
} from 'recharts';
import { GeminiZodiacImpact } from '../services/gemini';
import { getGeminiZodiacImpact } from '../services/gemini';

interface ZodiacImpactChartProps {
  sign: string;
  date: string;
  onShowDetails: (impact: GeminiZodiacImpact) => void;
}

export const ZodiacImpactChart: React.FC<ZodiacImpactChartProps> = ({ sign, date, onShowDetails }) => {
  const [impact, setImpact] = useState<GeminiZodiacImpact | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchImpact = async () => {
      try {
        const data = await getGeminiZodiacImpact(sign, date);
        setImpact(data);
      } catch (error) {
        console.error('Error fetching zodiac impact:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchImpact();
  }, [sign, date]);

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <div className="flex items-center justify-center h-[300px]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
        </div>
      </div>
    );
  }

  if (!impact) return null;

  const stockData = Object.entries(impact.stockInfluence).map(([key, value]) => ({
    subject: key.charAt(0).toUpperCase() + key.slice(1),
    value: value * 100
  }));

  const characteristicsData = Object.entries(impact.characteristics).map(([key, value]) => ({
    subject: key
      .split(/(?=[A-Z])/)
      .join(' ')
      .charAt(0)
      .toUpperCase() + 
      key
        .split(/(?=[A-Z])/)
        .join(' ')
        .slice(1),
    value: value * 100
  }));

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{sign} Impact Analysis</h3>
        <button
          onClick={() => onShowDetails(impact)}
          className="text-indigo-600 hover:text-indigo-700 text-sm font-medium"
        >
          View Details
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="h-[300px]">
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Sector Influence</h4>
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart data={stockData}>
              <PolarGrid />
              <PolarAngleAxis dataKey="subject" />
              <PolarRadiusAxis angle={30} domain={[0, 100]} />
              <Radar
                name="Impact"
                dataKey="value"
                stroke="#6366f1"
                fill="#6366f1"
                fillOpacity={0.5}
              />
              <Tooltip />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        <div className="h-[300px]">
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Trading Characteristics</h4>
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart data={characteristicsData}>
              <PolarGrid />
              <PolarAngleAxis dataKey="subject" />
              <PolarRadiusAxis angle={30} domain={[0, 100]} />
              <Radar
                name="Impact"
                dataKey="value"
                stroke="#8b5cf6"
                fill="#8b5cf6"
                fillOpacity={0.5}
              />
              <Tooltip />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};