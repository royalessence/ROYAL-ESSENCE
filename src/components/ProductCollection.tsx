import React from 'react';
import { Product, SizeOption, SpecialOffer } from '../types';
import { ProductCard } from './ProductCard';
import { ArabianPalaceArchDivider, Islamic8PointStar } from './ArabianDecorations';
import showroomBgImage from '../assets/images/luxury_marble_showroom_bg_1794129840061.jpg';

interface ProductCollectionProps {
  products: Product[];
  offers?: SpecialOffer[];
  wishlistIds?: string[];
  onToggleWishlist?: (product: Product) => void;
  selectedCategory: string;
  onSelectCategory: (cat: string) => void;
  onAddToCart: (product: Product, size: SizeOption) => void;
  onBuyNow: (product: Product, size: SizeOption) => void;
  onQuickView: (product: Product) => void;
  searchQuery: string;
}

export const ProductCollection: React.FC<ProductCollectionProps> = ({
  products,
  offers = [],
  wishlistIds = [],
  onToggleWishlist,
  selectedCategory,
  onSelectCategory,
  onAddToCart,
  onBuyNow,
  onQuickView,
  searchQuery,
}) => {
  const categories = [
    { key: 'all', label: `All Approved Fragrances (${products.length})` },
    { key: 'perfume', label: 'Perfumes' },
    { key: 'attar', label: 'Attars' },
  ];

  const hasCategoryItems = products.some((p) => p.category === selectedCategory);

  const filteredProducts = products.filter((p) => {
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const match =
        p.name.toLowerCase().includes(q) ||
        p.subtitle.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q);
      if (!match) return false;
    }

    if (selectedCategory === 'all' || !hasCategoryItems) return true;
    return p.category === selectedCategory;
  });

  return (
    <section
      id="perfume-collections"
      className="py-24 relative overflow-hidden bg-[#070709]"
    >
      {/* Background Architectural Luxury Showroom Image */}
      <div className="absolute inset-0 z-0">
        <img
          src={showroomBgImage}
          alt="Royal Essence Luxury Showroom"
          className="w-full h-full object-cover object-center filter brightness-[0.45] contrast-[1.1]"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#070709] via-[#0A0A0C]/90 to-[#070709]" />
      </div>

      {/* Subtle Islamic Girih geometric pattern backdrop */}
      <div className="absolute inset-0 bg-islamic-girih opacity-15 pointer-events-none z-[1]" />

      {/* Ambient Champagne Gold Glows */}
      <div className="absolute top-1/4 right-0 w-[500px] h-[500px] bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-[#D4AF37]/15 via-[#AA8435]/08 to-transparent blur-3xl pointer-events-none z-[1]" />
      <div className="absolute bottom-10 left-0 w-[500px] h-[500px] bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-[#F3CD68]/12 via-[#231A15]/20 to-transparent blur-3xl pointer-events-none z-[1]" />

      {/* Architectural Moorish Arch Divider at top */}
      <ArabianPalaceArchDivider className="mb-12 relative z-10" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 mb-3.5 px-4 py-1.5 bg-[#0E0E12]/90 border border-[#D4AF37]/50 rounded-full shadow-[0_0_15px_rgba(212,175,55,0.2)] backdrop-blur-md">
            <Islamic8PointStar size={13} className="text-[#F3CD68]" />
            <span className="font-serif-royal text-xs uppercase tracking-[0.25em] text-[#F3CD68] font-bold">
              Arabian Palace Perfume Showroom
            </span>
            <Islamic8PointStar size={13} className="text-[#F3CD68]" />
          </div>

          <h2 className="font-serif-royal text-3xl sm:text-5xl text-[#FAF6F0] font-bold tracking-wide mb-4">
            <span className="text-gold-gradient">Royal Perfumes & Concentrated Attars</span>
          </h2>

          <p className="font-editorial text-lg sm:text-xl text-[#E2D6C9] italic max-w-2xl mx-auto">
            Experience our iconic original fragrances in{' '}
            <strong className="text-[#F3CD68] not-italic font-serif-royal font-bold">100 ML</strong>,{' '}
            <strong className="text-[#F3CD68] not-italic font-serif-royal font-bold">300 ML</strong>, and{' '}
            <strong className="text-[#F3CD68] not-italic font-serif-royal font-bold">500 ML</strong>. Handcrafted with authentic Arabian heritage formulation.
          </p>
        </div>

        {/* Category Filters in Luxury Obsidian Glass capsule */}
        <div className="flex items-center justify-center mb-12 overflow-x-auto pb-2">
          <div className="inline-flex items-center gap-2 p-1.5 bg-[#0E0E12]/90 border border-[#D4AF37]/45 rounded-full shadow-[0_8px_30px_rgba(0,0,0,0.85)] backdrop-blur-md">
            {categories.map((cat) => {
              const isActive = selectedCategory === cat.key;
              return (
                <button
                  key={cat.key}
                  onClick={() => onSelectCategory(cat.key)}
                  className={`px-6 py-2.5 text-xs font-serif-royal tracking-wider uppercase rounded-full transition-all whitespace-nowrap shrink-0 ${
                    isActive
                      ? 'bg-gradient-to-r from-[#D4AF37] via-[#F3CD68] to-[#AA8435] text-[#070709] font-bold shadow-[0_0_18px_rgba(243,205,104,0.45)]'
                      : 'text-[#E2D6C9]/80 hover:text-[#FAF6F0] hover:bg-[#1A120E]'
                  }`}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Search query notice */}
        {searchQuery.trim() && (
          <div className="mb-6 text-center text-xs text-[#F3CD68] font-serif-royal">
            Showing results matching &ldquo;{searchQuery}&rdquo; ({filteredProducts.length} items found)
          </div>
        )}

        {/* Product Cards Grid */}
        <div className={`grid grid-cols-1 md:grid-cols-2 ${filteredProducts.length >= 4 ? 'lg:grid-cols-4 max-w-7xl' : 'lg:grid-cols-3 max-w-6xl'} gap-8 mx-auto`}>
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              offers={offers}
              isWishlisted={wishlistIds.includes(product.id)}
              onToggleWishlist={onToggleWishlist}
              onAddToCart={onAddToCart}
              onBuyNow={onBuyNow}
              onQuickView={onQuickView}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
