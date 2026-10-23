import React, { useState } from 'react';
import { SliderInput } from '../common/SliderInput';
import { DonutChart } from '../common/DonutChart';
import { ScheduleTable } from '../common/ScheduleTable';
import { formatINR } from '../../utils/formatters';
import {
  calculateIncomeTax,
  calculateSalary,
  calculateInflation,
  calculateRetirement,
  calculateGratuity,
  calculateSimpleInterest,
  calculateCompoundInterest,
  calculatePercentage,
} from '../../utils/calculators/taxAndPlanning';
import { CheckCircle2, AlertCircle } from 'lucide-react';

interface TaxAndPlanningProps {
  id: string;
}

export const TaxAndPlanningCalculators: React.FC<TaxAndPlanningProps> = ({ id }) => {
  // 18. Income Tax State
  const [taxGross, setTaxGross] = useState(1200000);
  const [tax80C, setTax80C] = useState(150000);
  const [tax80D, setTax80D] = useState(25000);
  const [taxHra, setTaxHra] = useState(100000);
  const [taxOther, setTaxOther] = useState(50000);

  // 19. Salary State
  const [salCtc, setSalCtc] = useState(1200000);
  const [salRegime, setSalRegime] = useState<'new' | 'old'>('new');

  // 20. Inflation State
  const [infAmount, setInfAmount] = useState(100000);
  const [infRate, setInfRate] = useState(6);
  const [infYears, setInfYears] = useState(10);

  // 21. Retirement State
  const [retCurrentAge, setRetCurrentAge] = useState(30);
  const [retAge, setRetAge] = useState(60);
  const [retLifeExp, setRetLifeExp] = useState(85);
  const [retExpenses, setRetExpenses] = useState(50000);
  const [retInflation, setRetInflation] = useState(6);
  const [retPreReturn, setRetPreReturn] = useState(12);
  const [retPostReturn, setRetPostReturn] = useState(8);
  const [retExistingSavings, setRetExistingSavings] = useState(500000);

  // 22. Gratuity State
  const [gratBasic, setGratBasic] = useState(50000);
  const [gratTenure, setGratTenure] = useState(7);
  const [gratCovered, setGratCovered] = useState(true);

  // 23. Simple Interest State
  const [siPrincipal, setSiPrincipal] = useState(100000);
  const [siRate, setSiRate] = useState(8);
  const [siYears, setSiYears] = useState(3);

  // 24. Compound Interest State
  const [ciPrincipal, setCiPrincipal] = useState(100000);
  const [ciRate, setCiRate] = useState(10);
  const [ciYears, setCiYears] = useState(5);
  const [ciFrequency, setCiFrequency] = useState(1); // 1: Annual, 2: Half-yearly, 4: Quarterly, 12: Monthly

  // 25. Percentage State
  const [pctMode, setPctMode] = useState<'percentOf' | 'isWhatPercent' | 'changePercent' | 'addSubtract'>('percentOf');
  const [pctX, setPctX] = useState(18);
  const [pctY, setPctY] = useState(5000);
  const [pctAddSub, setPctAddSub] = useState<'add' | 'subtract'>('add');

  // ================= RENDER LOGIC =================

  // 18. Income Tax Calculator
  if (id === 'income-tax-calculator') {
    const res = calculateIncomeTax(taxGross, tax80C, tax80D, taxHra, taxOther);

    return (
      <div className="space-y-6">
        {/* Recommendation Banner */}
        <div className="p-4 rounded-xl bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border border-emerald-500/20 flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="text-[#00D09C] flex-shrink-0" size={24} />
            <div>
              <span className="text-sm font-bold text-gray-900 dark:text-white">
                Recommended: {res.recommendedRegime === 'new' ? 'New Tax Regime' : 'Old Tax Regime'}
              </span>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                You save <strong>{formatINR(res.taxSavings)}</strong> by choosing the {res.recommendedRegime === 'new' ? 'New' : 'Old'} Regime.
              </p>
            </div>
          </div>
          <div className="text-right">
            <span className="text-xs text-gray-400 block">Lowest Tax Liability</span>
            <span className="text-xl font-extrabold text-[#00D09C] tabular-nums">
              {formatINR(Math.min(res.newRegime.totalTaxLiability, res.oldRegime.totalTaxLiability))}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-7 space-y-4">
            <SliderInput
              label="Gross annual income"
              value={taxGross}
              min={250000}
              max={5000000}
              step={25000}
              prefix="₹"
              presets={[750000, 1000000, 1500000, 2500000]}
              onChange={setTaxGross}
            />

            <div className="p-4 bg-gray-50 dark:bg-[#181B20] rounded-xl border border-gray-100 dark:border-gray-800 space-y-4">
              <h4 className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
                Old Regime Deductions
              </h4>
              <SliderInput
                label="Section 80C Deductions (Max ₹1.5L)"
                value={tax80C}
                min={0}
                max={150000}
                step={5000}
                prefix="₹"
                tooltip="PPF, EPF, ELSS, Life Insurance, Principal on Home Loan"
                onChange={setTax80C}
              />
              <SliderInput
                label="Section 80D Health Insurance"
                value={tax80D}
                min={0}
                max={100000}
                step={5000}
                prefix="₹"
                onChange={setTax80D}
              />
              <SliderInput
                label="HRA Exemption / Rent Paid"
                value={taxHra}
                min={0}
                max={500000}
                step={10000}
                prefix="₹"
                onChange={setTaxHra}
              />
              <SliderInput
                label="Other Deductions (NPS 80CCD, 80E, etc.)"
                value={taxOther}
                min={0}
                max={300000}
                step={5000}
                prefix="₹"
                onChange={setTaxOther}
              />
            </div>
          </div>

          {/* Comparison Cards */}
          <div className="lg:col-span-5 space-y-4">
            {/* New Regime Card */}
            <div className={`p-5 rounded-2xl border transition-all ${
              res.recommendedRegime === 'new'
                ? 'bg-emerald-500/5 dark:bg-emerald-950/20 border-[#00D09C] ring-1 ring-[#00D09C]'
                : 'bg-white dark:bg-[#181B20] border-gray-100 dark:border-gray-800'
            }`}>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <h4 className="font-bold text-gray-900 dark:text-white">New Tax Regime</h4>
                  {res.recommendedRegime === 'new' && (
                    <span className="text-[10px] font-bold bg-[#00D09C] text-white px-2 py-0.5 rounded-full">
                      BEST
                    </span>
                  )}
                </div>
                <span className="text-xs text-gray-400">Budget 2024 Slabs</span>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between text-gray-500">
                  <span>Standard Deduction:</span>
                  <span className="font-semibold text-gray-900 dark:text-gray-100">₹75,000</span>
                </div>
                <div className="flex justify-between text-gray-500">
                  <span>Taxable Income:</span>
                  <span className="font-semibold text-gray-900 dark:text-gray-100">{formatINR(res.newRegime.taxableIncome)}</span>
                </div>
                <div className="flex justify-between text-gray-500">
                  <span>87A Rebate:</span>
                  <span className="font-semibold text-[#00D09C]">
                    {res.newRegime.rebate87A > 0 ? `-${formatINR(res.newRegime.rebate87A)}` : '₹0'}
                  </span>
                </div>
                <div className="flex justify-between pt-2 border-t border-gray-100 dark:border-gray-800 font-bold">
                  <span>Total Tax Payable:</span>
                  <span className="text-lg text-[#00D09C] tabular-nums">{formatINR(res.newRegime.totalTaxLiability)}</span>
                </div>
              </div>
            </div>

            {/* Old Regime Card */}
            <div className={`p-5 rounded-2xl border transition-all ${
              res.recommendedRegime === 'old'
                ? 'bg-emerald-500/5 dark:bg-emerald-950/20 border-[#00D09C] ring-1 ring-[#00D09C]'
                : 'bg-white dark:bg-[#181B20] border-gray-100 dark:border-gray-800'
            }`}>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <h4 className="font-bold text-gray-900 dark:text-white">Old Tax Regime</h4>
                  {res.recommendedRegime === 'old' && (
                    <span className="text-[10px] font-bold bg-[#00D09C] text-white px-2 py-0.5 rounded-full">
                      BEST
                    </span>
                  )}
                </div>
                <span className="text-xs text-gray-400">With Deductions</span>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between text-gray-500">
                  <span>Total Deductions:</span>
                  <span className="font-semibold text-gray-900 dark:text-gray-100">{formatINR(res.oldRegime.totalDeductions)}</span>
                </div>
                <div className="flex justify-between text-gray-500">
                  <span>Taxable Income:</span>
                  <span className="font-semibold text-gray-900 dark:text-gray-100">{formatINR(res.oldRegime.taxableIncome)}</span>
                </div>
                <div className="flex justify-between text-gray-500">
                  <span>87A Rebate:</span>
                  <span className="font-semibold text-[#00D09C]">
                    {res.oldRegime.rebate87A > 0 ? `-${formatINR(res.oldRegime.rebate87A)}` : '₹0'}
                  </span>
                </div>
                <div className="flex justify-between pt-2 border-t border-gray-100 dark:border-gray-800 font-bold">
                  <span>Total Tax Payable:</span>
                  <span className="text-lg text-[#00D09C] tabular-nums">{formatINR(res.oldRegime.totalTaxLiability)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 19. Salary Calculator
  if (id === 'salary-calculator') {
    const res = calculateSalary(salCtc, salRegime);

    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-7">
            <SliderInput
              label="Annual Cost to Company (CTC)"
              value={salCtc}
              min={300000}
              max={6000000}
              step={25000}
              prefix="₹"
              presets={[600000, 1000000, 1500000, 2500000]}
              onChange={setSalCtc}
            />

            <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-[#181B20] rounded-xl border border-gray-100 dark:border-gray-800">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Tax Regime applied:
              </span>
              <button
                onClick={() => setSalRegime(salRegime === 'new' ? 'old' : 'new')}
                className="text-xs font-bold px-3 py-1 bg-gray-200 dark:bg-gray-700 hover:bg-[#00D09C] hover:text-white rounded-lg transition-colors"
              >
                {salRegime === 'new' ? 'New Regime (Recommended)' : 'Old Regime'}
              </button>
            </div>
          </div>

          <div className="lg:col-span-5 space-y-4">
            <div className="bg-gradient-to-br from-[#00D09C]/10 to-[#5669FF]/5 p-6 rounded-2xl border border-[#00D09C]/20 text-center">
              <span className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 block mb-1">
                Estimated Monthly In-Hand Salary
              </span>
              <div className="text-3xl font-extrabold text-[#00D09C] tabular-nums my-1">
                {formatINR(res.monthlyTakeHome)}
              </div>
              <p className="text-xs text-gray-400">
                Annual Take-Home: {formatINR(res.annualTakeHome)}
              </p>

              <div className="mt-6 pt-4 border-t border-gray-200/40 dark:border-gray-700/40 space-y-2 text-left text-xs">
                <div className="flex justify-between text-gray-600 dark:text-gray-400">
                  <span>Basic Salary (Monthly):</span>
                  <span className="font-semibold text-gray-900 dark:text-white">{formatINR(res.basicSalaryMonthly)}</span>
                </div>
                <div className="flex justify-between text-gray-600 dark:text-gray-400">
                  <span>HRA Allowance:</span>
                  <span className="font-semibold text-gray-900 dark:text-white">{formatINR(res.hraMonthly)}</span>
                </div>
                <div className="flex justify-between text-gray-600 dark:text-gray-400">
                  <span>Special Allowance:</span>
                  <span className="font-semibold text-gray-900 dark:text-white">{formatINR(res.specialAllowanceMonthly)}</span>
                </div>
                <div className="flex justify-between text-rose-500">
                  <span>Employee PF (12%):</span>
                  <span className="font-semibold">-{formatINR(res.employeePfMonthly)}</span>
                </div>
                <div className="flex justify-between text-rose-500">
                  <span>Professional Tax:</span>
                  <span className="font-semibold">-{formatINR(res.professionalTaxMonthly)}</span>
                </div>
                <div className="flex justify-between text-rose-500">
                  <span>Monthly TDS (Tax):</span>
                  <span className="font-semibold">-{formatINR(res.monthlyTds)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 20. Inflation Calculator
  if (id === 'inflation-calculator') {
    const res = calculateInflation(infAmount, infRate, infYears);

    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-7">
            <SliderInput
              label="Current cost / amount"
              value={infAmount}
              min={1000}
              max={10000000}
              step={5000}
              prefix="₹"
              presets={[10000, 50000, 100000, 500000]}
              onChange={setInfAmount}
            />
            <SliderInput
              label="Annual inflation rate"
              value={infRate}
              min={1}
              max={15}
              step={0.5}
              suffix="%"
              presets={[5, 6, 7, 8]}
              onChange={setInfRate}
            />
            <SliderInput
              label="Time horizon"
              value={infYears}
              min={1}
              max={30}
              step={1}
              suffix="Yr"
              presets={[5, 10, 15, 20]}
              onChange={setInfYears}
            />
          </div>

          <div className="lg:col-span-5 space-y-4">
            <div className="bg-white dark:bg-[#181B20] p-6 rounded-2xl border border-gray-100 dark:border-gray-800 text-center">
              <span className="text-xs font-semibold uppercase tracking-wider text-gray-400 block mb-2">
                Future Cost in {infYears} Years
              </span>
              <div className="text-3xl font-extrabold text-rose-500 tabular-nums my-1">
                {formatINR(res.futureCost)}
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                You will need this much to buy what costs {formatINR(infAmount)} today.
              </p>

              <div className="mt-6 pt-4 border-t border-gray-100 dark:border-gray-800 grid grid-cols-2 gap-4 text-left">
                <div>
                  <span className="text-xs text-gray-400 block">Purchasing Power Loss</span>
                  <span className="text-base font-bold text-rose-500 tabular-nums">
                    {res.purchasingPowerLossPercent}%
                  </span>
                </div>
                <div>
                  <span className="text-xs text-gray-400 block">Equivalent Today</span>
                  <span className="text-base font-bold text-gray-900 dark:text-white tabular-nums">
                    {formatINR(res.equivalentTodayPurchasingPower)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <ScheduleTable title="Inflation Progression Table" yearlyBreakdown={res.yearlyBreakdown} />
      </div>
    );
  }

  // 21. Retirement Calculator
  if (id === 'retirement-calculator') {
    const res = calculateRetirement(
      retCurrentAge,
      retAge,
      retLifeExp,
      retExpenses,
      retInflation,
      retPreReturn,
      retPostReturn,
      retExistingSavings
    );

    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-7 space-y-4">
            <div className="grid grid-cols-3 gap-3">
              <SliderInput
                label="Current age"
                value={retCurrentAge}
                min={20}
                max={55}
                step={1}
                suffix="Yr"
                onChange={setRetCurrentAge}
              />
              <SliderInput
                label="Retirement age"
                value={retAge}
                min={retCurrentAge + 1}
                max={70}
                step={1}
                suffix="Yr"
                onChange={setRetAge}
              />
              <SliderInput
                label="Life expectancy"
                value={retLifeExp}
                min={retAge + 5}
                max={95}
                step={1}
                suffix="Yr"
                onChange={setRetLifeExp}
              />
            </div>

            <SliderInput
              label="Current monthly living expenses"
              value={retExpenses}
              min={15000}
              max={300000}
              step={5000}
              prefix="₹"
              onChange={setRetExpenses}
            />

            <SliderInput
              label="Expected inflation rate"
              value={retInflation}
              min={4}
              max={10}
              step={0.5}
              suffix="%"
              onChange={setRetInflation}
            />

            <SliderInput
              label="Pre-retirement investment return rate"
              value={retPreReturn}
              min={8}
              max={16}
              step={0.5}
              suffix="%"
              onChange={setRetPreReturn}
            />

            <SliderInput
              label="Post-retirement conservative return rate"
              value={retPostReturn}
              min={5}
              max={10}
              step={0.5}
              suffix="%"
              onChange={setRetPostReturn}
            />

            <SliderInput
              label="Existing retirement savings"
              value={retExistingSavings}
              min={0}
              max={5000000}
              step={50000}
              prefix="₹"
              onChange={setRetExistingSavings}
            />
          </div>

          <div className="lg:col-span-5 space-y-4">
            <div className="bg-gradient-to-br from-[#00D09C]/10 to-indigo-500/10 p-6 rounded-2xl border border-[#00D09C]/20 text-center">
              <span className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 block mb-1">
                Target Retirement Corpus
              </span>
              <div className="text-3xl font-extrabold text-[#00D09C] tabular-nums my-1">
                {formatINR(res.targetCorpusRequired, true)}
              </div>
              <p className="text-xs text-gray-400">
                ({formatINR(res.targetCorpusRequired)})
              </p>

              <div className="mt-6 pt-4 border-t border-gray-200/40 dark:border-gray-700/40 space-y-2 text-left text-xs">
                <div className="flex justify-between text-gray-600 dark:text-gray-400">
                  <span>Monthly expense at retirement:</span>
                  <span className="font-bold text-gray-900 dark:text-white">{formatINR(res.monthlyExpenseAtRetirement)}</span>
                </div>
                <div className="flex justify-between text-gray-600 dark:text-gray-400">
                  <span>Existing savings future value:</span>
                  <span className="font-bold text-gray-900 dark:text-white">{formatINR(res.existingSavingsFutureValue)}</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-gray-200/40 font-bold text-sm text-[#00D09C]">
                  <span>Monthly SIP needed today:</span>
                  <span className="tabular-nums">{formatINR(res.recommendedMonthlySip)}/mo</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 22. Gratuity Calculator
  if (id === 'gratuity-calculator') {
    const res = calculateGratuity(gratBasic, gratTenure, gratCovered);

    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-7">
            <SliderInput
              label="Last drawn Basic Salary + DA"
              value={gratBasic}
              min={10000}
              max={500000}
              step={5000}
              prefix="₹"
              presets={[25000, 50000, 100000, 200000]}
              onChange={setGratBasic}
            />
            <SliderInput
              label="Years of continuous service"
              value={gratTenure}
              min={1}
              max={40}
              step={1}
              suffix="Yr"
              presets={[5, 10, 15, 20]}
              tooltip="Statutory eligibility requires minimum 5 years"
              onChange={setGratTenure}
            />

            <div className="mb-4">
              <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 block mb-2">
                Covered under Payment of Gratuity Act 1972?
              </label>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setGratCovered(true)}
                  className={`flex-1 py-2 text-xs font-semibold rounded-xl border transition-all ${
                    gratCovered
                      ? 'bg-[#00D09C] border-[#00D09C] text-white shadow-xs'
                      : 'border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400'
                  }`}
                >
                  Yes (Formula: 15/26 days)
                </button>
                <button
                  type="button"
                  onClick={() => setGratCovered(false)}
                  className={`flex-1 py-2 text-xs font-semibold rounded-xl border transition-all ${
                    !gratCovered
                      ? 'bg-[#00D09C] border-[#00D09C] text-white shadow-xs'
                      : 'border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400'
                  }`}
                >
                  No (Formula: 15/30 days)
                </button>
              </div>
            </div>

            {!res.isEligible && (
              <div className="p-3 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 rounded-xl text-amber-800 dark:text-amber-200 text-xs flex items-center gap-2">
                <AlertCircle size={16} />
                <span>Employees must complete at least 5 years of continuous service to be legally eligible for gratuity.</span>
              </div>
            )}
          </div>

          <div className="lg:col-span-5 space-y-4">
            <div className="bg-white dark:bg-[#181B20] p-6 rounded-2xl border border-gray-100 dark:border-gray-800 text-center">
              <span className="text-xs font-semibold uppercase tracking-wider text-gray-400 block mb-2">
                Payable Gratuity Amount
              </span>
              <div className="text-3xl font-extrabold text-[#00D09C] tabular-nums my-1">
                {formatINR(res.gratuityAmount)}
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Formula: (15 × {formatINR(gratBasic)} × {gratTenure}) ÷ 26
              </p>

              <div className="mt-6 pt-4 border-t border-gray-100 dark:border-gray-800 grid grid-cols-2 gap-4 text-left">
                <div>
                  <span className="text-xs text-gray-400 block">Tax-Exempt Part</span>
                  <span className="text-base font-bold text-[#00D09C] tabular-nums">
                    {formatINR(res.taxExemptAmount)}
                  </span>
                </div>
                <div>
                  <span className="text-xs text-gray-400 block">Taxable Portion</span>
                  <span className="text-base font-bold text-gray-900 dark:text-white tabular-nums">
                    {formatINR(res.taxableAmount)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 23. Simple Interest Calculator
  if (id === 'simple-interest-calculator') {
    const res = calculateSimpleInterest(siPrincipal, siRate, siYears);

    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-7">
            <SliderInput
              label="Principal amount"
              value={siPrincipal}
              min={1000}
              max={10000000}
              step={5000}
              prefix="₹"
              presets={[10000, 50000, 100000, 500000]}
              onChange={setSiPrincipal}
            />
            <SliderInput
              label="Rate of interest (p.a)"
              value={siRate}
              min={1}
              max={25}
              step={0.5}
              suffix="%"
              presets={[6, 8, 10, 12]}
              onChange={setSiRate}
            />
            <SliderInput
              label="Time period"
              value={siYears}
              min={1}
              max={30}
              step={1}
              suffix="Yr"
              presets={[1, 3, 5, 10]}
              onChange={setSiYears}
            />
          </div>

          <div className="lg:col-span-5">
            <DonutChart
              centerTitle="Total Amount"
              centerValue={formatINR(res.totalAmount, true)}
              segments={[
                { label: 'Principal', value: res.principalAmount, color: '#00D09C' },
                { label: 'Total Simple Interest', value: res.totalInterest, color: '#5669FF' },
              ]}
            />
          </div>
        </div>
      </div>
    );
  }

  // 24. Compound Interest Calculator
  if (id === 'compound-interest-calculator') {
    const res = calculateCompoundInterest(ciPrincipal, ciRate, ciYears, ciFrequency);

    const frequencyOptions = [
      { label: 'Annually (1x)', value: 1 },
      { label: 'Half-Yearly (2x)', value: 2 },
      { label: 'Quarterly (4x)', value: 4 },
      { label: 'Monthly (12x)', value: 12 },
    ];

    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-7 space-y-4">
            <SliderInput
              label="Principal amount"
              value={ciPrincipal}
              min={1000}
              max={10000000}
              step={5000}
              prefix="₹"
              presets={[25000, 50000, 100000, 500000]}
              onChange={setCiPrincipal}
            />
            <SliderInput
              label="Rate of interest (p.a)"
              value={ciRate}
              min={1}
              max={30}
              step={0.5}
              suffix="%"
              presets={[7, 10, 12, 15]}
              onChange={setCiRate}
            />
            <SliderInput
              label="Time period"
              value={ciYears}
              min={1}
              max={30}
              step={1}
              suffix="Yr"
              presets={[3, 5, 10, 15]}
              onChange={setCiYears}
            />

            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-2">
                Compounding Frequency:
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {frequencyOptions.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => setCiFrequency(opt.value)}
                    className={`px-3 py-2 text-xs font-semibold rounded-lg border transition-all ${
                      ciFrequency === opt.value
                        ? 'border-[#00D09C] bg-[#00D09C]/10 text-[#00D09C]'
                        : 'border-gray-200 dark:border-gray-800 bg-white dark:bg-[#181B20] text-gray-600 dark:text-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-5">
            <DonutChart
              centerTitle="Maturity Total"
              centerValue={formatINR(res.totalAmount, true)}
              segments={[
                { label: 'Principal', value: res.principalAmount, color: '#00D09C' },
                { label: 'Compound Interest', value: res.compoundInterest, color: '#5669FF' },
              ]}
            />
          </div>
        </div>

        <ScheduleTable yearlyBreakdown={res.yearlyBreakdown} />
      </div>
    );
  }

  // 25. Percentage Calculator
  if (id === 'percentage-calculator') {
    const res = calculatePercentage(pctMode, pctX, pctY, pctAddSub);

    return (
      <div className="space-y-6">
        {/* Mode Selector Tabs */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 p-1.5 bg-gray-100 dark:bg-[#181B20] rounded-xl border border-gray-200 dark:border-gray-800">
          <button
            onClick={() => setPctMode('percentOf')}
            className={`px-3 py-2 text-xs font-semibold rounded-lg transition-all ${
              pctMode === 'percentOf'
                ? 'bg-[#00D09C] text-white shadow-sm'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            What is X% of Y?
          </button>
          <button
            onClick={() => setPctMode('isWhatPercent')}
            className={`px-3 py-2 text-xs font-semibold rounded-lg transition-all ${
              pctMode === 'isWhatPercent'
                ? 'bg-[#00D09C] text-white shadow-sm'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            X is what % of Y?
          </button>
          <button
            onClick={() => setPctMode('changePercent')}
            className={`px-3 py-2 text-xs font-semibold rounded-lg transition-all ${
              pctMode === 'changePercent'
                ? 'bg-[#00D09C] text-white shadow-sm'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            % Change from X to Y
          </button>
          <button
            onClick={() => setPctMode('addSubtract')}
            className={`px-3 py-2 text-xs font-semibold rounded-lg transition-all ${
              pctMode === 'addSubtract'
                ? 'bg-[#00D09C] text-white shadow-sm'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            Add / Subtract %
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-7 space-y-4">
            <SliderInput
              label={
                pctMode === 'percentOf'
                  ? 'Percentage (X)'
                  : pctMode === 'isWhatPercent'
                  ? 'Part Value (X)'
                  : pctMode === 'changePercent'
                  ? 'Initial Value (X)'
                  : 'Percentage (X)'
              }
              value={pctX}
              min={0}
              max={pctMode === 'percentOf' || pctMode === 'addSubtract' ? 100 : 100000}
              step={1}
              suffix={pctMode === 'percentOf' || pctMode === 'addSubtract' ? '%' : ''}
              onChange={setPctX}
            />

            <SliderInput
              label={
                pctMode === 'percentOf'
                  ? 'Total Value (Y)'
                  : pctMode === 'isWhatPercent'
                  ? 'Whole Value (Y)'
                  : pctMode === 'changePercent'
                  ? 'Final Value (Y)'
                  : 'Base Value (Y)'
              }
              value={pctY}
              min={1}
              max={1000000}
              step={50}
              onChange={setPctY}
            />

            {pctMode === 'addSubtract' && (
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Operation:</span>
                <button
                  onClick={() => setPctAddSub('add')}
                  className={`px-3 py-1 rounded-lg text-xs font-bold ${
                    pctAddSub === 'add' ? 'bg-[#00D09C] text-white' : 'bg-gray-100 dark:bg-gray-800'
                  }`}
                >
                  Add X% (+{pctX}%)
                </button>
                <button
                  onClick={() => setPctAddSub('subtract')}
                  className={`px-3 py-1 rounded-lg text-xs font-bold ${
                    pctAddSub === 'subtract' ? 'bg-rose-500 text-white' : 'bg-gray-100 dark:bg-gray-800'
                  }`}
                >
                  Subtract X% (-{pctX}%)
                </button>
              </div>
            )}
          </div>

          <div className="lg:col-span-5 space-y-4">
            <div className="bg-white dark:bg-[#181B20] p-6 rounded-2xl border border-gray-100 dark:border-gray-800 text-center">
              <span className="text-xs font-semibold uppercase tracking-wider text-gray-400 block mb-2">
                Calculated Result
              </span>
              <div className="text-4xl font-extrabold text-[#00D09C] tabular-nums my-2">
                {pctMode === 'isWhatPercent' || pctMode === 'changePercent'
                  ? `${res.result}%`
                  : res.result.toLocaleString('en-IN')}
              </div>
              <div className="mt-4 p-3 bg-gray-50 dark:bg-[#14161A] rounded-xl font-mono text-xs text-gray-600 dark:text-gray-300">
                {res.formattedFormula}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return <div>Calculator not found</div>;
};
