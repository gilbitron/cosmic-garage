import { ResourceKey } from '../types/gameTypes';

export interface ResourceMeta {
  key: ResourceKey;
  label: string;
  icon: string;
  color: string;       // text color class
  bgColor: string;     // subtle bg for badges
}

export const RESOURCE_META: Record<string, ResourceMeta> = {
  credits:    { key: 'credits',    label: 'Credits',    icon: '₡',  color: 'text-yellow-400', bgColor: 'bg-yellow-400/10' },
  scrap:      { key: 'scrap',      label: 'Scrap',      icon: '♻',  color: 'text-green-400',  bgColor: 'bg-green-400/10' },
  energy:     { key: 'energy',     label: 'Energy',     icon: '⚡', color: 'text-cyan-400',   bgColor: 'bg-cyan-400/10' },
  research:   { key: 'research',   label: 'Research',   icon: '🔬', color: 'text-purple-400', bgColor: 'bg-purple-400/10' },
  reputation: { key: 'reputation', label: 'Reputation', icon: '★',  color: 'text-red-400',    bgColor: 'bg-red-400/10' },
};

export const PRODUCIBLE_RESOURCES = ['credits', 'scrap', 'energy', 'research'] as const;
