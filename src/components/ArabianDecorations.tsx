import React from 'react';

/**
 * Authentic Arabian Brass Lantern (Fanous) SVG with warm golden glow
 */
export const ArabianLantern: React.FC<{
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  glowColor?: string;
}> = ({ size = 'md', className = '', glowColor = '#F3CD68' }) => {
  const dimensions =
    size === 'sm' ? { w: 32, h: 64 } : size === 'lg' ? { w: 60, h: 120 } : { w: 44, h: 90 };

  return (
    <div className={`relative flex flex-col items-center select-none ${className}`}>
      {/* Hanging Chain */}
      <div className="w-[1.5px] h-6 bg-gradient-to-b from-[#AA8435] via-[#D4AF37] to-[#F3CD68]" />

      {/* Hanging Ring */}
      <div className="w-3.5 h-3.5 rounded-full border border-[#D4AF37] -my-1" />

      {/* Golden Lantern Body */}
      <svg
        width={dimensions.w}
        height={dimensions.h}
        viewBox="0 0 50 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="filter drop-shadow-[0_0_12px_rgba(243,205,104,0.6)]"
      >
        <defs>
          <linearGradient id="brassGold" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFF2D6" />
            <stop offset="30%" stopColor="#F3CD68" />
            <stop offset="70%" stopColor="#D4AF37" />
            <stop offset="100%" stopColor="#7E5616" />
          </linearGradient>
          <radialGradient id="lampLight" cx="50%" cy="55%" r="45%">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.9" />
            <stop offset="35%" stopColor="#FDE68A" stopOpacity="0.8" />
            <stop offset="75%" stopColor="#F59E0B" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#D97706" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Crescent Finial */}
        <path
          d="M25 2 C28 2 29 5 27 7 C25 9 22 7 23 4 C24 3 24.5 2 25 2 Z"
          fill="url(#brassGold)"
        />

        {/* Dome Cap */}
        <path
          d="M17 12 C17 7 33 7 33 12 L38 22 C38 24 12 24 12 22 Z"
          fill="url(#brassGold)"
          stroke="#AA8435"
          strokeWidth="0.8"
        />

        {/* Pierced ventilation filigree */}
        <circle cx="21" cy="18" r="1.2" fill="#040E1A" />
        <circle cx="25" cy="18" r="1.4" fill="#040E1A" />
        <circle cx="29" cy="18" r="1.2" fill="#040E1A" />

        {/* Glass Glow Area */}
        <path
          d="M14 26 L36 26 L41 62 L9 62 Z"
          fill="url(#lampLight)"
        />

        {/* Glass Outer Filigree Ribs */}
        <path
          d="M14 26 L36 26 L41 62 L9 62 Z"
          fill="none"
          stroke="url(#brassGold)"
          strokeWidth="1.2"
        />

        {/* Internal Arabesque lattice bars */}
        <line x1="25" y1="26" x2="25" y2="62" stroke="url(#brassGold)" strokeWidth="1.2" />
        <line x1="14" y1="26" x2="31" y2="62" stroke="url(#brassGold)" strokeWidth="0.8" strokeOpacity="0.7" />
        <line x1="36" y1="26" x2="19" y2="62" stroke="url(#brassGold)" strokeWidth="0.8" strokeOpacity="0.7" />

        {/* Lantern Core Glow Bulb */}
        <circle cx="25" cy="46" r="5" fill="#FFFBEB" filter="drop-shadow(0 0 6px #FBBF24)" />

        {/* Base Tier & Feet */}
        <path
          d="M11 63 L39 63 L36 74 L14 74 Z"
          fill="url(#brassGold)"
          stroke="#AA8435"
          strokeWidth="0.8"
        />
        <path
          d="M20 74 L30 74 L25 80 Z"
          fill="url(#brassGold)"
        />
      </svg>
    </div>
  );
};

/**
 * Arabian Islamic 8-Point Star Ornament (Rub el Hizb)
 */
export const Islamic8PointStar: React.FC<{ size?: number; className?: string }> = ({
  size = 18,
  className = '',
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`shrink-0 ${className}`}
    >
      <rect
        x="4"
        y="4"
        width="16"
        height="16"
        fill="#D4AF37"
        fillOpacity="0.25"
        stroke="#D4AF37"
        strokeWidth="1.5"
      />
      <rect
        x="4"
        y="4"
        width="16"
        height="16"
        transform="rotate(45 12 12)"
        fill="#D4AF37"
        fillOpacity="0.25"
        stroke="#D4AF37"
        strokeWidth="1.5"
      />
      <circle cx="12" cy="12" r="2.5" fill="#F3CD68" />
    </svg>
  );
};

/**
 * Arabian Architectural Arch Section Divider
 */
export const ArabianPalaceArchDivider: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div className={`relative w-full flex items-center justify-center my-6 overflow-hidden ${className}`}>
      {/* Left Golden Filigree Bar */}
      <div className="flex-1 h-[1.5px] bg-gradient-to-r from-transparent via-[#231A15] to-[#D4AF37]" />

      {/* Central Moorish Arch Motif in Obsidian & Gold */}
      <div className="flex items-center gap-2 px-4 py-1.5 bg-[#0E0E12] border border-[#D4AF37]/50 rounded-full shadow-[0_0_15px_rgba(212,175,55,0.25)] backdrop-blur-md">
        <span className="w-1.5 h-1.5 rotate-45 bg-[#D4AF37]" />
        <Islamic8PointStar size={14} className="text-[#F3CD68]" />
        <span className="font-serif-royal text-[10px] uppercase tracking-[0.25em] text-[#F3CD68] font-bold">
          ARABIAN ROYAL ESSENCE
        </span>
        <Islamic8PointStar size={14} className="text-[#F3CD68]" />
        <span className="w-1.5 h-1.5 rotate-45 bg-[#D4AF37]" />
      </div>

      {/* Right Golden Filigree Bar */}
      <div className="flex-1 h-[1.5px] bg-gradient-to-l from-transparent via-[#231A15] to-[#D4AF37]" />
    </div>
  );
};
