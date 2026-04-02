import { Trophy, Target, Zap, Crown, Flame, Star, Coins, Gem, Shield, Heart, Infinity, Rocket } from 'lucide-react';

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
  },
  {
    id: 'NEON_STREAK',
    title: 'Neon Streak',
    description: 'Completed 100 total spins across all games.',
    icon: Flame,
    color: 'text-orange-500'
  },
  {
    id: 'JACKPOT_CHASER',
    title: 'Jackpot Chaser',
    description: 'Played every single game in the universe.',
    icon: Star,
    color: 'text-blue-400'
  },
  {
    id: 'ULTIMATE_WHALE',
    title: 'Ultimate Whale',
    description: 'Total career payout exceeded $50,000.',
    icon: Coins,
    color: 'text-emerald-400'
  },
  {
    id: 'IRON_SHIELD',
    title: 'Iron Shield',
    description: 'Survived a 5-mine explosion in one game.',
    icon: Shield,
    color: 'text-slate-400'
  },
  {
    id: 'CYBER_LEGEND',
    title: 'Cyber Legend',
    description: 'Reached Level 50 and became a local hero.',
    icon: Rocket,
    color: 'text-fuchsia-500'
  },
  {
    id: 'WHEEL_MASTER',
    title: 'Wheel Master',
    description: 'Won 10 consecutive bets on the Roulette.',
    icon: Infinity,
    color: 'text-red-500'
  },
  {
    id: 'GOLDEN_TOUCH',
    title: 'Golden Touch',
    description: 'Hit a 100x multiplier on Neon Slots.',
    icon: Gem,
    color: 'text-amber-400'
  },
  {
    id: 'METAVERSE_KING',
    title: 'Metaverse King',
    description: 'The ultimate achievement for elite players.',
    icon: Heart,
    color: 'text-rose-500'
  }
];
