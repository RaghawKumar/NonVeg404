'use client';

import React, { useState } from 'react';
import { usePathname } from 'next/navigation';
import './globals.css';
import AdminSidebar from '@/components/AdminSidebar';
import AdminHeader from '@/components/AdminHeader';
import AdminAuthGuard from '@/components/AdminAuthGuard';

export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const isLoginPage = pathname === '/login';

  return (
    <html lang="en" className="dark h-full">
      <head>
        <title>NON VEG 404 — Admin Kernel Portal</title>
        <meta name="description" content="Superuser restaurant operations and kitchen telemetry" />
        <link rel="icon" href="/logo.png" />
      </head>
      <body className="min-h-screen bg-[#070709] text-zinc-100 flex flex-col font-sans antialiased">
        <AdminAuthGuard>
          {isLoginPage ? (
            // Full-screen dedicated login page without sidebar
            <main className="flex-1 w-full min-h-screen">
              {children}
            </main>
          ) : (
            // Protected admin dashboard layout
            <div className="flex-1 flex min-h-screen">
              {/* Sidebar */}
              <AdminSidebar
                mobileOpen={mobileSidebarOpen}
                setMobileOpen={setMobileSidebarOpen}
              />

              {/* Main Content Area */}
              <div className="flex-1 flex flex-col lg:pl-64 min-w-0">
                <AdminHeader onToggleMobileMenu={() => setMobileSidebarOpen(true)} />
                <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
                  {children}
                </main>
              </div>
            </div>
          )}
        </AdminAuthGuard>
      </body>
    </html>
  );
}
