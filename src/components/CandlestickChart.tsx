import React, { useState } from 'react';
import { ResponsiveContainer, ComposedChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Brush } from 'recharts';
import { StockDetail } from '../types';

interface CandlestickChartProps {
  data: StockDetail[];
}

const tooltipStyles = {
  high: '#22c55e',
  low: '#ef4444',
  open: '#3b82f6',
  close: '#8b5cf6'
};

export const CandlestickChart: React.FC<CandlestickChartProps> = ({ data }) => {
  const [zoomedData, setZoomedData] = useState<StockDetail[]>(data);

  const handleBrushChange = (state: any) => {
    if (!state || !state.index) return;
    const { index } = state;
    setZoomedData(data.slice(index[0], index[1] + 1));
  };

  return (
    <div className="h-[400px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={zoomedData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip
            content={({ payload, label }) => {
              if (!payload || payload.length === 0) return null;

              const { open, close, high, low } = payload[0].payload;

              return (
                <div className="bg-white border p-2 rounded shadow-lg">
                  <p><strong>Date:</strong> {label}</p>
                  <p><strong style={{ color: tooltipStyles.open }}>Open:</strong> ${open.toFixed(2)}</p>
                  <p><strong style={{ color: tooltipStyles.high }}>High:</strong> ${high.toFixed(2)}</p>
                  <p><strong style={{ color: tooltipStyles.low }}>Low:</strong> ${low.toFixed(2)}</p>
                  <p><strong style={{ color: tooltipStyles.close }}>Close:</strong> ${close.toFixed(2)}</p>
                </div>
              );
            }}
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
          <Brush
            dataKey="date"
            height={30}
            stroke="#8884d8"
            onChange={handleBrushChange}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
};
