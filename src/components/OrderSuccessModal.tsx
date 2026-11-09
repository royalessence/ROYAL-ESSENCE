import React, { useState } from 'react';
import { Order, OrderStatus } from '../types';
import {
  Check,
  Calendar,
  Clock,
  Package,
  Copy,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  ShoppingBag,
  Truck,
  ShieldCheck,
  ExternalLink,
  Printer,
  X,
  Gift,
} from 'lucide-react';
import { RoyalLogo } from './RoyalLogo';
import { ProductImagePlaceholder } from './ProductImagePlaceholder';

interface OrderSuccessModalProps {
  order: Order | null;
  isOpen: boolean;
  onClose: () => void;
  onContinueShopping: () => void;
  onOpenMyOrders?: () => void;
}

// 5-step tracking system as required
const TRACKING_STEPS: { key: OrderStatus; label: string; desc: string }[] = [
  {
    key: 'Order Placed',
    label: 'Order Placed ✓',
    desc: 'Transaction received & verified',
  },
  {
    key: 'Order Confirmed',
    label: 'Order Confirmed',
    desc: 'Bespoke bottle reserved in warehouse',
  },
  {
    key: 'Preparing Your Order',
    label: 'Preparing Your Order',
    desc: 'Artisanal packaging & gold wax seal',
  },
  {
    key: 'Out for Delivery',
    label: 'Out for Delivery',
    desc: 'Courier dispatched to your address',
  },
  {
    key: 'Delivered',
    label: 'Delivered ✓',
    desc: 'Handed over securely to customer',
  },
];

// Helper to normalize status index (also handles legacy 'Pending'/'Confirmed')
const getStepIndex = (status: OrderStatus): number => {
  if (status === 'Order Placed' || status === 'Pending') return 0;
  if (status === 'Order Confirmed' || status === 'Confirmed') return 1;
  if (status === 'Preparing Your Order') return 2;
  if (status === 'Out for Delivery') return 3;
  if (status === 'Delivered') return 4;
  return 0;
};

// Automatic 3-calendar-day delivery calculation helper
export const calculateDeliveryEstimate = (createdAtStr?: string) => {
  let baseDate = new Date();
  if (createdAtStr) {
    const parsed = new Date(createdAtStr);
    if (!isNaN(parsed.getTime())) {
      baseDate = parsed;
    }
  }

  // Exactly 3 calendar days after order date
  const estDate = new Date(baseDate);
  estDate.setDate(estDate.getDate() + 3);

  const formattedEstDate = estDate.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  const formattedOrderDate = baseDate.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  return {
    orderDate: formattedOrderDate,
    deliveryDate: formattedEstDate,
  };
};

