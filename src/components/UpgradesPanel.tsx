import { useState, useCallback } from 'react';
import { useGameStore } from '../store/gameStore';
import { formatCost } from '../utils/formatters';
import { Cost, Resources } from '../types/gameTypes';
import { RESOURCE_META } from '../utils/resources';

const EFFECT_BADGES: Record<string, { label: string; color: string }> = {
  multiplier: { label: 'Production', color: 'bg-green-800 text-green-300' },
  synergy: { label: 'Synergy', color: 'bg-yellow-800 text-yellow-300' },
  unlock: { label: 'Unlock', color: 'bg-purple-800 text-purple-300' },
};

export const UpgradesPanel = () => {
  const { upgrades, resources, purchaseUpgrade } = useGameStore((state) => ({
    upgrades: state.upgrades,
    resources: state.resources,
    purchaseUpgrade: state.purchaseUpgrade,
  }));

  const [flashId, setFlashId] = useState<string | null>(null);
  const handlePurchase = useCallback((id: string) => {
    purchaseUpgrade(id);
    setFlashId(id);
    setTimeout(() => setFlashId(null), 350);
  }, [purchaseUpgrade]);

  const canAfford = (cost: Cost): boolean =>
    (Object.entries(cost) as [keyof Resources, number | undefined][]).every(
      ([key, value]) => !value || resources[key] >= value
    );

  const available = upgrades.filter((u) => !u.owned);
  const purchased = upgrades.filter((u) => u.owned);

  return (
    <div className="bg-gray-800 rounded-lg p-4">
      <h2 className="text-xl font-bold mb-4 text-green-400">Upgrades</h2>

      {available.length === 0 ? (
        <p className="text-gray-400 text-center py-8">All upgrades purchased! 🎉</p>
      ) : (
        <div className="space-y-3">
          {available.map((upgrade) => {
            const canBuy = canAfford(upgrade.cost);
            const badge = EFFECT_BADGES[upgrade.effect.type];
            // Show resource badge for multiplier/synergy upgrades
            const targetRes =
              upgrade.effect.target && RESOURCE_META[upgrade.effect.target]
                ? RESOURCE_META[upgrade.effect.target]
                : null;

            return (
              <div
                key={upgrade.id}
                className={`bg-gray-700 rounded-lg p-4 transition-colors ${
                  canBuy ? 'hover:bg-gray-600' : 'opacity-50'
                } ${flashId === upgrade.id ? 'animate-purchase' : ''}`}
              >
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-semibold">{upgrade.name}</h3>
                      {badge && (
                        <span className={`text-xs px-2 py-0.5 rounded-full ${badge.color}`}>
                          {badge.label}
                        </span>
                      )}
                      {targetRes && (
                        <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${targetRes.color} ${targetRes.bgColor}`}>
                          {targetRes.icon} {targetRes.label}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-400 mt-1">{upgrade.description}</p>
                  </div>
                </div>

                <button
                  onClick={() => handlePurchase(upgrade.id)}
                  disabled={!canBuy}
                  className={`w-full py-2 px-4 rounded font-medium transition-all active:scale-95 ${
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

      {/* Purchased upgrades */}
      {purchased.length > 0 && (
        <div className="mt-6">
          <h3 className="text-sm font-semibold text-gray-500 mb-2">
            Purchased ({purchased.length})
          </h3>
          <div className="flex flex-wrap gap-2">
            {purchased.map((u) => (
              <span
                key={u.id}
                className="text-xs bg-gray-700 text-green-400 px-2 py-1 rounded"
              >
                ✓ {u.name}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
