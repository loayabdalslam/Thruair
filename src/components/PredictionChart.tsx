import React, { useState } from 'react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { Brain, Loader2 } from 'lucide-react';
import * as tf from '@tensorflow/tfjs';

interface PredictionChartProps {
  historicalData: { date: string; close: number }[];
}

export const PredictionChart: React.FC<PredictionChartProps> = ({ historicalData }) => {
  const [predictions, setPredictions] = useState<number[]>([]);
  const [isTraining, setIsTraining] = useState(false);
  const [progress, setProgress] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null);

  const createSequences = (data: number[], lookback: number = 7) => {
    const X = [];
    const y = [];
    
    for (let i = 0; i < data.length - lookback; i++) {
      X.push(data.slice(i, i + lookback));
      y.push(data[i + lookback]);
    }

    // Reshape X to [samples, timesteps, features]
    return [
      tf.tensor3d(X, [X.length, lookback, 1]),
      tf.tensor2d(y, [y.length, 1])
    ];
  };

  const normalize = (data: number[]) => {
    const min = Math.min(...data);
    const max = Math.max(...data);
    return {
      normalized: data.map(x => (x - min) / (max - min)),
      min,
      max
    };
  };

  const handleTrain = async () => {
    setIsTraining(true);
    setProgress(0);
    const startTime = Date.now();

    try {
      const prices = historicalData.map(d => d.close);
      const { normalized, min, max } = normalize(prices);
      const [X, y] = createSequences(normalized);

      const model = tf.sequential({
        layers: [
          tf.layers.lstm({
            units: 50,
            inputShape: [7, 1],
            returnSequences: true
          }),
          tf.layers.dropout({ rate: 0.2 }),
          tf.layers.lstm({
            units: 50,
            returnSequences: false
          }),
          tf.layers.dropout({ rate: 0.2 }),
          tf.layers.dense({ units: 1 })
        ]
      });

      model.compile({
        optimizer: tf.train.adam(0.001),
        loss: 'meanSquaredError'
      });

      await model.fit(X, y, {
        epochs: 100,
        batchSize: 32,
        validationSplit: 0.1,
        callbacks: {
          onEpochEnd: (epoch, logs) => {
            const currentProgress = ((epoch + 1) / 100) * 100;
            setProgress(currentProgress);
            
            const elapsed = Date.now() - startTime;
            const estimatedTotal = elapsed / currentProgress * 100;
            setTimeRemaining(Math.round((estimatedTotal - elapsed) / 1000));
          }
        }
      });

      // Prepare input for prediction
      const lastWeek = normalized.slice(-7);
      const inputTensor = tf.tensor3d([lastWeek], [1, 7, 1]); // Reshape to match LSTM input
      const predictionTensor = model.predict(inputTensor) as tf.Tensor;
      const predictionValue = await predictionTensor.data();
      
      // Denormalize predictions
      const futurePredictions = Array.from(predictionValue).map(
        p => p * (max - min) + min
      );

      setPredictions(futurePredictions);

      // Cleanup tensors
      X.dispose();
      y.dispose();
      inputTensor.dispose();
      predictionTensor.dispose();
      model.dispose();
    } catch (error) {
      console.error('Error training model:', error);
    } finally {
      setIsTraining(false);
      setTimeRemaining(null);
    }
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
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
        >
          {isTraining ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Training ({progress.toFixed(0)}%)
              {timeRemaining !== null && ` - ${timeRemaining}s remaining`}
            </>
          ) : (
            <>
              <Brain className="h-4 w-4" />
              Train Model
            </>
          )}
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
              dot={false}
            />
            {predictions.length > 0 && (
              <Line
                type="monotone"
                dataKey="predicted"
                stroke="#82ca9d"
                name="Predicted Price"
                strokeWidth={2}
                strokeDasharray="5 5"
                dot={true}
              />
            )}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};