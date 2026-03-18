'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface TimerBarProps {
  endTime: number;
  onExpire?: () => void;
}

export default function TimerBar({ endTime, onExpire }: TimerBarProps) {
  const [progress, setProgress] = useState(100);
  const [secondsLeft, setSecondsLeft] = useState(0);

  useEffect(() => {
    const totalDuration = endTime - Date.now();
    const interval = setInterval(() => {
      const remaining = Math.max(0, endTime - Date.now());
      const pct = (remaining / totalDuration) * 100;
      setProgress(pct);
      setSecondsLeft(Math.ceil(remaining / 1000));
      if (remaining <= 0) {
        clearInterval(interval);
        onExpire?.();
      }
    }, 100);
    return () => clearInterval(interval);
  }, [endTime, onExpire]);

  const color = progress > 50 ? 'bg-emerald-500' : progress > 25 ? 'bg-amber-500' : 'bg-red-500';

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-1">
        <span className="text-xs text-gray-400 font-mono">⏱️ Tiempo</span>
        <motion.span
          className={`text-sm font-bold font-mono ${progress <= 25 ? 'text-red-400' : 'text-gray-300'}`}
          animate={progress <= 25 ? { scale: [1, 1.2, 1] } : {}}
          transition={{ duration: 0.5, repeat: Infinity }}
        >
          {secondsLeft}s
        </motion.span>
      </div>
      <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
        <motion.div
          className={`h-full ${color} rounded-full`}
          style={{ width: `${progress}%` }}
          transition={{ ease: 'linear' }}
        />
      </div>
    </div>
  );
}
