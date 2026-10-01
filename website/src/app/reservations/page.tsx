'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import confetti from 'canvas-confetti';
import {
  Calendar,
  Clock,
  Users,
  CheckCircle2,
  Sparkles,
  MapPin,
  UtensilsCrossed,
  ShieldCheck,
  Cpu,
  Laptop,
} from 'lucide-react';

const TABLE_ZONES = [
  {
    id: 'core-01',
    name: 'Core #01 — Window Developer Booth',
    capacity: '2 - 4 guests',
    desc: 'Ergonomic leather seating, panoramic glass street view, dedicated AC, dual power outlets.',
  },
  {
    id: 'thread-04',
    name: 'Thread #04 — Center High-Top Table',
    capacity: '2 - 3 guests',
    desc: 'Right in the center of the vibe. Fast service lane, direct view of the charcoal tandoor glass kitchen.',
  },
  {
    id: 'cluster-08',
    name: 'Cluster #08 — Sprint War Room',
    capacity: '6 - 12 guests',
    desc: 'Private acoustic glass room for team launches, family feasts, and merge celebration parties.',
  },
  {
    id: 'kernel-12',
    name: 'Kernel #12 — Outdoor Smoke Patio',
    capacity: '4 - 6 guests',
    desc: 'Breezy outdoor heated terrace seating under neon lights. Perfect for late-night foodies.',
  },
];

const TIME_SLOTS = [
  '12:00 PM',
  '01:00 PM',
  '02:00 PM',
  '06:30 PM',
  '07:30 PM',
  '08:30 PM',
  '09:30 PM',
  '10:30 PM',
  '11:30 PM (Dev Late Shift)',
];

