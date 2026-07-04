/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { BIRTHDAY_IMAGES } from '../utils/images';
import { ChevronDown, Sparkles } from 'lucide-react';
import { audio } from '../utils/audio';
import SafeImage from './SafeImage';

interface ChapterTimelineProps {
  onNext: () => void;
}

export default function ChapterTimeline({ onNext }: ChapterTimelineProps) {
  const [scrollProgress, setScrollProgress] = useState(0);

  // Track simple container scroll to morph background from sunrise to golden day
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const target = e.currentTarget;
    const progress = target.scrollTop / (target.scrollHeight - target.clientHeight);
    setScrollProgress(progress);
  };

  // Sound effect on load
  useEffect(() => {
    audio.playCorrectChime();
  }, []);

  return (
    <div
      onScroll={handleScroll}
      className="min-h-screen w-full overflow-y-auto relative transition-colors duration-1000 scrollbar-none z-10"
      style={{
        background: `linear-gradient(to bottom, 
          rgba(11, 12, 30, 0.95) 0%, 
          rgba(79, 43, 102, ${0.95 - scrollProgress * 0.4}) 30%, 
          rgba(217, 119, 6, ${scrollProgress * 0.4}) 70%, 
          rgba(254, 240, 138, ${scrollProgress * 0.6}) 100%)`
      }}
    >
      {/* Interactive floating cherry petals */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-20">
        {[...Array(12)].map((_, idx) => (
          <motion.div
            key={idx}
            className="absolute text-pink-300 text-lg opacity-70"
            style={{
              left: `${10 + idx * 8}%`,
              top: `${-10 + Math.random() * 20}%`
            }}
            animate={{
              y: ['0vh', '110vh'],
              x: ['0px', `${(idx % 2 === 0 ? 50 : -50)}px`],
              rotate: [0, 360]
            }}
            transition={{
              duration: 10 + idx * 2,
              repeat: Infinity,
              ease: 'linear',
              delay: idx * 0.5
            }}
          >
            🌸
          </motion.div>
        ))}
      </div>

      <div className="max-w-2xl mx-auto px-6 py-20 flex flex-col items-center relative min-h-screen">
        {/* Cinematic Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16 relative"
        >
          <span className="text-xs uppercase tracking-[0.2em] text-yellow-100/60 mb-3 block">
            The Flow of Time
          </span>
          <h2 className="text-4xl md:text-5xl font-serif italic text-yellow-100 tracking-wide">
            Greeshma's Journey
          </h2>
          <div className="w-16 h-[2px] bg-yellow-100/30 mx-auto mt-4 rounded-full"></div>
        </motion.div>

        {/* The Timeline Path & Cards */}
        <div className="relative w-full flex flex-col items-center gap-24 mt-8">
          
          {/* Animated SVG Winding Connection Path */}
          <div className="absolute top-28 bottom-28 w-1 flex justify-center z-0">
            <div className="w-[3px] h-full bg-gradient-to-b from-purple-500/50 via-pink-500/50 to-yellow-400/80 relative rounded-full">
              {/* Flowing temporal light particle stream */}
              <motion.div
                animate={{ y: ['0%', '100%'] }}
                transition={{ repeat: Infinity, duration: 4, ease: 'linear' }}
                className="absolute left-1/2 -translate-x-1/2 w-4 h-12 bg-gradient-to-b from-white to-transparent blur-xs"
              />
              <motion.div
                animate={{ y: ['0%', '100%'] }}
                transition={{ repeat: Infinity, duration: 3.2, ease: 'linear', delay: 1.5 }}
                className="absolute left-1/2 -translate-x-1/2 w-3 h-8 bg-gradient-to-b from-yellow-300 to-transparent blur-xs"
              />
            </div>
          </div>

          {/* Childhood Photo Card */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            className="w-full max-w-sm glass rounded-3xl p-5 border border-white/10 shadow-2xl relative z-10 hover:shadow-yellow-400/10 hover:border-yellow-400/20 transition-all duration-300 group"
          >
            <div className="relative rounded-2xl overflow-hidden aspect-3/4 shadow-inner mb-4">
              <SafeImage
                customSrc={BIRTHDAY_IMAGES.childhood.custom}
                fallbackSrc={BIRTHDAY_IMAGES.childhood.default}
                assetKey="childhood"
                alt="Greeshma's childhood"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-80" />
              <span className="absolute bottom-4 left-4 font-sans text-xs uppercase tracking-widest font-semibold text-rose-300 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" /> Early Days
              </span>
            </div>
            <h3 className="font-serif text-xl font-medium text-white mb-2">The Sweet Little Smile</h3>
            <p className="font-sans text-sm text-slate-300/90 leading-relaxed">
              Where all the beauty, innocence, and warmth began. From the very beginning, your smile carried a special light capable of comforting everyone around you.
            </p>
          </motion.div>

          {/* Intermediary poetic quote */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center py-6 max-w-md relative z-10"
          >
            <p className="font-handwritten text-3xl md:text-4xl text-yellow-300 drop-shadow">
              "From this little smile... to the beautiful person you are today."
            </p>
          </motion.div>

          {/* Recent Photo Card */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            className="w-full max-w-sm glass rounded-3xl p-5 border border-white/10 shadow-2xl relative z-10 hover:shadow-amber-400/10 hover:border-amber-400/20 transition-all duration-300 group"
          >
            <div className="relative rounded-2xl overflow-hidden aspect-3/4 shadow-inner mb-4">
              <SafeImage
                customSrc={BIRTHDAY_IMAGES.recent.custom}
                fallbackSrc={BIRTHDAY_IMAGES.recent.default}
                assetKey="recent"
                alt="Greeshma recently"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-80" />
              <span className="absolute bottom-4 left-4 font-sans text-xs uppercase tracking-widest font-semibold text-amber-300 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" /> Beautiful Today
              </span>
            </div>
            <h3 className="font-serif text-xl font-medium text-white mb-2">Our Wonderful Akkayya</h3>
            <p className="font-sans text-sm text-slate-300/90 leading-relaxed">
              Growing in grace, kindness, and elegance year by year. You became not just an elder sister, but a support system, an advisor, and the heart of our cousins' family.
            </p>
          </motion.div>

        </div>

        {/* Scroll Helper & Next Chapter Button */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="mt-20 flex flex-col items-center gap-6 relative z-20 w-full"
        >
          <div className="flex flex-col items-center text-slate-400/80 animate-pulse text-center">
            <span className="text-xs font-sans tracking-widest uppercase mb-1">Scroll to explore Greeshma's Journey</span>
            <ChevronDown className="w-4 h-4 text-yellow-100" />
          </div>

          <button
            id="continue-cousins-btn"
            onClick={() => {
              audio.playPop();
              onNext();
            }}
            className="px-10 py-3.5 bg-yellow-100 text-slate-900 rounded-full font-bold uppercase text-xs tracking-widest hover:bg-white transition-colors duration-300 active:scale-95 flex items-center gap-2 cursor-pointer shadow-xl mt-4"
          >
            Continue to Cousins' Surprise ✨
          </button>
        </motion.div>
      </div>
    </div>
  );
}
