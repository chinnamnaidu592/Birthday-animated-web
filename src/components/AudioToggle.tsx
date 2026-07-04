/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, Music } from 'lucide-react';
import { audio } from '../utils/audio';

interface AudioToggleProps {
  isInitialized: boolean;
  onInitialize: () => void;
}

export default function AudioToggle({ isInitialized, onInitialize }: AudioToggleProps) {
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    setIsMuted(audio.getMuteState());
  }, [isInitialized]);

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isInitialized) {
      onInitialize();
      return;
    }
    const newState = !isMuted;
    audio.setMuted(newState);
    setIsMuted(newState);
  };

  return (
    <button
      id="audio-toggle-btn"
      onClick={toggleMute}
      className="fixed top-6 right-6 z-50 flex items-center gap-3 px-4 py-2.5 rounded-full glass border border-white/20 text-white hover:bg-white/20 transition-all duration-300 shadow-lg active:scale-95 group"
      aria-label={isMuted ? "Unmute music" : "Mute music"}
    >
      <div className="relative w-4 h-4 flex items-center justify-center">
        {isMuted ? (
          <VolumeX className="w-4 h-4 text-white/70 transition-transform group-hover:scale-110" />
        ) : (
          <Volume2 className="w-4 h-4 text-pink-400 transition-transform group-hover:scale-110 animate-pulse" />
        )}
      </div>
      
      <span className="text-xs font-sans tracking-wide font-medium hidden sm:inline">
        {isMuted ? "Muted" : "Soundtrack"}
      </span>

      {/* Mini equalizer bars when playing */}
      {!isMuted && isInitialized && (
        <div className="flex items-end gap-0.5 h-3">
          <span className="w-0.5 bg-pink-400 rounded-full animate-[bounce_0.8s_infinite] h-2"></span>
          <span className="w-0.5 bg-pink-400 rounded-full animate-[bounce_0.5s_infinite] h-3"></span>
          <span className="w-0.5 bg-pink-400 rounded-full animate-[bounce_0.7s_infinite] h-1.5"></span>
        </div>
      )}
    </button>
  );
}
