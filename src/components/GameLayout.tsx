import { useState } from 'react';
import { ResourcesBar } from './ResourcesBar';
import { GeneratorsPanel } from './GeneratorsPanel';
import { UpgradesPanel } from './UpgradesPanel';
import { PrestigePanel } from './PrestigePanel';

type TabKey = 'generators' | 'upgrades' | 'prestige';

export const GameLayout = () => {
  const [activeTab, setActiveTab] = useState<TabKey>('generators');

  const tabs: { key: TabKey; label: string; color: string }[] = [
    { key: 'generators', label: 'Generators', color: 'text-blue-400' },
    { key: 'upgrades', label: 'Upgrades', color: 'text-green-400' },
    { key: 'prestige', label: 'Prestige', color: 'text-red-400' }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      {/* Resources bar at top */}
      <ResourcesBar />

      {/* Main content */}
      <div className="flex-1 p-4">
        {/* Tab navigation */}
        <div className="max-w-7xl mx-auto mb-4">
          <div className="flex space-x-1 bg-gray-800 rounded-lg p-1">
            {tabs.map(tab => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
                  activeTab === tab.key
                    ? 'bg-gray-700 text-white'
                    : 'text-gray-400 hover:text-white'
                } ${activeTab === tab.key ? tab.color : ''}`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tab content */}
        <div className="max-w-7xl mx-auto">
          {activeTab === 'generators' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="lg:col-span-2">
                <GeneratorsPanel />
              </div>
            </div>
          )}

          {activeTab === 'upgrades' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="lg:col-span-2">
                <UpgradesPanel />
              </div>
            </div>
          )}

          {activeTab === 'prestige' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="lg:col-span-2">
                <PrestigePanel />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Footer with save indicator */}
      <div className="bg-gray-800 border-t border-gray-700 p-2">
        <div className="max-w-7xl mx-auto text-center text-xs text-gray-500">
          Auto-saves every 30 seconds • Cosmic Garage v1.0
        </div>
      </div>
    </div>
  );
};