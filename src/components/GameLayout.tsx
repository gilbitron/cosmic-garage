import { useState } from 'react';
import { ResourcesBar } from './ResourcesBar';
import { GeneratorsPanel } from './GeneratorsPanel';
import { UpgradesPanel } from './UpgradesPanel';
import { PrestigePanel } from './PrestigePanel';
import { StatsPanel } from './StatsPanel';

type TabKey = 'generators' | 'upgrades' | 'prestige' | 'stats';

const TABS: { key: TabKey; label: string; emoji: string }[] = [
  { key: 'generators', label: 'Generators', emoji: '🔧' },
  { key: 'upgrades', label: 'Upgrades', emoji: '⬆️' },
  { key: 'prestige', label: 'Prestige', emoji: '★' },
  { key: 'stats', label: 'Stats', emoji: '📊' },
];

export const GameLayout = () => {
  const [activeTab, setActiveTab] = useState<TabKey>('generators');

  return (
    <div className="min-h-screen flex flex-col">
      <ResourcesBar />

      {/* Main content */}
      <div className="flex-1 p-4">
        {/* Tab navigation */}
        <div className="max-w-3xl mx-auto mb-4">
          <div className="flex space-x-1 bg-gray-800 rounded-lg p-1">
            {TABS.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex-1 py-2 px-3 rounded-lg font-medium text-sm transition-colors ${
                  activeTab === tab.key
                    ? 'bg-gray-700 text-white'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <span className="hidden sm:inline">{tab.emoji} </span>
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tab content */}
        <div className="max-w-3xl mx-auto">
          {activeTab === 'generators' && <GeneratorsPanel />}
          {activeTab === 'upgrades' && <UpgradesPanel />}
          {activeTab === 'prestige' && <PrestigePanel />}
          {activeTab === 'stats' && <StatsPanel />}
        </div>
      </div>

      {/* Footer */}
      <div className="bg-gray-800 border-t border-gray-700 p-2">
        <div className="max-w-3xl mx-auto text-center text-xs text-gray-500">
          Auto-saves every 30 seconds • Cosmic Garage v1.0
        </div>
      </div>
    </div>
  );
};
