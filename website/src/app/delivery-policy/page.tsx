import React from 'react';
import Link from 'next/link';
import { Truck, ChevronLeft } from 'lucide-react';

export default function DeliveryPolicyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8 font-sans">
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-xs font-mono text-zinc-400 hover:text-amber-400 transition-colors"
      >
        <ChevronLeft className="w-4 h-4" />
        <span>BACK_TO_HOME</span>
      </Link>

      <div className="space-y-2 border-b border-zinc-800 pb-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 font-mono text-xs font-semibold">
          <Truck className="w-3.5 h-3.5" />
          <span>PACKET_DISPATCH_PROTOCOL</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white">
          Delivery Policy
        </h1>
        <p className="text-xs font-mono text-zinc-500">
          Transit SLAs, Geofencing, and Hot-Chain Guarantees
        </p>
      </div>

      <div className="space-y-6 text-sm text-zinc-300 leading-relaxed">
        <section className="space-y-2">
          <h2 className="text-lg font-bold text-white font-mono">// 1. Geofenced Coverage Radius</h2>
          <p>
            NON VEG 404 dispatches within a calibrated 15-kilometer operational radius from our Silicon Grill District kitchen. This ensures low-latency delivery and piping-hot food upon arrival.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-bold text-white font-mono">// 2. Transit SLAs & Timings</h2>
          <p>
            Average delivery duration is 30 to 45 minutes depending on real-time kitchen load and road traffic. Orders placed during our Late Night Dev Shift (10 PM - 2 AM) typically enjoy faster routing due to clear corridors.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-bold text-white font-mono">// 3. Thermal Packaging Security</h2>
          <p>
            All non-veg feasts are enclosed in tamper-evident, sealed aluminum steam-retaining thermal pods. If the security seal is fractured upon delivery, please reject the packet and contact our dispatch desk immediately.
          </p>
        </section>
      </div>
    </div>
  );
}
