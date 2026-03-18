'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import CompanyCard from '@/components/ui/CompanyCard';
import { useGame } from '@/lib/game-context';

export default function Round3() {
  const { state, submitDecision } = useGame();
  const companies = state.currentRound?.companies || [];
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [selectedBuy, setSelectedBuy] = useState<string | null>(null);
  const [phase, setPhase] = useState<'questions' | 'buy'>('questions');
  const [submitted, setSubmitted] = useState(false);

  // Generate questions based on companies
  const questions = [
    {
      id: 'q1',
      text: '¿Cuál empresa tiene el MEJOR margen de ganancia?',
      correctId: [...companies].sort((a, b) => b.financials.profitMargin - a.financials.profitMargin)[0]?.id
    },
    {
      id: 'q2',
      text: '¿Cuál tiene la deuda más PELIGROSA?',
      correctId: companies.find(c => c.financials.debtLevel === 'high')?.id || companies[companies.length - 1]?.id
    },
    {
      id: 'q3',
      text: '¿Cuál crece más RÁPIDO?',
      correctId: [...companies].sort((a, b) => b.financials.growth - a.financials.growth)[0]?.id
    }
  ];

  const allAnswered = Object.keys(answers).length === questions.length;

  const handleSubmit = () => {
    setSubmitted(true);
    const correctAnswers = questions.map(q => ({
      question: q.text,
      correct: answers[q.id] === q.correctId
    }));
    submitDecision({
      type: selectedBuy ? 'buy' : 'pass',
      companyId: selectedBuy || undefined,
      payload: { answers: correctAnswers },
      timestamp: Date.now()
    });
  };

  if (submitted) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center text-center">
        <motion.div animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 1, repeat: Infinity }} className="text-5xl mb-4">⏳</motion.div>
        <p className="text-gray-300">Esperando al oponente...</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Always show company cards with financials */}
      <div className="space-y-3">
        {companies.map(company => (
          <CompanyCard
            key={company.id}
            {...company}
            showFinancials
            selected={phase === 'buy' && selectedBuy === company.id}
            onClick={phase === 'buy' ? () => setSelectedBuy(selectedBuy === company.id ? null : company.id) : undefined}
            compact
          />
        ))}
      </div>

      {phase === 'questions' && (
        <>
          <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-3">
            <p className="text-blue-300 text-sm font-semibold">📊 Analiza los números y contesta:</p>
          </div>

          {questions.map((q, qi) => (
            <div key={q.id} className="bg-gray-900/60 rounded-xl p-3 border border-gray-700/50">
              <p className="text-white text-sm font-semibold mb-2">{qi + 1}. {q.text}</p>
              <div className="grid grid-cols-1 gap-1.5">
                {companies.map(c => (
                  <button
                    key={c.id}
                    onClick={() => setAnswers(prev => ({ ...prev, [q.id]: c.id }))}
                    className={`flex items-center gap-2 p-2 rounded-lg text-sm transition-all text-left ${
                      answers[q.id] === c.id
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                    }`}
                  >
                    <span>{c.logo}</span>
                    <span className="font-medium">{c.name}</span>
                  </button>
                ))}
              </div>
            </div>
          ))}

          {allAnswered && (
            <motion.button
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              onClick={() => setPhase('buy')}
              className="w-full py-3 bg-gradient-to-r from-amber-500 to-yellow-500 rounded-xl font-bold text-amber-950"
            >
              Siguiente: ¿Cuál compras? →
            </motion.button>
          )}
        </>
      )}

      {phase === 'buy' && (
        <>
          <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-3">
            <p className="text-emerald-300 text-sm font-semibold">
              💰 Basándote en los números, ¿cuál comprarías?
            </p>
          </div>
          <div className="flex gap-3">
            <button onClick={() => setPhase('questions')} className="px-4 py-3 bg-gray-800 hover:bg-gray-700 rounded-xl font-semibold">← Atrás</button>
            <button onClick={handleSubmit} className="flex-1 py-3 bg-gradient-to-r from-emerald-500 to-green-500 rounded-xl font-bold text-white">
              {selectedBuy ? '🛒 Comprar' : '⏭️ Pasar'}
            </button>
          </div>
        </>
      )}
    </div>
  );
}
