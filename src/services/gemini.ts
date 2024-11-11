import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI('AIzaSyAsSlXadDzi9k6XuEjFA2oiTV59PaBXBZA');

export interface GeminiZodiacImpact {
  sign: string;
  stockInfluence: {
    technology: number;
    finance: number;
    healthcare: number;
    energy: number;
    consumer: number;
  };
  characteristics: {
    riskTolerance: number;
    volatilityPreference: number;
    longTermOutlook: number;
    shortTermTrading: number;
  };
  description: string;
  tradingStyle: string;
  favorablePeriods: string[];
  unfavorablePeriods: string[];
}

const generatePrompt = (sign: string, date: string) => `
Analyze the zodiac sign ${sign} for the date ${date} in the context of stock market trading and investments.
Provide a detailed analysis in the following JSON format:
{
  "sign": "${sign}",
  "stockInfluence": {
    "technology": [0-1 scale],
    "finance": [0-1 scale],
    "healthcare": [0-1 scale],
    "energy": [0-1 scale],
    "consumer": [0-1 scale]
  },
  "characteristics": {
    "riskTolerance": [0-1 scale],
    "volatilityPreference": [0-1 scale],
    "longTermOutlook": [0-1 scale],
    "shortTermTrading": [0-1 scale]
  },
  "description": [detailed analysis of trading style and tendencies],
  "tradingStyle": [concise trading style summary],
  "favorablePeriods": [array of favorable market conditions],
  "unfavorablePeriods": [array of challenging market conditions]
}

Consider astrological aspects, planetary positions, and their influence on market sectors and trading behavior.
`;

export const getGeminiZodiacImpact = async (sign: string, date: string): Promise<GeminiZodiacImpact> => {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    const prompt = generatePrompt(sign, date);
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Parse the JSON response
    const impact = JSON.parse(text);
    
    // Validate and normalize the data
    return {
      sign: impact.sign,
      stockInfluence: {
        technology: Math.min(1, Math.max(0, impact.stockInfluence.technology)),
        finance: Math.min(1, Math.max(0, impact.stockInfluence.finance)),
        healthcare: Math.min(1, Math.max(0, impact.stockInfluence.healthcare)),
        energy: Math.min(1, Math.max(0, impact.stockInfluence.energy)),
        consumer: Math.min(1, Math.max(0, impact.stockInfluence.consumer))
      },
      characteristics: {
        riskTolerance: Math.min(1, Math.max(0, impact.characteristics.riskTolerance)),
        volatilityPreference: Math.min(1, Math.max(0, impact.characteristics.volatilityPreference)),
        longTermOutlook: Math.min(1, Math.max(0, impact.characteristics.longTermOutlook)),
        shortTermTrading: Math.min(1, Math.max(0, impact.characteristics.shortTermTrading))
      },
      description: impact.description,
      tradingStyle: impact.tradingStyle,
      favorablePeriods: impact.favorablePeriods,
      unfavorablePeriods: impact.unfavorablePeriods
    };
  } catch (error) {
    console.error('Error generating zodiac impact:', error);
    throw error;
  }
};