import React, { useState } from 'react';
import { RoyalLogo } from './RoyalLogo';
import { Search, Heart, ShoppingBag, Compass, Menu, X, Shield, Truck, PackageCheck, MapPin } from 'lucide-react';

interface NavbarProps {
  cartCount: number;
  cartTotal: number;
  wishlistCount: number;
  ordersCount?: number;
  savedAddressesCount?: number;
  onOpenSavedAddresses?: () => void;
  activeCategory: string;
  onSelectCategory: (cat: string) => void;
  onOpenCart: () => void;
  onOpenWishlist: () => void;
  onOpenScentFinder: () => void;
  onOpenAdmin: () => void;
  onOpenTracker: () => void;
  onOpenMyOrders: () => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  cartCount,
  cartTotal,
  wishlistCount,
  ordersCount = 0,
  savedAddressesCount = 0,
  onOpenSavedAddresses,
  activeCategory,
  onSelectCategory,
  onOpenCart,
  onOpenWishlist,
  onOpenScentFinder,
  onOpenAdmin,
  onOpenTracker,
  onOpenMyOrders,
  searchQuery,
  onSearchChange,
}) => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems: { label: string; cat: string }[] = [
    { label: 'All Oud & Attar', cat: 'all' },
    { label: 'Perfumes', cat: 'perfume' },
    { label: 'Pure Attars', cat: 'attar' },
  ];

  const handleNavClick = (cat: string) => {
    onSelectCategory(cat);
    setIsMobileMenuOpen(false);
    const elem = document.getElementById('perfume-collections');
    if (elem) {
      elem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="sticky top-0 z-30 bg-[#0A0A0C]/90 backdrop-blur-xl border-b border-[#D4AF37]/25 shadow-[0_4px_30px_rgba(0,0,0,0.85)] transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-8 h-20">
          {/* Zone 1: Brand Wordmark & Logo */}
          <a
            href="#"
            className="flex items-center whitespace-nowrap shrink-0 group focus:outline-none"
            onClick={(e) => {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          >
            <RoyalLogo size="md" showTagline={false} />
          </a>

          {/* Zone 2: Navigation Links */}
          <nav className="hidden lg:flex items-center gap-7 text-xs font-medium tracking-[0.2em] uppercase text-[#E2D6C9]/80">
            {navItems.map((item) => {
              const isActive = activeCategory === item.cat;
              return (
                <button
                  key={item.label}
                  onClick={() => handleNavClick(item.cat)}
                  className={`relative py-1.5 whitespace-nowrap shrink-0 transition-colors duration-200 hover:text-[#F3CD68] focus:outline-none ${
                    isActive ? 'text-[#F3CD68] font-semibold' : ''
                  }`}
                >
                  {item.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 w-full h-[1.5px] bg-[#D4AF37]" />
                  )}
                </button>
              );
            })}

            {/* Scent Finder Advisor button in nav */}
            <button
              onClick={onOpenScentFinder}
              className="flex items-center gap-1.5 text-[#D4AF37] hover:text-[#FFF2D6] whitespace-nowrap shrink-0 transition-colors py-1.5"
            >
              <Compass className="w-3.5 h-3.5" />
              <span>Scent Finder</span>
            </button>

            {/* Track Order button in nav */}
            <button
              onClick={onOpenTracker}
              className="flex items-center gap-1.5 text-[#E2D6C9]/85 hover:text-[#D4AF37] whitespace-nowrap shrink-0 transition-colors py-1.5"
            >
              <Truck className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>Track Order</span>
            </button>
          </nav>

          {/* Zone 3: Primary Action & Utilities */}
          <div className="flex items-center gap-2 sm:gap-3.5 shrink-0">
            {/* Search Input / Trigger */}
            <div className="relative">
              {isSearchOpen ? (
                <div className="flex items-center bg-[#121217] border border-[#D4AF37]/45 rounded-sm px-2.5 py-1.5 w-36 sm:w-56 lg:w-64 shadow-lg">
                  <Search className="w-3.5 h-3.5 text-[#D4AF37] shrink-0 mr-1.5 sm:mr-2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => onSearchChange(e.target.value)}
                    placeholder="Search fragrances..."
                    autoFocus
                    className="w-full bg-transparent text-xs text-[#FAF6F0] placeholder-[#AA8435]/70 focus:outline-none"
                  />
                  <button
                    onClick={() => {
                      setIsSearchOpen(false);
                      onSearchChange('');
                    }}
                    className="text-[#D4AF37]/70 hover:text-[#D4AF37] ml-1 text-xs p-1"
                    aria-label="Clear search"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setIsSearchOpen(true)}
                  aria-label="Search Fragrances"
                  className="p-2 text-[#E2D6C9]/80 hover:text-[#D4AF37] transition-colors focus:outline-none min-h-[44px] min-w-[44px] flex items-center justify-center"
                >
                  <Search className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Wishlist Button (Hidden on compact mobile to save space, accessible via bottom nav and mobile drawer) */}
            <button
              onClick={onOpenWishlist}
              aria-label="View Saved Royal Wishlist"
              className="hidden sm:flex relative p-2 text-[#E2D6C9]/80 hover:text-[#D4AF37] transition-colors focus:outline-none min-h-[44px] min-w-[44px] items-center justify-center"
            >
              <Heart className="w-4 h-4" />
              {wishlistCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-[#D4AF37] text-[#070709] text-[10px] font-bold flex items-center justify-center tabular-nums shadow-sm">
                  {wishlistCount}
                </span>
              )}
            </button>

            {/* My Saved Addresses Vault Button (Desktop / Laptop / Tablet) */}
            {onOpenSavedAddresses && (
              <button
                onClick={onOpenSavedAddresses}
                aria-label="View Saved Delivery Addresses"
                title="My Saved Addresses"
                className="hidden md:flex relative p-2 text-[#E2D6C9]/80 hover:text-[#D4AF37] transition-colors focus:outline-none min-h-[44px] min-w-[44px] items-center justify-center"
              >
                <MapPin className="w-4 h-4 text-[#F3CD68]" />
                {savedAddressesCount > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-[#D4AF37] text-[#070709] text-[10px] font-bold flex items-center justify-center tabular-nums shadow-sm">
                    {savedAddressesCount}
                  </span>
                )}
              </button>
            )}

            {/* MY ORDERS Button (Tablet, Laptop, Desktop - accessible on mobile via bottom bar & drawer) */}
            <button
              onClick={onOpenMyOrders}
              aria-label="View My Orders & Delivery Tracking"
              title="My Orders & Live Tracking"
              className="hidden sm:flex items-center gap-1.5 px-2.5 sm:px-3 py-2 text-xs font-serif-royal font-bold uppercase tracking-wider text-[#FAF6F0] bg-gradient-to-r from-[#121217] via-[#1A120E] to-[#121217] hover:border-[#F3CD68] border border-[#D4AF37]/50 rounded-xs transition-all shadow-[0_2px_12px_rgba(0,0,0,0.7)] focus:outline-none whitespace-nowrap shrink-0 group min-h-[44px]"
            >
              <PackageCheck className="w-4 h-4 text-[#F3CD68] group-hover:scale-110 transition-transform" />
              <span className="hidden md:inline font-serif-royal tracking-widest text-[11px]">
                MY ORDERS
              </span>
              {ordersCount > 0 && (
                <span className="w-4 h-4 rounded-full bg-[#D4AF37] text-[#070709] text-[10px] font-extrabold flex items-center justify-center tabular-nums shadow-sm">
                  {ordersCount}
                </span>
              )}
            </button>

            {/* Cart Trigger with BDT currency preview */}
            <button
              onClick={onOpenCart}
              aria-label="View Royal Shopping Bag"
              className="group flex items-center gap-2 bg-gradient-to-r from-[#D4AF37] via-[#F3CD68] to-[#AA8435] text-[#070709] font-semibold text-xs px-3 sm:px-3.5 py-2.5 rounded-sm hover:from-[#F3CD68] hover:to-[#BA9340] transition-all shadow-[0_2px_15px_rgba(212,175,55,0.3)] focus:outline-none whitespace-nowrap shrink-0 min-h-[44px]"
            >
              <div className="relative">
                <ShoppingBag className="w-4 h-4" />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 w-4 h-4 rounded-full bg-[#070709] text-[#F3CD68] text-[9px] font-extrabold flex items-center justify-center tabular-nums border border-[#F3CD68]/50">
                    {cartCount}
                  </span>
                )}
              </div>
              <span className="font-serif-royal tracking-wider uppercase text-[11px] font-bold">
                Bag
              </span>
              {cartCount > 0 && (
                <span className="hidden lg:inline text-[11px] font-bold tabular-nums pl-1 border-l border-[#070709]/25">
                  ৳{cartTotal.toLocaleString('en-US')}
                </span>
              )}
            </button>

            {/* Admin Dashboard Trigger (Desktop, Laptop, Tablet) */}
            <button
              onClick={onOpenAdmin}
              aria-label="Open Admin Dashboard"
              title="Admin Dashboard (Manage products, sizes, prices, payment numbers, and orders)"
              className="hidden md:flex items-center gap-1.5 px-2.5 py-2 text-xs text-[#D4AF37] hover:text-[#FFF2D6] bg-[#121217] border border-[#D4AF37]/35 hover:border-[#D4AF37]/75 rounded-xs transition-colors focus:outline-none min-h-[44px]"
            >
              <Shield className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span className="hidden lg:inline font-serif-royal tracking-widest text-[10px] uppercase font-semibold">
                Admin
              </span>
            </button>

            {/* Mobile Menu Hamburger */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2.5 text-[#FAF6F0] hover:text-[#D4AF37] focus:outline-none min-h-[44px] min-w-[44px] flex items-center justify-center bg-[#121217] border border-[#D4AF37]/35 rounded-xs"
              aria-label="Toggle navigation menu"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5 text-[#F3CD68]" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Dropdown */}
        {isMobileMenuOpen && (
          <div className="lg:hidden border-t border-[#D4AF37]/20 py-4 px-2 space-y-3 bg-[#0A0A0C]/95 backdrop-blur-xl animate-in fade-in duration-200">
            <div className="flex flex-col space-y-2">
              {navItems.map((item) => (
                <button
                  key={item.label}
                  onClick={() => handleNavClick(item.cat)}
                  className="text-left text-xs uppercase tracking-[0.18em] py-2 px-3 rounded text-[#E2D6C9]/85 hover:text-[#D4AF37]"
                >
                  {item.label}
                </button>
              ))}
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  onOpenMyOrders();
                }}
                className="flex items-center justify-between text-left text-xs uppercase tracking-[0.18em] py-2.5 px-3 text-[#F3CD68] bg-[#14120E] border border-[#D4AF37]/45 rounded-xs hover:border-[#D4AF37]"
              >
                <div className="flex items-center gap-2 font-bold font-serif-royal">
                  <PackageCheck className="w-4 h-4 text-[#F3CD68]" />
                  <span>MY ORDERS & TRACKING</span>
                </div>
                {ordersCount > 0 && (
                  <span className="bg-[#D4AF37] text-black text-[10px] font-bold px-2 py-0.5 rounded-full">
                    {ordersCount}
                  </span>
                )}
              </button>
              {onOpenSavedAddresses && (
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    onOpenSavedAddresses();
                  }}
                  className="flex items-center justify-between text-left text-xs uppercase tracking-[0.18em] py-2 px-3 text-[#E2D6C9] hover:text-[#F3CD68]"
                >
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-[#F3CD68]" />
                    <span>My Saved Addresses</span>
                  </div>
                  {savedAddressesCount > 0 && (
                    <span className="bg-[#D4AF37] text-black text-[10px] font-bold px-2 py-0.5 rounded-full">
                      {savedAddressesCount}
                    </span>
                  )}
                </button>
              )}
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  onOpenScentFinder();
                }}
                className="flex items-center gap-2 text-left text-xs uppercase tracking-[0.18em] py-2 px-3 text-[#D4AF37] hover:text-white"
              >
                <Compass className="w-4 h-4" />
                Find Your Signature Scent
              </button>
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  onOpenAdmin();
                }}
                className="flex items-center gap-2 text-left text-xs uppercase tracking-[0.18em] py-2 px-3 text-[#D4AF37] bg-[#121217] border border-[#D4AF37]/30 rounded-xs hover:border-[#D4AF37]"
              >
                <Shield className="w-4 h-4" />
                Store Admin Dashboard
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
