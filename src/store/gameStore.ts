import { create } from 'zustand';
import { GameState, Generator, Upgrade, Resources, Cost, ResourceKey } from '../types/gameTypes';

// ── Generator Definitions ──────────────────────────────────────────────

const initialGenerators: Generator[] = [
  // Tier 1 — Starting Out
  {
    id: 'junior-mechanic',
    name: 'Junior Mechanic',
    description: 'Repairs basic lunar rovers',
    tier: 1,
    resourceType: 'credits',
    baseProduction: 0.5,
    owned: 0,
    cost: { credits: 10 },
  },
  {
    id: 'manual-crusher',
    name: 'Manual Crusher',
    description: 'Crushes junk shuttles into scrap',
    tier: 1,
    resourceType: 'scrap',
    baseProduction: 0.3,
    owned: 0,
    cost: { credits: 15 },
  },
  {
    id: 'solar-panel',
    name: 'Solar Panel',
    description: 'Harvests starlight for energy',
    tier: 1,
    resourceType: 'energy',
    baseProduction: 0.4,
    owned: 0,
    cost: { credits: 20 },
  },
  {
    id: 'intern',
    name: 'Intern',
    description: 'Eager alien intern doing research',
    tier: 1,
    resourceType: 'research',
    baseProduction: 0.2,
    owned: 0,
    cost: { credits: 25 },
  },

  // Tier 2 — Growing (costs match PLAN.md)
  {
    id: 'senior-mechanic',
    name: 'Senior Mechanic',
    description: 'Expert interstellar vehicle repair',
    tier: 2,
    resourceType: 'credits',
    baseProduction: 2.5,
    owned: 0,
    cost: { scrap: 50, energy: 30 },
  },
  {
    id: 'hydraulic-crusher',
    name: 'Hydraulic Crusher',
    description: 'Industrial-grade scrap processing',
    tier: 2,
    resourceType: 'scrap',
    baseProduction: 1.8,
    owned: 0,
    cost: { scrap: 75, energy: 40 },
  },
  {
    id: 'fusion-reactor',
    name: 'Fusion Reactor',
    description: 'Compact star-powered generator',
    tier: 2,
    resourceType: 'energy',
    baseProduction: 2.2,
    owned: 0,
    cost: { credits: 100, scrap: 50 },
  },
  {
    id: 'scientist',
    name: 'Scientist',
    description: 'Xeno-tech research specialist',
    tier: 2,
    resourceType: 'research',
    baseProduction: 1.5,
    owned: 0,
    cost: { credits: 150, scrap: 60 },
  },

  // Tier 3 — Expanding
  {
    id: 'repair-bot-swarm',
    name: 'Repair Bot Swarm',
    description: 'Autonomous nano-bot repair fleet',
    tier: 3,
    resourceType: 'credits',
    baseProduction: 15,
    owned: 0,
    cost: { scrap: 200, energy: 100, research: 50 },
  },
  {
    id: 'matter-recycler',
    name: 'Matter Recycler',
    description: 'Molecular disassembly system',
    tier: 3,
    resourceType: 'scrap',
    baseProduction: 10,
    owned: 0,
    cost: { scrap: 300, energy: 150, research: 75 },
  },
  {
    id: 'zero-point-cell',
    name: 'Zero-Point Cell',
    description: 'Extracts energy from quantum vacuum',
    tier: 3,
    resourceType: 'energy',
    baseProduction: 18,
    owned: 0,
    cost: { credits: 400, scrap: 200, energy: 100 },
  },
  {
    id: 'ai-research-lab',
    name: 'AI Research Lab',
    description: 'Self-improving research intelligence',
    tier: 3,
    resourceType: 'research',
    baseProduction: 12,
    owned: 0,
    cost: { credits: 500, scrap: 250, research: 125 },
  },
];

// ── Upgrade Definitions ────────────────────────────────────────────────

