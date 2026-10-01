import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  Terminal,
  Cpu,
  Flame,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  GitCommit,
  ArrowRight,
} from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-16">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 font-mono text-xs font-semibold">
          <Terminal className="w-3.5 h-3.5" />
          <span>ORIGIN_STORY_AND_PHILOSOPHY</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight">
          About NON VEG 404
        </h1>
        <p className="font-mono text-base text-amber-400 font-bold">
          // GOOD FOOD. NO BUGS. //
        </p>
        <p className="text-zinc-300 text-sm sm:text-base leading-relaxed">
          Founded at the intersection of late-night terminal sessions and an uncompromising passion
          for genuine, mouth-watering non-vegetarian gastronomy.
        </p>
      </div>

      {/* The 404 Concept Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
        <div className="lg:col-span-6 space-y-5">
          <div className="text-xs font-mono text-amber-400 uppercase tracking-widest font-semibold">
            THE_CORE_THESIS
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
            404 = Not Found. <br />
            <span className="text-amber-400">Except Here.</span>
          </h2>
          <p className="text-zinc-300 text-sm leading-relaxed">
            In web protocols, HTTP 404 indicates that the client was able to communicate with a given server,
            but the server could not find what was requested.
          </p>
          <p className="text-zinc-300 text-sm leading-relaxed">
            For years, software engineers pulled 14-hour debug shifts only to encounter soggy takeout,
            lukewarm pizza, and flavorless food. We asked a fundamental question:
          </p>
          <blockquote className="p-4 rounded-xl bg-zinc-950 border-l-4 border-amber-500 font-mono text-xs text-amber-300 italic">
            &ldquo;What if a restaurant operated with the rigor of a mission-critical distributed system?
            Where hunger is never &lsquo;not found&rsquo;, and every recipe is rigorously unit-tested?&rdquo;
          </blockquote>
          <p className="text-zinc-300 text-sm leading-relaxed">
            That is <strong className="text-white">NON VEG 404</strong>. The food is the hero.
            The coding identity is our mindset.
          </p>
        </div>

        <div className="lg:col-span-6">
          <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-zinc-900 via-[#0e0e14] to-black border border-amber-500/30 p-8 shadow-2xl">
            <div className="relative aspect-video w-full rounded-2xl overflow-hidden border border-zinc-800 mb-6">
              <Image
                src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1000&q=80"
                alt="NON VEG 404 Restaurant Kitchen"
                fill
                className="object-cover"
              />
            </div>

            <div className="font-mono text-xs space-y-2 text-zinc-300 bg-zinc-950/80 p-4 rounded-xl border border-zinc-800">
              <div className="text-amber-400 font-bold">// System Specifications:</div>
              <div>• Fuel Source: Natural Coconut Shell Charcoal (Zero chemical odor)</div>
              <div>• Thermal Range: 420°C - 480°C constant heat profile</div>
              <div>• Spices: 100% whole whole-leaf, freshly stone-ground daily</div>
              <div>• Bug Count: 0 (No artificial colorants, no frozen fillers)</div>
            </div>
          </div>
        </div>
      </div>

      {/* Tech Stack Comparison Table */}
      <div className="rounded-3xl bg-[#0e0e13] border border-zinc-800 p-8 sm:p-10 space-y-6">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <h3 className="text-2xl font-bold text-white font-mono">
            Gastronomy vs. Software Engineering
          </h3>
          <p className="text-xs text-zinc-400">
            How we translate developer principles into award-winning non-veg delicacies.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono border-collapse">
            <thead>
              <tr className="border-b border-zinc-800 text-amber-400">
                <th className="py-3 px-4">Software Engineering Principle</th>
                <th className="py-3 px-4">NON VEG 404 Kitchen Implementation</th>
                <th className="py-3 px-4 text-right">Resulting Benefit</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/80 text-zinc-300">
              <tr>
                <td className="py-3.5 px-4 font-bold text-white">Continuous Integration (CI)</td>
                <td className="py-3.5 px-4">Daily morning spice batches tested against calibrated flavor baselines</td>
                <td className="py-3.5 px-4 text-right text-emerald-400">Consistent taste across all orders</td>
              </tr>
              <tr>
                <td className="py-3.5 px-4 font-bold text-white">Zero Downtime Deployments</td>
                <td className="py-3.5 px-4">Parallel dual tandoor ovens and staggered dum biryani pots</td>
                <td className="py-3.5 px-4 text-right text-emerald-400">Never running out of hot biryani</td>
              </tr>
              <tr>
                <td className="py-3.5 px-4 font-bold text-white">Memory Safety</td>
                <td className="py-3.5 px-4">All-natural pure cow ghee, no stale fats or heavy greasy residues</td>
                <td className="py-3.5 px-4 text-right text-emerald-400">Zero sluggish food coma crashes</td>
              </tr>
              <tr>
                <td className="py-3.5 px-4 font-bold text-white">Low-Latency Transit</td>
                <td className="py-3.5 px-4">Double-walled thermal insulation boxes sealed at 80°C</td>
                <td className="py-3.5 px-4 text-right text-emerald-400">Steam rises when opening at your desk</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Leadership & Culinary Architects */}
      <div className="space-y-8">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <div className="text-xs font-mono text-amber-400 uppercase tracking-widest font-semibold">
            // CORE_MAINTAINERS
          </div>
          <h3 className="text-3xl font-extrabold text-white">
            The Culinary Architects
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              name: 'Chef Aryan Kulkarni',
              role: 'Lead Architect & Executive Chef',
              bio: 'Former senior backend developer turned master of slow-cooked Mughlai & Hyderabadi culinary arts. Has spent 12 years calibrating heat algorithms for dum cooking.',
              image: 'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&w=600&q=80',
            },
            {
              name: 'David Vance',
              role: 'DevOps Meat Smoker & Grill Master',
              bio: 'Barbecue enthusiast and Linux kernel contributor. Designed our proprietary 450°C charcoal tandoor airflow management system.',
              image: 'https://images.unsplash.com/photo-1583394293214-28ded15ee548?auto=format&fit=crop&w=600&q=80',
            },
            {
              name: 'Nisha Pillai',
              role: 'Frontend Flavor & Spice Calibration Designer',
              bio: 'Obsessed with UX and flavor balance. Ensures every chicken roll, marinade, and craft beverage delivers unforgettable sensory delight.',
              image: 'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?auto=format&fit=crop&w=600&q=80',
            },
          ].map((member, i) => (
            <div
              key={i}
              className="p-6 rounded-2xl bg-[#0e0e13] border border-zinc-800 space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="relative h-60 w-full rounded-xl overflow-hidden border border-zinc-800">
                  <Image
                    src={member.image}
                    alt={member.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <h4 className="text-lg font-bold text-white">{member.name}</h4>
                  <div className="text-xs font-mono text-amber-400 mt-0.5">{member.role}</div>
                </div>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  {member.bio}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Bottom */}
      <div className="text-center p-10 rounded-3xl bg-zinc-950 border border-amber-500/40 space-y-4">
        <h3 className="text-2xl font-bold text-white">Experience Our Food in Action</h3>
        <p className="text-zinc-400 text-sm max-w-lg mx-auto">
          Taste what happens when developers refuse to settle for ordinary food.
        </p>
        <div className="pt-2 flex justify-center gap-4">
          <Link
            href="/menu"
            className="px-6 py-3 rounded-xl bg-amber-500 text-black font-extrabold text-xs font-mono"
          >
            ORDER TODAY&apos;S SPECIALS
          </Link>
          <Link
            href="/reservations"
            className="px-6 py-3 rounded-xl bg-zinc-900 text-white font-bold text-xs font-mono border border-zinc-700"
          >
            BOOK A TABLE
          </Link>
        </div>
      </div>
    </div>
  );
}
