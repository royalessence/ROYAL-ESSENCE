import React, { useState } from 'react';
import { SpecialOffer, OfferType, OfferTargetType, Product } from '../types';
import { Tag, Plus, Edit2, Trash2, Check, X, Calendar, Percent, Gift, Sparkles, CheckCircle2 } from 'lucide-react';

interface AdminOffersSectionProps {
  offers: SpecialOffer[];
  onUpdateOffers: (offers: SpecialOffer[]) => void;
  products?: Product[];
}

export const AdminOffersSection: React.FC<AdminOffersSectionProps> = ({
  offers,
  onUpdateOffers,
  products = [],
}) => {
  const [editingOffer, setEditingOffer] = useState<SpecialOffer | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);

  // Form states
  const [code, setCode] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState<OfferType>('percentage');
  const [discountType, setDiscountType] = useState<'percentage' | 'fixed'>('percentage');
  const [discountValue, setDiscountValue] = useState<number>(20);
  const [targetType, setTargetType] = useState<OfferTargetType>('storewide');
  const [targetCategoryId, setTargetCategoryId] = useState<'all' | 'perfume' | 'attar'>('all');
  const [selectedProductIds, setSelectedProductIds] = useState<string[]>([]);
  const [isAutomatic, setIsAutomatic] = useState<boolean>(true);
  const [minPurchase, setMinPurchase] = useState<number>(0);
  const [maxDiscount, setMaxDiscount] = useState<number>(0);
  const [minQty, setMinQty] = useState<number>(0);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [isActive, setIsActive] = useState(true);

  const handleStartAdd = () => {
    setIsAddingNew(true);
    setEditingOffer(null);
    setCode(`ROYAL${Math.floor(10 + Math.random() * 90)}`);
    setTitle('Royal Fragrance Special Privilege');
    setDescription('Special seasonal discount on authentic Arabian fragrances.');
    setType('percentage');
    setDiscountType('percentage');
    setDiscountValue(20);
    setTargetType('storewide');
    setTargetCategoryId('all');
    setSelectedProductIds([]);
    setIsAutomatic(true);
    setMinPurchase(0);
    setMaxDiscount(0);
    setMinQty(0);
    const today = new Date().toISOString().split('T')[0];
    setStartDate(today);
    setEndDate('2026-12-31');
    setIsActive(true);
  };

  const handleStartEdit = (offer: SpecialOffer) => {
    setEditingOffer(offer);
    setIsAddingNew(false);
    setCode(offer.code);
    setTitle(offer.title);
    setDescription(offer.description);
    setType(offer.type);
    setDiscountType(offer.discountType || (offer.type === 'fixed' || offer.type === 'bundle' ? 'fixed' : 'percentage'));
    setDiscountValue(offer.discountValue);
    setTargetType(offer.targetType || 'storewide');
    setTargetCategoryId(offer.targetCategoryId || 'all');
    setSelectedProductIds(offer.targetProductIds || []);
    setIsAutomatic(offer.isAutomatic !== undefined ? offer.isAutomatic : true);
    setMinPurchase(offer.minPurchaseAmount || 0);
    setMaxDiscount(offer.maxDiscountLimit || 0);
    setMinQty(offer.minQuantity || 0);
    setStartDate(offer.startDate);
    setEndDate(offer.endDate);
    setIsActive(offer.isActive);
  };

  const handleProductToggle = (productId: string) => {
    setSelectedProductIds((prev) =>
      prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId]
    );
  };

  const handleSaveOffer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const offerCode = code.trim().toUpperCase() || `ROYAL${Date.now().toString().slice(-4)}`;

    const offerData: SpecialOffer = {
      id: editingOffer ? editingOffer.id : `offer-${Date.now()}`,
      code: offerCode,
      title: title.trim(),
      description: description.trim(),
      type,
      discountType,
      discountValue: Number(discountValue) > 0 ? Number(discountValue) : 10,
      targetType,
      targetCategoryId: targetType === 'category' ? targetCategoryId : undefined,
      targetProductIds: targetType === 'product' ? selectedProductIds : undefined,
      isAutomatic,
      minPurchaseAmount: minPurchase > 0 ? Number(minPurchase) : undefined,
      maxDiscountLimit: maxDiscount > 0 ? Number(maxDiscount) : undefined,
      minQuantity: minQty > 0 ? Number(minQty) : undefined,
      startDate: startDate || new Date().toISOString().split('T')[0],
      endDate: endDate || '2026-12-31',
      isActive,
      usageCount: editingOffer ? editingOffer.usageCount : 0,
    };

    if (isAddingNew) {
      onUpdateOffers([offerData, ...offers]);
    } else if (editingOffer) {
      onUpdateOffers(offers.map((o) => (o.id === editingOffer.id ? offerData : o)));
    }

    setIsAddingNew(false);
    setEditingOffer(null);
  };

  const handleDeleteOffer = (id: string) => {
    if (window.confirm('Are you sure you want to delete this promotional offer?')) {
      onUpdateOffers(offers.filter((o) => o.id !== id));
    }
  };

  const handleToggleActive = (id: string) => {
    onUpdateOffers(
      offers.map((o) => (o.id === id ? { ...o, isActive: !o.isActive } : o))
    );
  };

  // Preview calculation based on an example price of ৳2,000
  const samplePrice = 2000;
  const isPerc = discountType === 'percentage' || type === 'percentage' || type === 'festival' || type === 'first_order';
  const previewDiscountAmt = isPerc
    ? Math.round((samplePrice * (Number(discountValue) || 0)) / 100)
    : Math.min(samplePrice, Number(discountValue) || 0);
  const previewFinal = Math.max(0, samplePrice - previewDiscountAmt);

  return (
    <div className="p-5 flex-1 overflow-y-auto space-y-6">
      {/* Top Banner & Add Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#D4AF37]/25">
        <div>
          <h3 className="font-serif-royal font-bold text-lg text-white uppercase tracking-wider flex items-center gap-2">
            <Tag className="w-5 h-5 text-[#F3CD68]" />
            Discount & Promotion Management
          </h3>
          <p className="text-xs text-[#EED9C4]/70 mt-0.5">
            Configure percentage or fixed discounts, select storewide, category, or product scope, and set validity dates.
          </p>
        </div>

        <button
          onClick={handleStartAdd}
          className="px-4 py-2.5 bg-gradient-to-r from-[#D4AF37] to-[#AA8435] text-black font-serif-royal font-bold text-xs uppercase tracking-wider rounded-xs flex items-center gap-2 hover:scale-102 transition-all shadow-md shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Create New Discount</span>
        </button>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3 bg-[#061826] border border-[#D4AF37]/25 rounded-xs">
          <span className="text-[10px] text-[#AA8435] uppercase font-serif-royal block">Total Discounts</span>
          <span className="font-serif-royal font-bold text-xl text-white">{offers.length}</span>
        </div>
        <div className="p-3 bg-[#061826] border border-[#D4AF37]/25 rounded-xs">
          <span className="text-[10px] text-[#AA8435] uppercase font-serif-royal block">Active Now</span>
          <span className="font-serif-royal font-bold text-xl text-[#10B981]">
            {offers.filter((o) => o.isActive).length}
          </span>
        </div>
        <div className="p-3 bg-[#061826] border border-[#D4AF37]/25 rounded-xs">
          <span className="text-[10px] text-[#AA8435] uppercase font-serif-royal block">Automatic Applied</span>
          <span className="font-serif-royal font-bold text-xl text-[#F3CD68]">
            {offers.filter((o) => o.isActive && o.isAutomatic).length}
          </span>
        </div>
        <div className="p-3 bg-[#061826] border border-[#D4AF37]/25 rounded-xs">
          <span className="text-[10px] text-[#AA8435] uppercase font-serif-royal block">Total Redemptions</span>
          <span className="font-serif-royal font-bold text-xl text-[#F3CD68]">
            {offers.reduce((acc, o) => acc + (o.usageCount || 0), 0)}
          </span>
        </div>
      </div>

      {/* Offers Cards / List */}
      <div className="space-y-3">
        {offers.length === 0 ? (
          <div className="p-10 text-center bg-[#070504] border border-[#D4AF37]/20 rounded-xs text-xs text-[#EED9C4]/60">
            <Tag className="w-8 h-8 text-[#D4AF37] mx-auto mb-2 opacity-50" />
            <p>No promotional discounts configured yet.</p>
            <p className="text-[11px] text-[#AA8435] mt-1">Click &ldquo;Create New Discount&rdquo; to launch a promotion.</p>
          </div>
        ) : (
          offers.map((offer) => {
            const isOfferPercentage = offer.discountType === 'percentage' || offer.type === 'percentage' || offer.type === 'first_order' || offer.type === 'festival';
            return (
              <div
                key={offer.id}
                className={`p-4 rounded-xs border transition-all ${
                  offer.isActive
                    ? 'bg-[#0B1522] border-[#D4AF37]/40 shadow-sm'
                    : 'bg-[#080B0F] border-gray-800 opacity-70'
                }`}
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div className="p-2.5 rounded-xs bg-[#030A12] border border-[#D4AF37]/30 text-[#F3CD68] shrink-0">
                      {isOfferPercentage ? (
                        <Percent className="w-5 h-5 text-[#D4AF37]" />
                      ) : (
                        <Tag className="w-5 h-5 text-[#F3CD68]" />
                      )}
                    </div>

                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="px-2.5 py-0.5 bg-[#D4AF37]/20 border border-[#D4AF37] text-[#F3CD68] font-mono font-bold text-xs rounded-2xs">
                          {offer.code}
                        </span>
                        <h4 className="font-serif-royal font-bold text-sm text-white">{offer.title}</h4>
                        <span
                          className={`text-[9px] uppercase px-2 py-0.2 rounded-full font-serif-royal font-bold border ${
                            offer.isActive
                              ? 'bg-[#10B981]/20 border-[#10B981] text-[#10B981]'
                              : 'bg-gray-800 border-gray-600 text-gray-400'
                          }`}
                        >
                          {offer.isActive ? 'Active' : 'Inactive'}
                        </span>
                        {offer.isAutomatic && (
                          <span className="text-[9px] bg-emerald-900/60 border border-emerald-500 text-emerald-300 px-2 py-0.2 rounded-2xs font-semibold">
                            Auto-Applied to Products
                          </span>
                        )}
                        <span className="text-[10px] text-[#AA8435] font-serif-royal uppercase">
                          Scope: {offer.targetType || 'storewide'}
                        </span>
                      </div>

                      <p className="text-xs text-[#EED9C4]/80 mt-1 font-sans-body">{offer.description}</p>

                      <div className="flex flex-wrap items-center gap-3 mt-2 text-[11px] text-[#EED9C4]/60 font-sans-body">
                        <span className="text-[#F3CD68] font-bold">
                          Benefit: {isOfferPercentage ? `${offer.discountValue}% OFF` : `৳${offer.discountValue} OFF`}
                        </span>
                        {offer.maxDiscountLimit && <span>· Max cap: ৳{offer.maxDiscountLimit}</span>}
                        {offer.minPurchaseAmount && <span>· Min purchase: ৳{offer.minPurchaseAmount}</span>}
                        <span className="flex items-center gap-1 font-mono text-[10px]">
                          <Calendar className="w-3 h-3 text-[#AA8435]" />
                          {offer.startDate} to {offer.endDate}
                        </span>
                        <span className="text-[#34D399] font-bold">· Redemptions: {offer.usageCount || 0}</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 self-end md:self-center shrink-0">
                    <button
                      onClick={() => handleToggleActive(offer.id)}
                      className={`px-3 py-1.5 rounded-xs text-[11px] font-serif-royal font-bold uppercase tracking-wider border transition-all ${
                        offer.isActive
                          ? 'bg-[#10B981]/15 border-[#10B981]/50 text-[#34D399] hover:bg-[#EF4444]/20 hover:border-red-500 hover:text-red-300'
                          : 'bg-gray-800 border-gray-600 text-gray-400 hover:bg-[#10B981]/20 hover:text-[#10B981]'
                      }`}
                    >
                      {offer.isActive ? 'Active (Click to Pause)' : 'Paused (Click to Enable)'}
                    </button>

                    <button
                      onClick={() => handleStartEdit(offer)}
                      className="p-1.5 bg-[#030A12] border border-[#D4AF37]/40 text-[#F3CD68] hover:text-white rounded-xs"
                      title="Edit Offer"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => handleDeleteOffer(offer.id)}
                      className="p-1.5 bg-[#18080C] border border-red-500/40 text-red-400 hover:text-white rounded-xs"
                      title="Delete Offer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Offer Add / Edit Modal */}
      {(isAddingNew || editingOffer) && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="bg-gradient-to-b from-[#07241A] via-[#0A1D36] to-[#1C0816] border-2 border-[#D4AF37] max-w-xl w-full p-6 rounded-t-[28px] rounded-b-xs max-h-[88vh] overflow-y-auto shadow-2xl">
            <div className="flex justify-between items-center pb-3 border-b border-[#D4AF37]/30 mb-4">
              <h3 className="font-serif-royal font-bold text-base text-white uppercase tracking-wider flex items-center gap-2">
                <Tag className="w-4 h-4 text-[#F3CD68]" />
                {isAddingNew ? 'Create New Discount Promotion' : `Edit Discount: ${editingOffer?.code}`}
              </h3>
              <button
                onClick={() => {
                  setIsAddingNew(false);
                  setEditingOffer(null);
                }}
                className="text-[#EED9C4]/60 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveOffer} className="space-y-4 text-xs">
              {/* Scope Target Selection */}
              <div className="p-3 bg-[#030E18] border border-[#D4AF37]/30 rounded-xs">
                <label className="block text-[11px] uppercase tracking-wider text-[#F3CD68] font-serif-royal font-bold mb-1.5">
                  1. Target Scope (Where does this discount apply?)
                </label>
                <div className="grid grid-cols-3 gap-2 mb-2">
                  <button
                    type="button"
                    onClick={() => setTargetType('storewide')}
                    className={`p-2 rounded-xs border text-center font-serif-royal font-bold text-xs ${
                      targetType === 'storewide'
                        ? 'bg-gradient-to-r from-[#D4AF37] to-[#AA8435] text-black border-white'
                        : 'bg-[#081524] text-white border-[#D4AF37]/30'
                    }`}
                  >
                    Storewide (All)
                  </button>
                  <button
                    type="button"
                    onClick={() => setTargetType('category')}
                    className={`p-2 rounded-xs border text-center font-serif-royal font-bold text-xs ${
                      targetType === 'category'
                        ? 'bg-gradient-to-r from-[#D4AF37] to-[#AA8435] text-black border-white'
                        : 'bg-[#081524] text-white border-[#D4AF37]/30'
                    }`}
                  >
                    Category
                  </button>
                  <button
                    type="button"
                    onClick={() => setTargetType('product')}
                    className={`p-2 rounded-xs border text-center font-serif-royal font-bold text-xs ${
                      targetType === 'product'
                        ? 'bg-gradient-to-r from-[#D4AF37] to-[#AA8435] text-black border-white'
                        : 'bg-[#081524] text-white border-[#D4AF37]/30'
                    }`}
                  >
                    Specific Products
                  </button>
                </div>

                {targetType === 'category' && (
                  <div className="pt-2">
                    <label className="block text-[10px] text-[#EED9C4] mb-1">Select Category:</label>
                    <select
                      value={targetCategoryId}
                      onChange={(e) => setTargetCategoryId(e.target.value as any)}
                      className="w-full bg-[#061826] border border-[#D4AF37]/40 text-white p-2 rounded-xs"
                    >
                      <option value="all">All Categories</option>
                      <option value="perfume">Perfumes Only</option>
                      <option value="attar">Attars Only</option>
                    </select>
                  </div>
                )}

                {targetType === 'product' && (
                  <div className="pt-2 space-y-1.5">
                    <label className="block text-[10px] text-[#EED9C4] mb-1">Select Target Products:</label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 max-h-36 overflow-y-auto">
                      {products.map((p) => {
                        const isSelected = selectedProductIds.includes(p.id);
                        return (
                          <button
                            key={p.id}
                            type="button"
                            onClick={() => handleProductToggle(p.id)}
                            className={`p-1.5 rounded-xs border text-left flex items-center justify-between text-xs ${
                              isSelected
                                ? 'bg-[#0B3B2B] border-[#10B981] text-emerald-200'
                                : 'bg-[#061826] border-[#D4AF37]/25 text-[#EED9C4]'
                            }`}
                          >
                            <span className="truncate">{p.name}</span>
                            {isSelected && <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              {/* Discount Type & Value */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-[#F3CD68] font-serif-royal font-bold mb-1">
                    2. Discount Type
                  </label>
                  <select
                    value={discountType}
                    onChange={(e) => {
                      const dt = e.target.value as 'percentage' | 'fixed';
                      setDiscountType(dt);
                      setType(dt);
                    }}
                    className="w-full bg-[#030E18] border border-[#D4AF37]/40 text-white p-2.5 rounded-xs focus:outline-none focus:border-[#F3CD68]"
                  >
                    <option value="percentage">Percentage Discount (%)</option>
                    <option value="fixed">Fixed Amount Discount (৳ BDT)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-[#F3CD68] font-serif-royal font-bold mb-1">
                    3. Discount Value ({discountType === 'percentage' ? '%' : '৳ BDT'}) *
                  </label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={discountValue}
                    onChange={(e) => setDiscountValue(Number(e.target.value))}
                    className="w-full bg-[#030E18] border border-[#D4AF37]/40 text-white font-mono font-bold p-2.5 rounded-xs"
                  />
                </div>
              </div>

              {/* Live Preview Box */}
              <div className="p-3 bg-[#0B261D] border border-emerald-500/50 rounded-xs flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-emerald-300 uppercase tracking-widest font-serif-royal font-bold block">
                    Customer Price Preview (Example ৳2,000 product)
                  </span>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="line-through text-neutral-400 text-xs">৳2,000</span>
                    <span className="text-white font-bold text-sm">৳{previewFinal} BDT</span>
                    <span className="bg-emerald-600 text-black font-black text-[10px] px-1.5 py-0.2 rounded-2xs">
                      Save ৳{previewDiscountAmt} BDT
                    </span>
                  </div>
                </div>
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              </div>

              {/* Automatic Apply Option */}
              <div className="p-3 bg-[#030E18] border border-[#D4AF37]/30 rounded-xs flex items-center justify-between">
                <div>
                  <span className="text-xs font-serif-royal font-bold text-white block">
                    Automatic Product Discount
                  </span>
                  <span className="text-[10px] text-[#EED9C4]/70">
                    Directly displays strikethrough original prices, discount badges, and discounted totals to customers.
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={isAutomatic}
                  onChange={(e) => setIsAutomatic(e.target.checked)}
                  className="w-4 h-4 accent-[#D4AF37] rounded"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-[#F3CD68] font-serif-royal font-bold mb-1">
                    Coupon Code (Optional if automatic)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. ROYAL20"
                    value={code}
                    onChange={(e) => setCode(e.target.value.toUpperCase())}
                    className="w-full bg-[#030E18] border border-[#D4AF37]/40 text-white font-mono uppercase font-bold p-2 rounded-xs"
                  />
                </div>

                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-[#EED9C4] font-serif-royal font-semibold mb-1">
                    Title *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Royal Oud 20% Celebration"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full bg-[#030E18] border border-[#D4AF37]/40 text-white p-2 rounded-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-wider text-[#EED9C4]/80 font-serif-royal mb-1">
                  Description
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. Enjoy 20% discount on select royal flacons..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-[#030E18] border border-[#D4AF37]/30 text-white p-2 rounded-xs"
                />
              </div>

              {/* Date Validity */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-[#EED9C4]/80 font-serif-royal mb-1">
                    Start Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full bg-[#030E18] border border-[#D4AF37]/30 text-white font-mono p-2 rounded-xs"
                  />
                </div>

                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-[#EED9C4]/80 font-serif-royal mb-1">
                    End Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full bg-[#030E18] border border-[#D4AF37]/30 text-white font-mono p-2 rounded-xs"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#D4AF37]/25">
                <button
                  type="button"
                  onClick={() => {
                    setIsAddingNew(false);
                    setEditingOffer(null);
                  }}
                  className="px-4 py-2 border border-[#D4AF37]/30 text-[#EED9C4] rounded-xs font-serif-royal uppercase tracking-wider text-xs hover:border-[#D4AF37]"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="px-6 py-2 bg-gradient-to-r from-[#D4AF37] to-[#AA8435] text-black rounded-xs font-serif-royal font-bold uppercase tracking-wider text-xs hover:shadow-lg transition-all"
                >
                  Save Discount
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
