'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import {
  ShoppingBag,
  Menu as MenuIcon,
  X,
  Compass,
  UtensilsCrossed,
  Sparkles,
  CalendarCheck,
  Phone,
  User,
  LogOut,
  MapPin,
  Award,
  ChevronDown,
  ChevronRight,
} from 'lucide-react';

export default function Navbar() {
  const pathname = usePathname();
  const { cart } = useCart();
  const { user, logout, isLoggedIn } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Menu', href: '/menu', icon: UtensilsCrossed },
    { name: 'About', href: '/about' },
    { name: 'Gallery', href: '/gallery' },
    { name: 'Offers', href: '/offers', badge: 'DEALS' },
    { name: 'Reservations', href: '/reservations', icon: CalendarCheck },
    { name: 'Track Order', href: '/track-order' },
    { name: 'Contact', href: '/contact', icon: Phone },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-[#070709]/95 backdrop-blur-md border-b border-zinc-800/80 shadow-2xl py-3'
          : 'bg-gradient-to-b from-[#070709]/90 to-transparent py-4'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4">
          {/* Official Brand Logo */}
          <Link href="/" className="flex items-center gap-3 group flex-shrink-0">
            <div className="relative w-10 h-10 sm:w-12 sm:h-12 rounded-xl overflow-hidden bg-zinc-900 border border-zinc-800 group-hover:border-amber-500/50 transition-all shadow-md shadow-amber-500/10">
              <Image
                src="/logo.png"
                alt="NON VEG 404 Official Logo"
                fill
                sizes="(max-width: 640px) 40px, 48px"
                className="object-contain p-1 group-hover:scale-105 transition-transform"
                priority
              />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5 font-mono text-[10px] tracking-wider text-amber-400 font-bold uppercase">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                <span>// GOOD FOOD. NO BUGS. //</span>
              </div>
              <span className="text-lg sm:text-xl font-black tracking-tight text-white group-hover:text-amber-400 transition-colors">
                NON VEG 404
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden xl:flex items-center gap-1 bg-zinc-900/60 p-1.5 rounded-full border border-zinc-800/80 backdrop-blur-md">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              const Icon = link.icon;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`relative px-3.5 py-1.5 rounded-full text-xs font-mono font-medium transition-all duration-200 flex items-center gap-1.5 ${
                    isActive
                      ? 'bg-amber-500 text-black font-bold shadow-md shadow-amber-500/20'
                      : 'text-zinc-300 hover:text-white hover:bg-zinc-800/60'
                  }`}
                >
                  {Icon && <Icon className="w-3.5 h-3.5" />}
                  <span>{link.name}</span>
                  {link.badge && (
                    <span
                      className={`text-[9px] px-1.5 py-0.2 rounded-full font-bold uppercase ${
                        isActive
                          ? 'bg-black text-amber-400'
                          : 'bg-red-500/20 text-red-400 border border-red-500/30'
                      }`}
                    >
                      {link.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Right Action Icons & Buttons */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* User Account / Sign In */}
            {isLoggedIn && user ? (
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl bg-zinc-900/90 hover:bg-zinc-800 border border-zinc-800 text-xs font-mono transition-colors cursor-pointer"
                >
                  <div className="w-6 h-6 rounded-lg bg-gradient-to-tr from-amber-500 to-orange-500 flex items-center justify-center text-black font-bold text-xs">
                    {user.name.charAt(0)}
                  </div>
                  <span className="text-white font-bold hidden md:inline truncate max-w-[100px]">
                    {user.name.split(' ')[0]}
                  </span>
                  <span className="hidden lg:inline text-[9px] px-1.5 py-0.5 rounded bg-amber-500/10 border border-amber-500/30 text-amber-400 font-mono">
                    {user.tier}
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 text-zinc-400" />
                </button>

                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-[#0f0f15] border border-zinc-800 shadow-2xl p-3 space-y-2 z-50 text-xs font-mono">
                    <div className="p-2.5 rounded-xl bg-zinc-950 border border-zinc-800">
                      <div className="text-white font-bold">{user.name}</div>
                      <div className="text-[11px] text-zinc-400 truncate">{user.email}</div>
                      <div className="flex items-center justify-between pt-2 mt-2 border-t border-zinc-900 text-[10px]">
                        <span className="text-zinc-500">{user.role || 'Diner'}</span>
                        <span className="text-amber-400 font-bold">{user.points} pts</span>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <Link
                        href="/account"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-zinc-900 text-zinc-300 hover:text-white transition-colors"
                      >
                        <User className="w-4 h-4 text-amber-400" />
                        <span>Dev Profile & Loyalty</span>
                      </Link>
                      <Link
                        href="/track-order"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-zinc-900 text-zinc-300 hover:text-white transition-colors"
                      >
                        <Compass className="w-4 h-4 text-amber-400" />
                        <span>Track Live Feasts</span>
                      </Link>
                      <button
                        type="button"
                        onClick={() => {
                          logout();
                          setUserDropdownOpen(false);
                        }}
                        className="w-full flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-red-950/40 border border-transparent hover:border-red-900/60 text-red-400 transition-colors text-left cursor-pointer"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link
                href="/login"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-900/80 hover:bg-zinc-800 text-zinc-300 hover:text-amber-400 border border-zinc-800 hover:border-amber-500/40 text-xs font-mono transition-all"
              >
                <User className="w-3.5 h-3.5 text-amber-400" />
                <span className="hidden sm:inline">Sign In</span>
              </Link>
            )}

            {/* Cart Button */}
            <Link
              href="/cart"
              className="relative p-2 sm:p-2.5 rounded-xl bg-zinc-900/80 hover:bg-zinc-800 text-zinc-200 hover:text-amber-400 border border-zinc-800 hover:border-amber-500/40 transition-all flex items-center justify-center group"
              aria-label={`Shopping Cart with ${totalItems} items`}
            >
              <ShoppingBag className="w-5 h-5 group-hover:scale-110 transition-transform text-amber-400" />
              {totalItems > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-gradient-to-r from-amber-500 to-orange-500 text-black font-bold text-xs w-5 h-5 rounded-full flex items-center justify-center shadow-lg shadow-amber-500/30 animate-bounce">
                  {totalItems}
                </span>
              )}
            </Link>

            {/* Primary CTA: Order Now */}
            <Link
              href="/menu"
              className="hidden sm:inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-black font-bold text-sm tracking-wide shadow-lg shadow-amber-500/20 hover:shadow-amber-500/40 transition-all duration-200 hover:-translate-y-0.5 cursor-pointer"
            >
              <Sparkles className="w-4 h-4 fill-black" />
              <span>Order Now</span>
            </Link>

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="xl:hidden p-2 rounded-lg bg-zinc-900 text-zinc-300 hover:text-white border border-zinc-800 focus:outline-none cursor-pointer"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5 sm:w-6 sm:h-6" /> : <MenuIcon className="w-5 h-5 sm:w-6 sm:h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Sliding Drawer */}
      {mobileMenuOpen && (
        <div className="xl:hidden bg-[#070709]/98 border-b border-zinc-800 px-4 pt-3 pb-6 space-y-3 backdrop-blur-xl animate-in slide-in-from-top duration-200">
          {/* User profile card or sign-in prompt */}
          {isLoggedIn && user ? (
            <div className="p-3 rounded-2xl bg-zinc-900/90 border border-zinc-800 flex items-center justify-between">
              <Link
                href="/account"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2.5 hover:opacity-85 transition-opacity"
              >
                <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-amber-500 to-orange-500 flex items-center justify-center text-black font-bold font-mono">
                  {user.name.charAt(0)}
                </div>
                <div>
                  <div className="text-white font-bold text-xs flex items-center gap-1">
                    <span>{user.name}</span>
                    <ChevronRight className="w-3 h-3 text-zinc-500" />
                  </div>
                  <div className="text-[10px] text-amber-400 font-mono">
                    {user.tier} • {user.points} pts
                  </div>
                </div>
              </Link>
              <button
                type="button"
                onClick={() => {
                  logout();
                  setMobileMenuOpen(false);
                }}
                className="text-xs text-red-400 hover:text-red-300 font-mono px-2 py-1 rounded bg-red-950/40 border border-red-900/40"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="flex-1 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-center font-mono text-xs text-white hover:text-amber-400"
              >
                Sign In
              </Link>
              <Link
                href="/register"
                onClick={() => setMobileMenuOpen(false)}
                className="flex-1 py-2.5 rounded-xl bg-amber-500 text-black font-bold text-center font-mono text-xs"
              >
                Register (+50 Pts)
              </Link>
            </div>
          )}

          <div className="flex flex-col space-y-1">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              const Icon = link.icon;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center justify-between px-4 py-2.5 rounded-xl text-sm font-mono font-medium transition-colors ${
                    isActive
                      ? 'bg-amber-500 text-black font-bold'
                      : 'text-zinc-300 hover:text-white hover:bg-zinc-900'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {Icon && <Icon className="w-4 h-4" />}
                    <span>{link.name}</span>
                  </div>
                  {link.badge && (
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
                        isActive
                          ? 'bg-black text-amber-400'
                          : 'bg-red-500/20 text-red-400 border border-red-500/30'
                      }`}
                    >
                      {link.badge}
                    </span>
                  )}
                </Link>
              );
            })}

            <div className="pt-4 border-t border-zinc-800/80 flex flex-col gap-3">
              <Link
                href="/menu"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-black font-bold text-center shadow-lg shadow-amber-500/20"
              >
                <Sparkles className="w-4 h-4 fill-black" />
                <span>Explore Full Menu</span>
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