export default function ReservationsPage() {
  const { createReservation } = useCart();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [guests, setGuests] = useState(2);
  const [date, setDate] = useState('Today');
  const [time, setTime] = useState('08:30 PM');
  const [tableType, setTableType] = useState(TABLE_ZONES[0].name);
  const [specialRequests, setSpecialRequests] = useState('');

  const [confirmedReservation, setConfirmedReservation] = useState<any | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !phone) {
      alert('Please provide your name, email, and phone number.');
      return;
    }

    const newRes = createReservation({
      customerName: name,
      email,
      phone,
      guests,
      date,
      time,
      tableType,
      specialRequests,
    });

    try {
      confetti({
        particleCount: 80,
        spread: 60,
      });
    } catch {}

    setConfirmedReservation(newRes);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 font-mono text-xs font-semibold">
          <Calendar className="w-3.5 h-3.5" />
          <span>RESERVE_KITCHEN_SLOT</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight">
          Reserve Your Table Booth
        </h1>
        <p className="text-zinc-400 text-sm sm:text-base leading-relaxed">
          Book a booth in our developer-inspired dining hall. Fast Wi-Fi, low acoustic noise,
          and direct access to the hottest non-veg grills in town.
        </p>
      </div>

      {confirmedReservation ? (
        /* Confirmation Card */
        <div className="max-w-2xl mx-auto p-8 rounded-3xl bg-gradient-to-b from-[#111118] to-[#0a0a0f] border border-amber-500/60 shadow-2xl text-center space-y-6">
          <div className="w-16 h-16 mx-auto rounded-full bg-emerald-500/10 border border-emerald-500 flex items-center justify-center text-emerald-400">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <div className="space-y-1">
            <span className="font-mono text-xs text-amber-400 font-bold uppercase">
              // TABLE_LOCK_ACQUIRED
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              Reservation Confirmed!
            </h2>
            <p className="text-zinc-400 text-sm">
              We look forward to hosting you at NON VEG 404.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-zinc-950 border border-zinc-800 text-left font-mono text-xs space-y-3">
            <div className="flex justify-between items-center pb-2 border-b border-zinc-800">
              <span className="text-zinc-500">RESERVATION TOKEN:</span>
              <span className="text-amber-400 font-bold text-sm">
                #{confirmedReservation.id}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-zinc-400">Guest Name:</span>
              <span className="text-white">{confirmedReservation.customerName}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-zinc-400">Date & Time:</span>
              <span className="text-white">
                {confirmedReservation.date} @ {confirmedReservation.time}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-zinc-400">Party Size:</span>
              <span className="text-white">{confirmedReservation.guests} Guests</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-zinc-400">Assigned Zone:</span>
              <span className="text-amber-400">{confirmedReservation.tableType}</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
            <Link
              href="/menu"
              className="px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-extrabold text-xs font-mono transition-all"
            >
              PREVIEW MENU DISHES
            </Link>
            <button
              onClick={() => setConfirmedReservation(null)}
              className="px-6 py-3 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 font-mono text-xs border border-zinc-700 transition-all"
            >
              MAKE ANOTHER RESERVATION
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Form: Details */}
          <div className="lg:col-span-8 space-y-6">
            {/* Zone Selector */}
            <div className="p-6 rounded-2xl bg-[#0e0e13] border border-zinc-800 space-y-4">
              <h3 className="text-xs font-mono text-amber-400 font-bold uppercase tracking-wider flex items-center gap-2">
                <Cpu className="w-4 h-4" />
                <span>1. SELECT TABLE ARCHITECTURE / ZONE</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {TABLE_ZONES.map((zone) => {
                  const isSelected = tableType === zone.name;
                  return (
                    <button
                      key={zone.id}
                      type="button"
                      onClick={() => setTableType(zone.name)}
                      className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-amber-500/10 border-amber-500 text-white shadow-md'
                          : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:border-zinc-700'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-sm text-white">{zone.name}</span>
                        <span className="text-[11px] font-mono text-amber-400">
                          {zone.capacity}
                        </span>
                      </div>
                      <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
                        {zone.desc}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Date, Time, and Guests */}
            <div className="p-6 rounded-2xl bg-[#0e0e13] border border-zinc-800 space-y-5">
              <h3 className="text-xs font-mono text-amber-400 font-bold uppercase tracking-wider flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>2. SCHEDULING PARAMETERS</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* Party Size */}
                <div className="space-y-1.5">
                  <label className="text-xs font-mono text-zinc-400 flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-amber-500" />
                    <span>Party Size</span>
                  </label>
                  <select
                    value={guests}
                    onChange={(e) => setGuests(Number(e.target.value))}
                    className="w-full px-4 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-sm text-white font-mono focus:outline-none focus:border-amber-500"
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8, 10, 12].map((num) => (
                      <option key={num} value={num}>
                        {num} {num === 1 ? 'Guest' : 'Guests'}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Date */}
                <div className="space-y-1.5">
                  <label className="text-xs font-mono text-zinc-400 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-amber-500" />
                    <span>Date</span>
                  </label>
                  <select
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-sm text-white font-mono focus:outline-none focus:border-amber-500"
                  >
                    <option value="Today">Today (Tonight)</option>
                    <option value="Tomorrow">Tomorrow</option>
                    <option value="This Friday">This Friday Night</option>
                    <option value="This Saturday">This Saturday Night</option>
                    <option value="Next Week">Next Week</option>
                  </select>
                </div>

                {/* Time */}
                <div className="space-y-1.5">
                  <label className="text-xs font-mono text-zinc-400 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-amber-500" />
                    <span>Time Slot</span>
                  </label>
                  <select
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-sm text-white font-mono focus:outline-none focus:border-amber-500"
                  >
                    {TIME_SLOTS.map((slot) => (
                      <option key={slot} value={slot}>
                        {slot}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Contact Details */}
            <div className="p-6 rounded-2xl bg-[#0e0e13] border border-zinc-800 space-y-4">
              <h3 className="text-xs font-mono text-amber-400 font-bold uppercase tracking-wider flex items-center gap-2">
                <Laptop className="w-4 h-4" />
                <span>3. LEAD CONTACT IDENTIFIER</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-mono text-zinc-400">Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Guido van Rossum"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-sm text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-mono text-zinc-400">Phone Number *</label>
                  <input
                    type="tel"
                    required
                    placeholder="+1 (555) 404-0000"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-sm text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div className="sm:col-span-2 space-y-1.5">
                  <label className="text-xs font-mono text-zinc-400">Email Address (for confirmation pass) *</label>
                  <input
                    type="email"
                    required
                    placeholder="architect@techfirm.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-sm text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div className="sm:col-span-2 space-y-1.5">
                  <label className="text-xs font-mono text-zinc-400">Special Notes or Dietary Requirements</label>
                  <textarea
                    rows={2}
                    placeholder="e.g. High-speed power strips needed, extra spicy preference, anniversary celebration"
                    value={specialRequests}
                    onChange={(e) => setSpecialRequests(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-amber-500 font-sans"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-4 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-black font-extrabold text-sm tracking-wide shadow-xl shadow-amber-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Sparkles className="w-4 h-4 fill-black" />
              <span>ACQUIRE TABLE LOCK (CONFIRM RESERVATION)</span>
            </button>
          </div>

          {/* Right Info Card */}
          <div className="lg:col-span-4 space-y-6">
            <div className="p-6 rounded-2xl bg-[#0e0e13] border border-zinc-800 space-y-4 shadow-xl">
              <h4 className="text-sm font-bold text-white font-mono border-b border-zinc-800 pb-3 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-amber-500" />
                <span>The NON VEG 404 Guarantee</span>
              </h4>

              <div className="space-y-3 text-xs text-zinc-400">
                <div className="flex items-start gap-2">
                  <span className="text-amber-500 font-bold">•</span>
                  <span><strong>Zero Reservation Fees:</strong> No advance cover charges or hidden payment fees.</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-amber-500 font-bold">•</span>
                  <span><strong>15-Minute Grace Window:</strong> We preserve your table lock for 15 minutes past your reservation slot.</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-amber-500 font-bold">•</span>
                  <span><strong>Complimentary Welcome Broth:</strong> Every dine-in guest receives our signature spicy mutton bone broth on arrival.</span>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-900 text-xs font-mono space-y-1">
                <div className="text-zinc-500">RESTAURANT LOCATION:</div>
                <div className="text-white">404 Kernel Way, Tech City</div>
                <div className="text-amber-400/90 text-[11px]">Free valet & garage parking</div>
              </div>
            </div>
          </div>
        </form>
      )}
    </div>
  );
}
