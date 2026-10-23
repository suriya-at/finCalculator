import React, { useState } from 'react';
import { ChevronDown, ChevronUp, BookOpen } from 'lucide-react';

interface FormulaBoxProps {
  formula: string;
  explanation: string;
  purpose?: string;
}

export const FormulaBox: React.FC<FormulaBoxProps> = ({ formula, explanation, purpose }) => {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="bg-white dark:bg-[#181B20] rounded-2xl border border-gray-100 dark:border-gray-800 p-5 mt-8 transition-colors">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between text-left focus:outline-none"
      >
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#00D09C]/10 text-[#00D09C] flex items-center justify-center">
            <BookOpen size={18} />
          </div>
          <div>
            <h3 className="text-base font-bold text-gray-900 dark:text-gray-100">
              Formula & Calculation Methodology
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Understand the underlying mathematical formula and variables
            </p>
          </div>
        </div>
        <span className="text-gray-400 dark:text-gray-500">
          {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </span>
      </button>

      {isOpen && (
        <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-800/80 space-y-4">
          {purpose && (
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500 block mb-1">
                About this calculator
              </span>
              <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                {purpose}
              </p>
            </div>
          )}

          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500 block mb-1.5">
              Mathematical Formula
            </span>
            <div className="p-3 bg-gray-50 dark:bg-[#14161A] rounded-xl border border-gray-100 dark:border-gray-800 font-mono text-sm text-[#00D09C] font-semibold overflow-x-auto">
              {formula}
            </div>
          </div>

          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500 block mb-1">
              Component Definitions
            </span>
            <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
              {explanation}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