const initialUpgrades: Upgrade[] = [
  // Production Upgrades
  {
    id: 'better-tools',
    name: 'Better Tools',
    description: '+25% credit production',
    owned: false,
    cost: { credits: 100 },
    effect: { type: 'multiplier', target: 'credits', multiplier: 1.25 },
  },
  {
    id: 'compressed-storage',
    name: 'Compressed Storage',
    description: '+50% scrap production',
    owned: false,
    cost: { scrap: 150 },
    effect: { type: 'multiplier', target: 'scrap', multiplier: 1.5 },
  },
  {
    id: 'efficient-cells',
    name: 'Efficient Cells',
    description: '+30% energy production',
    owned: false,
    cost: { energy: 200 },
    effect: { type: 'multiplier', target: 'energy', multiplier: 1.3 },
  },
  {
    id: 'research-grants',
    name: 'Research Grants',
    description: '+40% research production',
    owned: false,
    cost: { credits: 300 },
    effect: { type: 'multiplier', target: 'research', multiplier: 1.4 },
  },

  // Synergy Upgrades
  {
    id: 'powered-crushers',
    name: 'Powered Crushers',
    description: 'Energy-boosted crushers produce 2× scrap',
    owned: false,
    cost: { energy: 150 },
    effect: { type: 'synergy', target: 'scrap', multiplier: 2 },
  },
  {
    id: 'automated-repairs',
    name: 'Automated Repairs',
    description: 'Scrap-fed auto-tools produce 3× credits',
    owned: false,
    cost: { scrap: 200 },
    effect: { type: 'synergy', target: 'credits', multiplier: 3 },
  },

  // Unlock Upgrades
  {
    id: 'expanded-garage',
    name: 'Expanded Garage',
    description: 'Unlock Tier 2 generators',
    owned: false,
    cost: { credits: 500, scrap: 200 },
    effect: { type: 'unlock', target: 'tier2' },
  },
  {
    id: 'orbital-platform',
    name: 'Orbital Platform',
    description: 'Unlock Tier 3 generators',
    owned: false,
    cost: { credits: 2000, scrap: 1000, energy: 500, research: 200 },
    effect: { type: 'unlock', target: 'tier3' },
  },
];

// ── Initial State ──────────────────────────────────────────────────────

const initialState: GameState = {
  resources: {
    credits: 0,
    scrap: 0,
    energy: 0,
    research: 0,
    reputation: 0,
  },
  generators: initialGenerators,
  upgrades: initialUpgrades,
  unlockedTiers: [1],
  productionMultipliers: {},
  totalCreditsEarned: 0,
  totalClicks: 0,
  clickValue: 1,
  timePlayed: 0,
  lastTick: Date.now(),
  prestigeCount: 0,
};

// ── Helpers ────────────────────────────────────────────────────────────

const canAfford = (resources: Resources, cost: Cost): boolean => {
  return (Object.entries(cost) as [ResourceKey, number | undefined][]).every(
    ([key, value]) => {
      if (value === undefined) return true;
      return resources[key] >= value;
    }
  );
};

const deductResources = (resources: Resources, cost: Cost): Resources => {
  const next = { ...resources };
  (Object.entries(cost) as [ResourceKey, number | undefined][]).forEach(
    ([key, value]) => {
      if (value !== undefined) next[key] -= value;
    }
  );
  return next;
};

/**
 * Reputation bonus: each ★ gives +10% to all production.
 */
export const getReputationBonus = (reputation: number): number =>
  1 + reputation * 0.1;

/**
 * Calculate total production for a single generator, applying both
 * generator-specific and resource-type multipliers plus reputation bonus.
 */
export const getGeneratorProduction = (
  generator: Generator,
  multipliers: Record<string, number>,
  reputation = 0
): { perUnit: number; total: number } => {
  const genMult = multipliers[generator.id] || 1;
  const resMult = multipliers[generator.resourceType] || 1;
  const repMult = getReputationBonus(reputation);
  const perUnit = generator.baseProduction * genMult * resMult * repMult;
  return { perUnit, total: perUnit * generator.owned };
};

// ── Store ──────────────────────────────────────────────────────────────

