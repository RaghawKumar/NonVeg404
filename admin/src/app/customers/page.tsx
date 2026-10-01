'use client';

import React, { useState, useEffect } from 'react';
import {
  Users,
  Search,
  ShieldCheck,
  Phone,
  Mail,
  ShoppingBag,
  DollarSign,
  Award,
} from 'lucide-react';
import { INITIAL_CUSTOMERS } from '@/data/mockAdminData';
import { Customer } from '@/types/admin';
import { adminApi } from '@/lib/api';

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>(INITIAL_CUSTOMERS);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchCustomers = async () => {
    try {
      const res = await adminApi.customers.getAll();
      if (res.success && res.customers.length > 0) {
        setCustomers(res.customers);
      }
    } catch {
      // Keep initial dataset
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const filteredCustomers = customers.filter((c) => {
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        c.name.toLowerCase().includes(q) ||
        c.email.toLowerCase().includes(q) ||
        c.phone.includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-800">
        <div>
          <h1 className="text-2xl font-bold text-white font-sans">
            Customer Profiles & Dev Loyalty
          </h1>
          <p className="text-xs font-mono text-zinc-400">
            Directory of registered diners, loyalty tiers, and lifetime order volumes.
          </p>
        </div>

        <span className="px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 font-mono text-xs font-bold">
          {customers.length} Profiles Indexed
        </span>
      </div>

      <div className="p-4 rounded-2xl bg-[#0e0e13] border border-zinc-800">
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
          <input
            type="text"
            placeholder="Search by customer name, email address, or phone..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-xs sm:text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-amber-500 font-mono"
          />
        </div>
      </div>

      {/* Customer Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredCustomers.map((cust) => (
          <div
            key={cust.id}
            className="p-5 rounded-2xl bg-[#0e0e13] border border-zinc-800 hover:border-zinc-700 transition-all space-y-4 shadow-xl"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="text-base font-bold text-white">{cust.name}</h3>
                <span className="text-xs font-mono text-amber-400 flex items-center gap-1 mt-0.5">
                  <Award className="w-3.5 h-3.5 text-amber-500" />
                  <span>{cust.loyaltyTier}</span>
                </span>
              </div>

              <div className="text-right">
                <span className="text-xs font-mono text-zinc-500 block">Total Spent</span>
                <span className="text-base font-mono font-bold text-emerald-400">
                  ₹{cust.totalSpent.toFixed(2)}
                </span>
              </div>
            </div>

            <div className="space-y-1.5 text-xs font-mono text-zinc-400 pt-2 border-t border-zinc-800/80">
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-zinc-500" />
                <span>{cust.phone}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-zinc-500" />
                <span className="truncate">{cust.email}</span>
              </div>
            </div>

            <div className="pt-3 border-t border-zinc-800 flex items-center justify-between text-xs font-mono">
              <span className="text-zinc-500">{cust.ordersCount} Orders Placed</span>
              <span className="text-zinc-400">Last: {cust.lastOrderDate}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
