import { useEffect } from 'react';
import { useGameStore } from '../store/gameStore';
import { useToast } from '../components/Toast';
import { ACHIEVEMENTS } from '../data/achievements';
import { calculateProduction } from '../utils/formatters';

/**
 * Checks achievement conditions once per second and unlocks any that are met.
 * Also fires a toast notification for each newly-unlocked achievement.
 */
export const useAchievements = () => {
  const { showToast } = useToast();

  useEffect(() => {
    const interval = setInterval(() => {
      const s = useGameStore.getState();
      const {
        totalClicks, generators, totalCreditsEarned, upgrades,
        unlockedTiers, prestigeCount, timePlayed, resources,
        productionMultipliers, prestigeUpgradeLevels, unlockedAchievements,
        unlockAchievement,
      } = s;

      const totalGens = generators.reduce((sum, g) => sum + g.owned, 0);
      const creditsPerSec = calculateProduction(
        generators, 'credits', productionMultipliers,
        resources.reputation, prestigeUpgradeLevels, upgrades,
      );
      const purchasedUpgrades = upgrades.filter((u) => u.owned).length;
      const allProducing = (['credits', 'scrap', 'energy', 'research'] as const).every(
        (r) => generators.some((g) => g.resourceType === r && g.owned > 0),
      );

      const checks: Record<string, boolean> = {
        // Click
        'first-repair': totalClicks >= 1,
        'handyman': totalClicks >= 100,
        'click-master': totalClicks >= 1000,
        // Generator
        'hired-help': totalGens >= 1,
        'small-business': totalGens >= 10,
        'growing-empire': totalGens >= 50,
        'galactic-corp': totalGens >= 100,
        'generator-hoard': totalGens >= 200,
        // Resource
        'first-paycheck': totalCreditsEarned >= 1_000,
        'making-bank': totalCreditsEarned >= 100_000,
        'millionaire': totalCreditsEarned >= 1_000_000,
        'billionaire': totalCreditsEarned >= 1_000_000_000,
        // Upgrade
        'first-upgrade': purchasedUpgrades >= 1,
        'fully-upgraded': purchasedUpgrades >= upgrades.length,
        // Tier
        'tier-2': unlockedTiers.includes(2),
        'tier-3': unlockedTiers.includes(3),
        'tier-4': unlockedTiers.includes(4),
        // Prestige
        'first-prestige': prestigeCount >= 1,
        'prestige-5': prestigeCount >= 5,
        'prestige-10': prestigeCount >= 10,
        // Production
        'speed-100': creditsPerSec >= 100,
        'speed-1k': creditsPerSec >= 1_000,
        'speed-10k': creditsPerSec >= 10_000,
        // Time
        'dedicated': timePlayed >= 3600,
        'veteran': timePlayed >= 36_000,
        // Misc
        'diversified': allProducing,
      };

      for (const [id, met] of Object.entries(checks)) {
        if (met && !unlockedAchievements.includes(id)) {
          const def = ACHIEVEMENTS.find((a) => a.id === id);
          if (def) {
            unlockAchievement(id);
            showToast(`Achievement: ${def.name}!`, def.icon, 5000);
          }
        }
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [showToast]);
};
