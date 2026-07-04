/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { RotateCcw, Heart } from 'lucide-react';
import MoonNarrator, { MoonState } from './MoonNarrator';
import { BIRTHDAY_IMAGES } from '../utils/images';
import { audio } from '../utils/audio';
import SafeImage from './SafeImage';

interface ChapterFinalProps {
  onRestart: () => void;
}

export default function ChapterFinal({ onRestart }: ChapterFinalProps) {
  const [moonState, setMoonState] = useState<MoonState>('happy');
  const [finalText, setFinalText] = useState('');
  const [showRestart, setShowRestart] = useState(false);
  const [photoVisible, setPhotoVisible] = useState(false);

  const finalGreeting = " Some people become family by birth. Some become home through their love. For us... you are both. May your dreams grow bigger, your smile grow brighter, and your happiness never fade. Happy Birthday Greeshma   ";

  useEffect(() => {
    // Softly fade background music down a bit for calm reflection
    audio.startAmbientMusic();

    // 1. Fade photo in after 1 second
    const photoTimer = setTimeout(() => {
      setPhotoVisible(true);
    }, 1200);

    // 2. Start typewriter animation after 2.5 seconds
    const typeTimer = setTimeout(() => {
      const chars = Array.from(finalGreeting); // Use Array.from to correctly split emoji/unicode chars
      let index = 0;
      const interval = setInterval(() => {
        setFinalText((prev) => prev + chars[index]);
        index++;
        if (index >= chars.length) {
          clearInterval(interval);

          // 3. Float moon up and wave goodbye after typewriter finishes
          setTimeout(() => {
            setMoonState('waving');
            setTimeout(() => {
              setMoonState('floatingUp');
              // 4. Reveal replay options
              setTimeout(() => {
                setShowRestart(true);
              }, 4000);
            }, 2500);
          }, 1500);
        }
      }, 70);
    }, 2800);

    return () => {
      clearTimeout(photoTimer);
      clearTimeout(typeTimer);
    };
  }, []);

  return (
    <div className="min-h-screen w-full relative z-10 flex flex-col items-center justify-center p-6 overflow-hidden">

      {/* Soft gradient spotlights */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-yellow-400/5 rounded-full blur-3xl animate-pulse-slow"></div>
      </div>

      <div className="w-full max-w-4xl flex flex-col lg:flex-row items-center justify-center gap-12 lg:gap-16 z-20">

        {/* Left Side: Greeshma's framed elegant portrait */}
        <AnimatePresence>
          {photoVisible && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 1.5, ease: 'easeOut' }}
              className="w-full max-w-xs shrink-0"
            >
              <div className="bg-slate-900 p-3 rounded-3xl border border-white/10 shadow-3xl hover:border-yellow-400/20 hover:shadow-yellow-400/5 transition-all duration-700 relative group">
                <div className="absolute inset-0 bg-yellow-300/5 rounded-3xl blur-md group-hover:bg-yellow-300/10 transition-colors" />

                {/* Image frame */}
                <div className="relative aspect-3/4 overflow-hidden rounded-2xl border border-white/5 shadow-inner">
                  <SafeImage
                    customSrc={BIRTHDAY_IMAGES.recent.custom}
                    fallbackSrc={BIRTHDAY_IMAGES.recent.default}
                    assetKey="recent"
                    alt="Birthday Queen Greeshma"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[4s]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent" />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Right Side: The Moon narrative ending & typed quote */}
        <div className="flex-1 flex flex-col items-center lg:items-start text-center lg:text-left max-w-md">

          <div className="mb-4">
            <MoonNarrator state={moonState} />
          </div>

          <div className="min-h-40 flex flex-col justify-start w-full">
            <p className="font-serif text-lg md:text-xl leading-relaxed text-yellow-100/90 tracking-wide drop-shadow-md">
              {finalText}
              {/* Typewriter pulse cursor */}
              {finalText.length > 0 && Array.from(finalText).length < Array.from(finalGreeting).length && (
                <span className="inline-block w-2 h-5 bg-yellow-400 ml-1 animate-pulse" />
              )}
            </p>
          </div>

          {/* Gentle falling stars/thank you note below */}
          <AnimatePresence>
            {showRestart && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.0 }}
                className="mt-8 flex flex-col items-center lg:items-start w-full gap-4"
              >
                <div className="text-xs uppercase tracking-[0.2em] text-yellow-100/60 font-semibold flex items-center gap-2">
                  <Heart className="w-3.5 h-3.5 fill-current text-yellow-100/80" /> Crafted with love by your cousins
                </div>

                <button
                  id="replay-journey-btn"
                  onClick={() => {
                    audio.playPop();
                    onRestart();
                  }}
                  className="px-10 py-3 bg-yellow-100 text-slate-900 rounded-full font-bold uppercase text-xs tracking-widest hover:bg-white transition-colors duration-300 active:scale-95 flex items-center gap-2 cursor-pointer shadow-xl"
                >
                  <RotateCcw className="w-3.5 h-3.5" /> Replay Journey
                </button>
              </motion.div>
            )}
          </AnimatePresence>

        </div>

      </div>
    </div>
  );
}
