/**
 * Format numbers for display in the game
 * Uses scientific notation for very large numbers
 */
export function formatNumber(num: number): string {
  if (num === 0) return '0';
  
  const absNum = Math.abs(num);
  
  // For numbers less than 1000, show with appropriate decimal places
  if (absNum < 1000) {
    return num.toFixed(1).replace(/\.0$/, '');
  }
  
  // For numbers between 1000 and 1 million
  if (absNum < 1_000_000) {
    return (num / 1000).toFixed(2) + 'K';
  }
  
  // For numbers between 1 million and 1 billion
  if (absNum < 1_000_000_000) {
    return (num / 1_000_000).toFixed(2) + 'M';
  }
  
  // For numbers between 1 billion and 1 trillion
  if (absNum < 1_000_000_000_000) {
    return (num / 1_000_000_000).toFixed(2) + 'B';
  }
  
  // For numbers between 1 trillion and 1 quadrillion
  if (absNum < 1_000_000_000_000_000) {
    return (num / 1_000_000_000_000).toFixed(2) + 'T';
  }
  
  // For very large numbers, use scientific notation
  return num.toExponential(2);
}

/**
 * Format production rates (per second)
 */
export function formatProduction(rate: number): string {
  if (rate === 0) return '0/sec';
  return `${formatNumber(rate)}/sec`;
}

/**
 * Format costs for display
 */
export function formatCost(cost: Record<string, number>): string {
  const parts: string[] = [];
  
  Object.entries(cost).forEach(([resource, amount]) => {
    if (amount && amount > 0) {
      parts.push(`${formatNumber(amount)} ${resource}`);
    }
  });
  
  return parts.join(' + ');
}

/**
 * Calculate total production for a specific resource type
 */
export function calculateProduction(
  generators: any[], 
  resourceType: string, 
  multipliers: Record<string, number>
): number {
  return generators
    .filter(g => g.resourceType === resourceType && g.owned > 0)
    .reduce((total, g) => {
      const multiplier = multipliers[g.id] || 1;
      return total + (g.owned * g.baseProduction * multiplier);
    }, 0);
}