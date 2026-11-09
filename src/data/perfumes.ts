import { Product, StoreSettings } from '../types';

export const UNIVERSAL_FRAGRANCE_PROFILE = {
  fragranceTypes: ['Sweet Fragrance', 'Strong Fragrance'] as string[],
  longevity: 'LONG LASTING',
  notes: {
    top: ['Sweet Citrus', 'Caramelized Saffron', 'Velvet Bergamot'],
    middle: ['Sweet Amber', 'Royal Jasmine', 'Warm Spices'],
    heart: ['Sweet Amber', 'Royal Jasmine', 'Warm Spices'],
    base: ['Rich Agarwood (Oud)', 'Sweet Madagascar Vanilla', 'Golden Musk'],
  },
};

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'osma-woody-f',
    name: "ÖSMA Woody' F",
    subtitle: 'Woody Floral Eau De Parfum · Azure Flacon & Sky Blue Presentation Cylinder',
    category: 'perfume',
    image: '/assets/products/osma-woody-f.jpeg',
    prices: {
      '100 ML': 300,
      '300 ML': 750,
      '500 ML': 1150,
    },
    inStock: true,
    rating: 4.96,
    reviewCount: 184,
    description: 'An invigorating woody floral artisanal Eau de Parfum presented in a luminous azure flacon with a tiered silver collar, accompanied by a deluxe sky-blue cylindrical presentation canister engraved with royal floral motifs. Opens with crisp bergamot and radiant citrus, blooming into lush white rose and cedarwood, anchored in sensual golden amber and warm musk.',
    fragranceTypes: ['Sweet Fragrance', 'Strong Fragrance'],
    longevity: 'LONG LASTING',
    notes: {
      top: ['Crisp Bergamot', 'Citrus Blossom', 'Sweet Saffron'],
      middle: ['Lush White Rose', 'Cedarwood Virginia', 'Royal Jasmine'],
      heart: ['Lush White Rose', 'Cedarwood Virginia', 'Royal Jasmine'],
      base: ['Sensual Golden Amber', 'Aged Agarwood (Oud)', 'Velvet Musk'],
    },
    origin: 'Artisanal Haute Parfumerie',
    sizesInventory: {
      '100 ML': { price: 300, stock: 38, sku: 'RE-OSMA-100', isAvailable: true },
      '300 ML': { price: 750, stock: 20, sku: 'RE-OSMA-300', isAvailable: true },
      '500 ML': { price: 1150, stock: 12, sku: 'RE-OSMA-500', isAvailable: true },
    },
  },
  {
    id: 'oscar',
    name: 'OSCAR',
    subtitle: 'Apparel Spray · Radiant Gold Faceted Flacon & Crystal Crown',
    category: 'perfume',
    image: '/assets/products/oscar.jpeg',
    prices: {
      '100 ML': 300,
      '300 ML': 750,
      '500 ML': 1150,
    },
    inStock: true,
    rating: 4.98,
    reviewCount: 224,
    description: 'An opulent, radiant oriental apparel fragrance presented in an architectural gold-faceted flacon with an exquisite carved crystal cap, accompanied by an embossed gold presentation box. Opens with sparkling citrus and sweet saffron, leading into golden amber, rare oud, and bourbon vanilla.',
    fragranceTypes: ['Sweet Fragrance', 'Strong Fragrance'],
    longevity: 'LONG LASTING',
    notes: {
      top: ['Sparkling Bergamot', 'Golden Amber', 'Sweet Saffron'],
      middle: ['French Lavender', 'Royal Jasmine', 'Warm Spices'],
      heart: ['French Lavender', 'Royal Jasmine', 'Warm Spices'],
      base: ['Precious Agarwood (Oud)', 'Bourbon Vanilla', 'Sandalwood Mysore'],
    },
    origin: 'Artisanal Haute Parfumerie',
    sizesInventory: {
      '100 ML': { price: 300, stock: 45, sku: 'RE-OSCAR-100', isAvailable: true },
      '300 ML': { price: 750, stock: 25, sku: 'RE-OSCAR-300', isAvailable: true },
      '500 ML': { price: 1150, stock: 15, sku: 'RE-OSCAR-500', isAvailable: true },
    },
  },
  {
    id: 'reef-21',
    name: 'Reef 21',
    subtitle: 'Hair & Body Fragrance · Velvet Pom-Pom & Hexagonal Flacon',
    category: 'perfume',
    image: '/assets/products/reef-21.jpeg',
    prices: {
      '100 ML': 300,
      '300 ML': 750,
      '500 ML': 1150,
    },
    inStock: true,
    rating: 4.97,
    reviewCount: 198,
    description: 'An alluring Hair & Body Arabic fragrance in an iconic matte black hexagonal flacon with a gold mirror plaque, signature plush black pom-pom charm, and textured floral rose-embossed presentation box. Features sweet caramel woods, ambergris, and seductive vanilla.',
    fragranceTypes: ['Sweet Fragrance', 'Strong Fragrance'],
    longevity: 'LONG LASTING',
    notes: {
      top: ['Caramelized Saffron', 'Sweet Clementine', 'Warm Amber'],
      middle: ['Golden Amber Resin', 'Precious Rose', 'Sweet Spices'],
      heart: ['Golden Amber Resin', 'Precious Rose', 'Sweet Spices'],
      base: ['Aged Agarwood (Oud)', 'Bourbon Vanilla', 'Silky Cashmere Musk'],
    },
    origin: 'Arabic Heritage Formulation',
    sizesInventory: {
      '100 ML': { price: 300, stock: 40, sku: 'RE-REEF21-100', isAvailable: true },
      '300 ML': { price: 750, stock: 22, sku: 'RE-REEF21-300', isAvailable: true },
      '500 ML': { price: 1150, stock: 14, sku: 'RE-REEF21-500', isAvailable: true },
    },
  },
  {
    id: 'reef-33',
    name: 'Reef 33',
    subtitle: 'Imperial Arabic Flacon · Royal Emerald & Gold Calligraphy Box',
    category: 'perfume',
    image: '/assets/products/reef-33.jpeg',
    prices: {
      '100 ML': 300,
      '300 ML': 750,
      '500 ML': 1150,
    },
    inStock: true,
    rating: 4.99,
    reviewCount: 236,
    description: 'An iconic imperial Arabic masterpiece presented in a royal emerald green hexagonal flacon with a polished gold plaque and gold cap, accompanied by a luxury presentation box embossed with ornate gold Arabic calligraphy. Rich oriental amber, rare spices, and royal Cambodian agarwood.',
    fragranceTypes: ['Sweet Fragrance', 'Strong Fragrance'],
    longevity: 'LONG LASTING',
    notes: {
      top: ['Sweet Citrus', 'Cardamom', 'Caramelized Saffron'],
      middle: ['Royal Amber', 'Damask Rose', 'Warm Honey'],
      heart: ['Royal Amber', 'Damask Rose', 'Warm Honey'],
      base: ['Imperial Cambodian Oud', 'Bourbon Vanilla', 'Sensual Ambergris'],
    },
    origin: 'Arabic Heritage Formulation',
    sizesInventory: {
      '100 ML': { price: 300, stock: 42, sku: 'RE-REEF33-100', isAvailable: true },
      '300 ML': { price: 750, stock: 24, sku: 'RE-REEF33-300', isAvailable: true },
      '500 ML': { price: 1150, stock: 16, sku: 'RE-REEF33-500', isAvailable: true },
    },
  },
];

