'use client';

import React, { useState, useEffect } from 'react';
import {
  Settings,
  Clock,
  Truck,
  ShieldAlert,
  Check,
  Zap,
  MapPin,
  Phone,
  Mail,
  DollarSign,
} from 'lucide-react';
import { INITIAL_SETTINGS } from '@/data/mockAdminData';
import { RestaurantSettings } from '@/types/admin';
import { adminApi } from '@/lib/api';

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<RestaurantSettings>(INITIAL_SETTINGS);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    async function loadSettings() {
      try {
        const res = await adminApi.settings.get();
        if (res.success && res.settings) {
          setSettings(res.settings);
        }
      } catch {
        // Keep initial mock settings
      }
    }
    loadSettings();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    try {
      await adminApi.settings.update(settings);
    } catch (err: any) {
      console.warn('Backend save settings error:', err.message);
    }
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-800">
        <div>
          <h1 className="text-2xl font-bold text-white font-sans">
            Restaurant System Configuration
          </h1>
          <p className="text-xs font-mono text-zinc-400">
            Control kitchen operating cron schedules, delivery geofence, and pricing rules.
          </p>
        </div>

        {saved && (
          <span className="px-3 py-1.5 rounded-xl bg-emerald-500/20 text-emerald-400 font-mono text-xs font-bold flex items-center gap-1.5 border border-emerald-500/40 animate-in fade-in">
            <Check className="w-4 h-4 stroke-[3]" />
            <span>Parameters Compiled &amp; Saved!</span>
          </span>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 font-mono text-xs">
        {/* Section 1: Kitchen Hardware & Status */}
        <div className="p-6 rounded-2xl bg-[#0e0e13] border border-zinc-800 space-y-4 shadow-xl">
          <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Zap className="w-4 h-4 text-amber-500" />
            <span>1. Kitchen Master Daemon Status</span>
          </h2>

          <div className="flex items-center justify-between p-4 rounded-xl bg-zinc-950 border border-zinc-800">
            <div>
              <div className="text-white font-bold text-sm">Accepting New Orders (Kitchen Online)</div>
              <div className="text-zinc-500 text-[11px] mt-0.5">
                Disable this toggle during emergency kitchen cleaning or off-hours maintenance.
              </div>
            </div>

            <button
              type="button"
              onClick={() => setSettings({ ...settings, isKitchenOpen: !settings.isKitchenOpen })}
              className={`px-4 py-2 rounded-xl font-bold transition-all cursor-pointer ${
                settings.isKitchenOpen
                  ? 'bg-emerald-500 text-black shadow-lg shadow-emerald-500/20'
                  : 'bg-red-600 text-white shadow-lg shadow-red-600/20'
              }`}
            >
              {settings.isKitchenOpen ? 'ONLINE' : 'OFFLINE'}
            </button>
          </div>

          <div className="flex items-center justify-between p-4 rounded-xl bg-zinc-950 border border-zinc-800">
            <div>
              <div className="text-white font-bold text-sm">Surge Demand Mode</div>
              <div className="text-zinc-500 text-[11px] mt-0.5">
                Adds 10m buffer to prep times during Friday peak and football matches.
              </div>
            </div>

            <button
              type="button"
              onClick={() => setSettings({ ...settings, surgeActive: !settings.surgeActive })}
              className={`px-4 py-2 rounded-xl font-bold transition-all cursor-pointer ${
                settings.surgeActive
                  ? 'bg-amber-500 text-black shadow-lg shadow-amber-500/20'
                  : 'bg-zinc-800 text-zinc-400'
              }`}
            >
              {settings.surgeActive ? 'ACTIVE' : 'NORMAL'}
            </button>
          </div>
        </div>

        {/* Section 2: Operating Timings */}
        <div className="p-6 rounded-2xl bg-[#0e0e13] border border-zinc-800 space-y-4 shadow-xl">
          <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Clock className="w-4 h-4 text-amber-500" />
            <span>2. Operating Hours &amp; Late Night Shift</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-zinc-400">Regular Operating Hours</label>
              <input
                type="text"
                value={settings.openingHours}
                onChange={(e) => setSettings({ ...settings, openingHours: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-white focus:outline-none focus:border-amber-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-zinc-400">Late Night Dev Shift</label>
              <input
                type="text"
                value={settings.lateNightShift}
                onChange={(e) => setSettings({ ...settings, lateNightShift: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-white focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>
        </div>

        {/* Section 3: Delivery & Financial Parameters */}
        <div className="p-6 rounded-2xl bg-[#0e0e13] border border-zinc-800 space-y-4 shadow-xl">
          <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Truck className="w-4 h-4 text-amber-500" />
            <span>3. Delivery Pipeline &amp; Tax Calibration</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-1.5">
              <label className="text-zinc-400">Standard Delivery Fee (₹)</label>
              <input
                type="number"
                step="0.01"
                value={settings.deliveryFee}
                onChange={(e) => setSettings({ ...settings, deliveryFee: Number(e.target.value) })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-white focus:outline-none focus:border-amber-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-zinc-400">Free Delivery Goal (₹)</label>
              <input
                type="number"
                value={settings.freeDeliveryThreshold}
                onChange={(e) => setSettings({ ...settings, freeDeliveryThreshold: Number(e.target.value) })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-white focus:outline-none focus:border-amber-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-zinc-400">Minimum Order (₹)</label>
              <input
                type="number"
                value={settings.minOrderAmount}
                onChange={(e) => setSettings({ ...settings, minOrderAmount: Number(e.target.value) })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-white focus:outline-none focus:border-amber-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-zinc-400">Dispatch Radius (km)</label>
              <input
                type="number"
                value={settings.deliveryRadiusKm}
                onChange={(e) => setSettings({ ...settings, deliveryRadiusKm: Number(e.target.value) })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-white focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>
        </div>

        {/* Section 4: Contact Endpoints */}
        <div className="p-6 rounded-2xl bg-[#0e0e13] border border-zinc-800 space-y-4 shadow-xl">
          <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <MapPin className="w-4 h-4 text-amber-500" />
            <span>4. Physical Restaurant Endpoints</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-zinc-400">Hotline Phone</label>
              <input
                type="text"
                value={settings.phone}
                onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-white focus:outline-none focus:border-amber-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-zinc-400">Server Email</label>
              <input
                type="email"
                value={settings.email}
                onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-white focus:outline-none focus:border-amber-500"
              />
            </div>

            <div className="sm:col-span-2 space-y-1.5">
              <label className="text-zinc-400">Street Address</label>
              <input
                type="text"
                value={settings.address}
                onChange={(e) => setSettings({ ...settings, address: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-white focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>
        </div>

        <button
          type="submit"
          className="w-full py-4 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-black font-extrabold text-sm font-mono tracking-wide shadow-xl shadow-amber-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          <Check className="w-4 h-4 stroke-[3]" />
          <span>COMMIT SYSTEM CONFIGURATION</span>
        </button>
      </form>
    </div>
  );
}
