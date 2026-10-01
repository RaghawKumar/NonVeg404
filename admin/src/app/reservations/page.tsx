'use client';

import React, { useState, useEffect } from 'react';
import {
  CalendarCheck,
  Clock,
  Users,
  MapPin,
  CheckCircle2,
  XCircle,
  Search,
} from 'lucide-react';
import { INITIAL_RESERVATIONS } from '@/data/mockAdminData';
import { Reservation, ReservationStatus } from '@/types/admin';
import { adminApi } from '@/lib/api';

export default function AdminReservationsPage() {
  const [reservations, setReservations] = useState<Reservation[]>(INITIAL_RESERVATIONS);
  const [filter, setFilter] = useState<string>('ALL');

  const fetchReservations = async () => {
    try {
      const res = await adminApi.reservations.getAll();
      if (res.success && res.reservations.length > 0) {
        setReservations(res.reservations);
      }
    } catch {
      // Keep initial dataset
    }
  };

  useEffect(() => {
    fetchReservations();
  }, []);

  const updateStatus = async (id: string, newStatus: ReservationStatus) => {
    setReservations((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: newStatus } : r))
    );
    try {
      await adminApi.reservations.updateStatus(id, newStatus);
    } catch (err: any) {
      console.warn('Backend update reservation status failed:', err.message);
    }
  };

  const filtered = filter === 'ALL'
    ? reservations
    : reservations.filter((r) => r.status === filter);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-800">
        <div>
          <h1 className="text-2xl font-bold text-white font-sans">
            Table Reservations Manifest
          </h1>
          <p className="text-xs font-mono text-zinc-400">
            Manage table booth locks, seating assignments, and special developer party requests.
          </p>
        </div>

        <div className="flex items-center gap-1.5 font-mono text-xs">
          {['ALL', 'CONFIRMED', 'PENDING', 'SEATED', 'CANCELLED'].map((st) => (
            <button
              key={st}
              onClick={() => setFilter(st)}
              className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                filter === st
                  ? 'bg-amber-500 text-black font-bold'
                  : 'bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((res) => (
          <div
            key={res.id}
            className="p-5 rounded-2xl bg-[#0e0e13] border border-zinc-800 hover:border-zinc-700 transition-all space-y-4 shadow-xl flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-base font-mono font-bold text-amber-400">
                  #{res.id}
                </span>
                <span
                  className={`px-2.5 py-0.5 rounded text-[10px] font-mono font-bold ${
                    res.status === 'CONFIRMED'
                      ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                      : res.status === 'SEATED'
                      ? 'bg-blue-950 text-blue-400 border border-blue-800'
                      : res.status === 'PENDING'
                      ? 'bg-amber-950 text-amber-400 border border-amber-800'
                      : 'bg-red-950 text-red-400 border border-red-800'
                  }`}
                >
                  {res.status}
                </span>
              </div>

              <div>
                <h3 className="text-base font-bold text-white">{res.customerName}</h3>
                <div className="text-xs font-mono text-zinc-400 flex items-center gap-1 mt-0.5">
                  <Users className="w-3.5 h-3.5 text-amber-500" />
                  <span>Party of {res.guests} Guests</span>
                  <span>•</span>
                  <span>{res.date} @ {res.time}</span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-900 text-xs font-mono space-y-1">
                <div className="text-zinc-500">ASSIGNED BOOTH:</div>
                <div className="text-white font-medium">{res.tableZone}</div>
                <div className="text-zinc-400 text-[11px]">{res.phone} • {res.email}</div>
                {res.specialRequests && (
                  <div className="text-amber-300 italic pt-1 text-[11px]">
                    Note: &ldquo;{res.specialRequests}&rdquo;
                  </div>
                )}
              </div>
            </div>

            <div className="pt-3 border-t border-zinc-800 flex items-center justify-between text-xs font-mono">
              <span className="text-[11px] text-zinc-500">Booked {res.createdAt}</span>

              <div className="flex items-center gap-2">
                {res.status === 'PENDING' && (
                  <button
                    onClick={() => updateStatus(res.id, 'CONFIRMED')}
                    className="px-3 py-1 rounded bg-emerald-600 text-black font-bold"
                  >
                    Approve Lock
                  </button>
                )}
                {res.status === 'CONFIRMED' && (
                  <button
                    onClick={() => updateStatus(res.id, 'SEATED')}
                    className="px-3 py-1 rounded bg-blue-600 text-white font-bold"
                  >
                    Mark Seated
                  </button>
                )}
                {res.status !== 'CANCELLED' && (
                  <button
                    onClick={() => updateStatus(res.id, 'CANCELLED')}
                    className="px-2.5 py-1 rounded bg-zinc-900 hover:bg-red-950 text-zinc-400 hover:text-red-400"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