export const OrderSuccessModal: React.FC<OrderSuccessModalProps> = ({
  order,
  isOpen,
  onClose,
  onContinueShopping,
  onOpenMyOrders,
}) => {
  if (!isOpen || !order) return null;

  const [copiedId, setCopiedId] = useState(false);
  const currentStepIdx = getStepIndex(order.status);
  const { orderDate, deliveryDate } = calculateDeliveryEstimate(order.createdAt);

  const totalQuantity = order.items.reduce((acc, it) => acc + it.quantity, 0);

  const handleCopyId = () => {
    navigator.clipboard.writeText(order.id);
    setCopiedId(true);
    setTimeout(() => setCopiedId(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-[#030302]/95 backdrop-blur-xl p-3 sm:p-6 md:p-10 animate-in fade-in duration-300">
      {/* Background cinematic Arabic Oud styling */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#D4AF37]/15 via-[#2A1810]/30 to-transparent blur-3xl opacity-70" />
        <div className="absolute inset-0 bg-arabic-pattern opacity-15" />
      </div>

      <div className="relative w-full max-w-3xl bg-gradient-to-b from-[#18100B] via-[#0F0B08] to-[#070504] border border-[#D4AF37]/50 rounded-xs shadow-[0_25px_80px_rgba(0,0,0,0.95)] overflow-hidden my-auto z-10">
        {/* Subtle decorative top gold bar */}
        <div className="h-1.5 w-full bg-gradient-to-r from-[#AA8435] via-[#F5EBDD] to-[#D4AF37]" />

        {/* Close / Exit Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 z-20 text-[#F5EBDD]/60 hover:text-[#D4AF37] p-2 bg-[#050505]/70 border border-[#D4AF37]/30 rounded-full transition-colors"
          title="Close confirmation"
          aria-label="Close confirmation"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-6 sm:p-10 md:p-12 text-center">
          {/* Brand Header */}
          <div className="flex justify-center mb-6">
            <RoyalLogo size="sm" showTagline={false} />
          </div>

          {/* 1. Large Animated Golden/Green Checkmark */}
          <div className="relative inline-block mb-6">
            {/* Glowing pulsing aura */}
            <div className="absolute -inset-3 rounded-full bg-gradient-to-r from-[#10B981]/30 via-[#D4AF37]/40 to-[#10B981]/30 blur-md animate-pulse" />
            <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-b from-[#1E2E1F] via-[#141E15] to-[#0C140D] border-2 border-[#10B981] flex items-center justify-center text-[#10B981] shadow-[0_0_35px_rgba(16,185,129,0.5)]">
              <Check className="w-10 h-10 sm:w-12 sm:h-12 stroke-[3] animate-in zoom-in-50 duration-500" />
            </div>
          </div>

          {/* Headings */}
          <span className="font-serif-royal text-xs uppercase tracking-[0.3em] text-[#D4AF37] block mb-1">
            Royal Perfume Boutique
          </span>

          <h1 className="font-serif-royal text-3xl sm:text-4xl md:text-5xl font-black text-[#FFFFFF] tracking-wide mb-3 drop-shadow-md">
            ORDER SUCCESSFUL!
          </h1>

          <p className="font-editorial text-lg sm:text-xl text-[#F5EBDD]/90 italic mb-8 max-w-xl mx-auto">
            Thank you for shopping with ROYAL ESSENCE.
          </p>

          {/* 2. YOUR ORDER ESTIMATE CARD (Exactly 3 calendar days) */}
          <div className="mb-8 p-6 bg-gradient-to-r from-[#20150E] via-[#170E08] to-[#20150E] border-2 border-[#D4AF37]/60 rounded-xs text-left shadow-[0_10px_30px_rgba(0,0,0,0.6)] relative overflow-hidden">
            <div className="absolute -right-6 -bottom-6 w-32 h-32 bg-[#D4AF37]/10 rounded-full blur-2xl pointer-events-none" />

            <div className="flex items-center gap-2 mb-3">
              <Truck className="w-5 h-5 text-[#D4AF37]" />
              <h2 className="font-serif-royal text-sm sm:text-base font-bold text-[#FFFFFF] uppercase tracking-[0.2em]">
                YOUR ORDER ESTIMATE
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-4 border-b border-[#D4AF37]/25">
              <div>
                <span className="text-[11px] font-serif-royal uppercase text-[#AA8435] block">
                  Order Date
                </span>
                <span className="text-sm font-semibold text-[#FFFFFF] font-sans-body">
                  {orderDate}
                </span>
              </div>

              <div>
                <span className="text-[11px] font-serif-royal uppercase text-[#D4AF37] block font-bold">
                  Estimated Delivery Date
                </span>
                <span className="text-base sm:text-lg font-bold text-[#D4AF37] font-serif-royal">
                  {deliveryDate}
                </span>
              </div>
            </div>

            <div className="mt-4 space-y-2 text-xs text-[#F5EBDD]/85 leading-relaxed font-sans-body">
              <p className="flex items-start gap-2">
                <Clock className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" />
                <span>
                  <strong>Your order is expected to arrive within 3 days.</strong> However, your order may be delivered earlier.
                </span>
              </p>
              <p className="text-[11px] text-[#AA8435] italic pl-6">
                Delivery can happen anytime within these 3 days. Three days is the maximum estimated delivery period, not a requirement to wait exactly 3 days.
              </p>
            </div>
          </div>

          {/* 6. Order Tracking Stepper (5-Step System) */}
          <div className="mb-8 p-6 bg-[#130E0A] border border-[#D4AF37]/30 rounded-xs text-left">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Package className="w-4 h-4 text-[#D4AF37]" />
                <h3 className="font-serif-royal text-xs uppercase tracking-widest text-[#D4AF37] font-bold">
                  Live Order Status & Tracking
                </h3>
              </div>
              <span className="text-[11px] bg-[#D4AF37]/20 border border-[#D4AF37]/50 text-[#D4AF37] px-2.5 py-0.5 rounded-xs font-serif-royal font-bold uppercase">
                {order.status}
              </span>
            </div>

            {/* Stepper Timeline */}
            <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 pt-2">
              {TRACKING_STEPS.map((st, idx) => {
                const isPassed = idx <= currentStepIdx;
                const isCurrent = idx === currentStepIdx;
                return (
                  <div
                    key={st.key}
                    className={`p-3 rounded-xs border text-left transition-all ${
                      isCurrent
                        ? 'bg-[#251A12] border-[#D4AF37] shadow-[0_0_15px_rgba(212,175,55,0.3)]'
                        : isPassed
                        ? 'bg-[#18110B] border-[#10B981]/50 text-[#F5EBDD]'
                        : 'bg-[#0E0A08] border-[#D4AF37]/15 text-[#F5EBDD]/40'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[10px] font-mono text-[#AA8435]">
                        0{idx + 1}
                      </span>
                      {isPassed && (
                        <CheckCircle2
                          className={`w-3.5 h-3.5 ${
                            isCurrent ? 'text-[#D4AF37]' : 'text-[#10B981]'
                          }`}
                        />
                      )}
                    </div>
                    <p
                      className={`font-serif-royal text-xs font-bold leading-tight ${
                        isCurrent
                          ? 'text-[#D4AF37]'
                          : isPassed
                          ? 'text-[#FFFFFF]'
                          : 'text-[#F5EBDD]/40'
                      }`}
                    >
                      {st.label}
                    </p>
                    <span className="text-[10px] text-[#F5EBDD]/60 line-clamp-2 mt-1 leading-snug">
                      {st.desc}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 3. Comprehensive Order Details */}
          <div className="p-6 bg-[#110D09] border border-[#D4AF37]/35 rounded-xs text-left mb-8 font-sans-body space-y-4">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center pb-3 border-b border-[#D4AF37]/20 gap-3">
              <div>
                <span className="text-[10px] text-[#AA8435] uppercase block font-serif-royal">
                  Order ID
                </span>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="font-serif-royal font-bold text-xl text-[#FFFFFF]">
                    {order.id}
                  </span>
                  <button
                    onClick={handleCopyId}
                    className="p-1 text-[#D4AF37] hover:text-[#FFF2D6] bg-[#1C140E] border border-[#D4AF37]/40 rounded-xs transition-colors"
                    title="Copy Order ID"
                  >
                    {copiedId ? (
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                  {copiedId && (
                    <span className="text-[10px] text-emerald-400 font-sans-body">
                      Copied!
                    </span>
                  )}
                </div>
              </div>

              <div className="sm:text-right">
                <span className="text-[10px] text-[#AA8435] uppercase block font-serif-royal">
                  Customer Name
                </span>
                <span className="font-serif-royal font-bold text-base text-[#FFFFFF]">
                  {order.customerName}
                </span>
              </div>
            </div>

            {/* Ordered perfume names & selected bottle sizes */}
            <div>
              <span className="text-[10px] text-[#AA8435] uppercase block font-serif-royal mb-2">
                Ordered Perfumes & Sizes ({totalQuantity} items)
              </span>
              <div className="space-y-2">
                {order.items.map((it) => (
                  <div
                    key={it.id}
                    className="p-3 bg-[#17100B] border border-[#D4AF37]/20 rounded-xs flex items-center justify-between text-xs"
                  >
                    <div className="flex items-center gap-3">
                      {it.product.image && it.product.image.trim() !== '' ? (
                        <img
                          src={it.product.image}
                          alt={it.product.name}
                          className="w-10 h-10 object-contain rounded-xs bg-[#090705] p-0.5 border border-[#D4AF37]/20"
                        />
                      ) : (
                        <div className="w-10 h-10 shrink-0">
                          <ProductImagePlaceholder size="sm" className="w-full h-full p-0.5" />
                        </div>
                      )}
                      <div>
                        <strong className="font-serif-royal text-sm text-[#FFFFFF] block">
                          {it.product.name}
                        </strong>
                        <span className="text-[#D4AF37] font-semibold text-[11px]">
                          Selected Size: {it.size}
                        </span>
                        <span className="text-[#F5EBDD]/60 text-[11px] ml-2">
                          Qty: {it.quantity}
                        </span>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="font-serif-royal font-bold text-sm text-[#FFFFFF] tabular-nums">
                        ৳{(it.pricePerUnit * it.quantity).toLocaleString('en-US')}
                      </span>
                      <span className="text-[10px] text-[#F5EBDD]/50 block">
                        ৳{it.pricePerUnit} each
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Delivery address & Payment breakdown */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-3 border-t border-[#D4AF37]/20 text-xs">
              <div>
                <span className="text-[10px] text-[#AA8435] uppercase block font-serif-royal">
                  Delivery Destination
                </span>
                <p className="text-[#F5EBDD] font-medium mt-0.5">{order.address}</p>
                <p className="text-[#F5EBDD]/70 text-[11px]">Contact: {order.phone}</p>
              </div>

              <div>
                <span className="text-[10px] text-[#AA8435] uppercase block font-serif-royal">
                  Packaging Style
                </span>
                <p className="text-[#F5EBDD] mt-0.5 flex items-center gap-1.5">
                  <Gift className={`w-3.5 h-3.5 ${order.giftPackaging ? 'text-[#F3CD68]' : 'text-[#AA8435]'}`} />
                  <span>
                    Gift Packing:{' '}
                    <strong className={order.giftPackaging ? 'text-[#F3CD68] font-bold' : 'text-[#EED9C4]/70'}>
                      {order.giftPackaging ? 'YES (৳25)' : 'NO'}
                    </strong>
                  </span>
                </p>
                {order.giftPackaging && (
                  <span className="text-[10px] text-[#AA8435] italic block mt-0.5">
                    Premium gift presentation box included
                  </span>
                )}
              </div>

              <div>
                <span className="text-[10px] text-[#AA8435] uppercase block font-serif-royal">
                  Payment Verification
                </span>
                <p className="text-[#F5EBDD] mt-0.5">
                  Method:{' '}
                  <strong className="text-[#D4AF37] uppercase font-serif-royal">
                    {order.paymentMethod}
                  </strong>
                </p>
                <p className="text-[#F5EBDD]/80 text-[11px]">
                  Sender Mobile: {order.senderNumber}
                </p>
                <p className="text-[#F5EBDD]/80 text-[11px] font-mono">
                  TrxID: <span className="text-[#D4AF37]">{order.transactionId}</span>
                </p>
              </div>
            </div>

            {/* Total Payment Amount */}
            <div className="pt-3 border-t border-[#D4AF37]/20 flex flex-col sm:flex-row justify-between sm:items-center gap-2">
              <div className="text-xs text-[#F5EBDD]/70">
                Product Subtotal: ৳{order.subtotal.toLocaleString('en-US')}
                {order.discountAmount && order.discountAmount > 0 ? (
                  <span className="text-[#10B981] font-semibold"> - Coupon ({order.appliedOfferCode || 'OFFER'}): ৳{order.discountAmount}</span>
                ) : null}
                {order.giftPackaging && (
                  <span className="text-[#F3CD68] font-semibold"> + Gift Packing: ৳25</span>
                )}
                <span> + Delivery Charge: ৳{order.deliveryCharge}</span>
              </div>
              <div className="sm:text-right">
                <span className="text-[10px] text-[#AA8435] uppercase block font-serif-royal">
                  Final Total Paid
                </span>
                <span className="font-serif-royal font-black text-2xl sm:text-3xl text-[#D4AF37] tabular-nums">
                  ৳{order.total.toLocaleString('en-US')} BDT
                </span>
              </div>
            </div>
          </div>

          {/* 4 & 5. Action Buttons: CONTINUE SHOPPING, TRACK IN MY ORDERS, & Print */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
            {/* Primary Continue Shopping Button */}
            <button
              onClick={onContinueShopping}
              className="w-full sm:w-auto min-w-[200px] flex items-center justify-center gap-2 bg-gradient-to-r from-[#D4AF37] via-[#E5C365] to-[#AA8435] text-[#050505] font-serif-royal font-bold text-xs uppercase tracking-[0.18em] py-3.5 px-6 rounded-xs hover:shadow-[0_4px_25px_rgba(212,175,55,0.45)] hover:scale-[1.01] transition-all"
            >
              <ShoppingBag className="w-4 h-4 text-[#050505]" />
              <span>CONTINUE SHOPPING</span>
              <ArrowRight className="w-4 h-4 text-[#050505]" />
            </button>

            {/* Track in My Orders Button */}
            {onOpenMyOrders && (
              <button
                onClick={onOpenMyOrders}
                className="w-full sm:w-auto flex items-center justify-center gap-2 bg-[#0A1F30] border border-[#D4AF37]/70 text-[#F3CD68] font-serif-royal font-bold text-xs uppercase tracking-wider py-3.5 px-6 rounded-xs hover:bg-[#0D2840] transition-colors"
              >
                <Truck className="w-4 h-4 text-[#F3CD68]" />
                <span>Track In MY ORDERS</span>
              </button>
            )}

            {/* Print Receipt / Save Invoice */}
            <button
              onClick={handlePrint}
              className="w-full sm:w-auto flex items-center justify-center gap-2 bg-[#1A120B] border border-[#D4AF37]/50 text-[#D4AF37] font-serif-royal text-xs font-semibold uppercase tracking-wider py-3.5 px-5 rounded-xs hover:bg-[#251A10] transition-colors"
            >
              <Printer className="w-4 h-4" />
              <span>Print Invoice</span>
            </button>
          </div>

          {/* Footer note */}
          <p className="text-[11px] text-[#AA8435] mt-6 italic">
            You can track this order at any time using Order ID: <strong className="text-[#FFFFFF]">{order.id}</strong>
          </p>
        </div>
      </div>
    </div>
  );
};
