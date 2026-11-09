import { Product, SizeOption, SpecialOffer, CartItem } from '../types';
import { getProductSizeInventory } from '../data/perfumes';

export interface ProductDiscountResult {
  originalPrice: number;
  discountedPrice: number;
  discountAmount: number;
  discountPercent: number;
  discountBadge: string;
  hasDiscount: boolean;
  appliedOffer?: SpecialOffer;
}

/**
 * Checks if an offer is currently active by status and date range
 */
export function isOfferActive(offer: SpecialOffer): boolean {
  if (!offer.isActive) return false;
  const now = new Date();
  const todayStr = now.toISOString().split('T')[0];

  if (offer.startDate && offer.startDate > todayStr) return false;
  if (offer.endDate && offer.endDate < todayStr) return false;

  return true;
}

/**
 * Checks if a specific offer targets this product (storewide, category, or specific product ID)
 */
export function doesOfferApplyToProduct(offer: SpecialOffer, product: Product): boolean {
  if (!isOfferActive(offer)) return false;

  // If targeted to specific products
  if (offer.targetType === 'product') {
    if (!offer.targetProductIds || offer.targetProductIds.length === 0) return false;
    return offer.targetProductIds.includes(product.id);
  }

  // If targeted to category
  if (offer.targetType === 'category') {
    if (!offer.targetCategoryId || offer.targetCategoryId === 'all') return true;
    return offer.targetCategoryId === product.category;
  }

  // If storewide
  if (offer.targetType === 'storewide') {
    return true;
  }

  // If isAutomatic is true or if it's a general percentage/fixed offer marked without code
  if (offer.isAutomatic) {
    return true;
  }

  return false;
}

/**
 * Calculates the active discount for a product and size
 */
export function calculateProductDiscount(
  product: Product,
  size: SizeOption,
  offers: SpecialOffer[] = [],
  basePriceOverride?: number
): ProductDiscountResult {
  const inv = getProductSizeInventory(product, size);
  const originalPrice = basePriceOverride !== undefined ? basePriceOverride : (inv.price || product.prices[size] || 300);

  if (!offers || offers.length === 0 || originalPrice <= 0) {
    return {
      originalPrice,
      discountedPrice: originalPrice,
      discountAmount: 0,
      discountPercent: 0,
      discountBadge: '',
      hasDiscount: false,
    };
  }

  // Find all active offers that apply to this product
  const applicableOffers = offers.filter((o) => doesOfferApplyToProduct(o, product));

  if (applicableOffers.length === 0) {
    return {
      originalPrice,
      discountedPrice: originalPrice,
      discountAmount: 0,
      discountPercent: 0,
      discountBadge: '',
      hasDiscount: false,
    };
  }

  // Find best discount for customer
  let bestOffer: SpecialOffer | undefined;
  let maxDiscountAmt = 0;

  for (const offer of applicableOffers) {
    let currentDiscount = 0;
    const isPercentage = offer.discountType === 'percentage' || offer.type === 'percentage' || offer.type === 'festival' || offer.type === 'first_order';

    if (isPercentage) {
      currentDiscount = Math.round((originalPrice * offer.discountValue) / 100);
      if (offer.maxDiscountLimit && offer.maxDiscountLimit > 0) {
        currentDiscount = Math.min(currentDiscount, offer.maxDiscountLimit);
      }
    } else {
      currentDiscount = offer.discountValue;
    }

    currentDiscount = Math.min(currentDiscount, originalPrice);

    if (currentDiscount > maxDiscountAmt) {
      maxDiscountAmt = currentDiscount;
      bestOffer = offer;
    }
  }

  if (!bestOffer || maxDiscountAmt <= 0) {
    return {
      originalPrice,
      discountedPrice: originalPrice,
      discountAmount: 0,
      discountPercent: 0,
      discountBadge: '',
      hasDiscount: false,
    };
  }

  const discountedPrice = Math.max(0, originalPrice - maxDiscountAmt);
  const discountPercent = Math.round((maxDiscountAmt / originalPrice) * 100);
  const discountBadge =
    bestOffer.discountType === 'percentage' || bestOffer.type === 'percentage' || bestOffer.type === 'festival' || bestOffer.type === 'first_order'
      ? `${bestOffer.discountValue}% OFF`
      : `৳${maxDiscountAmt} OFF`;

  return {
    originalPrice,
    discountedPrice,
    discountAmount: maxDiscountAmt,
    discountPercent,
    discountBadge,
    hasDiscount: true,
    appliedOffer: bestOffer,
  };
}

/**
 * Calculates cart totals including item discounts and applied promo coupon
 */
export function calculateCartSummary(
  items: CartItem[],
  offers: SpecialOffer[] = [],
  appliedCoupon?: SpecialOffer | null,
  deliveryCharge: number = 10,
  giftPackaging: boolean = false
) {
  let originalSubtotal = 0;
  let discountedSubtotal = 0;

  for (const item of items) {
    const qty = item.quantity || 1;
    const discountInfo = calculateProductDiscount(item.product, item.size, offers);
    originalSubtotal += discountInfo.originalPrice * qty;
    discountedSubtotal += discountInfo.discountedPrice * qty;
  }

  let couponSavings = 0;
  if (appliedCoupon && isOfferActive(appliedCoupon)) {
    if (appliedCoupon.type === 'percentage' || appliedCoupon.discountType === 'percentage') {
      couponSavings = Math.round((discountedSubtotal * appliedCoupon.discountValue) / 100);
      if (appliedCoupon.maxDiscountLimit && appliedCoupon.maxDiscountLimit > 0) {
        couponSavings = Math.min(couponSavings, appliedCoupon.maxDiscountLimit);
      }
    } else {
      couponSavings = appliedCoupon.discountValue;
    }
    couponSavings = Math.min(couponSavings, discountedSubtotal);
  }

  const packagingCharge = giftPackaging ? 25 : 0;
  const totalItemSavings = Math.max(0, originalSubtotal - discountedSubtotal);
  const totalDiscount = totalItemSavings + couponSavings;
  const finalTotal = Math.max(0, discountedSubtotal - couponSavings + deliveryCharge + packagingCharge);

  return {
    originalSubtotal,
    discountedSubtotal,
    itemSavings: totalItemSavings,
    couponSavings,
    totalDiscount,
    deliveryCharge,
    giftPackagingCharge: packagingCharge,
    finalTotal,
  };
}
