interface LogoProps {
  size?: number;
  showText?: boolean;
  light?: boolean;
}

export function Logo({ size = 36, showText = true, light = false }: LogoProps) {
  const iconSize = size;

  return (
    <div className="flex items-center gap-2 select-none">
      <svg width={iconSize} height={iconSize} viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="seGrad" x1="0" y1="0" x2="44" y2="44" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#2E86AB" />
            <stop offset="100%" stopColor="#1A3C5E" />
          </linearGradient>
          <linearGradient id="seShimmer" x1="0" y1="0" x2="44" y2="0" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="rgba(255,255,255,0.18)" />
            <stop offset="100%" stopColor="rgba(255,255,255,0)" />
          </linearGradient>
        </defs>
        <rect width="44" height="44" rx="11" fill="url(#seGrad)" />
        <rect width="44" height="44" rx="11" fill="url(#seShimmer)" />
        <rect x="12" y="24" width="20" height="14" rx="2.5" fill="white" opacity="0.95" />
        <rect x="18.5" y="30" width="7" height="8" rx="1.5" fill="#2E86AB" opacity="0.9" />
        <path d="M8 26 L22 12 L36 26" stroke="white" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        <circle cx="22" cy="9" r="3.5" fill="white" />
        <g transform="translate(31, 5.5)">
          <path d="M3 0 L3.7 2.3 L6 3 L3.7 3.7 L3 6 L2.3 3.7 L0 3 L2.3 2.3 Z" fill="white" opacity="0.85" />
        </g>
      </svg>

      {showText && (
        <span
          style={{
            fontFamily: "'Sora', 'Inter', sans-serif",
            fontWeight: 800,
            fontSize: size * 0.6 + "px",
            letterSpacing: "-0.5px",
            lineHeight: 1,
            color: light ? "#FFFFFF" : "#1A3C5E",
          }}
        >
          Stay<span style={{ color: light ? "rgba(255,255,255,0.75)" : "#2E86AB" }}>Easy</span>
        </span>
      )}
    </div>
  );
}
