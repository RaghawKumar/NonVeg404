'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Menu as MenuIcon,
  Bell,
  Search,
  CheckCircle,
  Activity,
  Flame,
  Power,
  ShieldCheck,
  LogOut,
  User,
  Lock,
} from 'lucide-react';

interface HeaderProps {
  onToggleMobileMenu?: () => void;
  title?: string;
  subtitle?: string;
}

export default function AdminHeader({
  onToggleMobileMenu,
  title = 'Terminal Dashboard',
  subtitle = 'Superuser Operations & Telemetry',
}: HeaderProps) {
  const router = useRouter();
  const [kitchenOnline, setKitchenOnline] = useState(true);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [adminUser, setAdminUser] = useState({
    name: 'Admin Chef (Root)',
    email: 'admin@nonveg404.dev',
    role: 'Store Manager (Root)',
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('admin_auth_nv404');
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          setAdminUser({
            name: parsed.roleKey === 'kitchen' ? 'Kitchen Lead' : 'Admin Chef (Root)',
            email: parsed.email || 'admin@nonveg404.dev',
            role: parsed.role || 'Store Manager (Root)',
          });
        } catch {
          // keep fallback
        }
      }
    }
  }, []);

  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('admin_auth_nv404');
    }
    router.push('/login');
  };

  return (
    <header className="sticky top-0 z-30 bg-[#070709]/95 backdrop-blur-md border-b border-[#22222e] px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between gap-4">
      {/* Left: Mobile hamburger & Page Title */}
      <div className="flex items-center gap-3">
        {onToggleMobileMenu && (
          <button
            onClick={onToggleMobileMenu}
            className="lg:hidden p-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white"
            aria-label="Open sidebar menu"
          >
            <MenuIcon className="w-5 h-5" />
          </button>
        )}

        <div>
          <h1 className="text-lg sm:text-xl font-bold text-white font-sans leading-tight">
            {title}
          </h1>
          {subtitle && (
            <p className="text-[11px] font-mono text-zinc-400 hidden sm:block">
              {subtitle}
            </p>
          )}
        </div>
      </div>

      {/* Right Controls: Kitchen Status, Notifications, Staff User Profile */}
      <div className="flex items-center gap-2.5 sm:gap-3.5">
        {/* Live Kitchen Toggle */}
        <button
          onClick={() => setKitchenOnline(!kitchenOnline)}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-mono font-bold transition-all cursor-pointer ${
            kitchenOnline
              ? 'bg-emerald-950/70 border-emerald-800 text-emerald-400'
              : 'bg-red-950/70 border-red-800 text-red-400'
          }`}
          title="Toggle Kitchen Online/Maintenance status"
        >
          <span
            className={`w-2 h-2 rounded-full ${
              kitchenOnline ? 'bg-emerald-400 animate-ping' : 'bg-red-400'
            }`}
          />
          <span className="hidden sm:inline">KITCHEN:</span>
          <span>{kitchenOnline ? 'ONLINE' : 'OFFLINE'}</span>
        </button>

        {/* Notification Bell */}
        <div className="relative">
          <button
            onClick={() => {
              setNotificationsOpen(!notificationsOpen);
              setUserDropdownOpen(false);
            }}
            className="p-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 hover:text-amber-400 transition-colors relative cursor-pointer"
            aria-label="Notifications"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
          </button>

          {notificationsOpen && (
            <div className="absolute right-0 mt-2 w-80 rounded-2xl bg-[#0f0f15] border border-zinc-800 shadow-2xl p-4 space-y-3 z-50 text-xs font-mono">
              <div className="flex items-center justify-between pb-2 border-b border-zinc-800">
                <span className="font-bold text-white">System Alerts</span>
                <span className="text-[10px] text-amber-400">3 unread</span>
              </div>
              <div className="space-y-2 text-[11px]">
                <div className="p-2 rounded-lg bg-zinc-950 border border-zinc-800/80 space-y-0.5">
                  <div className="text-amber-400 font-bold">New Order #NV404-8924</div>
                  <div className="text-zinc-400">Linus Torvalds placed ₹55.59 feast</div>
                  <div className="text-[9px] text-zinc-600">3 mins ago</div>
                </div>
                <div className="p-2 rounded-lg bg-zinc-950 border border-zinc-800/80 space-y-0.5">
                  <div className="text-emerald-400 font-bold">Table Reservation Confirmed</div>
                  <div className="text-zinc-400">Ada Lovelace booked Window Booth #01</div>
                  <div className="text-[9px] text-zinc-600">12 mins ago</div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Staff User Profile Dropdown */}
        <div className="relative">
          <button
            onClick={() => {
              setUserDropdownOpen(!userDropdownOpen);
              setNotificationsOpen(false);
            }}
            className="flex items-center gap-2 p-1.5 sm:px-3 sm:py-1.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 transition-colors cursor-pointer text-left"
          >
            <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-amber-500 to-orange-500 flex items-center justify-center text-black font-mono font-bold text-xs">
              root
            </div>
            <div className="hidden md:block">
              <div className="text-xs font-bold text-white font-mono leading-none flex items-center gap-1">
                <span>{adminUser.name}</span>
                <ShieldCheck className="w-3 h-3 text-amber-400" />
              </div>
              <div className="text-[10px] text-zinc-400 font-mono mt-0.5">
                {adminUser.role}
              </div>
            </div>
          </button>

          {userDropdownOpen && (
            <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-[#0f0f15] border border-zinc-800 shadow-2xl p-3 space-y-2 z-50 text-xs font-mono">
              <div className="p-2.5 rounded-xl bg-zinc-950 border border-zinc-800/80">
                <div className="text-white font-bold">{adminUser.name}</div>
                <div className="text-[11px] text-zinc-400 truncate">{adminUser.email}</div>
                <div className="inline-block mt-1 px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/20 text-amber-400 text-[10px]">
                  {adminUser.role}
                </div>
              </div>

              <div className="space-y-1 pt-1">
                <Link
                  href="/settings"
                  onClick={() => setUserDropdownOpen(false)}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-zinc-900 text-zinc-300 hover:text-white transition-colors"
                >
                  <Activity className="w-4 h-4 text-amber-400" />
                  <span>Restaurant Settings</span>
                </Link>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-red-950/40 border border-transparent hover:border-red-900/60 text-red-400 transition-colors text-left cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Lock Session / Sign Out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
