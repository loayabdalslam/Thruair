import React from 'react';
import { AstroPosition } from '../types';
import { Sun, Moon, Star } from 'lucide-react';

interface AstroPositionsTableProps {
  positions: AstroPosition[];
}

export const AstroPositionsTable: React.FC<AstroPositionsTableProps> = ({ positions }) => {
  const getIcon = (planet: string) => {
    switch (planet.toLowerCase()) {
      case 'sun': return <Sun className="h-4 w-4" />;
      case 'moon': return <Moon className="h-4 w-4" />;
      default: return <Star className="h-4 w-4" />;
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <thead className="bg-gray-50 dark:bg-gray-800">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Planet</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Sign</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Degree</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">House</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Aspect</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Influence</th>
          </tr>
        </thead>
        <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
          {positions.map((position, index) => (
            <tr key={index}>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  {getIcon(position.planet)}
                  <span className="ml-2">{position.planet}</span>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">{position.sign}</td>
              <td className="px-6 py-4 whitespace-nowrap">{position.degree}°</td>
              <td className="px-6 py-4 whitespace-nowrap">{position.house}</td>
              <td className="px-6 py-4 whitespace-nowrap">{position.aspect}</td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`px-2 py-1 text-xs rounded-full ${
                  position.influence === 'positive' ? 'bg-green-100 text-green-800' :
                  position.influence === 'negative' ? 'bg-red-100 text-red-800' :
                  'bg-yellow-100 text-yellow-800'
                }`}>
                  {position.influence.charAt(0).toUpperCase() + position.influence.slice(1)}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};