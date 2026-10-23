import React, { useState, useMemo } from 'react';
import {
  CALCULATORS_LIST,
  getCalculatorsByCategory,
} from '../utils/calculators';
import type { CalculatorCategory, CalculatorMeta } from '../types/calculator';
import {
  Search,
  TrendingUp,
  Landmark,
  FileSpreadsheet,
  ArrowRight,
  Sparkles,
  ShieldCheck,
  Zap,
  PieChart,
  Lock,
} from 'lucide-react';

interface HomePageProps {
  onSelectCalculator: (id: string) => void;
  onOpenSearch: () => void;
  initialCategory?: string;
}

export const HomePage: React.FC<HomePageProps> = ({
  onSelectCalculator,
  onOpenSearch,
  initialCategory = 'all',
}) => {
  const [activeTab, setActiveTab] = useState<string>(initialCategory);
  const [localSearch, setLocalSearch] = useState('');

  // Popular calculators list for featured quick access
  const popularCalcIds = [
    'sip-calculator',
    'emi-calculator',
    'income-tax-calculator',
    'step-up-sip-calculator',
    'home-loan-calculator',
    'lumpsum-calculator',
  ];

  const popularCalculators = useMemo(() => {
    return popularCalcIds
      .map((id) => CALCULATORS_LIST.find((c) => c.id === id))
      .filter((c): c is CalculatorMeta => c !== undefined);
  }, []);

  // Filtered calculators based on tab & inline search
  const filteredCalculators = useMemo(() => {
    let list =
      activeTab === 'all'
        ? CALCULATORS_LIST
        : getCalculatorsByCategory(activeTab as CalculatorCategory);

    if (localSearch.trim()) {
      const q = localSearch.trim().toLowerCase();
      list = list.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.shortName.toLowerCase().includes(q) ||
          c.description.toLowerCase().includes(q) ||
          c.keywords.some((k) => k.toLowerCase().includes(q))
      );
    }
    return list;
  }, [activeTab, localSearch]);

  const investmentCount = CALCULATORS_LIST.filter((c) => c.category === 'investment').length;
  const loanCount = CALCULATORS_LIST.filter((c) => c.category === 'loan').length;
  const otherCount = CALCULATORS_LIST.filter((c) => c.category === 'other').length;

  const getCategoryTheme = (category: CalculatorCategory) => {
    switch (category) {
      case 'investment':
        return {
          badgeBg: 'bg-emerald-50 dark:bg-emerald-950/40',
          badgeText: 'text-[#009E77] dark:text-[#00D09C]',
          icon: <TrendingUp size={15} className="text-[#00D09C]" />,
          label: 'Investment',
        };
      case 'loan':
        return {
          badgeBg: 'bg-blue-50 dark:bg-blue-950/40',
          badgeText: 'text-blue-700 dark:text-blue-400',
          icon: <Landmark size={15} className="text-blue-500" />,
          label: 'Loan & EMI',
        };
      case 'other':
        return {
          badgeBg: 'bg-purple-50 dark:bg-purple-950/40',
          badgeText: 'text-purple-700 dark:text-purple-400',
          icon: <FileSpreadsheet size={15} className="text-purple-500" />,
          label: 'Tax & Planning',
        };
    }
  };

  return (
    <div className="space-y-16 pb-12">
      {/* 1. Hero Section */}
      <section className="relative overflow-hidden pt-8 pb-12 sm:pt-14 sm:pb-20 bg-gradient-to-b from-emerald-50/50 via-teal-50/20 to-transparent dark:from-[#181B20]/60 dark:via-[#14161A]/40 dark:to-transparent border-b border-gray-100 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          {/* Eyebrow Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white dark:bg-[#1E2228] border border-emerald-200/80 dark:border-emerald-800/40 shadow-xs mb-6">
            <span className="flex h-2 w-2 rounded-full bg-[#00D09C] animate-pulse" />
            <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">
              Groww-Inspired Financial Suite • 25 Calculators
            </span>
          </div>

          {/* Main H1 */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-gray-900 dark:text-white tracking-tight max-w-4xl mx-auto leading-[1.15]">
            Smart Financial Calculators for Every{' '}
            <span className="bg-gradient-to-r from-[#00D09C] to-[#04B488] bg-clip-text text-transparent">
              Money Goal
            </span>
          </h1>

          {/* Subtitle */}
          <p className="mt-5 text-base sm:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Accurately project SIP returns, calculate home & personal loan EMIs, compare Old vs New tax regimes with FY 2024-25 slabs, and plan your retirement with real-time verified formulas.
          </p>

          {/* Search Trigger Bar */}
          <div className="mt-8 max-w-2xl mx-auto">
            <div
              onClick={onOpenSearch}
              className="group cursor-pointer flex items-center justify-between px-5 py-3.5 bg-white dark:bg-[#181B20] rounded-2xl border border-gray-200 dark:border-gray-700 hover:border-[#00D09C] dark:hover:border-[#00D09C] shadow-lg shadow-gray-100/50 dark:shadow-black/20 transition-all duration-200"
            >
              <div className="flex items-center gap-3 text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300">
                <Search size={20} className="text-[#00D09C]" />
                <span className="text-sm sm:text-base font-normal">
                  Search any calculator (e.g. SIP, EMI, Income Tax, Step-Up)...
                </span>
              </div>
              <kbd className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-gray-400 dark:text-gray-500 bg-gray-100 dark:bg-[#22272E] rounded-md border border-gray-200 dark:border-gray-700">
                Ctrl K
              </kbd>
            </div>
          </div>

          {/* Key Trust Signals */}
          <div className="mt-10 flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-xs sm:text-sm text-gray-500 dark:text-gray-400 font-medium">
            <div className="flex items-center gap-2">
              <Zap size={16} className="text-[#00D09C]" />
              <span>Instant Client-Side Reactivity</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck size={16} className="text-[#00D09C]" />
              <span>Budget 2024 & RBI Compliant</span>
            </div>
            <div className="flex items-center gap-2">
              <PieChart size={16} className="text-[#00D09C]" />
              <span>Interactive Visual Charts</span>
            </div>
            <div className="flex items-center gap-2">
              <Lock size={16} className="text-[#00D09C]" />
              <span>100% Free & Private</span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Popular Calculators Quick Access */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-100 dark:bg-amber-950/40 flex items-center justify-center text-amber-700 dark:text-amber-400">
              <Sparkles size={18} />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                Most Popular Calculators
              </h2>
              <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                Calculators most frequently used by Indian investors and home buyers
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {popularCalculators.map((calc) => {
            const theme = getCategoryTheme(calc.category);
            return (
              <div
                key={calc.id}
                onClick={() => onSelectCalculator(calc.id)}
                className="group cursor-pointer p-6 bg-white dark:bg-[#181B20] rounded-2xl border border-gray-100 dark:border-gray-800 hover:border-[#00D09C] hover:shadow-xl dark:hover:shadow-black/40 transition-all duration-200 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span
                      className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-0.5 rounded-full ${theme.badgeBg} ${theme.badgeText}`}
                    >
                      {theme.icon}
                      {theme.label}
                    </span>
                    {calc.badge && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400">
                        {calc.badge}
                      </span>
                    )}
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white group-hover:text-[#00D09C] transition-colors mb-2">
                    {calc.name}
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 line-clamp-2 leading-relaxed">
                    {calc.description}
                  </p>
                </div>

                <div className="mt-5 pt-3 border-t border-gray-50 dark:border-gray-800/80 flex items-center justify-between text-xs font-semibold text-[#00D09C]">
                  <span className="font-mono text-[11px] text-gray-400 dark:text-gray-500 truncate max-w-[200px]">
                    {calc.formula}
                  </span>
                  <div className="flex items-center gap-1 group-hover:translate-x-1 transition-transform flex-shrink-0">
                    <span>Calculate</span>
                    <ArrowRight size={14} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 3. Full Categorized Directory */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
              All Financial Calculators
            </h2>
            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
              Select a category or search below to launch any calculator
            </p>
          </div>

          {/* Category Tabs */}
          <div className="flex flex-wrap items-center gap-2 p-1.5 bg-gray-100 dark:bg-[#181B20] rounded-2xl border border-gray-200/60 dark:border-gray-800">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                activeTab === 'all'
                  ? 'bg-white dark:bg-[#22272E] text-gray-900 dark:text-white shadow-xs'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              All ({CALCULATORS_LIST.length})
            </button>
            <button
              onClick={() => setActiveTab('investment')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                activeTab === 'investment'
                  ? 'bg-white dark:bg-[#22272E] text-gray-900 dark:text-white shadow-xs'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              <TrendingUp size={14} className="text-[#00D09C]" />
              Investment ({investmentCount})
            </button>
            <button
              onClick={() => setActiveTab('loan')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                activeTab === 'loan'
                  ? 'bg-white dark:bg-[#22272E] text-gray-900 dark:text-white shadow-xs'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              <Landmark size={14} className="text-blue-500" />
              Loans ({loanCount})
            </button>
            <button
              onClick={() => setActiveTab('other')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                activeTab === 'other'
                  ? 'bg-white dark:bg-[#22272E] text-gray-900 dark:text-white shadow-xs'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              <FileSpreadsheet size={14} className="text-purple-500" />
              Tax & Planning ({otherCount})
            </button>
          </div>
        </div>

        {/* Inline Fast Search Input */}
        <div className="mb-6 relative">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            placeholder={`Filter ${activeTab === 'all' ? 'all 25' : activeTab} calculators...`}
            className="w-full pl-11 pr-4 py-2.5 bg-white dark:bg-[#181B20] border border-gray-200 dark:border-gray-800 rounded-xl text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:border-[#00D09C] transition-colors"
          />
          {localSearch && (
            <button
              onClick={() => setLocalSearch('')}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-semibold text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
            >
              Clear
            </button>
          )}
        </div>

        {/* Calculators Cards Grid */}
        {filteredCalculators.length === 0 ? (
          <div className="p-12 text-center bg-white dark:bg-[#181B20] rounded-2xl border border-gray-100 dark:border-gray-800">
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              No calculators matching "{localSearch}".
            </p>
            <button
              onClick={() => {
                setLocalSearch('');
                setActiveTab('all');
              }}
              className="mt-3 text-xs font-semibold text-[#00D09C] hover:underline"
            >
              Reset filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredCalculators.map((calc) => {
              const theme = getCategoryTheme(calc.category);
              return (
                <div
                  key={calc.id}
                  onClick={() => onSelectCalculator(calc.id)}
                  className="group cursor-pointer p-6 bg-white dark:bg-[#181B20] rounded-2xl border border-gray-100 dark:border-gray-800 hover:border-[#00D09C] hover:shadow-lg dark:hover:shadow-black/40 transition-all duration-200 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span
                        className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-0.5 rounded-full ${theme.badgeBg} ${theme.badgeText}`}
                      >
                        {theme.icon}
                        {theme.label}
                      </span>
                      {calc.badge && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-[#00D09C]">
                          {calc.badge}
                        </span>
                      )}
                    </div>
                    <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white group-hover:text-[#00D09C] transition-colors mb-2">
                      {calc.name}
                    </h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 leading-relaxed">
                      {calc.description}
                    </p>
                  </div>

                  <div className="mt-5 pt-3 border-t border-gray-50 dark:border-gray-800/80 flex items-center justify-between text-xs font-semibold text-[#00D09C]">
                    <span className="font-mono text-[10px] text-gray-400 dark:text-gray-500 truncate max-w-[190px]">
                      {calc.formula}
                    </span>
                    <div className="flex items-center gap-1 group-hover:translate-x-1 transition-transform flex-shrink-0">
                      <span>Launch</span>
                      <ArrowRight size={13} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* 4. Why Use Our Financial Calculators Feature Showcase */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 sm:p-12 bg-gradient-to-r from-emerald-500/10 via-teal-500/5 to-cyan-500/10 dark:from-emerald-950/20 dark:via-teal-950/10 dark:to-cyan-950/20 rounded-3xl border border-emerald-500/20">
          <div className="max-w-3xl mb-8">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
              Engineered for Speed, Clarity, and Precision
            </h2>
            <p className="mt-2 text-sm sm:text-base text-gray-600 dark:text-gray-300">
              Unlike ordinary calculators with rigid forms and confusing pages, FinCalc provides responsive sliders, real-time recalculations, SVG breakdown charts, and full formula transparency.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-5 bg-white dark:bg-[#181B20] rounded-2xl border border-gray-100 dark:border-gray-800 shadow-xs">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 flex items-center justify-center text-[#00D09C] mb-4">
                <Zap size={20} />
              </div>
              <h3 className="text-base font-bold text-gray-900 dark:text-white mb-1">
                Zero-Latency Reactivity
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                Dual slider and direct number inputs compute results instantaneously on every stroke.
              </p>
            </div>

            <div className="p-5 bg-white dark:bg-[#181B20] rounded-2xl border border-gray-100 dark:border-gray-800 shadow-xs">
              <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-950/60 flex items-center justify-center text-blue-500 mb-4">
                <ShieldCheck size={20} />
              </div>
              <h3 className="text-base font-bold text-gray-900 dark:text-white mb-1">
                Indian Tax & Slabs
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                Budget 2024 revised income tax slabs, EPF 8.25%, and Gratuity Act 1972 statutory rules.
              </p>
            </div>

            <div className="p-5 bg-white dark:bg-[#181B20] rounded-2xl border border-gray-100 dark:border-gray-800 shadow-xs">
              <div className="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-950/60 flex items-center justify-center text-purple-500 mb-4">
                <PieChart size={20} />
              </div>
              <h3 className="text-base font-bold text-gray-900 dark:text-white mb-1">
                Visual Analytics
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                Clean Donut charts and expandable year-by-year amortization and growth tables.
              </p>
            </div>

            <div className="p-5 bg-white dark:bg-[#181B20] rounded-2xl border border-gray-100 dark:border-gray-800 shadow-xs">
              <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-950/60 flex items-center justify-center text-amber-500 mb-4">
                <Lock size={20} />
              </div>
              <h3 className="text-base font-bold text-gray-900 dark:text-white mb-1">
                100% Client-Side
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                No account required, no tracking, and zero personal financial numbers ever transmitted.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
