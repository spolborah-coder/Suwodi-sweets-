import { ArrowRight, CalendarClock } from 'lucide-react';
import { HERO_IMAGE } from '../data/catalog';
import { ResilientImage } from './ResilientImage';

interface HeroProps {
  onExploreMenu: () => void;
  onScheduleClick: () => void;
}

export function Hero({ onExploreMenu, onScheduleClick }: HeroProps) {
  return (
    <section id="top" className="border-b border-[#E6E2D8] bg-[#FAF9F6]">
      <div className="max-w-7xl mx-auto px-6 lg:px-10 py-10 lg:py-16">
        {/* Asymmetric 2-column split with matched height */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-stretch">
          <div className="lg:col-span-5 flex flex-col justify-between py-2">
            <div>
              <p className="text-sm font-medium text-[#8B1E24] tracking-wide mb-3">
                ঘৰুৱা অসমীয়া মিঠাই · Joysagar &amp; Sivasagar Home Kitchen
              </p>

              <h1
                className="font-display font-semibold text-[#1A1917] tracking-tight leading-[1.1] mb-5"
                style={{ fontSize: 'clamp(2.25rem, 4vw, 3.5rem)', textWrap: 'balance' }}
              >
                Homemade Assamese Laru &amp; Pitha, Rolled Fresh Daily.
              </h1>

              <p className="text-base text-[#5C5852] leading-relaxed max-w-lg mb-8">
                Authentic <span className="text-[#1A1917] font-medium">নাৰিকলৰ লাৰু</span> (Narikolor Laru), crisp{' '}
                <span className="text-[#1A1917] font-medium">তিল পিঠা</span> (Til Pitha), and golden{' '}
                <span className="text-[#1A1917] font-medium">ঘিলা পিঠা</span> crafted in small morning batches with
                Assamese Bora rice, roasted black sesame, and pure cane jaggery.
              </p>
            </div>

            <div className="space-y-6">
              <div className="flex flex-wrap items-center gap-4">
                <button
                  type="button"
                  onClick={onExploreMenu}
                  className="inline-flex items-center justify-center gap-2.5 px-6 py-3 min-h-[44px] rounded-md bg-[#8B1E24] hover:bg-[#6E161B] text-white text-sm font-medium transition-colors duration-150 whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#8B1E24]"
                >
                  <span>Order Sweets · ₹10 / Piece</span>
                  <ArrowRight className="w-4 h-4 shrink-0" aria-hidden="true" />
                </button>

                <button
                  type="button"
                  onClick={onScheduleClick}
                  className="inline-flex items-center justify-center gap-2 px-5 py-3 min-h-[44px] rounded-md border border-[#D4CFC4] bg-white hover:bg-[#F3F1EC] text-[#1A1917] text-sm font-medium transition-colors duration-150 whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#8B1E24]"
                >
                  <CalendarClock className="w-4 h-4 text-[#8B1E24] shrink-0" aria-hidden="true" />
                  <span>Schedule Pickup or Delivery</span>
                </button>
              </div>

              <p className="text-xs text-[#5C5852]">
                Every piece across our entire menu is flat-priced at{' '}
                <span className="font-mono font-medium text-[#1A1917] tabular-nums">₹10</span> · Order any mix from 1
                piece to festive platters.
              </p>
            </div>
          </div>

          <div className="lg:col-span-7">
            <div className="h-full min-h-[280px] lg:min-h-[440px] rounded-xl overflow-hidden border border-[#E6E2D8] bg-[#F3F1EC]">
              <ResilientImage
                src={HERO_IMAGE}
                alt="Traditional Assamese Narikolor Laru, Til Pitha, and Ghila Pitha served on brass platters with banana leaves"
                title="Suwodi Sweets Assamese Festive Platter"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>

        {/* Full-width 4-column commitment strip below hero split */}
        <div className="mt-10 pt-8 border-t border-[#E6E2D8] grid grid-cols-2 lg:grid-cols-4 gap-6">
          <div>
            <p className="font-mono text-lg font-semibold text-[#1A1917] tabular-nums">₹10 / piece</p>
            <p className="text-xs text-[#5C5852] mt-1">Uniform honest pricing on all laru &amp; pitha varieties</p>
          </div>
          <div>
            <p className="text-base font-semibold text-[#1A1917]">Morning-Fresh Batches</p>
            <p className="text-xs text-[#5C5852] mt-1">Prepared daily without preservatives or refined sugar</p>
          </div>
          <div>
            <p className="text-base font-semibold text-[#1A1917]">Same-Day Local Pickup</p>
            <p className="text-xs text-[#5C5852] mt-1">Loonpuri Gaon, Kaloogaon (785666) &amp; Joysagar</p>
          </div>
          <div>
            <p className="text-base font-semibold text-[#1A1917]">Sivasagar &amp; Joysagar Delivery</p>
            <p className="text-xs text-[#5C5852] mt-1">Sivasagar district only · Free on orders ₹200+</p>
          </div>
        </div>
      </div>
    </section>
  );
}
