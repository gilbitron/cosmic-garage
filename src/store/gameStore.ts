import { create } from 'zustand';
import {
  GameState, Generator, Upgrade, Resources, Cost, ResourceKey,
  PrestigeUpgradeDef,
} from '../types/gameTypes';

// ── Generator Definitions ──────────────────────────────────────────────

const initialGenerators: Generator[] = [
  // Tier 1
  { id: 'junior-mechanic', name: 'Junior Mechanic', description: 'Repairs basic lunar rovers', tier: 1, resourceType: 'credits', baseProduction: 0.5, owned: 0, cost: { credits: 10 } },
  { id: 'manual-crusher', name: 'Manual Crusher', description: 'Crushes junk shuttles into scrap', tier: 1, resourceType: 'scrap', baseProduction: 0.3, owned: 0, cost: { credits: 15 } },
  { id: 'solar-panel', name: 'Solar Panel', description: 'Harvests starlight for energy', tier: 1, resourceType: 'energy', baseProduction: 0.4, owned: 0, cost: { credits: 20 } },
  { id: 'intern', name: 'Intern', description: 'Eager alien intern doing research', tier: 1, resourceType: 'research', baseProduction: 0.2, owned: 0, cost: { credits: 25 } },
  // Tier 2
  { id: 'senior-mechanic', name: 'Senior Mechanic', description: 'Expert interstellar vehicle repair', tier: 2, resourceType: 'credits', baseProduction: 2.5, owned: 0, cost: { scrap: 50, energy: 30 } },
  { id: 'hydraulic-crusher', name: 'Hydraulic Crusher', description: 'Industrial-grade scrap processing', tier: 2, resourceType: 'scrap', baseProduction: 1.8, owned: 0, cost: { scrap: 75, energy: 40 } },
  { id: 'fusion-reactor', name: 'Fusion Reactor', description: 'Compact star-powered generator', tier: 2, resourceType: 'energy', baseProduction: 2.2, owned: 0, cost: { credits: 100, scrap: 50 } },
  { id: 'scientist', name: 'Scientist', description: 'Xeno-tech research specialist', tier: 2, resourceType: 'research', baseProduction: 1.5, owned: 0, cost: { credits: 150, scrap: 60 } },
  // Tier 3
  { id: 'repair-bot-swarm', name: 'Repair Bot Swarm', description: 'Autonomous nano-bot repair fleet', tier: 3, resourceType: 'credits', baseProduction: 15, owned: 0, cost: { scrap: 200, energy: 100, research: 50 } },
  { id: 'matter-recycler', name: 'Matter Recycler', description: 'Molecular disassembly system', tier: 3, resourceType: 'scrap', baseProduction: 10, owned: 0, cost: { scrap: 300, energy: 150, research: 75 } },
  { id: 'zero-point-cell', name: 'Zero-Point Cell', description: 'Extracts energy from quantum vacuum', tier: 3, resourceType: 'energy', baseProduction: 18, owned: 0, cost: { credits: 400, scrap: 200, energy: 100 } },
  { id: 'ai-research-lab', name: 'AI Research Lab', description: 'Self-improving research intelligence', tier: 3, resourceType: 'research', baseProduction: 12, owned: 0, cost: { credits: 500, scrap: 250, research: 125 } },
];

// ── Upgrade Definitions ────────────────────────────────────────────────

