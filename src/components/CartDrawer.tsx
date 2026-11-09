import React from 'react';
import { CartItem, StoreSettings, SpecialOffer } from '../types';
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight, ShieldCheck, Sparkles, Tag } from 'lucide-react';
import { ProductImagePlaceholder } from './ProductImagePlaceholder';
import { calculateProductDiscount } from '../utils/discountUtils';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  offers?: SpecialOffer[];
  onUpdateQuantity: (id: string, newQty: number) => void;
  onRemoveItem: (id: string) => void;
  onCheckout: () => void;
  settings: StoreSettings;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  offers = [],
  onUpdateQuantity,
  onRemoveItem,
  onCheckout,
  settings,
}) => {
  if (!isOpen) return null;

  // Calculate items with current active discounts
  let originalSubtotal = 0;
  let subtotal = 0;

  items.forEach((item) => {
    const disc = calculateProductDiscount(item.product, item.size, offers, item.pricePerUnit);
    const unitPrice = disc.hasDiscount ? disc.discountedPrice : item.pricePerUnit;
    originalSubtotal += disc.originalPrice * item.quantity;
    subtotal += unitPrice * item.quantity;
  });

  const totalSavings = Math.max(0, originalSubtotal - subtotal);

  const deliveryCharge =
    items.length === 0
      ? 0
      : subtotal < 250
      ? settings.deliveryChargeBelow250
      : settings.deliveryCharge250AndAbove;

  const finalTotal = subtotal + deliveryCharge;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-[#050505]/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-0 sm:pl-10">
        <div className="w-screen max-w-md bg-gradient-to-b from-[#140E0A] via-[#0C0907] to-[#070605] border-l border-[#D4AF37]/35 shadow-[0_0_60px_rgba(0,0,0,0.95)] flex flex-col justify-between">
          {/* Header */}
          <div className="p-5 border-b border-[#D4AF37]/25 flex items-center justify-between bg-[#1A120B]/60">
            <div className="flex items-center gap-2.5">
              <ShoppingBag className="w-5 h-5 text-[#D4AF37]" />
              <h2 className="font-serif-royal text-base sm:text-lg font-bold text-[#FFFFFF] tracking-wider uppercase">
                Royal Cart ({items.reduce((acc, i) => acc + i.quantity, 0)})
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 text-[#F5EBDD]/60 hover:text-[#D4AF37] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Delivery Notice */}
          <div className="px-5 py-2.5 bg-[#1F150D]/80 border-b border-[#D4AF37]/15 flex items-center justify-between text-xs font-sans-body">
            <span className="text-[#F5EBDD]/80 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>Standard Bangladesh Delivery Charge:</span>
            </span>
            <span className="font-serif-royal font-bold text-[#D4AF37]">
              ৳{deliveryCharge} BDT
            </span>
          </div>

          {/* Items List */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {items.length === 0 ? (
              <div className="py-20 text-center">
                <ShoppingBag className="w-12 h-12 text-[#AA8435]/40 mx-auto mb-3" />
                <p className="font-serif-royal text-base text-[#FFFFFF] font-semibold mb-1">
                  Your Royal Cart is Empty
                </p>
                <p className="font-editorial text-sm text-[#F5EBDD]/60 italic mb-6">
                  Select your preferred 100 ML, 300 ML, or 500 ML Arabic Oud & Attar.
                </p>
                <button
                  onClick={onClose}
                  className="px-6 py-2.5 bg-[#D4AF37] text-[#050505] font-serif-royal text-xs font-bold uppercase tracking-wider rounded-xs"
                >
                  Browse Collection
                </button>
              </div>
            ) : (
              items.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-4 p-3 bg-[#150F0B] border border-[#D4AF37]/25 rounded-xs"
                >
                  {item.product.image && item.product.image.trim() !== '' ? (
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      referrerPolicy="no-referrer"
                      className="w-18 h-18 sm:w-20 sm:h-20 object-contain p-1 rounded-xs bg-[#090705] border border-[#D4AF37]/20 shrink-0"
                    />
                  ) : (
                    <div className="w-18 h-18 sm:w-20 sm:h-20 shrink-0">
                      <ProductImagePlaceholder size="sm" className="w-full h-full p-1" />
                    </div>
                  )}
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start">
                        <h4 className="font-serif-royal text-sm font-bold text-[#FFFFFF] line-clamp-1">
                          {item.product.name}
                        </h4>
                        <button
                          onClick={() => onRemoveItem(item.id)}
                          className="text-[#F5EBDD]/40 hover:text-red-400 p-0.5"
                          title="Remove item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      {(() => {
                        const itemDisc = calculateProductDiscount(item.product, item.size, offers, item.pricePerUnit);
                        const effectiveUnit = itemDisc.hasDiscount ? itemDisc.discountedPrice : item.pricePerUnit;
                        return (
                          <div className="flex items-center gap-2 mt-0.5 text-xs flex-wrap">
                            <span className="text-[#D4AF37] font-serif-royal font-bold bg-[#24170E] px-2 py-0.5 rounded-xs border border-[#D4AF37]/30 text-[10px]">
                              {item.size}
                            </span>
                            {itemDisc.hasDiscount && (
                              <span className="line-through text-neutral-400 text-[11px]">
                                ৳{itemDisc.originalPrice.toLocaleString('en-US')}
                              </span>
                            )}
                            <span className="text-[#F5EBDD] font-bold text-[11px]">
                              ৳{effectiveUnit.toLocaleString('en-US')} each
                            </span>
                            {itemDisc.hasDiscount && (
                              <span className="bg-emerald-600 text-white text-[9px] font-black px-1.5 py-0.2 rounded-xs">
                                {itemDisc.discountBadge}
                              </span>
                            )}
                          </div>
                        );
                      })()}
                    </div>

                    <div className="flex items-center justify-between mt-2.5">
                      {/* Quantity Stepper */}
                      <div className="flex items-center border border-[#D4AF37]/30 bg-[#0A0806] rounded-xs">
                        <button
                          onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                          className="p-1 hover:text-[#D4AF37] text-xs text-[#F5EBDD]/70"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-2.5 text-xs font-bold text-[#FFFFFF] tabular-nums">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                          className="p-1 hover:text-[#D4AF37] text-xs text-[#F5EBDD]/70"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      {/* Total Item Price in BDT */}
                      {(() => {
                        const itemDisc = calculateProductDiscount(item.product, item.size, offers, item.pricePerUnit);
                        const effectiveUnit = itemDisc.hasDiscount ? itemDisc.discountedPrice : item.pricePerUnit;
                        return (
                          <div className="text-right">
                            {itemDisc.hasDiscount && (
                              <span className="block text-[10px] line-through text-neutral-400">
                                ৳{(itemDisc.originalPrice * item.quantity).toLocaleString('en-US')}
                              </span>
                            )}
                            <span className="font-serif-royal font-bold text-sm text-[#D4AF37] tabular-nums">
                              ৳{(effectiveUnit * item.quantity).toLocaleString('en-US')}
                            </span>
                          </div>
                        );
                      })()}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer & Order Calculations */}
          {items.length > 0 && (
            <div className="p-5 bg-[#120C08] border-t border-[#D4AF37]/30 space-y-4">
              {/* Price Breakdown in BDT */}
              <div className="space-y-2 text-xs font-sans-body">
                <div className="flex justify-between text-[#F5EBDD]/75">
                  <span>Regular Subtotal</span>
                  <span className={`tabular-nums font-semibold ${totalSavings > 0 ? 'line-through text-neutral-400' : 'text-[#FFFFFF]'}`}>
                    ৳{originalSubtotal.toLocaleString('en-US')}
                  </span>
                </div>
                {totalSavings > 0 && (
                  <div className="flex justify-between text-emerald-400 font-medium">
                    <span className="flex items-center gap-1">
                      <Tag className="w-3 h-3" /> Special Discounts Applied:
                    </span>
                    <span className="tabular-nums font-bold">
                      -৳{totalSavings.toLocaleString('en-US')}
                    </span>
                  </div>
                )}
                <div className="flex justify-between text-[#F5EBDD]/75">
                  <span>Discounted Subtotal</span>
                  <span className="tabular-nums font-semibold text-[#FFFFFF]">
                    ৳{subtotal.toLocaleString('en-US')}
                  </span>
                </div>
                <div className="flex justify-between text-[#F5EBDD]/75">
                  <span>Delivery Charge</span>
                  <span className="tabular-nums font-semibold text-[#D4AF37]">
                    ৳{deliveryCharge}
                  </span>
                </div>
                <div className="flex justify-between text-base font-serif-royal font-bold text-[#FFFFFF] pt-2.5 border-t border-[#D4AF37]/20">
                  <span>Final Total (BDT)</span>
                  <span className="text-xl text-[#D4AF37] tabular-nums">
                    ৳{finalTotal.toLocaleString('en-US')}
                  </span>
                </div>
              </div>

              {/* Checkout Button */}
              <button
                onClick={() => {
                  onClose();
                  onCheckout();
                }}
                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-[#D4AF37] via-[#E5C365] to-[#AA8435] text-[#050505] font-serif-royal font-bold text-xs uppercase tracking-wider py-3.5 rounded-xs hover:shadow-[0_4px_20px_rgba(212,175,55,0.4)] transition-all"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="flex items-center justify-center gap-2 text-[10px] text-[#F5EBDD]/50 uppercase tracking-widest text-center">
                <ShieldCheck className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span>bKash · Nagad · Rocket Accepted</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
