import React from 'react';
import { Product } from '../types';
import { Sparkles, Flame, Clock, Award, Layers, ShieldCheck } from 'lucide-react';
import { Islamic8PointStar } from './ArabianDecorations';

interface FragranceDetailsSectionProps {
  product: Product;
  compact?: boolean;
}

export const FragranceDetailsSection: React.FC<FragranceDetailsSectionProps> = ({
  product,
  compact = false,
}) => {
  // Universal standard notes across all Royal Essence perfumes
  const topNotes = product.notes.top && product.notes.top.length > 0
    ? product.notes.top
    : ['Sweet Citrus', 'Caramelized Saffron', 'Velvet Bergamot'];

  const middleNotes = product.notes.middle && product.notes.middle.length > 0
    ? product.notes.middle
    : (product.notes.heart && product.notes.heart.length > 0
      ? product.notes.heart
      : ['Sweet Amber', 'Royal Jasmine', 'Warm Spices']);

  const baseNotes = product.notes.base && product.notes.base.length > 0
    ? product.notes.base
    : ['Rich Agarwood (Oud)', 'Sweet Madagascar Vanilla', 'Golden Musk'];

  const fragranceTypes = product.fragranceTypes && product.fragranceTypes.length > 0
    ? product.fragranceTypes
    : ['Sweet Fragrance', 'Strong Fragrance'];

  const longevityText = product.longevity || 'LONG LASTING';

  if (compact) {
    return (
      <div className="space-y-3 p-3 bg-gradient-to-br from-[#0B0A08] to-[#14100A] border border-[#D4AF37]/30 rounded-xs">
        {/* Fragrance Type & Longevity Row */}
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 flex-wrap">
            {fragranceTypes.map((type) => (
              <span
                key={type}
                className="inline-flex items-center gap-1 text-[10px] font-serif-royal font-bold tracking-wider uppercase px-2 py-0.5 bg-[#1B140B] border border-[#D4AF37]/50 text-[#F3CD68] rounded-xs shadow-sm"
              >
                <Sparkles className="w-2.5 h-2.5 text-[#D4AF37]" />
                {type}
              </span>
            ))}
          </div>

          <div className="inline-flex items-center gap-1.5 text-[10px] font-serif-royal font-extrabold uppercase tracking-widest text-[#2DD4BF] bg-[#06241C] border border-[#10B981]/40 px-2 py-0.5 rounded-xs">
            <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-pulse" />
            {longevityText}
          </div>
        </div>

        {/* Notes preview */}
        <div className="space-y-1.5 text-[11px] pt-1 border-t border-[#D4AF37]/20">
          <div className="flex items-baseline gap-1.5">
            <span className="font-serif-royal text-[#AA8435] text-[10px] uppercase font-bold shrink-0">
              Top Notes:
            </span>
            <span className="text-[#F5EBDD]/90 truncate">{topNotes.join(' · ')}</span>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="font-serif-royal text-[#AA8435] text-[10px] uppercase font-bold shrink-0">
              Middle Notes:
            </span>
            <span className="text-[#F5EBDD]/90 truncate">{middleNotes.join(' · ')}</span>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="font-serif-royal text-[#AA8435] text-[10px] uppercase font-bold shrink-0">
              Base Notes:
            </span>
            <span className="text-[#F5EBDD]/90 truncate">{baseNotes.join(' · ')}</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-[#0F0C08] via-[#14100A] to-[#0A0806] border border-[#D4AF37]/40 rounded-xs p-5 sm:p-6 shadow-[0_12px_40px_rgba(0,0,0,0.85)] mb-6">
      {/* Decorative Gold Header Bar */}
      <div className="flex items-center justify-between pb-3.5 mb-4 border-b border-[#D4AF37]/25">
        <div className="flex items-center gap-2">
          <Islamic8PointStar size={16} className="text-[#F3CD68]" />
          <h3 className="font-serif-royal text-sm sm:text-base font-bold uppercase tracking-[0.2em] text-[#FFFFFF]">
            Fragrance Details & Olfactory Profile
          </h3>
        </div>
        <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-serif-royal uppercase tracking-widest text-[#D4AF37] opacity-80">
          <ShieldCheck className="w-3.5 h-3.5" />
          Authentic Blend
        </span>
      </div>

      {/* 1. Fragrance Characteristics & 2. Longevity Highlight Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-5">
        {/* Sweet Fragrance Badge */}
        <div className="flex items-center gap-3 p-3 bg-[#18120B] border border-[#D4AF37]/35 rounded-xs hover:border-[#D4AF37]/70 transition-colors">
          <div className="w-8 h-8 rounded-full bg-[#271B0F] border border-[#D4AF37]/50 flex items-center justify-center shrink-0 text-[#F3CD68]">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <span className="block text-[9px] font-sans-body uppercase tracking-wider text-[#AA8435]">
              Scent Characteristic
            </span>
            <span className="font-serif-royal font-bold text-xs sm:text-sm text-[#FFFFFF] tracking-wide">
              Sweet Fragrance
            </span>
          </div>
        </div>

        {/* Strong Fragrance Badge */}
        <div className="flex items-center gap-3 p-3 bg-[#18120B] border border-[#D4AF37]/35 rounded-xs hover:border-[#D4AF37]/70 transition-colors">
          <div className="w-8 h-8 rounded-full bg-[#271B0F] border border-[#D4AF37]/50 flex items-center justify-center shrink-0 text-[#F3CD68]">
            <Flame className="w-4 h-4" />
          </div>
          <div>
            <span className="block text-[9px] font-sans-body uppercase tracking-wider text-[#AA8435]">
              Sillage & Projection
            </span>
            <span className="font-serif-royal font-bold text-xs sm:text-sm text-[#FFFFFF] tracking-wide">
              Strong Fragrance
            </span>
          </div>
        </div>

        {/* Premium Longevity Indicator */}
        <div className="flex flex-col justify-center p-3 bg-gradient-to-r from-[#07251C] to-[#0A1A2E] border border-[#10B981]/50 rounded-xs relative overflow-hidden">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[9px] font-sans-body uppercase tracking-wider text-[#A7F3D0]">
              Performance
            </span>
            <span className="inline-flex items-center gap-1 text-[9px] text-[#34D399] font-mono font-bold">
              <Clock className="w-2.5 h-2.5" />
              18–24+ Hours
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="font-serif-royal font-extrabold text-xs sm:text-sm text-[#F3CD68] uppercase tracking-wider">
              {longevityText}
            </span>
            {/* Visual Gold Longevity Indicator Gauge */}
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((i) => (
                <span
                  key={i}
                  className="w-2 h-3.5 rounded-2xs bg-gradient-to-t from-[#D4AF37] to-[#F3CD68] shadow-[0_0_6px_rgba(243,205,104,0.6)]"
                />
              ))}
            </div>
          </div>
          {/* Subtle Golden Glow Shimmer */}
          <div className="w-full bg-[#051410] h-1 rounded-full overflow-hidden mt-1.5">
            <div className="h-full bg-gradient-to-r from-[#10B981] via-[#F3CD68] to-[#D4AF37] w-full" />
          </div>
        </div>
      </div>

      {/* 3. Fragrance Notes Architecture (Top, Middle, Base) */}
      <div className="bg-[#090705] border border-[#D4AF37]/30 rounded-xs p-4 sm:p-5">
        <div className="flex items-center justify-between mb-3.5 pb-2 border-b border-[#D4AF37]/20">
          <div className="flex items-center gap-2">
            <Layers className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span className="font-serif-royal text-[11px] font-bold uppercase tracking-[0.2em] text-[#D4AF37]">
              Olfactory Notes Pyramid
            </span>
          </div>
          <span className="text-[10px] text-[#EED9C4]/60 font-sans-body">
            Consistent Master Formulation
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {/* Top Notes */}
          <div className="p-3 bg-[#140E0A] border border-[#D4AF37]/25 rounded-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-1.5 mb-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#F3CD68]" />
                <h4 className="font-serif-royal text-xs font-bold uppercase tracking-wider text-[#F3CD68]">
                  Top Notes
                </h4>
              </div>
              <p className="text-[10px] text-[#AA8435] uppercase font-sans-body mb-2 tracking-wider">
                Initial Scent Impression
              </p>
              <ul className="space-y-1">
                {topNotes.map((note) => (
                  <li
                    key={note}
                    className="text-xs text-[#F5EBDD] font-sans-body flex items-center gap-1.5"
                  >
                    <span className="text-[#D4AF37]/50 text-[10px]">·</span>
                    <span>{note}</span>
                  </li>
                ))}
              </ul>
            </div>
            <span className="text-[9px] text-[#D4AF37]/70 font-editorial italic mt-3 pt-2 border-t border-[#D4AF37]/15">
              Radiates first 30–60 minutes
            </span>
          </div>

          {/* Middle Notes */}
          <div className="p-3 bg-[#140E0A] border border-[#D4AF37]/25 rounded-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-1.5 mb-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#E5C365]" />
                <h4 className="font-serif-royal text-xs font-bold uppercase tracking-wider text-[#E5C365]">
                  Middle Notes
                </h4>
              </div>
              <p className="text-[10px] text-[#AA8435] uppercase font-sans-body mb-2 tracking-wider">
                Heart of the Fragrance
              </p>
              <ul className="space-y-1">
                {middleNotes.map((note) => (
                  <li
                    key={note}
                    className="text-xs text-[#F5EBDD] font-sans-body flex items-center gap-1.5"
                  >
                    <span className="text-[#D4AF37]/50 text-[10px]">·</span>
                    <span>{note}</span>
                  </li>
                ))}
              </ul>
            </div>
            <span className="text-[9px] text-[#D4AF37]/70 font-editorial italic mt-3 pt-2 border-t border-[#D4AF37]/15">
              Unfolds richly from 1–6 hours
            </span>
          </div>

          {/* Base Notes */}
          <div className="p-3 bg-[#140E0A] border border-[#D4AF37]/25 rounded-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-1.5 mb-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#AA8435]" />
                <h4 className="font-serif-royal text-xs font-bold uppercase tracking-wider text-[#AA8435]">
                  Base Notes
                </h4>
              </div>
              <p className="text-[10px] text-[#AA8435] uppercase font-sans-body mb-2 tracking-wider">
                Deep Lasting Foundation
              </p>
              <ul className="space-y-1">
                {baseNotes.map((note) => (
                  <li
                    key={note}
                    className="text-xs text-[#F5EBDD] font-sans-body flex items-center gap-1.5"
                  >
                    <span className="text-[#D4AF37]/50 text-[10px]">·</span>
                    <span>{note}</span>
                  </li>
                ))}
              </ul>
            </div>
            <span className="text-[9px] text-[#D4AF37]/70 font-editorial italic mt-3 pt-2 border-t border-[#D4AF37]/15">
              Lingers on clothes 18–24+ hours
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
