import React, { useState } from 'react';
import { Order, OrderStatus, PaymentStatus } from '../types';
import {
  X,
  Package,
  Truck,
  Clock,
  CheckCircle2,
  Copy,
  Check,
  Search,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  AlertTriangle,
  FileText,
  Calendar,
  Sparkles,
  Phone,
  MapPin,
  CreditCard,
  Gift,
} from 'lucide-react';
import { Islamic8PointStar } from './ArabianDecorations';
import { ProductImagePlaceholder } from './ProductImagePlaceholder';

interface MyOrdersModalProps {
  isOpen: boolean;
  onClose: () => void;
  orders: Order[];
  onUpdatePaymentDetails?: (orderId: string, senderNumber: string, transactionId: string, screenshotNote?: string) => void;
}

// 5 core stages required by user
const TIMELINE_STAGES: {
  key: OrderStatus;
  label: string;
  defaultDesc: string;
}[] = [
  {
    key: 'Order Placed',
    label: 'ORDER PLACED ✓',
    defaultDesc: 'Your order has been successfully received.',
  },
  {
    key: 'Order Confirmed',
    label: 'ORDER CONFIRMED ✓',
    defaultDesc: 'Your order has been confirmed by ROYAL ESSENCE.',
  },
  {
    key: 'Preparing Your Order',
    label: 'PREPARING YOUR ORDER',
    defaultDesc: 'Your perfume is currently being prepared and packaged.',
  },
  {
    key: 'Out for Delivery',
    label: 'OUT FOR DELIVERY',
    defaultDesc: 'Your order has left our delivery facility and is on its way to you.',
  },
  {
    key: 'Delivered',
    label: 'DELIVERED ✓',
    defaultDesc: 'Your order has been successfully delivered.',
  },
];

const getStageIndex = (status: OrderStatus): number => {
  if (status === 'Order Placed' || status === 'Pending') return 0;
  if (status === 'Order Confirmed' || status === 'Confirmed') return 1;
  if (status === 'Preparing Your Order') return 2;
  if (status === 'Out for Delivery') return 3;
  if (status === 'Delivered') return 4;
  if (status === 'Cancelled') return -1;
  return 0;
};

// Calculate 3 calendar days or return admin specified date
export const getEstimatedDelivery = (createdAtStr: string, customDeliveryDate?: string) => {
  if (customDeliveryDate && customDeliveryDate.trim()) {
    return {
      dateString: customDeliveryDate,
      isCustom: true,
    };
  }

  let baseDate = new Date();
  if (createdAtStr) {
    const parsed = new Date(createdAtStr);
    if (!isNaN(parsed.getTime())) {
      baseDate = parsed;
    }
  }

  const est = new Date(baseDate);
  est.setDate(est.getDate() + 3);

  return {
    dateString: est.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    }),
    isCustom: false,
  };
};

