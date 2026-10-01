import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Terminal,
  Heart,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-[#050507] border-t border-[#23232e] text-zinc-400 font-sans relative overflow-hidden">
      {/* Subtle top amber glow line */}
      <div className="h-0.5 w-full bg-gradient-to-r from-transparent via-amber-500/60 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-3">
              <div className="relative w-12 h-12 rounded-xl overflow-hidden border border-amber-500/30">
                <Image
                  src="/logo.png"
                  alt="NON VEG 404"
                  fill
                  className="object-cover"
                />
              </div>
              <div>
                <span className="font-extrabold text-xl text-white tracking-wider">
                  NON VEG <span className="text-amber-500">404</span>
                </span>
                <p className="text-xs font-mono text-zinc-400">
                  <span className="text-amber-500 font-bold">//</span> GOOD FOOD. NO BUGS. <span className="text-amber-500 font-bold">//</span>
                </p>
              </div>
            </Link>

            <p className="text-sm text-zinc-400 leading-relaxed max-w-sm">
              404 = Not Found. But at NON VEG 404, hunger is never &ldquo;not found&rdquo;.
              Crafted by developers with high-availability spices, zero-compromise marinades,
              and low-latency tandoor fires.
            </p>

            {/* Code concept snippet */}
            <div className="p-3 rounded-lg bg-zinc-950 border border-zinc-800/80 font-mono text-xs max-w-sm">
              <div className="flex items-center gap-1.5 text-zinc-500 pb-2 mb-2 border-b border-zinc-900 text-[11px]">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500/70 inline-block" />
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500/70 inline-block" />
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/70 inline-block" />
                <span className="ml-2 text-zinc-400">kernel_meal.sh</span>
              </div>
              <p className="text-amber-400">while (hungry) &#123;</p>
              <p className="text-emerald-400 pl-4">eat(&ldquo;NON_VEG_404&rdquo;);</p>
              <p className="text-amber-400">&#125;</p>
              <p className="text-zinc-500 mt-1">// return FOOD;</p>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-white font-mono text-sm uppercase tracking-wider font-semibold flex items-center gap-1.5">
              <Terminal className="w-4 h-4 text-amber-500" />
              <span>Navigation</span>
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="hover:text-amber-400 transition-colors">Home</Link>
              </li>
              <li>
                <Link href="/menu" className="hover:text-amber-400 transition-colors">Full Menu</Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-amber-400 transition-colors">Our Story & Tech</Link>
              </li>
              <li>
                <Link href="/gallery" className="hover:text-amber-400 transition-colors">Food Gallery</Link>
              </li>
              <li>
                <Link href="/offers" className="hover:text-amber-400 transition-colors">Offers & Coupons</Link>
              </li>
              <li>
                <Link href="/reservations" className="hover:text-amber-400 transition-colors">Table Reservation</Link>
              </li>
              <li>
                <Link href="/track-order" className="hover:text-amber-400 transition-colors">Live Order Tracker</Link>
              </li>
            </ul>
          </div>

          {/* Legal Pages */}
          <div className="space-y-3">
            <h4 className="text-white font-mono text-sm uppercase tracking-wider font-semibold flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-amber-500" />
              <span>Policies</span>
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/privacy-policy" className="hover:text-amber-400 transition-colors">Privacy Policy</Link>
              </li>
              <li>
                <Link href="/terms-and-conditions" className="hover:text-amber-400 transition-colors">Terms & Conditions</Link>
              </li>
              <li>
                <Link href="/refund-policy" className="hover:text-amber-400 transition-colors">Refund Policy</Link>
              </li>
              <li>
                <Link href="/cancellation-policy" className="hover:text-amber-400 transition-colors">Cancellation Policy</Link>
              </li>
              <li>
                <Link href="/delivery-policy" className="hover:text-amber-400 transition-colors">Delivery Policy</Link>
              </li>
            </ul>
          </div>

          {/* Hours & Contact */}
          <div className="space-y-3">
            <h4 className="text-white font-mono text-sm uppercase tracking-wider font-semibold flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-amber-500" />
              <span>Timings & Base</span>
            </h4>
            <div className="space-y-2 text-sm">
              <p className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                <span>404 Kernel Way, Tech Grill District, CA 94016</span>
              </p>
              <p className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-amber-500 shrink-0" />
                <span>+1 (555) 404-MEAT</span>
              </p>
              <p className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-amber-500 shrink-0" />
                <span>terminal@nonveg404.dev</span>
              </p>
              <div className="pt-2">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-mono bg-emerald-950/80 text-emerald-400 border border-emerald-800">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping inline-block" />
                  KITCHEN ONLINE (11AM - 2AM)
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* System Status Line */}
        <div className="mt-12 pt-6 border-t border-zinc-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-zinc-500">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
            <span>SYS_STATUS: 200 OK</span>
            <span>•</span>
            <span>LATENCY: 18ms</span>
            <span>•</span>
            <span>UPTIME: 99.99%</span>
          </div>

          <p className="flex items-center gap-1">
            Built with <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500" /> for developers who appreciate exceptional food.
          </p>

          <p>© {new Date().getFullYear()} NON VEG 404. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
