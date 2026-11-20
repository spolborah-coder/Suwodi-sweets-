import { useEffect, useMemo, useState } from 'react';
import {
  AlertCircle,
  ArrowLeft,
  CheckCircle2,
  Copy,
  CreditCard,
  Minus,
  Plus,
  QrCode,
  ShoppingBag,
  Store,
  Trash2,
  Truck,
  Wallet,
  X,
} from 'lucide-react';
import { PICKUP_LOCATIONS, TIME_SLOTS } from '../data/catalog';
import type {
  CartItem,
  DeliveryZoneResult,
  FulfillmentMode,
  OrderReceipt,
  PaymentMethod,
} from '../types';
import { ResilientImage } from './ResilientImage';

interface CartCheckoutDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  onUpdateQty: (productId: string, nextQty: number) => void;
  onRemoveItem: (productId: string) => void;
  onClearCart: () => void;
  initialMode: FulfillmentMode;
  initialPickupId: string;
  initialSlot: string;
  initialPincode?: string;
  onOrderConfirmed: (order: OrderReceipt) => void;
  onTrackOrder: (orderId: string) => void;
}

type CheckoutStep = 'bag' | 'schedule' | 'payment' | 'receipt';

interface DateOption {
  iso: string;
  label: string;
}

function getFallbackDates(): DateOption[] {
  const today = new Date();
  return [0, 1, 2, 3].map((offset) => {
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
}

function SimpleQrVisual({ seed }: { seed: string }) {
  // Deterministic 11x11 matrix QR visual for UPI payment preview
  const cells = useMemo(() => {
    const grid: boolean[] = [];
    let hash = 0;
    for (let i = 0; i < seed.length; i++) {
      hash = (hash * 31 + seed.charCodeAt(i)) >>> 0;
    }
    for (let r = 0; r < 11; r++) {
      for (let c = 0; c < 11; c++) {
        const isCorner =
          (r < 3 && c < 3) || (r < 3 && c > 7) || (r > 7 && c < 3);
        if (isCorner) {
          grid.push(true);
        } else {
          const val = ((hash ^ (r * 17 + c * 29)) + r * c) % 3;
          grid.push(val !== 0);
        }
      }
    }
    return grid;
  }, [seed]);

  return (
    <svg
      viewBox="0 0 110 110"
      className="w-32 h-32 p-2 bg-white border border-[#E6E2D8] rounded-lg"
      role="img"
      aria-label="UPI Payment QR Code"
    >
      {cells.map((filled, idx) => {
        const r = Math.floor(idx / 11);
        const c = idx % 11;
        return filled ? (
          <rect
            key={idx}
            x={c * 10 + 1}
            y={r * 10 + 1}
            width="8"
            height="8"
            rx="1"
            fill="#1A1917"
          />
        ) : null;
      })}
    </svg>
  );
}

export function CartCheckoutDrawer({
  isOpen,
  onClose,
  cart,
  onUpdateQty,
  onRemoveItem,
  onClearCart,
  initialMode,
  initialPickupId,
  initialSlot,
  initialPincode = '785666',
  onOrderConfirmed,
  onTrackOrder,
}: CartCheckoutDrawerProps) {
  const [step, setStep] = useState<CheckoutStep>('bag');
  const [dates, setDates] = useState<DateOption[]>(getFallbackDates);

  // Schedule & Customer Form
  const [mode, setMode] = useState<FulfillmentMode>(initialMode);
  const [pickupLocationId, setPickupLocationId] = useState(initialPickupId);
  const [scheduledDate, setScheduledDate] = useState(getFallbackDates()[0].iso);
  const [scheduledSlot, setScheduledSlot] = useState(initialSlot || TIME_SLOTS[2].label);
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [street, setStreet] = useState('');
  const [landmark, setLandmark] = useState('');
  const [city, setCity] = useState('Sivasagar');
  const [pincode, setPincode] = useState(initialPincode);
  const [occasionType, setOccasionType] = useState('Everyday Order');
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [zoneInfo, setZoneInfo] = useState<DeliveryZoneResult | null>(null);

  // Payment Gateway State
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('upi');
  const [paymentIntentId, setPaymentIntentId] = useState('');
  const [upiApp, setUpiApp] = useState<'GPay' | 'PhonePe' | 'Paytm' | 'QR'>('GPay');
  const [upiTransactionRef, setUpiTransactionRef] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [cardHolder, setCardHolder] = useState('');
  const [copiedUpi, setCopiedUpi] = useState(false);

  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [confirmedOrder, setConfirmedOrder] = useState<OrderReceipt | null>(null);

  useEffect(() => {
    setMode(initialMode);
  }, [initialMode]);

  useEffect(() => {
    setPickupLocationId(initialPickupId);
  }, [initialPickupId]);

  useEffect(() => {
    if (initialSlot) setScheduledSlot(initialSlot);
  }, [initialSlot]);

  useEffect(() => {
    if (initialPincode) setPincode(initialPincode);
  }, [initialPincode]);

  useEffect(() => {
    if (!isOpen) return;
    fetch('/api/slots')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.dates?.length) {
          setDates(data.dates);
          setScheduledDate((prev) =>
            data.dates.some((d: DateOption) => d.iso === prev) ? prev : data.dates[0].iso
          );
        }
      })
      .catch(() => {});
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isOpen, onClose]);

  const totalPieces = cart.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = cart.reduce((sum, item) => sum + item.quantity * item.product.pricePerPiece, 0);

  // Live PIN verification whenever delivery mode & 6-digit PIN are active
  useEffect(() => {
    if (mode !== 'delivery') {
      setZoneInfo(null);
      return;
    }
    if (!/^\d{6}$/.test(pincode)) {
      setZoneInfo(null);
      return;
    }
    let cancelled = false;
    fetch('/api/delivery/check-pincode', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ pincode, subtotal }),
    })
      .then((r) => r.json())
      .then((data: DeliveryZoneResult) => {
        if (!cancelled) setZoneInfo(data);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [mode, pincode, subtotal]);

  const deliveryFee = mode === 'delivery' ? zoneInfo?.fee ?? (subtotal >= 200 ? 0 : 30) : 0;
  const grandTotal = subtotal + deliveryFee;

  const goToPayment = async () => {
    setErrorMsg('');
    if (!customerName.trim()) {
      setErrorMsg('Please enter your full name.');
      return;
    }
    if (!/^\d{10}$/.test(customerPhone.replace(/\D/g, '').slice(-10))) {
      setErrorMsg('Please enter a valid 10-digit mobile number.');
      return;
    }
    if (mode === 'delivery') {
      if (!street.trim()) {
        setErrorMsg('Please enter your house/flat and street address.');
        return;
      }
      if (!/^\d{6}$/.test(pincode)) {
        setErrorMsg('Please enter a valid 6-digit PIN code.');
        return;
      }
      if (zoneInfo && !zoneInfo.eligible) {
        setErrorMsg(zoneInfo.message);
        return;
      }
    }

    try {
      const res = await fetch('/api/payments/create-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: grandTotal,
          method: paymentMethod,
          customerPhone,
        }),
      });
      const data = await res.json();
      if (data.intentId) {
        setPaymentIntentId(data.intentId);
      }
    } catch {
      setPaymentIntentId(`PAY-${Date.now().toString().slice(-6)}`);
    }

    setStep('payment');
  };

  const handlePlaceOrder = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setErrorMsg('');

    if (paymentMethod === 'card') {
      const digits = cardNumber.replace(/\s+/g, '');
      if (digits.length < 12) {
        setErrorMsg('Please enter a valid card number.');
        return;
      }
      if (!/^\d{2}\/\d{2}$/.test(cardExpiry)) {
        setErrorMsg('Please enter card expiry in MM/YY format.');
        return;
      }
      if (!/^\d{3,4}$/.test(cardCvv)) {
        setErrorMsg('Please enter a valid 3 or 4 digit CVV.');
        return;
      }
    }

    setSubmitting(true);
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName: customerName.trim(),
          customerPhone: customerPhone.replace(/\D/g, '').slice(-10),
          customerEmail: customerEmail.trim() || undefined,
          fulfillmentMode: mode,
          pickupLocationId,
          deliveryAddress:
            mode === 'delivery'
              ? { street: street.trim(), landmark: landmark.trim(), city: city.trim(), pincode }
              : undefined,
          scheduledDate,
          scheduledSlot,
          items: cart.map((c) => ({ productId: c.product.id, quantity: c.quantity })),
          paymentMethod,
          paymentReference:
            paymentMethod === 'upi'
              ? upiTransactionRef.trim() || `${upiApp.toUpperCase()}-${paymentIntentId || Date.now().toString().slice(-6)}`
              : paymentMethod === 'card'
              ? `CARD-${cardNumber.replace(/\D/g, '').slice(-4)}`
              : undefined,
          cardLast4: cardNumber.replace(/\D/g, '').slice(-4),
          occasionType,
          specialInstructions: specialInstructions.trim() || undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setErrorMsg(data.error || 'Could not complete order. Please check your details.');
        setSubmitting(false);
        return;
      }

      const receipt = data.order as OrderReceipt;
      setConfirmedOrder(receipt);
      onOrderConfirmed(receipt);
      onClearCart();
      setStep('receipt');
    } catch {
      setErrorMsg('Network error while confirming your order. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleCloseDrawer = () => {
    if (step === 'receipt') {
      setStep('bag');
      setConfirmedOrder(null);
    }
    setErrorMsg('');
    onClose();
  };

  const formatCardNumber = (val: string) => {
    const digits = val.replace(/\D/g, '').slice(0, 16);
    return digits.replace(/(\d{4})(?=\d)/g, '$1 ');
  };

  const formatExpiry = (val: string) => {
    const digits = val.replace(/\D/g, '').slice(0, 4);
    if (digits.length >= 3) return `${digits.slice(0, 2)}/${digits.slice(2)}`;
    return digits;
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end bg-black/45 backdrop-blur-[2px]"
      role="dialog"
      aria-modal="true"
      aria-label="Order bag and checkout"
      onClick={handleCloseDrawer}
    >
      <div
        className="w-full max-w-lg bg-[#FAF9F6] h-full flex flex-col border-l border-[#E6E2D8] shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drawer Top Bar */}
        <div className="px-6 py-4 bg-white border-b border-[#E6E2D8] flex items-center justify-between gap-4 shrink-0">
          <div className="flex items-center gap-3">
            {(step === 'schedule' || step === 'payment') && (
              <button
                type="button"
                onClick={() => {
                  setErrorMsg('');
                  setStep(step === 'payment' ? 'schedule' : 'bag');
                }}
                aria-label="Go back"
                className="w-8 h-8 rounded-md border border-[#E6E2D8] flex items-center justify-center text-[#1A1917] hover:bg-[#F3F1EC] cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" aria-hidden="true" />
              </button>
            )}
            <div>
              <h2 className="font-display text-lg font-semibold text-[#1A1917]">
                {step === 'bag' && 'Your Order Bag'}
                {step === 'schedule' && 'Schedule Pickup or Delivery'}
                {step === 'payment' && 'Payment Gateway'}
                {step === 'receipt' && 'Order Confirmed'}
              </h2>
              {step !== 'receipt' && (
                <p className="text-xs text-[#5C5852] tabular-nums">
                  {totalPieces} {totalPieces === 1 ? 'piece' : 'pieces'} · ₹{subtotal}
                </p>
              )}
            </div>
          </div>

          <button
            type="button"
            onClick={handleCloseDrawer}
            aria-label="Close drawer"
            className="w-9 h-9 rounded-md border border-[#E6E2D8] flex items-center justify-center text-[#5C5852] hover:text-[#1A1917] hover:bg-[#F3F1EC] cursor-pointer"
          >
            <X className="w-4 h-4" aria-hidden="true" />
          </button>
        </div>

        {/* Step Progress Strip */}
        {step !== 'receipt' && cart.length > 0 && (
          <div className="px-6 py-2.5 bg-[#F3F1EC] border-b border-[#E6E2D8] grid grid-cols-3 text-xs font-medium">
            <span className={step === 'bag' ? 'text-[#8B1E24] font-semibold' : 'text-[#5C5852]'}>
              1. Sweets Bag
            </span>
            <span className={`text-center ${step === 'schedule' ? 'text-[#8B1E24] font-semibold' : 'text-[#5C5852]'}`}>
              2. Schedule
            </span>
            <span className={`text-right ${step === 'payment' ? 'text-[#8B1E24] font-semibold' : 'text-[#5C5852]'}`}>
              3. Payment
            </span>
          </div>
        )}

        {/* Drawer Body */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
          {errorMsg && (
            <div className="p-3.5 rounded-lg bg-[#FDF3F2] border border-[#EFC6C3] text-xs text-[#8B1E24] flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" aria-hidden="true" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* STEP 1: BAG */}
          {step === 'bag' && (
            <>
              {cart.length === 0 ? (
                <div className="py-16 text-center space-y-3">
                  <div className="w-12 h-12 rounded-full bg-[#F3F1EC] flex items-center justify-center mx-auto text-[#5C5852]">
                    <ShoppingBag className="w-5 h-5" aria-hidden="true" />
                  </div>
                  <p className="text-base font-semibold text-[#1A1917]">Your sweets bag is empty</p>
                  <p className="text-sm text-[#5C5852] max-w-xs mx-auto">
                    Add freshly rolled Narikolor Laru, Til Pitha, or Ghila Pitha at ₹10 per piece.
                  </p>
                  <button
                    type="button"
                    onClick={handleCloseDrawer}
                    className="mt-2 px-5 py-2.5 rounded-md bg-[#8B1E24] text-white text-sm font-medium cursor-pointer"
                  >
                    Browse Sweets Menu
                  </button>
                </div>
              ) : (
                <>
                  {/* Free Delivery Progress Note */}
                  <div className="p-3.5 rounded-lg bg-white border border-[#E6E2D8] text-xs text-[#5C5852]">
                    {subtotal >= 200 ? (
                      <p className="text-[#1F4A2D] font-medium flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 shrink-0" aria-hidden="true" />
                        <span>Free Sivasagar &amp; Joysagar delivery unlocked (₹200+ order). Local pickup is always free.</span>
                      </p>
                    ) : (
                      <p className="tabular-nums">
                        Add <span className="font-semibold text-[#1A1917]">{Math.ceil((200 - subtotal) / 10)} more pieces</span>{' '}
                        (₹{200 - subtotal}) for free Sivasagar &amp; Joysagar home delivery, or choose free Local Pickup.
                      </p>
                    )}
                  </div>

                  {/* Item List */}
                  <div className="divide-y divide-[#E6E2D8] bg-white border border-[#E6E2D8] rounded-xl overflow-hidden">
                    {cart.map(({ product, quantity }) => (
                      <div key={product.id} className="p-4 flex items-center gap-4">
                        <div className="w-16 h-16 rounded-lg overflow-hidden bg-[#F3F1EC] shrink-0">
                          <ResilientImage
                            src={product.image}
                            alt={product.name}
                            className="w-full h-full object-cover"
                          />
                        </div>

                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-[#1A1917] truncate">
                            {product.assameseName} · {product.name}
                          </p>
                          <p className="text-xs text-[#5C5852] font-mono tabular-nums mt-0.5">
                            ₹{product.pricePerPiece} × {quantity} pcs ={' '}
                            <span className="font-semibold text-[#1A1917]">
                              ₹{quantity * product.pricePerPiece}
                            </span>
                          </p>

                          <div className="mt-2.5 flex items-center gap-2">
                            <div className="inline-flex items-center border border-[#D4CFC4] rounded bg-[#FAF9F6] h-8">
                              <button
                                type="button"
                                onClick={() => onUpdateQty(product.id, quantity - 1)}
                                aria-label={`Decrease ${product.name}`}
                                className="w-7 h-full flex items-center justify-center text-[#5C5852] hover:text-[#1A1917] cursor-pointer"
                              >
                                <Minus className="w-3 h-3" aria-hidden="true" />
                              </button>
                              <span className="w-8 text-center text-xs font-mono font-medium tabular-nums">
                                {quantity}
                              </span>
                              <button
                                type="button"
                                onClick={() => onUpdateQty(product.id, quantity + 1)}
                                aria-label={`Increase ${product.name}`}
                                className="w-7 h-full flex items-center justify-center text-[#5C5852] hover:text-[#1A1917] cursor-pointer"
                              >
                                <Plus className="w-3 h-3" aria-hidden="true" />
                              </button>
                            </div>

                            <button
                              type="button"
                              onClick={() => onRemoveItem(product.id)}
                              aria-label={`Remove ${product.name}`}
                              className="p-1.5 text-[#8E887D] hover:text-[#8B1E24] cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5" aria-hidden="true" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div>
                    <label htmlFor="order-notes" className="block text-xs font-medium text-[#5C5852] mb-1.5">
                      Packing or Gift Note (Optional)
                    </label>
                    <input
                      id="order-notes"
                      type="text"
                      value={specialInstructions}
                      onChange={(e) => setSpecialInstructions(e.target.value)}
                      placeholder="e.g. Pack Narikolor Laru & Til Pitha in separate boxes"
                      className="w-full h-10 px-3 text-sm bg-white border border-[#D4CFC4] rounded-md text-[#1A1917] focus:outline-none focus:border-[#8B1E24]"
                    />
                  </div>
                </>
              )}
            </>
          )}

          {/* STEP 2: SCHEDULE PICKUP OR DELIVERY */}
          {step === 'schedule' && (
            <div className="space-y-5">
              {/* Fulfillment Mode Toggle */}
              <div className="grid grid-cols-2 gap-2 p-1 rounded-lg bg-[#F3F1EC] border border-[#E6E2D8]">
                <button
                  type="button"
                  onClick={() => setMode('pickup')}
                  className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-md text-sm font-medium transition-colors cursor-pointer ${
                    mode === 'pickup'
                      ? 'bg-white text-[#1A1917] shadow-xs'
                      : 'text-[#5C5852] hover:text-[#1A1917]'
                  }`}
                >
                  <Store className="w-4 h-4 text-[#8B1E24]" aria-hidden="true" />
                  <span>Local Pickup</span>
                </button>
                <button
                  type="button"
                  onClick={() => setMode('delivery')}
                  className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-md text-sm font-medium transition-colors cursor-pointer ${
                    mode === 'delivery'
                      ? 'bg-white text-[#1A1917] shadow-xs'
                      : 'text-[#5C5852] hover:text-[#1A1917]'
                  }`}
                >
                  <Truck className="w-4 h-4 text-[#8B1E24]" aria-hidden="true" />
                  <span>Home Delivery</span>
                </button>
              </div>

              {/* Contact Info */}
              <div className="bg-white border border-[#E6E2D8] rounded-xl p-4 space-y-3">
                <p className="text-xs font-semibold uppercase tracking-wider text-[#5C5852]">
                  Customer Contact
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label htmlFor="cust-name" className="block text-xs font-medium text-[#1A1917] mb-1">
                      Full Name *
                    </label>
                    <input
                      id="cust-name"
                      type="text"
                      required
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder="e.g. Rituja Bora"
                      className="w-full h-10 px-3 text-sm bg-[#FAF9F6] border border-[#D4CFC4] rounded-md focus:outline-none focus:border-[#8B1E24]"
                    />
                  </div>
                  <div>
                    <label htmlFor="cust-phone" className="block text-xs font-medium text-[#1A1917] mb-1">
                      Mobile Number *
                    </label>
                    <input
                      id="cust-phone"
                      type="tel"
                      inputMode="numeric"
                      maxLength={10}
                      required
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value.replace(/\D/g, ''))}
                      placeholder="10-digit mobile"
                      className="w-full h-10 px-3 text-sm font-mono bg-[#FAF9F6] border border-[#D4CFC4] rounded-md focus:outline-none focus:border-[#8B1E24]"
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="cust-email" className="block text-xs font-medium text-[#1A1917] mb-1">
                    Email for Receipt (Optional)
                  </label>
                  <input
                    id="cust-email"
                    type="email"
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full h-10 px-3 text-sm bg-[#FAF9F6] border border-[#D4CFC4] rounded-md focus:outline-none focus:border-[#8B1E24]"
                  />
                </div>
              </div>

              {/* Pickup Location OR Delivery Address */}
              {mode === 'pickup' ? (
                <div className="bg-white border border-[#E6E2D8] rounded-xl p-4 space-y-3">
                  <p className="text-xs font-semibold uppercase tracking-wider text-[#5C5852]">
                    Select Pickup Desk
                  </p>
                  {PICKUP_LOCATIONS.map((loc) => (
                    <button
                      key={loc.id}
                      type="button"
                      onClick={() => setPickupLocationId(loc.id)}
                      className={`w-full text-left p-3.5 rounded-lg border transition-colors cursor-pointer ${
                        pickupLocationId === loc.id
                          ? 'border-[#8B1E24] bg-[#8B1E24]/[0.03]'
                          : 'border-[#E6E2D8] hover:border-[#C5BEB0]'
                      }`}
                    >
                      <p className="text-sm font-semibold text-[#1A1917]">{loc.name}</p>
                      <p className="text-xs text-[#5C5852] mt-0.5">{loc.address}</p>
                      <p className="text-[11px] text-[#8E887D] mt-0.5">{loc.hours}</p>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="bg-white border border-[#E6E2D8] rounded-xl p-4 space-y-3">
                  <p className="text-xs font-semibold uppercase tracking-wider text-[#5C5852]">
                    Home Delivery Address
                  </p>
                  <div>
                    <label htmlFor="deliv-street" className="block text-xs font-medium text-[#1A1917] mb-1">
                      Village / House No. &amp; Street *
                    </label>
                    <input
                      id="deliv-street"
                      type="text"
                      value={street}
                      onChange={(e) => setStreet(e.target.value)}
                      placeholder="e.g. Loonpuri Gaon, Kaloogaon, Joysagar"
                      className="w-full h-10 px-3 text-sm bg-[#FAF9F6] border border-[#D4CFC4] rounded-md focus:outline-none focus:border-[#8B1E24]"
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="sm:col-span-2">
                      <label htmlFor="deliv-landmark" className="block text-xs font-medium text-[#1A1917] mb-1">
                        Landmark
                      </label>
                      <input
                        id="deliv-landmark"
                        type="text"
                        value={landmark}
                        onChange={(e) => setLandmark(e.target.value)}
                        placeholder="Near Namghar / Joysagar Chariali"
                        className="w-full h-10 px-3 text-sm bg-[#FAF9F6] border border-[#D4CFC4] rounded-md focus:outline-none focus:border-[#8B1E24]"
                      />
                    </div>
                    <div>
                      <label htmlFor="deliv-pin" className="block text-xs font-medium text-[#1A1917] mb-1">
                        PIN Code *
                      </label>
                      <input
                        id="deliv-pin"
                        type="text"
                        inputMode="numeric"
                        maxLength={6}
                        value={pincode}
                        onChange={(e) => setPincode(e.target.value.replace(/\D/g, ''))}
                        placeholder="785666"
                        className="w-full h-10 px-3 text-sm font-mono bg-[#FAF9F6] border border-[#D4CFC4] rounded-md focus:outline-none focus:border-[#8B1E24]"
                      />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="deliv-city" className="block text-xs font-medium text-[#1A1917] mb-1">
                      Area / District (Sivasagar &amp; Joysagar Only)
                    </label>
                    <input
                      id="deliv-city"
                      type="text"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full h-10 px-3 text-sm bg-[#FAF9F6] border border-[#D4CFC4] rounded-md focus:outline-none focus:border-[#8B1E24]"
                    />
                  </div>

                  {zoneInfo && (
                    <div
                      className={`p-3 rounded-lg border text-xs ${
                        zoneInfo.eligible
                          ? 'bg-[#F1F7F3] border-[#C5DEC9] text-[#1F4A2D]'
                          : 'bg-[#FDF3F2] border-[#EFC6C3] text-[#8B1E24]'
                      }`}
                    >
                      <p className="font-semibold">
                        {zoneInfo.zoneName} · {zoneInfo.fee === 0 && zoneInfo.eligible ? 'Free Delivery' : `₹${zoneInfo.fee} Delivery`}
                      </p>
                      <p className="mt-0.5">{zoneInfo.message}</p>
                    </div>
                  )}
                </div>
              )}

              {/* Home Occasion Tag */}
              <div className="bg-white border border-[#E6E2D8] rounded-xl p-4 space-y-2.5">
                <p className="text-xs font-semibold uppercase tracking-wider text-[#5C5852]">
                  Order Purpose / Small Home Occasion
                </p>
                <div className="flex flex-wrap gap-2">
                  {[
                    'Everyday Order',
                    'Puja / Nam-Prasanga',
                    'Family Gathering',
                    'Birthday / Tea Party',
                    'Bihu / Celebration',
                  ].map((occ) => (
                    <button
                      key={occ}
                      type="button"
                      onClick={() => setOccasionType(occ)}
                      className={`px-3 py-1.5 rounded-md border text-xs font-medium cursor-pointer ${
                        occasionType === occ
                          ? 'border-[#8B1E24] bg-[#8B1E24]/[0.06] text-[#8B1E24]'
                          : 'border-[#E6E2D8] bg-[#FAF9F6] text-[#5C5852]'
                      }`}
                    >
                      {occ}
                    </button>
                  ))}
                </div>
              </div>

              {/* Date & Batch Time Window */}
              <div className="bg-white border border-[#E6E2D8] rounded-xl p-4 space-y-3">
                <p className="text-xs font-semibold uppercase tracking-wider text-[#5C5852]">
                  Select Date &amp; Time Window
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {dates.map((d) => (
                    <button
                      key={d.iso}
                      type="button"
                      onClick={() => setScheduledDate(d.iso)}
                      className={`py-2 px-2.5 rounded-md border text-xs font-medium text-center cursor-pointer ${
                        scheduledDate === d.iso
                          ? 'border-[#8B1E24] bg-[#8B1E24] text-white'
                          : 'border-[#E6E2D8] bg-[#FAF9F6] text-[#1A1917]'
                      }`}
                    >
                      {d.label}
                    </button>
                  ))}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                  {TIME_SLOTS.map((ts) => (
                    <button
                      key={ts.id}
                      type="button"
                      onClick={() => setScheduledSlot(ts.label)}
                      className={`p-2.5 rounded-md border text-left cursor-pointer ${
                        scheduledSlot === ts.label
                          ? 'border-[#8B1E24] bg-[#8B1E24]/[0.04]'
                          : 'border-[#E6E2D8] hover:border-[#C5BEB0]'
                      }`}
                    >
                      <p className="text-xs font-semibold text-[#1A1917] tabular-nums">{ts.label}</p>
                      <p className="text-[11px] text-[#5C5852]">{ts.period}</p>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: INTEGRATED PAYMENT GATEWAY */}
          {step === 'payment' && (
            <form id="payment-form" onSubmit={handlePlaceOrder} className="space-y-5">
              {/* Payable Summary */}
              <div className="bg-white border border-[#E6E2D8] rounded-xl p-4 space-y-2 text-sm">
                <div className="flex justify-between text-[#5C5852]">
                  <span>Sweets ({totalPieces} pcs × ₹10)</span>
                  <span className="font-mono tabular-nums text-[#1A1917]">₹{subtotal}</span>
                </div>
                <div className="flex justify-between text-[#5C5852]">
                  <span>{mode === 'pickup' ? 'Local Pickup Fee' : 'Home Delivery Fee'}</span>
                  <span className="font-mono tabular-nums text-[#1A1917]">
                    {deliveryFee === 0 ? 'Free' : `₹${deliveryFee}`}
                  </span>
                </div>
                <div className="pt-2 border-t border-[#E6E2D8] flex justify-between font-semibold text-[#1A1917]">
                  <span>Total Payable</span>
                  <span className="font-mono text-base tabular-nums">₹{grandTotal}</span>
                </div>
              </div>

              {/* Payment Method Tabs */}
              <div className="grid grid-cols-3 gap-2 p-1 rounded-lg bg-[#F3F1EC] border border-[#E6E2D8]">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('upi')}
                  className={`flex items-center justify-center gap-1.5 py-2.5 px-2 rounded-md text-xs font-medium cursor-pointer ${
                    paymentMethod === 'upi' ? 'bg-white text-[#1A1917] shadow-xs' : 'text-[#5C5852]'
                  }`}
                >
                  <QrCode className="w-3.5 h-3.5 text-[#8B1E24]" aria-hidden="true" />
                  <span>UPI / QR</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMethod('card')}
                  className={`flex items-center justify-center gap-1.5 py-2.5 px-2 rounded-md text-xs font-medium cursor-pointer ${
                    paymentMethod === 'card' ? 'bg-white text-[#1A1917] shadow-xs' : 'text-[#5C5852]'
                  }`}
                >
                  <CreditCard className="w-3.5 h-3.5 text-[#8B1E24]" aria-hidden="true" />
                  <span>Card</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMethod('cod')}
                  className={`flex items-center justify-center gap-1.5 py-2.5 px-2 rounded-md text-xs font-medium cursor-pointer ${
                    paymentMethod === 'cod' ? 'bg-white text-[#1A1917] shadow-xs' : 'text-[#5C5852]'
                  }`}
                >
                  <Wallet className="w-3.5 h-3.5 text-[#8B1E24]" aria-hidden="true" />
                  <span>{mode === 'pickup' ? 'Pay at Desk' : 'Cash (COD)'}</span>
                </button>
              </div>

              {/* UPI Panel */}
              {paymentMethod === 'upi' && (
                <div className="bg-white border border-[#E6E2D8] rounded-xl p-5 space-y-4">
                  <div className="flex flex-wrap gap-2">
                    {(['GPay', 'PhonePe', 'Paytm', 'QR'] as const).map((app) => (
                      <button
                        key={app}
                        type="button"
                        onClick={() => setUpiApp(app)}
                        className={`px-3 py-1.5 rounded-md border text-xs font-medium cursor-pointer ${
                          upiApp === app
                            ? 'border-[#8B1E24] bg-[#8B1E24]/[0.05] text-[#8B1E24]'
                            : 'border-[#E6E2D8] text-[#5C5852]'
                        }`}
                      >
                        {app}
                      </button>
                    ))}
                  </div>

                  <div className="flex flex-col sm:flex-row items-center gap-4 pt-1">
                    <SimpleQrVisual seed={`${paymentIntentId}-${grandTotal}`} />
                    <div className="flex-1 space-y-2 text-center sm:text-left">
                      <p className="text-xs text-[#5C5852]">Scan with any UPI app or pay to:</p>
                      <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-[#F3F1EC] border border-[#E6E2D8]">
                        <span className="font-mono text-xs font-medium text-[#1A1917]">suwodisweets@upi</span>
                        <button
                          type="button"
                          onClick={() => {
                            navigator.clipboard?.writeText('suwodisweets@upi');
                            setCopiedUpi(true);
                            setTimeout(() => setCopiedUpi(false), 1500);
                          }}
                          className="text-xs text-[#8B1E24] font-medium inline-flex items-center gap-1 cursor-pointer"
                        >
                          <Copy className="w-3 h-3" aria-hidden="true" />
                          <span>{copiedUpi ? 'Copied' : 'Copy'}</span>
                        </button>
                      </div>
                      <p className="text-[11px] text-[#8E887D] font-mono tabular-nums">
                        Ref: {paymentIntentId || 'PAY-READY'} · Amount: ₹{grandTotal}.00
                      </p>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="upi-utr" className="block text-xs font-medium text-[#1A1917] mb-1">
                      UPI Transaction / UTR Reference (Optional for instant checkout)
                    </label>
                    <input
                      id="upi-utr"
                      type="text"
                      value={upiTransactionRef}
                      onChange={(e) => setUpiTransactionRef(e.target.value)}
                      placeholder="12-digit UTR or leave blank for simulated instant pay"
                      className="w-full h-10 px-3 text-xs font-mono bg-[#FAF9F6] border border-[#D4CFC4] rounded-md focus:outline-none focus:border-[#8B1E24]"
                    />
                  </div>
                </div>
              )}

              {/* Card Panel */}
              {paymentMethod === 'card' && (
                <div className="bg-white border border-[#E6E2D8] rounded-xl p-5 space-y-3.5">
                  <div>
                    <label htmlFor="card-num" className="block text-xs font-medium text-[#1A1917] mb-1">
                      Card Number
                    </label>
                    <input
                      id="card-num"
                      type="text"
                      inputMode="numeric"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                      placeholder="4532 8810 2910 4242"
                      className="w-full h-10 px-3 text-sm font-mono bg-[#FAF9F6] border border-[#D4CFC4] rounded-md focus:outline-none focus:border-[#8B1E24]"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label htmlFor="card-exp" className="block text-xs font-medium text-[#1A1917] mb-1">
                        Expiry (MM/YY)
                      </label>
                      <input
                        id="card-exp"
                        type="text"
                        inputMode="numeric"
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(formatExpiry(e.target.value))}
                        placeholder="08/29"
                        className="w-full h-10 px-3 text-sm font-mono bg-[#FAF9F6] border border-[#D4CFC4] rounded-md focus:outline-none focus:border-[#8B1E24]"
                      />
                    </div>
                    <div>
                      <label htmlFor="card-cvv" className="block text-xs font-medium text-[#1A1917] mb-1">
                        CVV
                      </label>
                      <input
                        id="card-cvv"
                        type="password"
                        inputMode="numeric"
                        maxLength={4}
                        value={cardCvv}
                        onChange={(e) => setCardCvv(e.target.value.replace(/\D/g, ''))}
                        placeholder="•••"
                        className="w-full h-10 px-3 text-sm font-mono bg-[#FAF9F6] border border-[#D4CFC4] rounded-md focus:outline-none focus:border-[#8B1E24]"
                      />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="card-holder" className="block text-xs font-medium text-[#1A1917] mb-1">
                      Cardholder Name
                    </label>
                    <input
                      id="card-holder"
                      type="text"
                      value={cardHolder}
                      onChange={(e) => setCardHolder(e.target.value)}
                      placeholder={customerName || 'Name on card'}
                      className="w-full h-10 px-3 text-sm bg-[#FAF9F6] border border-[#D4CFC4] rounded-md focus:outline-none focus:border-[#8B1E24]"
                    />
                  </div>
                </div>
              )}

              {/* Cash on Delivery / Pay at Pickup Panel */}
              {paymentMethod === 'cod' && (
                <div className="bg-white border border-[#E6E2D8] rounded-xl p-5 space-y-2 text-sm">
                  <p className="font-semibold text-[#1A1917]">
                    {mode === 'pickup' ? 'Pay at Pickup Desk' : 'Cash / UPI on Home Delivery'}
                  </p>
                  <p className="text-xs text-[#5C5852] leading-relaxed">
                    Please keep <span className="font-mono font-semibold text-[#1A1917]">₹{grandTotal}</span> ready in
                    cash or scan our rider&apos;s UPI QR code when receiving your freshly packed sweets.
                  </p>
                </div>
              )}
            </form>
          )}

          {/* STEP 4: CONFIRMED RECEIPT */}
          {step === 'receipt' && confirmedOrder && (
            <div className="space-y-5">
              <div className="p-5 rounded-xl bg-[#F1F7F3] border border-[#C5DEC9] text-[#1F4A2D] space-y-1.5">
                <div className="flex items-center gap-2 font-semibold text-base">
                  <CheckCircle2 className="w-5 h-5 shrink-0" aria-hidden="true" />
                  <span>Order {confirmedOrder.orderId} Confirmed</span>
                </div>
                <p className="text-xs">
                  Thank you, {confirmedOrder.customerName}. Your fresh batch is scheduled for{' '}
                  <span className="font-semibold">{confirmedOrder.scheduledDate}</span> ({confirmedOrder.scheduledSlot}).
                </p>
              </div>

              <div className="bg-white border border-[#E6E2D8] rounded-xl p-5 space-y-4 text-sm">
                <div className="flex items-center justify-between border-b border-[#F3F1EC] pb-3">
                  <div>
                    <p className="text-xs text-[#5C5852]">Fulfillment</p>
                    <p className="font-semibold text-[#1A1917]">
                      {confirmedOrder.fulfillmentMode === 'pickup' ? 'Local Pickup' : 'Home Delivery'}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-[#5C5852]">Payment</p>
                    <p className="font-semibold text-[#1A1917]">
                      {confirmedOrder.paymentStatus === 'paid' ? 'Paid' : 'Pay on Fulfillment'} ·{' '}
                      {confirmedOrder.paymentMethod.toUpperCase()}
                    </p>
                  </div>
                </div>

                {confirmedOrder.pickupLocation && (
                  <div className="text-xs text-[#5C5852]">
                    <p className="font-semibold text-[#1A1917]">{confirmedOrder.pickupLocation.name}</p>
                    <p>{confirmedOrder.pickupLocation.address}</p>
                  </div>
                )}

                {confirmedOrder.deliveryAddress && (
                  <div className="text-xs text-[#5C5852]">
                    <p className="font-semibold text-[#1A1917]">Delivery Address</p>
                    <p>
                      {confirmedOrder.deliveryAddress.street}
                      {confirmedOrder.deliveryAddress.landmark ? `, ${confirmedOrder.deliveryAddress.landmark}` : ''},{' '}
                      {confirmedOrder.deliveryAddress.city} — {confirmedOrder.deliveryAddress.pincode}
                    </p>
                  </div>
                )}

                <div className="pt-2 border-t border-[#F3F1EC] space-y-2">
                  {confirmedOrder.items.map((item) => (
                    <div key={item.productId} className="flex justify-between text-xs">
                      <span className="text-[#1A1917]">
                        {item.name} ({item.quantity} pcs × ₹10)
                      </span>
                      <span className="font-mono tabular-nums font-medium">₹{item.lineTotal}</span>
                    </div>
                  ))}
                  <div className="flex justify-between text-xs text-[#5C5852] pt-2 border-t border-[#F3F1EC]">
                    <span>Delivery Fee</span>
                    <span className="font-mono tabular-nums">
                      {confirmedOrder.deliveryFee === 0 ? 'Free' : `₹${confirmedOrder.deliveryFee}`}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm font-semibold text-[#1A1917] pt-1">
                    <span>Total Amount</span>
                    <span className="font-mono tabular-nums">₹{confirmedOrder.totalAmount}</span>
                  </div>
                </div>

                {confirmedOrder.paymentReference && (
                  <p className="text-[11px] font-mono text-[#8E887D] pt-1">
                    Payment Ref: {confirmedOrder.paymentReference}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => {
                    const id = confirmedOrder.orderId;
                    handleCloseDrawer();
                    onTrackOrder(id);
                  }}
                  className="h-11 px-4 rounded-md bg-[#1A1917] hover:bg-[#33302B] text-white text-sm font-medium cursor-pointer"
                >
                  Track Order
                </button>
                <button
                  type="button"
                  onClick={handleCloseDrawer}
                  className="h-11 px-4 rounded-md border border-[#D4CFC4] bg-white hover:bg-[#F3F1EC] text-[#1A1917] text-sm font-medium cursor-pointer"
                >
                  Done
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Sticky Bottom CTA Footer */}
        {step !== 'receipt' && cart.length > 0 && (
          <div className="px-6 py-4 bg-white border-t border-[#E6E2D8] shrink-0">
            {step === 'bag' && (
              <button
                type="button"
                onClick={() => setStep('schedule')}
                className="w-full h-12 rounded-md bg-[#8B1E24] hover:bg-[#6E161B] text-white text-sm font-medium transition-colors tabular-nums cursor-pointer"
              >
                Schedule Pickup or Delivery · ₹{subtotal}
              </button>
            )}

            {step === 'schedule' && (
              <button
                type="button"
                onClick={goToPayment}
                className="w-full h-12 rounded-md bg-[#8B1E24] hover:bg-[#6E161B] text-white text-sm font-medium transition-colors tabular-nums cursor-pointer"
              >
                Continue to Payment · ₹{grandTotal}
              </button>
            )}

            {step === 'payment' && (
              <button
                type="submit"
                form="payment-form"
                disabled={submitting}
                className="w-full h-12 rounded-md bg-[#8B1E24] hover:bg-[#6E161B] text-white text-sm font-medium transition-colors tabular-nums cursor-pointer disabled:opacity-60"
              >
                {submitting
                  ? 'Confirming Order...'
                  : paymentMethod === 'cod'
                  ? `Confirm Order · Pay ₹${grandTotal} on ${mode === 'pickup' ? 'Pickup' : 'Delivery'}`
                  : `Authorize & Pay ₹${grandTotal}`}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
