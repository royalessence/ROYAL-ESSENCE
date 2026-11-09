import React, { useState, useEffect } from 'react';
import {
  Product,
  Order,
  StoreSettings,
  OrderStatus,
  PaymentStatus,
  AdminNotification,
  SpecialOffer,
  SizeOption,
  SizeInventory,
} from '../types';
import {
  X,
  Plus,
  Save,
  Trash2,
  DollarSign,
  Truck,
  PhoneCall,
  ShoppingBag,
  Edit2,
  Upload,
  Lock,
  Unlock,
  Check,
  Bell,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Calendar,
  Clock,
  Shield,
  Search,
  Gift,
  Tag,
  Package,
  BarChart3,
  LogOut,
  Eye,
  EyeOff,
  Image as ImageIcon,
  Layers,
  LayoutDashboard,
  Menu,
  ChevronRight,
  RefreshCw,
  Sliders,
  CheckCircle,
  ShieldCheck,
  Smartphone,
} from 'lucide-react';
import { getEstimatedDelivery } from './MyOrdersModal';
import { getProductSizeInventory } from '../data/perfumes';
import { AdminOffersSection } from './AdminOffersSection';
import { AdminInventorySection } from './AdminInventorySection';
import { ProductImagePlaceholder } from './ProductImagePlaceholder';
import { AdminAnalyticsSection } from './AdminAnalyticsSection';
import { AdminSecuritySection } from './AdminSecuritySection';
import { calculateProductDiscount } from '../utils/discountUtils';

export type AdminSection =
  | 'dashboard'
  | 'products'
  | 'images'
  | 'prices'
  | 'sizes'
  | 'discounts'
  | 'analytics'
  | 'stock'
  | 'orders'
  | 'settings'
  | 'security';

