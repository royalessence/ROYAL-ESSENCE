import React from 'react';
import { Gift, Sparkles, Feather, ShieldCheck, ArrowRight } from 'lucide-react';
import { Perfume, VolumeOption } from '../types';
import { ProductImagePlaceholder } from './ProductImagePlaceholder';

interface ExclusiveOffersBannerProps {
  discoveryCoffret: Perfume;
  onAddToCart: (perfume: Perfume, volume: VolumeOption) => void;
  onBuyNow: (perfume: Perfume, volume: VolumeOption) => void;
  onQuickView: (perfume: Perfume) => void;
}

export const ExclusiveOffersBanner: React.FC<ExclusiveOffersBannerProps> = ({
  discoveryCoffret,
  onAddToCart,
  onBuyNow,
  onQuickView,
}) => {
  return (
    <section className="py-20 bg-gradient-to-b from-[#050505] via-[#0E0C08] to-[#050505] relative overflow-hidden">
      {/* Decorative hairline */}
      <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-[#D4AF37]/30 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Banner 1: The Royal Discovery Coffret Spotlight */}
        <div className="relative border border-[#D4AF37]/40 bg-[#0B0A07] rounded-xs p-6 sm:p-10 lg:p-12 mb-16 shadow-[0_10px_40px_rgba(0,0,0,0.8)]">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Visual Box Picture */}
            <div className="lg:col-span-6 relative group">
              <div className="relative overflow-hidden border border-[#D4AF37]/30 rounded-xs bg-[#050505]">
                {discoveryCoffret.image ? (
                  <img
                    src={discoveryCoffret.image}
                    alt={discoveryCoffret.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                  />
                ) : (
                  <ProductImagePlaceholder name={discoveryCoffret.name} size="lg" className="w-full h-64" />
                )}
                <div className="absolute top-3 left-3 bg-[#D4AF37] text-[#050505] font-serif-royal font-bold text-xs uppercase px-2.5 py-1 tracking-wider shadow">
                  Exclusive Gift Set · 25% OFF
                </div>
              </div>
            </div>

            {/* Offer details & CTAs */}
            <div className="lg:col-span-6 flex flex-col items-start">
              <div className="flex items-center gap-2 mb-3">
                <Gift className="w-4 h-4 text-[#D4AF37]" />
                <span className="font-serif-royal text-xs text-[#D4AF37] uppercase tracking-[0.25em]">
                  Limited Royal Edition
                </span>
              </div>

              <h3 className="font-serif-royal text-2xl sm:text-3xl lg:text-4xl text-[#FFFFFF] font-bold mb-3 tracking-wide">
                The Royal Discovery Coffret
              </h3>

              <p className="font-editorial text-base sm:text-lg text-[#F5EBDD]/80 mb-4 italic">
                Experience five iconic extraits de parfum (5 x 15ml) in a velvet-lined jewelry presentation box.
              </p>

              <p className="font-sans-body text-xs sm:text-sm text-[#F5EBDD]/70 leading-relaxed mb-6">
                Includes miniature crown flacons of Royal Oudh Noir, Imperial Rose Gold, Sovereign Amber Gold,
                Nocturne Sapphire, and Crown Emerald Vetiver. Each coffret includes a complimentary ৳2,000 voucher
                redeemable on your first full-size 100ml purchase.
              </p>

              {/* Price display in BDT */}
              <div className="flex items-baseline gap-3 mb-6 p-4 bg-[#14120D] border border-[#D4AF37]/25 w-full rounded-xs">
                <div>
                  <span className="text-[10px] text-[#AA8435] uppercase tracking-wider block font-sans-body">
                    Exclusive Coffret Price (100 ML)
                  </span>
                  <div className="flex items-baseline gap-2.5 mt-0.5">
                    <span className="font-serif-royal font-bold text-2xl text-[#FFFFFF] tabular-nums">
                      ৳{(discoveryCoffret.prices['100 ML'] || 300).toLocaleString('en-US')}
                    </span>
                    <span className="text-xs text-[#F5EBDD]/50 line-through tabular-nums">
                      ৳{((discoveryCoffret.prices['100 ML'] || 300) + 150).toLocaleString('en-US')}
                    </span>
                  </div>
                </div>
                <div className="ml-auto text-right">
                  <span className="bg-[#D4AF37]/20 text-[#D4AF37] text-xs font-serif-royal font-bold px-2 py-1 rounded-xs inline-block">
                    Save ৳150 BDT
                  </span>
                </div>
              </div>

              {/* Buttons */}
              <div className="flex flex-col sm:row gap-3 w-full">
                <button
                  onClick={() => onBuyNow(discoveryCoffret, '100 ML')}
                  className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-[#D4AF37] via-[#E5C365] to-[#AA8435] text-[#050505] font-serif-royal text-xs font-bold uppercase tracking-wider py-3.5 px-6 rounded-xs hover:shadow-[0_4px_20px_rgba(212,175,55,0.4)] transition-all"
                >
                  <span>Claim Royal Coffret</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  onClick={() => onAddToCart(discoveryCoffret, '100 ML')}
                  className="flex-1 flex items-center justify-center gap-2 bg-[#12110D] border border-[#D4AF37]/60 text-[#D4AF37] font-serif-royal text-xs font-semibold uppercase tracking-wider py-3.5 px-6 rounded-xs hover:bg-[#1E1B13] transition-colors"
                >
                  <span>Add to Bag (100 ML)</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* 3 Value-Added Royal Services Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 bg-[#0B0A07] border border-[#D4AF37]/20 rounded-xs flex flex-col justify-between">
            <div>
              <Feather className="w-6 h-6 text-[#D4AF37] mb-3" />
              <h4 className="font-serif-royal text-base text-[#FFFFFF] font-bold mb-2">
                Bespoke Bottle Engraving
              </h4>
              <p className="font-sans-body text-xs text-[#F5EBDD]/70 leading-relaxed mb-4">
                Complimentary custom laser engraving of initials, names, or coronation dates on any 100ml flacon.
                Available upon checkout.
              </p>
            </div>
            <span className="text-[11px] text-[#D4AF37] font-serif-royal tracking-wider uppercase font-semibold">
              Free with all 100ml orders
            </span>
          </div>

          <div className="p-6 bg-[#0B0A07] border border-[#D4AF37]/20 rounded-xs flex flex-col justify-between">
            <div>
              <Sparkles className="w-6 h-6 text-[#D4AF37] mb-3" />
              <h4 className="font-serif-royal text-base text-[#FFFFFF] font-bold mb-2">
                Royal Wax Seal & Gift Wrap
              </h4>
              <p className="font-sans-body text-xs text-[#F5EBDD]/70 leading-relaxed mb-4">
                Every bottle arrives in our signature midnight black velvet coffret with gold hand-embossed seals and
                personalized royal stationery.
              </p>
            </div>
            <span className="text-[11px] text-[#D4AF37] font-serif-royal tracking-wider uppercase font-semibold">
              Signature Royal Packaging
            </span>
          </div>

          <div className="p-6 bg-[#0B0A07] border border-[#D4AF37]/20 rounded-xs flex flex-col justify-between">
            <div>
              <ShieldCheck className="w-6 h-6 text-[#D4AF37] mb-3" />
              <h4 className="font-serif-royal text-base text-[#FFFFFF] font-bold mb-2">
                Private Olfactory Concierge
              </h4>
              <p className="font-sans-body text-xs text-[#F5EBDD]/70 leading-relaxed mb-4">
                Enjoy personalized fragrance guidance from our master perfumers. Visit our private salons in Gulshan 2
                and Banani, Dhaka.
              </p>
            </div>
            <span className="text-[11px] text-[#D4AF37] font-serif-royal tracking-wider uppercase font-semibold">
              Boutique VIP Service
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};
