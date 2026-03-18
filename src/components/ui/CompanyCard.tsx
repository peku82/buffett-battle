'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

interface CompanyFinancials {
  revenue: string;
  profitMargin: number;
  growth: number;
  debtLevel: string;
  roe: number;
  freeCashFlow: string;
  trend: string;
  consistency: string;
}

interface CompanyCardProps {
  id: string;
  name: string;
  logo: string;
  industry: string;
  description: string;
  financials?: CompanyFinancials;
  moatStrength?: number;
  moatDescription?: string;
  showFinancials?: boolean;
  showMoat?: boolean;
  selected?: boolean;
  onClick?: () => void;
  compact?: boolean;
}

const debtColors: Record<string, string> = {
  none: 'text-emerald-400',
  low: 'text-green-400',
  medium: 'text-amber-400',
  high: 'text-red-400'
};

const debtLabels: Record<string, string> = {
  none: 'Sin deuda',
  low: 'Baja',
  medium: 'Media',
  high: '⚠️ Alta'
};

const trendIcons: Record<string, string> = {
  up: '📈',
  flat: '➡️',
  down: '📉'
};

export default function CompanyCard({
  name, logo, industry, description, financials, moatStrength, moatDescription,
  showFinancials, showMoat, selected, onClick, compact
}: CompanyCardProps) {
  const [flipped, setFlipped] = useState(false);

  return (
    <motion.div
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      className={`relative rounded-2xl border-2 transition-all cursor-pointer overflow-hidden ${
        selected
          ? 'border-amber-400 bg-amber-400/10 shadow-lg shadow-amber-400/20'
          : 'border-gray-700 bg-gray-900/80 hover:border-gray-500'
      } ${compact ? 'p-3' : 'p-4'}`}
    >
      {/* Header */}
      <div className="flex items-center gap-3 mb-3">
        <span className={compact ? 'text-2xl' : 'text-3xl'}>{logo}</span>
        <div className="flex-1 min-w-0">
          <h3 className={`font-bold text-white truncate ${compact ? 'text-base' : 'text-lg'}`}>{name}</h3>
          <span className="text-xs text-gray-400 bg-gray-800 px-2 py-0.5 rounded-full">{industry}</span>
        </div>
        {selected && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="w-8 h-8 bg-amber-400 rounded-full flex items-center justify-center"
          >
            <span className="text-amber-950 font-bold text-sm">✓</span>
          </motion.div>
        )}
      </div>

      {/* Description */}
      <p className={`text-gray-300 ${compact ? 'text-xs' : 'text-sm'} leading-relaxed mb-3`}>{description}</p>

      {/* Financial Dashboard */}
      {showFinancials && financials && (
        <div className="grid grid-cols-2 gap-2 mt-3">
          <div className="bg-gray-800/60 rounded-lg p-2">
            <div className="text-[10px] text-gray-500 uppercase tracking-wider">Ingresos</div>
            <div className="text-sm font-bold text-white">{financials.revenue}</div>
          </div>
          <div className="bg-gray-800/60 rounded-lg p-2">
            <div className="text-[10px] text-gray-500 uppercase tracking-wider">Margen</div>
            <div className={`text-sm font-bold ${financials.profitMargin >= 15 ? 'text-emerald-400' : financials.profitMargin >= 0 ? 'text-amber-400' : 'text-red-400'}`}>
              {financials.profitMargin}%
            </div>
          </div>
          <div className="bg-gray-800/60 rounded-lg p-2">
            <div className="text-[10px] text-gray-500 uppercase tracking-wider">Crecimiento</div>
            <div className={`text-sm font-bold ${financials.growth >= 10 ? 'text-emerald-400' : 'text-amber-400'}`}>
              {trendIcons[financials.trend]} {financials.growth}%/año
            </div>
          </div>
          <div className="bg-gray-800/60 rounded-lg p-2">
            <div className="text-[10px] text-gray-500 uppercase tracking-wider">Deuda</div>
            <div className={`text-sm font-bold ${debtColors[financials.debtLevel]}`}>
              {debtLabels[financials.debtLevel]}
            </div>
          </div>
          <div className="bg-gray-800/60 rounded-lg p-2">
            <div className="text-[10px] text-gray-500 uppercase tracking-wider">ROE</div>
            <div className={`text-sm font-bold ${financials.roe >= 15 ? 'text-emerald-400' : financials.roe >= 0 ? 'text-amber-400' : 'text-red-400'}`}>
              {financials.roe}%
            </div>
          </div>
          <div className="bg-gray-800/60 rounded-lg p-2">
            <div className="text-[10px] text-gray-500 uppercase tracking-wider">Flujo Libre</div>
            <div className={`text-sm font-bold ${financials.freeCashFlow.startsWith('-') ? 'text-red-400' : 'text-emerald-400'}`}>
              {financials.freeCashFlow}
            </div>
          </div>
        </div>
      )}

      {/* Moat indicator */}
      {showMoat && moatStrength !== undefined && (
        <div className="mt-3 flex items-center gap-2">
          <div className="flex gap-0.5">
            {[1, 2, 3, 4, 5].map(i => (
              <span key={i} className={`text-sm ${i <= moatStrength ? '' : 'opacity-20'}`}>🏰</span>
            ))}
          </div>
          {moatDescription && (
            <span className="text-xs text-gray-400">{moatDescription}</span>
          )}
        </div>
      )}
    </motion.div>
  );
}
