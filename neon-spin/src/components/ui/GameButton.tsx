import React from 'react';
import type { LucideIcon } from 'lucide-react';

interface GameButtonProps {
  onClick: () => void;
  disabled?: boolean;
  isLoading?: boolean;
  loadingIcon?: LucideIcon;
  icon?: LucideIcon;
  label: string;
  className?: string;
}

export const GameButton: React.FC<GameButtonProps> = ({
  onClick,
  disabled,
  isLoading,
  loadingIcon: LoadingIcon,
  icon: Icon,
  label,
  className = '',
}) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled || isLoading}
      className={`
        relative overflow-hidden group
        min-h-[64px] min-w-[200px] rounded-2xl
        font-black uppercase tracking-[0.3em] text-lg
        transition-all duration-300
        ${disabled || isLoading
          ? 'bg-white/5 text-white/20 cursor-not-allowed opacity-30 border border-white/5'
          : 'bg-gradient-to-r from-purple-600 to-cyan-500 text-white hover:scale-[1.05] active:scale-[0.95] hover:shadow-[0_0_40px_rgba(147,51,234,0.3)] shadow-xl border border-white/10'
        }
        ${className}
      `}
    >
      {/* Glossy Overlay */}
      <div className="absolute inset-0 bg-white/20 -translate-x-full group-hover:animate-shimmer pointer-events-none" />
      
      <div className="relative z-10 flex items-center justify-center gap-4">
        {isLoading && LoadingIcon ? (
          <LoadingIcon size={24} className="animate-spin" />
        ) : (
          <>
            {Icon && <Icon size={24} fill="currentColor" />}
            <span className="drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]">{isLoading && !LoadingIcon ? '...' : label}</span>
          </>
        )}
      </div>
    </button>
  );
};
