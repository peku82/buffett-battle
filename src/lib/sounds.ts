'use client';

// Synthesized sound effects for Old Man Buck using Web Audio API
// No external files needed - all generated in the browser

let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext {
  if (!audioCtx) {
    audioCtx = new AudioContext();
  }
  return audioCtx;
}

// 💨 FART SOUND - low frequency rumble with wobble
export function playFart() {
  const ctx = getAudioContext();
  const now = ctx.currentTime;

  // Main low oscillator
  const osc1 = ctx.createOscillator();
  osc1.type = 'sawtooth';
  osc1.frequency.setValueAtTime(80, now);
  osc1.frequency.exponentialRampToValueAtTime(40, now + 0.6);

  // Wobble LFO
  const lfo = ctx.createOscillator();
  lfo.type = 'sine';
  lfo.frequency.setValueAtTime(25, now);
  lfo.frequency.linearRampToValueAtTime(8, now + 0.5);
  const lfoGain = ctx.createGain();
  lfoGain.gain.setValueAtTime(30, now);
  lfo.connect(lfoGain);
  lfoGain.connect(osc1.frequency);

  // Noise for texture
  const bufferSize = ctx.sampleRate * 0.6;
  const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const noise = noiseBuffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) {
    noise[i] = (Math.random() * 2 - 1) * 0.3;
  }
  const noiseSource = ctx.createBufferSource();
  noiseSource.buffer = noiseBuffer;

  // Low pass filter for the noise
  const filter = ctx.createBiquadFilter();
  filter.type = 'lowpass';
  filter.frequency.setValueAtTime(200, now);
  filter.frequency.exponentialRampToValueAtTime(60, now + 0.5);
  filter.Q.value = 5;

  // Envelope
  const gainNode = ctx.createGain();
  gainNode.gain.setValueAtTime(0, now);
  gainNode.gain.linearRampToValueAtTime(0.25, now + 0.05);
  gainNode.gain.setValueAtTime(0.25, now + 0.1);
  gainNode.gain.linearRampToValueAtTime(0.15, now + 0.3);
  gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.6);

  osc1.connect(gainNode);
  noiseSource.connect(filter);
  filter.connect(gainNode);
  gainNode.connect(ctx.destination);

  lfo.start(now);
  osc1.start(now);
  noiseSource.start(now);

  osc1.stop(now + 0.7);
  lfo.stop(now + 0.7);
  noiseSource.stop(now + 0.7);
}

// 🥤 COKE SIP - bubbly slurp sound
export function playCokeSip() {
  const ctx = getAudioContext();
  const now = ctx.currentTime;

  // Bubble sounds
  for (let i = 0; i < 5; i++) {
    const bubble = ctx.createOscillator();
    bubble.type = 'sine';
    const startFreq = 300 + Math.random() * 500;
    const t = now + i * 0.12 + Math.random() * 0.05;
    bubble.frequency.setValueAtTime(startFreq, t);
    bubble.frequency.exponentialRampToValueAtTime(startFreq * 1.5, t + 0.05);
    bubble.frequency.exponentialRampToValueAtTime(startFreq * 0.3, t + 0.1);

    const bubbleGain = ctx.createGain();
    bubbleGain.gain.setValueAtTime(0, t);
    bubbleGain.gain.linearRampToValueAtTime(0.08, t + 0.02);
    bubbleGain.gain.exponentialRampToValueAtTime(0.001, t + 0.1);

    bubble.connect(bubbleGain);
    bubbleGain.connect(ctx.destination);
    bubble.start(t);
    bubble.stop(t + 0.12);
  }

  // Slurp sound - filtered noise
  const bufferSize = ctx.sampleRate * 0.8;
  const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const noise = noiseBuffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) {
    noise[i] = Math.random() * 2 - 1;
  }
  const noiseSource = ctx.createBufferSource();
  noiseSource.buffer = noiseBuffer;

  const filter = ctx.createBiquadFilter();
  filter.type = 'bandpass';
  filter.frequency.setValueAtTime(2000, now);
  filter.frequency.linearRampToValueAtTime(800, now + 0.4);
  filter.frequency.linearRampToValueAtTime(3000, now + 0.6);
  filter.Q.value = 3;

  const slurpGain = ctx.createGain();
  slurpGain.gain.setValueAtTime(0, now);
  slurpGain.gain.linearRampToValueAtTime(0.06, now + 0.1);
  slurpGain.gain.setValueAtTime(0.06, now + 0.5);
  slurpGain.gain.exponentialRampToValueAtTime(0.001, now + 0.7);

  noiseSource.connect(filter);
  filter.connect(slurpGain);
  slurpGain.connect(ctx.destination);
  noiseSource.start(now);
  noiseSource.stop(now + 0.8);
}

// 😤 GRUNT / GROAN - old man disapproval
export function playGrunt() {
  const ctx = getAudioContext();
  const now = ctx.currentTime;

  const osc = ctx.createOscillator();
  osc.type = 'sawtooth';
  osc.frequency.setValueAtTime(120, now);
  osc.frequency.linearRampToValueAtTime(90, now + 0.15);
  osc.frequency.linearRampToValueAtTime(110, now + 0.3);
  osc.frequency.exponentialRampToValueAtTime(60, now + 0.5);

  const filter = ctx.createBiquadFilter();
  filter.type = 'lowpass';
  filter.frequency.setValueAtTime(400, now);
  filter.Q.value = 2;

  const gainNode = ctx.createGain();
  gainNode.gain.setValueAtTime(0, now);
  gainNode.gain.linearRampToValueAtTime(0.15, now + 0.05);
  gainNode.gain.setValueAtTime(0.15, now + 0.2);
  gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.5);

  osc.connect(filter);
  filter.connect(gainNode);
  gainNode.connect(ctx.destination);
  osc.start(now);
  osc.stop(now + 0.6);
}

