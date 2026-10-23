import type { YearBreakdown } from '../../types/calculator';

/**
 * 1. SIP Calculator
 * Formula: M = P × [ (1 + i)^n - 1 ] / i × (1 + i)
 * where i = r / (12 * 100), n = tenure * 12
 */
export interface SipResult {
  investedAmount: number;
  estimatedReturns: number;
  totalValue: number;
  yearlyBreakdown: YearBreakdown[];
}

export function calculateSip(monthlyInvestment: number, annualRate: number, years: number): SipResult {
  const P = Math.max(0, monthlyInvestment);
  const r = Math.max(0, annualRate);
  const t = Math.max(0, years);
  const n = Math.round(t * 12);

  if (P === 0 || t === 0) {
    return { investedAmount: 0, estimatedReturns: 0, totalValue: 0, yearlyBreakdown: [] };
  }

  const investedAmount = P * n;
  let totalValue = investedAmount;

  if (r > 0) {
    const i = r / (12 * 100);
    totalValue = P * ((Math.pow(1 + i, n) - 1) / i) * (1 + i);
  }

  const estimatedReturns = Math.max(0, totalValue - investedAmount);

  // Generate Year-by-year breakdown
  const yearlyBreakdown: YearBreakdown[] = [];
  const i = (r / (12 * 100));

  for (let y = 1; y <= t; y++) {
    const months = y * 12;
    const inv = P * months;
    let balance = inv;
    if (r > 0) {
      balance = P * ((Math.pow(1 + i, months) - 1) / i) * (1 + i);
    }
    yearlyBreakdown.push({
      year: y,
      investedOrPrincipal: Math.round(inv),
      interestOrReturns: Math.round(Math.max(0, balance - inv)),
      totalBalance: Math.round(balance),
    });
  }

  return {
    investedAmount: Math.round(investedAmount),
    estimatedReturns: Math.round(estimatedReturns),
    totalValue: Math.round(totalValue),
    yearlyBreakdown,
  };
}

/**
 * 2. Lumpsum Calculator
 * Formula: M = P × (1 + r / 100)^t
 */
export interface LumpsumResult {
  investedAmount: number;
  estimatedReturns: number;
  totalValue: number;
  yearlyBreakdown: YearBreakdown[];
}

export function calculateLumpsum(totalInvestment: number, annualRate: number, years: number): LumpsumResult {
  const P = Math.max(0, totalInvestment);
  const r = Math.max(0, annualRate);
  const t = Math.max(0, years);

  if (P === 0 || t === 0) {
    return { investedAmount: P, estimatedReturns: 0, totalValue: P, yearlyBreakdown: [] };
  }

  const totalValue = P * Math.pow(1 + r / 100, t);
  const estimatedReturns = Math.max(0, totalValue - P);

  const yearlyBreakdown: YearBreakdown[] = [];
  for (let y = 1; y <= t; y++) {
    const balance = P * Math.pow(1 + r / 100, y);
    yearlyBreakdown.push({
      year: y,
      investedOrPrincipal: Math.round(P),
      interestOrReturns: Math.round(Math.max(0, balance - P)),
      totalBalance: Math.round(balance),
    });
  }

  return {
    investedAmount: Math.round(P),
    estimatedReturns: Math.round(estimatedReturns),
    totalValue: Math.round(totalValue),
    yearlyBreakdown,
  };
}

/**
 * 3. Mutual Fund Returns Calculator
 * Supports SIP & Lumpsum modes
 */
export function calculateMfReturns(
  mode: 'sip' | 'lumpsum',
  investment: number,
  annualRate: number,
  years: number
): SipResult | LumpsumResult {
  return mode === 'sip'
    ? calculateSip(investment, annualRate, years)
    : calculateLumpsum(investment, annualRate, years);
}

/**
 * 4. Step-Up SIP Calculator
 * Monthly investment increases by stepUpPercent every 12 months
 */
export interface StepUpSipResult {
  investedAmount: number;
  estimatedReturns: number;
  totalValue: number;
  finalMonthlyInvestment: number;
  yearlyBreakdown: YearBreakdown[];
}

