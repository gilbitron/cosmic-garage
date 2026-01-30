import { useGameStore } from '../store/gameStore';
import { formatCost } from '../utils/formatters';
import { Cost, Resources } from '../types/gameTypes';

export const UpgradesPanel = () => {
  const { upgrades, resources, purchaseUpgrade } = useGameStore(state => ({
    upgrades: state.upgrades,
    resources: state.resources,
    purchaseUpgrade: state.purchaseUpgrade
  }));

  const canAfford = (cost: Cost): boolean => {
    return (Object.entries(cost) as [keyof Resources, number | undefined][]).every(([key, value]) => {
      if (value === undefined || value === 0) return true;
      return resources[key] >= value;
    });
  };

  // Filter out owned upgrades
  const availableUpgrades = upgrades.filter(u => !u.owned);

  return (
    <div className="bg-gray-800 rounded-lg p-4">
      <h2 className="text-xl font-bold mb-4 text-green-400">Upgrades</h2>
      
      {availableUpgrades.length === 0 ? (
        <p className="text-gray-400 text-center py-8">All upgrades purchased!</p>
      ) : (
        <div className="space-y-3">
          {availableUpgrades.map(upgrade => {
            const canBuy = canAfford(upgrade.cost);
            
            return (
              <div
                key={upgrade.id}
                className={`bg-gray-700 rounded-lg p-4 hover:bg-gray-600 transition-colors ${
                  !canBuy ? 'opacity-50' : ''
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-semibold">{upgrade.name}</h3>
                    <p className="text-sm text-gray-400">{upgrade.description}</p>
                  </div>
                </div>

                <button
                  onClick={() => purchaseUpgrade(upgrade.id)}
                  disabled={!canBuy}
                  className={`w-full py-2 px-4 rounded font-medium transition-colors ${
                    canBuy
                      ? 'bg-green-600 hover:bg-green-700 text-white'
                      : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  Purchase
                  <div className="text-xs mt-1">{formatCost(upgrade.cost)}</div>
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};