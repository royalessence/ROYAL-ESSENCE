import React, { useState, useEffect } from 'react';
import { Product, SizeOption, SpecialOffer } from '../types';
import { Star, ShoppingBag, Eye, Zap, Check, Sparkles, Heart, AlertCircle } from 'lucide-react';
import { Islamic8PointStar } from './ArabianDecorations';
import { getProductSizeInventory } from '../data/perfumes';
import { ProductImagePlaceholder } from './ProductImagePlaceholder';
import { calculateProductDiscount } from '../utils/discountUtils';

interface ProductCardProps {
  product: Product;
  offers?: SpecialOffer[];
  isWishlisted?: boolean;
  onToggleWishlist?: (product: Product) => void;
  onAddToCart: (product: Product, size: SizeOption) => void;
  onBuyNow: (product: Product, size: SizeOption) => void;
  onQuickView: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  offers = [],
  isWishlisted = false,
  onToggleWishlist,
  onAddToCart,
  onBuyNow,
  onQuickView,
}) => {
  const [selectedSize, setSelectedSize] = useState<SizeOption>('100 ML');
  const [currentSrc, setCurrentSrc] = useState(product.image || '');
  const [imageError, setImageError] = useState(!product.image || product.image.trim() === '');
  const [addedAnimation, setAddedAnimation] = useState(false);
  const [heartPulsing, setHeartPulsing] = useState(false);

  useEffect(() => {
    setCurrentSrc(product.image || '');
    setImageError(!product.image || product.image.trim() === '');
  }, [product.image]);

  const currentInventory = getProductSizeInventory(product, selectedSize);
  const isOutOfStock = currentInventory.stock <= 0 || !currentInventory.isAvailable;
  const isLowStock = currentInventory.stock > 0 && currentInventory.stock <= 5;
  const discount = calculateProductDiscount(product, selectedSize, offers);
  const discount100 = calculateProductDiscount(product, '100 ML', offers);

  const handleImageError = () => {
    setImageError(true);
  };

  const handleAddToCart = () => {
    onAddToCart(product, selectedSize);
    setAddedAnimation(true);
    setTimeout(() => setAddedAnimation(false), 1200);
  };

  // Luxury card theme harmonized to match the bottles of OSCAR, Reef 21, and Reef 33
  const getCardTheme = () => {
    const pId = (product.id || '').toLowerCase();
    const pName = (product.name || '').toLowerCase();

    // 1. OSCAR (Radiant gold faceted flacon, gold box & cut crystal cap)
    if (pId === 'oscar' || pName.includes('oscar')) {
      return {
        bg: 'from-[#1D170A] via-[#120F08] to-[#0A0A0C]',
        border: 'border-[#F3CD68]/55 hover:border-[#FFFDF8]',
        badgeBg: 'bg-[#241B0B]',
        badgeText: 'text-[#F3CD68]',
        glow: 'group-hover:shadow-[0_12px_45px_rgba(243,205,104,0.35)]',
      };
    }
    // 2. Reef 21 (Matte black hexagonal flacon with gold mirror emblem & plush black pom-pom)
    if (pId === 'reef-21' || pId === 'reef21' || pName.includes('21')) {
      return {
        bg: 'from-[#14120E] via-[#0E0E12] to-[#0A0A0C]',
        border: 'border-[#D4AF37]/45 hover:border-[#F3CD68]',
        badgeBg: 'bg-[#1C1610]',
        badgeText: 'text-[#F3CD68]',
        glow: 'group-hover:shadow-[0_12px_45px_rgba(212,175,55,0.25)]',
      };
    }
    // 3. Reef 33 (Royal emerald green hexagonal flacon with gold emblem & luxury Arabic calligraphy box)
    if (pId === 'reef-33' || pId === 'reef33' || pId === 'reef-2' || pName.includes('33') || pName.includes('reef 2')) {
      return {
        bg: 'from-[#0A1A12] via-[#0E1210] to-[#0A0A0C]',
        border: 'border-[#10B981]/40 hover:border-[#F3CD68]',
        badgeBg: 'bg-[#0E2017]',
        badgeText: 'text-[#34D399]',
        glow: 'group-hover:shadow-[0_12px_45px_rgba(16,185,129,0.25)]',
      };
    }
    return {
      bg: 'from-[#14120F] via-[#0E0E12] to-[#0A0A0C]',
      border: 'border-[#D4AF37]/35 hover:border-[#F3CD68]',
      badgeBg: 'bg-[#1A1410]',
      badgeText: 'text-[#F3CD68]',
      glow: 'group-hover:shadow-[0_12px_45px_rgba(212,175,55,0.22)]',
    };
  };

  const theme = getCardTheme();

  return (
    <div
      className={`group relative flex flex-col bg-gradient-to-b ${theme.bg} border ${theme.border} transition-all duration-300 rounded-t-[28px] rounded-b-xs overflow-hidden shadow-[0_10px_35px_rgba(0,0,0,0.85)] ${theme.glow} backdrop-blur-md`}
    >
      {/* Subtle Islamic Girih background pattern inside card */}
      <div className="absolute inset-0 bg-islamic-girih opacity-15 pointer-events-none" />

      {/* Arabian Arch Golden Header Bar */}
      <div className="relative h-2 bg-gradient-to-r from-[#231A15] via-[#D4AF37] to-[#1A120E] opacity-85 flex items-center justify-center">
        <div className="w-2.5 h-2.5 rotate-45 bg-[#F3CD68] border border-[#070709] absolute -bottom-1 shadow-sm" />
      </div>

      {/* Visual Image Container */}
      <div className="relative aspect-[4/3] bg-gradient-to-b from-[#070709] to-[#0E0E12] overflow-hidden flex items-center justify-center p-4 border-b border-[#D4AF37]/25">
        {/* Category Pill with Islamic Star */}
        <div
          className={`absolute top-3 left-3 z-10 flex items-center gap-1.5 ${theme.badgeBg} border border-[#D4AF37]/40 ${theme.badgeText} text-[10px] font-serif-royal uppercase tracking-wider px-2.5 py-1 rounded-full backdrop-blur-md shadow-sm`}
        >
          <Islamic8PointStar size={11} />
          <span>{product.category === 'attar' ? 'Pure Attar' : 'Arabic Fragrance'}</span>
        </div>

        {/* Top Right: Wishlist Heart & Price Tag */}
        <div className="absolute top-3 right-3 z-10 flex items-center gap-1.5">
          <div className="bg-[#0A0A0C]/95 border border-[#D4AF37]/50 text-[#F3CD68] font-serif-royal font-bold text-xs px-2.5 py-1 rounded-xs shadow flex items-center gap-1.5">
            {discount100.hasDiscount && (
              <span className="line-through text-neutral-400 text-[10px]">৳{discount100.originalPrice}</span>
            )}
            <span>৳{discount100.discountedPrice} BDT</span>
            {discount100.hasDiscount && (
              <span className="bg-[#D4AF37] text-[#070709] text-[9px] font-black px-1 rounded-xs">{discount100.discountBadge}</span>
            )}
          </div>

          {/* Animated Heart Wishlist Button */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              if (onToggleWishlist) {
                setHeartPulsing(true);
                onToggleWishlist(product);
                setTimeout(() => setHeartPulsing(false), 500);
              }
            }}
            aria-label={isWishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}
            title={isWishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}
            className={`p-1.5 rounded-full border transition-all duration-300 shadow-md ${
              isWishlisted
                ? 'bg-[#E11D48] border-[#FFE4E6] text-white'
                : 'bg-[#0E0E12]/90 border-[#D4AF37]/45 text-[#D4C3B3]/75 hover:text-[#E11D48] hover:border-[#E11D48]'
            } ${heartPulsing ? 'scale-125' : 'hover:scale-110'}`}
          >
            <Heart
              className={`w-3.5 h-3.5 transition-all duration-300 ${
                isWishlisted ? 'fill-current' : 'fill-transparent'
              }`}
            />
          </button>
        </div>

        {/* Product Photograph or Clean Image Placeholder */}
        {!imageError && currentSrc && currentSrc.trim() !== '' ? (
          <img
            src={currentSrc}
            alt={`${product.name} - ROYAL ESSENCE`}
            referrerPolicy="no-referrer"
            onError={handleImageError}
            className="w-full h-full object-contain filter drop-shadow-[0_12px_28px_rgba(0,0,0,0.95)] group-hover:scale-104 transition-transform duration-500 ease-out"
          />
        ) : (
          <ProductImagePlaceholder name={product.name} size="md" className="w-full h-full" />
        )}

        {/* Quick View Button Hover Overlay */}
        <div className="absolute inset-x-0 bottom-3 flex justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 px-5">
          <button
            onClick={() => onQuickView(product)}
            className="w-full flex items-center justify-center gap-1.5 bg-[#0E0E12]/95 hover:bg-[#1A120E] border border-[#F3CD68]/80 text-[#F3CD68] text-xs font-serif-royal uppercase tracking-wider py-2 shadow-xl transition-all rounded-xs backdrop-blur-md"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>View Fragrance Details</span>
          </button>
        </div>
      </div>

      {/* Product Details Area */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between relative z-10">
        <div>
          {/* Rating & Longevity */}
          <div className="flex items-center justify-between text-xs mb-2">
            <div className="flex items-center text-[#F3CD68]">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-3 h-3 fill-[#F3CD68] stroke-none" />
              ))}
              <span className="ml-1.5 text-xs font-bold tabular-nums text-[#F3CD68]">
                {product.rating}
              </span>
              <span className="text-[10px] text-[#D4C3B3]/70 ml-1">
                ({product.reviewCount})
              </span>
            </div>

            {/* Premium Longevity Indicator */}
            <div className="flex items-center gap-1 bg-[#1A120E] border border-[#D4AF37]/40 px-2 py-0.5 rounded-xs">
              <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37] animate-pulse" />
              <span className="text-[10px] text-[#F3CD68] font-serif-royal uppercase tracking-wider font-extrabold">
                LONG LASTING
              </span>
            </div>
          </div>

          {/* Product Name */}
          <h3 className="font-serif-royal text-lg sm:text-xl font-bold text-[#FAF6F0] tracking-wide mb-1 group-hover:text-[#F3CD68] transition-colors">
            {product.name}
          </h3>

          {/* Subtitle */}
          <p className="font-editorial text-xs sm:text-sm text-[#D4C3B3]/90 italic line-clamp-1 mb-2.5">
            {product.subtitle}
          </p>

          {/* Fragrance Type Characteristics */}
          <div className="flex flex-wrap items-center gap-1.5 mb-2.5">
            <span className="inline-flex items-center gap-1 text-[10px] font-serif-royal font-bold tracking-wider uppercase px-2 py-0.5 bg-[#14120E] border border-[#D4AF37]/40 text-[#F3CD68] rounded-xs">
              <Sparkles className="w-2.5 h-2.5 text-[#D4AF37]" />
              Sweet Fragrance
            </span>
            <span className="inline-flex items-center gap-1 text-[10px] font-serif-royal font-bold tracking-wider uppercase px-2 py-0.5 bg-[#14120E] border border-[#D4AF37]/40 text-[#F3CD68] rounded-xs">
              <Sparkles className="w-2.5 h-2.5 text-[#D4AF37]" />
              Strong Fragrance
            </span>
          </div>

          {/* Fragrance Notes Architecture Preview */}
          <div className="mb-3.5 p-2 bg-[#09080A] border border-[#D4AF37]/25 rounded-xs text-[11px] font-sans-body">
            <div className="flex items-center justify-between text-[10px] text-[#AA8435] font-serif-royal uppercase font-bold mb-1 pb-1 border-b border-[#D4AF37]/15">
              <span>Fragrance Notes</span>
              <button
                type="button"
                onClick={() => onQuickView(product)}
                className="text-[#F3CD68] hover:underline normal-case tracking-normal text-[10px]"
              >
                Full Details →
              </button>
            </div>
            <div className="space-y-0.5 text-[10px] text-[#E2D6C9]/90">
              <div className="truncate"><span className="text-[#AA8435] font-serif-royal">Top:</span> Sweet Citrus · Caramelized Saffron</div>
              <div className="truncate"><span className="text-[#AA8435] font-serif-royal">Middle:</span> Sweet Amber · Royal Jasmine</div>
              <div className="truncate"><span className="text-[#AA8435] font-serif-royal">Base:</span> Rich Agarwood (Oud) · Vanilla</div>
            </div>
          </div>

          {/* MANDATORY 3 SIZE SELECTORS: 100 ML, 300 ML, 500 ML */}
          <div className="mb-4 p-2.5 bg-[#09090C] border border-[#D4AF37]/35 rounded-xs">
            <div className="flex justify-between items-center mb-1.5">
              <span className="text-[10px] uppercase font-serif-royal tracking-widest text-[#F3CD68] font-bold">
                Select Bottle Volume:
              </span>
              <span className="text-[10px] text-[#D4C3B3]/75 font-mono">
                {selectedSize}
              </span>
            </div>

            <div className="grid grid-cols-3 gap-1.5">
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
                    className={`relative py-2 px-1 text-center rounded-xs border transition-all min-h-[44px] flex flex-col items-center justify-center ${
                      isSelected
                        ? sizeOutOfStock
                          ? 'bg-[#3A0F14] border-[#EF4444] text-[#FCA5A5]'
                          : 'bg-gradient-to-r from-[#D4AF37] to-[#AA8435] border-[#FFFDF8] text-[#070709] font-bold shadow-[0_0_12px_rgba(212,175,55,0.4)]'
                        : sizeOutOfStock
                        ? 'bg-[#18080C] border-[#EF4444]/30 text-[#EF4444]/60'
                        : 'bg-[#121217] border-[#D4AF37]/30 text-[#E2D6C9] hover:border-[#D4AF37] hover:text-[#FAF6F0]'
                    }`}
                  >
                    <span className="block text-[10px] sm:text-[11px] font-serif-royal font-bold">
                      {size}
                    </span>
                    <div className="flex items-center justify-center gap-1">
                      {sizeDiscount.hasDiscount && (
                        <span className={`text-[8px] sm:text-[9px] line-through ${isSelected ? 'text-[#070709]/60' : 'text-neutral-400'}`}>
                          ৳{sizeDiscount.originalPrice}
                        </span>
                      )}
                      <span className="text-[10px] tabular-nums font-bold">
                        ৳{sizeDiscount.discountedPrice}
                      </span>
                    </div>
                    {sizeDiscount.hasDiscount && !sizeOutOfStock && (
                      <span className={`inline-block text-[7px] sm:text-[8px] font-black px-1 rounded-xs uppercase tracking-tight ${
                        isSelected ? 'bg-black text-[#F3CD68]' : 'bg-[#D4AF37] text-black'
                      }`}>
                        {sizeDiscount.discountBadge}
                      </span>
                    )}
                    {sizeOutOfStock && (
                      <span className="block text-[7px] sm:text-[8px] uppercase tracking-tighter text-[#EF4444] font-bold">
                        Out of Stock
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Dynamic Price & Purchase CTAs */}
        <div>
          {/* Stock Availability Alert & SKU info */}
          <div className="flex items-center justify-between mb-2 text-[10px] font-serif-royal">
            <span className="text-[#AA8435] tracking-wider uppercase font-mono">
              SKU: {currentInventory.sku}
            </span>
            {isOutOfStock ? (
              <span className="text-[#EF4444] bg-[#EF4444]/15 px-2 py-0.5 rounded-xs font-bold uppercase tracking-wider border border-[#EF4444]/40 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" /> Out of Stock
              </span>
            ) : isLowStock ? (
              <span className="text-[#F59E0B] bg-[#F59E0B]/15 px-2 py-0.5 rounded-xs font-bold uppercase tracking-wider border border-[#F59E0B]/40 animate-pulse">
                Only {currentInventory.stock} Left!
              </span>
            ) : (
              <span className="text-[#D4AF37] bg-[#D4AF37]/15 px-2 py-0.5 rounded-xs font-bold uppercase tracking-wider border border-[#D4AF37]/40">
                In Stock ({currentInventory.stock})
              </span>
            )}
          </div>

          {/* Price display per selected size with Strikethrough & Savings */}
          <div className="flex items-baseline justify-between mb-3.5 pb-2.5 border-b border-[#D4AF37]/25">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-[#D4C3B3]/75 uppercase block font-serif-royal">
                  Price for {selectedSize}
                </span>
                {discount.hasDiscount && (
                  <span className="inline-flex items-center gap-1 px-1.5 py-0.5 bg-gradient-to-r from-[#D4AF37] to-[#AA8435] text-[#070709] font-serif-royal font-black text-[9px] uppercase rounded-xs shadow">
                    <Sparkles className="w-2.5 h-2.5" />
                    {discount.discountBadge}
                  </span>
                )}
              </div>

              <div className="flex items-baseline gap-2 mt-0.5">
                {discount.hasDiscount && (
                  <span className="font-serif-royal text-sm sm:text-base line-through text-neutral-400 tabular-nums">
                    ৳{discount.originalPrice}
                  </span>
                )}
                <span className="font-serif-royal font-bold text-xl sm:text-2xl text-[#FAF6F0] tabular-nums">
                  ৳{discount.discountedPrice}
                </span>
                <span className="text-xs text-[#F3CD68] font-serif-royal">BDT</span>
              </div>
            </div>

            <div className="text-right">
              {discount.hasDiscount && (
                <span className="text-[10px] text-[#F3CD68] font-bold block">
                  Save ৳{discount.discountAmount} BDT
                </span>
              )}
              <span className="text-[10px] text-[#D4AF37] font-semibold block font-sans-body">
                ৳10 Delivery
              </span>
              <span className="text-[9px] sm:text-[10px] text-[#D4C3B3]/70">bKash/Nagad/Rocket</span>
            </div>
          </div>

          {/* Action Buttons: Add to Bag & Buy Now (min-h-[44px] touch-friendly) */}
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={handleAddToCart}
              disabled={isOutOfStock}
              className={`flex items-center justify-center gap-1.5 py-2.5 px-2.5 sm:px-3 rounded-xs font-serif-royal text-xs font-bold uppercase tracking-wider transition-all border min-h-[44px] ${
                isOutOfStock
                  ? 'bg-black/40 border-gray-700 text-gray-500 cursor-not-allowed opacity-60'
                  : addedAnimation
                  ? 'bg-[#D4AF37] border-[#D4AF37] text-[#070709]'
                  : 'bg-[#121217] border-[#D4AF37]/50 text-[#F3CD68] hover:bg-[#1A120E] hover:border-[#F3CD68] active:scale-[0.98]'
              }`}
            >
              {isOutOfStock ? (
                <>
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>Out of Stock</span>
                </>
              ) : addedAnimation ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Added!</span>
                </>
              ) : (
                <>
                  <ShoppingBag className="w-3.5 h-3.5 text-[#F3CD68]" />
                  <span>Add {selectedSize}</span>
                </>
              )}
            </button>

            <button
              onClick={() => onBuyNow(product, selectedSize)}
              disabled={isOutOfStock}
              className={`flex items-center justify-center gap-1.5 py-2.5 px-2.5 sm:px-3 rounded-xs font-serif-royal text-xs font-bold uppercase tracking-wider transition-all duration-200 min-h-[44px] ${
                isOutOfStock
                  ? 'bg-black/30 border border-gray-800 text-gray-500 cursor-not-allowed opacity-50'
                  : 'bg-gradient-to-r from-[#D4AF37] via-[#F3CD68] to-[#AA8435] text-[#070709] hover:shadow-[0_4px_18px_rgba(243,205,104,0.4)] active:scale-[0.98]'
              }`}
            >
              <Zap className="w-3.5 h-3.5 fill-current" />
              <span>{isOutOfStock ? 'Unavailable' : 'Instant Buy'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
