import React, { useState } from 'react';
import {
  PhoneCall,
  ShieldAlert,
  Flame,
  HeartPulse,
  LifeBuoy,
  Copy,
  Check,
  ExternalLink,
} from 'lucide-react';
import { motion } from 'framer-motion';

const EmergencyHelplines = () => {
  const [copiedIndex, setCopiedIndex] = useState(null);

  const helplines = [
    {
      title: 'National Emergency & Police',
      number: '999',
      altNumber: '01320-000999',
      category: 'Police & Security',
      description: 'Rapid response police escort, crime intervention, and accident reporting.',
      icon: ShieldAlert,
      accentColor: 'crimson',
      pulseSpeed: 'animate-radar-fast',
    },
    {
      title: 'Fire Service & Civil Defense',
      number: '16163',
      altNumber: '999',
      category: 'Highway Fire & Crash Rescue',
      description: 'Heavy collision extraction, fuel leakage hazmat, and highway crash rescue.',
      icon: Flame,
      accentColor: 'amber',
      pulseSpeed: 'animate-radar-slow',
    },
    {
      title: 'Rider Rescue Emergency Squad',
      number: '+8801700000000',
      altNumber: '999',
      category: '24/7 Mobile Mechanic & Tow',
      description: 'Flat tires, engine failure, battery jumpstart, and flatbed motorcycle towing.',
      icon: LifeBuoy,
      accentColor: 'cyan',
      pulseSpeed: 'animate-radar-fast',
    },
    {
      title: 'Emergency Blood Bank Network',
      number: '01714010869',
      altNumber: '+8801711000000',
      category: 'Quantum & Red Crescent Lab',
      description: 'Immediate rare blood group dispatch for road trauma surgeries.',
      icon: HeartPulse,
      accentColor: 'crimson',
      pulseSpeed: 'animate-radar-slow',
    },
  ];

  const handleCopy = (num, idx, e) => {
    e.preventDefault();
    e.stopPropagation();
    navigator.clipboard.writeText(num);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const getColors = (accent) => {
    switch (accent) {
      case 'amber':
        return {
          border: 'border-amber-500/30 hover:border-amber-500/60',
          badge: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
          radar: 'bg-amber-500',
          btn: 'bg-amber-500 hover:bg-amber-400 text-slate-950',
          iconBg: 'bg-amber-500/20 text-amber-400 border-amber-500/40',
        };
      case 'cyan':
        return {
          border: 'border-cyan-500/30 hover:border-cyan-500/60',
          badge: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30',
          radar: 'bg-cyan-500',
          btn: 'bg-cyan-500 hover:bg-cyan-400 text-slate-950',
          iconBg: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/40',
        };
      default:
        return {
          border: 'border-crimson-500/30 hover:border-crimson-500/60',
          badge: 'bg-crimson-500/20 text-crimson-300 border-crimson-500/30',
          radar: 'bg-crimson-500',
          btn: 'bg-crimson-600 hover:bg-crimson-500 text-white',
          iconBg: 'bg-crimson-500/20 text-crimson-400 border-crimson-500/40',
        };
    }
  };

  return (
    <div id="emergency-helplines" className="glass-card rounded-3xl p-6 sm:p-8 relative overflow-hidden border border-white/10 group hover:border-crimson-500/30 transition-all duration-300">
      {/* Background Crimson Nebula */}
      <div className="absolute top-0 right-0 w-72 h-72 bg-crimson-500/10 rounded-full blur-3xl pointer-events-none group-hover:bg-crimson-500/20 transition-all duration-500"></div>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div className="flex items-center gap-3">
          {/* Pulsing Radar Master Beacon */}
          <div className="relative flex items-center justify-center w-12 h-12 rounded-2xl bg-crimson-500/20 border border-crimson-500/40 text-crimson-400 shadow-[0_0_20px_rgba(239,68,68,0.4)]">
            <span className="absolute w-full h-full rounded-2xl bg-crimson-500/30 animate-ping opacity-75"></span>
            <PhoneCall className="w-6 h-6 relative z-10 animate-bounce" />
          </div>

          <div>
            <h3 className="text-xl font-black text-white uppercase tracking-wide flex items-center gap-2">
              Emergency Helplines Hub
              <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-crimson-500/20 text-crimson-400 border border-crimson-500/30">
                1-CLICK DIAL
              </span>
            </h3>
            <p className="text-xs text-slate-400">
              Direct satellite lines to national emergency, highway crash dispatch & blood labs
            </p>
          </div>
        </div>

        <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded-xl border border-emerald-500/20 w-fit flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          All 4 Helplines Active
        </span>
      </div>

      {/* Helplines Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {helplines.map((item, idx) => {
          const colors = getColors(item.accentColor);
          const Icon = item.icon;

          return (
            <motion.div
              key={idx}
              whileHover={{ y: -4, scale: 1.01 }}
              transition={{ duration: 0.2 }}
              className={`p-5 rounded-2xl bg-white/5 border ${colors.border} transition-all relative overflow-hidden flex flex-col justify-between`}
            >
              {/* Radar Wave Pulse in Corner */}
              <div className="absolute top-3 right-3 flex items-center justify-center w-8 h-8 pointer-events-none">
                <span className={`absolute w-6 h-6 rounded-full opacity-60 ${colors.radar} ${item.pulseSpeed}`}></span>
                <span className={`w-2.5 h-2.5 rounded-full ${colors.radar}`}></span>
              </div>

              <div>
                {/* Icon & Category */}
                <div className="flex items-center gap-2.5 mb-3">
                  <div className={`p-2 rounded-xl border ${colors.iconBg}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-md border ${colors.badge}`}>
                    {item.category}
                  </span>
                </div>

                {/* Title */}
                <h4 className="text-base font-bold text-white mb-1.5 leading-snug">
                  {item.title}
                </h4>

                {/* Description */}
                <p className="text-xs text-slate-300 leading-relaxed mb-4">
                  {item.description}
                </p>
              </div>

              {/* Number and Actions */}
              <div className="pt-3 border-t border-white/10 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-lg font-black text-white font-mono tracking-wider">
                    {item.number}
                  </span>
                  <button
                    onClick={(e) => handleCopy(item.number, idx, e)}
                    title="Copy phone number"
                    className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
                  >
                    {copiedIndex === idx ? (
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>

                <a
                  href={`tel:${item.number}`}
                  className={`w-full py-2.5 rounded-xl text-center font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg transition-all ${colors.btn}`}
                >
                  <PhoneCall className="w-3.5 h-3.5" />
                  <span>Call {item.number}</span>
                </a>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default EmergencyHelplines;
