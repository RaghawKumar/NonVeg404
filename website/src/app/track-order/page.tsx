'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { Order, OrderStatus } from '@/types/restaurant';
import { api } from '@/lib/api';
import {
  Search,
  CheckCircle2,
  Clock,
  MapPin,
  Terminal,
  Truck,
  Flame,
  ChefHat,
  PackageCheck,
  Compass,
  AlertCircle,
  Phone,
  RefreshCw,
} from 'lucide-react';

const ORDER_STEPS: { status: OrderStatus; label: string; codeTag: string; icon: any }[] = [
  {
    status: 'INITIALIZED',
    label: 'Order Initialized',
    codeTag: '< ORDER INITIALIZED />',
    icon: Terminal,
  },
  {
    status: 'ACCEPTED',
    label: 'Ingredients Locked',
    codeTag: '< COMPILING INGREDIENTS />',
    icon: Flame,
  },
  {
    status: 'PREPARING',
    label: 'Kitchen Building',
    codeTag: '< KITCHEN BUILDING YOUR ORDER />',
    icon: ChefHat,
  },
  {
    status: 'READY',
    label: 'Quality Assured',
    codeTag: '< QUALITY ASSURANCE PASSED />',
    icon: PackageCheck,
  },
  {
    status: 'OUT_FOR_DELIVERY',
    label: 'Out for Deployment',
    codeTag: '< OUT FOR DEPLOYMENT />',
    icon: Truck,
  },
  {
    status: 'DELIVERED',
    label: 'Build Successful',
    codeTag: '< BUILD SUCCESSFUL />',
    icon: CheckCircle2,
  },
];

