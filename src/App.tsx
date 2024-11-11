import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { StockTable } from './components/StockTable';
import { AstroEvents } from './components/AstroEvents';
import { StockDetail } from './pages/StockDetail';
import { astroEvents } from './data/mockData';
import { BarChart3, Moon, Sun } from 'lucide-react';

function Dashboard() {
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <nav className="bg-white dark:bg-gray-800 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <BarChart3 className="h-8 w-8 text-indigo-600 dark:text-indigo-400" />
              <span className="ml-2 text-xl font-semibold text-gray-900 dark:text-white">AstroStock Analytics</span>
            </div>
            <div className="flex items-center space-x-4">
              <Moon className="h-5 w-5 text-gray-600 dark:text-gray-300" />
              <Sun className="h-5 w-5 text-gray-600 dark:text-gray-300" />
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
              <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Top Market Movers</h2>
              <StockTable />
            </div>
          </div>
          
          <div className="lg:col-span-1">
            <AstroEvents events={astroEvents} />
          </div>
        </div>
      </main>
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/stock/:symbol" element={<StockDetail />} />
      </Routes>
    </Router>
  );
}

export default App;