const initialUpgrades: Upgrade[] = [
  { id: 'better-tools', name: 'Better Tools', description: '+25% credit production', owned: false, cost: { credits: 100 }, effect: { type: 'multiplier', target: 'credits', multiplier: 1.25 } },
  { id: 'compressed-storage', name: 'Compressed Storage', description: '+50% scrap production', owned: false, cost: { scrap: 150 }, effect: { type: 'multiplier', target: 'scrap', multiplier: 1.5 } },
  { id: 'efficient-cells', name: 'Efficient Cells', description: '+30% energy production', owned: false, cost: { energy: 200 }, effect: { type: 'multiplier', target: 'energy', multiplier: 1.3 } },
  { id: 'research-grants', name: 'Research Grants', description: '+40% research production', owned: false, cost: { credits: 300 }, effect: { type: 'multiplier', target: 'research', multiplier: 1.4 } },
  { id: 'powered-crushers', name: 'Powered Crushers', description: 'Energy-boosted crushers produce 2× scrap', owned: false, cost: { energy: 150 }, effect: { type: 'synergy', target: 'scrap', multiplier: 2 } },
  { id: 'automated-repairs', name: 'Automated Repairs', description: 'Scrap-fed auto-tools produce 3× credits', owned: false, cost: { scrap: 200 }, effect: { type: 'synergy', target: 'credits', multiplier: 3 } },
  { id: 'scientific-method', name: 'Scientific Method', description: 'Research +1% per Scientist owned', owned: false, cost: { research: 100, credits: 200 }, effect: { type: 'dynamic', dynamicId: 'scientific-method' } },
  { id: 'self-improvement', name: 'Self-Improvement', description: 'All production +1% per upgrade purchased', owned: false, cost: { credits: 400, scrap: 200, energy: 100 }, effect: { type: 'dynamic', dynamicId: 'self-improvement' } },
  { id: 'expanded-garage', name: 'Expanded Garage', description: 'Unlock Tier 2 generators', owned: false, cost: { credits: 500, scrap: 200 }, effect: { type: 'unlock', target: 'tier2' } },
  { id: 'orbital-platform', name: 'Orbital Platform', description: 'Unlock Tier 3 generators', owned: false, cost: { credits: 2000, scrap: 1000, energy: 500, research: 200 }, effect: { type: 'unlock', target: 'tier3' } },
];

// ── Prestige Upgrade Definitions ───────────────────────────────────────

export const PRESTIGE_UPGRADES: PrestigeUpgradeDef[] = [
  { id: 'famous-garage',       name: 'Famous Garage',       description: '+10% credits per level',       maxLevel: 10, baseCost: 2, costScale: 2 },
  { id: 'efficient-processes',  name: 'Efficient Processes',  description: '-5% generator costs per level', maxLevel: 5,  baseCost: 3, costScale: 2 },
  { id: 'quality-tools',       name: 'Quality Tools',       description: '+5% all production per level',  maxLevel: 10, baseCost: 2, costScale: 2 },
  { id: 'fast-learners',       name: 'Fast Learners',       description: '+3% research per level',       maxLevel: 10, baseCost: 2, costScale: 1.5 },
];

export const getPrestigeUpgradeCost = (def: PrestigeUpgradeDef, currentLevel: number): number =>
  Math.ceil(def.baseCost * Math.pow(def.costScale, currentLevel));

// ── Initial State ──────────────────────────────────────────────────────

const initialState: GameState = {
  resources: { credits: 0, scrap: 0, energy: 0, research: 0, reputation: 0 },
  generators: initialGenerators,
  upgrades: initialUpgrades,
  unlockedTiers: [1],
  productionMultipliers: {},
  prestigeUpgradeLevels: {},
  totalCreditsEarned: 0,
  totalClicks: 0,
  clickValue: 1,
  timePlayed: 0,
  lastTick: Date.now(),
  prestigeCount: 0,
};

// ── Helpers ────────────────────────────────────────────────────────────

const canAfford = (resources: Resources, cost: Cost): boolean =>
  (Object.entries(cost) as [ResourceKey, number | undefined][]).every(
    ([key, value]) => value === undefined || resources[key] >= value
  );

const deductResources = (resources: Resources, cost: Cost): Resources => {
  const next = { ...resources };
  (Object.entries(cost) as [ResourceKey, number | undefined][]).forEach(
    ([key, value]) => { if (value !== undefined) next[key] -= value; }
  );
  return next;
};

/** Reputation bonus: each ★ gives +10% to all production. */
export const getReputationBonus = (reputation: number): number =>
  1 + reputation * 0.1;

/** Prestige upgrade production multiplier for a given resource type. */
export const getPrestigeProductionMult = (
  resourceType: string,
  levels: Record<string, number>
): number => {
  let mult = 1;
  mult *= 1 + (levels['quality-tools'] || 0) * 0.05;
  if (resourceType === 'credits')  mult *= 1 + (levels['famous-garage'] || 0) * 0.10;
  if (resourceType === 'research') mult *= 1 + (levels['fast-learners'] || 0) * 0.03;
  return mult;
};

/** Cost discount from Efficient Processes prestige upgrade. */
export const getCostDiscount = (levels: Record<string, number>): number =>
  1 - (levels['efficient-processes'] || 0) * 0.05;

