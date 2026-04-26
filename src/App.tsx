// Importing React hooks for state management, side effects, and performance optimisation
import { useState, useEffect, useMemo } from 'react';
// Importing Framer Moption components for smooth layout transitions and exit animations
import { motion, AnimatePresence } from 'framer-motion';
// Importing our custom TypeScript interface to ensure data integrity
import { CardData } from './types';
// Importing the visual Card component to keep the UI modular
import Card from './components/Card';
// Importing the raw game data from our JSON database
import cardsDataRaw from './cards.json';

// Defining the game rules as a constant array to keep the UI text separare from the logic
const GAME_RULES = [
  { title: "The Goal", text: "Collect robots to earn Victory Points and build factory widgets for bonus scores.", icon: "🏆" },
  { title: "The Auction", text: "Bid for the head card using power (1-3). Highest bid wins. You win all ties (Chief Rule)!", icon: "⚡" },
  { title: "Belt Speed", text: "The head card's speed reveals cards behind it. Save your '3's for cards you see coming!", icon: "🔍" },
  { title: "Construction", text: "After auctions, assign robots to Production Units. Match symbols to get massive bonuses.", icon: "⚙️" },
  { title: "Penalties", text: "Fzzzt! cards subtract points. Empty Production Units also penalize your efficiency.", icon: "⚠️" },
];

// A Functional Component for the Onboarding Modal using TypeScript props definition
const Instructions = ({ onStart }: { onStart: () => void }) => (
  <motion.div 
    // Initial and animate props create a smooth fade-in effect when the modal mounts  
    initial={{ opacity: 0 }} animate={{ opacity: 1 }}
    // Backdrop blur and high z-index ensure focus remains on the instructions
    className="fixed inset-0 bg-black/90 backdrop-blur-md z-50 flex items-center justify-center p-4"
  >
    <div className="bg-slate-800 border-2 border-cyan-500/50 p-8 rounded-3xl max-w-lg shadow-[0_0_50px_rgba(6,182,212,0.2)] text-center">
      <h2 className="text-3xl font-black text-cyan-400 mb-2 uppercase italic underline decoration-cyan-500/30">Mission Briefing</h2>
      <p className="text-slate-400 text-[10px] uppercase tracking-[0.2em] mb-6">Location: Robot Factory #09 | Rank: Chief Mechanic</p>
      <ul className="text-left space-y-4 text-slate-200 text-sm mb-8">
        <li className="flex gap-3"><span className="text-cyan-400 font-bold">01.</span><p>Bid for the <span className="text-white font-bold underline">first robot</span> on the belt using power (1-3).</p></li>
        <li className="flex gap-3"><span className="text-cyan-400 font-bold">02.</span><p>You are the <span className="text-yellow-400 font-bold underline">Chief Mechanic</span>. You win all ties!</p></li>
        <li className="flex gap-3"><span className="text-cyan-400 font-bold">03.</span><p>Final Phase: Match robot symbols to Units for <span className="text-white font-bold">Bonus Points</span>.</p></li>
      </ul>
      <button onClick={onStart} className="w-full bg-cyan-500 hover:bg-cyan-400 text-black font-black py-4 rounded-2xl transition-all shadow-lg uppercase tracking-widest active:scale-95">Initialize Engine</button>
    </div>
  </motion.div>
);

// Mapping the raw JSON data and injecting an 'assignedToUnitID' property for our building logic
const processedCards = (cardsDataRaw as CardData[]).map(c => ({ ...c, assignedToUnitId: null }));

