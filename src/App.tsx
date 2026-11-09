import React, { useState, useEffect } from 'react';
import { INITIAL_PRODUCTS, DEFAULT_STORE_SETTINGS, REVIEWS, UNIVERSAL_FRAGRANCE_PROFILE, getProductSizeInventory } from './data/perfumes';
import {
  Product,
  CartItem,
  SizeOption,
  Order,
  StoreSettings,
  OrderStatus,
  PaymentStatus,
  Review,
  AdminNotification,
  CustomerNotification,
  SpecialOffer,
  SavedAddress,
  CustomerAccount,
} from './types';
import { DEFAULT_SPECIAL_OFFERS } from './data/offers';
import { DEFAULT_CUSTOMER, INITIAL_SAVED_ADDRESSES } from './data/defaultAddresses';
import { calculateProductDiscount } from './utils/discountUtils';
import { WhatsAppSupportButton } from './components/WhatsAppSupportButton';
import { AnnouncementBar } from './components/AnnouncementBar';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { ProductCollection } from './components/ProductCollection';
import { CustomerReviews } from './components/CustomerReviews';
import { Newsletter } from './components/Newsletter';
import { Footer } from './components/Footer';
import { QuickViewModal } from './components/QuickViewModal';
import { CartDrawer } from './components/CartDrawer';
import { WishlistDrawer } from './components/WishlistDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { SavedAddressesModal } from './components/SavedAddressesModal';
import { CustomerAccountModal } from './components/CustomerAccountModal';
import { AdminDashboard } from './components/AdminDashboard';
import { FragranceQuizModal } from './components/FragranceQuizModal';
import { OrderSuccessModal } from './components/OrderSuccessModal';
import { OrderTrackerModal } from './components/OrderTrackerModal';
import { MyOrdersModal } from './components/MyOrdersModal';
import { CustomerNotificationBanner } from './components/CustomerNotificationBanner';
import { MobileBottomNav } from './components/MobileBottomNav';

