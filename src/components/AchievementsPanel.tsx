import { useGameStore } from '../store/gameStore';
import { ACHIEVEMENTS } from '../data/achievements';
import { AchievementCategory } from '../types/gameTypes';

const CATEGORY_LABELS: Record<AchievementCategory, { title: string; icon: string }> = {
  click:      { title: 'Clicking',    icon: '👆' },
  generator:  { title: 'Generators',  icon: '🔧' },
  resource:   { title: 'Resources',   icon: '💰' },
  upgrade:    { title: 'Upgrades',    icon: '⬆️' },
  prestige:   { title: 'Prestige',    icon: '⭐' },
  production: { title: 'Production',  icon: '📈' },
  time:       { title: 'Time',        icon: '⏰' },
  misc:       { title: 'Miscellaneous', icon: '🎯' },
};

const CATEGORY_ORDER: AchievementCategory[] = [
  'click', 'generator', 'resource', 'upgrade', 'prestige', 'production', 'time', 'misc',
];

export const AchievementsPanel = () => {
  const unlockedAchievements = useGameStore((s) => s.unlockedAchievements);
  const total = ACHIEVEMENTS.length;
  const unlocked = unlockedAchievements.length;

  return (
    <div className="bg-gray-800 rounded-lg p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-amber-400">🏆 Achievements</h2>
        <span className="text-sm text-gray-400">
          {unlocked}/{total} unlocked
        </span>
      </div>

      {/* Progress bar */}
      <div className="w-full bg-gray-700 rounded-full h-2 mb-6">
        <div
          className="bg-amber-500 h-2 rounded-full transition-all duration-500"
          style={{ width: `${(unlocked / total) * 100}%` }}
        />
      </div>

      <div className="space-y-6">
        {CATEGORY_ORDER.map((cat) => {
          const catAchievements = ACHIEVEMENTS.filter((a) => a.category === cat);
          if (catAchievements.length === 0) return null;
          const label = CATEGORY_LABELS[cat];
          const catUnlocked = catAchievements.filter((a) => unlockedAchievements.includes(a.id)).length;

          return (
            <div key={cat}>
              <h3 className="text-sm font-semibold text-gray-400 mb-2">
                {label.icon} {label.title}
                <span className="ml-2 text-gray-500">
                  ({catUnlocked}/{catAchievements.length})
                </span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {catAchievements.map((achievement) => {
                  const isUnlocked = unlockedAchievements.includes(achievement.id);
                  return (
                    <div
                      key={achievement.id}
                      className={`rounded-lg p-3 flex items-center gap-3 transition-colors ${
                        isUnlocked
                          ? 'bg-gray-700 border border-amber-500/30'
                          : 'bg-gray-700/50 opacity-50'
                      }`}
                    >
                      <span className="text-2xl shrink-0">
                        {isUnlocked ? achievement.icon : '🔒'}
                      </span>
                      <div className="min-w-0">
                        <div className={`font-medium text-sm ${isUnlocked ? 'text-white' : 'text-gray-400'}`}>
                          {achievement.name}
                        </div>
                        <div className="text-xs text-gray-500 truncate">
                          {achievement.description}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
