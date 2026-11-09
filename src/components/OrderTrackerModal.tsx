import React, { useState } from 'react';
import { Order, OrderStatus } from '../types';
import {
  X,
  Search,
  Package,
  Truck,
  Clock,
  CheckCircle2,
  Calendar,
  AlertCircle,
  ExternalLink,
  Gift,
} from 'lucide-react';
import { calculateDeliveryEstimate } from './OrderSuccessModal';

interface OrderTrackerModalProps {
  isOpen: boolean;
  onClose: () => void;
  orders: Order[];
  onSelectOrderToView?: (order: Order) => void;
}

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

const getStepIndex = (status: OrderStatus): number => {
  if (status === 'Order Placed' || status === 'Pending') return 0;
  if (status === 'Order Confirmed' || status === 'Confirmed') return 1;
  if (status === 'Preparing Your Order') return 2;
  if (status === 'Out for Delivery') return 3;
  if (status === 'Delivered') return 4;
  return 0;
};

export const OrderTrackerModal: React.FC<OrderTrackerModalProps> = ({
  isOpen,
  onClose,
  orders,
  onSelectOrderToView,
}) => {
  if (!isOpen) return null;

  const [query, setQuery] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(
    orders.length > 0 ? orders[0] : null
  );

  const matchedOrders = orders.filter((o) => {
    if (!query.trim()) return true;
    const q = query.trim().toLowerCase();
    return (
      o.id.toLowerCase().includes(q) ||
      o.phone.toLowerCase().includes(q) ||
      o.customerName.toLowerCase().includes(q) ||
      o.transactionId.toLowerCase().includes(q)
    );
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-[#030302]/90 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-gradient-to-b from-[#18110B] via-[#0F0B08] to-[#080605] border border-[#D4AF37]/50 rounded-xs shadow-[0_20px_70px_rgba(0,0,0,0.95)] overflow-hidden my-6">
        {/* Header */}
        <div className="p-5 border-b border-[#D4AF37]/25 flex items-center justify-between bg-[#140E0A]">
          <div className="flex items-center gap-2.5">
            <Package className="w-5 h-5 text-[#D4AF37]" />
            <h2 className="font-serif-royal text-base sm:text-lg font-bold text-[#FFFFFF] tracking-wider uppercase">
              Track Your Royal Essence Order
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-[#F5EBDD]/60 hover:text-[#D4AF37] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 sm:p-6 space-y-5 max-h-[80vh] overflow-y-auto">
          {/* Search box */}
          <div className="relative">
            <Search className="w-4 h-4 text-[#D4AF37] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by Order ID (e.g. RE-882194) or mobile number..."
              className="w-full bg-[#110D09] border border-[#D4AF37]/30 text-xs text-[#F5EBDD] pl-10 pr-4 py-3 rounded-xs focus:outline-none focus:border-[#D4AF37]"
            />
          </div>

          {/* Quick Recent Orders Chips */}
          {orders.length > 0 && (
            <div>
              <span className="text-[10px] text-[#AA8435] uppercase block font-serif-royal mb-2">
                Recent Orders in this browser:
              </span>
              <div className="flex flex-wrap gap-2">
                {orders.slice(0, 4).map((o) => (
                  <button
                    key={o.id}
                    onClick={() => setSelectedOrder(o)}
                    className={`text-xs px-3 py-1.5 rounded-xs border font-serif-royal transition-all ${
                      selectedOrder?.id === o.id
                        ? 'bg-[#D4AF37] text-[#050505] font-bold border-[#D4AF37]'
                        : 'bg-[#18110B] text-[#D4AF37] border-[#D4AF37]/30 hover:border-[#D4AF37]'
                    }`}
                  >
                    {o.id} ({o.status})
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Selected Order Status Detail Card */}
          {selectedOrder ? (
            <div className="p-5 bg-[#120D09] border border-[#D4AF37]/40 rounded-xs space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-[#D4AF37]/20 gap-2">
                <div>
                  <span className="text-[10px] text-[#AA8435] uppercase block font-serif-royal">
                    Order Reference
                  </span>
                  <span className="font-serif-royal font-bold text-lg text-[#FFFFFF]">
                    {selectedOrder.id}
                  </span>
                  <span className="text-[11px] text-[#F5EBDD]/60 block">
                    Placed for {selectedOrder.customerName}
                  </span>
                </div>

                <div className="sm:text-right">
                  <span className="text-[10px] text-[#AA8435] uppercase block font-serif-royal">
                    Current Status
                  </span>
                  <span className="inline-block bg-[#D4AF37]/20 border border-[#D4AF37]/50 text-[#D4AF37] px-3 py-0.5 rounded-xs font-serif-royal font-bold text-xs uppercase">
                    {selectedOrder.status}
                  </span>
                </div>
              </div>

              {/* 3-day Estimate info */}
              {(() => {
                const { orderDate, deliveryDate } = calculateDeliveryEstimate(
                  selectedOrder.createdAt
                );
                return (
                  <div className="p-3.5 bg-[#1A120B] border border-[#D4AF37]/25 rounded-xs text-xs space-y-1.5">
                    <div className="flex items-center gap-2 text-[#D4AF37] font-serif-royal font-bold uppercase text-[11px]">
                      <Truck className="w-3.5 h-3.5" />
                      <span>YOUR ORDER ESTIMATE</span>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-[#F5EBDD]/70">Order Date:</span>
                      <strong className="text-[#FFFFFF]">{orderDate}</strong>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-[#D4AF37]">Estimated Delivery:</span>
                      <strong className="text-[#D4AF37] font-serif-royal">
                        {deliveryDate}
                      </strong>
                    </div>
                    <p className="text-[10px] text-[#AA8435] italic pt-1">
                      Expected to arrive within 3 days (can arrive earlier).
                    </p>
                  </div>
                );
              })()}

              {/* 5-step visual tracking */}
              <div>
                <span className="text-[10px] text-[#AA8435] uppercase block font-serif-royal mb-2">
                  Dispatch & Delivery Timeline:
                </span>
                <div className="space-y-2">
                  {TRACKING_STEPS.map((st, idx) => {
                    const currentIdx = getStepIndex(selectedOrder.status);
                    const isPassed = idx <= currentIdx;
                    const isCurrent = idx === currentIdx;

                    return (
                      <div
                        key={st.key}
                        className={`p-2.5 rounded-xs border flex items-center justify-between text-xs ${
                          isCurrent
                            ? 'bg-[#251A12] border-[#D4AF37] text-[#D4AF37] font-semibold'
                            : isPassed
                            ? 'bg-[#16100B] border-[#10B981]/40 text-[#FFFFFF]'
                            : 'bg-[#0E0A08] border-[#D4AF37]/10 text-[#F5EBDD]/35'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <span className="font-mono text-[10px] text-[#AA8435]">
                            Step 0{idx + 1}
                          </span>
                          <span>{st.label}</span>
                        </div>
                        <span className="text-[10px] text-[#F5EBDD]/60 hidden sm:inline">
                          {st.desc}
                        </span>
                        {isPassed && (
                          <CheckCircle2
                            className={`w-3.5 h-3.5 ${
                              isCurrent ? 'text-[#D4AF37]' : 'text-[#10B981]'
                            }`}
                          />
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Items summary */}
              <div className="pt-2 border-t border-[#D4AF37]/20 text-xs">
                <span className="text-[10px] text-[#AA8435] uppercase block font-serif-royal mb-1">
                  Perfumes in this package:
                </span>
                {/* Packaging Option */}
                <div className="flex items-center justify-between text-xs py-2 px-2.5 bg-black/40 rounded-xs border border-[#D4AF37]/20 my-2">
                  <span className="text-[#AA8435] flex items-center gap-1.5 font-serif-royal text-[11px] uppercase">
                    <Gift className="w-3.5 h-3.5 text-[#D4AF37]" /> Packaging:
                  </span>
                  <span className={`font-serif-royal font-bold text-xs ${selectedOrder.giftPackaging ? 'text-[#F3CD68]' : 'text-[#F5EBDD]/70'}`}>
                    {selectedOrder.giftPackaging ? 'Gift Packing (৳25)' : 'Standard Packaging'}
                  </span>
                </div>

                <div className="space-y-1 pt-1">
                  {selectedOrder.items.map((it) => (
                    <div
                      key={it.id}
                      className="flex justify-between text-[#F5EBDD]/90 text-[11px]"
                    >
                      <span>
                        {it.product.name} ({it.size}) × {it.quantity}
                      </span>
                      <span className="font-bold text-[#D4AF37]">
                        ৳{it.pricePerUnit * it.quantity}
                      </span>
                    </div>
                  ))}
                  {selectedOrder.giftPackaging && (
                    <div className="flex justify-between text-[#F3CD68] text-[11px] pt-1">
                      <span className="flex items-center gap-1">
                        <Gift className="w-3 h-3" /> Optional Gift Packing:
                      </span>
                      <span className="font-bold">৳25</span>
                    </div>
                  )}
                  <div className="flex justify-between text-[#F5EBDD]/70 text-[11px]">
                    <span>Delivery Charge:</span>
                    <span>৳{selectedOrder.deliveryCharge}</span>
                  </div>
                </div>
                <div className="flex justify-between items-baseline pt-2 mt-2 border-t border-[#D4AF37]/15">
                  <span className="text-xs text-[#F5EBDD]/70">
                    Total Paid via {selectedOrder.paymentMethod.toUpperCase()}:
                  </span>
                  <span className="font-serif-royal font-bold text-base text-[#D4AF37]">
                    ৳{selectedOrder.total} BDT
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-8 text-xs text-[#F5EBDD]/60">
              <AlertCircle className="w-8 h-8 text-[#AA8435] mx-auto mb-2 opacity-60" />
              <p>No orders found matching your search.</p>
              <p className="text-[11px] text-[#AA8435] mt-1">
                Enter your Order ID (e.g. RE-XXXXXX) or mobile number used during checkout.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
