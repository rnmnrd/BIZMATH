// ========== BIZMATH NUMBER FORMATTING UTILITY ==========
// Centralized number formatting for all calculators
// Ensures consistent display across Simple Interest, Compound Interest, Annuities, etc.

/**
 * Smart number formatter with up to 8 decimal places
 * Automatically removes trailing zeros while preserving precision
 * 
 * @param {number} n - The number to format
 * @param {number} maxDecimals - Maximum decimal places (default: 8)
 * @returns {string} - Formatted number as string
 * 
 * Examples:
 * formatNumber(10) => "10"
 * formatNumber(10.00) => "10"
 * formatNumber(0.25) => "0.25"
 * formatNumber(0.25000000) => "0.25"
 * formatNumber(0.28833333) => "0.28833333"
 * formatNumber(1.23456789) => "1.23456789"
 * formatNumber(1.234567890) => "1.23456789"
 */
function formatNumber(n, maxDecimals = 8) {
  // Convert to number
  const num = Number(n);
  
  // Handle special cases
  if (isNaN(num)) return '0';
  if (!isFinite(num)) return num.toString();
  
  // If it's an integer, return as-is
  if (Number.isInteger(num)) {
    return num.toString();
  }
  
  // Format with max decimals
  let formatted = num.toFixed(maxDecimals);
  
  // Remove trailing zeros after decimal point
  // Pattern: (\.[0-9]*?) captures decimal point and digits (non-greedy)
  // 0+ matches one or more trailing zeros
  formatted = formatted.replace(/(\.[0-9]*?)0+$/, '$1');
  
  // Remove decimal point if no decimals left
  formatted = formatted.replace(/\.$/, '');
  
  return formatted;
}

/**
 * Format currency with peso sign
 * @param {number} n - The number to format
 * @returns {string} - Formatted currency (e.g., "₱10000" or "₱10000.5")
 */
function formatCurrency(n) {
  return `₱${formatNumber(n)}`;
}

/**
 * Format decimal (alias for formatNumber for clarity)
 * @param {number} n - The number to format
 * @returns {string} - Formatted decimal
 */
function formatDecimal(n) {
  return formatNumber(n);
}

/**
 * Format percentage (converts decimal to percentage)
 * @param {number} n - The decimal to convert (e.g., 0.08)
 * @param {boolean} includeSymbol - Whether to include % symbol (default: true)
 * @returns {string} - Formatted percentage (e.g., "8%" or "8")
 */
function formatPercentage(n, includeSymbol = true) {
  const percentage = formatNumber(n * 100);
  return includeSymbol ? `${percentage}%` : percentage;
}

/**
 * Format time with years label
 * @param {number} n - The time value
 * @returns {string} - Formatted time (e.g., "10 years" or "10.5 years")
 */
function formatTime(n) {
  return `${formatNumber(n)} years`;
}

/**
 * Format based on variable type
 * @param {string} varType - Type of variable ('currency', 'rate', 'time', etc.)
 * @param {number} value - The value to format
 * @returns {string} - Formatted value
 */
function formatByType(varType, value) {
  switch(varType) {
    case 'currency':
      return formatCurrency(value);
    case 'rate':
      return formatDecimal(value);
    case 'time':
      return formatTime(value);
    case 'percentage':
      return formatPercentage(value);
    default:
      return formatNumber(value);
  }
}

// ========== EXPORT FOR USE IN OTHER FILES ==========
// If using ES6 modules:
// export { formatNumber, formatCurrency, formatDecimal, formatPercentage, formatTime, formatByType };

// For browser/global scope (current setup):
if (typeof window !== 'undefined') {
  window.BizmathFormatter = {
    formatNumber,
    formatCurrency,
    formatDecimal,
    formatPercentage,
    formatTime,
    formatByType
  };
}
