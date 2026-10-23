import type { AmortizationRow } from '../../types/calculator';

/**
 * Common EMI calculation function
 * EMI = P * r * (1+r)^n / ((1+r)^n - 1)
 */
export interface EmiResult {
  monthlyEmi: number;
  principalAmount: number;
  totalInterest: number;
  totalPayment: number;
  amortizationSchedule: AmortizationRow[];
}

export function calculateEmi(loanAmount: number, annualInterestRate: number, tenureYears: number): EmiResult {
  const P = Math.max(0, loanAmount);
  const rAnnual = Math.max(0, annualInterestRate);
  const t = Math.max(0.1, tenureYears);
  const n = Math.round(t * 12);

  if (P === 0) {
    return {
      monthlyEmi: 0,
      principalAmount: 0,
      totalInterest: 0,
      totalPayment: 0,
      amortizationSchedule: [],
    };
  }

  const rMonthly = rAnnual / (12 * 100);
  let emi = 0;

  if (rMonthly === 0) {
    emi = P / n;
  } else {
    const factor = Math.pow(1 + rMonthly, n);
    emi = (P * rMonthly * factor) / (factor - 1);
  }

  const roundedEmi = Math.round(emi);
  const totalPayment = roundedEmi * n;
  const totalInterest = Math.max(0, totalPayment - P);

  // Build yearly amortization schedule
  const amortizationSchedule: AmortizationRow[] = [];
  let currentBalance = P;

  for (let y = 1; y <= Math.ceil(t); y++) {
    const openingBalance = currentBalance;
    let yearPrincipal = 0;
    let yearInterest = 0;

    for (let m = 1; m <= 12; m++) {
      if (currentBalance <= 0) break;
      const monthInterest = currentBalance * rMonthly;
      const monthPrincipal = Math.min(currentBalance, emi - monthInterest);
      yearInterest += monthInterest;
      yearPrincipal += monthPrincipal;
      currentBalance = Math.max(0, currentBalance - monthPrincipal);
    }

    amortizationSchedule.push({
      year: y,
      openingBalance: Math.round(openingBalance),
      emiPaid: Math.round(yearPrincipal + yearInterest),
      principalPaid: Math.round(yearPrincipal),
      interestPaid: Math.round(yearInterest),
      closingBalance: Math.round(currentBalance),
    });
  }

  return {
    monthlyEmi: Math.round(emi),
    principalAmount: Math.round(P),
    totalInterest: Math.round(totalInterest),
    totalPayment: Math.round(totalPayment),
    amortizationSchedule,
  };
}

/**
 * 13. Home Loan Calculator
 * Includes down payment, tax benefits under Sec 80C & Sec 24b
 */
export interface HomeLoanResult extends EmiResult {
  propertyValue: number;
  downPayment: number;
  maxAnnualTaxDeduction: number;
}

export function calculateHomeLoan(
  propertyValue: number,
  downPaymentPercent: number,
  annualInterestRate: number,
  tenureYears: number
): HomeLoanResult {
  const propVal = Math.max(0, propertyValue);
  const dpPct = Math.min(99, Math.max(0, downPaymentPercent)) / 100;
  const downPayment = propVal * dpPct;
  const loanAmount = Math.max(0, propVal - downPayment);

  const emiRes = calculateEmi(loanAmount, annualInterestRate, tenureYears);
  // Max tax deduction: 80C (up to 1.5L for principal) + 24(b) (up to 2L for interest) = 3.5 Lakh
  const maxTaxBenefit = 350000;

  return {
    ...emiRes,
    propertyValue: Math.round(propVal),
    downPayment: Math.round(downPayment),
    maxAnnualTaxDeduction: maxTaxBenefit,
  };
}

/**
 * 14. Personal Loan Calculator
 * Typically shorter tenure (1-5 yrs) with processing fees
 */
export interface PersonalLoanResult extends EmiResult {
  processingFeeAmount: number;
  netDisbursalAmount: number;
}

export function calculatePersonalLoan(
  loanAmount: number,
  annualInterestRate: number,
  tenureYears: number,
  processingFeePercent: number = 2
): PersonalLoanResult {
  const emiRes = calculateEmi(loanAmount, annualInterestRate, tenureYears);
  const procFee = (loanAmount * Math.max(0, processingFeePercent)) / 100;
  return {
    ...emiRes,
    processingFeeAmount: Math.round(procFee),
    netDisbursalAmount: Math.round(loanAmount - procFee),
  };
}

