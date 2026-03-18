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

const moodEmojis: Record<BuckMood, string> = {
  neutral: '😐',
  pleased: '😏',
  excited: '🤩',
  disgusted: '🤦'
};

const moodColors: Record<BuckMood, string> = {
  neutral: 'from-amber-800 to-amber-900',
  pleased: 'from-emerald-800 to-emerald-900',
  excited: 'from-yellow-600 to-amber-700',
  disgusted: 'from-red-800 to-red-900'
};

export default function OldManBuck({ message, mood = 'neutral', size = 'small', onMessageComplete }: OldManBuckProps) {
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout[]>([]);

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
      }, 30 * i);
      timeoutRef.current.push(timeout);
    });

    return () => {
      timeoutRef.current.forEach(clearTimeout);
    };
  }, [message, onMessageComplete]);

  // Try Web Speech API for voice
  useEffect(() => {
    if (!message || typeof window === 'undefined') return;
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(message);
      utterance.lang = 'es-MX';
      utterance.rate = 0.9;
      utterance.pitch = 0.7; // Deep grumpy voice
      // Find a Spanish voice
      const voices = window.speechSynthesis.getVoices();
      const spanishVoice = voices.find(v => v.lang.startsWith('es')) || voices[0];
      if (spanishVoice) utterance.voice = spanishVoice;
      window.speechSynthesis.speak(utterance);
    }
  }, [message]);

  const isLarge = size === 'large';

  return (
    <div className={`flex items-end gap-3 ${isLarge ? 'mb-6' : 'mb-2'}`}>
      {/* Buck Character */}
      <motion.div
        className={`relative flex-shrink-0 ${isLarge ? 'w-28 h-28' : 'w-16 h-16'}`}
        animate={
          mood === 'excited' ? { y: [0, -8, 0], rotate: [0, 3, -3, 0] } :
          mood === 'disgusted' ? { rotate: [0, -5, 5, -3, 0] } :
          isSpeaking ? { y: [0, -2, 0] } :
          { y: [0, -3, 0] }
        }
        transition={
          mood === 'excited' ? { duration: 0.5, repeat: 2 } :
          mood === 'disgusted' ? { duration: 0.4, repeat: 1 } :
          isSpeaking ? { duration: 0.3, repeat: Infinity } :
          { duration: 2, repeat: Infinity, ease: 'easeInOut' }
        }
      >
        {/* Body */}
        <div className={`absolute inset-0 rounded-full bg-gradient-to-b ${moodColors[mood]} shadow-lg border-2 border-amber-600/50`}>
          {/* Face */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            {/* Glasses */}
            <div className={`flex gap-0.5 ${isLarge ? 'mb-0.5' : '-mb-0.5'}`}>
              <div className={`${isLarge ? 'w-7 h-5' : 'w-4 h-3'} rounded-full border-2 border-gray-300 bg-white/20`}>
                {/* Eyes */}
                <motion.div
                  className={`${isLarge ? 'w-2 h-2 ml-2 mt-0.5' : 'w-1.5 h-1.5 ml-0.5'} rounded-full bg-black`}
                  animate={mood === 'disgusted' ? { scaleY: 0.5 } : { scaleY: [1, 0.1, 1] }}
                  transition={mood === 'disgusted' ? {} : { duration: 3, repeat: Infinity, repeatDelay: 2 }}
                />
              </div>
              <div className={`${isLarge ? 'w-7 h-5' : 'w-4 h-3'} rounded-full border-2 border-gray-300 bg-white/20`}>
                <motion.div
                  className={`${isLarge ? 'w-2 h-2 ml-2 mt-0.5' : 'w-1.5 h-1.5 ml-0.5'} rounded-full bg-black`}
                  animate={mood === 'disgusted' ? { scaleY: 0.5 } : { scaleY: [1, 0.1, 1] }}
                  transition={mood === 'disgusted' ? {} : { duration: 3, repeat: Infinity, repeatDelay: 2 }}
                />
              </div>
            </div>
            {/* Mouth */}
            <motion.div
              className={`${isLarge ? 'w-6 h-2 mt-1' : 'w-3 h-1 mt-0.5'} rounded-full`}
              style={{
                backgroundColor: mood === 'disgusted' ? '#ef4444' :
                  mood === 'excited' ? '#fbbf24' : '#d1d5db'
              }}
              animate={isSpeaking ? { scaleY: [1, 1.5, 0.5, 1.2, 1] } : {}}
              transition={isSpeaking ? { duration: 0.3, repeat: Infinity } : {}}
            />
          </div>
          {/* Hair (white wisps) */}
          <div className={`absolute ${isLarge ? '-top-2' : '-top-1'} left-1/2 -translate-x-1/2`}>
            <div className={`${isLarge ? 'w-16' : 'w-9'} flex justify-center gap-0.5`}>
              {[...Array(5)].map((_, i) => (
                <motion.div
                  key={i}
                  className={`${isLarge ? 'w-1.5 h-4' : 'w-1 h-2'} bg-gray-200 rounded-full`}
                  animate={{ rotate: [i * 5 - 10, i * 5 - 5, i * 5 - 10] }}
                  transition={{ duration: 2, repeat: Infinity, delay: i * 0.1 }}
                />
              ))}
            </div>
          </div>
          {/* Cherry Coke */}
          <motion.div
            className={`absolute ${isLarge ? '-right-3 bottom-2' : '-right-2 bottom-1'}`}
            animate={mood === 'disgusted' ? { rotate: 30 } : mood === 'pleased' ? { rotate: [-5, 10, -5] } : {}}
            transition={mood === 'pleased' ? { duration: 2, repeat: Infinity } : {}}
          >
            <span className={isLarge ? 'text-2xl' : 'text-sm'}>🥤</span>
          </motion.div>
          {/* Cane (when excited) */}
          {mood === 'excited' && (
            <motion.div
              className={`absolute ${isLarge ? '-left-4 bottom-0' : '-left-2 bottom-0'}`}
              animate={{ rotate: [-20, 20, -20] }}
              transition={{ duration: 0.5, repeat: 3 }}
            >
              <span className={isLarge ? 'text-2xl' : 'text-sm'}>🦯</span>
            </motion.div>
          )}
        </div>
        {/* Suit collar */}
        <div className={`absolute ${isLarge ? '-bottom-1 left-1/2 -translate-x-1/2 w-12 h-4' : '-bottom-0.5 left-1/2 -translate-x-1/2 w-7 h-2'} bg-gray-800 rounded-b-lg`}>
          <div className={`absolute top-0 left-1/2 -translate-x-1/2 ${isLarge ? 'w-2 h-3' : 'w-1 h-2'} bg-red-700 rounded-b-sm`} />
        </div>
      </motion.div>

      {/* Speech Bubble */}
      <AnimatePresence>
        {message && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, x: -10 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className={`relative bg-white rounded-2xl shadow-xl border-2 border-gray-200 ${
              isLarge ? 'p-4 max-w-md' : 'p-3 max-w-xs'
            }`}
          >
            {/* Pointer */}
            <div className="absolute left-0 bottom-3 -translate-x-2 w-0 h-0 border-t-8 border-t-transparent border-r-8 border-r-white border-b-8 border-b-transparent" />

            <div className="flex items-start gap-2">
              <span className="text-lg flex-shrink-0">{moodEmojis[mood]}</span>
              <p className={`text-gray-800 leading-snug ${isLarge ? 'text-base' : 'text-sm'} font-medium`}>
                {displayedText}
                {isTyping && (
                  <motion.span
                    animate={{ opacity: [1, 0, 1] }}
                    transition={{ duration: 0.5, repeat: Infinity }}
                    className="inline-block w-0.5 h-4 bg-amber-600 ml-0.5 align-middle"
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
