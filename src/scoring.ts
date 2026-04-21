import { CardData } from './types';

export interface ScoreBreakdown {
  basicScore: number;
  fzzztPenalty: number;
  bonuses: { unitName: string; amount: number }[];
  total: number;
}

export function calculateFinalScore(wonCards: CardData[]): ScoreBreakdown {
  // 1. Basic Score (Sum of points on all cards)
  let basicScore = wonCards.reduce((sum, card) => sum + card.points, 0);

  // 2. Fzzzt Penalty (-1 per Fzzzt card)
  const fzzztCount = wonCards.filter(c => c.type === 'Fzzzt').length;
  const fzzztPenalty = fzzztCount * -1;

  // 3. Symbol Pool (Count all symbols you won)
  const symbolPool: Record<string, number> = { Nut: 0, Oil: 0, Cog: 0, Bolt: 0 };
  const robots = wonCards.filter(c => c.type === 'Robot');
  
  robots.forEach(robot => {
    robot.symbols?.forEach(sym => {
      symbolPool[sym] = (symbolPool[sym] || 0) + 1;
    });
  });

  // 4. Production Unit Bonuses/Penalties
  const productionUnits = wonCards.filter(c => c.type === 'ProductionUnit');
  const bonuses: { unitName: string; amount: number }[] = [];
  let totalBonus = 0;

  productionUnits.forEach(unit => {
    if (!unit.recipe) return;

    // Check how many widgets we can make
    let possibleWidgets = 999; // Start high
    
    Object.entries(unit.recipe).forEach(([symbol, requiredAmount]) => {
        const available = symbolPool[symbol] || 0;
        const count = Math.floor(available / requiredAmount);
        if (count < possibleWidgets) possibleWidgets = count;
    });

    if (possibleWidgets > 0) {
      const amount = possibleWidgets * (unit.bonusPerWidget || 0);
      bonuses.push({ unitName: unit.name, amount });
      totalBonus += amount;
      
      // Consume the symbols so they can't be used for another unit (Page 13 Rule)
      Object.keys(unit.recipe).forEach(symbol => {
          symbolPool[symbol] -= (possibleWidgets * (unit.recipe![symbol]));
      });
    } else {
      // Penalty for owning a unit but making 0 widgets
      const amount = -(unit.penalty || 0);
      bonuses.push({ unitName: `${unit.name} (Empty)`, amount });
      totalBonus += amount;
    }
  });

  return {
    basicScore,
    fzzztPenalty,
    bonuses,
    total: basicScore + fzzztPenalty + totalBonus
  };
}