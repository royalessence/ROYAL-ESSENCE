import React, { useState } from 'react';
import { X, Truck } from 'lucide-react';
import { Islamic8PointStar } from './ArabianDecorations';

export const AnnouncementBar: React.FC = () => {
  const [isVisible, setIsVisible] = useState(() => {
    try {
      return localStorage.getItem('royal_essence_announcement_dismissed') !== 'true';
    } catch {
      return true;
    }
  });

  const handleDismiss = () => {
    setIsVisible(false);
    try {
      localStorage.setItem('royal_essence_announcement_dismissed', 'true');
    } catch {}
  };

  if (!isVisible) return null;

  return (
    <div className="relative bg-gradient-to-r from-[#070709] via-[#1A120E] to-[#0A0A0C] border-b border-[#D4AF37]/30 text-[#FAF6F0] text-xs py-2 px-4 z-40 shadow-md">
      {/* Subtle Islamic Girih geometric pattern */}
      <div className="absolute inset-0 bg-islamic-girih opacity-20 pointer-events-none" />

      <div className="relative max-w-7xl mx-auto flex items-center justify-between gap-4">
        <div className="hidden lg:flex items-center gap-2 text-[#F3CD68] font-medium tracking-wider uppercase text-[11px]">
          <Truck className="w-3.5 h-3.5 shrink-0 text-[#D4AF37]" />
          <span>Arabian Luxury Dispatch · Flat ৳10 Delivery Across Bangladesh</span>
        </div>

        <div className="flex-1 flex items-center justify-center gap-2 sm:gap-4 text-center">
          <span className="inline-flex items-center gap-1.5 font-editorial tracking-[0.14em] text-xs sm:text-sm text-[#FAF6F0]">
            <Islamic8PointStar size={13} className="text-[#F3CD68]" />
            <strong className="text-gold-gradient font-bold tracking-wider">ROYAL ESSENCE</strong>
            <span className="text-[#D4C3B3]">
              — Experience the Royal Fragrance —
            </span>
          </span>
          <span className="hidden sm:inline-block text-[#D4AF37]/40">|</span>
          <span className="hidden sm:inline-flex items-center gap-1.5 text-[11px] text-[#E2D6C9]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37] animate-ping" />
            100% Authentic Flacons & Box Packaging
          </span>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <span className="text-[11px] text-[#F3CD68] hidden md:inline-block font-serif-royal uppercase tracking-wider">
            bKash · Nagad · Rocket
          </span>
          <button
            onClick={handleDismiss}
            aria-label="Dismiss announcement permanently"
            className="text-[#D4AF37]/70 hover:text-[#FFFFFF] transition-colors p-1"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
