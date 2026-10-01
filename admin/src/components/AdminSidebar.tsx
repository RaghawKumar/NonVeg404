'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import {
  BarChart3,
  ShoppingBag,
  UtensilsCrossed,
  Layers,
  Sparkles,
  Users,
  CalendarCheck,
  Tag,
  Star,
  Settings,
  ExternalLink,
  ShieldAlert,
  X,
} from 'lucide-react';

interface SidebarProps {
  mobileOpen: boolean;
  setMobileOpen: (open: boolean) => void;
}

export default function AdminSidebar({ mobileOpen, setMobileOpen }: SidebarProps) {
  const pathname = usePathname();

  const navItems = [
    { label: 'Dashboard', href: '/', icon: BarChart3 },
    { label: 'Orders Pipeline', href: '/orders', icon: ShoppingBag, badge: '4 ACTIVE' },
    { label: 'Menu Catalog', href: '/menu', icon: UtensilsCrossed },
    { label: 'Categories', href: '/categories', icon: Layers },
    { label: 'Food Add-ons', href: '/addons', icon: Sparkles },
    { label: 'Customers', href: '/customers', icon: Users },
    { label: 'Reservations', href: '/reservations', icon: CalendarCheck, badge: '3 NEW' },
    { label: 'Offers & Coupons', href: '/offers', icon: Tag },
    { label: 'Reviews', href: '/reviews', icon: Star },
    { label: 'System Settings', href: '/settings', icon: Settings },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 z-40 bg-black/80 backdrop-blur-sm lg:hidden"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-[#0a0a0e] border-r border-[#22222e] flex flex-col justify-between transition-transform duration-300 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Top Brand Header */}
        <div>
          <div className="p-4 sm:p-5 border-b border-[#22222e] flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="relative w-10 h-10 rounded-xl overflow-hidden border border-amber-500/40 group-hover:border-amber-500 transition-colors shrink-0">
                <Image
                  src="/logo.png"
                  alt="NON VEG 404 Logo"
                  fill
                  className="object-cover"
                />
              </div>
              <div>
                <div className="font-extrabold text-base tracking-wider text-white">
                  NON VEG <span className="text-amber-500">404</span>
                </div>
                <div className="text-[10px] font-mono text-zinc-400">
                  // ADMIN KERNEL //
                </div>
              </div>
            </Link>

            <button
              onClick={() => setMobileOpen(false)}
              className="lg:hidden p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-900"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="p-3 space-y-1 overflow-y-auto max-h-[calc(100vh-190px)]">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-mono font-medium transition-all ${
                    isActive
                      ? 'bg-amber-500 text-black font-bold shadow-md shadow-amber-500/20'
                      : 'text-zinc-400 hover:text-white hover:bg-zinc-900/70'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-black' : 'text-amber-500'}`} />
                    <span className="truncate">{item.label}</span>
                  </div>

                  {item.badge && (
                    <span
                      className={`text-[9px] px-1.5 py-0.5 rounded-full font-mono font-bold tracking-tight shrink-0 ${
                        isActive
                          ? 'bg-black text-amber-400'
                          : 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Bottom Profile & External Link */}
        <div className="p-4 border-t border-[#22222e] space-y-3 bg-zinc-950/60">
          <div className="flex items-center gap-2.5 p-2 rounded-xl bg-zinc-900/60 border border-zinc-800 text-xs font-mono">
            <ShieldAlert className="w-4 h-4 text-red-400 shrink-0" />
            <div className="min-w-0 flex-1">
              <div className="text-white font-bold truncate">root@superuser</div>
              <div className="text-[10px] text-zinc-500">Access: Level 0</div>
            </div>
          </div>

          <a
            href="http://localhost:3000"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white text-xs font-mono border border-zinc-800 transition-colors"
          >
            <span>Live Customer Web</span>
            <ExternalLink className="w-3.5 h-3.5 text-amber-500" />
          </a>
        </div>
      </aside>
    </>
  );
}
