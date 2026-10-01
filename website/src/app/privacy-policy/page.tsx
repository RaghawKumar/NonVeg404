import React from 'react';
import Link from 'next/link';
import { Shield, ChevronLeft } from 'lucide-react';

export default function PrivacyPolicyPage() {
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
          <Shield className="w-3.5 h-3.5" />
          <span>DATA_PROTECTION_PROTOCOL</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white">
          Privacy Policy
        </h1>
        <p className="text-xs font-mono text-zinc-500">
          Last compiled: {new Date().toLocaleDateString()} // v1.2
        </p>
      </div>

      <div className="space-y-6 text-sm text-zinc-300 leading-relaxed font-sans">
        <section className="space-y-2">
          <h2 className="text-lg font-bold text-white font-mono">// 1. Information We Ingest</h2>
          <p>
            When you interact with the NON VEG 404 website, place an order, or reserve a table, we collect standard parameters including your name, telephone identifier, email address, physical delivery coordinates, and order preferences.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-bold text-white font-mono">// 2. Execution & Processing</h2>
          <p>
            Your data is strictly utilized to process food orders, dispatch couriers, communicate live order telemetry, and confirm table locks. We do not sell or leak user records to external third-party advertisers.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-bold text-white font-mono">// 3. Cryptographic Security</h2>
          <p>
            Payment transactions are routed through end-to-end encrypted gateways. We never store raw credit card numbers or banking secrets in our local caches.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-bold text-white font-mono">// 4. Client Rights & Purge Requests</h2>
          <p>
            You may request deletion or export of your customer profile at any time by dispatching an email to <span className="text-amber-400 font-mono">terminal@nonveg404.dev</span>.
          </p>
        </section>
      </div>
    </div>
  );
}
