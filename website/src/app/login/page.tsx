'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import {
  Lock,
  Mail,
  KeyRound,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Terminal,
  ArrowLeft,
  UserCheck,
  Shield,
} from 'lucide-react';

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get('redirect') || '/';

  const { login, demoLogin, isLoading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authMode, setAuthMode] = useState<'password' | 'otp'>('password');
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email.trim()) {
      setError('Please enter your email or terminal handle.');
      return;
    }

    if (authMode === 'password' && !password.trim()) {
      setError('Please enter your password.');
      return;
    }

    if (authMode === 'otp' && !otpSent) {
      setOtpSent(true);
      return;
    }

    const res = await login(email, password);
    if (res.success) {
      setSuccess(true);
      setTimeout(() => {
        router.push(redirectUrl);
      }, 700);
    } else {
      setError(res.message || 'Authentication failed. Please check credentials.');
    }
  };

  const handleQuickDemo = (userType: 'linus' | 'ada') => {
    demoLogin(userType);
    setSuccess(true);
    setTimeout(() => {
      router.push(redirectUrl);
    }, 500);
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12 relative overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-72 h-72 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md relative z-10 space-y-6">
        {/* Brand header */}
        <div className="text-center space-y-2">
          <Link href="/" className="inline-flex items-center gap-2 group mb-1">
            <div className="p-2.5 rounded-2xl bg-zinc-900 border border-zinc-800 group-hover:border-amber-500/40 transition-colors shadow-lg shadow-amber-500/10">
              <Image
                src="/logo.png"
                alt="NON VEG 404"
                width={44}
                height={44}
                className="object-contain"
              />
            </div>
          </Link>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 font-mono text-xs font-semibold">
            <Terminal className="w-3.5 h-3.5" />
            <span>// DEVELOPER DINER LOGIN //</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            Welcome to NON VEG 404
          </h1>
          <p className="text-xs text-zinc-400 font-mono">
            Sign in to unlock saved delivery addresses, past feasts, and Kernel VIP rewards.
          </p>
        </div>

        {/* Card */}
        <div className="bg-[#0e0e13]/90 backdrop-blur-xl border border-zinc-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
          {/* Method selector */}
          <div className="grid grid-cols-2 gap-2 p-1 bg-zinc-950 rounded-xl border border-zinc-800 text-xs font-mono">
            <button
              type="button"
              onClick={() => {
                setAuthMode('password');
                setOtpSent(false);
              }}
              className={`py-2 rounded-lg font-bold transition-all cursor-pointer ${
                authMode === 'password'
                  ? 'bg-amber-500 text-black shadow-md shadow-amber-500/20'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              Password Login
            </button>
            <button
              type="button"
              onClick={() => setAuthMode('otp')}
              className={`py-2 rounded-lg font-bold transition-all cursor-pointer ${
                authMode === 'otp'
                  ? 'bg-amber-500 text-black shadow-md shadow-amber-500/20'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              Instant OTP
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 rounded-xl bg-red-950/40 border border-red-800/60 text-red-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
                <span>{error}</span>
              </div>
            )}

            {success && (
              <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-800/60 text-emerald-300 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400 animate-spin" />
                <span>Authentication successful! Launching feast terminal...</span>
              </div>
            )}

            {/* Email / Mobile */}
            <div className="space-y-1.5">
              <label className="block text-xs font-mono text-zinc-300">
                Email Address / Mobile Number
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-500">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="linus@linux.org or +1 (555) 019-2831"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-white font-mono text-xs placeholder:text-zinc-600 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-colors"
                />
              </div>
            </div>

            {/* Password Mode */}
            {authMode === 'password' && (
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs font-mono">
                  <label className="text-zinc-300">Password</label>
                  <span className="text-[11px] text-zinc-500">Forgot key?</span>
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
            )}

            {/* OTP Mode */}
            {authMode === 'otp' && otpSent && (
              <div className="space-y-1.5">
                <label className="block text-xs font-mono text-amber-400">
                  Enter 6-Digit SMS / Terminal OTP
                </label>
                <input
                  type="text"
                  maxLength={6}
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value)}
                  placeholder="404000"
                  className="w-full text-center tracking-[0.5em] py-2.5 rounded-xl bg-zinc-950 border border-amber-500/50 text-amber-400 font-mono text-lg font-bold focus:outline-none focus:ring-1 focus:ring-amber-500 transition-colors"
                />
                <p className="text-[10px] text-zinc-500 font-mono text-center">
                  Mock OTP dispatched: use any 6 numbers to verify.
                </p>
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading || success}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-black font-mono font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 transition-all cursor-pointer disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                  <span>Authenticating...</span>
                </>
              ) : success ? (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Welcome Back!</span>
                </>
              ) : authMode === 'otp' && !otpSent ? (
                <>
                  <span>Send One-Time Passcode</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4" />
                  <span>Sign In</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="relative flex items-center justify-center">
            <div className="border-t border-zinc-800 w-full" />
            <span className="bg-[#0e0e13] px-3 text-[10px] font-mono text-zinc-500 uppercase tracking-widest shrink-0">
              Or Instant Demo Login
            </span>
          </div>

          {/* Quick Demo Personas */}
          <div className="grid grid-cols-2 gap-2 text-xs font-mono">
            <button
              type="button"
              onClick={() => handleQuickDemo('linus')}
              className="p-2.5 rounded-xl bg-zinc-950 hover:bg-zinc-900 border border-zinc-800 hover:border-amber-500/40 text-left transition-colors cursor-pointer group"
            >
              <div className="text-amber-400 font-bold group-hover:text-amber-300 flex items-center gap-1">
                <span>Linus T.</span>
                <span className="text-[9px] px-1 rounded bg-amber-500/20 text-amber-400 font-normal">VIP</span>
              </div>
              <div className="text-[10px] text-zinc-500 mt-0.5">Kernel VIP (450 pts)</div>
            </button>

            <button
              type="button"
              onClick={() => handleQuickDemo('ada')}
              className="p-2.5 rounded-xl bg-zinc-950 hover:bg-zinc-900 border border-zinc-800 hover:border-amber-500/40 text-left transition-colors cursor-pointer group"
            >
              <div className="text-amber-400 font-bold group-hover:text-amber-300 flex items-center gap-1">
                <span>Ada L.</span>
                <span className="text-[9px] px-1 rounded bg-amber-500/20 text-amber-400 font-normal">Sudo</span>
              </div>
              <div className="text-[10px] text-zinc-500 mt-0.5">Sudo Dev (220 pts)</div>
            </button>
          </div>

          {/* Guest Checkout Option */}
          <div className="pt-2 text-center">
            <Link
              href="/menu"
              className="inline-flex items-center gap-1.5 text-xs font-mono text-zinc-400 hover:text-amber-400 transition-colors"
            >
              <span>Hungry now? Continue as Guest</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Sign Up Link */}
          <div className="pt-4 border-t border-zinc-800/80 text-center text-xs font-mono">
            <span className="text-zinc-500">Don&apos;t have a developer profile? </span>
            <Link
              href={`/register?redirect=${encodeURIComponent(redirectUrl)}`}
              className="text-amber-400 hover:text-amber-300 font-bold underline underline-offset-4"
            >
              Sign up for Perks →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CustomerLoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[85vh] flex items-center justify-center font-mono text-xs text-amber-400">
          Loading authentication terminal...
        </div>
      }
    >
      <LoginContent />
    </Suspense>
  );
}
