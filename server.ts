import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = 3000;
const DATA_DIR = path.join(__dirname, 'data');
const ORDERS_FILE = path.join(DATA_DIR, 'orders.json');

interface ServerProduct {
  id: string;
  name: string;
  assameseName: string;
  category: 'laru' | 'pitha';
  subtitle: string;
  pricePerPiece: number;
  unitLabel: string;
  image: string;
  description: string;
  ingredients: string[];
  shelfLife: string;
  dietaryNote: string;
  tag?: string;
}

const SERVER_PRODUCTS: ServerProduct[] = [
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

const PICKUP_LOCATIONS = [
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

interface StoredOrder {
  orderId: string;
  createdAt: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  fulfillmentMode: 'pickup' | 'delivery';
  pickupLocation?: (typeof PICKUP_LOCATIONS)[number];
  deliveryAddress?: {
    street: string;
    landmark?: string;
    city: string;
    pincode: string;
  };
  scheduledDate: string;
  scheduledSlot: string;
  items: Array<{
    productId: string;
    name: string;
    assameseName: string;
    quantity: number;
    pricePerPiece: number;
    lineTotal: number;
  }>;
  totalPieces: number;
  subtotal: number;
  deliveryFee: number;
  totalAmount: number;
  paymentMethod: 'upi' | 'card' | 'cod';
  paymentStatus: 'paid' | 'pay_on_fulfillment';
  paymentReference?: string;
  stage: 'confirmed' | 'preparing' | 'ready' | 'completed';
  occasionType?: string;
  specialInstructions?: string;
}

function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(ORDERS_FILE)) {
    const seedOrder: StoredOrder = {
      orderId: 'SWD-1042',
      createdAt: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
      customerName: 'Ananya Baruah',
      customerPhone: '9864559530',
      fulfillmentMode: 'pickup',
      pickupLocation: PICKUP_LOCATIONS[0],
      scheduledDate: new Date().toISOString().split('T')[0],
      scheduledSlot: '04:00 PM – 06:30 PM',
      items: [
        {
          productId: 'narikolor-laru',
          name: 'Narikolor Laru',
          assameseName: 'নাৰিকলৰ লাৰু',
          quantity: 10,
          pricePerPiece: 10,
          lineTotal: 100,
        },
        {
          productId: 'til-pitha',
          name: 'Til Pitha',
          assameseName: 'তিল পিঠা',
          quantity: 10,
          pricePerPiece: 10,
          lineTotal: 100,
        },
      ],
      totalPieces: 20,
      subtotal: 200,
      deliveryFee: 0,
      totalAmount: 200,
      paymentMethod: 'upi',
      paymentStatus: 'paid',
      paymentReference: 'UPI-SWD-884210',
      stage: 'preparing',
    };
    fs.writeFileSync(ORDERS_FILE, JSON.stringify([seedOrder], null, 2), 'utf-8');
  }
}

function readOrders(): StoredOrder[] {
  ensureDataDir();
  try {
    const raw = fs.readFileSync(ORDERS_FILE, 'utf-8');
    return JSON.parse(raw) as StoredOrder[];
  } catch {
    return [];
  }
}

function writeOrders(orders: StoredOrder[]) {
  ensureDataDir();
  fs.writeFileSync(ORDERS_FILE, JSON.stringify(orders, null, 2), 'utf-8');
}

function evaluateDeliveryPincode(pincode: string, subtotal: number) {
  const clean = pincode.trim();
  if (!/^\d{6}$/.test(clean)) {
    return {
      eligible: false,
      zoneName: 'Invalid PIN Code',
      fee: 0,
      freeThreshold: 200,
      estimatedEta: '—',
      message: 'Please enter a valid 6-digit Indian PIN code.',
    };
  }

  const freeThreshold = 200;
  const num = Number(clean);

  // Joysagar & Kaloogaon local area PINs: 785665, 785666
  if (num === 785666 || num === 785665) {
    const baseFee = 20;
    const fee = subtotal >= freeThreshold ? 0 : baseFee;
    return {
      eligible: true,
      zoneName: 'Joysagar & Kaloogaon Local Zone',
      fee,
      freeThreshold,
      estimatedEta: '30–50 mins in selected slot',
      message:
        fee === 0
          ? 'Free local Joysagar & Kaloogaon delivery unlocked (order ₹200+).'
          : `Joysagar / Kaloogaon doorstep delivery ₹${baseFee} (free on orders ₹${freeThreshold}+).`,
    };
  }

  // Sivasagar District PINs: 785640 - 785705
  if (num >= 785640 && num <= 785705) {
    const baseFee = 30;
    const fee = subtotal >= freeThreshold ? 0 : baseFee;
    return {
      eligible: true,
      zoneName: 'Sivasagar District Delivery Zone',
      fee,
      freeThreshold,
      estimatedEta: '60–90 mins in selected slot',
      message:
        fee === 0
          ? 'Free Sivasagar district delivery unlocked (order ₹200+).'
          : `Sivasagar district delivery ₹${baseFee} (free on orders ₹${freeThreshold}+).`,
    };
  }

  return {
    eligible: false,
    zoneName: 'Outside Sivasagar & Joysagar Zone',
    fee: 0,
    freeThreshold,
    estimatedEta: '—',
    message:
      'Delivery is available exclusively in Sivasagar District & Joysagar area (PINs 785640–785705, including 785666 & 785665). Please select Local Pickup from Loonpuri Gaon, Kaloogaon.',
  };
}

