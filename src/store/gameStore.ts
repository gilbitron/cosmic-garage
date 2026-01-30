import { create } from 'zustand';
import { GameState, Generator, Upgrade, Resources, Cost } from '../types/gameTypes';

// Initial game state
const initialGenerators: Generator[] = [
  {
    id: 'junior-mechanic',
    name: 'Junior Mechanic',
    description: 'Repairs basic vehicles',
    resourceType: 'credits',
    baseProduction: 0.5,
    owned: 0,
    cost: { credits: 10 }
  },
  {
    id: 'manual-crusher',
    name: 'Manual Crusher',
    description: 'Crushes junk into scrap',
    resourceType: 'scrap',
    baseProduction: 0.3,
    owned: 0,
    cost: { credits: 15 }
  },
  {
    id: 'solar-panel',
    name: 'Solar Panel',
    description: 'Generates clean energy',
    resourceType: 'energy',
    baseProduction: 0.4,
    owned: 0,
    cost: { credits: 20 }
  },
  {
    id: 'intern',
    name: 'Intern',
    description: 'Assists with research',
    resourceType: 'research',
    baseProduction: 0.2,
    owned: 0,
    cost: { credits: 25 }
  },
  {
    id: 'senior-mechanic',
    name: 'Senior Mechanic',
    description: 'Expert vehicle repair',
    resourceType: 'credits',
    baseProduction: 2.5,
    owned: 0,
    cost: { credits: 50, scrap: 30 }
  },
  {
    id: 'hydraulic-crusher',
    name: 'Hydraulic Crusher',
    description: 'Efficient scrap processing',
    resourceType: 'scrap',
    baseProduction: 1.8,
    owned: 0,
    cost: { credits: 75, scrap: 40 }
  },
  {
    id: 'fusion-reactor',
    name: 'Fusion Reactor',
    description: 'High energy output',
    resourceType: 'energy',
    baseProduction: 2.2,
    owned: 0,
    cost: { credits: 100, scrap: 50 }
  },
  {
    id: 'scientist',
    name: 'Scientist',
    description: 'Advanced research',
    resourceType: 'research',
    baseProduction: 1.5,
    owned: 0,
    cost: { credits: 150, scrap: 60 }
  }
];

const initialUpgrades: Upgrade[] = [
  {
    id: 'better-tools',
    name: 'Better Tools',
    description: '+25% mechanic production',
    owned: false,
    cost: { credits: 100 },
    effect: { type: 'multiplier', target: 'junior-mechanic', multiplier: 1.25 }
  },
  {
    id: 'compressed-storage',
    name: 'Compressed Storage',
    description: '+50% scrap capacity',
    owned: false,
    cost: { scrap: 150 },
    effect: { type: 'multiplier', target: 'scrap', multiplier: 1.5 }
  },
  {
    id: 'efficient-cells',
    name: 'Efficient Cells',
    description: '+30% energy production',
    owned: false,
    cost: { energy: 200 },
    effect: { type: 'multiplier', target: 'solar-panel', multiplier: 1.3 }
  },
  {
    id: 'research-grants',
    name: 'Research Grants',
    description: '+40% research production',
    owned: false,
    cost: { credits: 300 },
    effect: { type: 'multiplier', target: 'intern', multiplier: 1.4 }
  },
  {
    id: 'expanded-garage',
    name: 'Expanded Garage',
    description: 'Unlock Tier 2 generators',
    owned: false,
    cost: { credits: 500, scrap: 200 },
    effect: { type: 'unlock', target: 'tier2' }
  }
];

const initialState: GameState = {
  resources: {
    credits: 0,
    scrap: 0,
    energy: 0,
    research: 0,
    reputation: 0
  },
  generators: initialGenerators,
  upgrades: initialUpgrades,
  productionMultipliers: {},
  totalCreditsEarned: 0,
  timePlayed: 0,
  lastTick: Date.now(),
  prestigeCount: 0
};

// Helper: Check if we can afford something
const canAfford = (resources: Resources, cost: Resources): boolean => {
  return Object.entries(cost).every(([key, value]) => {
    if (value === undefined) return true;
    return resources[key as keyof Resources] >= value;
  });
};

// Helper: Deduct resources
const deductResources = (resources: Resources, cost: Resources): Resources => {
  const newResources = { ...resources };
  Object.entries(cost).forEach(([key, value]) => {
    if (value !== undefined) {
      newResources[key as keyof Resources] -= value;
    }
  });
  return newResources;
};

