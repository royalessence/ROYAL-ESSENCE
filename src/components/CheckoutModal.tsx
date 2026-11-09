import React, { useState, useEffect } from 'react';
import {
  CartItem,
  Order,
  PaymentMethod,
  PaymentStatus,
  StoreSettings,
  AddressDetails,
  SpecialOffer,
  SavedAddress,
  AddressLabel,
  CustomerAccount,
} from '../types';
import {
  X,
  Copy,
  Check,
  ShieldCheck,
  ArrowRight,
  MapPin,
  Building,
  Building2,
  Smartphone,
  Gift,
  Tag,
  Percent,
  Sparkles,
  AlertCircle,
  Bookmark,
  Home,
  Plus,
  CheckCircle2,
} from 'lucide-react';
import { BANGLADESH_LOCATIONS } from '../data/bangladeshLocations';
import { RoyalLogo } from './RoyalLogo';
import { Islamic8PointStar } from './ArabianDecorations';
import { getProductSizeInventory } from '../data/perfumes';
import { SavedAddressCard } from './SavedAddressCard';
import { ProductImagePlaceholder } from './ProductImagePlaceholder';
import { calculateProductDiscount } from '../utils/discountUtils';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  settings: StoreSettings;
  onOrderPlaced: (order: Order, adminNotificationType: 'new_order' | 'continued_unpaid' | 'payment_submitted') => void;
  directBuyItem?: CartItem | null;
  availableOffers?: SpecialOffer[];
  ordersHistory?: Order[];
  onApplyOfferUsage?: (offerId: string) => void;
  savedAddresses?: SavedAddress[];
  onSaveAddress?: (address: Omit<SavedAddress, 'id' | 'createdAt' | 'updatedAt'>, existingId?: string) => void;
  onOpenManageAddresses?: () => void;
  customer?: CustomerAccount;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  items,
  settings,
  onOrderPlaced,
  directBuyItem,
  availableOffers = [],
  ordersHistory = [],
  onApplyOfferUsage,
  savedAddresses = [],
  onSaveAddress,
  onOpenManageAddresses,
  customer,
}) => {
  if (!isOpen) return null;

  const checkoutItems = directBuyItem ? [directBuyItem] : items;

  // Flow State: 'checkout_form' | 'payment_notice'
  const [currentStep, setCurrentStep] = useState<'checkout_form' | 'payment_notice'>('checkout_form');

  // Default address resolution
  const defaultSavedAddr =
    savedAddresses.find((a) => a.isDefault) || (savedAddresses.length > 0 ? savedAddresses[0] : null);

  // Selected Saved Address State
  const [selectedSavedId, setSelectedSavedId] = useState<string | null>(
    defaultSavedAddr ? defaultSavedAddr.id : null
  );

  // Customer Details
  const [customerName, setCustomerName] = useState(
    defaultSavedAddr ? defaultSavedAddr.fullName : customer?.name || ''
  );
  const [phone, setPhone] = useState(
    defaultSavedAddr ? defaultSavedAddr.phone : customer?.phone || ''
  );
  const [phoneError, setPhoneError] = useState('');

  // Bangladesh Administrative Address
  const [division, setDivision] = useState(
    defaultSavedAddr ? defaultSavedAddr.division : 'Dhaka'
  );
  const [district, setDistrict] = useState(
    defaultSavedAddr ? defaultSavedAddr.district : 'Dhaka'
  );
  const [upazila, setUpazila] = useState(
    defaultSavedAddr ? defaultSavedAddr.upazila : 'Banani'
  );
  const [area, setArea] = useState(
    defaultSavedAddr ? defaultSavedAddr.area || '' : ''
  );
  const [roadVillageHouse, setRoadVillageHouse] = useState(
    defaultSavedAddr ? defaultSavedAddr.roadVillageHouse : ''
  );
  const [postalCode, setPostalCode] = useState(
    defaultSavedAddr ? defaultSavedAddr.postalCode : '1213'
  );
  const [instructions, setInstructions] = useState(
    defaultSavedAddr ? defaultSavedAddr.instructions || '' : ''
  );

  // Save Address For Future Orders State
  const [saveAddressForFuture, setSaveAddressForFuture] = useState(false);
  const [addressLabel, setAddressLabel] = useState<AddressLabel>(
    defaultSavedAddr ? defaultSavedAddr.label : 'Home'
  );
  const [customAddressLabel, setCustomAddressLabel] = useState(
    defaultSavedAddr?.customLabel || ''
  );

  // Automatically sync with default saved address when modal opens if form is empty
  useEffect(() => {
    if (defaultSavedAddr && !customerName && !phone && !roadVillageHouse) {
      setSelectedSavedId(defaultSavedAddr.id);
      setCustomerName(defaultSavedAddr.fullName);
      setPhone(defaultSavedAddr.phone);
      setDivision(defaultSavedAddr.division);
      setDistrict(defaultSavedAddr.district);
      setUpazila(defaultSavedAddr.upazila);
      setArea(defaultSavedAddr.area || '');
      setRoadVillageHouse(defaultSavedAddr.roadVillageHouse);
      setPostalCode(defaultSavedAddr.postalCode);
      setInstructions(defaultSavedAddr.instructions || '');
      setAddressLabel(defaultSavedAddr.label);
      setCustomAddressLabel(defaultSavedAddr.customLabel || '');
    }
  }, [defaultSavedAddr]);

  // Handle selecting a saved address (Auto-populate all fields)
  const handleSelectSavedAddress = (addr: SavedAddress) => {
    setSelectedSavedId(addr.id);
    setCustomerName(addr.fullName);
    setPhone(addr.phone);
    setDivision(addr.division);
    setDistrict(addr.district);
    setUpazila(addr.upazila);
    setPostalCode(addr.postalCode);
    setArea(addr.area || '');
    setRoadVillageHouse(addr.roadVillageHouse);
    setInstructions(addr.instructions || '');
    setAddressLabel(addr.label);
    setCustomAddressLabel(addr.customLabel || '');
    setPhoneError('');
  };

  // Handle "+ Add New Address" click
  const handleAddNewAddressClick = () => {
    setSelectedSavedId(null);
    setCustomerName(customer?.name || '');
    setPhone(customer?.phone || '');
    setDivision('Dhaka');
    setDistrict('Dhaka');
    setUpazila('Banani');
    setPostalCode('1213');
    setArea('');
    setRoadVillageHouse('');
    setInstructions('');
    setSaveAddressForFuture(true);
    setAddressLabel('Home');
    setCustomAddressLabel('');
    setPhoneError('');
  };

  // Optional Gift Packing State (Never auto-selected, strictly optional)
  const [addGiftPacking, setAddGiftPacking] = useState(false);

  // Special Offers & Discount Coupon State
  const [couponInput, setCouponInput] = useState('');
  const [appliedOffer, setAppliedOffer] = useState<SpecialOffer | null>(null);
  const [couponError, setCouponError] = useState('');
  const [couponSuccess, setCouponSuccess] = useState('');
  const [stockError, setStockError] = useState('');
  const [showOffersModal, setShowOffersModal] = useState(false);

  // Payment Selection: STRICTLY ONLY bKash and Nagad as requested
  const [selectedMethod, setSelectedMethod] = useState<'bkash' | 'nagad'>('bkash');
  const [copiedNumber, setCopiedNumber] = useState(false);

  // Financial Calculations with Active Product Discounts
  let originalSubtotal = 0;
  let subtotal = 0;

  checkoutItems.forEach((it) => {
    const disc = calculateProductDiscount(it.product, it.size, availableOffers, it.pricePerUnit);
    const unitPrice = disc.hasDiscount ? disc.discountedPrice : it.pricePerUnit;
    originalSubtotal += disc.originalPrice * it.quantity;
    subtotal += unitPrice * it.quantity;
  });

  const productSavings = Math.max(0, originalSubtotal - subtotal);

  const deliveryCharge =
    subtotal < 250
      ? settings.deliveryChargeBelow250
      : settings.deliveryCharge250AndAbove;

  // Extra ৳25 only when customer checks Gift Packing
  const giftPackingCharge = addGiftPacking ? 25 : 0;

  // Calculate Special Offer Discount
  let discountAmount = 0;
  if (appliedOffer) {
    if (
      appliedOffer.type === 'percentage' ||
      appliedOffer.type === 'first_order' ||
      appliedOffer.type === 'festival'
    ) {
      const rawDiscount = Math.round((subtotal * appliedOffer.discountValue) / 100);
      discountAmount = appliedOffer.maxDiscountLimit
        ? Math.min(rawDiscount, appliedOffer.maxDiscountLimit)
        : rawDiscount;
    } else {
      // Fixed amount or Bundle discount
      discountAmount = Math.min(appliedOffer.discountValue, subtotal);
    }
  }

  const finalTotal = Math.max(0, subtotal + deliveryCharge + giftPackingCharge - discountAmount);

  // Active Admin Configured Payment Number (editable from Admin Dashboard)
  const activePaymentNumber =
    (settings.paymentNumbers && settings.paymentNumbers[selectedMethod]) || '01741129399';

  // Apply Coupon Validator
  const handleApplyCoupon = (codeToTest?: string) => {
    const raw = (codeToTest || couponInput).trim().toUpperCase();
    if (!raw) {
      setCouponError('Please enter a coupon code.');
      setCouponSuccess('');
      return;
    }

    const offer = (availableOffers || []).find((o) => o.code.toUpperCase() === raw);
    if (!offer) {
      setCouponError(`Coupon code "${raw}" is invalid.`);
      setCouponSuccess('');
      return;
    }

    if (!offer.isActive) {
      setCouponError(`Promotion "${offer.title}" is currently inactive.`);
      setCouponSuccess('');
      return;
    }

    const today = new Date().toISOString().split('T')[0];
    if (offer.startDate && today < offer.startDate) {
      setCouponError(`Offer begins on ${offer.startDate}.`);
      setCouponSuccess('');
      return;
    }

    if (offer.endDate && today > offer.endDate) {
      setCouponError(`Offer "${offer.code}" expired on ${offer.endDate}.`);
      setCouponSuccess('');
      return;
    }

    if (offer.minPurchaseAmount && subtotal < offer.minPurchaseAmount) {
      setCouponError(
        `Requires minimum bag subtotal of ৳${offer.minPurchaseAmount} (Current: ৳${subtotal}).`
      );
      setCouponSuccess('');
      return;
    }

    const totalBottles = checkoutItems.reduce((acc, it) => acc + it.quantity, 0);
    if (offer.minQuantity && totalBottles < offer.minQuantity) {
      setCouponError(
        `Bundle promotion requires at least ${offer.minQuantity} bottles in bag (Current: ${totalBottles}).`
      );
      setCouponSuccess('');
      return;
    }

    if (offer.type === 'first_order' && phone.trim()) {
      const cleanPhone = phone.replace(/[^\d]/g, '');
      const hasPriorOrder = (ordersHistory || []).some(
        (o) => o.phone.replace(/[^\d]/g, '') === cleanPhone
      );
      if (hasPriorOrder) {
        setCouponError('First order discount is valid exclusively for new customers.');
        setCouponSuccess('');
        return;
      }
    }

    setAppliedOffer(offer);
    setCouponError('');
    setCouponSuccess(`✓ Coupon ${offer.code} applied successfully!`);
    setShowOffersModal(false);
  };

  const handleRemoveCoupon = () => {
    setAppliedOffer(null);
    setCouponInput('');
    setCouponSuccess('');
    setCouponError('');
  };

  // Cascading Address Data
  const divisionData = BANGLADESH_LOCATIONS.divisions[division] || BANGLADESH_LOCATIONS.divisions['Dhaka'];
  const districtList = Object.keys(divisionData.districts);
  const currentDistrictData = divisionData.districts[district] || divisionData.districts[districtList[0]];
  const upazilaList = currentDistrictData?.upazilas || [];

  const handleDivisionChange = (newDiv: string) => {
    setDivision(newDiv);
    const newDivData = BANGLADESH_LOCATIONS.divisions[newDiv];
    if (newDivData) {
      const firstDist = Object.keys(newDivData.districts)[0];
      setDistrict(firstDist);
      const firstUpazila = newDivData.districts[firstDist]?.upazilas[0] || '';
      setUpazila(firstUpazila);
      setPostalCode(newDivData.districts[firstDist]?.defaultPostalCode || '1000');
    }
  };

  const handleDistrictChange = (newDist: string) => {
    setDistrict(newDist);
    const distData = divisionData.districts[newDist];
    if (distData) {
      setUpazila(distData.upazilas[0] || '');
      setPostalCode(distData.defaultPostalCode || '1000');
    }
  };

  const handleCopyNumber = () => {
    navigator.clipboard.writeText(activePaymentNumber);
    setCopiedNumber(true);
    setTimeout(() => setCopiedNumber(false), 2000);
  };

  // Validates Bangladeshi mobile (11 digits starting with 01)
  const validateBdPhone = (num: string): boolean => {
    const cleaned = num.replace(/[\s-]/g, '');
    return /^01[3-9]\d{8}$/.test(cleaned);
  };

  // 1. PLACE ORDER CLICKED -> Validates and shows Emergency Payment Notice
  const handlePlaceOrderClick = (e: React.FormEvent) => {
    e.preventDefault();

    if (!customerName.trim() || !roadVillageHouse.trim()) {
      return;
    }

    if (!validateBdPhone(phone)) {
      setPhoneError('Please enter a valid 11-digit Bangladeshi mobile number (e.g. 017XXXXXXXX).');
      return;
    }
    setPhoneError('');

    // Pre-checkout stock validation: Prevent overselling
    for (const it of checkoutItems) {
      const inv = getProductSizeInventory(it.product, it.size);
      if (inv.stock < it.quantity || !inv.isAvailable) {
        setStockError(
          `Inventory Alert: ${it.product.name} (${it.size}) only has ${inv.stock} bottle(s) in stock. Please adjust bag quantity.`
        );
        return;
      }
    }
    setStockError('');

    // Immediately show the small, beautiful and noticeable payment warning popup in center of screen
    setCurrentStep('payment_notice');
  };

  // 3. Customer clicks "I HAVE COMPLETED PAYMENT – CONTINUE"
  const handleCompletedPaymentContinue = () => {
    const fullAddress = `${roadVillageHouse.trim()}, ${area ? area.trim() + ', ' : ''}${upazila}, ${district}, ${division} - ${postalCode}${
      instructions ? ` (Note: ${instructions.trim()})` : ''
    }`;

    const addressDetails: AddressDetails = {
      division,
      district,
      upazila,
      area: area.trim(),
      roadVillageHouse: roadVillageHouse.trim(),
      postalCode,
      instructions: instructions.trim(),
    };

    // Save payment submission status as pending verification (do not automatically mark as paid)
    const newOrder: Order = {
      id: `RE-${Math.floor(100000 + Math.random() * 900000)}`,
      customerName: customerName.trim(),
      phone: phone.trim(),
      address: fullAddress,
      addressDetails,
      items: checkoutItems,
      subtotal,
      deliveryCharge,
      giftPackaging: addGiftPacking,
      giftPackagingCharge: giftPackingCharge,
      appliedOfferCode: appliedOffer ? appliedOffer.code : undefined,
      discountAmount: (appliedOffer ? discountAmount : 0) + productSavings,
      total: finalTotal,
      paymentMethod: selectedMethod,
      paymentStatus: 'PAYMENT VERIFICATION PENDING' as PaymentStatus,
      senderNumber: phone.trim(),
      transactionId: 'PAYMENT NOTICE SUBMISSION',
      status: 'Order Placed',
      createdAt: new Date().toISOString(),
      statusHistory: [
        {
          status: 'Order Placed',
          timestamp: new Date().toISOString(),
          note: `Customer completed payment notice using ${selectedMethod.toUpperCase()}.${
            addGiftPacking ? ' (Includes Premium Gift Packing: ৳25)' : ''
          }${appliedOffer ? ` (Discount: ৳${discountAmount} via ${appliedOffer.code})` : ''} Verification pending.`,
        },
      ],
    };

    if (appliedOffer && onApplyOfferUsage) {
      onApplyOfferUsage(appliedOffer.id);
    }

    // Save address if customer checked "Save this address for future orders"
    if (saveAddressForFuture && onSaveAddress) {
      onSaveAddress({
        customerId: customer?.id || 'cust-royal-01',
        label: addressLabel,
        customLabel: addressLabel === 'Other' && customAddressLabel.trim() ? customAddressLabel.trim() : undefined,
        fullName: customerName.trim(),
        phone: phone.trim(),
        division,
        district,
        upazila,
        area: area.trim() || undefined,
        roadVillageHouse: roadVillageHouse.trim(),
        postalCode: postalCode.trim(),
        instructions: instructions.trim() || undefined,
        isDefault: (savedAddresses || []).length === 0,
      });
    }

    // Notify parent and proceed directly to existing Order Successful page
    onOrderPlaced(newOrder, 'payment_submitted');
    onClose();
  };

  // ==========================================
  // 1. EMERGENCY PAYMENT NOTICE POPUP
  // ==========================================
  if (currentStep === 'payment_notice') {
    const methodUpper = selectedMethod.toUpperCase();

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-[#03060C]/90 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
        <div className="relative w-full max-w-md bg-gradient-to-b from-[#140E0A] via-[#0E0B08] to-[#070504] border-2 border-[#D4AF37]/80 rounded-t-[28px] rounded-b-xs shadow-[0_20px_70px_rgba(0,0,0,0.95)] overflow-hidden my-auto text-center">
          {/* Top Decorative Gold Accent Bar */}
          <div className="h-1.5 w-full bg-gradient-to-r from-[#AA8435] via-[#F3CD68] to-[#D4AF37]" />

          {/* Close / Return Button */}
          <button
            onClick={() => setCurrentStep('checkout_form')}
            className="absolute top-4 right-4 text-[#EED9C4]/60 hover:text-white p-1.5 bg-[#050505]/70 border border-[#D4AF37]/30 rounded-full transition-colors"
            title="Back to delivery details"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="p-6 sm:p-7 space-y-4">
            {/* Emergency Warning Icon (⚠️) */}
            <div className="relative inline-block mt-1">
              <div className="text-4xl sm:text-5xl select-none" role="img" aria-label="Warning">
                ⚠️
              </div>
            </div>

            {/* Heading */}
            <h3 className="font-serif-royal font-black text-xl sm:text-2xl text-[#FFFFFF] tracking-wider uppercase drop-shadow-sm">
              IMPORTANT PAYMENT NOTICE!
            </h3>

            {/* Exact Warning Message as strictly required */}
            <div className="p-4 bg-[#1F1208]/90 border border-[#D4AF37]/40 rounded-xs text-xs text-[#F5EBDD] leading-relaxed space-y-2 text-left font-sans-body shadow-inner">
              <p className="font-semibold text-[#F3CD68]">
                To receive your parcel, you must complete your payment using bKash or Nagad.
              </p>
              <p className="text-[#EED9C4]/90">
                Please send your payment to the following number before continuing.
              </p>
              <p className="text-red-400 font-semibold pt-1 border-t border-[#D4AF37]/20">
                Failure to complete payment may result in your order not being delivered.
              </p>
            </div>

            {/* Payment Method Switcher: ONLY bKash and Nagad */}
            <div>
              <span className="text-[10px] text-[#AA8435] uppercase font-serif-royal tracking-widest block font-bold mb-1.5">
                Select Your Payment App
              </span>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedMethod('bkash')}
                  className={`py-2 px-3 rounded-xs border text-xs font-serif-royal font-bold uppercase transition-all flex items-center justify-center gap-1.5 ${
                    selectedMethod === 'bkash'
                      ? 'bg-gradient-to-r from-[#D4AF37] to-[#AA8435] text-black border-white shadow-md'
                      : 'bg-[#150F0B] border-[#D4AF37]/30 text-[#EED9C4] hover:border-[#D4AF37]'
                  }`}
                >
                  <Smartphone className="w-3.5 h-3.5" />
                  <span>bKash</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedMethod('nagad')}
                  className={`py-2 px-3 rounded-xs border text-xs font-serif-royal font-bold uppercase transition-all flex items-center justify-center gap-1.5 ${
                    selectedMethod === 'nagad'
                      ? 'bg-gradient-to-r from-[#D4AF37] to-[#AA8435] text-black border-white shadow-md'
                      : 'bg-[#150F0B] border-[#D4AF37]/30 text-[#EED9C4] hover:border-[#D4AF37]'
                  }`}
                >
                  <Smartphone className="w-3.5 h-3.5" />
                  <span>Nagad</span>
                </button>
              </div>
            </div>

            {/* Display Active Payment Number with COPY NUMBER Button */}
            <div className="p-3.5 bg-[#0C0806] border border-[#D4AF37]/50 rounded-xs space-y-2">
              <span className="text-[10px] text-[#EED9C4]/80 font-serif-royal uppercase tracking-wider block">
                Send ৳{finalTotal.toLocaleString('en-US')} BDT to {methodUpper} Number:
              </span>

              <div className="flex items-center justify-center gap-2">
                <span className="font-mono font-black text-xl sm:text-2xl text-[#F3CD68] tracking-widest bg-[#150E0A] px-3 py-1 rounded-xs border border-[#D4AF37]/30">
                  {activePaymentNumber}
                </span>

                <button
                  type="button"
                  onClick={handleCopyNumber}
                  className="px-3 py-1.5 bg-[#231710] border border-[#D4AF37] text-[#F3CD68] hover:text-white hover:bg-[#322015] rounded-xs font-serif-royal font-bold text-[11px] uppercase tracking-wider flex items-center gap-1 transition-colors"
                >
                  {copiedNumber ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400 stroke-[3]" />
                      <span className="text-emerald-400">COPIED!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>COPY NUMBER</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* 3. Continue After Payment Button */}
            <div className="pt-2">
              <button
                type="button"
                onClick={handleCompletedPaymentContinue}
                className="w-full py-4 px-4 bg-gradient-to-r from-[#D4AF37] via-[#F3CD68] to-[#AA8435] text-[#050505] font-serif-royal font-black text-xs sm:text-sm uppercase tracking-[0.16em] rounded-xs shadow-[0_4px_25px_rgba(243,205,104,0.45)] hover:scale-[1.01] transition-all flex items-center justify-center gap-2"
              >
                <span>I HAVE COMPLETED PAYMENT – CONTINUE</span>
                <ArrowRight className="w-4 h-4 stroke-[2.5]" />
              </button>
              <button
                type="button"
                onClick={() => setCurrentStep('checkout_form')}
                className="text-[11px] text-[#EED9C4]/60 hover:text-[#F3CD68] underline mt-3 block mx-auto"
              >
                ← Back to Edit Delivery Details
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ==========================================
  // CHECKOUT ADDRESS & DETAILS FORM
  // ==========================================
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-[#070709]/90 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl bg-gradient-to-b from-[#121217] via-[#0E0E12] to-[#0A0A0C] border border-[#D4AF37]/50 rounded-t-[32px] rounded-b-xs shadow-[0_25px_80px_rgba(0,0,0,0.95)] overflow-hidden my-6">
        {/* Top Decorative Gold Bar */}
        <div className="h-1.5 w-full bg-gradient-to-r from-[#AA8435] via-[#F3CD68] to-[#D4AF37]" />

        {/* Modal Top Header */}
        <div className="p-4 sm:p-6 border-b border-[#D4AF37]/25 flex items-center justify-between bg-[#0E0E12]/95">
          <div className="flex items-center gap-3">
            <RoyalLogo size="sm" showTagline={false} />
            <div className="hidden sm:block border-l border-[#D4AF37]/30 pl-3">
              <span className="text-[10px] text-[#F3CD68] font-serif-royal uppercase tracking-widest block font-bold">
                ROYAL CHECKOUT
              </span>
              <span className="text-xs text-[#EED9C4]/80">Express Bangladesh Delivery (৳10)</span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-[#EED9C4]/60 hover:text-white bg-[#04121E] border border-[#D4AF37]/30 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Main Form & Bag Split */}
        <div className="grid grid-cols-1 lg:grid-cols-12 max-h-[80vh] overflow-y-auto">
          {/* Left Column: Delivery Form */}
          <div className="lg:col-span-7 p-5 sm:p-7 space-y-4">
            <h2 className="font-serif-royal text-base sm:text-lg font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <MapPin className="w-4 h-4 text-[#F3CD68]" />
              Delivery Address & Payment Method
            </h2>

            <form onSubmit={handlePlaceOrderClick} className="space-y-4">
              {/* ======================================================== */}
              {/* 2 & 4. CHOOSE A SAVED ADDRESS / MY SAVED ADDRESSES SECTION */}
              {/* ======================================================== */}
              {savedAddresses && savedAddresses.length > 0 && (
                <div className="p-4 bg-[#051522]/90 border border-[#D4AF37]/35 rounded-xs space-y-3 shadow-inner">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div className="flex items-center gap-2">
                      <Bookmark className="w-4 h-4 text-[#F3CD68]" />
                      <h3 className="font-serif-royal font-bold text-xs uppercase tracking-wider text-white">
                        Choose a Saved Address
                      </h3>
                      <span className="text-[10px] text-[#F3CD68] bg-[#1F140A] border border-[#D4AF37]/40 px-2 py-0.5 rounded-2xs font-mono">
                        {savedAddresses.length} Saved
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={handleAddNewAddressClick}
                        className={`text-[11px] font-serif-royal font-bold uppercase tracking-wider px-2.5 py-1 rounded-2xs border transition-colors flex items-center gap-1 ${
                          selectedSavedId === null
                            ? 'bg-[#D4AF37] text-black border-white'
                            : 'bg-[#030910] text-[#F3CD68] border-[#D4AF37]/40 hover:border-[#D4AF37]'
                        }`}
                      >
                        <Plus className="w-3 h-3 stroke-[3]" />
                        <span>+ Add New Address</span>
                      </button>

                      {onOpenManageAddresses && (
                        <button
                          type="button"
                          onClick={onOpenManageAddresses}
                          className="text-[10px] text-[#EED9C4]/70 hover:text-white underline font-serif-royal uppercase"
                        >
                          Manage All
                        </button>
                      )}
                    </div>
                  </div>

                  <p className="text-[11px] text-[#EED9C4]/70 font-sans-body">
                    Click <strong>"Use This Address"</strong> to auto-fill all checkout fields with one click.
                  </p>

                  {/* Saved Address Cards Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-64 overflow-y-auto pr-1">
                    {savedAddresses.map((addr) => (
                      <SavedAddressCard
                        key={addr.id}
                        address={addr}
                        isSelected={selectedSavedId === addr.id}
                        onSelect={handleSelectSavedAddress}
                        showActions={true}
                        compact={true}
                      />
                    ))}
                  </div>

                  {selectedSavedId && (
                    <div className="p-2.5 bg-emerald-950/70 border border-emerald-600/40 text-emerald-400 text-[11px] flex items-center justify-between rounded-2xs flex-wrap gap-1">
                      <span className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        <span>Using saved address. You can still modify any field below.</span>
                      </span>
                      <button
                        type="button"
                        onClick={handleAddNewAddressClick}
                        className="text-[10px] text-[#F3CD68] hover:underline font-serif-royal uppercase font-bold"
                      >
                        Clear & Type New →
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* Customer Full Name */}
              <div>
                <label className="block text-xs uppercase tracking-wider text-[#F3CD68] mb-1 font-serif-royal font-bold">
                  Customer Full Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Tareq Rahman"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full bg-[#041424] border border-[#D4AF37]/35 text-xs text-[#F5EBDD] p-3 rounded-xs focus:outline-none focus:border-[#F3CD68]"
                />
              </div>

              {/* Customer Mobile Number */}
              <div>
                <label className="block text-xs uppercase tracking-wider text-[#F3CD68] mb-1 font-serif-royal font-bold">
                  Customer Mobile Number (Bangladeshi 11 Digits) *
                </label>
                <input
                  type="tel"
                  required
                  placeholder="e.g. 017XXXXXXXX or 018XXXXXXXX"
                  value={phone}
                  onChange={(e) => {
                    setPhone(e.target.value);
                    if (phoneError) setPhoneError('');
                  }}
                  className={`w-full bg-[#041424] border text-xs text-[#F5EBDD] p-3 rounded-xs focus:outline-none ${
                    phoneError ? 'border-red-500' : 'border-[#D4AF37]/35 focus:border-[#F3CD68]'
                  }`}
                />
                {phoneError ? (
                  <span className="text-[11px] text-red-400 mt-1 block">{phoneError}</span>
                ) : (
                  <span className="text-[10px] text-[#EED9C4]/60 mt-0.5 block">
                    Courier dispatch confirmation SMS and updates will be sent to this number.
                  </span>
                )}
              </div>

              {/* Bangladesh Structured Address */}
              <div className="p-4 bg-[#051826]/80 border border-[#D4AF37]/30 rounded-xs space-y-3">
                <div className="flex items-center gap-2 text-[#F3CD68] font-serif-royal text-xs uppercase tracking-wider font-bold">
                  <Building className="w-4 h-4" />
                  <span>Accurate Bangladesh Location Database</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] uppercase tracking-wider text-[#EED9C4] mb-1 font-serif-royal font-semibold">
                      Division *
                    </label>
                    <select
                      value={division}
                      onChange={(e) => handleDivisionChange(e.target.value)}
                      className="w-full bg-[#030E18] border border-[#D4AF37]/40 text-xs text-white p-2.5 rounded-xs focus:outline-none focus:border-[#F3CD68]"
                    >
                      {Object.keys(BANGLADESH_LOCATIONS.divisions).map((divName) => (
                        <option key={divName} value={divName}>
                          {divName}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] uppercase tracking-wider text-[#EED9C4] mb-1 font-serif-royal font-semibold">
                      District *
                    </label>
                    <select
                      value={district}
                      onChange={(e) => handleDistrictChange(e.target.value)}
                      className="w-full bg-[#030E18] border border-[#D4AF37]/40 text-xs text-white p-2.5 rounded-xs focus:outline-none focus:border-[#F3CD68]"
                    >
                      {districtList.map((distName) => (
                        <option key={distName} value={distName}>
                          {distName}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] uppercase tracking-wider text-[#EED9C4] mb-1 font-serif-royal font-semibold">
                      Upazila / Thana *
                    </label>
                    <select
                      value={upazila}
                      onChange={(e) => setUpazila(e.target.value)}
                      className="w-full bg-[#030E18] border border-[#D4AF37]/40 text-xs text-white p-2.5 rounded-xs focus:outline-none focus:border-[#F3CD68]"
                    >
                      {upazilaList.map((upzName) => (
                        <option key={upzName} value={upzName}>
                          {upzName}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] uppercase tracking-wider text-[#EED9C4] mb-1 font-serif-royal font-semibold">
                      Postal Code *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. 1205"
                      value={postalCode}
                      onChange={(e) => setPostalCode(e.target.value)}
                      className="w-full bg-[#030E18] border border-[#D4AF37]/40 text-xs text-white p-2.5 rounded-xs font-mono focus:outline-none focus:border-[#F3CD68]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-[#EED9C4] mb-1 font-serif-royal font-semibold">
                    Area / Landmark (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Road 11, Block D / Near City Bank"
                    value={area}
                    onChange={(e) => setArea(e.target.value)}
                    className="w-full bg-[#030E18] border border-[#D4AF37]/40 text-xs text-white p-2.5 rounded-xs focus:outline-none focus:border-[#F3CD68]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-[#F3CD68] mb-1 font-serif-royal font-bold">
                    House / Road / Village *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. House 42, Road 7, Flat 3B"
                    value={roadVillageHouse}
                    onChange={(e) => setRoadVillageHouse(e.target.value)}
                    className="w-full bg-[#030E18] border border-[#D4AF37]/40 text-xs text-white p-2.5 rounded-xs focus:outline-none focus:border-[#F3CD68]"
                  />
                </div>

                <div>
                  <label className="block text-[10px] uppercase tracking-wider text-[#EED9C4]/70 mb-1 font-serif-royal">
                    Delivery Instructions (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Call before delivery / Leave with security guard"
                    value={instructions}
                    onChange={(e) => setInstructions(e.target.value)}
                    className="w-full bg-[#030E18] border border-[#D4AF37]/25 text-xs text-white p-2 rounded-xs focus:outline-none focus:border-[#F3CD68]"
                  />
                </div>
              </div>

              {/* 1. SAVE THIS ADDRESS FOR FUTURE ORDERS CHECKBOX & LABEL */}
              <div className="p-3.5 bg-[#04121F] border border-[#D4AF37]/35 rounded-xs space-y-3">
                <label className="flex items-start gap-2.5 cursor-pointer select-none">
                  <div className="pt-0.5">
                    <input
                      type="checkbox"
                      checked={saveAddressForFuture}
                      onChange={(e) => setSaveAddressForFuture(e.target.checked)}
                      className="w-4 h-4 rounded border-[#D4AF37] text-[#D4AF37] focus:ring-[#D4AF37] bg-[#030910]"
                    />
                  </div>
                  <div className="flex-1">
                    <span className="text-xs font-serif-royal font-bold text-white tracking-wide block">
                      Save this address for future orders
                    </span>
                    <span className="text-[10px] text-[#EED9C4]/70 block font-sans-body">
                      Securely link this delivery address to your account for fast, 1-click checkout on all future orders.
                    </span>
                  </div>
                </label>

                {saveAddressForFuture && (
                  <div className="pt-2 border-t border-[#D4AF37]/20 space-y-2 animate-in fade-in">
                    <span className="block text-[10px] uppercase tracking-wider text-[#F3CD68] font-serif-royal font-bold">
                      Select Address Label:
                    </span>
                    <div className="grid grid-cols-3 gap-2">
                      {(['Home', 'Office', 'Other'] as const).map((lbl) => (
                        <button
                          key={lbl}
                          type="button"
                          onClick={() => setAddressLabel(lbl)}
                          className={`py-1.5 px-2 rounded-xs border text-[11px] font-serif-royal font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all ${
                            addressLabel === lbl
                              ? 'bg-gradient-to-r from-[#D4AF37] to-[#AA8435] text-black border-white shadow-sm'
                              : 'bg-[#030910] border-[#D4AF37]/30 text-[#EED9C4] hover:border-[#D4AF37]'
                          }`}
                        >
                          {lbl === 'Home' && <Home className="w-3 h-3" />}
                          {lbl === 'Office' && <Building2 className="w-3 h-3" />}
                          {lbl === 'Other' && <MapPin className="w-3 h-3" />}
                          <span>{lbl}</span>
                        </button>
                      ))}
                    </div>

                    {addressLabel === 'Other' && (
                      <input
                        type="text"
                        placeholder="Custom label name (e.g. Vacation Villa, Parents' House)"
                        value={customAddressLabel}
                        onChange={(e) => setCustomAddressLabel(e.target.value)}
                        className="w-full bg-[#02070E] border border-[#D4AF37]/35 text-xs text-white p-2 rounded-xs focus:outline-none focus:border-[#F3CD68]"
                      />
                    )}
                  </div>
                )}
              </div>

              {/* 1. OPTIONAL GIFT PACKING SYSTEM */}
              <div
                onClick={() => setAddGiftPacking(!addGiftPacking)}
                className={`cursor-pointer p-3.5 sm:p-4 rounded-xs border transition-all flex items-start gap-3 select-none ${
                  addGiftPacking
                    ? 'bg-gradient-to-r from-[#20140A] to-[#120B05] border-[#F3CD68] shadow-[0_0_20px_rgba(243,205,104,0.25)]'
                    : 'bg-[#041424] border-[#D4AF37]/35 hover:border-[#D4AF37]/70'
                }`}
              >
                {/* Checkbox */}
                <div className="pt-0.5 shrink-0">
                  <div
                    className={`w-5 h-5 rounded-2xs border flex items-center justify-center transition-all ${
                      addGiftPacking
                        ? 'bg-gradient-to-r from-[#D4AF37] to-[#AA8435] border-white text-black shadow-sm'
                        : 'bg-[#030E18] border-[#D4AF37]/50'
                    }`}
                  >
                    {addGiftPacking && <Check className="w-3.5 h-3.5 stroke-[3] text-black" />}
                  </div>
                </div>

                {/* Gift Box Icon & Text */}
                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <Gift className={`w-4 h-4 ${addGiftPacking ? 'text-[#F3CD68]' : 'text-[#D4AF37]'}`} />
                    <span className="font-serif-royal font-bold text-xs sm:text-sm text-white tracking-wide">
                      Add Gift Packing – ৳25
                    </span>
                    {addGiftPacking && (
                      <span className="text-[10px] bg-[#D4AF37]/20 border border-[#D4AF37]/60 text-[#F3CD68] px-2 py-0.5 rounded-xs font-serif-royal font-bold uppercase ml-auto">
                        +৳25 Added
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-[#EED9C4]/80 mt-1 font-sans-body">
                    Make your order special with premium gift packaging.
                  </p>
                </div>
              </div>

              {/* Payment Method Selection: ONLY bKash and Nagad */}
              <div>
                <label className="block text-xs uppercase tracking-wider text-[#F3CD68] mb-2 font-serif-royal font-bold">
                  Select Payment Method *
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setSelectedMethod('bkash')}
                    className={`p-3 rounded-xs border text-center transition-all ${
                      selectedMethod === 'bkash'
                        ? 'bg-gradient-to-r from-[#D4AF37] to-[#AA8435] text-[#050505] font-bold border-white shadow-md'
                        : 'bg-[#041424] border-[#D4AF37]/30 text-white hover:border-[#F3CD68]'
                    }`}
                  >
                    <span className="font-serif-royal text-xs uppercase font-bold block">
                      bKash
                    </span>
                    <span className="text-[10px] opacity-80 block">Personal Payment</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedMethod('nagad')}
                    className={`p-3 rounded-xs border text-center transition-all ${
                      selectedMethod === 'nagad'
                        ? 'bg-gradient-to-r from-[#D4AF37] to-[#AA8435] text-[#050505] font-bold border-white shadow-md'
                        : 'bg-[#041424] border-[#D4AF37]/30 text-white hover:border-[#F3CD68]'
                    }`}
                  >
                    <span className="font-serif-royal text-xs uppercase font-bold block">
                      Nagad
                    </span>
                    <span className="text-[10px] opacity-80 block">Personal Payment</span>
                  </button>
                </div>
              </div>

              {/* Inventory Stock Error Notification */}
              {stockError && (
                <div className="p-3 bg-[#3A0F14] border border-[#EF4444] rounded-xs text-xs text-[#FCA5A5] flex items-start gap-2 animate-in fade-in">
                  <AlertCircle className="w-4 h-4 text-[#EF4444] shrink-0 mt-0.5" />
                  <span>{stockError}</span>
                </div>
              )}

              {/* Place Order CTA Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-4 bg-gradient-to-r from-[#D4AF37] via-[#F3CD68] to-[#AA8435] text-[#050505] font-serif-royal font-black text-xs sm:text-sm uppercase tracking-[0.22em] rounded-xs shadow-[0_4px_24px_rgba(243,205,104,0.45)] hover:scale-[1.01] transition-all flex items-center justify-center gap-2"
                >
                  <ShieldCheck className="w-4 h-4 text-[#050505]" />
                  <span>PLACE ORDER · ৳{finalTotal.toLocaleString('en-US')} BDT</span>
                  <ArrowRight className="w-4 h-4 text-[#050505]" />
                </button>
                <p className="text-[10px] text-center text-[#EED9C4]/60 mt-2">
                  Clicking Place Order will display your payment instructions and dispatch schedule.
                </p>
              </div>
            </form>
          </div>

          {/* Right Column: Order Summary Preview */}
          <div className="lg:col-span-5 bg-[#040E1A] p-5 sm:p-7 border-t lg:border-t-0 lg:border-l border-[#D4AF37]/30 flex flex-col justify-between">
            <div>
              <h3 className="font-serif-royal text-sm font-bold uppercase tracking-wider text-[#F3CD68] mb-4 pb-2 border-b border-[#D4AF37]/20 flex items-center justify-between">
                <span>Royal Bag Summary</span>
                <span>{checkoutItems.reduce((acc, it) => acc + it.quantity, 0)} Items</span>
              </h3>

              {/* Items List */}
              <div className="space-y-3 max-h-52 overflow-y-auto pr-1">
                {checkoutItems.map((item) => {
                  const disc = calculateProductDiscount(item.product, item.size, availableOffers, item.pricePerUnit);
                  const effectiveUnit = disc.hasDiscount ? disc.discountedPrice : item.pricePerUnit;
                  return (
                    <div key={item.id} className="flex gap-3 items-center text-xs pb-3 border-b border-[#D4AF37]/15">
                      {item.product.image && item.product.image.trim() !== '' ? (
                        <img
                          src={item.product.image}
                          alt={item.product.name}
                          className="w-12 h-12 object-contain rounded-xs bg-[#02070D] border border-[#D4AF37]/20 p-1"
                        />
                      ) : (
                        <div className="w-12 h-12 shrink-0">
                          <ProductImagePlaceholder size="sm" className="w-full h-full p-0.5" />
                        </div>
                      )}
                      <div className="flex-1">
                        <h4 className="font-serif-royal font-bold text-white text-xs">
                          {item.product.name}
                        </h4>
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="text-[#F3CD68] font-bold text-[11px] block">
                            Size: {item.size}
                          </span>
                          {disc.hasDiscount && (
                            <span className="bg-emerald-600 text-white text-[9px] font-black px-1 rounded-2xs">
                              {disc.discountBadge}
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-1.5 text-[10px] text-[#EED9C4]/60">
                          <span>Qty: {item.quantity} ×</span>
                          {disc.hasDiscount && (
                            <span className="line-through text-neutral-400">৳{disc.originalPrice}</span>
                          )}
                          <span className="text-white font-semibold">৳{effectiveUnit}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        {disc.hasDiscount && (
                          <span className="block text-[10px] line-through text-neutral-400">
                            ৳{(disc.originalPrice * item.quantity).toLocaleString('en-US')}
                          </span>
                        )}
                        <span className="font-serif-royal font-bold text-xs text-[#F3CD68] tabular-nums">
                          ৳{(effectiveUnit * item.quantity).toLocaleString('en-US')}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* 1. SPECIAL OFFERS & COUPON INPUT */}
              <div className="mt-4 pt-3 border-t border-[#D4AF37]/20">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-serif-royal uppercase tracking-wider text-[#F3CD68] font-bold flex items-center gap-1.5">
                    <Tag className="w-3.5 h-3.5 text-[#D4AF37]" />
                    Promotional Coupon
                  </span>
                  {availableOffers.length > 0 && (
                    <button
                      type="button"
                      onClick={() => setShowOffersModal(true)}
                      className="text-[10px] text-[#2DD4BF] hover:underline font-serif-royal uppercase tracking-wider flex items-center gap-1"
                    >
                      <Sparkles className="w-3 h-3 text-[#2DD4BF]" />
                      Browse Offers ({availableOffers.filter((o) => o.isActive).length})
                    </button>
                  )}
                </div>

                {appliedOffer ? (
                  <div className="p-2.5 bg-gradient-to-r from-[#1E1408] to-[#120D06] border border-[#F3CD68] rounded-xs flex items-center justify-between text-xs">
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="px-1.5 py-0.5 rounded-2xs bg-[#D4AF37] text-black font-serif-royal font-bold text-[10px] uppercase">
                          {appliedOffer.code}
                        </span>
                        <span className="font-serif-royal font-bold text-[#F3CD68]">
                          {appliedOffer.title}
                        </span>
                      </div>
                      <span className="text-[10px] text-[#10B981] font-semibold mt-0.5 block">
                        Saved ৳{discountAmount} BDT on this order!
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={handleRemoveCoupon}
                      className="text-[#EED9C4]/60 hover:text-red-400 p-1"
                      title="Remove coupon"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Enter coupon (e.g. FIRST10)"
                        value={couponInput}
                        onChange={(e) => {
                          setCouponInput(e.target.value);
                          if (couponError) setCouponError('');
                        }}
                        className="flex-1 bg-[#02070E] border border-[#D4AF37]/40 text-xs text-white uppercase px-3 py-2 rounded-xs focus:outline-none focus:border-[#F3CD68] font-mono tracking-wider placeholder:normal-case placeholder:tracking-normal placeholder-[#EED9C4]/40"
                      />
                      <button
                        type="button"
                        onClick={() => handleApplyCoupon()}
                        className="px-3.5 py-2 bg-gradient-to-r from-[#D4AF37] to-[#AA8435] text-black font-serif-royal font-bold text-xs uppercase tracking-wider rounded-xs hover:scale-102 transition-all shadow-sm"
                      >
                        Apply
                      </button>
                    </div>

                    {couponError && (
                      <p className="text-[10px] text-[#EF4444] mt-1.5 font-sans-body">
                        {couponError}
                      </p>
                    )}
                    {couponSuccess && (
                      <p className="text-[10px] text-[#10B981] mt-1.5 font-sans-body">
                        {couponSuccess}
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Financial Totals */}
            <div className="pt-4 border-t border-[#D4AF37]/25 space-y-2 text-xs">
              <div className="flex justify-between text-[#EED9C4]/80">
                <span>Regular Subtotal</span>
                <span className={`tabular-nums ${productSavings > 0 ? 'line-through text-neutral-400' : 'text-white'}`}>
                  ৳{originalSubtotal.toLocaleString('en-US')}
                </span>
              </div>

              {productSavings > 0 && (
                <div className="flex justify-between text-emerald-400 font-medium">
                  <span className="flex items-center gap-1">
                    <Tag className="w-3.5 h-3.5" /> Product Special Discounts
                  </span>
                  <span className="tabular-nums font-bold">-৳{productSavings.toLocaleString('en-US')} BDT</span>
                </div>
              )}

              {productSavings > 0 && (
                <div className="flex justify-between text-[#EED9C4]/90">
                  <span>Discounted Subtotal</span>
                  <span className="tabular-nums font-semibold text-white">৳{subtotal.toLocaleString('en-US')}</span>
                </div>
              )}

              {appliedOffer && discountAmount > 0 && (
                <div className="flex justify-between text-[#10B981] font-semibold animate-in fade-in duration-200">
                  <span className="flex items-center gap-1">
                    <Percent className="w-3.5 h-3.5" />
                    Coupon ({appliedOffer.code})
                  </span>
                  <span className="tabular-nums font-bold">-৳{discountAmount.toLocaleString('en-US')} BDT</span>
                </div>
              )}

              {addGiftPacking && (
                <div className="flex justify-between text-[#F3CD68] font-semibold animate-in fade-in duration-200">
                  <span className="flex items-center gap-1.5">
                    <Gift className="w-3.5 h-3.5 text-[#F3CD68]" />
                    Gift Packing
                  </span>
                  <span className="tabular-nums font-bold">৳25 BDT</span>
                </div>
              )}

              <div className="flex justify-between text-[#EED9C4]/80">
                <span>Delivery Charge</span>
                <span className="text-[#2DD4BF] font-semibold tabular-nums">৳{deliveryCharge} BDT</span>
              </div>

              <div className="flex justify-between text-base font-serif-royal font-bold pt-2 border-t border-[#D4AF37]/20 text-[#F3CD68]">
                <span>Final Total</span>
                <span className="tabular-nums">৳{finalTotal.toLocaleString('en-US')} BDT</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Available Special Offers Modal / Popover */}
      {showOffersModal && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="relative w-full max-w-md bg-gradient-to-b from-[#07241A] via-[#0A1D36] to-[#1C0816] border-2 border-[#D4AF37]/70 rounded-t-[24px] rounded-b-xs p-5 shadow-[0_20px_60px_rgba(0,0,0,0.95)]">
            <div className="flex items-center justify-between pb-3 border-b border-[#D4AF37]/30 mb-4">
              <div className="flex items-center gap-2">
                <Tag className="w-4 h-4 text-[#F3CD68]" />
                <h3 className="font-serif-royal font-bold text-sm text-white uppercase tracking-wider">
                  Royal Privileges & Coupons
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowOffersModal(false)}
                className="text-[#EED9C4]/60 hover:text-white p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
              {availableOffers.filter((o) => o.isActive).length === 0 ? (
                <p className="text-center text-xs text-[#EED9C4]/60 py-6">
                  No active public promotions currently available.
                </p>
              ) : (
                availableOffers
                  .filter((o) => o.isActive)
                  .map((offer) => (
                    <div
                      key={offer.id}
                      className="p-3 bg-[#030E18] border border-[#D4AF37]/30 rounded-xs flex items-center justify-between gap-3 hover:border-[#F3CD68] transition-colors"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 bg-[#D4AF37]/20 border border-[#D4AF37] text-[#F3CD68] font-mono font-bold text-xs rounded-2xs">
                            {offer.code}
                          </span>
                          <span className="font-serif-royal font-bold text-xs text-white">
                            {offer.title}
                          </span>
                        </div>
                        <p className="text-[11px] text-[#EED9C4]/80 mt-1 font-sans-body">
                          {offer.description}
                        </p>
                        <div className="text-[10px] text-[#AA8435] mt-1 flex items-center gap-2">
                          {offer.minPurchaseAmount && <span>Min purchase: ৳{offer.minPurchaseAmount}</span>}
                          {offer.minQuantity && <span>Min bottles: {offer.minQuantity}</span>}
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleApplyCoupon(offer.code)}
                        className="px-3 py-1.5 bg-[#D4AF37] hover:bg-[#F3CD68] text-black font-serif-royal font-bold text-xs uppercase tracking-wider rounded-xs shrink-0 transition-transform active:scale-95"
                      >
                        Apply
                      </button>
                    </div>
                  ))
              )}
            </div>

            <button
              type="button"
              onClick={() => setShowOffersModal(false)}
              className="w-full mt-4 py-2.5 bg-[#030810] border border-[#D4AF37]/30 text-[#EED9C4]/80 hover:text-white font-serif-royal text-xs uppercase rounded-xs"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
