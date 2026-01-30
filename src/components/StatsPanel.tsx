import { useGameStore } from '../store/gameStore';
import { formatNumber, formatTime, calculateProduction } from '../utils/formatters';

export const StatsPanel = () => {
  const { generators, productionMultipliers, totalCreditsEarned, timePlayed, prestigeCount } =
    useGameStore((state) => ({
      generators: state.generators,
      productionMultipliers: state.productionMultipliers,
      totalCreditsEarned: state.totalCreditsEarned,
      timePlayed: state.timePlayed,
      prestigeCount: state.prestigeCount,
    }));

  const totalGenerators = generators.reduce((sum, g) => sum + g.owned, 0);

  const stats = [
    { label: 'Time Played', value: formatTime(timePlayed) },
    { label: 'Total Credits Earned', value: `₡${formatNumber(totalCreditsEarned)}` },
    { label: 'Prestige Count', value: String(prestigeCount) },
    { label: 'Total Generators', value: String(totalGenerators) },
    { label: 'Credits/s', value: formatNumber(calculateProduction(generators, 'credits', productionMultipliers)) },
    { label: 'Scrap/s', value: formatNumber(calculateProduction(generators, 'scrap', productionMultipliers)) },
    { label: 'Energy/s', value: formatNumber(calculateProduction(generators, 'energy', productionMultipliers)) },
    { label: 'Research/s', value: formatNumber(calculateProduction(generators, 'research', productionMultipliers)) },
  ];

  return (
    <div className="bg-gray-800 rounded-lg p-4">
      <h2 className="text-xl font-bold mb-4 text-cyan-400">Stats</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-gray-700 rounded-lg p-3">
            <div className="text-sm text-gray-400">{stat.label}</div>
            <div className="text-lg font-semibold text-white">{stat.value}</div>
          </div>
        ))}
      </div>

      {/* Per-generator breakdown */}
      <div className="mt-6">
        <h3 className="text-sm font-semibold text-gray-400 mb-3">Generator Breakdown</h3>
        <div className="space-y-2">
          {generators
            .filter((g) => g.owned > 0)
            .map((g) => {
              const genMult = productionMultipliers[g.id] || 1;
              const resMult = productionMultipliers[g.resourceType] || 1;
              const total = g.owned * g.baseProduction * genMult * resMult;
              return (
                <div
                  key={g.id}
                  className="flex justify-between text-sm bg-gray-700 rounded px-3 py-2"
                >
                  <span className="text-gray-300">
                    {g.name} ×{g.owned}
                  </span>
                  <span className="text-green-400">{formatNumber(total)}/s</span>
                </div>
              );
            })}
          {generators.every((g) => g.owned === 0) && (
            <p className="text-gray-500 text-sm text-center py-2">No generators yet</p>
          )}
        </div>
      </div>
    </div>
  );
};
