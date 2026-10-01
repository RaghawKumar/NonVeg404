'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { FoodItem } from '@/types/restaurant';
import { useCart } from '@/context/CartContext';
import SpiceMeter from './SpiceMeter';
import FoodModal from './FoodModal';
import { Plus, Check, SlidersHorizontal, Flame } from 'lucide-react';

interface FoodCardProps {
  food: FoodItem;
}

export default function FoodCard({ food }: FoodCardProps) {
  const { addToCart } = useCart();
  const [modalOpen, setModalOpen] = useState(false);
  const [justAdded, setJustAdded] = useState(false);

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    // If it has add-ons, open modal so user can pick add-ons, else quick add
    if (food.addOns && food.addOns.length > 0) {
      setModalOpen(true);
      return;
    }

    addToCart(food, 1, []);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 800);
  };

  return (
    <>
      <div
        onClick={() => setModalOpen(true)}
        className="group relative bg-[#0e0e13] border border-[#23232e] hover:border-amber-500/50 rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-amber-500/10 flex flex-col cursor-pointer"
      >
        {/* Top Image Container */}
        <div className="relative h-48 sm:h-52 w-full overflow-hidden bg-zinc-950">
          <Image
            src={food.image || 'https://images.unsplash.com/photo-1544025162-d76694265947?w=800&auto=format&fit=crop&q=80'}
            alt={food.name}
            fill
            unoptimized
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0e0e13] via-transparent to-transparent opacity-80" />

          {/* Badges on image */}
          <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
            <span className="px-2 py-0.5 rounded bg-black/80 backdrop-blur-sm border border-amber-500/30 text-[11px] font-mono font-medium text-amber-400">
              {food.category}
            </span>
            {food.isFeatured && (
              <span className="px-2 py-0.5 rounded bg-amber-500 text-black text-[11px] font-bold uppercase tracking-wider flex items-center gap-1 shadow">
                <Flame className="w-3 h-3 fill-black" />
                Featured
              </span>
            )}
          </div>

          <div className="absolute top-3 right-3">
            <SpiceMeter level={food.spiceLevel} />
          </div>

          {/* Out of Stock Overlay */}
          {!food.availability && (
            <div className="absolute inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center">
              <span className="px-3 py-1 bg-red-950 border border-red-700 text-red-400 font-mono text-xs font-bold rounded">
                // 404: OUT OF STOCK
              </span>
            </div>
          )}
        </div>

        {/* Content Body */}
        <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between gap-2">
              <h3 className="text-base sm:text-lg font-bold text-white group-hover:text-amber-400 transition-colors line-clamp-1">
                {food.name}
              </h3>
            </div>

            <p className="mt-1.5 text-xs sm:text-sm text-zinc-400 line-clamp-2 leading-relaxed">
              {food.description}
            </p>

            {food.techTag && (
              <div className="mt-2 text-[11px] font-mono text-zinc-400">
                <span className="text-amber-500/90 font-semibold">//</span> {food.techTag}
              </div>
            )}
          </div>

          {/* Pricing & Add Actions */}
          <div className="pt-3 border-t border-zinc-800/80 flex items-center justify-between gap-3">
            <div>
              <span className="text-lg font-mono font-extrabold text-amber-400">
                ₹{food.price.toFixed(2)}
              </span>
              {food.originalPrice && (
                <span className="ml-2 text-xs line-through text-zinc-400 font-mono">
                  ₹{food.originalPrice.toFixed(2)}
                </span>
              )}
            </div>

            <div className="flex items-center gap-1.5">
              {food.addOns && food.addOns.length > 0 && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setModalOpen(true);
                  }}
                  className="p-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white border border-zinc-800 transition-colors"
                  title="Customize Add-ons"
                >
                  <SlidersHorizontal className="w-4 h-4" />
                </button>
              )}

              <button
                type="button"
                onClick={handleQuickAdd}
                disabled={!food.availability}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all ${
                  !food.availability
                    ? 'bg-zinc-800 text-zinc-600 cursor-not-allowed'
                    : justAdded
                    ? 'bg-emerald-500 text-black shadow-lg shadow-emerald-500/20'
                    : 'bg-amber-500 hover:bg-amber-400 text-black shadow-md shadow-amber-500/20 active:scale-95'
                }`}
              >
                {justAdded ? (
                  <>
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                    <span>ADDED</span>
                  </>
                ) : (
                  <>
                    <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                    <span>ADD</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {modalOpen && (
        <FoodModal food={food} onClose={() => setModalOpen(false)} />
      )}
    </>
  );
}
