'use client';

import React, { useState, useEffect } from 'react';
import {
  Tag,
  Plus,
  Trash2,
  Check,
  X,
  Sparkles,
} from 'lucide-react';
import { INITIAL_COUPONS } from '@/data/mockAdminData';
import { Coupon } from '@/types/admin';
import { adminApi } from '@/lib/api';

export default function AdminOffersPage() {
  const [coupons, setCoupons] = useState<Coupon[]>(INITIAL_COUPONS);
  const [showModal, setShowModal] = useState(false);

  const [code, setCode] = useState('');
  const [discountType, setDiscountType] = useState<'percentage' | 'fixed'>('percentage');
  const [value, setValue] = useState(20);
  const [minOrder, setMinOrder] = useState(40);
  const [description, setDescription] = useState('');
  const [active, setActive] = useState(true);

  const fetchCoupons = async () => {
    try {
      const res = await adminApi.coupons.getAll();
      if (res.success && res.coupons.length > 0) {
        setCoupons(res.coupons);
      }
    } catch {
      // Keep initial dataset
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const formattedCode = code.trim().toUpperCase();
    const newCoupon: Coupon = {
      id: `coup-${Date.now()}`,
      code: formattedCode,
      discountType,
      value: Number(value),
      minOrder: Number(minOrder),
      description,
      usageCount: 0,
      active,
      expiryDate: '2026-12-31',
    };
    setCoupons([newCoupon, ...coupons]);
    try {
      await adminApi.coupons.create({
        code: formattedCode,
        discountType,
        value: Number(value),
        minOrder: Number(minOrder),
        description,
        expiryDate: '2026-12-31',
      });
      fetchCoupons();
    } catch (err: any) {
      console.warn('Backend create coupon failed:', err.message);
    }
    setShowModal(false);
  };

  const toggleActive = async (id: string) => {
    const target = coupons.find((c) => c.id === id);
    const newActive = target ? !target.active : false;
    setCoupons((prev) =>
      prev.map((c) => (c.id === id ? { ...c, active: newActive } : c))
    );
    try {
      await adminApi.coupons.toggle(id, newActive);
    } catch (err: any) {
      console.warn('Backend toggle coupon failed:', err.message);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Delete promo token?')) {
      setCoupons((prev) => prev.filter((c) => c.id !== id));
      try {
        await adminApi.coupons.delete(id);
      } catch (err: any) {
        console.warn('Backend delete coupon failed:', err.message);
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-800">
        <div>
          <h1 className="text-2xl font-bold text-white font-sans">
            Offers & Sudo Promo Codes
          </h1>
          <p className="text-xs font-mono text-zinc-400">
            Create discount tokens, minimum order spend thresholds, and campaign tracking.
          </p>
        </div>

        <button
          onClick={() => {
            setCode('');
            setDiscountType('percentage');
            setValue(20);
            setMinOrder(40);
            setDescription('');
            setActive(true);
            setShowModal(true);
          }}
          className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-mono font-bold text-xs transition-colors flex items-center gap-1.5 shadow-lg shadow-amber-500/20 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Create New Promo Token</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {coupons.map((coupon) => (
          <div
            key={coupon.id}
            className="p-5 rounded-2xl bg-[#0e0e13] border border-zinc-800 hover:border-amber-500/50 transition-all flex flex-col justify-between space-y-4 shadow-xl"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/30">
                  {coupon.discountType === 'percentage' ? `${coupon.value}% OFF` : `₹${coupon.value} FLAT`}
                </span>
                <span className="text-[11px] font-mono text-zinc-500">
                  Min ₹{coupon.minOrder}
                </span>
              </div>

              <h3 className="font-mono font-bold text-lg text-white">
                {coupon.code}
              </h3>

              <p className="text-xs text-zinc-400 leading-relaxed line-clamp-2">
                {coupon.description}
              </p>
            </div>

            <div className="pt-3 border-t border-zinc-800 space-y-2 text-xs font-mono">
              <div className="flex justify-between text-zinc-500 text-[11px]">
                <span>{coupon.usageCount} Redeemed</span>
                <span className={coupon.active ? 'text-emerald-400' : 'text-red-400'}>
                  {coupon.active ? 'ACTIVE' : 'DISABLED'}
                </span>
              </div>

              <div className="flex items-center justify-between gap-2 pt-1">
                <button
                  onClick={() => toggleActive(coupon.id)}
                  className="px-3 py-1 rounded bg-zinc-900 hover:bg-zinc-800 text-zinc-300 text-[11px]"
                >
                  {coupon.active ? 'Disable' : 'Enable'}
                </button>
                <button
                  onClick={() => handleDelete(coupon.id)}
                  className="p-1 rounded bg-zinc-900 hover:bg-red-950 text-zinc-400 hover:text-red-400"
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
              <h3 className="text-base font-bold text-white">Generate Promo Token</h3>
              <button onClick={() => setShowModal(false)} className="p-1 text-zinc-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-3.5">
              <div className="space-y-1">
                <label className="text-zinc-400">Coupon Code *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. SUDO_DEV_20"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-white uppercase focus:outline-none focus:border-amber-500 font-bold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-zinc-400">Discount Type</label>
                  <select
                    value={discountType}
                    onChange={(e) => setDiscountType(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-white focus:outline-none focus:border-amber-500"
                  >
                    <option value="percentage">Percentage (%)</option>
                    <option value="fixed">Fixed Flat (₹)</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-zinc-400">Discount Value *</label>
                  <input
                    type="number"
                    step="0.1"
                    required
                    value={value}
                    onChange={(e) => setValue(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-zinc-400">Min Order Requirement (₹)</label>
                <input
                  type="number"
                  value={minOrder}
                  onChange={(e) => setMinOrder(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-zinc-400">Description</label>
                <textarea
                  rows={2}
                  placeholder="e.g. 20% discount on orders above ₹40"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-white font-sans text-xs focus:outline-none focus:border-amber-500"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-mono font-bold text-xs transition-colors cursor-pointer mt-3"
              >
                DEPLOY PROMO TOKEN
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