async function startServer() {
  ensureDataDir();
  const app = express();
  app.use(express.json());

  // Catalog API
  app.get('/api/products', (_req, res) => {
    res.json({ products: SERVER_PRODUCTS, currency: 'INR', flatPricePerPiece: 10 });
  });

  // Pickup locations & upcoming schedule
  app.get('/api/slots', (_req, res) => {
    const today = new Date();
    const dates = [0, 1, 2, 3].map((offset) => {
      const d = new Date(today);
      d.setDate(today.getDate() + offset);
      const iso = d.toISOString().split('T')[0];
      const label =
        offset === 0
          ? 'Today'
          : offset === 1
          ? 'Tomorrow'
          : d.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' });
      return { iso, label };
    });

    res.json({
      pickupLocations: PICKUP_LOCATIONS,
      dates,
      slots: [
        { id: 'slot-morning', label: '09:30 AM – 11:30 AM', period: 'Morning Batch', available: true },
        { id: 'slot-afternoon', label: '12:30 PM – 02:30 PM', period: 'Midday Batch', available: true },
        { id: 'slot-evening', label: '04:00 PM – 06:30 PM', period: 'Tea-Time Batch', available: true },
        { id: 'slot-night', label: '07:00 PM – 08:30 PM', period: 'Evening Slot', available: true },
      ],
    });
  });

  // Check delivery pincode & fee
  app.post('/api/delivery/check-pincode', (req, res) => {
    const { pincode = '', subtotal = 0 } = req.body as { pincode?: string; subtotal?: number };
    const result = evaluateDeliveryPincode(String(pincode), Number(subtotal) || 0);
    res.json(result);
  });

  // Payment Gateway Intent Creation (UPI / Card / COD)
  app.post('/api/payments/create-intent', (req, res) => {
    const { amount, method, customerPhone } = req.body as {
      amount?: number;
      method?: 'upi' | 'card' | 'cod';
      customerPhone?: string;
    };

    const numericAmount = Math.max(0, Math.round(Number(amount) || 0));
    if (numericAmount <= 0) {
      res.status(400).json({ error: 'Invalid payment amount.' });
      return;
    }

    const intentId = `PAY-${Date.now().toString().slice(-6)}-${Math.floor(100 + Math.random() * 900)}`;
    const upiString = `upi://pay?pa=suwodisweets@upi&pn=Suwodi%20Sweets&tr=${intentId}&am=${numericAmount}.00&cu=INR&tn=Suwodi%20Sweets%20Order`;

    res.json({
      intentId,
      method: method || 'upi',
      amount: numericAmount,
      currency: 'INR',
      merchantVpa: 'suwodisweets@upi',
      merchantName: 'Suwodi Sweets',
      upiUri: upiString,
      customerPhone: customerPhone || '',
      expiresInSeconds: 600,
    });
  });

  // Create & Verify Order
  app.post('/api/orders', (req, res) => {
    const body = req.body as {
      customerName?: string;
      customerPhone?: string;
      customerEmail?: string;
      fulfillmentMode?: 'pickup' | 'delivery';
      pickupLocationId?: string;
      deliveryAddress?: {
        street?: string;
        landmark?: string;
        city?: string;
        pincode?: string;
      };
      scheduledDate?: string;
      scheduledSlot?: string;
      items?: Array<{ productId: string; quantity: number }>;
      paymentMethod?: 'upi' | 'card' | 'cod';
      paymentReference?: string;
      cardLast4?: string;
      occasionType?: string;
      specialInstructions?: string;
    };

    if (!body.customerName?.trim() || !body.customerPhone?.trim()) {
      res.status(400).json({ error: 'Customer name and phone number are required.' });
      return;
    }

    if (!Array.isArray(body.items) || body.items.length === 0) {
      res.status(400).json({ error: 'Your bag is empty.' });
      return;
    }

    const verifiedItems: StoredOrder['items'] = [];
    for (const reqItem of body.items) {
      const product = SERVER_PRODUCTS.find((p) => p.id === reqItem.productId);
      if (!product) {
        res.status(400).json({ error: `Unknown product: ${reqItem.productId}` });
        return;
      }
      const qty = Math.max(1, Math.min(1000, Math.floor(Number(reqItem.quantity) || 0)));
      verifiedItems.push({
        productId: product.id,
        name: product.name,
        assameseName: product.assameseName,
        quantity: qty,
        pricePerPiece: product.pricePerPiece, // Always ₹10/piece server-verified
        lineTotal: qty * product.pricePerPiece,
      });
    }

    const totalPieces = verifiedItems.reduce((sum, item) => sum + item.quantity, 0);
    const subtotal = verifiedItems.reduce((sum, item) => sum + item.lineTotal, 0);

    const mode = body.fulfillmentMode === 'delivery' ? 'delivery' : 'pickup';
    let deliveryFee = 0;
    let pickupLocation: (typeof PICKUP_LOCATIONS)[number] | undefined;
    let deliveryAddress: StoredOrder['deliveryAddress'];

    if (mode === 'pickup') {
      pickupLocation =
        PICKUP_LOCATIONS.find((loc) => loc.id === body.pickupLocationId) || PICKUP_LOCATIONS[0];
    } else {
      const street = body.deliveryAddress?.street?.trim() || '';
      const pincode = body.deliveryAddress?.pincode?.trim() || '';
      const city = body.deliveryAddress?.city?.trim() || 'Sivasagar';
      if (!street || !pincode) {
        res.status(400).json({ error: 'Delivery street address and PIN code are required.' });
        return;
      }
      const zone = evaluateDeliveryPincode(pincode, subtotal);
      if (!zone.eligible) {
        res.status(400).json({ error: zone.message });
        return;
      }
      deliveryFee = zone.fee;
      deliveryAddress = {
        street,
        landmark: body.deliveryAddress?.landmark?.trim() || '',
        city,
        pincode,
      };
    }

    const totalAmount = subtotal + deliveryFee;
    const paymentMethod =
      body.paymentMethod === 'card' || body.paymentMethod === 'cod' ? body.paymentMethod : 'upi';

    let paymentStatus: 'paid' | 'pay_on_fulfillment' = 'paid';
    let paymentReference = body.paymentReference?.trim() || '';

    if (paymentMethod === 'cod') {
      paymentStatus = 'pay_on_fulfillment';
      paymentReference = `COD-${Math.floor(100000 + Math.random() * 900000)}`;
    } else if (paymentMethod === 'card') {
      const suffix = body.cardLast4?.slice(-4) || '4242';
      paymentReference = paymentReference || `CARD-${suffix}-${Math.floor(1000 + Math.random() * 9000)}`;
    } else {
      paymentReference = paymentReference || `UPI-${Math.floor(100000 + Math.random() * 900000)}`;
    }

    const orders = readOrders();
    const nextNumber = 1043 + orders.length;
    const orderId = `SWD-${nextNumber}`;

    const newOrder: StoredOrder = {
      orderId,
      createdAt: new Date().toISOString(),
      customerName: body.customerName.trim(),
      customerPhone: body.customerPhone.trim(),
      customerEmail: body.customerEmail?.trim() || undefined,
      fulfillmentMode: mode,
      pickupLocation,
      deliveryAddress,
      scheduledDate: body.scheduledDate || new Date().toISOString().split('T')[0],
      scheduledSlot: body.scheduledSlot || '04:00 PM – 06:30 PM',
      items: verifiedItems,
      totalPieces,
      subtotal,
      deliveryFee,
      totalAmount,
      paymentMethod,
      paymentStatus,
      paymentReference,
      stage: 'confirmed',
      occasionType: body.occasionType?.trim() || undefined,
      specialInstructions: body.specialInstructions?.trim() || undefined,
    };

    orders.unshift(newOrder);
    writeOrders(orders);

    res.status(201).json({ order: newOrder });
  });

  // Lookup single order by ID
  app.get('/api/orders/:orderId', (req, res) => {
    const targetId = req.params.orderId.trim().toUpperCase();
    const orders = readOrders();
    const found = orders.find((o) => o.orderId.toUpperCase() === targetId);
    if (!found) {
      res.status(404).json({ error: `No order found with ID ${targetId}.` });
      return;
    }

    // Dynamic realistic progression based on age of order for demo clarity
    const ageMinutes = (Date.now() - new Date(found.createdAt).getTime()) / 60000;
    let stage = found.stage;
    if (ageMinutes > 120) {
      stage = 'completed';
    } else if (ageMinutes > 35) {
      stage = 'ready';
    } else if (ageMinutes > 2) {
      stage = 'preparing';
    }

    res.json({ order: { ...found, stage } });
  });

  // List recent orders (optionally filtered by phone)
  app.get('/api/orders', (req, res) => {
    const phone = typeof req.query.phone === 'string' ? req.query.phone.trim() : '';
    const orders = readOrders();
    const filtered = phone
      ? orders.filter((o) => o.customerPhone.includes(phone))
      : orders.slice(0, 10);
    res.json({ orders: filtered });
  });

  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Suwodi Sweets server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
