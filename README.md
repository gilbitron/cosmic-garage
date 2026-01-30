# Cosmic Garage 🚀🔧

An incremental/idle game where you run an intergalactic vehicle repair shop. Start by fixing lunar rovers and work your way up to building Dyson sphere-powered starships.

## Features

- 4 interconnected resource types: Credits, Scrap, Energy, and Research
- Multiple generator tiers with scaling costs
- Upgrade system with synergies between resources
- Prestige system with persistent reputation currency
- Auto-save every 30 seconds
- Mobile-first responsive design
- 60 FPS game loop

## Tech Stack

- **React 18** + **TypeScript**
- **Zustand** - State management
- **Tailwind CSS** - Styling
- **Vite** - Build tool and dev server

## Getting Started

### Prerequisites
- Node.js (v18+)
- npm

### Installation

```bash
cd cosmic-garage
npm install
```

### Development

```bash
npm run dev
```

Open http://localhost:5173 in your browser.

### Build

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## Game Mechanics

### Resources
- **Credits** (₡) - Earned from completing repair jobs
- **Scrap** (♻) - Collected from breaking down junk vehicles
- **Energy** (⚡) - Powers your garage equipment
- **Research** (🔬) - Unlock new technologies
- **Reputation** (★) - Persistent prestige currency

### Generators
Each generator produces a specific resource. Purchase multiple of the same type to increase production.

Cost scaling: Each purchase increases the cost by approximately 15%.

### Upgrades
Purchase upgrades to boost production multipliers or unlock new content. Some upgrades provide synergies between different resources.

### Prestige
When you have enough total credits earned, you can prestige to gain reputation. Reputation is persistent across resets and can be used to purchase permanent upgrades.

Prestige formula: `reputation = floor(√(total_credits / 1000))`

## Development

### Project Structure
```
src/
├── components/          # React components
│   ├── GameLayout.tsx
│   ├── ResourcesBar.tsx
│   ├── GeneratorsPanel.tsx
│   ├── UpgradesPanel.tsx
│   └── PrestigePanel.tsx
├── store/
│   └── gameStore.ts     # Zustand store with game state
├── types/
│   └── gameTypes.ts     # TypeScript interfaces
├── hooks/
│   └── useGameLoop.ts   # Game tick loop
├── utils/
│   └── formatters.ts    # Number formatting utilities
└── App.tsx
```

### Game Balance
Currently configured for:
- First prestige target: ~30-60 minutes of active play
- Resource production scales quadratically with generator count
- Cost scaling: 1.15x per purchase
- Upgrade costs scale with current resource production

Feel free to adjust the balance in `src/store/gameStore.ts`!

## Deployment

Recommended: Vercel

1. Push to GitHub
2. Connect repository to Vercel
3. Auto-deploy on push to main branch

## Roadmap

See `PLAN.md` for detailed implementation phases and future features.

## License

MIT