export function calculateStepUpSip(
  initialMonthly: number,
  stepUpPercent: number,
  annualRate: number,
  years: number
): StepUpSipResult {
  const P0 = Math.max(0, initialMonthly);
  const step = Math.max(0, stepUpPercent) / 100;
  const r = Math.max(0, annualRate);
  const t = Math.max(0, years);

  if (P0 === 0 || t === 0) {
    return {
      investedAmount: 0,
      estimatedReturns: 0,
      totalValue: 0,
      finalMonthlyInvestment: 0,
      yearlyBreakdown: [],
    };
  }

  const monthlyRate = r / (12 * 100);
  let totalBalance = 0;
  let totalInvested = 0;
  let currentMonthly = P0;
  const yearlyBreakdown: YearBreakdown[] = [];

  for (let y = 1; y <= t; y++) {
    // Current year monthly investment
    for (let m = 1; m <= 12; m++) {
      totalInvested += currentMonthly;
      totalBalance = (totalBalance + currentMonthly) * (1 + monthlyRate);
    }

    yearlyBreakdown.push({
      year: y,
      investedOrPrincipal: Math.round(totalInvested),
      interestOrReturns: Math.round(Math.max(0, totalBalance - totalInvested)),
      totalBalance: Math.round(totalBalance),
    });

    if (y < t) {
      currentMonthly = currentMonthly * (1 + step);
    }
  }

  return {
    investedAmount: Math.round(totalInvested),
    estimatedReturns: Math.round(Math.max(0, totalBalance - totalInvested)),
    totalValue: Math.round(totalBalance),
    finalMonthlyInvestment: Math.round(currentMonthly),
    yearlyBreakdown,
  };
}

/**
 * 5. CAGR Calculator
 * Formula: CAGR = (End Value / Start Value)^(1 / years) - 1
 */
export interface CagrResult {
  cagrPercent: number;
  absoluteReturnPercent: number;
  totalProfit: number;
}

export function calculateCagr(startValue: number, endValue: number, years: number): CagrResult {
  const v0 = Math.max(0, startValue);
  const v1 = Math.max(0, endValue);
  const t = Math.max(0.01, years);

  if (v0 === 0) {
    return { cagrPercent: 0, absoluteReturnPercent: 0, totalProfit: 0 };
  }

  const cagr = (Math.pow(v1 / v0, 1 / t) - 1) * 100;
  const absReturn = ((v1 - v0) / v0) * 100;
  const totalProfit = v1 - v0;

  return {
    cagrPercent: parseFloat(cagr.toFixed(2)),
    absoluteReturnPercent: parseFloat(absReturn.toFixed(2)),
    totalProfit: Math.round(totalProfit),
  };
}

/**
 * 6. XIRR Calculator
 * Approximates internal rate of return for periodic/scheduled cash flows
 */
export interface CashFlow {
  amount: number; // Negative for investment, positive for redemption
  date: Date;
}

export function calculateXirr(cashFlows: CashFlow[], guess: number = 0.1): number {
  if (cashFlows.length < 2) return 0;

  const minDate = cashFlows[0].date.getTime();
  const yearFractions = cashFlows.map(cf => (cf.date.getTime() - minDate) / (365 * 24 * 3600 * 1000));

  // Newton-Raphson method
  let rate = guess;
  const maxIterations = 100;
  const tolerance = 1e-6;

  for (let iter = 0; iter < maxIterations; iter++) {
    let fValue = 0;
    let fDerivative = 0;

    for (let i = 0; i < cashFlows.length; i++) {
      const t = yearFractions[i];
      const factor = Math.pow(1 + rate, t);
      if (!isFinite(factor) || factor === 0) break;

      fValue += cashFlows[i].amount / factor;
      fDerivative -= (t * cashFlows[i].amount) / (factor * (1 + rate));
    }

    if (Math.abs(fValue) < tolerance) {
      return parseFloat((rate * 100).toFixed(2));
    }

    if (Math.abs(fDerivative) < 1e-10) break;

    const newRate = rate - fValue / fDerivative;
    if (newRate <= -1) {
      rate = (rate - 1) / 2; // Bisection fallback
    } else {
      rate = newRate;
    }
  }

  return parseFloat((rate * 100).toFixed(2));
}

/**
 * Convenience helper for recurring SIP XIRR
 */
export function calculateSipXirr(monthlyAmount: number, months: number, finalValue: number): number {
  const cashFlows: CashFlow[] = [];
  const startDate = new Date();
  
  for (let m = 0; m < months; m++) {
    const d = new Date(startDate);
    d.setMonth(d.getMonth() + m);
    cashFlows.push({ amount: -monthlyAmount, date: d });
  }

  const endDate = new Date(startDate);
  endDate.setMonth(endDate.getMonth() + months);
  cashFlows.push({ amount: finalValue, date: endDate });

  return calculateXirr(cashFlows);
}

/**
 * 7. SWP (Systematic Withdrawal Plan) Calculator
 */
export interface SwpResult {
  initialInvestment: number;
  totalWithdrawn: number;
  finalValue: number;
  totalValue: number;
  depletedMonth?: number;
  yearlyBreakdown: YearBreakdown[];
}

