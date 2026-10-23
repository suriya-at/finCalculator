import React from 'react';
import { CALCULATORS_LIST } from '../../utils/calculators';
import { TrendingUp, ShieldCheck } from 'lucide-react';

interface FooterProps {
  onSelectCalculator: (id: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onSelectCalculator }) => {
  const investmentCalcs = CALCULATORS_LIST.filter((c) => c.category === 'investment');
  const loanCalcs = CALCULATORS_LIST.filter((c) => c.category === 'loan');
  const otherCalcs = CALCULATORS_LIST.filter((c) => c.category === 'other');

  return (
    <footer className="mt-20 bg-white dark:bg-[#14161A] border-t border-gray-100 dark:border-gray-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Main Links Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Brand Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-[#00D09C] flex items-center justify-center text-white font-bold">
                <TrendingUp size={18} />
              </div>
              <span className="text-xl font-extrabold text-gray-900 dark:text-white">
                Fin<span className="text-[#00D09C]">Calc</span>
              </span>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
              India’s comprehensive suite of 25 financial calculators designed with Groww-inspired clarity, instant reactivity, and verified financial formulas.
            </p>
            <div className="flex items-center gap-2 text-xs text-[#00D09C] font-semibold">
              <ShieldCheck size={16} />
              <span>Accurate Mathematical Models</span>
            </div>
          </div>

          {/* Investment Calculators (11) */}
          <div>
            <h4 className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-3">
              Investment Calculators ({investmentCalcs.length})
            </h4>
            <ul className="space-y-1.5 text-sm">
              {investmentCalcs.map((calc) => (
                <li key={calc.id}>
                  <button
                    onClick={() => onSelectCalculator(calc.id)}
                    className="text-gray-600 dark:text-gray-400 hover:text-[#00D09C] dark:hover:text-[#00D09C] text-left transition-colors"
                  >
                    {calc.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Loan Calculators (6) */}
          <div>
            <h4 className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-3">
              Loan Calculators ({loanCalcs.length})
            </h4>
            <ul className="space-y-1.5 text-sm">
              {loanCalcs.map((calc) => (
                <li key={calc.id}>
                  <button
                    onClick={() => onSelectCalculator(calc.id)}
                    className="text-gray-600 dark:text-gray-400 hover:text-[#00D09C] dark:hover:text-[#00D09C] text-left transition-colors"
                  >
                    {calc.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Tax & Planning Calculators (8) */}
          <div>
            <h4 className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-3">
              Tax & Planning ({otherCalcs.length})
            </h4>
            <ul className="space-y-1.5 text-sm">
              {otherCalcs.map((calc) => (
                <li key={calc.id}>
                  <button
                    onClick={() => onSelectCalculator(calc.id)}
                    className="text-gray-600 dark:text-gray-400 hover:text-[#00D09C] dark:hover:text-[#00D09C] text-left transition-colors"
                  >
                    {calc.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Regulatory & Educational Disclaimer */}
        <div className="pt-8 border-t border-gray-100 dark:border-gray-800 text-xs text-gray-400 dark:text-gray-500 space-y-3">
          <p>
            <strong>Disclaimer:</strong> Mutual fund investments and market securities are subject to market risks. Please read all scheme-related documents carefully before investing. These financial calculators provide estimates based on mathematical compounding, tax slabs, and user-supplied parameters. Past performance does not guarantee future results.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-gray-100 dark:border-gray-800/60">
            <span>
              © {new Date().getFullYear()} FinCalc (Groww Inspired Platform). All rights reserved.
            </span>
            <span className="flex items-center gap-1 text-gray-400">
              Built with React, Vite, TypeScript & Tailwind CSS
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
