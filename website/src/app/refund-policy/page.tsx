import React from 'react';
import Link from 'next/link';
import { RefreshCcw, ChevronLeft } from 'lucide-react';

export default function RefundPolicyPage() {
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
          <RefreshCcw className="w-3.5 h-3.5" />
          <span>TRANSACTION_ROLLBACK_POLICY</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white">
          Refund Policy
        </h1>
        <p className="text-xs font-mono text-zinc-500">
          Zero Bugs Guarantee // Rollback Guidelines
        </p>
      </div>

      <div className="space-y-6 text-sm text-zinc-300 leading-relaxed">
        <section className="space-y-2">
          <h2 className="text-lg font-bold text-white font-mono">// 1. Zero Bugs Quality Assurance</h2>
          <p>
            If your order arrives compromised (e.g. incorrect dish, broken container seal, or missing add-on item), we will immediately initiate a git-revert style rollback and issue either an instant kitchen re-cook or a 100% monetary refund.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-bold text-white font-mono">// 2. Resolution Timeframe</h2>
          <p>
            Please report any discrepancy within 60 minutes of delivery receipt via our Hotline (+1 555-404-MEAT) or live chat. Approved refunds are credited to the original payment source within 3-5 banking business days.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-bold text-white font-mono">// 3. Taste Preference Adjustments</h2>
          <p>
            Because spice tolerance is subjective, we calibrate heat levels rigorously according to our Spice Meter. If you accidentally ordered &ldquo;Code Red&rdquo; and need milder flavor, our staff is happy to offer complimentary soothing raita or dessert on your subsequent order.
          </p>
        </section>
      </div>
    </div>
  );
}
