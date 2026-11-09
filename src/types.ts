export type SizeOption = '100 ML' | '300 ML' | '500 ML';

export type PaymentMethod = 'bkash' | 'nagad' | 'rocket' | 'cod';

export type PaymentStatus =
  | 'UNPAID'
  | 'PAYMENT VERIFICATION PENDING'
  | 'PAID / VERIFIED'
  | 'PAYMENT REJECTED';

export type OrderStatus =
  | 'Order Placed'
  | 'Order Confirmed'
  | 'Preparing Your Order'
  | 'Out for Delivery'
  | 'Delivered'
  | 'Cancelled'
  | 'Pending'
  | 'Confirmed';

export interface OlfactoryNotes {
  top: string[];
  middle?: string[];
  heart?: string[];
  base: string[];
}

export interface SizeInventory {
  price: number;
  stock: number;
  sku: string;
  isAvailable: boolean;
}

export interface Product {
  id: string;
  name: string;
  subtitle: string;
  category: 'perfume' | 'attar' | 'all';
  description: string;
  image: string;
  prices: Record<SizeOption, number>;
  inStock: boolean;
  rating: number;
  reviewCount: number;
  notes: OlfactoryNotes;
  longevity: string;
  fragranceTypes?: string[];
  origin?: string;
  sizesInventory?: Record<SizeOption, SizeInventory>;
}

export interface CartItem {
  id: string; // unique item id: productId-size
  product: Product;
  size: SizeOption;
  quantity: number;
  pricePerUnit: number;
}

export interface AddressDetails {
  division: string;
  district: string;
  upazila: string;
  area?: string;
  roadVillageHouse: string;
  postalCode: string;
  instructions?: string;
}

export interface StatusUpdateLog {
  status: OrderStatus;
  timestamp: string;
  note?: string;
}

export interface Order {
  id: string;
  customerName: string;
  phone: string;
  address: string;
  addressDetails?: AddressDetails;
  city?: string;
  items: CartItem[];
  subtotal: number;
  deliveryCharge: number;
  giftPackaging?: boolean;
  giftPackagingCharge?: number;
  appliedOfferCode?: string;
  discountAmount?: number;
  total: number;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  senderNumber: string;
  transactionId: string;
  screenshotNote?: string;
  status: OrderStatus;
  customDeliveryDate?: string;
  deliveryNotes?: string;
  statusHistory?: StatusUpdateLog[];
  createdAt: string;
}

export interface AdminNotification {
  id: string;
  type: 'new_order' | 'payment_submitted' | 'continued_unpaid' | 'payment_verified' | 'payment_rejected';
  orderId: string;
  customerName: string;
  amount: number;
  message: string;
  timestamp: string;
  isRead: boolean;
}

export interface CustomerNotification {
  id: string;
  orderId: string;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
}

export type OfferType = 'percentage' | 'fixed' | 'first_order' | 'bundle' | 'festival';
export type OfferTargetType = 'storewide' | 'category' | 'product';

export interface SpecialOffer {
  id: string;
  code: string;
  title: string;
  description: string;
  type: OfferType;
  discountType?: 'percentage' | 'fixed';
  discountValue: number; // percentage (e.g. 10) or fixed amount in BDT (e.g. 100)
  targetType?: OfferTargetType; // storewide, category, or specific product
  targetCategoryId?: 'all' | 'perfume' | 'attar';
  targetProductIds?: string[]; // IDs of specific products targeted
  isAutomatic?: boolean; // if true, directly applied to products/cart without typing coupon code
  minPurchaseAmount?: number;
  maxDiscountLimit?: number;
  minQuantity?: number; // for bundle offers (e.g. 2 or more products)
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD
  isActive: boolean;
  usageCount: number;
}

export interface StoreSettings {
  paymentNumbers: {
    bkash: string;
    nagad: string;
    rocket: string;
  };
  deliveryChargeBelow250: number;
  deliveryCharge250AndAbove: number;
  whatsappNumber?: string;
  whatsappDefaultMessage?: string;
}

