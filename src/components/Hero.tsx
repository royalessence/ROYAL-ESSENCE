import React, { useState } from 'react';
import { ArrowRight, Compass, CheckCircle } from 'lucide-react';
import { Product } from '../types';
import { ArabianLantern, Islamic8PointStar } from './ArabianDecorations';
import { ProductImagePlaceholder } from './ProductImagePlaceholder';
import heroBgImage from '../assets/images/luxury_dark_marble_hero_bg_1794129839314.jpg';

interface HeroProps {
  products: Product[];
  onShopNow: () => void;
  onOpenScentFinder: () => void;
}

export const Hero: React.FC<HeroProps> = ({ products, onShopNow, onOpenScentFinder }) => {
  const [activeHeroIndex, setActiveHeroIndex] = useState(0);

  const heroShowcase = products.slice(0, 4);
  const currentItem = heroShowcase[activeHeroIndex] || products[0];

  return (
    <section className="relative min-h-[92vh] flex items-center justify-center overflow-hidden bg-[#070709]">
      {/* Layer 1: Luxury Dark Marble Architectural Boutique Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src={heroBgImage}
          alt="Royal Essence Luxury Dark Marble Boutique Interior"
          className="w-full h-full object-cover object-center filter brightness-[0.72] contrast-[1.08]"
        />
        {/* Measured Contrast Scrim for Pristine Text Legibility */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#070709]/95 via-[#0A0A0C]/85 to-[#070709]/60 lg:to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#070709] via-transparent to-[#070709]/75" />
      </div>

      {/* Layer 2: Subtle Golden Ambient Lighting & Geometric Star Tile Accent */}
      <div className="absolute inset-0 bg-islamic-girih opacity-15 pointer-events-none z-[1]" />
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-[#D4AF37]/18 via-[#F3CD68]/08 to-transparent blur-3xl pointer-events-none z-[1]" />
      <div className="absolute bottom-1/3 right-1/4 w-[600px] h-[400px] bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-[#AA8435]/15 via-transparent to-transparent blur-3xl pointer-events-none z-[1]" />

      {/* Layer 3: Hanging Arabian Golden Lanterns (Fanous) */}
      <div className="absolute top-0 left-6 sm:left-14 z-20 hidden md:block animate-lantern-sway pointer-events-none">
        <ArabianLantern size="md" />
      </div>
      <div className="absolute top-0 right-6 sm:right-14 z-20 hidden md:block animate-lantern-sway [animation-delay:2s] pointer-events-none">
        <ArabianLantern size="md" />
      </div>
      <div className="absolute top-0 left-1/3 z-20 hidden lg:block opacity-70 animate-lantern-sway [animation-delay:3.5s] pointer-events-none">
        <ArabianLantern size="sm" />
      </div>
      <div className="absolute top-0 right-1/3 z-20 hidden lg:block opacity-70 animate-lantern-sway [animation-delay:1s] pointer-events-none">
        <ArabianLantern size="sm" />
      </div>

      {/* Main Content Area */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-14 lg:py-24 w-full z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-10 lg:gap-10 items-center">
          {/* Left Column: Luxury Brand Hero Manifesto */}
          <div className="lg:col-span-7 flex flex-col items-start text-left">
            {/* Crown Kicker */}
            <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1 sm:py-1.5 bg-[#0E0E12]/90 border border-[#D4AF37]/50 rounded-full mb-4 sm:mb-6 shadow-[0_0_20px_rgba(212,175,55,0.2)] backdrop-blur-md">
              <Islamic8PointStar size={13} className="text-[#F3CD68]" />
              <span className="font-serif-royal text-[10px] sm:text-[11px] uppercase tracking-[0.24em] sm:tracking-[0.28em] text-[#F3CD68] font-bold">
                Royal Arabian Haute Parfumerie
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37] animate-pulse" />
            </div>

            {/* Main Brand Title */}
            <h1 className="font-serif-royal font-black text-3xl sm:text-5xl lg:text-6xl xl:text-7xl text-[#FAF6F0] leading-[1.08] tracking-wider mb-2.5 sm:mb-4">
              <span className="text-gold-gradient drop-shadow-[0_4px_25px_rgba(212,175,55,0.4)]">
                ROYAL ESSENCE
              </span>
            </h1>

            {/* Mandatory Tagline strictly preserved: Your Fragrance, Your Essence, Royal Essence */}
            <h2 className="font-serif-royal text-lg sm:text-2xl lg:text-3xl xl:text-4xl text-[#F3CD68] font-bold tracking-wide mb-4 sm:mb-6 drop-shadow-[0_2px_15px_rgba(243,205,104,0.25)]">
              Your Fragrance, Your Essence, Royal Essence
            </h2>

            {/* Brand Story & Value Proposition */}
            <p className="font-sans-body text-xs sm:text-sm lg:text-base text-[#E2D6C9]/90 max-w-xl leading-relaxed mb-6 sm:mb-8">
              Step into an opulent palace boutique of handcrafted Arabian Oud, rare aged Cambodian oils, and Mukhallats.
              Available in <strong className="text-[#F3CD68] font-bold">100 ML</strong>, <strong className="text-[#F3CD68] font-bold">300 ML</strong>, and <strong className="text-[#F3CD68] font-bold">500 ML</strong> sizes with original flacons and presentation boxes.
            </p>

            {/* CTA Buttons with Champagne Gold Styling (Touch-friendly 48px on mobile) */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 w-full sm:w-auto mb-6 sm:mb-10">
              <button
                onClick={onShopNow}
                className="group flex items-center justify-center gap-3 bg-gradient-to-r from-[#D4AF37] via-[#F3CD68] to-[#AA8435] text-[#070709] font-serif-royal font-bold text-xs uppercase tracking-[0.22em] px-6 sm:px-8 py-3.5 sm:py-4 rounded-xs hover:shadow-[0_6px_30px_rgba(243,205,104,0.5)] active:scale-[0.98] transition-all duration-300 min-h-[48px]"
              >
                <span>ENTER PALACE SHOWROOM</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
              </button>

              <button
                onClick={onOpenScentFinder}
                className="flex items-center justify-center gap-2.5 bg-[#0E0E12]/90 border border-[#D4AF37]/50 text-[#FAF6F0] font-serif-royal text-xs uppercase tracking-[0.2em] px-5 sm:px-7 py-3.5 sm:py-4 rounded-xs hover:border-[#F3CD68] hover:bg-[#1A120E] active:scale-[0.98] transition-all duration-300 shadow-[0_4px_20px_rgba(0,0,0,0.6)] backdrop-blur-md min-h-[48px]"
              >
                <Compass className="w-4 h-4 text-[#F3CD68]" />
                <span>Oud Signature Advisor</span>
              </button>
            </div>

            {/* Pillars: 3 Sizes, ৳10 Delivery, Mobile Pay */}
            <div className="grid grid-cols-3 gap-2 sm:gap-4 pt-4 sm:pt-6 border-t border-[#D4AF37]/25 w-full max-w-lg">
              <div className="p-2 sm:p-3 bg-[#0E0E12]/85 border-l-2 border-[#D4AF37] border-y border-r border-[#D4AF37]/20 rounded-r-xs backdrop-blur-md">
                <p className="font-serif-royal text-sm sm:text-base lg:text-lg font-bold text-[#F3CD68]">
                  3 Sizes
                </p>
                <p className="text-[9px] sm:text-[10px] lg:text-[11px] text-[#D4C3B3]/90 tracking-wider uppercase font-sans-body">
                  100ML · 300ML · 500ML
                </p>
              </div>

              <div className="p-2 sm:p-3 bg-[#0E0E12]/85 border-l-2 border-[#F3CD68] border-y border-r border-[#D4AF37]/20 rounded-r-xs backdrop-blur-md">
                <p className="font-serif-royal text-sm sm:text-base lg:text-lg font-bold text-[#F3CD68]">
                  ৳10 Delivery
                </p>
                <p className="text-[9px] sm:text-[10px] lg:text-[11px] text-[#D4C3B3]/90 tracking-wider uppercase font-sans-body">
                  All Bangladesh
                </p>
              </div>

              <div className="p-2 sm:p-3 bg-[#0E0E12]/85 border-l-2 border-[#AA8435] border-y border-r border-[#D4AF37]/20 rounded-r-xs backdrop-blur-md">
                <p className="font-serif-royal text-sm sm:text-base lg:text-lg font-bold text-[#F3CD68]">
                  Mobile Pay
                </p>
                <p className="text-[9px] sm:text-[10px] lg:text-[11px] text-[#D4C3B3]/90 tracking-wider uppercase font-sans-body">
                  bKash · Nagad · Rocket
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Hero Flacon Showcase in Luxury Dark Marble Frame */}
          <div className="lg:col-span-5 relative flex items-center justify-center">
            {/* Ambient Gold Glow Aura */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-[#F3CD68]/20 via-[#AA8435]/15 to-transparent blur-3xl pointer-events-none" />

            <div className="relative group w-full max-w-md lg:max-w-none">
              {/* Luxury Obsidian Card Frame with Champagne Gold Hairline */}
              <div className="relative overflow-hidden rounded-t-[36px] rounded-b-xs border border-[#D4AF37]/60 shadow-[0_20px_60px_rgba(0,0,0,0.95)] bg-gradient-to-b from-[#121217] via-[#0E0E12] to-[#1A120E] p-5 backdrop-blur-xl">
                {/* Decorative Top Filigree Accent */}
                <div className="flex items-center justify-center gap-2 mb-3">
                  <span className="w-8 h-[1px] bg-gradient-to-r from-transparent to-[#D4AF37]" />
                  <Islamic8PointStar size={16} />
                  <span className="font-serif-royal text-[10px] uppercase tracking-[0.25em] text-[#F3CD68] font-bold">
                    ORIGINAL ARABIAN FLACON
                  </span>
                  <Islamic8PointStar size={16} />
                  <span className="w-8 h-[1px] bg-gradient-to-l from-transparent to-[#D4AF37]" />
                </div>

                {/* Active Photo Display */}
                {currentItem && (
                  <div className="relative aspect-[3/4] max-h-[350px] w-full bg-[#070709] rounded-t-[24px] rounded-b-xs overflow-hidden flex items-center justify-center p-3 mb-4 border border-[#D4AF37]/30 shadow-inner">
                    {/* Subtle Geometric Girih in Display */}
                    <div className="absolute inset-0 bg-islamic-girih opacity-15 pointer-events-none" />

                    {currentItem.image && currentItem.image.trim() !== '' ? (
                      <img
                        src={currentItem.image}
                        alt={currentItem.name}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-contain filter drop-shadow-[0_14px_30px_rgba(0,0,0,0.95)] transition-all duration-300"
                      />
                    ) : (
                      <ProductImagePlaceholder name={currentItem.name} size="lg" className="w-full h-full" />
                    )}

                    <div className="absolute top-2.5 left-2.5 bg-[#0E0E12]/90 border border-[#D4AF37]/50 text-[#F3CD68] font-serif-royal font-bold text-[10px] uppercase px-2.5 py-1 tracking-wider shadow backdrop-blur-sm">
                      {currentItem.category === 'attar' ? 'Pure Attar' : 'Arabic Fragrance'}
                    </div>

                    <div className="absolute bottom-2.5 right-2.5 bg-[#0E0E12]/95 border border-[#D4AF37]/55 px-3 py-1.5 text-right shadow-lg">
                      <span className="text-[10px] text-[#D4C3B3] block uppercase font-serif-royal">
                        100 ML Price
                      </span>
                      <span className="font-serif-royal font-bold text-base sm:text-lg text-[#F3CD68] tabular-nums">
                        ৳{currentItem.prices['100 ML']} BDT
                      </span>
                    </div>
                  </div>
                )}

                {/* Selectable Thumbnails for the 4 perfumes */}
                <div className={`grid ${heroShowcase.length >= 4 ? 'grid-cols-4' : 'grid-cols-3'} gap-1.5`}>
                  {heroShowcase.map((item, idx) => {
                    const isSelected = activeHeroIndex === idx;
                    return (
                      <button
                        key={item.name}
                        onClick={() => setActiveHeroIndex(idx)}
                        className={`p-2 border rounded-xs text-left transition-all ${
                          isSelected
                            ? 'bg-[#1A120E] border-[#F3CD68] shadow-[0_0_15px_rgba(243,205,104,0.35)]'
                            : 'bg-[#0E0E12]/80 border-[#D4AF37]/25 hover:border-[#D4AF37]/60 opacity-80 hover:opacity-100'
                        }`}
                      >
                        <div className="w-full h-12 bg-[#070709] rounded-xs mb-1.5 overflow-hidden flex items-center justify-center border border-[#D4AF37]/15">
                          {item.image && item.image.trim() !== '' ? (
                            <img
                              src={item.image}
                              alt={item.name}
                              referrerPolicy="no-referrer"
                              className="w-full h-full object-contain p-1"
                            />
                          ) : (
                            <ProductImagePlaceholder size="sm" className="w-full h-full p-0.5" />
                          )}
                        </div>
                        <span className="font-serif-royal font-bold text-xs text-[#FAF6F0] block truncate">
                          {item.name}
                        </span>
                        <span className="text-[10px] text-[#F3CD68] font-semibold tabular-nums">
                          ৳{item.prices['100 ML']}
                        </span>
                      </button>
                    );
                  })}
                </div>

                {/* Guarantee Banner */}
                <div className="mt-4 pt-3 border-t border-[#D4AF37]/25 flex items-center justify-between text-xs text-[#D4C3B3] font-sans-body">
                  <span className="flex items-center gap-1.5 text-[#E2D6C9] font-medium">
                    <CheckCircle className="w-3.5 h-3.5 text-[#D4AF37]" />
                    Original Bottle & Packaging Guaranteed
                  </span>
                  <span className="text-[#F3CD68] font-semibold">Flat ৳10 Delivery</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
