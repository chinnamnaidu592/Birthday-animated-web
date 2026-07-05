/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import MoonNarrator, { MoonState } from './MoonNarrator';
import { audio } from '../utils/audio';

interface ChapterIntroProps {
  onNext: () => void;
  isAudioInitialized: boolean;
  onInitializeAudio: () => void;
}

export default function ChapterIntro({ onNext, isAudioInitialized, onInitializeAudio }: ChapterIntroProps) {
  const [started, setStarted] = useState(false);
  const [moonState, setMoonState] = useState<MoonState>('sleeping');
  const [narrativeText, setNarrativeText] = useState('');
  const [showNextButton, setShowNextButton] = useState(false);

  // Text typewriter steps
  const line1 = " Hello Greeshma Garuuuuuuu";
  const line2 = "  Mi cousins miku oka message ni pampincharuuu, ento chudali ani undhaaaaaaa...? ";

  useEffect(() => {
    const timer = setTimeout(() => {
      onInitializeAudio();
      audio.startAmbientMusic();
      setStarted(true);
      setMoonState('falling');
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  const handleFallingComplete = () => {
    setMoonState('waving');
    // Start typewriter effect for line 1
    let index = 0;
    const interval = setInterval(() => {
      if (index < line1.length) {
        setNarrativeText((prev) => prev + line1[index]);
        index++;
      } else {
        clearInterval(interval);

        // Wait 2 seconds, then transition to line 2
        setTimeout(() => {
          setMoonState('happy');
          setNarrativeText('');
          let idx2 = 0;
          const intervalG2 = setInterval(() => {
            if (idx2 < line2.length) {
              setNarrativeText((prev) => prev + line2[idx2]);
              idx2++;
            } else {
              clearInterval(intervalG2);
              setShowNextButton(true);
            }
          }, 60);
        }, 2200);
      }
    }, 70);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 relative overflow-hidden">
      <AnimatePresence mode="wait">
        {!started ? (
          // Minimalist loading visual before moon enters
          <motion.div
            key="start-gate"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.8 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 1.0 }}
            className="flex flex-col items-center text-center z-30"
          >
            <div className="h-8 w-8 rounded-full border-2 border-yellow-200/20 border-t-yellow-200 animate-spin mb-4" />
            <p className="font-sans text-xs tracking-[0.25em] text-yellow-100/60 uppercase font-semibold">
              The Moonlight Rises...
            </p>
          </motion.div>
        ) : (
          // Narrative Moon Scene
          <motion.div
            key="narrative-scene"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.2 }}
            className="flex flex-col items-center justify-center w-full z-20"
          >
            <MoonNarrator
              state={moonState}
              textBubble={narrativeText}
              onFallingComplete={handleFallingComplete}
            />

            {showNextButton && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.6 }}
                className="mt-8"
              >
                <button
                  id="reveal-secrets-btn"
                  onClick={() => {
                    audio.playPop();
                    onNext();
                  }}
                  className="px-10 py-3 bg-yellow-100 text-slate-900 rounded-full font-bold uppercase text-xs tracking-widest hover:bg-white transition-colors duration-300 shadow-xl active:scale-95 flex items-center gap-2 cursor-pointer"
                >
                  Let's Find Out! ✨
                </button>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
