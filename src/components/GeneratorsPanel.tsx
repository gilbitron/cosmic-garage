import { useGameStore } from '../store/gameStore';
import { formatNumber, formatCost, formatProduction, calculateProduction } from '../utils/formatters';
import { Cost, Resources } from '../types/gameTypes';

interface GeneratorCardProps {
  generator: any;
  canAfford: boolean;
  onPurchase: () => void;
  production: number;
}

const GeneratorCard = ({ generator, canAfford, onPurchase, production }: GeneratorCardProps) => {
  return (
    <div className="bg-gray-700 rounded-lg p-4 hover:bg-gray-600 transition-colors">
      <div className="flex justify-between items-start mb-2">
        <div>
          <h3 className="font-semibold text-lg">{generator.name}</h3>
          <p className="text-sm text-gray-400">{generator.description}</p>
        </div>
        <div className="text-right">
          <div className="text-lg font-bold text-blue-400">
            {generator.owned}
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <div className="text-sm">
          <span className="text-gray-400">Production: </span>
          <span className={production > 0 ? 'text-green-400' : 'text-gray-500'}>
            {formatProduction(production)}
          </span>
        </div>

        {generator.owned > 0 && (
          <div className="text-sm">
            <span className="text-gray-400">Total: </span>
            <span className="text-green-400">
              {formatNumber(production * generator.owned)}/sec
            </span>
          </div>
        )}

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
    </div>
  );
};

export const GeneratorsPanel = () => {
  const { generators, resources, purchaseGenerator, productionMultipliers } = useGameStore(
    state => ({
      generators: state.generators,
      resources: state.resources,
      purchaseGenerator: state.purchaseGenerator,
      productionMultipliers: state.productionMultipliers
    })
  );

  // Group generators by tier for display
  const tier1Generators = generators.filter(g => g.cost.credits !== undefined && !g.cost.scrap);
  const tier2Generators = generators.filter(g => g.cost.scrap !== undefined && g.cost.scrap > 50);
  // Future: tier3, etc.

  const canAfford = (cost: Cost): boolean => {
    return Object.entries(cost).every(([key, value]) => {
      if (value === undefined || value === null) return true;
      const resourceValue = resources[key as keyof Resources];
      return resourceValue >= value;
    });
  };

  return (
    <div className="bg-gray-800 rounded-lg p-4">
      <h2 className="text-xl font-bold mb-4 text-blue-400">Generators</h2>
      
      <div className="space-y-6">
        {/* Tier 1 - Basic */}
        <div>
          <h3 className="text-lg font-semibold mb-3 text-gray-300">Basic Garage</h3>
          <div className="space-y-3">
            {tier1Generators.map(generator => {
              const production = calculateProduction(
                [generator], 
                generator.resourceType, 
                productionMultipliers
              );
              
              return (
                <GeneratorCard
                  key={generator.id}
                  generator={generator}
                  canAfford={canAfford(generator.cost)}
                  onPurchase={() => purchaseGenerator(generator.id)}
                  production={production}
                />
              );
            })}
          </div>
        </div>

        {/* Tier 2 - Expanded */}
        {generators.some(g => g.owned > 0 && g.id === 'senior-mechanic') && (
          <div>
            <h3 className="text-lg font-semibold mb-3 text-gray-300">Expanded Garage</h3>
            <div className="space-y-3">
              {tier2Generators.map(generator => {
                const production = calculateProduction(
                  [generator], 
                  generator.resourceType, 
                  productionMultipliers
                );
                
                return (
                  <GeneratorCard
                    key={generator.id}
                    generator={generator}
                    canAfford={canAfford(generator.cost)}
                    onPurchase={() => purchaseGenerator(generator.id)}
                    production={production}
                  />
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};