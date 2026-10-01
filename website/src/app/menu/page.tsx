'use client';

import React, { useState, useEffect, useMemo, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import FoodCard from '@/components/FoodCard';
import { FoodCategory, SpiceLevel } from '@/types/restaurant';
import {
  Search,
  SlidersHorizontal,
  Flame,
  Sparkles,
  UtensilsCrossed,
  X,
  Filter,
} from 'lucide-react';

const CATEGORIES: ('All' | FoodCategory)[] = [
  'All',
  'Biryani',
  'Chicken',
  'Mutton',
  'Kebabs & Tandoor',
  'Starters',
  'Burgers',
  'Rolls & Wraps',
  'Main Course',
  'Beverages',
  'Desserts',
];

const SPICE_LEVELS: ('All' | SpiceLevel)[] = [
  'All',
  'Mild',
  'Medium',
  'Hot',
  'Code Red',
];

function MenuContent() {
  const searchParams = useSearchParams();
  const { menuItems } = useCart();

  const [selectedCategory, setSelectedCategory] = useState<'All' | FoodCategory>('All');
  const [selectedSpice, setSelectedSpice] = useState<'All' | SpiceLevel>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'rating'>('featured');

  useEffect(() => {
    const categoryParam = searchParams.get('category');
    if (categoryParam && CATEGORIES.includes(categoryParam as FoodCategory)) {
      setSelectedCategory(categoryParam as FoodCategory);
    }
  }, [searchParams]);

  const filteredItems = useMemo(() => {
    return menuItems
      .filter((item) => {
        // Category filter
        if (selectedCategory !== 'All' && item.category !== selectedCategory) {
          return false;
        }
        // Spice filter
        if (selectedSpice !== 'All' && item.spiceLevel !== selectedSpice) {
          return false;
        }
        // Search query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchName = item.name.toLowerCase().includes(q);
          const matchDesc = item.description.toLowerCase().includes(q);
          const matchCat = item.category.toLowerCase().includes(q);
          const matchTag = item.techTag?.toLowerCase().includes(q);
          if (!matchName && !matchDesc && !matchCat && !matchTag) {
            return false;
          }
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'price-asc') return a.price - b.price;
        if (sortBy === 'price-desc') return b.price - a.price;
        if (sortBy === 'rating') return b.rating - a.rating;
        // default featured
        if (a.isFeatured && !b.isFeatured) return -1;
        if (!a.isFeatured && b.isFeatured) return 1;
        return 0;
      });
  }, [menuItems, selectedCategory, selectedSpice, searchQuery, sortBy]);

  const resetFilters = () => {
    setSelectedCategory('All');
    setSelectedSpice('All');
    setSearchQuery('');
    setSortBy('featured');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Header Banner */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 font-mono text-xs font-semibold">
          <UtensilsCrossed className="w-3.5 h-3.5" />
          <span>PRODUCTION_MENU_v2.6</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight">
          The Non-Vegetarian Repository
        </h1>
        <p className="text-zinc-400 text-sm sm:text-base leading-relaxed">
          Zero bugs. High-uptime spices. Explore our hand-crafted non-veg feasts,
          from royal slow-dum biryanis to flame-seared tandoori kebabs.
        </p>
      </div>

      {/* Controls: Search & Filters */}
      <div className="space-y-4 bg-[#0d0d12] border border-zinc-800/80 p-5 rounded-2xl shadow-xl">
        {/* Search Bar & Sort Dropdown */}
        <div className="flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
            <input
              type="text"
              placeholder="Search by dish name, spice, or ingredients (e.g. Biryani, Burger, Rogan Josh)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-10 py-3 rounded-xl bg-zinc-950 border border-zinc-800 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-amber-500 font-sans"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <div className="relative shrink-0">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-4 py-3 rounded-xl bg-zinc-950 border border-zinc-800 text-sm text-zinc-300 font-mono focus:outline-none focus:border-amber-500 cursor-pointer"
              >
                <option value="featured">Sort: Featured First</option>
                <option value="rating">Sort: Top Rated ★</option>
                <option value="price-asc">Sort: Price Low → High</option>
                <option value="price-desc">Sort: Price High → Low</option>
              </select>
            </div>
          </div>
        </div>

        {/* Category Pills Slider */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none text-xs font-mono">
          {CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-2 rounded-xl whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer ${
                  isSelected
                    ? 'bg-amber-500 text-black font-bold shadow-lg shadow-amber-500/20'
                    : 'bg-zinc-900/80 text-zinc-400 hover:text-white hover:bg-zinc-800 border border-zinc-800'
                }`}
              >
                <span>{cat}</span>
              </button>
            );
          })}
        </div>

        {/* Spice Level Sub-Filters */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-zinc-800/80 text-xs">
          <div className="flex items-center gap-2">
            <span className="font-mono text-zinc-500 flex items-center gap-1">
              <Flame className="w-3.5 h-3.5 text-amber-500" />
              <span>Calibrate Heat:</span>
            </span>
            <div className="flex items-center gap-1.5 font-mono">
              {SPICE_LEVELS.map((spice) => {
                const isSelected = selectedSpice === spice;
                return (
                  <button
                    key={spice}
                    onClick={() => setSelectedSpice(spice)}
                    className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                      isSelected
                        ? 'bg-red-500/20 text-red-400 border border-red-500/50 font-bold'
                        : 'text-zinc-400 hover:text-zinc-200 bg-zinc-900/60 border border-zinc-800'
                    }`}
                  >
                    {spice}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-zinc-400 font-mono text-[11px]">
              Found: <strong className="text-amber-400">{filteredItems.length}</strong> items
            </span>

            {(selectedCategory !== 'All' || selectedSpice !== 'All' || searchQuery) && (
              <button
                onClick={resetFilters}
                className="text-xs font-mono text-red-400 hover:underline flex items-center gap-1"
              >
                <X className="w-3.5 h-3.5" />
                <span>Reset Filters</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Food Items Grid */}
      {filteredItems.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredItems.map((food) => (
            <FoodCard key={food.id} food={food} />
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="text-center py-20 bg-[#0d0d12] rounded-3xl border border-dashed border-zinc-800 p-8 space-y-4">
          <div className="text-5xl font-mono text-amber-500 font-extrabold">404</div>
          <h3 className="text-xl font-bold text-white">No Matching Dishes Found</h3>
          <p className="text-zinc-400 text-sm max-w-md mx-auto">
            We couldn&apos;t find any non-veg recipes matching your current filter parameters.
            Try resetting your filters or search query.
          </p>
          <button
            onClick={resetFilters}
            className="px-6 py-2.5 rounded-xl bg-amber-500 text-black font-bold font-mono text-xs hover:bg-amber-400 transition-colors cursor-pointer"
          >
            RESET ALL FILTERS
          </button>
        </div>
      )}
    </div>
  );
}

export default function MenuPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center text-amber-400 font-mono">
          Loading NON VEG 404 Menu...
        </div>
      }
    >
      <MenuContent />
    </Suspense>
  );
}
