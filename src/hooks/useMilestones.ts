import { useEffect, useRef } from 'react';
import { useGameStore } from '../store/gameStore';
import { useToast } from '../components/Toast';
import { formatNumber } from '../utils/formatters';

const CREDIT_MILESTONES = [100, 1_000, 10_000, 100_000, 1_000_000, 1_000_000_000];
const GENERATOR_MILESTONES = [1, 10, 25, 50, 100];

export const useMilestones = () => {
  const { showToast } = useToast();
  const totalCreditsEarned = useGameStore((s) => s.totalCreditsEarned);
  const generators = useGameStore((s) => s.generators);
  const totalGenerators = generators.reduce((sum, g) => sum + g.owned, 0);

  const lastCredits = useRef(totalCreditsEarned);
  const lastGens = useRef(totalGenerators);

  useEffect(() => {
    // Credit milestones
    for (const ms of CREDIT_MILESTONES) {
      if (lastCredits.current < ms && totalCreditsEarned >= ms) {
        showToast(`Total credits earned: ₡${formatNumber(ms)}!`, '🏆', 5000);
        break; // one at a time
      }
    }
    lastCredits.current = totalCreditsEarned;
  }, [totalCreditsEarned, showToast]);

  useEffect(() => {
    // Generator milestones
    for (const ms of GENERATOR_MILESTONES) {
      if (lastGens.current < ms && totalGenerators >= ms) {
        showToast(`You now own ${ms} generators!`, '🚀', 5000);
        break;
      }
    }
    lastGens.current = totalGenerators;
  }, [totalGenerators, showToast]);
};
