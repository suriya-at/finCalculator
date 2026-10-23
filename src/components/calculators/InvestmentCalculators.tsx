import React, { useState } from 'react';
import { SliderInput } from '../common/SliderInput';
import { DonutChart } from '../common/DonutChart';
import { ScheduleTable } from '../common/ScheduleTable';
import { formatINR } from '../../utils/formatters';
import {
  calculateSip,
  calculateLumpsum,
  calculateMfReturns,
  calculateStepUpSip,
  calculateCagr,
  calculateSipXirr,
  calculateSwp,
  calculatePpf,
  calculateEpf,
  calculateFd,
  calculateRd,
} from '../../utils/calculators/investment';
import { RotateCcw } from 'lucide-react';

interface InvestmentCalculatorProps {
  id: string;
}

export const InvestmentCalculators: React.FC<InvestmentCalculatorProps> = ({ id }) => {
  // 1. SIP Calculator State
  const [sipMonthly, setSipMonthly] = useState(25000);
  const [sipRate, setSipRate] = useState(12);
  const [sipYears, setSipYears] = useState(10);

  // 2. Lumpsum Calculator State
  const [lumpTotal, setLumpTotal] = useState(100000);
  const [lumpRate, setLumpRate] = useState(12);
  const [lumpYears, setLumpYears] = useState(5);

  // 3. Mutual Fund Returns Calculator State
  const [mfMode, setMfMode] = useState<'sip' | 'lumpsum'>('sip');
  const [mfAmount, setMfAmount] = useState(10000);
  const [mfRate, setMfRate] = useState(12);
  const [mfYears, setMfYears] = useState(5);

  // 4. Step-Up SIP State
  const [stepUpMonthly, setStepUpMonthly] = useState(10000);
  const [stepUpPercent, setStepUpPercent] = useState(10);
  const [stepUpRate, setStepUpRate] = useState(12);
  const [stepUpYears, setStepUpYears] = useState(10);

  // 5. CAGR State
  const [cagrStart, setCagrStart] = useState(100000);
  const [cagrEnd, setCagrEnd] = useState(250000);
  const [cagrYears, setCagrYears] = useState(5);

  // 6. XIRR State
  const [xirrMonthly, setXirrMonthly] = useState(10000);
  const [xirrMonths, setXirrMonths] = useState(36);
  const [xirrFinalValue, setXirrFinalValue] = useState(480000);

  // 7. SWP State
  const [swpInitial, setSwpInitial] = useState(1000000);
  const [swpWithdrawal, setSwpWithdrawal] = useState(10000);
  const [swpRate, setSwpRate] = useState(8);
  const [swpYears, setSwpYears] = useState(5);

  // 8. PPF State
  const [ppfYearly, setPpfYearly] = useState(150000);
  const [ppfYears, setPpfYears] = useState(15);

  // 9. EPF State
  const [epfBasic, setEpfBasic] = useState(50000);
  const [epfAge, setEpfAge] = useState(28);
  const [epfRetirementAge, setEpfRetirementAge] = useState(58);
  const [epfHike, setEpfHike] = useState(5);
  const [epfCurrentBalance, setEpfCurrentBalance] = useState(100000);

  // 10. FD State
  const [fdPrincipal, setFdPrincipal] = useState(100000);
  const [fdRate, setFdRate] = useState(7.5);
  const [fdYears, setFdYears] = useState(5);

  // 11. RD State
  const [rdMonthly, setRdMonthly] = useState(5000);
  const [rdRate, setRdRate] = useState(7);
  const [rdMonths, setRdMonths] = useState(36);

  // ================= RENDER LOGIC =================

  // 1. SIP Calculator
  if (id === 'sip-calculator') {
    const res = calculateSip(sipMonthly, sipRate, sipYears);
    const handleReset = () => {
      setSipMonthly(25000);
      setSipRate(12);
      setSipYears(10);
    };

    return (
      <div className="space-y-6">
        <div className="flex justify-end">
          <button
            onClick={handleReset}
            className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-[#00D09C] transition-colors"
          >
            <RotateCcw size={14} /> Reset Values
          </button>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-7">
            <SliderInput
              label="Monthly investment"
              value={sipMonthly}
              min={500}
              max={100000}
              step={500}
              prefix="₹"
              presets={[5000, 10000, 25000, 50000]}
              onChange={setSipMonthly}
            />
            <SliderInput
              label="Expected return rate (p.a)"
              value={sipRate}
              min={1}
              max={30}
              step={0.5}
              suffix="%"
              presets={[10, 12, 15, 18]}
              onChange={setSipRate}
            />
            <SliderInput
              label="Time period"
              value={sipYears}
              min={1}
              max={40}
              step={1}
              suffix="Yr"
              presets={[5, 10, 15, 20]}
              onChange={setSipYears}
            />

            {/* Quick Metrics Bar */}
            <div className="grid grid-cols-3 gap-3 p-4 bg-gray-50 dark:bg-[#181B20] rounded-xl border border-gray-100 dark:border-gray-800">
              <div>
                <span className="text-xs text-gray-400 block">Invested Amount</span>
                <span className="text-base font-bold text-gray-800 dark:text-gray-200 tabular-nums">
                  {formatINR(res.investedAmount)}
                </span>
              </div>
              <div>
                <span className="text-xs text-gray-400 block">Est. Returns</span>
                <span className="text-base font-bold text-[#00D09C] tabular-nums">
                  {formatINR(res.estimatedReturns)}
                </span>
              </div>
              <div>
                <span className="text-xs text-gray-400 block">Total Value</span>
                <span className="text-base font-bold text-gray-900 dark:text-white tabular-nums">
                  {formatINR(res.totalValue)}
                </span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5">
            <DonutChart
              centerTitle="Maturity Value"
              centerValue={formatINR(res.totalValue, true)}
              segments={[
                { label: 'Invested Amount', value: res.investedAmount, color: '#00D09C' },
                { label: 'Est. Returns', value: res.estimatedReturns, color: '#5669FF' },
              ]}
            />
          </div>
        </div>

        <ScheduleTable yearlyBreakdown={res.yearlyBreakdown} />
      </div>
    );
  }

  // 2. Lumpsum Calculator
  if (id === 'lumpsum-calculator') {
    const res = calculateLumpsum(lumpTotal, lumpRate, lumpYears);
    const handleReset = () => {
      setLumpTotal(100000);
      setLumpRate(12);
      setLumpYears(5);
    };

    return (
      <div className="space-y-6">
        <div className="flex justify-end">
          <button
            onClick={handleReset}
            className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-[#00D09C] transition-colors"
          >
            <RotateCcw size={14} /> Reset Values
          </button>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-7">
            <SliderInput
              label="Total investment"
              value={lumpTotal}
              min={1000}
              max={10000000}
              step={5000}
              prefix="₹"
              presets={[25000, 50000, 100000, 500000]}
              onChange={setLumpTotal}
            />
            <SliderInput
              label="Expected return rate (p.a)"
              value={lumpRate}
              min={1}
              max={30}
              step={0.5}
              suffix="%"
              presets={[10, 12, 15, 20]}
              onChange={setLumpRate}
            />
            <SliderInput
              label="Time period"
              value={lumpYears}
              min={1}
              max={40}
              step={1}
              suffix="Yr"
              presets={[3, 5, 10, 15]}
              onChange={setLumpYears}
            />

            <div className="grid grid-cols-3 gap-3 p-4 bg-gray-50 dark:bg-[#181B20] rounded-xl border border-gray-100 dark:border-gray-800">
              <div>
                <span className="text-xs text-gray-400 block">Invested Amount</span>
                <span className="text-base font-bold text-gray-800 dark:text-gray-200 tabular-nums">
                  {formatINR(res.investedAmount)}
                </span>
              </div>
              <div>
                <span className="text-xs text-gray-400 block">Est. Returns</span>
                <span className="text-base font-bold text-[#00D09C] tabular-nums">
                  {formatINR(res.estimatedReturns)}
                </span>
              </div>
              <div>
                <span className="text-xs text-gray-400 block">Total Value</span>
                <span className="text-base font-bold text-gray-900 dark:text-white tabular-nums">
                  {formatINR(res.totalValue)}
                </span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5">
            <DonutChart
              centerTitle="Maturity Value"
              centerValue={formatINR(res.totalValue, true)}
              segments={[
                { label: 'Invested Amount', value: res.investedAmount, color: '#00D09C' },
                { label: 'Est. Returns', value: res.estimatedReturns, color: '#5669FF' },
              ]}
            />
          </div>
        </div>

        <ScheduleTable yearlyBreakdown={res.yearlyBreakdown} />
      </div>
    );
  }

  // 3. Mutual Fund Returns Calculator (Supports SIP & Lumpsum)
  if (id === 'mf-returns-calculator') {
    const res = calculateMfReturns(mfMode, mfAmount, mfRate, mfYears);

    return (
      <div className="space-y-6">
        {/* SIP vs Lumpsum Mode Toggle */}
        <div className="flex items-center justify-between">
          <div className="inline-flex p-1 bg-gray-100 dark:bg-[#181B20] rounded-xl border border-gray-200 dark:border-gray-800">
            <button
              onClick={() => setMfMode('sip')}
              className={`px-4 py-1.5 text-sm font-semibold rounded-lg transition-all ${
                mfMode === 'sip'
                  ? 'bg-[#00D09C] text-white shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              SIP (Monthly)
            </button>
            <button
              onClick={() => setMfMode('lumpsum')}
              className={`px-4 py-1.5 text-sm font-semibold rounded-lg transition-all ${
                mfMode === 'lumpsum'
                  ? 'bg-[#00D09C] text-white shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              Lumpsum (One-Time)
            </button>
          </div>

          <button
            onClick={() => {
              setMfAmount(10000);
              setMfRate(12);
              setMfYears(5);
            }}
            className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-[#00D09C] transition-colors"
          >
            <RotateCcw size={14} /> Reset
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-7">
            <SliderInput
              label={mfMode === 'sip' ? 'Monthly investment' : 'Total investment'}
              value={mfAmount}
              min={500}
              max={mfMode === 'sip' ? 100000 : 5000000}
              step={500}
              prefix="₹"
              onChange={setMfAmount}
            />
            <SliderInput
              label="Expected return rate (p.a)"
              value={mfRate}
              min={1}
              max={30}
              step={0.5}
              suffix="%"
              onChange={setMfRate}
            />
            <SliderInput
              label="Time period"
              value={mfYears}
              min={1}
              max={35}
              step={1}
              suffix="Yr"
              onChange={setMfYears}
            />

            <div className="grid grid-cols-3 gap-3 p-4 bg-gray-50 dark:bg-[#181B20] rounded-xl border border-gray-100 dark:border-gray-800">
              <div>
                <span className="text-xs text-gray-400 block">Invested Amount</span>
                <span className="text-base font-bold text-gray-800 dark:text-gray-200 tabular-nums">
                  {formatINR(res.investedAmount)}
                </span>
              </div>
              <div>
                <span className="text-xs text-gray-400 block">Est. Returns</span>
                <span className="text-base font-bold text-[#00D09C] tabular-nums">
                  {formatINR(res.estimatedReturns)}
                </span>
              </div>
              <div>
                <span className="text-xs text-gray-400 block">Total Value</span>
                <span className="text-base font-bold text-gray-900 dark:text-white tabular-nums">
                  {formatINR(res.totalValue)}
                </span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5">
            <DonutChart
              centerTitle="Maturity Value"
              centerValue={formatINR(res.totalValue, true)}
              segments={[
                { label: 'Invested Amount', value: res.investedAmount, color: '#00D09C' },
                { label: 'Est. Returns', value: res.estimatedReturns, color: '#5669FF' },
              ]}
            />
          </div>
        </div>

        <ScheduleTable yearlyBreakdown={res.yearlyBreakdown} />
      </div>
    );
  }

  // 4. Step-Up SIP Calculator
  if (id === 'step-up-sip-calculator') {
    const res = calculateStepUpSip(stepUpMonthly, stepUpPercent, stepUpRate, stepUpYears);

    return (
      <div className="space-y-6">
        <div className="flex justify-end">
          <button
            onClick={() => {
              setStepUpMonthly(10000);
              setStepUpPercent(10);
              setStepUpRate(12);
              setStepUpYears(10);
            }}
            className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-[#00D09C] transition-colors"
          >
            <RotateCcw size={14} /> Reset
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-7">
            <SliderInput
              label="Initial monthly investment"
              value={stepUpMonthly}
              min={1000}
              max={100000}
              step={1000}
              prefix="₹"
              presets={[5000, 10000, 20000]}
              onChange={setStepUpMonthly}
            />
            <SliderInput
              label="Annual step-up rate"
              value={stepUpPercent}
              min={1}
              max={50}
              step={1}
              suffix="%"
              presets={[5, 10, 15, 20]}
              tooltip="Percentage by which your monthly contribution increases each year"
              onChange={setStepUpPercent}
            />
            <SliderInput
              label="Expected return rate (p.a)"
              value={stepUpRate}
              min={1}
              max={30}
              step={0.5}
              suffix="%"
              presets={[10, 12, 15]}
              onChange={setStepUpRate}
            />
            <SliderInput
              label="Time period"
              value={stepUpYears}
              min={1}
              max={35}
              step={1}
              suffix="Yr"
              presets={[5, 10, 15, 20]}
              onChange={setStepUpYears}
            />

            <div className="grid grid-cols-3 gap-3 p-4 bg-gray-50 dark:bg-[#181B20] rounded-xl border border-gray-100 dark:border-gray-800">
              <div>
                <span className="text-xs text-gray-400 block">Total Invested</span>
                <span className="text-base font-bold text-gray-800 dark:text-gray-200 tabular-nums">
                  {formatINR(res.investedAmount)}
                </span>
              </div>
              <div>
                <span className="text-xs text-gray-400 block">Est. Returns</span>
                <span className="text-base font-bold text-[#00D09C] tabular-nums">
                  {formatINR(res.estimatedReturns)}
                </span>
              </div>
              <div>
                <span className="text-xs text-gray-400 block">Final Monthly SIP</span>
                <span className="text-base font-bold text-indigo-500 tabular-nums">
                  {formatINR(res.finalMonthlyInvestment)}
                </span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5">
            <DonutChart
              centerTitle="Total Value"
              centerValue={formatINR(res.totalValue, true)}
              segments={[
                { label: 'Invested Amount', value: res.investedAmount, color: '#00D09C' },
                { label: 'Est. Returns', value: res.estimatedReturns, color: '#5669FF' },
              ]}
            />
          </div>
        </div>

        <ScheduleTable yearlyBreakdown={res.yearlyBreakdown} />
      </div>
    );
  }

  // 5. CAGR Calculator
  if (id === 'cagr-calculator') {
    const res = calculateCagr(cagrStart, cagrEnd, cagrYears);

    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-7">
            <SliderInput
              label="Initial / Beginning value"
              value={cagrStart}
              min={1000}
              max={10000000}
              step={5000}
              prefix="₹"
              onChange={setCagrStart}
            />
            <SliderInput
              label="Final / Ending value"
              value={cagrEnd}
              min={1000}
              max={20000000}
              step={5000}
              prefix="₹"
              onChange={setCagrEnd}
            />
            <SliderInput
              label="Duration in years"
              value={cagrYears}
              min={0.5}
              max={30}
              step={0.5}
              suffix="Yr"
              onChange={setCagrYears}
            />
          </div>

          <div className="lg:col-span-5 space-y-4">
            <div className="bg-white dark:bg-[#181B20] p-6 rounded-2xl border border-gray-100 dark:border-gray-800 text-center">
              <span className="text-xs font-semibold uppercase tracking-wider text-gray-400 block mb-2">
                Compound Annual Growth Rate
              </span>
              <div className="text-4xl font-extrabold text-[#00D09C] tabular-nums my-2">
                {res.cagrPercent}%
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Annualized return per year over {cagrYears} years
              </p>

              <div className="mt-6 pt-4 border-t border-gray-100 dark:border-gray-800 grid grid-cols-2 gap-4 text-left">
                <div>
                  <span className="text-xs text-gray-400 block">Absolute Returns</span>
                  <span className="text-lg font-bold text-gray-900 dark:text-white tabular-nums">
                    {res.absoluteReturnPercent}%
                  </span>
                </div>
                <div>
                  <span className="text-xs text-gray-400 block">Total Profit</span>
                  <span className="text-lg font-bold text-[#00D09C] tabular-nums">
                    {formatINR(res.totalProfit)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 6. XIRR Calculator
  if (id === 'xirr-calculator') {
    const xirrRate = calculateSipXirr(xirrMonthly, xirrMonths, xirrFinalValue);
    const totalInvested = xirrMonthly * xirrMonths;
    const profit = Math.max(0, xirrFinalValue - totalInvested);

    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-7">
            <SliderInput
              label="Monthly SIP cash outflow"
              value={xirrMonthly}
              min={1000}
              max={100000}
              step={1000}
              prefix="₹"
              onChange={setXirrMonthly}
            />
            <SliderInput
              label="Number of monthly installments"
              value={xirrMonths}
              min={6}
              max={240}
              step={6}
              suffix="Months"
              onChange={setXirrMonths}
            />
            <SliderInput
              label="Final redemption value"
              value={xirrFinalValue}
              min={xirrMonthly * xirrMonths}
              max={xirrMonthly * xirrMonths * 4}
              step={5000}
              prefix="₹"
              onChange={setXirrFinalValue}
            />
          </div>

          <div className="lg:col-span-5 space-y-4">
            <div className="bg-white dark:bg-[#181B20] p-6 rounded-2xl border border-gray-100 dark:border-gray-800 text-center">
              <span className="text-xs font-semibold uppercase tracking-wider text-gray-400 block mb-2">
                Extended Internal Rate of Return
              </span>
              <div className="text-4xl font-extrabold text-[#00D09C] tabular-nums my-2">
                {xirrRate}%
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                True annualized rate across all periodic investments
              </p>

              <div className="mt-6 pt-4 border-t border-gray-100 dark:border-gray-800 grid grid-cols-2 gap-4 text-left">
                <div>
                  <span className="text-xs text-gray-400 block">Total Invested</span>
                  <span className="text-base font-bold text-gray-800 dark:text-gray-200 tabular-nums">
                    {formatINR(totalInvested)}
                  </span>
                </div>
                <div>
                  <span className="text-xs text-gray-400 block">Total Profit</span>
                  <span className="text-base font-bold text-[#00D09C] tabular-nums">
                    {formatINR(profit)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 7. SWP Calculator
  if (id === 'swp-calculator') {
    const res = calculateSwp(swpInitial, swpWithdrawal, swpRate, swpYears);

    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-7">
            <SliderInput
              label="Total investment corpus"
              value={swpInitial}
              min={100000}
              max={10000000}
              step={25000}
              prefix="₹"
              onChange={setSwpInitial}
            />
            <SliderInput
              label="Withdrawal per month"
              value={swpWithdrawal}
              min={1000}
              max={100000}
              step={1000}
              prefix="₹"
              onChange={setSwpWithdrawal}
            />
            <SliderInput
              label="Expected return rate (p.a)"
              value={swpRate}
              min={1}
              max={25}
              step={0.5}
              suffix="%"
              onChange={setSwpRate}
            />
            <SliderInput
              label="Time period"
              value={swpYears}
              min={1}
              max={30}
              step={1}
              suffix="Yr"
              onChange={setSwpYears}
            />

            {res.depletedMonth && (
              <div className="p-3 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 rounded-xl text-amber-800 dark:text-amber-200 text-xs">
                ⚠️ <strong>Notice:</strong> Your monthly withdrawal exceeds the portfolio growth rate. The corpus will be fully depleted in month {res.depletedMonth} (Year {(res.depletedMonth / 12).toFixed(1)}).
              </div>
            )}
          </div>

          <div className="lg:col-span-5">
            <DonutChart
              centerTitle="Final Balance"
              centerValue={formatINR(res.finalValue, true)}
              segments={[
                { label: 'Total Withdrawn', value: res.totalWithdrawn, color: '#5669FF' },
                { label: 'Final Value', value: res.finalValue, color: '#00D09C' },
              ]}
            />
          </div>
        </div>

        <ScheduleTable yearlyBreakdown={res.yearlyBreakdown} />
      </div>
    );
  }

  // 8. PPF Calculator
  if (id === 'ppf-calculator') {
    const res = calculatePpf(ppfYearly, 7.1, ppfYears);

    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-7">
            <SliderInput
              label="Yearly investment (Max ₹1.5L)"
              value={ppfYearly}
              min={500}
              max={150000}
              step={500}
              prefix="₹"
              presets={[50000, 100000, 150000]}
              onChange={setPpfYearly}
            />
            <div className="p-4 mb-6 bg-emerald-50 dark:bg-emerald-950/30 rounded-xl border border-emerald-100 dark:border-emerald-800 text-xs text-emerald-800 dark:text-emerald-300">
              Interest Rate: <strong>7.1% p.a.</strong> (Fixed by Ministry of Finance, compounded annually. Tax-exempt under EEE status).
            </div>
            <SliderInput
              label="Time period (Min 15 Years)"
              value={ppfYears}
              min={15}
              max={30}
              step={5}
              suffix="Yr"
              presets={[15, 20, 25, 30]}
              tooltip="Statutory 15-year tenure, extendable in 5-year blocks"
              onChange={setPpfYears}
            />
          </div>

          <div className="lg:col-span-5">
            <DonutChart
              centerTitle="Maturity Value"
              centerValue={formatINR(res.maturityAmount, true)}
              segments={[
                { label: 'Total Invested', value: res.totalInvested, color: '#00D09C' },
                { label: 'Total Interest', value: res.totalInterest, color: '#5669FF' },
              ]}
            />
          </div>
        </div>

        <ScheduleTable yearlyBreakdown={res.yearlyBreakdown} />
      </div>
    );
  }

  // 9. EPF Calculator
  if (id === 'epf-calculator') {
    const res = calculateEpf(epfBasic, epfAge, epfRetirementAge, epfHike, epfCurrentBalance, 8.25);

    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-7">
            <SliderInput
              label="Monthly Basic Salary + DA"
              value={epfBasic}
              min={15000}
              max={300000}
              step={2000}
              prefix="₹"
              onChange={setEpfBasic}
            />
            <div className="grid grid-cols-2 gap-4">
              <SliderInput
                label="Your current age"
                value={epfAge}
                min={18}
                max={57}
                step={1}
                suffix="Yr"
                onChange={setEpfAge}
              />
              <SliderInput
                label="Retirement age"
                value={epfRetirementAge}
                min={epfAge + 1}
                max={60}
                step={1}
                suffix="Yr"
                onChange={setEpfRetirementAge}
              />
            </div>
            <SliderInput
              label="Expected annual salary hike"
              value={epfHike}
              min={0}
              max={20}
              step={1}
              suffix="%"
              onChange={setEpfHike}
            />
            <SliderInput
              label="Existing EPF balance"
              value={epfCurrentBalance}
              min={0}
              max={2000000}
              step={10000}
              prefix="₹"
              onChange={setEpfCurrentBalance}
            />
          </div>

          <div className="lg:col-span-5">
            <DonutChart
              centerTitle="Total EPF Corpus"
              centerValue={formatINR(res.totalCorpus, true)}
              segments={[
                { label: 'Employee Share (12%)', value: res.totalEmployeeShare, color: '#00D09C' },
                { label: 'Employer Share (3.67%)', value: res.totalEmployerShare, color: '#5669FF' },
                { label: 'Interest (8.25% p.a.)', value: res.totalInterestEarned, color: '#FFB800' },
              ]}
            />
          </div>
        </div>

        <ScheduleTable yearlyBreakdown={res.yearlyBreakdown} />
      </div>
    );
  }

  // 10. FD Calculator
  if (id === 'fd-calculator') {
    const res = calculateFd(fdPrincipal, fdRate, fdYears, 4);

    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-7">
            <SliderInput
              label="Total investment"
              value={fdPrincipal}
              min={10000}
              max={5000000}
              step={10000}
              prefix="₹"
              presets={[50000, 100000, 500000, 1000000]}
              onChange={setFdPrincipal}
            />
            <SliderInput
              label="Rate of interest (p.a)"
              value={fdRate}
              min={3}
              max={12}
              step={0.1}
              suffix="%"
              presets={[6.5, 7.0, 7.5, 8.0]}
              onChange={setFdRate}
            />
            <SliderInput
              label="Tenure"
              value={fdYears}
              min={1}
              max={10}
              step={1}
              suffix="Yr"
              presets={[1, 3, 5, 10]}
              onChange={setFdYears}
            />
          </div>

          <div className="lg:col-span-5">
            <DonutChart
              centerTitle="Maturity Value"
              centerValue={formatINR(res.maturityValue, true)}
              segments={[
                { label: 'Invested Amount', value: res.investedAmount, color: '#00D09C' },
                { label: 'Total Interest', value: res.estimatedInterest, color: '#5669FF' },
              ]}
            />
          </div>
        </div>

        <ScheduleTable yearlyBreakdown={res.yearlyBreakdown} />
      </div>
    );
  }

  // 11. RD Calculator
  if (id === 'rd-calculator') {
    const res = calculateRd(rdMonthly, rdRate, rdMonths);

    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-7">
            <SliderInput
              label="Monthly deposit"
              value={rdMonthly}
              min={500}
              max={100000}
              step={500}
              prefix="₹"
              presets={[2000, 5000, 10000, 25000]}
              onChange={setRdMonthly}
            />
            <SliderInput
              label="Rate of interest (p.a)"
              value={rdRate}
              min={3}
              max={12}
              step={0.1}
              suffix="%"
              presets={[6.5, 7.0, 7.5, 8.0]}
              onChange={setRdRate}
            />
            <SliderInput
              label="Tenure in months"
              value={rdMonths}
              min={6}
              max={120}
              step={6}
              suffix="Mo"
              presets={[12, 24, 36, 60]}
              onChange={setRdMonths}
            />
          </div>

          <div className="lg:col-span-5">
            <DonutChart
              centerTitle="Maturity Value"
              centerValue={formatINR(res.maturityAmount, true)}
              segments={[
                { label: 'Total Invested', value: res.totalInvested, color: '#00D09C' },
                { label: 'Total Interest', value: res.estimatedInterest, color: '#5669FF' },
              ]}
            />
          </div>
        </div>

        <ScheduleTable yearlyBreakdown={res.yearlyBreakdown} />
      </div>
    );
  }

  return <div>Calculator not found</div>;
};
