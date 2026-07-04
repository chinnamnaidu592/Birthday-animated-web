/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Play, Square, Sparkles, Heart } from 'lucide-react';
import { BIRTHDAY_IMAGES } from '../utils/images';
import { audio } from '../utils/audio';
import SafeImage from './SafeImage';

interface ChapterCousinsProps {
  onNext: () => void;
}

interface Person {
  key: string;
  name: string;
  customAvatar: string;
  defaultAvatar: string;
  message: string;
}

export default function ChapterCousins({ onNext }: ChapterCousinsProps) {
  const [playingPerson, setPlayingPerson] = useState<string | null>(null);

  const parentsList: Person[] = [
    { key: 'father', ...BIRTHDAY_IMAGES.parents.father },
    { key: 'mother', ...BIRTHDAY_IMAGES.parents.mother },
    { key: 'pinni', ...BIRTHDAY_IMAGES.parents.pinni },
    { key: 'chinna_pinni', ...BIRTHDAY_IMAGES.parents.chinna_pinni },
  ];

  const cousinsList: Person[] = [
    { key: 'teju', ...BIRTHDAY_IMAGES.cousins.teju },
    { key: 'neeraj', ...BIRTHDAY_IMAGES.cousins.neeraj },
    { key: 'chitti', ...BIRTHDAY_IMAGES.cousins.chitti },
    { key: 'mohith', ...BIRTHDAY_IMAGES.cousins.mohith },
    { key: 'mokshitha', ...BIRTHDAY_IMAGES.cousins.mokshitha },
  ];

  // Clean up speech synthesis when unmounting
  useEffect(() => {
    return () => {
      audio.stopAllSpeech();
    };
  }, []);

  const handlePlayToggle = (person: Person) => {
    if (playingPerson === person.key) {
      audio.stopAllSpeech();
      setPlayingPerson(null);
    } else {
      audio.stopAllSpeech();
      setPlayingPerson(person.key);
      audio.speakGreeting(person.name, person.message, () => {
        setPlayingPerson(null);
      });
    }
  };

  const renderCard = (person: Person, idx: number, isParent: boolean) => {
    const isPlaying = playingPerson === person.key;
    const hasAudio = true;

    return (
      <motion.div
        key={person.key}
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: idx * 0.08, duration: 0.5 }}
        className={`rounded-3xl p-6 glass transition-all duration-300 relative overflow-hidden flex flex-col items-center text-center group ${
          isPlaying 
            ? 'border-yellow-400/40 shadow-[0_0_30px_rgba(250,204,21,0.15)] ring-1 ring-yellow-400/20 bg-yellow-400/5' 
            : 'border-white/10 hover:border-white/25 hover:bg-white/5 shadow-xl'
        }`}
      >
        {/* Floating music notes if playing */}
        <AnimatePresence>
          {isPlaying && (
            <>
              <motion.span
                initial={{ opacity: 0, y: 10, x: -10 }}
                animate={{ opacity: 0.8, y: -40, x: -25 }}
                exit={{ opacity: 0 }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="absolute text-yellow-300 text-lg left-10 bottom-24"
              >
                🎵
              </motion.span>
              <motion.span
                initial={{ opacity: 0, y: 10, x: 10 }}
                animate={{ opacity: 0.8, y: -45, x: 25 }}
                exit={{ opacity: 0 }}
                transition={{ repeat: Infinity, duration: 1.8, delay: 0.3 }}
                className="absolute text-rose-400 text-base right-10 bottom-24"
              >
                🎶
              </motion.span>
            </>
          )}
        </AnimatePresence>

        {/* Avatar with glowing ring */}
        <div className="relative w-24 h-24 mb-4">
          <div className={`absolute inset-0 rounded-full transition-all duration-300 ${
            isPlaying ? 'animate-ping bg-yellow-400/20' : 'bg-transparent'
          }`} />
          <SafeImage
            customSrc={person.customAvatar}
            fallbackSrc={person.defaultAvatar}
            assetKey={`avatar_${person.key}`}
            alt={person.name}
            style={
              person.key === 'pinni' || person.key === 'chinna_pinni'
                ? { objectPosition: 'center 15%' }
                : undefined
            }
            className={`w-full h-full object-cover rounded-full border-2 transition-all duration-300 relative z-10 ${
              isPlaying ? 'border-yellow-400 scale-105 shadow-[0_0_15px_rgba(250,204,21,0.3)]' : 'border-white/20'
            }`}
          />
          {isPlaying && (
            <span className="absolute bottom-1 right-1 bg-yellow-400 rounded-full p-1 z-20 animate-bounce">
              <Sparkles className="w-3.5 h-3.5 text-slate-900 fill-current" />
            </span>
          )}
        </div>

        {/* Person Name */}
        <h4 className="font-serif text-lg font-medium text-white tracking-wide mb-3">
          {person.name}
        </h4>

        {/* Message */}
        <p className={`font-sans text-xs text-slate-300/90 leading-relaxed flex-grow ${hasAudio ? 'mb-6' : 'mb-2'}`}>
          "{person.message}"
        </p>

        {/* Button play/pause controls */}
        {hasAudio && (
          <button
            id={`play-btn-${person.key}`}
            onClick={() => handlePlayToggle(person)}
            className={`w-full py-2.5 rounded-full flex items-center justify-center gap-2 text-xs font-sans font-semibold tracking-wider transition-all duration-300 cursor-pointer mt-auto ${
              isPlaying
                ? 'bg-yellow-400 text-slate-950 hover:bg-yellow-300 shadow-lg font-bold'
                : 'bg-white/10 hover:bg-white/20 text-white'
            }`}
          >
            {isPlaying ? (
              <>
                <Square className="w-3 h-3 fill-current" /> Stop Audio
              </>
            ) : (
              <>
                <Play className="w-3 h-3 fill-current" /> Play Voice 🎙️
              </>
            )}
          </button>
        )}

        {/* Equalizer lines when active */}
        {isPlaying && (
          <div className="flex items-end gap-0.5 mt-4 h-4">
            <span className="w-0.5 bg-yellow-400 rounded-full animate-[bounce_0.6s_infinite] h-3"></span>
            <span className="w-0.5 bg-yellow-400 rounded-full animate-[bounce_0.8s_infinite] h-4"></span>
            <span className="w-0.5 bg-yellow-400 rounded-full animate-[bounce_0.5s_infinite] h-2"></span>
            <span className="w-0.5 bg-yellow-400 rounded-full animate-[bounce_0.7s_infinite] h-3.5"></span>
          </div>
        )}
      </motion.div>
    );
  };

  return (
    <div className="min-h-screen w-full relative overflow-x-hidden z-10 flex flex-col items-center py-20 px-4 md:px-8">
      
      {/* Immersive blurred cousins group background */}
      <div className="absolute inset-0 -z-10 pointer-events-none overflow-hidden">
        <SafeImage
          customSrc={BIRTHDAY_IMAGES.cousinsGroup.custom}
          fallbackSrc={BIRTHDAY_IMAGES.cousinsGroup.default}
          assetKey="cousins_group"
          alt="Cousins group"
          className="w-full h-full object-cover blur-md scale-105 opacity-25"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0518] via-[#100826]/90 to-[#05020c]" />
      </div>

      <div className="w-full max-w-5xl flex flex-col items-center">
        
        {/* Main Header / Respectful Welcome */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="text-center mb-16 max-w-2xl"
        >
          <motion.div 
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
            className="inline-block text-rose-400 text-3xl mb-4"
          >
            <Heart className="w-10 h-10 fill-current drop-shadow-[0_0_10px_rgba(244,63,94,0.4)]" />
          </motion.div>
          <h2 className="font-serif italic text-2xl md:text-3.5xl text-yellow-100 leading-relaxed tracking-wide drop-shadow-md">
            "Mee kosam prematho pampina subhakankshalu..." 💖✨
          </h2>
          <p className="text-xs uppercase tracking-[0.25em] text-yellow-100/60 mt-4 block font-semibold font-mono">
            heartfelt wishes from your family & squad
          </p>
        </motion.div>

        {/* SECTION 1: Lovely Parents & Elders */}
        <div className="w-full mb-20">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex items-center gap-3 justify-center mb-8"
          >
            <span className="h-[1px] w-12 bg-gradient-to-r from-transparent to-rose-400/60" />
            <h3 className="font-serif text-xl italic text-rose-300 tracking-wide">
              Wishes from your lovely parents & elders ❤️
            </h3>
            <span className="h-[1px] w-12 bg-gradient-to-l from-transparent to-rose-400/60" />
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
            {parentsList.map((person, idx) => renderCard(person, idx, true))}
          </div>
        </div>

        {/* SECTION 2: Lovely Cousins Squad */}
        <div className="w-full mb-16">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex items-center gap-3 justify-center mb-8"
          >
            <span className="h-[1px] w-12 bg-gradient-to-r from-transparent to-yellow-400/60" />
            <h3 className="font-serif text-xl italic text-yellow-200 tracking-wide">
              Wishes from your lovely Cousins Squad ✨
            </h3>
            <span className="h-[1px] w-12 bg-gradient-to-l from-transparent to-yellow-400/60" />
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 w-full">
            {cousinsList.map((person, idx) => renderCard(person, idx, false))}
          </div>
        </div>

        {/* Continue Button */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mt-8"
        >
          <button
            id="continue-gallery-btn"
            onClick={() => {
              audio.playPop();
              audio.stopAllSpeech();
              onNext();
            }}
            className="px-10 py-3.5 bg-yellow-100 text-slate-900 rounded-full font-bold uppercase text-xs tracking-widest hover:bg-white transition-colors duration-300 active:scale-95 flex items-center gap-2 cursor-pointer shadow-xl"
          >
            Enter Smile Gallery 🖼️
          </button>
        </motion.div>

      </div>
    </div>
  );
}
