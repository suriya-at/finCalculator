import type { YearBreakdown } from '../../types/calculator';

/**
 * 18. Income Tax Calculator (FY 2024-25 & FY 2025-26)
 * Side-by-side comparison of New Tax Regime vs Old Tax Regime
 */
export interface TaxRegimeBreakdown {
  regime: 'new' | 'old';
  grossIncome: number;
  totalDeductions: number;
  taxableIncome: number;
  baseTax: number;
  rebate87A: number;
  netTaxBeforeCess: number;
  cess: number;
  totalTaxLiability: number;
  effectiveTaxRatePercent: number;
}

export interface IncomeTaxResult {
  newRegime: TaxRegimeBreakdown;
  oldRegime: TaxRegimeBreakdown;
  recommendedRegime: 'new' | 'old';
  taxSavings: number;
}

export function calculateIncomeTax(
  grossAnnualIncome: number,
  deductions80C: number = 0,
  deductions80D: number = 0,
  hraExemption: number = 0,
  otherDeductions: number = 0
): IncomeTaxResult {
  const gross = Math.max(0, grossAnnualIncome);

  // --- NEW REGIME (Budget 2024/2025) ---
  // Standard Deduction: ₹75,000
  const newStdDeduction = 75000;
  const newTaxableIncome = Math.max(0, gross - newStdDeduction);

  let newBaseTax = 0;
  // Slabs:
  // 0 - 3,00,000: Nil
  // 3,00,001 - 7,00,000: 5% (max 20,000)
  // 7,00,001 - 10,00,000: 10% (max 30,000)
  // 10,00,001 - 12,00,000: 15% (max 30,000)
  // 12,00,001 - 15,00,000: 20% (max 60,000)
  // Above 15,00,000: 30%
  if (newTaxableIncome > 1500000) {
    newBaseTax += (newTaxableIncome - 1500000) * 0.30;
    newBaseTax += 60000 + 30000 + 30000 + 20000;
  } else if (newTaxableIncome > 1200000) {
    newBaseTax += (newTaxableIncome - 1200000) * 0.20;
    newBaseTax += 30000 + 30000 + 20000;
  } else if (newTaxableIncome > 1000000) {
    newBaseTax += (newTaxableIncome - 1000000) * 0.15;
    newBaseTax += 30000 + 20000;
  } else if (newTaxableIncome > 700000) {
    newBaseTax += (newTaxableIncome - 700000) * 0.10;
    newBaseTax += 20000;
  } else if (newTaxableIncome > 300000) {
    newBaseTax += (newTaxableIncome - 300000) * 0.05;
  }

  // Section 87A rebate for New Regime: up to ₹7,00,000 taxable income, full rebate (max ₹25,000)
  let newRebate = 0;
  if (newTaxableIncome <= 700000) {
    newRebate = newBaseTax;
  }
  const newNetBeforeCess = Math.max(0, newBaseTax - newRebate);
  const newCess = newNetBeforeCess * 0.04;
  const newTotalTax = Math.round(newNetBeforeCess + newCess);

  // --- OLD REGIME ---
  // Standard Deduction: ₹50,000
  const oldStdDeduction = 50000;
  const capped80C = Math.min(150000, Math.max(0, deductions80C));
  const capped80D = Math.min(100000, Math.max(0, deductions80D));
  const validHra = Math.max(0, hraExemption);
  const validOther = Math.max(0, otherDeductions);

  const oldTotalDeductions = oldStdDeduction + capped80C + capped80D + validHra + validOther;
  const oldTaxableIncome = Math.max(0, gross - oldTotalDeductions);

  let oldBaseTax = 0;
  // Slabs:
  // 0 - 2.5L: Nil
  // 2.5L - 5L: 5% (max 12,500)
  // 5L - 10L: 20% (max 1,00,000)
  // Above 10L: 30%
  if (oldTaxableIncome > 1000000) {
    oldBaseTax += (oldTaxableIncome - 1000000) * 0.30;
    oldBaseTax += 100000 + 12500;
  } else if (oldTaxableIncome > 500000) {
    oldBaseTax += (oldTaxableIncome - 500000) * 0.20;
    oldBaseTax += 12500;
  } else if (oldTaxableIncome > 250000) {
    oldBaseTax += (oldTaxableIncome - 250000) * 0.05;
  }

  // Section 87A rebate for Old Regime: up to ₹5,00,000 taxable income, full rebate (max ₹12,500)
  let oldRebate = 0;
  if (oldTaxableIncome <= 500000) {
    oldRebate = oldBaseTax;
  }
  const oldNetBeforeCess = Math.max(0, oldBaseTax - oldRebate);
  const oldCess = oldNetBeforeCess * 0.04;
  const oldTotalTax = Math.round(oldNetBeforeCess + oldCess);

  const recommendedRegime: 'new' | 'old' = newTotalTax <= oldTotalTax ? 'new' : 'old';
  const taxSavings = Math.abs(oldTotalTax - newTotalTax);

  return {
    newRegime: {
      regime: 'new',
      grossIncome: Math.round(gross),
      totalDeductions: newStdDeduction,
      taxableIncome: Math.round(newTaxableIncome),
      baseTax: Math.round(newBaseTax),
      rebate87A: Math.round(newRebate),
      netTaxBeforeCess: Math.round(newNetBeforeCess),
      cess: Math.round(newCess),
      totalTaxLiability: newTotalTax,
      effectiveTaxRatePercent: gross > 0 ? parseFloat(((newTotalTax / gross) * 100).toFixed(2)) : 0,
    },
    oldRegime: {
      regime: 'old',
      grossIncome: Math.round(gross),
      totalDeductions: Math.round(oldTotalDeductions),
      taxableIncome: Math.round(oldTaxableIncome),
      baseTax: Math.round(oldBaseTax),
      rebate87A: Math.round(oldRebate),
      netTaxBeforeCess: Math.round(oldNetBeforeCess),
      cess: Math.round(oldCess),
      totalTaxLiability: oldTotalTax,
      effectiveTaxRatePercent: gross > 0 ? parseFloat(((oldTotalTax / gross) * 100).toFixed(2)) : 0,
    },
    recommendedRegime,
    taxSavings: Math.round(taxSavings),
  };
}

