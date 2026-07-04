/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import { motion, useAnimation } from 'motion/react';
import { audio } from '../utils/audio';

export type MoonState = 'sleeping' | 'falling' | 'happy' | 'waving' | 'incorrect' | 'excited' | 'floatingUp';

interface MoonNarratorProps {
  state: MoonState;
  textBubble?: string;
  onFallingComplete?: () => void;
}

export default function MoonNarrator({ state, textBubble, onFallingComplete }: MoonNarratorProps) {
  const controls = useAnimation();
  const [blink, setBlink] = useState(false);

  // Auto eye-blinking timer for life-like presence
  useEffect(() => {
    const blinkInterval = setInterval(() => {
      if (state !== 'sleeping') {
        setBlink(true);
        setTimeout(() => setBlink(false), 150);
      }
    }, 4000);
    return () => clearInterval(blinkInterval);
  }, [state]);

  // Handle triggering animations when the state prop changes
  useEffect(() => {
    const triggerStateAnimation = async () => {
      if (state === 'falling') {
        audio.playBounce();
        // Epic Pixar bounce fall from off-screen
        await controls.start({
          y: [-500, 0, -40, 0, -15, 0],
          rotate: [15, -10, 5, -2, 0],
          transition: {
            duration: 1.6,
            times: [0, 0.5, 0.7, 0.85, 0.93, 1],
            ease: 'easeOut',
          },
        });
        if (onFallingComplete) onFallingComplete();
      } else if (state === 'incorrect') {
        audio.playIncorrectBuzzer();
        // Shake animation for failure
        await controls.start({
          x: [0, -12, 10, -8, 6, -3, 0],
          rotate: [0, -3, 3, -2, 2, -1, 0],
          transition: { duration: 0.55 },
        });
      } else if (state === 'excited') {
        audio.playCorrectChime();
        // Jumping and rotating with joy
        await controls.start({
          y: [0, -50, 0, -30, 0],
          scale: [1, 1.15, 0.95, 1.05, 1],
          transition: { duration: 1.0, times: [0, 0.25, 0.5, 0.75, 1] },
        });
      } else if (state === 'floatingUp') {
        // Slowly float up to sky-high
        await controls.start({
          y: -300,
          scale: 0.4,
          opacity: 0.9,
          transition: { duration: 5, ease: 'easeInOut' }
        });
      } else {
        // Standard idle floating animation
        controls.start({
          y: [0, -10, 0],
          transition: {
            duration: 5,
            repeat: Infinity,
            ease: 'easeInOut',
          },
        });
      }
    };

    triggerStateAnimation();
  }, [state, controls]);

  return (
    <div className="flex flex-col items-center justify-center select-none py-4">
      <motion.div
        animate={controls}
        className="relative w-48 h-48 cursor-pointer drop-shadow-[0_0_35px_rgba(253,224,71,0.55)]"
        onClick={() => {
          audio.playPop();
          // Cute little tickle jump on tap
          controls.start({
            scale: [1, 1.1, 0.95, 1],
            transition: { duration: 0.4 }
          });
        }}
      >
        <svg
          viewBox="0 0 200 200"
          className="w-full h-full fill-yellow-200"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Main Moon Body with soft inner gradient and craters */}
          <defs>
            <radialGradient id="moonGlow" cx="50%" cy="50%" r="50%" fx="30%" fy="30%">
              <stop offset="0%" stopColor="#fffbeb" />
              <stop offset="65%" stopColor="#fef08a" />
              <stop offset="100%" stopColor="#facc15" />
            </radialGradient>
            <filter id="softGlow">
              <feGaussianBlur stdDeviation="6" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>
          
          {/* Outer Atmosphere Glow */}
          <circle cx="100" cy="100" r="92" fill="#fef08a" opacity="0.25" filter="url(#softGlow)" />
          
          {/* Main Moon Sphere */}
          <circle cx="100" cy="100" r="82" fill="url(#moonGlow)" />

          {/* Cute Soft Craters (Pixar aesthetic) */}
          <circle cx="65" cy="55" r="10" fill="#eab308" opacity="0.18" />
          <circle cx="140" cy="75" r="14" fill="#eab308" opacity="0.15" />
          <circle cx="80" cy="145" r="8" fill="#eab308" opacity="0.18" />
          <circle cx="125" cy="135" r="12" fill="#eab308" opacity="0.12" />

          {/* Glowing Blushing Cheeks */}
          <ellipse cx="62" cy="115" rx="10" ry="6" fill="#f43f5e" opacity="0.55" />
          <ellipse cx="138" cy="115" rx="10" ry="6" fill="#f43f5e" opacity="0.55" />

          {/* Eyes (Blinking, Sad, Excited, Sleeping) */}
          {state === 'sleeping' ? (
            // Sweet sleeping eyelids
            <g stroke="#854d0e" strokeWidth="4" strokeLinecap="round" fill="none">
              <path d="M 52,102 Q 62,110 72,102" />
              <path d="M 128,102 Q 138,110 148,102" />
            </g>
          ) : blink ? (
            // Eyelids during instant blink
            <g stroke="#854d0e" strokeWidth="4.5" strokeLinecap="round" fill="none">
              <line x1="52" y1="105" x2="72" y2="105" />
              <line x1="128" y1="105" x2="148" y2="105" />
            </g>
          ) : state === 'excited' ? (
            // Sparkly star eyes
            <g fill="#ca8a04">
              {/* Left Star Eye */}
              <path d="M 62,90 L 65,98 L 73,98 L 67,103 L 69,111 L 62,106 L 55,111 L 57,103 L 51,98 L 59,98 Z" />
              {/* Right Star Eye */}
              <path d="M 138,90 L 141,98 L 149,98 L 143,103 L 145,111 L 138,106 L 131,111 L 133,103 L 127,98 L 135,98 Z" />
            </g>
          ) : state === 'incorrect' ? (
            // Cute cross eyes or sweat droplet
            <g>
              {/* Confused/worried cartoon eyes */}
              <ellipse cx="64" cy="103" rx="8" ry="8" fill="#451a03" />
              <circle cx="66" cy="101" r="2.5" fill="#ffffff" />
              
              <ellipse cx="136" cy="103" rx="8" ry="8" fill="#451a03" />
              <circle cx="134" cy="101" r="2.5" fill="#ffffff" />
              
              {/* Wiggle Sweat Drop */}
              <path d="M 152,85 Q 160,95 152,100 Q 146,95 152,85 Z" fill="#38bdf8" />
            </g>
          ) : (
            // Normal adorable big eyes
            <g fill="#451a03">
              <ellipse cx="64" cy="103" rx="9" ry="12" />
              <circle cx="67" cy="98" r="4" fill="#ffffff" />
              <circle cx="61" cy="106" r="1.5" fill="#ffffff" />

              <ellipse cx="136" cy="103" rx="9" ry="12" />
              <circle cx="133" cy="98" r="4" fill="#ffffff" />
              <circle cx="139" cy="106" r="1.5" fill="#ffffff" />
            </g>
          )}

          {/* Adorable Expression Mouth */}
          {state === 'sleeping' ? (
            // Soft quiet resting line
            <path d="M 94,118 Q 100,122 106,118" stroke="#854d0e" strokeWidth="3" strokeLinecap="round" fill="none" />
          ) : state === 'incorrect' ? (
            // Unhappy wavy line
            <path d="M 92,124 Q 100,116 108,124" stroke="#854d0e" strokeWidth="3.5" strokeLinecap="round" fill="none" />
          ) : state === 'excited' ? (
            // Big open happy mouth
            <g>
              <path d="M 90,118 Q 100,138 110,118 Z" fill="#991b1b" />
              <path d="M 94,124 Q 100,118 106,124" fill="#f43f5e" />
            </g>
          ) : (
            // Warm smiling mouth
            <path d="M 92,118 Q 100,130 108,118" stroke="#854d0e" strokeWidth="4" strokeLinecap="round" fill="none" />
          )}

          {/* Cute Little Waving Arm / Hand */}
          {state === 'waving' || state === 'happy' ? (
            <motion.path
              d="M 155,120 Q 175,100 180,105 Q 170,125 152,125 Z"
              fill="#fef08a"
              stroke="#ca8a04"
              strokeWidth="2"
              animate={{ rotate: [0, -15, 10, -15, 0] }}
              transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
              style={{ originX: '155px', originY: '120px' }}
            />
          ) : null}
        </svg>

        {/* Soft glowing particle cloud behind the moon */}
        <div className="absolute inset-0 bg-yellow-300/10 rounded-full blur-2xl -z-10 animate-pulse-slow"></div>
      </motion.div>

      {/* Cinematic narrative dialog bubble */}
      {textBubble && (
        <motion.div
          initial={{ opacity: 0, scale: 0.85, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          className="mt-6 max-w-sm glass rounded-2xl px-6 py-4 shadow-2xl relative text-center border-white/20"
        >
          {/* Little tail pointing to the moon */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-2 w-4 h-4 glass rotate-45 border-t border-l border-white/20 !bg-slate-900/40"></div>
          
          <p 
            style={{ width: '340px' }}
            className="text-white font-sans text-sm md:text-base leading-relaxed tracking-wide select-none drop-shadow"
          >
            {textBubble}
          </p>
        </motion.div>
      )}
    </div>
  );
}
