'use client';

import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Plus,
  Trash2,
  Check,
  X,
  DollarSign,
} from 'lucide-react';
import { INITIAL_ADDONS } from '@/data/mockAdminData';
import { FoodAddon } from '@/types/admin';
import { adminApi } from '@/lib/api';

export default function AdminAddonsPage() {
  const [addons, setAddons] = useState<FoodAddon[]>(INITIAL_ADDONS);
  const [showModal, setShowModal] = useState(false);

  const [name, setName] = useState('');
  const [price, setPrice] = useState(2.50);
  const [category, setCategory] = useState('Biryani');
  const [inStock, setInStock] = useState(true);

  const fetchAddons = async () => {
    try {
      const res = await adminApi.addons.getAll();
      if (res.success && res.addons.length > 0) {
        setAddons(res.addons);
      }
    } catch {
      // Keep initial dataset
    }
  };

  useEffect(() => {
    fetchAddons();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const newAddon: FoodAddon = {
      id: `addon-${Date.now()}`,
      name,
      price: Number(price),
      category,
      inStock,
    };
    setAddons([...addons, newAddon]);
    try {
      await adminApi.addons.create({ name, price: Number(price), category, inStock });
      fetchAddons();
    } catch (err: any) {
      console.warn('Backend create addon error:', err.message);
    }
    setShowModal(false);
  };

  const toggleStock = async (id: string) => {
    const target = addons.find((a) => a.id === id);
    const newStock = target ? !target.inStock : false;
    setAddons((prev) =>
      prev.map((a) => (a.id === id ? { ...a, inStock: newStock } : a))
    );
    try {
      await adminApi.addons.toggleStock(id, newStock);
    } catch (err: any) {
      console.warn('Backend toggle stock error:', err.message);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Delete this add-on option?')) {
      setAddons((prev) => prev.filter((a) => a.id !== id));
      try {
        await adminApi.addons.delete(id);
      } catch (err: any) {
        console.warn('Backend delete addon error:', err.message);
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-800">
        <div>
          <h1 className="text-2xl font-bold text-white font-sans">
            Food Add-ons Inventory
          </h1>
          <p className="text-xs font-mono text-zinc-400">
            Configure extra gravies, spice sauces, boiled eggs, and sides across menu items.
          </p>
        </div>

        <button
          onClick={() => {
            setName('');
            setPrice(2.50);
            setCategory('Biryani');
            setInStock(true);
            setShowModal(true);
          }}
          className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-mono font-bold text-xs transition-colors flex items-center gap-1.5 shadow-lg shadow-amber-500/20 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Add-on</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {addons.map((addon) => (
          <div
            key={addon.id}
            className="p-5 rounded-2xl bg-[#0e0e13] border border-zinc-800 hover:border-zinc-700 transition-all space-y-3 shadow-xl flex flex-col justify-between"
          >
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-zinc-500">
                  Category: {addon.category || 'Global'}
                </span>
                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                    addon.inStock
                      ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                      : 'bg-red-950 text-red-400 border border-red-800'
                  }`}
                >
                  {addon.inStock ? 'IN STOCK' : 'OUT OF STOCK'}
                </span>
              </div>

              <h3 className="text-base font-bold text-white font-sans">
                {addon.name}
              </h3>
              <div className="text-lg font-mono font-bold text-amber-400">
                +₹{addon.price.toFixed(2)}
              </div>
            </div>

            <div className="pt-3 border-t border-zinc-800 flex items-center justify-between text-xs font-mono">
              <button
                onClick={() => toggleStock(addon.id)}
                className="px-2.5 py-1 rounded bg-zinc-900 hover:bg-zinc-800 text-zinc-300"
              >
                {addon.inStock ? 'Mark Out' : 'Mark Available'}
              </button>

              <button
                onClick={() => handleDelete(addon.id)}
                className="p-1.5 rounded bg-zinc-900 hover:bg-red-950 text-zinc-400 hover:text-red-400"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="relative w-full max-w-md bg-[#0e0e14] border border-zinc-800 rounded-3xl p-6 space-y-4 shadow-2xl font-mono text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
              <h3 className="text-base font-bold text-white">Create Food Add-on</h3>
              <button onClick={() => setShowModal(false)} className="p-1 text-zinc-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-3.5">
              <div className="space-y-1">
                <label className="text-zinc-400">Add-on Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Extra Mirchi Ka Salan"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-white focus:outline-none focus:border-amber-500"
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
                  <label className="text-zinc-400">Category Tag</label>
                  <input
                    type="text"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={inStock}
                    onChange={(e) => setInStock(e.target.checked)}
                    className="w-4 h-4 accent-amber-500"
                  />
                  <span className="text-white">Currently In Stock</span>
                </label>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-mono font-bold text-xs transition-colors cursor-pointer mt-3"
              >
                SAVE ADD-ON
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
