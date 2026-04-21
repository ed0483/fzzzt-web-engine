export type CardType = 'Robot' | 'ProductionUnit' | 'Fzzzt';

export interface CardData {
    id: number;
    name: string;
    type: CardType;
    power: number;
    points: number;
    symbols?: string[];
    beltSpeed?: number;
    
    // For production units
    recipe?: Record<string, number>; // e.g. { "Nut": 1, "Cog": 1 }
    bonusPerWidget?: number;         // The big points (e.g. +9)
    penalty?: number;                // The loss if not filled (e.g. -3)

    // For the Building Phase logic
    assignedToUnitId?: number | null; // Tracks which Production Unit this robot is assigned to
}

export interface Player {
    name: string;
    hand: number[]; 
    score: number;
    isChief: boolean;
}