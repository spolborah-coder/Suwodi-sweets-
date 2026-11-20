export type ProductCategory = 'all' | 'laru' | 'pitha';

export interface Product {
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

export interface CartItem {
  product: Product;
  quantity: number;
}

export type FulfillmentMode = 'pickup' | 'delivery';

export interface PickupLocation {
  id: string;
  name: string;
  address: string;
  landmark: string;
  hours: string;
}

export interface TimeSlot {
  id: string;
  label: string;
  period: string;
  available: boolean;
}

export type PaymentMethod = 'upi' | 'card' | 'cod';

export type OrderStage =
  | 'confirmed'
  | 'preparing'
  | 'ready'
  | 'completed';

export interface OrderItemSummary {
  productId: string;
  name: string;
  assameseName: string;
  quantity: number;
  pricePerPiece: number;
  lineTotal: number;
}

export interface OrderReceipt {
  orderId: string;
  createdAt: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  fulfillmentMode: FulfillmentMode;
  pickupLocation?: PickupLocation;
  deliveryAddress?: {
    street: string;
    landmark?: string;
    city: string;
    pincode: string;
  };
  scheduledDate: string;
  scheduledSlot: string;
  items: OrderItemSummary[];
  totalPieces: number;
  subtotal: number;
  deliveryFee: number;
  totalAmount: number;
  paymentMethod: PaymentMethod;
  paymentStatus: 'paid' | 'pay_on_fulfillment';
  paymentReference?: string;
  stage: OrderStage;
  occasionType?: string;
  specialInstructions?: string;
}

export interface DeliveryZoneResult {
  eligible: boolean;
  zoneName: string;
  fee: number;
  freeThreshold: number;
  estimatedEta: string;
  message: string;
}
