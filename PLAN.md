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
- **Repair Bot Swarm** (Credits) - 15 credits/sec, costs 500 scrap + 250 energy + 125 research
- **Matter Recycler** (Scrap) - 10 scrap/sec, costs 750 scrap + 375 energy + 175 research
- **Zero-Point Cell** (Energy) - 18 energy/sec, costs 1000 credits + 500 scrap + 250 energy
- **AI Research Lab** (Research) - 12 research/sec, costs 1250 credits + 625 scrap + 300 research

### Tier 4 - Cosmic
- **Dyson Sphere Hub** (Credits) - 80 credits/sec, costs 2500 scrap + 1500 energy + 800 research
- **Quantum Disassembler** (Scrap) - 55 scrap/sec, costs 3500 scrap + 2000 energy + 1000 research
- **Dark Energy Tap** (Energy) - 100 energy/sec, costs 5000 credits + 3000 scrap + 1200 research
- **Omniscient Network** (Research) - 65 research/sec, costs 6000 credits + 3500 scrap + 2500 energy

## Upgrade System

### Production Upgrades (always active)
- **Better Tools** - +25% credit production, costs 100 credits
- **Compressed Storage** - +50% scrap production, costs 150 scrap
- **Efficient Cells** - +30% energy production, costs 200 energy
- **Research Grants** - +40% research production, costs 300 credits

### Synergy Upgrades
- **Powered Crushers** - Crushers use energy to produce 2x scrap, costs 300 energy
- **Automated Repairs** - Scrap-fed auto-tools produce 3x credits, costs 400 scrap
- **Scientific Method** - Research +1% per Scientist owned, costs 200 research + 400 credits
- **Self-Improvement** - All production +1% per upgrade purchased, costs 800 credits + 400 scrap + 200 energy
- **Cross-Training** - Credits +2% per non-credit generator type owned, costs 1200 credits + 600 scrap
- **Scrap Feedback** - Scrap +1.5% per 10 generators owned, costs 1000 scrap + 500 energy
- **Energy Surplus** - Energy +3% per energy generator type owned, costs 1200 energy + 600 research
- **Research Network** - All production +0.5% per research generator owned, costs 1500 research + 800 credits
- **Galactic Trade Routes** - Credits production ×2, costs 3000 credits + 1500 scrap + 750 energy

### Unlock Upgrades
- **Expanded Garage** - Unlock Tier 2, costs 800 credits + 350 scrap
- **Orbital Platform** - Unlock Tier 3, costs 5000 credits + 2500 scrap + 1200 energy + 500 research
- **Dyson Sphere Array** - Unlock Tier 4, costs 25000 credits + 12000 scrap + 6000 energy + 3000 research

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
- [x] Set up React + TypeScript + Tailwind + Zustand
- [x] Create game store with resources and generators
- [x] Implement game tick loop (60fps)
- [x] Build ResourcesBar component
- [x] Build GeneratorsPanel with purchase functionality
- [x] Implement localStorage save/load
- [x] Calculate and display production rates

### Phase 2: Progression
- [x] Add upgrade system with 10-15 upgrades
- [x] Balance costs and production rates
- [x] Implement upgrade purchase logic
- [x] Add visual feedback for purchases
- [x] Show production breakdowns per generator
- [x] Add notification system for milestones

### Phase 3: Prestige & Polish
- [x] Implement prestige system with reputation currency
- [x] Add permanent upgrades (5-6 options)
- [x] Create PrestigePanel component
- [x] Add prestige unlock requirements
- [x] Balance prestige formula
- [x] Add stats tracking (time played, total earned, etc.)
- [x] Create StatsPanel component

### Phase 4: Mobile & UX
- [x] Optimize layout for mobile screens
- [x] Add touch-friendly buttons
- [ ] Implement swipe/tap interactions
- [ ] Test on actual mobile devices
- [x] Add loading states and transitions
- [x] Polish UI animations
- [x] Add tooltips/help text

### Phase 5: Content Expansion
- [x] Add 4th tier of generators (Dyson Sphere tier with 1.45× cost scaling)
- [x] More synergies between resources (5 new cross-resource upgrades)
- [x] Achievements system (25 achievements across 8 categories)
- [ ] Cloud save/sync
- [ ] Dark mode toggle
- [ ] Export/import save game

## Balance Guidelines
- **Cost Scaling**: Exponential per tier — T1: 1.18×, T2: 1.25×, T3: 1.35× per purchase
- **ROI**: Early generators pay for themselves in ~1-2 min; later ones take longer as costs ramp
- **Progression**: Player should reach first prestige in 45-90 minutes of active play
- **Multipliers**: Synergy upgrades should feel impactful (2x-3x) but not game-breaking
- **Difficulty**: Game should feel idle but reward active management; higher tiers create real cost walls

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

## Remaining Work
- Swipe/tap interactions for mobile
- Test on actual mobile devices
- Phase 5 content expansion items