export default function App() {
  // Store Products strictly restricted to the 3 approved products:
  // 1. REEF 21
  // 2. REEF 2
  // 3. OSAMA WOODY F
  // Only products manually added by the store admin through the admin dashboard are additionally allowed.
  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem('royal_essence_products');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const productMap = new Map<string, Product>();

          parsed.forEach((p: Product) => {
            const id = (p.id || '').toLowerCase();
            const name = (p.name || '').toLowerCase();

            // 1. ÖSMA Woody' F
            if (id === 'osma-woody-f' || id === 'osma' || id === 'osama' || name.includes('osma') || name.includes('woody')) {
              const canonical = INITIAL_PRODUCTS.find((x) => x.id === 'osma-woody-f') || INITIAL_PRODUCTS[0];
              productMap.set('osma-woody-f', {
                ...canonical,
                ...p,
                id: 'osma-woody-f',
                name: "ÖSMA Woody' F",
                subtitle: 'Woody Floral Eau De Parfum · Azure Flacon & Sky Blue Presentation Cylinder',
                image: '/assets/products/osma-woody-f.jpeg',
                prices: p.prices || { '100 ML': 300, '300 ML': 750, '500 ML': 1150 },
                sizesInventory: p.sizesInventory || canonical.sizesInventory,
                fragranceTypes: p.fragranceTypes || canonical.fragranceTypes,
                longevity: p.longevity || canonical.longevity,
                notes: p.notes && p.notes.top && p.notes.top.length > 0 ? p.notes : canonical.notes,
              });
            }
            // 2. OSCAR
            else if (id === 'oscar' || name.includes('oscar')) {
              const canonical = INITIAL_PRODUCTS.find((x) => x.id === 'oscar') || INITIAL_PRODUCTS[1];
              productMap.set('oscar', {
                ...canonical,
                ...p,
                id: 'oscar',
                name: 'OSCAR',
                subtitle: 'Apparel Spray · Radiant Gold Faceted Flacon & Crystal Crown',
                image: '/assets/products/oscar.jpeg',
                prices: p.prices || { '100 ML': 300, '300 ML': 750, '500 ML': 1150 },
                sizesInventory: p.sizesInventory || canonical.sizesInventory,
                fragranceTypes: p.fragranceTypes || canonical.fragranceTypes,
                longevity: p.longevity || canonical.longevity,
                notes: p.notes && p.notes.top && p.notes.top.length > 0 ? p.notes : canonical.notes,
              });
            }
            // 3. Reef 21
            else if (id === 'reef-21' || id === 'reef21' || name.includes('reef 21') || name.includes('21')) {
              const canonical = INITIAL_PRODUCTS.find((x) => x.id === 'reef-21') || INITIAL_PRODUCTS[2];
              productMap.set('reef-21', {
                ...canonical,
                ...p,
                id: 'reef-21',
                name: 'Reef 21',
                subtitle: 'Hair & Body Fragrance · Velvet Pom-Pom & Hexagonal Flacon',
                image: '/assets/products/reef-21.jpeg',
                prices: p.prices || { '100 ML': 300, '300 ML': 750, '500 ML': 1150 },
                sizesInventory: p.sizesInventory || canonical.sizesInventory,
                fragranceTypes: p.fragranceTypes || canonical.fragranceTypes,
                longevity: p.longevity || canonical.longevity,
                notes: p.notes && p.notes.top && p.notes.top.length > 0 ? p.notes : canonical.notes,
              });
            }
            // 4. Reef 33
            else if (id === 'reef-33' || id === 'reef33' || id === 'reef-2' || id === 'rift-2' || name.includes('reef 33') || name.includes('33') || name.includes('reef 2')) {
              const canonical = INITIAL_PRODUCTS.find((x) => x.id === 'reef-33') || INITIAL_PRODUCTS[3];
              productMap.set('reef-33', {
                ...canonical,
                ...p,
                id: 'reef-33',
                name: 'Reef 33',
                subtitle: 'Imperial Arabic Flacon · Royal Emerald & Gold Calligraphy Box',
                image: '/assets/products/reef-33.jpeg',
                prices: p.prices || { '100 ML': 300, '300 ML': 750, '500 ML': 1150 },
                sizesInventory: p.sizesInventory || canonical.sizesInventory,
                fragranceTypes: p.fragranceTypes || canonical.fragranceTypes,
                longevity: p.longevity || canonical.longevity,
                notes: p.notes && p.notes.top && p.notes.top.length > 0 ? p.notes : canonical.notes,
              });
            } else {
              // Other or custom products
              productMap.set(p.id, {
                ...p,
                fragranceTypes: p.fragranceTypes || UNIVERSAL_FRAGRANCE_PROFILE.fragranceTypes,
                longevity: p.longevity || UNIVERSAL_FRAGRANCE_PROFILE.longevity,
                notes: p.notes && p.notes.top && p.notes.top.length > 0 ? p.notes : UNIVERSAL_FRAGRANCE_PROFILE.notes,
              });
            }
          });

          // Ensure all 3 canonical approved products exist
          INITIAL_PRODUCTS.forEach((canonical) => {
            if (!productMap.has(canonical.id)) {
              productMap.set(canonical.id, canonical);
            }
          });

          const result = Array.from(productMap.values());
          localStorage.setItem('royal_essence_products', JSON.stringify(result));
          return result;
        }
      }
    } catch (e) {
      console.error(e);
    }
    localStorage.setItem('royal_essence_products', JSON.stringify(INITIAL_PRODUCTS));
    return INITIAL_PRODUCTS;
  });

  // Store Settings (Payment Numbers & Delivery Charges)
  // Ensures payment number is 01741129399 as requested
  const [settings, setSettings] = useState<StoreSettings>(() => {
    try {
      const saved = localStorage.getItem('royal_essence_settings');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (
          !parsed.paymentNumbers ||
          parsed.paymentNumbers.bkash === '[YOUR PAYMENT NUMBER HERE]' ||
          !parsed.paymentNumbers.bkash
        ) {
          parsed.paymentNumbers = {
            bkash: '01741129399',
            nagad: '01741129399',
            rocket: '01741129399',
          };
        }
        return parsed;
      }
    } catch (e) {
      console.error(e);
    }
    return DEFAULT_STORE_SETTINGS;
  });

  // Customer Orders with persistence
  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const saved = localStorage.getItem('royal_essence_orders');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          // Normalize product names in existing orders
          return parsed.map((order: Order) => ({
            ...order,
            items: (order.items || []).map((item) => {
              const p = item.product;
              if (!p) return item;
              const pName = (p.name || '').toLowerCase();
              const pId = (p.id || '').toLowerCase();
              if (pId === 'oscar' || pName.includes('oscar')) {
                return {
                  ...item,
                  id: `oscar-${item.size}`,
                  product: { ...p, id: 'oscar', name: 'OSCAR', image: '/assets/products/oscar.jpeg' },
                };
              }
              if (pId === 'reef-21' || pId === 'reef21' || pName.includes('reef 21') || pName.includes('21')) {
                return {
                  ...item,
                  id: `reef-21-${item.size}`,
                  product: { ...p, id: 'reef-21', name: 'Reef 21', image: '/assets/products/reef-21.jpeg' },
                };
              }
              if (pId === 'reef-33' || pId === 'reef33' || pId === 'reef-2' || pName.includes('reef 33') || pName.includes('33') || pName.includes('reef 2')) {
                return {
                  ...item,
                  id: `reef-33-${item.size}`,
                  product: { ...p, id: 'reef-33', name: 'Reef 33', image: '/assets/products/reef-33.jpeg' },
                };
              }
              return item;
            }),
          }));
        }
      }
    } catch (e) {
      console.error(e);
    }
    // Initial sample order demonstrating the format
    return [
      {
        id: 'RE-882194',
        customerName: 'Rafiqul Islam',
        phone: '01711223344',
        address: 'House 14, Road 7, Banani, Dhaka-1213',
        addressDetails: {
          division: 'Dhaka',
          district: 'Dhaka',
          upazila: 'Banani',
          roadVillageHouse: 'House 14, Road 7',
          postalCode: '1213',
        },
        items: [
          {
            id: 'oscar-100 ML',
            product: INITIAL_PRODUCTS[0],
            size: '100 ML',
            quantity: 1,
            pricePerUnit: 300,
          },
          {
            id: 'reef-21-300 ML',
            product: INITIAL_PRODUCTS[1],
            size: '300 ML',
            quantity: 1,
            pricePerUnit: 750,
          },
        ],
        subtotal: 1050,
        giftPackaging: false,
        giftPackagingCharge: 0,
        deliveryCharge: 10,
        total: 1060,
        paymentMethod: 'bkash',
        paymentStatus: 'PAID / VERIFIED',
        senderNumber: '01711223344',
        transactionId: '9K8J2LM3',
        status: 'Order Confirmed',
        statusHistory: [
          {
            status: 'Order Placed',
            timestamp: new Date(Date.now() - 3600000 * 6).toISOString(),
            note: 'Order submitted by customer',
          },
          {
            status: 'Order Confirmed',
            timestamp: new Date(Date.now() - 3600000 * 2).toISOString(),
            note: 'Payment verified and bottle packaged',
          },
        ],
        createdAt: new Date(Date.now() - 3600000 * 6).toISOString(),
      },
    ];
  });

  // Admin Instant Notifications
  const [adminNotifications, setAdminNotifications] = useState<AdminNotification[]>(() => {
    try {
      const saved = localStorage.getItem('royal_essence_admin_notifs');
      if (saved) return JSON.parse(saved);
    } catch {}
    return [
      {
        id: 'notif-1',
        type: 'new_order',
        orderId: 'RE-882194',
        customerName: 'Rafiqul Islam',
        amount: 1060,
        message: 'New order placed via bKash (TrxID: 9K8J2LM3). Payment verified.',
        timestamp: new Date(Date.now() - 3600000 * 6).toISOString(),
        isRead: false,
      },
    ];
  });

  // Customer In-App Status Notifications (Only real order updates, never unwanted auto-popups)
  const [customerNotifications, setCustomerNotifications] = useState<CustomerNotification[]>(() => {
    try {
      const saved = localStorage.getItem('royal_essence_customer_notifs');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          return parsed.filter((n: CustomerNotification) => n.id !== 'cnotif-init' && !n.read);
        }
      }
    } catch {}
    return [];
  });

  // Shopping Cart state
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('royal_essence_cart');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          return parsed.map((item: CartItem) => {
            const p = item.product;
            if (!p) return item;
            const pName = (p.name || '').toLowerCase();
            const pId = (p.id || '').toLowerCase();
            if (pId === 'oscar' || pName.includes('oscar')) {
              return {
                ...item,
                id: `oscar-${item.size}`,
                product: { ...p, id: 'oscar', name: 'OSCAR', image: '/assets/products/oscar.jpeg' },
              };
            }
            if (pId === 'reef-21' || pId === 'reef21' || pName.includes('reef 21') || pName.includes('21')) {
              return {
                ...item,
                id: `reef-21-${item.size}`,
                product: { ...p, id: 'reef-21', name: 'Reef 21', image: '/assets/products/reef-21.jpeg' },
              };
            }
            if (pId === 'reef-33' || pId === 'reef33' || pId === 'reef-2' || pName.includes('reef 33') || pName.includes('33') || pName.includes('reef 2')) {
              return {
                ...item,
                id: `reef-33-${item.size}`,
                product: { ...p, id: 'reef-33', name: 'Reef 33', image: '/assets/products/reef-33.jpeg' },
              };
            }
            return item;
          });
        }
      }
    } catch {
      return [];
    }
    return [];
  });

  // Wishlist state
  const [wishlistIds, setWishlistIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('royal_essence_wishlist');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          return parsed.map((id: string) => {
            if (id === 'oscar' || id.includes('oscar')) return 'oscar';
            if (id === 'reef-21' || id.includes('21')) return 'reef-21';
            if (id === 'reef-33' || id.includes('33') || id === 'reef-2') return 'reef-33';
            return id;
          });
        }
      }
      return ['oscar', 'reef-21', 'reef-33'];
    } catch {
      return ['oscar', 'reef-21', 'reef-33'];
    }
  });

  const [reviewsList, setReviewsList] = useState<Review[]>(REVIEWS);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Modals & Drawers state
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isScentFinderOpen, setIsScentFinderOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isTrackerOpen, setIsTrackerOpen] = useState(false);
  const [isMyOrdersOpen, setIsMyOrdersOpen] = useState(false);
  const [viewingOrder, setViewingOrder] = useState<Order | null>(null);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [directBuyItem, setDirectBuyItem] = useState<CartItem | null>(null);

  // Sync products to local storage
  useEffect(() => {
    try {
      localStorage.setItem('royal_essence_products', JSON.stringify(products));
    } catch (e) {
      console.error(e);
    }
  }, [products]);

  // Keep cart items and quick view modal in sync with latest products when admin edits
  useEffect(() => {
    setCartItems((prevCart: CartItem[]) =>
      prevCart.map((item: CartItem) => {
        const latest = products.find((p) => p.id === item.product.id);
        if (latest) {
          const inv = getProductSizeInventory(latest, item.size);
          const price = inv.price || latest.prices[item.size] || item.pricePerUnit;
          return {
            ...item,
            product: latest,
            pricePerUnit: price,
          };
        }
        return item;
      })
    );

    if (quickViewProduct) {
      const updated = products.find((p) => p.id === quickViewProduct.id);
      if (updated) {
        setQuickViewProduct(updated);
      }
    }
  }, [products]);

  // Sync settings to local storage
  useEffect(() => {
    try {
      localStorage.setItem('royal_essence_settings', JSON.stringify(settings));
    } catch (e) {
      console.error(e);
    }
  }, [settings]);

  // Sync orders to local storage
  useEffect(() => {
    try {
      localStorage.setItem('royal_essence_orders', JSON.stringify(orders));
    } catch (e) {
      console.error(e);
    }
  }, [orders]);

  // Sync notifications
  useEffect(() => {
    try {
      localStorage.setItem('royal_essence_admin_notifs', JSON.stringify(adminNotifications));
    } catch (e) {
      console.error(e);
    }
  }, [adminNotifications]);

  useEffect(() => {
    try {
      localStorage.setItem('royal_essence_customer_notifs', JSON.stringify(customerNotifications));
    } catch (e) {
      console.error(e);
    }
  }, [customerNotifications]);

  // Sync cart to local storage
  useEffect(() => {
    try {
      localStorage.setItem('royal_essence_cart', JSON.stringify(cartItems));
    } catch (e) {
      console.error(e);
    }
  }, [cartItems]);

  // Sync wishlist to local storage
  useEffect(() => {
    try {
      localStorage.setItem('royal_essence_wishlist', JSON.stringify(wishlistIds));
    } catch (e) {
      console.error(e);
    }
  }, [wishlistIds]);

  // Special Offers & Promotional Coupons system
  const [offers, setOffers] = useState<SpecialOffer[]>(() => {
    try {
      const saved = localStorage.getItem('royal_essence_offers');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.error(e);
    }
    return DEFAULT_SPECIAL_OFFERS;
  });

  // Sync offers to local storage
  useEffect(() => {
    try {
      localStorage.setItem('royal_essence_offers', JSON.stringify(offers));
    } catch (e) {
      console.error(e);
    }
  }, [offers]);

  // Authenticated Customer Profile & Identity
  const [customer, setCustomer] = useState<CustomerAccount>(() => {
    try {
      const saved = localStorage.getItem('royal_essence_customer');
      if (saved) return JSON.parse(saved);
    } catch {}
    return DEFAULT_CUSTOMER;
  });

  // Saved Delivery Addresses Vault
  const [savedAddresses, setSavedAddresses] = useState<SavedAddress[]>(() => {
    try {
      const saved = localStorage.getItem('royal_essence_addresses');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {}
    return INITIAL_SAVED_ADDRESSES;
  });

  const [isSavedAddressesOpen, setIsSavedAddressesOpen] = useState(false);
  const [isAccountModalOpen, setIsAccountModalOpen] = useState(false);

  // Sync customer account to local storage
  useEffect(() => {
    try {
      localStorage.setItem('royal_essence_customer', JSON.stringify(customer));
    } catch (e) {
      console.error(e);
    }
  }, [customer]);

  // Sync saved addresses to local storage
  useEffect(() => {
    try {
      localStorage.setItem('royal_essence_addresses', JSON.stringify(savedAddresses));
    } catch (e) {
      console.error(e);
    }
  }, [savedAddresses]);

  // Address Management Handlers
  const handleSaveAddress = (
    addressData: Omit<SavedAddress, 'id' | 'createdAt' | 'updatedAt'>,
    existingId?: string
  ) => {
    const now = new Date().toISOString();

    setSavedAddresses((prev) => {
      let updated: SavedAddress[];

      if (existingId) {
        updated = prev.map((addr) =>
          addr.id === existingId
            ? {
                ...addr,
                ...addressData,
                updatedAt: now,
              }
            : addressData.isDefault
            ? { ...addr, isDefault: false }
            : addr
        );
      } else {
        const newAddress: SavedAddress = {
          ...addressData,
          id: `addr-${Date.now()}`,
          createdAt: now,
          updatedAt: now,
        };

        if (addressData.isDefault) {
          updated = [newAddress, ...prev.map((a) => ({ ...a, isDefault: false }))];
        } else {
          updated = [newAddress, ...prev];
        }
      }

      return updated;
    });
  };

  const handleDeleteAddress = (addressId: string) => {
    setSavedAddresses((prev) => {
      const filtered = prev.filter((a) => a.id !== addressId);
      if (filtered.length > 0 && !filtered.some((a) => a.isDefault)) {
        filtered[0] = { ...filtered[0], isDefault: true };
      }
      return filtered;
    });
  };

  const handleSetDefaultAddress = (addressId: string) => {
    setSavedAddresses((prev) =>
      prev.map((a) => ({
        ...a,
        isDefault: a.id === addressId,
      }))
    );
  };

  // Cart Handlers with mandatory SizeOption and discounted pricing
  const handleAddToCart = (product: Product, size: SizeOption) => {
    const itemId = `${product.id}-${size}`;
    const disc = calculateProductDiscount(product, size, offers);
    const pricePerUnit = disc.hasDiscount ? disc.discountedPrice : (product.prices[size] || 300);

    setCartItems((prev) => {
      const existing = prev.find((item) => item.id === itemId);
      if (existing) {
        return prev.map((item) =>
          item.id === itemId ? { ...item, quantity: item.quantity + 1, pricePerUnit } : item
        );
      }
      return [
        ...prev,
        {
          id: itemId,
          product,
          size,
          quantity: 1,
          pricePerUnit,
        },
      ];
    });
  };

  const handleUpdateCartQuantity = (id: string, newQty: number) => {
    if (newQty <= 0) {
      handleRemoveCartItem(id);
      return;
    }
    setCartItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, quantity: newQty } : item))
    );
  };

  const handleRemoveCartItem = (id: string) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  const handleBuyNow = (product: Product, size: SizeOption) => {
    const disc = calculateProductDiscount(product, size, offers);
    const pricePerUnit = disc.hasDiscount ? disc.discountedPrice : (product.prices[size] || 300);
    const singleItem: CartItem = {
      id: `${product.id}-${size}`,
      product,
      size,
      quantity: 1,
      pricePerUnit,
    };
    setDirectBuyItem(singleItem);
    setIsCheckoutOpen(true);
  };

  // Wishlist Handlers
  const handleToggleWishlist = (product: Product) => {
    setWishlistIds((prev) =>
      prev.includes(product.id)
        ? prev.filter((id) => id !== product.id)
        : [...prev, product.id]
    );
  };

  // Order Placement
  const handleOrderPlaced = (newOrder: Order) => {
    // 1. Auto-deduct stock for each purchased size variant
    setProducts((prev) =>
      prev.map((prod) => {
        const matchingItems = (newOrder.items || []).filter((it) => it.product.id === prod.id);
        if (matchingItems.length === 0) return prod;

        const currentSizes = prod.sizesInventory
          ? { ...prod.sizesInventory }
          : {
              '100 ML': { price: prod.prices['100 ML'] || 300, stock: 25, sku: `RE-${prod.id.toUpperCase()}-100`, isAvailable: true },
              '300 ML': { price: prod.prices['300 ML'] || 750, stock: 15, sku: `RE-${prod.id.toUpperCase()}-300`, isAvailable: true },
              '500 ML': { price: prod.prices['500 ML'] || 1150, stock: 10, sku: `RE-${prod.id.toUpperCase()}-500`, isAvailable: true },
            };

        matchingItems.forEach((it) => {
          const sizeKey = it.size;
          if (currentSizes[sizeKey]) {
            const newStock = Math.max(0, currentSizes[sizeKey].stock - it.quantity);
            currentSizes[sizeKey] = {
              ...currentSizes[sizeKey],
              stock: newStock,
              isAvailable: newStock > 0,
            };
          }
        });

        const hasAnyStock = Object.values(currentSizes).some((v) => v.stock > 0 && v.isAvailable);

        return {
          ...prod,
          inStock: hasAnyStock,
          sizesInventory: currentSizes,
        };
      })
    );

    setOrders((prev) => [newOrder, ...prev]);
    if (!directBuyItem) {
      setCartItems([]);
    }
    setViewingOrder(newOrder);

    // Create an Admin Notification
    const isUnpaid = newOrder.paymentStatus === 'UNPAID';
    const newAdminNotif: AdminNotification = {
      id: `anotif-${Date.now()}`,
      type: isUnpaid ? 'continued_unpaid' : 'new_order',
      orderId: newOrder.id,
      customerName: newOrder.customerName,
      amount: newOrder.total,
      message: isUnpaid
        ? `⚠️ Order placed without payment (UNPAID) by ${newOrder.customerName}. Payment is required to process.`
        : `New order placed by ${newOrder.customerName} via ${newOrder.paymentMethod.toUpperCase()} (TrxID: ${newOrder.transactionId || 'Pending'}).`,
      timestamp: new Date().toISOString(),
      isRead: false,
    };

    setAdminNotifications((prev) => [newAdminNotif, ...prev]);
  };

  // Admin Order Status Update
  const handleUpdateOrderStatus = (
    orderId: string,
    newStatus: OrderStatus,
    customDeliveryDate?: string,
    deliveryNotes?: string
  ) => {
    const timestamp = new Date().toISOString();

    // Stock restoration on cancellation / re-deduction on reinstatement
    const targetOrder = orders.find((o) => o.id === orderId);
    if (targetOrder) {
      if (newStatus === 'Cancelled' && targetOrder.status !== 'Cancelled') {
        // Restore stock for all purchased sizes
        setProducts((prev) =>
          prev.map((prod) => {
            const matchingItems = (targetOrder.items || []).filter((it) => it.product.id === prod.id);
            if (matchingItems.length === 0) return prod;
            const currentSizes = prod.sizesInventory
              ? { ...prod.sizesInventory }
              : {
                  '100 ML': { price: prod.prices['100 ML'] || 300, stock: 25, sku: `RE-${prod.id.toUpperCase()}-100`, isAvailable: true },
                  '300 ML': { price: prod.prices['300 ML'] || 750, stock: 15, sku: `RE-${prod.id.toUpperCase()}-300`, isAvailable: true },
                  '500 ML': { price: prod.prices['500 ML'] || 1150, stock: 10, sku: `RE-${prod.id.toUpperCase()}-500`, isAvailable: true },
                };
            matchingItems.forEach((it) => {
              if (currentSizes[it.size]) {
                currentSizes[it.size] = {
                  ...currentSizes[it.size],
                  stock: currentSizes[it.size].stock + it.quantity,
                };
              }
            });
            return { ...prod, sizesInventory: currentSizes };
          })
        );
      } else if (targetOrder.status === 'Cancelled' && newStatus !== 'Cancelled') {
        // Re-deduct stock
        setProducts((prev) =>
          prev.map((prod) => {
            const matchingItems = (targetOrder.items || []).filter((it) => it.product.id === prod.id);
            if (matchingItems.length === 0) return prod;
            const currentSizes = prod.sizesInventory
              ? { ...prod.sizesInventory }
              : {
                  '100 ML': { price: prod.prices['100 ML'] || 300, stock: 25, sku: `RE-${prod.id.toUpperCase()}-100`, isAvailable: true },
                  '300 ML': { price: prod.prices['300 ML'] || 750, stock: 15, sku: `RE-${prod.id.toUpperCase()}-300`, isAvailable: true },
                  '500 ML': { price: prod.prices['500 ML'] || 1150, stock: 10, sku: `RE-${prod.id.toUpperCase()}-500`, isAvailable: true },
                };
            matchingItems.forEach((it) => {
              if (currentSizes[it.size]) {
                currentSizes[it.size] = {
                  ...currentSizes[it.size],
                  stock: Math.max(0, currentSizes[it.size].stock - it.quantity),
                };
              }
            });
            return { ...prod, sizesInventory: currentSizes };
          })
        );
      }
    }

    setOrders((prev) =>
      prev.map((ord) => {
        if (ord.id === orderId) {
          const updatedHistory = [
            ...(ord.statusHistory || []),
            {
              status: newStatus,
              timestamp,
              note: deliveryNotes || `Status updated to ${newStatus}`,
            },
          ];

          return {
            ...ord,
            status: newStatus,
            customDeliveryDate: customDeliveryDate !== undefined ? customDeliveryDate : ord.customDeliveryDate,
            deliveryNotes: deliveryNotes !== undefined ? deliveryNotes : ord.deliveryNotes,
            statusHistory: updatedHistory,
          };
        }
        return ord;
      })
    );

    if (viewingOrder && viewingOrder.id === orderId) {
      setViewingOrder((prev) =>
        prev
          ? {
              ...prev,
              status: newStatus,
              customDeliveryDate: customDeliveryDate !== undefined ? customDeliveryDate : prev.customDeliveryDate,
              deliveryNotes: deliveryNotes !== undefined ? deliveryNotes : prev.deliveryNotes,
            }
          : null
      );
    }

    // In-app customer notification for live delivery status updates
    const customerNotif: CustomerNotification = {
      id: `cnotif-${Date.now()}`,
      orderId,
      title: `Order Update: ${newStatus}`,
      message: `Your Royal Essence Order #${orderId} is now "${newStatus}".${
        deliveryNotes ? ` Note: ${deliveryNotes}` : ''
      }`,
      timestamp,
      read: false,
    };
    setCustomerNotifications((prev) => [customerNotif, ...prev]);
  };

  // Admin Payment Status Update
  const handleUpdatePaymentStatus = (orderId: string, newPaymentStatus: PaymentStatus) => {
    setOrders((prev) =>
      prev.map((ord) => (ord.id === orderId ? { ...ord, paymentStatus: newPaymentStatus } : ord))
    );

    if (viewingOrder && viewingOrder.id === orderId) {
      setViewingOrder((prev) => (prev ? { ...prev, paymentStatus: newPaymentStatus } : null));
    }

    // Notify customer
    let msg = `Your payment status for Order #${orderId} is now: ${newPaymentStatus}.`;
    if (newPaymentStatus === 'PAID / VERIFIED') {
      msg = `Payment confirmed for Order #${orderId}! Your luxury fragrance package is now being processed.`;
    } else if (newPaymentStatus === 'PAYMENT REJECTED') {
      msg = `The transaction details submitted for Order #${orderId} could not be verified. Please check in MY ORDERS.`;
    }

    const customerNotif: CustomerNotification = {
      id: `cnotif-${Date.now()}`,
      orderId,
      title: `Payment ${newPaymentStatus}`,
      message: msg,
      timestamp: new Date().toISOString(),
      read: false,
    };
    setCustomerNotifications((prev) => [customerNotif, ...prev]);
  };

  // Customer submittal of payment details from MY ORDERS for UNPAID orders
  const handleCustomerPaymentDetails = (
    orderId: string,
    senderNumber: string,
    transactionId: string,
    screenshotNote?: string
  ) => {
    setOrders((prev) =>
      prev.map((ord) => {
        if (ord.id === orderId) {
          return {
            ...ord,
            senderNumber,
            transactionId,
            screenshotNote,
            paymentStatus: 'PAYMENT VERIFICATION PENDING' as PaymentStatus,
          };
        }
        return ord;
      })
    );

    // Notify Admin
    const adminNotif: AdminNotification = {
      id: `anotif-${Date.now()}`,
      type: 'payment_submitted',
      orderId,
      customerName: 'Customer',
      amount: 0,
      message: `Payment submitted for Order #${orderId}: Sender ${senderNumber}, TrxID ${transactionId}. Ready for verification.`,
      timestamp: new Date().toISOString(),
      isRead: false,
    };
    setAdminNotifications((prev) => [adminNotif, ...prev]);
  };

  // Add Review
  const handleAddReview = (newRev: Review) => {
    setReviewsList((prev) => [newRev, ...prev]);
  };

  const cartTotal = cartItems.reduce(
    (acc, it) => acc + it.pricePerUnit * it.quantity,
    0
  );
  const cartItemCount = cartItems.reduce((acc, it) => acc + it.quantity, 0);

  const wishlistProducts = products.filter((p) => wishlistIds.includes(p.id));

  const scrollToCollections = (cat: string = 'all') => {
    setSelectedCategory(cat);
    const elem = document.getElementById('perfume-collections');
    if (elem) {
      elem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-[#070709] text-[#FAF6F0] font-sans-body flex flex-col selection:bg-[#D4AF37] selection:text-[#070709]">
      {/* 1. Announcement Bar */}
      <AnnouncementBar />

      {/* 2 & 3. Navigation Bar & Royal Essence Logo with prominent MY ORDERS button */}
      <Navbar
        cartCount={cartItemCount}
        cartTotal={cartTotal}
        wishlistCount={wishlistIds.length}
        ordersCount={orders.length}
        savedAddressesCount={savedAddresses.length}
        onOpenSavedAddresses={() => setIsSavedAddressesOpen(true)}
        activeCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenWishlist={() => setIsWishlistOpen(true)}
        onOpenScentFinder={() => setIsScentFinderOpen(true)}
        onOpenAdmin={() => setIsAdminOpen(true)}
        onOpenTracker={() => setIsMyOrdersOpen(true)}
        onOpenMyOrders={() => setIsMyOrdersOpen(true)}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      <main className="flex-1 pb-16 md:pb-0">
        {/* 4, 5, 6. Luxury Hero Background, Large Headline, Shop Now */}
        <Hero
          products={products}
          onShopNow={() => scrollToCollections('all')}
          onOpenScentFinder={() => setIsScentFinderOpen(true)}
        />

        {/* 7, 8, 9, 10, 11. Arabic Oud & Attar Showroom Grid with 100 ML, 300 ML, 500 ML sizes */}
        <ProductCollection
          products={products}
          offers={offers}
          wishlistIds={wishlistIds}
          onToggleWishlist={handleToggleWishlist}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
          onAddToCart={handleAddToCart}
          onBuyNow={handleBuyNow}
          onQuickView={(p) => setQuickViewProduct(p)}
          searchQuery={searchQuery}
        />

        {/* Customer Reviews with Verified Buyers */}
        <CustomerReviews
          reviews={reviewsList}
          perfumes={products}
          onAddReview={handleAddReview}
        />

        {/* Newsletter Subscription (Royal Connoisseurs Club) */}
        <Newsletter />
      </main>

      {/* Premium Footer */}
      <Footer
        onSelectCategory={scrollToCollections}
        onOpenScentFinder={() => setIsScentFinderOpen(true)}
      />

      {/* Quick View Product Details Modal with 100/300/500 ML selectors */}
      <QuickViewModal
        product={quickViewProduct}
        offers={offers}
        isWishlisted={quickViewProduct ? wishlistIds.includes(quickViewProduct.id) : false}
        onToggleWishlist={handleToggleWishlist}
        onClose={() => setQuickViewProduct(null)}
        onAddToCart={handleAddToCart}
        onBuyNow={handleBuyNow}
      />

      {/* Slide-out Royal Shopping Bag Drawer with 100/300/500 ML and ৳10 Delivery Charge */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        offers={offers}
        onUpdateQuantity={handleUpdateCartQuantity}
        onRemoveItem={handleRemoveCartItem}
        onCheckout={() => {
          setDirectBuyItem(null);
          setIsCheckoutOpen(true);
        }}
        settings={settings}
      />

      {/* Slide-out Royal Wishlist Drawer */}
      <WishlistDrawer
        isOpen={isWishlistOpen}
        onClose={() => setIsWishlistOpen(false)}
        wishlistPerfumes={wishlistProducts}
        onRemoveWishlist={handleToggleWishlist}
        onAddToCart={handleAddToCart}
        onQuickView={(p) => setQuickViewProduct(p)}
      />

      {/* Checkout Modal (bKash, Nagad, Rocket with payment number 01741129399, Bangladesh cascading addresses, UNPAID / PAID flow, coupons) */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => {
          setIsCheckoutOpen(false);
          setDirectBuyItem(null);
        }}
        items={cartItems}
        settings={settings}
        onOrderPlaced={handleOrderPlaced}
        directBuyItem={directBuyItem}
        availableOffers={offers}
        ordersHistory={orders}
        onApplyOfferUsage={(offerId) =>
          setOffers((prev) =>
            prev.map((o) => (o.id === offerId ? { ...o, usageCount: (o.usageCount || 0) + 1 } : o))
          )
        }
        savedAddresses={savedAddresses}
        onSaveAddress={handleSaveAddress}
        onOpenManageAddresses={() => setIsSavedAddressesOpen(true)}
        customer={customer}
      />

      {/* Dedicated Full MY SAVED ADDRESSES Portal */}
      <SavedAddressesModal
        isOpen={isSavedAddressesOpen}
        onClose={() => setIsSavedAddressesOpen(false)}
        savedAddresses={savedAddresses}
        onSaveAddress={handleSaveAddress}
        onDeleteAddress={handleDeleteAddress}
        onSetDefaultAddress={handleSetDefaultAddress}
        customer={customer}
        onOpenAccountModal={() => setIsAccountModalOpen(true)}
      />

      {/* Customer Account & Cross-Device Sync Modal */}
      <CustomerAccountModal
        isOpen={isAccountModalOpen}
        onClose={() => setIsAccountModalOpen(false)}
        customer={customer}
        onUpdateCustomer={setCustomer}
        savedAddressesCount={savedAddresses.length}
      />

      {/* Dedicated Full-Screen ORDER SUCCESSFUL Screen */}
      <OrderSuccessModal
        order={viewingOrder}
        isOpen={!!viewingOrder}
        onClose={() => setViewingOrder(null)}
        onContinueShopping={() => {
          setViewingOrder(null);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenMyOrders={() => {
          setViewingOrder(null);
          setIsMyOrdersOpen(true);
        }}
      />

      {/* Dedicated Full MY ORDERS & TRACKING PORTAL (5-Stage Visual Timeline, 3-Day Delivery, Contextual Messages, Pay-Now) */}
      <MyOrdersModal
        isOpen={isMyOrdersOpen}
        onClose={() => setIsMyOrdersOpen(false)}
        orders={orders}
        onUpdatePaymentDetails={handleCustomerPaymentDetails}
      />

      {/* Legacy / Auxiliary Order Tracker Modal */}
      <OrderTrackerModal
        isOpen={isTrackerOpen}
        onClose={() => setIsTrackerOpen(false)}
        orders={orders}
        onSelectOrderToView={(ord) => {
          setIsTrackerOpen(false);
          setIsMyOrdersOpen(true);
        }}
      />

      {/* Admin Dashboard: Manage Products, Sizes, Prices, Payment Verification & Live Order Tracking */}
      <AdminDashboard
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        products={products}
        onUpdateProducts={setProducts}
        orders={orders}
        onUpdateOrderStatus={handleUpdateOrderStatus}
        onUpdatePaymentStatus={handleUpdatePaymentStatus}
        adminNotifications={adminNotifications}
        onClearNotifications={() => setAdminNotifications([])}
        settings={settings}
        onUpdateSettings={setSettings}
        offers={offers}
        onUpdateOffers={setOffers}
        wishlistIds={wishlistIds}
      />

      {/* Fragrance Finder Advisor Quiz Modal */}
      <FragranceQuizModal
        isOpen={isScentFinderOpen}
        onClose={() => setIsScentFinderOpen(false)}
        perfumes={products}
        onAddToCart={handleAddToCart}
        onBuyNow={handleBuyNow}
      />

      {/* Real-time in-app delivery and order update notifications */}
      <CustomerNotificationBanner
        notifications={customerNotifications}
        onDismiss={(id) => setCustomerNotifications((prev) => prev.filter((n) => n.id !== id))}
        onViewOrder={() => setIsMyOrdersOpen(true)}
      />

      {/* 24/7 Royal WhatsApp Concierge Support Floating Trigger */}
      <WhatsAppSupportButton
        whatsappNumber={settings.whatsappNumber || '01741129399'}
        defaultMessage={settings.whatsappDefaultMessage}
      />

      {/* Dedicated Mobile Touch Navigation Bar (< 768px: Mobile Phones) */}
      <MobileBottomNav
        cartCount={cartItemCount}
        wishlistCount={wishlistIds.length}
        ordersCount={orders.length}
        onOpenCollections={() => scrollToCollections('all')}
        onOpenScentFinder={() => setIsScentFinderOpen(true)}
        onOpenWishlist={() => setIsWishlistOpen(true)}
        onOpenMyOrders={() => setIsMyOrdersOpen(true)}
        onOpenCart={() => setIsCartOpen(true)}
      />
    </div>
  );
}
