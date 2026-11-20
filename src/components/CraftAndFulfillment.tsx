import { useState } from 'react';
import { CheckCircle2, MapPin, Store, Truck, AlertCircle } from 'lucide-react';
import { CRAFT_IMAGE, PICKUP_LOCATIONS, TIME_SLOTS } from '../data/catalog';
import type { DeliveryZoneResult, FulfillmentMode } from '../types';
import { ResilientImage } from './ResilientImage';

interface CraftAndFulfillmentProps {
  preferredMode: FulfillmentMode;
  selectedPickupId: string;
  selectedSlot: string;
  onSelectSchedule: (mode: FulfillmentMode, pickupId: string, slot: string, pincode?: string) => void;
  onProceedToBag: () => void;
}

export function CraftAndFulfillment({
  preferredMode,
  selectedPickupId,
  selectedSlot,
  onSelectSchedule,
  onProceedToBag,
}: CraftAndFulfillmentProps) {
  const [mode, setMode] = useState<FulfillmentMode>(preferredMode);
  const [pickupId, setPickupId] = useState(selectedPickupId);
  const [slot, setSlot] = useState(selectedSlot);
  const [pincode, setPincode] = useState('785666');
  const [zoneResult, setZoneResult] = useState<DeliveryZoneResult | null>(null);
  const [checkingPin, setCheckingPin] = useState(false);

  const handleModeChange = (next: FulfillmentMode) => {
    setMode(next);
    onSelectSchedule(next, pickupId, slot, pincode);
  };

  const handleCheckPincode = async (e: React.FormEvent) => {
    e.preventDefault();
    setCheckingPin(true);
    try {
      const res = await fetch('/api/delivery/check-pincode', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pincode, subtotal: 200 }),
      });
      const data = (await res.json()) as DeliveryZoneResult;
      setZoneResult(data);
      onSelectSchedule('delivery', pickupId, slot, pincode);
    } catch {
      setZoneResult({
        eligible: false,
        zoneName: 'Check Unavailable',
        fee: 0,
        freeThreshold: 200,
        estimatedEta: '—',
        message: 'Could not verify PIN code right now. You can verify during checkout.',
      });
    } finally {
      setCheckingPin(false);
    }
  };

  return (
    <section id="craft" className="py-14 lg:py-20 bg-[#F3F1EC]">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-stretch">
          {/* Left Column: Craftsmanship Story */}
          <div className="lg:col-span-6 flex flex-col justify-between bg-white border border-[#E6E2D8] rounded-xl overflow-hidden">
            <div className="aspect-[4/3] w-full bg-[#E6E2D8]">
              <ResilientImage
                src={CRAFT_IMAGE}
                alt="Freshly grated coconut in a traditional brass bowl, black sesame seeds, jaggery blocks, and handmade pithas on banana leaf"
                title="Suwodi Sweets Home Kitchen Craft"
                className="w-full h-full object-cover"
              />
            </div>

            <div className="p-6 lg:p-8 space-y-4">
              <p className="text-xs font-medium uppercase tracking-wider text-[#8B1E24]">
                Traditional Kitchen Craft
              </p>
              <h2 className="font-display text-2xl lg:text-3xl font-semibold text-[#1A1917] tracking-tight">
                Real Bora Rice, Black Sesame &amp; Cane Jaggery — Never Shortcuts.
              </h2>
              <p className="text-sm text-[#5C5852] leading-relaxed">
                Every morning at 6:00 AM, we grate fresh coconuts, slow-roast <em className="not-italic text-[#1A1917]">kola til</em> in
                cast-iron pans, and stone-mill soaked Assamese Bora rice. Nothing sits on warehouse shelves—your pieces
                are packed warm right before your scheduled pickup or dispatch window.
              </p>

              <div className="pt-3 border-t border-[#F3F1EC] grid grid-cols-3 gap-4 text-xs">
                <div>
                  <p className="font-semibold text-[#1A1917]">Zero Refined Sugar</p>
                  <p className="text-[#5C5852] mt-0.5">Sweetened with pure Assam gur</p>
                </div>
                <div>
                  <p className="font-semibold text-[#1A1917]">Freshly Ground</p>
                  <p className="text-[#5C5852] mt-0.5">Sticky Bora &amp; aromatic Joha rice</p>
                </div>
                <div>
                  <p className="font-semibold text-[#1A1917]">Hygienic Packing</p>
                  <p className="text-[#5C5852] mt-0.5">Food-grade kraft &amp; airtight boxes</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Pickup & Delivery Scheduler */}
          <div
            id="fulfillment"
            className="lg:col-span-6 bg-white border border-[#E6E2D8] rounded-xl p-6 lg:p-8 flex flex-col justify-between"
          >
            <div className="space-y-6">
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-[#8B1E24] mb-2">
                  Seamless Scheduling
                </p>
                <h2 className="font-display text-2xl lg:text-3xl font-semibold text-[#1A1917] tracking-tight">
                  Plan Your Local Pickup or Home Delivery
                </h2>
                <p className="text-sm text-[#5C5852] mt-2">
                  Choose how you want to receive your sweets and lock in a convenient 2-hour kitchen batch window.
                </p>
              </div>

              {/* Segmented Mode Switcher */}
              <div className="grid grid-cols-2 gap-2 p-1 rounded-lg bg-[#F3F1EC] border border-[#E6E2D8]">
                <button
                  type="button"
                  onClick={() => handleModeChange('pickup')}
                  className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-md text-sm font-medium transition-colors cursor-pointer ${
                    mode === 'pickup'
                      ? 'bg-white text-[#1A1917] shadow-xs'
                      : 'text-[#5C5852] hover:text-[#1A1917]'
                  }`}
                >
                  <Store className="w-4 h-4 text-[#8B1E24] shrink-0" aria-hidden="true" />
                  <span>Local Pickup (Free)</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleModeChange('delivery')}
                  className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-md text-sm font-medium transition-colors cursor-pointer ${
                    mode === 'delivery'
                      ? 'bg-white text-[#1A1917] shadow-xs'
                      : 'text-[#5C5852] hover:text-[#1A1917]'
                  }`}
                >
                  <Truck className="w-4 h-4 text-[#8B1E24] shrink-0" aria-hidden="true" />
                  <span>Home Delivery</span>
                </button>
              </div>

              {mode === 'pickup' ? (
                <div className="space-y-3">
                  <p className="text-xs font-semibold uppercase tracking-wider text-[#5C5852]">
                    Select Pickup Point
                  </p>
                  {PICKUP_LOCATIONS.map((loc) => (
                    <button
                      key={loc.id}
                      type="button"
                      onClick={() => {
                        setPickupId(loc.id);
                        onSelectSchedule('pickup', loc.id, slot);
                      }}
                      className={`w-full text-left p-4 rounded-lg border transition-colors cursor-pointer ${
                        pickupId === loc.id
                          ? 'border-[#8B1E24] bg-[#8B1E24]/[0.03]'
                          : 'border-[#E6E2D8] hover:border-[#C5BEB0]'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="text-sm font-semibold text-[#1A1917]">{loc.name}</p>
                          <p className="text-xs text-[#5C5852] mt-1">{loc.address}</p>
                          <p className="text-xs text-[#8E887D] mt-0.5">
                            {loc.landmark} · {loc.hours}
                          </p>
                        </div>
                        <MapPin
                          className={`w-4 h-4 shrink-0 mt-0.5 ${
                            pickupId === loc.id ? 'text-[#8B1E24]' : 'text-[#8E887D]'
                          }`}
                          aria-hidden="true"
                        />
                      </div>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  <form onSubmit={handleCheckPincode} className="space-y-2">
                    <label htmlFor="planner-pincode" className="block text-xs font-semibold uppercase tracking-wider text-[#5C5852]">
                      Check Sivasagar District &amp; Joysagar PIN Code
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        id="planner-pincode"
                        type="text"
                        inputMode="numeric"
                        maxLength={6}
                        value={pincode}
                        onChange={(e) => setPincode(e.target.value.replace(/\D/g, ''))}
                        placeholder="e.g. 785666"
                        className="flex-1 h-10 px-3 text-sm font-mono bg-[#FAF9F6] border border-[#D4CFC4] rounded-md text-[#1A1917] focus:outline-none focus:border-[#8B1E24]"
                      />
                      <button
                        type="submit"
                        disabled={checkingPin}
                        className="h-10 px-4 rounded-md bg-[#1A1917] hover:bg-[#33302B] text-white text-xs font-medium whitespace-nowrap cursor-pointer disabled:opacity-60"
                      >
                        {checkingPin ? 'Checking...' : 'Check PIN'}
                      </button>
                    </div>
                  </form>

                  {zoneResult ? (
                    <div
                      className={`p-3.5 rounded-lg border text-xs flex items-start gap-2.5 ${
                        zoneResult.eligible
                          ? 'bg-[#F1F7F3] border-[#C5DEC9] text-[#1F4A2D]'
                          : 'bg-[#FDF3F2] border-[#EFC6C3] text-[#8B1E24]'
                      }`}
                    >
                      {zoneResult.eligible ? (
                        <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" aria-hidden="true" />
                      ) : (
                        <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" aria-hidden="true" />
                      )}
                      <div>
                        <p className="font-semibold">
                          {zoneResult.zoneName} · {zoneResult.estimatedEta}
                        </p>
                        <p className="mt-0.5">{zoneResult.message}</p>
                      </div>
                    </div>
                  ) : (
                    <p className="text-xs text-[#5C5852]">
                      Available exclusively in <span className="font-medium text-[#1A1917]">Sivasagar District &amp; Joysagar area</span> (PINs 785666, 785665, 785640–785705) —{' '}
                      <span className="font-medium text-[#1A1917]">Free Delivery on orders ₹200+ (20+ pieces)</span>.
                    </p>
                  )}
                </div>
              )}

              {/* Batch Slot Selector */}
              <div className="space-y-2.5">
                <p className="text-xs font-semibold uppercase tracking-wider text-[#5C5852]">
                  Preferred Batch Window
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {TIME_SLOTS.map((ts) => (
                    <button
                      key={ts.id}
                      type="button"
                      onClick={() => {
                        setSlot(ts.label);
                        onSelectSchedule(mode, pickupId, ts.label, pincode);
                      }}
                      className={`p-3 rounded-lg border text-left transition-colors cursor-pointer ${
                        slot === ts.label
                          ? 'border-[#8B1E24] bg-[#8B1E24]/[0.03]'
                          : 'border-[#E6E2D8] hover:border-[#C5BEB0]'
                      }`}
                    >
                      <p className="text-xs font-semibold text-[#1A1917] tabular-nums">{ts.label}</p>
                      <p className="text-[11px] text-[#5C5852] mt-0.5">{ts.period}</p>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-6 pt-5 border-t border-[#E6E2D8] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <p className="text-xs text-[#5C5852]">
                Saved: <span className="font-medium text-[#1A1917]">{mode === 'pickup' ? 'Local Pickup' : 'Home Delivery'}</span> ·{' '}
                <span className="tabular-nums">{slot}</span>
              </p>
              <button
                type="button"
                onClick={onProceedToBag}
                className="w-full sm:w-auto px-5 py-2.5 min-h-[42px] rounded-md bg-[#8B1E24] hover:bg-[#6E161B] text-white text-sm font-medium transition-colors whitespace-nowrap cursor-pointer"
              >
                Open Bag &amp; Checkout
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
