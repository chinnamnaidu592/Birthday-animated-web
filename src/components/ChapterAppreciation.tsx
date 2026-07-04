/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';
import { Sparkles, Heart } from 'lucide-react';
import { audio } from '../utils/audio';

interface ChapterAppreciationProps {
  onNext: () => void;
}

export default function ChapterAppreciation({ onNext }: ChapterAppreciationProps) {
  return (
    <div className="min-h-screen w-full relative z-10 py-20 px-6 flex flex-col items-center justify-center overflow-hidden">

      {/* Decorative cosmic background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl" style={{ animation: 'pulse 4s ease-in-out infinite' }}></div>
        <div className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-rose-600/10 rounded-full blur-3xl" style={{ animation: 'pulse 4s ease-in-out infinite', animationDelay: '2s' }}></div>
      </div>

      <div className="w-full max-w-2xl flex flex-col items-center z-10">

        {/* Section label */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="flex items-center gap-3 mb-8"
        >
          <Heart className="w-5 h-5 text-pink-400 fill-current" style={{ filter: 'drop-shadow(0 0 8px rgba(244,63,94,0.5))' }} />
          <span className="text-xs uppercase tracking-widest text-pink-300/80 font-bold font-mono">
            Letter of Love
          </span>
          <Heart className="w-5 h-5 text-pink-400 fill-current" style={{ filter: 'drop-shadow(0 0 8px rgba(244,63,94,0.5))' }} />
        </motion.div>

        {/* ── The Letter Frame ── */}
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 24 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.9, ease: 'easeOut', delay: 0.25 }}
          className="w-full rounded-2xl overflow-hidden"
          style={{
            background: '#ffffff',
            boxShadow: '0 25px 60px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.1)',
          }}
        >
          {/* Top colour bar */}
          <div style={{ height: 6, background: 'linear-gradient(to right, #f472b6, #fb7185, #a78bfa)' }} />

          {/* Letter body */}
          <div style={{ padding: '40px 48px', fontFamily: 'Georgia, serif', color: '#1e293b' }}>

            {/* Date line */}
            <p style={{ fontSize: 13, color: '#94a3b8', marginBottom: 24, textAlign: 'right', fontStyle: 'italic' }}>
              July 5, 2026
            </p>

            {/* Greeting */}
            <p style={{ fontSize: 20, fontWeight: 600, color: '#334155', marginBottom: 28, fontStyle: 'italic' }}>
              Dear Greeshma,
            </p>

            {/* Body paragraphs */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20, fontSize: 17, lineHeight: 1.85, color: '#374151' }}>
              <p>
                You may not realize it, but your smile has a way of making people feel at home.
              </p>
              <p>
                You care without expecting anything in return.
              </p>
              <p>
                You support everyone around you. You are our pillar of strength.
              </p>
              <p>
                You make ordinary moments absolutely unforgettable.
              </p>
              <p>
                Thank you for being our wonderful, beloved Akkayyaaa.
              </p>
            </div>

            {/* Divider */}
            <div style={{ borderTop: '1px solid #e2e8f0', margin: '32px 0' }} />

            {/* Sign-off */}
            <div style={{ textAlign: 'right' }}>
              <p style={{ fontSize: 14, color: '#94a3b8', fontStyle: 'italic', marginBottom: 6 }}>With all our love,</p>
              <p style={{ fontSize: 18, fontWeight: 700, color: '#f43f5e', fontStyle: 'italic' }}>
                Your Cousins &amp; Family
              </p>
            </div>
          </div>

          {/* Bottom colour bar */}
          <div style={{ height: 6, background: 'linear-gradient(to right, #a78bfa, #fb7185, #f472b6)' }} />
        </motion.div>

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.9 }}
          className="mt-10"
        >
          <button
            id="celebration-ready-btn"
            onClick={() => {
              audio.playPop();
              audio.startCelebrationMusic();
              onNext();
            }}
            className="px-10 py-3.5 bg-yellow-100 text-slate-900 rounded-full font-bold uppercase text-xs tracking-widest hover:bg-white transition-colors duration-300 active:scale-95 flex items-center gap-2 shadow-xl cursor-pointer"
          >
            <Sparkles className="w-4 h-4 fill-current" /> Start Celebration
          </button>
        </motion.div>

      </div>
    </div>
  );
}
