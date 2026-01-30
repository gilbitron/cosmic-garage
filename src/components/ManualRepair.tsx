import { useState, useCallback } from 'react';
import { useGameStore } from '../store/gameStore';
import { formatNumber } from '../utils/formatters';

export const ManualRepair = () => {
  const { clickValue, manualRepair, totalClicks } = useGameStore((state) => ({
    clickValue: state.clickValue,
    manualRepair: state.manualRepair,
    totalClicks: state.totalClicks,
  }));

  const [ripple, setRipple] = useState(false);

  const handleClick = useCallback(() => {
    manualRepair();
    setRipple(true);
    setTimeout(() => setRipple(false), 150);
  }, [manualRepair]);

  return (
    <div className="bg-gray-800 rounded-lg p-4 mb-4">
      <h2 className="text-xl font-bold mb-3 text-yellow-400">🔧 Manual Repair</h2>

      <button
        onClick={handleClick}
        className={`w-full py-4 px-6 rounded-lg font-bold text-lg transition-all
          bg-yellow-600 hover:bg-yellow-500 active:scale-95 text-white
          ${ripple ? 'scale-95 brightness-125' : ''}`}
      >
        Repair Vehicle — ₡{formatNumber(clickValue)}
      </button>

      <div className="text-xs text-gray-500 text-center mt-2">
        {totalClicks > 0
          ? `${formatNumber(totalClicks)} repairs completed`
          : 'Click to earn credits — then buy generators to automate!'}
      </div>
    </div>
  );
};
