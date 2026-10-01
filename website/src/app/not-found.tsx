import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { UtensilsCrossed, Sparkles } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-16 text-center">
      <div className="max-w-xl mx-auto space-y-6">
        <div className="relative w-28 h-28 mx-auto rounded-3xl overflow-hidden border border-amber-500/40 shadow-2xl">
          <Image
            src="/logo.png"
            alt="NON VEG 404"
            fill
            className="object-cover"
          />
        </div>

        <div className="space-y-2">
          <span className="font-mono text-xs text-red-400 font-bold bg-red-950/60 border border-red-800/80 px-3 py-1 rounded-full inline-block">
            HTTP_STATUS_CODE: 404
          </span>
          <h1 className="text-4xl sm:text-6xl font-extrabold text-white font-sans">
            Page Not Found.
          </h1>
          <p className="font-mono text-amber-400 text-base font-bold">
            // But Hunger is NEVER &ldquo;Not Found&rdquo; //
          </p>
        </div>

        <p className="text-sm text-zinc-300 leading-relaxed max-w-md mx-auto">
          You stumbled upon a missing route in the matrix. Don&apos;t panic: our kitchen threads
          are online, our charcoal tandoors are hot, and our dum biryani is ready for dispatch.
        </p>

        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/menu"
            className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-black font-extrabold text-xs font-mono tracking-wide shadow-lg shadow-amber-500/20 transition-all flex items-center justify-center gap-2"
          >
            <UtensilsCrossed className="w-4 h-4" />
            <span>REDIRECT TO FULL MENU</span>
          </Link>

          <Link
            href="/"
            className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white font-mono text-xs border border-zinc-700 transition-all"
          >
            RETURN HOME
          </Link>
        </div>
      </div>
    </div>
  );
}
