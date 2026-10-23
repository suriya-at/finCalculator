/**
 * Formats a number to Indian Rupee representation (e.g., ₹25,000 or ₹1.5 Cr)
 */
export function formatINR(amount: number, compact: boolean = false): string {
  if (isNaN(amount) || !isFinite(amount)) return '₹0';
  
  if (compact) {
    const abs = Math.abs(amount);
    const sign = amount < 0 ? '-' : '';
    if (abs >= 10000000) {
      return `${sign}₹${(abs / 10000000).toFixed(2)} Cr`;
    }
    if (abs >= 100000) {
      return `${sign}₹${(abs / 100000).toFixed(2)} L`;
    }
    if (abs >= 1000) {
      return `${sign}₹${(abs / 1000).toFixed(1)}k`;
    }
  }

  // Standard Indian comma notation (en-IN)
  const rounded = Math.round(amount);
  return `₹${rounded.toLocaleString('en-IN')}`;
}

/**
 * Formats number with Indian commas without rupee sign
 */
export function formatNumber(val: number): string {
  if (isNaN(val) || !isFinite(val)) return '0';
  return Math.round(val).toLocaleString('en-IN');
}

/**
 * Formats decimal values up to 2 decimal places with fallback
 */
export function formatDecimal(val: number, decimals: number = 2): string {
  if (isNaN(val) || !isFinite(val)) return '0';
  return val.toLocaleString('en-IN', {
    minimumFractionDigits: 0,
    maximumFractionDigits: decimals,
  });
}

/**
 * Formats percentage
 */
export function formatPercent(val: number, decimals: number = 2): string {
  if (isNaN(val) || !isFinite(val)) return '0%';
  return `${formatDecimal(val, decimals)}%`;
}

/**
 * Parse input string into a valid safe number
 */
export function parseInputNumber(val: string | number, min: number = 0, max: number = Infinity): number {
  if (typeof val === 'number') {
    if (isNaN(val)) return min;
    return Math.min(Math.max(val, min), max);
  }
  const clean = val.replace(/[^0-9.-]/g, '');
  const parsed = parseFloat(clean);
  if (isNaN(parsed)) return min;
  return Math.min(Math.max(parsed, min), max);
}
