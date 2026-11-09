import React from 'react';

interface RoyalLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showTagline?: boolean;
  className?: string;
}

export const RoyalLogo: React.FC<RoyalLogoProps> = ({
  size = 'md',
  showTagline = false,
  className = '',
}) => {
  const iconDimensions = {
    sm: 'w-7 h-7',
    md: 'w-9 h-9',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16',
  }[size];

  const titleSize = {
    sm: 'text-sm tracking-[0.25em]',
    md: 'text-base sm:text-lg tracking-[0.28em]',
    lg: 'text-xl sm:text-2xl tracking-[0.32em]',
    xl: 'text-2xl sm:text-3xl tracking-[0.35em]',
  }[size];

  return (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      {/* Golden Crown & RE Monogram Emblem */}
      <div className={`relative ${iconDimensions} flex items-center justify-center shrink-0`}>
        <svg
          viewBox="0 0 100 100"
          className="w-full h-full filter drop-shadow-[0_2px_8px_rgba(212,175,55,0.4)]"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="royalGoldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFF2D6" />
              <stop offset="30%" stopColor="#D4AF37" />
              <stop offset="70%" stopColor="#AA8435" />
              <stop offset="100%" stopColor="#F5EBDD" />
            </linearGradient>
            <linearGradient id="shieldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#1A1813" />
              <stop offset="100%" stopColor="#080705" />
            </linearGradient>
          </defs>

          {/* Royal Shield Background */}
          <path
            d="M50 5 L85 20 V52 C85 75 50 95 50 95 C50 95 15 75 15 52 V20 Z"
            fill="url(#shieldGrad)"
            stroke="url(#royalGoldGrad)"
            strokeWidth="2.5"
          />

          {/* Inner hairline border */}
          <path
            d="M50 11 L79 24 V50 C79 70 50 87 50 87 C50 87 21 70 21 50 V24 Z"
            stroke="url(#royalGoldGrad)"
            strokeWidth="0.8"
            strokeDasharray="2 1.5"
            opacity="0.6"
          />

          {/* Golden Royal Crown */}
          <g transform="translate(25, 20) scale(0.5)">
            {/* Crown Base */}
            <path
              d="M10 55 L90 55 L85 64 L15 64 Z"
              fill="url(#royalGoldGrad)"
            />
            {/* Crown Band Pearls */}
            <circle cx="25" cy="59.5" r="2" fill="#FFF" />
            <circle cx="50" cy="59.5" r="2.5" fill="#FFF" />
            <circle cx="75" cy="59.5" r="2" fill="#FFF" />
            {/* Crown Peaks */}
            <path
              d="M12 55 L20 25 L38 42 L50 15 L62 42 L80 25 L88 55 Z"
              fill="url(#royalGoldGrad)"
            />
            {/* Jewels on Crown Tips */}
            <circle cx="20" cy="23" r="3" fill="#FFF" />
            <circle cx="50" cy="12" r="4.5" fill="#FFF" />
            <circle cx="80" cy="23" r="3" fill="#FFF" />
            <circle cx="38" cy="40" r="2" fill="#D4AF37" />
            <circle cx="62" cy="40" r="2" fill="#D4AF37" />
          </g>

          {/* Ornate 'RE' Monogram */}
          <text
            x="50"
            y="72"
            fontFamily="'Cinzel', serif"
            fontSize="26"
            fontWeight="bold"
            fill="url(#royalGoldGrad)"
            textAnchor="middle"
            letterSpacing="-0.04em"
          >
            RE
          </text>
        </svg>
      </div>

      {/* Brand Wordmark & Tagline */}
      <div className="flex flex-col">
        <span
          className={`font-serif-royal font-bold uppercase ${titleSize} text-gold-gradient leading-none`}
        >
          ROYAL ESSENCE
        </span>
        {showTagline && (
          <span className="font-editorial italic text-xs sm:text-sm tracking-[0.16em] text-[#D4AF37]/80 mt-1">
            Experience the Royal Fragrance
          </span>
        )}
      </div>
    </div>
  );
};
