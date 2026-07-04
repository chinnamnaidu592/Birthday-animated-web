/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

// A client-side Web Audio synthesizer to generate beautiful background scores and sound effects
class DynamicAudioManager {
  private ctx: AudioContext | null = null;
  private backgroundMusicNode: AudioScheduledSourceNode | null = null;
  private musicGain: GainNode | null = null;
  private currentLoopInterval: number | null = null;
  private isMuted: boolean = false;
  private currentMode: 'ambient' | 'celebration' | 'none' = 'none';
  private currentCustomAudio: HTMLAudioElement | null = null;
  private currentCustomBgMusic: HTMLAudioElement | null = null;

  init() {
    if (this.ctx) return;
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    this.ctx = new AudioContextClass();
    this.musicGain = this.ctx.createGain();
    this.musicGain.gain.setValueAtTime(0.3, this.ctx.currentTime);
    this.musicGain.connect(this.ctx.destination);
  }

  setMuted(muted: boolean) {
    this.isMuted = muted;
    if (this.musicGain && this.ctx) {
      const targetGain = muted ? 0 : (this.currentMode === 'celebration' ? 0.35 : 0.25);
      this.musicGain.gain.setTargetAtTime(targetGain, this.ctx.currentTime, 0.5);
    }
    if (this.currentCustomBgMusic) {
      const targetVolume = muted ? 0 : (this.currentMode === 'celebration' ? 0.45 : 0.3);
      this.currentCustomBgMusic.volume = targetVolume;
    }
    if (this.currentCustomAudio) {
      this.currentCustomAudio.volume = muted ? 0 : 0.8;
    }
  }

  getMuteState() {
    return this.isMuted;
  }

  // Helper to create a soft synthesizer note (analogous to a warm piano)
  private playPianoNote(frequency: number, duration: number, delay: number = 0) {
    if (!this.ctx || this.isMuted) return;
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }

    const t = this.ctx.currentTime + delay;
    
    // Oscillator 1: Triangle for warm fundamental tone
    const osc1 = this.ctx.createOscillator();
    osc1.type = 'triangle';
    osc1.frequency.setValueAtTime(frequency, t);

    // Oscillator 2: Sine for smooth sub-bass or clean overtones
    const osc2 = this.ctx.createOscillator();
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(frequency * 2, t);

    // Gain node for ADSR envelope
    const noteGain = this.ctx.createGain();
    noteGain.gain.setValueAtTime(0, t);
    noteGain.gain.linearRampToValueAtTime(0.4, t + 0.05); // Attack
    noteGain.gain.exponentialRampToValueAtTime(0.15, t + 0.3); // Decay
    noteGain.gain.setValueAtTime(0.15, t + duration - 0.2);
    noteGain.gain.exponentialRampToValueAtTime(0.0001, t + duration); // Release

    // Filter to make it warmer and less harsh
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(1000, t);
    filter.frequency.exponentialRampToValueAtTime(300, t + duration);

    // Dynamic delay / echo effect for cinematic space
    const delayNode = this.ctx.createDelay();
    delayNode.delayTime.value = 0.35;
    const delayGain = this.ctx.createGain();
    delayGain.gain.value = 0.25;

    osc1.connect(noteGain);
    osc2.connect(noteGain);
    noteGain.connect(filter);
    
    // Feedback delay loop
    filter.connect(this.musicGain!);
    filter.connect(delayNode);
    delayNode.connect(delayGain);
    delayGain.connect(this.musicGain!);
    delayGain.connect(delayNode); // feedback loop

