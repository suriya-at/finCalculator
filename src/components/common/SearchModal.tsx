import React, { useState, useEffect, useRef } from 'react';
import { Search, X, ArrowRight, Calculator } from 'lucide-react';
import { searchCalculators } from '../../utils/calculators';
import type { CalculatorMeta } from '../../types/calculator';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectCalculator: (id: string) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  onSelectCalculator,
}) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<CalculatorMeta[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setResults(searchCalculators(query));
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
    }
  }, [isOpen, query]);

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-black/60 backdrop-blur-sm transition-opacity">
      <div className="relative w-full max-w-2xl bg-white dark:bg-[#181B20] rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-800 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3.5 border-b border-gray-100 dark:border-gray-800">
          <Search size={20} className="text-gray-400 mr-3 flex-shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search any calculator (SIP, EMI, Tax, CAGR, PPF...)"
            className="w-full bg-transparent outline-none text-base text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 font-medium"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 mr-2"
            >
              <X size={16} />
            </button>
          )}
          <button
            onClick={onClose}
            className="text-xs bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 px-2 py-1 rounded-md font-mono"
          >
            ESC
          </button>
        </div>

        {/* Search Results List */}
        <div className="max-h-[60vh] overflow-y-auto p-3 space-y-1">
          {results.length === 0 ? (
            <div className="py-12 text-center text-gray-400 dark:text-gray-500">
              <Calculator size={36} className="mx-auto mb-2 opacity-50" />
              <p className="text-sm">No calculators match your search "{query}"</p>
            </div>
          ) : (
            results.map((calc) => (
              <button
                key={calc.id}
                onClick={() => {
                  onSelectCalculator(calc.id);
                  onClose();
                }}
                className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800/60 text-left transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#00D09C]/10 text-[#00D09C] flex items-center justify-center font-bold text-sm flex-shrink-0">
                    {calc.shortName.slice(0, 3)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-gray-900 dark:text-white group-hover:text-[#00D09C] transition-colors">
                        {calc.name}
                      </span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                          calc.category === 'investment'
                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-400'
                            : calc.category === 'loan'
                            ? 'bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-400'
                            : 'bg-purple-100 text-purple-800 dark:bg-purple-950/60 dark:text-purple-400'
                        }`}
                      >
                        {calc.category}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-1 mt-0.5">
                      {calc.description}
                    </p>
                  </div>
                </div>
                <ArrowRight
                  size={16}
                  className="text-gray-300 dark:text-gray-600 group-hover:text-[#00D09C] group-hover:translate-x-1 transition-all flex-shrink-0"
                />
              </button>
            ))
          )}
        </div>

        {/* Footer hint */}
        <div className="px-4 py-2.5 bg-gray-50 dark:bg-[#14161A] border-t border-gray-100 dark:border-gray-800 text-xs text-gray-400 dark:text-gray-500 flex items-center justify-between">
          <span>Showing {results.length} calculators</span>
          <span>Tip: Press Ctrl+K anytime</span>
        </div>
      </div>
    </div>
  );
};
