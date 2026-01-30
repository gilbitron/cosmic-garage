import { useGameStore, getReputationBonus, PRESTIGE_UPGRADES, getPrestigeUpgradeCost } from '../store/gameStore';
import { formatNumber } from '../utils/formatters';

export const PrestigePanel = () => {
  const {
    resources, totalCreditsEarned, prestigeCount, prestige, getPrestigeGain,
    prestigeUpgradeLevels, purchasePrestigeUpgrade,
  } = useGameStore((state) => ({
    resources: state.resources,
    totalCreditsEarned: state.totalCreditsEarned,
    prestigeCount: state.prestigeCount,
    prestige: state.prestige,
    getPrestigeGain: state.getPrestigeGain,
    prestigeUpgradeLevels: state.prestigeUpgradeLevels,
    purchasePrestigeUpgrade: state.purchasePrestigeUpgrade,
  }));

  const prestigeGain = getPrestigeGain();
  const canPrestige = prestigeGain > 0;
  const currentRep = resources.reputation;

  const currentBonus = getReputationBonus(currentRep);
  const afterPrestigeBonus = getReputationBonus(currentRep + prestigeGain);
  const pctNow = Math.round((currentBonus - 1) * 100);
  const pctAfter = Math.round((afterPrestigeBonus - 1) * 100);

  return (
    <div className="space-y-4">
      {/* Prestige action */}
      <div className="bg-gray-800 rounded-lg p-4">
        <h2 className="text-xl font-bold mb-4 text-red-400">Prestige</h2>

        <div className="bg-gray-700 rounded-lg p-6 text-center">
          <div className="mb-4">
            <div className="text-3xl font-bold text-red-400 mb-1">★ {formatNumber(currentRep)}</div>
            <div className="text-gray-400">Garage Reputation</div>
            {pctNow > 0 && (
              <div className="text-sm text-green-400 mt-1">+{pctNow}% all production</div>
            )}
          </div>

          <div className="mb-6 space-y-2">
            <div className="text-sm">
              <span className="text-gray-400">Total Credits Earned: </span>
              <span className="text-yellow-400">{formatNumber(totalCreditsEarned)}</span>
            </div>
            <div className="text-sm">
              <span className="text-gray-400">Prestige Count: </span>
              <span className="text-purple-400">{prestigeCount}</span>
            </div>
          </div>

          <div className="mb-6 p-4 bg-gray-600 rounded-lg">
            <h3 className="font-semibold mb-3">Available Prestige Reward</h3>
            <div className="text-2xl font-bold text-green-400 mb-1">
              +{formatNumber(prestigeGain)} ★ Reputation
            </div>
            {canPrestige && (
              <div className="text-sm text-green-300 mb-2">
                Production bonus: {pctNow}% → {pctAfter}%
              </div>
            )}
            <p className="text-sm text-gray-400">Reset your garage to gain permanent reputation</p>
          </div>

          <button
            onClick={() => {
              if (window.confirm(`Prestige now? You'll gain ${prestigeGain} ★ (${pctNow}% → ${pctAfter}% production) but reset all progress.`)) {
                prestige();
              }
            }}
            disabled={!canPrestige}
            className={`w-full py-3 px-6 rounded font-bold text-lg transition-colors ${
              canPrestige ? 'bg-red-600 hover:bg-red-700 text-white animate-pulse' : 'bg-gray-600 text-gray-400 cursor-not-allowed'
            }`}
          >
            {canPrestige ? `PRESTIGE — Gain ${prestigeGain} ★ (+${pctAfter - pctNow}%)` : 'Earn more credits to prestige'}
          </button>

          <div className="mt-4 text-sm text-gray-500 space-y-1">
            <p>Unlocks at <span className="text-yellow-400">₡1,000</span> total credits earned</p>
            <p>Each ★ gives +10% to all production</p>
          </div>
        </div>
      </div>

      {/* Permanent upgrades shop */}
      <div className="bg-gray-800 rounded-lg p-4">
        <h2 className="text-xl font-bold mb-4 text-amber-400">★ Permanent Upgrades</h2>
        <p className="text-sm text-gray-400 mb-4">Spend reputation on upgrades that persist through prestige resets.</p>

        <div className="space-y-3">
          {PRESTIGE_UPGRADES.map((def) => {
            const level = prestigeUpgradeLevels[def.id] || 0;
            const maxed = level >= def.maxLevel;
            const cost = maxed ? 0 : getPrestigeUpgradeCost(def, level);
            const canBuy = !maxed && currentRep >= cost;

            // Calculate current effect text
            let effectText = '';
            if (def.id === 'famous-garage')       effectText = `+${level * 10}% credits`;
            if (def.id === 'efficient-processes')  effectText = `-${level * 5}% costs`;
            if (def.id === 'quality-tools')       effectText = `+${level * 5}% all production`;
            if (def.id === 'fast-learners')       effectText = `+${level * 3}% research`;

            return (
              <div
                key={def.id}
                className={`bg-gray-700 rounded-lg p-4 transition-colors ${canBuy ? 'hover:bg-gray-600' : ''}`}
              >
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-semibold">{def.name}</h3>
                    <p className="text-sm text-gray-400">{def.description}</p>
                  </div>
                  <div className="text-right ml-3 shrink-0">
                    <div className={`text-sm font-bold ${maxed ? 'text-green-400' : 'text-amber-400'}`}>
                      {level}/{def.maxLevel}
                    </div>
                  </div>
                </div>

                {level > 0 && (
                  <div className="text-sm text-green-400 mb-2">
                    Current: {effectText}
                  </div>
                )}

                {/* Progress bar */}
                <div className="w-full bg-gray-600 rounded-full h-2 mb-3">
                  <div
                    className="bg-amber-500 h-2 rounded-full transition-all"
                    style={{ width: `${(level / def.maxLevel) * 100}%` }}
                  />
                </div>

                {maxed ? (
                  <div className="text-center text-sm text-green-400 font-medium py-2">
                    ✓ Maxed Out
                  </div>
                ) : (
                  <button
                    onClick={() => purchasePrestigeUpgrade(def.id)}
                    disabled={!canBuy}
                    className={`w-full py-2 px-4 rounded font-medium transition-colors ${
                      canBuy
                        ? 'bg-amber-600 hover:bg-amber-700 text-white'
                        : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    Upgrade — ★{cost}
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
