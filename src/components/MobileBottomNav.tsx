import React from 'react';
import { Home, Sparkles, Heart, PackageCheck, ShoppingBag } from 'lucide-react';

interface MobileBottomNavProps {
  cartCount: number;
  wishlistCount: number;
  ordersCount: number;
  onOpenCollections: () => void;
  onOpenScentFinder: () => void;
  onOpenWishlist: () => void;
  onOpenMyOrders: () => void;
  onOpenCart: () => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  cartCount,
  wishlistCount,
  ordersCount,
  onOpenCollections,
  onOpenScentFinder,
  onOpenWishlist,
  onOpenMyOrders,
  onOpenCart,
}) => {
  return (
    <nav
      aria-label="Mobile Navigation"
      className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-[#0A0A0C]/95 backdrop-blur-xl border-t border-[#D4AF37]/35 py-2 px-3 shadow-[0_-8px_30px_rgba(0,0,0,0.95)]"
    >
      <div className="flex items-center justify-around max-w-md mx-auto">
        {/* Shop Collections */}
        <button
          onClick={onOpenCollections}
          className="flex flex-col items-center justify-center p-1.5 text-[#E2D6C9]/80 hover:text-[#F3CD68] active:scale-95 transition-all min-h-[44px] min-w-[48px]"
          aria-label="Browse Collections"
        >
          <Home className="w-5 h-5 text-[#D4AF37]" />
          <span className="text-[10px] font-serif-royal uppercase tracking-wider mt-1 text-[#E2D6C9]">
            Showroom
          </span>
        </button>

        {/* Scent Advisor */}
        <button
          onClick={onOpenScentFinder}
          className="flex flex-col items-center justify-center p-1.5 text-[#E2D6C9]/80 hover:text-[#F3CD68] active:scale-95 transition-all min-h-[44px] min-w-[48px]"
          aria-label="Fragrance Advisor"
        >
          <Sparkles className="w-5 h-5 text-[#F3CD68]" />
          <span className="text-[10px] font-serif-royal uppercase tracking-wider mt-1 text-[#E2D6C9]">
            Advisor
          </span>
        </button>

        {/* Wishlist */}
        <button
          onClick={onOpenWishlist}
          className="relative flex flex-col items-center justify-center p-1.5 text-[#E2D6C9]/80 hover:text-[#F3CD68] active:scale-95 transition-all min-h-[44px] min-w-[48px]"
          aria-label="Saved Wishlist"
        >
          <div className="relative">
            <Heart className="w-5 h-5 text-[#D4AF37]" />
            {wishlistCount > 0 && (
              <span className="absolute -top-1.5 -right-2 w-4 h-4 rounded-full bg-[#D4AF37] text-[#070709] text-[9px] font-bold flex items-center justify-center tabular-nums shadow-sm">
                {wishlistCount}
              </span>
            )}
          </div>
          <span className="text-[10px] font-serif-royal uppercase tracking-wider mt-1 text-[#E2D6C9]">
            Wishlist
          </span>
        </button>

        {/* My Orders */}
        <button
          onClick={onOpenMyOrders}
          className="relative flex flex-col items-center justify-center p-1.5 text-[#E2D6C9]/80 hover:text-[#F3CD68] active:scale-95 transition-all min-h-[44px] min-w-[48px]"
          aria-label="My Orders and Tracking"
        >
          <div className="relative">
            <PackageCheck className="w-5 h-5 text-[#F3CD68]" />
            {ordersCount > 0 && (
              <span className="absolute -top-1.5 -right-2 w-4 h-4 rounded-full bg-[#D4AF37] text-[#070709] text-[9px] font-bold flex items-center justify-center tabular-nums shadow-sm">
                {ordersCount}
              </span>
            )}
          </div>
          <span className="text-[10px] font-serif-royal uppercase tracking-wider mt-1 text-[#E2D6C9]">
            Orders
          </span>
        </button>

        {/* Royal Bag / Cart */}
        <button
          onClick={onOpenCart}
          className="relative flex flex-col items-center justify-center p-1.5 text-[#070709] bg-gradient-to-r from-[#D4AF37] to-[#F3CD68] rounded-xs px-3 shadow-[0_2px_12px_rgba(212,175,55,0.4)] active:scale-95 transition-all min-h-[44px] min-w-[54px]"
          aria-label="Shopping Bag"
        >
          <div className="relative">
            <ShoppingBag className="w-5 h-5 text-[#070709]" />
            {cartCount > 0 && (
              <span className="absolute -top-1.5 -right-2.5 w-4 h-4 rounded-full bg-[#070709] text-[#F3CD68] text-[9px] font-extrabold flex items-center justify-center tabular-nums">
                {cartCount}
              </span>
            )}
          </div>
          <span className="text-[10px] font-serif-royal uppercase font-bold tracking-wider mt-0.5 text-[#070709]">
            Bag
          </span>
        </button>
      </div>
    </nav>
  );
};
