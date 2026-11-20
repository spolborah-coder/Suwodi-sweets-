import { useEffect, useState } from 'react';
import { PRODUCTS, PICKUP_LOCATIONS, TIME_SLOTS, type BulkOccasionPack } from './data/catalog';
import type { CartItem, FulfillmentMode, OrderReceipt, Product } from './types';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { ProductCatalog } from './components/ProductCatalog';
import { Testimonials } from './components/Testimonials';
import { CraftAndFulfillment } from './components/CraftAndFulfillment';
import { ProductDetailModal } from './components/ProductDetailModal';
import { CartCheckoutDrawer } from './components/CartCheckoutDrawer';
import { OrderTrackerModal } from './components/OrderTrackerModal';
import { Footer } from './components/Footer';

const STORAGE_CART_KEY = 'suwodi_cart_v1';
const STORAGE_ORDERS_KEY = 'suwodi_recent_orders_v1';

export default function App() {
  const [products, setProducts] = useState<Product[]>(PRODUCTS);
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_CART_KEY);
      if (saved) return JSON.parse(saved) as CartItem[];
    } catch {
      // ignore storage errors
    }
    return [];
  });

  const [recentOrders, setRecentOrders] = useState<OrderReceipt[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_ORDERS_KEY);
      if (saved) return JSON.parse(saved) as OrderReceipt[];
    } catch {
      // ignore storage errors
    }
    return [];
  });

  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isTrackerOpen, setIsTrackerOpen] = useState(false);
  const [trackerOrderId, setTrackerOrderId] = useState<string | undefined>(undefined);

  // Shared scheduling preferences between page planner & checkout drawer
  const [preferredMode, setPreferredMode] = useState<FulfillmentMode>('pickup');
  const [selectedPickupId, setSelectedPickupId] = useState(PICKUP_LOCATIONS[0].id);
  const [selectedSlot, setSelectedSlot] = useState(TIME_SLOTS[2].label);
  const [preferredPincode, setPreferredPincode] = useState('785666');

  useEffect(() => {
    fetch('/api/products')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.products?.length) {
          setProducts(data.products as Product[]);
        }
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_CART_KEY, JSON.stringify(cart));
    } catch {
      // ignore storage errors
    }
  }, [cart]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_ORDERS_KEY, JSON.stringify(recentOrders));
    } catch {
      // ignore storage errors
    }
  }, [recentOrders]);

  const handleAddToCart = (product: Product, quantity: number) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: Math.min(1000, item.quantity + quantity) }
            : item
        );
      }
      return [...prev, { product, quantity: Math.min(1000, quantity) }];
    });
  };

  const handleAddBulkPack = (pack: BulkOccasionPack) => {
    setCart((prev) => {
      let next = [...prev];
      for (const packItem of pack.items) {
        const product = products.find((p) => p.id === packItem.productId);
        if (!product) continue;
        const existingIdx = next.findIndex((c) => c.product.id === product.id);
        if (existingIdx >= 0) {
          next[existingIdx] = {
            ...next[existingIdx],
            quantity: Math.min(1000, next[existingIdx].quantity + packItem.quantity),
          };
        } else {
          next.push({ product, quantity: packItem.quantity });
        }
      }
      return next;
    });
  };

  const handleUpdateQty = (productId: string, nextQty: number) => {
    if (nextQty <= 0) {
      handleRemoveItem(productId);
      return;
    }
    setCart((prev) =>
      prev.map((item) =>
        item.product.id === productId
          ? { ...item, quantity: Math.min(1000, nextQty) }
          : item
      )
    );
  };

  const handleRemoveItem = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const handleClearCart = () => {
    setCart([]);
  };

  const totalPieces = cart.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = cart.reduce((sum, item) => sum + item.quantity * item.product.pricePerPiece, 0);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF9F6] text-[#1A1917]">
      <Navbar
        totalPieces={totalPieces}
        subtotal={subtotal}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenTracker={() => {
          setTrackerOrderId(recentOrders[0]?.orderId);
          setIsTrackerOpen(true);
        }}
      />

      <main className="flex-1">
        <Hero
          onExploreMenu={() => scrollToSection('menu')}
          onScheduleClick={() => scrollToSection('fulfillment')}
        />

        <ProductCatalog
          products={products}
          cart={cart}
          onAddToCart={handleAddToCart}
          onAddBulkPack={handleAddBulkPack}
          onSelectProduct={(product) => setSelectedProduct(product)}
        />

        <Testimonials />

        <CraftAndFulfillment
          preferredMode={preferredMode}
          selectedPickupId={selectedPickupId}
          selectedSlot={selectedSlot}
          onSelectSchedule={(mode, pickupId, slot, pin) => {
            setPreferredMode(mode);
            setSelectedPickupId(pickupId);
            setSelectedSlot(slot);
            if (pin) setPreferredPincode(pin);
          }}
          onProceedToBag={() => setIsCartOpen(true)}
        />
      </main>

      <Footer
        onOpenCart={() => setIsCartOpen(true)}
        onOpenTracker={() => {
          setTrackerOrderId(recentOrders[0]?.orderId);
          setIsTrackerOpen(true);
        }}
      />

      <ProductDetailModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onAddToCart={handleAddToCart}
      />

      <CartCheckoutDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cart={cart}
        onUpdateQty={handleUpdateQty}
        onRemoveItem={handleRemoveItem}
        onClearCart={handleClearCart}
        initialMode={preferredMode}
        initialPickupId={selectedPickupId}
        initialSlot={selectedSlot}
        initialPincode={preferredPincode}
        onOrderConfirmed={(order) => setRecentOrders((prev) => [order, ...prev])}
        onTrackOrder={(orderId) => {
          setTrackerOrderId(orderId);
          setIsTrackerOpen(true);
        }}
      />

      <OrderTrackerModal
        isOpen={isTrackerOpen}
        initialOrderId={trackerOrderId}
        recentOrders={recentOrders}
        onClose={() => setIsTrackerOpen(false)}
      />
    </div>
  );
}
