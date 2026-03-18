'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

type BuckMood = 'neutral' | 'pleased' | 'excited' | 'disgusted';

interface OldManBuckProps {
  message: string;
  mood?: BuckMood;
  size?: 'small' | 'large';
  onMessageComplete?: () => void;
}

// Check if custom mascot images exist, otherwise use emoji fallback
const MASCOT_IMAGES: Record<BuckMood, string> = {
  neutral: '/mascot/buck-neutral.png',
  pleased: '/mascot/buck-pleased.png',
  excited: '/mascot/buck-excited.png',
  disgusted: '/mascot/buck-disgusted.png',
};

const FALLBACK_EMOJIS: Record<BuckMood, string> = {
  neutral: '👴',
  pleased: '😏',
  excited: '🤩',
  disgusted: '😤',
};

const MOOD_EMOJIS: Record<BuckMood, string> = {
  neutral: '😐',
  pleased: '😏',
  excited: '🤩',
  disgusted: '🤦',
};

const BUBBLE_BORDERS: Record<BuckMood, string> = {
  neutral: 'border-amber-200/50',
  pleased: 'border-emerald-200/50',
  excited: 'border-yellow-300/50',
  disgusted: 'border-red-300/50',
};

const BUBBLE_GLOWS: Record<BuckMood, string> = {
  neutral: 'shadow-amber-500/10',
  pleased: 'shadow-emerald-500/10',
  excited: 'shadow-yellow-500/20',
  disgusted: 'shadow-red-500/10',
};

