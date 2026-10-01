'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/context/CartContext';
import {
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  Sparkles,
  Tag,
  CheckCircle,
  Truck,
  Store,
  ChevronLeft,
  X,
} from 'lucide-react';

export default function CartPage() {
  const {
    cart,
    removeFromCart,
    updateQuantity,
    subtotal,
    discount,
    deliveryFee,
    tax,
    total,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
    deliveryType,
    setDeliveryType,
    settings,
  } = useCart();

  const [couponInput, setCouponInput] = useState('');
  const [couponMsg, setCouponMsg] = useState<{ text: string; error: boolean } | null>(null);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    const res = applyCoupon(couponInput);
    setCouponMsg({ text: res.message, error: !res.success });
    if (res.success) {
      setCouponInput('');
    }
  };

  const amountNeededForFreeDelivery = Math.max(
    0,
    settings.freeDeliveryThreshold - subtotal
  );

  if (cart.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-6">
        <div className="w-20 h-20 mx-auto rounded-3xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-amber-500 shadow-xl">
          <ShoppingBag className="w-10 h-10" />
        </div>
        <div className="font-mono text-amber-400 text-sm font-bold">
          // ERROR_404: STOMACH_IS_EMPTY
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white">
          Your Build Queue is Empty
        </h1>
        <p className="text-zinc-400 max-w-md mx-auto text-sm leading-relaxed">
          No succulent chicken, slow-cooked biryani, or tender kebabs staged in memory.
          Initialize your order from our production menu.
        </p>
        <div className="pt-2">
          <Link
            href="/menu"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-extrabold text-sm transition-all shadow-lg shadow-amber-500/20"
          >
            <Sparkles className="w-4 h-4 fill-black" />
            <span>EXPLORE MENU & POPULATE CART</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-zinc-800">
        <div>
          <Link
            href="/menu"
            className="inline-flex items-center gap-1.5 text-xs font-mono text-zinc-400 hover:text-amber-400 mb-2 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>CONTINUE_ADDING_ITEMS</span>
          </Link>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white">
            Your Feast Build Queue ({cart.reduce((s, i) => s + i.quantity, 0)} items)
          </h1>
        </div>

        {/* Delivery / Pickup Switcher */}
        <div className="flex items-center p-1 bg-zinc-950 border border-zinc-800 rounded-xl">
          <button
            type="button"
            onClick={() => setDeliveryType('delivery')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${deliveryType === 'delivery'
              ? 'bg-amber-500 text-black shadow-md'
              : 'text-zinc-400 hover:text-white'
              }`}
          >
            <Truck className="w-4 h-4" />
            <span>DELIVERY</span>
          </button>
          <button
            type="button"
            onClick={() => setDeliveryType('pickup')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${deliveryType === 'pickup'
              ? 'bg-amber-500 text-black shadow-md'
              : 'text-zinc-400 hover:text-white'
              }`}
          >
            <Store className="w-4 h-4" />
            <span>TAKEAWAY / PICKUP</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Cart Items List */}
        <div className="lg:col-span-8 space-y-4">
          {/* Free Delivery Bar */}
          {deliveryType === 'delivery' && (
            <div className="p-4 rounded-2xl bg-[#0f0f15] border border-zinc-800 space-y-2">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-zinc-300">
                  {amountNeededForFreeDelivery === 0 ? (
                    <span className="text-emerald-400 font-bold flex items-center gap-1.5">
                      <CheckCircle className="w-4 h-4 text-emerald-400" />
                      ELIGIBLE FOR FREE SHIPPING DISPATCH!
                    </span>
                  ) : (
                    <span>
                      Add <strong className="text-amber-400">₹{amountNeededForFreeDelivery.toFixed(2)}</strong> more for FREE delivery
                    </span>
                  )}
                </span>
                <span className="text-zinc-500">Goal: ₹{settings.freeDeliveryThreshold}</span>
              </div>

              {/* Progress bar */}
              <div className="w-full h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-amber-500 to-emerald-400 transition-all duration-500"
                  style={{
                    width: `${Math.min(
                      100,
                      (subtotal / settings.freeDeliveryThreshold) * 100
                    )}%`,
                  }}
                />
              </div>
            </div>
          )}

          {/* Cart Item Cards */}
          <div className="space-y-3">
            {cart.map((item) => {
              const addonTotal = item.selectedAddOns.reduce((sum, a) => sum + a.price, 0);
              const itemTotal = (item.foodItem.price + addonTotal) * item.quantity;

              return (
                <div
                  key={item.cartItemId}
                  className="p-4 sm:p-5 rounded-2xl bg-[#0e0e13] border border-zinc-800/90 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  {/* Food Info */}
                  <div className="flex items-start gap-3 sm:gap-4">
                    <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden bg-zinc-950 shrink-0 border border-zinc-800">
                      <Image
                        src={item.foodItem.image}
                        alt={item.foodItem.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="space-y-1 min-w-0">
                      <h3 className="text-sm sm:text-base font-bold text-white truncate">
                        {item.foodItem.name}
                      </h3>
                      <div className="text-xs font-mono text-amber-400">
                        ₹{item.foodItem.price.toFixed(2)} each
                      </div>

                      {/* Selected add-ons */}
                      {item.selectedAddOns.length > 0 && (
                        <div className="text-xs text-zinc-400 flex flex-wrap gap-1 mt-1">
                          {item.selectedAddOns.map((addon) => (
                            <span
                              key={addon.id}
                              className="px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-[10px] sm:text-[11px] text-zinc-300"
                            >
                              +{addon.name} (₹{addon.price.toFixed(2)})
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Notes */}
                      {item.specialNotes && (
                        <div className="text-[10px] sm:text-[11px] text-zinc-500 italic">
                          Note: {item.specialNotes}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Quantity Stepper & Price */}
                  <div className="flex items-center justify-between sm:justify-end gap-3 sm:gap-6 pt-3 sm:pt-0 border-t sm:border-t-0 border-zinc-800/80">
                    <div className="flex items-center bg-zinc-950 border border-zinc-800 rounded-xl p-0.5 sm:p-1">
                      <button
                        onClick={() => updateQuantity(item.cartItemId, item.quantity - 1)}
                        className="p-1 sm:p-1.5 text-zinc-400 hover:text-white transition-colors cursor-pointer"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="w-7 sm:w-8 text-center font-mono font-bold text-white text-xs">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.cartItemId, item.quantity + 1)}
                        className="p-1 sm:p-1.5 text-zinc-400 hover:text-white transition-colors cursor-pointer"
                        aria-label="Increase quantity"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="text-right min-w-[70px]">
                      <div className="text-base font-mono font-bold text-white">
                        ₹{itemTotal.toFixed(2)}
                      </div>
                    </div>

                    <button
                      onClick={() => removeFromCart(item.cartItemId)}
                      className="p-2 text-zinc-500 hover:text-red-400 transition-colors"
                      title="Remove item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Order Summary & Checkout */}
        <div className="lg:col-span-4 space-y-6">
          {/* Promo Code Box */}
          <div className="p-5 rounded-2xl bg-[#0e0e13] border border-zinc-800 space-y-3">
            <h4 className="text-xs uppercase font-mono tracking-wider text-amber-400 font-bold flex items-center gap-1.5">
              <Tag className="w-3.5 h-3.5" />
              <span>SUDO PROMO CODE</span>
            </h4>

            {appliedCoupon ? (
              <div className="flex items-center justify-between p-3 rounded-xl bg-amber-500/10 border border-amber-500/40">
                <div>
                  <div className="font-mono text-xs font-bold text-amber-400">
                    {appliedCoupon.code} APPLIED
                  </div>
                  <div className="text-[11px] text-zinc-400">
                    Saved ₹{discount.toFixed(2)}
                  </div>
                </div>
                <button
                  onClick={removeCoupon}
                  className="p-1 text-zinc-400 hover:text-red-400"
                  title="Remove coupon"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <form onSubmit={handleApplyCoupon} className="space-y-2">
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    placeholder="e.g. SUDO_50"
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value)}
                    className="flex-1 px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-xs font-mono text-white uppercase placeholder-zinc-600 focus:outline-none focus:border-amber-500"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-zinc-800 hover:bg-amber-500 hover:text-black text-white font-mono text-xs font-bold transition-all cursor-pointer"
                  >
                    APPLY
                  </button>
                </div>
                {couponMsg && (
                  <p
                    className={`text-[11px] font-mono ${couponMsg.error ? 'text-red-400' : 'text-emerald-400'
                      }`}
                  >
                    {couponMsg.text}
                  </p>
                )}
                <div className="text-[11px] text-zinc-400">
                  Tip: Try <span className="text-amber-400 cursor-pointer font-mono" onClick={() => setCouponInput('SUDO_50')}>SUDO_50</span> for 20% off or <span className="text-amber-400 cursor-pointer font-mono" onClick={() => setCouponInput('FREE_DEPLOY')}>FREE_DEPLOY</span>.
                </div>
              </form>
            )}
          </div>

          {/* Pricing Breakdown */}
          <div className="p-6 rounded-2xl bg-[#0e0e13] border border-zinc-800 space-y-4">
            <h3 className="text-base font-bold text-white font-mono border-b border-zinc-800 pb-3">
              Order Computation
            </h3>

            <div className="space-y-2.5 text-sm">
              <div className="flex items-center justify-between text-zinc-400">
                <span>Subtotal</span>
                <span className="font-mono text-white">₹{subtotal.toFixed(2)}</span>
              </div>

              {discount > 0 && (
                <div className="flex items-center justify-between text-emerald-400">
                  <span>Sudo Discount</span>
                  <span className="font-mono">-₹{discount.toFixed(2)}</span>
                </div>
              )}

              <div className="flex items-center justify-between text-zinc-400">
                <span>Dispatch Fee ({deliveryType})</span>
                <span className="font-mono text-white">
                  {deliveryFee === 0 ? (
                    <span className="text-emerald-400 font-bold">FREE</span>
                  ) : (
                    `₹${deliveryFee.toFixed(2)}`
                  )}
                </span>
              </div>

              <div className="flex items-center justify-between text-zinc-400">
                <span>Est. Taxes (5%)</span>
                <span className="font-mono text-white">₹{tax.toFixed(2)}</span>
              </div>

              <div className="pt-3 border-t border-zinc-800 flex items-center justify-between text-lg font-bold">
                <span className="text-white">Total Amount</span>
                <span className="text-2xl font-mono text-amber-400">
                  ₹{total.toFixed(2)}
                </span>
              </div>
            </div>

            <Link
              href="/checkout"
              className="w-full py-4 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-black font-extrabold text-sm tracking-wide shadow-xl shadow-amber-500/20 hover:shadow-amber-500/30 transition-all flex items-center justify-center gap-2 group cursor-pointer"
            >
              <span>PROCEED TO CHECKOUT</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>

            <p className="text-[11px] font-mono text-zinc-400 text-center">
              // Instant dispatch queue. Zero packet loss guaranteed.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