export const MyOrdersModal: React.FC<MyOrdersModalProps> = ({
  isOpen,
  onClose,
  orders,
  onUpdatePaymentDetails,
}) => {
  if (!isOpen) return null;

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(
    orders.length > 0 ? orders[0] : null
  );
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // In-modal payment submission for UNPAID orders
  const [isPayingNow, setIsPayingNow] = useState(false);
  const [paySenderNumber, setPaySenderNumber] = useState('');
  const [payTrxId, setPayTrxId] = useState('');
  const [payScreenshot, setPayScreenshot] = useState('');
  const [paySubmitted, setPaySubmitted] = useState(false);

  const filteredOrders = orders.filter((o) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase().trim();
    return (
      o.id.toLowerCase().includes(q) ||
      o.phone.toLowerCase().includes(q) ||
      o.customerName.toLowerCase().includes(q) ||
      o.transactionId.toLowerCase().includes(q)
    );
  });

  const handleCopy = (id: string) => {
    navigator.clipboard.writeText(id);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handlePaySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOrder || !paySenderNumber.trim() || !payTrxId.trim()) return;

    if (onUpdatePaymentDetails) {
      onUpdatePaymentDetails(selectedOrder.id, paySenderNumber.trim(), payTrxId.trim(), payScreenshot.trim());
    }

    setPaySubmitted(true);
    setTimeout(() => {
      setPaySubmitted(false);
      setIsPayingNow(false);
      setPaySenderNumber('');
      setPayTrxId('');
      setPayScreenshot('');
    }, 1500);
  };

  const currentOrder = selectedOrder || (filteredOrders.length > 0 ? filteredOrders[0] : null);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-6 bg-[#030810]/90 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl bg-gradient-to-b from-[#07241A] via-[#0A1D36] to-[#1C0816] border border-[#D4AF37]/50 rounded-t-[28px] rounded-b-xs shadow-[0_25px_80px_rgba(0,0,0,0.95)] overflow-hidden my-auto sm:my-6 max-h-[95vh] sm:max-h-[92vh] flex flex-col">
        {/* Subtle Islamic Girih Grid Backdrop */}
        <div className="absolute inset-0 bg-islamic-girih opacity-20 pointer-events-none" />

        {/* Header Bar */}
        <div className="relative p-5 sm:p-6 border-b border-[#D4AF37]/30 flex items-center justify-between bg-[#051A13]/90 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#06261C] border border-[#D4AF37] flex items-center justify-center text-[#F3CD68] shadow-[0_0_15px_rgba(212,175,55,0.4)]">
              <Package className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <Islamic8PointStar size={13} className="text-[#F3CD68]" />
                <h2 className="font-serif-royal text-lg sm:text-xl font-bold text-[#FFFFFF] tracking-wider uppercase">
                  MY ORDERS & TRACKING
                </h2>
              </div>
              <p className="text-xs text-[#EED9C4]/80 font-sans-body">
                Track your active orders, verify payments, and inspect live dispatch timeline
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-[#EED9C4]/70 hover:text-[#FFFFFF] bg-[#04121E] border border-[#D4AF37]/30 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6 relative z-10">
          {/* Top Search / Filter Bar */}
          <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
            <div className="relative flex-1 w-full">
              <Search className="w-4 h-4 text-[#F3CD68] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by Order ID (e.g. RE-123456) or Mobile Number..."
                className="w-full bg-[#041424]/90 border border-[#D4AF37]/40 text-xs text-[#F5EBDD] pl-10 pr-4 py-2.5 rounded-full focus:outline-none focus:border-[#F3CD68] placeholder-[#EED9C4]/50"
              />
            </div>
            <span className="text-xs text-[#F3CD68] font-serif-royal font-semibold whitespace-nowrap">
              {filteredOrders.length} {filteredOrders.length === 1 ? 'Order Found' : 'Orders Found'}
            </span>
          </div>

          {/* Horizontal Order Selector Chips */}
          {filteredOrders.length > 0 && (
            <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-[#D4AF37]/20">
              {filteredOrders.map((ord) => {
                const isSelected = currentOrder?.id === ord.id;
                const isPaid = ord.paymentStatus === 'PAID / VERIFIED';
                const isPending = ord.paymentStatus === 'PAYMENT VERIFICATION PENDING';
                const isUnpaid = ord.paymentStatus === 'UNPAID';

                return (
                  <button
                    key={ord.id}
                    onClick={() => {
                      setSelectedOrder(ord);
                      setIsPayingNow(false);
                    }}
                    className={`px-4 py-2 rounded-full border text-xs font-serif-royal whitespace-nowrap flex items-center gap-2 transition-all shrink-0 ${
                      isSelected
                        ? 'bg-gradient-to-r from-[#D4AF37] to-[#AA8435] text-[#050505] font-bold border-[#FFF2D6] shadow-[0_0_15px_rgba(212,175,55,0.4)]'
                        : 'bg-[#061C2C]/80 text-[#EED9C4] border-[#D4AF37]/30 hover:border-[#F3CD68]'
                    }`}
                  >
                    <span>{ord.id}</span>
                    <span
                      className={`text-[9px] px-1.5 py-0.2 rounded-full font-bold uppercase ${
                        isPaid
                          ? 'bg-[#10B981] text-white'
                          : isPending
                          ? 'bg-[#F59E0B] text-black'
                          : 'bg-[#EF4444] text-white'
                      }`}
                    >
                      {ord.paymentStatus}
                    </span>
                  </button>
                );
              })}
            </div>
          )}

          {/* Active Selected Order View */}
          {currentOrder ? (
            <div className="space-y-6 animate-in fade-in duration-200">
              {/* Order Reference Header Card */}
              <div className="p-5 bg-gradient-to-r from-[#06261C] via-[#0A1C3B] to-[#250918] border border-[#D4AF37]/45 rounded-t-[20px] rounded-b-xs shadow-lg">
                <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 pb-4 border-b border-[#D4AF37]/25">
                  <div>
                    <span className="text-[10px] text-[#F3CD68] uppercase font-serif-royal tracking-widest block font-bold">
                      Order Identification
                    </span>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="font-serif-royal font-black text-2xl text-[#FFFFFF]">
                        {currentOrder.id}
                      </span>
                      <button
                        onClick={() => handleCopy(currentOrder.id)}
                        className="p-1.5 bg-[#030E18] border border-[#D4AF37]/40 hover:border-[#F3CD68] text-[#F3CD68] rounded-xs text-xs flex items-center gap-1 transition-colors"
                        title="Copy Order ID"
                      >
                        {copiedId === currentOrder.id ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                            <span className="text-[10px] text-emerald-400">Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span className="text-[10px]">Copy ID</span>
                          </>
                        )}
                      </button>
                    </div>
                    <span className="text-xs text-[#EED9C4]/70 mt-1 block">
                      Placed on: {new Date(currentOrder.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                  </div>

                  <div className="flex flex-col sm:items-end gap-1.5">
                    {/* Payment Status Badge */}
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-[#EED9C4]/70 uppercase font-serif-royal">
                        Payment Status:
                      </span>
                      <span
                        className={`text-xs px-3 py-1 rounded-full font-serif-royal font-bold uppercase tracking-wider border ${
                          currentOrder.paymentStatus === 'PAID / VERIFIED'
                            ? 'bg-[#10B981]/20 border-[#10B981] text-[#10B981]'
                            : currentOrder.paymentStatus === 'PAYMENT VERIFICATION PENDING'
                            ? 'bg-[#F59E0B]/20 border-[#F59E0B] text-[#F59E0B]'
                            : currentOrder.paymentStatus === 'PAYMENT REJECTED'
                            ? 'bg-[#EF4444]/20 border-[#EF4444] text-[#EF4444]'
                            : 'bg-[#DC2626]/20 border-[#DC2626] text-[#EF4444]'
                        }`}
                      >
                        {currentOrder.paymentStatus}
                      </span>
                    </div>

                    {/* Delivery Status Badge */}
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-[#EED9C4]/70 uppercase font-serif-royal">
                        Delivery Status:
                      </span>
                      <span className="text-xs bg-[#D4AF37]/20 border border-[#D4AF37]/50 text-[#F3CD68] px-3 py-0.5 rounded-full font-serif-royal font-bold uppercase">
                        {currentOrder.status}
                      </span>
                    </div>
                  </div>
                </div>

                {/* If UNPAID, prompt customer to submit payment info */}
                {currentOrder.paymentStatus === 'UNPAID' && (
                  <div className="mt-4 p-4 bg-[#2A0815]/90 border border-[#EF4444]/60 rounded-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-2 text-[#FCA5A5] text-xs">
                      <AlertTriangle className="w-5 h-5 text-[#EF4444] shrink-0" />
                      <span>
                        <strong>PAYMENT NOT RECEIVED:</strong> Your order is on hold until payment is submitted.
                      </span>
                    </div>
                    <button
                      onClick={() => setIsPayingNow(!isPayingNow)}
                      className="px-4 py-2 bg-gradient-to-r from-[#D4AF37] to-[#AA8435] text-[#050505] font-serif-royal font-bold text-xs uppercase tracking-wider rounded-xs hover:shadow-md shrink-0"
                    >
                      {isPayingNow ? 'Close Form' : 'Submit Payment Info'}
                    </button>
                  </div>
                )}

                {/* Pay Now Form for UNPAID orders */}
                {isPayingNow && (
                  <form onSubmit={handlePaySubmit} className="mt-4 p-4 bg-[#0A1A2B] border border-[#D4AF37]/50 rounded-xs space-y-3">
                    <h4 className="font-serif-royal text-xs font-bold uppercase text-[#F3CD68] tracking-wider">
                      Submit Payment Information for {currentOrder.id}
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                      <div>
                        <label className="block text-[#EED9C4] mb-1 font-serif-royal text-[10px] uppercase">
                          Sender Mobile Number *
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="01XXXXXXXXX"
                          value={paySenderNumber}
                          onChange={(e) => setPaySenderNumber(e.target.value)}
                          className="w-full bg-[#05111F] border border-[#D4AF37]/40 text-xs text-white p-2.5 rounded-xs focus:outline-none focus:border-[#F3CD68]"
                        />
                      </div>
                      <div>
                        <label className="block text-[#EED9C4] mb-1 font-serif-royal text-[10px] uppercase">
                          Transaction ID (TrxID) *
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. 9K8J2LM3"
                          value={payTrxId}
                          onChange={(e) => setPayTrxId(e.target.value)}
                          className="w-full bg-[#05111F] border border-[#D4AF37]/40 text-xs text-white p-2.5 rounded-xs font-mono focus:outline-none focus:border-[#F3CD68]"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-[#EED9C4] mb-1 font-serif-royal text-[10px] uppercase">
                        Screenshot Reference / Notes (Optional)
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Screenshot saved in bKash app / Remarks"
                        value={payScreenshot}
                        onChange={(e) => setPayScreenshot(e.target.value)}
                        className="w-full bg-[#05111F] border border-[#D4AF37]/40 text-xs text-white p-2 rounded-xs focus:outline-none focus:border-[#F3CD68]"
                      />
                    </div>
                    <button
                      type="submit"
                      className="w-full py-2.5 bg-gradient-to-r from-[#10B981] to-[#059669] text-white font-serif-royal font-bold text-xs uppercase tracking-wider rounded-xs hover:shadow-lg transition-all"
                    >
                      {paySubmitted ? 'Submitting Payment...' : 'Confirm & Send to Admin'}
                    </button>
                  </form>
                )}
              </div>

              {/* 2. ORDER TRACKING TIMELINE (5 STAGES AS REQUESTED) */}
              <div className="p-6 bg-gradient-to-b from-[#062118] via-[#091C30] to-[#160714] border border-[#D4AF37]/40 rounded-t-[20px] rounded-b-xs shadow-md">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-2">
                    <Truck className="w-5 h-5 text-[#F3CD68]" />
                    <h3 className="font-serif-royal text-sm uppercase tracking-widest text-[#F3CD68] font-bold">
                      Order Tracking Timeline
                    </h3>
                  </div>
                  <span className="text-xs text-[#2DD4BF] font-mono">
                    Step {Math.max(1, getStageIndex(currentOrder.status) + 1)} of 5
                  </span>
                </div>

                {/* Visual Timeline Stepper */}
                <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 relative">
                  {TIMELINE_STAGES.map((st, idx) => {
                    const currentIdx = getStageIndex(currentOrder.status);
                    const isCompleted = idx < currentIdx;
                    const isCurrent = idx === currentIdx;
                    const isUpcoming = idx > currentIdx;

                    return (
                      <div
                        key={st.key}
                        className={`p-3.5 rounded-t-[14px] rounded-b-xs border transition-all text-left relative overflow-hidden ${
                          isCurrent
                            ? 'bg-gradient-to-b from-[#0B3B2B] to-[#0A263D] border-[#F3CD68] shadow-[0_0_20px_rgba(243,205,104,0.4)] scale-[1.02]'
                            : isCompleted
                            ? 'bg-[#051A13]/90 border-[#10B981]/50 text-white'
                            : 'bg-[#040E1A]/70 border-[#D4AF37]/15 text-[#EED9C4]/40'
                        }`}
                      >
                        {/* Golden pulse line on current active stage */}
                        {isCurrent && (
                          <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-[#D4AF37] via-[#FFF2D6] to-[#D4AF37] animate-pulse" />
                        )}

                        <div className="flex items-center justify-between mb-2">
                          <span className="font-mono text-[10px] text-[#F3CD68] font-bold">
                            0{idx + 1}
                          </span>
                          {isCompleted ? (
                            <div className="w-5 h-5 rounded-full bg-[#10B981] flex items-center justify-center text-black">
                              <Check className="w-3.5 h-3.5 stroke-[3]" />
                            </div>
                          ) : isCurrent ? (
                            <div className="w-5 h-5 rounded-full bg-[#F3CD68] flex items-center justify-center text-black animate-bounce">
                              <Sparkles className="w-3.5 h-3.5 stroke-[2.5]" />
                            </div>
                          ) : (
                            <div className="w-5 h-5 rounded-full bg-[#1F2937] border border-[#4B5563] flex items-center justify-center text-gray-500">
                              <span className="w-1.5 h-1.5 rounded-full bg-gray-500" />
                            </div>
                          )}
                        </div>

                        <p
                          className={`font-serif-royal text-xs font-bold tracking-wider uppercase mb-1 ${
                            isCurrent
                              ? 'text-[#F3CD68]'
                              : isCompleted
                              ? 'text-[#FFFFFF]'
                              : 'text-gray-500'
                          }`}
                        >
                          {st.label}
                        </p>

                        <p className="text-[10px] text-[#EED9C4]/70 leading-snug line-clamp-3">
                          {st.defaultDesc}
                        </p>
                      </div>
                    );
                  })}
                </div>

                {/* 3. Contextual status messages as requested */}
                <div className="mt-5 p-4 bg-[#04121E]/90 border border-[#D4AF37]/30 rounded-xs text-xs space-y-1.5 font-sans-body">
                  {currentOrder.status === 'Preparing Your Order' && (
                    <div className="flex items-start gap-2 text-[#F3CD68]">
                      <Clock className="w-4 h-4 shrink-0 mt-0.5" />
                      <span>
                        <strong>Preparing Your Order:</strong> Your order is being prepared. We will deliver it as soon as possible.
                      </span>
                    </div>
                  )}

                  {currentOrder.status === 'Out for Delivery' && (
                    <div className="flex items-start gap-2 text-[#2DD4BF]">
                      <Truck className="w-4 h-4 shrink-0 mt-0.5 text-[#10B981]" />
                      <span>
                        <strong>Out for Delivery:</strong> Great news! Your order is on its way to you.
                        {currentOrder.deliveryNotes && (
                          <span className="block mt-1 text-[#F3CD68]">
                            Delivery Notes: {currentOrder.deliveryNotes}
                          </span>
                        )}
                      </span>
                    </div>
                  )}

                  {currentOrder.status === 'Delivered' && (
                    <div className="flex items-start gap-2 text-emerald-400">
                      <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
                      <span>
                        <strong>Delivered:</strong> Your order has been delivered successfully. Thank you for choosing ROYAL ESSENCE!
                      </span>
                    </div>
                  )}

                  {(currentOrder.status === 'Order Placed' || currentOrder.status === 'Order Confirmed') && (
                    <div className="flex items-start gap-2 text-[#EED9C4]">
                      <Clock className="w-4 h-4 shrink-0 mt-0.5 text-[#F3CD68]" />
                      <span>
                        Your order is confirmed in the ROYAL ESSENCE system. Artisanal packaging will begin shortly.
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* 3. EXPECTED DELIVERY DATE SECTION */}
              {(() => {
                const est = getEstimatedDelivery(currentOrder.createdAt, currentOrder.customDeliveryDate);
                return (
                  <div className="p-5 bg-gradient-to-r from-[#06241D] via-[#0A1C3B] to-[#1F0717] border border-[#D4AF37]/40 rounded-t-[16px] rounded-b-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-[#04121E] border border-[#F3CD68] flex items-center justify-center text-[#F3CD68]">
                        <Calendar className="w-5 h-5" />
                      </div>
                      <div>
                        <span className="text-[10px] text-[#F3CD68] uppercase font-serif-royal tracking-widest block font-bold">
                          EXPECTED DELIVERY DATE
                        </span>
                        <span className="font-serif-royal font-bold text-lg text-white">
                          {est.dateString}
                        </span>
                        <p className="text-[11px] text-[#EED9C4]/70 mt-0.5">
                          {est.isCustom
                            ? 'Special courier schedule confirmed by Royal Essence logistics.'
                            : 'Standard 3 calendar days delivery window across Bangladesh.'}
                        </p>
                      </div>
                    </div>

                    <div className="text-right sm:border-l sm:border-[#D4AF37]/20 sm:pl-4">
                      <span className="text-[10px] text-[#2DD4BF] block font-medium">Flat ৳10 Delivery Charge</span>
                      <span className="text-[10px] text-[#EED9C4]/60">Nationwide Express</span>
                    </div>
                  </div>
                );
              })()}

              {/* 6. INDIVIDUAL ORDER DETAILS */}
              <div className="p-6 bg-[#040E1A]/95 border border-[#D4AF37]/35 rounded-t-[20px] rounded-b-xs space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-[#D4AF37]/20">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-[#F3CD68]" />
                    <h4 className="font-serif-royal text-xs font-bold uppercase tracking-wider text-[#FFFFFF]">
                      Ordered Perfumes & Package Breakdown
                    </h4>
                  </div>
                  <span className="text-xs text-[#EED9C4]/70">
                    {currentOrder.items.reduce((acc, it) => acc + it.quantity, 0)} Items Total
                  </span>
                </div>

                {/* Items List */}
                <div className="space-y-2.5">
                  {currentOrder.items.map((it) => (
                    <div
                      key={it.id}
                      className="p-3 bg-[#061826] border border-[#D4AF37]/20 rounded-xs flex items-center justify-between text-xs"
                    >
                      <div className="flex items-center gap-3">
                        {it.product.image && it.product.image.trim() !== '' ? (
                          <img
                            src={it.product.image}
                            alt={it.product.name}
                            className="w-12 h-12 object-contain bg-[#02070D] p-1 rounded-xs border border-[#D4AF37]/20"
                          />
                        ) : (
                          <div className="w-12 h-12 shrink-0">
                            <ProductImagePlaceholder size="sm" className="w-full h-full p-0.5" />
                          </div>
                        )}
                        <div>
                          <strong className="font-serif-royal text-sm text-white block">
                            {it.product.name}
                          </strong>
                          <span className="text-[#F3CD68] font-bold text-[11px]">
                            Selected Size: {it.size}
                          </span>
                          <span className="text-[#EED9C4]/70 text-[11px] ml-2">
                            Quantity: {it.quantity}
                          </span>
                        </div>
                      </div>

                      <div className="text-right">
                        <span className="font-serif-royal font-bold text-sm text-white tabular-nums">
                          ৳{(it.pricePerUnit * it.quantity).toLocaleString('en-US')}
                        </span>
                        <span className="text-[10px] text-[#EED9C4]/60 block">
                          ৳{it.pricePerUnit} per unit
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Delivery Destination & Payment Verification Info */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-[#D4AF37]/20 text-xs">
                  <div>
                    <div className="flex items-center gap-1.5 text-[#F3CD68] font-serif-royal text-[11px] uppercase font-bold mb-1">
                      <MapPin className="w-3.5 h-3.5" />
                      <span>Delivery Destination</span>
                    </div>
                    <p className="text-white font-medium">{currentOrder.customerName}</p>
                    <p className="text-[#EED9C4]/80 text-[11px] mt-0.5">{currentOrder.address}</p>
                    {currentOrder.addressDetails && (
                      <div className="mt-1 text-[10px] text-[#2DD4BF]">
                        Division: {currentOrder.addressDetails.division} · District: {currentOrder.addressDetails.district} · Upazila: {currentOrder.addressDetails.upazila} · Postal: {currentOrder.addressDetails.postalCode}
                      </div>
                    )}
                    <p className="text-[#EED9C4]/70 text-[11px] mt-1 flex items-center gap-1">
                      <Phone className="w-3 h-3 text-[#F3CD68]" />
                      {currentOrder.phone}
                    </p>
                  </div>

                  <div>
                    <div className="flex items-center gap-1.5 text-[#F3CD68] font-serif-royal text-[11px] uppercase font-bold mb-1">
                      <Gift className="w-3.5 h-3.5" />
                      <span>Packaging Option</span>
                    </div>
                    <p className="text-[#EED9C4]">
                      Gift Packing:{' '}
                      <strong className={currentOrder.giftPackaging ? 'text-[#F3CD68] font-bold uppercase' : 'text-[#EED9C4]/70 uppercase'}>
                        {currentOrder.giftPackaging ? 'YES (৳25)' : 'NO'}
                      </strong>
                    </p>
                    {currentOrder.giftPackaging ? (
                      <p className="text-[#EED9C4]/80 text-[11px] mt-0.5">
                        Special premium gift box included.
                      </p>
                    ) : (
                      <p className="text-[#EED9C4]/60 text-[11px] mt-0.5">
                        Standard luxury perfume box.
                      </p>
                    )}
                  </div>

                  <div>
                    <div className="flex items-center gap-1.5 text-[#F3CD68] font-serif-royal text-[11px] uppercase font-bold mb-1">
                      <CreditCard className="w-3.5 h-3.5" />
                      <span>Payment Verification Info</span>
                    </div>
                    <p className="text-[#EED9C4]">
                      Payment Method: <strong className="text-[#F3CD68] uppercase">{currentOrder.paymentMethod}</strong>
                    </p>
                    <p className="text-[#EED9C4]/80 text-[11px]">
                      Sender Mobile: {currentOrder.senderNumber || 'Not Provided'}
                    </p>
                    <p className="text-[#EED9C4]/80 text-[11px] font-mono">
                      Transaction ID: <span className="text-[#F3CD68]">{currentOrder.transactionId || 'Pending Submission'}</span>
                    </p>
                    <p className="text-[11px] mt-1">
                      Status: <strong className="text-white uppercase font-bold">{currentOrder.paymentStatus}</strong>
                    </p>
                  </div>
                </div>

                {/* Financial Totals */}
                <div className="pt-4 border-t border-[#D4AF37]/20 flex flex-col sm:flex-row justify-between sm:items-center gap-2">
                  <span className="text-xs text-[#EED9C4]/70">
                    Product Subtotal: ৳{currentOrder.subtotal.toLocaleString('en-US')}
                    {currentOrder.discountAmount && currentOrder.discountAmount > 0 ? (
                      <span className="text-[#10B981] font-semibold"> - Coupon ({currentOrder.appliedOfferCode || 'OFFER'}): ৳{currentOrder.discountAmount}</span>
                    ) : null}
                    {currentOrder.giftPackaging && (
                      <span className="text-[#F3CD68] font-semibold"> + Gift Packing: ৳25</span>
                    )}
                    <span> + Delivery Charge: ৳{currentOrder.deliveryCharge}</span>
                  </span>
                  <div className="sm:text-right">
                    <span className="text-[10px] text-[#F3CD68] uppercase font-serif-royal block">
                      Total Payable Amount
                    </span>
                    <span className="font-serif-royal font-black text-2xl text-[#F3CD68] tabular-nums">
                      ৳{currentOrder.total.toLocaleString('en-US')} BDT
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-12 text-[#EED9C4]/70 space-y-3">
              <Package className="w-12 h-12 text-[#D4AF37] mx-auto opacity-60" />
              <h3 className="font-serif-royal text-base text-white font-bold">
                No Orders Found
              </h3>
              <p className="text-xs max-w-sm mx-auto">
                No orders match your query. Enter your unique Order ID or Mobile Number to look up an order.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
