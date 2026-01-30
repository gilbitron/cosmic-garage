// Game State Interfaces

export interface Resources {
  credits: number;
  scrap: number;
  energy: number;
  research: number;
  reputation: number;
}

export type ResourceKey = keyof Resources;

export interface Generator {
  id: string;
  name: string;
  description: string;
  tier: number;
  resourceType: ResourceKey;
  baseProduction: number;
  owned: number;
  cost: Cost;
}

export interface Cost {
  credits?: number;
  scrap?: number;
  energy?: number;
  research?: number;
  reputation?: number;
}

export interface Upgrade {
  id: string;
  name: string;
  description: string;
  owned: boolean;
  cost: Cost;
  effect: UpgradeEffect;
}

export interface UpgradeEffect {
  type: 'multiplier' | 'unlock' | 'synergy';
  target?: string;
  multiplier?: number;
}

export interface GameState {
  resources: Resources;
  generators: Generator[];
  upgrades: Upgrade[];
  unlockedTiers: number[];
  productionMultipliers: Record<string, number>;
  totalCreditsEarned: number;
  timePlayed: number;
  lastTick: number;
  prestigeCount: number;
}

export interface PrestigeReward {
  reputationGained: number;
  creditsEarned: number;
}
