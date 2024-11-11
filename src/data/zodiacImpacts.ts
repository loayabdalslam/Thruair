export interface ZodiacImpact {
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

export const zodiacImpacts: Record<string, ZodiacImpact> = {
  Aries: {
    sign: "Aries",
    stockInfluence: {
      technology: 0.8,
      finance: 0.6,
      healthcare: 0.4,
      energy: 0.9,
      consumer: 0.5
    },
    characteristics: {
      riskTolerance: 0.9,
      volatilityPreference: 0.8,
      longTermOutlook: 0.4,
      shortTermTrading: 0.9
    },
    description: "Aries investors tend to be aggressive and quick to act on opportunities. They excel in fast-paced market conditions but may need to guard against impulsive decisions.",
    tradingStyle: "Aggressive growth, high-risk tolerance, quick entry/exit",
    favorablePeriods: ["Market openings", "High volatility periods", "Technology sector rallies"],
    unfavorablePeriods: ["Slow market conditions", "Conservative sectors", "Extended consolidation phases"]
  },
  Taurus: {
    sign: "Taurus",
    stockInfluence: {
      technology: 0.5,
      finance: 0.8,
      healthcare: 0.6,
      energy: 0.4,
      consumer: 0.9
    },
    characteristics: {
      riskTolerance: 0.4,
      volatilityPreference: 0.3,
      longTermOutlook: 0.9,
      shortTermTrading: 0.3
    },
    description: "Taurus investors prefer stable, long-term investments with tangible value. They excel in value investing and dividend strategies.",
    tradingStyle: "Value investing, dividend focus, long-term holding",
    favorablePeriods: ["Dividend seasons", "Value stock rallies", "Consumer sector strength"],
    unfavorablePeriods: ["High volatility", "Speculative markets", "Tech bubble periods"]
  },
  // Add other signs similarly...
};