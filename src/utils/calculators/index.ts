import type { CalculatorMeta, CalculatorCategory } from '../../types/calculator';

export * from './investment';
export * from './loans';
export * from './taxAndPlanning';

export const CALCULATORS_LIST: CalculatorMeta[] = [
  // --- 1. Investment Calculators (11) ---
  {
    id: 'sip-calculator',
    name: 'SIP Calculator',
    shortName: 'SIP',
    category: 'investment',
    badge: 'Popular',
    description: 'Calculate wealth created and estimated maturity value for your monthly Systematic Investment Plan.',
    formula: 'M = P × [ (1 + i)^n - 1 ] / i × (1 + i)',
    formulaExplanation: 'Where P is Monthly Investment, i is Periodic Interest Rate (Annual Rate / 12 / 100), and n is Total Number of Months (Years × 12).',
    keywords: ['sip', 'systematic investment', 'mutual fund', 'monthly', 'compounding', 'returns'],
  },
  {
    id: 'lumpsum-calculator',
    name: 'Lumpsum Calculator',
    shortName: 'Lumpsum',
    category: 'investment',
    badge: 'Popular',
    description: 'Estimate the future maturity returns on a one-time lumpsum mutual fund investment.',
    formula: 'M = P × (1 + r / 100)^t',
    formulaExplanation: 'Where P is One-time Principal Investment, r is Expected Annual Return Rate, and t is Investment Duration in Years.',
    keywords: ['lumpsum', 'one time investment', 'mutual fund', 'compound', 'wealth'],
  },
  {
    id: 'mf-returns-calculator',
    name: 'Mutual Fund Returns Calculator',
    shortName: 'MF Returns',
    category: 'investment',
    description: 'Compare maturity values and wealth gain between regular SIP and lumpsum investments over time.',
    formula: 'SIP: M = P × [((1+i)^n - 1) / i] × (1+i) | Lumpsum: M = P × (1+r)^t',
    formulaExplanation: 'Combines monthly compounding series for SIP or annual compound growth for one-time lumpsum deposits.',
    keywords: ['mutual fund', 'returns', 'mf', 'nav', 'sip vs lumpsum'],
  },
  {
    id: 'step-up-sip-calculator',
    name: 'Step-Up SIP Calculator',
    shortName: 'Step-Up SIP',
    category: 'investment',
    badge: 'High Growth',
    description: 'Calculate accelerated wealth creation by stepping up your monthly SIP amount annually with your salary increment.',
    formula: 'Monthly SIP increases by s% every 12 months, compounded to maturity',
    formulaExplanation: 'Accounts for annual percentage top-up (e.g., 10% annual step-up) reflecting growing disposable income over time.',
    keywords: ['step up', 'top up sip', 'salary hike', 'compounding', 'accelerated wealth'],
  },
  {
    id: 'cagr-calculator',
    name: 'CAGR Calculator',
    shortName: 'CAGR',
    category: 'investment',
    description: 'Calculate Compound Annual Growth Rate to accurately evaluate annualized return across your stock or mutual fund investments.',
    formula: 'CAGR = (End Value / Start Value)^(1 / Years) - 1',
    formulaExplanation: 'Measures the constant annual rate of return that would take your investment from beginning balance to final balance.',
    keywords: ['cagr', 'annualized return', 'growth rate', 'stocks', 'portfolio performance'],
  },
  {
    id: 'xirr-calculator',
    name: 'XIRR Calculator',
    shortName: 'XIRR',
    category: 'investment',
    description: 'Calculate Extended Internal Rate of Return for irregular or periodic cash inflows and redemptions.',
    formula: '∑ [ C_i / (1 + Rate)^((d_i - d_0) / 365) ] = 0',
    formulaExplanation: 'Solves numerically using the Newton-Raphson method for exact annualized yield across multiple real-world transactions.',
    keywords: ['xirr', 'internal rate of return', 'cash flows', 'sip xirr', 'irr'],
  },
  {
    id: 'swp-calculator',
    name: 'SWP Calculator',
    shortName: 'SWP',
    category: 'investment',
    badge: 'Retirement',
    description: 'Plan your regular monthly cash withdrawals from a mutual fund corpus while leaving the remaining balance invested to grow.',
    formula: 'B_m = B_(m-1) × (1 + i) - Monthly Withdrawal',
    formulaExplanation: 'Simulates monthly capital appreciation net of systematic withdrawals to show remaining balance and total cash extracted.',
    keywords: ['swp', 'systematic withdrawal', 'pension', 'monthly cashflow', 'passive income'],
  },
  {
    id: 'ppf-calculator',
    name: 'PPF Calculator',
    shortName: 'PPF',
    category: 'investment',
    description: 'Calculate maturity value and tax-free interest on Public Provident Fund deposits with current 7.1% government interest.',
    formula: 'F = P × [ (1 + r)^t - 1 ] / r × (1 + r)',
    formulaExplanation: 'Compounded annually with 15-year statutory tenure, subject to annual limit of ₹1,50,000 under Section 80C (EEE tax status).',
    keywords: ['ppf', 'public provident fund', 'tax saving', '80c', 'government scheme'],
  },
  {
    id: 'epf-calculator',
    name: 'EPF Calculator',
    shortName: 'EPF',
    category: 'investment',
    description: 'Calculate your accumulated Employees’ Provident Fund corpus at retirement with employer matching and statutory 8.25% interest.',
    formula: 'Corpus = Accumulated Monthly Employee (12%) + Employer (3.67%) Contributions + Annual Compounding Interest',
    formulaExplanation: 'Projects balance growth up to retirement age (58) accounting for expected annual salary increments.',
    keywords: ['epf', 'pf', 'provident fund', 'retirement corpus', 'pension fund'],
  },
  {
    id: 'fd-calculator',
    name: 'FD Calculator',
    shortName: 'Fixed Deposit',
    category: 'investment',
    badge: 'Safe Return',
    description: 'Compute maturity returns and earned interest on bank Fixed Deposits using Indian standard quarterly compounding.',
    formula: 'A = P × (1 + r / (400))^(4 × t)',
    formulaExplanation: 'Indian commercial banks compound FD interest on a quarterly basis (4 cycles per year) before crediting at maturity.',
    keywords: ['fd', 'fixed deposit', 'bank deposit', 'guaranteed returns', 'quarterly interest'],
  },
  {
    id: 'rd-calculator',
    name: 'RD Calculator',
    shortName: 'Recurring Deposit',
    category: 'investment',
    description: 'Calculate maturity proceeds on monthly Recurring Deposits compounded quarterly across the tenure.',
    formula: 'M = ∑ P × (1 + r / 400)^(4 × (n - i + 1) / 12)',
    formulaExplanation: 'Evaluates each monthly deposit compounded quarterly based on the number of months remaining in tenure.',
    keywords: ['rd', 'recurring deposit', 'monthly saving', 'bank', 'post office'],
  },

  // --- 2. Loan Calculators (6) ---
  {
    id: 'emi-calculator',
    name: 'EMI Calculator',
    shortName: 'EMI',
    category: 'loan',
    badge: 'Popular',
    description: 'Calculate Equated Monthly Installment (EMI), total interest payable, and full loan amortization schedule.',
    formula: 'EMI = P × r × (1 + r)^n / [ (1 + r)^n - 1 ]',
    formulaExplanation: 'Where P is Loan Amount, r is Monthly Interest Rate (Annual Rate / 12 / 100), and n is Total Months.',
    keywords: ['emi', 'equated monthly installment', 'loan', 'amortization', 'interest payment'],
  },
  {
    id: 'home-loan-calculator',
    name: 'Home Loan Calculator',
    shortName: 'Home Loan',
    category: 'loan',
    badge: 'Tax Benefit',
    description: 'Calculate home loan EMI, down payment requirements, interest outflow, and Section 80C & Section 24(b) tax savings.',
    formula: 'Loan = Property Value - Down Payment; EMI computed over tenure up to 30 years',
    formulaExplanation: 'Incorporates tax deduction eligibility up to ₹2,00,000 for interest (Sec 24b) and ₹1,50,000 for principal (Sec 80C).',
    keywords: ['home loan', 'housing finance', 'property', 'mortgage', '80c tax benefit', 'sec 24'],
  },
  {
    id: 'personal-loan-calculator',
    name: 'Personal Loan Calculator',
    shortName: 'Personal Loan',
    category: 'loan',
    description: 'Calculate monthly EMI, total interest, and upfront processing fee deduction for collateral-free personal loans.',
    formula: 'EMI = P × r × (1+r)^n / ((1+r)^n - 1); Net Disbursal = Loan Amount - Processing Fee',
    formulaExplanation: 'Designed for short-to-medium tenures (1 to 5 years) with custom processing fee calculation.',
    keywords: ['personal loan', 'instant loan', 'short term debt', 'unsecured loan', 'processing fee'],
  },
  {
    id: 'car-loan-calculator',
    name: 'Car Loan Calculator',
    shortName: 'Car Loan',
    category: 'loan',
    description: 'Calculate affordable car finance EMI based on on-road vehicle price, down payment, and lender interest rate.',
    formula: 'Financed Amount = On-Road Price - Down Payment; EMI evaluated over 1 to 7 years',
    formulaExplanation: 'Shows loan-to-value impact, total interest versus principal cost, and monthly commitment for auto loans.',
    keywords: ['car loan', 'auto loan', 'vehicle finance', 'down payment', 'car emi'],
  },
  {
    id: 'loan-prepayment-calculator',
    name: 'Loan Prepayment Calculator',
    shortName: 'Prepayment',
    category: 'loan',
    badge: 'Save Interest',
    description: 'Calculate exact interest saved and tenure reduction when making lump-sum part prepayments towards your active loan.',
    formula: 'Prepayment reduces Principal directly, lowering subsequent monthly interest compounding',
    formulaExplanation: 'Simulates the amortization schedule before and after prepayment to determine months saved and total money saved.',
    keywords: ['prepayment', 'part payment', 'foreclosure', 'save interest', 'reduce tenure', 'debt free'],
  },
  {
    id: 'loan-eligibility-calculator',
    name: 'Loan Eligibility Calculator',
    shortName: 'Loan Eligibility',
    category: 'loan',
    description: 'Determine maximum loan amount banks will sanction based on your monthly income and current FOIR debt obligations.',
    formula: 'Max EMI = (Net Income × FOIR %) - Existing EMIs; Eligible Loan = Present Value of Max EMI',
    formulaExplanation: 'Standard banking metric FOIR (Fixed Obligation to Income Ratio, 40%-60%) calculates borrowable limit safely.',
    keywords: ['loan eligibility', 'foir', 'borrowing capacity', 'bank approval', 'income criteria'],
  },

  // --- 3. Other Financial Calculators (8) ---
  {
    id: 'income-tax-calculator',
    name: 'Income Tax Calculator',
    shortName: 'Income Tax',
    category: 'other',
    badge: 'FY 2025-26',
    description: 'Side-by-side comparison of New Tax Regime vs Old Tax Regime with latest budget slabs, standard deductions, and 87A rebate.',
    formula: 'New Regime: Standard Deduction ₹75,000 + Slabs (0-3L Nil, 3-7L 5%, 7-10L 10%, etc.) | Old: ₹50,000 + 80C + 80D',
    formulaExplanation: 'Compares both regimes net of rebates and 4% Health & Education cess to identify your optimal tax savings regime.',
    keywords: ['income tax', 'tax calculator', 'new regime vs old regime', '87a rebate', 'standard deduction', 'itr'],
  },
  {
    id: 'salary-calculator',
    name: 'Salary Calculator',
    shortName: 'In-Hand Salary',
    category: 'other',
    badge: 'CTC to In-Hand',
    description: 'Calculate realistic monthly take-home salary from your gross CTC with detailed Basic, HRA, PF, PT, and TDS breakdown.',
    formula: 'Take-Home = Gross Salary - (Employee PF + Professional Tax + Monthly TDS)',
    formulaExplanation: 'Breaks down compensation structure into tax-efficient components and statutory deductions.',
    keywords: ['salary', 'ctc', 'take home', 'in hand', 'pay slip', 'pf deduction', 'professional tax'],
  },
  {
    id: 'inflation-calculator',
    name: 'Inflation Calculator',
    shortName: 'Inflation',
    category: 'other',
    description: 'Measure the impact of price inflation on your future purchasing power and the real future cost of living.',
    formula: 'Future Cost = Present Cost × (1 + Inflation Rate / 100)^Years',
    formulaExplanation: 'Shows what goods and services costing ₹1,00,000 today will cost in the future given historical CPI inflation.',
    keywords: ['inflation', 'purchasing power', 'cpi', 'real value', 'cost of living'],
  },
  {
    id: 'retirement-calculator',
    name: 'Retirement Planning Calculator',
    shortName: 'Retirement',
    category: 'other',
    badge: 'Life Goal',
    description: 'Calculate the total target retirement corpus required to maintain your lifestyle and the monthly SIP needed to get there.',
    formula: 'Corpus = PV of Inflation-Adjusted Annual Expenses over Retirement Years at Real Rate of Return',
    formulaExplanation: 'Accounts for pre-retirement accumulation, post-retirement real returns, and life expectancy to prevent outliving savings.',
    keywords: ['retirement', 'financial freedom', 'fire', 'retirement corpus', 'pension planning'],
  },
  {
    id: 'gratuity-calculator',
    name: 'Gratuity Calculator',
    shortName: 'Gratuity',
    category: 'other',
    description: 'Calculate statutory gratuity payout payable by employers upon completion of 5 or more years of service.',
    formula: 'Gratuity = (15 × Last Drawn Basic Salary + DA × Tenure in Years) / 26',
    formulaExplanation: 'Under the Payment of Gratuity Act 1972, month is treated as 26 working days with 15 days salary per year of service.',
    keywords: ['gratuity', 'gratuity act', 'employment benefit', 'exit payout', 'service reward'],
  },
  {
    id: 'simple-interest-calculator',
    name: 'Simple Interest Calculator',
    shortName: 'Simple Interest',
    category: 'other',
    description: 'Calculate simple interest and final maturity payout for direct loans, debt agreements, and promissory notes.',
    formula: 'SI = (Principal × Rate × Time) / 100',
    formulaExplanation: 'Linear interest calculation where interest does not compound or earn additional interest on accumulated returns.',
    keywords: ['simple interest', 'si', 'interest calculation', 'linear return', 'loan interest'],
  },
  {
    id: 'compound-interest-calculator',
    name: 'Compound Interest Calculator',
    shortName: 'Compound Interest',
    category: 'other',
    badge: 'Power of 8th Wonder',
    description: 'Calculate compound interest across various compounding frequencies (annually, half-yearly, quarterly, monthly, daily).',
    formula: 'A = P × (1 + r / (100 × n))^(n × t)',
    formulaExplanation: 'Demonstrates exponential wealth growth and compares the spread between simple vs compound interest over time.',
    keywords: ['compound interest', 'ci', 'compounding frequency', 'albert einstein', 'exponential growth'],
  },
  {
    id: 'percentage-calculator',
    name: 'Percentage Calculator',
    shortName: 'Percentage',
    category: 'other',
    description: 'Quick financial and mathematical tool for percentage of an amount, percentage increase/decrease, and margin calculations.',
    formula: 'X% of Y = (X / 100) × Y | % Change = ((Y - X) / X) × 100',
    formulaExplanation: 'Interactive 4-in-1 multi-mode calculation for everyday discount, margin, markup, and investment return calculations.',
    keywords: ['percentage', 'percent', 'discount', 'markup', 'change percentage', 'ratio'],
  },
];

export function getCalculatorById(id: string): CalculatorMeta | undefined {
  return CALCULATORS_LIST.find(c => c.id === id);
}

export function getCalculatorsByCategory(category: CalculatorCategory): CalculatorMeta[] {
  return CALCULATORS_LIST.filter(c => c.category === category);
}

export function searchCalculators(query: string): CalculatorMeta[] {
  const clean = query.trim().toLowerCase();
  if (!clean) return CALCULATORS_LIST;

  return CALCULATORS_LIST.filter(c => {
    return (
      c.name.toLowerCase().includes(clean) ||
      c.shortName.toLowerCase().includes(clean) ||
      c.description.toLowerCase().includes(clean) ||
      c.keywords.some(k => k.toLowerCase().includes(clean))
    );
  });
}
