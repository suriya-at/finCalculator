export type CalculatorCategory = 'investment' | 'loan' | 'other';

export interface CalculatorMeta {
  id: string;
  name: string;
  shortName: string;
  category: CalculatorCategory;
  description: string;
  badge?: string;
  formula: string;
  formulaExplanation: string;
  keywords: string[];
}

export interface SliderConfig {
  id: string;
  label: string;
  min: number;
  max: number;
  step: number;
  defaultValue: number;
  unit?: string;
  prefix?: string;
  tooltip?: string;
}

export interface YearBreakdown {
  year: number;
  investedOrPrincipal: number;
  interestOrReturns: number;
  totalBalance: number;
}

export interface AmortizationRow {
  year: number;
  openingBalance: number;
  emiPaid: number;
  principalPaid: number;
  interestPaid: number;
  closingBalance: number;
}
