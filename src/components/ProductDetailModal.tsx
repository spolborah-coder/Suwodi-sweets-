import { useEffect, useState } from 'react';
import { Minus, Plus, X } from 'lucide-react';
import type { Product } from '../types';
import { ResilientImage } from './ResilientImage';

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
  onAddToCart: (product: Product, quantity: number) => void;
}

export function ProductDetailModal({ product, onClose, onAddToCart }: ProductDetailModalProps) {
  const [quantity, setQuantity] = useState(10);

  useEffect(() => {
    if (product) {
      setQuantity(10);
    }
  }, [product]);

  useEffect(() => {
    if (!product) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [product, onClose]);

  if (!product) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/50 backdrop-blur-[2px]"
      role="dialog"
      aria-modal="true"
      aria-labelledby="pdp-title"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-3xl bg-[#FAF9F6] border border-[#E6E2D8] rounded-xl overflow-hidden shadow-xl grid grid-cols-1 md:grid-cols-12"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close product details"
          className="absolute top-3.5 right-3.5 z-10 w-9 h-9 rounded-full bg-white/95 border border-[#E6E2D8] flex items-center justify-center text-[#1A1917] hover:bg-[#F3F1EC] cursor-pointer"
        >
          <X className="w-4 h-4" aria-hidden="true" />
        </button>

        <div className="md:col-span-6 bg-[#F3F1EC] min-h-[260px]">
          <ResilientImage
            src={product.image}
            alt={`${product.name} (${product.assameseName})`}
            title={product.name}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="md:col-span-6 p-6 sm:p-8 flex flex-col justify-between gap-6">
          <div>
            <p className="text-xs uppercase tracking-wider text-[#8B1E24] font-medium">
              {product.category === 'laru' ? 'Homemade Laru' : 'Homemade Pitha'} · {product.dietaryNote}
            </p>
            <h2 id="pdp-title" className="font-display text-2xl font-semibold text-[#1A1917] mt-1.5">
              {product.assameseName} · {product.name}
            </h2>

            <p className="mt-2 font-mono text-lg font-semibold text-[#1A1917] tabular-nums">
              ₹{product.pricePerPiece} <span className="text-xs font-sans font-normal text-[#5C5852]">per piece</span>
            </p>

            <p className="text-sm text-[#5C5852] leading-relaxed mt-4">{product.description}</p>

            <div className="mt-5 pt-4 border-t border-[#E6E2D8] space-y-2.5 text-xs">
              <div>
                <span className="font-semibold text-[#1A1917]">Ingredients: </span>
                <span className="text-[#5C5852]">{product.ingredients.join(', ')}</span>
              </div>
              <div>
                <span className="font-semibold text-[#1A1917]">Freshness &amp; Storage: </span>
                <span className="text-[#5C5852]">{product.shelfLife}</span>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-[#E6E2D8] space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-[#5C5852]">Choose Pieces</span>
              <div className="flex items-center gap-1.5">
                {[1, 5, 10, 20, 50].map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => setQuantity(preset)}
                    className={`px-2 py-1 text-xs font-mono tabular-nums rounded cursor-pointer ${
                      quantity === preset
                        ? 'bg-[#1A1917] text-white'
                        : 'bg-[#F3F1EC] text-[#5C5852] hover:text-[#1A1917]'
                    }`}
                  >
                    {preset}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="inline-flex items-center border border-[#D4CFC4] rounded-md bg-white h-11">
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  aria-label="Decrease pieces"
                  className="w-10 h-full flex items-center justify-center text-[#5C5852] hover:text-[#1A1917] cursor-pointer"
                >
                  <Minus className="w-4 h-4" aria-hidden="true" />
                </button>
                <span className="w-10 text-center text-sm font-mono font-semibold tabular-nums">{quantity}</span>
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.min(1000, q + 1))}
                  aria-label="Increase pieces"
                  className="w-10 h-full flex items-center justify-center text-[#5C5852] hover:text-[#1A1917] cursor-pointer"
                >
                  <Plus className="w-4 h-4" aria-hidden="true" />
                </button>
              </div>

              <button
                type="button"
                onClick={() => {
                  onAddToCart(product, quantity);
                  onClose();
                }}
                className="flex-1 h-11 px-5 rounded-md bg-[#8B1E24] hover:bg-[#6E161B] text-white text-sm font-medium transition-colors tabular-nums cursor-pointer"
              >
                Add {quantity} {quantity === 1 ? 'Piece' : 'Pieces'} — ₹{quantity * product.pricePerPiece}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
