/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ZoomIn, Camera } from 'lucide-react';
import { BIRTHDAY_IMAGES } from '../utils/images';
import { audio } from '../utils/audio';
import SafeImage from './SafeImage';

interface ChapterGalleryProps {
  onNext: () => void;
}

interface Polaroid {
  id: string;
  custom: string;
  default: string;
  caption: string;
  angle: string;
}

export default function ChapterGallery({ onNext }: ChapterGalleryProps) {
  const [activePhoto, setActivePhoto] = useState<Polaroid | null>(null);

  const handlePhotoClick = (photo: Polaroid) => {
    audio.playPop();
    setActivePhoto(photo);
  };

  return (
    <div className="min-h-screen w-full relative overflow-x-hidden z-10 py-20 px-4 md:px-8 flex flex-col items-center">
      
      {/* Visual Header */}
      <div className="text-center mb-16 max-w-lg">
        <span className="text-xs uppercase tracking-[0.2em] text-yellow-100/60 flex items-center justify-center gap-1.5 mb-2">
          <Camera className="w-3.5 h-3.5 text-yellow-200/80" /> Frozen Moments
        </span>
        <h2 className="text-3.5xl md:text-4.5xl font-serif italic text-yellow-100 tracking-wide">
          The Smile Gallery
        </h2>
        <p className="text-sm font-light text-slate-400 mt-3 leading-relaxed italic">
          "Warm snippets of joy and memories. Tap on any Polaroid to enlarge and read the heartful notes."
        </p>
      </div>

      {/* Scattered Polaroid Memory Board */}
      <div className="relative w-full max-w-5xl min-h-[500px] flex flex-wrap justify-center items-center gap-8 md:gap-12 mt-4 px-4">
        {BIRTHDAY_IMAGES.polaroids.map((photo, idx) => (
          <motion.div
            key={photo.id}
            initial={{ opacity: 0, scale: 0.8, rotate: parseFloat(photo.angle) * 1.5 }}
            whileInView={{ opacity: 1, scale: 1, rotate: parseFloat(photo.angle) }}
            viewport={{ once: true }}
            whileHover={{ 
              scale: 1.06, 
              rotate: 0, 
              zIndex: 30,
              boxShadow: '0 20px 40px rgba(0, 0, 0, 0.45)'
            }}
            transition={{ type: 'spring', stiffness: 200, damping: 15 }}
            onClick={() => handlePhotoClick(photo)}
            className="w-64 bg-white p-4 pb-8 shadow-xl border border-slate-200/50 cursor-pointer flex flex-col items-center select-none shrink-0 relative"
            style={{ transform: `rotate(${photo.angle})` }}
          >
            {/* Cute digital sticky tape on top */}
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-16 h-6 bg-yellow-100/50 backdrop-blur-xs -rotate-3 border-l border-r border-yellow-200/40 shadow-xs" />

            {/* Photo container */}
            <div className="w-full aspect-square bg-slate-100 overflow-hidden border border-slate-100 shadow-inner relative group">
              <SafeImage
                customSrc={photo.custom}
                fallbackSrc={photo.default}
                assetKey={photo.id.replace('p', 'polaroid')}
                alt="Memory snippet"
                className="w-full h-full object-cover grayscale-15 group-hover:grayscale-0 transition-all duration-500"
              />
              <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity duration-300">
                <ZoomIn className="w-8 h-8 text-white drop-shadow" />
              </div>
            </div>

            {/* Handwritten cozy caption */}
            <p className="font-handwritten text-xl text-slate-800 text-center mt-4 px-2 leading-tight">
              {photo.caption}
            </p>
          </motion.div>
        ))}
      </div>

      {/* Fullscreen Lightbox Modal */}
      <AnimatePresence>
        {activePhoto && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActivePhoto(null)}
            className="fixed inset-0 bg-slate-950/95 z-50 flex flex-col items-center justify-center p-4 backdrop-blur-md cursor-zoom-out"
          >
            <button
              id="close-lightbox-btn"
              onClick={() => setActivePhoto(null)}
              className="absolute top-6 right-6 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
            >
              <X className="w-6 h-6" />
            </button>

            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              transition={{ type: 'spring', damping: 25 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-lg bg-white p-5 pb-10 rounded-xs shadow-2xl flex flex-col items-center cursor-default"
            >
              <div className="w-full aspect-square overflow-hidden bg-slate-100 shadow-inner rounded-xs border border-slate-200">
                <SafeImage
                  customSrc={activePhoto.custom}
                  fallbackSrc={activePhoto.default}
                  assetKey={activePhoto.id.replace('p', 'polaroid')}
                  alt="Enlarged Memory"
                  className="w-full h-full object-cover"
                />
              </div>
              <p className="font-handwritten text-2xl text-slate-800 text-center mt-6 px-4 max-w-sm leading-relaxed">
                {activePhoto.caption}
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Navigation Footer */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="mt-20 text-center"
      >
        <button
          id="continue-appreciation-btn"
          onClick={() => {
            audio.playPop();
            onNext();
          }}
          className="px-10 py-3.5 bg-yellow-100 text-slate-900 rounded-full font-bold uppercase text-xs tracking-widest hover:bg-white transition-colors duration-300 active:scale-95 flex items-center gap-2 cursor-pointer shadow-xl"
        >
          Open Letter of Love 💌
        </button>
      </motion.div>

    </div>
  );
}
