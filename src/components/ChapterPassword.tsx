/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';
import MoonNarrator, { MoonState } from './MoonNarrator';
import { audio } from '../utils/audio';

interface ChapterPasswordProps {
  onSuccess: () => void;
}

export default function ChapterPassword({ onSuccess }: ChapterPasswordProps) {
  const [password, setPassword] = useState('');
  const [moonState, setMoonState] = useState<MoonState>('happy');
  const [moonBubble, setMoonBubble] = useState("Ee surprise open cheyyali ante, naku oka secret password cheppali! Hint: Your Favourite Ice Cream 🍦");
  const [isShaking, setIsShaking] = useState(false);
  const [isLocked, setIsLocked] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isLocked) return;

    const trimmed = password.trim().toLowerCase();
    
    // Accept multiple flexible variations
    const isCorrect = 
      trimmed === 'vanilla' || 
      trimmed === 'vanila' || 
      trimmed === 'vanilla ice cream' || 
      trimmed === 'vanilla icecream' || 
      trimmed === 'vanila icecream' ||
      trimmed === 'vanila ice cream';

    if (isCorrect) {
      setIsLocked(true);
      setMoonState('excited');
      setMoonBubble("YAYY! Adheee! Absolutely correct! 🎉 Ippudu chudandi real magic...");
      
      // Delay transition to let the excitement sink in
      setTimeout(() => {
        onSuccess();
      }, 2400);
    } else {
      // Wrong password
      setIsShaking(true);
      setMoonState('incorrect');
      setMoonBubble("Mastaruuuu 😂 Konchem alochinchi malli try cheyyuuu...thappu password adhi!");
      
      // Reset shake and moon state after a moment
      setTimeout(() => {
        setIsShaking(false);
        setMoonState('happy');
      }, 1000);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 relative z-10">
      <div className="w-full max-w-lg flex flex-col items-center">
        {/* Cute reactive moon above */}
        <MoonNarrator state={moonState} textBubble={moonBubble} />

        {/* Password input card */}
        <motion.div
          animate={isShaking ? { x: [-10, 10, -10, 10, -5, 5, 0] } : {}}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md mt-8 p-8 rounded-3xl bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl flex flex-col items-center relative overflow-hidden group"
        >
          {/* Glowing back decoration */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-200/5 rounded-full blur-2xl group-hover:bg-yellow-200/10 transition-all duration-500"></div>

          <form onSubmit={handleSubmit} className="relative z-10 w-full flex flex-col items-center">
            <label htmlFor="ice-cream-input" className="text-xs uppercase tracking-[0.2em] text-yellow-100/60 mb-2 block text-center font-bold font-sans">
              Secret Access Code
            </label>
            <p className="text-xs text-slate-400 mb-6 text-center italic">
              Hint: Your Favourite Ice Cream 🍦
            </p>

            <div className="relative w-full group">
              <input
                id="ice-cream-input"
                type="text"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter the magic word..."
                className="w-full bg-white/5 border border-white/10 rounded-full py-4 px-6 text-center text-lg focus:outline-none focus:ring-2 focus:ring-yellow-200/50 transition-all placeholder:text-slate-600 text-slate-100 font-sans"
                disabled={isLocked}
                autoFocus
              />
              <span className="absolute right-5 top-1/2 -translate-y-1/2 text-2xl select-none animate-bounce">
                🍦
              </span>
            </div>

            <button
              id="unlock-surprise-btn"
              type="submit"
              disabled={isLocked || !password.trim()}
              className={`w-full mt-6 px-10 py-3 rounded-full font-bold uppercase text-xs tracking-widest transition-all duration-300 shadow-xl flex items-center justify-center gap-2 cursor-pointer ${
                isLocked 
                ? 'bg-emerald-500 text-slate-900 font-extrabold' 
                : 'bg-yellow-100 text-slate-900 hover:bg-white active:scale-95'
              }`}
            >
              {isLocked ? "Unlocking Journey... ✨" : "Unlock Journey 🔓"}
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
