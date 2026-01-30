import { useGameStore } from '../store/gameStore';
import { formatNumber, formatProduction, calculateProduction } from '../utils/formatters';

const RESOURCE_CONFIG = [
  { key: 'credits', label: 'Credits', icon: '₡', color: 'text-yellow-400' },
  { key: 'scrap', label: 'Scrap', icon: '♻', color: 'text-green-400' },
  { key: 'energy', label: 'Energy', icon: '⚡', color: 'text-cyan-400' },
  { key: 'research', label: 'Research', icon: '🔬', color: 'text-purple-400' },
  { key: 'reputation', label: 'Reputation', icon: '★', color: 'text-red-400' },
] as const;

export const ResourcesBar = () => {
  const resources = useGameStore((state) => state.resources);
  const generators = useGameStore((state) => state.generators);
  const multipliers = useGameStore((state) => state.productionMultipliers);

  const reputation = useGameStore((state) => state.resources.reputation);

  const production: Record<string, number> = {
    credits: calculateProduction(generators, 'credits', multipliers, reputation),
    scrap: calculateProduction(generators, 'scrap', multipliers, reputation),
    energy: calculateProduction(generators, 'energy', multipliers, reputation),
    research: calculateProduction(generators, 'research', multipliers, reputation),
  };

  return (
    <div className="bg-gray-800 border-b border-gray-700 p-4">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold text-center mb-4 text-blue-400">
          🚀 Cosmic Garage 🔧
        </h1>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-center">
          {RESOURCE_CONFIG.map(({ key, label, icon, color }) => (
            <div key={key} className="bg-gray-700 rounded-lg p-3">
              <div className="text-xs text-gray-400">{label}</div>
              <div className={`text-lg font-bold ${color}`}>
                {icon}
                {formatNumber(resources[key as keyof typeof resources])}
              </div>
              <div className="text-xs text-gray-500">
                {key === 'reputation'
                  ? 'Prestige'
                  : formatProduction(production[key] ?? 0)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
