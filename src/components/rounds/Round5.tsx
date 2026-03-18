'use client';

import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useGame } from '@/lib/game-context';

export default function Round5() {
  const { state, submitDecision } = useGame();
  const company = state.currentRound?.companies[0];
  const [currentPrice, setCurrentPrice] = useState(0);
  const [buyPrice, setBuyPrice] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const priceHistoryRef = useRef<number[]>([]);
  const [priceHistory, setPriceHistory] = useState<number[]>([]);

  const intrinsicValue = company?.intrinsicValue || 50;
  const safetyZone = intrinsicValue * 0.8; // 20% below

  // Simulate price fluctuation
  useEffect(() => {
    if (!company || buyPrice !== null) return;

    const basePrice = (company.marketPrices.overvalued + company.marketPrices.undervalued) / 2;
    let price = basePrice;
    const interval = setInterval(() => {
      // Random walk with mean reversion
      const change = (Math.random() - 0.5) * 4;
      const reversion = (basePrice - price) * 0.05;
      price = Math.max(intrinsicValue * 0.6, Math.min(intrinsicValue * 1.4, price + change + reversion));
      price = Math.round(price * 100) / 100;
      setCurrentPrice(price);

      priceHistoryRef.current = [...priceHistoryRef.current.slice(-30), price];
      setPriceHistory([...priceHistoryRef.current]);
    }, 500);

    return () => clearInterval(interval);
  }, [company, buyPrice, intrinsicValue]);

  const handleBuy = () => {
    setBuyPrice(currentPrice);
  };

  const handleSubmit = () => {
    setSubmitted(true);
    submitDecision({
      type: buyPrice ? 'buy' : 'pass',
      companyId: company?.id,
      payload: { buyPrice, intrinsicValue },
      timestamp: Date.now()
    });
  };

  if (!company) return null;

  if (submitted) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center text-center">
        <motion.div animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 1, repeat: Infinity }} className="text-5xl mb-4">⏳</motion.div>
        <p className="text-gray-300">Esperando al oponente...</p>
      </div>
    );
  }

  const discount = buyPrice ? ((intrinsicValue - buyPrice) / intrinsicValue) * 100 : 0;

  return (
    <div className="space-y-4">
      <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-3">
        <p className="text-amber-300 text-sm font-semibold">
          🛡️ El precio sube y baja. ¡Compra cuando esté en la ZONA SEGURA!
        </p>
      </div>

      {/* Company info */}
      <div className="bg-gray-900/80 rounded-xl p-3 border border-gray-700/50">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-2xl">{company.logo}</span>
          <div>
            <div className="font-bold text-white">{company.name}</div>
            <div className="text-xs text-gray-400">{company.industry}</div>
          </div>
        </div>
        <div className="flex gap-4 text-sm">
          <div>
            <span className="text-gray-500">Valor real: </span>
            <span className="text-amber-400 font-bold">${intrinsicValue}</span>
          </div>
          <div>
            <span className="text-gray-500">Foso: </span>
            {[...Array(5)].map((_, i) => <span key={i} className={i < company.moatStrength ? '' : 'opacity-20'}>🏰</span>)}
          </div>
        </div>
      </div>

      {/* Price Chart */}
      <div className="bg-gray-900/80 rounded-xl p-4 border border-gray-700/50">
        <div className="flex justify-between items-center mb-2">
          <span className="text-xs text-gray-400 font-semibold">PRECIO EN VIVO</span>
          <motion.span
            key={currentPrice}
            initial={{ scale: 1.3, color: currentPrice > (priceHistory[priceHistory.length - 2] || 0) ? '#4ade80' : '#f87171' }}
            animate={{ scale: 1, color: '#ffffff' }}
            className="text-2xl font-bold font-mono"
          >
            ${currentPrice.toFixed(2)}
          </motion.span>
        </div>

        {/* Visual chart */}
        <div className="relative h-32 bg-gray-800/50 rounded-lg overflow-hidden">
          {/* Intrinsic value line */}
          <div
            className="absolute w-full border-t-2 border-dashed border-amber-400/50 z-10"
            style={{ top: `${Math.max(0, Math.min(100, (1 - (intrinsicValue - intrinsicValue * 0.6) / (intrinsicValue * 0.8)) * 100))}%` }}
          >
            <span className="absolute right-1 -top-4 text-[10px] text-amber-400 bg-gray-900/80 px-1 rounded">Valor real: ${intrinsicValue}</span>
          </div>

          {/* Safety zone */}
          <div
            className="absolute w-full bg-emerald-500/10 border-t border-emerald-500/30 z-0"
            style={{
              top: `${Math.max(0, Math.min(100, (1 - (safetyZone - intrinsicValue * 0.6) / (intrinsicValue * 0.8)) * 100))}%`,
              bottom: 0
            }}
          >
            <span className="absolute right-1 top-1 text-[10px] text-emerald-400 bg-gray-900/80 px-1 rounded">🛡️ Zona segura</span>
          </div>

          {/* Price line */}
          <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
            <polyline
              fill="none"
              stroke="#fbbf24"
              strokeWidth="2"
              points={priceHistory.map((p, i) => {
                const x = (i / 30) * 100;
                const y = (1 - (p - intrinsicValue * 0.6) / (intrinsicValue * 0.8)) * 100;
                return `${x}%,${Math.max(0, Math.min(100, y))}%`;
              }).join(' ')}
            />
          </svg>
        </div>
      </div>

      {/* Buy result or buy button */}
      {buyPrice !== null ? (
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className={`p-4 rounded-xl border-2 text-center ${
            discount >= 20
              ? 'border-emerald-400 bg-emerald-400/10'
              : discount > 0
              ? 'border-amber-400 bg-amber-400/10'
              : 'border-red-400 bg-red-400/10'
          }`}
        >
          <div className="text-lg font-bold mb-1">
            Compraste a ${buyPrice.toFixed(2)}
          </div>
          <div className={`text-sm font-semibold ${
            discount >= 20 ? 'text-emerald-400' : discount > 0 ? 'text-amber-400' : 'text-red-400'
          }`}>
            {discount >= 20 ? `🛡️ Margen de seguridad: ${discount.toFixed(0)}% — ¡EXCELENTE!` :
             discount > 0 ? `📊 Descuento: ${discount.toFixed(0)}% — Aceptable` :
             `⚠️ Pagaste ${Math.abs(discount).toFixed(0)}% DE MÁS`}
          </div>

          <button
            onClick={handleSubmit}
            className="mt-3 w-full py-3 bg-gradient-to-r from-emerald-500 to-green-500 rounded-xl font-bold text-white"
          >
            ✓ Confirmar Compra
          </button>
        </motion.div>
      ) : (
        <div className="flex gap-3">
          <button
            onClick={handleSubmit}
            className="px-6 py-3 bg-gray-800 hover:bg-gray-700 rounded-xl font-semibold"
          >
            ⏭️ Pasar
          </button>
          <motion.button
            onClick={handleBuy}
            whileTap={{ scale: 0.9 }}
            className={`flex-1 py-4 rounded-xl font-bold text-xl transition-all ${
              currentPrice <= safetyZone
                ? 'bg-gradient-to-r from-emerald-500 to-green-500 text-white animate-pulse-glow'
                : currentPrice <= intrinsicValue
                ? 'bg-gradient-to-r from-amber-500 to-yellow-500 text-amber-950'
                : 'bg-gradient-to-r from-red-600 to-red-700 text-white'
            }`}
          >
            🛒 ¡COMPRAR a ${currentPrice.toFixed(2)}!
          </motion.button>
        </div>
      )}
    </div>
  );
}