// Backward-compatible aliases and supporting types
export type Perfume = Product;
export type VolumeOption = SizeOption;
export type FragranceCategory = 'all' | 'perfume' | 'attar' | 'men' | 'women' | 'unisex';

export interface Review {
  id: string;
  author: string;
  location: string;
  rating: number;
  title: string;
  comment: string;
  date: string;
  verified: boolean;
  perfumeId: string;
  perfumeName: string;
}

export type OrderDetails = Order;

export type AddressLabel = 'Home' | 'Office' | 'Other';

export interface SavedAddress {
  id: string;
  customerId: string;
  label: AddressLabel;
  customLabel?: string;
  fullName: string;
  phone: string;
  division: string;
  district: string;
  upazila: string;
  area?: string;
  roadVillageHouse: string;
  postalCode: string;
  instructions?: string;
  isDefault?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CustomerAccount {
  id: string;
  name: string;
  phone: string;
  email?: string;
  isLoggedIn: boolean;
}

// ==========================================
// CYBERSECURITY, WAF & MONITORING TYPES
// ==========================================

export type ThreatSeverity = 'info' | 'warning' | 'critical';

export type ThreatCategory =
  | 'SQL_INJECTION'
  | 'XSS_ATTACK'
  | 'PATH_TRAVERSAL'
  | 'BRUTE_FORCE_LOGIN'
  | 'ACCOUNT_LOCKOUT'
  | 'SUSPICIOUS_PAYLOAD'
  | 'RATE_LIMIT_EXCEEDED'
  | 'MALICIOUS_FILE_BLOCKED'
  | 'ADMIN_LOGIN'
  | 'ADMIN_LOGOUT'
  | 'SECURITY_SCAN'
  | 'BACKUP_CREATED'
  | 'BACKUP_RESTORED'
  | 'CSRF_BLOCKED'
  | 'SYSTEM_AUDIT';

export interface SecurityThreatLog {
  id: string;
  timestamp: string;
  ip: string;
  category: ThreatCategory;
  severity: ThreatSeverity;
  endpoint: string;
  details: string;
  actionTaken: 'BLOCKED' | 'LOGGED' | 'CHALLENGED' | 'AUTHENTICATED';
  userAgent?: string;
}

export interface SecurityStats {
  wafStatus: 'ACTIVE' | 'LEARNING' | 'DISABLED';
  securityScore: number;
  totalRequestsInspected: number;
  blockedAttacksCount: number;
  activeSessionsCount: number;
  lockedIpsCount: number;
  failedLoginAttempts: number;
  mfaEnabled: boolean;
  cspEnabled: boolean;
  hstsEnabled: boolean;
  pbkdf2Enabled: boolean;
  rateLimiterActive: boolean;
  lastMalwareScanTime: string;
  lastBackupTime: string;
}

export interface MalwareScanFinding {
  file: string;
  type: 'MAGIC_BYTE_MISMATCH' | 'SUSPICIOUS_SCRIPT' | 'OVERSIZED_PAYLOAD' | 'SAFE';
  message: string;
  severity: 'info' | 'warning' | 'danger';
}

export interface MalwareScanReport {
  timestamp: string;
  status: 'CLEAN' | 'WARNING' | 'CRITICAL';
  filesScanned: number;
  threatsFound: number;
  findings: MalwareScanFinding[];
  configurationChecks: Array<{
    check: string;
    passed: boolean;
    recommendation?: string;
  }>;
}

export interface BackupSnapshotMeta {
  id: string;
  filename: string;
  timestamp: string;
  sizeBytes: number;
  itemCounts: {
    products: number;
    orders: number;
    settings: boolean;
    offers: number;
  };
  checksumSha256: string;
  status: 'VERIFIED' | 'TAMPERED';
}

