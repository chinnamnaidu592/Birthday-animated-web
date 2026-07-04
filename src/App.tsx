/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import StarsBackground from './components/StarsBackground';
import AudioToggle from './components/AudioToggle';
import ChapterIntro from './components/ChapterIntro';
import ChapterPassword from './components/ChapterPassword';
import ChapterTimeline from './components/ChapterTimeline';
import ChapterCousins from './components/ChapterCousins';
import ChapterGallery from './components/ChapterGallery';
import ChapterAppreciation from './components/ChapterAppreciation';
import ChapterCelebration from './components/ChapterCelebration';
import ChapterFinal from './components/ChapterFinal';
import { audio } from './utils/audio';
import { BIRTHDAY_IMAGES } from './utils/images';

type ActiveChapter = 'intro' | 'password' | 'timeline' | 'cousins' | 'gallery' | 'appreciation' | 'celebration' | 'final';

export default function App() {
  const [currentChapter, setCurrentChapter] = useState<ActiveChapter>('intro');
  const [audioInitialized, setAudioInitialized] = useState(false);

  // Reset scroll to top of page on chapter transition
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' as ScrollBehavior });
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }, [currentChapter]);

  const getChapterKeyByNum = (num: number): ActiveChapter => {
    switch (num) {
      case 1: return 'intro';
      case 2: return 'password';
      case 3: return 'timeline';
      case 4: return 'cousins';
      case 5: return 'gallery';
      case 6: return 'appreciation';
      case 7: return 'celebration';
      case 8: return 'final';
      default: return 'intro';
    }
  };

  const getChapterInfo = (chap: ActiveChapter) => {
    switch (chap) {
      case 'intro': return { index: 1, name: 'WELCOME' };
      case 'password': return { index: 2, name: 'SECRET CODE' };
      case 'timeline': return { index: 3, name: 'THE FLOW OF TIME' };
      case 'cousins': return { index: 4, name: 'COUSINS SQUAD' };
      case 'gallery': return { index: 5, name: 'SMILE GALLERY' };
      case 'appreciation': return { index: 6, name: 'LETTER OF LOVE' };
      case 'celebration': return { index: 7, name: 'MAKE A WISH' };
      case 'final': return { index: 8, name: 'STARRY NIGHT' };
      default: return { index: 1, name: 'WELCOME' };
    }
  };

  const { index: chapterIndex, name: chapterName } = getChapterInfo(currentChapter);

  // Unlocks audio context on user action
  const handleInitializeAudio = () => {
    if (!audioInitialized) {
      audio.init();
      setAudioInitialized(true);
    }
  };

  const handleRestart = () => {
    setCurrentChapter('intro');
    audio.stopMusic();
  };

  const renderActiveChapter = () => {
    switch (currentChapter) {
      case 'intro':
        return (
          <ChapterIntro
            onNext={() => setCurrentChapter('password')}
            isAudioInitialized={audioInitialized}
            onInitializeAudio={handleInitializeAudio}
          />
        );
      case 'password':
        return (
          <ChapterPassword
            onSuccess={() => setCurrentChapter('timeline')}
          />
        );
      case 'timeline':
        return (
          <ChapterTimeline
            onNext={() => setCurrentChapter('cousins')}
          />
        );
      case 'cousins':
        return (
          <ChapterCousins
            onNext={() => setCurrentChapter('gallery')}
          />
        );
      case 'gallery':
        return (
          <ChapterGallery
            onNext={() => setCurrentChapter('appreciation')}
          />
        );
      case 'appreciation':
        return (
          <ChapterAppreciation
            onNext={() => setCurrentChapter('celebration')}
          />
        );
      case 'celebration':
        return (
          <ChapterCelebration
            onNext={() => setCurrentChapter('final')}
          />
        );
      case 'final':
        return (
          <ChapterFinal
            onRestart={handleRestart}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="relative min-h-screen text-slate-100 font-sans overflow-x-hidden selection:bg-pink-500/30 selection:text-white bg-[#020617] flex flex-col justify-between">
      
      {/* Decorative Stars and Cosmic Gradients from Geometric Balance Theme */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-10 left-20 w-1 h-1 bg-white rounded-full animate-pulse"></div>
        <div className="absolute top-40 left-80 w-0.5 h-0.5 bg-white rounded-full opacity-50"></div>
        <div className="absolute top-20 right-40 w-1 h-1 bg-white rounded-full animate-pulse"></div>
        <div className="absolute bottom-40 left-1/4 w-0.5 h-0.5 bg-white rounded-full"></div>
        <div className="absolute top-1/2 right-20 w-1 h-1 bg-white rounded-full opacity-70"></div>
        <div className="absolute top-1/4 left-1/3 w-1.5 h-1.5 bg-yellow-100 rounded-full blur-[1px]"></div>
        
        {/* Cosmic Glow Gradients */}
        <div className="absolute -top-40 -left-40 w-[600px] h-[600px] bg-indigo-900/20 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-purple-900/10 rounded-full blur-[100px]"></div>
        
        {/* Floating Decorative Particles */}
        <div className="absolute bottom-1/4 left-10 w-2 h-2 bg-yellow-200/30 rounded-full blur-[1px] animate-pulse"></div>
        <div className="absolute top-1/3 right-1/4 w-3 h-3 bg-indigo-300/20 rounded-full blur-[2px] animate-pulse"></div>
        <div className="absolute bottom-1/3 right-10 w-1.5 h-1.5 bg-white/40 rounded-full blur-[1px]"></div>
      </div>

      {/* Global Interactive Twinkling Stars & Clouds Background */}
      <StarsBackground />

      {/* Floating Audio Controller */}
      <AudioToggle 
        isInitialized={audioInitialized} 
        onInitialize={handleInitializeAudio} 
      />

      {/* Chapter Container with Cinematic Fading Transitions */}
      <main className="relative w-full min-h-screen flex flex-col justify-center pb-32 sm:pb-36 z-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentChapter}
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.02 }}
            transition={{ duration: 0.8, ease: 'easeInOut' }}
            className="w-full"
          >
            {renderActiveChapter()}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* HUD Progress Footer */}
      <footer className="absolute bottom-8 left-0 right-0 w-full px-6 md:px-12 flex flex-col items-center justify-center gap-4 z-30 pointer-events-auto">
        {/* Interactive progress bar dots */}
        <div className="flex flex-col items-center gap-3 w-full max-w-md">
          <div className="flex items-center justify-between w-full relative px-1">
            {/* Background progress track */}
            <div className="absolute top-1/2 left-0 right-0 h-[1px] bg-slate-800/80 -translate-y-1/2 z-0" />
            
            {/* Active progress track */}
            <div 
              className="absolute top-1/2 left-0 h-[1px] bg-gradient-to-r from-yellow-300 to-yellow-100 -translate-y-1/2 z-0 transition-all duration-500" 
              style={{ width: `${((chapterIndex - 1) / 7) * 100}%` }}
            />

            {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => {
              const isActive = num === chapterIndex;
              const isPassed = num < chapterIndex;
              const chKey = getChapterKeyByNum(num);
              const chInfo = getChapterInfo(chKey);
              
              // Only allow jumping if user has entered chapter 3 or later
              const canJump = currentChapter !== 'intro' && currentChapter !== 'password';

              return (
                <button
                  key={num}
                  onClick={() => {
                    if (canJump) {
                      audio.playPop();
                      if (chKey === 'intro') {
                        audio.stopMusic();
                      }
                      setCurrentChapter(chKey);
                    }
                  }}
                  disabled={!canJump}
                  title={chInfo.name}
                  className={`h-4 w-4 rounded-full flex items-center justify-center z-10 transition-all duration-300 relative focus:outline-none ${
                    canJump ? 'cursor-pointer hover:scale-125' : 'cursor-not-allowed'
                  }`}
                >
                  <div 
                    className={`h-2.5 w-2.5 rounded-full transition-all duration-500 ${
                      isActive
                        ? 'bg-yellow-200 scale-125 shadow-[0_0_10px_rgba(254,240,138,0.95)]'
                        : isPassed
                        ? 'bg-yellow-100/60'
                        : 'bg-slate-900 border border-slate-700'
                    }`}
                  />
                  {/* Step index indicator */}
                  <span className={`absolute -top-6 text-[9px] font-mono tracking-wider font-semibold transition-opacity duration-300 ${
                    isActive ? 'opacity-100 text-yellow-100' : 'opacity-0 hover:opacity-100 text-slate-500'
                  }`}>
                    0{num}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="flex flex-col items-center text-center font-mono mt-1">
            <div className="flex items-center gap-2">
              <span className="text-[9px] uppercase tracking-[0.25em] text-slate-500">Journey Map:</span>
              <span className="text-[10px] text-yellow-100/90 uppercase tracking-[0.18em] font-bold">{chapterName}</span>
              <span className="text-[9px] text-slate-400">({chapterIndex}/8)</span>
            </div>
            <div className="h-[1px] w-32 bg-gradient-to-r from-transparent via-white/10 to-transparent mt-1.5"></div>
          </div>
        </div>
      </footer>
      
    </div>
  );
}
