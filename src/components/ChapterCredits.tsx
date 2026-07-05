/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { audio } from '../utils/audio';

interface ChapterCreditsProps {
  onRestart: () => void;
}

export default function ChapterCredits({ onRestart }: ChapterCreditsProps) {
  const [showCredits, setShowCredits] = useState(false);

  useEffect(() => {
    // Start credits animation after a brief delay
    const startTimer = setTimeout(() => {
      setShowCredits(true);
    }, 500);

    // After credits display, fade out to black and then restart
    const exitTimer = setTimeout(() => {
      // After 11 seconds (fade in 2s + display 6s + fade out 3s), show restart button or auto-restart
      setShowCredits(false);
      
      // Auto-restart after a final black screen
      setTimeout(() => {
        onRestart();
      }, 2000);
    }, 11000);

    return () => {
      clearTimeout(startTimer);
      clearTimeout(exitTimer);
    };
  }, [onRestart]);

  return (
    <div 
      className="min-h-screen w-full flex flex-col items-center justify-center p-6 overflow-hidden relative z-10"
      style={{
        backgroundImage: "url('/images/prakash_greeshma.jpg')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
      }}
    >
      {/* Black gradient overlay for text readability (50-60% opacity) */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/55 to-black/60" />

      {/* Credits content - centered */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={
          showCredits
            ? { opacity: 1, y: 0 }
            : { opacity: 0, y: 20 }
        }
        transition={{
          duration: 2.5,
          ease: 'easeInOut',
        }}
        className="relative z-20 flex flex-col items-center text-center"
      >
        {/* Small elegant header text */}
        <p className="font-serif text-lg md:text-xl text-[#F8F8F8]/80 tracking-[0.15em] uppercase mb-8 font-light">
          Story • Screenplay • Direction
        </p>

        {/* Hero title - significantly larger */}
        <h1 className="font-serif text-5xl md:text-7xl text-[#F8F8F8] font-bold tracking-[0.08em] leading-tight">
          Om Prakash
        </h1>
      </motion.div>

      {/* Optional: Restart button after credits fade - appears on black screen */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={!showCredits ? { opacity: 1 } : { opacity: 0 }}
        transition={{ delay: 1, duration: 1.5 }}
        className="absolute bottom-10 text-center z-20"
      >
        <button
          onClick={() => onRestart()}
          className="px-8 py-3 text-sm font-sans tracking-widest uppercase text-white/60 hover:text-white/90 border border-white/30 hover:border-white/50 rounded-full transition-all duration-300"
        >
          Begin Again ✨
        </button>
      </motion.div>
    </div>
  );
}
