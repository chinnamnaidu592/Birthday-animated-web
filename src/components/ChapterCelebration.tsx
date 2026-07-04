/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Mic, Wind, Sparkles, Trophy } from 'lucide-react';
import { audio } from '../utils/audio';

interface ChapterCelebrationProps {
  onNext: () => void;
}

interface FireworkParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  alpha: number;
  size: number;
  decay: number;
}

interface Balloon {
  id: number;
  x: number;
  y: number;
  size: number;
  speed: number;
  color: string;
  wobbleSpeed: number;
  wobbleRange: number;
}

export default function ChapterCelebration({ onNext }: ChapterCelebrationProps) {
  const [candlesBlown, setCandlesBlown] = useState(false);
  const [micActive, setMicActive] = useState(false);
  const [micVolume, setMicVolume] = useState(0);
  const [showPrompt, setShowPrompt] = useState(true);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const micStreamRef = useRef<MediaStream | null>(null);

  // Fireworks, Balloons and Confetti data
  const particlesRef = useRef<FireworkParticle[]>([]);
  const balloonsRef = useRef<Balloon[]>([]);

  // Sound and setup
  useEffect(() => {
    // Start/Ensure celebration theme is rocking!
    audio.startCelebrationMusic();

    // Initialize 15 colorful background balloons
    const balloonColors = ['#f43f5e', '#ec4899', '#ca8a04', '#10b981', '#3b82f6', '#8b5cf6'];
    const balloons: Balloon[] = [];
    for (let i = 0; i < 15; i++) {
      balloons.push({
        id: i,
        x: Math.random() * window.innerWidth,
        y: window.innerHeight + Math.random() * 400 + 100,
        size: Math.random() * 30 + 35,
        speed: Math.random() * 1.5 + 1.0,
        color: balloonColors[Math.floor(Math.random() * balloonColors.length)],
        wobbleSpeed: Math.random() * 0.02 + 0.01,
        wobbleRange: Math.random() * 15 + 10
      });
    }
    balloonsRef.current = balloons;

    // Start Canvas loop
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    const triggerExplosion = (x: number, y: number) => {
      audio.playFirework();
      const fireworkColors = ['#ff0055', '#00ffcc', '#ffcc00', '#9900ff', '#ff6600', '#00ff33'];
      const chosenColor = fireworkColors[Math.floor(Math.random() * fireworkColors.length)];
      for (let i = 0; i < 60; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 6 + 2;
        particlesRef.current.push({
          x,
          y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          color: chosenColor,
          alpha: 1.0,
          size: Math.random() * 3 + 1.5,
          decay: Math.random() * 0.015 + 0.01
        });
      }
    };

    // Main animation loop
    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // 1. Draw Balloons
      balloonsRef.current.forEach(b => {
        b.y -= b.speed;
        b.x += Math.sin(b.y * b.wobbleSpeed) * 0.3; // gentle wobble

        if (b.y < -100) {
          b.y = height + 100;
          b.x = Math.random() * width;
        }

        // Draw balloon
        ctx.save();
        ctx.fillStyle = b.color;
        ctx.beginPath();
        ctx.ellipse(b.x, b.y, b.size * 0.75, b.size, 0, 0, Math.PI * 2);
        ctx.fill();

        // Balloon highlight gloss
        ctx.fillStyle = 'rgba(255, 255, 255, 0.25)';
        ctx.beginPath();
        ctx.ellipse(b.x - b.size * 0.25, b.y - b.size * 0.35, b.size * 0.15, b.size * 0.25, Math.PI / 4, 0, Math.PI * 2);
        ctx.fill();

        // Balloon string
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(b.x, b.y + b.size);
        ctx.quadraticCurveTo(b.x - 5, b.y + b.size + 15, b.x + 5, b.y + b.size + 40);
        ctx.stroke();
        ctx.restore();
      });

      // 2. Draw Firework Particles
      for (let i = particlesRef.current.length - 1; i >= 0; i--) {
        const p = particlesRef.current[i];
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.05; // gravity pull
        p.alpha -= p.decay;

        if (p.alpha <= 0) {
          particlesRef.current.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.globalAlpha = p.alpha;
        ctx.shadowBlur = 8;
        ctx.shadowColor = p.color;
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      // Randomly shoot occasional fireworks when candles are blown
      if (candlesBlown && Math.random() < 0.035) {
        triggerExplosion(Math.random() * width, height * 0.2 + Math.random() * (height * 0.4));
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    // Trigger initial burst references
    window.addEventListener('click_explosion', ((e: CustomEvent) => {
      triggerExplosion(e.detail.x, e.detail.y);
    }) as EventListener);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
      stopMicrophone();
    };
  }, [candlesBlown]);

  // Activate Web Audio analyser for real mic blowing rumbles
  const startMicrophone = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      micStreamRef.current = stream;

      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      const audioCtx = new AudioContextClass();
      audioContextRef.current = audioCtx;

      const source = audioCtx.createMediaStreamSource(stream);
      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 256;
      analyserRef.current = analyser;

      source.connect(analyser);
      setMicActive(true);

      const bufferLength = analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);

      const checkVolume = () => {
        if (!analyserRef.current) return;
        analyserRef.current.getByteFrequencyData(dataArray);

        // Blow sounds create low frequency rumbles (indices 1 to 5)
        let lowFreqEnergy = 0;
        for (let i = 1; i < 6; i++) {
          lowFreqEnergy += dataArray[i];
        }
        const avgLow = lowFreqEnergy / 5;
        setMicVolume(avgLow);

        // If low frequency sound exceeds 65, blow out candles!
        if (avgLow > 65) {
          handleBlowOut();
        } else {
          requestAnimationFrame(checkVolume);
        }
      };

      checkVolume();
    } catch (err) {
      console.warn("Microphone access denied or unsupported, using tap button.", err);
      setMicActive(false);
    }
  };

  const stopMicrophone = () => {
    if (micStreamRef.current) {
      micStreamRef.current.getTracks().forEach(track => track.stop());
      micStreamRef.current = null;
    }
    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }
    analyserRef.current = null;
    setMicActive(false);
  };

  const handleBlowOut = () => {
    if (candlesBlown) return;
    setCandlesBlown(true);
    audio.playCorrectChime();
    stopMicrophone();

    // Trigger multiple dramatic fireworks celebrations instantly!
    setTimeout(() => {
      const e = new CustomEvent('click_explosion', {
        detail: { x: window.innerWidth * 0.25, y: window.innerHeight * 0.3 }
      });
      window.dispatchEvent(e);
    }, 100);

    setTimeout(() => {
      const e = new CustomEvent('click_explosion', {
        detail: { x: window.innerWidth * 0.75, y: window.innerHeight * 0.4 }
      });
      window.dispatchEvent(e);
    }, 450);

    setTimeout(() => {
      const e = new CustomEvent('click_explosion', {
        detail: { x: window.innerWidth * 0.5, y: window.innerHeight * 0.25 }
      });
      window.dispatchEvent(e);
    }, 800);
  };

  return (
    <div className="min-h-screen w-full relative z-10 flex flex-col items-center justify-center p-6 overflow-hidden">

      {/* Sparkles, fireworks and balloon canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none z-10" />

      <div className="w-full max-w-xl flex flex-col items-center relative z-20">

        {/* Celebration Title Heading */}
        <div className="text-center mb-10">
          <motion.span
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="text-xs uppercase tracking-[0.2em] text-yellow-100/60 mb-2 block font-semibold font-sans"
          >
            🎂 Greeshma's Special Moment
          </motion.span>
          <h2 className="text-3.5xl md:text-5xl font-serif italic text-yellow-100 tracking-wide drop-shadow">
            {candlesBlown ? "Happy Birthday Greeshma! 🎉" : "Make a Wish & Blow 🎂"}
          </h2>
        </div>

        {/* The Beautiful 3D CSS Layered Birthday Cake */}
        <div className="relative py-16 flex items-center justify-center">
          <div className="relative flex flex-col items-center">

            {/* Flames and Candles */}
            <div className="flex gap-4 mb-[-8px] relative z-20">
              {[...Array(3)].map((_, idx) => (
                <div key={idx} className="flex flex-col items-center relative">

                  {/* Flickering Flame with smooth keyframes */}
                  <AnimatePresence>
                    {!candlesBlown && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{
                          opacity: 1,
                          scale: [1, 1.15, 0.95, 1.1, 1],
                          y: [0, -2, 1, -1, 0]
                        }}
                        exit={{ opacity: 0, scale: 0, y: -20, transition: { duration: 0.4 } }}
                        transition={{ repeat: Infinity, duration: 1.5 }}
                        className="w-3.5 h-7 rounded-full bg-gradient-to-t from-amber-500 via-yellow-400 to-white absolute -top-8 left-1/2 -translate-x-1/2 blur-2xs drop-shadow-[0_0_12px_rgba(251,191,36,0.85)] origin-bottom"
                      />
                    )}
                  </AnimatePresence>

                  {/* Candle Stick */}
                  <div className="w-2.5 h-12 bg-gradient-to-b from-pink-400 via-rose-400 to-pink-500 rounded-t-sm shadow-md" />
                </div>
              ))}
            </div>

            {/* Cake Layer 1 (Top Layer) */}
            <div className="w-36 h-10 bg-pink-100 rounded-full border-b-[8px] border-pink-200 shadow-md relative z-10 flex items-center justify-center">
              <div className="absolute inset-x-2 bottom-1 h-1 bg-yellow-300 rounded-full opacity-60" />
            </div>

            {/* Cake Layer 2 (Middle Layer) */}
            <div className="w-48 h-12 bg-[#854d0e] rounded-full border-b-[10px] border-[#713f12] shadow-lg relative -mt-5 z-8 flex items-center justify-center">
              {/* White frosting drips */}
              <div className="absolute top-0 inset-x-4 flex justify-around">
                {[...Array(6)].map((_, idx) => (
                  <div key={idx} className="w-3 h-5 bg-pink-100 rounded-b-full shadow-xs" />
                ))}
              </div>
            </div>

            {/* Cake Layer 3 (Bottom Layer) */}
            <div className="w-60 h-16 bg-gradient-to-r from-amber-400 to-yellow-500 rounded-full border-b-[12px] border-amber-500 shadow-2xl relative -mt-6 z-6">
              {/* Cream decoration patterns */}
              <div className="absolute inset-x-4 top-4 flex justify-around opacity-90">
                {[...Array(8)].map((_, idx) => (
                  <div key={idx} className="w-4 h-4 bg-white rounded-full blur-2xs" />
                ))}
              </div>
            </div>

            {/* Silver Plate stand */}
            <div className="w-68 h-6 bg-slate-300 rounded-full border-b-4 border-slate-400 shadow-3xl relative -mt-4 z-4" />
          </div>
        </div>

        {/* Blowing controls console */}
        <div className="w-full mt-8 p-8 rounded-3xl bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl flex flex-col items-center">
          <AnimatePresence mode="wait">
            {!candlesBlown ? (
              <motion.div
                key="blow-panel"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="w-full flex flex-col items-center text-center"
              >
                <p className="text-xs uppercase tracking-[0.2em] text-yellow-100/60 mb-6 block font-bold font-sans">
                  Extinguish the Candles
                </p>

                <div className="flex flex-col sm:flex-row gap-4 w-full">
                  {/* Option 1: Mic sensor */}
                  {!micActive ? (
                    <button
                      id="enable-mic-btn"
                      onClick={startMicrophone}
                      className="flex-1 py-3 px-6 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-white text-xs font-sans tracking-wider font-semibold transition-all duration-300 active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <Mic className="w-4 h-4 text-yellow-100" /> Enable Microphone Blow
                    </button>
                  ) : (
                    <div className="flex-1 py-3 px-6 rounded-full bg-slate-900 border border-yellow-400/30 text-white text-xs font-sans tracking-wider font-semibold flex items-center justify-center gap-3">
                      <div className="w-2.5 h-2.5 bg-green-400 rounded-full animate-ping" />
                      <span>Blow into mic!</span>
                      {/* Dynamic volume visual feedback bar */}
                      <div className="w-16 h-1.5 bg-white/10 rounded-full overflow-hidden">
                        <div className="h-full bg-yellow-400" style={{ width: `${Math.min(100, micVolume * 1.5)}%` }} />
                      </div>
                    </div>
                  )}

                  {/* Option 2: Tap button fallback */}
                  <button
                    id="tap-blow-candles-btn"
                    onClick={handleBlowOut}
                    className="flex-1 py-3 px-6 rounded-full bg-yellow-100 text-slate-900 text-xs font-sans tracking-wider font-bold uppercase hover:bg-white transition-all duration-300 active:scale-95 flex items-center justify-center gap-2 cursor-pointer shadow-lg"
                  >
                    <Wind className="w-4 h-4" /> Tap to Blow Out 🌬️
                  </button>
                </div>
              </motion.div>
            ) : (
              // After blowing: Beautiful wishlist & navigate onwards
              <motion.div
                key="blown-panel"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-2 flex flex-col items-center"
              >
                <div className="inline-flex p-3 rounded-full bg-yellow-400/10 border border-yellow-400/30 text-yellow-300 mb-4 animate-bounce">
                  <Trophy className="w-6 h-6" />
                </div>
                <h4 className="text-xl font-serif italic text-yellow-100 mb-1">Make a Secret Wish...</h4>
                <p className="font-sans text-xs text-slate-300/80 leading-relaxed mb-6 italic">
                  "May your heart find absolute peace, and all your beautiful dreams grow wings to fly!"
                </p>

                <button
                  id="final-chapter-trigger-btn"
                  onClick={() => {
                    audio.playPop();
                    onNext();
                  }}
                  className="px-10 py-3.5 bg-yellow-100 text-slate-900 rounded-full font-bold uppercase text-xs tracking-widest hover:bg-white transition-colors duration-300 active:scale-95 cursor-pointer shadow-xl"
                >
                  Enter the Starry Sky ✨
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </div>
    </div>
  );
}
