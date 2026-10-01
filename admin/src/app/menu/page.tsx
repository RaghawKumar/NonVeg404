'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import {
  UtensilsCrossed,
  Plus,
  Search,
  Filter,
  Edit2,
  Trash2,
  Flame,
  Check,
  X,
  Sparkles,
  Upload,
} from 'lucide-react';
import { INITIAL_FOOD_ITEMS, INITIAL_CATEGORIES } from '@/data/mockAdminData';
import { FoodItem, SpiceLevel } from '@/types/admin';
import { adminApi } from '@/lib/api';

function cleanImageUrl(rawUrl: string): string {
  if (!rawUrl || !rawUrl.trim()) return '';
  const trimmed = rawUrl.trim();
  if (trimmed.includes('google.com/imgres')) {
    try {
      const parsed = new URL(trimmed);
      const imgurl = parsed.searchParams.get('imgurl');
      if (imgurl) {
        return decodeURIComponent(imgurl);
      }
    } catch {}
  }
  return trimmed;
}

export default function AdminMenuPage() {
  const [items, setItems] = useState<FoodItem[]>(INITIAL_FOOD_ITEMS);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');

  const fetchItems = async () => {
    try {
      const res = await adminApi.menu.getAll();
      if (res.success && res.items.length > 0) {
        setItems(res.items);
      }
    } catch {
      // Keep mock initial items
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState<FoodItem | null>(null);

  // Form State
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState(18.99);
  const [originalPrice, setOriginalPrice] = useState<number | undefined>(22.99);
  const [category, setCategory] = useState('Biryani');
  const [spiceLevel, setSpiceLevel] = useState<SpiceLevel>('Hot');
  const [image, setImage] = useState('');
  const [techTag, setTechTag] = useState('v2.5 Release');
  const [availability, setAvailability] = useState(true);
  const [isFeatured, setIsFeatured] = useState(false);

  const handleOpenAddModal = () => {
    setEditingItem(null);
    setName('');
    setDescription('');
    setPrice(18.99);
    setOriginalPrice(22.99);
    setCategory('Biryani');
    setSpiceLevel('Hot');
    setImage('https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=800&q=80');
    setTechTag('v2.5 Release');
    setAvailability(true);
    setIsFeatured(false);
    setShowModal(true);
  };

  const handleOpenEditModal = (item: FoodItem) => {
    setEditingItem(item);
    setName(item.name);
    setDescription(item.description);
    setPrice(item.price);
    setOriginalPrice(item.originalPrice);
    setCategory(item.category);
    setSpiceLevel(item.spiceLevel);
    setImage(item.image);
    setTechTag(item.techTag || '');
    setAvailability(item.availability);
    setIsFeatured(item.isFeatured);
    setShowModal(true);
  };

  const handleSaveItem = async (e: React.FormEvent) => {
    e.preventDefault();
    const sanitizedImage = cleanImageUrl(image) || (editingItem ? editingItem.image : 'https://images.unsplash.com/photo-1544025162-d76694265947?w=800&auto=format&fit=crop&q=80');

    if (editingItem) {
      const updatedFields = {
        name,
        description,
        price: Number(price),
        originalPrice: originalPrice ? Number(originalPrice) : undefined,
        category,
        spiceLevel,
        image: sanitizedImage,
        techTag,
        availability,
        isFeatured,
      };

      setItems((prev) =>
        prev.map((i) => (i.id === editingItem.id ? { ...i, ...updatedFields } : i))
      );

      try {
        await adminApi.menu.update(editingItem.id, updatedFields);
      } catch (err: any) {
        console.warn('Backend update menu failed:', err.message);
      }
    } else {
      const newItem: FoodItem = {
        id: `food-${Date.now()}`,
        name,
        description,
        price: Number(price),
        originalPrice: originalPrice ? Number(originalPrice) : undefined,
        category,
        spiceLevel,
        image: sanitizedImage,
        techTag,
        availability,
        isFeatured,
        rating: 5.0,
        reviewsCount: 1,
        prepTime: '20 min',
      };
      setItems([newItem, ...items]);

      try {
        await adminApi.menu.create({
          name,
          description,
          price: Number(price),
          originalPrice: originalPrice ? Number(originalPrice) : undefined,
          category,
          spiceLevel,
          image: newItem.image,
          techTag,
          availability,
          isFeatured,
          prepTime: '20 min',
        });
        fetchItems();
      } catch (err: any) {
        console.warn('Backend create menu failed:', err.message);
      }
    }
    setShowModal(false);
  };

  const handleDeleteItem = async (id: string) => {
    if (confirm('Delete this food item from the menu repository?')) {
      setItems((prev) => prev.filter((i) => i.id !== id));
      try {
        await adminApi.menu.delete(id);
      } catch (err: any) {
        console.warn('Backend delete menu failed:', err.message);
      }
    }
  };

  const toggleAvailability = async (id: string) => {
    const target = items.find((i) => i.id === id);
    const newAvail = target ? !target.availability : false;
    setItems((prev) =>
      prev.map((i) => (i.id === id ? { ...i, availability: newAvail } : i))
    );
    try {
      await adminApi.menu.toggleAvailability(id, newAvail);
    } catch (err: any) {
      console.warn('Backend toggle availability failed:', err.message);
    }
  };

  const filteredItems = items.filter((item) => {
    if (selectedCategory !== 'ALL' && item.category !== selectedCategory) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      if (!item.name.toLowerCase().includes(q) && !item.description.toLowerCase().includes(q)) {
        return false;
      }
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-800">
        <div>
          <h1 className="text-2xl font-bold text-white font-sans">
            Menu Catalog Repository
          </h1>
          <p className="text-xs font-mono text-zinc-400">
            Add new recipes, modify pricing, calibrate spice heat, and toggle real-time availability.
          </p>
        </div>

        <button
          onClick={handleOpenAddModal}
          className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-mono font-bold text-xs transition-colors flex items-center gap-1.5 shadow-lg shadow-amber-500/20 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Commit New Food Item</span>
        </button>
      </div>

      {/* Search & Category Filter */}
      <div className="p-4 rounded-2xl bg-[#0e0e13] border border-zinc-800 space-y-3">
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
          <input
            type="text"
            placeholder="Search food by title or description..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-xs sm:text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-amber-500 font-mono"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs font-mono scrollbar-none">
          <button
            onClick={() => setSelectedCategory('ALL')}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors cursor-pointer ${
              selectedCategory === 'ALL'
                ? 'bg-amber-500 text-black font-bold'
                : 'bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800'
            }`}
          >
            ALL CATEGORIES ({items.length})
          </button>
          {INITIAL_CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.name)}
              className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors cursor-pointer ${
                selectedCategory === cat.name
                  ? 'bg-amber-500 text-black font-bold'
                  : 'bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800'
              }`}
            >
              {cat.icon} {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Food Items Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredItems.map((food) => (
          <div
            key={food.id}
            className="p-5 rounded-2xl bg-[#0e0e13] border border-zinc-800 hover:border-zinc-700 transition-all space-y-4 flex flex-col justify-between shadow-xl"
          >
            <div className="space-y-3">
              <div className="relative h-44 w-full rounded-xl overflow-hidden bg-zinc-950 border border-zinc-800">
                <Image
                  src={cleanImageUrl(food.image) || 'https://images.unsplash.com/photo-1544025162-d76694265947?w=800&auto=format&fit=crop&q=80'}
                  alt={food.name}
                  fill
                  unoptimized
                  className="object-cover"
                />
                <div className="absolute top-2 left-2 flex gap-1.5">
                  <span className="px-2 py-0.5 rounded bg-black/80 font-mono text-[10px] text-amber-400 border border-amber-500/30">
                    {food.category}
                  </span>
                  {food.isFeatured && (
                    <span className="px-2 py-0.5 rounded bg-amber-500 text-black font-mono text-[10px] font-bold">
                      FEATURED
                    </span>
                  )}
                </div>

                <div className="absolute top-2 right-2">
                  <span
                    className={`px-2 py-0.5 rounded font-mono text-[10px] font-bold ${
                      food.availability
                        ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                        : 'bg-red-950 text-red-400 border border-red-800'
                    }`}
                  >
                    {food.availability ? 'IN STOCK' : '404 NOT FOUND'}
                  </span>
                </div>
              </div>

              <div>
                <h3 className="text-base font-bold text-white font-sans">
                  {food.name}
                </h3>
                <p className="text-xs text-zinc-400 line-clamp-2 mt-1">
                  {food.description}
                </p>
                {food.techTag && (
                  <div className="text-[11px] font-mono text-zinc-500 mt-1">
                    // {food.techTag}
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between text-xs font-mono pt-2 border-t border-zinc-800/80">
                <div>
                  <span className="text-lg font-bold text-amber-400">
                    ₹{food.price.toFixed(2)}
                  </span>
                  {food.originalPrice && (
                    <span className="ml-2 line-through text-zinc-500 text-[11px]">
                      ₹{food.originalPrice.toFixed(2)}
                    </span>
                  )}
                </div>
                <span className="text-zinc-400">Spice: {food.spiceLevel}</span>
              </div>
            </div>

            {/* Actions Bar */}
            <div className="pt-3 border-t border-zinc-800 flex items-center justify-between gap-2">
              <button
                type="button"
                onClick={() => toggleAvailability(food.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-colors cursor-pointer ${
                  food.availability
                    ? 'bg-zinc-800 hover:bg-zinc-700 text-zinc-300'
                    : 'bg-emerald-600 hover:bg-emerald-500 text-black'
                }`}
              >
                {food.availability ? 'Mark Out of Stock' : 'Mark In Stock'}
              </button>

              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => handleOpenEditModal(food)}
                  className="p-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-amber-400 border border-zinc-800 cursor-pointer"
                  title="Edit dish"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => handleDeleteItem(food.id)}
                  className="p-2 rounded-lg bg-zinc-900 hover:bg-red-950 text-zinc-400 hover:text-red-400 border border-zinc-800 cursor-pointer"
                  title="Delete dish"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal: Add / Edit Food Item */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="relative w-full max-w-lg bg-[#0e0e14] border border-zinc-800 rounded-3xl p-6 space-y-5 shadow-2xl max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
              <h3 className="text-base font-bold text-white font-mono">
                {editingItem ? 'Edit Food Item Parameters' : 'Commit New Food Item'}
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="p-1 text-zinc-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveItem} className="space-y-4 text-xs font-mono">
              <div className="space-y-1">
                <label className="text-zinc-400">Dish Name *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-zinc-400">Description *</label>
                <textarea
                  rows={2}
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-white font-sans text-xs focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-zinc-400">Price (₹) *</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={price}
                    onChange={(e) => setPrice(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-zinc-400">Original Price (₹)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={originalPrice || ''}
                    onChange={(e) => setOriginalPrice(e.target.value ? Number(e.target.value) : undefined)}
                    className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-zinc-400">Category *</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-white focus:outline-none focus:border-amber-500"
                  >
                    {INITIAL_CATEGORIES.map((cat) => (
                      <option key={cat.id} value={cat.name}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-zinc-400">Spice Heat Level *</label>
                  <select
                    value={spiceLevel}
                    onChange={(e) => setSpiceLevel(e.target.value as SpiceLevel)}
                    className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-white focus:outline-none focus:border-amber-500"
                  >
                    <option value="Mild">Mild</option>
                    <option value="Medium">Medium</option>
                    <option value="Hot">Hot</option>
                    <option value="Code Red">Code Red 🔥</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-zinc-400">Food Photography Image (URL or Upload)</label>
                  <label className="px-2.5 py-1 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-amber-400 cursor-pointer text-[10px] flex items-center gap-1 border border-zinc-700 transition-colors">
                    <Upload className="w-3 h-3" />
                    <span>Upload Image File</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onload = (ev) => {
                            if (ev.target?.result) {
                              setImage(ev.target.result as string);
                            }
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                    />
                  </label>
                </div>
                <input
                  type="text"
                  value={image}
                  onChange={(e) => setImage(cleanImageUrl(e.target.value))}
                  placeholder="https://... or paste direct/Google image link"
                  className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-white focus:outline-none focus:border-amber-500"
                />
                {image && (
                  <div className="relative h-32 w-full rounded-xl overflow-hidden border border-zinc-800 bg-zinc-950 mt-1">
                    <img
                      src={cleanImageUrl(image)}
                      alt="Dish Preview"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1544025162-d76694265947?w=800&auto=format&fit=crop&q=80';
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => setImage('')}
                      className="absolute top-1.5 right-1.5 p-1 rounded-full bg-black/80 text-zinc-400 hover:text-white border border-zinc-700 cursor-pointer"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>

              <div className="space-y-1">
                <label className="text-zinc-400">Tech Tag</label>
                <input
                  type="text"
                  value={techTag}
                  onChange={(e) => setTechTag(e.target.value)}
                  placeholder="e.g. LTS Release 2026"
                  className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="flex items-center gap-6 pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={availability}
                    onChange={(e) => setAvailability(e.target.checked)}
                    className="w-4 h-4 accent-amber-500"
                  />
                  <span className="text-white">In Stock (Available)</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isFeatured}
                    onChange={(e) => setIsFeatured(e.target.checked)}
                    className="w-4 h-4 accent-amber-500"
                  />
                  <span className="text-white">Featured on Homepage</span>
                </label>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-mono font-bold text-xs transition-colors cursor-pointer mt-3"
              >
                {editingItem ? 'SAVE DISH PARAMETERS' : 'COMMIT DISH TO MENU'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
