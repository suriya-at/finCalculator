import { describe, it, expect } from 'vitest';
import {
  calculateSip,
  calculateLumpsum,
  calculateMfReturns,
  calculateStepUpSip,
  calculateCagr,
  calculateXirr,
  calculateSipXirr,
  calculateSwp,
  calculatePpf,
  calculateEpf,
  calculateFd,
  calculateRd,
} from './investment';
import {
  calculateEmi,
  calculateHomeLoan,
  calculatePersonalLoan,
  calculateCarLoan,
  calculateLoanPrepayment,
  calculateLoanEligibility,
} from './loans';
import {
  calculateIncomeTax,
  calculateSalary,
  calculateInflation,
  calculateRetirement,
  calculateGratuity,
  calculateSimpleInterest,
  calculateCompoundInterest,
  calculatePercentage,
} from './taxAndPlanning';
import { CALCULATORS_LIST, searchCalculators, getCalculatorById } from './index';

describe('Financial Calculators Mathematical Correctness', () => {
  describe('Master Registry', () => {
    it('contains all 25 calculators with complete metadata', () => {
      expect(CALCULATORS_LIST.length).toBe(25);
      CALCULATORS_LIST.forEach(c => {
        expect(c.id).toBeTruthy();
        expect(c.name).toBeTruthy();
        expect(c.description).toBeTruthy();
        expect(c.formula).toBeTruthy();
        expect(c.category).toMatch(/investment|loan|other/);
      });
    });

    it('searches calculators accurately', () => {
      expect(searchCalculators('sip').length).toBeGreaterThanOrEqual(3);
      expect(searchCalculators('home loan').length).toBeGreaterThanOrEqual(1);
      expect(getCalculatorById('sip-calculator')?.name).toBe('SIP Calculator');
    });
  });

  describe('Investment Calculators', () => {
    it('calculates SIP accurately', () => {
      // ₹10,000/mo, 12% p.a., 10 years
      const res = calculateSip(10000, 12, 10);
      expect(res.investedAmount).toBe(1200000);
      // Expected total value around ₹23,23,391
      expect(res.totalValue).toBeGreaterThan(2300000);
      expect(res.totalValue).toBeLessThan(2350000);
      expect(res.estimatedReturns).toBe(res.totalValue - res.investedAmount);
      expect(res.yearlyBreakdown.length).toBe(10);
    });

    it('handles SIP edge cases (0 values)', () => {
      const res = calculateSip(0, 12, 10);
      expect(res.totalValue).toBe(0);
      expect(res.investedAmount).toBe(0);

      const resZeroRate = calculateSip(5000, 0, 5);
      expect(resZeroRate.investedAmount).toBe(300000);
      expect(resZeroRate.totalValue).toBe(300000);
      expect(resZeroRate.estimatedReturns).toBe(0);
    });

    it('calculates Lumpsum accurately', () => {
      // ₹1,00,000, 12% p.a., 5 years: 100000 * (1.12)^5 = 176234
      const res = calculateLumpsum(100000, 12, 5);
      expect(res.investedAmount).toBe(100000);
      expect(res.totalValue).toBe(176234);
      expect(res.estimatedReturns).toBe(76234);
      expect(res.yearlyBreakdown.length).toBe(5);
    });

    it('calculates Mutual Fund Returns (SIP and Lumpsum)', () => {
      const sipRes = calculateMfReturns('sip', 5000, 15, 3);
      expect(sipRes.investedAmount).toBe(180000);
      expect(sipRes.totalValue).toBeGreaterThan(220000);

      const lumpRes = calculateMfReturns('lumpsum', 100000, 15, 3);
      expect(lumpRes.investedAmount).toBe(100000);
      expect(lumpRes.totalValue).toBeGreaterThanOrEqual(152087);
      expect(lumpRes.totalValue).toBeLessThanOrEqual(152088);
    });

    it('calculates Step-Up SIP accurately', () => {
      const res = calculateStepUpSip(10000, 10, 12, 5);
      expect(res.investedAmount).toBeGreaterThan(600000); // Because of 10% step up each year
      expect(res.totalValue).toBeGreaterThan(res.investedAmount);
      expect(res.finalMonthlyInvestment).toBe(14641); // 10000 * 1.1^4
    });

    it('calculates CAGR accurately', () => {
      // 100000 to 200000 in 5 years is ~14.87%
      const res = calculateCagr(100000, 200000, 5);
      expect(res.cagrPercent).toBeCloseTo(14.87, 1);
      expect(res.absoluteReturnPercent).toBe(100);
      expect(res.totalProfit).toBe(100000);

      // Edge case: start value 0
      expect(calculateCagr(0, 100, 5).cagrPercent).toBe(0);
    });

    it('calculates XIRR for periodic cash flows', () => {
      const rate = calculateSipXirr(10000, 12, 130000);
      expect(rate).toBeGreaterThan(10);
      expect(rate).toBeLessThan(20);

      // Verify general calculateXirr directly
      const cashFlows = [
        { amount: -100000, date: new Date(2023, 0, 1) },
        { amount: 112000, date: new Date(2024, 0, 1) },
      ];
      const generalXirr = calculateXirr(cashFlows);
      expect(Math.round(generalXirr)).toBe(12);
    });

    it('calculates SWP accurately and flags depletion if applicable', () => {
      // ₹10 Lakh corpus, ₹8,000/mo withdrawal, 8% return, 5 years
      const res = calculateSwp(1000000, 8000, 8, 5);
      expect(res.totalWithdrawn).toBe(480000);
      expect(res.finalValue).toBeGreaterThan(800000);
      expect(res.depletedMonth).toBeUndefined();

      // Exhaustive withdrawal scenario: ₹1 Lakh corpus, ₹20,000/mo withdrawal
      const depletedRes = calculateSwp(100000, 20000, 5, 2);
      expect(depletedRes.depletedMonth).toBeDefined();
      expect(depletedRes.finalValue).toBe(0);
    });

    it('calculates PPF accurately', () => {
      const res = calculatePpf(150000, 7.1, 15);
      expect(res.totalInvested).toBe(2250000);
      // PPF maturity for 1.5L/yr at 7.1% is approx ₹40.68 Lakh
      expect(res.maturityAmount).toBeGreaterThan(4000000);
      expect(res.maturityAmount).toBeLessThan(4150000);
      expect(res.yearlyBreakdown.length).toBe(15);
    });

    it('calculates EPF accurately', () => {
      const res = calculateEpf(40000, 25, 58, 5, 50000, 8.25);
      expect(res.totalCorpus).toBeGreaterThan(10000000); // 1 Cr+
      expect(res.totalEmployeeShare).toBeGreaterThan(0);
      expect(res.totalEmployerShare).toBeGreaterThan(0);
      expect(res.totalInterestEarned).toBeGreaterThan(0);
    });

    it('calculates FD with quarterly compounding', () => {
      // ₹1,00,000 at 7% for 5 years compounded quarterly: 100000 * (1 + 0.07/4)^20 = 141478
      const res = calculateFd(100000, 7, 5, 4);
      expect(res.investedAmount).toBe(100000);
      expect(res.maturityValue).toBe(141478);
      expect(res.estimatedInterest).toBe(41478);
    });

    it('calculates RD accurately', () => {
      const res = calculateRd(5000, 7, 12);
      expect(res.totalInvested).toBe(60000);
      expect(res.maturityAmount).toBeGreaterThan(62000);
      expect(res.estimatedInterest).toBeGreaterThan(2000);
    });
  });

  describe('Loan Calculators', () => {
    it('calculates EMI and amortization schedule accurately', () => {
      // ₹10,00,000 at 10% for 5 years -> EMI ₹21,247
      const res = calculateEmi(1000000, 10, 5);
      expect(res.monthlyEmi).toBe(21247);
      expect(res.principalAmount).toBe(1000000);
      expect(res.totalPayment).toBe(res.monthlyEmi * 60);
      expect(res.totalInterest).toBe(res.totalPayment - res.principalAmount);
      expect(res.amortizationSchedule.length).toBe(5);
      expect(res.amortizationSchedule[4].closingBalance).toBe(0);
    });

    it('calculates Home Loan with down payment and tax deductions', () => {
      const res = calculateHomeLoan(5000000, 20, 8.5, 20);
      expect(res.propertyValue).toBe(5000000);
      expect(res.downPayment).toBe(1000000);
      expect(res.principalAmount).toBe(4000000);
      expect(res.monthlyEmi).toBeGreaterThan(34000);
      expect(res.maxAnnualTaxDeduction).toBe(350000);
    });

    it('calculates Personal Loan with processing fee', () => {
      const res = calculatePersonalLoan(200000, 12, 2, 2);
      expect(res.principalAmount).toBe(200000);
      expect(res.processingFeeAmount).toBe(4000);
      expect(res.netDisbursalAmount).toBe(196000);
      expect(res.monthlyEmi).toBeGreaterThan(9000);
    });

    it('calculates Car Loan', () => {
      const res = calculateCarLoan(1200000, 300000, 9, 5);
      expect(res.onRoadPrice).toBe(1200000);
      expect(res.downPaymentAmount).toBe(300000);
      expect(res.principalAmount).toBe(900000);
      expect(res.monthlyEmi).toBeGreaterThan(18000);
    });

    it('calculates Loan Prepayment interest and tenure savings', () => {
      // ₹30 Lakh remaining, 9% interest, 15 years, prepaying ₹3 Lakh at month 12
      const res = calculateLoanPrepayment(3000000, 9, 15, 300000, 12);
      expect(res.interestSaved).toBeGreaterThan(400000);
      expect(res.monthsSaved).toBeGreaterThan(20);
    });

    it('calculates Loan Eligibility using FOIR', () => {
      // ₹1,00,000 monthly income, ₹15,000 existing EMIs, 50% FOIR -> Max affordable EMI = 35,000
      const res = calculateLoanEligibility(100000, 15000, 8.5, 20, 50);
      expect(res.maxAffordableEmi).toBe(35000);
      expect(res.eligibleLoanAmount).toBeGreaterThan(3500000);
    });
  });

  describe('Tax & Planning Calculators', () => {
    it('calculates Income Tax (New vs Old Regime comparison)', () => {
      // Income ₹10,00,000
      const res = calculateIncomeTax(1000000, 150000, 25000);
      expect(res.newRegime.grossIncome).toBe(1000000);
      expect(res.newRegime.totalDeductions).toBe(75000);
      expect(res.newRegime.taxableIncome).toBe(925000);
      expect(res.recommendedRegime).toMatch(/new|old/);
      expect(res.taxSavings).toBeGreaterThanOrEqual(0);

      // Income under 7 Lakh in New Regime has zero tax due to 87A rebate
      const rebateRes = calculateIncomeTax(750000); // 7.5L - 75k = 6.75L taxable <= 7L
      expect(rebateRes.newRegime.totalTaxLiability).toBe(0);
    });

    it('calculates Salary (CTC to In-Hand Take Home)', () => {
      const res = calculateSalary(1200000, 'new');
      expect(res.annualCtc).toBe(1200000);
      expect(res.monthlyCtc).toBe(100000);
      expect(res.basicSalaryMonthly).toBe(45000);
      expect(res.employeePfMonthly).toBe(5400); // 12% of 45k
      expect(res.monthlyTakeHome).toBeGreaterThan(75000);
      expect(res.annualTakeHome).toBe(res.monthlyTakeHome * 12);
    });

    it('calculates Inflation and purchasing power loss', () => {
      // ₹1,00,000 at 6% over 10 years -> ₹1,79,085
      const res = calculateInflation(100000, 6, 10);
      expect(res.futureCost).toBe(179085);
      expect(res.purchasingPowerLossPercent).toBeGreaterThan(40);
      expect(res.yearlyBreakdown.length).toBe(10);
    });

    it('calculates Retirement Planning corpus and recommended SIP', () => {
      const res = calculateRetirement(30, 60, 85, 50000, 6, 12, 8, 200000);
      expect(res.monthlyExpenseAtRetirement).toBeGreaterThan(250000);
      expect(res.targetCorpusRequired).toBeGreaterThan(40000000); // 4 Cr+
      expect(res.recommendedMonthlySip).toBeGreaterThan(5000);
    });

    it('calculates Gratuity as per Gratuity Act 1972', () => {
      // 10 years service, ₹40,000 basic -> (15 * 40000 * 10) / 26 = 230769
      const res = calculateGratuity(40000, 10, true);
      expect(res.isEligible).toBe(true);
      expect(res.gratuityAmount).toBe(230769);
      expect(res.taxExemptAmount).toBe(230769);
      expect(res.taxableAmount).toBe(0);

      // Under 5 years service is not eligible
      const ineligRes = calculateGratuity(50000, 3);
      expect(ineligRes.isEligible).toBe(false);
      expect(ineligRes.gratuityAmount).toBe(0);
    });

    it('calculates Simple Interest', () => {
      // P: 50,000, R: 8%, T: 3 years -> SI = 12,000
      const res = calculateSimpleInterest(50000, 8, 3);
      expect(res.principalAmount).toBe(50000);
      expect(res.totalInterest).toBe(12000);
      expect(res.totalAmount).toBe(62000);
    });

    it('calculates Compound Interest across compounding frequencies', () => {
      // Annual compounding: 100000, 10%, 3 years -> 133100
      const resAnnual = calculateCompoundInterest(100000, 10, 3, 1);
      expect(resAnnual.totalAmount).toBe(133100);
      expect(resAnnual.compoundInterest).toBe(33100);
      expect(resAnnual.simpleInterestComparison).toBe(30000);
      expect(resAnnual.compoundDifference).toBe(3100);

      // Quarterly compounding earns slightly more
      const resQuarterly = calculateCompoundInterest(100000, 10, 3, 4);
      expect(resQuarterly.compoundInterest).toBeGreaterThan(resAnnual.compoundInterest);
    });

    it('calculates Percentage across all 4 modes', () => {
      // Mode 1: 20% of 500 = 100
      expect(calculatePercentage('percentOf', 20, 500).result).toBe(100);

      // Mode 2: 50 is what % of 200 = 25%
      expect(calculatePercentage('isWhatPercent', 50, 200).result).toBe(25);

      // Mode 3: Change from 100 to 150 = 50%
      expect(calculatePercentage('changePercent', 100, 150).result).toBe(50);

      // Mode 4: Add 10% to 500 = 550
      expect(calculatePercentage('addSubtract', 10, 500, 'add').result).toBe(550);
      // Subtract 10% from 500 = 450
      expect(calculatePercentage('addSubtract', 10, 500, 'subtract').result).toBe(450);
    });
  });
});
