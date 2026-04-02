interface IconProps {
  size?: number;
  className?: string;
}

export const SlotsIcon = ({ size = 24, className = "" }: IconProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    {/* Simplified 3-reel machine */}
    <rect x="3" y="3" width="18" height="15" rx="2" />
    <path d="M3 8h18" />
    <path d="M3 13h18" />
    {/* 777 - Bold and centered */}
    <text x="4.5" y="11.5" fontSize="5" fontWeight="900" fill="currentColor" stroke="none" opacity="0.6">7</text>
    <text x="9.5" y="12" fontSize="7" fontWeight="900" fill="currentColor" stroke="none">7</text>
    <text x="15.5" y="11.5" fontSize="5" fontWeight="900" fill="currentColor" stroke="none" opacity="0.6">7</text>
    {/* Lever ball */}
    <path d="M21 6l2 2-2 2" />
    <circle cx="23" cy="8" r="1" fill="currentColor" stroke="none" />
    {/* Base */}
    <rect x="7" y="18" width="10" height="3" rx="1" fill="currentColor" stroke="none" opacity="0.3" />
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
    {/* 3x3 Grid */}
    <rect x="3" y="3" width="18" height="18" rx="2" />
    <path d="M9 3v18" />
    <path d="M15 3v18" />
    <path d="M3 9h18" />
    <path d="M3 15h18" />
    {/* Some details */}
    <circle cx="6" cy="6" r="1" fill="currentColor" stroke="none" />
    <path d="M12 12l1 1-1 1-1-1z" fill="currentColor" stroke="none" />
    <circle cx="18" cy="18" r="1.5" strokeDasharray="1 1" />
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
    {/* Outer Wheel */}
    <circle cx="12" cy="12" r="9" />
    <circle cx="12" cy="12" r="5" />
    {/* Segments */}
    <path d="M12 3v4" />
    <path d="M12 17v4" />
    <path d="M3 12h4" />
    <path d="M17 12h4" />
    <path d="M5.6 5.6l2.8 2.8" />
    <path d="M15.6 15.6l2.8 2.8" />
    <path d="M5.6 18.4l2.8-2.8" />
    <path d="M15.6 8.4l2.8-2.8" />
    {/* Center Pin */}
    <circle cx="12" cy="12" r="1" fill="currentColor" stroke="none" />
    {/* The Ball */}
    <circle cx="17.5" cy="12" r="1" fill="white" stroke="none" className="animate-pulse" />
  </svg>
);
