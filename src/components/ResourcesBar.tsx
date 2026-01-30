import { useGameStore } from '../store/gameStore';
import { formatNumber, formatProduction, calculateProduction } from '../utils/formatters';

export const ResourcesBar = () => {
  const resources = useGameStore(state => state.resources);
  const generators = useGameStore(state => state.generators);
  const productionMultipliers = useGameStore(state => state.productionMultipliers);

  // Calculate production rates
  const creditProduction = calculateProduction(generators, 'credits', productionMultipliers);
  const scrapProduction = calculateProduction(generators, 'scrap', productionMultipliers);
  const energyProduction = calculateProduction(generators, 'energy', productionMultipliers);
  const researchProduction = calculateProduction(generators, 'research', productionMultipliers);

  return (
    <div className="bg-gray-800 border-b border-gray-700 p-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold text-center mb-4 text-blue-400">Cosmic Garage 🚀🔧</h1>
        
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-center">
          {/* Credits */}
          <div className="bg-gray-700 rounded-lg p-3">
            <div className="text-sm text-gray-400">Credits</div>
            <div className="text-xl font-bold text-yellow-400">₡{formatNumber(resources.credits)}</div>
            <div className="text-xs text-gray-500">{formatProduction(creditProduction)}</div>
          </div>

          {/* Scrap */}
          <div className="bg-gray-700 rounded-lg p-3">
            <div className="text-sm text-gray-400">Scrap</div>
            <div className="text-xl font-bold text-green-400">♻{formatNumber(resources.scrap)}</div>
            <div className="text-xs text-gray-500">{formatProduction(scrapProduction)}</div>
          </div>

          {/* Energy */}
          <div className="bg-gray-700 rounded-lg p-3">
            <div className="text-sm text-gray-400">Energy</div>
            <div className="text-xl font-bold text-cyan-400">⚡{formatNumber(resources.energy)}</div>
            <div className="text-xs text-gray-500">{formatProduction(energyProduction)}</div>
          </div>

          {/* Research */}
          <div className="bg-gray-700 rounded-lg p-3">
            <div className="text-sm text-gray-400">Research</div>
            <div className="text-xl font-bold text-purple-400">🔬{formatNumber(resources.research)}</div>
            <div className="text-xs text-gray-500">{formatProduction(researchProduction)}</div>
          </div>

          {/* Reputation */}
          <div className="bg-gray-700 rounded-lg p-3">
            <div className="text-sm text-gray-400">Reputation</div>
            <div className="text-xl font-bold text-red-400">★{formatNumber(resources.reputation)}</div>
            <div className="text-xs text-gray-500">Prestige</div>
          </div>
        </div>
      </div>
    </div>
  );
};