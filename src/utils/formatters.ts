import { Cost, Generator } from '../types/gameTypes';

// ── Resource Icons ─────────────────────────────────────────────────────

const RESOURCE_ICON: Record<string, string> = {
  credits: '₡',
  scrap: '♻',
  energy: '⚡',
  research: '🔬',
  reputation: '★',
};

export function resourceIcon(key: string): string {
  return RESOURCE_ICON[key] ?? '';
}

// ── Number Formatting ──────────────────────────────────────────────────

export function formatNumber(num: number): string {
  if (num === 0) return '0';

  const abs = Math.abs(num);

  if (abs < 1000) return num.toFixed(1).replace(/\.0$/, '');
  if (abs < 1_000_000) return (num / 1_000).toFixed(2) + 'K';
  if (abs < 1_000_000_000) return (num / 1_000_000).toFixed(2) + 'M';
  if (abs < 1_000_000_000_000) return (num / 1_000_000_000).toFixed(2) + 'B';
  if (abs < 1_000_000_000_000_000)
    return (num / 1_000_000_000_000).toFixed(2) + 'T';

  return num.toExponential(2);
}

export function formatProduction(rate: number): string {
  if (rate === 0) return '0/s';
  return `${formatNumber(rate)}/s`;
}

export function formatCost(cost: Cost): string {
  return (Object.entries(cost) as [string, number | undefined][])
    .filter(([, v]) => v && v > 0)
    .map(([res, amount]) => `${resourceIcon(res)}${formatNumber(amount!)}`)
    .join(' + ');
}

// ── Time Formatting ────────────────────────────────────────────────────

export function formatTime(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);

  if (h > 0) return `${h}h ${m}m`;
  if (m > 0) return `${m}m ${s}s`;
  return `${s}s`;
}

// ── Production Calculation ─────────────────────────────────────────────

/**
 * Total production for a resource type across all generators.
 * Applies generator-specific, resource-type, and reputation multipliers.
 */
export function calculateProduction(
  generators: Generator[],
  resourceType: string,
  multipliers: Record<string, number>,
  reputation = 0
): number {
  const repMult = 1 + reputation * 0.1;
  return generators
    .filter((g) => g.resourceType === resourceType && g.owned > 0)
    .reduce((total, g) => {
      const genMult = multipliers[g.id] || 1;
      const resMult = multipliers[g.resourceType] || 1;
      return total + g.owned * g.baseProduction * genMult * resMult * repMult;
    }, 0);
}
