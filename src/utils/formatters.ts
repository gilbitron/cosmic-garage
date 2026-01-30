import { Cost, Generator, Upgrade } from '../types/gameTypes';

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
 * Applies generator-specific, resource-type, reputation, and prestige multipliers.
 */
export function calculateProduction(
  generators: Generator[],
  resourceType: string,
  multipliers: Record<string, number>,
  reputation = 0,
  prestigeLevels: Record<string, number> = {},
  upgrades: Upgrade[] = []
): number {
  const repMult = 1 + reputation * 0.1;

  let presMult = 1;
  presMult *= 1 + (prestigeLevels['quality-tools'] || 0) * 0.05;
  if (resourceType === 'credits') presMult *= 1 + (prestigeLevels['famous-garage'] || 0) * 0.10;
  if (resourceType === 'research') presMult *= 1 + (prestigeLevels['fast-learners'] || 0) * 0.03;

  // Dynamic synergy multipliers
  let dynMult = 1;
  const ownsUpgrade = (id: string) => upgrades.find((u) => u.id === id)?.owned;
  if (resourceType === 'research' && ownsUpgrade('scientific-method')) {
    const scientists = generators.find((g) => g.id === 'scientist')?.owned || 0;
    dynMult *= 1 + scientists * 0.01;
  }
  if (ownsUpgrade('self-improvement')) {
    dynMult *= 1 + upgrades.filter((u) => u.owned).length * 0.01;
  }

  return generators
    .filter((g) => g.resourceType === resourceType && g.owned > 0)
    .reduce((total, g) => {
      const genMult = multipliers[g.id] || 1;
      const resMult = multipliers[g.resourceType] || 1;
      return total + g.owned * g.baseProduction * genMult * resMult * repMult * presMult * dynMult;
    }, 0);
}
