import { CardData } from '../types';

interface CardProps {
  card: CardData;
  isHidden: boolean;
}

export default function Card({ card, isHidden }: CardProps) {
    // 1. HIDDEN STATE
    if (isHidden) {
      return (
        <div className="w-32 h-48 flex-shrink-0 bg-blue-900 border-4 border-blue-400 rounded-xl flex items-center justify-center shadow-lg">
          <span className="text-4xl font-bold text-blue-200 animate-pulse">?</span>
        </div>
      );
    }
  
    // 2. VISIBLE STATE LOGIC
    const bgColor = card.type === "ProductionUnit" ? "bg-green-800" : "bg-slate-700";
  
    return (
      <div className={`w-32 h-48 flex-shrink-0 ${bgColor} border-2 border-slate-400 rounded-xl p-2 flex flex-col justify-between shadow-xl transition-transform hover:scale-105`}>
        
        {/* TOP: Power Badge */}
        <div className="flex justify-between items-start">
          <span className="bg-yellow-400 text-black text-[9px] font-black px-1.5 py-0.5 rounded shadow-sm">
            PWR: {card.power}
          </span>
          <span className="text-[8px] text-white/30 font-mono">#{card.id}</span>
        </div>

        {/* CENTER: Name and Symbols */}
        <div className="text-center py-1">
          <p className="font-black text-[10px] leading-tight text-white uppercase tracking-tighter mb-2">
            {card.name}
          </p>
          
          {/* YOUR NEW SYMBOL ICONS */}
          <div className="flex gap-1 justify-center">
            {card.symbols?.map((s, i) => (
              <div 
                key={i} 
                className="w-6 h-6 rounded-md bg-black/40 border border-white/10 flex items-center justify-center shadow-inner"
                title={s}
              >
                <span className="text-xs">
                  {s === 'Nut' && '🔩'}
                  {s === 'Oil' && '💧'}
                  {s === 'Cog' && '⚙️'}
                  {s === 'Bolt' && '⚡'}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* BOTTOM: Victory Value */}
        <div className="flex justify-between items-end">
           <div className="text-[8px] text-white/50 uppercase font-bold">
            {card.type === 'ProductionUnit' ? 'Unit' : 'Robot'}
           </div>
           <div className="text-[10px] font-black text-yellow-300 bg-black/20 px-1.5 rounded">
            VAL: {card.points}
           </div>
        </div>
      </div>
    );
  }