/**
 * 19. Salary (In-Hand) Calculator
 */
export interface SalaryBreakdown {
  annualCtc: number;
  monthlyCtc: number;
  basicSalaryMonthly: number;
  hraMonthly: number;
  specialAllowanceMonthly: number;
  employeePfMonthly: number;
  employerPfMonthly: number;
  professionalTaxMonthly: number;
  monthlyTds: number;
  monthlyTakeHome: number;
  annualTakeHome: number;
}

export function calculateSalary(annualCtc: number, taxRegime: 'new' | 'old' = 'new'): SalaryBreakdown {
  const ctc = Math.max(0, annualCtc);
  const monthlyCtc = ctc / 12;

  // Typical Indian compensation structuring:
  // Basic is ~40-50% of CTC
  const basicSalaryMonthly = Math.round(monthlyCtc * 0.45);
  // HRA is ~50% of Basic
  const hraMonthly = Math.round(basicSalaryMonthly * 0.5);
  // Employee PF is 12% of Basic
  const employeePfMonthly = Math.round(basicSalaryMonthly * 0.12);
  // Employer PF is 12% of Basic (part of CTC)
  const employerPfMonthly = Math.round(basicSalaryMonthly * 0.12);
  // Professional Tax: standard ₹200/month (₹2,400/yr)
  const professionalTaxMonthly = ctc > 300000 ? 200 : 0;

  // Remaining part of CTC goes to Special Allowance
  const specialAllowanceMonthly = Math.max(
    0,
    monthlyCtc - (basicSalaryMonthly + hraMonthly + employerPfMonthly)
  );

  // Compute Tax
  const taxResult = calculateIncomeTax(ctc);
  const annualTax = taxRegime === 'new' ? taxResult.newRegime.totalTaxLiability : taxResult.oldRegime.totalTaxLiability;
  const monthlyTds = Math.round(annualTax / 12);

  // Gross monthly pay (excluding Employer PF which doesn't hit bank account)
  const grossMonthlyPay = basicSalaryMonthly + hraMonthly + specialAllowanceMonthly;
  // Deductions: Employee PF, Professional Tax, TDS
  const totalMonthlyDeductions = employeePfMonthly + professionalTaxMonthly + monthlyTds;
  const monthlyTakeHome = Math.max(0, grossMonthlyPay - totalMonthlyDeductions);

  return {
    annualCtc: Math.round(ctc),
    monthlyCtc: Math.round(monthlyCtc),
    basicSalaryMonthly,
    hraMonthly,
    specialAllowanceMonthly: Math.round(specialAllowanceMonthly),
    employeePfMonthly,
    employerPfMonthly,
    professionalTaxMonthly,
    monthlyTds,
    monthlyTakeHome: Math.round(monthlyTakeHome),
    annualTakeHome: Math.round(monthlyTakeHome * 12),
  };
}

/**
 * 20. Inflation Calculator
 * Computes future value of money and purchasing power degradation
 */
export interface InflationResult {
  currentAmount: number;
  futureCost: number;
  purchasingPowerLossPercent: number;
  equivalentTodayPurchasingPower: number;
  yearlyBreakdown: YearBreakdown[];
}