// 🎉 CELEBRATION - happy ding ding!
export function playCelebration() {
  const ctx = getAudioContext();
  const now = ctx.currentTime;

  const notes = [523, 659, 784, 1047]; // C5, E5, G5, C6
  notes.forEach((freq, i) => {
    const osc = ctx.createOscillator();
    osc.type = 'sine';
    osc.frequency.value = freq;

    const gainNode = ctx.createGain();
    const t = now + i * 0.12;
    gainNode.gain.setValueAtTime(0, t);
    gainNode.gain.linearRampToValueAtTime(0.15, t + 0.02);
    gainNode.gain.exponentialRampToValueAtTime(0.01, t + 0.4);

    osc.connect(gainNode);
    gainNode.connect(ctx.destination);
    osc.start(t);
    osc.stop(t + 0.5);
  });
}

// 📉 FAIL BUZZER - wrong answer
export function playBuzzer() {
  const ctx = getAudioContext();
  const now = ctx.currentTime;

  const osc = ctx.createOscillator();
  osc.type = 'square';
  osc.frequency.setValueAtTime(150, now);
  osc.frequency.linearRampToValueAtTime(100, now + 0.3);

  const gainNode = ctx.createGain();
  gainNode.gain.setValueAtTime(0.12, now);
  gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.4);

  osc.connect(gainNode);
  gainNode.connect(ctx.destination);
  osc.start(now);
  osc.stop(now + 0.4);
}

// 🪙 COIN / CASH REGISTER - buying a stock
export function playCoinSound() {
  const ctx = getAudioContext();
  const now = ctx.currentTime;

  // High metallic ping
  const osc1 = ctx.createOscillator();
  osc1.type = 'sine';
  osc1.frequency.setValueAtTime(2000, now);
  osc1.frequency.exponentialRampToValueAtTime(1200, now + 0.3);

  const osc2 = ctx.createOscillator();
  osc2.type = 'sine';
  osc2.frequency.setValueAtTime(3000, now);
  osc2.frequency.exponentialRampToValueAtTime(2000, now + 0.2);

  const gainNode = ctx.createGain();
  gainNode.gain.setValueAtTime(0.1, now);
  gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.3);

  osc1.connect(gainNode);
  osc2.connect(gainNode);
  gainNode.connect(ctx.destination);

  osc1.start(now);
  osc2.start(now);
  osc1.stop(now + 0.4);
  osc2.stop(now + 0.3);
}

// 🥱 YAWN
export function playYawn() {
  const ctx = getAudioContext();
  const now = ctx.currentTime;

  const osc = ctx.createOscillator();
  osc.type = 'sine';
  osc.frequency.setValueAtTime(250, now);
  osc.frequency.linearRampToValueAtTime(400, now + 0.3);
  osc.frequency.linearRampToValueAtTime(350, now + 0.6);
  osc.frequency.linearRampToValueAtTime(200, now + 1.0);
  osc.frequency.exponentialRampToValueAtTime(100, now + 1.3);

  const filter = ctx.createBiquadFilter();
  filter.type = 'bandpass';
  filter.frequency.setValueAtTime(500, now);
  filter.frequency.linearRampToValueAtTime(800, now + 0.3);
  filter.frequency.linearRampToValueAtTime(400, now + 1.0);
  filter.Q.value = 2;

  const gainNode = ctx.createGain();
  gainNode.gain.setValueAtTime(0, now);
  gainNode.gain.linearRampToValueAtTime(0.08, now + 0.1);
  gainNode.gain.setValueAtTime(0.08, now + 0.8);
  gainNode.gain.exponentialRampToValueAtTime(0.01, now + 1.3);

  osc.connect(filter);
  filter.connect(gainNode);
  gainNode.connect(ctx.destination);
  osc.start(now);
  osc.stop(now + 1.4);
}

// 🦯 CANE TAP
export function playCaneTap() {
  const ctx = getAudioContext();
  const now = ctx.currentTime;

  // Sharp click
  const osc = ctx.createOscillator();
  osc.type = 'triangle';
  osc.frequency.setValueAtTime(800, now);
  osc.frequency.exponentialRampToValueAtTime(200, now + 0.05);

  const gainNode = ctx.createGain();
  gainNode.gain.setValueAtTime(0.2, now);
  gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.08);

  osc.connect(gainNode);
  gainNode.connect(ctx.destination);
  osc.start(now);
  osc.stop(now + 0.1);
}

// 🤓 GLASSES ADJUST - small squeak
export function playGlassesAdjust() {
  const ctx = getAudioContext();
  const now = ctx.currentTime;

  const osc = ctx.createOscillator();
  osc.type = 'sine';
  osc.frequency.setValueAtTime(1500, now);
  osc.frequency.linearRampToValueAtTime(2500, now + 0.05);
  osc.frequency.linearRampToValueAtTime(1800, now + 0.1);

  const gainNode = ctx.createGain();
  gainNode.gain.setValueAtTime(0.04, now);
  gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

  osc.connect(gainNode);
  gainNode.connect(ctx.destination);
  osc.start(now);
  osc.stop(now + 0.15);
}

// Map behaviors to sounds
export const behaviorSounds: Record<string, () => void> = {
  sipCoke: playCokeSip,
  yawn: playYawn,
  shakeCane: playCaneTap,
  adjustGlasses: playGlassesAdjust,
  tapFoot: playCaneTap,
  crossArms: playGrunt,
};

// Random fart - call this on a timer, ~5% chance each check
export function maybePlayFart(): boolean {
  if (Math.random() < 0.05) {
    playFart();
    return true;
  }
  return false;
}
