import React, { useState } from 'react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { Brain, Loader2 } from 'lucide-react';
import * as tf from '@tensorflow/tfjs';

interface MLSettings {
  epochs: number;
  trainingDays: number;
  predictionDays: number;
  lookbackWindow: number;
}

interface PredictionChartProps {
  historicalData: { date: string; close: number }[];
  mlSettings: MLSettings;
}

export const PredictionChart: React.FC<PredictionChartProps> = ({ historicalData, mlSettings }) => {
  const [predictions, setPredictions] = useState<number[]>([]);
  const [isTraining, setIsTraining] = useState(false);
  const [progress, setProgress] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null);

  const createSequences = (data: number[], lookback: number) => {
    const X: number[][][] = [];
    const y: number[] = [];
    
    for (let i = 0; i < data.length - lookback; i++) {
      const sequence: number[][] = [];
      for (let j = 0; j < lookback; j++) {
        sequence.push([data[i + j]]);
      }
      X.push(sequence);
      y.push(data[i + lookback]);
    }

    return [
      tf.tensor3d(X),
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
      // Use only the specified training days
      const trainingData = historicalData.slice(-mlSettings.trainingDays);
      const prices = trainingData.map(d => d.close);
      const { normalized, min, max } = normalize(prices);
      const [X, y] = createSequences(normalized, mlSettings.lookbackWindow);

      const model = tf.sequential({
        layers: [
          tf.layers.lstm({
            units: 50,
            inputShape: [mlSettings.lookbackWindow, 1],
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
        epochs: mlSettings.epochs,
        batchSize: 32,
        validationSplit: 0.1,
        callbacks: {
          onEpochEnd: (epoch, logs) => {
            const currentProgress = ((epoch + 1) / mlSettings.epochs) * 100;
            setProgress(currentProgress);
            
            const elapsed = Date.now() - startTime;
            const estimatedTotal = elapsed / currentProgress * 100;
            setTimeRemaining(Math.round((estimatedTotal - elapsed) / 1000));
          }
        }
      });

      // Generate predictions for the specified number of days
      const predictions: number[] = [];
      let lastSequence = normalized.slice(-mlSettings.lookbackWindow);

      for (let i = 0; i < mlSettings.predictionDays; i++) {
        const sequence: number[][] = [];
        for (let j = 0; j < mlSettings.lookbackWindow; j++) {
          sequence.push([lastSequence[j]]);
        }
        
        const inputTensor = tf.tensor3d([sequence]);
        const predictionTensor = model.predict(inputTensor) as tf.Tensor;
        const predictionValue = await predictionTensor.data();
        
        // Denormalize and store prediction
        const denormalizedPrediction = predictionValue[0] * (max - min) + min;
        predictions.push(denormalizedPrediction);
        
        // Update sequence for next prediction
        lastSequence = [...lastSequence.slice(1), predictionValue[0]];
        
        // Cleanup tensors
        inputTensor.dispose();
        predictionTensor.dispose();
      }

      setPredictions(predictions);

      // Cleanup tensors
      X.dispose();
      y.dispose();
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
      date: new Date(Date.parse(historicalData[historicalData.length - 1].date) + (index + 1) * 24 * 60 * 60 * 1000)
        .toISOString()
        .split('T')[0],
      predicted: value
    }))
  ];

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="space-y-1">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Price Prediction</h3>
          <p className="text-sm text-gray-500">
            Training on {mlSettings.trainingDays} days, predicting {mlSettings.predictionDays} days ahead
          </p>
        </div>
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
          <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip 
              formatter={(value: number) => [`$${value.toFixed(2)}`, '']}
              labelFormatter={(label) => `Date: ${label}`}
            />
            <Legend 
              verticalAlign="top" 
              height={36}
              formatter={(value) => {
                return value === 'actual' ? 'Historical Price' : 'Predicted Price';
              }}
            />
            <Line
              type="monotone"
              dataKey="actual"
              stroke="#8884d8"
              name="actual"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 8 }}
            />
            {predictions.length > 0 && (
              <Line
                type="monotone"
                dataKey="predicted"
                stroke="#82ca9d"
                name="predicted"
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