export function calculateInflation(amount: number, annualInflationRate: number, years: number): InflationResult {
  const P = Math.max(0, amount);
  const inf = Math.max(0, annualInflationRate) / 100;
  const t = Math.max(0, years);

  const futureCost = P * Math.pow(1 + inf, t);
  const equivalentToday = P / Math.pow(1 + inf, t);
  const lossPercent = P > 0 ? ((futureCost - P) / futureCost) * 100 : 0;

  const yearlyBreakdown: YearBreakdown[] = [];
  for (let y = 1; y <= t; y++) {
    const cost = P * Math.pow(1 + inf, y);
    yearlyBreakdown.push({
      year: y,
      investedOrPrincipal: Math.round(P),
      interestOrReturns: Math.round(Math.max(0, cost - P)),
      totalBalance: Math.round(cost),
    });
  }

  return {
    currentAmount: Math.round(P),
    futureCost: Math.round(futureCost),
    purchasingPowerLossPercent: parseFloat(lossPercent.toFixed(2)),
    equivalentTodayPurchasingPower: Math.round(equivalentToday),
    yearlyBreakdown,
  };
}

/**
 * 21. Retirement Planning Calculator
 */
export interface RetirementResult {
  currentMonthlyExpense: number;
  monthlyExpenseAtRetirement: number;
  targetCorpusRequired: number;
  existingSavingsFutureValue: number;
  additionalCorpusRequired: number;
  recommendedMonthlySip: number;
}

export function calculateRetirement(
  currentAge: number,
  retirementAge: number = 60,
  lifeExpectancy: number = 85,
  currentMonthlyExpenses: number = 50000,
  expectedInflationPercent: number = 6,
  preRetirementReturnPercent: number = 12,
  postRetirementReturnPercent: number = 8,
  existingSavings: number = 0
): RetirementResult {
  const curAge = Math.max(18, currentAge);
  const retAge = Math.max(curAge + 1, retirementAge);
  const lifeExp = Math.max(retAge + 1, lifeExpectancy);

  const yearsToRetirement = retAge - curAge;
  const yearsInRetirement = lifeExp - retAge;

  const inf = expectedInflationPercent / 100;
  const rPre = preRetirementReturnPercent / (12 * 100);
  const rPost = postRetirementReturnPercent / 100;

  // Monthly expenses at retirement
  const monthlyExpenseAtRetirement = currentMonthlyExpenses * Math.pow(1 + inf, yearsToRetirement);
  const annualExpenseAtRetirement = monthlyExpenseAtRetirement * 12;

  // Real rate of return in retirement
  const realRate = (1 + rPost) / (1 + inf) - 1;

  // Present Value of annuity in retirement (Corpus needed)
  let targetCorpus = 0;
  if (Math.abs(realRate) < 0.0001) {
    targetCorpus = annualExpenseAtRetirement * yearsInRetirement;
  } else {
    targetCorpus = annualExpenseAtRetirement * ((1 - Math.pow(1 + realRate, -yearsInRetirement)) / realRate);
  }

  // Future value of existing savings
  const existingSavingsFv = existingSavings * Math.pow(1 + preRetirementReturnPercent / 100, yearsToRetirement);
  const additionalCorpus = Math.max(0, targetCorpus - existingSavingsFv);

  // Monthly SIP needed to reach additional corpus
  const totalMonths = yearsToRetirement * 12;
  let recommendedMonthlySip = 0;
  if (additionalCorpus > 0 && totalMonths > 0) {
    recommendedMonthlySip = additionalCorpus / (((Math.pow(1 + rPre, totalMonths) - 1) / rPre) * (1 + rPre));
  }

  return {
    currentMonthlyExpense: Math.round(currentMonthlyExpenses),
    monthlyExpenseAtRetirement: Math.round(monthlyExpenseAtRetirement),
    targetCorpusRequired: Math.round(targetCorpus),
    existingSavingsFutureValue: Math.round(existingSavingsFv),
    additionalCorpusRequired: Math.round(additionalCorpus),
    recommendedMonthlySip: Math.round(recommendedMonthlySip),
  };
}

/**
 * 22. Gratuity Calculator
 * Formula: Gratuity = (15 * Last Drawn Basic * Tenure) / 26
 * Eligible after 5 years of service
 */
export interface GratuityResult {
  gratuityAmount: number;
  isEligible: number | boolean;
  taxExemptAmount: number;
  taxableAmount: number;
}

