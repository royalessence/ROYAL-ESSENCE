import React from 'react';

interface ProductImagePlaceholderProps {
  name?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const ProductImagePlaceholder: React.FC<ProductImagePlaceholderProps> = ({
  name,
  size = 'md',
  className = '',
}) => {
  const isSm = size === 'sm';
  const isLg = size === 'lg';

  return (
    <div
      className={`relative w-full h-full flex flex-col items-center justify-center bg-gradient-to-b from-[#04101A] via-[#061522] to-[#0B080C] border border-[#D4AF37]/25 rounded-xs p-3 overflow-hidden select-none ${className}`}
    >
      {/* Subtle geometric pattern backdrop */}
      <div className="absolute inset-0 bg-islamic-girih opacity-10 pointer-events-none" />

      {/* Decorative Golden Corner Accents */}
      <div className="absolute top-1.5 left-1.5 w-2 h-2 border-t border-l border-[#D4AF37]/40" />
      <div className="absolute top-1.5 right-1.5 w-2 h-2 border-t border-r border-[#D4AF37]/40" />
      <div className="absolute bottom-1.5 left-1.5 w-2 h-2 border-b border-l border-[#D4AF37]/40" />
      <div className="absolute bottom-1.5 right-1.5 w-2 h-2 border-b border-r border-[#D4AF37]/40" />

      {/* Elegant Perfume Flacon Minimal Outline SVG */}
      <div className="relative flex flex-col items-center justify-center">
        <svg
          viewBox="0 0 64 88"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={`${
            isSm ? 'w-6 h-8' : isLg ? 'w-20 h-28' : 'w-12 h-16'
          } text-[#D4AF37]/40 transition-transform duration-300 group-hover:scale-105`}
        >
          {/* Cap / Crown */}
          <rect x="24" y="4" width="16" height="12" rx="2" stroke="currentColor" strokeWidth="1.5" />
          <path d="M28 4V16M36 4V16" stroke="currentColor" strokeWidth="1" opacity="0.6" />
          <rect x="28" y="16" width="8" height="6" stroke="currentColor" strokeWidth="1.5" />

          {/* Shoulders & Bottle Body */}
          <path
            d="M16 26 C16 22, 22 22, 28 22 L36 22 C42 22, 48 22, 48 26 L52 46 C53 52, 53 74, 50 80 C48 84, 44 84, 32 84 C20 84, 16 84, 14 80 C11 74, 11 52, 12 46 Z"
            stroke="currentColor"
            strokeWidth="1.5"
          />

          {/* Center Emblem / Medallion */}
          <circle cx="32" cy="52" r="10" stroke="currentColor" strokeWidth="1" strokeDasharray="2 2" opacity="0.7" />
          <polygon
            points="32,46 34,50 38,52 34,54 32,58 30,54 26,52 30,50"
            fill="currentColor"
            opacity="0.3"
          />
        </svg>

        {/* Text Details */}
        {!isSm && (
          <div className="mt-2 text-center">
            {name && (
              <span className="font-serif-royal font-bold text-xs text-[#FFFFFF] tracking-wider block max-w-[180px] truncate">
                {name}
              </span>
            )}
            <span className="text-[10px] uppercase font-serif-royal text-[#D4AF37]/70 tracking-widest block mt-0.5">
              Photo Coming Soon
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
