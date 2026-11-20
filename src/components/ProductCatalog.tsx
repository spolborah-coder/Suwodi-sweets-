import { useMemo, useState } from 'react';
import { Check, Minus, Plus, Search, Phone } from 'lucide-react';
import { BULK_OCCASION_PACKS, type BulkOccasionPack } from '../data/catalog';
import type { CartItem, Product, ProductCategory } from '../types';
import { ResilientImage } from './ResilientImage';

interface ProductCatalogProps {
  products: Product[];
  cart: CartItem[];
  onAddToCart: (product: Product, quantity: number) => void;
  onAddBulkPack: (pack: BulkOccasionPack) => void;
  onSelectProduct: (product: Product) => void;
}

const PRESET_PIECES = [1, 5, 10, 20];

export function ProductCatalog({
  products,
  cart,
  onAddToCart,
  onAddBulkPack,
  onSelectProduct,
}: ProductCatalogProps) {
  const [category, setCategory] = useState<ProductCategory>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [quantities, setQuantities] = useState<Record<string, number>>(() => {
    const initial: Record<string, number> = {};
    for (const p of products) {
      initial[p.id] = 5;
    }
    return initial;
  });
  const [recentlyAdded, setRecentlyAdded] = useState<Record<string, boolean>>({});
  const [packAdded, setPackAdded] = useState<Record<string, boolean>>({});

  const filteredProducts = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return products.filter((item) => {
      const matchesCat = category === 'all' || item.category === category;
      if (!matchesCat) return false;
      if (!q) return true;
      return (
        item.name.toLowerCase().includes(q) ||
        item.assameseName.includes(q) ||
        item.subtitle.toLowerCase().includes(q) ||
        item.ingredients.some((ing) => ing.toLowerCase().includes(q))
      );
    });
  }, [products, category, searchQuery]);

  const getQty = (id: string) => quantities[id] ?? 5;

  const updateQty = (id: string, next: number) => {
    const clamped = Math.max(1, Math.min(1000, next));
    setQuantities((prev) => ({ ...prev, [id]: clamped }));
  };

  const handleAdd = (product: Product) => {
    const qty = getQty(product.id);
    onAddToCart(product, qty);
    setRecentlyAdded((prev) => ({ ...prev, [product.id]: true }));
    window.setTimeout(() => {
      setRecentlyAdded((prev) => ({ ...prev, [product.id]: false }));
    }, 1200);
  };

  const cartQtyFor = (id: string) => cart.find((c) => c.product.id === id)?.quantity ?? 0;

  return (
    <section id="menu" className="py-14 lg:py-20 border-b border-[#E6E2D8] bg-[#FAF9F6]">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        {/* Section Header + Interactive Filter Controls */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-8 border-b border-[#E6E2D8]">
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-[#8B1E24] mb-2">
              Daily Kitchen Menu
            </p>
            <h2
              className="font-display text-3xl lg:text-4xl font-semibold text-[#1A1917] tracking-tight"
              style={{ textWrap: 'balance' }}
            >
              Assamese Laru &amp; Pitha — ₹10 Per Piece
            </h2>
            <p className="text-sm text-[#5C5852] mt-2 max-w-xl">
              Select your exact piece count for every item. Mix and match single pieces or assemble custom boxes for
              family tea, guests, and Bihu celebrations.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            {/* Segmented Category Filter */}
            <div
              role="tablist"
              aria-label="Filter sweets by category"
              className="inline-flex items-center p-1 rounded-lg bg-[#F3F1EC] border border-[#E6E2D8]"
            >
              {[
                { id: 'all' as const, label: 'All Sweets' },
                { id: 'laru' as const, label: 'Laru (Laddus)' },
                { id: 'pitha' as const, label: 'Pitha (Rice Cakes)' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  role="tab"
                  aria-selected={category === tab.id}
                  type="button"
                  onClick={() => setCategory(tab.id)}
                  className={`px-3.5 py-2 text-xs font-medium rounded-md transition-colors duration-150 whitespace-nowrap shrink-0 cursor-pointer ${
                    category === tab.id
                      ? 'bg-white text-[#1A1917] shadow-xs'
                      : 'text-[#5C5852] hover:text-[#1A1917]'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Search Input */}
            <div className="relative">
              <Search
                className="w-4 h-4 text-[#5C5852] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
                aria-hidden="true"
              />
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search narikol, til, ghila..."
                aria-label="Search Assamese sweets"
                className="w-full sm:w-56 pl-9 pr-3 py-2 min-h-[40px] text-sm bg-white border border-[#E6E2D8] rounded-lg text-[#1A1917] placeholder:text-[#8E887D] focus:outline-none focus:border-[#8B1E24]"
              />
            </div>
          </div>
        </div>

        {/* 3-Column Uniform Product Grid */}
        {filteredProducts.length === 0 ? (
          <div className="py-16 text-center">
            <p className="text-base font-medium text-[#1A1917]">No sweets match "{searchQuery}"</p>
            <p className="text-sm text-[#5C5852] mt-1">
              Try clearing your search or switching back to All Sweets.
            </p>
            <button
              type="button"
              onClick={() => {
                setCategory('all');
                setSearchQuery('');
              }}
              className="mt-4 px-4 py-2 text-sm font-medium text-[#8B1E24] border border-[#8B1E24]/30 rounded-md hover:bg-[#8B1E24]/5 cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
            {filteredProducts.map((product) => {
              const qty = getQty(product.id);
              const inBag = cartQtyFor(product.id);
              const added = recentlyAdded[product.id];

              return (
                <article
                  key={product.id}
                  className="group bg-white border border-[#E6E2D8] rounded-xl overflow-hidden flex flex-col transition-transform duration-150 hover:-translate-y-0.5 hover:shadow-sm"
                >
                  {/* 4:3 Studio Product Photo */}
                  <button
                    type="button"
                    onClick={() => onSelectProduct(product)}
                    className="relative aspect-[4/3] w-full overflow-hidden bg-[#F3F1EC] text-left cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#8B1E24]"
                    aria-label={`View details for ${product.name}`}
                  >
                    <ResilientImage
                      src={product.image}
                      alt={`${product.name} (${product.assameseName}) studio food photograph`}
                      title={product.name}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                    />
                  </button>

                  {/* Product Metadata & Contiguous Quick-Order Controls */}
                  <div className="p-5 flex-1 flex flex-col justify-between gap-4">
                    <div>
                      <div className="flex items-center justify-between gap-2 text-xs text-[#5C5852] mb-1.5">
                        <span className="uppercase tracking-wider font-medium">
                          {product.category === 'laru' ? 'Laru' : 'Pitha'}
                          {product.tag ? ` · ${product.tag}` : ''}
                        </span>
                        {inBag > 0 && (
                          <span className="font-mono text-[#8B1E24] font-medium tabular-nums">
                            {inBag} in bag
                          </span>
                        )}
                      </div>

                      <button
                        type="button"
                        onClick={() => onSelectProduct(product)}
                        className="text-left block w-full cursor-pointer group/title"
                      >
                        <h3 className="text-lg font-semibold text-[#1A1917] group-hover/title:text-[#8B1E24] transition-colors leading-snug">
                          <span>{product.assameseName}</span>
                          <span className="text-[#8E887D] font-normal mx-1.5">·</span>
                          <span>{product.name}</span>
                        </h3>
                      </button>

                      <p className="text-xs text-[#5C5852] mt-1">{product.subtitle}</p>
                    </div>

                    <div className="pt-3 border-t border-[#F3F1EC] space-y-3">
                      {/* Price & Quick Piece Presets */}
                      <div className="flex items-center justify-between gap-3">
                        <div className="font-mono tabular-nums">
                          <span className="text-lg font-semibold text-[#1A1917]">₹{product.pricePerPiece}</span>
                          <span className="text-xs text-[#5C5852]"> / piece</span>
                        </div>

                        <div className="flex items-center gap-1" aria-label={`Quick piece presets for ${product.name}`}>
                          {PRESET_PIECES.map((preset) => (
                            <button
                              key={preset}
                              type="button"
                              onClick={() => updateQty(product.id, preset)}
                              className={`px-2 py-1 text-xs font-mono tabular-nums rounded transition-colors cursor-pointer ${
                                qty === preset
                                  ? 'bg-[#1A1917] text-white'
                                  : 'bg-[#F3F1EC] text-[#5C5852] hover:text-[#1A1917]'
                              }`}
                            >
                              {preset}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Stepper + Add to Bag CTA */}
                      <div className="flex items-center gap-2.5">
                        <div className="inline-flex items-center border border-[#D4CFC4] rounded-md bg-[#FAF9F6] h-10 shrink-0">
                          <button
                            type="button"
                            onClick={() => updateQty(product.id, qty - 1)}
                            aria-label={`Decrease ${product.name} pieces`}
                            className="w-9 h-full flex items-center justify-center text-[#5C5852] hover:text-[#1A1917] cursor-pointer"
                          >
                            <Minus className="w-3.5 h-3.5" aria-hidden="true" />
                          </button>
                          <span className="w-9 text-center text-sm font-mono font-medium text-[#1A1917] tabular-nums">
                            {qty}
                          </span>
                          <button
                            type="button"
                            onClick={() => updateQty(product.id, qty + 1)}
                            aria-label={`Increase ${product.name} pieces`}
                            className="w-9 h-full flex items-center justify-center text-[#5C5852] hover:text-[#1A1917] cursor-pointer"
                          >
                            <Plus className="w-3.5 h-3.5" aria-hidden="true" />
                          </button>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleAdd(product)}
                          className={`flex-1 h-10 px-4 rounded-md text-sm font-medium inline-flex items-center justify-center gap-1.5 transition-colors duration-150 whitespace-nowrap cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#8B1E24] ${
                            added
                              ? 'bg-[#2D5A3D] text-white'
                              : 'bg-[#8B1E24] hover:bg-[#6E161B] text-white'
                          }`}
                        >
                          {added ? (
                            <>
                              <Check className="w-4 h-4 shrink-0" aria-hidden="true" />
                              <span>Added</span>
                            </>
                          ) : (
                            <span className="tabular-nums">Add · ₹{qty * product.pricePerPiece}</span>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}

        {/* Bulk Orders for Small Home Occasions */}
        <div
          id="bulk-occasions"
          className="mt-14 pt-12 border-t border-[#E6E2D8]"
        >
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 mb-8">
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-[#8B1E24] mb-1.5">
                Small Home Occasions · Bulk Pre-Orders
              </p>
              <h3 className="font-display text-2xl lg:text-3xl font-semibold text-[#1A1917] tracking-tight">
                Curated Occasion Boxes for Family Gatherings &amp; Puja
              </h3>
              <p className="text-sm text-[#5C5852] mt-1.5 max-w-2xl">
                Hosting a Nam-Prasanga, Annaprashan, birthday tea, or Bihu get-together in Joysagar or Sivasagar?
                Add a ready-mixed bulk box at ₹10 per piece, or call{' '}
                <a href="tel:9864559530" className="font-mono font-medium text-[#1A1917] underline underline-offset-2">
                  +91 98645 59530
                </a>{' '}
                for custom 100+ piece batches.
              </p>
            </div>
            <div className="inline-flex items-center gap-2 text-xs text-[#5C5852] whitespace-nowrap">
              <Phone className="w-3.5 h-3.5 text-[#8B1E24]" aria-hidden="true" />
              <span className="font-mono tabular-nums text-[#1A1917] font-medium">9864559530</span>
              <span>· 12–24 hr notice for 100+ pcs</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {BULK_OCCASION_PACKS.map((pack) => {
              const isAdded = packAdded[pack.id];
              return (
                <div
                  key={pack.id}
                  className="bg-white border border-[#E6E2D8] rounded-xl p-6 flex flex-col justify-between gap-5"
                >
                  <div className="space-y-2">
                    <p className="text-xs text-[#8B1E24] font-medium">{pack.occasion}</p>
                    <h4 className="text-lg font-semibold text-[#1A1917]">{pack.title}</h4>
                    <p className="text-xs text-[#5C5852] leading-relaxed">{pack.description}</p>
                  </div>

                  <div className="pt-4 border-t border-[#F3F1EC] flex items-center justify-between gap-3">
                    <div className="font-mono tabular-nums">
                      <span className="text-lg font-semibold text-[#1A1917]">₹{pack.totalPrice}</span>
                      <span className="text-xs text-[#5C5852]"> · {pack.totalPieces} pcs</span>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        onAddBulkPack(pack);
                        setPackAdded((prev) => ({ ...prev, [pack.id]: true }));
                        window.setTimeout(() => {
                          setPackAdded((prev) => ({ ...prev, [pack.id]: false }));
                        }, 1400);
                      }}
                      className={`px-4 py-2 min-h-[40px] rounded-md text-xs font-medium inline-flex items-center gap-1.5 transition-colors whitespace-nowrap cursor-pointer ${
                        isAdded
                          ? 'bg-[#2D5A3D] text-white'
                          : 'bg-[#1A1917] hover:bg-[#33302B] text-white'
                      }`}
                    >
                      {isAdded ? (
                        <>
                          <Check className="w-3.5 h-3.5" aria-hidden="true" />
                          <span>Added Box</span>
                        </>
                      ) : (
                        <span>Add Box to Bag</span>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