export function calculateSwp(
  initialInvestment: number,
  monthlyWithdrawal: number,
  annualRate: number,
  years: number
): SwpResult {
  const P = Math.max(0, initialInvestment);
  const W = Math.max(0, monthlyWithdrawal);
  const r = Math.max(0, annualRate);
  const t = Math.max(0, years);
  const totalMonths = Math.round(t * 12);

  let currentBalance = P;
  let totalWithdrawn = 0;
  const monthlyRate = r / (12 * 100);
  let depletedMonth: number | undefined;

  const yearlyBreakdown: YearBreakdown[] = [];

  for (let m = 1; m <= totalMonths; m++) {
    currentBalance = currentBalance * (1 + monthlyRate) - W;
    if (currentBalance < 0) {
      totalWithdrawn += W + currentBalance; // only what was left
      currentBalance = 0;
      if (!depletedMonth) depletedMonth = m;
      break;
    } else {
      totalWithdrawn += W;
    }

    if (m % 12 === 0) {
      const y = m / 12;
      yearlyBreakdown.push({
        year: y,
        investedOrPrincipal: Math.round(P),
        interestOrReturns: Math.round(Math.max(0, totalWithdrawn + currentBalance - P)),
        totalBalance: Math.round(currentBalance),
      });
    }
  }

  // If ended before completing all years
  const lastRecordedYear = yearlyBreakdown.length;
  if (lastRecordedYear < t && depletedMonth) {
    for (let y = lastRecordedYear + 1; y <= t; y++) {
      yearlyBreakdown.push({
        year: y,
        investedOrPrincipal: Math.round(P),
        interestOrReturns: Math.round(Math.max(0, totalWithdrawn - P)),
        totalBalance: 0,
      });
    }
  }

  return {
    initialInvestment: Math.round(P),
    totalWithdrawn: Math.round(totalWithdrawn),
    finalValue: Math.round(currentBalance),
    totalValue: Math.round(totalWithdrawn + currentBalance),
    depletedMonth,
    yearlyBreakdown,
  };
}

/**
 * 8. PPF Calculator
 * Standard PPF tenure 15 years, max ₹1.5L/year, 7.1% p.a. compound annually
 */
export interface PpfResult {
  totalInvested: number;
  totalInterest: number;
  maturityAmount: number;
  yearlyBreakdown: YearBreakdown[];
}

export function calculatePpf(yearlyInvestment: number, rate: number = 7.1, years: number = 15): PpfResult {
  const P = Math.min(Math.max(0, yearlyInvestment), 150000);
  const r = Math.max(0, rate) / 100;
  const t = Math.max(15, years);

  let balance = 0;
  let totalInvested = 0;
  const yearlyBreakdown: YearBreakdown[] = [];

  for (let y = 1; y <= t; y++) {
    totalInvested += P;
    const interestEarned = (balance + P) * r;
    balance = balance + P + interestEarned;

    yearlyBreakdown.push({
      year: y,
      investedOrPrincipal: Math.round(totalInvested),
      interestOrReturns: Math.round(Math.max(0, balance - totalInvested)),
      totalBalance: Math.round(balance),
    });
  }

  return {
    totalInvested: Math.round(totalInvested),
    totalInterest: Math.round(Math.max(0, balance - totalInvested)),
    maturityAmount: Math.round(balance),
    yearlyBreakdown,
  };
}

/**
 * 9. EPF Calculator
 * Employee contribution 12%, Employer contribution to EPF 3.67%, 8.25% interest rate
 */
export interface EpfResult {
  totalEmployeeShare: number;
  totalEmployerShare: number;
  totalInterestEarned: number;
  totalCorpus: number;
  yearlyBreakdown: YearBreakdown[];
}

