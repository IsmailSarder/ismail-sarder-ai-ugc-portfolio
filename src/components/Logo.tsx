import React from 'react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  showSubtitle?: boolean;
  className?: string;
}

export const Logo: React.FC<LogoProps> = ({
  size = 'md',
  showSubtitle = true,
  className = '',
}) => {
  const dimensions = {
    sm: { symbol: 32, title: 'text-sm', sub: 'text-[9px]' },
    md: { symbol: 40, title: 'text-base', sub: 'text-[10px]' },
    lg: { symbol: 52, title: 'text-xl', sub: 'text-xs' },
  }[size];

  return (
    <a
      href="#home"
      className={`inline-flex items-center gap-3 group focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C7F36B] rounded-lg transition-transform duration-200 active:scale-[0.98] ${className}`}
      aria-label="Ismail Sarder - AI UGC Creative Studio Homepage"
    >
      {/* Unique Geometric IS Monogram SVG */}
      <div className="relative shrink-0 flex items-center justify-center">
        <svg
          width={dimensions.symbol}
          height={dimensions.symbol}
          viewBox="0 0 44 44"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="transition-transform duration-300 group-hover:scale-105"
        >
          {/* Studio Dark Backplate with subtle border */}
          <rect
            width="44"
            height="44"
            rx="10"
            fill="#111514"
            stroke="#2A332B"
            strokeWidth="1.5"
          />

          {/* Subtle Ambient Radial Highlight */}
          <circle cx="22" cy="22" r="14" fill="#C7F36B" fillOpacity="0.08" />

          {/* 'I' Component: Architectural clean vertical stem in Crisp Studio White */}
          <path
            d="M13 11.5H18.5V32.5H13V11.5Z"
            fill="#F5F5F0"
          />

          {/* 'S' Component: Dynamic geometric continuous ribbon in Electric Lime */}
          <path
            d="M22 15C22 13.067 23.567 11.5 25.5 11.5H32.5V16.5H26.5V20H29.5C31.709 20 33.5 21.791 33.5 24V28C33.5 30.485 31.485 32.5 29 32.5H21.5V27.5H28.5V24.5H25C23.343 24.5 22 23.157 22 21.5V15Z"
            fill="#C7F36B"
          />

          {/* Focal Precision Aperture Dot */}
          <rect
            x="30"
            y="11.5"
            width="2.5"
            height="2.5"
            rx="0.5"
            fill="#C7F36B"
          />
        </svg>
      </div>

      {/* Brand Typography Lockup */}
      <div className="flex flex-col justify-center leading-tight">
        <span
          className={`font-heading font-extrabold tracking-wider text-[#F5F5F0] group-hover:text-[#C7F36B] transition-colors duration-200 ${dimensions.title}`}
        >
          ISMAIL SARDER
        </span>
        {showSubtitle && (
          <span
            className={`font-sans font-semibold tracking-widest text-[#A0A89F] uppercase ${dimensions.sub} mt-0.5`}
          >
            AI UGC CREATIVE STUDIO
          </span>
        )}
      </div>
    </a>
  );
};