export const getProductSizeInventory = (product: Product, size: '100 ML' | '300 ML' | '500 ML') => {
  if (product.sizesInventory && product.sizesInventory[size]) {
    return product.sizesInventory[size];
  }
  const cleanName = (product.name || 'PERFUME').replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
  const cleanSize = size.replace(/\s+/g, '');
  return {
    price: product.prices[size] || (size === '100 ML' ? 300 : size === '300 ML' ? 750 : 1150),
    stock: size === '100 ML' ? 35 : size === '300 ML' ? 20 : 12,
    sku: `RE-${cleanName}-${cleanSize}`,
    isAvailable: product.inStock !== false,
  };
};

export const DEFAULT_STORE_SETTINGS: StoreSettings = {
  paymentNumbers: {
    bkash: '01741129399',
    nagad: '01741129399',
    rocket: '01741129399',
  },
  deliveryChargeBelow250: 10,
  deliveryCharge250AndAbove: 10,
  whatsappNumber: '01741129399',
  whatsappDefaultMessage: 'Hello ROYAL ESSENCE! I need assistance with your perfume collection.',
};

export const REVIEWS = [
  {
    id: 'rev-1',
    author: 'Tareq Rahman',
    location: 'Gulshan, Dhaka',
    rating: 5,
    title: 'OSCAR & Reef 33 are Beyond Compare',
    comment: 'The golden OSCAR flacon with its crystal cap is pure luxury. Reef 33 in the emerald green calligraphy box has an intoxicating amber oud drydown that lasted well into the next day. Seamless bKash payment too!',
    date: 'Yesterday',
    verified: true,
    perfumeId: 'oscar',
    perfumeName: 'OSCAR',
  },
  {
    id: 'rev-2',
    author: 'Farhana Chowdhury',
    location: 'Uttara, Dhaka',
    rating: 5,
    title: 'Reef 21 Hair & Body is Irresistible',
    comment: 'The matte black flacon with the black pom-pom charm is gorgeous. The projection is strong yet sweet, and the delivery across Dhaka was fast with flat ৳10 delivery.',
    date: '3 days ago',
    verified: true,
    perfumeId: 'reef-21',
    perfumeName: 'Reef 21',
  },
  {
    id: 'rev-3',
    author: 'Mahmudul Hasan',
    location: 'Dhanmondi, Dhaka',
    rating: 5,
    title: 'Authentic Bottles and Presentation Packaging',
    comment: 'Every perfume arrived in its original presentation box with embossed detailing. 100% genuine fragrances with outstanding sillage and projection.',
    date: '1 week ago',
    verified: true,
    perfumeId: 'reef-33',
    perfumeName: 'Reef 33',
  },
];