export function calculateEpf(
  monthlyBasicSalary: number,
  currentAge: number,
  retirementAge: number = 58,
  annualSalaryHikePercent: number = 5,
  currentEpfBalance: number = 0,
  annualInterestRate: number = 8.25
): EpfResult {
  const basic = Math.max(0, monthlyBasicSalary);
  const age = Math.max(18, currentAge);
  const retAge = Math.max(age + 1, retirementAge);
  const totalYears = retAge - age;
  const hike = Math.max(0, annualSalaryHikePercent) / 100;
  const r = Math.max(0, annualInterestRate) / 100;

  let currentBasic = basic;
  let balance = Math.max(0, currentEpfBalance);
  let totalEmployee = 0;
  let totalEmployer = 0;
  let totalInterest = 0;
  const yearlyBreakdown: YearBreakdown[] = [];

  for (let y = 1; y <= totalYears; y++) {
    const annualEmployee = currentBasic * 0.12 * 12;
    const annualEmployer = currentBasic * 0.0367 * 12;
    const yearlyContribution = annualEmployee + annualEmployer;

    totalEmployee += annualEmployee;
    totalEmployer += annualEmployer;

    // Monthly compounding interest approximation
    const interest = (balance + yearlyContribution / 2) * r;
    totalInterest += interest;
    balance += yearlyContribution + interest;

    yearlyBreakdown.push({
      year: y,
      investedOrPrincipal: Math.round(totalEmployee + totalEmployer),
      interestOrReturns: Math.round(totalInterest),
      totalBalance: Math.round(balance),
    });

    currentBasic = currentBasic * (1 + hike);
  }

  return {
    totalEmployeeShare: Math.round(totalEmployee),
    totalEmployerShare: Math.round(totalEmployer),
    totalInterestEarned: Math.round(totalInterest),
    totalCorpus: Math.round(balance),
    yearlyBreakdown,
  };
}

/**
 * 10. FD Calculator
 * Standard Indian banking quarterly compounding: M = P * (1 + r / (400))^(4 * t)
 */
export interface FdResult {
  investedAmount: number;
  estimatedInterest: number;
  maturityValue: number;
  yearlyBreakdown: YearBreakdown[];
}

export function calculateFd(
  principal: number,
  annualRate: number,
  years: number,
  compoundingPerYear: number = 4 // Quarterly default in India
): FdResult {
  const P = Math.max(0, principal);
  const r = Math.max(0, annualRate);
  const t = Math.max(0, years);
  const n = Math.max(1, compoundingPerYear);

  if (P === 0 || t === 0) {
    return { investedAmount: P, estimatedInterest: 0, maturityValue: P, yearlyBreakdown: [] };
  }

  const maturityValue = P * Math.pow(1 + r / (100 * n), n * t);
  const estimatedInterest = Math.max(0, maturityValue - P);

  const yearlyBreakdown: YearBreakdown[] = [];
  for (let y = 1; y <= Math.ceil(t); y++) {
    const actualYear = Math.min(y, t);
    const balance = P * Math.pow(1 + r / (100 * n), n * actualYear);
    yearlyBreakdown.push({
      year: y,
      investedOrPrincipal: Math.round(P),
      interestOrReturns: Math.round(Math.max(0, balance - P)),
      totalBalance: Math.round(balance),
    });
  }

  return {
    investedAmount: Math.round(P),
    estimatedInterest: Math.round(estimatedInterest),
    maturityValue: Math.round(maturityValue),
    yearlyBreakdown,
  };
}

/**
 * 11. RD (Recurring Deposit) Calculator
 * Quarterly compounded monthly installments formula:
 * M = P * sum((1 + r / 400)^(4 * (n - i + 1) / 12)) for i = 1 to n
 */
export interface RdResult {
  totalInvested: number;
  estimatedInterest: number;
  maturityAmount: number;
  yearlyBreakdown: YearBreakdown[];
}

export function calculateRd(monthlyDeposit: number, annualRate: number, tenureMonths: number): RdResult {
  const P = Math.max(0, monthlyDeposit);
  const r = Math.max(0, annualRate);
  const n = Math.max(1, Math.round(tenureMonths));

  let maturityAmount = 0;
  for (let i = 1; i <= n; i++) {
    // k months remaining to compound quarterly
    const remainingMonths = n - i + 1;
    const quarters = remainingMonths / 3;
    maturityAmount += P * Math.pow(1 + r / 400, quarters);
  }

  const totalInvested = P * n;
  const estimatedInterest = Math.max(0, maturityAmount - totalInvested);

  // Yearly breakdown
  const yearlyBreakdown: YearBreakdown[] = [];
  const totalYears = Math.ceil(n / 12);

  for (let y = 1; y <= totalYears; y++) {
    const currentMonths = Math.min(y * 12, n);
    let subMaturity = 0;
    for (let i = 1; i <= currentMonths; i++) {
      const remaining = currentMonths - i + 1;
      subMaturity += P * Math.pow(1 + r / 400, remaining / 3);
    }
    const subInvested = P * currentMonths;
    yearlyBreakdown.push({
      year: y,
      investedOrPrincipal: Math.round(subInvested),
      interestOrReturns: Math.round(Math.max(0, subMaturity - subInvested)),
      totalBalance: Math.round(subMaturity),
    });
  }

  return {
    totalInvested: Math.round(totalInvested),
    estimatedInterest: Math.round(estimatedInterest),
    maturityAmount: Math.round(maturityAmount),
    yearlyBreakdown,
  };
}
