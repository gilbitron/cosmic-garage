import { useGameStore, getGeneratorProduction } from '../store/gameStore';
import { formatCost, formatProduction } from '../utils/formatters';
import { Cost, Generator, Resources } from '../types/gameTypes';
import { ManualRepair } from './ManualRepair';

// ── Generator Card ─────────────────────────────────────────────────────

interface GeneratorCardProps {
  generator: Generator;
  multipliers: Record<string, number>;
  canAfford: boolean;
  onPurchase: () => void;
}

const GeneratorCard = ({
  generator,
  multipliers,
  canAfford,
  onPurchase,
}: GeneratorCardProps) => {
  const { perUnit, total } = getGeneratorProduction(generator, multipliers);

  return (
    <div className="bg-gray-700 rounded-lg p-4 hover:bg-gray-650 transition-colors">
      <div className="flex justify-between items-start mb-2">
        <div>
          <h3 className="font-semibold text-lg">{generator.name}</h3>
          <p className="text-sm text-gray-400">{generator.description}</p>
        </div>
        <div className="text-right">
          <div className="text-lg font-bold text-blue-400">{generator.owned}</div>
          <div className="text-xs text-gray-500">owned</div>
        </div>
      </div>

      <div className="space-y-1 mb-3">
        <div className="text-sm">
          <span className="text-gray-400">Per unit: </span>
          <span className="text-green-400">{formatProduction(perUnit)}</span>
        </div>
        {generator.owned > 0 && (
          <div className="text-sm">
            <span className="text-gray-400">Total: </span>
            <span className="text-green-400">{formatProduction(total)}</span>
          </div>
        )}
      </div>

      <button
        onClick={onPurchase}
        disabled={!canAfford}
        className={`w-full py-2 px-4 rounded font-medium transition-colors ${
          canAfford
            ? 'bg-blue-600 hover:bg-blue-700 text-white'
            : 'bg-gray-600 text-gray-400 cursor-not-allowed'
        }`}
      >
        Buy {generator.name}
        <div className="text-xs mt-1">{formatCost(generator.cost)}</div>
      </button>
    </div>
  );
};

// ── Tier Section ───────────────────────────────────────────────────────

const TIER_LABELS: Record<number, { title: string; color: string }> = {
  1: { title: '🔧 Basic Garage', color: 'text-gray-300' },
  2: { title: '🏗️ Expanded Garage', color: 'text-blue-300' },
  3: { title: '🛸 Orbital Platform', color: 'text-purple-300' },
};

// ── Panel ──────────────────────────────────────────────────────────────

export const GeneratorsPanel = () => {
  const { generators, resources, purchaseGenerator, productionMultipliers, unlockedTiers } =
    useGameStore((state) => ({
      generators: state.generators,
      resources: state.resources,
      purchaseGenerator: state.purchaseGenerator,
      productionMultipliers: state.productionMultipliers,
      unlockedTiers: state.unlockedTiers,
    }));

  const canAffordCost = (cost: Cost): boolean =>
    (Object.entries(cost) as [keyof Resources, number | undefined][]).every(
      ([key, value]) => !value || resources[key] >= value
    );

  // Group generators by tier, only show unlocked tiers
  const tiers = [1, 2, 3].filter((t) => unlockedTiers.includes(t));

  return (
    <div>
      <ManualRepair />

      <div className="bg-gray-800 rounded-lg p-4">
        <h2 className="text-xl font-bold mb-4 text-blue-400">Generators</h2>

        <div className="space-y-6">
        {tiers.map((tier) => {
          const tierGens = generators.filter((g) => g.tier === tier);
          const label = TIER_LABELS[tier];
          return (
            <div key={tier}>
              <h3 className={`text-lg font-semibold mb-3 ${label.color}`}>
                {label.title}
              </h3>
              <div className="space-y-3">
                {tierGens.map((generator) => (
                  <GeneratorCard
                    key={generator.id}
                    generator={generator}
                    multipliers={productionMultipliers}
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
