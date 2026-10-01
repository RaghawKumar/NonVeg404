'use client';

import React, { useState } from 'react';
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Terminal,
  Send,
  CheckCircle2,
  Activity,
  Zap,
} from 'lucide-react';

export default function ContactPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [payloadMode, setPayloadMode] = useState<'form' | 'json'>('form');

  const [submitted, setSubmitted] = useState(false);
  const [pingLatency, setPingLatency] = useState<number | null>(14);
  const [pinging, setPinging] = useState(false);

  const handleTestPing = () => {
    setPinging(true);
    setTimeout(() => {
      setPingLatency(Math.floor(8 + Math.random() * 15));
      setPinging(false);
    }, 400);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) {
      alert('Please fill out all required fields.');
      return;
    }
    setSubmitted(true);
    setTimeout(() => {
      setName('');
      setEmail('');
      setSubject('');
      setMessage('');
      setSubmitted(false);
    }, 4000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 font-mono text-xs font-semibold">
          <Terminal className="w-3.5 h-3.5" />
          <span>SOCKET_ENDPOINT_LISTENER</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight">
          Connect With The Kitchen
        </h1>
        <p className="text-zinc-400 text-sm sm:text-base leading-relaxed">
          Need catering for your next hackathon? Have feedback on our spice calibration?
          Dispatch a message directly to our culinary maintainers.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Form & Payload view */}
        <div className="lg:col-span-7 p-6 sm:p-8 rounded-3xl bg-[#0e0e13] border border-zinc-800 space-y-6 shadow-2xl">
          <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
            <h3 className="text-lg font-bold text-white font-mono flex items-center gap-2">
              <Send className="w-4 h-4 text-amber-500" />
              <span>POST /api/v1/messages/dispatch</span>
            </h3>

            {/* Mode switch */}
            <div className="flex items-center p-1 bg-zinc-950 border border-zinc-800 rounded-xl text-xs font-mono">
              <button
                type="button"
                onClick={() => setPayloadMode('form')}
                className={`px-3 py-1 rounded-lg transition-all ${
                  payloadMode === 'form' ? 'bg-amber-500 text-black font-bold' : 'text-zinc-400'
                }`}
              >
                Standard Form
              </button>
              <button
                type="button"
                onClick={() => setPayloadMode('json')}
                className={`px-3 py-1 rounded-lg transition-all ${
                  payloadMode === 'json' ? 'bg-amber-500 text-black font-bold' : 'text-zinc-400'
                }`}
              >
                Raw JSON
              </button>
            </div>
          </div>

          {submitted ? (
            <div className="py-12 text-center space-y-3">
              <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
              <div className="font-mono text-sm text-emerald-400 font-bold">
                HTTP/2 201 CREATED: Packet Received!
              </div>
              <p className="text-zinc-400 text-xs max-w-sm mx-auto">
                Thank you for your transmission. Our lead kitchen maintainer will reply via email shortly.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {payloadMode === 'form' ? (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-mono text-zinc-400">Name *</label>
                      <input
                        type="text"
                        required
                        placeholder="John Carmack"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-sm text-white focus:outline-none focus:border-amber-500"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-mono text-zinc-400">Email Address *</label>
                      <input
                        type="email"
                        required
                        placeholder="dev@gameengine.org"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-sm text-white focus:outline-none focus:border-amber-500"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-mono text-zinc-400">Subject / Category</label>
                    <select
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-sm text-white font-mono focus:outline-none focus:border-amber-500"
                    >
                      <option value="General Inquiry">General Inquiry / Dine-in</option>
                      <option value="Hackathon Catering">Corporate / Hackathon Catering</option>
                      <option value="Recipe Feedback">Spice Calibration Feedback</option>
                      <option value="Careers">Join Our Culinary Dev Team</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-mono text-zinc-400">Message Body *</label>
                    <textarea
                      rows={4}
                      required
                      placeholder="Write your transmission here..."
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-amber-500 font-sans"
                    />
                  </div>
                </>
              ) : (
                /* JSON Payload Visualizer */
                <div className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800 font-mono text-xs text-amber-300">
                  <pre>
{`{
  "sender": "${name || 'Your Name'}",
  "email": "${email || 'dev@domain.com'}",
  "endpoint": "${subject || 'General Inquiry'}",
  "body": "${message || 'Type your message...'}"
}`}
                  </pre>
                </div>
              )}

              <button
                type="submit"
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-black font-extrabold text-xs font-mono tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-amber-500/20"
              >
                <Zap className="w-4 h-4 fill-black" />
                <span>DISPATCH MESSAGE PAYLOAD</span>
              </button>
            </form>
          )}
        </div>

        {/* Right Column: Physical Coordinates & Server Ping Test */}
        <div className="lg:col-span-5 space-y-6">
          {/* Coordinates Card */}
          <div className="p-6 rounded-3xl bg-[#0e0e13] border border-zinc-800 space-y-5 shadow-xl">
            <h4 className="text-xs font-mono text-amber-400 font-bold uppercase tracking-wider flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              <span>PHYSICAL SERVER LOCATION</span>
            </h4>

            <div className="space-y-4 text-xs">
              <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 space-y-1">
                <div className="text-zinc-500 font-mono">STREET ADDRESS:</div>
                <div className="text-white font-bold text-sm">NON VEG 404 Restaurant</div>
                <div className="text-zinc-300">404 Kernel Way, Silicon Grill District, CA 94016</div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-800 space-y-1">
                  <div className="text-zinc-500 font-mono flex items-center gap-1">
                    <Phone className="w-3.5 h-3.5 text-amber-500" />
                    <span>HOTLINE:</span>
                  </div>
                  <div className="text-white font-mono font-bold">+1 (555) 404-MEAT</div>
                </div>

                <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-800 space-y-1">
                  <div className="text-zinc-500 font-mono flex items-center gap-1">
                    <Mail className="w-3.5 h-3.5 text-amber-500" />
                    <span>EMAIL:</span>
                  </div>
                  <div className="text-white font-mono truncate">terminal@nonveg404.dev</div>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 space-y-1">
                <div className="text-zinc-500 font-mono flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-amber-500" />
                  <span>KITCHEN TIMINGS:</span>
                </div>
                <div className="text-zinc-300">Monday - Sunday: 11:00 AM — 02:00 AM</div>
                <div className="text-amber-400 text-[11px] font-mono">Late Night Dev Shift Active Daily</div>
              </div>
            </div>
          </div>

          {/* Interactive Ping Tester */}
          <div className="p-5 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-3 font-mono text-xs">
            <div className="flex items-center justify-between">
              <span className="text-zinc-400 flex items-center gap-1.5">
                <Activity className="w-4 h-4 text-emerald-400" />
                <span>Health Ping:</span>
              </span>
              <button
                onClick={handleTestPing}
                disabled={pinging}
                className="px-2.5 py-1 rounded bg-zinc-800 hover:bg-zinc-700 text-amber-400 text-[11px] font-bold"
              >
                {pinging ? 'PINGING...' : 'PING SERVER'}
              </button>
            </div>

            <div className="p-3 rounded-xl bg-black border border-zinc-900 text-[11px] space-y-1">
              <div className="text-emerald-400">GET /api/v1/health -&gt; 200 OK</div>
              <div className="text-zinc-500">
                RTT Latency: <span className="text-white font-bold">{pingLatency}ms</span> | Clay Tandoor: <span className="text-amber-400">450°C STABLE</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