export function calculateGratuity(
  lastDrawnBasicSalary: number,
  yearsOfService: number,
  isCoveredUnderAct: boolean = true
): GratuityResult {
  const basic = Math.max(0, lastDrawnBasicSalary);
  const tenure = Math.max(0, yearsOfService);
  const isEligible = tenure >= 5;

  let gratuityAmount = 0;
  if (isEligible) {
    if (isCoveredUnderAct) {
      gratuityAmount = (15 * basic * tenure) / 26;
    } else {
      gratuityAmount = (15 * basic * tenure) / 30;
    }
  }

  // Capped at ₹20 Lakh exempt under Indian tax laws
  const taxExemptAmount = Math.min(2000000, gratuityAmount);
  const taxableAmount = Math.max(0, gratuityAmount - taxExemptAmount);

  return {
    gratuityAmount: Math.round(gratuityAmount),
    isEligible,
    taxExemptAmount: Math.round(taxExemptAmount),
    taxableAmount: Math.round(taxableAmount),
  };
}

/**
 * 23. Simple Interest Calculator
 * Formula: SI = (P * R * T) / 100
 */
export interface SimpleInterestResult {
  principalAmount: number;
  totalInterest: number;
  totalAmount: number;
}

export function calculateSimpleInterest(principal: number, annualRate: number, years: number): SimpleInterestResult {
  const P = Math.max(0, principal);
  const R = Math.max(0, annualRate);
  const T = Math.max(0, years);

  const interest = (P * R * T) / 100;
  return {
    principalAmount: Math.round(P),
    totalInterest: Math.round(interest),
    totalAmount: Math.round(P + interest),
  };
}

/**
 * 24. Compound Interest Calculator
 * Formula: A = P * (1 + r / (100 * n))^(n * t)
 */
export interface CompoundInterestResult {
  principalAmount: number;
  compoundInterest: number;
  totalAmount: number;
  simpleInterestComparison: number;
  compoundDifference: number;
  yearlyBreakdown: YearBreakdown[];
}

export function calculateCompoundInterest(
  principal: number,
  annualRate: number,
  years: number,
  compoundingFrequencyPerYear: number = 1 // 1: Annual, 2: Half-yearly, 4: Quarterly, 12: Monthly, 365: Daily
): CompoundInterestResult {
  const P = Math.max(0, principal);
  const r = Math.max(0, annualRate);
  const t = Math.max(0, years);
  const n = Math.max(1, compoundingFrequencyPerYear);

  const totalAmount = P * Math.pow(1 + r / (100 * n), n * t);
  const compoundInterest = Math.max(0, totalAmount - P);
  const simpleInterest = (P * r * t) / 100;
  const difference = Math.max(0, compoundInterest - simpleInterest);

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
    principalAmount: Math.round(P),
    compoundInterest: Math.round(compoundInterest),
    totalAmount: Math.round(totalAmount),
    simpleInterestComparison: Math.round(simpleInterest),
    compoundDifference: Math.round(difference),
    yearlyBreakdown,
  };
}

/**
 * 25. Percentage Calculator
 * 4 practical modes:
 * Mode 1: What is X% of Y?
 * Mode 2: X is what % of Y?
 * Mode 3: Percentage increase/decrease from X to Y?
 * Mode 4: Add / Subtract X% to Y
 */
export interface PercentageResult {
  result: number;
  formattedFormula: string;
}

export function calculatePercentage(
  mode: 'percentOf' | 'isWhatPercent' | 'changePercent' | 'addSubtract',
  x: number,
  y: number,
  addSubtractOption?: 'add' | 'subtract'
): PercentageResult {
  if (mode === 'percentOf') {
    // What is X% of Y?
    const res = (x / 100) * y;
    return {
      result: parseFloat(res.toFixed(2)),
      formattedFormula: `(${x} / 100) × ${y} = ${res.toFixed(2)}`,
    };
  }

  if (mode === 'isWhatPercent') {
    // X is what % of Y?
    if (y === 0) return { result: 0, formattedFormula: 'Division by zero is undefined' };
    const res = (x / y) * 100;
    return {
      result: parseFloat(res.toFixed(2)),
      formattedFormula: `(${x} / ${y}) × 100 = ${res.toFixed(2)}%`,
    };
  }

  if (mode === 'changePercent') {
    // % change from X to Y
    if (x === 0) return { result: 0, formattedFormula: 'Starting value cannot be 0' };
    const res = ((y - x) / x) * 100;
    const direction = res >= 0 ? 'Increase' : 'Decrease';
    return {
      result: parseFloat(res.toFixed(2)),
      formattedFormula: `((${y} - ${x}) / ${x}) × 100 = ${res.toFixed(2)}% (${direction})`,
    };
  }

  // addSubtract
  const delta = (x / 100) * y;
  const res = addSubtractOption === 'subtract' ? y - delta : y + delta;
  const sign = addSubtractOption === 'subtract' ? '-' : '+';
  return {
    result: parseFloat(res.toFixed(2)),
    formattedFormula: `${y} ${sign} (${x}% of ${y}) = ${res.toFixed(2)}`,
  };
}
