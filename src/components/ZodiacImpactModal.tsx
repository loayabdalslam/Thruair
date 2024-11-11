import React from 'react';
import { X } from 'lucide-react';
import { GeminiZodiacImpact } from '../services/gemini';

interface ZodiacImpactModalProps {
  impact: GeminiZodiacImpact;
  onClose: () => void;
}

export const ZodiacImpactModal: React.FC<ZodiacImpactModalProps> = ({ impact, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              {impact.sign} Trading Profile
            </h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Overview</h3>
              <p className="text-gray-700 dark:text-gray-300">{impact.description}</p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Trading Style</h3>
              <p className="text-gray-700 dark:text-gray-300">{impact.tradingStyle}</p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Market Timing</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-2">Favorable Periods</h4>
                  <ul className="list-disc list-inside text-gray-600 dark:text-gray-400">
                    {impact.favorablePeriods.map((period, index) => (
                      <li key={index}>{period}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-2">Unfavorable Periods</h4>
                  <ul className="list-disc list-inside text-gray-600 dark:text-gray-400">
                    {impact.unfavorablePeriods.map((period, index) => (
                      <li key={index}>{period}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Sector Influence</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {Object.entries(impact.stockInfluence).map(([sector, value]) => (
                  <div key={sector} className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {sector.charAt(0).toUpperCase() + sector.slice(1)}
                    </div>
                    <div className="text-lg font-semibold text-gray-900 dark:text-white">
                      {(value * 100).toFixed(0)}%
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};