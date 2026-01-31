import { AchievementDef } from '../types/gameTypes';

export const ACHIEVEMENTS: AchievementDef[] = [
  // Click
  { id: 'first-repair',   name: 'First Repair',           description: 'Complete your first manual repair',      icon: '🔧', category: 'click' },
  { id: 'handyman',       name: 'Handyman',               description: 'Click 100 times',                        icon: '🛠️', category: 'click' },
  { id: 'click-master',   name: 'Click Master',           description: 'Click 1,000 times',                      icon: '👆', category: 'click' },

  // Generator
  { id: 'hired-help',     name: 'Hired Help',             description: 'Buy your first generator',               icon: '👷', category: 'generator' },
  { id: 'small-business', name: 'Small Business',         description: 'Own 10 generators',                      icon: '🏪', category: 'generator' },
  { id: 'growing-empire', name: 'Growing Empire',         description: 'Own 50 generators',                      icon: '🏗️', category: 'generator' },
  { id: 'galactic-corp',  name: 'Galactic Corporation',   description: 'Own 100 generators',                     icon: '🌌', category: 'generator' },
  { id: 'generator-hoard',name: 'Generator Hoard',        description: 'Own 200 generators',                     icon: '🏭', category: 'generator' },

  // Resource
  { id: 'first-paycheck', name: 'First Paycheck',         description: 'Earn 1,000 total credits',               icon: '💰', category: 'resource' },
  { id: 'making-bank',    name: 'Making Bank',            description: 'Earn 100,000 total credits',             icon: '🏦', category: 'resource' },
  { id: 'millionaire',    name: 'Millionaire',            description: 'Earn 1,000,000 total credits',           icon: '💎', category: 'resource' },
  { id: 'billionaire',    name: 'Billionaire',            description: 'Earn 1,000,000,000 total credits',       icon: '👑', category: 'resource' },

  // Upgrade
  { id: 'first-upgrade',  name: 'First Upgrade',          description: 'Purchase your first upgrade',            icon: '⬆️', category: 'upgrade' },
  { id: 'fully-upgraded', name: 'Fully Upgraded',         description: 'Purchase all upgrades',                  icon: '🌟', category: 'upgrade' },
  { id: 'tier-2',         name: 'Expanding Operations',   description: 'Unlock Tier 2 generators',               icon: '🏗️', category: 'upgrade' },
  { id: 'tier-3',         name: 'Orbital Ambitions',      description: 'Unlock Tier 3 generators',               icon: '🛸', category: 'upgrade' },
  { id: 'tier-4',         name: 'Dyson Dreams',           description: 'Unlock Tier 4 generators',               icon: '☀️', category: 'upgrade' },

  // Prestige
  { id: 'first-prestige', name: 'Fresh Start',            description: 'Prestige for the first time',            icon: '⭐', category: 'prestige' },
  { id: 'prestige-5',     name: 'Prestige Master',        description: 'Prestige 5 times',                       icon: '🌟', category: 'prestige' },
  { id: 'prestige-10',    name: 'Prestige Legend',         description: 'Prestige 10 times',                      icon: '✨', category: 'prestige' },

  // Production
  { id: 'speed-100',      name: 'Speed Demon',            description: 'Reach 100 credits/sec',                  icon: '💨', category: 'production' },
  { id: 'speed-1k',       name: 'Automation King',        description: 'Reach 1,000 credits/sec',                icon: '🤖', category: 'production' },
  { id: 'speed-10k',      name: 'Credit Tsunami',         description: 'Reach 10,000 credits/sec',               icon: '🌊', category: 'production' },

  // Time
  { id: 'dedicated',      name: 'Dedicated',              description: 'Play for 1 hour',                        icon: '⏰', category: 'time' },
  { id: 'veteran',        name: 'Veteran',                description: 'Play for 10 hours',                      icon: '🎖️', category: 'time' },

  // Misc
  { id: 'diversified',    name: 'Diversified',            description: 'Have all 4 resource types producing',    icon: '🎯', category: 'misc' },
];
