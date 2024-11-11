import { Stock, StockDetail, AstroPosition, AstroEvent } from '../types';

export const stockData: Stock[] = [
  {
    symbol: 'AAPL',
    name: 'Apple Inc.',
    price: 172.45,
    change: 1.23,
    marketCap: '2.8T',
    prediction: 'bullish'
  },
  {
    symbol: 'MSFT',
    name: 'Microsoft',
    price: 415.32,
    change: -0.45,
    marketCap: '2.9T',
    prediction: 'neutral'
  },
  {
    symbol: 'GOOGL',
    name: 'Alphabet Inc.',
    price: 147.68,
    change: 2.15,
    marketCap: '1.9T',
    prediction: 'bullish'
  },
  {
    symbol: 'AMZN',
    name: 'Amazon.com Inc.',
    price: 178.35,
    change: -1.12,
    marketCap: '1.8T',
    prediction: 'bearish'
  },
  {
    symbol: 'META',
    name: 'Meta Platforms Inc.',
    price: 505.95,
    change: 3.45,
    marketCap: '1.3T',
    prediction: 'bullish'
  }
];

export const astroEvents: AstroEvent[] = [
  {
    date: '2024-03-20',
    event: 'Mercury Retrograde Begins',
    impact: 'high',
    description: 'Communication and technology sectors face significant volatility',
    affectedSectors: ['Technology', 'Communications', 'Media']
  },
  {
    date: '2024-03-21',
    event: 'Full Moon in Libra',
    impact: 'medium',
    description: 'Financial markets experience increased emotional trading',
    affectedSectors: ['Finance', 'Banking', 'Real Estate']
  },
  {
    date: '2024-03-22',
    event: 'Venus-Jupiter Conjunction',
    impact: 'low',
    description: 'Favorable conditions for luxury and consumer goods',
    affectedSectors: ['Retail', 'Luxury Goods', 'Entertainment']
  },
  {
    date: '2024-03-23',
    event: 'Mars Square Pluto',
    impact: 'high',
    description: 'Potential market disruptions and power struggles',
    affectedSectors: ['Energy', 'Defense', 'Mining']
  },
  {
    date: '2024-03-24',
    event: 'Saturn Trine Uranus',
    impact: 'medium',
    description: 'Innovation meets stability in traditional sectors',
    affectedSectors: ['Technology', 'Infrastructure', 'Manufacturing']
  }
];

const historicalEvents = {
  '2024-03-20': {
    towers: ['Tower of Fortune: 78°', 'Tower of Destiny: 145°', 'Tower of Wisdom: 223°'],
    aspects: ['Mercury-Saturn Square', 'Venus-Neptune Conjunction'],
    marketImpact: 'High volatility due to celestial misalignment'
  },
  '2024-03-21': {
    towers: ['Tower of Fortune: 82°', 'Tower of Destiny: 150°', 'Tower of Wisdom: 228°'],
    aspects: ['Moon-Jupiter Opposition', 'Mars-Pluto Trine'],
    marketImpact: 'Bullish sentiment from harmonious planetary alignment'
  },
  '2024-03-22': {
    towers: ['Tower of Fortune: 85°', 'Tower of Destiny: 155°', 'Tower of Wisdom: 233°'],
    aspects: ['Sun-Venus Sextile', 'Mercury-Mars Square'],
    marketImpact: 'Mixed signals with emphasis on luxury sectors'
  },
  '2024-03-23': {
    towers: ['Tower of Fortune: 88°', 'Tower of Destiny: 160°', 'Tower of Wisdom: 238°'],
    aspects: ['Mars-Pluto Square', 'Jupiter-Saturn Trine'],
    marketImpact: 'Transformative energy affecting market structure'
  },
  '2024-03-24': {
    towers: ['Tower of Fortune: 92°', 'Tower of Destiny: 165°', 'Tower of Wisdom: 243°'],
    aspects: ['Saturn-Uranus Trine', 'Venus-Jupiter Conjunction'],
    marketImpact: 'Progressive developments in traditional sectors'
  }
};

export const getStockDetails = (symbol: string): StockDetail[] => {
  const basePrice = stockData.find(s => s.symbol === symbol)?.price || 100;
  
  return Object.keys(historicalEvents).map((date, index) => {
    const volatility = Math.random() * 5;
    const trend = Math.sin(index / 3) * volatility;
    
    return {
      date,
      open: basePrice + trend - volatility/2,
      high: basePrice + trend + volatility,
      low: basePrice + trend - volatility,
      close: basePrice + trend + volatility/2,
      volume: Math.floor(30000000 + Math.random() * 25000000)
    };
  });
};

export const getAstroPositions = (date: string): AstroPosition[] => {
  const event = historicalEvents[date as keyof typeof historicalEvents];
  if (!event) return [];

  const basePositions = [
    {
      planet: 'Sun',
      sign: 'Aries',
      degree: 15 + Math.floor(Math.random() * 5),
      house: 10,
      aspect: event.aspects[0],
      influence: Math.random() > 0.5 ? 'positive' : 'negative'
    },
    {
      planet: 'Moon',
      sign: 'Libra',
      degree: 28 + Math.floor(Math.random() * 5),
      house: 4,
      aspect: event.aspects[1],
      influence: Math.random() > 0.5 ? 'positive' : 'negative'
    },
    {
      planet: 'Mercury',
      sign: 'Pisces',
      degree: 12 + Math.floor(Math.random() * 5),
      house: 9,
      aspect: 'Square Mars',
      influence: 'negative'
    },
    {
      planet: 'Venus',
      sign: 'Taurus',
      degree: 5 + Math.floor(Math.random() * 5),
      house: 11,
      aspect: 'Sextile Saturn',
      influence: 'positive'
    },
    {
      planet: 'Mars',
      sign: 'Gemini',
      degree: 20 + Math.floor(Math.random() * 5),
      house: 12,
      aspect: 'Opposition Pluto',
      influence: 'negative'
    },
    {
      planet: 'Jupiter',
      sign: 'Leo',
      degree: 15 + Math.floor(Math.random() * 5),
      house: 2,
      aspect: 'Trine Sun',
      influence: 'positive'
    },
    {
      planet: 'Saturn',
      sign: 'Libra',
      degree: 8 + Math.floor(Math.random() * 5),
      house: 4,
      aspect: 'Square Moon',
      influence: 'neutral'
    }
  ];

  return basePositions.map(position => ({
    ...position,
    influence: Math.random() > 0.6 ? 'positive' : Math.random() > 0.5 ? 'negative' : 'neutral'
  }));
};

export const getTowerPositions = (date: string) => {
  return historicalEvents[date as keyof typeof historicalEvents]?.towers || [];
};