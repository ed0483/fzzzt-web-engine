export default function Card({ card, isHidden }) {
    if (isHidden) {
      return (
        <div className="w-32 h-48 bg-blue-900 border-4 border-blue-400 rounded-xl flex items-center justify-center shadow-lg">
          <span className="text-4xl font-bold text-blue-200">?</span>
        </div>
      );
    }
  
    const bgColor = card.type === "ProductionUnit" ? "bg-green-700" : "bg-slate-700";
  
    return (
      <div className={`w-32 h-48 ${bgColor} border-2 border-slate-400 rounded-xl p-2 flex flex-col justify-between shadow-xl`}>
        <div className="flex justify-between items-start">
          <span className="bg-yellow-400 text-black text-[10px] font-bold px-1 rounded">Pwr: {card.power}</span>
        </div>
        <div className="text-center font-bold text-[10px] leading-tight text-white">
          {card.name}
        </div>
        <div className="text-right text-[10px] font-bold text-yellow-300">
          Val: {card.points}
        </div>
      </div>
    );
  }