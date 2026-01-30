// Game State Interfaces

export interface Resources {
  credits: number;
  scrap: number;
  energy: number;
  research: number;
  reputation: number;
}

export interface Generator {
  id: string;
  name: string;
  description: string;
  resourceType: keyof Resources;
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
  condition?: string;
}

export interface GameState {
  resources: Resources;
  generators: Generator[];
  upgrades: Upgrade[];
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