function TrackOrderContent() {
  const searchParams = useSearchParams();
  const { orders, getOrderById, updateOrderStatus } = useCart();

  const [inputOrderId, setInputOrderId] = useState('');
  const [activeOrder, setActiveOrder] = useState<Order | null>(null);

  useEffect(() => {
    async function loadOrder() {
      const idFromParam = searchParams.get('id');
      const targetId = idFromParam || (orders.length > 0 ? orders[0].id : null);
      if (targetId) {
        setInputOrderId(targetId);
        // First check local cart context
        const localFound = getOrderById(targetId);
        if (localFound) setActiveOrder(localFound);

        // Fetch latest status from backend
        try {
          const res = await api.orders.getById(targetId);
          if (res.success && res.order) {
            const backendOrder = res.order;
            const mappedOrder: Order = {
              id: backendOrder.id,
              customerName: backendOrder.customerName,
              phone: backendOrder.phone,
              email: backendOrder.email,
              address: backendOrder.address,
              deliveryType: backendOrder.deliveryType || 'delivery',
              paymentMethod: backendOrder.paymentMethod || 'COD',
              paymentStatus: backendOrder.paymentStatus || 'PENDING',
              orderNotes: backendOrder.orderNotes,
              items: backendOrder.items || [],
              subtotal: backendOrder.subtotal,
              tax: backendOrder.tax,
              deliveryFee: backendOrder.deliveryFee,
              discount: backendOrder.discount,
              total: backendOrder.total,
              status: backendOrder.status,
              createdAt: backendOrder.createdAt,
              estimatedDeliveryTime: backendOrder.estimatedDeliveryTime || '30-40 mins',
              statusMessages: (backendOrder.statusHistory || []).map((h: any) => ({
                status: h.status,
                label: h.label,
                timestamp: h.timestamp || 'Just now',
                codeLog: h.codeLog || '',
              })),
            };
            setActiveOrder(mappedOrder);
          }
        } catch {
          // offline fallback
        }
      }
    }
    loadOrder();

    // Poll every 8s for live backend update
    const interval = setInterval(loadOrder, 8000);
    return () => clearInterval(interval);
  }, [searchParams, orders, getOrderById]);

  const handleSearchOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputOrderId.trim()) return;
    const localFound = getOrderById(inputOrderId.trim());
    if (localFound) setActiveOrder(localFound);

    try {
      const res = await api.orders.getById(inputOrderId.trim());
      if (res.success && res.order) {
        const backendOrder = res.order;
        const mappedOrder: Order = {
          id: backendOrder.id,
          customerName: backendOrder.customerName,
          phone: backendOrder.phone,
          email: backendOrder.email,
          address: backendOrder.address,
          deliveryType: backendOrder.deliveryType || 'delivery',
          paymentMethod: backendOrder.paymentMethod || 'COD',
          paymentStatus: backendOrder.paymentStatus || 'PENDING',
          orderNotes: backendOrder.orderNotes,
          items: backendOrder.items || [],
          subtotal: backendOrder.subtotal,
          tax: backendOrder.tax,
          deliveryFee: backendOrder.deliveryFee,
          discount: backendOrder.discount,
          total: backendOrder.total,
          status: backendOrder.status,
          createdAt: backendOrder.createdAt,
          estimatedDeliveryTime: backendOrder.estimatedDeliveryTime || '30-40 mins',
          statusMessages: (backendOrder.statusHistory || []).map((h: any) => ({
            status: h.status,
            label: h.label,
            timestamp: h.timestamp || 'Just now',
            codeLog: h.codeLog || '',
          })),
        };
        setActiveOrder(mappedOrder);
      }
    } catch {
      if (!localFound) setActiveOrder(null);
    }
  };

  const getStepIndex = (status: OrderStatus) => {
    return ORDER_STEPS.findIndex((s) => s.status === status);
  };

  const currentStepIndex = activeOrder ? getStepIndex(activeOrder.status) : 0;

  // Simulation tool for demo/testing
  const advanceToNextStep = () => {
    if (!activeOrder) return;
    const currentIndex = getStepIndex(activeOrder.status);
    if (currentIndex < ORDER_STEPS.length - 1) {
      const nextStatus = ORDER_STEPS[currentIndex + 1].status;
      updateOrderStatus(activeOrder.id, nextStatus);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 font-mono text-xs font-semibold">
          <Compass className="w-3.5 h-3.5" />
          <span>REALTIME_DISPATCH_TELEMETRY</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-white">
          Track Your Feast Pipeline
        </h1>
        <p className="text-zinc-400 text-sm leading-relaxed">
          Monitor your order compilation in real time with developer-grade telemetry logs.
        </p>
      </div>

      {/* Order Search Input */}
      <div className="max-w-xl mx-auto">
        <form onSubmit={handleSearchOrder} className="flex items-center gap-2 bg-[#0e0e13] border border-zinc-800 p-2 rounded-2xl shadow-xl">
          <Search className="w-5 h-5 text-zinc-500 ml-2" />
          <input
            type="text"
            placeholder="Enter Order ID (e.g. NV404-8924)..."
            value={inputOrderId}
            onChange={(e) => setInputOrderId(e.target.value)}
            className="flex-1 bg-transparent px-2 py-2 text-sm font-mono text-white placeholder-zinc-500 focus:outline-none"
          />
          <button
            type="submit"
            className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-mono font-bold text-xs transition-colors cursor-pointer"
          >
            TRACK
          </button>
        </form>
      </div>

      {activeOrder ? (
        <div className="space-y-8">
          {/* Top Status Card */}
          <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-b from-[#111118] to-[#0a0a0f] border border-amber-500/40 shadow-2xl relative overflow-hidden">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-zinc-800">
              <div className="space-y-1">
                <div className="text-xs font-mono text-zinc-400">
                  TRACKING BUILD INSTANCE:
                </div>
                <div className="flex items-center gap-3">
                  <h2 className="text-2xl sm:text-3xl font-mono font-extrabold text-amber-400">
                    #{activeOrder.id}
                  </h2>
                  <span className="px-2.5 py-1 rounded bg-amber-500/10 border border-amber-500/40 text-amber-400 font-mono text-xs font-bold">
                    {ORDER_STEPS[currentStepIndex]?.codeTag}
                  </span>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-4 text-xs font-mono">
                <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-800">
                  <div className="text-zinc-500">ESTIMATED ETA</div>
                  <div className="text-white font-bold text-sm flex items-center gap-1.5 mt-0.5">
                    <Clock className="w-4 h-4 text-amber-500" />
                    <span>{activeOrder.estimatedDeliveryTime}</span>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-800">
                  <div className="text-zinc-500">PAYMENT STATUS</div>
                  <div className="text-emerald-400 font-bold text-sm flex items-center gap-1.5 mt-0.5">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>{activeOrder.paymentStatus} ({activeOrder.paymentMethod})</span>
                  </div>
                </div>

                {/* Simulation Button for Demo */}
                {currentStepIndex < ORDER_STEPS.length - 1 && (
                  <button
                    onClick={advanceToNextStep}
                    className="p-3 rounded-xl bg-zinc-900 hover:bg-amber-500 hover:text-black text-amber-400 border border-amber-500/40 font-bold transition-all flex items-center gap-1.5 cursor-pointer"
                    title="Simulate kitchen progress to next stage"
                  >
                    <RefreshCw className="w-4 h-4" />
                    <span>Advance Stage (Demo)</span>
                  </button>
                )}
              </div>
            </div>

            {/* Stepper Progression Bar */}
            <div className="pt-8">
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
                {ORDER_STEPS.map((step, idx) => {
                  const isCompleted = idx <= currentStepIndex;
                  const isCurrent = idx === currentStepIndex;
                  const StepIcon = step.icon;

                  return (
                    <div
                      key={step.status}
                      className={`p-4 rounded-2xl border transition-all flex flex-col justify-between space-y-3 ${
                        isCurrent
                          ? 'bg-amber-500/10 border-amber-500 shadow-lg shadow-amber-500/10'
                          : isCompleted
                          ? 'bg-zinc-900/60 border-zinc-800 text-zinc-300'
                          : 'bg-zinc-950/40 border-zinc-900 text-zinc-600 opacity-60'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span
                          className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-mono font-bold ${
                            isCompleted
                              ? 'bg-amber-500 text-black'
                              : 'bg-zinc-800 text-zinc-400'
                          }`}
                        >
                          {idx + 1}
                        </span>
                        <StepIcon
                          className={`w-5 h-5 ${
                            isCurrent
                              ? 'text-amber-400 animate-pulse'
                              : isCompleted
                              ? 'text-zinc-400'
                              : 'text-zinc-700'
                          }`}
                        />
                      </div>

                      <div>
                        <div className="text-xs font-bold text-white leading-tight">
                          {step.label}
                        </div>
                        <div className="text-[10px] font-mono text-amber-400/90 mt-1 line-clamp-1">
                          {step.codeTag}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Details Grid: Items breakdown + Live Terminal Output */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left: Terminal Output */}
            <div className="lg:col-span-7 rounded-2xl bg-[#09090d] border border-zinc-800 overflow-hidden shadow-2xl font-mono text-xs">
              <div className="px-4 py-2.5 bg-zinc-950 border-b border-zinc-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-500/80 inline-block" />
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80 inline-block" />
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80 inline-block" />
                  <span className="ml-2 text-zinc-400">systemd — telemetry-logs</span>
                </div>
                <span className="text-[10px] text-zinc-500">LIVE FEED</span>
              </div>

              <div className="p-4 space-y-3 max-h-80 overflow-y-auto">
                {activeOrder.statusMessages.map((msg, index) => (
                  <div key={index} className="space-y-1 border-l-2 border-amber-500/60 pl-3">
                    <div className="flex items-center gap-2 text-amber-400 font-bold">
                      <span>{msg.label}</span>
                      <span className="text-[10px] text-zinc-500 font-normal">
                        ({msg.timestamp})
                      </span>
                    </div>
                    <div className="text-zinc-300 text-[11px] leading-relaxed">
                      &gt; {msg.codeLog}
                    </div>
                  </div>
                ))}

                <div className="pt-2 text-emerald-400 flex items-center gap-2 text-[11px]">
                  <span className="terminal-cursor" />
                  <span>Listening on socket /ws/orders/{activeOrder.id}...</span>
                </div>
              </div>
            </div>

            {/* Right: Order Summary Details */}
            <div className="lg:col-span-5 rounded-2xl bg-[#0e0e13] border border-zinc-800 p-6 space-y-5">
              <h3 className="text-base font-bold text-white font-mono border-b border-zinc-800 pb-3">
                Order Manifest
              </h3>

              <div className="space-y-2 text-xs">
                <div className="text-zinc-400 flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-white font-medium block">
                      {activeOrder.customerName}
                    </span>
                    <span>{activeOrder.address}</span>
                  </div>
                </div>

                <div className="text-zinc-400 flex items-center gap-2 pt-1">
                  <Phone className="w-4 h-4 text-amber-500 shrink-0" />
                  <span>{activeOrder.phone}</span>
                </div>
              </div>

              {/* Items */}
              <div className="pt-2 border-t border-zinc-800 space-y-2 max-h-48 overflow-y-auto">
                {activeOrder.items.map((it) => (
                  <div key={it.cartItemId} className="flex justify-between items-start text-xs">
                    <span className="text-zinc-300">
                      {it.quantity}x {it.foodItem.name}
                    </span>
                    <span className="font-mono text-white">
                      ₹{((it.foodItem.price + it.selectedAddOns.reduce((s, a) => s + a.price, 0)) * it.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Totals */}
              <div className="pt-3 border-t border-zinc-800 space-y-1.5 text-xs">
                <div className="flex justify-between text-zinc-400">
                  <span>Subtotal</span>
                  <span className="font-mono text-white">₹{activeOrder.subtotal.toFixed(2)}</span>
                </div>
                {activeOrder.discount > 0 && (
                  <div className="flex justify-between text-emerald-400">
                    <span>Discount</span>
                    <span className="font-mono">-₹{activeOrder.discount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between text-zinc-400">
                  <span>Dispatch Fee</span>
                  <span className="font-mono text-white">
                    {activeOrder.deliveryFee === 0 ? 'FREE' : `₹${activeOrder.deliveryFee.toFixed(2)}`}
                  </span>
                </div>
                <div className="pt-2 border-t border-zinc-800 flex justify-between items-center text-sm font-bold">
                  <span className="text-white">Total Amount</span>
                  <span className="text-lg font-mono text-amber-400">
                    ₹{activeOrder.total.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-20 bg-[#0e0e13] rounded-3xl border border-dashed border-zinc-800 p-8 space-y-4 max-w-lg mx-auto">
          <AlertCircle className="w-12 h-12 text-amber-500 mx-auto" />
          <h3 className="text-xl font-bold text-white">Order Not Found (404)</h3>
          <p className="text-zinc-400 text-sm">
            We couldn&apos;t find an active order matching ID &ldquo;{inputOrderId}&rdquo;.
            Please check the Order ID received at checkout.
          </p>
          <Link
            href="/menu"
            className="inline-block px-6 py-2.5 rounded-xl bg-amber-500 text-black font-mono font-bold text-xs"
          >
            ORDER A FRESH FEAST
          </Link>
        </div>
      )}
    </div>
  );
}

export default function TrackOrderPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center text-amber-400 font-mono">
          Loading Order Pipeline...
        </div>
      }
    >
      <TrackOrderContent />
    </Suspense>
  );
}
