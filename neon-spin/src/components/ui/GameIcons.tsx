interface IconProps {
  size?: number;
  className?: string;
}

export const SlotsIcon = ({ size = 24, className = "" }: IconProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    stroke="none"
  >
    <text 
      x="50%" 
      y="55%" 
      textAnchor="middle" 
      dominantBaseline="middle"
      fontSize="14" 
      fontWeight="900" 
      letterSpacing="-0.8"
    >
      777
    </text>
  </svg>
);

export const MinesIcon = ({ size = 24, className = "" }: IconProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    {/* Bolder 3x3 Grid / Miniature Minefield */}
    <rect x="3" y="3" width="18" height="18" rx="2" strokeWidth="2" />
    <path d="M9 3v18" />
    <path d="M15 3v18" />
    <circle cx="6" cy="6" r="1" fill="currentColor" stroke="none" />
    <circle cx="12" cy="12" r="1.5" fill="currentColor" stroke="none" />
    <circle cx="18" cy="18" r="1" fill="currentColor" stroke="none" />
  </svg>
);

export const RouletteIcon = ({ size = 24, className = "" }: IconProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <circle cx="12" cy="12" r="9" strokeWidth="2" />
    <circle cx="12" cy="12" r="3" strokeWidth="2" />
    <path d="M12 3v18" />
    <path d="M3 12h18" />
    <path d="M5.6 5.6l12.8 12.8" />
    <path d="M5.6 18.4l12.8-12.8" />
    <circle cx="17.5" cy="12" r="1.2" fill="currentColor" stroke="none" />
  </svg>
);
