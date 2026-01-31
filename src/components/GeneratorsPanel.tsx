import { useState, useCallback } from 'react';
import { useGameStore, getGeneratorProduction, getEffectiveCost } from '../store/gameStore';
import { formatCost, formatProduction } from '../utils/formatters';
import { Cost, Generator, Resources } from '../types/gameTypes';
import { RESOURCE_META } from '../utils/resources';
import { ManualRepair } from './ManualRepair';
import { ResourceFlow } from './ResourceFlow';

// ── Generator Card ─────────────────────────────────────────────────────

interface GeneratorCardProps {
  generator: Generator;
  multipliers: Record<string, number>;
  reputation: number;
  prestigeLevels: Record<string, number>;
  upgrades: import('../types/gameTypes').Upgrade[];
  generators: Generator[];
  canAfford: boolean;
  onPurchase: () => void;
}

const GeneratorCard = ({
  generator, multipliers, reputation, prestigeLevels, upgrades, generators, canAfford, onPurchase,
}: GeneratorCardProps) => {
  const { perUnit, total } = getGeneratorProduction(generator, multipliers, reputation, prestigeLevels, upgrades, generators);
  const res = RESOURCE_META[generator.resourceType];
  const effectiveCost = getEffectiveCost(generator.cost, prestigeLevels);
  const [flash, setFlash] = useState(false);

  const handlePurchase = useCallback(() => {
    onPurchase();
    setFlash(true);
    setTimeout(() => setFlash(false), 350);
  }, [onPurchase]);

  return (
    <div className={`rounded-lg p-4 transition-colors bg-gray-700 hover:bg-gray-600 ${flash ? 'animate-purchase' : ''}`}>
      <div className="flex justify-between items-start mb-2">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-lg">{generator.name}</h3>
            <span
              className={`text-xs font-medium px-2 py-0.5 rounded-full ${res.color} ${res.bgColor}`}
              title={`Produces ${res.label.toLowerCase()}`}
            >
              {res.icon} {res.label}
            </span>
          </div>
          <p className="text-sm text-gray-400">{generator.description}</p>
        </div>
        <div className="text-right ml-3 shrink-0">
          <div className="text-lg font-bold text-blue-400">{generator.owned}</div>
          <div className="text-xs text-gray-500">owned</div>
        </div>
      </div>

      <div className="space-y-1 mb-3">
        <div className="text-sm">
          <span className="text-gray-400">Per unit: </span>
          <span className={res.color}>{formatProduction(perUnit)}</span>
        </div>
        {generator.owned > 0 && (
          <div className="text-sm">
            <span className="text-gray-400">Total: </span>
            <span className={res.color}>{formatProduction(total)}</span>
          </div>
        )}
      </div>

      <button
        onClick={handlePurchase}
        disabled={!canAfford}
        className={`w-full py-2 px-4 rounded font-medium transition-all active:scale-95 ${
          canAfford
            ? 'bg-blue-600 hover:bg-blue-700 text-white'
            : 'bg-gray-600 text-gray-400 cursor-not-allowed'
        }`}
      >
        Buy {generator.name}
        <div className="text-xs mt-1">{formatCost(effectiveCost)}</div>
      </button>
    </div>
  );
};

// ── Tier Labels ────────────────────────────────────────────────────────

const TIER_LABELS: Record<number, { title: string; color: string }> = {
  1: { title: '🔧 Basic Garage', color: 'text-gray-300' },
  2: { title: '🏗️ Expanded Garage', color: 'text-blue-300' },
  3: { title: '🛸 Orbital Platform', color: 'text-purple-300' },
  4: { title: '☀️ Dyson Sphere Array', color: 'text-amber-300' },
};

// ── Panel ──────────────────────────────────────────────────────────────

export const GeneratorsPanel = () => {
  const { generators, resources, purchaseGenerator, productionMultipliers, unlockedTiers, reputation, prestigeLevels, upgrades } =
    useGameStore((state) => ({
      generators: state.generators,
      resources: state.resources,
      purchaseGenerator: state.purchaseGenerator,
      productionMultipliers: state.productionMultipliers,
      unlockedTiers: state.unlockedTiers,
      reputation: state.resources.reputation,
      prestigeLevels: state.prestigeUpgradeLevels,
      upgrades: state.upgrades,
    }));

  const canAffordCost = (cost: Cost): boolean => {
    const effective = getEffectiveCost(cost, prestigeLevels);
    return (Object.entries(effective) as [keyof Resources, number | undefined][]).every(
      ([key, value]) => !value || resources[key] >= value
    );
  };

  const tiers = [1, 2, 3, 4].filter((t) => unlockedTiers.includes(t));

  return (
    <div>
      <ManualRepair />

      <div className="bg-gray-800 rounded-lg p-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-blue-400">Generators</h2>
          <span className="text-xs text-gray-500" title="Generators automatically produce resources every second. Each purchase increases the cost by 15%.">
            ℹ️ Hover for help
          </span>
        </div>

        <div className="space-y-6">
          {tiers.map((tier) => {
            const tierGens = generators.filter((g) => g.tier === tier);
            const label = TIER_LABELS[tier];
            return (
              <div key={tier}>
                <h3 className={`text-lg font-semibold mb-1 ${label.color}`}>
                  {label.title}
                </h3>
                <ResourceFlow
                  tierGens={tierGens}
                  multipliers={productionMultipliers}
                  reputation={reputation}
                  prestigeLevels={prestigeLevels}
                  upgrades={upgrades}
                  allGenerators={generators}
                />
                <div className="space-y-3">
                  {tierGens.map((generator) => (
                    <GeneratorCard
                      key={generator.id}
                      generator={generator}
                      multipliers={productionMultipliers}
                      reputation={reputation}
                      prestigeLevels={prestigeLevels}
                      upgrades={upgrades}
                      generators={generators}
                      canAfford={canAffordCost(generator.cost)}
                      onPurchase={() => purchaseGenerator(generator.id)}
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
