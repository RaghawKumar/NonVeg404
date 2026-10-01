import React from 'react';
import Link from 'next/link';
import { FileText, ChevronLeft } from 'lucide-react';

export default function TermsAndConditionsPage() {
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
          <FileText className="w-3.5 h-3.5" />
          <span>USER_AGREEMENT_CONTRACT</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white">
          Terms & Conditions
        </h1>
        <p className="text-xs font-mono text-zinc-500">
          NON VEG 404 Restaurant // Terms of Service v2.0
        </p>
      </div>

      <div className="space-y-6 text-sm text-zinc-300 leading-relaxed">
        <section className="space-y-2">
          <h2 className="text-lg font-bold text-white font-mono">// 1. Acceptance of Terms</h2>
          <p>
            By accessing the NON VEG 404 platform, browsing menu endpoints, placing delivery requests, or booking dining booths, you acknowledge and agree to comply with these terms.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-bold text-white font-mono">// 2. Menu Accuracy & Availability</h2>
          <p>
            We strive for 99.99% menu consistency. However, high-demand items (e.g. Mutton Rogan Josh or Dum Biryani Handi) may occasionally throw a 404 (Out of Stock) when fresh batch supplies run out for the evening.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-bold text-white font-mono">// 3. Table Reservations</h2>
          <p>
            Table locks are held for 15 minutes past the scheduled arrival timestamp. If your party does not arrive within this window, the lock may be released back to the general dining pool.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-bold text-white font-mono">// 4. Intellectual Property</h2>
          <p>
            The NON VEG 404 name, rooster coding logo, culinary trademarks, and custom UI design are the intellectual property of NON VEG 404.
          </p>
        </section>
      </div>
    </div>
  );
}
