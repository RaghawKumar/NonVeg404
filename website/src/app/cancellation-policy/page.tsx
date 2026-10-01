import React from 'react';
import Link from 'next/link';
import { Ban, ChevronLeft } from 'lucide-react';

export default function CancellationPolicyPage() {
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
          <Ban className="w-3.5 h-3.5" />
          <span>PROCESS_TERMINATION_RULES</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white">
          Cancellation Policy
        </h1>
        <p className="text-xs font-mono text-zinc-500">
          SIGINT / SIGKILL Guidelines for Orders & Reservations
        </p>
      </div>

      <div className="space-y-6 text-sm text-zinc-300 leading-relaxed">
        <section className="space-y-2">
          <h2 className="text-lg font-bold text-white font-mono">// 1. Order Cancellation Window</h2>
          <p>
            Food orders may be canceled without penalty while in the <code className="text-amber-400">&lt; ORDER INITIALIZED /&gt;</code> state (typically the first 3 minutes after placement).
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-bold text-white font-mono">// 2. In-Flight Kitchen Builds</h2>
          <p>
            Once our clay tandoor and dum biryani threads enter <code className="text-amber-400">&lt; KITCHEN BUILDING /&gt;</code>, the fresh ingredients have been locked and custom-cooked for your order. Orders cannot be canceled after the kitchen build phase has begun.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-bold text-white font-mono">// 3. Reservation Cancellations</h2>
          <p>
            Table reservations can be canceled at any time up to 1 hour prior to your reserved slot without penalty directly via telephone or email.
          </p>
        </section>
      </div>
    </div>
  );
}
