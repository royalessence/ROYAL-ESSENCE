import React, { useState } from 'react';
import { Product, SizeOption } from '../types';
import { X, Heart, ShoppingBag, Trash2, ArrowRight, Check, AlertCircle, Sparkles } from 'lucide-react';
import { getProductSizeInventory } from '../data/perfumes';
import { ProductImagePlaceholder } from './ProductImagePlaceholder';

interface WishlistDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  wishlistPerfumes: Product[];
  onRemoveWishlist: (perfume: Product) => void;
  onAddToCart: (perfume: Product, size: SizeOption) => void;
  onQuickView: (perfume: Product) => void;
  onClearWishlist?: () => void;
}

export const WishlistDrawer: React.FC<WishlistDrawerProps> = ({
  isOpen,
  onClose,
  wishlistPerfumes,
  onRemoveWishlist,
  onAddToCart,
  onQuickView,
  onClearWishlist,
}) => {
  // Store selected size per wishlisted product (default: 100 ML)
  const [selectedSizes, setSelectedSizes] = useState<Record<string, SizeOption>>({});
  const [movedId, setMovedId] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSelectSize = (productId: string, size: SizeOption) => {
    setSelectedSizes((prev) => ({ ...prev, [productId]: size }));
  };

  const handleMoveToBag = (perfume: Product) => {
    const size = selectedSizes[perfume.id] || '100 ML';
    const inv = getProductSizeInventory(perfume, size);
    if (inv.stock <= 0 || !inv.isAvailable) return;

    onAddToCart(perfume, size);
    setMovedId(`${perfume.id}-${size}`);
    setTimeout(() => {
      onRemoveWishlist(perfume);
      setMovedId(null);
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-[#070709]/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-0 sm:pl-10">
        <div className="w-screen max-w-lg bg-gradient-to-b from-[#121217] via-[#0E0E12] to-[#0A0A0C] border-l border-[#D4AF37]/45 shadow-[0_0_60px_rgba(0,0,0,0.95)] flex flex-col justify-between">
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-[#D4AF37]/25 flex items-center justify-between bg-[#0E0E12]/90">
            <div className="flex items-center gap-2.5">
              <div className="p-1.5 rounded-full bg-[#E11D48]/20 border border-[#E11D48] text-[#E11D48]">
                <Heart className="w-4 h-4 fill-current animate-pulse" />
              </div>
              <div>
                <h2 className="font-serif-royal text-base sm:text-lg font-bold text-white tracking-wider uppercase">
                  Royal Wishlist
                </h2>
                <span className="text-[10px] text-[#F3CD68] block">
                  {wishlistPerfumes.length} {wishlistPerfumes.length === 1 ? 'Fragrance' : 'Fragrances'} Saved
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {wishlistPerfumes.length > 0 && onClearWishlist && (
                <button
                  onClick={onClearWishlist}
                  className="text-[10px] text-[#EED9C4]/60 hover:text-red-400 underline font-serif-royal uppercase mr-2"
                >
                  Clear All
                </button>
              )}
              <button
                onClick={onClose}
                className="p-1.5 text-[#EED9C4]/60 hover:text-white bg-[#02070D] border border-[#D4AF37]/30 rounded-full transition-colors"
                aria-label="Close Wishlist"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
            {wishlistPerfumes.length === 0 ? (
              <div className="py-24 text-center">
                <div className="w-16 h-16 rounded-full bg-[#E11D48]/10 border border-[#E11D48]/30 flex items-center justify-center mx-auto mb-4 text-[#E11D48]">
                  <Heart className="w-8 h-8 stroke-[1.5]" />
                </div>
                <h3 className="font-serif-royal text-lg text-white font-bold mb-1">
                  Your Royal Wishlist is Empty
                </h3>
                <p className="font-editorial text-sm text-[#EED9C4]/70 italic mb-6 max-w-xs mx-auto">
                  Tap the heart icon on any royal flacon to curate your private favorites list.
                </p>
                <button
                  onClick={onClose}
                  className="px-6 py-2.5 bg-gradient-to-r from-[#D4AF37] to-[#AA8435] text-black font-serif-royal text-xs font-bold uppercase tracking-wider rounded-xs shadow-md hover:scale-105 transition-all"
                >
                  Explore Creations
                </button>
              </div>
            ) : (
              wishlistPerfumes.map((perfume) => {
                const currentSize = selectedSizes[perfume.id] || '100 ML';
                const inv = getProductSizeInventory(perfume, currentSize);
                const isOutOfStock = inv.stock <= 0 || !inv.isAvailable;
                const isJustMoved = movedId === `${perfume.id}-${currentSize}`;

                return (
                  <div
                    key={perfume.id}
                    className="p-3.5 sm:p-4 bg-[#051522]/90 border border-[#D4AF37]/25 rounded-xs flex flex-col sm:flex-row gap-3.5 shadow-md relative"
                  >
                    {/* Flacon photo or Luxury Placeholder */}
                    <div className="relative shrink-0 flex items-center justify-center bg-[#02070D] p-2 rounded-xs border border-[#D4AF37]/20 w-24 h-24 mx-auto sm:mx-0">
                      {perfume.image && perfume.image.trim() !== '' ? (
                        <img
                          src={perfume.image}
                          alt={perfume.name}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-contain cursor-pointer"
                          onClick={() => {
                            onClose();
                            onQuickView(perfume);
                          }}
                        />
                      ) : (
                        <div
                          className="w-full h-full cursor-pointer"
                          onClick={() => {
                            onClose();
                            onQuickView(perfume);
                          }}
                        >
                          <ProductImagePlaceholder size="sm" className="w-full h-full p-0.5" />
                        </div>
                      )}
                    </div>

                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-start gap-2">
                          <div>
                            <h4
                              onClick={() => {
                                onClose();
                                onQuickView(perfume);
                              }}
                              className="font-serif-royal text-sm sm:text-base font-bold text-white hover:text-[#F3CD68] cursor-pointer"
                            >
                              {perfume.name}
                            </h4>
                            <span className="text-[10px] text-[#AA8435] font-serif-royal uppercase tracking-wider block">
                              {perfume.category === 'attar' ? 'Pure Attar' : 'Arabic Fragrance'} · SKU: {inv.sku}
                            </span>
                          </div>

                          <button
                            onClick={() => onRemoveWishlist(perfume)}
                            className="text-[#EED9C4]/40 hover:text-red-400 p-1 transition-colors"
                            title="Remove from Wishlist"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>

                        {/* Size Selection Toggle */}
                        <div className="mt-2.5 flex items-center gap-1.5 flex-wrap">
                          {(['100 ML', '300 ML', '500 ML'] as SizeOption[]).map((size) => {
                            const isSelected = currentSize === size;
                            const sizeInv = getProductSizeInventory(perfume, size);
                            const sizeOOS = sizeInv.stock <= 0 || !sizeInv.isAvailable;
                            return (
                              <button
                                key={size}
                                onClick={() => handleSelectSize(perfume.id, size)}
                                className={`text-[10px] px-2 py-1 rounded-xs border font-serif-royal transition-all ${
                                  isSelected
                                    ? 'bg-[#D4AF37] border-[#D4AF37] text-black font-bold'
                                    : sizeOOS
                                    ? 'bg-[#18080C] border-[#EF4444]/30 text-[#EF4444]/60'
                                    : 'bg-[#030E18] border-[#D4AF37]/30 text-[#EED9C4]/80 hover:border-[#D4AF37]'
                                }`}
                              >
                                {size} · ৳{sizeInv.price}
                                {sizeOOS && ' (OOS)'}
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* Stock Status & Move to Bag CTA */}
                      <div className="flex items-center justify-between gap-2 mt-3 pt-2.5 border-t border-[#D4AF37]/15">
                        <div>
                          {isOutOfStock ? (
                            <span className="text-[10px] text-[#EF4444] font-serif-royal uppercase font-bold flex items-center gap-1">
                              <AlertCircle className="w-3 h-3" /> Out of Stock
                            </span>
                          ) : (
                            <span className="text-[10px] text-[#10B981] font-serif-royal uppercase font-bold">
                              In Stock ({inv.stock})
                            </span>
                          )}
                          <span className="text-xs font-bold text-[#F3CD68] font-serif-royal block">
                            ৳{inv.price} BDT
                          </span>
                        </div>

                        <button
                          onClick={() => handleMoveToBag(perfume)}
                          disabled={isOutOfStock}
                          className={`flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-xs font-serif-royal text-xs font-bold uppercase tracking-wider transition-all ${
                            isOutOfStock
                              ? 'bg-black/30 border border-gray-700 text-gray-500 cursor-not-allowed'
                              : isJustMoved
                              ? 'bg-[#10B981] text-white'
                              : 'bg-gradient-to-r from-[#D4AF37] to-[#AA8435] text-black hover:scale-105 shadow-sm'
                          }`}
                        >
                          {isJustMoved ? (
                            <>
                              <Check className="w-3.5 h-3.5" />
                              <span>Moved!</span>
                            </>
                          ) : (
                            <>
                              <ShoppingBag className="w-3.5 h-3.5 text-black" />
                              <span>Move to Bag ({currentSize})</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer */}
          {wishlistPerfumes.length > 0 && (
            <div className="p-4 sm:p-5 bg-[#030B14] border-t border-[#D4AF37]/25 space-y-2.5">
              <div className="flex items-center justify-between text-xs text-[#EED9C4]/80">
                <span className="flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-[#D4AF37]" /> Total Wishlist Items:
                </span>
                <span className="font-bold text-[#F3CD68] font-serif-royal">{wishlistPerfumes.length} Products</span>
              </div>
              <button
                onClick={onClose}
                className="w-full flex items-center justify-center gap-2 bg-[#061826] border border-[#D4AF37]/50 text-[#F3CD68] font-serif-royal text-xs font-bold uppercase tracking-wider py-3 rounded-xs hover:bg-[#092B20] transition-colors"
              >
                <span>Continue Shopping</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