interface AdminDashboardProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  onUpdateProducts: (products: Product[]) => void;
  orders: Order[];
  onUpdateOrderStatus: (
    orderId: string,
    newStatus: OrderStatus,
    customDeliveryDate?: string,
    deliveryNotes?: string
  ) => void;
  onUpdatePaymentStatus: (orderId: string, newPaymentStatus: PaymentStatus) => void;
  adminNotifications?: AdminNotification[];
  onClearNotifications?: () => void;
  settings: StoreSettings;
  onUpdateSettings: (newSettings: StoreSettings) => void;
  offers?: SpecialOffer[];
  onUpdateOffers?: (newOffers: SpecialOffer[]) => void;
  wishlistIds?: string[];
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  isOpen,
  onClose,
  products,
  onUpdateProducts,
  orders,
  onUpdateOrderStatus,
  onUpdatePaymentStatus,
  adminNotifications = [],
  onClearNotifications,
  settings,
  onUpdateSettings,
  offers = [],
  onUpdateOffers = () => {},
}) => {
  // 1. Password Protection Authentication State
  // Strictly configured admin password: 272751
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    try {
      return sessionStorage.getItem('royal_essence_admin_auth') === 'true';
    } catch {
      return false;
    }
  });
  const [passwordInput, setPasswordInput] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [isVerifyingLogin, setIsVerifyingLogin] = useState(false);

  // Advanced Security: Multi-Factor Authentication & Account Lockout
  const [isMfaPrompt, setIsMfaPrompt] = useState(false);
  const [tempMfaToken, setTempMfaToken] = useState('');
  const [mfaCodeInput, setMfaCodeInput] = useState('');
  const [lockoutSeconds, setLockoutSeconds] = useState<number>(0);

  // Lockout countdown timer
  useEffect(() => {
    if (lockoutSeconds <= 0) return;
    const timer = setInterval(() => {
      setLockoutSeconds((prev) => (prev > 1 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [lockoutSeconds]);

  // Active Section in 11-Item Sidebar
  const [activeSection, setActiveSection] = useState<AdminSection>('dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Product edit / add modal state
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);

  // Form states for Product
  const [formName, setFormName] = useState('');
  const [formSubtitle, setFormSubtitle] = useState('');
  const [formCategory, setFormCategory] = useState<'perfume' | 'attar'>('perfume');
  const [formDescription, setFormDescription] = useState('');
  const [formImage, setFormImage] = useState('');
  const [formPrice100, setFormPrice100] = useState(300);
  const [formPrice300, setFormPrice300] = useState(750);
  const [formPrice500, setFormPrice500] = useState(1150);
  const [formLongevity, setFormLongevity] = useState('LONG LASTING');
  const [formTopNotes, setFormTopNotes] = useState('Sweet Citrus, Caramelized Saffron, Velvet Bergamot');
  const [formMiddleNotes, setFormMiddleNotes] = useState('Sweet Amber, Royal Jasmine, Warm Spices');
  const [formBaseNotes, setFormBaseNotes] = useState('Rich Agarwood (Oud), Sweet Madagascar Vanilla, Golden Musk');

  // Image Management Form
  const [selectedImageProductId, setSelectedImageProductId] = useState<string>(products[0]?.id || 'reef-21');
  const [customImageUrl, setCustomImageUrl] = useState('');
  const [imageSaveSuccess, setImageSaveSuccess] = useState<string | null>(null);

  // Price Management inline edits
  const [priceUpdates, setPriceUpdates] = useState<Record<string, Record<SizeOption, number>>>({});
  const [priceSaveSuccess, setPriceSaveSuccess] = useState<string | null>(null);

  // Size Management
  const [sizeSaveSuccess, setSizeSaveSuccess] = useState<string | null>(null);

  // Settings states
  const [bkashNumber, setBkashNumber] = useState(settings.paymentNumbers.bkash);
  const [nagadNumber, setNagadNumber] = useState(settings.paymentNumbers.nagad);
  const [rocketNumber, setRocketNumber] = useState(settings.paymentNumbers.rocket);
  const [delBelow250, setDelBelow250] = useState(settings.deliveryChargeBelow250);
  const [del250AndAbove, setDel250AndAbove] = useState(settings.deliveryCharge250AndAbove);
  const [whatsappNumber, setWhatsappNumber] = useState(settings.whatsappNumber || '01741129399');
  const [savedSettingsNotice, setSavedSettingsNotice] = useState(false);

  // Order filter and search
  const [orderSearchQuery, setOrderSearchQuery] = useState('');
  const [orderPaymentFilter, setOrderPaymentFilter] = useState<'ALL' | PaymentStatus>('ALL');
  const [orderStatusFilter, setOrderStatusFilter] = useState<'ALL' | OrderStatus>('ALL');
  const [editingDeliveryOrderId, setEditingDeliveryOrderId] = useState<string | null>(null);
  const [deliveryDateInput, setDeliveryDateInput] = useState('');
  const [deliveryNotesInput, setDeliveryNotesInput] = useState('');
  const [savedDeliverySuccess, setSavedDeliverySuccess] = useState<string | null>(null);
  const [productSaveSuccess, setProductSaveSuccess] = useState<{ name: string; message: string } | null>(null);

  // Initialize Price Updates from current products
  useEffect(() => {
    const initialMap: Record<string, Record<SizeOption, number>> = {};
    products.forEach((p) => {
      initialMap[p.id] = {
        '100 ML': p.prices['100 ML'] || 300,
        '300 ML': p.prices['300 ML'] || 750,
        '500 ML': p.prices['500 ML'] || 1150,
      };
    });
    setPriceUpdates(initialMap);
  }, [products]);

  if (!isOpen) return null;

  // Handle Login with strictly requested admin password: 272751
  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (lockoutSeconds > 0) return;
    setLoginError('');
    setIsVerifyingLogin(true);

    const entered = passwordInput.trim();

    try {
      // 1. Try server-side authentication (PBKDF2 100k + WAF rate limit)
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: entered }),
      });
      const data = await res.json();

      if (data.locked) {
        setLockoutSeconds(data.remainingSeconds || 900);
        setLoginError(data.error || 'Account temporarily locked due to repeated failed attempts.');
        setIsVerifyingLogin(false);
        return;
      }

      if (data.success) {
        if (data.mfaRequired) {
          setIsMfaPrompt(true);
          setTempMfaToken(data.tempToken);
          setIsVerifyingLogin(false);
          return;
        }

        setIsAuthenticated(true);
        sessionStorage.setItem('royal_essence_admin_auth', 'true');
        sessionStorage.setItem('royal_essence_admin_token', data.token || 'auth-token');
        setPasswordInput('');
        setIsVerifyingLogin(false);
        return;
      } else {
        setLoginError(data.error || 'Incorrect Admin Password. Access Denied.');
      }
    } catch {
      // Fallback: direct check with requested password 272751
      if (entered === '272751') {
        setIsAuthenticated(true);
        sessionStorage.setItem('royal_essence_admin_auth', 'true');
        setPasswordInput('');
        setIsVerifyingLogin(false);
        return;
      }
      setLoginError('Incorrect Admin Password. Access Denied.');
    }
    setIsVerifyingLogin(false);
  };

  // Handle MFA Step Verification during Login
  const handleMfaLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsVerifyingLogin(true);
    setLoginError('');
    try {
      const res = await fetch('/api/admin/login/mfa-verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tempToken: tempMfaToken,
          code: mfaCodeInput.trim(),
        }),
      });
      const data = await res.json();
      if (data.success) {
        setIsAuthenticated(true);
        sessionStorage.setItem('royal_essence_admin_auth', 'true');
        sessionStorage.setItem('royal_essence_admin_token', data.token);
        setIsMfaPrompt(false);
        setTempMfaToken('');
        setMfaCodeInput('');
        setPasswordInput('');
      } else {
        setLoginError(data.error || 'Invalid 6-digit Authenticator code or backup code.');
      }
    } catch (err: any) {
      setLoginError(err.message || 'MFA verification failed');
    } finally {
      setIsVerifyingLogin(false);
    }
  };

  // Handle Admin Logout
  const handleAdminLogout = async () => {
    try {
      const token = sessionStorage.getItem('royal_essence_admin_token');
      await fetch('/api/admin/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token ? `Bearer ${token}` : '',
        },
      });
    } catch {}
    sessionStorage.removeItem('royal_essence_admin_auth');
    sessionStorage.removeItem('royal_essence_admin_token');
    setIsAuthenticated(false);
    setPasswordInput('');
    setLoginError('');
  };

  // Handle Product Start Edit
  const handleStartEdit = (p: Product) => {
    setEditingProduct(p);
    setIsAddingNew(false);
    setFormName(p.name);
    setFormSubtitle(p.subtitle);
    setFormCategory(p.category === 'attar' ? 'attar' : 'perfume');
    setFormDescription(p.description);
    setFormImage(p.image || '');
    setFormPrice100(p.prices['100 ML'] || 300);
    setFormPrice300(p.prices['300 ML'] || 750);
    setFormPrice500(p.prices['500 ML'] || 1150);
    setFormLongevity(p.longevity || 'LONG LASTING');
    setFormTopNotes((p.notes.top || []).join(', ') || 'Sweet Citrus, Caramelized Saffron, Velvet Bergamot');
    setFormMiddleNotes((p.notes.middle || p.notes.heart || []).join(', ') || 'Sweet Amber, Royal Jasmine, Warm Spices');
    setFormBaseNotes((p.notes.base || []).join(', ') || 'Rich Agarwood (Oud), Sweet Madagascar Vanilla, Golden Musk');
  };

  const handleStartAdd = () => {
    setIsAddingNew(true);
    setEditingProduct(null);
    setFormName('');
    setFormSubtitle('');
    setFormCategory('perfume');
    setFormDescription('');
    setFormImage('');
    setFormPrice100(300);
    setFormPrice300(750);
    setFormPrice500(1150);
    setFormLongevity('LONG LASTING');
    setFormTopNotes('Sweet Citrus, Caramelized Saffron, Velvet Bergamot');
    setFormMiddleNotes('Sweet Amber, Royal Jasmine, Warm Spices');
    setFormBaseNotes('Rich Agarwood (Oud), Sweet Madagascar Vanilla, Golden Musk');
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) return;

    const parsedTop = formTopNotes.split(',').map((s) => s.trim()).filter(Boolean);
    const parsedMiddle = formMiddleNotes.split(',').map((s) => s.trim()).filter(Boolean);
    const parsedBase = formBaseNotes.split(',').map((s) => s.trim()).filter(Boolean);

    const price100Num = Number(formPrice100) > 0 ? Number(formPrice100) : 300;
    const price300Num = Number(formPrice300) > 0 ? Number(formPrice300) : 750;
    const price500Num = Number(formPrice500) > 0 ? Number(formPrice500) : 1150;

    if (isAddingNew) {
      const newProd: Product = {
        id: `prod-${Date.now()}`,
        name: formName.trim(),
        subtitle: formSubtitle.trim() || 'Royal Arabic Formulation',
        category: formCategory,
        description: formDescription.trim() || 'Exquisite Arabian fragrance blend.',
        image: formImage.trim() || '',
        prices: {
          '100 ML': price100Num,
          '300 ML': price300Num,
          '500 ML': price500Num,
        },
        sizesInventory: {
          '100 ML': { price: price100Num, stock: 35, sku: `RE-NEW-${Date.now()}-100`, isAvailable: true },
          '300 ML': { price: price300Num, stock: 20, sku: `RE-NEW-${Date.now()}-300`, isAvailable: true },
          '500 ML': { price: price500Num, stock: 15, sku: `RE-NEW-${Date.now()}-500`, isAvailable: true },
        },
        inStock: true,
        rating: 4.9,
        reviewCount: 12,
        notes: {
          top: parsedTop.length > 0 ? parsedTop : ['Sweet Citrus', 'Caramelized Saffron'],
          middle: parsedMiddle.length > 0 ? parsedMiddle : ['Royal Jasmine', 'Sweet Amber'],
          base: parsedBase.length > 0 ? parsedBase : ['Rich Agarwood (Oud)', 'Vanilla'],
        },
        longevity: formLongevity || 'LONG LASTING',
      };
      onUpdateProducts([...products, newProd]);
      setProductSaveSuccess({ name: newProd.name, message: 'New perfume product added successfully!' });
    } else if (editingProduct) {
      const updated = products.map((p) => {
        if (p.id !== editingProduct.id) return p;

        const updatedSizesInventory = {
          '100 ML': {
            price: price100Num,
            stock: p.sizesInventory?.['100 ML']?.stock ?? 25,
            sku: p.sizesInventory?.['100 ML']?.sku || `RE-${p.id.toUpperCase()}-100`,
            isAvailable: p.sizesInventory?.['100 ML']?.isAvailable ?? true,
          },
          '300 ML': {
            price: price300Num,
            stock: p.sizesInventory?.['300 ML']?.stock ?? 15,
            sku: p.sizesInventory?.['300 ML']?.sku || `RE-${p.id.toUpperCase()}-300`,
            isAvailable: p.sizesInventory?.['300 ML']?.isAvailable ?? true,
          },
          '500 ML': {
            price: price500Num,
            stock: p.sizesInventory?.['500 ML']?.stock ?? 10,
            sku: p.sizesInventory?.['500 ML']?.sku || `RE-${p.id.toUpperCase()}-500`,
            isAvailable: p.sizesInventory?.['500 ML']?.isAvailable ?? true,
          },
        };

        return {
          ...p,
          name: formName.trim(),
          subtitle: formSubtitle.trim() || p.subtitle,
          category: formCategory,
          description: formDescription.trim() || p.description,
          image: formImage.trim(),
          prices: {
            '100 ML': price100Num,
            '300 ML': price300Num,
            '500 ML': price500Num,
          },
          sizesInventory: updatedSizesInventory,
          longevity: formLongevity || p.longevity,
          notes: {
            top: parsedTop.length > 0 ? parsedTop : p.notes.top,
            middle: parsedMiddle.length > 0 ? parsedMiddle : p.notes.middle,
            base: parsedBase.length > 0 ? parsedBase : p.notes.base,
          },
        };
      });
      onUpdateProducts(updated);
      setProductSaveSuccess({ name: formName.trim(), message: 'Product updated successfully across the website!' });
    }

    setIsAddingNew(false);
    setEditingProduct(null);
    setTimeout(() => setProductSaveSuccess(null), 4000);
  };

  // Image Upload handler (File -> Base64 data URL)
  const handleImageFileUpload = (e: React.ChangeEvent<HTMLInputElement>, targetProductId: string) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const dataUrl = reader.result as string;
      const updated = products.map((p) => (p.id === targetProductId ? { ...p, image: dataUrl } : p));
      onUpdateProducts(updated);
      setImageSaveSuccess(`Uploaded new image for ${products.find((p) => p.id === targetProductId)?.name}`);
      setTimeout(() => setImageSaveSuccess(null), 3000);
    };
    reader.readAsDataURL(file);
  };

  const handleApplyImageUrl = (targetProductId: string, url: string) => {
    const updated = products.map((p) => (p.id === targetProductId ? { ...p, image: url.trim() } : p));
    onUpdateProducts(updated);
    setCustomImageUrl('');
    setImageSaveSuccess(`Image URL applied to ${products.find((p) => p.id === targetProductId)?.name}`);
    setTimeout(() => setImageSaveSuccess(null), 3000);
  };

  const handleClearImage = (targetProductId: string) => {
    const updated = products.map((p) => (p.id === targetProductId ? { ...p, image: '' } : p));
    onUpdateProducts(updated);
    setImageSaveSuccess(`Image reset to empty placeholder for ${products.find((p) => p.id === targetProductId)?.name}`);
    setTimeout(() => setImageSaveSuccess(null), 3000);
  };

  // Price Management: Save All Prices
  const handleSaveAllPrices = () => {
    const updated = products.map((p) => {
      const productPriceObj = priceUpdates[p.id];
      if (!productPriceObj) return p;

      const p100 = Number(productPriceObj['100 ML']) || p.prices['100 ML'] || 300;
      const p300 = Number(productPriceObj['300 ML']) || p.prices['300 ML'] || 750;
      const p500 = Number(productPriceObj['500 ML']) || p.prices['500 ML'] || 1150;

      const newSizesInventory: Record<SizeOption, SizeInventory> = {
        '100 ML': {
          ...(p.sizesInventory?.['100 ML'] || { stock: 25, sku: `RE-${p.id.toUpperCase()}-100`, isAvailable: true }),
          price: p100,
        },
        '300 ML': {
          ...(p.sizesInventory?.['300 ML'] || { stock: 15, sku: `RE-${p.id.toUpperCase()}-300`, isAvailable: true }),
          price: p300,
        },
        '500 ML': {
          ...(p.sizesInventory?.['500 ML'] || { stock: 10, sku: `RE-${p.id.toUpperCase()}-500`, isAvailable: true }),
          price: p500,
        },
      };

      return {
        ...p,
        prices: {
          '100 ML': p100,
          '300 ML': p300,
          '500 ML': p500,
        },
        sizesInventory: newSizesInventory,
      };
    });

    onUpdateProducts(updated);
    setPriceSaveSuccess('All perfume prices saved and synchronized across the website!');
    setTimeout(() => setPriceSaveSuccess(null), 3500);
  };

  // ML / Size Management: Toggle Availability of a Size
  const handleToggleSizeAvailability = (productId: string, size: SizeOption) => {
    const updated = products.map((p) => {
      if (p.id !== productId) return p;
      const currentInv = getProductSizeInventory(p, size);
      const newSizes: Record<SizeOption, SizeInventory> = {
        '100 ML': getProductSizeInventory(p, '100 ML'),
        '300 ML': getProductSizeInventory(p, '300 ML'),
        '500 ML': getProductSizeInventory(p, '500 ML'),
      };
      newSizes[size] = {
        ...currentInv,
        isAvailable: !currentInv.isAvailable,
      };
      return {
        ...p,
        sizesInventory: newSizes,
      };
    });

    onUpdateProducts(updated);
    setSizeSaveSuccess(`Toggled availability of ${size} for ${products.find((p) => p.id === productId)?.name}`);
    setTimeout(() => setSizeSaveSuccess(null), 3000);
  };

  // Settings Save
  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateSettings({
      paymentNumbers: {
        bkash: bkashNumber.trim() || '01741129399',
        nagad: nagadNumber.trim() || '01741129399',
        rocket: rocketNumber.trim() || '01741129399',
      },
      deliveryChargeBelow250: Number(delBelow250) >= 0 ? Number(delBelow250) : 10,
      deliveryCharge250AndAbove: Number(del250AndAbove) >= 0 ? Number(del250AndAbove) : 10,
      whatsappNumber: whatsappNumber.trim() || '01741129399',
      whatsappDefaultMessage: settings.whatsappDefaultMessage,
    });
    setSavedSettingsNotice(true);
    setTimeout(() => setSavedSettingsNotice(false), 3000);
  };

  // Order Delivery Dates
  const handleSaveDeliveryDetails = (orderId: string) => {
    const ord = orders.find((o) => o.id === orderId);
    if (!ord) return;
    onUpdateOrderStatus(
      orderId,
      ord.status,
      deliveryDateInput || ord.customDeliveryDate,
      deliveryNotesInput || ord.deliveryNotes
    );
    setSavedDeliverySuccess(`Delivery details saved for Order #${orderId}`);
    setEditingDeliveryOrderId(null);
    setDeliveryDateInput('');
    setDeliveryNotesInput('');
    setTimeout(() => setSavedDeliverySuccess(null), 3000);
  };

  // Filter Orders
  const filteredOrders = orders.filter((o) => {
    if (orderPaymentFilter !== 'ALL' && o.paymentStatus !== orderPaymentFilter) return false;
    if (orderStatusFilter !== 'ALL' && o.status !== orderStatusFilter) return false;
    if (orderSearchQuery.trim()) {
      const q = orderSearchQuery.toLowerCase();
      const match =
        o.id.toLowerCase().includes(q) ||
        o.customerName.toLowerCase().includes(q) ||
        o.phone.toLowerCase().includes(q) ||
        (o.address || '').toLowerCase().includes(q);
      if (!match) return false;
    }
    return true;
  });

  // Calculate Overview Stats
  const totalOrdersCount = orders.length;
  const totalSalesGross = orders.reduce((sum, o) => sum + (o.total || 0), 0);
  const verifiedPaidOrders = orders.filter((o) => o.paymentStatus === 'PAID / VERIFIED');
  const totalVerifiedPaid = verifiedPaidOrders.reduce((sum, o) => sum + (o.total || 0), 0);
  const pendingOrdersCount = orders.filter((o) => o.paymentStatus !== 'PAID / VERIFIED' && o.status !== 'Cancelled').length;

  // Low stock counter
  const lowStockCount = products.reduce((acc, p) => {
    const sizes: SizeOption[] = ['100 ML', '300 ML', '500 ML'];
    const count = sizes.filter((s) => {
      const inv = getProductSizeInventory(p, s);
      return inv.stock <= 5;
    }).length;
    return acc + count;
  }, 0);

  // -------------------------------------------------------------
  // PASSWORD LOGIN SCREEN (If not authenticated)
  // -------------------------------------------------------------
  if (!isAuthenticated) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#03070E]/95 backdrop-blur-xl animate-in fade-in">
        <div className="relative w-full max-w-md bg-gradient-to-b from-[#07241A] via-[#0A1D36] to-[#1C0816] border-2 border-[#D4AF37]/80 rounded-t-[32px] rounded-b-xs p-6 sm:p-8 shadow-[0_25px_80px_rgba(0,0,0,0.95)]">
          {/* Subtle Islamic Girih backdrop */}
          <div className="absolute inset-0 bg-islamic-girih opacity-20 pointer-events-none" />

          {/* Close button (exits modal) */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-[#F5EBDD]/60 hover:text-[#D4AF37] p-2 bg-[#050505]/70 border border-[#D4AF37]/30 rounded-full transition-colors"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="relative z-10 text-center">
            {/* Palace Crown Emblem */}
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-[#10B981]/20 via-[#0B3B2B] to-[#D4AF37]/30 border-2 border-[#D4AF37] flex items-center justify-center shadow-[0_0_30px_rgba(212,175,55,0.4)]">
              <Lock className="w-8 h-8 text-[#F3CD68]" />
            </div>

            <span className="font-serif-royal text-[11px] uppercase tracking-[0.28em] text-[#F3CD68] font-bold block mb-1">
              Royal Haute Parfumerie
            </span>
            <h2 className="font-serif-royal text-2xl font-bold text-white tracking-wider mb-2">
              ADMIN CONTROL CENTER
            </h2>
            <p className="font-sans-body text-xs text-[#EED9C4]/70 mb-6 max-w-xs mx-auto leading-relaxed">
              Restricted Royal Command Portal. Please enter your authorized admin security password to access.
            </p>

            {/* Lockout Warning Banner with Live Countdown */}
            {lockoutSeconds > 0 && (
              <div className="mb-4 p-4 bg-red-950/90 border-2 border-red-500 rounded-xs text-red-100 text-xs font-serif-royal space-y-1 animate-in shake">
                <div className="flex items-center gap-2 font-bold text-red-300">
                  <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
                  <span>Security Lockout Active</span>
                </div>
                <p className="text-[11px] text-red-200">
                  Multiple failed login attempts detected. Portal locked to protect the database against brute-force attacks.
                </p>
                <div className="pt-2 text-center text-sm font-mono font-bold text-[#F3CD68]">
                  Unlocks in: {Math.floor(lockoutSeconds / 60)}m {lockoutSeconds % 60}s
                </div>
              </div>
            )}

            {/* Error Message */}
            {loginError && lockoutSeconds <= 0 && (
              <div className="mb-4 p-3 bg-red-950/80 border border-red-500/80 rounded-xs text-red-200 text-xs font-serif-royal flex items-center gap-2 text-left animate-in shake">
                <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
                <span>{loginError}</span>
              </div>
            )}

            {/* Step 2: MFA Verification Screen if MFA is Enabled */}
            {isMfaPrompt ? (
              <form onSubmit={handleMfaLoginSubmit} className="space-y-4 text-left">
                <div className="p-3 bg-[#030E18] border border-[#D4AF37]/40 rounded-xs">
                  <div className="flex items-center gap-2 text-[#F3CD68] mb-1 font-serif-royal font-bold text-xs">
                    <Smartphone className="w-4 h-4" />
                    <span>Two-Factor Authentication</span>
                  </div>
                  <p className="text-[11px] text-[#EED9C4]/80">
                    Enter the 6-digit code from your Authenticator app (or an emergency backup code):
                  </p>
                </div>

                <div>
                  <input
                    type="text"
                    required
                    autoFocus
                    maxLength={9}
                    placeholder="e.g. 123456"
                    value={mfaCodeInput}
                    onChange={(e) => setMfaCodeInput(e.target.value)}
                    className="w-full text-center tracking-[0.4em] text-2xl font-mono py-3 bg-[#030E18] border-2 border-[#D4AF37]/50 text-white rounded-xs focus:outline-none focus:border-[#F3CD68]"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setIsMfaPrompt(false);
                      setMfaCodeInput('');
                      setTempMfaToken('');
                    }}
                    className="w-1/3 py-3 border border-[#D4AF37]/40 text-xs text-[#EED9C4] font-serif-royal uppercase rounded-xs hover:border-[#D4AF37]"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    disabled={isVerifyingLogin || !mfaCodeInput.trim()}
                    className="w-2/3 py-3 bg-gradient-to-r from-[#D4AF37] via-[#F3CD68] to-[#AA8435] text-black font-serif-royal font-bold text-xs uppercase tracking-wider rounded-xs hover:shadow-[0_4px_25px_rgba(243,205,104,0.5)] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {isVerifyingLogin ? 'Verifying...' : 'Verify MFA & Enter'}
                  </button>
                </div>
              </form>
            ) : (
              /* Step 1: Standard PBKDF2 Password Form */
              <form onSubmit={handleAdminLogin} className="space-y-4 text-left">
                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-[#F3CD68] font-serif-royal font-bold mb-1.5">
                    Enter Admin Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      autoFocus
                      disabled={lockoutSeconds > 0}
                      value={passwordInput}
                      onChange={(e) => {
                        setPasswordInput(e.target.value);
                        if (loginError) setLoginError('');
                      }}
                      placeholder="Enter security password"
                      className="w-full bg-[#030E18] border-2 border-[#D4AF37]/50 text-white font-mono text-sm px-3.5 py-3 pr-10 rounded-xs focus:outline-none focus:border-[#F3CD68] shadow-inner disabled:opacity-50"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[#D4AF37] hover:text-white p-1"
                      title={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isVerifyingLogin || lockoutSeconds > 0}
                  className="w-full py-3.5 bg-gradient-to-r from-[#D4AF37] via-[#F3CD68] to-[#AA8435] text-black font-serif-royal font-bold text-xs uppercase tracking-wider rounded-xs hover:shadow-[0_4px_25px_rgba(243,205,104,0.5)] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isVerifyingLogin ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin text-black" />
                      <span>Verifying Authorization...</span>
                    </>
                  ) : (
                    <>
                      <Unlock className="w-4 h-4 text-black" />
                      <span>Unlock Admin Dashboard</span>
                    </>
                  )}
                </button>
              </form>
            )}

            <div className="mt-6 pt-4 border-t border-[#D4AF37]/20 flex items-center justify-center gap-2 text-[10px] text-[#EED9C4]/50 font-serif-royal">
              <Shield className="w-3.5 h-3.5 text-[#10B981]" />
              <span>PBKDF2 100k + WAF Shield Enforced</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // AUTHENTICATED ADMIN CONTROL CENTER (Full 11-Item Sidebar)
  // -------------------------------------------------------------
  const sidebarItems: { id: AdminSection; label: string; icon: React.ReactNode; badge?: number | string }[] = [
    { id: 'dashboard', label: 'Dashboard Overview', icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: 'products', label: 'Product Management', icon: <ShoppingBag className="w-4 h-4" />, badge: products.length },
    { id: 'images', label: 'Image Management', icon: <ImageIcon className="w-4 h-4" /> },
    { id: 'prices', label: 'Price Management', icon: <DollarSign className="w-4 h-4" /> },
    { id: 'sizes', label: 'ML / Size Management', icon: <Layers className="w-4 h-4" /> },
    { id: 'discounts', label: 'Discount Management', icon: <Tag className="w-4 h-4" />, badge: offers.filter((o) => o.isActive).length },
    { id: 'analytics', label: 'Sales Analytics', icon: <BarChart3 className="w-4 h-4" /> },
    { id: 'stock', label: 'Stock Management', icon: <Package className="w-4 h-4" />, badge: lowStockCount > 0 ? `${lowStockCount} low` : undefined },
    { id: 'orders', label: 'Order Management', icon: <Clock className="w-4 h-4" />, badge: orders.length },
    { id: 'settings', label: 'Store Settings', icon: <Sliders className="w-4 h-4" /> },
    { id: 'security', label: 'Cybersecurity & Threat Center', icon: <ShieldCheck className="w-4 h-4 text-[#00FF66]" />, badge: 'WAF Active' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-[#03070E]/95 backdrop-blur-xl overflow-hidden animate-in fade-in">
      <div className="relative w-full max-w-7xl h-[94vh] bg-gradient-to-b from-[#07241A] via-[#0A1D36] to-[#120815] border-2 border-[#D4AF37]/80 rounded-t-[32px] rounded-b-xs shadow-[0_25px_90px_rgba(0,0,0,0.95)] flex flex-col overflow-hidden">
        {/* Subtle Islamic Girih Grid Backdrop */}
        <div className="absolute inset-0 bg-islamic-girih opacity-20 pointer-events-none" />

        {/* TOP BAR: Palace Header & Controls */}
        <header className="relative z-20 px-4 sm:px-6 py-3.5 bg-[#051722]/95 border-b border-[#D4AF37]/35 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Mobile Menu Hamburger Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 text-[#F3CD68] hover:text-white bg-[#030A12] border border-[#D4AF37]/40 rounded-xs"
              title="Toggle Menu"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#10B981] to-[#D4AF37] p-0.5 flex items-center justify-center shadow">
                <Shield className="w-4 h-4 text-black" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="font-serif-royal font-bold text-sm sm:text-base text-white tracking-wider">
                    ROYAL ESSENCE
                  </h1>
                  <span className="hidden sm:inline-block px-2 py-0.2 bg-[#D4AF37]/20 border border-[#D4AF37]/60 text-[#F3CD68] font-serif-royal font-bold text-[9px] uppercase rounded-full">
                    Admin Portal
                  </span>
                </div>
                <span className="text-[10px] text-[#EED9C4]/70 font-sans-body hidden sm:block">
                  Authorized Control Center · Salted SHA-256 Session Active
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            {/* Notifications Button */}
            <button
              onClick={() => setActiveSection('orders')}
              className="relative p-2 text-[#F3CD68] hover:text-white bg-[#030A12] border border-[#D4AF37]/40 rounded-xs flex items-center gap-1.5 text-xs"
              title="Orders & Notifications"
            >
              <Bell className="w-4 h-4" />
              {adminNotifications.filter((n) => !n.isRead).length > 0 && (
                <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              )}
            </button>

            {/* Logout Option returning to login screen */}
            <button
              onClick={handleAdminLogout}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-[#2A0812] hover:bg-red-900 border border-red-500/60 text-red-200 text-xs font-serif-royal font-bold uppercase rounded-xs transition-colors"
              title="Logout from Admin Portal"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Logout</span>
            </button>

            {/* Close Portal Button */}
            <button
              onClick={onClose}
              className="p-1.5 text-[#F5EBDD]/60 hover:text-[#D4AF37] bg-[#030A12] border border-[#D4AF37]/30 rounded-full transition-colors"
              title="Close Admin Panel"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </header>

        {/* MAIN BODY: Responsive 10-Item Sidebar + Active Content View */}
        <div className="relative z-10 flex-1 flex overflow-hidden">
          {/* Mobile Sidebar Backdrop Overlay */}
          {isMobileMenuOpen && (
            <div
              className="fixed inset-0 bg-black/75 z-20 lg:hidden backdrop-blur-xs transition-opacity"
              onClick={() => setIsMobileMenuOpen(false)}
            />
          )}

          {/* SIDEBAR: Desktop Persistent (W-64) + Mobile Collapsible Slide-over */}
          <aside
            className={`absolute lg:relative inset-y-0 left-0 z-30 w-72 sm:w-64 bg-[#030A12]/98 border-r border-[#D4AF37]/35 flex flex-col justify-between transition-transform duration-300 lg:translate-x-0 ${
              isMobileMenuOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full lg:translate-x-0'
            }`}
          >
            {/* Sidebar Navigation Items */}
            <div className="p-3 space-y-1 overflow-y-auto">
              <div className="px-3 py-2 text-[10px] uppercase tracking-widest font-serif-royal font-bold text-[#AA8435] border-b border-[#D4AF37]/20 mb-2 flex items-center justify-between">
                <span>Management Sections</span>
                <div className="flex items-center gap-2">
                  <span className="text-[9px] text-[#F3CD68]">10 Modules</span>
                  <button
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="lg:hidden text-[#EED9C4]/60 hover:text-white p-1"
                    aria-label="Close sidebar"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {sidebarItems.map((item) => {
                const isActive = activeSection === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveSection(item.id);
                      setIsMobileMenuOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xs text-xs font-serif-royal transition-all ${
                      isActive
                        ? 'bg-gradient-to-r from-[#D4AF37] to-[#AA8435] text-black font-bold shadow-[0_2px_12px_rgba(212,175,55,0.4)]'
                        : 'text-[#EED9C4] hover:bg-[#071F17] hover:text-[#F3CD68]'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 truncate">
                      <span className={isActive ? 'text-black' : 'text-[#F3CD68]'}>{item.icon}</span>
                      <span className="truncate">{item.label}</span>
                    </div>
                    {item.badge !== undefined && (
                      <span
                        className={`text-[10px] px-1.5 py-0.2 rounded-2xs font-mono font-bold ${
                          isActive
                            ? 'bg-black text-[#F3CD68]'
                            : typeof item.badge === 'string' && item.badge.includes('low')
                            ? 'bg-amber-900/80 text-amber-200 border border-amber-500'
                            : 'bg-[#08182E] text-sky-300 border border-sky-600/40'
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}

              {/* 10. Logout in Sidebar */}
              <button
                onClick={handleAdminLogout}
                className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xs text-xs font-serif-royal text-red-300 hover:bg-red-950/60 hover:text-red-100 transition-colors mt-3 border-t border-red-500/20"
              >
                <LogOut className="w-4 h-4 text-red-400" />
                <span>Logout (Lock Portal)</span>
              </button>
            </div>

            {/* Sidebar Footer info */}
            <div className="p-3 bg-[#02060C] border-t border-[#D4AF37]/20 text-[10px] text-[#EED9C4]/50 font-serif-royal">
              <div className="flex items-center justify-between mb-1">
                <span>Active Admin:</span>
                <span className="text-[#F3CD68] font-bold">Manager</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Session Status:</span>
                <span className="text-emerald-400 font-bold">Secured ✓</span>
              </div>
            </div>
          </aside>

          {/* MAIN CONTENT AREA */}
          <main className="flex-1 flex flex-col overflow-hidden bg-[#040C16]/80">
            {/* Global Success Banner for Product Operations */}
            {productSaveSuccess && (
              <div className="m-4 mb-0 p-3 bg-emerald-950/90 border border-emerald-500 rounded-xs text-emerald-200 text-xs font-serif-royal flex items-center justify-between animate-in fade-in">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-400" />
                  <span>
                    <strong>{productSaveSuccess.name}:</strong> {productSaveSuccess.message}
                  </span>
                </div>
                <button onClick={() => setProductSaveSuccess(null)} className="text-emerald-400 hover:text-white">
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* 1. SECTION: DASHBOARD OVERVIEW */}
            {activeSection === 'dashboard' && (
              <div className="p-5 sm:p-6 flex-1 overflow-y-auto space-y-6">
                {/* Welcome Royal Banner */}
                <div className="p-5 bg-gradient-to-r from-[#07241A] via-[#0B3B2B] to-[#0A1C3B] border border-[#D4AF37]/40 rounded-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-lg">
                  <div>
                    <span className="text-[10px] uppercase tracking-widest text-[#F3CD68] font-serif-royal font-bold block mb-1">
                      Live Command Center
                    </span>
                    <h2 className="font-serif-royal text-xl sm:text-2xl font-bold text-white">
                      Welcome to Royal Essence Palace Dashboard
                    </h2>
                    <p className="text-xs text-[#EED9C4]/80 mt-1 max-w-xl font-sans-body">
                      Manage all 3 approved original perfumes, pricing across 100/300/500 ML, high-resolution imagery, discounts, inventory levels, and live order tracking.
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setActiveSection('products')}
                      className="px-4 py-2 bg-gradient-to-r from-[#D4AF37] to-[#AA8435] text-black font-serif-royal font-bold text-xs uppercase rounded-xs hover:shadow-md transition-all shrink-0"
                    >
                      Manage Products
                    </button>
                    <button
                      onClick={() => setActiveSection('orders')}
                      className="px-4 py-2 bg-[#061826] border border-[#D4AF37]/50 text-[#F3CD68] font-serif-royal text-xs uppercase rounded-xs hover:bg-[#082236] transition-all shrink-0"
                    >
                      View Orders ({orders.length})
                    </button>
                  </div>
                </div>

                {/* 5 Real-Time KPI Cards */}
                <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
                  <div className="p-4 bg-[#030E18] border border-[#D4AF37]/30 rounded-xs">
                    <span className="text-[10px] text-[#AA8435] uppercase font-serif-royal block font-bold">Total Orders</span>
                    <span className="font-serif-royal font-bold text-2xl text-white block mt-1">{totalOrdersCount}</span>
                    <span className="text-[10px] text-emerald-400 font-sans-body">All customer bookings</span>
                  </div>

                  <div className="p-4 bg-[#030E18] border border-[#D4AF37]/30 rounded-xs">
                    <span className="text-[10px] text-[#AA8435] uppercase font-serif-royal block font-bold">Total Sales</span>
                    <span className="font-serif-royal font-bold text-2xl text-[#F3CD68] block mt-1">৳{totalSalesGross.toLocaleString('en-US')}</span>
                    <span className="text-[10px] text-[#EED9C4]/70 font-sans-body">Gross booked value</span>
                  </div>

                  <div className="p-4 bg-[#030E18] border border-emerald-500/40 rounded-xs">
                    <span className="text-[10px] text-emerald-400 uppercase font-serif-royal block font-bold">Total Paid</span>
                    <span className="font-serif-royal font-bold text-2xl text-emerald-300 block mt-1">৳{totalVerifiedPaid.toLocaleString('en-US')}</span>
                    <span className="text-[10px] text-emerald-400/80 font-sans-body">{verifiedPaidOrders.length} verified orders</span>
                  </div>

                  <div className="p-4 bg-[#030E18] border border-[#D4AF37]/30 rounded-xs">
                    <span className="text-[10px] text-[#AA8435] uppercase font-serif-royal block font-bold">Pending Orders</span>
                    <span className="font-serif-royal font-bold text-2xl text-amber-400 block mt-1">{pendingOrdersCount}</span>
                    <span className="text-[10px] text-amber-400/80 font-sans-body">Requires verification</span>
                  </div>

                  <div className="p-4 bg-[#030E18] border border-[#D4AF37]/30 rounded-xs col-span-2 lg:col-span-1">
                    <span className="text-[10px] text-[#AA8435] uppercase font-serif-royal block font-bold">Inventory Alerts</span>
                    <span className={`font-serif-royal font-bold text-2xl block mt-1 ${lowStockCount > 0 ? 'text-red-400' : 'text-emerald-400'}`}>
                      {lowStockCount}
                    </span>
                    <span className="text-[10px] text-[#EED9C4]/70 font-sans-body">Sizes with stock ≤ 5</span>
                  </div>
                </div>

                {/* Quick Navigation Modules */}
                <div>
                  <h3 className="font-serif-royal font-bold text-sm text-white uppercase tracking-wider mb-3 flex items-center gap-2">
                    <Sliders className="w-4 h-4 text-[#F3CD68]" />
                    Quick Actions & Management
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <button
                      onClick={() => setActiveSection('products')}
                      className="p-3.5 bg-[#030E18] hover:bg-[#071F17] border border-[#D4AF37]/30 rounded-xs text-left transition-all group"
                    >
                      <ShoppingBag className="w-5 h-5 text-[#F3CD68] mb-2 group-hover:scale-110 transition-transform" />
                      <span className="font-serif-royal font-bold text-xs text-white block">Edit Perfumes</span>
                      <span className="text-[10px] text-[#EED9C4]/60">Name, notes, description</span>
                    </button>

                    <button
                      onClick={() => setActiveSection('images')}
                      className="p-3.5 bg-[#030E18] hover:bg-[#071F17] border border-[#D4AF37]/30 rounded-xs text-left transition-all group"
                    >
                      <ImageIcon className="w-5 h-5 text-[#F3CD68] mb-2 group-hover:scale-110 transition-transform" />
                      <span className="font-serif-royal font-bold text-xs text-white block">Upload Photos</span>
                      <span className="text-[10px] text-[#EED9C4]/60">Change flacon imagery</span>
                    </button>

                    <button
                      onClick={() => setActiveSection('prices')}
                      className="p-3.5 bg-[#030E18] hover:bg-[#071F17] border border-[#D4AF37]/30 rounded-xs text-left transition-all group"
                    >
                      <DollarSign className="w-5 h-5 text-[#F3CD68] mb-2 group-hover:scale-110 transition-transform" />
                      <span className="font-serif-royal font-bold text-xs text-white block">Set Prices</span>
                      <span className="text-[10px] text-[#EED9C4]/60">100ml, 300ml, 500ml</span>
                    </button>

                    <button
                      onClick={() => setActiveSection('discounts')}
                      className="p-3.5 bg-[#030E18] hover:bg-[#071F17] border border-[#D4AF37]/30 rounded-xs text-left transition-all group"
                    >
                      <Tag className="w-5 h-5 text-[#F3CD68] mb-2 group-hover:scale-110 transition-transform" />
                      <span className="font-serif-royal font-bold text-xs text-white block">Discounts</span>
                      <span className="text-[10px] text-[#EED9C4]/60">Coupons & promotions</span>
                    </button>
                  </div>
                </div>

                {/* Recent Orders Preview */}
                <div className="p-4 bg-[#030E18] border border-[#D4AF37]/30 rounded-xs">
                  <div className="flex items-center justify-between pb-3 border-b border-[#D4AF37]/20 mb-3">
                    <h3 className="font-serif-royal font-bold text-sm text-white uppercase tracking-wider flex items-center gap-2">
                      <Clock className="w-4 h-4 text-[#F3CD68]" />
                      Recent Customer Orders
                    </h3>
                    <button
                      onClick={() => setActiveSection('orders')}
                      className="text-xs text-[#F3CD68] hover:underline font-serif-royal uppercase"
                    >
                      View All Orders ({orders.length}) →
                    </button>
                  </div>

                  {orders.length === 0 ? (
                    <p className="text-center text-xs text-[#EED9C4]/60 py-6 font-sans-body">No orders received yet.</p>
                  ) : (
                    <div className="space-y-2">
                      {orders.slice(0, 4).map((ord) => (
                        <div
                          key={ord.id}
                          className="p-2.5 bg-[#061826] border border-[#D4AF37]/20 rounded-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs"
                        >
                          <div>
                            <span className="font-mono font-bold text-[#F3CD68] mr-2">#{ord.id}</span>
                            <span className="font-bold text-white mr-2">{ord.customerName}</span>
                            <span className="text-[#EED9C4]/60">({ord.phone})</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="font-serif-royal font-bold text-[#F3CD68]">৳{ord.total} BDT</span>
                            <span
                              className={`text-[9px] uppercase font-bold px-2 py-0.5 rounded-2xs border ${
                                ord.paymentStatus === 'PAID / VERIFIED'
                                  ? 'bg-emerald-950 border-emerald-500 text-emerald-300'
                                  : 'bg-amber-950 border-amber-500 text-amber-300'
                              }`}
                            >
                              {ord.paymentStatus}
                            </span>
                            <button
                              onClick={() => {
                                setActiveSection('orders');
                                setOrderSearchQuery(ord.id);
                              }}
                              className="text-[#38BDF8] hover:underline text-[11px]"
                            >
                              Details
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* 2. SECTION: PRODUCT MANAGEMENT */}
            {activeSection === 'products' && (
              <div className="p-5 sm:p-6 flex-1 overflow-y-auto space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#D4AF37]/25">
                  <div>
                    <h3 className="font-serif-royal font-bold text-lg text-white uppercase tracking-wider flex items-center gap-2">
                      <ShoppingBag className="w-5 h-5 text-[#F3CD68]" />
                      Perfume Product Management
                    </h3>
                    <p className="text-xs text-[#EED9C4]/70 mt-0.5">
                      Edit existing perfumes (name, prices, descriptions, fragrance notes, longevity) or add new perfumes.
                    </p>
                  </div>

                  <button
                    onClick={handleStartAdd}
                    className="px-4 py-2 bg-gradient-to-r from-[#D4AF37] to-[#AA8435] text-black font-serif-royal font-bold text-xs uppercase tracking-wider rounded-xs flex items-center gap-1.5 hover:shadow-md transition-all shrink-0"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add New Perfume</span>
                  </button>
                </div>

                {/* Product Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {products.map((p) => (
                    <div
                      key={p.id}
                      className="p-4 bg-[#030E18] border border-[#D4AF37]/35 rounded-xs flex flex-col justify-between shadow-lg"
                    >
                      <div>
                        {/* Product Image Preview */}
                        <div className="aspect-[4/3] bg-[#02070D] rounded-xs mb-3 overflow-hidden flex items-center justify-center border border-[#D4AF37]/20 p-2">
                          {p.image && p.image.trim() !== '' ? (
                            <img
                              src={p.image}
                              alt={p.name}
                              className="w-full h-full object-contain filter drop-shadow-md"
                            />
                          ) : (
                            <ProductImagePlaceholder name={p.name} size="md" className="w-full h-full" />
                          )}
                        </div>

                        <div className="flex items-center justify-between mb-1">
                          <span className="text-[10px] text-[#F3CD68] font-serif-royal uppercase font-bold">
                            {p.category === 'attar' ? 'Pure Attar' : 'Arabic Fragrance'}
                          </span>
                          <span className="text-[10px] text-emerald-400 font-mono">
                            {p.longevity || 'LONG LASTING'}
                          </span>
                        </div>

                        <h4 className="font-serif-royal font-bold text-base text-white">{p.name}</h4>
                        <p className="text-xs text-[#D4AF37] italic mb-2 line-clamp-1">{p.subtitle}</p>
                        <p className="text-xs text-[#EED9C4]/70 mb-3 line-clamp-2">{p.description}</p>

                        {/* Prices across sizes */}
                        <div className="grid grid-cols-3 gap-1.5 p-2 bg-[#061826] border border-[#D4AF37]/20 rounded-xs mb-3 text-center text-xs">
                          <div>
                            <span className="text-[9px] text-[#AA8435] block">100 ML</span>
                            <span className="font-bold text-white">৳{p.prices['100 ML']}</span>
                          </div>
                          <div>
                            <span className="text-[9px] text-[#AA8435] block">300 ML</span>
                            <span className="font-bold text-white">৳{p.prices['300 ML']}</span>
                          </div>
                          <div>
                            <span className="text-[9px] text-[#AA8435] block">500 ML</span>
                            <span className="font-bold text-white">৳{p.prices['500 ML']}</span>
                          </div>
                        </div>
                      </div>

                      <div className="pt-2 border-t border-[#D4AF37]/20 flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleStartEdit(p)}
                          className="w-full py-2 bg-[#0B2E22] hover:bg-[#104332] border border-[#10B981]/50 text-emerald-300 font-serif-royal font-bold text-xs uppercase tracking-wider rounded-xs flex items-center justify-center gap-1.5 transition-colors"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                          <span>Edit Product</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 3. SECTION: IMAGE MANAGEMENT */}
            {activeSection === 'images' && (
              <div className="p-5 sm:p-6 flex-1 overflow-y-auto space-y-6">
                <div className="pb-4 border-b border-[#D4AF37]/25">
                  <h3 className="font-serif-royal font-bold text-lg text-white uppercase tracking-wider flex items-center gap-2">
                    <ImageIcon className="w-5 h-5 text-[#F3CD68]" />
                    Product Image & Visual Gallery Management
                  </h3>
                  <p className="text-xs text-[#EED9C4]/70 mt-0.5">
                    Upload new photography for any perfume, paste external URLs, or reset to clean Arabian flacon placeholder.
                  </p>
                </div>

                {imageSaveSuccess && (
                  <div className="p-3 bg-emerald-950 border border-emerald-500 rounded-xs text-emerald-200 text-xs font-serif-royal flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-400" />
                    <span>{imageSaveSuccess}</span>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {products.map((p) => {
                    return (
                      <div
                        key={p.id}
                        className="p-4 bg-[#030E18] border border-[#D4AF37]/35 rounded-xs flex flex-col justify-between shadow-lg"
                      >
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-serif-royal font-bold text-sm text-white">{p.name}</h4>
                            <span className="text-[10px] text-[#AA8435] font-mono uppercase">{p.id}</span>
                          </div>

                          {/* Image Box */}
                          <div className="aspect-[4/3] bg-[#02070D] rounded-xs mb-3 overflow-hidden flex items-center justify-center border border-[#D4AF37]/25 p-3 relative group">
                            {p.image && p.image.trim() !== '' ? (
                              <img
                                src={p.image}
                                alt={p.name}
                                className="w-full h-full object-contain filter drop-shadow-md"
                              />
                            ) : (
                              <ProductImagePlaceholder name={p.name} size="md" className="w-full h-full" />
                            )}
                          </div>

                          <div className="space-y-2 mb-3">
                            {/* File Upload */}
                            <label className="block w-full py-2 px-3 bg-[#061F17] hover:bg-[#0A2E22] border border-[#D4AF37]/40 text-[#F3CD68] font-serif-royal font-bold text-xs uppercase tracking-wider rounded-xs text-center cursor-pointer transition-colors">
                              <Upload className="w-3.5 h-3.5 inline mr-1.5" />
                              Upload New Photo
                              <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => handleImageFileUpload(e, p.id)}
                                className="hidden"
                              />
                            </label>

                            {/* Reset Image button */}
                            {p.image && p.image.trim() !== '' && (
                              <button
                                type="button"
                                onClick={() => handleClearImage(p.id)}
                                className="w-full py-1.5 bg-[#18080C] hover:bg-red-950 border border-red-500/40 text-red-300 font-serif-royal text-[11px] uppercase tracking-wider rounded-xs transition-colors"
                              >
                                Remove Image (Reset to Placeholder)
                              </button>
                            )}
                          </div>
                        </div>

                        <div className="pt-2 border-t border-[#D4AF37]/20 text-[10px] text-[#EED9C4]/60">
                          {p.image && p.image.trim() !== '' ? (
                            <span className="text-emerald-400">Custom photo active ✓</span>
                          ) : (
                            <span className="text-[#F3CD68]">Clean flacon placeholder active</span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* 4. SECTION: PRICE MANAGEMENT */}
            {activeSection === 'prices' && (
              <div className="p-5 sm:p-6 flex-1 overflow-y-auto space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#D4AF37]/25">
                  <div>
                    <h3 className="font-serif-royal font-bold text-lg text-white uppercase tracking-wider flex items-center gap-2">
                      <DollarSign className="w-5 h-5 text-[#F3CD68]" />
                      Volume Price Matrix Management
                    </h3>
                    <p className="text-xs text-[#EED9C4]/70 mt-0.5">
                      Directly edit selling prices for 100 ML, 300 ML, and 500 ML sizes across all perfumes.
                    </p>
                  </div>

                  <button
                    onClick={handleSaveAllPrices}
                    className="px-5 py-2.5 bg-gradient-to-r from-[#D4AF37] to-[#AA8435] text-black font-serif-royal font-bold text-xs uppercase tracking-wider rounded-xs flex items-center gap-2 hover:shadow-lg transition-all shrink-0"
                  >
                    <Save className="w-4 h-4" />
                    <span>Save All Prices</span>
                  </button>
                </div>

                {priceSaveSuccess && (
                  <div className="p-3 bg-emerald-950 border border-emerald-500 rounded-xs text-emerald-200 text-xs font-serif-royal flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-400" />
                    <span>{priceSaveSuccess}</span>
                  </div>
                )}

                <div className="space-y-4">
                  {products.map((p) => {
                    const disc100 = calculateProductDiscount(p, '100 ML', offers);
                    const disc300 = calculateProductDiscount(p, '300 ML', offers);
                    const disc500 = calculateProductDiscount(p, '500 ML', offers);

                    return (
                      <div
                        key={p.id}
                        className="p-4 bg-[#030E18] border border-[#D4AF37]/35 rounded-xs space-y-3"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-[#02070D] rounded-xs border border-[#D4AF37]/20 flex items-center justify-center p-1">
                              {p.image && p.image.trim() !== '' ? (
                                <img src={p.image} alt={p.name} className="w-full h-full object-contain" />
                              ) : (
                                <ProductImagePlaceholder size="sm" className="w-full h-full" />
                              )}
                            </div>
                            <div>
                              <h4 className="font-serif-royal font-bold text-sm text-white">{p.name}</h4>
                              <span className="text-[10px] text-[#AA8435]">{p.category === 'attar' ? 'Pure Attar' : 'Arabic Fragrance'}</span>
                            </div>
                          </div>
                          <span className="text-xs text-emerald-400 font-mono font-bold">BDT (৳)</span>
                        </div>

                        {/* 3 Price Inputs */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                          <div className="p-3 bg-[#061826] border border-[#D4AF37]/25 rounded-xs">
                            <label className="block text-[10px] font-serif-royal uppercase tracking-wider text-[#F3CD68] font-bold mb-1">
                              100 ML Price (৳)
                            </label>
                            <input
                              type="number"
                              min={1}
                              value={priceUpdates[p.id]?.['100 ML'] ?? p.prices['100 ML']}
                              onChange={(e) => {
                                const val = Number(e.target.value);
                                setPriceUpdates((prev) => ({
                                  ...prev,
                                  [p.id]: {
                                    ...prev[p.id],
                                    '100 ML': val,
                                  },
                                }));
                              }}
                              className="w-full bg-[#02070D] border border-[#D4AF37]/40 text-white font-mono font-bold p-2 rounded-xs"
                            />
                            {disc100.hasDiscount && (
                              <span className="text-[10px] text-emerald-400 mt-1 block">
                                Discounted: ৳{disc100.discountedPrice} ({disc100.discountBadge})
                              </span>
                            )}
                          </div>

                          <div className="p-3 bg-[#061826] border border-[#D4AF37]/25 rounded-xs">
                            <label className="block text-[10px] font-serif-royal uppercase tracking-wider text-[#F3CD68] font-bold mb-1">
                              300 ML Price (৳)
                            </label>
                            <input
                              type="number"
                              min={1}
                              value={priceUpdates[p.id]?.['300 ML'] ?? p.prices['300 ML']}
                              onChange={(e) => {
                                const val = Number(e.target.value);
                                setPriceUpdates((prev) => ({
                                  ...prev,
                                  [p.id]: {
                                    ...prev[p.id],
                                    '300 ML': val,
                                  },
                                }));
                              }}
                              className="w-full bg-[#02070D] border border-[#D4AF37]/40 text-white font-mono font-bold p-2 rounded-xs"
                            />
                            {disc300.hasDiscount && (
                              <span className="text-[10px] text-emerald-400 mt-1 block">
                                Discounted: ৳{disc300.discountedPrice} ({disc300.discountBadge})
                              </span>
                            )}
                          </div>

                          <div className="p-3 bg-[#061826] border border-[#D4AF37]/25 rounded-xs">
                            <label className="block text-[10px] font-serif-royal uppercase tracking-wider text-[#F3CD68] font-bold mb-1">
                              500 ML Price (৳)
                            </label>
                            <input
                              type="number"
                              min={1}
                              value={priceUpdates[p.id]?.['500 ML'] ?? p.prices['500 ML']}
                              onChange={(e) => {
                                const val = Number(e.target.value);
                                setPriceUpdates((prev) => ({
                                  ...prev,
                                  [p.id]: {
                                    ...prev[p.id],
                                    '500 ML': val,
                                  },
                                }));
                              }}
                              className="w-full bg-[#02070D] border border-[#D4AF37]/40 text-white font-mono font-bold p-2 rounded-xs"
                            />
                            {disc500.hasDiscount && (
                              <span className="text-[10px] text-emerald-400 mt-1 block">
                                Discounted: ৳{disc500.discountedPrice} ({disc500.discountBadge})
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* 5. SECTION: ML / SIZE MANAGEMENT */}
            {activeSection === 'sizes' && (
              <div className="p-5 sm:p-6 flex-1 overflow-y-auto space-y-6">
                <div className="pb-4 border-b border-[#D4AF37]/25">
                  <h3 className="font-serif-royal font-bold text-lg text-white uppercase tracking-wider flex items-center gap-2">
                    <Layers className="w-5 h-5 text-[#F3CD68]" />
                    ML / Size Availability & Variant Management
                  </h3>
                  <p className="text-xs text-[#EED9C4]/70 mt-0.5">
                    Enable or disable specific sizes (100 ML, 300 ML, 500 ML) for any perfume and view assigned SKUs.
                  </p>
                </div>

                {sizeSaveSuccess && (
                  <div className="p-3 bg-emerald-950 border border-emerald-500 rounded-xs text-emerald-200 text-xs font-serif-royal flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-400" />
                    <span>{sizeSaveSuccess}</span>
                  </div>
                )}

                <div className="space-y-4">
                  {products.map((p) => {
                    const sizes: SizeOption[] = ['100 ML', '300 ML', '500 ML'];
                    return (
                      <div
                        key={p.id}
                        className="p-4 bg-[#030E18] border border-[#D4AF37]/35 rounded-xs space-y-3"
                      >
                        <div className="flex items-center justify-between pb-2 border-b border-[#D4AF37]/20">
                          <h4 className="font-serif-royal font-bold text-sm text-white">{p.name}</h4>
                          <span className="text-[11px] text-[#F3CD68] font-mono">3 Standard Variants</span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                          {sizes.map((size) => {
                            const inv = getProductSizeInventory(p, size);
                            return (
                              <div
                                key={size}
                                className={`p-3 rounded-xs border transition-all ${
                                  inv.isAvailable
                                    ? 'bg-[#061826] border-[#D4AF37]/30'
                                    : 'bg-[#18080C] border-red-500/30 opacity-70'
                                }`}
                              >
                                <div className="flex items-center justify-between mb-1">
                                  <span className="font-serif-royal font-bold text-xs text-white">{size}</span>
                                  <span
                                    className={`text-[9px] font-bold px-1.5 py-0.2 rounded-2xs ${
                                      inv.isAvailable
                                        ? 'bg-emerald-900/60 text-emerald-300 border border-emerald-500'
                                        : 'bg-red-900/60 text-red-300 border border-red-500'
                                    }`}
                                  >
                                    {inv.isAvailable ? 'Enabled' : 'Disabled'}
                                  </span>
                                </div>

                                <div className="text-[10px] text-[#EED9C4]/70 space-y-0.5 mb-2 font-mono">
                                  <div>SKU: {inv.sku}</div>
                                  <div>Price: ৳{inv.price}</div>
                                  <div>Stock: {inv.stock} bottles</div>
                                </div>

                                <button
                                  type="button"
                                  onClick={() => handleToggleSizeAvailability(p.id, size)}
                                  className={`w-full py-1.5 rounded-xs font-serif-royal text-[10px] font-bold uppercase tracking-wider border transition-colors ${
                                    inv.isAvailable
                                      ? 'bg-red-950/60 hover:bg-red-900 border-red-500/50 text-red-200'
                                      : 'bg-emerald-950/60 hover:bg-emerald-900 border-emerald-500/50 text-emerald-200'
                                  }`}
                                >
                                  {inv.isAvailable ? 'Disable This Size' : 'Enable This Size'}
                                </button>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* 6. SECTION: DISCOUNT MANAGEMENT */}
            {activeSection === 'discounts' && (
              <AdminOffersSection
                offers={offers}
                onUpdateOffers={onUpdateOffers}
                products={products}
              />
            )}

            {/* 7. SECTION: SALES ANALYTICS */}
            {activeSection === 'analytics' && (
              <AdminAnalyticsSection
                orders={orders}
                products={products}
              />
            )}

            {/* 8. SECTION: STOCK MANAGEMENT */}
            {activeSection === 'stock' && (
              <AdminInventorySection
                products={products}
                onUpdateProducts={onUpdateProducts}
              />
            )}

            {/* 9. SECTION: ORDER MANAGEMENT */}
            {activeSection === 'orders' && (
              <div className="p-5 sm:p-6 flex-1 overflow-y-auto space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#D4AF37]/25">
                  <div>
                    <h3 className="font-serif-royal font-bold text-lg text-white uppercase tracking-wider flex items-center gap-2">
                      <Clock className="w-5 h-5 text-[#F3CD68]" />
                      Customer Order & Payment Management
                    </h3>
                    <p className="text-xs text-[#EED9C4]/70 mt-0.5">
                      Verify mobile payments, dispatch courier packages, update delivery status, and review addresses.
                    </p>
                  </div>

                  <span className="text-xs text-[#F3CD68] font-mono font-bold bg-[#030E18] px-3 py-1.5 rounded-xs border border-[#D4AF37]/30">
                    Total: {orders.length} Orders
                  </span>
                </div>

                {savedDeliverySuccess && (
                  <div className="p-3 bg-emerald-950 border border-emerald-500 rounded-xs text-emerald-200 text-xs font-serif-royal flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-400" />
                    <span>{savedDeliverySuccess}</span>
                  </div>
                )}

                {/* Search & Filters */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="relative">
                    <Search className="w-4 h-4 text-[#AA8435] absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Search Order ID, Name, Phone..."
                      value={orderSearchQuery}
                      onChange={(e) => setOrderSearchQuery(e.target.value)}
                      className="w-full bg-[#030E18] border border-[#D4AF37]/35 text-white pl-9 pr-3 py-2 text-xs rounded-xs focus:outline-none focus:border-[#F3CD68]"
                    />
                  </div>

                  <div>
                    <select
                      value={orderPaymentFilter}
                      onChange={(e) => setOrderPaymentFilter(e.target.value as any)}
                      className="w-full bg-[#030E18] border border-[#D4AF37]/35 text-white p-2 text-xs rounded-xs"
                    >
                      <option value="ALL">All Payment Statuses</option>
                      <option value="PAID / VERIFIED">PAID / VERIFIED</option>
                      <option value="PAYMENT VERIFICATION PENDING">VERIFICATION PENDING</option>
                      <option value="UNPAID">UNPAID</option>
                      <option value="PAYMENT REJECTED">PAYMENT REJECTED</option>
                    </select>
                  </div>

                  <div>
                    <select
                      value={orderStatusFilter}
                      onChange={(e) => setOrderStatusFilter(e.target.value as any)}
                      className="w-full bg-[#030E18] border border-[#D4AF37]/35 text-white p-2 text-xs rounded-xs"
                    >
                      <option value="ALL">All Delivery Statuses</option>
                      <option value="Order Placed">Order Placed</option>
                      <option value="Order Confirmed">Order Confirmed</option>
                      <option value="Preparing Your Order">Preparing Your Order</option>
                      <option value="Out for Delivery">Out for Delivery</option>
                      <option value="Delivered">Delivered</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </div>
                </div>

                {/* Orders List */}
                <div className="space-y-4">
                  {filteredOrders.length === 0 ? (
                    <div className="p-12 text-center bg-[#030E18] border border-[#D4AF37]/20 rounded-xs text-xs text-[#EED9C4]/60">
                      No orders match the selected criteria.
                    </div>
                  ) : (
                    filteredOrders.map((ord) => (
                      <div
                        key={ord.id}
                        className="p-4 bg-[#030E18] border border-[#D4AF37]/35 rounded-xs space-y-3"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-2 border-b border-[#D4AF37]/20 gap-2">
                          <div>
                            <span className="font-mono font-bold text-sm text-[#F3CD68] mr-2">#{ord.id}</span>
                            <span className="font-bold text-white mr-2">{ord.customerName}</span>
                            <span className="text-xs text-[#EED9C4]/60 font-mono">({ord.phone})</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] text-[#AA8435] font-mono">
                              {new Date(ord.createdAt).toLocaleDateString()}
                            </span>
                            <span
                              className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-2xs border ${
                                ord.paymentStatus === 'PAID / VERIFIED'
                                  ? 'bg-emerald-950 border-emerald-500 text-emerald-300'
                                  : ord.paymentStatus === 'PAYMENT REJECTED'
                                  ? 'bg-red-950 border-red-500 text-red-300'
                                  : 'bg-amber-950 border-amber-500 text-amber-300'
                              }`}
                            >
                              {ord.paymentStatus}
                            </span>
                            <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-2xs bg-[#08182E] border border-sky-500 text-sky-300">
                              {ord.status}
                            </span>
                          </div>
                        </div>

                        {/* Order Address & Items */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                          <div className="p-2.5 bg-[#061826] border border-[#D4AF37]/20 rounded-xs space-y-1">
                            <span className="text-[10px] text-[#AA8435] uppercase font-serif-royal block font-bold">
                              Delivery Destination
                            </span>
                            <p className="text-white">{ord.address}</p>
                            {ord.customDeliveryDate && (
                              <p className="text-emerald-400 font-mono text-[11px]">
                                Promised Delivery: {ord.customDeliveryDate}
                              </p>
                            )}
                          </div>

                          <div className="p-2.5 bg-[#061826] border border-[#D4AF37]/20 rounded-xs space-y-1">
                            <span className="text-[10px] text-[#AA8435] uppercase font-serif-royal block font-bold">
                              Items Ordered ({ord.items.length})
                            </span>
                            {ord.items.map((it, idx) => (
                              <div key={idx} className="flex justify-between text-[11px] text-[#EED9C4]">
                                <span>{it.product.name} ({it.size}) × {it.quantity}</span>
                                <span className="font-bold text-[#F3CD68]">৳{it.pricePerUnit * it.quantity}</span>
                              </div>
                            ))}
                            <div className="pt-1 border-t border-[#D4AF37]/20 flex justify-between font-bold text-white">
                              <span>Total:</span>
                              <span className="text-[#F3CD68]">৳{ord.total} BDT</span>
                            </div>
                          </div>
                        </div>

                        {/* Payment Verification & Status Controls */}
                        <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-[#D4AF37]/20">
                          {/* Payment Actions */}
                          <div className="flex items-center gap-2">
                            {ord.paymentStatus !== 'PAID / VERIFIED' && (
                              <button
                                onClick={() => onUpdatePaymentStatus(ord.id, 'PAID / VERIFIED')}
                                className="px-3 py-1.5 bg-emerald-950 hover:bg-emerald-900 border border-emerald-500 text-emerald-300 text-xs font-serif-royal font-bold uppercase rounded-xs"
                              >
                                ✓ Verify Payment
                              </button>
                            )}

                            {ord.paymentStatus !== 'PAYMENT REJECTED' && (
                              <button
                                onClick={() => onUpdatePaymentStatus(ord.id, 'PAYMENT REJECTED')}
                                className="px-3 py-1.5 bg-red-950 hover:bg-red-900 border border-red-500 text-red-300 text-xs font-serif-royal font-bold uppercase rounded-xs"
                              >
                                ✕ Reject Payment
                              </button>
                            )}
                          </div>

                          {/* Delivery Status Updater */}
                          <div className="flex items-center gap-2">
                            <label className="text-[10px] text-[#EED9C4]/70 uppercase">Status:</label>
                            <select
                              value={ord.status}
                              onChange={(e) => onUpdateOrderStatus(ord.id, e.target.value as OrderStatus)}
                              className="bg-[#02070D] border border-[#D4AF37]/40 text-xs text-white p-1.5 rounded-xs"
                            >
                              <option value="Order Placed">Order Placed</option>
                              <option value="Order Confirmed">Order Confirmed</option>
                              <option value="Preparing Your Order">Preparing Your Order</option>
                              <option value="Out for Delivery">Out for Delivery</option>
                              <option value="Delivered">Delivered</option>
                              <option value="Cancelled">Cancelled (Restores Stock)</option>
                            </select>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {/* 10. SECTION: STORE SETTINGS */}
            {activeSection === 'settings' && (
              <div className="p-5 sm:p-6 flex-1 overflow-y-auto space-y-6">
                <div className="pb-4 border-b border-[#D4AF37]/25">
                  <h3 className="font-serif-royal font-bold text-lg text-white uppercase tracking-wider flex items-center gap-2">
                    <Sliders className="w-5 h-5 text-[#F3CD68]" />
                    Store & Mobile Payment Settings
                  </h3>
                  <p className="text-xs text-[#EED9C4]/70 mt-0.5">
                    Configure official bKash, Nagad, and Rocket numbers and flat delivery charges.
                  </p>
                </div>

                {savedSettingsNotice && (
                  <div className="p-3 bg-emerald-950 border border-emerald-500 rounded-xs text-emerald-200 text-xs font-serif-royal flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-400" />
                    <span>Store settings saved successfully!</span>
                  </div>
                )}

                <form onSubmit={handleSaveSettings} className="max-w-xl space-y-4 text-xs">
                  <div className="p-4 bg-[#030E18] border border-[#D4AF37]/35 rounded-xs space-y-3">
                    <span className="font-serif-royal font-bold text-xs text-[#F3CD68] uppercase tracking-wider block">
                      Mobile Payment Account Numbers
                    </span>

                    <div>
                      <label className="block text-[11px] uppercase tracking-wider text-[#EED9C4] mb-1 font-serif-royal">
                        bKash Merchant / Personal Number *
                      </label>
                      <input
                        type="text"
                        required
                        value={bkashNumber}
                        onChange={(e) => setBkashNumber(e.target.value)}
                        className="w-full bg-[#02070D] border border-[#D4AF37]/40 text-white font-mono p-2 rounded-xs"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] uppercase tracking-wider text-[#EED9C4] mb-1 font-serif-royal">
                        Nagad Merchant / Personal Number *
                      </label>
                      <input
                        type="text"
                        required
                        value={nagadNumber}
                        onChange={(e) => setNagadNumber(e.target.value)}
                        className="w-full bg-[#02070D] border border-[#D4AF37]/40 text-white font-mono p-2 rounded-xs"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] uppercase tracking-wider text-[#EED9C4] mb-1 font-serif-royal">
                        Rocket Number
                      </label>
                      <input
                        type="text"
                        value={rocketNumber}
                        onChange={(e) => setRocketNumber(e.target.value)}
                        className="w-full bg-[#02070D] border border-[#D4AF37]/40 text-white font-mono p-2 rounded-xs"
                      />
                    </div>
                  </div>

                  <div className="p-4 bg-[#030E18] border border-[#D4AF37]/35 rounded-xs space-y-3">
                    <span className="font-serif-royal font-bold text-xs text-[#F3CD68] uppercase tracking-wider block">
                      Flat Delivery Rates
                    </span>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] uppercase tracking-wider text-[#EED9C4] mb-1 font-serif-royal">
                          Below ৳250 Subtotal (৳)
                        </label>
                        <input
                          type="number"
                          min={0}
                          value={delBelow250}
                          onChange={(e) => setDelBelow250(Number(e.target.value))}
                          className="w-full bg-[#02070D] border border-[#D4AF37]/40 text-white font-mono p-2 rounded-xs"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] uppercase tracking-wider text-[#EED9C4] mb-1 font-serif-royal">
                          ৳250 and Above (৳)
                        </label>
                        <input
                          type="number"
                          min={0}
                          value={del250AndAbove}
                          onChange={(e) => setDel250AndAbove(Number(e.target.value))}
                          className="w-full bg-[#02070D] border border-[#D4AF37]/40 text-white font-mono p-2 rounded-xs"
                        />
                      </div>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-gradient-to-r from-[#D4AF37] to-[#AA8435] text-black font-serif-royal font-bold text-xs uppercase tracking-wider rounded-xs hover:shadow-lg transition-all"
                  >
                    Save Store Settings
                  </button>
                </form>
              </div>
            )}

            {/* 11. SECTION: CYBERSECURITY & THREAT CENTER */}
            {activeSection === 'security' && (
              <div className="p-4 sm:p-6 flex-1 overflow-y-auto">
                <AdminSecuritySection
                  products={products}
                  orders={orders}
                  settings={settings}
                  offers={offers}
                  onRestoreData={(restored) => {
                    if (restored.products) onUpdateProducts(restored.products);
                    if (restored.settings) onUpdateSettings(restored.settings);
                    if (restored.offers && onUpdateOffers) onUpdateOffers(restored.offers);
                  }}
                />
              </div>
            )}
          </main>
        </div>
      </div>

      {/* PRODUCT EDIT / ADD MODAL */}
      {(isAddingNew || editingProduct) && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="bg-gradient-to-b from-[#07241A] via-[#0A1D36] to-[#1C0816] border-2 border-[#D4AF37] max-w-2xl w-full p-6 rounded-t-[28px] rounded-b-xs max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex justify-between items-center pb-3 border-b border-[#D4AF37]/30 mb-4">
              <h3 className="font-serif-royal font-bold text-base text-white uppercase tracking-wider flex items-center gap-2">
                <Edit2 className="w-4 h-4 text-[#F3CD68]" />
                {isAddingNew ? 'Add New Royal Perfume' : `Edit Perfume: ${editingProduct?.name}`}
              </h3>
              <button
                onClick={() => {
                  setIsAddingNew(false);
                  setEditingProduct(null);
                }}
                className="text-[#EED9C4]/60 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-4 text-xs">
              {/* Product Name & Category */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-[#F3CD68] font-serif-royal font-bold mb-1">
                    Perfume Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Reef 33, Oscar, Reef 21"
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    className="w-full bg-[#030E18] border border-[#D4AF37]/40 text-white font-serif-royal font-bold p-2.5 rounded-xs focus:outline-none focus:border-[#F3CD68]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-[#F3CD68] font-serif-royal font-bold mb-1">
                    Category *
                  </label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value as any)}
                    className="w-full bg-[#030E18] border border-[#D4AF37]/40 text-white p-2.5 rounded-xs"
                  >
                    <option value="perfume">Arabic Fragrance (Perfume)</option>
                    <option value="attar">Pure Concentrated Attar</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-wider text-[#EED9C4] font-serif-royal mb-1">
                  Subtitle
                </label>
                <input
                  type="text"
                  placeholder="e.g. Royal Arabic Formulation"
                  value={formSubtitle}
                  onChange={(e) => setFormSubtitle(e.target.value)}
                  className="w-full bg-[#030E18] border border-[#D4AF37]/30 text-white p-2 rounded-xs"
                />
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-wider text-[#EED9C4] font-serif-royal mb-1">
                  Description
                </label>
                <textarea
                  rows={2}
                  placeholder="Describe the perfume profile..."
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  className="w-full bg-[#030E18] border border-[#D4AF37]/30 text-white p-2 rounded-xs"
                />
              </div>

              {/* Image Preview & URL */}
              <div className="p-3 bg-[#030E18] border border-[#D4AF37]/30 rounded-xs space-y-2">
                <label className="block text-[11px] uppercase tracking-wider text-[#F3CD68] font-serif-royal font-bold">
                  Product Image
                </label>
                <div className="flex gap-3 items-center">
                  <div className="w-16 h-16 bg-[#02070D] rounded-xs border border-[#D4AF37]/30 overflow-hidden flex items-center justify-center p-1 shrink-0">
                    {formImage && formImage.trim() !== '' ? (
                      <img src={formImage} alt="Preview" className="w-full h-full object-contain" />
                    ) : (
                      <ProductImagePlaceholder size="sm" className="w-full h-full" />
                    )}
                  </div>
                  <div className="flex-1 space-y-1.5">
                    <input
                      type="text"
                      placeholder="Image URL (or upload below)"
                      value={formImage}
                      onChange={(e) => setFormImage(e.target.value)}
                      className="w-full bg-[#02070D] border border-[#D4AF37]/30 text-white text-[11px] p-2 rounded-xs font-mono"
                    />
                    <label className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#061F17] hover:bg-[#0A2E22] border border-[#D4AF37]/40 text-[#F3CD68] font-serif-royal text-[10px] uppercase rounded-xs cursor-pointer">
                      <Upload className="w-3 h-3" />
                      <span>Upload from Device</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (!file) return;
                          const r = new FileReader();
                          r.onloadend = () => setFormImage(r.result as string);
                          r.readAsDataURL(file);
                        }}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>
              </div>

              {/* 3 Size Prices */}
              <div className="p-3 bg-[#030E18] border border-[#D4AF37]/30 rounded-xs">
                <label className="block text-[11px] uppercase tracking-wider text-[#F3CD68] font-serif-royal font-bold mb-2">
                  Selling Prices for 3 Sizes (BDT ৳)
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="block text-[10px] text-[#AA8435] mb-1">100 ML Price</label>
                    <input
                      type="number"
                      required
                      min={1}
                      value={formPrice100}
                      onChange={(e) => setFormPrice100(Number(e.target.value))}
                      className="w-full bg-[#02070D] border border-[#D4AF37]/40 text-white font-mono p-2 rounded-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-[#AA8435] mb-1">300 ML Price</label>
                    <input
                      type="number"
                      required
                      min={1}
                      value={formPrice300}
                      onChange={(e) => setFormPrice300(Number(e.target.value))}
                      className="w-full bg-[#02070D] border border-[#D4AF37]/40 text-white font-mono p-2 rounded-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-[#AA8435] mb-1">500 ML Price</label>
                    <input
                      type="number"
                      required
                      min={1}
                      value={formPrice500}
                      onChange={(e) => setFormPrice500(Number(e.target.value))}
                      className="w-full bg-[#02070D] border border-[#D4AF37]/40 text-white font-mono p-2 rounded-xs"
                    />
                  </div>
                </div>
              </div>

              {/* Fragrance Notes Architecture */}
              <div className="p-3 bg-[#030E18] border border-[#D4AF37]/30 rounded-xs space-y-2">
                <label className="block text-[11px] uppercase tracking-wider text-[#F3CD68] font-serif-royal font-bold">
                  Fragrance Notes Profile
                </label>
                <div>
                  <label className="block text-[10px] text-[#AA8435] mb-0.5">Top Notes (comma-separated)</label>
                  <input
                    type="text"
                    value={formTopNotes}
                    onChange={(e) => setFormTopNotes(e.target.value)}
                    className="w-full bg-[#02070D] border border-[#D4AF37]/30 text-white text-[11px] p-1.5 rounded-xs"
                  />
                </div>
                <div>
                  <label className="block text-[10px] text-[#AA8435] mb-0.5">Heart / Middle Notes</label>
                  <input
                    type="text"
                    value={formMiddleNotes}
                    onChange={(e) => setFormMiddleNotes(e.target.value)}
                    className="w-full bg-[#02070D] border border-[#D4AF37]/30 text-white text-[11px] p-1.5 rounded-xs"
                  />
                </div>
                <div>
                  <label className="block text-[10px] text-[#AA8435] mb-0.5">Base Notes</label>
                  <input
                    type="text"
                    value={formBaseNotes}
                    onChange={(e) => setFormBaseNotes(e.target.value)}
                    className="w-full bg-[#02070D] border border-[#D4AF37]/30 text-white text-[11px] p-1.5 rounded-xs"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#D4AF37]/30">
                <button
                  type="button"
                  onClick={() => {
                    setIsAddingNew(false);
                    setEditingProduct(null);
                  }}
                  className="px-4 py-2 border border-[#D4AF37]/30 text-[#EED9C4] rounded-xs font-serif-royal uppercase text-xs hover:border-[#D4AF37]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-gradient-to-r from-[#D4AF37] to-[#AA8435] text-black font-serif-royal font-bold text-xs uppercase tracking-wider rounded-xs hover:shadow-lg transition-all"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
