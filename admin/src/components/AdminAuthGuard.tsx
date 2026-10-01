'use client';

import React, { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Terminal, ShieldAlert, KeyRound, Loader2, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function AdminAuthGuard({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const isLoginPage = pathname === '/login';

  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [adminUser, setAdminUser] = useState<any>(null);

  useEffect(() => {
    if (isLoginPage) {
      setIsAuthenticated(true);
      return;
    }

    try {
      const stored = localStorage.getItem('admin_auth_nv404');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed && (parsed.token || parsed.email)) {
          setIsAuthenticated(true);
          setAdminUser(parsed);
          return;
        }
      }
      setIsAuthenticated(false);
      // Auto-redirect to login after short delay so user sees access barrier
      const timer = setTimeout(() => {
        router.push('/login');
      }, 1000);
      return () => clearTimeout(timer);
    } catch {
      setIsAuthenticated(false);
      router.push('/login');
    }
  }, [pathname, isLoginPage, router]);

  // While checking auth on client
  if (isAuthenticated === null && !isLoginPage) {
    return (
      <div className="min-h-screen bg-[#070709] flex flex-col items-center justify-center space-y-4 p-4">
        <div className="flex items-center gap-3 px-4 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-amber-400 font-mono text-xs">
          <Loader2 className="w-4 h-4 animate-spin text-amber-500" />
          <span>[KERNEL] Verifying sudo access tokens...</span>
        </div>
      </div>
    );
  }

  // Not authenticated and not on login page
  if (isAuthenticated === false && !isLoginPage) {
    return (
      <div className="min-h-screen bg-[#070709] flex flex-col items-center justify-center p-4">
        <div className="max-w-md w-full p-6 sm:p-8 rounded-2xl bg-[#0e0e13] border border-red-500/40 shadow-2xl shadow-red-500/10 text-center space-y-5 font-mono">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-500">
            <ShieldAlert className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <div className="text-red-400 text-xs font-bold uppercase tracking-wider">
              // ERROR 401: UNAUTHORIZED KERNEL ACCESS //
            </div>
            <h2 className="text-xl font-bold text-white">Root Authentication Required</h2>
            <p className="text-xs text-zinc-400">
              You must supply a valid Superuser key and token to access the restaurant operations backend.
            </p>
          </div>

          <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-800 text-[11px] text-zinc-500 text-left">
            <code>$ sudo access --role=manager</code>
            <br />
            <span className="text-red-400">Permission denied: publickey authentication failed.</span>
          </div>

          <Link
            href="/login"
            className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-black font-bold text-xs flex items-center justify-center gap-2 transition-transform active:scale-95 shadow-lg shadow-amber-500/20"
          >
            <KeyRound className="w-4 h-4" />
            <span>Go to Admin Login</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
