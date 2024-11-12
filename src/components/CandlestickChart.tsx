import React from 'react';
import { ResponsiveContainer, ComposedChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { StockDetail } from '../types';

interface CandlestickChartProps {
  data: StockDetail[];
}

export const CandlestickChart: React.FC<CandlestickChartProps> = ({ data }) => {
  return (
    <div className="h-[400px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip 
            formatter={(value: number) => [`$${value.toFixed(2)}`, '']}
            labelFormatter={(label) => `Date: ${label}`}
          />
          <Legend />
          <Line 
            type="monotone" 
            dataKey="high" 
            stroke="#22c55e" 
            name="High"
            dot={false}
          />
          <Line 
            type="monotone" 
            dataKey="low" 
            stroke="#ef4444" 
            name="Low"
            dot={false}
          />
          <Line 
            type="monotone" 
            dataKey="open" 
            stroke="#3b82f6" 
            name="Open"
            dot={false}
          />
          <Line 
            type="monotone" 
            dataKey="close" 
            stroke="#8b5cf6" 
            name="Close"
            dot={false}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
};