/** Apply cost discount to a Cost object. */
export const getEffectiveCost = (cost: Cost, levels: Record<string, number>): Cost => {
  const discount = getCostDiscount(levels);
  const effective: Cost = {};
  for (const [key, val] of Object.entries(cost) as [keyof Cost, number | undefined][]) {
    if (val !== undefined) effective[key] = Math.max(1, Math.ceil(val * discount));
  }
  return effective;
};

/** Dynamic synergy multiplier based on current game state. */
export const getDynamicMult = (
  resourceType: string,
  upgrades: Upgrade[],
  generators: Generator[]
): number => {
  let mult = 1;
  const owned = (id: string) => upgrades.find((u) => u.id === id)?.owned;

  // Scientific Method: research +1% per Scientist owned
  if (resourceType === 'research' && owned('scientific-method')) {
    const scientists = generators.find((g) => g.id === 'scientist')?.owned || 0;
    mult *= 1 + scientists * 0.01;
  }

  // Self-Improvement: all production +1% per upgrade purchased
  if (owned('self-improvement')) {
    const purchasedCount = upgrades.filter((u) => u.owned).length;
    mult *= 1 + purchasedCount * 0.01;
  }

  return mult;
};

/** Full production calc for a single generator. */
export const getGeneratorProduction = (
  generator: Generator,
  multipliers: Record<string, number>,
  reputation = 0,
  prestigeLevels: Record<string, number> = {},
  upgrades: Upgrade[] = [],
  generators: Generator[] = []
): { perUnit: number; total: number } => {
  const genMult = multipliers[generator.id] || 1;
  const resMult = multipliers[generator.resourceType] || 1;
  const repMult = getReputationBonus(reputation);
  const presMult = getPrestigeProductionMult(generator.resourceType, prestigeLevels);
  const dynMult = getDynamicMult(generator.resourceType, upgrades, generators);
  const perUnit = generator.baseProduction * genMult * resMult * repMult * presMult * dynMult;
  return { perUnit, total: perUnit * generator.owned };
};

// ── Store ──────────────────────────────────────────────────────────────

