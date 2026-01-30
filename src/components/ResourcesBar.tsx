import { forwardRef } from 'react';
import { useGameStore } from '../store/gameStore';
import { formatNumber, formatProduction, calculateProduction } from '../utils/formatters';
import { RESOURCE_META, PRODUCIBLE_RESOURCES } from '../utils/resources';

function useResourceData() {
  const resources = useGameStore((s) => s.resources);
  const generators = useGameStore((s) => s.generators);
  const multipliers = useGameStore((s) => s.productionMultipliers);
  const prestigeLevels = useGameStore((s) => s.prestigeUpgradeLevels);
  const reputation = resources.reputation;

  const production: Record<string, number> = {};
  for (const key of PRODUCIBLE_RESOURCES) {
    production[key] = calculateProduction(generators, key, multipliers, reputation, prestigeLevels);
  }

  return { resources, production };
}

// ── Full header (scrolls away) ─────────────────────────────────────────

export const ResourcesBar = forwardRef<HTMLDivElement>((_props, ref) => {
  const { resources, production } = useResourceData();

  return (
    <div ref={ref} className="bg-gray-800 border-b border-gray-700 p-4">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold text-center mb-4 text-blue-400">
          🚀 Cosmic Garage 🔧
        </h1>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-center">
          {Object.values(RESOURCE_META).map(({ key, label, icon, color }) => (
            <div key={key} className="bg-gray-700 rounded-lg p-3">
              <div className="text-xs text-gray-400">{label}</div>
              <div className={`text-lg font-bold ${color}`}>
                {icon}
                {formatNumber(resources[key])}
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
});

ResourcesBar.displayName = 'ResourcesBar';

// ── Compact sticky header ──────────────────────────────────────────────

export const StickyResourcesBar = ({ visible }: { visible: boolean }) => {
  const { resources, production } = useResourceData();

  return (
    <div
      className={`fixed top-0 left-0 right-0 z-50 bg-gray-900/95 backdrop-blur border-b border-gray-700 transition-transform duration-200 ${
        visible ? 'translate-y-0' : '-translate-y-full'
      }`}
    >
      <div className="max-w-3xl mx-auto px-3 py-2 flex items-center justify-between gap-2 overflow-x-auto">
        {PRODUCIBLE_RESOURCES.map((key) => {
          const meta = RESOURCE_META[key];
          return (
            <div key={key} className="flex items-center gap-1 min-w-0">
              <span className={`font-bold text-sm ${meta.color}`}>
                {meta.icon}{formatNumber(resources[key])}
              </span>
              <span className="text-[10px] text-gray-500 hidden sm:inline">
                {formatProduction(production[key] ?? 0)}
              </span>
            </div>
          );
        })}
        <div className="flex items-center gap-1 min-w-0">
          <span className={`font-bold text-sm ${RESOURCE_META.reputation.color}`}>
            ★{formatNumber(resources.reputation)}
          </span>
        </div>
      </div>
    </div>
  );
};
