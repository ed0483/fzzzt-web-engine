import { motion } from 'framer-motion';

export const Instructions = ({ onClose }: { onClose: () => void }) => (
  <motion.div 
    initial={{ opacity: 0 }} animate={{ opacity: 1 }}
    className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
  >
    <div className="bg-slate-800 border-2 border-cyan-500/50 p-8 rounded-3xl max-w-lg shadow-2xl">
      <h2 className="text-3xl font-black text-cyan-400 mb-4 tracking-tighter">HOW TO PLAY</h2>
      <ul className="space-y-3 text-slate-200 text-sm">
        <li>🤖 <span className="text-white font-bold">The Goal:</span> Collect robots and build widgets to get the highest score.</li>
        <li>⚡ <span className="text-white font-bold">The Auction:</span> Bid for the first card on the belt. Highest number wins. <span className="text-yellow-400">You win all ties!</span></li>
        <li>🔍 <span className="text-white font-bold">Belt Speed:</span> The number on the head card reveals how many cards you can see ahead. Use this to save your big cards!</li>
        <li>⚙️ <span className="text-white font-bold">Widgets:</span> Match robot symbols (Nut, Cog, etc.) to your Production Units for massive bonuses.</li>
        <li>⚠️ <span className="text-white font-bold">Penalty:</span> If you own a Production Unit but can't fill it, you LOSE points.</li>
      </ul>
      <button 
        onClick={onClose}
        className="mt-8 w-full bg-cyan-500 hover:bg-cyan-400 text-black font-black py-3 rounded-xl transition-all"
      >
        START ENGINE
      </button>
    </div>
  </motion.div>
);