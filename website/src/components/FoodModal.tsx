'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { FoodItem, FoodAddon } from '@/types/restaurant';
import { useCart } from '@/context/CartContext';
import SpiceMeter from './SpiceMeter';
import { X, Plus, Minus, Clock, Flame, Check, Sparkles } from 'lucide-react';

interface FoodModalProps {
  food: FoodItem | null;
  onClose: () => void;
}

export default function FoodModal({ food, onClose }: FoodModalProps) {
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [selectedAddOns, setSelectedAddOns] = useState<FoodAddon[]>([]);
  const [notes, setNotes] = useState('');
  const [addedAnimation, setAddedAnimation] = useState(false);

  if (!food) return null;

  const toggleAddon = (addon: FoodAddon) => {
    if (selectedAddOns.some((a) => a.id === addon.id)) {
      setSelectedAddOns(selectedAddOns.filter((a) => a.id !== addon.id));
    } else {
      setSelectedAddOns([...selectedAddOns, addon]);
    }
  };

  const addonsTotal = selectedAddOns.reduce((sum, a) => sum + a.price, 0);
  const totalPrice = (food.price + addonsTotal) * quantity;

  const handleAddToCart = () => {
    addToCart(food, quantity, selectedAddOns, notes);
    setAddedAnimation(true);
    setTimeout(() => {
      setAddedAnimation(false);
      onClose();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/85 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg sm:max-w-2xl bg-[#0f0f14] border border-[#272733] rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl max-h-[94vh] sm:max-h-[90vh] flex flex-col">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 z-30 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-black/80 hover:bg-black text-zinc-300 hover:text-white border border-zinc-700/80 transition-all flex items-center justify-center cursor-pointer shadow-lg"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Scrollable Content */}
        <div className="overflow-y-auto flex-1 overscroll-contain">
          {/* Hero Image */}
          <div className="relative h-52 sm:h-64 md:h-72 w-full bg-zinc-950">
            <Image
              src={food.image}
              alt={food.name}
              fill
              className="object-cover"
              sizes="(max-width: 640px) 100vw, 680px"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0f0f14] via-[#0f0f14]/20 to-transparent" />

            {/* Badges on image */}
            <div className="absolute bottom-3 left-3 right-3 sm:bottom-4 sm:left-4 sm:right-4 flex flex-wrap items-center justify-between gap-2">
              <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                <span className="px-2 sm:px-2.5 py-0.5 sm:py-1 rounded bg-black/80 backdrop-blur-sm border border-amber-500/40 text-amber-400 font-mono text-[11px] sm:text-xs font-semibold">
                  {food.category}
                </span>
                {food.techTag && (
                  <span className="hidden xs:inline-block px-2 py-0.5 rounded bg-zinc-950/90 border border-zinc-700 text-zinc-300 font-mono text-[11px] sm:text-xs">
                    // {food.techTag}
                  </span>
                )}
              </div>
              <SpiceMeter level={food.spiceLevel} />
            </div>
          </div>

          {/* Details */}
          <div className="p-4 sm:p-6 space-y-5">
            <div>
              <div className="flex items-start justify-between gap-3">
                <h3 className="text-xl sm:text-2xl font-bold text-white font-sans leading-tight">
                  {food.name}
                </h3>
                <div className="text-right shrink-0">
                  <span className="text-xl sm:text-2xl font-mono font-extrabold text-amber-400">
                    ₹{food.price.toFixed(2)}
                  </span>
                  {food.originalPrice && (
                    <span className="block text-[11px] sm:text-xs line-through text-zinc-500 font-mono">
                      ₹{food.originalPrice.toFixed(2)}
                    </span>
                  )}
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3 sm:gap-4 mt-2 text-xs text-zinc-400">
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-amber-500" />
                  <span>Prep: {food.prepTime}</span>
                </span>
                {food.calories && (
                  <span className="flex items-center gap-1">
                    <Flame className="w-3.5 h-3.5 text-red-500" />
                    <span>{food.calories} kcal</span>
                  </span>
                )}
                <span className="text-amber-400 font-semibold">★ {food.rating} ({food.reviewsCount})</span>
              </div>

              <p className="mt-3 text-xs sm:text-sm text-zinc-300 leading-relaxed">
                {food.description}
              </p>
            </div>

            {/* Add-ons Configuration */}
            {food.addOns && food.addOns.length > 0 && (
              <div className="space-y-2.5 pt-3 border-t border-zinc-800/80">
                <h4 className="text-[11px] sm:text-xs uppercase font-mono tracking-wider text-amber-400 font-bold flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Configure Add-ons (Optional)</span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-2.5">
                  {food.addOns.map((addon) => {
                    const isSelected = selectedAddOns.some((a) => a.id === addon.id);
                    return (
                      <button
                        key={addon.id}
                        type="button"
                        onClick={() => toggleAddon(addon)}
                        className={`flex items-center justify-between p-2.5 sm:p-3 rounded-xl border text-left transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-amber-500/10 border-amber-500 text-white shadow-sm'
                            : 'bg-zinc-900/60 border-zinc-800/80 text-zinc-300 hover:border-zinc-700'
                        }`}
                      >
                        <div className="flex items-center gap-2 sm:gap-2.5 min-w-0 pr-1">
                          <div
                            className={`w-4 h-4 rounded shrink-0 flex items-center justify-center border text-[10px] ${
                              isSelected
                                ? 'bg-amber-500 border-amber-500 text-black'
                                : 'border-zinc-600'
                            }`}
                          >
                            {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                          </div>
                          <span className="text-xs font-medium truncate">{addon.name}</span>
                        </div>
                        <span className="text-xs font-mono text-amber-400 ml-2 shrink-0 font-semibold">
                          +₹{addon.price.toFixed(2)}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Special Instructions */}
            <div className="space-y-1.5 pt-2 border-t border-zinc-800/80">
              <label htmlFor="notes" className="text-[11px] sm:text-xs font-mono text-zinc-400 flex items-center justify-between">
                <span>Special Chef Notes / Custom Parameters</span>
                <span className="text-zinc-600">// optional</span>
              </label>
              <input
                id="notes"
                type="text"
                placeholder="e.g. Extra mint dip, well-done roast, low oil"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full px-3 sm:px-3.5 py-2 sm:py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-xs sm:text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-amber-500 font-sans"
              />
            </div>
          </div>
        </div>

        {/* Footer Actions (Sticky on Mobile) */}
        <div className="p-3 sm:p-5 bg-zinc-950/95 backdrop-blur-md border-t border-zinc-800/80 flex items-center justify-between gap-2.5 sm:gap-4 pb-[calc(0.75rem+env(safe-area-inset-bottom,0px))] sm:pb-5">
          {/* Quantity Stepper */}
          <div className="flex items-center bg-zinc-900 border border-zinc-800 rounded-xl p-0.5 sm:p-1 shrink-0">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              disabled={quantity <= 1}
              className="p-1.5 sm:p-2 text-zinc-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              aria-label="Decrease quantity"
            >
              <Minus className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </button>
            <span className="w-7 sm:w-8 text-center font-mono font-bold text-white text-xs sm:text-sm">
              {quantity}
            </span>
            <button
              onClick={() => setQuantity(quantity + 1)}
              className="p-1.5 sm:p-2 text-zinc-400 hover:text-white transition-colors"
              aria-label="Increase quantity"
            >
              <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </button>
          </div>

          {/* Add To Cart CTA */}
          <button
            onClick={handleAddToCart}
            disabled={!food.availability}
            className={`flex-1 py-2.5 sm:py-3 px-3 sm:px-5 rounded-xl font-bold text-xs sm:text-sm tracking-wide transition-all flex items-center justify-center gap-1.5 sm:gap-2 shadow-lg cursor-pointer ${
              !food.availability
                ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
                : addedAnimation
                ? 'bg-emerald-500 text-black shadow-emerald-500/20'
                : 'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-black shadow-amber-500/20 hover:shadow-amber-500/30'
            }`}
          >
            {addedAnimation ? (
              <>
                <Check className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.5]" />
                <span>ADDED TO BUILD!</span>
              </>
            ) : !food.availability ? (
              <span>OUT OF STOCK</span>
            ) : (
              <>
                <span>ADD TO BUILD</span>
                <span className="font-mono font-extrabold text-xs sm:text-sm">
                  • ₹{totalPrice.toFixed(2)}
                </span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
