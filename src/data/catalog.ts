import type { PickupLocation, Product, TimeSlot } from '../types';

export const HERO_IMAGE = '/src/assets/images/hero_assamese_sweets_1795188690588.jpg';
export const CRAFT_IMAGE = '/src/assets/images/craft_kitchen_story_1795188691055.jpg';

export const PRODUCTS: Product[] = [
  {
    id: 'narikolor-laru',
    name: 'Narikolor Laru',
    assameseName: 'নাৰিকলৰ লাৰু',
    category: 'laru',
    subtitle: 'Fresh Grated Coconut · Organic Jaggery',
    pricePerPiece: 10,
    unitLabel: '1 piece',
    image: '/src/assets/images/product_narikolor_laru_1795188691095.jpg',
    description:
      'Hand-rolled spheres of freshly grated Assam coconut slow-simmered with fragrant cane jaggery and crushed green cardamom until tender and aromatic.',
    ingredients: ['Fresh Grated Coconut', 'Pure Cane Jaggery', 'Green Cardamom', 'Pinch of Salt'],
    shelfLife: '5 days at room temperature · 12 days refrigerated',
    dietaryNote: 'Naturally Gluten-Free · Vegetarian',
    tag: 'Signature',
  },
  {
    id: 'til-pitha',
    name: 'Til Pitha',
    assameseName: 'তিল পিঠা',
    category: 'pitha',
    subtitle: 'Bora Saul Crepe · Roasted Black Sesame',
    pricePerPiece: 10,
    unitLabel: '1 piece',
    image: '/src/assets/images/product_til_pitha_1795188690599.jpg',
    description:
      'Paper-thin roasted sticky Bora rice flour crepes gently rolled around a warm, nutty heart of toasted black sesame seeds and melted jaggery.',
    ingredients: ['Assamese Bora Sticky Rice Flour', 'Black Sesame Seeds (Kola Til)', 'Organic Jaggery'],
    shelfLife: '7 days in airtight jar',
    dietaryNote: '100% Plant-Based · No Refined Sugar',
    tag: 'Bestseller',
  },
  {
    id: 'ghila-pitha',
    name: 'Ghila Pitha',
    assameseName: 'ঘিলা পিঠা',
    category: 'pitha',
    subtitle: 'Golden Rice Discs · Crisp Edges',
    pricePerPiece: 10,
    unitLabel: '1 piece',
    image: '/src/assets/images/product_ghila_pitha_1795188691162.jpg',
    description:
      'Traditional puffed golden rice-flour cakes lightly spiced with fennel and cardamom, crisp along the lacy edges and pillowy soft at the center.',
    ingredients: ['Joha & Bora Rice Flour', 'Cane Jaggery', 'Fennel Seeds', 'Cold-Pressed Mustard/Vegetable Oil'],
    shelfLife: '4 days at room temperature',
    dietaryNote: 'Traditional Festive Recipe · Vegetarian',
  },
  {
    id: 'tilor-laru',
    name: 'Tilor Laru',
    assameseName: 'তিলৰ লাৰু',
    category: 'laru',
    subtitle: 'Roasted Black Sesame · Caramelized Gur',
    pricePerPiece: 10,
    unitLabel: '1 piece',
    image: '/src/assets/images/product_tilor_laru_1795188690653.jpg',
    description:
      'Crisp, intensely nutty black sesame seeds roasted in heavy iron kadhais and bound in molten dark jaggery for a clean, snappy crunch.',
    ingredients: ['Roasted Black Sesame Seeds', 'Dark Palm & Cane Jaggery', 'Dry Ginger Hint'],
    shelfLife: '14 days in airtight jar',
    dietaryNote: 'Iron & Calcium Rich · Vegan',
  },
  {
    id: 'sutuli-pitha',
    name: 'Sutuli Pitha',
    assameseName: 'সূতুলি পিঠা',
    category: 'pitha',
    subtitle: 'Crescent Rice Pastry · Coconut & Sesame',
    pricePerPiece: 10,
    unitLabel: '1 piece',
    image: '/src/assets/images/product_sutuli_pitha_1795188689960.jpg',
    description:
      'Delicately pleated crescent pastries crafted from soft rice-flour dough, generously stuffed with sweetened coconut-sesame filling and fried to pale gold.',
    ingredients: ['Fine Rice Flour', 'Grated Coconut', 'Roasted Sesame', 'Jaggery & Cardamom'],
    shelfLife: '4 days at room temperature',
    dietaryNote: 'Hand-Pleated Daily · Vegetarian',
  },
  {
    id: 'murir-laru',
    name: 'Murir Laru',
    assameseName: 'মুৰিৰ লাৰু',
    category: 'laru',
    subtitle: 'Crisp Puffed Rice · Warm Jaggery Glaze',
    pricePerPiece: 10,
    unitLabel: '1 piece',
    image: '/src/assets/images/product_murir_laru_1795188691062.jpg',
    description:
      'Light, airy Assamese puffed rice tossed in slow-cooked spiced jaggery syrup and shaped while warm into crisp, melt-in-the-mouth clusters.',
    ingredients: ['Crisp Puffed Rice (Muri)', 'Cane Jaggery', 'Crushed Cardamom', 'Roasted Ginger'],
    shelfLife: '10 days in airtight jar',
    dietaryNote: 'Light Snack · Naturally Gluten-Free',
  },
];

