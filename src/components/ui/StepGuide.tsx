'use client';

import { motion } from 'framer-motion';

interface StepGuideProps {
  currentStep: number;
  totalSteps: number;
  steps: { label: string; icon: string }[];
}

export default function StepGuide({ currentStep, totalSteps, steps }: StepGuideProps) {
  return (
    <div className="flex items-center gap-1 py-1">
      {steps.map((step, i) => {
        const stepNum = i + 1;
        const isActive = stepNum === currentStep;
        const isCompleted = stepNum < currentStep;

        return (
          <div key={i} className="flex items-center">
            <motion.div
              className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold transition-all ${
                isActive
                  ? 'bg-amber-500/20 border border-amber-400/50 text-amber-300'
                  : isCompleted
                  ? 'bg-emerald-500/10 text-emerald-400/70'
                  : 'text-gray-600'
              }`}
              animate={isActive ? { scale: [1, 1.05, 1] } : {}}
              transition={isActive ? { duration: 1.5, repeat: Infinity } : {}}
            >
              <span>{isCompleted ? '✓' : step.icon}</span>
              {isActive && <span className="hidden sm:inline">{step.label}</span>}
            </motion.div>
            {i < steps.length - 1 && (
              <div className={`w-3 h-px mx-0.5 ${
                isCompleted ? 'bg-emerald-500/40' : 'bg-gray-700'
              }`} />
            )}
          </div>
        );
      })}
    </div>
  );
}
