import React, { useEffect } from 'react';
import { getCalculatorById, CALCULATORS_LIST } from '../../utils/calculators';
import { InvestmentCalculators } from './InvestmentCalculators';
import { LoanCalculators } from './LoanCalculators';
import { TaxAndPlanningCalculators } from './TaxAndPlanningCalculators';
import { FormulaBox } from '../common/FormulaBox';
import { ChevronRight, ArrowLeft, ArrowRight, Sparkles, TrendingUp, Landmark, FileSpreadsheet } from 'lucide-react';

interface CalculatorWrapperProps {
  calculatorId: string;
  onSelectCalculator: (id: string) => void;
  onBackToHome: () => void;
}

export const CalculatorWrapper: React.FC<CalculatorWrapperProps> = ({
  calculatorId,
  onSelectCalculator,
  onBackToHome,
}) => {
  const meta = getCalculatorById(calculatorId);

  // Scroll to top whenever calculator changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [calculatorId]);

  if (!meta) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Calculator Not Found
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          The requested calculator could not be located.
        </p>
        <button
          onClick={onBackToHome}
          className="px-6 py-2.5 bg-[#00D09C] hover:bg-[#04B488] text-white font-medium rounded-xl transition-all shadow-md shadow-[#00D09C]/20"
        >
          Return to All Calculators
        </button>
      </div>
    );
  }

  // Get related calculators (from the same category excluding the current one)
  const relatedCalculators = CALCULATORS_LIST.filter(
    (c) => c.category === meta.category && c.id !== meta.id
  ).slice(0, 3);

  const categoryLabel =
    meta.category === 'investment'
      ? 'Investment Calculators'
      : meta.category === 'loan'
      ? 'Loan & EMI Calculators'
      : 'Tax & Planning Calculators';

  const categoryIcon =
    meta.category === 'investment' ? (
      <TrendingUp size={16} className="text-[#00D09C]" />
    ) : meta.category === 'loan' ? (
      <Landmark size={16} className="text-blue-500" />
    ) : (
      <FileSpreadsheet size={16} className="text-purple-500" />
    );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
      {/* Breadcrumb Navigation */}
      <nav aria-label="Breadcrumb" className="mb-6 flex items-center flex-wrap gap-2 text-sm text-gray-500 dark:text-gray-400">
        <button
          onClick={onBackToHome}
          className="flex items-center gap-1 hover:text-[#00D09C] dark:hover:text-[#00D09C] transition-colors"
        >
          <ArrowLeft size={16} />
          <span>Home</span>
        </button>
        <ChevronRight size={14} className="text-gray-300 dark:text-gray-600" />
        <span className="flex items-center gap-1.5 font-medium text-gray-700 dark:text-gray-300">
          {categoryIcon}
          {categoryLabel}
        </span>
        <ChevronRight size={14} className="text-gray-300 dark:text-gray-600" />
        <span className="font-semibold text-gray-900 dark:text-white">
          {meta.name}
        </span>
      </nav>

      {/* Calculator Header Card */}
      <header className="mb-8 p-6 sm:p-8 bg-gradient-to-r from-emerald-50/60 via-white to-teal-50/40 dark:from-[#181B20] dark:via-[#15171C] dark:to-[#181B20] rounded-3xl border border-emerald-100/60 dark:border-gray-800 shadow-sm">
        <div className="flex flex-wrap items-center gap-2.5 mb-3">
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-[#009E77] dark:text-[#00D09C]">
            {categoryIcon}
            {categoryLabel}
          </span>
          {meta.badge && (
            <span className="inline-flex items-center gap-1 text-xs font-bold px-2.5 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300">
              <Sparkles size={12} />
              {meta.badge}
            </span>
          )}
        </div>
        <h1 className="text-2xl sm:text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight mb-3">
          {meta.name}
        </h1>
        <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 max-w-3xl leading-relaxed">
          {meta.description}
        </p>
      </header>

      {/* Main Interactive Calculator Area */}
      <main className="mb-12">
        {meta.category === 'investment' && <InvestmentCalculators id={meta.id} />}
        {meta.category === 'loan' && <LoanCalculators id={meta.id} />}
        {meta.category === 'other' && <TaxAndPlanningCalculators id={meta.id} />}
      </main>

      {/* Formula & Explanation Accordion */}
      <section className="mb-16">
        <FormulaBox
          formula={meta.formula}
          explanation={meta.formulaExplanation}
          purpose={meta.description}
        />
      </section>

      {/* Related Calculators Section */}
      {relatedCalculators.length > 0 && (
        <section className="border-t border-gray-100 dark:border-gray-800 pt-10">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                Related Financial Calculators
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Explore more tools in {categoryLabel} to plan your finances better
              </p>
            </div>
            <button
              onClick={onBackToHome}
              className="text-sm font-semibold text-[#00D09C] hover:text-[#04B488] flex items-center gap-1"
            >
              View all 25
              <ArrowRight size={16} />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {relatedCalculators.map((calc) => (
              <button
                key={calc.id}
                onClick={() => onSelectCalculator(calc.id)}
                className="group text-left p-5 bg-white dark:bg-[#181B20] rounded-2xl border border-gray-100 dark:border-gray-800 hover:border-[#00D09C]/40 hover:shadow-lg dark:hover:shadow-black/40 transition-all duration-200 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
                      {calc.shortName}
                    </span>
                    {calc.badge && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-[#00D09C]">
                        {calc.badge}
                      </span>
                    )}
                  </div>
                  <h3 className="text-base font-bold text-gray-900 dark:text-white group-hover:text-[#00D09C] transition-colors mb-2">
                    {calc.name}
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 leading-relaxed">
                    {calc.description}
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-gray-50 dark:border-gray-800/60 flex items-center justify-between text-xs font-semibold text-[#00D09C]">
                  <span>Calculate Now</span>
                  <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </div>
              </button>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};
