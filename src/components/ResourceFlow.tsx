import { useMemo } from 'react';
import { getGeneratorProduction } from '../store/gameStore';
import { Generator, Upgrade } from '../types/gameTypes';

// Actual CSS color values matching Tailwind classes
const DOT_COLORS: Record<string, string> = {
  credits:  '#facc15', // yellow-400
  scrap:    '#4ade80', // green-400
  energy:   '#22d3ee', // cyan-400
  research: '#c084fc', // purple-400
};

interface ResourceFlowProps {
  tierGens: Generator[];
  multipliers: Record<string, number>;
  reputation: number;
  prestigeLevels: Record<string, number>;
  upgrades: Upgrade[];
  allGenerators: Generator[];
}

interface Dot {
  key: string;
  color: string;
  duration: number;
  delay: number;
  size: number;
}

export const ResourceFlow = ({
  tierGens, multipliers, reputation, prestigeLevels, upgrades, allGenerators,
}: ResourceFlowProps) => {
  const dots = useMemo(() => {
    const result: Dot[] = [];

    // Group by resource type
    const resourceTypes = [...new Set(tierGens.map((g) => g.resourceType))];

    for (const resType of resourceTypes) {
      const activeGens = tierGens.filter((g) => g.resourceType === resType && g.owned > 0);
      if (activeGens.length === 0) continue;

      let totalProd = 0;
      for (const g of activeGens) {
        const { total } = getGeneratorProduction(g, multipliers, reputation, prestigeLevels, upgrades, allGenerators);
        totalProd += total;
      }

      const color = DOT_COLORS[resType] || '#9ca3af';

      // More production = more dots (1–8) and faster speed
      const numDots = Math.min(Math.max(1, Math.ceil(totalProd / 1.5)), 8);
      const duration = Math.max(1.5, 4.5 - Math.log10(1 + totalProd) * 1.5);

      for (let i = 0; i < numDots; i++) {
        // Stagger dots evenly + small jitter so they don't look too uniform
        const jitter = ((i * 7 + resType.length * 3) % 10) / 10; // deterministic pseudo-random
        result.push({
          key: `${resType}-${i}`,
          color,
          duration,
          delay: (i / numDots) * duration + jitter * 0.4,
          size: totalProd > 10 ? 5 : totalProd > 2 ? 4 : 3,
        });
      }
    }

    return result;
  }, [tierGens, multipliers, reputation, prestigeLevels, upgrades, allGenerators]);

  if (dots.length === 0) {
    // Dormant bar — no production yet
    return <div className="h-1 bg-gray-700/40 rounded-full mb-3" />;
  }

  return (
    <div className="relative h-2 bg-gray-700/40 rounded-full overflow-hidden mb-3">
      {dots.map((dot) => (
        <span
          key={dot.key}
          className="absolute top-1/2 -translate-y-1/2 rounded-full resource-dot"
          style={{
            width: dot.size,
            height: dot.size,
            backgroundColor: dot.color,
            color: dot.color, // for box-shadow currentColor
            animationDuration: `${dot.duration}s`,
            animationDelay: `${dot.delay}s`,
          }}
        />
      ))}
    </div>
  );
};