    osc1.start(t);
    osc2.start(t);
    osc1.stop(t + duration);
    osc2.stop(t + duration);
  }

  // Play a soft, beautiful ambient cinematic sequence (Cmaj7 - Fmaj7 - Am7 - G)
  startAmbientMusic() {
    this.init();
    if (this.currentMode === 'ambient') return;
    this.stopMusic();
    this.currentMode = 'ambient';
    this.setMuted(this.isMuted);

    this.startAmbientSynth();
  }

  private startAmbientSynth() {
    // Beautiful slow arpeggio pattern
    const ambientChords = [
      // Cmaj7 (C3, G3, B3, E4, G4)
      [130.81, 196.00, 246.94, 329.63, 392.00],
      // Fmaj7 (F3, A3, C4, E4, A4)
      [174.61, 220.00, 261.63, 329.63, 440.00],
      // Am7 (A2, E3, G3, C4, E4)
      [110.00, 164.81, 196.00, 261.63, 329.63],
      // G (G2, D3, G3, B3, D4)
      [98.00, 146.83, 196.00, 246.94, 293.66]
    ];

    let chordIndex = 0;
    const playChordPattern = () => {
      const notes = ambientChords[chordIndex];
      // Play roll over 4 seconds
      notes.forEach((freq, idx) => {
        // Roll notes slightly
        this.playPianoNote(freq, 2.5, idx * 0.2);
      });
      // Higher ambient melody note occasionally
      if (Math.random() > 0.4) {
        const melodies = [392.00, 440.00, 523.25, 587.33, 659.25, 783.99];
        const randomNote = melodies[Math.floor(Math.random() * melodies.length)];
        this.playPianoNote(randomNote, 2.0, 1.5 + Math.random());
      }

      chordIndex = (chordIndex + 1) % ambientChords.length;
    };

    playChordPattern();
    this.currentLoopInterval = window.setInterval(playChordPattern, 6000);
  }

  // Play a beautiful, joyful, upbeat music track (Joyful piano styling of Happy Birthday motif)
  startCelebrationMusic() {
    this.init();
    if (this.currentMode === 'celebration') return;
    this.stopMusic();
    this.currentMode = 'celebration';
    this.setMuted(this.isMuted);

    this.startCelebrationSynth();
  }

  private startCelebrationSynth() {
    // Happy birthday notes in C major / F major:
    // G4 G4 A4 G4 C5 B4, G4 G4 A4 G4 D5 C5...
    const melody = [
      { f: 392.00, d: 0.3 }, { f: 392.00, d: 0.3 }, { f: 440.00, d: 0.6 }, { f: 392.00, d: 0.6 }, { f: 523.25, d: 0.6 }, { f: 493.88, d: 1.2 },
      { f: 392.00, d: 0.3 }, { f: 392.00, d: 0.3 }, { f: 440.00, d: 0.6 }, { f: 392.00, d: 0.6 }, { f: 587.33, d: 0.6 }, { f: 523.25, d: 1.2 },
      { f: 392.00, d: 0.3 }, { f: 392.00, d: 0.3 }, { f: 783.99, d: 0.6 }, { f: 659.25, d: 0.6 }, { f: 523.25, d: 0.6 }, { f: 493.88, d: 0.6 }, { f: 440.00, d: 1.2 },
      { f: 698.46, d: 0.3 }, { f: 698.46, d: 0.3 }, { f: 659.25, d: 0.6 }, { f: 523.25, d: 0.6 }, { f: 587.33, d: 0.6 }, { f: 523.25, d: 1.5 }
    ];

    let noteIdx = 0;
    const playNextNote = () => {
      if (this.currentMode !== 'celebration') return;
      const note = melody[noteIdx];
      
      // Accompany with low warm roots
      if (noteIdx === 0 || noteIdx === 6 || noteIdx === 12 || noteIdx === 19) {
        const rootFreqs = [130.81, 146.83, 164.81, 174.61];
        const randomRoot = rootFreqs[Math.floor(Math.random() * rootFreqs.length)];
        this.playPianoNote(randomRoot / 2, 2.0, 0);
      }

      this.playPianoNote(note.f, note.d + 0.3, 0);
      
      const interval = note.d * 1000 + 100;
      noteIdx = (noteIdx + 1) % melody.length;
      this.currentLoopInterval = window.setTimeout(playNextNote, interval);
    };

    playNextNote();
  }

  stopMusic() {
    if (this.currentLoopInterval) {
      clearInterval(this.currentLoopInterval);
      clearTimeout(this.currentLoopInterval);
      this.currentLoopInterval = null;
    }
    if (this.currentCustomBgMusic) {
      this.currentCustomBgMusic.pause();
      this.currentCustomBgMusic = null;
    }
    this.currentMode = 'none';
  }

  // Sound Effects
  playPop() {
    this.init();
    if (!this.ctx || this.isMuted) return;
    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(300, t);
    osc.frequency.exponentialRampToValueAtTime(600, t + 0.12);

    gain.gain.setValueAtTime(0.15, t);
    gain.gain.exponentialRampToValueAtTime(0.01, t + 0.12);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(t);
    osc.stop(t + 0.15);
  }

  playBounce() {
    this.init();
    if (!this.ctx || this.isMuted) return;
    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(150, t);
    osc.frequency.linearRampToValueAtTime(120, t + 0.1);
    osc.frequency.linearRampToValueAtTime(200, t + 0.25);

    gain.gain.setValueAtTime(0.2, t);
    gain.gain.linearRampToValueAtTime(0.2, t + 0.05);
    gain.gain.exponentialRampToValueAtTime(0.01, t + 0.3);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(t);
    osc.stop(t + 0.32);
  }

  playCorrectChime() {
    this.init();
    if (!this.ctx || this.isMuted) return;
    const t = this.ctx.currentTime;
    
    // Dynamic series of rising crystalline sparkles
    const freqs = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
    freqs.forEach((freq, idx) => {
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, t + idx * 0.08);

      gain.gain.setValueAtTime(0, t + idx * 0.08);
      gain.gain.linearRampToValueAtTime(0.15, t + idx * 0.08 + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, t + idx * 0.08 + 0.4);

      osc.connect(gain);
      gain.connect(this.ctx!.destination);
      osc.start(t + idx * 0.08);
      osc.stop(t + idx * 0.08 + 0.45);
    });
  }

  playIncorrectBuzzer() {
    this.init();
    if (!this.ctx || this.isMuted) return;
    const t = this.ctx.currentTime;
    
    // Humorous downward slide
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(140, t);
    osc.frequency.linearRampToValueAtTime(80, t + 0.45);

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(350, t);

    gain.gain.setValueAtTime(0.25, t);
    gain.gain.exponentialRampToValueAtTime(0.01, t + 0.55);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);
    
    osc.start(t);
    osc.stop(t + 0.6);
  }

  // Synthesize fireworks crackling / pop
  playFirework() {
    this.init();
    if (!this.ctx || this.isMuted) return;
    const t = this.ctx.currentTime;

    // 1. Bass boom
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(120, t);
    osc.frequency.exponentialRampToValueAtTime(30, t + 0.3);
    gain.gain.setValueAtTime(0.3, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.35);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(t);
    osc.stop(t + 0.4);

    // 2. High frequency sparkling crackles
    for (let i = 0; i < 8; i++) {
      const pOsc = this.ctx.createOscillator();
      const pGain = this.ctx.createGain();
      const delay = 0.1 + Math.random() * 0.3;
      pOsc.type = 'triangle';
      pOsc.frequency.setValueAtTime(800 + Math.random() * 1200, t + delay);
      
      pGain.gain.setValueAtTime(0.08, t + delay);
      pGain.gain.exponentialRampToValueAtTime(0.001, t + delay + 0.08);
      
      pOsc.connect(pGain);
      pGain.connect(this.ctx.destination);
      pOsc.start(t + delay);
      pOsc.stop(t + delay + 0.1);
    }
  }

  // Speak cousin message aloud with beautiful text to speech, or play a custom recorded audio file if available!
  speakGreeting(cousinName: string, text: string, onEnd: () => void) {
    this.init();
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    
    // Stop any existing speech or custom playbacks first
    this.stopAllSpeech();

    const sanitizedName = cousinName.toLowerCase().replace(/\s+/g, '_');
    const customAudioUrl = `/audio/${sanitizedName}.mp3`;
    const audioEl = new Audio(customAudioUrl);
    audioEl.volume = this.isMuted ? 0 : 0.8;
    this.currentCustomAudio = audioEl;

    let fallbackTriggered = false;
    const triggerFallback = () => {
      if (fallbackTriggered) return;
      fallbackTriggered = true;
      if (this.currentCustomAudio === audioEl) {
        this.currentCustomAudio = null;
      }
      this.fallbackSpeech(cousinName, text, onEnd);
    };

    audioEl.onended = () => {
      if (this.currentCustomAudio === audioEl) {
        this.currentCustomAudio = null;
      }
      onEnd();
    };

    audioEl.onerror = () => {
      triggerFallback();
    };

    audioEl.play()
      .then(() => {
        // Success! Custom voice recording is playing beautifully
      })
      .catch(() => {
        // Failed or not found, fall back seamlessly to text-to-speech
        triggerFallback();
      });
  }

  private fallbackSpeech(cousinName: string, text: string, onEnd: () => void) {
    // Play a lovely customized bell chime sequence first
    this.playCorrectChime();

    // Create Utterance
    const utterance = new SpeechSynthesisUtterance(text);
    
    // Customize parameters based on cousin name for variety
    switch (cousinName.toLowerCase()) {
      case 'teju':
        utterance.pitch = 1.25; // enthusiastic/younger girl
        utterance.rate = 1.05;
        break;
      case 'neeraj':
        utterance.pitch = 0.85; // cool guy
        utterance.rate = 0.95;
        break;
      case 'chitti':
        utterance.pitch = 1.4; // cute/sweeter voice
        utterance.rate = 1.0;
        break;
      case 'mohith':
        utterance.pitch = 0.95; // humorous brother
        utterance.rate = 1.1;
        break;
      case 'mokshitha':
        utterance.pitch = 1.1; // warm
        utterance.rate = 0.95;
        break;
      default:
        utterance.pitch = 1.0;
        utterance.rate = 1.0;
    }

    // Attempt to select an Indian English voice if available for high cultural relevance and perfect accent
    const voices = window.speechSynthesis.getVoices();
    const indVoice = voices.find(v => v.lang.includes('IN') || v.name.toLowerCase().includes('india'));
    if (indVoice) {
      utterance.voice = indVoice;
    }

    utterance.onend = () => {
      onEnd();
    };

    utterance.onerror = () => {
      onEnd();
    };

    window.speechSynthesis.speak(utterance);
  }

  stopAllSpeech() {
    window.speechSynthesis.cancel();
    if (this.currentCustomAudio) {
      this.currentCustomAudio.pause();
      this.currentCustomAudio = null;
    }
  }
}

export const audio = new DynamicAudioManager();