export default function App() {
  // --- STATE ---
  // Stores cards not yet on the belt
  const [deck, setDeck] = useState<CardData[]>([]);
  // Stores the B cards currently avaiable for auction
  const [belt, setBelt] = useState<CardData[]>([]);
  // Stores the robot and units the user has successfully won
  const [wonCards, setWonCards] = useState<CardData[]>([]);
  // The user's available power for bidding (resets after each auction)
  const [userHand, setUserHand] = useState<number[]>([1, 2, 3]);
  // The AI's available power for bidding (resets after each auction)
  const [aiHand, setAiHand] = useState<number[]>([1, 2, 3]);
  // Tracks the user's current score based on won cards
  const [userScore, setUserScore] = useState<number>(0);
  // Tracks the AI's current score based on won cards
  const [aiScore, setAiScore] = useState<number>(0);
  // Dynamic message to provide feedback after each bid
  const [message, setMessage] = useState<string>("Awaiting your first bid, Chief.");
  // Controls the visibility of the onboarding instructions modal
  const [showInstructions, setShowInstructions] = useState(true);
  const [showRules, setShowRules] = useState(false);
  // Tracks which Production Unit is currently selected for robot assignment during the construction phase
  const [selectedUnitId, setSelectedUnitId] = useState<number | null>(null);

  // --- INITIALISATION ---
  useEffect(() => {
    // Shuffling the deck using a simple sort-randomiser (suitable for a frontend prototype)
    const shuffled = [...processedCards].sort(() => Math.random() - 0.5);
    // Setting the first 8 cards to the belt and the rest to the hidden deck
    setBelt(shuffled.slice(0, 8));
    setDeck(shuffled.slice(8));
  }, []);

  // --- BELT REFILL LOGIC ---
  useEffect(() => {
    // when the belt is empty, we draw the next 8 cards from the deck state
    if (belt.length === 0 && deck.length > 0) {
      const nextEight = deck.slice(0, 8);
      setBelt(nextEight);
      // Immutably updating the deck by removing the cards we just drew
      setDeck(prev => prev.slice(8));
      setMessage("Belt refilled. New robots incoming!");
    }
  }, [belt, deck]); // Runs whenver belt or deck state changes

  // --- AUCTION LOGIC ---
  const handleBid = (bidValue: number) => {
    if (belt.length === 0) return;
    const targetCard = belt[0]; // The 'Head' card currently being bid on
    // Basic AI heuristic: selects a random card from its remaining hand
    const aiBidValue = aiHand[Math.floor(Math.random() * aiHand.length)];

    // Rule: Chief Mechanic (Player) wins on greater than OR equal (tie-breaker)
    if (bidValue >= aiBidValue) {
      // Functional update to ensure we are using the most recent score state
      setUserScore(prev => prev + targetCard.points);
      // Adding the card to the user's inventory for the final construction phase
      setWonCards(prev => [...prev, targetCard]);
      setMessage(bidValue === aiBidValue ? `🤝 TIE! Chief Wins! (${bidValue} vs ${aiBidValue})` : `✅ Success! You won ${targetCard.name}`);
    } else {
      setAiScore(prev => prev + targetCard.points);
      setMessage(`❌ AI outbid you! (${aiBidValue} vs ${bidValue})`);
    }

    // Removing the used cards from both hands to simulate 'exhausting' resources
    setUserHand(prev => prev.filter((v, i) => v !== bidValue || prev.indexOf(v) !== i));
    setAiHand(prev => prev.filter((v, i) => v !== aiBidValue || prev.indexOf(v) !== i));
    // Advancing the belt state by removing the head card
    setBelt(prev => prev.slice(1));

    // If hand is low, refill with the standard starter set
    if (userHand.length <= 1) {
      const refill = [1, 2, 3, 4, 5];
      setUserHand(refill);
      setAiHand(refill);
    }
  };

  // --- CONSTRUCTION LOGIC ---
  const handleAssign = (robotId: number) => {
    if (selectedUnitId === null) return;
    // Iterating through inventory and 'linking' a robot to  unit via its ID
    setWonCards(prev => prev.map(c => c.id === robotId ? { ...c, assignedToUnitId: selectedUnitId } : c));
  };

  // useMemo caches the result of the bonus calculation unless 'wonCards' changes ( Optimisation to avoid recalculating on every render )
  const finalBonus = useMemo(() => {
    let bonus = 0;
    // Filtering for active production blueprints
    const myUnits = wonCards.filter(c => c.type === 'ProductionUnit');
    myUnits.forEach(unit => {
      // Identifying robots assigned to this specific blueprint
      const assigned = wonCards.filter(r => r.assignedToUnitId === unit.id);
      const pool: Record<string, number> = {};
      // Creating a tally of all symbols available in the assigned robot pool
      assigned.forEach(r => r.symbols?.forEach(s => pool[s] = (pool[s] || 0) + 1));
      let canBuild = true;
      // Comparing symbols tallies against the blueprint's requirements
      if (unit.recipe) {
        Object.entries(unit.recipe).forEach(([sym, req]) => { if ((pool[sym] || 0) < req) canBuild = false; });
      }
      // Applying bonuses for success or penalties for empty units
      if (canBuild) bonus += (unit.bonusPerWidget || 0);
      else bonus -= (unit.penalty || 0);
    });
    return bonus;
  }, [wonCards]);

  // Funtion to provide real-time strategic hints based on current inventory
  const getStrategicAdvice = () => {
    const target = belt[0];
    if (!target || target.type !== 'Robot') return "ℹ️ Analyzing factory needs...";
    const myUnits = wonCards.filter(c => c.type === 'ProductionUnit');
    const neededSymbols = new Set();
    // Gathering all symbols required by currently owned units
    myUnits.forEach(unit => Object.keys(unit.recipe || {}).forEach(sym => neededSymbols.add(sym)));
    // Checking if the current target card helps satisfy any of those units
    const matches = target.symbols?.filter(s => neededSymbols.has(s));
    if (matches && matches.length > 0) return `🎯 STRATEGIC FIT: Provides ${matches.join(' & ')}!`;
    return "ℹ️ General Utility: Useful for future bidding power.";
  };

  // Determine how many cards are visible based on the rules
  const beltSpeed = belt[0]?.beltSpeed || 1;
  // Checking if all cards have been processed to switch to the construction UI
  const isBuildingPhase = deck.length === 0 && belt.length === 0;

  return (
    <div className="min-h-screen bg-slate-900 text-white p-8 flex flex-col items-center overflow-x-hidden">
      <AnimatePresence>
        {showInstructions && <Instructions onStart={() => setShowInstructions(false)} />}
        
        {/* MANUAL MODAL */}
        {showRules && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/90 backdrop-blur-md z-[60] flex items-center justify-center p-4">
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="bg-slate-800 border-2 border-white/10 p-8 rounded-[2rem] max-w-2xl w-full shadow-2xl relative">
              <button onClick={() => setShowRules(false)} className="absolute top-6 right-6 text-slate-400 hover:text-white text-2xl font-bold">✕</button>
              <h2 className="text-3xl font-black text-white mb-8 uppercase italic tracking-tight border-b border-white/10 pb-4">Factory Manual <span className="text-cyan-400 text-sm">v2.0</span></h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                {GAME_RULES.map((rule, idx) => (
                  <div key={idx} className="bg-black/20 p-4 rounded-2xl border border-white/5">
                    <div className="flex items-center gap-3 mb-2"><span className="text-xl">{rule.icon}</span><h3 className="font-bold text-cyan-300 text-xs uppercase">{rule.title}</h3></div>
                    <p className="text-slate-400 text-[11px] leading-relaxed">{rule.text}</p>
                  </div>
                ))}
              </div>
              <button onClick={() => setShowRules(false)} className="w-full bg-white text-black font-black py-4 rounded-xl hover:bg-cyan-400 transition-all uppercase tracking-widest">Resume Simulation</button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <header className="text-center mb-8 relative w-full max-w-2xl">
        <h1 className="text-5xl font-black text-cyan-400 uppercase tracking-tighter italic drop-shadow-[0_0_15px_rgba(34,211,238,0.4)]">FZZZT! PRO</h1>
        <button onClick={() => setShowRules(true)} className="absolute top-0 -right-4 w-10 h-10 rounded-full border-2 border-cyan-500/50 text-cyan-400 font-bold hover:bg-cyan-500 hover:text-black transition-all flex items-center justify-center shadow-lg shadow-cyan-500/20">?</button>
        <p className="text-[10px] text-slate-500 uppercase tracking-[0.4em] mt-2">Waikato Engineering Edition</p>
      </header>

      {!isBuildingPhase ? (
        <>
          {/* SCORES */}
          <div className="flex gap-8 mb-8 bg-slate-800/50 p-6 rounded-2xl border border-white/10 shadow-2xl backdrop-blur-sm">
            <div className="text-center"><p className="text-[10px] text-slate-400 uppercase font-bold mb-1">Chief Mechanic</p><p className="text-4xl font-black">{userScore}</p></div>
            <div className="w-[1px] bg-white/10" /><div className="text-center"><p className="text-[10px] text-red-400 uppercase font-bold mb-1">AI Competitor</p><p className="text-4xl font-black text-red-500/80">{aiScore}</p></div>
          </div>

          {/* HIGH-INFO BIDDING BOX */}
          <div className="bg-slate-800 p-8 rounded-[2.5rem] border-2 border-cyan-500/20 shadow-2xl w-full max-w-xl mb-12">
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-black/40 p-4 rounded-2xl border border-white/5 text-left">
                <p className="text-[9px] text-cyan-400 font-black uppercase tracking-widest mb-1">Target Analysis</p>
                <h3 className="text-lg font-black text-white truncate">{belt[0]?.name || "N/A"}</h3>
                <div className="flex gap-1 mt-2">{belt[0]?.symbols?.map((s, idx) => (<span key={idx} className="text-[10px] bg-slate-700 px-2 py-0.5 rounded text-white font-bold border border-white/10">{s}</span>))}</div>
              </div>
              <div className="bg-black/40 p-4 rounded-2xl border border-white/5 text-left">
                <p className="text-[9px] text-yellow-400 font-black uppercase tracking-widest mb-1">Impact Rating</p>
                <div className="flex flex-col gap-1"><p className="text-xs font-bold text-white italic">Value: +{belt[0]?.points || 0} Pts</p><p className="text-xs font-bold text-cyan-400">Next Reveal: {belt[0]?.beltSpeed || 0} cards</p></div>
              </div>
            </div>
            <div className="mb-6 px-4 py-2 bg-cyan-900/20 border border-cyan-500/20 rounded-lg text-left text-[10px] font-medium text-cyan-200">{getStrategicAdvice()}</div>
            <div className="flex flex-col items-center border-t border-white/10 pt-6">
              <p className="text-[10px] text-slate-500 uppercase font-black mb-4 tracking-[0.3em]">Authorize Bid Power</p>
              <div className="flex gap-4">
                {userHand.map((val, i) => (
                  <button key={`${val}-${i}`} onClick={() => handleBid(val)} 
                    className="group relative w-16 h-16 bg-gradient-to-br from-slate-700 to-slate-900 rounded-2xl font-black text-2xl shadow-xl hover:from-cyan-500 hover:to-blue-600 transition-all active:scale-90 border border-white/10"
                  >
                    <span className="group-hover:text-black transition-colors">{val}</span>
                    <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-4 h-1 bg-cyan-400 rounded-full opacity-0 group-hover:opacity-100 transition-all blur-[2px]" />
                  </button>
                ))}
              </div>
              <p className="mt-6 text-xs text-cyan-100/50 font-medium italic">"{message}"</p>
            </div>
          </div>

          {/* CONVEYOR BELT */}
          <div className="w-full max-w-7xl mb-16 relative px-4">
            <div className="flex gap-6 pt-20 pb-10 px-10 bg-black/40 rounded-[3rem] border-2 border-white/5 overflow-x-auto scrollbar-hide min-h-[380px] items-start shadow-inner">
              <AnimatePresence mode="popLayout">
                {belt.map((card, i) => (
                  <motion.div key={`${card.id}-${i}`} layout initial={{ opacity: 0, scale: 0.8, x: 50 }} animate={{ opacity: 1, scale: 1, x: 0 }} exit={{ opacity: 0, scale: 0.5, x: -100 }} transition={{ type: "spring", stiffness: 300, damping: 30 }} className="relative flex-shrink-0">
                    {i === 0 && (<motion.div animate={{ y: [0, -10, 0] }} transition={{ repeat: Infinity, duration: 1.5 }} className="absolute -top-14 left-1/2 -translate-x-1/2 bg-cyan-500 text-black text-[9px] font-black px-4 py-1.5 rounded-full shadow-[0_0_20px_rgba(6,182,212,0.6)] z-30 whitespace-nowrap">🚀 TARGET ACQUISITION</motion.div>)}
                    <Card card={card} isHidden={i === 0 ? false : i >= beltSpeed} />
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        </>
      ) : (
        // PHASE 2: CONSTRUCTION
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-5xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            <div className="bg-slate-800/50 p-8 rounded-[2rem] border border-white/10 shadow-xl">
              <h3 className="text-cyan-400 font-black mb-6 uppercase tracking-widest text-sm italic">01. Select Production Unit</h3>
              <div className="space-y-4">
                {wonCards.filter(c => c.type === 'ProductionUnit').map(unit => (
                  <button key={unit.id} onClick={() => setSelectedUnitId(unit.id)}
                    className={`w-full text-left p-5 rounded-2xl border-2 transition-all ${selectedUnitId === unit.id ? 'border-cyan-400 bg-cyan-400/10' : 'border-white/5 bg-black/20'}`}
                  >
                    <div className="flex justify-between items-center"><span className="font-black text-white uppercase">{unit.name}</span><span className="text-[10px] bg-yellow-400 text-black px-2 py-0.5 rounded-full font-bold">+{unit.bonusPerWidget} PTS</span></div>
                    <p className="text-[10px] text-slate-400 mt-1">Recipe: {Object.entries(unit.recipe || {}).map(([k,v]) => `${v}x ${k}`).join(', ')}</p>
                    <div className="flex gap-1 mt-3">{wonCards.filter(r => r.assignedToUnitId === unit.id).map(r => (<div key={r.id} className="w-3 h-3 bg-cyan-400 rounded-full shadow-[0_0_10px_rgba(6,182,212,0.5)]" />))}</div>
                  </button>
                ))}
              </div>
            </div>
            <div className="bg-slate-800/50 p-8 rounded-[2rem] border border-white/10 shadow-xl">
              <h3 className="text-slate-400 font-black mb-6 uppercase tracking-widest text-sm italic">02. Install Robots</h3>
              <div className="flex flex-wrap gap-2">
                {wonCards.filter(c => c.type === 'Robot' && !c.assignedToUnitId).map(robot => (
                  <button key={robot.id} onClick={() => handleAssign(robot.id)}
                    className="p-3 bg-slate-700 hover:bg-cyan-500 hover:text-black rounded-xl text-[10px] font-bold transition-all border border-white/5 min-w-[80px]"
                  >
                    <span className="uppercase">{robot.name}</span><span className="opacity-60 block mt-1">{robot.symbols?.join(', ')}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
          <div className="bg-slate-800 p-10 rounded-[3rem] border-t-4 border-yellow-400 shadow-2xl text-center">
            <h2 className="text-yellow-400 font-black text-xs uppercase mb-4 tracking-[0.5em]">Final Efficiency Audit</h2>
            <div className="flex justify-center gap-12 items-center mb-8">
              <div className="text-center"><p className="text-slate-500 text-[10px] uppercase">Base Points</p><p className="text-3xl font-bold">+{userScore}</p></div>
              <div className="text-center"><p className="text-slate-500 text-[10px] uppercase">Widget Bonus</p><p className="text-3xl font-bold text-cyan-400">{finalBonus >= 0 ? `+${finalBonus}` : finalBonus}</p></div>
              <div className="text-center"><p className="text-yellow-400 text-[10px] uppercase font-black">Total Score</p><p className="text-6xl font-black">{userScore + finalBonus}</p></div>
            </div>
            <button onClick={() => window.location.reload()} className="bg-white text-black px-12 py-4 rounded-full font-black uppercase tracking-widest hover:bg-yellow-400 transition-all shadow-xl">Restart Simulation</button>
          </div>
        </motion.div>
      )}
      <footer className="mt-20 opacity-30 text-[9px] uppercase tracking-widest pb-8">Built by Yu Liang Ang | Waikato Software Engineering</footer>
    </div>
  );
}