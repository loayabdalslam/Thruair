import React from 'react';
import { ResponsiveContainer, ComposedChart, Line, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
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
          <YAxis yAxisId="left" />
          <YAxis yAxisId="right" orientation="right" />
          <Tooltip />
          <Legend />
          <Bar yAxisId="left" dataKey="volume" fill="#8884d8" opacity={0.3} />
          <Line yAxisId="right" type="monotone" dataKey="high" stroke="#82ca9d" />
          <Line yAxisId="right" type="monotone" dataKey="low" stroke="#ff7300" />
          <Line yAxisId="right" type="monotone" dataKey="open" stroke="#387908" />
          <Line yAxisId="right" type="monotone" dataKey="close" stroke="#ff0000" />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
};