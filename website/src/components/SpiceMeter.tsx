import React from 'react';
import { SpiceLevel } from '@/types/restaurant';
import { Flame } from 'lucide-react';

interface SpiceMeterProps {
  level: SpiceLevel;
  showText?: boolean;
}

export default function SpiceMeter({ level, showText = true }: SpiceMeterProps) {
  const getFlameCount = () => {
    switch (level) {
      case 'Mild':
        return 1;
      case 'Medium':
        return 2;
      case 'Hot':
        return 3;
      case 'Code Red':
        return 4;
      default:
        return 1;
    }
  };

  const getColor = () => {
    switch (level) {
      case 'Mild':
        return 'text-emerald-400 border-emerald-800/60 bg-emerald-950/40';
      case 'Medium':
        return 'text-amber-400 border-amber-800/60 bg-amber-950/40';
      case 'Hot':
        return 'text-orange-400 border-orange-800/60 bg-orange-950/40';
      case 'Code Red':
        return 'text-red-400 border-red-800/80 bg-red-950/60 font-bold';
      default:
        return 'text-zinc-400 border-zinc-800 bg-zinc-900';
    }
  };

  const count = getFlameCount();

  return (
    <div
      className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-xs font-mono border ${getColor()}`}
      title={`Spice Level: ${level}`}
    >
      <div className="flex items-center">
        {Array.from({ length: count }).map((_, i) => (
          <Flame
            key={i}
            className={`w-3 h-3 ${level === 'Code Red' ? 'animate-bounce' : ''} fill-current`}
          />
        ))}
      </div>
      {showText && <span>{level}</span>}
    </div>
  );
}
