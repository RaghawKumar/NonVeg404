'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Camera, X, ArrowRight, Eye, UtensilsCrossed } from 'lucide-react';

interface GalleryItem {
  id: string;
  title: string;
  category: 'All' | 'Grill & Tandoor' | 'Biryani' | 'Burgers & Rolls' | 'Ambiance';
  image: string;
  description: string;
  spiceTag?: string;
}

const GALLERY_ITEMS: GalleryItem[] = [
  {
    id: 'g-1',
    title: 'Kernel Hyderabadi Dum Biryani Handi',
    category: 'Biryani',
    image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=1200&q=80',
    description: 'Golden aged basmati rice slow cooked in a sealed clay pot with tender spiced chicken leg quarters.',
    spiceTag: 'Hot (3 Flames)',
  },
  {
    id: 'g-2',
    title: 'Full Stack Charcoal Tandoori Chicken',
    category: 'Grill & Tandoor',
    image: 'https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?auto=format&fit=crop&w=1200&q=80',
    description: 'Direct flame-kissed roasted chicken marinated in Kashmiri red chilies and creamy yogurt.',
    spiceTag: 'Medium Heat',
  },
  {
    id: 'g-3',
    title: 'Root Access Double Bacon Beef Burger',
    category: 'Burgers & Rolls',
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=1200&q=80',
    description: 'Double smashed Angus beef with applewood smoked bacon and 404 secret sauce.',
    spiceTag: 'Medium',
  },
  {
    id: 'g-4',
    title: 'Nawabi Mutton Shank Pot Biryani',
    category: 'Biryani',
    image: 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?auto=format&fit=crop&w=1200&q=80',
    description: 'Slow-simmered tender goat shank infused with saffron strands and whole spices.',
    spiceTag: 'Medium',
  },
  {
    id: 'g-5',
    title: 'Galouti Melt-in-Mouth Kebabs',
    category: 'Grill & Tandoor',
    image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=1200&q=80',
    description: 'Silky smooth lamb patties infused with raw papaya and 32 aromatic spices.',
    spiceTag: 'Mild-Medium',
  },
  {
    id: 'g-6',
    title: 'Terminal Smoked Chicken Kathi Roll',
    category: 'Burgers & Rolls',
    image: 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=1200&q=80',
    description: 'Crispy layered flatbread wrapped around hot grilled chicken chunks with pickled onions.',
    spiceTag: 'Medium',
  },
  {
    id: 'g-7',
    title: 'NON VEG 404 Dark Dining Hall & Booths',
    category: 'Ambiance',
    image: 'https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?auto=format&fit=crop&w=1200&q=80',
    description: 'Developer-inspired mood lighting, ergonomic booths, and high-speed Wi-Fi dining zones.',
    spiceTag: 'Vibe 100%',
  },
  {
    id: 'g-8',
    title: 'Clay Tandoor Charcoal Fire Clustered',
    category: 'Ambiance',
    image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1200&q=80',
    description: 'Our open viewing kitchen where skewers roast continuously at 450°C.',
    spiceTag: '450°C Heat',
  },
  {
    id: 'g-9',
    title: 'Code Red Nashville Crispy Chicken',
    category: 'Grill & Tandoor',
    image: 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?auto=format&fit=crop&w=1200&q=80',
    description: 'Ghost pepper infused buttermilk crispy chicken with dill pickle chips.',
    spiceTag: 'Code Red 🔥',
  },
];

export default function GalleryPage() {
  const [selectedFilter, setSelectedFilter] = useState<string>('All');
  const [activeModalItem, setActiveModalItem] = useState<GalleryItem | null>(null);

  const filters = ['All', 'Biryani', 'Grill & Tandoor', 'Burgers & Rolls', 'Ambiance'];

  const displayedItems = selectedFilter === 'All'
    ? GALLERY_ITEMS
    : GALLERY_ITEMS.filter((item) => item.category === selectedFilter);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 font-mono text-xs font-semibold">
          <Camera className="w-3.5 h-3.5" />
          <span>VISUAL_BUFFER_GALLERY</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight">
          Food Photography & Ambiance
        </h1>
        <p className="text-zinc-400 text-sm sm:text-base leading-relaxed">
          High-definition captures of our signature meat recipes, sizzling charcoal grills,
          and developer-inspired dining aesthetic.
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center justify-center gap-2 overflow-x-auto pb-2 text-xs font-mono">
        {filters.map((filter) => (
          <button
            key={filter}
            onClick={() => setSelectedFilter(filter)}
            className={`px-4 py-2 rounded-xl transition-all cursor-pointer ${
              selectedFilter === filter
                ? 'bg-amber-500 text-black font-bold shadow-lg shadow-amber-500/20'
                : 'bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800'
            }`}
          >
            {filter}
          </button>
        ))}
      </div>

      {/* Gallery Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {displayedItems.map((item) => (
          <div
            key={item.id}
            onClick={() => setActiveModalItem(item)}
            className="group relative h-80 rounded-2xl overflow-hidden border border-zinc-800 hover:border-amber-500/50 bg-zinc-950 cursor-pointer shadow-xl transition-all duration-300 hover:-translate-y-1"
          >
            <Image
              src={item.image}
              alt={item.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />

            {/* Badges on image */}
            <div className="absolute top-3 left-3">
              <span className="px-2.5 py-1 rounded-lg bg-black/80 backdrop-blur-md border border-amber-500/40 text-[11px] font-mono text-amber-400 font-semibold">
                {item.category}
              </span>
            </div>

            {item.spiceTag && (
              <div className="absolute top-3 right-3">
                <span className="px-2.5 py-1 rounded-lg bg-black/80 backdrop-blur-md border border-zinc-700 text-[11px] font-mono text-zinc-300">
                  {item.spiceTag}
                </span>
              </div>
            )}

            {/* Bottom Caption */}
            <div className="absolute bottom-4 left-4 right-4 space-y-1">
              <h3 className="text-lg font-bold text-white group-hover:text-amber-400 transition-colors">
                {item.title}
              </h3>
              <p className="text-xs text-zinc-300 line-clamp-1">
                {item.description}
              </p>
              <div className="pt-1 flex items-center gap-1.5 text-xs font-mono text-amber-400 font-semibold">
                <Eye className="w-3.5 h-3.5" />
                <span>Click to expand image</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox Modal */}
      {activeModalItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in">
          <div className="relative w-full max-w-4xl bg-[#0f0f15] border border-zinc-800 rounded-3xl overflow-hidden shadow-2xl">
            <button
              onClick={() => setActiveModalItem(null)}
              className="absolute top-4 right-4 z-20 p-2.5 rounded-full bg-black/80 hover:bg-black text-white border border-zinc-700 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="relative h-96 sm:h-[500px] w-full bg-zinc-950">
              <Image
                src={activeModalItem.image}
                alt={activeModalItem.title}
                fill
                className="object-cover"
              />
            </div>

            <div className="p-6 sm:p-8 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <span className="text-xs font-mono text-amber-400 font-bold uppercase">
                    // {activeModalItem.category}
                  </span>
                  <h3 className="text-2xl font-bold text-white mt-0.5">
                    {activeModalItem.title}
                  </h3>
                </div>

                <Link
                  href="/menu"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-extrabold text-xs font-mono transition-colors"
                >
                  <UtensilsCrossed className="w-4 h-4" />
                  <span>ORDER THIS FROM MENU</span>
                </Link>
              </div>

              <p className="text-sm text-zinc-300 leading-relaxed">
                {activeModalItem.description}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