/**
 * 15. Car Loan Calculator
 * On-road price, down payment, loan amount
 */
export interface CarLoanResult extends EmiResult {
  onRoadPrice: number;
  downPaymentAmount: number;
}

export function calculateCarLoan(
  onRoadPrice: number,
  downPaymentAmount: number,
  annualInterestRate: number,
  tenureYears: number
): CarLoanResult {
  const price = Math.max(0, onRoadPrice);
  const dp = Math.min(price, Math.max(0, downPaymentAmount));
  const loanAmount = Math.max(0, price - dp);

  const emiRes = calculateEmi(loanAmount, annualInterestRate, tenureYears);
  return {
    ...emiRes,
    onRoadPrice: Math.round(price),
    downPaymentAmount: Math.round(dp),
  };
}

/**
 * 16. Loan Prepayment Calculator
 * Computes how much interest and tenure you save by prepaying
 */
export interface PrepaymentResult {
  originalEmi: number;
  originalTotalInterest: number;
  newTotalInterest: number;
  interestSaved: number;
  originalTenureMonths: number;
  newTenureMonths: number;
  monthsSaved: number;
}

export function calculateLoanPrepayment(
  currentBalance: number,
  annualInterestRate: number,
  remainingTenureYears: number,
  prepaymentAmount: number,
  prepaymentMonth: number = 12
): PrepaymentResult {
  const P = Math.max(0, currentBalance);
  const rAnnual = Math.max(0, annualInterestRate);
  const rMonthly = rAnnual / (12 * 100);
  const totalMonths = Math.round(remainingTenureYears * 12);
  const extraPay = Math.max(0, prepaymentAmount);
  const prepayMonth = Math.min(totalMonths, Math.max(1, prepaymentMonth));

  const origEmiRes = calculateEmi(P, rAnnual, remainingTenureYears);
  const emi = origEmiRes.monthlyEmi;

  let balance = P;
  let newInterest = 0;
  let monthsElapsed = 0;

  for (let m = 1; m <= totalMonths * 2; m++) {
    if (balance <= 0) break;
    monthsElapsed = m;
    const interest = balance * rMonthly;
    newInterest += interest;
    let principalPaid = emi - interest;

    if (m === prepayMonth) {
      principalPaid += extraPay;
    }

    balance = balance - principalPaid;
    if (balance < 0) balance = 0;
  }

  const interestSaved = Math.max(0, origEmiRes.totalInterest - newInterest);
  const monthsSaved = Math.max(0, totalMonths - monthsElapsed);

  return {
    originalEmi: origEmiRes.monthlyEmi,
    originalTotalInterest: origEmiRes.totalInterest,
    newTotalInterest: Math.round(newInterest),
    interestSaved: Math.round(interestSaved),
    originalTenureMonths: totalMonths,
    newTenureMonths: monthsElapsed,
    monthsSaved,
  };
}

/**
 * 17. Loan Eligibility Calculator
 * Based on FOIR (Fixed Obligation to Income Ratio, e.g. 50%)
 */
export interface LoanEligibilityResult {
  maxAffordableEmi: number;
  eligibleLoanAmount: number;
  foirPercent: number;
}

export function calculateLoanEligibility(
  grossMonthlyIncome: number,
  existingMonthlyEmis: number,
  annualInterestRate: number,
  tenureYears: number,
  foirPercent: number = 50
): LoanEligibilityResult {
  const income = Math.max(0, grossMonthlyIncome);
  const existingEmis = Math.max(0, existingMonthlyEmis);
  const foir = Math.max(10, Math.min(90, foirPercent)) / 100;
  const rMonthly = Math.max(0.1, annualInterestRate) / (12 * 100);
  const n = Math.round(Math.max(1, tenureYears) * 12);

  const totalAllowedEmi = income * foir;
  const maxAffordableEmi = Math.max(0, totalAllowedEmi - existingEmis);

  // Present Value of annuity formula to get eligible principal
  // P = EMI * ((1 + r)^n - 1) / (r * (1 + r)^n)
  let eligibleLoanAmount = 0;
  if (maxAffordableEmi > 0) {
    const factor = Math.pow(1 + rMonthly, n);
    eligibleLoanAmount = maxAffordableEmi * ((factor - 1) / (rMonthly * factor));
  }

  return {
    maxAffordableEmi: Math.round(maxAffordableEmi),
    eligibleLoanAmount: Math.round(eligibleLoanAmount),
    foirPercent,
  };
}
