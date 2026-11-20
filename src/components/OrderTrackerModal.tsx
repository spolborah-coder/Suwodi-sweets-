import { useEffect, useState } from 'react';
import { CheckCircle2, Clock, PackageCheck, Search, Truck, X } from 'lucide-react';
import type { OrderReceipt, OrderStage } from '../types';

interface OrderTrackerModalProps {
  isOpen: boolean;
  initialOrderId?: string;
  recentOrders: OrderReceipt[];
  onClose: () => void;
}

const STAGE_ORDER: OrderStage[] = ['confirmed', 'preparing', 'ready', 'completed'];

export function OrderTrackerModal({
  isOpen,
  initialOrderId,
  recentOrders,
  onClose,
}: OrderTrackerModalProps) {
  const [queryId, setQueryId] = useState(initialOrderId || 'SWD-1042');
  const [order, setOrder] = useState<OrderReceipt | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchOrder = async (idToFetch: string) => {
    const clean = idToFetch.trim().toUpperCase();
    if (!clean) return;
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`/api/orders/${encodeURIComponent(clean)}`);
      const data = await res.json();
      if (!res.ok) {
        setOrder(null);
        setError(data.error || `Order ${clean} not found.`);
      } else {
        setOrder(data.order as OrderReceipt);
      }
    } catch {
      setError('Could not load order status right now.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isOpen) return;
    const target = initialOrderId || recentOrders[0]?.orderId || 'SWD-1042';
    setQueryId(target);
    fetchOrder(target);
  }, [isOpen, initialOrderId, recentOrders]);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const currentStageIdx = order ? STAGE_ORDER.indexOf(order.stage) : 0;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-[2px]"
      role="dialog"
      aria-modal="true"
      aria-labelledby="tracker-title"
      onClick={onClose}
    >
      <div
        className="w-full max-w-xl bg-[#FAF9F6] border border-[#E6E2D8] rounded-xl overflow-hidden shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-6 py-4 bg-white border-b border-[#E6E2D8] flex items-center justify-between">
          <div>
            <h2 id="tracker-title" className="font-display text-xl font-semibold text-[#1A1917]">
              Track Your Sweets Order
            </h2>
            <p className="text-xs text-[#5C5852]">Live batch &amp; dispatch status from Suwodi Home Kitchen</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close order tracker"
            className="w-9 h-9 rounded-md border border-[#E6E2D8] flex items-center justify-center text-[#5C5852] hover:text-[#1A1917] cursor-pointer"
          >
            <X className="w-4 h-4" aria-hidden="true" />
          </button>
        </div>

        <div className="p-6 space-y-5">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              fetchOrder(queryId);
            }}
            className="flex items-center gap-2"
          >
            <div className="relative flex-1">
              <Search
                className="w-4 h-4 text-[#5C5852] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
                aria-hidden="true"
              />
              <input
                type="text"
                value={queryId}
                onChange={(e) => setQueryId(e.target.value.toUpperCase())}
                placeholder="Enter Order ID (e.g. SWD-1042)"
                aria-label="Order ID"
                className="w-full h-10 pl-9 pr-3 text-sm font-mono bg-white border border-[#D4CFC4] rounded-md text-[#1A1917] focus:outline-none focus:border-[#8B1E24]"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="h-10 px-4 rounded-md bg-[#8B1E24] hover:bg-[#6E161B] text-white text-sm font-medium cursor-pointer disabled:opacity-60"
            >
              {loading ? 'Looking up...' : 'Check Status'}
            </button>
          </form>

          {recentOrders.length > 0 && (
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className="text-[#5C5852]">Your recent:</span>
              {recentOrders.slice(0, 4).map((ro) => (
                <button
                  key={ro.orderId}
                  type="button"
                  onClick={() => {
                    setQueryId(ro.orderId);
                    fetchOrder(ro.orderId);
                  }}
                  className={`px-2.5 py-1 rounded border font-mono cursor-pointer ${
                    order?.orderId === ro.orderId
                      ? 'border-[#8B1E24] bg-[#8B1E24]/[0.06] text-[#8B1E24]'
                      : 'border-[#E6E2D8] bg-white text-[#1A1917]'
                  }`}
                >
                  {ro.orderId}
                </button>
              ))}
            </div>
          )}

          {error && (
            <div className="p-4 rounded-lg bg-[#FDF3F2] border border-[#EFC6C3] text-xs text-[#8B1E24]">
              {error}
            </div>
          )}

          {order && !error && (
            <div className="bg-white border border-[#E6E2D8] rounded-xl p-5 space-y-5">
              <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-[#F3F1EC]">
                <div>
                  <p className="font-mono text-base font-semibold text-[#1A1917]">{order.orderId}</p>
                  <p className="text-xs text-[#5C5852]">
                    {order.customerName} · {order.scheduledDate} ({order.scheduledSlot})
                  </p>
                </div>
                <span className="text-xs font-medium px-2.5 py-1 rounded bg-[#F3F1EC] text-[#1A1917]">
                  {order.fulfillmentMode === 'pickup' ? 'Local Pickup' : 'Home Delivery'}
                </span>
              </div>

              {/* 4-Stage Stepper */}
              <div className="grid grid-cols-4 gap-2 text-center">
                {[
                  { key: 'confirmed', label: 'Confirmed', icon: CheckCircle2 },
                  { key: 'preparing', label: 'Fresh Batch', icon: Clock },
                  {
                    key: 'ready',
                    label: order.fulfillmentMode === 'pickup' ? 'Ready at Desk' : 'Out for Delivery',
                    icon: Truck,
                  },
                  { key: 'completed', label: 'Completed', icon: PackageCheck },
                ].map((stage, idx) => {
                  const Icon = stage.icon;
                  const active = idx <= currentStageIdx;
                  return (
                    <div key={stage.key} className="space-y-1.5">
                      <div
                        className={`w-8 h-8 rounded-full mx-auto flex items-center justify-center border ${
                          active
                            ? 'bg-[#8B1E24] border-[#8B1E24] text-white'
                            : 'bg-[#FAF9F6] border-[#E6E2D8] text-[#8E887D]'
                        }`}
                      >
                        <Icon className="w-4 h-4" aria-hidden="true" />
                      </div>
                      <p className={`text-[11px] font-medium ${active ? 'text-[#1A1917]' : 'text-[#8E887D]'}`}>
                        {stage.label}
                      </p>
                    </div>
                  );
                })}
              </div>

              <div className="pt-3 border-t border-[#F3F1EC] space-y-1.5 text-xs">
                {order.items.map((item) => (
                  <div key={item.productId} className="flex justify-between">
                    <span className="text-[#5C5852]">
                      {item.name} × {item.quantity} pcs
                    </span>
                    <span className="font-mono tabular-nums text-[#1A1917]">₹{item.lineTotal}</span>
                  </div>
                ))}
                <div className="flex justify-between font-semibold text-sm text-[#1A1917] pt-2 border-t border-[#F3F1EC]">
                  <span>Total ({order.paymentStatus === 'paid' ? 'Paid' : 'Pay on Fulfillment'})</span>
                  <span className="font-mono tabular-nums">₹{order.totalAmount}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
