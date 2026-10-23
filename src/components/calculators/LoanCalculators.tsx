import React, { useState } from 'react';
import { SliderInput } from '../common/SliderInput';
import { DonutChart } from '../common/DonutChart';
import { ScheduleTable } from '../common/ScheduleTable';
import { formatINR } from '../../utils/formatters';
import {
  calculateEmi,
  calculateHomeLoan,
  calculatePersonalLoan,
  calculateCarLoan,
  calculateLoanPrepayment,
  calculateLoanEligibility,
} from '../../utils/calculators/loans';
import { RotateCcw, ShieldCheck, Zap } from 'lucide-react';

interface LoanCalculatorProps {
  id: string;
}

export const LoanCalculators: React.FC<LoanCalculatorProps> = ({ id }) => {
  // 12. EMI State
  const [emiAmount, setEmiAmount] = useState(2500000);
  const [emiRate, setEmiRate] = useState(8.5);
  const [emiYears, setEmiYears] = useState(20);

  // 13. Home Loan State
  const [hlPropValue, setHlPropValue] = useState(5000000);
  const [hlDownPaymentPct, setHlDownPaymentPct] = useState(20);
  const [hlRate, setHlRate] = useState(8.5);
  const [hlYears, setHlYears] = useState(20);

  // 14. Personal Loan State
  const [plAmount, setPlAmount] = useState(300000);
  const [plRate, setPlRate] = useState(12);
  const [plYears, setPlYears] = useState(3);
  const [plFeePct, setPlFeePct] = useState(2);

  // 15. Car Loan State
  const [clPrice, setClPrice] = useState(1200000);
  const [clDownPayment, setClDownPayment] = useState(250000);
  const [clRate, setClRate] = useState(9);
  const [clYears, setClYears] = useState(5);

  // 16. Prepayment State
  const [prepBalance, setPrepBalance] = useState(3000000);
  const [prepRate, setPrepRate] = useState(9);
  const [prepYears, setPrepYears] = useState(15);
  const [prepLumpAmount, setPrepLumpAmount] = useState(300000);
  const [prepMonth, setPrepMonth] = useState(12);

  // 17. Loan Eligibility State
  const [leIncome, setLeIncome] = useState(100000);
  const [leExistingEmis, setLeExistingEmis] = useState(15000);
  const [leRate, setLeRate] = useState(8.5);
  const [leYears, setLeYears] = useState(20);
  const [leFoir, setLeFoir] = useState(50);

  // ================= RENDER LOGIC =================

  // 12. General EMI Calculator
  if (id === 'emi-calculator') {
    const res = calculateEmi(emiAmount, emiRate, emiYears);

    return (
      <div className="space-y-6">
        <div className="flex justify-end">
          <button
            onClick={() => {
              setEmiAmount(2500000);
              setEmiRate(8.5);
              setEmiYears(20);
            }}
            className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-[#00D09C] transition-colors"
          >
            <RotateCcw size={14} /> Reset Values
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-7">
            <SliderInput
              label="Loan amount"
              value={emiAmount}
              min={50000}
              max={20000000}
              step={25000}
              prefix="₹"
              presets={[1000000, 2500000, 5000000, 10000000]}
              onChange={setEmiAmount}
            />
            <SliderInput
              label="Rate of interest (p.a)"
              value={emiRate}
              min={5}
              max={20}
              step={0.1}
              suffix="%"
              presets={[7.5, 8.5, 9.5, 11]}
              onChange={setEmiRate}
            />
            <SliderInput
              label="Loan tenure"
              value={emiYears}
              min={1}
              max={30}
              step={1}
              suffix="Yr"
              presets={[5, 10, 15, 20, 25]}
              onChange={setEmiYears}
            />

            <div className="grid grid-cols-3 gap-3 p-4 bg-gray-50 dark:bg-[#181B20] rounded-xl border border-gray-100 dark:border-gray-800">
              <div>
                <span className="text-xs text-gray-400 block">Monthly EMI</span>
                <span className="text-base font-extrabold text-[#00D09C] tabular-nums">
                  {formatINR(res.monthlyEmi)}
                </span>
              </div>
              <div>
                <span className="text-xs text-gray-400 block">Total Interest</span>
                <span className="text-base font-bold text-rose-500 tabular-nums">
                  {formatINR(res.totalInterest)}
                </span>
              </div>
              <div>
                <span className="text-xs text-gray-400 block">Total Payment</span>
                <span className="text-base font-bold text-gray-900 dark:text-white tabular-nums">
                  {formatINR(res.totalPayment)}
                </span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5">
            <DonutChart
              centerTitle="Monthly EMI"
              centerValue={formatINR(res.monthlyEmi)}
              segments={[
                { label: 'Principal Loan Amount', value: res.principalAmount, color: '#00D09C' },
                { label: 'Total Interest Payable', value: res.totalInterest, color: '#EB5B3C' },
              ]}
            />
          </div>
        </div>

        <ScheduleTable title="Loan Amortization Schedule" amortizationSchedule={res.amortizationSchedule} />
      </div>
    );
  }

  // 13. Home Loan Calculator
  if (id === 'home-loan-calculator') {
    const res = calculateHomeLoan(hlPropValue, hlDownPaymentPct, hlRate, hlYears);

    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-7">
            <SliderInput
              label="Property market value"
              value={hlPropValue}
              min={1000000}
              max={30000000}
              step={50000}
              prefix="₹"
              presets={[3000000, 5000000, 7500000, 10000000]}
              onChange={setHlPropValue}
            />
            <SliderInput
              label="Down payment percentage"
              value={hlDownPaymentPct}
              min={10}
              max={80}
              step={5}
              suffix="%"
              presets={[10, 20, 25, 30]}
              tooltip={`Down payment amount: ${formatINR(res.downPayment)}`}
              onChange={setHlDownPaymentPct}
            />
            <SliderInput
              label="Interest rate (p.a)"
              value={hlRate}
              min={6}
              max={15}
              step={0.1}
              suffix="%"
              presets={[8.2, 8.5, 9.0]}
              onChange={setHlRate}
            />
            <SliderInput
              label="Tenure"
              value={hlYears}
              min={5}
              max={30}
              step={1}
              suffix="Yr"
              presets={[15, 20, 25, 30]}
              onChange={setHlYears}
            />

            <div className="p-4 bg-emerald-50 dark:bg-emerald-950/30 rounded-xl border border-emerald-100 dark:border-emerald-800 flex items-start gap-3">
              <ShieldCheck className="text-[#00D09C] flex-shrink-0 mt-0.5" size={18} />
              <div className="text-xs text-emerald-800 dark:text-emerald-300 space-y-1">
                <strong>Tax Benefits on Home Loans:</strong>
                <p>
                  You can claim tax deductions up to <strong>₹2 Lakh/yr</strong> on interest under Section 24(b) and up to <strong>₹1.5 Lakh/yr</strong> on principal repayment under Section 80C.
                </p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5">
            <DonutChart
              centerTitle="Monthly EMI"
              centerValue={formatINR(res.monthlyEmi)}
              segments={[
                { label: 'Loan Principal', value: res.principalAmount, color: '#00D09C' },
                { label: 'Total Interest', value: res.totalInterest, color: '#EB5B3C' },
              ]}
            />
          </div>
        </div>

        <ScheduleTable title="Home Loan Amortization" amortizationSchedule={res.amortizationSchedule} />
      </div>
    );
  }

  // 14. Personal Loan Calculator
  if (id === 'personal-loan-calculator') {
    const res = calculatePersonalLoan(plAmount, plRate, plYears, plFeePct);

    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-7">
            <SliderInput
              label="Personal loan amount"
              value={plAmount}
              min={25000}
              max={2500000}
              step={10000}
              prefix="₹"
              presets={[100000, 300000, 500000, 1000000]}
              onChange={setPlAmount}
            />
            <SliderInput
              label="Annual interest rate"
              value={plRate}
              min={10}
              max={28}
              step={0.5}
              suffix="%"
              presets={[11.5, 12.5, 14, 16]}
              onChange={setPlRate}
            />
            <SliderInput
              label="Tenure"
              value={plYears}
              min={1}
              max={7}
              step={1}
              suffix="Yr"
              presets={[1, 2, 3, 5]}
              onChange={setPlYears}
            />
            <SliderInput
              label="Processing fee %"
              value={plFeePct}
              min={0}
              max={5}
              step={0.5}
              suffix="%"
              onChange={setPlFeePct}
            />
          </div>

          <div className="lg:col-span-5">
            <DonutChart
              centerTitle="Monthly EMI"
              centerValue={formatINR(res.monthlyEmi)}
              segments={[
                { label: 'Disbursal Principal', value: res.netDisbursalAmount, color: '#00D09C' },
                { label: 'Total Interest', value: res.totalInterest, color: '#EB5B3C' },
                { label: 'Processing Fee', value: res.processingFeeAmount, color: '#FFB800' },
              ]}
            />
          </div>
        </div>

        <ScheduleTable title="Personal Loan Amortization" amortizationSchedule={res.amortizationSchedule} />
      </div>
    );
  }

  // 15. Car Loan Calculator
  if (id === 'car-loan-calculator') {
    const res = calculateCarLoan(clPrice, clDownPayment, clRate, clYears);

    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-7">
            <SliderInput
              label="Vehicle on-road price"
              value={clPrice}
              min={300000}
              max={10000000}
              step={25000}
              prefix="₹"
              presets={[600000, 1000000, 1500000, 2500000]}
              onChange={setClPrice}
            />
            <SliderInput
              label="Down payment"
              value={clDownPayment}
              min={50000}
              max={clPrice * 0.8}
              step={10000}
              prefix="₹"
              onChange={setClDownPayment}
            />
            <SliderInput
              label="Rate of interest (p.a)"
              value={clRate}
              min={7}
              max={16}
              step={0.25}
              suffix="%"
              presets={[8.5, 9.0, 9.5, 10.5]}
              onChange={setClRate}
            />
            <SliderInput
              label="Tenure"
              value={clYears}
              min={1}
              max={7}
              step={1}
              suffix="Yr"
              presets={[3, 5, 7]}
              onChange={setClYears}
            />
          </div>

          <div className="lg:col-span-5">
            <DonutChart
              centerTitle="Monthly EMI"
              centerValue={formatINR(res.monthlyEmi)}
              segments={[
                { label: 'Loan Financed', value: res.principalAmount, color: '#00D09C' },
                { label: 'Total Interest', value: res.totalInterest, color: '#EB5B3C' },
              ]}
            />
          </div>
        </div>

        <ScheduleTable title="Car Loan Schedule" amortizationSchedule={res.amortizationSchedule} />
      </div>
    );
  }

  // 16. Loan Prepayment Calculator
  if (id === 'loan-prepayment-calculator') {
    const res = calculateLoanPrepayment(prepBalance, prepRate, prepYears, prepLumpAmount, prepMonth);

    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-7">
            <SliderInput
              label="Outstanding loan balance"
              value={prepBalance}
              min={100000}
              max={20000000}
              step={50000}
              prefix="₹"
              onChange={setPrepBalance}
            />
            <SliderInput
              label="Annual interest rate"
              value={prepRate}
              min={6}
              max={18}
              step={0.1}
              suffix="%"
              onChange={setPrepRate}
            />
            <SliderInput
              label="Remaining tenure"
              value={prepYears}
              min={1}
              max={25}
              step={1}
              suffix="Yr"
              onChange={setPrepYears}
            />
            <SliderInput
              label="Part prepayment amount"
              value={prepLumpAmount}
              min={25000}
              max={prepBalance * 0.8}
              step={10000}
              prefix="₹"
              onChange={setPrepLumpAmount}
            />
            <SliderInput
              label="Prepayment executed at month"
              value={prepMonth}
              min={1}
              max={Math.min(60, prepYears * 12)}
              step={1}
              suffix="Mo"
              onChange={setPrepMonth}
            />
          </div>

          <div className="lg:col-span-5 space-y-4">
            <div className="bg-gradient-to-br from-emerald-500/10 to-teal-500/5 dark:from-emerald-950/40 dark:to-teal-950/20 p-6 rounded-2xl border border-emerald-500/20 text-center">
              <Zap className="text-[#00D09C] mx-auto mb-2" size={28} />
              <span className="text-xs font-bold uppercase tracking-wider text-[#00D09C] block mb-1">
                Total Interest Saved
              </span>
              <div className="text-3xl font-extrabold text-gray-900 dark:text-white tabular-nums my-1">
                {formatINR(res.interestSaved)}
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Direct money saved on interest charges
              </p>

              <div className="mt-6 pt-4 border-t border-emerald-500/20 grid grid-cols-2 gap-4 text-left">
                <div>
                  <span className="text-xs text-gray-400 block">Tenure Reduced By</span>
                  <span className="text-base font-bold text-gray-900 dark:text-white tabular-nums">
                    {res.monthsSaved} Months
                  </span>
                  <span className="text-[11px] text-gray-400 block">
                    ({(res.monthsSaved / 12).toFixed(1)} years earlier)
                  </span>
                </div>
                <div>
                  <span className="text-xs text-gray-400 block">New Total Interest</span>
                  <span className="text-base font-bold text-gray-900 dark:text-white tabular-nums">
                    {formatINR(res.newTotalInterest)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 17. Loan Eligibility Calculator
  if (id === 'loan-eligibility-calculator') {
    const res = calculateLoanEligibility(leIncome, leExistingEmis, leRate, leYears, leFoir);

    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-7">
            <SliderInput
              label="Gross monthly income"
              value={leIncome}
              min={20000}
              max={1000000}
              step={5000}
              prefix="₹"
              presets={[50000, 100000, 150000, 250000]}
              onChange={setLeIncome}
            />
            <SliderInput
              label="Existing monthly EMI obligations"
              value={leExistingEmis}
              min={0}
              max={leIncome * 0.6}
              step={1000}
              prefix="₹"
              onChange={setLeExistingEmis}
            />
            <SliderInput
              label="Expected interest rate (p.a)"
              value={leRate}
              min={6}
              max={15}
              step={0.1}
              suffix="%"
              onChange={setLeRate}
            />
            <SliderInput
              label="Desired loan tenure"
              value={leYears}
              min={1}
              max={30}
              step={1}
              suffix="Yr"
              presets={[10, 15, 20, 25]}
              onChange={setLeYears}
            />
            <SliderInput
              label="Bank FOIR limit %"
              value={leFoir}
              min={30}
              max={70}
              step={5}
              suffix="%"
              tooltip="Fixed Obligation to Income Ratio standard norm is 50%"
              onChange={setLeFoir}
            />
          </div>

          <div className="lg:col-span-5 space-y-4">
            <div className="bg-white dark:bg-[#181B20] p-6 rounded-2xl border border-gray-100 dark:border-gray-800 text-center">
              <span className="text-xs font-semibold uppercase tracking-wider text-gray-400 block mb-2">
                Eligible Loan Amount
              </span>
              <div className="text-3xl font-extrabold text-[#00D09C] tabular-nums my-2">
                {formatINR(res.eligibleLoanAmount)}
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Maximum estimated loan amount banks will sanction
              </p>

              <div className="mt-6 pt-4 border-t border-gray-100 dark:border-gray-800 grid grid-cols-2 gap-4 text-left">
                <div>
                  <span className="text-xs text-gray-400 block">Max Affordable EMI</span>
                  <span className="text-base font-bold text-gray-900 dark:text-white tabular-nums">
                    {formatINR(res.maxAffordableEmi)}
                  </span>
                </div>
                <div>
                  <span className="text-xs text-gray-400 block">Assumed FOIR</span>
                  <span className="text-base font-bold text-gray-900 dark:text-white tabular-nums">
                    {res.foirPercent}%
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return <div>Calculator not found</div>;
};
