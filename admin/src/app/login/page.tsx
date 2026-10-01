'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import {
  Terminal,
  ShieldCheck,
  Lock,
  Mail,
  KeyRound,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Cpu,
  ChefHat,
  Sparkles,
} from 'lucide-react';

import { adminApi } from '@/lib/api';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('admin@nonveg404.dev');
  const [password, setPassword] = useState('sudo_root_404');
  const [role, setRole] = useState<'manager' | 'kitchen'>('manager');
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const res = await adminApi.auth.login(email.trim(), password.trim());
      if (res.success) {
        setIsLoading(false);
        setSuccess(true);
        setTimeout(() => {
          router.push('/');
        }, 600);
        return;
      }
    } catch (err: any) {
      console.warn('Backend login error, checking fallback demo credentials:', err.message);
      if (
        (email.trim() === 'admin@nonveg404.dev' || email.trim() === 'kitchen@nonveg404.dev') &&
        (password.trim() === 'sudo_root_404' || password.trim() === 'cook_line_404' || password.trim() === 'sudo_pass_404')
      ) {
        const adminSession = {
          email,
          role: role === 'manager' ? 'Store Manager (Root)' : 'Kitchen Lead (Cook)',
          roleKey: role,
          token: 'jwt_mock_nv404_' + Math.random().toString(36).substring(2),
          loginTime: new Date().toISOString(),
        };
        localStorage.setItem('admin_auth_nv404', JSON.stringify(adminSession));
        setIsLoading(false);
        setSuccess(true);
        setTimeout(() => {
          router.push('/');
        }, 600);
        return;
      }
      setIsLoading(false);
      setError(err.message || 'Invalid root credentials.');
    }
  };

  const handleAutofill = (demoRole: 'manager' | 'kitchen') => {
    setRole(demoRole);
    if (demoRole === 'manager') {
      setEmail('admin@nonveg404.dev');
      setPassword('sudo_root_404');
    } else {
      setEmail('kitchen@nonveg404.dev');
      setPassword('cook_line_404');
    }
  };

  return (
    <div className="min-h-screen bg-[#070709] flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-72 h-72 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md relative z-10 space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-gradient-to-b from-zinc-800 to-zinc-950 border border-zinc-700/60 shadow-xl shadow-amber-500/10 mb-1">
            <Image
              src="/logo.png"
              alt="NON VEG 404 Logo"
              width={56}
              height={56}
              className="object-contain drop-shadow"
            />
          </div>
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 font-mono text-xs font-semibold uppercase tracking-wider mb-2">
              <Terminal className="w-3.5 h-3.5" />
              <span>// SUDO KERNEL ACCESS //</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              NON VEG 404 Admin
            </h1>
            <p className="text-xs font-mono text-zinc-400 mt-1">
              Restricted management console for kitchen orders & restaurant telemetry.
            </p>
          </div>
        </div>

        {/* Card */}
        <div className="bg-[#0e0e13]/90 backdrop-blur-xl border border-zinc-800/80 rounded-2xl p-6 sm:p-8 shadow-2xl space-y-6">
          {/* Role Tabs */}
          <div className="grid grid-cols-2 gap-2 p-1 bg-zinc-950/80 rounded-xl border border-zinc-800/80 text-xs font-mono">
            <button
              type="button"
              onClick={() => handleAutofill('manager')}
              className={`flex items-center justify-center gap-2 py-2 rounded-lg font-bold transition-all cursor-pointer ${role === 'manager'
                ? 'bg-amber-500 text-black shadow-md shadow-amber-500/20'
                : 'text-zinc-400 hover:text-white'
                }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Store Manager</span>
            </button>
            <button
              type="button"
              onClick={() => handleAutofill('kitchen')}
              className={`flex items-center justify-center gap-2 py-2 rounded-lg font-bold transition-all cursor-pointer ${role === 'kitchen'
                ? 'bg-amber-500 text-black shadow-md shadow-amber-500/20'
                : 'text-zinc-400 hover:text-white'
                }`}
            >
              <ChefHat className="w-3.5 h-3.5" />
              <span>Kitchen Staff</span>
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            {error && (
              <div className="p-3 rounded-xl bg-red-950/40 border border-red-800/60 text-red-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
                <span>{error}</span>
              </div>
            )}

            {success && (
              <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-800/60 text-emerald-300 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400 animate-spin" />
                <span>Access Granted. Launching kitchen dashboard...</span>
              </div>
            )}

            {/* Email */}
            <div className="space-y-1.5">
              <label className="block text-xs font-mono font-medium text-zinc-300">
                Staff Identity (Email / Terminal ID)
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-500">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@nonveg404.dev"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-white font-mono text-xs placeholder:text-zinc-600 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-colors"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs font-mono">
                <label className="text-zinc-300 font-medium">Sudo Keyphrase</label>
                <span className="text-[11px] text-zinc-500">256-bit AES</span>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-500">
                  <KeyRound className="w-4 h-4" />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-white font-mono text-xs placeholder:text-zinc-600 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-colors"
                />
              </div>
            </div>

            {/* Remember Me */}
            <div className="flex items-center justify-between pt-1 text-xs">
              <label className="flex items-center gap-2 cursor-pointer text-zinc-400 select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded border-zinc-800 bg-zinc-950 text-amber-500 focus:ring-amber-500"
                />
                <span className="font-mono text-[11px]">Keep active terminal session</span>
              </label>
              <button
                type="button"
                onClick={() => handleAutofill('manager')}
                className="text-amber-400 hover:text-amber-300 font-mono text-[11px] underline underline-offset-2"
              >
                Autofill demo key
              </button>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading || success}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-black font-mono font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 transition-all cursor-pointer disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                  <span>Verifying RSA Key...</span>
                </>
              ) : success ? (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Authorized</span>
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4" />
                  <span>Authenticate Session</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Autofill Helpers */}
          <div className="pt-4 border-t border-zinc-800/80 space-y-2">
            <div className="text-[11px] font-mono text-zinc-500 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Demo Quick Presets (Click to autofill):</span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-[10px] font-mono">
              <button
                type="button"
                onClick={() => handleAutofill('manager')}
                className="p-2 rounded-lg bg-zinc-950 hover:bg-zinc-900 border border-zinc-800 text-left transition-colors cursor-pointer group"
              >
                <div className="text-amber-400 font-bold group-hover:text-amber-300">Manager Demo</div>
                <div className="text-zinc-500">admin@nonveg404.dev</div>
              </button>
              <button
                type="button"
                onClick={() => handleAutofill('kitchen')}
                className="p-2 rounded-lg bg-zinc-950 hover:bg-zinc-900 border border-zinc-800 text-left transition-colors cursor-pointer group"
              >
                <div className="text-amber-400 font-bold group-hover:text-amber-300">Cook Line Demo</div>
                <div className="text-zinc-500">kitchen@nonveg404.dev</div>
              </button>
            </div>
          </div>
        </div>

        {/* Security Footer Notice */}
        <div className="text-center font-mono text-[10px] text-zinc-600 flex items-center justify-center gap-1.5">
          <Cpu className="w-3 h-3 text-zinc-500" />
          <span>NON VEG 404 KERNEL ENGINE // INTERNAL RESTAURANT TERMINAL</span>
        </div>
      </div>
    </div>
  );
}
