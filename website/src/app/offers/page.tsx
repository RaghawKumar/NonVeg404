'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import {
  Tag,
  Copy,
  Check,
  Sparkles,
  Zap,
  ArrowRight,
  ShieldCheck,
  Flame,
} from 'lucide-react';

interface PromoOffer {
  code: string;
  badge: string;
  title: string;
  description: string;
  minOrder: number;
  discountSummary: string;
  expiry: string;
}

const OFFERS: PromoOffer[] = [
  {
    code: 'SUDO_50',
    badge: 'ROOT ACCESS',
    title: 'Superuser 20% Discount Pass',
    description: 'Elevate your permissions across our entire menu. Valid on all non-veg curries, biryanis, and grill platters.',
    minOrder: 40,
    discountSummary: '20% OFF entire build',
    expiry: 'Expires Sunday 23:59',
  },
  {
    code: 'DEV_NIGHT_40',
    badge: 'LATE SHIFT',
    title: 'Midnight Debugging Fuel',
    description: 'Fuel your late-night coding sessions. Flat ₹15 deduction automatically applied at checkout.',
    minOrder: 50,
    discountSummary: 'Flat ₹15.00 OFF',
    expiry: 'Active every night after 9 PM',
  },
  {
    code: 'MERGE_CONFLICT',
    badge: 'RESOLVED',
    title: 'Merge Conflict Peace Offering',
    description: 'Resolve disputes at the dining table with slow-cooked biryani and charcoal skewers.',
    minOrder: 30,
    discountSummary: '15% OFF entire order',
    expiry: 'Valid all week',
  },
  {
    code: 'FREE_DEPLOY',
    badge: 'ZERO OVERHEAD',
    title: 'Zero Latency Free Delivery',
    description: 'Enjoy free dispatch to your doorstep or tech campus with zero shipping overhead.',
    minOrder: 25,
    discountSummary: '100% OFF Delivery Fee',
    expiry: 'Valid on orders over ₹25',
  },
  {
    code: 'SYNTAX_SUNDAY',
    badge: 'WEEKEND SPECIAL',
    title: 'Sunday Feast Overclock',
    description: 'Complimentary Molten Core Chocolate Brownie and 15% discount on large family platters.',
    minOrder: 60,
    discountSummary: '15% OFF + Free Dessert',
    expiry: 'Weekends only',
  },
  {
    code: 'HACKATHON_PACK',
    badge: 'TEAM FEAST',
    title: 'Squad Hackathon 25% Off',
    description: 'Designed for engineering squads shipping release candidates. Huge portions of biryanis and kebabs.',
    minOrder: 100,
    discountSummary: '25% OFF on ₹100+',
    expiry: 'Always active for teams',
  },
];

export default function OffersPage() {
  const { applyCoupon } = useCart();
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    applyCoupon(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2500);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 font-mono text-xs font-semibold">
          <Tag className="w-3.5 h-3.5" />
          <span>SUDO_DISCOUNT_TOKENS</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight">
          Exclusive Developer Offers
        </h1>
        <p className="text-zinc-400 text-sm sm:text-base leading-relaxed">
          Elevate your dinner with one-click promo tokens. Copy any code below,
          and it will automatically stage in your checkout pipeline.
        </p>
      </div>

      {/* Offers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {OFFERS.map((offer) => {
          const isCopied = copiedCode === offer.code;
          return (
            <div
              key={offer.code}
              className="p-6 rounded-3xl bg-[#0e0e13] border border-amber-500/30 hover:border-amber-500 transition-all flex flex-col justify-between space-y-5 shadow-xl relative overflow-hidden group"
            >
              {/* Top Accent line */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 to-orange-500" />

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-500/15 text-amber-400 border border-amber-500/30">
                    {offer.badge}
                  </span>
                  <span className="text-xs font-mono text-zinc-500">
                    Min ₹{offer.minOrder}
                  </span>
                </div>

                <h3 className="text-xl font-bold text-white group-hover:text-amber-400 transition-colors">
                  {offer.title}
                </h3>

                <div className="p-2.5 rounded-xl bg-zinc-950 border border-zinc-800/80 font-mono text-xs text-emerald-400 font-bold flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{offer.discountSummary}</span>
                </div>

                <p className="text-xs text-zinc-400 leading-relaxed">
                  {offer.description}
                </p>
              </div>

              {/* Code Box & Copy */}
              <div className="pt-3 border-t border-zinc-800 space-y-2">
                <div className="flex items-center justify-between text-[11px] font-mono text-zinc-500">
                  <span>PROMO TOKEN:</span>
                  <span>{offer.expiry}</span>
                </div>

                <button
                  type="button"
                  onClick={() => handleCopy(offer.code)}
                  className={`w-full py-3 px-4 rounded-xl font-mono text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                    isCopied
                      ? 'bg-emerald-500 text-black shadow-lg shadow-emerald-500/20'
                      : 'bg-zinc-900 hover:bg-amber-500 hover:text-black text-amber-400 border border-zinc-700/80'
                  }`}
                >
                  {isCopied ? (
                    <>
                      <Check className="w-4 h-4 stroke-[3]" />
                      <span>COPIED & STAGED TO CART!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      <span>COPY CODE: {offer.code}</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* CTA Box */}
      <div className="p-8 sm:p-10 rounded-3xl bg-gradient-to-r from-zinc-950 via-[#101017] to-zinc-950 border border-zinc-800 text-center space-y-4">
        <h3 className="text-2xl font-bold text-white">Have Your Promo Token Ready?</h3>
        <p className="text-zinc-400 text-sm max-w-md mx-auto">
          Head over to our full menu, select your dishes, and paste your code at checkout.
        </p>
        <div className="pt-2">
          <Link
            href="/menu"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-extrabold text-xs font-mono transition-all shadow-xl shadow-amber-500/20"
          >
            <span>REDEEM ON MENU</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
