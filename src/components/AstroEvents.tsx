import React from 'react';
import { AstroEvent } from '../types';
import { Moon, AlertTriangle, Info } from 'lucide-react';

interface AstroEventsProps {
  events: AstroEvent[];
}

export const AstroEvents: React.FC<AstroEventsProps> = ({ events }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
      <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white flex items-center">
        <Moon className="mr-2" /> Astrological Events
      </h2>
      <div className="space-y-4">
        {events.map((event, index) => (
          <div key={index} className="border-l-4 border-indigo-500 pl-4 py-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500 dark:text-gray-400">{event.date}</span>
              <span className={`px-2 py-1 text-xs rounded-full
                ${event.impact === 'high' ? 'bg-red-100 text-red-800' :
                  event.impact === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-green-100 text-green-800'}`}>
                {event.impact.toUpperCase()}
              </span>
            </div>
            <h3 className="font-medium text-gray-900 dark:text-white mt-1">{event.event}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">{event.description}</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {event.affectedSectors.map((sector, idx) => (
                <span key={idx} className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs px-2 py-1 rounded">
                  {sector}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};