export const PICKUP_LOCATIONS: PickupLocation[] = [
  {
    id: 'kaloogaon-kitchen',
    name: 'Suwodi Home Kitchen — Loonpuri Gaon, Kaloogaon',
    address: 'Loonpuri Gaon, Kaloogaon, Joysagar, Sivasagar, Assam 785666',
    landmark: 'Near Kaloogaon / Joysagar Road',
    hours: '08:30 AM – 08:30 PM Daily',
  },
  {
    id: 'joysagar-point',
    name: 'Joysagar Chariali Collection Point',
    address: 'Joysagar Chariali, Sivasagar, Assam 785665',
    landmark: 'Near Joysagar Tank & College Road',
    hours: '10:00 AM – 07:30 PM Daily',
  },
];

export const TIME_SLOTS: TimeSlot[] = [
  { id: 'slot-morning', label: '09:30 AM – 11:30 AM', period: 'Morning Batch', available: true },
  { id: 'slot-afternoon', label: '12:30 PM – 02:30 PM', period: 'Midday Batch', available: true },
  { id: 'slot-evening', label: '04:00 PM – 06:30 PM', period: 'Tea-Time Batch', available: true },
  { id: 'slot-night', label: '07:00 PM – 08:30 PM', period: 'Evening Slot', available: true },
];

export interface BulkOccasionPack {
  id: string;
  title: string;
  occasion: string;
  totalPieces: number;
  totalPrice: number;
  description: string;
  items: Array<{ productId: string; label: string; quantity: number }>;
}

export const BULK_OCCASION_PACKS: BulkOccasionPack[] = [
  {
    id: 'family-tea-30',
    title: 'Family Tea & Guest Box',
    occasion: 'Small Home Gathering · 6–10 Guests',
    totalPieces: 30,
    totalPrice: 300,
    description: '10 Narikolor Laru · 10 Til Pitha · 10 Ghila Pitha',
    items: [
      { productId: 'narikolor-laru', label: 'Narikolor Laru', quantity: 10 },
      { productId: 'til-pitha', label: 'Til Pitha', quantity: 10 },
      { productId: 'ghila-pitha', label: 'Ghila Pitha', quantity: 10 },
    ],
  },
  {
    id: 'puja-prasanga-60',
    title: 'Puja & Nam-Prasanga Box',
    occasion: 'Home Puja / Blessing · 15–20 Guests',
    totalPieces: 60,
    totalPrice: 600,
    description: '20 Narikolor Laru · 20 Til Pitha · 20 Tilor Laru',
    items: [
      { productId: 'narikolor-laru', label: 'Narikolor Laru', quantity: 20 },
      { productId: 'til-pitha', label: 'Til Pitha', quantity: 20 },
      { productId: 'tilor-laru', label: 'Tilor Laru', quantity: 20 },
    ],
  },
  {
    id: 'celebration-platter-100',
    title: 'Home Celebration Platter',
    occasion: 'Birthday / Annaprashan / Bihu · 25–35 Guests',
    totalPieces: 100,
    totalPrice: 1000,
    description: '30 Narikolor Laru · 30 Til Pitha · 20 Ghila Pitha · 20 Sutuli Pitha',
    items: [
      { productId: 'narikolor-laru', label: 'Narikolor Laru', quantity: 30 },
      { productId: 'til-pitha', label: 'Til Pitha', quantity: 30 },
      { productId: 'ghila-pitha', label: 'Ghila Pitha', quantity: 20 },
      { productId: 'sutuli-pitha', label: 'Sutuli Pitha', quantity: 20 },
    ],
  },
];

