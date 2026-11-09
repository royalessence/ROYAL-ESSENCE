import React from 'react';
import { Product } from '../types';
import { Heart, Sparkles, TrendingUp, ShoppingBag, Eye, Award } from 'lucide-react';
import { ProductImagePlaceholder } from './ProductImagePlaceholder';

interface AdminWishlistSectionProps {
  products: Product[];
  wishlistIds: string[];
}

export const AdminWishlistSection: React.FC<AdminWishlistSectionProps> = ({
  products,
  wishlistIds,
}) => {
  // Aggregate statistics for wishlisted items
  const totalWishlisted = wishlistIds.length;

  const wishlistedProducts = products.map((p) => {
    const isSaved = wishlistIds.includes(p.id);
    return {
      product: p,
      isSaved,
      // Sample interest rating based on customer saves
      saveScore: isSaved ? 1 : 0,
    };
  });

  return (
    <div className="p-5 flex-1 overflow-y-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#D4AF37]/25">
        <div>
          <h3 className="font-serif-royal font-bold text-lg text-white uppercase tracking-wider flex items-center gap-2">
            <Heart className="w-5 h-5 text-[#E11D48] fill-[#E11D48]" />
            Customer Wishlist Intelligence & Demand
          </h3>
          <p className="text-xs text-[#EED9C4]/70 mt-0.5">
            Monitor which Arabian extraits customers are saving to their favorites and planning to purchase.
          </p>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        <div className="p-4 bg-[#061826] border border-[#D4AF37]/30 rounded-xs">
          <span className="text-[10px] text-[#AA8435] uppercase font-serif-royal block">Saved in Wishlists</span>
          <span className="font-serif-royal font-bold text-2xl text-[#E11D48] flex items-center gap-1.5 mt-0.5">
            <Heart className="w-5 h-5 fill-current" />
            {totalWishlisted} Products
          </span>
          <span className="text-[10px] text-[#EED9C4]/60 block mt-1">
            Active saved favorites in browser storage
          </span>
        </div>

        <div className="p-4 bg-[#061826] border border-[#D4AF37]/30 rounded-xs">
          <span className="text-[10px] text-[#AA8435] uppercase font-serif-royal block">Catalog Save Rate</span>
          <span className="font-serif-royal font-bold text-2xl text-[#F3CD68] block mt-0.5">
            {products.length > 0 ? Math.round((totalWishlisted / products.length) * 100) : 0}%
          </span>
          <span className="text-[10px] text-[#EED9C4]/60 block mt-1">
            Proportion of catalog favorited
          </span>
        </div>

        <div className="p-4 bg-[#061826] border border-[#D4AF37]/30 rounded-xs col-span-2 sm:col-span-1">
          <span className="text-[10px] text-[#AA8435] uppercase font-serif-royal block">Potential Revenue</span>
          <span className="font-serif-royal font-bold text-2xl text-[#10B981] block mt-0.5">
            ৳{wishlistIds
              .map((id) => products.find((p) => p.id === id)?.prices['100 ML'] || 300)
              .reduce((a, b) => a + b, 0)
              .toLocaleString('en-US')}{' '}
            BDT
          </span>
          <span className="text-[10px] text-[#A7F3D0]/70 block mt-1">
            Estimated cart conversion pipeline
          </span>
        </div>
      </div>

      {/* Fragrances Ranked by Demand */}
      <div className="space-y-3">
        <h4 className="font-serif-royal font-bold text-sm text-white uppercase tracking-wider flex items-center gap-2">
          <Award className="w-4 h-4 text-[#F3CD68]" />
          Perfume Demand & Wishlist Status
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {products.map((p) => {
            const isSaved = wishlistIds.includes(p.id);
            return (
              <div
                key={p.id}
                className={`p-4 rounded-xs border transition-all ${
                  isSaved
                    ? 'bg-[#0A1F2C] border-[#D4AF37] shadow-md'
                    : 'bg-[#040E1A] border-[#D4AF37]/20 opacity-80'
                }`}
              >
                <div className="flex items-center gap-3 mb-3">
                  {p.image && p.image.trim() !== '' ? (
                    <img
                      src={p.image}
                      alt={p.name}
                      className="w-14 h-14 object-contain bg-[#02070D] p-1 rounded-xs border border-[#D4AF37]/20 shrink-0"
                    />
                  ) : (
                    <div className="w-14 h-14 shrink-0">
                      <ProductImagePlaceholder size="sm" className="w-full h-full p-0.5" />
                    </div>
                  )}
                  <div>
                    <h5 className="font-serif-royal font-bold text-sm text-white">{p.name}</h5>
                    <span className="text-[10px] text-[#AA8435] font-serif-royal uppercase block">
                      {p.subtitle}
                    </span>
                    <span className="text-xs font-bold text-[#F3CD68] font-serif-royal mt-0.5 block">
                      From ৳{p.prices['100 ML']} BDT
                    </span>
                  </div>
                </div>

                <div className="pt-2 border-t border-[#D4AF37]/15 flex items-center justify-between text-xs">
                  <span className="text-[10px] text-[#EED9C4]/70 uppercase font-serif-royal">Customer Interest:</span>
                  <span
                    className={`font-serif-royal font-bold text-xs flex items-center gap-1 ${
                      isSaved ? 'text-[#E11D48]' : 'text-gray-400'
                    }`}
                  >
                    <Heart className={`w-3.5 h-3.5 ${isSaved ? 'fill-current' : ''}`} />
                    {isSaved ? 'Favorited by Customer' : 'Not Saved'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