export const useGameStore = create<GameStore>((set, get) => ({
  ...initialState,

  // Game tick - updates resources based on production
  tick: () => {
    const state = get();
    const now = Date.now();
    const deltaTime = (now - state.lastTick) / 1000; // Convert to seconds

    if (deltaTime <= 0) return;

    // Calculate production for each resource
    const newResources = { ...state.resources };
    let newTotalCredits = state.totalCreditsEarned;

    state.generators.forEach(generator => {
      if (generator.owned > 0) {
        const multiplier = state.productionMultipliers[generator.id] || 1;
        const production = generator.owned * generator.baseProduction * multiplier;
        newResources[generator.resourceType] += production * deltaTime;
      }
    });

    // Track total credits earned for prestige calculation
    if (newResources.credits > state.resources.credits) {
      newTotalCredits = state.totalCreditsEarned + 
        Math.floor(newResources.credits - state.resources.credits);
    }

    set({
      resources: newResources,
      totalCreditsEarned: newTotalCredits,
      timePlayed: state.timePlayed + deltaTime,
      lastTick: now
    });
  },

  // Purchase a generator
  purchaseGenerator: (generatorId: string) => {
    const state = get();
    const generator = state.generators.find(g => g.id === generatorId);
    
    if (!generator) return false;
    if (!canAfford(state.resources, generator.cost)) return false;

    const newResources = deductResources(state.resources, generator.cost);
    const newGenerators = state.generators.map(g => {
      if (g.id === generatorId) {
        // Increase cost for next purchase (15% increase)
        const newCost = { ...g.cost };
        Object.keys(newCost).forEach(key => {
          if (newCost[key as keyof Cost]) {
            newCost[key as keyof Cost] = Math.floor(newCost[key as keyof Cost]! * 1.15);
          }
        });
        
        return {
          ...g,
          owned: g.owned + 1,
          cost: newCost
        };
      }
      return g;
    });

    set({ resources: newResources, generators: newGenerators });
    return true;
  },

  // Purchase an upgrade
  purchaseUpgrade: (upgradeId: string) => {
    const state = get();
    const upgrade = state.upgrades.find(u => u.id === upgradeId);
    
    if (!upgrade || upgrade.owned) return false;
    if (!canAfford(state.resources, upgrade.cost)) return false;

    const newResources = deductResources(state.resources, upgrade.cost);
    const newUpgrades = state.upgrades.map(u => 
      u.id === upgradeId ? { ...u, owned: true } : u
    );

    // Apply upgrade effect
    const newMultipliers = { ...state.productionMultipliers };
    if (upgrade.effect.type === 'multiplier' && upgrade.effect.target) {
      newMultipliers[upgrade.effect.target] = 
        (newMultipliers[upgrade.effect.target] || 1) * (upgrade.effect.multiplier || 1);
    }

    set({ 
      resources: newResources, 
      upgrades: newUpgrades,
      productionMultipliers: newMultipliers
    });
    
    return true;
  },

  // Prestige/Reset function
  prestige: () => {
    const state = get();
    const reputationGained = Math.floor(Math.sqrt(state.totalCreditsEarned / 1000));
    
    if (reputationGained === 0) return false;

    set({
      ...initialState,
      resources: {
        ...initialState.resources,
        reputation: state.resources.reputation + reputationGained
      },
      prestigeCount: state.prestigeCount + 1
    });

    return true;
  },

  // Save game to localStorage
  saveGame: () => {
    const state = get();
    const saveData = {
      state,
      timestamp: Date.now()
    };
    localStorage.setItem('cosmic-garage-save', JSON.stringify(saveData));
  },

  // Load game from localStorage
  loadGame: () => {
    const saved = localStorage.getItem('cosmic-garage-save');
    if (!saved) return false;

    try {
      const { state } = JSON.parse(saved);
      
      // Validate the loaded state has required structure
      if (!state || !state.resources || !state.generators || !state.upgrades) {
        console.warn('Invalid save data');
        return false;
      }

      set({ ...state, lastTick: Date.now() });
      return true;
    } catch (error) {
      console.error('Failed to load save:', error);
      return false;
    }
  },

  // Check if prestige is available
  canPrestige: (): boolean => {
    const state = get();
    return Math.floor(Math.sqrt(state.totalCreditsEarned / 1000)) > 0;
  },

  // Get prestige gain
  getPrestigeGain: (): number => {
    const state = get();
    return Math.floor(Math.sqrt(state.totalCreditsEarned / 1000));
  }
}));

// Type for the store methods
interface GameStore extends GameState {
  tick: () => void;
  purchaseGenerator: (generatorId: string) => boolean;
  purchaseUpgrade: (upgradeId: string) => boolean;
  prestige: () => boolean;
  saveGame: () => void;
  loadGame: () => boolean;
  canPrestige: () => boolean;
  getPrestigeGain: () => number;
}