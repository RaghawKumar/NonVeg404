'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/context/CartContext';
import FoodCard from '@/components/FoodCard';
import { FOOD_ITEMS, INITIAL_COUPONS, INITIAL_REVIEWS } from '@/data/restaurantData';
import { FoodCategory } from '@/types/restaurant';
import {
  Sparkles,
  ArrowRight,
  Flame,
  Terminal as TerminalIcon,
  ShieldCheck,
  Zap,
  Cpu,
  Clock,
  MapPin,
  CalendarCheck,
  CheckCircle,
  Copy,
  Check,
  ChevronRight,
  ExternalLink,
} from 'lucide-react';

export default function HomePage() {
  const { menuItems } = useCart();
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [activeCodeTab, setActiveCodeTab] = useState<'ts' | 'py' | 'sh'>('ts');
  const [terminalCommand, setTerminalCommand] = useState('curl -X GET /api/v1/hunger');
  const [terminalOutput, setTerminalOutput] = useState(
    'HTTP/2 200 OK\n{"status": "satisfied", "dish": "Kernel Hyderabadi Dum Biryani", "spiciness": "Code Red", "bugs": 0}'
  );

  const featuredDishes = menuItems.filter((item) => item.isFeatured).slice(0, 4);

  const categories: { name: FoodCategory; icon: string; count: number; desc: string }[] = [
    { name: 'Biryani', icon: '🍚', count: 3, desc: 'Aged saffron basmati, dum cooked' },
    { name: 'Chicken', icon: '🍗', count: 3, desc: 'Smoked tandoor & crispy fried' },
    { name: 'Mutton', icon: '🥩', count: 2, desc: 'Slow simmered lamb & goat shanks' },
    { name: 'Kebabs & Tandoor', icon: '🍢', count: 2, desc: 'Melt-in-mouth charcoal skewers' },
    { name: 'Burgers', icon: '🍔', count: 2, desc: 'Double smashed Angus beef & brioche' },
    { name: 'Rolls & Wraps', icon: '🌯', count: 2, desc: 'Flaky paratha & spicy boti' },
    { name: 'Starters', icon: '🔥', count: 2, desc: 'Peri-peri wings & crunch fish' },
    { name: 'Main Course', icon: '🥘', count: 2, desc: 'Silky butter chicken gravies' },
    { name: 'Beverages', icon: '🥤', count: 2, desc: 'Cold brew & mango lassi' },
    { name: 'Desserts', icon: '🍫', count: 2, desc: 'Molten chocolate & shahi tukda' },
  ];

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const handleTerminalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cmd = terminalCommand.trim().toLowerCase();
    if (cmd.includes('hunger') || cmd.includes('eat')) {
      setTerminalOutput('HTTP/2 200 OK\n{"status": "satisfied", "hunger_level": "404 Not Found", "recommended": "Kernel Hyderabadi Dum Biryani"}');
    } else if (cmd.includes('biryani')) {
      setTerminalOutput('DUM_PROTOCOL_ACTIVE:\n12 hours slow simmered with royal saffron and whole cardamom. Bug-free!');
    } else if (cmd.includes('sudo') || cmd.includes('admin')) {
      setTerminalOutput('Access Granted: Superuser taste buds confirmed. Try code: SUDO_50 for 20% off.');
    } else {
      setTerminalOutput(`Executing: "${terminalCommand}"\nResult: 200 OK -> Piping hot non-veg platter dispatched to table!`);
    }
  };

  return (
    <div className="space-y-24 pb-20">
      {/* 1. HERO SECTION */}
      <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden pt-6">
        {/* Background glow effects */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-amber-500/10 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute top-1/3 right-10 w-[350px] h-[350px] bg-red-600/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute inset-0 bg-grid-pattern opacity-40 pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full py-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Content Column */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              {/* Tag pill */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-zinc-900/90 border border-amber-500/40 shadow-inner">
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping inline-block" />
                <span className="font-mono text-xs font-semibold text-amber-400 tracking-wider">
                  404 // HUNGER NOT FOUND
                </span>
              </div>

              {/* Main Headline */}
              <h1 className="text-3xl sm:text-5xl lg:text-6xl xl:text-7xl font-extrabold tracking-tight text-white font-sans leading-[1.1]">
                Where Hunger is <br />
                Never <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-orange-400 to-red-500">“Not Found”</span>
              </h1>

              {/* Tagline */}
              <p className="font-mono text-sm sm:text-base md:text-lg text-amber-400 font-semibold tracking-wide">
                // GOOD FOOD. NO BUGS. //
              </p>

              {/* Description */}
              <p className="text-sm sm:text-base md:text-lg text-zinc-300 max-w-xl mx-auto lg:mx-0 leading-relaxed">
                Welcome to <span className="text-white font-semibold">NON VEG 404</span>.
                A modern culinary sanctuary created with software developer precision.
                Slow-dum biryanis, flame-kissed tandoori chicken, and melt-in-mouth mutton rogan josh.
              </p>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 sm:gap-4 pt-2">
                <Link
                  href="/menu"
                  className="w-full sm:w-auto px-6 sm:px-8 py-3.5 sm:py-4 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-black font-extrabold text-sm sm:text-base tracking-wide shadow-xl shadow-amber-500/25 hover:shadow-amber-500/40 transition-all flex items-center justify-center gap-2 group cursor-pointer"
                >
                  <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 fill-black" />
                  <span>Explore Full Menu</span>
                  <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" />
                </Link>

                <Link
                  href="/reservations"
                  className="w-full sm:w-auto px-6 sm:px-7 py-3.5 sm:py-4 rounded-xl bg-zinc-900/90 hover:bg-zinc-800 text-zinc-200 hover:text-white font-semibold text-sm sm:text-base border border-zinc-700/80 hover:border-amber-500/50 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <CalendarCheck className="w-4 h-4 sm:w-5 sm:h-5 text-amber-500" />
                  <span>Book a Table</span>
                </Link>
              </div>

              {/* Real-time stats */}
              <div className="grid grid-cols-3 gap-2 sm:gap-4 pt-6 border-t border-zinc-800/80 max-w-lg mx-auto lg:mx-0">
                <div>
                  <div className="text-xl sm:text-2xl md:text-3xl font-mono font-extrabold text-white">99.99%</div>
                  <div className="text-[10px] sm:text-xs text-zinc-400 font-mono mt-0.5">// Flavor Uptime</div>
                </div>
                <div>
                  <div className="text-xl sm:text-2xl md:text-3xl font-mono font-extrabold text-amber-400">0</div>
                  <div className="text-[10px] sm:text-xs text-zinc-400 font-mono mt-0.5">// Saturated Bugs</div>
                </div>
                <div>
                  <div className="text-xl sm:text-2xl md:text-3xl font-mono font-extrabold text-red-400">&lt; 30m</div>
                  <div className="text-[10px] sm:text-xs text-zinc-400 font-mono mt-0.5">// Latency</div>
                </div>
              </div>
            </div>

            {/* Right Column: Hero Visual with Logo & Live Interactive Terminal */}
            <div className="lg:col-span-5 space-y-6">
              {/* Brand Feature Card with Logo */}
              <div className="relative rounded-3xl overflow-hidden bg-gradient-to-b from-zinc-900 to-[#0e0e13] border border-amber-500/30 p-4 sm:p-6 shadow-2xl shadow-black/80">
                <div className="relative aspect-square w-full max-w-[280px] sm:max-w-[340px] md:max-w-[380px] mx-auto rounded-2xl overflow-hidden border border-zinc-800 shadow-2xl">
                  <Image
                    src="/logo.png"
                    alt="NON VEG 404 Official Identity"
                    fill
                    priority
                    className="object-contain bg-black"
                  />
                </div>

                <div className="mt-4 sm:mt-5 text-center space-y-1">
                  <div className="font-mono text-[11px] sm:text-xs text-amber-400 uppercase tracking-widest font-semibold">
                    The Software Developer&apos;s Grill
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold text-white">
                    High-Performance Protein Architecture
                  </h3>
                </div>
              </div>

              {/* Interactive Terminal Playground */}
              <div className="rounded-2xl bg-[#09090d] border border-zinc-800 overflow-hidden shadow-xl font-mono text-xs">
                {/* Terminal Header */}
                <div className="px-3.5 py-2.5 bg-zinc-950 border-b border-zinc-800/80 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-red-500/80 inline-block" />
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80 inline-block" />
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80 inline-block" />
                    <span className="ml-2 text-zinc-400 text-[11px] sm:text-xs truncate">bash — nonveg404@terminal</span>
                  </div>
                  <span className="text-[9px] sm:text-[10px] text-zinc-400 shrink-0">REST API v1</span>
                </div>

                {/* Terminal Body */}
                <div className="p-3.5 sm:p-4 space-y-3">
                  <div className="text-zinc-400 text-[11px] sm:text-xs leading-relaxed">
                    <span className="text-amber-500 font-bold">$</span> Try: <span className="text-white underline cursor-pointer" onClick={() => setTerminalCommand('curl /api/v1/hunger')}>curl /api/v1/hunger</span> or <span className="text-white underline cursor-pointer" onClick={() => setTerminalCommand('sudo order biryani')}>sudo order biryani</span>
                  </div>

                  <form onSubmit={handleTerminalSubmit} className="flex items-center gap-1.5 sm:gap-2">
                    <span className="text-emerald-400 font-bold text-[11px] sm:text-xs shrink-0">nv404:~$</span>
                    <input
                      type="text"
                      value={terminalCommand}
                      onChange={(e) => setTerminalCommand(e.target.value)}
                      className="min-w-0 flex-1 bg-transparent text-white focus:outline-none font-mono text-[11px] sm:text-xs"
                      placeholder="Type command..."
                    />
                    <button
                      type="submit"
                      className="px-2.5 py-1 rounded bg-zinc-800 hover:bg-amber-500 hover:text-black text-zinc-300 text-[10px] sm:text-[11px] font-bold transition-colors cursor-pointer shrink-0"
                    >
                      EXEC
                    </button>
                  </form>

                  <div className="p-2 sm:p-2.5 rounded bg-zinc-950 border border-zinc-900 text-zinc-300 whitespace-pre-wrap text-[10px] sm:text-[11px] leading-relaxed overflow-x-auto">
                    {terminalOutput}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. FEATURED FOOD SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-mono text-amber-400 uppercase tracking-widest mb-2 font-semibold">
              <Flame className="w-4 h-4 fill-amber-400" />
              <span>PRODUCTION_APPROVED_DISHES</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
              Signature Feasts
            </h2>
            <p className="text-zinc-400 text-sm mt-1">
              Top-rated non-vegetarian masterpieces with zero bugs and maximum flavor.
            </p>
          </div>

          <Link
            href="/menu"
            className="inline-flex items-center gap-2 text-sm font-mono text-amber-400 hover:text-amber-300 transition-colors font-bold"
          >
            <span>VIEW_ALL_ITEMS({menuItems.length})</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredDishes.map((dish) => (
            <FoodCard key={dish.id} food={dish} />
          ))}
        </div>
      </section>

      {/* 3. MENU CATEGORIES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="text-xs font-mono text-amber-400 uppercase tracking-widest mb-2 font-semibold">
            // INDEXED_BY_CATEGORY
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
            Explore The Culinary Modules
          </h2>
          <p className="text-zinc-400 text-sm mt-2">
            Organized logically into dedicated food endpoints. Click any category to explore.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {categories.map((cat) => (
            <Link
              key={cat.name}
              href={`/menu?category=${encodeURIComponent(cat.name)}`}
              className="p-4 rounded-2xl bg-[#0e0e13] border border-zinc-800/80 hover:border-amber-500/60 hover:bg-zinc-900/60 transition-all duration-200 group flex flex-col items-center text-center space-y-2.5 shadow-md hover:-translate-y-1"
            >
              <div className="text-3xl p-3 rounded-2xl bg-zinc-950 border border-zinc-800 group-hover:scale-110 transition-transform">
                {cat.icon}
              </div>
              <div>
                <h3 className="text-sm font-bold text-white group-hover:text-amber-400 transition-colors">
                  {cat.name}
                </h3>
                <span className="text-[11px] font-mono text-amber-500/90 font-medium">
                  {cat.count} Dishes
                </span>
              </div>
              <p className="text-[11px] text-zinc-400 line-clamp-1">
                {cat.desc}
              </p>
            </Link>
          ))}
        </div>
      </section>

      {/* 4. WHY NON VEG 404 */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-gradient-to-b from-[#0e0e14] to-[#070709] border border-[#23232e] p-8 sm:p-12 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

          <div className="text-center max-w-3xl mx-auto mb-12">
            <div className="text-xs font-mono text-amber-400 uppercase tracking-widest mb-2 font-semibold">
              ARCHITECTURE_OVERVIEW
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
              Why Engineers & Foodies Choose Us
            </h2>
            <p className="text-zinc-400 text-sm mt-2">
              We apply software engineering principles to gastronomy: consistency, code coverage, and extreme flavor optimization.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 rounded-2xl bg-zinc-950/80 border border-zinc-800/80 space-y-3">
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white font-mono">Zero Bugs Recipe</h3>
              <p className="text-sm text-zinc-400 leading-relaxed">
                Hand-cut, fresh certified non-vegetarian meats. Zero fillers, zero synthetic food coloring, and 100% natural ghee.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-zinc-950/80 border border-zinc-800/80 space-y-3">
              <div className="w-12 h-12 rounded-xl bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-400">
                <Cpu className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white font-mono">High-Availability Clay</h3>
              <p className="text-sm text-zinc-400 leading-relaxed">
                Dual tandoors running in cluster configuration at a constant 450°C for authentic charcoal smoke penetration.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-zinc-950/80 border border-zinc-800/80 space-y-3">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                <Zap className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white font-mono">Low-Latency Dispatch</h3>
              <p className="text-sm text-zinc-400 leading-relaxed">
                Insulated thermal packaging keeps your biryani and kebabs piping hot from our kitchen threads straight to your desk.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-zinc-950/80 border border-zinc-800/80 space-y-3">
              <div className="w-12 h-12 rounded-xl bg-orange-500/10 border border-orange-500/30 flex items-center justify-center text-orange-400">
                <Clock className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white font-mono">Late-Night Dev Shift</h3>
              <p className="text-sm text-zinc-400 leading-relaxed">
                Active until 02:00 AM every night. Because midnight merges and production debug sessions demand serious non-veg fuel.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. DEVELOPER-THEMED SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-5 space-y-5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-mono">
              <TerminalIcon className="w-3.5 h-3.5" />
              <span>THE_DEV_KITCHEN_PROTOCOL</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
              Written in Code. <br />
              Perfected in the Kitchen.
            </h2>
            <p className="text-zinc-300 text-sm leading-relaxed">
              Every dish on our menu goes through a rigorous code review of spices.
              We treat marinades like microservices: isolated, well-tested, and built for maximum throughput of flavor.
            </p>

            <div className="space-y-3 font-mono text-xs">
              <div className="flex items-center gap-3 p-3 rounded-xl bg-zinc-900/60 border border-zinc-800">
                <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="text-zinc-300">Continuous Integration of freshly ground garam masala</span>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-xl bg-zinc-900/60 border border-zinc-800">
                <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="text-zinc-300">Memory safe, non-greasy chicken breast & lamb cuts</span>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-xl bg-zinc-900/60 border border-zinc-800">
                <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="text-zinc-300">Zero packet loss in our hot delivery pipeline</span>
              </div>
            </div>

            <div className="pt-2">
              <Link
                href="/about"
                className="inline-flex items-center gap-2 text-sm font-mono text-amber-400 hover:text-amber-300 font-bold"
              >
                <span>READ_OUR_FULL_STORY</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Interactive Code Window */}
          <div className="lg:col-span-7">
            <div className="rounded-2xl bg-[#09090d] border border-zinc-800 shadow-2xl overflow-hidden font-mono text-xs">
              {/* Tabs */}
              <div className="flex items-center justify-between px-3 sm:px-4 py-2 bg-zinc-950 border-b border-zinc-800 gap-2 overflow-x-auto scrollbar-none">
                <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
                  <button
                    onClick={() => setActiveCodeTab('ts')}
                    className={`px-2.5 sm:px-3 py-1 rounded text-[11px] sm:text-xs transition-colors cursor-pointer ${
                      activeCodeTab === 'ts'
                        ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                        : 'text-zinc-400 hover:text-white'
                    }`}
                  >
                    kitchenServer.ts
                  </button>
                  <button
                    onClick={() => setActiveCodeTab('py')}
                    className={`px-2.5 sm:px-3 py-1 rounded text-[11px] sm:text-xs transition-colors cursor-pointer ${
                      activeCodeTab === 'py'
                        ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                        : 'text-zinc-400 hover:text-white'
                    }`}
                  >
                    dumBiryani.py
                  </button>
                  <button
                    onClick={() => setActiveCodeTab('sh')}
                    className={`px-2.5 sm:px-3 py-1 rounded text-[11px] sm:text-xs transition-colors cursor-pointer ${
                      activeCodeTab === 'sh'
                        ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                        : 'text-zinc-400 hover:text-white'
                    }`}
                  >
                    hunger_daemon.sh
                  </button>
                </div>
                <div className="text-[10px] sm:text-[11px] text-zinc-500 shrink-0 hidden sm:block">NON VEG 404 Kernel</div>
              </div>

              {/* Code Snippets */}
              <div className="p-5 overflow-x-auto text-[13px] leading-relaxed">
                {activeCodeTab === 'ts' && (
                  <pre className="text-zinc-300">
                    <span className="text-zinc-500">// NON VEG 404 - High-Availability Feast Handler</span>{'\n'}
                    <span className="text-purple-400">import</span> &#123; <span className="text-amber-300">Chef</span>, <span className="text-amber-300">ClayTandoor</span> &#125; <span className="text-purple-400">from</span> <span className="text-emerald-300">&quot;@nonveg404/kitchen&quot;</span>;{'\n\n'}
                    <span className="text-purple-400">export async function</span> <span className="text-blue-400">satisfyHunger</span>(order: <span className="text-amber-300">FoodOrder</span>) &#123;{'\n'}
                    {'  '}<span className="text-purple-400">const</span> status = <span className="text-purple-400">await</span> <span className="text-blue-400">checkKitchenStatus</span>();{'\n'}
                    {'  '}<span className="text-purple-400">if</span> (!status.isOnline) &#123;{'\n'}
                    {'    '}<span className="text-purple-400">throw new</span> <span className="text-red-400">Error</span>(<span className="text-emerald-300">&quot;404: Impossible - Kitchen is Always Ready&quot;</span>);{'\n'}
                    {'  '}&#125;{'\n\n'}
                    {'  '}<span className="text-purple-400">const</span> feast = <span className="text-purple-400">await</span> <span className="text-amber-300">ClayTandoor</span>.<span className="text-blue-400">roast</span>(&#123;{'\n'}
                    {'    '}meat: <span className="text-emerald-300">&quot;Spring Chicken & Baby Goat Shank&quot;</span>,{'\n'}
                    {'    '}temperatureCelsius: <span className="text-orange-400">450</span>,{'\n'}
                    {'    '}spices: [<span className="text-emerald-300">&quot;Kashmiri Chili&quot;</span>, <span className="text-emerald-300">&quot;Royal Saffron&quot;</span>, <span className="text-emerald-300">&quot;Star Anise&quot;</span>],{'\n'}
                    {'    '}bugs: <span className="text-orange-400">0</span>,{'\n'}
                    {'  '}&#125;);{'\n\n'}
                    {'  '}<span className="text-purple-400">return</span> &#123; status: <span className="text-orange-400">200</span>, hungerResolved: <span className="text-orange-400">true</span>, feast &#125;;{'\n'}
                    &#125;
                  </pre>
                )}

                {activeCodeTab === 'py' && (
                  <pre className="text-zinc-300">
                    <span className="text-zinc-500"># Dum Biryani Slow Thermal Protocol</span>{'\n'}
                    <span className="text-purple-400">from</span> nonveg404 <span className="text-purple-400">import</span> RoyalBasmati, SaffronGhee{'\n\n'}
                    <span className="text-purple-400">def</span> <span className="text-blue-400">cook_dum_biryani</span>(marinated_meat):{'\n'}
                    {'    '}sealed_handi = ClayPot(marinated_meat){'\n'}
                    {'    '}sealed_handi.layer(RoyalBasmati(aged_years=<span className="text-orange-400">2</span>)){'\n'}
                    {'    '}sealed_handi.drizzle(SaffronGhee()){'\n'}
                    {'    '}<span className="text-purple-400">with</span> sealed_handi.clay_seal():{'\n'}
                    {'        '}<span className="text-purple-400">for</span> min <span className="text-purple-400">in</span> range(<span className="text-orange-400">30</span>):{'\n'}
                    {'            '}simmer_slow(min, charcoal_embers=<span className="text-orange-400">True</span>){'\n'}
                    {'    '}<span className="text-purple-400">return</span> <span className="text-emerald-300">&quot;Flavor Uptime 100%&quot;</span>
                  </pre>
                )}

                {activeCodeTab === 'sh' && (
                  <pre className="text-zinc-300">
                    <span className="text-zinc-500">#!/usr/bin/env bash</span>{'\n'}
                    <span className="text-zinc-500"># NON VEG 404 Perpetual Hunger Daemon</span>{'\n'}
                    HUNGER_STATUS=$(curl -s https://nonveg404.dev/api/v1/hunger/check){'\n\n'}
                    <span className="text-purple-400">while</span> [ <span className="text-emerald-300">&quot;$HUNGER_STATUS&quot;</span> == <span className="text-emerald-300">&quot;ACTIVE&quot;</span> ]; <span className="text-purple-400">do</span>{'\n'}
                    {'  '}echo <span className="text-emerald-300">&quot;Deploying Hyderabadi Dum Biryani to dev desk...&quot;</span>{'\n'}
                    {'  '}eat &quot;NON VEG 404&quot;{'\n'}
                    {'  '}HUNGER_STATUS=<span className="text-emerald-300">&quot;404_NOT_FOUND&quot;</span>{'\n'}
                    <span className="text-purple-400">done</span>{'\n'}
                    echo <span className="text-emerald-300">&quot;Status: Satisfied. Zero bugs detected.&quot;</span>
                  </pre>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. OFFERS & SUDO DEALS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <div className="text-xs font-mono text-amber-400 uppercase tracking-widest mb-1 font-semibold">
              // SUDO_PRIVILEGES_GRANTED
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
              Developer Deals & Coupons
            </h2>
            <p className="text-zinc-400 text-sm mt-1">
              Elevate your feast with one-click promo codes. Apply them directly at checkout.
            </p>
          </div>

          <Link
            href="/offers"
            className="inline-flex items-center gap-1.5 text-xs font-mono text-amber-400 hover:text-amber-300 font-bold"
          >
            <span>VIEW_ALL_OFFERS</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {INITIAL_COUPONS.map((coupon) => (
            <div
              key={coupon.code}
              className="p-5 rounded-2xl bg-[#0f0f14] border border-amber-500/30 hover:border-amber-500 transition-all flex flex-col justify-between space-y-4 group relative overflow-hidden"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/30">
                    {coupon.discountType === 'percentage'
                      ? `${coupon.value}% OFF`
                      : `₹${coupon.value} FLAT OFF`}
                  </span>
                  <span className="text-[11px] font-mono text-zinc-400">
                    Min ₹{coupon.minOrder}
                  </span>
                </div>
                <h3 className="font-mono font-bold text-lg text-white group-hover:text-amber-400 transition-colors">
                  {coupon.code}
                </h3>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  {coupon.description}
                </p>
              </div>

              <button
                type="button"
                onClick={() => handleCopyCode(coupon.code)}
                className="w-full py-2 px-3 rounded-xl bg-zinc-900 hover:bg-amber-500 hover:text-black text-zinc-300 text-xs font-mono font-bold border border-zinc-800 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                {copiedCode === coupon.code ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span>COPIED TO CLIPBOARD!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>COPY CODE</span>
                  </>
                )}
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* 7. GALLERY PREVIEW */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <div className="text-xs font-mono text-amber-400 uppercase tracking-widest mb-1 font-semibold">
              // VISUAL_OUTPUT
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
              Food Photography & Kitchen Smoke
            </h2>
            <p className="text-zinc-400 text-sm mt-1">
              Raw, sizzling proof that our non-veg recipes compile into pure ecstasy.
            </p>
          </div>

          <Link
            href="/gallery"
            className="inline-flex items-center gap-1.5 text-xs font-mono text-amber-400 hover:text-amber-300 font-bold"
          >
            <span>FULL_GALLERY_GRID</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            {
              src: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=800&q=80',
              title: 'Dum Biryani Handi',
            },
            {
              src: 'https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?auto=format&fit=crop&w=800&q=80',
              title: 'Charcoal Tandoori Chicken',
            },
            {
              src: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80',
              title: 'Smoked Double Angus Burger',
            },
            {
              src: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=800&q=80',
              title: 'Galouti Melt-in-Mouth Kebabs',
            },
          ].map((item, idx) => (
            <div
              key={idx}
              className="relative h-60 rounded-2xl overflow-hidden group border border-zinc-800"
            >
              <Image
                src={item.src}
                alt={item.title}
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-500"
                sizes="(max-width: 768px) 50vw, 25vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                <span className="text-xs font-mono font-bold text-white">
                  {item.title}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 8. CUSTOMER REVIEWS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="text-xs font-mono text-amber-400 uppercase tracking-widest mb-1 font-semibold">
            // PEER_REVIEWS_AND_COMMITS
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
            Approved by Tech Leads & Gourmands
          </h2>
          <p className="text-zinc-400 text-sm mt-2">
            Read verified reviews from engineers who don&apos;t compromise on code or chicken.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {INITIAL_REVIEWS.map((review) => (
            <div
              key={review.id}
              className="p-6 rounded-2xl bg-[#0e0e13] border border-zinc-800/80 flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-center text-amber-400 text-sm">
                  {Array.from({ length: review.rating }).map((_, i) => (
                    <span key={i}>★</span>
                  ))}
                </div>
                <p className="text-xs text-zinc-300 italic leading-relaxed">
                  &ldquo;{review.comment}&rdquo;
                </p>
              </div>

              <div className="pt-3 border-t border-zinc-800/80 space-y-1">
                <div className="text-xs font-bold text-white">{review.author}</div>
                <div className="text-[11px] text-zinc-400 font-mono">{review.role}</div>
                <div className="text-[10px] text-amber-400/80 font-mono truncate">
                  // {review.commitHash}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 9 & 10. LOCATION & OPENING HOURS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Location & Map Card */}
          <div className="lg:col-span-7 rounded-3xl bg-[#0f0f15] border border-zinc-800 p-8 space-y-6 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-mono">
                <MapPin className="w-3.5 h-3.5" />
                <span>SERVER_COORDINATES</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-white">
                Visit NON VEG 404 In Person
              </h3>
              <p className="text-zinc-300 text-sm leading-relaxed">
                Step inside our neon-lit, developer-inspired dining hall. Featuring ergonomic booth seating, quiet code zones, high-speed Wi-Fi, and the scent of charcoal-grilled tandoori kebabs.
              </p>

              <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800/90 font-mono text-xs space-y-1.5">
                <div className="text-amber-400 font-bold">PHYSICAL ADDRESS:</div>
                <div className="text-white">404 Kernel Way, Silicon Grill District, Tech City, CA 94016</div>
                <div className="text-zinc-400 text-[11px]">GPS: 37.7749° N, 122.4194° W (Port 80/443 Open)</div>
              </div>
            </div>

            <div className="pt-2 flex flex-wrap gap-4">
              <Link
                href="/reservations"
                className="px-5 py-2.5 rounded-xl bg-amber-500 text-black font-bold text-xs font-mono tracking-wide hover:bg-amber-400 transition-colors"
              >
                RESERVE A BOOTH →
              </Link>
              <Link
                href="/contact"
                className="px-5 py-2.5 rounded-xl bg-zinc-900 text-zinc-300 hover:text-white font-mono text-xs border border-zinc-700 transition-colors"
              >
                GET DRIVING DIRECTIONS
              </Link>
            </div>
          </div>

          {/* Opening Hours & Late Night Dev Mode */}
          <div className="lg:col-span-5 rounded-3xl bg-gradient-to-b from-[#0e0e14] to-[#08080c] border border-amber-500/40 p-8 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-amber-400 uppercase tracking-widest font-semibold flex items-center gap-1.5">
                  <Clock className="w-4 h-4" />
                  <span>KITCHEN_CRON_SCHEDULE</span>
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-emerald-950 text-emerald-400 border border-emerald-800">
                  ● ACTIVE NOW
                </span>
              </div>

              <h3 className="text-2xl font-bold text-white">Opening Timings</h3>

              <div className="space-y-3 font-mono text-xs">
                <div className="flex items-center justify-between pb-2 border-b border-zinc-800">
                  <span className="text-zinc-400">Monday — Thursday</span>
                  <span className="text-white font-semibold">11:00 AM — 01:00 AM</span>
                </div>
                <div className="flex items-center justify-between pb-2 border-b border-zinc-800">
                  <span className="text-zinc-400">Friday — Saturday</span>
                  <span className="text-amber-400 font-semibold">11:00 AM — 02:00 AM</span>
                </div>
                <div className="flex items-center justify-between pb-2 border-b border-zinc-800">
                  <span className="text-zinc-400">Sunday</span>
                  <span className="text-white font-semibold">11:00 AM — 01:00 AM</span>
                </div>
              </div>

              {/* Dev late night highlight */}
              <div className="p-3.5 rounded-xl bg-zinc-900/80 border border-zinc-800 text-xs space-y-1">
                <div className="text-amber-400 font-mono font-bold flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-amber-400" />
                  <span>Late Night Dev Shift</span>
                </div>
                <p className="text-zinc-400 leading-relaxed text-[11px]">
                  Kitchen stays hot past midnight. Hot biryanis and rolls delivered fast to your workstation.
                </p>
              </div>
            </div>

            <Link
              href="/menu"
              className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-black font-extrabold text-sm text-center shadow-lg transition-all"
            >
              ORDER FOR IMMEDIATE DELIVERY
            </Link>
          </div>
        </div>
      </section>

      {/* 11. FINAL HIGH-IMPACT CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-amber-950/40 via-[#121217] to-red-950/40 border border-amber-500/50 p-8 sm:p-14 text-center space-y-6 shadow-2xl">
          <div className="inline-block p-2 rounded-xl bg-black/80 border border-amber-500/40 font-mono text-xs text-amber-400">
            // EXECUTABLE PROTOCOL
          </div>

          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            Ready to Initialize Your Feast?
          </h2>

          <p className="text-zinc-300 max-w-xl mx-auto text-base">
            Don&apos;t let hunger throw an uncaught exception. Order online in seconds or reserve your booth for an unforgettable meal.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <Link
              href="/menu"
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-extrabold text-base tracking-wide transition-all shadow-xl shadow-amber-500/20"
            >
              ORDER NOW (ONLINE DISPATCH)
            </Link>
            <Link
              href="/reservations"
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white font-bold text-base border border-zinc-700 transition-all"
            >
              BOOK A TABLE
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