interface GameStore extends GameState {
  tick: () => void;
  manualRepair: () => void;
  purchaseGenerator: (generatorId: string) => boolean;
  purchaseUpgrade: (upgradeId: string) => boolean;
  prestige: () => boolean;
  saveGame: () => void;
  loadGame: () => boolean;
  canPrestige: () => boolean;
  getPrestigeGain: () => number;
}

export const useGameStore = create<GameStore>((set, get) => ({
  ...initialState,

  // ── Game Tick ──────────────────────────────────────────────────────
  tick: () => {
    const state = get();
    const now = Date.now();
    const deltaTime = (now - state.lastTick) / 1000;
    if (deltaTime <= 0) return;

    const newResources = { ...state.resources };
    let creditsProduced = 0;

    state.generators.forEach((generator) => {
      if (generator.owned > 0) {
        const { total } = getGeneratorProduction(generator, state.productionMultipliers, state.resources.reputation);
        const produced = total * deltaTime;
        newResources[generator.resourceType] += produced;
        if (generator.resourceType === 'credits') creditsProduced += produced;
      }
    });

    set({
      resources: newResources,
      totalCreditsEarned: state.totalCreditsEarned + creditsProduced,
      timePlayed: state.timePlayed + deltaTime,
      lastTick: now,
    });
  },

  // ── Manual Repair (click) ───────────────────────────────────────────
  manualRepair: () => {
    const state = get();
    set({
      resources: {
        ...state.resources,
        credits: state.resources.credits + state.clickValue,
      },
      totalCreditsEarned: state.totalCreditsEarned + state.clickValue,
      totalClicks: state.totalClicks + 1,
    });
  },

  // ── Purchase Generator ─────────────────────────────────────────────
  purchaseGenerator: (generatorId: string) => {
    const state = get();
    const generator = state.generators.find((g) => g.id === generatorId);
    if (!generator) return false;
    if (!canAfford(state.resources, generator.cost)) return false;

    const newResources = deductResources(state.resources, generator.cost);
    const newGenerators = state.generators.map((g) => {
      if (g.id !== generatorId) return g;
      // Scale cost by 15% per purchase
      const newCost = { ...g.cost };
      (Object.keys(newCost) as (keyof Cost)[]).forEach((key) => {
        if (newCost[key] !== undefined) {
          newCost[key] = Math.ceil(newCost[key]! * 1.15);
        }
      });
      return { ...g, owned: g.owned + 1, cost: newCost };
    });

    set({ resources: newResources, generators: newGenerators });
    return true;
  },

  // ── Purchase Upgrade ───────────────────────────────────────────────
  purchaseUpgrade: (upgradeId: string) => {
    const state = get();
    const upgrade = state.upgrades.find((u) => u.id === upgradeId);
    if (!upgrade || upgrade.owned) return false;
    if (!canAfford(state.resources, upgrade.cost)) return false;

    const newResources = deductResources(state.resources, upgrade.cost);
    const newUpgrades = state.upgrades.map((u) =>
      u.id === upgradeId ? { ...u, owned: true } : u
    );

    const newMultipliers = { ...state.productionMultipliers };
    let newUnlockedTiers = state.unlockedTiers;

    const { effect } = upgrade;

    if (
      (effect.type === 'multiplier' || effect.type === 'synergy') &&
      effect.target &&
      effect.multiplier
    ) {
      // Multipliers stack multiplicatively
      newMultipliers[effect.target] =
        (newMultipliers[effect.target] || 1) * effect.multiplier;
    }

    if (effect.type === 'unlock' && effect.target) {
      const tierNum =
        effect.target === 'tier2' ? 2 : effect.target === 'tier3' ? 3 : null;
      if (tierNum && !newUnlockedTiers.includes(tierNum)) {
        newUnlockedTiers = [...newUnlockedTiers, tierNum];
      }
    }

    set({
      resources: newResources,
      upgrades: newUpgrades,
      productionMultipliers: newMultipliers,
      unlockedTiers: newUnlockedTiers,
    });
    return true;
  },

  // ── Prestige ───────────────────────────────────────────────────────
  prestige: () => {
    const state = get();
    const reputationGained = Math.floor(
      Math.sqrt(state.totalCreditsEarned / 1000)
    );
    if (reputationGained === 0) return false;

    set({
      ...initialState,
      resources: {
        ...initialState.resources,
        reputation: state.resources.reputation + reputationGained,
      },
      prestigeCount: state.prestigeCount + 1,
      lastTick: Date.now(),
    });
    return true;
  },

  // ── Save / Load ───────────────────────────────────────────────────
  saveGame: () => {
    const state = get();
    localStorage.setItem(
      'cosmic-garage-save',
      JSON.stringify({ state, timestamp: Date.now() })
    );
  },

  loadGame: () => {
    const saved = localStorage.getItem('cosmic-garage-save');
    if (!saved) return false;

    try {
      const { state, timestamp } = JSON.parse(saved);
      if (!state?.resources || !state?.generators || !state?.upgrades) {
        console.warn('Invalid save data');
        return false;
      }

      // ── Migrate generators ───────────────────────────────────────
      // Merge saved generators with initial definitions so new fields
      // (like `tier`) and new generators (tier 3) are always present.
      const savedGenMap = new Map<string, Generator>(
        state.generators.map((g: Generator) => [g.id, g])
      );
      state.generators = initialGenerators.map((def: Generator) => {
        const saved = savedGenMap.get(def.id);
        if (!saved) return { ...def };
        return { ...def, owned: saved.owned, cost: saved.cost };
      });

      // ── Migrate upgrades ────────────────────────────────────────
      const savedUpgMap = new Map<string, Upgrade>(
        state.upgrades.map((u: Upgrade) => [u.id, u])
      );
      state.upgrades = initialUpgrades.map((def: Upgrade) => {
        const saved = savedUpgMap.get(def.id);
        if (!saved) return { ...def };
        return { ...def, owned: saved.owned };
      });

      // ── Migrate unlockedTiers ───────────────────────────────────
      if (!state.unlockedTiers) {
        state.unlockedTiers = [1];
        state.upgrades.forEach((u: Upgrade) => {
          if (u.owned && u.effect.type === 'unlock') {
            if (u.effect.target === 'tier2' && !state.unlockedTiers.includes(2))
              state.unlockedTiers.push(2);
            if (u.effect.target === 'tier3' && !state.unlockedTiers.includes(3))
              state.unlockedTiers.push(3);
          }
        });
      }

      // ── Migrate new scalar fields ──────────────────────────────
      if (state.totalClicks === undefined) state.totalClicks = 0;
      if (state.clickValue === undefined) state.clickValue = 1;

      // ── Offline Progress ──────────────────────────────────────────
      const offlineSecs = Math.min(
        (Date.now() - (timestamp || state.lastTick)) / 1000,
        86400 // cap at 24 hours
      );

      if (offlineSecs > 60) {
        const newResources = { ...state.resources };
        let offlineCredits = 0;

        state.generators.forEach((g: Generator) => {
          if (g.owned > 0) {
            const { total } = getGeneratorProduction(
              g,
              state.productionMultipliers,
              state.resources.reputation
            );
            const produced = total * offlineSecs;
            newResources[g.resourceType] += produced;
            if (g.resourceType === 'credits') offlineCredits += produced;
          }
        });

        state.resources = newResources;
        state.totalCreditsEarned =
          (state.totalCreditsEarned || 0) + offlineCredits;
        state.timePlayed = (state.timePlayed || 0) + offlineSecs;
      }

      set({ ...state, lastTick: Date.now() });
      return true;
    } catch (error) {
      console.error('Failed to load save:', error);
      return false;
    }
  },

  canPrestige: (): boolean => {
    return get().getPrestigeGain() > 0;
  },

  getPrestigeGain: (): number => {
    return Math.floor(Math.sqrt(get().totalCreditsEarned / 1000));
  },
}));
