'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence, useAnimation } from 'framer-motion';

type BuckMood = 'neutral' | 'pleased' | 'excited' | 'disgusted';

interface OldManBuckProps {
  message: string;
  mood?: BuckMood;
  size?: 'small' | 'large';
  onMessageComplete?: () => void;
}

// When you have AI-generated images, put them in public/mascot/ and they'll be used automatically
const MASCOT_IMAGES: Record<BuckMood, string> = {
  neutral: '/mascot/buck-neutral.png',
  pleased: '/mascot/buck-pleased.png',
  excited: '/mascot/buck-excited.png',
  disgusted: '/mascot/buck-disgusted.png',
};

// Funny idle behaviors that fire randomly
type IdleBehavior = 'adjustGlasses' | 'sipCoke' | 'scratchHead' | 'tapFoot' | 'lookAround' | 'yawn' | 'shakeCane' | 'crossArms';

const IDLE_BEHAVIORS: { type: IdleBehavior; emoji: string; duration: number }[] = [
  { type: 'adjustGlasses', emoji: '🤓', duration: 1500 },
  { type: 'sipCoke', emoji: '🥤', duration: 2000 },
  { type: 'scratchHead', emoji: '🤔', duration: 1200 },
  { type: 'tapFoot', emoji: '🦶', duration: 1800 },
  { type: 'lookAround', emoji: '👀', duration: 1500 },
  { type: 'yawn', emoji: '🥱', duration: 2500 },
  { type: 'shakeCane', emoji: '🦯', duration: 1000 },
  { type: 'crossArms', emoji: '😤', duration: 1500 },
];

const MOOD_FACE: Record<BuckMood, string> = {
  neutral: '😐',
  pleased: '😏',
  excited: '😄',
  disgusted: '😠',
};

const BUBBLE_ACCENT: Record<BuckMood, string> = {
  neutral: 'border-l-amber-400',
  pleased: 'border-l-emerald-400',
  excited: 'border-l-yellow-400',
  disgusted: 'border-l-red-400',
};

