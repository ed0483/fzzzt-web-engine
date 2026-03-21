import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CardData } from './types';
import Card from './components/Card';
import cardsDataRaw from './cards.json';

const cardsData = cardsDataRaw as CardData[];

export default function App() {
  const [deck, setDeck] = useState<CardData[]>([]);
  const [belt, setBelt] = useState<CardData[]>([]);
  const [userHand, setUserHand] = useState<number[]>([1, 2, 3]);
  const [aiHand, setAiHand] = useState<number[]>([1, 2, 3]);
  const [userScore, setUserScore] = useState<number>(0);
  const [aiScore, setAiScore] = useState<number>(0);
  const [message, setMessage] = useState<string>("Choose a card from your hand to bid!");

  
  // 1. Add this new Effect to handle refilling the belt from the deck
useEffect(() => {
  // If the belt is empty but we still have cards in the deck...
  if (belt.length === 0 && deck.length > 0) {
    const nextEight = deck.slice(0, 8);
    setBelt(nextEight);
    setDeck(prev => prev.slice(8));
    setMessage("Next round! Shuffling the conveyor belt...");
  }
}, [belt, deck]); // This runs whenever the belt or deck changes
  useEffect(() => {
    const shuffled = [...cardsData].sort(() => Math.random() - 0.5);
    setBelt(shuffled.slice(0, 8));
    setDeck(shuffled.slice(8));
  }, []);

  const handleBid = (bidValue: number) => {
    if (belt.length === 0) return;
    const targetCard = belt[0];
    
    // Simple AI Logic
    const aiBidValue = aiHand[Math.floor(Math.random() * aiHand.length)];

    if (bidValue >= aiBidValue) {
      setUserScore(prev => prev + targetCard.points);
      setMessage(`You won! ${targetCard.name} (+${targetCard.points} pts)`);
    } else {
      setAiScore(prev => prev + targetCard.points);
      setMessage(`AI won! It took the ${targetCard.name}`);
    }

    // Filter used cards out of hands
    setUserHand(userHand.filter((v, i) => v !== bidValue || userHand.indexOf(v) !== i));
    setAiHand(aiHand.filter((v, i) => v !== aiBidValue || aiHand.indexOf(v) !== i));
    
    // Remove the card from the belt (This triggers the sliding animation!)
    setBelt(prev => prev.slice(1));

    // Refill hands if empty (Simplified Rule 11)
    if (userHand.length <= 1) {
      const refill = [1, 2, 3, 4, 5];
      setUserHand(refill);
      setAiHand(refill);
    }
  };

  const beltSpeed = belt[0]?.beltSpeed || 1;

  return (
    <div className="min-h-screen bg-slate-900 text-white p-8 flex flex-col items-center">
      <h1 className="text-4xl font-black mb-8 text-cyan-400 uppercase tracking-tighter">FZZZT! ENGINE</h1>
      
      {/* SCORES SECTION */}
      <div className="flex gap-8 mb-8 bg-slate-800 p-4 rounded-xl border border-white/10 shadow-2xl">
        <div className="text-center">
          <p className="text-xs text-slate-400 uppercase">You</p>
          <p className="text-3xl font-bold text-white">{userScore}</p>
        </div>
        <div className="text-center border-l border-white/10 pl-8">
        <p className="text-xs uppercase text-red-400">AI</p>
          <p className="text-3xl font-bold text-red-400">{aiScore}</p>
        </div>
      </div>

      {/* ANIMATED CONVEYOR BELT */}
      <div className="w-full max-w-5xl mb-12">
        <p className="text-center text-[10px] text-slate-500 uppercase tracking-widest mb-4">Conveyor Belt (Page 9 Rules)</p>
        <div className="flex gap-4 p-6 bg-black/20 rounded-3xl border border-white/5 overflow-x-hidden justify-center relative min-h-[220px]">
          <AnimatePresence mode="popLayout">
            {belt.map((card, i) => (
              <motion.div
                key={`${card.id}-${i}`}
                layout
                initial={{ opacity: 0, scale: 0.8, x: 50 }}
                animate={{ opacity: 1, scale: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.5, x: -100 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              >
                <Card card={card} isHidden={i >= beltSpeed} />
              </motion.div>
            ))}
          </AnimatePresence>
          {belt.length === 0 && <p className="text-slate-500 italic">Belt Empty - Shuffling next round...</p>}
        </div>
      </div>

      {/* BIDDING AREA (The missing part!) */}
      <div className="bg-slate-800 p-8 rounded-2xl border-2 border-cyan-500/30 shadow-2xl text-center w-full max-w-md">
  {deck.length === 0 && belt.length === 0 ? (
    <div>
      <h2 className="text-2xl font-black text-yellow-400 mb-2">FACTORY CLOSED!</h2>
      <p className="text-white mb-4">Final Score: {userScore}</p>
      <button 
        onClick={() => window.location.reload()}
        className="bg-white text-black px-6 py-2 rounded-full font-bold hover:bg-cyan-400"
      >
        RESTART GAME
      </button>
    </div>
  ) : (
    <>
      <p className="mb-6 font-medium text-cyan-100 italic">"{message}"</p>
      <div className="flex flex-col items-center">
          <p className="text-[10px] text-slate-400 uppercase mb-4">Select your Bid Power</p>
          <div className="flex gap-4 justify-center">
            {userHand.map((val, i) => (
              <button 
                key={`${val}-${i}`} 
                onClick={() => handleBid(val)} 
                className="w-14 h-14 bg-gradient-to-b from-cyan-500 to-blue-700 rounded-xl font-black text-xl shadow-lg hover:-translate-y-1 hover:brightness-110 transition-all active:scale-90 border border-white/10"
              >
                {val}
              </button>
            ))}
          </div>
      </div>
    </>
  )}
</div>
    </div>
  );
}
