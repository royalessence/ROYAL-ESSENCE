import React, { useState } from 'react';
import { Product, SizeOption, SpecialOffer } from '../types';
import { X, Star, ShoppingBag, Zap, Clock, Sparkles, Check, Heart, AlertCircle } from 'lucide-react';
import { FragranceDetailsSection } from './FragranceDetailsSection';
import { getProductSizeInventory } from '../data/perfumes';
import { ProductImagePlaceholder } from './ProductImagePlaceholder';
import { calculateProductDiscount } from '../utils/discountUtils';

interface QuickViewModalProps {
  product: Product | null;
  offers?: SpecialOffer[];
  isWishlisted?: boolean;
  onToggleWishlist?: (product: Product) => void;
  onClose: () => void;
  onAddToCart: (product: Product, size: SizeOption) => void;
  onBuyNow: (product: Product, size: SizeOption) => void;
}

export const QuickViewModal: React.FC<QuickViewModalProps> = ({
  product,
  offers = [],
  isWishlisted = false,
  onToggleWishlist,
  onClose,
  onAddToCart,
  onBuyNow,
}) => {
  if (!product) return null;

  const [selectedSize, setSelectedSize] = useState<SizeOption>('100 ML');
  const [added, setAdded] = useState(false);
  const [heartPulsing, setHeartPulsing] = useState(false);

  const currentInventory = getProductSizeInventory(product, selectedSize);
  const isOutOfStock = currentInventory.stock <= 0 || !currentInventory.isAvailable;
  const isLowStock = currentInventory.stock > 0 && currentInventory.stock <= 5;
  const discount = calculateProductDiscount(product, selectedSize, offers);
  const price = discount.discountedPrice;

  const handleAdd = () => {
    onAddToCart(product, selectedSize);
    setAdded(true);
    setTimeout(() => setAdded(false), 1200);
  };

  const handleBuy = () => {
    onBuyNow(product, selectedSize);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-[#070709]/85 backdrop-blur-md overflow-y-auto">
      <div className="relative bg-gradient-to-b from-[#121217] via-[#0E0E12] to-[#0A0A0C] border border-[#D4AF37]/50 max-w-4xl w-full rounded-t-[28px] sm:rounded-t-[32px] rounded-b-xs shadow-[0_25px_80px_rgba(0,0,0,0.95)] overflow-hidden my-4 sm:my-8 animate-in fade-in zoom-in-95 duration-200">
        {/* Subtle Islamic Girih Pattern */}
        <div className="absolute inset-0 bg-islamic-girih opacity-15 pointer-events-none" />

        {/* Top Action Buttons: Wishlist & Close */}
        <div className="absolute top-4 right-4 z-20 flex items-center gap-2">
          {onToggleWishlist && (
            <button
              onClick={() => {
                setHeartPulsing(true);
                onToggleWishlist(product);
                setTimeout(() => setHeartPulsing(false), 500);
              }}
              aria-label={isWishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}
              className={`p-2 rounded-full border transition-all duration-300 shadow-md ${
                isWishlisted
                  ? 'bg-[#E11D48] border-[#FFE4E6] text-white'
                  : 'bg-[#050505]/70 border-[#D4AF37]/50 text-[#EED9C4]/80 hover:text-[#E11D48] hover:border-[#E11D48]'
              } ${heartPulsing ? 'scale-125' : 'hover:scale-105'}`}
            >
              <Heart
                className={`w-4 h-4 transition-all ${
                  isWishlisted ? 'fill-current' : 'fill-transparent'
                }`}
              />
            </button>
          )}

          <button
            onClick={onClose}
            className="text-[#F5EBDD]/60 hover:text-[#D4AF37] p-2 bg-[#050505]/70 border border-[#D4AF37]/30 rounded-full transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-0">
          {/* Left: Perfume Flacon Image or Luxury Placeholder */}
          <div className="md:col-span-5 relative bg-[#090705] min-h-[220px] md:min-h-[460px] flex items-center justify-center p-4 sm:p-6 border-b md:border-b-0 md:border-r border-[#D4AF37]/25">
            {product.image && product.image.trim() !== '' ? (
              <img
                src={product.image}
                alt={product.name}
                referrerPolicy="no-referrer"
                className="max-h-[360px] w-auto object-contain filter drop-shadow-[0_15px_30px_rgba(0,0,0,0.9)]"
              />
            ) : (
              <ProductImagePlaceholder name={product.name} size="lg" className="w-full h-full min-h-[300px]" />
            )}
          </div>

          {/* Right: Detailed Notes & 100/300/500 ML Sizes */}
          <div className="md:col-span-7 p-6 sm:p-8 flex flex-col justify-between max-h-[85vh] overflow-y-auto">
            <div>
              {/* Category & Rating */}
              <div className="flex items-center justify-between text-xs mb-2">
                <span className="text-[#AA8435] font-serif-royal uppercase tracking-[0.2em]">
                  ROYAL ESSENCE · {product.category === 'attar' ? 'Pure Attar' : 'Arabic Fragrance'}
                </span>
                <div className="flex items-center gap-1.5 text-[#D4AF37]">
                  <Star className="w-3.5 h-3.5 fill-current stroke-none" />
                  <span className="font-bold tabular-nums text-xs">{product.rating}</span>
                  <span className="text-[#F5EBDD]/50 text-[11px]">({product.reviewCount} reviews)</span>
                </div>
              </div>

              {/* Title & Subtitle */}
              <h2 className="font-serif-royal text-2xl sm:text-3xl font-bold text-[#FFFFFF] mb-1">
                {product.name}
              </h2>
              <p className="font-editorial text-sm text-[#D4AF37] italic mb-4">
                {product.subtitle}
              </p>

              {/* Prose Description */}
              <p className="font-sans-body text-xs sm:text-sm text-[#F5EBDD]/75 leading-relaxed mb-6">
                {product.description}
              </p>

              {/* Professional Universal Fragrance Details Section */}
              <FragranceDetailsSection product={product} />

              {/* THREE SIZE OPTIONS: 100 ML, 300 ML, 500 ML */}
              <div className="mb-6">
                <div className="flex justify-between text-xs text-[#F5EBDD]/80 mb-2 font-serif-royal">
                  <span className="uppercase tracking-wider">Choose Volume Size:</span>
                  <span className="text-[#D4AF37] font-bold">{selectedSize}</span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {(['100 ML', '300 ML', '500 ML'] as SizeOption[]).map((size) => {
                    const isSelected = selectedSize === size;
                    const inv = getProductSizeInventory(product, size);
                    const sizeOutOfStock = inv.stock <= 0 || !inv.isAvailable;
                    const sizeDiscount = calculateProductDiscount(product, size, offers);

                    return (
                      <button
                        key={size}
                        type="button"
                        onClick={() => setSelectedSize(size)}
                        className={`relative py-2.5 px-2 text-center rounded-xs transition-all border ${
                          isSelected
                            ? sizeOutOfStock
                              ? 'bg-[#3A0F14] border-[#EF4444] text-[#FCA5A5]'
                              : 'bg-gradient-to-r from-[#D4AF37] to-[#AA8435] text-[#050505] border-[#D4AF37] font-bold shadow-md'
                            : sizeOutOfStock
                            ? 'bg-[#18080C] border-[#EF4444]/30 text-[#EF4444]/60'
                            : 'bg-[#18110B] border-[#D4AF37]/25 text-[#F5EBDD]/80 hover:border-[#D4AF37]/60'
                        }`}
                      >
                        <span className="text-xs font-serif-royal font-bold block">{size}</span>
                        <div className="flex items-center justify-center gap-1 mt-0.5">
                          {sizeDiscount.hasDiscount && (
                            <span className={`text-[9px] line-through ${isSelected ? 'text-[#050505]/70' : 'text-neutral-400'}`}>
                              ৳{sizeDiscount.originalPrice.toLocaleString('en-US')}
                            </span>
                          )}
                          <span
                            className={`text-[10px] tabular-nums font-bold ${
                              isSelected && !sizeOutOfStock ? 'text-[#050505] font-extrabold' : 'text-[#D4AF37]'
                            }`}
                          >
                            ৳{sizeDiscount.discountedPrice.toLocaleString('en-US')}
                          </span>
                        </div>
                        {sizeDiscount.hasDiscount && !sizeOutOfStock && (
                          <span className={`inline-block text-[8px] font-black px-1 rounded-xs uppercase tracking-tight mt-0.5 ${
                            isSelected ? 'bg-black text-[#F3CD68]' : 'bg-emerald-600 text-white'
                          }`}>
                            {sizeDiscount.discountBadge}
                          </span>
                        )}
                        {sizeOutOfStock && (
                          <span className="block text-[8px] uppercase tracking-tighter text-[#EF4444] font-bold mt-0.5">
                            Out of Stock
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Price Calculation in BDT & Live Stock Inventory status */}
              <div className="p-4 bg-[#140E0A] border border-[#D4AF37]/30 rounded-xs mb-6">
                <div className="flex items-center justify-between pb-2 mb-2 border-b border-[#D4AF37]/15 text-[11px] font-serif-royal">
                  <span className="text-[#AA8435] font-mono uppercase tracking-wider">
                    SKU: {currentInventory.sku}
                  </span>
                  {isOutOfStock ? (
                    <span className="text-[#EF4444] bg-[#EF4444]/15 px-2 py-0.5 rounded-xs font-bold uppercase tracking-wider border border-[#EF4444]/40 flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5" /> Out of Stock
                    </span>
                  ) : isLowStock ? (
                    <span className="text-[#F59E0B] bg-[#F59E0B]/15 px-2 py-0.5 rounded-xs font-bold uppercase tracking-wider border border-[#F59E0B]/40 animate-pulse">
                      Only {currentInventory.stock} Bottles Left!
                    </span>
                  ) : (
                    <span className="text-[#10B981] bg-[#10B981]/15 px-2 py-0.5 rounded-xs font-bold uppercase tracking-wider border border-[#10B981]/40">
                      In Stock ({currentInventory.stock} Units)
                    </span>
                  )}
                </div>

                <div className="flex items-baseline justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-[#AA8435] uppercase tracking-wider block font-sans-body">
                        Price for {selectedSize}
                      </span>
                      {discount.hasDiscount && (
                        <span className="inline-flex items-center gap-1 px-1.5 py-0.5 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-serif-royal font-black text-[9px] uppercase rounded-xs shadow">
                          <Sparkles className="w-2.5 h-2.5" />
                          {discount.discountBadge}
                        </span>
                      )}
                    </div>

                    <div className="flex items-baseline gap-2 mt-0.5">
                      {discount.hasDiscount && (
                        <span className="font-serif-royal text-base line-through text-neutral-400 tabular-nums">
                          ৳{discount.originalPrice.toLocaleString('en-US')}
                        </span>
                      )}
                      <span className="font-serif-royal font-bold text-2xl text-[#FFFFFF] tabular-nums">
                        ৳{discount.discountedPrice.toLocaleString('en-US')}
                      </span>
                      <span className="text-xs text-[#D4AF37] font-semibold">
                        Bangladeshi Taka (BDT)
                      </span>
                    </div>

                    {discount.hasDiscount && (
                      <span className="text-[11px] text-emerald-400 font-bold block mt-1">
                        You save ৳{discount.discountAmount.toLocaleString('en-US')} BDT on this size!
                      </span>
                    )}
                  </div>
                  <span className="bg-[#D4AF37]/20 text-[#D4AF37] text-xs font-serif-royal font-bold px-2.5 py-1 rounded-xs border border-[#D4AF37]/30">
                    {product.longevity}
                  </span>
                </div>
              </div>
            </div>

            {/* CTAs */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                onClick={handleAdd}
                disabled={isOutOfStock}
                className={`flex items-center justify-center gap-2 py-3 px-4 border text-xs font-serif-royal font-bold uppercase tracking-wider rounded-xs transition-colors ${
                  isOutOfStock
                    ? 'bg-black/40 border-gray-700 text-gray-500 cursor-not-allowed opacity-60'
                    : added
                    ? 'bg-[#D4AF37] text-[#050505] border-[#D4AF37]'
                    : 'bg-[#18110B] border-[#D4AF37] text-[#D4AF37] hover:bg-[#251A10]'
                }`}
              >
                {isOutOfStock ? (
                  <>
                    <AlertCircle className="w-4 h-4" />
                    <span>Out of Stock</span>
                  </>
                ) : added ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Added to Cart</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4" />
                    <span>Add {selectedSize} to Cart</span>
                  </>
                )}
              </button>

              <button
                onClick={handleBuy}
                disabled={isOutOfStock}
                className={`flex items-center justify-center gap-2 py-3 px-4 text-xs font-serif-royal font-bold uppercase tracking-wider rounded-xs transition-all ${
                  isOutOfStock
                    ? 'bg-black/30 border border-gray-800 text-gray-500 cursor-not-allowed opacity-50'
                    : 'bg-gradient-to-r from-[#D4AF37] via-[#E5C365] to-[#AA8435] text-[#050505] hover:shadow-[0_4px_18px_rgba(212,175,55,0.4)]'
                }`}
              >
                <Zap className="w-4 h-4 fill-current" />
                <span>{isOutOfStock ? 'Unavailable' : `Buy Now · ৳${price}`}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
