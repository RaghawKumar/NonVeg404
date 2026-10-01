'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  IndianRupee,
  ShoppingBag,
  Flame,
  Users,
  CalendarCheck,
  TrendingUp,
  Activity,
  ArrowUpRight,
  Clock,
  CheckCircle2,
  AlertCircle,
  Plus,
  ShieldAlert,
  Zap,
} from 'lucide-react';
import { INITIAL_ORDERS, INITIAL_RESERVATIONS, INITIAL_FOOD_ITEMS } from '@/data/mockAdminData';
import { adminApi } from '@/lib/api';

export default function AdminDashboardPage() {
  const [orders, setOrders] = useState(INITIAL_ORDERS);
  const [stats, setStats] = useState({
    totalOrders: 184,
    totalRevenue: 2840.40,
    pendingOrders: 3,
    cookingOrders: 2,
    reservationsToday: INITIAL_RESERVATIONS.length,
    isKitchenOpen: true,
  });

  useEffect(() => {
    async function loadData() {
      try {
        const [dashRes, ordersRes] = await Promise.allSettled([
          adminApi.dashboard.get(),
          adminApi.orders.getAll({ limit: '8' } as any),
        ]);

        if (dashRes.status === 'fulfilled' && dashRes.value.success) {
          setStats((prev) => ({
            ...prev,
            totalOrders: dashRes.value.stats.totalOrders || prev.totalOrders,
            totalRevenue: dashRes.value.stats.totalRevenue || prev.totalRevenue,
            pendingOrders: dashRes.value.stats.pendingOrders || prev.pendingOrders,
            cookingOrders: dashRes.value.stats.cookingOrders || prev.cookingOrders,
            reservationsToday: dashRes.value.stats.reservationsToday || prev.reservationsToday,
          }));
        }

        if (ordersRes.status === 'fulfilled' && ordersRes.value.success && ordersRes.value.orders.length > 0) {
          setOrders(ordersRes.value.orders);
        }
      } catch (e) {
        console.warn('Dashboard live telemetry fell back to mock dataset.');
      }
    }
    loadData();
  }, []);

  const activeOrders = orders.filter((o) => o.status !== 'DELIVERED').length;
  const totalRevenue = stats.totalRevenue;

  return (
    <div className="space-y-8">
      {/* Top Welcome & KPI Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-zinc-800">
        <div className="space-y-1">
          <div className="flex items-center gap-2 font-mono text-xs text-amber-400 font-bold uppercase tracking-wider">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span>TERMINAL_DASHBOARD // PRODUCTION METRICS</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            NON VEG 404 Kernel Status
          </h1>
          <p className="text-xs font-mono text-zinc-400">
            Monitoring active kitchen threads, orders dispatch pipeline, and dining reservations.
          </p>
        </div>

        {/* Quick Action CTAs */}
        <div className="flex items-center gap-2.5">
          <Link
            href="/menu"
            className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-mono font-bold text-xs transition-colors flex items-center gap-1.5 shadow-lg shadow-amber-500/20"
          >
            <Plus className="w-4 h-4" />
            <span>Add Food Item</span>
          </Link>
          <Link
            href="/orders"
            className="px-4 py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-200 border border-zinc-800 font-mono text-xs transition-colors"
          >
            View Live Queue
          </Link>
        </div>
      </div>

      {/* 4 Core KPI Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        <div className="p-5 rounded-2xl bg-[#0e0e13] border border-zinc-800 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-zinc-400 uppercase">Gross Revenue (Today)</span>
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400">
              <IndianRupee className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-mono font-extrabold text-amber-400">
            ₹{totalRevenue.toFixed(2)}
          </div>
          <div className="text-[11px] font-mono text-emerald-400 flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>+24.6% vs yesterday</span>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-[#0e0e13] border border-zinc-800 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-zinc-400 uppercase">Active Kitchen Builds</span>
            <div className="p-2 rounded-xl bg-red-500/10 text-red-400">
              <Flame className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-mono font-extrabold text-red-400">
            {activeOrders} In Queue
          </div>
          <div className="text-[11px] font-mono text-zinc-400 flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-amber-400" />
            <span>Avg build latency: 18m</span>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-[#0e0e13] border border-zinc-800 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-zinc-400 uppercase">Orders Dispatched</span>
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-mono font-extrabold text-white">
            184
          </div>
          <div className="text-[11px] font-mono text-emerald-400">
            99.98% zero bugs delivery
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-[#0e0e13] border border-zinc-800 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-zinc-400 uppercase">Table Locks (Tonight)</span>
            <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400">
              <CalendarCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-mono font-extrabold text-white">
            {INITIAL_RESERVATIONS.length} Booked
          </div>
          <div className="text-[11px] font-mono text-amber-400">
            Peak slot: 08:00 - 09:30 PM
          </div>
        </div>
      </div>

      {/* Telemetry Bar & Live Kitchen Thread Monitoring */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Kitchen Hardware Telemetry */}
        <div className="lg:col-span-4 p-5 rounded-2xl bg-[#0e0e13] border border-zinc-800 space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-zinc-800">
              <h3 className="text-xs font-mono font-bold text-white uppercase flex items-center gap-1.5">
                <Activity className="w-4 h-4 text-emerald-400" />
                <span>Kitchen Core Telemetry</span>
              </h3>
              <span className="text-[10px] font-mono text-emerald-400">STABLE</span>
            </div>

            <div className="space-y-2.5 text-xs font-mono">
              <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-800/80 space-y-1">
                <div className="flex justify-between text-zinc-400">
                  <span>Clay Tandoor #1 (Skewers)</span>
                  <span className="text-amber-400 font-bold">452°C</span>
                </div>
                <div className="w-full bg-zinc-800 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-amber-500 h-full w-[88%]" />
                </div>
              </div>

              <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-800/80 space-y-1">
                <div className="flex justify-between text-zinc-400">
                  <span>Clay Tandoor #2 (Naan/Roti)</span>
                  <span className="text-amber-400 font-bold">440°C</span>
                </div>
                <div className="w-full bg-zinc-800 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-orange-500 h-full w-[82%]" />
                </div>
              </div>

              <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-800/80 space-y-1">
                <div className="flex justify-between text-zinc-400">
                  <span>Dum Biryani Handi #3</span>
                  <span className="text-emerald-400 font-bold">Dum Active (18m left)</span>
                </div>
                <div className="w-full bg-zinc-800 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-emerald-500 h-full w-[65%]" />
                </div>
              </div>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-900 text-[11px] font-mono text-zinc-500">
            // Thermal sensors reporting 100% telemetry uptime.
          </div>
        </div>

        {/* Live Orders Pipeline Table Preview */}
        <div className="lg:col-span-8 p-5 sm:p-6 rounded-2xl bg-[#0e0e13] border border-zinc-800 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
            <div>
              <h3 className="text-sm sm:text-base font-bold text-white font-mono flex items-center gap-2">
                <ShoppingBag className="w-4 h-4 text-amber-500" />
                <span>Live Orders Build Stream</span>
              </h3>
              <p className="text-[11px] text-zinc-400 font-mono">
                Recent orders staged in the kitchen compiler pipeline
              </p>
            </div>
            <Link
              href="/orders"
              className="text-xs font-mono text-amber-400 hover:text-amber-300 font-bold flex items-center gap-1"
            >
              <span>Manage All ({orders.length})</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead>
                <tr className="border-b border-zinc-800 text-zinc-500">
                  <th className="py-2.5 px-3">Order ID</th>
                  <th className="py-2.5 px-3">Customer</th>
                  <th className="py-2.5 px-3">Items Staged</th>
                  <th className="py-2.5 px-3">Total</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/80 text-zinc-300">
                {orders.map((order) => (
                  <tr key={order.id} className="hover:bg-zinc-900/40 transition-colors">
                    <td className="py-3 px-3 font-bold text-amber-400">#{order.id}</td>
                    <td className="py-3 px-3">
                      <div className="text-white font-medium">{order.customerName}</div>
                      <div className="text-[10px] text-zinc-500">{order.phone}</div>
                    </td>
                    <td className="py-3 px-3 text-zinc-300">
                      {order.items.reduce((s, i) => s + i.quantity, 0)} items ({order.deliveryType})
                    </td>
                    <td className="py-3 px-3 font-bold text-white">₹{order.total.toFixed(2)}</td>
                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/30">
                        {order.status}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right">
                      <Link
                        href="/orders"
                        className="text-amber-400 hover:text-amber-300 font-bold text-[11px]"
                      >
                        Inspect &rarr;
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Quick Links Matrix */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <Link
          href="/menu"
          className="p-4 rounded-xl bg-zinc-950 border border-zinc-800/80 hover:border-amber-500/50 transition-all flex flex-col items-center text-center space-y-1.5"
        >
          <span className="text-2xl">🍗</span>
          <span className="text-xs font-mono font-bold text-white">Menu Catalog</span>
          <span className="text-[10px] text-zinc-500 font-mono">{INITIAL_FOOD_ITEMS.length} dishes online</span>
        </Link>

        <Link
          href="/categories"
          className="p-4 rounded-xl bg-zinc-950 border border-zinc-800/80 hover:border-amber-500/50 transition-all flex flex-col items-center text-center space-y-1.5"
        >
          <span className="text-2xl">📁</span>
          <span className="text-xs font-mono font-bold text-white">Categories</span>
          <span className="text-[10px] text-zinc-500 font-mono">10 active endpoints</span>
        </Link>

        <Link
          href="/reservations"
          className="p-4 rounded-xl bg-zinc-950 border border-zinc-800/80 hover:border-amber-500/50 transition-all flex flex-col items-center text-center space-y-1.5"
        >
          <span className="text-2xl">📅</span>
          <span className="text-xs font-mono font-bold text-white">Reservations</span>
          <span className="text-[10px] text-zinc-500 font-mono">{INITIAL_RESERVATIONS.length} locks booked</span>
        </Link>

        <Link
          href="/settings"
          className="p-4 rounded-xl bg-zinc-950 border border-zinc-800/80 hover:border-amber-500/50 transition-all flex flex-col items-center text-center space-y-1.5"
        >
          <span className="text-2xl">⚙️</span>
          <span className="text-xs font-mono font-bold text-white">Settings</span>
          <span className="text-[10px] text-zinc-500 font-mono">Operating hours & fees</span>
        </Link>
      </div>
    </div>
  );
}
