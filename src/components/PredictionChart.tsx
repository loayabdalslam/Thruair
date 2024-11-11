import React, { useState } from 'react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { StockPredictor } from '../services/prediction';

interface PredictionChartProps {
  historicalData: { date: string; close: number }[];
}

export const PredictionChart: React.FC<PredictionChartProps> = ({ historicalData }) => {
  const [predictions, setPredictions] = useState<number[]>([]);
  const [isTraining, setIsTraining] = useState(false);

  const handleTrain = async () => {
    setIsTraining(true);
    const predictor = new StockPredictor();
    const prices = historicalData.map(d => d.close);
    
    await predictor.train(prices);
    const forecast = predictor.predict(7); // Predict next 7 days
    setPredictions(forecast);
    setIsTraining(false);
  };

  const chartData = [
    ...historicalData.map(d => ({ date: d.date, actual: d.close })),
    ...predictions.map((value, index) => ({
      date: new Date(Date.now() + (index + 1) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      predicted: value
    }))
  ];

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Price Prediction</h3>
        <button
          onClick={handleTrain}
          disabled={isTraining}
          className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
        >
          {isTraining ? 'Training...' : 'Train Model'}
        </button>
      </div>
      
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="actual"
              stroke="#8884d8"
              name="Actual Price"
              strokeWidth={2}
            />
            {predictions.length > 0 && (
              <Line
                type="monotone"
                dataKey="predicted"
                stroke="#82ca9d"
                name="Predicted Price"
                strokeWidth={2}
                strokeDasharray="5 5"
              />
            )}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};