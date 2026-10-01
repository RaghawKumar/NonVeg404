'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import { api } from '@/lib/api';
import {
  User,
  Shield,
  Award,
  Sparkles,
  MapPin,
  Phone,
  Mail,
  ShoppingBag,
  ExternalLink,
  LogOut,
  Clock,
  Terminal,
  ChevronRight,
  Save,
  CheckCircle2,
} from 'lucide-react';

export default function CustomerAccountPage() {
  const router = useRouter();
  const { user, isLoggedIn, logout, demoLogin, isLoading } = useAuth();
  const { orders } = useCart();

  const [customerOrders, setCustomerOrders] = useState<any[]>([]);
  const [street, setStreet] = useState(user?.address?.street || '');
  const [city, setCity] = useState(user?.address?.city || 'Tech City');
  const [zipCode, setZipCode] = useState(user?.address?.zipCode || '94016');
  const [notes, setNotes] = useState(user?.address?.notes || '');
  const [addressSaved, setAddressSaved] = useState(false);

  useEffect(() => {
    if (user?.address) {
      setStreet(user.address.street || '');
      setCity(user.address.city || 'Tech City');
      setZipCode(user.address.zipCode || '94016');
      setNotes(user.address.notes || '');
    }
  }, [user]);

  useEffect(() => {
    async function loadOrders() {
      try {
        const res = await api.orders.getMyOrders();
        if (res.success && res.orders && res.orders.length > 0) {
          setCustomerOrders(res.orders);
        } else if (orders.length > 0) {
          setCustomerOrders(orders);
        }
      } catch {
        if (orders.length > 0) {
          setCustomerOrders(orders);
        }
      }
    }
    if (isLoggedIn) {
      loadOrders();
    }
  }, [isLoggedIn, orders]);

  const handleSaveAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (user) {
      const updatedUser = {
        ...user,
        address: { street, city, zipCode, notes },
      };
      localStorage.setItem('nv404_customer_user', JSON.stringify(updatedUser));
      setAddressSaved(true);
      setTimeout(() => setAddressSaved(false), 2500);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#070709] pt-28 pb-16 flex items-center justify-center">
        <div className="flex items-center gap-3 text-amber-400 font-mono text-xs">
          <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
          <span>[KERNEL] Loading developer profile...</span>
        </div>
      </div>
    );
  }

  // Unauthorized view
  if (!isLoggedIn || !user) {
    return (
      <div className="min-h-screen bg-[#070709] pt-28 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md mx-auto text-center space-y-6 pt-12">
          <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center mx-auto text-amber-400 shadow-xl shadow-amber-500/10">
            <User className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 font-mono text-xs font-semibold">
              <Terminal className="w-3.5 h-3.5" />
              <span>// AUTHENTICATION REQUIRED //</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white">
              Developer Diner Profile
            </h1>
            <p className="text-xs sm:text-sm text-zinc-400 font-mono">
              Sign in to earn loyalty Dev Points, track your compile pipeline, and manage delivery addresses.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
            <Link
              href="/login?redirect=/account"
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-black font-bold text-xs font-mono transition-transform active:scale-95 shadow-lg shadow-amber-500/20"
            >
              Sign In to Account
            </Link>
            <Link
              href="/register?redirect=/account"
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-800 text-xs font-mono transition-colors"
            >
              Compile New Account (+50 Pts)
            </Link>
          </div>

          {/* 1-Click Demo Logins */}
          <div className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800/80 space-y-3 mt-8">
            <div className="text-xs font-mono text-zinc-500 uppercase tracking-wider">
              Quick 1-Click Developer Login
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => demoLogin('linus')}
                className="p-2.5 rounded-xl bg-zinc-900 hover:bg-amber-500/10 hover:border-amber-500/40 border border-zinc-800 text-left transition-all cursor-pointer group"
              >
                <div className="text-xs font-bold text-white group-hover:text-amber-400">Linus Torvalds</div>
                <div className="text-[10px] font-mono text-zinc-500">Kernel VIP (450 pts)</div>
              </button>
              <button
                onClick={() => demoLogin('ada')}
                className="p-2.5 rounded-xl bg-zinc-900 hover:bg-amber-500/10 hover:border-amber-500/40 border border-zinc-800 text-left transition-all cursor-pointer group"
              >
                <div className="text-xs font-bold text-white group-hover:text-amber-400">Ada Lovelace</div>
                <div className="text-[10px] font-mono text-zinc-500">Sudo Dev (220 pts)</div>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const nextTierPoints = user.points >= 500 ? 500 : user.points >= 200 ? 500 : 200;
  const progressPercent = Math.min(100, Math.round((user.points / nextTierPoints) * 100));

  return (
    <div className="min-h-screen bg-[#070709] pt-28 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Top Header Card */}
        <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-[#12121a] via-[#0c0c12] to-[#070709] border border-zinc-800 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center gap-4 sm:gap-5">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-500 flex items-center justify-center text-black font-black text-2xl sm:text-3xl shadow-xl shadow-amber-500/20">
                {user.name.charAt(0)}
              </div>
              <div className="space-y-1">
                <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 font-mono text-[11px] font-bold">
                  <Award className="w-3.5 h-3.5" />
                  <span>{user.tier}</span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                  {user.name}
                </h1>
                <div className="flex flex-wrap items-center gap-3 text-xs font-mono text-zinc-400">
                  <span className="flex items-center gap-1">
                    <Mail className="w-3.5 h-3.5 text-zinc-500" />
                    <span>{user.email}</span>
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Phone className="w-3.5 h-3.5 text-zinc-500" />
                    <span>{user.phone}</span>
                  </span>
                  <span>•</span>
                  <span className="text-amber-400/90 font-semibold">{user.role || 'Full-Stack Developer'}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Link
                href="/menu"
                className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-black font-mono font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-amber-500/20"
              >
                <Sparkles className="w-4 h-4 fill-black" />
                <span>Compile New Feast</span>
              </Link>
              <button
                onClick={() => {
                  logout();
                  router.push('/');
                }}
                className="px-3.5 py-2.5 rounded-xl bg-zinc-900 hover:bg-red-950/40 text-zinc-400 hover:text-red-400 border border-zinc-800 hover:border-red-900/60 font-mono text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>

          {/* Dev Loyalty Level Progress */}
          <div className="mt-8 pt-6 border-t border-zinc-800/80 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-2xl bg-zinc-950/80 border border-zinc-800/80 space-y-2">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-zinc-400 uppercase">Dev Loyalty Points</span>
                <span className="text-amber-400 font-bold">{user.points} pts</span>
              </div>
              <div className="w-full bg-zinc-900 h-2 rounded-full overflow-hidden border border-zinc-800">
                <div
                  className="bg-gradient-to-r from-amber-500 to-orange-500 h-full rounded-full transition-all duration-500"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
              <div className="text-[10px] font-mono text-zinc-500">
                {user.points >= 500
                  ? 'Maximum Kernel VIP Tier achieved. Unlimited free delivery!'
                  : `${nextTierPoints - user.points} pts needed for tier upgrade.`}
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-zinc-950/80 border border-zinc-800/80 flex items-center justify-between">
              <div>
                <div className="text-xs font-mono text-zinc-400 uppercase">Current Tier Perk</div>
                <div className="text-sm font-bold text-white mt-1">
                  {user.tier === 'Kernel VIP'
                    ? '100% Free Shipping + Priority Clay Tandoor Queue'
                    : user.tier === 'Sudo Dev'
                    ? '15% Off Code DEPLOY15 + Express Prep'
                    : '10% Welcome Discount (FIRST_COMMIT)'}
                </div>
              </div>
              <div className="p-3 rounded-xl bg-amber-500/10 text-amber-400">
                <Shield className="w-5 h-5" />
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-zinc-950/80 border border-zinc-800/80 flex items-center justify-between">
              <div>
                <div className="text-xs font-mono text-zinc-400 uppercase">Total Orders Placed</div>
                <div className="text-2xl font-mono font-black text-white mt-1">
                  {customerOrders.length}
                </div>
              </div>
              <div className="p-3 rounded-xl bg-orange-500/10 text-orange-400">
                <ShoppingBag className="w-5 h-5" />
              </div>
            </div>
          </div>
        </div>

        {/* 2-Column Section: Orders History & Delivery Address */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Recent Orders Manifest (8 cols) */}
          <div className="lg:col-span-8 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-white font-sans flex items-center gap-2">
                <Clock className="w-5 h-5 text-amber-500" />
                <span>Order History &amp; Pipeline</span>
              </h2>
              <span className="text-xs font-mono text-zinc-500">
                {customerOrders.length} builds recorded
              </span>
            </div>

            {customerOrders.length === 0 ? (
              <div className="p-8 rounded-2xl bg-[#0e0e13] border border-zinc-800 text-center space-y-3 font-mono">
                <p className="text-sm text-zinc-400">No active builds or orders yet.</p>
                <Link
                  href="/menu"
                  className="inline-block px-4 py-2 rounded-xl bg-amber-500 text-black font-bold text-xs"
                >
                  Browse Menu &rarr;
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {customerOrders.map((ord) => (
                  <div
                    key={ord.id}
                    className="p-5 rounded-2xl bg-[#0e0e13] border border-zinc-800 hover:border-zinc-700 transition-all space-y-3 shadow-xl"
                  >
                    <div className="flex items-center justify-between border-b border-zinc-800/80 pb-3">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-sm font-bold text-amber-400">#{ord.id}</span>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-zinc-400">
                          {ord.deliveryType || 'Delivery'}
                        </span>
                      </div>
                      <span className="px-2.5 py-0.5 rounded-full font-mono text-[10px] font-bold bg-amber-500/10 border border-amber-500/30 text-amber-400">
                        {ord.status}
                      </span>
                    </div>

                    <div className="text-xs font-mono text-zinc-300">
                      {ord.items && ord.items.length > 0 ? (
                        <div className="space-y-1">
                          {ord.items.map((it: any, idx: number) => (
                            <div key={idx} className="flex justify-between text-zinc-400">
                              <span>
                                {it.quantity}x {it.name || it.foodItem?.name}
                              </span>
                              <span className="text-zinc-500">
                                ₹{(it.price || it.foodItem?.price)?.toFixed(2)}
                              </span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <span className="text-zinc-500">Direct order compiled from terminal</span>
                      )}
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-zinc-800/60 font-mono text-xs">
                      <div>
                        <span className="text-zinc-500">Total: </span>
                        <span className="text-white font-bold text-sm">₹{ord.total?.toFixed(2)}</span>
                      </div>
                      <Link
                        href={`/track-order?id=${ord.id}`}
                        className="px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-amber-400 font-bold text-xs flex items-center gap-1 border border-zinc-800 transition-colors"
                      >
                        <span>Live Tracking</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Delivery Coordinates (4 cols) */}
          <div className="lg:col-span-4 p-6 rounded-2xl bg-[#0e0e13] border border-zinc-800 space-y-5 shadow-xl">
            <div className="space-y-1">
              <h2 className="text-base font-bold text-white font-sans flex items-center gap-2">
                <MapPin className="w-4 h-4 text-amber-500" />
                <span>Delivery Geofence</span>
              </h2>
              <p className="text-[11px] font-mono text-zinc-400">
                Default location loaded during fast checkout handshakes.
              </p>
            </div>

            <form onSubmit={handleSaveAddress} className="space-y-3.5 font-mono text-xs">
              <div className="space-y-1">
                <label className="text-zinc-400 text-[11px]">Street &amp; Apt/Suite</label>
                <input
                  type="text"
                  value={street}
                  onChange={(e) => setStreet(e.target.value)}
                  placeholder="e.g. 1024 Binary Way, Suite 4B"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-white placeholder-zinc-600 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <label className="text-zinc-400 text-[11px]">City / Node</label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-zinc-400 text-[11px]">Postal Code</label>
                  <input
                    type="text"
                    value={zipCode}
                    onChange={(e) => setZipCode(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-zinc-400 text-[11px]">Rider Compilation Notes</label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. Leave with security desk if build running."
                  className="w-full px-3.5 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-white placeholder-zinc-600 focus:outline-none focus:border-amber-500 text-xs"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save Coordinates</span>
              </button>

              {addressSaved && (
                <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[11px] flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Address synced to local session!</span>
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
