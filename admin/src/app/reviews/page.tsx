'use client';

import React, { useState, useEffect } from 'react';
import {
  Star,
  GitCommit,
  CheckCircle2,
  Trash2,
  Sparkles,
} from 'lucide-react';
import { INITIAL_REVIEWS } from '@/data/mockAdminData';
import { Review } from '@/types/admin';
import { adminApi } from '@/lib/api';

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>(INITIAL_REVIEWS);

  const fetchReviews = async () => {
    try {
      const res = await adminApi.reviews.getAll();
      if (res.success && res.reviews.length > 0) {
        setReviews(res.reviews);
      }
    } catch {
      // Keep initial dataset
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const toggleFeatured = async (id: string) => {
    const target = reviews.find((r) => r.id === id);
    const newFeatured = target ? !target.featured : false;
    setReviews((prev) =>
      prev.map((r) => (r.id === id ? { ...r, featured: newFeatured } : r))
    );
    try {
      await adminApi.reviews.feature(id, newFeatured);
    } catch (err: any) {
      console.warn('Backend toggle feature error:', err.message);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Delete review?')) {
      setReviews((prev) => prev.filter((r) => r.id !== id));
      try {
        await adminApi.reviews.delete(id);
      } catch (err: any) {
        console.warn('Backend delete review error:', err.message);
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-800">
        <div>
          <h1 className="text-2xl font-bold text-white font-sans">
            Peer Reviews & Commits Moderation
          </h1>
          <p className="text-xs font-mono text-zinc-400">
            Audit customer feedback, star ratings, and toggle featured homepage testimonials.
          </p>
        </div>

        <span className="px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 font-mono text-xs font-bold">
          {reviews.length} Verified Reviews
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {reviews.map((rev) => (
          <div
            key={rev.id}
            className="p-5 rounded-2xl bg-[#0e0e13] border border-zinc-800 hover:border-zinc-700 transition-all flex flex-col justify-between space-y-4 shadow-xl"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center text-amber-400 text-sm">
                  {Array.from({ length: rev.rating }).map((_, i) => (
                    <span key={i}>★</span>
                  ))}
                </div>
                <span className="text-xs font-mono text-zinc-500">{rev.date}</span>
              </div>

              <p className="text-xs text-zinc-300 italic leading-relaxed">
                &ldquo;{rev.comment}&rdquo;
              </p>

              <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-900 space-y-1 font-mono text-[11px]">
                <div className="text-amber-400/90 font-bold">{rev.dishOrdered}</div>
                <div className="text-zinc-500 truncate">// {rev.commitHash}</div>
              </div>
            </div>

            <div className="pt-3 border-t border-zinc-800 flex items-center justify-between text-xs font-mono">
              <div>
                <span className="text-white font-bold block">{rev.author}</span>
                <span className="text-[10px] text-zinc-500">{rev.role}</span>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => toggleFeatured(rev.id)}
                  className={`px-2.5 py-1 rounded text-[11px] font-bold transition-colors ${
                    rev.featured
                      ? 'bg-amber-500 text-black'
                      : 'bg-zinc-900 text-zinc-400 hover:text-white'
                  }`}
                >
                  {rev.featured ? 'Featured' : 'Feature'}
                </button>
                <button
                  onClick={() => handleDelete(rev.id)}
                  className="p-1 rounded bg-zinc-900 hover:bg-red-950 text-zinc-500 hover:text-red-400"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
