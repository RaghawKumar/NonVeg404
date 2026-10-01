'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import confetti from 'canvas-confetti';
import {
  CreditCard,
  QrCode,
  Banknote,
  Building,
  CheckCircle2,
  Lock,
  Truck,
  Store,
  ChevronLeft,
  ArrowRight,
  Terminal,
  UserCheck,
  Sparkles,
} from 'lucide-react';

export default function CheckoutPage() {
  const router = useRouter();
  const {
    cart,
    subtotal,
    discount,
    deliveryFee,
    tax,
    total,
    deliveryType,
    setDeliveryType,
    createOrder,
  } = useCart();

  const { user, isLoggedIn } = useAuth();

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [street, setStreet] = useState('');
  const [apt, setApt] = useState('');
  const [city, setCity] = useState('Tech City');
  const [orderNotes, setOrderNotes] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'UPI' | 'CARD' | 'NETBANKING' | 'COD'>('UPI');

  const [deploying, setDeploying] = useState(false);
  const [deployStep, setDeployStep] = useState(0);

  // Auto-fill from user profile if authenticated
  useEffect(() => {
    if (user) {
      if (user.name) setName(user.name);
      if (user.phone) setPhone(user.phone);
      if (user.email) setEmail(user.email);
      if (user.address?.street) setStreet(user.address.street);
      if (user.address?.city) setCity(user.address.city);
    }
  }, [user]);

  if (cart.length === 0 && !deploying) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-2xl font-bold text-white">No Items to Checkout</h2>
        <p className="text-sm text-zinc-400">Please populate your cart first.</p>
        <Link
          href="/menu"
          className="inline-block px-6 py-2.5 rounded-xl bg-amber-500 text-black font-bold text-xs font-mono"
        >
          GO TO MENU
        </Link>
      </div>
    );
  }

  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone || !email || (deliveryType === 'delivery' && !street)) {
      alert('Please fill in all required customer and address fields.');
      return;
    }

    setDeploying(true);

    const steps = [
      'Compiling order payload in memory...',
      'Verifying payment handshake with secure gateway...',
      'Allocating high-temperature clay tandoor threads...',
      'Deploying order to kitchen pipeline...',
    ];

    let current = 0;
    const interval = setInterval(() => {
      current++;
      setDeployStep(current);

      if (current >= steps.length) {
        clearInterval(interval);

        // Trigger confetti
        try {
          confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 },
          });
        } catch {}

        const addressCombined =
          deliveryType === 'delivery'
            ? `${street}, ${apt ? apt + ', ' : ''}${city}`
            : 'PICKUP AT RESTAURANT COUNTER (404 Kernel Way)';

        const newOrder = createOrder({
          customerName: name,
          phone,
          email,
          address: addressCombined,
          deliveryType,
          paymentMethod,
          paymentStatus: paymentMethod === 'COD' ? 'PENDING' : 'PAID',
          orderNotes,
          items: cart,
          subtotal,
          tax,
          deliveryFee,
          discount,
          total,
          estimatedDeliveryTime: '30-40 mins',
        });

        setTimeout(() => {
          router.push(`/track-order?id=${newOrder.id}`);
        }, 1000);
      }
    }, 700);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Back button */}
      <div>
        <Link
          href="/cart"
          className="inline-flex items-center gap-1.5 text-xs font-mono text-zinc-400 hover:text-amber-400 mb-2 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>RETURN_TO_CART</span>
        </Link>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white">
          Deploy Your Feast (Checkout)
        </h1>
      </div>

      {deploying ? (
        /* Deployment Animation Overlay */
        <div className="max-w-2xl mx-auto py-16 px-6 rounded-3xl bg-[#09090e] border border-amber-500/50 shadow-2xl text-center space-y-6">
          <div className="w-16 h-16 mx-auto rounded-full bg-amber-500/10 border border-amber-500 flex items-center justify-center text-amber-400 animate-spin">
            <Terminal className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <div className="font-mono text-xs text-amber-400 font-bold uppercase tracking-wider">
              // CI_CD_KITCHEN_PIPELINE_ACTIVE
            </div>
            <h2 className="text-2xl font-bold text-white font-mono">
              &lt; INITIALIZING KITCHEN BUILD /&gt;
            </h2>
          </div>

          <div className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800 text-left font-mono text-xs space-y-2 max-w-lg mx-auto">
            <div className="text-emerald-400 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              <span>[STEP 1] Validated cryptographic order signature</span>
            </div>
            {deployStep >= 1 && (
              <div className="text-emerald-400 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                <span>[STEP 2] {paymentMethod} payment handshake 200 OK</span>
              </div>
            )}
            {deployStep >= 2 && (
              <div className="text-emerald-400 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                <span>[STEP 3] Locked fresh spices and tandoor cluster</span>
              </div>
            )}
            {deployStep >= 3 && (
              <div className="text-amber-400 flex items-center gap-2 animate-pulse">
                <CheckCircle2 className="w-4 h-4" />
                <span>[STEP 4] Build successful! Redirecting to tracker...</span>
              </div>
            )}
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmitOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Form: Details, Address, Payment */}
          <div className="lg:col-span-8 space-y-6">
            {/* Auth Status Notification */}
            {isLoggedIn && user ? (
              <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between gap-3 text-xs font-mono">
                <div className="flex items-center gap-2 text-amber-400">
                  <UserCheck className="w-4 h-4 shrink-0" />
                  <span>
                    Authenticated as <strong>{user.name}</strong> ({user.tier} • {user.points} pts)
                  </span>
                </div>
                <span className="text-[10px] text-zinc-400 hidden sm:inline">Address Auto-populated</span>
              </div>
            ) : (
              <div className="p-3.5 rounded-2xl bg-zinc-900/90 border border-zinc-800 flex items-center justify-between gap-3 text-xs font-mono">
                <div className="text-zinc-400">
                  Ordering as <strong className="text-white">Guest</strong>. Want to save this address?
                </div>
                <Link
                  href="/login?redirect=/checkout"
                  className="px-3 py-1 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-400 border border-amber-500/40 text-[11px] font-bold transition-colors"
                >
                  Sign In →
                </Link>
              </div>
            )}

            {/* Step 1: Contact Details */}
            <div className="p-6 rounded-2xl bg-[#0e0e13] border border-zinc-800 space-y-4">
              <div className="flex items-center gap-2 text-amber-400 font-mono text-xs font-bold uppercase">
                <span className="w-5 h-5 rounded-full bg-amber-500/20 border border-amber-500 flex items-center justify-center text-[10px]">
                  1
                </span>
                <span>CUSTOMER PROFILE IDENTIFIERS</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-mono text-zinc-400">Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Linus Torvalds"
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
                    placeholder="+1 (555) 019-2834"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-sm text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div className="sm:col-span-2 space-y-1.5">
                  <label className="text-xs font-mono text-zinc-400">Email Address (for order receipts & build logs) *</label>
                  <input
                    type="email"
                    required
                    placeholder="dev@domain.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-sm text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>
            </div>

            {/* Step 2: Delivery vs Pickup & Address */}
            <div className="p-6 rounded-2xl bg-[#0e0e13] border border-zinc-800 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-amber-400 font-mono text-xs font-bold uppercase">
                  <span className="w-5 h-5 rounded-full bg-amber-500/20 border border-amber-500 flex items-center justify-center text-[10px]">
                    2
                  </span>
                  <span>DISPATCH METHOD & DESTINATION</span>
                </div>

                <div className="flex items-center p-1 bg-zinc-950 border border-zinc-800 rounded-xl text-xs font-mono">
                  <button
                    type="button"
                    onClick={() => setDeliveryType('delivery')}
                    className={`px-3 py-1 rounded-lg transition-all ${
                      deliveryType === 'delivery'
                        ? 'bg-amber-500 text-black font-bold'
                        : 'text-zinc-400'
                    }`}
                  >
                    Delivery
                  </button>
                  <button
                    type="button"
                    onClick={() => setDeliveryType('pickup')}
                    className={`px-3 py-1 rounded-lg transition-all ${
                      deliveryType === 'pickup'
                        ? 'bg-amber-500 text-black font-bold'
                        : 'text-zinc-400'
                    }`}
                  >
                    Pickup
                  </button>
                </div>
              </div>

              {deliveryType === 'delivery' ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div className="sm:col-span-2 space-y-1.5">
                    <label className="text-xs font-mono text-zinc-400">Street Address *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. 777 Hacker Way, Apt 404"
                      value={street}
                      onChange={(e) => setStreet(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-sm text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-mono text-zinc-400">Building / Suite / Gate Code</label>
                    <input
                      type="text"
                      placeholder="Suite 204, Code: #9942"
                      value={apt}
                      onChange={(e) => setApt(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-sm text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-mono text-zinc-400">City / District</label>
                    <input
                      type="text"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-sm text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>
              ) : (
                <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 text-xs font-mono space-y-1">
                  <div className="text-amber-400 font-bold">PICKUP LOCATION:</div>
                  <div className="text-white">NON VEG 404 — 404 Kernel Way, Silicon Grill District, CA</div>
                  <div className="text-zinc-500">Ready in approx 20-25 mins from submission.</div>
                </div>
              )}
            </div>

            {/* Step 3: Payment Method */}
            <div className="p-6 rounded-2xl bg-[#0e0e13] border border-zinc-800 space-y-4">
              <div className="flex items-center gap-2 text-amber-400 font-mono text-xs font-bold uppercase">
                <span className="w-5 h-5 rounded-full bg-amber-500/20 border border-amber-500 flex items-center justify-center text-[10px]">
                  3
                </span>
                <span>PAYMENT PROTOCOL HANDSHAKE</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { id: 'UPI', label: 'UPI / QR Pay', icon: QrCode },
                  { id: 'CARD', label: 'Credit / Debit', icon: CreditCard },
                  { id: 'NETBANKING', label: 'NetBanking', icon: Building },
                  { id: 'COD', label: 'Cash / COD', icon: Banknote },
                ].map((item) => {
                  const isSelected = paymentMethod === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setPaymentMethod(item.id as any)}
                      className={`p-4 rounded-2xl border text-center flex flex-col items-center justify-center space-y-2 transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-amber-500/10 border-amber-500 text-white shadow-lg shadow-amber-500/10'
                          : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:border-zinc-700'
                      }`}
                    >
                      <item.icon className={`w-5 h-5 ${isSelected ? 'text-amber-400' : 'text-zinc-500'}`} />
                      <span className="text-xs font-mono font-medium">{item.label}</span>
                    </button>
                  );
                })}
              </div>

              <div className="flex items-center gap-2 text-xs font-mono text-zinc-500 pt-2">
                <Lock className="w-3.5 h-3.5 text-emerald-400" />
                <span>256-bit End-to-End Encrypted Checkout Pipe</span>
              </div>
            </div>

            {/* Step 4: Order Notes */}
            <div className="p-6 rounded-2xl bg-[#0e0e13] border border-zinc-800 space-y-3">
              <label className="text-xs font-mono text-amber-400 font-bold uppercase flex items-center justify-between">
                <span>ORDER NOTES & CHEF INSTRUCTIONS</span>
                <span className="text-zinc-600">// optional</span>
              </label>
              <textarea
                rows={2}
                placeholder="e.g. Ring the bell twice. Extra mint chutney. Delivery instructions for guard..."
                value={orderNotes}
                onChange={(e) => setOrderNotes(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-amber-500 font-sans"
              />
            </div>
          </div>

          {/* Right Summary Column */}
          <div className="lg:col-span-4 space-y-6 sticky top-28">
            <div className="p-6 rounded-2xl bg-[#0e0e13] border border-zinc-800 space-y-4 shadow-2xl">
              <h3 className="text-base font-bold text-white font-mono border-b border-zinc-800 pb-3 flex items-center justify-between">
                <span>Build Payload Summary</span>
                <span className="text-xs text-amber-400">{cart.length} unique items</span>
              </h3>

              {/* Items summary */}
              <div className="max-h-56 overflow-y-auto space-y-2 pr-1 text-xs">
                {cart.map((item) => (
                  <div key={item.cartItemId} className="flex justify-between items-start text-zinc-300">
                    <span className="truncate pr-2">
                      {item.quantity}x {item.foodItem.name}
                    </span>
                    <span className="font-mono shrink-0">
                      ₹{((item.foodItem.price + item.selectedAddOns.reduce((s, a) => s + a.price, 0)) * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Totals */}
              <div className="pt-3 border-t border-zinc-800 space-y-2 text-xs">
                <div className="flex justify-between text-zinc-400">
                  <span>Subtotal</span>
                  <span className="font-mono text-white">₹{subtotal.toFixed(2)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-emerald-400">
                    <span>Discount</span>
                    <span className="font-mono">-₹{discount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between text-zinc-400">
                  <span>Dispatch ({deliveryType})</span>
                  <span className="font-mono text-white">
                    {deliveryFee === 0 ? 'FREE' : `₹${deliveryFee.toFixed(2)}`}
                  </span>
                </div>
                <div className="flex justify-between text-zinc-400">
                  <span>Taxes (5%)</span>
                  <span className="font-mono text-white">₹{tax.toFixed(2)}</span>
                </div>
                <div className="pt-2 border-t border-zinc-800 flex justify-between items-center text-sm font-bold">
                  <span className="text-white">Amount Due</span>
                  <span className="text-2xl font-mono text-amber-400">
                    ₹{total.toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                className="w-full py-4 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-black font-extrabold text-sm tracking-wide shadow-xl shadow-amber-500/25 transition-all flex items-center justify-center gap-2 group cursor-pointer"
              >
                <span>DEPLOY ORDER (PAY ₹{total.toFixed(2)})</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <div className="text-[11px] font-mono text-zinc-400 text-center">
                // Executes instant kitchen pipeline thread.
              </div>
            </div>
          </div>
        </form>
      )}
    </div>
  );
}
