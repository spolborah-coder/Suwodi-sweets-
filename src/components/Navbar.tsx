import { ShoppingBag } from 'lucide-react';

interface NavbarProps {
  totalPieces: number;
  subtotal: number;
  onOpenCart: () => void;
  onOpenTracker: () => void;
}

export function Navbar({ totalPieces, subtotal, onOpenCart, onOpenTracker }: NavbarProps) {
  return (
    <header className="sticky top-0 z-40 bg-[#FAF9F6]/95 backdrop-blur-sm border-b border-[#E6E2D8]">
      <div className="max-w-7xl mx-auto px-6 lg:px-10 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Single text element wordmark */}
        <a
          href="#top"
          className="font-display text-xl lg:text-2xl font-semibold tracking-tight text-[#1A1917] whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8B1E24] rounded-sm"
        >
          Suwodi Sweets
        </a>

        {/* Zone 2: Concise single-line navigation links */}
        <nav
          aria-label="Primary navigation"
          className="hidden md:flex items-center gap-7 text-sm font-medium text-[#5C5852]"
        >
          <a
            href="#menu"
            className="hover:text-[#1A1917] hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
          >
            Menu
          </a>
          <a
            href="#craft"
            className="hover:text-[#1A1917] hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
          >
            Our Craft
          </a>
          <a
            href="#fulfillment"
            className="hover:text-[#1A1917] hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
          >
            Pickup &amp; Delivery
          </a>
          <button
            type="button"
            onClick={onOpenTracker}
            className="hover:text-[#1A1917] hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            Track Order
          </button>
        </nav>

        {/* Zone 3: Single primary action button */}
        <div className="flex items-center shrink-0">
          <button
            type="button"
            onClick={onOpenCart}
            className="inline-flex items-center gap-2.5 px-4 py-2.5 min-h-[40px] rounded-md bg-[#8B1E24] hover:bg-[#6E161B] text-white text-sm font-medium transition-colors duration-150 whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#8B1E24]"
          >
            <ShoppingBag className="w-4 h-4 shrink-0" aria-hidden="true" />
            <span className="tabular-nums">
              {totalPieces > 0 ? `Bag (${totalPieces}) · ₹${subtotal}` : 'Order Bag'}
            </span>
          </button>
        </div>
      </div>
    </header>
  );
}
