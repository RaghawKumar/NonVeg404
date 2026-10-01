'use client';

import React, { useState, useEffect } from 'react';
import {
  Layers,
  Plus,
  Edit2,
  Trash2,
  Check,
  X,
  Search,
} from 'lucide-react';
import { INITIAL_CATEGORIES } from '@/data/mockAdminData';
import { Category } from '@/types/admin';
import { adminApi } from '@/lib/api';

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>(INITIAL_CATEGORIES);
  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  const fetchCategories = async () => {
    try {
      const res = await adminApi.categories.getAll();
      if (res.success && res.categories.length > 0) {
        setCategories(res.categories);
      }
    } catch {
      // Keep initial mock categories
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [icon, setIcon] = useState('🍗');
  const [description, setDescription] = useState('');
  const [active, setActive] = useState(true);

  const handleOpenAdd = () => {
    setEditingCategory(null);
    setName('');
    setSlug('');
    setIcon('🍗');
    setDescription('');
    setActive(true);
    setShowModal(true);
  };

  const handleOpenEdit = (cat: Category) => {
    setEditingCategory(cat);
    setName(cat.name);
    setSlug(cat.slug);
    setIcon(cat.icon);
    setDescription(cat.description);
    setActive(cat.active);
    setShowModal(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const catSlug = slug || name.toLowerCase().replace(/\s+/g, '-');
    if (editingCategory) {
      setCategories((prev) =>
        prev.map((c) =>
          c.id === editingCategory.id
            ? { ...c, name, slug: catSlug, icon, description, active }
            : c
        )
      );
      try {
        await adminApi.categories.update(editingCategory.id, { name, icon, description, active });
      } catch (err: any) {
        console.warn('Backend update category failed:', err.message);
      }
    } else {
      const newCat: Category = {
        id: `cat-${Date.now()}`,
        name,
        slug: catSlug,
        icon,
        description,
        itemCount: 0,
        active,
      };
      setCategories([...categories, newCat]);
      try {
        await adminApi.categories.create({ name, slug: catSlug, icon, description });
        fetchCategories();
      } catch (err: any) {
        console.warn('Backend create category failed:', err.message);
      }
    }
    setShowModal(false);
  };

  const toggleActive = async (id: string) => {
    const target = categories.find((c) => c.id === id);
    const newActive = target ? !target.active : false;
    setCategories((prev) =>
      prev.map((c) => (c.id === id ? { ...c, active: newActive } : c))
    );
    try {
      await adminApi.categories.update(id, { active: newActive });
    } catch (err: any) {
      console.warn('Backend toggle category active failed:', err.message);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Delete category?')) {
      setCategories((prev) => prev.filter((c) => c.id !== id));
      try {
        await adminApi.categories.delete(id);
      } catch (err: any) {
        console.warn('Backend delete category failed:', err.message);
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-800">
        <div>
          <h1 className="text-2xl font-bold text-white font-sans">
            Categories Architecture
          </h1>
          <p className="text-xs font-mono text-zinc-400">
            Define culinary endpoints, emoji icons, and active routing tags.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-mono font-bold text-xs transition-colors flex items-center gap-1.5 shadow-lg shadow-amber-500/20 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Category</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map((cat) => (
          <div
            key={cat.id}
            className="p-5 rounded-2xl bg-[#0e0e13] border border-zinc-800 hover:border-zinc-700 transition-all flex flex-col justify-between space-y-4 shadow-xl"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <span className="text-3xl p-2.5 rounded-xl bg-zinc-950 border border-zinc-800">
                  {cat.icon}
                </span>
                <div>
                  <h3 className="text-base font-bold text-white">{cat.name}</h3>
                  <span className="text-xs font-mono text-amber-400">/{cat.slug}</span>
                </div>
              </div>

              <span
                className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                  cat.active
                    ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                    : 'bg-red-950 text-red-400 border border-red-800'
                }`}
              >
                {cat.active ? 'ACTIVE' : 'HIDDEN'}
              </span>
            </div>

            <p className="text-xs text-zinc-400 line-clamp-2">
              {cat.description}
            </p>

            <div className="pt-3 border-t border-zinc-800 flex items-center justify-between text-xs font-mono">
              <span className="text-zinc-500">{cat.itemCount} Dishes Online</span>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => toggleActive(cat.id)}
                  className="px-2.5 py-1 rounded bg-zinc-900 hover:bg-zinc-800 text-zinc-300 text-[11px]"
                >
                  {cat.active ? 'Hide' : 'Activate'}
                </button>
                <button
                  onClick={() => handleOpenEdit(cat)}
                  className="p-1.5 rounded bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-amber-400"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => handleDelete(cat.id)}
                  className="p-1.5 rounded bg-zinc-900 hover:bg-red-950 text-zinc-400 hover:text-red-400"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="relative w-full max-w-md bg-[#0e0e14] border border-zinc-800 rounded-3xl p-6 space-y-4 shadow-2xl font-mono text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
              <h3 className="text-base font-bold text-white">
                {editingCategory ? 'Edit Category' : 'Register New Category'}
              </h3>
              <button onClick={() => setShowModal(false)} className="p-1 text-zinc-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-3.5">
              <div className="space-y-1">
                <label className="text-zinc-400">Category Name *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-zinc-400">Emoji Icon</label>
                  <input
                    type="text"
                    value={icon}
                    onChange={(e) => setIcon(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-white focus:outline-none focus:border-amber-500 text-lg"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-zinc-400">Route Slug</label>
                  <input
                    type="text"
                    value={slug}
                    placeholder="e.g. biryani"
                    onChange={(e) => setSlug(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-zinc-400">Description</label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-white font-sans text-xs focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={active}
                    onChange={(e) => setActive(e.target.checked)}
                    className="w-4 h-4 accent-amber-500"
                  />
                  <span className="text-white">Active in customer menu</span>
                </label>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-mono font-bold text-xs transition-colors cursor-pointer mt-3"
              >
                SAVE CATEGORY
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
