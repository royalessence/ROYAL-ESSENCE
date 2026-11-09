import React, { useState } from 'react';
import { Order, Product } from '../types';
import { getProductSizeInventory } from '../data/perfumes';
import { ProductImagePlaceholder } from './ProductImagePlaceholder';
import {
  TrendingUp,
  DollarSign,
  ShoppingBag,
  CheckCircle2,
  Clock,
  XCircle,
  Users,
  AlertTriangle,
  Calendar,
  BarChart3,
  Award,
  CreditCard,
  Package,
} from 'lucide-react';

interface AdminAnalyticsSectionProps {
  orders: Order[];
  products: Product[];
}

type DateRange = 'all' | 'today' | '7d' | '30d' | 'this_month' | 'this_year';
type ChartView = 'daily' | 'weekly' | 'monthly' | 'yearly';

export const AdminAnalyticsSection: React.FC<AdminAnalyticsSectionProps> = ({
  orders,
  products,
}) => {
  const [dateRange, setDateRange] = useState<DateRange>('all');
  const [chartView, setChartView] = useState<ChartView>('daily');

  // Filter orders by date range
  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  const sevenDaysAgo = now.getTime() - 7 * 24 * 60 * 60 * 1000;
  const thirtyDaysAgo = now.getTime() - 30 * 24 * 60 * 60 * 1000;
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).getTime();
  const startOfYear = new Date(now.getFullYear(), 0, 1).getTime();

  const filteredOrders = orders.filter((o) => {
    const orderTime = new Date(o.createdAt).getTime();
    if (dateRange === 'today') return orderTime >= startOfToday;
    if (dateRange === '7d') return orderTime >= sevenDaysAgo;
    if (dateRange === '30d') return orderTime >= thirtyDaysAgo;
    if (dateRange === 'this_month') return orderTime >= startOfMonth;
    if (dateRange === 'this_year') return orderTime >= startOfYear;
    return true;
  });

  // KPI Calculations
  const totalOrders = filteredOrders.length;
  const totalSalesGross = filteredOrders.reduce((sum, o) => sum + (o.total || 0), 0);

  // STRICT REQUIREMENT: Only count verified payments as verified revenue
  const verifiedOrders = filteredOrders.filter((o) => o.paymentStatus === 'PAID / VERIFIED');
  const totalVerifiedRevenue = verifiedOrders.reduce((sum, o) => sum + (o.total || 0), 0);

  const pendingPaymentsOrders = filteredOrders.filter(
    (o) => o.paymentStatus === 'PAYMENT VERIFICATION PENDING' || o.paymentStatus === 'UNPAID'
  );
  const pendingPaymentsCount = pendingPaymentsOrders.length;
  const pendingPaymentsAmount = pendingPaymentsOrders.reduce((sum, o) => sum + (o.total || 0), 0);

  const pendingOrders = filteredOrders.filter(
    (o) => o.status !== 'Delivered' && o.status !== 'Cancelled'
  ).length;

  const completedOrders = filteredOrders.filter((o) => o.status === 'Delivered').length;
  const cancelledOrders = filteredOrders.filter((o) => o.status === 'Cancelled').length;

  const uniqueCustomers = new Set(
    filteredOrders.map((o) => (o.phone || '').trim().replace(/[^\d]/g, '')).filter(Boolean)
  ).size;

  // Low stock products across all sizes
  const lowStockVariants = products.flatMap((p) =>
    (['100 ML', '300 ML', '500 ML'] as const).map((size) => {
      const inv = getProductSizeInventory(p, size);
      return {
        product: p,
        size,
        inv,
        isLow: inv.stock <= 5,
        isOut: inv.stock <= 0,
      };
    })
  ).filter((item) => item.isLow);

  // Best-Selling Perfumes calculation
  const productSalesMap = new Map<
    string,
    { name: string; image: string; unitsSold: number; revenue: number; verifiedRevenue: number }
  >();

  filteredOrders.forEach((ord) => {
    const isVerified = ord.paymentStatus === 'PAID / VERIFIED';
    (ord.items || []).forEach((item) => {
      const prodName = item.product.name;
      const existing = productSalesMap.get(prodName) || {
        name: prodName,
        image: item.product.image,
        unitsSold: 0,
        revenue: 0,
        verifiedRevenue: 0,
      };
      existing.unitsSold += item.quantity;
      existing.revenue += item.pricePerUnit * item.quantity;
      if (isVerified) {
        existing.verifiedRevenue += item.pricePerUnit * item.quantity;
      }
      productSalesMap.set(prodName, existing);
    });
  });

  const bestSelling = Array.from(productSalesMap.values()).sort(
    (a, b) => b.unitsSold - a.unitsSold
  );

  // Chart aggregation: Daily / Weekly / Monthly / Yearly
  const buildChartData = () => {
    if (chartView === 'daily') {
      // Last 7 days buckets
      const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      const buckets: { label: string; total: number; verified: number }[] = [];
      for (let i = 6; i >= 0; i--) {
        const d = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
        const dayStr = d.toISOString().split('T')[0];
        const dayLabel = `${days[d.getDay()]} ${d.getDate()}`;
        const dayOrders = filteredOrders.filter((o) => o.createdAt.startsWith(dayStr));
        const dayTotal = dayOrders.reduce((acc, o) => acc + (o.total || 0), 0);
        const dayVerified = dayOrders
          .filter((o) => o.paymentStatus === 'PAID / VERIFIED')
          .reduce((acc, o) => acc + (o.total || 0), 0);
        buckets.push({ label: dayLabel, total: dayTotal, verified: dayVerified });
      }
      return buckets;
    }

    if (chartView === 'weekly') {
      // Last 4 weeks
      const buckets: { label: string; total: number; verified: number }[] = [];
      for (let w = 3; w >= 0; w--) {
        const start = now.getTime() - (w + 1) * 7 * 24 * 60 * 60 * 1000;
        const end = now.getTime() - w * 7 * 24 * 60 * 60 * 1000;
        const weekOrders = filteredOrders.filter((o) => {
          const t = new Date(o.createdAt).getTime();
          return t >= start && t < end;
        });
        const wTotal = weekOrders.reduce((acc, o) => acc + (o.total || 0), 0);
        const wVerified = weekOrders
          .filter((o) => o.paymentStatus === 'PAID / VERIFIED')
          .reduce((acc, o) => acc + (o.total || 0), 0);
        buckets.push({ label: `Week -${w}`, total: wTotal, verified: wVerified });
      }
      return buckets;
    }

    if (chartView === 'monthly') {
      // Last 6 months
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const buckets: { label: string; total: number; verified: number }[] = [];
      for (let m = 5; m >= 0; m--) {
        const d = new Date(now.getFullYear(), now.getMonth() - m, 1);
        const mKey = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
        const mOrders = filteredOrders.filter((o) => o.createdAt.startsWith(mKey));
        const mTotal = mOrders.reduce((acc, o) => acc + (o.total || 0), 0);
        const mVerified = mOrders
          .filter((o) => o.paymentStatus === 'PAID / VERIFIED')
          .reduce((acc, o) => acc + (o.total || 0), 0);
        buckets.push({ label: `${months[d.getMonth()]} ${d.getFullYear() % 100}`, total: mTotal, verified: mVerified });
      }
      return buckets;
    }

    // Yearly
    const buckets: { label: string; total: number; verified: number }[] = [];
    const currentYear = now.getFullYear();
    for (let y = currentYear - 2; y <= currentYear; y++) {
      const yOrders = filteredOrders.filter((o) => o.createdAt.startsWith(String(y)));
      const yTotal = yOrders.reduce((acc, o) => acc + (o.total || 0), 0);
      const yVerified = yOrders
        .filter((o) => o.paymentStatus === 'PAID / VERIFIED')
        .reduce((acc, o) => acc + (o.total || 0), 0);
      buckets.push({ label: String(y), total: yTotal, verified: yVerified });
    }
    return buckets;
  };

  const chartData = buildChartData();
  const maxChartValue = Math.max(...chartData.map((d) => Math.max(d.total, d.verified)), 1000);

  // Status breakdown
  const statusCounts: Record<string, number> = {
    'Order Placed': filteredOrders.filter((o) => o.status === 'Order Placed').length,
    'Order Confirmed': filteredOrders.filter((o) => o.status === 'Order Confirmed').length,
    'Preparing Your Order': filteredOrders.filter((o) => o.status === 'Preparing Your Order').length,
    'Out for Delivery': filteredOrders.filter((o) => o.status === 'Out for Delivery').length,
    Delivered: filteredOrders.filter((o) => o.status === 'Delivered').length,
    Cancelled: filteredOrders.filter((o) => o.status === 'Cancelled').length,
  };

  return (
    <div className="p-5 flex-1 overflow-y-auto space-y-6">
      {/* Header & Date Range Filter */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#D4AF37]/25">
        <div>
          <h3 className="font-serif-royal font-bold text-lg text-white uppercase tracking-wider flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-[#F3CD68]" />
            Sales Analytics & Financial Intelligence
          </h3>
          <p className="text-xs text-[#EED9C4]/70 mt-0.5">
            Real-time analytics computed strictly from actual order and payment records.
          </p>
        </div>

        {/* Date Range Selector */}
        <div className="flex items-center gap-1.5 flex-wrap">
          {(
            [
              { key: 'all', label: 'All Time' },
              { key: 'today', label: 'Today' },
              { key: '7d', label: 'Last 7 Days' },
              { key: '30d', label: 'Last 30 Days' },
              { key: 'this_month', label: 'This Month' },
              { key: 'this_year', label: 'This Year' },
            ] as const
          ).map((range) => (
            <button
              key={range.key}
              onClick={() => setDateRange(range.key)}
              className={`px-2.5 py-1 text-[11px] font-serif-royal uppercase tracking-wider rounded-xs border transition-all ${
                dateRange === range.key
                  ? 'bg-gradient-to-r from-[#D4AF37] to-[#AA8435] text-black font-bold border-white'
                  : 'bg-[#030E18] border-[#D4AF37]/30 text-[#EED9C4]/70 hover:text-white'
              }`}
            >
              {range.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main KPI Overview Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        {/* Total Verified Revenue */}
        <div className="p-4 bg-gradient-to-br from-[#062419] to-[#04120D] border-2 border-[#10B981] rounded-xs shadow-lg">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[10px] text-[#A7F3D0] uppercase font-serif-royal font-bold tracking-wider">
              Verified Revenue
            </span>
            <CheckCircle2 className="w-4 h-4 text-[#10B981]" />
          </div>
          <span className="font-serif-royal font-black text-2xl text-[#34D399] tabular-nums block">
            ৳{totalVerifiedRevenue.toLocaleString('en-US')}
          </span>
          <span className="text-[10px] text-[#A7F3D0]/70 font-sans-body block mt-0.5">
            {verifiedOrders.length} Verified Paid Orders
          </span>
        </div>

        {/* Total Gross Sales */}
        <div className="p-4 bg-[#061826] border border-[#D4AF37]/40 rounded-xs">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[10px] text-[#AA8435] uppercase font-serif-royal font-bold tracking-wider">
              Total Gross Sales
            </span>
            <DollarSign className="w-4 h-4 text-[#D4AF37]" />
          </div>
          <span className="font-serif-royal font-bold text-2xl text-[#F3CD68] tabular-nums block">
            ৳{totalSalesGross.toLocaleString('en-US')}
          </span>
          <span className="text-[10px] text-[#EED9C4]/60 font-sans-body block mt-0.5">
            All submitted orders combined
          </span>
        </div>

        {/* Total Orders */}
        <div className="p-4 bg-[#061826] border border-[#D4AF37]/30 rounded-xs">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[10px] text-[#AA8435] uppercase font-serif-royal font-bold tracking-wider">
              Total Orders
            </span>
            <ShoppingBag className="w-4 h-4 text-[#38BDF8]" />
          </div>
          <span className="font-serif-royal font-bold text-2xl text-white tabular-nums block">
            {totalOrders}
          </span>
          <span className="text-[10px] text-[#38BDF8] font-sans-body block mt-0.5">
            {completedOrders} Delivered · {pendingOrders} Active
          </span>
        </div>

        {/* Unique Customers */}
        <div className="p-4 bg-[#061826] border border-[#D4AF37]/30 rounded-xs">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[10px] text-[#AA8435] uppercase font-serif-royal font-bold tracking-wider">
              Total Customers
            </span>
            <Users className="w-4 h-4 text-[#F472B6]" />
          </div>
          <span className="font-serif-royal font-bold text-2xl text-white tabular-nums block">
            {uniqueCustomers}
          </span>
          <span className="text-[10px] text-[#EED9C4]/60 font-sans-body block mt-0.5">
            Unique customer profiles
          </span>
        </div>
      </div>

      {/* Secondary Status Badges: Pending Payments, Cancelled, Low Stock */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="p-3 bg-[#1C1208] border border-[#F59E0B]/50 rounded-xs flex items-center justify-between">
          <div>
            <span className="text-[10px] text-[#F59E0B] uppercase font-serif-royal font-bold block">
              Pending Payments
            </span>
            <span className="font-serif-royal font-bold text-lg text-white">
              {pendingPaymentsCount} Orders (৳{pendingPaymentsAmount.toLocaleString('en-US')})
            </span>
          </div>
          <Clock className="w-5 h-5 text-[#F59E0B]" />
        </div>

        <div className="p-3 bg-[#1E0B0F] border border-[#EF4444]/40 rounded-xs flex items-center justify-between">
          <div>
            <span className="text-[10px] text-[#FCA5A5] uppercase font-serif-royal font-bold block">
              Cancelled Orders
            </span>
            <span className="font-serif-royal font-bold text-lg text-white">
              {cancelledOrders} Orders
            </span>
          </div>
          <XCircle className="w-5 h-5 text-[#EF4444]" />
        </div>

        <div className="p-3 bg-[#150A20] border border-[#C084FC]/40 rounded-xs flex items-center justify-between">
          <div>
            <span className="text-[10px] text-[#E9D5FF] uppercase font-serif-royal font-bold block">
              Low Stock Alerts (≤5)
            </span>
            <span className="font-serif-royal font-bold text-lg text-white">
              {lowStockVariants.length} Size Variants
            </span>
          </div>
          <AlertTriangle className="w-5 h-5 text-[#C084FC]" />
        </div>
      </div>

      {/* Visual Chart Section: Daily, Weekly, Monthly, Yearly */}
      <div className="p-5 bg-[#061826] border border-[#D4AF37]/30 rounded-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#D4AF37]/20">
          <div>
            <h4 className="font-serif-royal font-bold text-sm text-white uppercase tracking-wider flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-[#F3CD68]" />
              Sales Volume Trend
            </h4>
            <span className="text-[10px] text-[#EED9C4]/70">
              Comparing Total Orders (Gold) vs Verified Revenue (Emerald Green)
            </span>
          </div>

          <div className="flex items-center gap-1 bg-[#02070D] p-1 rounded-xs border border-[#D4AF37]/25">
            {(['daily', 'weekly', 'monthly', 'yearly'] as const).map((v) => (
              <button
                key={v}
                onClick={() => setChartView(v)}
                className={`px-3 py-1 text-[10px] font-serif-royal uppercase tracking-wider rounded-xs transition-colors ${
                  chartView === v ? 'bg-[#D4AF37] text-black font-bold' : 'text-[#EED9C4]/60 hover:text-white'
                }`}
              >
                {v}
              </button>
            ))}
          </div>
        </div>

        {/* SVG Bar Chart */}
        <div className="h-56 w-full flex items-end gap-3 sm:gap-6 pt-4 pb-2 px-2">
          {chartData.map((d, idx) => {
            const totalHeight = Math.max(6, Math.round((d.total / maxChartValue) * 160));
            const verifiedHeight = Math.max(4, Math.round((d.verified / maxChartValue) * 160));

            return (
              <div key={idx} className="flex-1 flex flex-col items-center h-full justify-end group">
                <div className="text-[9px] text-[#EED9C4]/70 opacity-0 group-hover:opacity-100 transition-opacity mb-1 tabular-nums">
                  ৳{d.verified.toLocaleString('en-US')}
                </div>
                <div className="w-full max-w-[42px] flex items-end justify-center gap-1 h-[160px]">
                  {/* Gross Total Bar */}
                  <div
                    style={{ height: `${totalHeight}px` }}
                    className="w-1/2 bg-gradient-to-t from-[#AA8435] to-[#F3CD68] rounded-t-xs shadow-sm transition-all duration-300 group-hover:brightness-125"
                    title={`Total: ৳${d.total}`}
                  />
                  {/* Verified Bar */}
                  <div
                    style={{ height: `${verifiedHeight}px` }}
                    className="w-1/2 bg-gradient-to-t from-[#059669] to-[#34D399] rounded-t-xs shadow-sm transition-all duration-300 group-hover:brightness-125"
                    title={`Verified: ৳${d.verified}`}
                  />
                </div>
                <span className="text-[10px] text-[#EED9C4]/70 mt-2 font-serif-royal text-center truncate max-w-full">
                  {d.label}
                </span>
              </div>
            );
          })}
        </div>

        <div className="flex items-center justify-center gap-6 pt-2 border-t border-[#D4AF37]/15 text-[11px] font-serif-royal">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-2xs bg-[#F3CD68]" />
            <span className="text-[#EED9C4]">Total Gross Sales (BDT)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-2xs bg-[#10B981]" />
            <span className="text-[#34D399] font-bold">Verified Revenue (PAID / VERIFIED)</span>
          </div>
        </div>
      </div>

      {/* Grid: Best-Selling Perfumes & Order Status Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Best Selling Products */}
        <div className="lg:col-span-7 p-5 bg-[#061826] border border-[#D4AF37]/30 rounded-xs space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-[#D4AF37]/20">
            <h4 className="font-serif-royal font-bold text-sm text-white uppercase tracking-wider flex items-center gap-2">
              <Award className="w-4 h-4 text-[#F3CD68]" />
              Best-Selling Fragrances
            </h4>
            <span className="text-[10px] text-[#AA8435] font-serif-royal uppercase">
              Ranked by Volume
            </span>
          </div>

          <div className="space-y-2.5">
            {bestSelling.length === 0 ? (
              <p className="text-xs text-[#EED9C4]/60 py-6 text-center">
                No perfume sales recorded in this date range.
              </p>
            ) : (
              bestSelling.map((item, idx) => (
                <div
                  key={item.name}
                  className="p-3 bg-[#030E18] border border-[#D4AF37]/20 rounded-xs flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-5 h-5 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37] text-[#F3CD68] font-bold text-xs flex items-center justify-center font-mono">
                      {idx + 1}
                    </span>
                    {item.image && item.image.trim() !== '' ? (
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-10 h-10 object-contain bg-[#02070D] p-1 rounded-xs border border-[#D4AF37]/20"
                      />
                    ) : (
                      <div className="w-10 h-10 shrink-0">
                        <ProductImagePlaceholder size="sm" className="w-full h-full p-0.5" />
                      </div>
                    )}
                    <div>
                      <strong className="font-serif-royal text-sm text-white block">
                        {item.name}
                      </strong>
                      <span className="text-[11px] text-[#10B981] font-semibold">
                        {item.unitsSold} Bottles Sold
                      </span>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="font-serif-royal font-bold text-sm text-[#F3CD68] block tabular-nums">
                      ৳{item.revenue.toLocaleString('en-US')}
                    </span>
                    <span className="text-[10px] text-[#34D399] block tabular-nums">
                      ৳{item.verifiedRevenue.toLocaleString('en-US')} Verified
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Order Status Distribution */}
        <div className="lg:col-span-5 p-5 bg-[#061826] border border-[#D4AF37]/30 rounded-xs space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-[#D4AF37]/20">
            <h4 className="font-serif-royal font-bold text-sm text-white uppercase tracking-wider flex items-center gap-2">
              <Package className="w-4 h-4 text-[#F3CD68]" />
              Order Status Breakdown
            </h4>
            <span className="text-[10px] text-[#AA8435] font-serif-royal uppercase">
              {totalOrders} Total
            </span>
          </div>

          <div className="space-y-2 text-xs">
            {Object.entries(statusCounts).map(([status, count]) => {
              const pct = totalOrders > 0 ? Math.round((count / totalOrders) * 100) : 0;
              return (
                <div key={status} className="p-2 bg-[#030E18] border border-[#D4AF37]/15 rounded-xs">
                  <div className="flex justify-between items-center mb-1 text-[11px]">
                    <span className="font-serif-royal text-white">{status}</span>
                    <span className="font-mono text-[#F3CD68] font-bold">
                      {count} ({pct}%)
                    </span>
                  </div>
                  <div className="w-full h-1.5 bg-[#071322] rounded-full overflow-hidden">
                    <div
                      style={{ width: `${pct}%` }}
                      className={`h-full rounded-full ${
                        status === 'Delivered'
                          ? 'bg-[#10B981]'
                          : status === 'Cancelled'
                          ? 'bg-[#EF4444]'
                          : 'bg-[#D4AF37]'
                      }`}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Low Stock Watchlist */}
      {lowStockVariants.length > 0 && (
        <div className="p-4 bg-[#1E0C06] border border-[#F59E0B]/60 rounded-xs space-y-2">
          <h4 className="font-serif-royal font-bold text-xs uppercase tracking-wider text-[#F59E0B] flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-[#F59E0B]" />
            Immediate Inventory Restock Alerts
          </h4>
          <div className="flex flex-wrap gap-2 pt-1 text-xs">
            {lowStockVariants.map((item) => (
              <span
                key={`${item.product.id}-${item.size}`}
                className="px-2.5 py-1 bg-black/50 border border-[#F59E0B]/40 rounded-xs text-[#EED9C4] flex items-center gap-1.5"
              >
                <strong className="text-white">{item.product.name}</strong>
                <span className="text-[#F3CD68]">({item.size})</span>
                <span
                  className={`font-mono font-bold ${
                    item.isOut ? 'text-[#EF4444]' : 'text-[#F59E0B]'
                  }`}
                >
                  {item.isOut ? 'OUT OF STOCK' : `${item.inv.stock} left`}
                </span>
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
