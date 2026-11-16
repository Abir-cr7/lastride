import React from 'react';
import { ShieldAlert, PhoneCall, Radio, Flame, Heart } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Footer = () => {
  const { openLoginModal } = useAuth();

  return (
    <footer className="w-full bg-[#05070C] border-t border-white/10 pt-16 pb-12 relative overflow-hidden">
      {/* Background Neon Accent Glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-96 h-32 bg-amber-500/5 blur-3xl rounded-full pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-white/10">
          
          {/* Col 1: Brand */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500/20 to-cyan-500/10 border border-amber-500/40 text-amber-400">
                <ShieldAlert className="w-5 h-5" />
              </div>
              <span className="text-xl font-black tracking-wider uppercase text-white font-mono">
                RIDER<span className="text-amber-400">RESCUE</span>
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Ashulia & Dhaka's premier on-demand motorcycle rescue network. Real-time highway telemetry,
              verified mobile mechanics, and high-octane fuel dispatch.
            </p>
            <div className="flex items-center gap-2 text-[11px] font-mono text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              24/7 Patrol Network Active
            </div>
          </div>

          {/* Col 2: Rapid Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
              Emergency Corridors
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li className="hover:text-amber-400 cursor-pointer transition-colors">Baipail Bypass Hub</li>
              <li className="hover:text-amber-400 cursor-pointer transition-colors">Nabinagar Savar Point</li>
              <li className="hover:text-amber-400 cursor-pointer transition-colors">Uttara Expressway Sector 11</li>
              <li className="hover:text-amber-400 cursor-pointer transition-colors">Mirpur 10 Roundabout Unit</li>
            </ul>
          </div>

          {/* Col 3: Direct Helplines */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
              Direct Sat-Lines
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li className="flex items-center gap-2">
                <PhoneCall className="w-3.5 h-3.5 text-crimson-400" />
                <span className="text-white font-mono font-bold">999</span> (Police / Fire / Ambulance)
              </li>
              <li className="flex items-center gap-2">
                <PhoneCall className="w-3.5 h-3.5 text-amber-400" />
                <span className="text-white font-mono font-bold">16163</span> (Fire Civil Defense)
              </li>
              <li className="flex items-center gap-2">
                <PhoneCall className="w-3.5 h-3.5 text-cyan-400" />
                <span className="text-white font-mono font-bold">01714-010869</span> (Quantum Blood Lab)
              </li>
            </ul>
          </div>

          {/* Col 4: Operations & Admin Access */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
              Operations
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Centralized telemetry and patrol coordination center for authorized operators.
            </p>
            <button
              onClick={() => openLoginModal('admin')}
              className="mt-2 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-mono text-cyan-300 hover:text-cyan-200 transition-all flex items-center gap-2"
            >
              <span>Operator Terminal Login</span>
              <span>→</span>
            </button>
          </div>

        </div>

        {/* Bottom copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 font-mono">
          <p>© {new Date().getFullYear()} Rider Rescue Platform. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <span>Ashulia / Dhaka Operations</span>
            <span>•</span>
            <span>256-Bit SSL Encrypted</span>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
