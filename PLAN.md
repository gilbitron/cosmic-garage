# Cosmic Garage - Game Development Plan

## Theme & Concept
Intergalactic vehicle repair shop idle game. Start fixing lunar rovers, build up to Dyson sphere-powered starships. Whimsical alien customers, quirky upgrades, interconnected resource chains.

## Core Resources
1. **Credits** (₡) - Money from completed jobs
2. **Scrap** (♻) - From breaking down junk vehicles
3. **Energy** (⚡) - Powers garage tools
4. **Research** (🔬) - Unlocks new technology tiers

## Resource Generators

### Tier 1 - Starting Out
- **Junior Mechanic** (Credits) - 0.5 credits/sec, costs 10 credits
- **Manual Crusher** (Scrap) - 0.3 scrap/sec, costs 15 credits
- **Solar Panel** (Energy) - 0.4 energy/sec, costs 20 credits
- **Intern** (Research) - 0.2 research/sec, costs 25 credits

### Tier 2 - Growing
- **Senior Mechanic** (Credits) - 2.5 credits/sec, costs 50 scrap + 30 energy
- **Hydraulic Crusher** (Scrap) - 1.8 scrap/sec, costs 75 scrap + 40 energy
- **Fusion Reactor** (Energy) - 2.2 energy/sec, costs 100 credits + 50 scrap
- **Scientist** (Research) - 1.5 research/sec, costs 150 credits + 60 scrap

### Tier 3 - Expanding
- **Repair Bot Swarm** (Credits) - 15 credits/sec, costs 200 scrap + 100 energy + 50 research
- **Matter Recycler** (Scrap) - 10 scrap/sec, costs 300 scrap + 150 energy + 75 research
- **Zero-Point Cell** (Energy) - 18 energy/sec, costs 400 credits + 200 scrap + 100 energy
- **AI Research Lab** (Research) - 12 research/sec, costs 500 credits + 250 scrap + 125 research

## Upgrade System

### Production Upgrades (always active)
- **Better Tools** - +25% mechanic production, costs 100 credits
- **Compressed Storage** - +50% scrap capacity, costs 150 scrap
- **Efficient Cells** - +30% energy production, costs 200 energy
- **Research Grants** - +40% research production, costs 300 credits

### Synergy Upgrades
- **Powered Crushers** - Crushers use energy to produce 2x scrap, costs 150 energy
- **Automated Repairs** - Mechanics use scrap to produce 3x credits, costs 200 scrap
- **Scientific Method** - Research production boosted by 1% per Scientist owned
- **Self-Improvement** - All production +1% per upgrade purchased

### Unlock Upgrades
- **Expanded Garage** - Unlock Tier 2 generators, costs 500 credits + 200 scrap
- **Orbital Platform** - Unlock Tier 3 generators, costs 2000 credits + 1000 scrap + 500 energy + 200 research

## Prestige System
**Garage Reputation** - Persistent prestige currency earned when you reset the game. Each prestige run gives you reputation based on total credits earned.

### Permanent Upgrades (cost Reputation)
- **Famous Garage** - +10% credits per prestige level (max 10)
- **Efficient Processes** - -5% generator cost per level (max 5)
- **Quality Tools** - +5% production per level (max 10)
- **Fast Learners** - +3% research per level (max 10)

### Prestige Formula
Reputation gained = floor(√(total_credits_earned / 1000))

## Tech Stack
- **React 18 + TypeScript** - UI framework
- **Zustand** - State management (game state)
- **Tailwind CSS** - Styling, mobile-first responsive
- **Vercel** - Deployment platform
- **localStorage** - Save game data (add cloud saves later)

## Project Structure
```
cosmic-garage/
├── src/
│   ├── components/
│   │   ├── GameLayout.tsx          # Main game container
│   │   ├── ResourcesBar.tsx        # Top resource display
│   │   ├── GeneratorsPanel.tsx     # Left panel with generators
│   │   ├── UpgradesPanel.tsx       # Right panel with upgrades
│   │   ├── PrestigePanel.tsx       # Prestige tab
│   │   └── StatsPanel.tsx          # Game stats
│   ├── store/
│   │   └── gameStore.ts            # Zustand store with all game state
│   ├── types/
│   │   └── gameTypes.ts            # TypeScript interfaces
│   ├── hooks/
│   │   └── useGameLoop.ts          # Game tick loop (60fps)
│   └── utils/
│       └── formatters.ts           # Number formatting, display helpers
├── public/
└── PLAN.md (this file)
```

## Implementation Phases

### Phase 1: MVP (Core Loop)
- [ ] Set up React + TypeScript + Tailwind + Zustand
- [ ] Create game store with resources and generators
- [ ] Implement game tick loop (60fps)
- [ ] Build ResourcesBar component
- [ ] Build GeneratorsPanel with purchase functionality
- [ ] Implement localStorage save/load
- [ ] Calculate and display production rates

### Phase 2: Progression
- [ ] Add upgrade system with 10-15 upgrades
- [ ] Balance costs and production rates
- [ ] Implement upgrade purchase logic
- [ ] Add visual feedback for purchases
- [ ] Show production breakdowns per generator
- [ ] Add notification system for milestones

### Phase 3: Prestige & Polish
- [ ] Implement prestige system with reputation currency
- [ ] Add permanent upgrades (5-6 options)
- [ ] Create PrestigePanel component
- [ ] Add prestige unlock requirements
- [ ] Balance prestige formula
- [ ] Add stats tracking (time played, total earned, etc.)
- [ ] Create StatsPanel component

### Phase 4: Mobile & UX
- [ ] Optimize layout for mobile screens
- [ ] Add touch-friendly buttons
- [ ] Implement swipe/tap interactions
- [ ] Test on actual mobile devices
- [ ] Add loading states and transitions
- [ ] Polish UI animations
- [ ] Add tooltips/help text

### Phase 5: Content Expansion (Future)
- [ ] Add 4th tier of generators
- [ ] More synergies between resources
- [ ] Achievements system
- [ ] Cloud save/sync
- [ ] Dark mode toggle
- [ ] Export/import save game

## Balance Guidelines
- **Cost Scaling**: Each generator costs ~15% more than previous of same type
- **ROI**: Most generators should pay for themselves in 1-2 minutes initially
- **Progression**: Player should reach first prestige in 30-60 minutes of active play
- **Multipliers**: Synergy upgrades should feel impactful (2x-3x) but not game-breaking
- **Difficulty**: Game should feel idle but reward active management

## Mobile Design Considerations
- **Layout**: Vertical stack on mobile, 2-column on desktop
- **Tap Targets**: Minimum 44px for buttons
- **Text**: Large enough to read without zooming
- **Feedback**: Clear visual feedback for all interactions
- **Performance**: Limit re-renders, use memoization where needed
- **Battery**: Game loop is efficient, no unnecessary calculations

## Deployment
- Push to GitHub main branch
- Connect repo to Vercel
- Auto-deploy on push
- Custom domain (optional)
- Monitor performance metrics

## Testing Checklist
- [ ] Resources accumulate correctly
- [ ] Purchase buttons disable when insufficient funds
- [ ] Prestige resets correctly and grants reputation
- [ ] Upgrades apply multipliers properly
- [ ] Save/load preserves all state
- [ ] Production calculations are accurate
- [ ] Mobile layout works on small screens
- [ ] No memory leaks in game loop
- [ ] Numbers format correctly at large values
- [ ] Game is balanced and fun!
