export type CardType = 'Robot' | 'ProductionUnit' | 'Fzzzt';

export interface CardData {
    id: number;
    name: string;
    type: CardType;
    power: number;
    points: number;
    symbols?: string[];
    beltSpeed?: number;
    //For production units, the recipe is a mapping of card IDs to quantities required for production
    recipe?: Record<string, number>;
}

export interface Player {
    name: string;
    hand: number[]; // Array of card IDs in the player's hand   
    score: number;
    isChief: boolean;
}