export default function OldManBuck({ message, mood = 'neutral', size = 'small', onMessageComplete }: OldManBuckProps) {
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [hasCustomImage, setHasCustomImage] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout[]>([]);

  // Check if custom mascot images exist
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
      const timeout = setTimeout(() => {
        setDisplayedText(prev => prev + char);
        if (i === chars.length - 1) {
          setIsTyping(false);
          setIsSpeaking(false);
          onMessageComplete?.();
        }
      }, 25 * i);
      timeoutRef.current.push(timeout);
    });
    return () => { timeoutRef.current.forEach(clearTimeout); };
  }, [message, onMessageComplete]);

  // ElevenLabs TTS
  useEffect(() => {
    if (!message || typeof window === 'undefined') return;
    const apiKey = process.env.NEXT_PUBLIC_ELEVENLABS_API_KEY;
    if (!apiKey) return;
    const voiceId = process.env.NEXT_PUBLIC_ELEVENLABS_VOICE_ID || 'pqHfZKP75CvOlQylNhV4';
    const controller = new AbortController();
    fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'xi-api-key': apiKey },
      body: JSON.stringify({
        text: message, model_id: 'eleven_multilingual_v2',
        voice_settings: { stability: 0.4, similarity_boost: 0.7, style: 0.5, use_speaker_boost: true }
      }),
      signal: controller.signal
    }).then(r => r.blob()).then(blob => {
      const audio = new Audio(URL.createObjectURL(blob));
      audio.playbackRate = 0.95;
      audio.play().catch(() => {});
    }).catch(() => {});
    return () => controller.abort();
  }, [message]);

  const isLarge = size === 'large';
  const imgSize = isLarge ? 'w-28 h-28' : 'w-16 h-16';

  return (
    <div className={`flex items-end gap-3 ${isLarge ? 'mb-4' : 'mb-2'}`}>
      {/* Buck Character */}
      <motion.div
        className={`relative flex-shrink-0 ${imgSize}`}
        animate={
          mood === 'excited' ? { y: [0, -10, 0], rotate: [0, 5, -5, 0] } :
          mood === 'disgusted' ? { rotate: [0, -4, 4, -2, 0] } :
          isSpeaking ? { y: [0, -3, 0] } :
          { y: [0, -4, 0] }
        }
        transition={
          mood === 'excited' ? { duration: 0.5, repeat: 3, ease: 'easeInOut' } :
          mood === 'disgusted' ? { duration: 0.4, repeat: 1 } :
          isSpeaking ? { duration: 0.25, repeat: Infinity } :
          { duration: 2.5, repeat: Infinity, ease: 'easeInOut' }
        }
      >
        {hasCustomImage ? (
          /* AI-Generated 3D Mascot Image */
          <motion.img
            src={MASCOT_IMAGES[mood]}
            alt="Old Man Buck"
            className={`${imgSize} object-contain drop-shadow-2xl`}
            key={mood}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
          />
        ) : (
          /* Fallback: Stylized 3D-effect emoji character */
          <div className={`${imgSize} relative`}>
            {/* Glow ring behind character */}
            <div className={`absolute inset-0 rounded-full ${
              mood === 'excited' ? 'bg-yellow-500/30' :
              mood === 'disgusted' ? 'bg-red-500/20' :
              mood === 'pleased' ? 'bg-emerald-500/20' : 'bg-amber-500/20'
            } blur-xl`} />

            {/* Character circle with gradient */}
            <div className={`relative ${imgSize} rounded-full overflow-hidden
              bg-gradient-to-br from-amber-100 via-amber-200 to-amber-400
              shadow-xl shadow-amber-900/30
              border-2 ${
                mood === 'excited' ? 'border-yellow-400' :
                mood === 'disgusted' ? 'border-red-400' :
                mood === 'pleased' ? 'border-emerald-400' : 'border-amber-400'
              }
              flex items-center justify-center
            `}>
              <motion.span
                className={isLarge ? 'text-5xl' : 'text-2xl'}
                animate={isSpeaking ? { scale: [1, 1.1, 1] } : {}}
                transition={isSpeaking ? { duration: 0.3, repeat: Infinity } : {}}
              >
                {FALLBACK_EMOJIS[mood]}
              </motion.span>
            </div>

            {/* Floating accessories */}
            {/* Glasses */}
            <motion.div
              className={`absolute ${isLarge ? 'top-1 -right-1 text-lg' : 'top-0 -right-0.5 text-xs'}`}
              animate={{ rotate: mood === 'disgusted' ? [0, 10, 0] : 0 }}
              transition={{ duration: 0.5 }}
            >
              🤓
            </motion.div>
            {/* Cherry Coke */}
            <motion.div
              className={`absolute ${isLarge ? '-bottom-1 -right-2 text-lg' : '-bottom-0.5 -right-1 text-xs'}`}
              animate={mood === 'pleased' ? { rotate: [-10, 15, -10] } : {}}
              transition={{ duration: 2, repeat: Infinity }}
            >
              🥤
            </motion.div>
            {/* Cane when excited */}
            {mood === 'excited' && (
              <motion.div
                className={`absolute ${isLarge ? '-left-3 bottom-0 text-xl' : '-left-2 -bottom-0.5 text-sm'}`}
                animate={{ rotate: [-30, 30, -30] }}
                transition={{ duration: 0.4, repeat: 3 }}
              >
                🦯
              </motion.div>
            )}
          </div>
        )}

        {/* 3D shadow */}
        <div className={`absolute -bottom-1 left-1/2 -translate-x-1/2 ${
          isLarge ? 'w-20 h-2' : 'w-12 h-1'
        } bg-black/15 rounded-full blur-sm`} />
      </motion.div>

      {/* Speech Bubble - Glassmorphism */}
      <AnimatePresence>
        {message && (
          <motion.div
            initial={{ opacity: 0, scale: 0.85, x: -15 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            exit={{ opacity: 0, scale: 0.85 }}
            transition={{ type: 'spring', damping: 20, stiffness: 300 }}
            className={`relative ${isLarge ? 'max-w-md' : 'max-w-xs'}`}
          >
            {/* Pointer */}
            <div className="absolute left-0 bottom-3 -translate-x-[7px]">
              <div className="w-0 h-0
                border-t-[8px] border-t-transparent
                border-r-[10px] border-r-white/95
                border-b-[8px] border-b-transparent
                drop-shadow-sm" />
            </div>

            <div className={`bg-white/95 backdrop-blur-xl rounded-2xl
              shadow-2xl ${BUBBLE_GLOWS[mood]}
              border ${BUBBLE_BORDERS[mood]}
              ${isLarge ? 'p-4' : 'p-3'}
            `}>
              <div className="flex items-start gap-2">
                <span className="text-lg flex-shrink-0 mt-0.5">{MOOD_EMOJIS[mood]}</span>
                <p className={`text-gray-800 leading-snug ${isLarge ? 'text-base' : 'text-sm'} font-medium`}>
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
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
