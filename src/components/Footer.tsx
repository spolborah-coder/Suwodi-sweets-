import { MapPin, Phone, Clock } from 'lucide-react';

interface FooterProps {
  onOpenTracker: () => void;
  onOpenCart: () => void;
}

export function Footer({ onOpenTracker, onOpenCart }: FooterProps) {
  return (
    <footer className="bg-[#1A1917] text-[#E6E2D8] border-t border-[#2E2C28]">
      <div className="max-w-7xl mx-auto px-6 lg:px-10 py-14">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
          <div className="md:col-span-5 space-y-3">
            <h2 className="font-display text-2xl font-semibold text-white">Suwodi Sweets</h2>
            <p className="text-sm text-[#B8B2A6] leading-relaxed max-w-sm">
              Homemade Assamese ethnic sweets and pithas—crafted in small family batches in Loonpuri Gaon, Kaloogaon
              (Joysagar, Sivasagar) with pure jaggery, Bora sticky rice, and fresh coconut.
            </p>
            <p className="text-xs text-[#8E887D] pt-1">সুবদী মিঠাই · ঘৰুৱা লাৰু আৰু পিঠা</p>
          </div>

          <div className="md:col-span-4 space-y-3 text-sm text-[#B8B2A6]">
            <h3 className="text-sm font-semibold text-white">Home Kitchen &amp; Service Area</h3>
            <div className="flex items-start gap-2.5">
              <MapPin className="w-4 h-4 text-[#B08938] shrink-0 mt-0.5" aria-hidden="true" />
              <span>Loonpuri Gaon, Kaloogaon, Joysagar, Sivasagar District, Assam 785666</span>
            </div>
            <div className="flex items-center gap-2.5">
              <Clock className="w-4 h-4 text-[#B08938] shrink-0" aria-hidden="true" />
              <span>Daily · 08:30 AM – 08:30 PM (Sivasagar &amp; Joysagar Only)</span>
            </div>
            <div className="flex items-center gap-2.5">
              <Phone className="w-4 h-4 text-[#B08938] shrink-0" aria-hidden="true" />
              <span className="tabular-nums">+91 98645 59530 · Bulk &amp; Home Occasions</span>
            </div>
          </div>

          <div className="md:col-span-3 space-y-2.5 text-sm">
            <h3 className="text-sm font-semibold text-white mb-3">Quick Actions</h3>
            <ul className="space-y-2 text-[#B8B2A6]">
              <li>
                <a href="#menu" className="hover:text-white transition-colors">
                  Browse Sweets Menu
                </a>
              </li>
              <li>
                <a href="#bulk-occasions" className="hover:text-white transition-colors">
                  Bulk Home Occasion Boxes
                </a>
              </li>
              <li>
                <a href="#fulfillment" className="hover:text-white transition-colors">
                  Sivasagar &amp; Joysagar Delivery
                </a>
              </li>
              <li>
                <button
                  type="button"
                  onClick={onOpenCart}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Open Order Bag
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={onOpenTracker}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Track Existing Order
                </button>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-[#2E2C28] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs text-[#8E887D]">
          <p>© {new Date().getFullYear()} Suwodi Sweets · Loonpuri Gaon, Kaloogaon, Sivasagar.</p>
          <p>Flat ₹10 per piece · Sivasagar District &amp; Joysagar Area Only</p>
        </div>
      </div>
    </footer>
  );
}
