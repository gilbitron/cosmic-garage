import { useGameStore } from '../store/gameStore';
import { formatNumber } from '../utils/formatters';

export const PrestigePanel = () => {
  const { resources, totalCreditsEarned, prestigeCount, prestige, getPrestigeGain } =
    useGameStore((state) => ({
      resources: state.resources,
      totalCreditsEarned: state.totalCreditsEarned,
      prestigeCount: state.prestigeCount,
      prestige: state.prestige,
      getPrestigeGain: state.getPrestigeGain,
    }));

  const prestigeGain = getPrestigeGain();
  const canPrestige = prestigeGain > 0;

  return (
    <div className="bg-gray-800 rounded-lg p-4">
      <h2 className="text-xl font-bold mb-4 text-red-400">Prestige</h2>

      <div className="bg-gray-700 rounded-lg p-6 text-center">
        <div className="mb-4">
          <div className="text-3xl font-bold text-red-400 mb-2">
            ★ {formatNumber(resources.reputation)}
          </div>
          <div className="text-gray-400">Garage Reputation</div>
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
          <div className="text-2xl font-bold text-green-400 mb-2">
            +{formatNumber(prestigeGain)} ★ Reputation
          </div>
          <p className="text-sm text-gray-400">
            Reset your garage to gain permanent reputation
          </p>
        </div>

        <button
          onClick={() => {
            if (
              window.confirm(
                `Prestige now? You'll gain ${prestigeGain} reputation but reset all progress.`
              )
            ) {
              prestige();
            }
          }}
          disabled={!canPrestige}
          className={`w-full py-3 px-6 rounded font-bold text-lg transition-colors ${
            canPrestige
              ? 'bg-red-600 hover:bg-red-700 text-white animate-pulse'
              : 'bg-gray-600 text-gray-400 cursor-not-allowed'
          }`}
        >
          {canPrestige
            ? `PRESTIGE — Gain ${prestigeGain} ★`
            : 'Earn more credits to prestige'}
        </button>

        <div className="mt-6 text-sm text-gray-500 space-y-1">
          <p>
            Unlocks at{' '}
            <span className="text-yellow-400">₡1,000</span> total credits earned
          </p>
          <p>Formula: floor(√(total_credits ÷ 1000))</p>
        </div>
      </div>
    </div>
  );
};