export default function OldManBuck({ message, mood = 'neutral', size = 'small', onMessageComplete }: OldManBuckProps) {
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [hasCustomImage, setHasCustomImage] = useState(false);
  const [currentBehavior, setCurrentBehavior] = useState<IdleBehavior | null>(null);
  const [behaviorEmoji, setBehaviorEmoji] = useState<string | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout[]>([]);
  const bodyControls = useAnimation();

  const isLarge = size === 'large';

  // Check for custom mascot images on mount
  useEffect(() => {
    const img = new Image();
    img.onload = () => setHasCustomImage(true);
    img.onerror = () => setHasCustomImage(false);
    img.src = MASCOT_IMAGES.neutral;
  }, []);

  // Typewriter effect
  useEffect(() => {
    if (!message) return;
    setDisplayedText('');
    setIsTyping(true);
    setIsSpeaking(true);
    timeoutRef.current.forEach(clearTimeout);
    timeoutRef.current = [];
    const chars = message.split('');
    chars.forEach((char, i) => {
      const t = setTimeout(() => {
        setDisplayedText(prev => prev + char);
        if (i === chars.length - 1) {
          setIsTyping(false);
          setIsSpeaking(false);
          onMessageComplete?.();
        }
      }, 25 * i);
      timeoutRef.current.push(t);
    });
    return () => { timeoutRef.current.forEach(clearTimeout); };
  }, [message, onMessageComplete]);

  // ElevenLabs TTS (only if API key provided)
  useEffect(() => {
    if (!message || typeof window === 'undefined') return;
    const apiKey = process.env.NEXT_PUBLIC_ELEVENLABS_API_KEY;
    if (!apiKey) return;
    const voiceId = process.env.NEXT_PUBLIC_ELEVENLABS_VOICE_ID || 'pqHfZKP75CvOlQylNhV4';
    const ctrl = new AbortController();
    fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'xi-api-key': apiKey },
      body: JSON.stringify({ text: message, model_id: 'eleven_multilingual_v2', voice_settings: { stability: 0.4, similarity_boost: 0.7, style: 0.5 } }),
      signal: ctrl.signal
    }).then(r => r.blob()).then(b => { new Audio(URL.createObjectURL(b)).play().catch(() => {}); }).catch(() => {});
    return () => ctrl.abort();
  }, [message]);

  // Random idle behaviors when not speaking
  useEffect(() => {
    if (isSpeaking || isTyping) return;
    const interval = setInterval(() => {
      if (Math.random() > 0.5) return; // 50% chance each tick
      const behavior = IDLE_BEHAVIORS[Math.floor(Math.random() * IDLE_BEHAVIORS.length)];
      setCurrentBehavior(behavior.type);
      setBehaviorEmoji(behavior.emoji);

      // Trigger body animation based on behavior
      switch (behavior.type) {
        case 'adjustGlasses':
          bodyControls.start({ rotate: [0, -3, 2, 0], y: [0, -2, 0], transition: { duration: 0.8 } });
          break;
        case 'sipCoke':
          bodyControls.start({ rotate: [0, 8, 8, 0], transition: { duration: 1.5 } });
          break;
        case 'scratchHead':
          bodyControls.start({ x: [0, 3, -3, 2, 0], transition: { duration: 1 } });
          break;
        case 'tapFoot':
          bodyControls.start({ y: [0, -2, 0, -2, 0, -2, 0], transition: { duration: 1.2 } });
          break;
        case 'lookAround':
          bodyControls.start({ rotateY: [0, 15, -15, 0], transition: { duration: 1.2 } });
          break;
        case 'yawn':
          bodyControls.start({ scaleY: [1, 1.05, 0.95, 1], transition: { duration: 2 } });
          break;
        case 'shakeCane':
          bodyControls.start({ rotate: [0, -10, 10, -8, 5, 0], transition: { duration: 0.8 } });
          break;
        case 'crossArms':
          bodyControls.start({ scaleX: [1, 1.05, 1], transition: { duration: 0.5 } });
          break;
      }

      setTimeout(() => {
        setCurrentBehavior(null);
        setBehaviorEmoji(null);
      }, behavior.duration);
    }, 4000);
    return () => clearInterval(interval);
  }, [isSpeaking, isTyping, bodyControls]);

  // Mood-triggered special animation
  const getMoodAnimation = useCallback(() => {
    switch (mood) {
      case 'excited':
        return { y: [0, -12, 0, -8, 0], rotate: [0, 5, -5, 3, 0], scale: [1, 1.1, 1, 1.05, 1] };
      case 'disgusted':
        return { rotate: [0, -5, 5, -3, 0], x: [0, -5, 5, 0] };
      case 'pleased':
        return { y: [0, -4, 0], rotate: [0, 2, 0] };
      default:
        return isSpeaking
          ? { y: [0, -3, 0], scaleY: [1, 1.02, 1] }
          : { y: [0, -5, 0] };
    }
  }, [mood, isSpeaking]);

  const getMoodTransition = useCallback(() => {
    switch (mood) {
      case 'excited': return { duration: 0.6, repeat: 2, ease: 'easeInOut' as const };
      case 'disgusted': return { duration: 0.5, repeat: 1 };
      case 'pleased': return { duration: 1.5, repeat: Infinity, ease: 'easeInOut' as const };
      default: return isSpeaking
        ? { duration: 0.3, repeat: Infinity }
        : { duration: 2.5, repeat: Infinity, ease: 'easeInOut' as const };
    }
  }, [mood, isSpeaking]);

  const charSize = isLarge ? 'w-24 h-24' : 'w-14 h-14';

  return (
    <div className={`flex items-end gap-3 ${isLarge ? 'mb-3' : 'mb-2'}`}>
      {/* Character container with 3D perspective */}
      <div className="relative flex-shrink-0" style={{ perspective: '500px' }}>
        <motion.div
          animate={currentBehavior ? undefined : getMoodAnimation()}
          transition={currentBehavior ? undefined : getMoodTransition()}
          className="relative"
        >
          <motion.div animate={bodyControls}>
            {hasCustomImage ? (
              // AI-generated image
              <motion.img
                key={mood}
                src={MASCOT_IMAGES[mood]}
                alt="Old Man Buck"
                className={`${charSize} object-contain drop-shadow-2xl`}
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 300 }}
              />
            ) : (
              // Fallback: Stylized character
              <div className={`${charSize} relative`}>
                {/* Ambient glow */}
                <motion.div
                  className={`absolute inset-[-8px] rounded-full blur-xl opacity-40 ${
                    mood === 'excited' ? 'bg-yellow-400' :
                    mood === 'disgusted' ? 'bg-red-400' :
                    mood === 'pleased' ? 'bg-emerald-400' : 'bg-amber-400'
                  }`}
                  animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />

                {/* Main character circle */}
                <div className={`relative ${charSize} rounded-full
                  bg-gradient-to-br from-amber-200 via-amber-300 to-amber-500
                  shadow-xl border-[3px] ${
                    mood === 'excited' ? 'border-yellow-400 shadow-yellow-400/30' :
                    mood === 'disgusted' ? 'border-red-400 shadow-red-400/30' :
                    mood === 'pleased' ? 'border-emerald-400 shadow-emerald-400/30' :
                    'border-amber-400 shadow-amber-400/30'
                  }
                  flex items-center justify-center overflow-hidden
                `}>
                  {/* Face emoji */}
                  <motion.span
                    key={mood}
                    className={isLarge ? 'text-5xl' : 'text-3xl'}
                    initial={{ scale: 0.5, rotate: -10 }}
                    animate={{
                      scale: isSpeaking ? [1, 1.15, 1] : 1,
                      rotate: 0
                    }}
                    transition={isSpeaking
                      ? { duration: 0.2, repeat: Infinity }
                      : { type: 'spring', stiffness: 400 }
                    }
                  >
                    {MOOD_FACE[mood]}
                  </motion.span>
                </div>

                {/* Floating accessories */}
                <motion.span
                  className={`absolute ${isLarge ? '-top-1 -right-1 text-base' : '-top-0.5 -right-0.5 text-xs'}`}
                  animate={currentBehavior === 'adjustGlasses'
                    ? { rotate: [0, 15, -10, 0], y: [0, -3, 0] }
                    : { y: [0, -1, 0] }
                  }
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  🤓
                </motion.span>

                <motion.span
                  className={`absolute ${isLarge ? '-bottom-1 -right-2 text-base' : '-bottom-0.5 -right-1.5 text-xs'}`}
                  animate={currentBehavior === 'sipCoke'
                    ? { rotate: [-20, 45, -20], y: [0, -8, 0] }
                    : { rotate: [0, 5, 0] }
                  }
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  🥤
                </motion.span>

                {/* Cane appears on excited or shakeCane */}
                <AnimatePresence>
                  {(mood === 'excited' || currentBehavior === 'shakeCane') && (
                    <motion.span
                      className={`absolute ${isLarge ? '-left-3 bottom-0 text-lg' : '-left-2 -bottom-0.5 text-sm'}`}
                      initial={{ rotate: -30, opacity: 0 }}
                      animate={{ rotate: [-30, 30, -20, 25, 0], opacity: 1 }}
                      exit={{ rotate: -30, opacity: 0 }}
                      transition={{ duration: 0.8 }}
                    >
                      🦯
                    </motion.span>
                  )}
                </AnimatePresence>
              </div>
            )}

            {/* Behavior indicator - little floating emoji */}
            <AnimatePresence>
              {behaviorEmoji && (
                <motion.div
                  className={`absolute ${isLarge ? '-top-4 right-0 text-xl' : '-top-3 right-0 text-sm'}`}
                  initial={{ y: 0, opacity: 0, scale: 0.5 }}
                  animate={{ y: -10, opacity: 1, scale: 1 }}
                  exit={{ y: -20, opacity: 0, scale: 0.5 }}
                  transition={{ duration: 0.5 }}
                >
                  {behaviorEmoji}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.div>

        {/* Ground shadow */}
        <motion.div
          className={`absolute left-1/2 -translate-x-1/2 rounded-full bg-black/20 blur-sm ${
            isLarge ? '-bottom-2 w-16 h-2' : '-bottom-1 w-10 h-1.5'
          }`}
          animate={{ scaleX: [1, 0.9, 1] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>

      {/* Speech Bubble */}
      <AnimatePresence>
        {message && (
          <motion.div
            initial={{ opacity: 0, scale: 0.85, x: -10 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            exit={{ opacity: 0, scale: 0.85 }}
            transition={{ type: 'spring', damping: 20, stiffness: 300 }}
            className={`relative ${isLarge ? 'max-w-md' : 'max-w-xs'}`}
          >
            {/* Triangle pointer */}
            <div className="absolute left-0 bottom-3 -translate-x-[6px] w-0 h-0
              border-t-[7px] border-t-transparent
              border-r-[9px] border-r-white
              border-b-[7px] border-b-transparent" />

            <div className={`bg-white rounded-2xl shadow-xl border-l-4 ${BUBBLE_ACCENT[mood]}
              ${isLarge ? 'p-4' : 'p-2.5'}`}
            >
              <p className={`text-gray-800 leading-snug ${isLarge ? 'text-[15px]' : 'text-sm'} font-medium`}>
                {displayedText}
                {isTyping && (
                  <motion.span
                    animate={{ opacity: [1, 0, 1] }}
                    transition={{ duration: 0.4, repeat: Infinity }}
                    className="inline-block w-[3px] h-4 bg-amber-500 ml-0.5 align-middle rounded-full"
                  />
                )}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
