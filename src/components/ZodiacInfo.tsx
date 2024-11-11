import React from 'react';
import { ZodiacInfo as ZodiacInfoType } from '../services/zodiac';
import { Star, Moon, Sun } from 'lucide-react';

interface ZodiacInfoProps {
  info: ZodiacInfoType;
}

export const ZodiacInfo: React.FC<ZodiacInfoProps> = ({ info }) => {
  const getZodiacIcon = () => {
    switch (info.element.toLowerCase()) {
      case 'fire':
        return <Sun className="h-6 w-6 text-orange-500" />;
      case 'water':
        return <Moon className="h-6 w-6 text-blue-500" />;
      default:
        return <Star className="h-6 w-6 text-purple-500" />;
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-md transition-colors duration-200">
      <div className="flex items-center space-x-3 mb-3">
        {getZodiacIcon()}
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          {info.sign}
        </h3>
      </div>
      
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-gray-500 dark:text-gray-400">Chinese Sign:</span>
          <span className="text-gray-900 dark:text-white font-medium">{info.chinese}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-500 dark:text-gray-400">Element:</span>
          <span className="text-gray-900 dark:text-white font-medium">{info.element}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-500 dark:text-gray-400">Quality:</span>
          <span className="text-gray-900 dark:text-white font-medium">{info.quality}</span>
        </div>
      </div>
    </div>
  );
};