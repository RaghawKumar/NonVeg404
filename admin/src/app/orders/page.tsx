'use client';

import React, { useState, useEffect } from 'react';
import {
  ShoppingBag,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  MapPin,
  Phone,
  Mail,
  Truck,
  Store,
  ChevronRight,
  X,
  CreditCard,
  QrCode,
  Banknote,
  Building,
} from 'lucide-react';
import { INITIAL_ORDERS } from '@/data/mockAdminData';
import { Order, OrderStatus } from '@/types/admin';
import { adminApi } from '@/lib/api';

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>(INITIAL_ORDERS);
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [inspectOrder, setInspectOrder] = useState<Order | null>(null);

  const fetchOrders = async () => {
    try {
      const res = await adminApi.orders.getAll();
      if (res.success && res.orders.length > 0) {
        setOrders(res.orders);
      }
    } catch {
      // Keep initial dataset on error
    }
  };

  useEffect(() => {
    fetchOrders();
    // Poll every 10 seconds for real-time order incoming
    const interval = setInterval(fetchOrders, 10000);
    return () => clearInterval(interval);
  }, []);

  const statuses: ('ALL' | OrderStatus)[] = [
    'ALL',
    'INITIALIZED',
    'ACCEPTED',
    'PREPARING',
    'READY',
    'OUT_FOR_DELIVERY',
    'DELIVERED',
  ];

  const handleUpdateStatus = async (orderId: string, newStatus: OrderStatus) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
    );
    if (inspectOrder && inspectOrder.id === orderId) {
      setInspectOrder({ ...inspectOrder, status: newStatus });
    }

    try {
      await adminApi.orders.updateStatus(orderId, newStatus);
    } catch (e: any) {
      console.warn('Backend order status update failed:', e.message);
    }
  };

  const filteredOrders = orders.filter((order) => {
    if (selectedStatus !== 'ALL' && order.status !== selectedStatus) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchId = order.id.toLowerCase().includes(q);
      const matchCustomer = order.customerName.toLowerCase().includes(q);
      const matchPhone = order.phone.includes(q);
      if (!matchId && !matchCustomer && !matchPhone) return false;
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-800">
        <div>
          <h1 className="text-2xl font-bold text-white font-sans">
            Orders Dispatch Pipeline
          </h1>
          <p className="text-xs font-mono text-zinc-400">
            Real-time stage transitions for live kitchen and customer courier telemetry.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 font-mono text-xs font-bold">
            Total Orders: {orders.length}
          </span>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="p-4 rounded-2xl bg-[#0e0e13] border border-zinc-800 space-y-3">
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
          <input
            type="text"
            placeholder="Search orders by ID (e.g. NV404-8924), customer name, or phone..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-xs sm:text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-amber-500 font-mono"
          />
        </div>

        {/* Status Filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs font-mono scrollbar-none">
          {statuses.map((st) => (
            <button
              key={st}
              onClick={() => setSelectedStatus(st)}
              className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors cursor-pointer ${
                selectedStatus === st
                  ? 'bg-amber-500 text-black font-bold shadow-md shadow-amber-500/10'
                  : 'bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {filteredOrders.length > 0 ? (
          filteredOrders.map((order) => (
            <div
              key={order.id}
              className="p-5 sm:p-6 rounded-2xl bg-[#0e0e13] border border-zinc-800 hover:border-zinc-700 transition-all space-y-4 shadow-xl"
            >
              {/* Order Card Top Bar */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-zinc-800">
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2.5">
                    <span className="text-xl font-mono font-extrabold text-amber-400">
                      #{order.id}
                    </span>
                    <span className="px-2.5 py-0.5 rounded text-[11px] font-mono font-bold bg-amber-500/10 text-amber-400 border border-amber-500/30">
                      &lt; {order.status} /&gt;
                    </span>
                    <span className="px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-zinc-300 font-mono text-[10px] flex items-center gap-1">
                      {order.deliveryType === 'delivery' ? (
                        <>
                          <Truck className="w-3 h-3 text-amber-400" />
                          <span>DELIVERY</span>
                        </>
                      ) : (
                        <>
                          <Store className="w-3 h-3 text-amber-400" />
                          <span>COUNTER PICKUP</span>
                        </>
                      )}
                    </span>
                    <span className="text-[11px] text-zinc-500 font-mono">
                      Staged {order.createdAt}
                    </span>
                  </div>

                  <div className="text-xs text-zinc-300">
                    <strong className="text-white">{order.customerName}</strong> ({order.phone}) • {order.email}
                  </div>
                  <div className="text-xs text-zinc-400 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                    <span>{order.address}</span>
                  </div>
                </div>

                {/* Status Advancement Selector */}
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono text-zinc-400">Set Stage:</span>
                  <select
                    value={order.status}
                    onChange={(e) => handleUpdateStatus(order.id, e.target.value as OrderStatus)}
                    className="px-3 py-1.5 rounded-xl bg-zinc-950 border border-zinc-700 text-xs font-mono text-amber-400 focus:outline-none focus:border-amber-500 cursor-pointer"
                  >
                    <option value="INITIALIZED">1. INITIALIZED</option>
                    <option value="ACCEPTED">2. ACCEPTED</option>
                    <option value="PREPARING">3. PREPARING</option>
                    <option value="READY">4. READY</option>
                    <option value="OUT_FOR_DELIVERY">5. OUT_FOR_DELIVERY</option>
                    <option value="DELIVERED">6. DELIVERED</option>
                  </select>
                </div>
              </div>

              {/* Items & Manifest Summary */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-4 text-xs font-mono items-center">
                <div className="md:col-span-8 space-y-1.5">
                  <div className="text-zinc-500 font-bold">DISHES STAGED:</div>
                  <div className="space-y-1">
                    {order.items.map((it, idx) => (
                      <div key={idx} className="flex items-center justify-between text-zinc-300">
                        <span>
                          {it.quantity}x {it.name}
                        </span>
                        <span className="text-amber-400">
                          ₹{(it.price * it.quantity).toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>

                  {order.orderNotes && (
                    <div className="text-[11px] text-zinc-400 italic pt-1">
                      Chef Note: &ldquo;{order.orderNotes}&rdquo;
                    </div>
                  )}
                </div>

                {/* Total & Detail Inspector Trigger */}
                <div className="md:col-span-4 flex flex-col md:items-end justify-between space-y-2 pt-2 md:pt-0 border-t md:border-t-0 border-zinc-800">
                  <div className="text-right">
                    <span className="text-zinc-400 block text-[11px]">
                      Payment: <strong className="text-emerald-400">{order.paymentStatus} via {order.paymentMethod}</strong>
                    </span>
                    <span className="text-lg font-bold text-white font-mono">
                      Total: <span className="text-amber-400">₹{order.total.toFixed(2)}</span>
                    </span>
                  </div>

                  <button
                    onClick={() => setInspectOrder(order)}
                    className="px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-200 border border-zinc-700 text-xs font-mono transition-colors cursor-pointer"
                  >
                    View Full Manifest &rarr;
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="p-12 text-center bg-[#0e0e13] rounded-2xl border border-dashed border-zinc-800 text-zinc-500 text-xs font-mono">
            // 404: No orders matching current filter criteria.
          </div>
        )}
      </div>

      {/* Order Inspector Modal */}
      {inspectOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="relative w-full max-w-lg bg-[#0e0e14] border border-zinc-800 rounded-3xl p-6 space-y-5 shadow-2xl font-mono text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
              <div>
                <h3 className="text-base font-bold text-white">
                  Order Manifest: #{inspectOrder.id}
                </h3>
                <span className="text-[10px] text-amber-400">
                  // {inspectOrder.status}
                </span>
              </div>
              <button
                onClick={() => setInspectOrder(null)}
                className="p-1.5 rounded-full bg-zinc-900 text-zinc-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3">
              <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-800 space-y-1">
                <div className="text-zinc-500">CUSTOMER IDENTIFIERS</div>
                <div className="text-white font-bold">{inspectOrder.customerName}</div>
                <div className="text-zinc-400">{inspectOrder.phone} • {inspectOrder.email}</div>
                <div className="text-zinc-400 mt-1">{inspectOrder.address}</div>
              </div>

              <div className="space-y-1.5">
                <div className="text-zinc-500 font-bold">ITEMS BREAKDOWN</div>
                <div className="max-h-48 overflow-y-auto space-y-1.5 pr-1">
                  {inspectOrder.items.map((it, idx) => (
                    <div key={idx} className="p-2 rounded-lg bg-zinc-950 border border-zinc-900 flex justify-between">
                      <div>
                        <div className="text-white">{it.quantity}x {it.name}</div>
                        {it.addOns.length > 0 && (
                          <div className="text-[10px] text-zinc-500">
                            Add-ons: {it.addOns.map((a) => a.name).join(', ')}
                          </div>
                        )}
                      </div>
                      <div className="text-amber-400 font-bold">
                        ₹{(it.price * it.quantity).toFixed(2)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-2 border-t border-zinc-800 space-y-1 text-zinc-400">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="text-white">₹{inspectOrder.subtotal.toFixed(2)}</span>
                </div>
                {inspectOrder.discount > 0 && (
                  <div className="flex justify-between text-emerald-400">
                    <span>Discount</span>
                    <span>-₹{inspectOrder.discount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Dispatch Fee</span>
                  <span className="text-white">₹{inspectOrder.deliveryFee.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Taxes (5%)</span>
                  <span className="text-white">₹{inspectOrder.tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm font-bold text-white pt-1 border-t border-zinc-800">
                  <span>Total Amount</span>
                  <span className="text-amber-400 text-base">₹{inspectOrder.total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
