import React, { useState } from 'react';
import { Product, SizeOption, SizeInventory } from '../types';
import { getProductSizeInventory } from '../data/perfumes';
import { Package, AlertCircle, Plus, Minus, Edit2, Check, X, ShieldAlert, CheckCircle2, Search, Filter } from 'lucide-react';
import { ProductImagePlaceholder } from './ProductImagePlaceholder';

interface AdminInventorySectionProps {
  products: Product[];
  onUpdateProducts: (products: Product[]) => void;
}

export const AdminInventorySection: React.FC<AdminInventorySectionProps> = ({
  products,
  onUpdateProducts,
}) => {
  const [filterType, setFilterType] = useState<'all' | 'low_stock' | 'out_of_stock'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Quick edit modal or inline
  const [editingItem, setEditingItem] = useState<{
    productId: string;
    productName: string;
    size: SizeOption;
    price: number;
    stock: number;
    sku: string;
    isAvailable: boolean;
  } | null>(null);

  // Flattened inventory list: each product × 3 sizes
  const sizes: SizeOption[] = ['100 ML', '300 ML', '500 ML'];

  const inventoryRows = products.flatMap((product) =>
    sizes.map((size) => {
      const inv = getProductSizeInventory(product, size);
      const isOutOfStock = inv.stock <= 0 || !inv.isAvailable;
      const isLowStock = inv.stock > 0 && inv.stock <= 5;
      return {
        product,
        size,
        inv,
        isOutOfStock,
        isLowStock,
      };
    })
  );

  const filteredRows = inventoryRows.filter(({ product, size, inv, isOutOfStock, isLowStock }) => {
    if (filterType === 'low_stock' && !isLowStock) return false;
    if (filterType === 'out_of_stock' && !isOutOfStock) return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const match =
        product.name.toLowerCase().includes(q) ||
        size.toLowerCase().includes(q) ||
        inv.sku.toLowerCase().includes(q);
      if (!match) return false;
    }
    return true;
  });

  const totalSKUs = inventoryRows.length;
  const totalUnits = inventoryRows.reduce((acc, row) => acc + Math.max(0, row.inv.stock), 0);
  const totalLowStock = inventoryRows.filter((r) => r.isLowStock).length;
  const totalOutOfStock = inventoryRows.filter((r) => r.isOutOfStock).length;

  const handleUpdateStockDelta = (productId: string, size: SizeOption, delta: number) => {
    const updated = products.map((p) => {
      if (p.id !== productId) return p;
      const currentInv = getProductSizeInventory(p, size);
      const newStock = Math.max(0, currentInv.stock + delta);
      const newSizesInventory: Record<SizeOption, SizeInventory> = {
        '100 ML': getProductSizeInventory(p, '100 ML'),
        '300 ML': getProductSizeInventory(p, '300 ML'),
        '500 ML': getProductSizeInventory(p, '500 ML'),
      };
      newSizesInventory[size] = {
        ...currentInv,
        stock: newStock,
        isAvailable: newStock > 0 ? currentInv.isAvailable : false,
      };
      return {
        ...p,
        sizesInventory: newSizesInventory,
      };
    });
    onUpdateProducts(updated);
  };

  const handleToggleAvailability = (productId: string, size: SizeOption) => {
    const updated = products.map((p) => {
      if (p.id !== productId) return p;
      const currentInv = getProductSizeInventory(p, size);
      const newSizesInventory: Record<SizeOption, SizeInventory> = {
        '100 ML': getProductSizeInventory(p, '100 ML'),
        '300 ML': getProductSizeInventory(p, '300 ML'),
        '500 ML': getProductSizeInventory(p, '500 ML'),
      };
      newSizesInventory[size] = {
        ...currentInv,
        isAvailable: !currentInv.isAvailable,
      };
      return {
        ...p,
        sizesInventory: newSizesInventory,
      };
    });
    onUpdateProducts(updated);
  };

  const handleSaveModal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;

    const { productId, size, price, stock, sku, isAvailable } = editingItem;

    const updated = products.map((p) => {
      if (p.id !== productId) return p;
      const newSizesInventory: Record<SizeOption, SizeInventory> = {
        '100 ML': getProductSizeInventory(p, '100 ML'),
        '300 ML': getProductSizeInventory(p, '300 ML'),
        '500 ML': getProductSizeInventory(p, '500 ML'),
      };
      newSizesInventory[size] = {
        price: Number(price),
        stock: Math.max(0, Number(stock)),
        sku: sku.trim().toUpperCase(),
        isAvailable: Boolean(isAvailable),
      };

      // Also sync product.prices[size]
      const newPrices = { ...p.prices, [size]: Number(price) };

      return {
        ...p,
        prices: newPrices,
        sizesInventory: newSizesInventory,
      };
    });

    onUpdateProducts(updated);
    setEditingItem(null);
  };

  return (
    <div className="p-5 flex-1 overflow-y-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#D4AF37]/25">
        <div>
          <h3 className="font-serif-royal font-bold text-lg text-white uppercase tracking-wider flex items-center gap-2">
            <Package className="w-5 h-5 text-[#F3CD68]" />
            Stock & Inventory Management
          </h3>
          <p className="text-xs text-[#EED9C4]/70 mt-0.5">
            Manage bottle stock quantities, SKUs, individual size prices (100 ML, 300 ML, 500 ML), and out-of-stock statuses.
          </p>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3 bg-[#061826] border border-[#D4AF37]/25 rounded-xs">
          <span className="text-[10px] text-[#AA8435] uppercase font-serif-royal block">Active SKUs</span>
          <span className="font-serif-royal font-bold text-xl text-white">{totalSKUs} Variants</span>
        </div>
        <div className="p-3 bg-[#061826] border border-[#D4AF37]/25 rounded-xs">
          <span className="text-[10px] text-[#AA8435] uppercase font-serif-royal block">Total Warehouse Bottles</span>
          <span className="font-serif-royal font-bold text-xl text-[#F3CD68]">{totalUnits} Units</span>
        </div>
        <div className="p-3 bg-[#061826] border border-[#D4AF37]/25 rounded-xs">
          <span className="text-[10px] text-[#AA8435] uppercase font-serif-royal block">Low Stock Alert (≤5)</span>
          <span className={`font-serif-royal font-bold text-xl ${totalLowStock > 0 ? 'text-[#F59E0B]' : 'text-gray-400'}`}>
            {totalLowStock} Variants
          </span>
        </div>
        <div className="p-3 bg-[#061826] border border-[#D4AF37]/25 rounded-xs">
          <span className="text-[10px] text-[#AA8435] uppercase font-serif-royal block">Out of Stock (0)</span>
          <span className={`font-serif-royal font-bold text-xl ${totalOutOfStock > 0 ? 'text-[#EF4444]' : 'text-[#10B981]'}`}>
            {totalOutOfStock} Variants
          </span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-3 bg-[#0B1522] border border-[#D4AF37]/25 rounded-xs">
        <div className="flex items-center gap-1.5 flex-wrap">
          <button
            onClick={() => setFilterType('all')}
            className={`px-3 py-1.5 rounded-xs text-xs font-serif-royal font-bold uppercase tracking-wider transition-all ${
              filterType === 'all'
                ? 'bg-[#D4AF37] text-black'
                : 'bg-[#030E18] text-[#EED9C4]/70 hover:text-white'
            }`}
          >
            All Sizes ({inventoryRows.length})
          </button>
          <button
            onClick={() => setFilterType('low_stock')}
            className={`px-3 py-1.5 rounded-xs text-xs font-serif-royal font-bold uppercase tracking-wider transition-all ${
              filterType === 'low_stock'
                ? 'bg-[#F59E0B] text-black'
                : 'bg-[#030E18] text-[#F59E0B] border border-[#F59E0B]/30'
            }`}
          >
            Low Stock Alerts ({totalLowStock})
          </button>
          <button
            onClick={() => setFilterType('out_of_stock')}
            className={`px-3 py-1.5 rounded-xs text-xs font-serif-royal font-bold uppercase tracking-wider transition-all ${
              filterType === 'out_of_stock'
                ? 'bg-[#EF4444] text-white'
                : 'bg-[#030E18] text-[#EF4444] border border-[#EF4444]/30'
            }`}
          >
            Out of Stock ({totalOutOfStock})
          </button>
        </div>

        <div className="relative">
          <Search className="w-3.5 h-3.5 text-[#D4AF37] absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search by perfume, size, or SKU..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full sm:w-64 bg-[#030E18] border border-[#D4AF37]/30 text-xs text-white pl-8 pr-3 py-2 rounded-xs focus:outline-none focus:border-[#F3CD68]"
          />
        </div>
      </div>

      {/* Inventory Table */}
      <div className="border border-[#D4AF37]/25 rounded-xs overflow-x-auto bg-[#040E1A]">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-[#061826] border-b border-[#D4AF37]/20 font-serif-royal text-[11px] uppercase tracking-wider text-[#F3CD68]">
              <th className="p-3">Perfume & Flacon</th>
              <th className="p-3">Size Variant</th>
              <th className="p-3">SKU</th>
              <th className="p-3">Price (BDT)</th>
              <th className="p-3">Stock Units</th>
              <th className="p-3">Status</th>
              <th className="p-3 text-right">Inventory Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#D4AF37]/15">
            {filteredRows.length === 0 ? (
              <tr>
                <td colSpan={7} className="p-8 text-center text-[#EED9C4]/60">
                  No inventory variants match your search filter.
                </td>
              </tr>
            ) : (
              filteredRows.map(({ product, size, inv, isOutOfStock, isLowStock }) => (
                <tr
                  key={`${product.id}-${size}`}
                  className="hover:bg-[#071C2E] transition-colors font-sans-body"
                >
                  <td className="p-3">
                    <div className="flex items-center gap-2.5">
                      {product.image && product.image.trim() !== '' ? (
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-9 h-9 object-contain bg-[#02070D] p-1 rounded-xs border border-[#D4AF37]/20"
                        />
                      ) : (
                        <div className="w-9 h-9 shrink-0">
                          <ProductImagePlaceholder size="sm" className="w-full h-full p-0.5" />
                        </div>
                      )}
                      <div>
                        <strong className="font-serif-royal text-white text-xs block">
                          {product.name}
                        </strong>
                        <span className="text-[10px] text-[#AA8435] font-serif-royal uppercase">
                          {product.category}
                        </span>
                      </div>
                    </div>
                  </td>

                  <td className="p-3">
                    <span className="font-serif-royal font-bold text-xs text-[#F3CD68]">
                      {size}
                    </span>
                  </td>

                  <td className="p-3">
                    <span className="font-mono text-[11px] text-[#EED9C4]/80 bg-[#02070D] px-2 py-0.5 rounded-2xs border border-[#D4AF37]/20">
                      {inv.sku}
                    </span>
                  </td>

                  <td className="p-3 font-serif-royal font-bold text-xs text-white">
                    ৳{inv.price}
                  </td>

                  <td className="p-3">
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => handleUpdateStockDelta(product.id, size, -1)}
                        disabled={inv.stock <= 0}
                        className="w-6 h-6 rounded-2xs bg-[#030E18] border border-[#D4AF37]/30 text-white flex items-center justify-center hover:bg-[#D4AF37] hover:text-black transition-colors disabled:opacity-40"
                        title="Reduce 1 unit"
                      >
                        <Minus className="w-3 h-3" />
                      </button>

                      <span
                        className={`font-mono font-bold text-sm px-2 py-0.5 rounded-xs min-w-[36px] text-center ${
                          isOutOfStock
                            ? 'text-[#EF4444] bg-[#EF4444]/15 border border-[#EF4444]/40'
                            : isLowStock
                            ? 'text-[#F59E0B] bg-[#F59E0B]/15 border border-[#F59E0B]/40'
                            : 'text-[#10B981] bg-[#10B981]/15 border border-[#10B981]/40'
                        }`}
                      >
                        {inv.stock}
                      </span>

                      <button
                        onClick={() => handleUpdateStockDelta(product.id, size, 5)}
                        className="w-6 h-6 rounded-2xs bg-[#030E18] border border-[#D4AF37]/30 text-white flex items-center justify-center hover:bg-[#D4AF37] hover:text-black transition-colors"
                        title="Add +5 units"
                      >
                        <Plus className="w-3 h-3" />
                      </button>

                      <button
                        onClick={() => handleUpdateStockDelta(product.id, size, 10)}
                        className="px-1.5 py-0.5 text-[9px] font-mono rounded-2xs bg-[#062419] border border-[#10B981]/40 text-[#34D399] hover:bg-[#10B981] hover:text-black transition-colors"
                        title="Add +10 units"
                      >
                        +10
                      </button>
                    </div>
                  </td>

                  <td className="p-3">
                    {isOutOfStock ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-serif-royal font-bold uppercase bg-[#EF4444]/20 border border-[#EF4444] text-[#EF4444]">
                        <AlertCircle className="w-3 h-3" />
                        Out of Stock
                      </span>
                    ) : isLowStock ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-serif-royal font-bold uppercase bg-[#F59E0B]/20 border border-[#F59E0B] text-[#F59E0B]">
                        Low Stock ({inv.stock})
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-serif-royal font-bold uppercase bg-[#10B981]/20 border border-[#10B981] text-[#10B981]">
                        <CheckCircle2 className="w-3 h-3" />
                        Available
                      </span>
                    )}
                  </td>

                  <td className="p-3 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => handleToggleAvailability(product.id, size)}
                        className={`px-2 py-1 text-[10px] font-serif-royal uppercase rounded-xs border transition-colors ${
                          inv.isAvailable
                            ? 'bg-amber-950/40 border-amber-600/40 text-amber-300 hover:bg-amber-900/60'
                            : 'bg-emerald-950/40 border-emerald-600/40 text-emerald-300 hover:bg-emerald-900/60'
                        }`}
                        title="Toggle availability"
                      >
                        {inv.isAvailable ? 'Disable' : 'Enable'}
                      </button>

                      <button
                        onClick={() =>
                          setEditingItem({
                            productId: product.id,
                            productName: product.name,
                            size,
                            price: inv.price,
                            stock: inv.stock,
                            sku: inv.sku,
                            isAvailable: inv.isAvailable,
                          })
                        }
                        className="p-1 bg-[#02070D] border border-[#D4AF37]/40 text-[#F3CD68] hover:text-white rounded-xs"
                        title="Edit Price & SKU"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Edit Size Variant Modal */}
      {editingItem && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="bg-gradient-to-b from-[#07241A] via-[#0A1D36] to-[#1C0816] border-2 border-[#D4AF37] max-w-md w-full p-6 rounded-t-[28px] rounded-b-xs shadow-2xl">
            <div className="flex justify-between items-center pb-3 border-b border-[#D4AF37]/30 mb-4">
              <div>
                <h3 className="font-serif-royal font-bold text-base text-white uppercase tracking-wider">
                  Edit Size Variant Inventory
                </h3>
                <span className="text-[11px] text-[#F3CD68] font-serif-royal font-bold block">
                  {editingItem.productName} · {editingItem.size}
                </span>
              </div>
              <button onClick={() => setEditingItem(null)} className="text-[#EED9C4]/60 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveModal} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-[11px] uppercase tracking-wider text-[#F3CD68] font-serif-royal font-bold mb-1">
                  SKU Code *
                </label>
                <input
                  type="text"
                  required
                  value={editingItem.sku}
                  onChange={(e) =>
                    setEditingItem({ ...editingItem, sku: e.target.value.toUpperCase() })
                  }
                  className="w-full bg-[#030E18] border border-[#D4AF37]/40 text-white font-mono p-2.5 rounded-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-[#F3CD68] font-serif-royal font-bold mb-1">
                    Price (BDT ৳) *
                  </label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={editingItem.price}
                    onChange={(e) =>
                      setEditingItem({ ...editingItem, price: Number(e.target.value) })
                    }
                    className="w-full bg-[#030E18] border border-[#D4AF37]/40 text-white font-mono p-2.5 rounded-xs"
                  />
                </div>

                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-[#F3CD68] font-serif-royal font-bold mb-1">
                    Stock Quantity *
                  </label>
                  <input
                    type="number"
                    required
                    min={0}
                    value={editingItem.stock}
                    onChange={(e) =>
                      setEditingItem({ ...editingItem, stock: Number(e.target.value) })
                    }
                    className="w-full bg-[#030E18] border border-[#D4AF37]/40 text-white font-mono p-2.5 rounded-xs"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="availCheck"
                  checked={editingItem.isAvailable}
                  onChange={(e) =>
                    setEditingItem({ ...editingItem, isAvailable: e.target.checked })
                  }
                  className="rounded-2xs accent-[#D4AF37] w-4 h-4 cursor-pointer"
                />
                <label htmlFor="availCheck" className="text-white font-serif-royal font-bold cursor-pointer">
                  Mark Size Available for Purchase
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-[#D4AF37]/20">
                <button
                  type="button"
                  onClick={() => setEditingItem(null)}
                  className="px-4 py-2 border border-[#D4AF37]/40 text-[#EED9C4] font-serif-royal uppercase rounded-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-gradient-to-r from-[#D4AF37] to-[#AA8435] text-black font-serif-royal font-bold uppercase rounded-xs"
                >
                  Save Variant
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
