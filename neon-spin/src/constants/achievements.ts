import { Trophy, Target, Zap, Crown } from 'lucide-react';

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: any;
  color: string;
}

export const ACHIEVEMENTS: Achievement[] = [
  {
    id: 'FIRST_WIN',
    title: 'First Win',
    description: 'Your very first victory in the casino.',
    icon: Trophy,
    color: 'text-green-400'
  },
  {
    id: 'HIGH_ROLLER',
    title: 'High Roller',
    description: 'Placed a single bet exceeding $1,000.',
    icon: Target,
    color: 'text-purple-400'
  },
  {
    id: 'LUCKY_ONE',
    title: 'Lucky One',
    description: 'Scored a massive win over $5,000.',
    icon: Zap,
    color: 'text-neon-cyan'
  },
  {
    id: 'VIP_ELITE',
    title: 'VIP Elite',
    description: 'Joined the exclusive high-stakes club.',
    icon: Crown,
    color: 'text-yellow-400'
  }
];
