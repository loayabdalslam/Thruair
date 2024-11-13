import React, { useState } from 'react';

interface MlSettingsModalProps {
  settings: {
    epochs: number;
    trainingDays: number;
    predictionDays: number;
    lookbackWindow: number;
  };
  onSave: (newSettings: { epochs: number; trainingDays: number; predictionDays: number; lookbackWindow: number }) => void;
  onClose: () => void;
}

export const MlSettingsModal: React.FC<MlSettingsModalProps> = ({ settings, onSave, onClose }) => {
  const [localSettings, setLocalSettings] = useState(settings);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLocalSettings((prevSettings) => ({
      ...prevSettings,
      [name]: Number(value),
    }));
  };

  const handleSave = () => {
    onSave(localSettings);
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg max-w-lg w-full">
        <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Adjust ML Settings</h2>

        <div className="mb-4">
          <label className="block text-gray-700 dark:text-gray-300" htmlFor="epochs">
            Epochs: {localSettings.epochs}
          </label>
          <input
            type="range"
            id="epochs"
            name="epochs"
            min="1"
            max="50"
            value={localSettings.epochs}
            onChange={handleChange}
            className="w-full"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 dark:text-gray-300" htmlFor="trainingDays">
            Training Days: {localSettings.trainingDays}
          </label>
          <input
            type="number"
            id="trainingDays"
            name="trainingDays"
            min="10"
            max="500"
            value={localSettings.trainingDays}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:text-white"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 dark:text-gray-300" htmlFor="predictionDays">
            Prediction Days: {localSettings.predictionDays}
          </label>
          <input
            type="number"
            id="predictionDays"
            name="predictionDays"
            min="1"
            max="365"
            value={localSettings.predictionDays}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:text-white"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 dark:text-gray-300" htmlFor="lookbackWindow">
            Lookback Window: {localSettings.lookbackWindow}
          </label>
          <input
            type="number"
            id="lookbackWindow"
            name="lookbackWindow"
            min="1"
            max="50"
            value={localSettings.lookbackWindow}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:text-white"
          />
        </div>

        <div className="flex justify-between items-center">
          <button
            onClick={handleSave}
            className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
          >
            Save Settings
          </button>
          <button
            onClick={onClose}
            className="bg-gray-300 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-400"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