interface GameStore extends GameState {
  tick: () => void;
  manualRepair: () => void;
  purchaseGenerator: (generatorId: string) => boolean;
  purchaseUpgrade: (upgradeId: string) => boolean;
  purchasePrestigeUpgrade: (upgradeId: string) => boolean;
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
        const { total } = getGeneratorProduction(
          generator, state.productionMultipliers,
          state.resources.reputation, state.prestigeUpgradeLevels,
          state.upgrades, state.generators
        );
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
      resources: { ...state.resources, credits: state.resources.credits + state.clickValue },
      totalCreditsEarned: state.totalCreditsEarned + state.clickValue,
      totalClicks: state.totalClicks + 1,
    });
  },

  // ── Purchase Generator ─────────────────────────────────────────────
  purchaseGenerator: (generatorId: string) => {
    const state = get();
    const generator = state.generators.find((g) => g.id === generatorId);
    if (!generator) return false;

    const effectiveCost = getEffectiveCost(generator.cost, state.prestigeUpgradeLevels);
    if (!canAfford(state.resources, effectiveCost)) return false;

    const newResources = deductResources(state.resources, effectiveCost);
    const newGenerators = state.generators.map((g) => {
      if (g.id !== generatorId) return g;
      const newCost = { ...g.cost };
      (Object.keys(newCost) as (keyof Cost)[]).forEach((key) => {
        if (newCost[key] !== undefined) newCost[key] = Math.ceil(newCost[key]! * 1.15);
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

    if ((effect.type === 'multiplier' || effect.type === 'synergy') && effect.target && effect.multiplier) {
      newMultipliers[effect.target] = (newMultipliers[effect.target] || 1) * effect.multiplier;
    }
    if (effect.type === 'unlock' && effect.target) {
      const tierNum = effect.target === 'tier2' ? 2 : effect.target === 'tier3' ? 3 : null;
      if (tierNum && !newUnlockedTiers.includes(tierNum)) {
        newUnlockedTiers = [...newUnlockedTiers, tierNum];
      }
    }

    set({ resources: newResources, upgrades: newUpgrades, productionMultipliers: newMultipliers, unlockedTiers: newUnlockedTiers });
    return true;
  },

  // ── Purchase Prestige Upgrade ──────────────────────────────────────
  purchasePrestigeUpgrade: (upgradeId: string) => {
    const state = get();
    const def = PRESTIGE_UPGRADES.find((u) => u.id === upgradeId);
    if (!def) return false;

    const currentLevel = state.prestigeUpgradeLevels[upgradeId] || 0;
    if (currentLevel >= def.maxLevel) return false;

    const cost = getPrestigeUpgradeCost(def, currentLevel);
    if (state.resources.reputation < cost) return false;

    set({
      resources: { ...state.resources, reputation: state.resources.reputation - cost },
      prestigeUpgradeLevels: { ...state.prestigeUpgradeLevels, [upgradeId]: currentLevel + 1 },
    });
    return true;
  },

  // ── Prestige ───────────────────────────────────────────────────────
  prestige: () => {
    const state = get();
    const reputationGained = Math.floor(Math.sqrt(state.totalCreditsEarned / 1000));
    if (reputationGained === 0) return false;

    set({
      ...initialState,
      resources: { ...initialState.resources, reputation: state.resources.reputation + reputationGained },
      prestigeCount: state.prestigeCount + 1,
      prestigeUpgradeLevels: state.prestigeUpgradeLevels, // preserved!
      lastTick: Date.now(),
    });
    return true;
  },

  // ── Save / Load ───────────────────────────────────────────────────
  saveGame: () => {
    const state = get();
    localStorage.setItem('cosmic-garage-save', JSON.stringify({ state, timestamp: Date.now() }));
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

      // ── Migrate generators ──────────────────────────────────────
      const savedGenMap = new Map<string, Generator>(state.generators.map((g: Generator) => [g.id, g]));
      state.generators = initialGenerators.map((def: Generator) => {
        const s = savedGenMap.get(def.id);
        return s ? { ...def, owned: s.owned, cost: s.cost } : { ...def };
      });

      // ── Migrate upgrades ────────────────────────────────────────
      const savedUpgMap = new Map<string, Upgrade>(state.upgrades.map((u: Upgrade) => [u.id, u]));
      state.upgrades = initialUpgrades.map((def: Upgrade) => {
        const s = savedUpgMap.get(def.id);
        return s ? { ...def, owned: s.owned } : { ...def };
      });

      // ── Migrate unlockedTiers ───────────────────────────────────
      if (!state.unlockedTiers) {
        state.unlockedTiers = [1];
        state.upgrades.forEach((u: Upgrade) => {
          if (u.owned && u.effect.type === 'unlock') {
            if (u.effect.target === 'tier2' && !state.unlockedTiers.includes(2)) state.unlockedTiers.push(2);
            if (u.effect.target === 'tier3' && !state.unlockedTiers.includes(3)) state.unlockedTiers.push(3);
          }
        });
      }

      // ── Migrate scalar fields ──────────────────────────────────
      if (state.totalClicks === undefined) state.totalClicks = 0;
      if (state.clickValue === undefined) state.clickValue = 1;
      if (!state.prestigeUpgradeLevels) state.prestigeUpgradeLevels = {};

      // ── Offline Progress ───────────────────────────────────────
      const offlineSecs = Math.min((Date.now() - (timestamp || state.lastTick)) / 1000, 86400);

      if (offlineSecs > 60) {
        const newResources = { ...state.resources };
        let offlineCredits = 0;
        state.generators.forEach((g: Generator) => {
          if (g.owned > 0) {
            const { total } = getGeneratorProduction(g, state.productionMultipliers, state.resources.reputation, state.prestigeUpgradeLevels || {}, state.upgrades, state.generators);
            const produced = total * offlineSecs;
            newResources[g.resourceType] += produced;
            if (g.resourceType === 'credits') offlineCredits += produced;
          }
        });
        state.resources = newResources;
        state.totalCreditsEarned = (state.totalCreditsEarned || 0) + offlineCredits;
        state.timePlayed = (state.timePlayed || 0) + offlineSecs;
      }

      set({ ...state, lastTick: Date.now() });
      return true;
    } catch (error) {
      console.error('Failed to load save:', error);
      return false;
    }
  },

  canPrestige: (): boolean => get().getPrestigeGain() > 0,
  getPrestigeGain: (): number => Math.floor(Math.sqrt(get().totalCreditsEarned / 1000)),
}));
