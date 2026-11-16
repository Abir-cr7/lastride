import React from 'react';
import { motion } from 'framer-motion';
import { ShieldAlert, Fuel, Zap, ArrowRight, Radio, MapPin } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const HeroMotorcycle = ({ onOpenSos, onOpenFuelOrder }) => {
  const { isAuthenticated, openLoginModal } = useAuth();

  const handleAction = (type) => {
    if (!isAuthenticated) {
      openLoginModal('user');
      return;
    }
    if (type === 'sos') {
      if (onOpenSos) onOpenSos();
      else {
        const el = document.getElementById('emergency-helplines');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      if (onOpenFuelOrder) onOpenFuelOrder();
      else {
        const el = document.getElementById('fuel-rates');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <section className="relative overflow-hidden pt-8 pb-16 md:pt-14 md:pb-24 border-b border-white/5">
      {/* Background Cyber Gradients */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-amber-500/10 blur-[130px] rounded-full pointer-events-none"></div>
      <div className="absolute top-1/3 left-1/4 w-[400px] h-[300px] bg-cyan-500/10 blur-[120px] rounded-full pointer-events-none"></div>
      <div className="absolute bottom-10 right-1/4 w-[450px] h-[250px] bg-crimson-500/10 blur-[140px] rounded-full pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Top Live Status Pill */}
        <div className="flex justify-center mb-6">
          <motion.div
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-md shadow-[0_0_15px_rgba(245,158,11,0.15)]"
          >
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
            </span>
            <span className="text-xs font-semibold tracking-wider uppercase text-amber-300 font-mono">
              Live Highway Patrol Active
            </span>
            <span className="text-slate-500 text-xs">•</span>
            <span className="text-xs text-slate-300 flex items-center gap-1 font-medium">
              <MapPin className="w-3 h-3 text-cyan-400" /> Ashulia & Dhaka Hubs
            </span>
          </motion.div>
        </div>

        {/* Hero Title & Subtitle */}
        <div className="text-center max-w-4xl mx-auto mb-10">
          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight uppercase leading-[1.08]"
          >
            NIGHT OR DAY, RAIN OR SHINE <br />
            <span className="bg-gradient-to-r from-amber-400 via-amber-300 to-cyan-400 bg-clip-text text-transparent">
              HELP IS ONE TAP AWAY.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="mt-5 text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed"
          >
            Rapid roadside breakdown assistance, on-demand certified fuel dispatch, and 
            real-time highway telemetry for motorcycle riders navigating Dhaka and Ashulia.
          </motion.p>

          {/* Call-to-Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="mt-8 flex flex-wrap items-center justify-center gap-4"
          >
            <button
              onClick={() => handleAction('sos')}
              className="relative group px-7 py-3.5 rounded-2xl bg-gradient-to-r from-crimson-600 to-crimson-500 hover:from-crimson-500 hover:to-crimson-400 text-white font-bold text-sm tracking-wider uppercase shadow-[0_0_25px_rgba(239,68,68,0.5)] hover:shadow-[0_0_35px_rgba(239,68,68,0.7)] transition-all duration-300 flex items-center gap-2.5"
            >
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-white"></span>
              </span>
              <ShieldAlert className="w-5 h-5" />
              Emergency Rescue SOS
            </button>

            <button
              onClick={() => handleAction('fuel')}
              className="px-7 py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-sm tracking-wider uppercase shadow-[0_0_25px_rgba(245,158,11,0.4)] hover:shadow-[0_0_35px_rgba(245,158,11,0.6)] transition-all duration-300 flex items-center gap-2"
            >
              <Fuel className="w-5 h-5 text-slate-950" />
              Order Fuel Delivery
            </button>

            <button
              onClick={() => {
                const el = document.getElementById('live-hub');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              className="px-6 py-3.5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 text-slate-200 font-semibold text-sm tracking-wider transition-all duration-300 flex items-center gap-2 group"
            >
              <Radio className="w-4 h-4 text-cyan-400" />
              Explore Live Hub
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 group-hover:text-white transition-all" />
            </button>
          </motion.div>
        </div>

        {/* =========================================================================
            CUSTOM HIGH-SPEED MOTORCYCLE ANIMATION SCENE (SVG + FRAMER MOTION)
           ========================================================================= */}
        <div className="relative w-full max-w-5xl mx-auto mt-6 rounded-3xl bg-gradient-to-b from-[#0D121F]/90 to-[#080B12] border border-white/10 p-4 sm:p-8 shadow-2xl overflow-hidden">
          
          {/* Cyber Highway Backdrop Grid */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />

          {/* Fast Moving Neon Wind & Road Speed Lines */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {/* Speed Lines Set 1 (Amber & Cyan) */}
            {[
              { top: '18%', width: '180px', delay: 0, duration: 0.9, color: 'bg-cyan-400' },
              { top: '32%', width: '260px', delay: 0.3, duration: 0.7, color: 'bg-amber-400' },
              { top: '48%', width: '320px', delay: 0.15, duration: 0.85, color: 'bg-cyan-300' },
              { top: '65%', width: '220px', delay: 0.45, duration: 0.75, color: 'bg-amber-300' },
              { top: '78%', width: '380px', delay: 0.25, duration: 0.65, color: 'bg-cyan-400' },
              { top: '88%', width: '200px', delay: 0.55, duration: 0.8, color: 'bg-amber-400' },
            ].map((line, idx) => (
              <motion.div
                key={idx}
                initial={{ x: '100vw', opacity: 0 }}
                animate={{ x: '-100vw', opacity: [0, 0.9, 0] }}
                transition={{
                  repeat: Infinity,
                  duration: line.duration,
                  delay: line.delay,
                  ease: 'linear',
                }}
                style={{ top: line.top, width: line.width, height: '2px' }}
                className={`absolute rounded-full shadow-[0_0_8px_currentColor] ${line.color}`}
              />
            ))}
          </div>

          {/* Animated Motorcycle Stage Container */}
          <div className="relative h-[260px] sm:h-[340px] md:h-[400px] w-full flex items-center justify-center">
            
            {/* Headlight Volumetric Beam Glowing on Road */}
            <motion.div
              animate={{
                opacity: [0.65, 0.9, 0.65],
                scale: [1, 1.02, 1],
              }}
              transition={{ repeat: Infinity, duration: 1.8, ease: 'easeInOut' }}
              className="absolute left-[54%] top-[34%] w-[380px] sm:w-[500px] md:w-[650px] h-[140px] sm:h-[180px] md:h-[220px] pointer-events-none z-10"
              style={{
                background: 'radial-gradient(ellipse at left center, rgba(245, 158, 11, 0.45) 0%, rgba(6, 182, 212, 0.2) 45%, transparent 75%)',
                transform: 'rotate(-5deg)',
                transformOrigin: 'left center',
                filter: 'blur(10px)',
              }}
            />

            {/* Glowing Road Centerline with perspective */}
            <div className="absolute bottom-6 sm:bottom-10 left-0 right-0 h-16 pointer-events-none flex items-center overflow-hidden">
              <svg className="w-full h-8" preserveAspectRatio="none" viewBox="0 0 1000 30">
                <line
                  x1="0"
                  y1="15"
                  x2="1000"
                  y2="15"
                  stroke="#F59E0B"
                  strokeWidth="3"
                  strokeDasharray="40 30"
                  className="animate-road opacity-80"
                />
                <line
                  x1="0"
                  y1="25"
                  x2="1000"
                  y2="25"
                  stroke="#06B6D4"
                  strokeWidth="1.5"
                  strokeDasharray="20 40"
                  className="animate-road opacity-40"
                />
              </svg>
            </div>

            {/* MOTORCYCLE & RIDER SVG with Framer Motion Bounce */}
            <motion.div
              animate={{
                y: [0, -3.5, 1, -2.5, 0],
                rotate: [0, -0.6, 0.4, -0.3, 0],
              }}
              transition={{
                repeat: Infinity,
                duration: 1.4,
                ease: 'easeInOut',
              }}
              className="relative z-20 w-[300px] sm:w-[440px] md:w-[540px] h-auto drop-shadow-[0_15px_30px_rgba(0,0,0,0.9)]"
            >
              <svg
                viewBox="0 0 600 340"
                className="w-full h-full overflow-visible"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <defs>
                  {/* Wheel Hub Neon Glow Gradient */}
                  <linearGradient id="neonCyan" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#22D3EE" />
                    <stop offset="100%" stopColor="#0891B2" />
                  </linearGradient>

                  <linearGradient id="amberGlow" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#FBBF24" />
                    <stop offset="100%" stopColor="#D97706" />
                  </linearGradient>

                  <linearGradient id="metalBody" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#334155" />
                    <stop offset="50%" stopColor="#1E293B" />
                    <stop offset="100%" stopColor="#0F172A" />
                  </linearGradient>

                  <filter id="glowEffect" x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur stdDeviation="4" result="blur" />
                    <feComposite in="SourceGraphic" in2="blur" operator="over" />
                  </filter>
                </defs>

                {/* Ground Shadow under Bike */}
                <ellipse cx="300" cy="305" rx="220" ry="12" fill="rgba(0,0,0,0.7)" filter="url(#glowEffect)" />

                {/* --------------------
                    REAR WHEEL & TIRE
                    -------------------- */}
                <g transform="translate(130, 245)">
                  {/* Outer Tire */}
                  <circle cx="0" cy="0" r="54" stroke="#1E293B" strokeWidth="16" />
                  {/* Neon Cyan Rim Tape */}
                  <circle cx="0" cy="0" r="46" stroke="#06B6D4" strokeWidth="3" filter="url(#glowEffect)" />
                  {/* Inner Rim */}
                  <circle cx="0" cy="0" r="42" fill="#0F172A" stroke="#334155" strokeWidth="2" />
                  {/* Brake Rotor */}
                  <circle cx="0" cy="0" r="28" stroke="#64748B" strokeWidth="3" strokeDasharray="6 4" />
                  {/* Center Hub */}
                  <circle cx="0" cy="0" r="14" fill="#080B12" stroke="#F59E0B" strokeWidth="3" />

                  {/* Spinning Spokes (Framer Motion Rotate) */}
                  <motion.g
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 0.35, ease: 'linear' }}
                  >
                    <line x1="0" y1="-42" x2="0" y2="42" stroke="#22D3EE" strokeWidth="3" />
                    <line x1="-42" y1="0" x2="42" y2="0" stroke="#22D3EE" strokeWidth="3" />
                    <line x1="-30" y1="-30" x2="30" y2="30" stroke="#F59E0B" strokeWidth="2" />
                    <line x1="-30" y1="30" x2="30" y2="-30" stroke="#F59E0B" strokeWidth="2" />
                  </motion.g>
                </g>

                {/* --------------------
                    FRONT WHEEL & TIRE
                    -------------------- */}
                <g transform="translate(450, 245)">
                  {/* Outer Tire */}
                  <circle cx="0" cy="0" r="54" stroke="#1E293B" strokeWidth="16" />
                  {/* Neon Cyan Rim Tape */}
                  <circle cx="0" cy="0" r="46" stroke="#06B6D4" strokeWidth="3" filter="url(#glowEffect)" />
                  {/* Inner Rim */}
                  <circle cx="0" cy="0" r="42" fill="#0F172A" stroke="#334155" strokeWidth="2" />
                  {/* Big Dual Disc Brake */}
                  <circle cx="0" cy="0" r="32" stroke="#94A3B8" strokeWidth="3" strokeDasharray="5 3" />
                  {/* Caliper in Crimson */}
                  <path d="M-22 -15 L-32 -5 L-25 15 Z" fill="#EF4444" />
                  {/* Center Hub */}
                  <circle cx="0" cy="0" r="14" fill="#080B12" stroke="#F59E0B" strokeWidth="3" />

                  {/* Spinning Spokes (Framer Motion Rotate) */}
                  <motion.g
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 0.35, ease: 'linear' }}
                  >
                    <line x1="0" y1="-42" x2="0" y2="42" stroke="#22D3EE" strokeWidth="3" />
                    <line x1="-42" y1="0" x2="42" y2="0" stroke="#22D3EE" strokeWidth="3" />
                    <line x1="-30" y1="-30" x2="30" y2="30" stroke="#F59E0B" strokeWidth="2" />
                    <line x1="-30" y1="30" x2="30" y2="-30" stroke="#F59E0B" strokeWidth="2" />
                  </motion.g>
                </g>

                {/* --------------------
                    SWINGARM, CHAIN & REAR SUSPENSION
                    -------------------- */}
                <path d="M130 245 L260 235 L245 255 Z" fill="#1E293B" stroke="#334155" strokeWidth="3" />
                <path d="M220 205 L240 245" stroke="#F59E0B" strokeWidth="7" strokeLinecap="round" />
                <path d="M222 208 L238 242" stroke="#EF4444" strokeWidth="3" strokeDasharray="3 3" />

                {/* --------------------
                    EXHAUST PIPE & NITRO FLAME
                    -------------------- */}
                <path d="M260 240 Q210 255 160 250" stroke="#64748B" strokeWidth="10" strokeLinecap="round" />
                <path d="M160 250 L120 248" stroke="#334155" strokeWidth="14" strokeLinecap="round" />
                <path d="M120 248 L105 247" stroke="#080B12" strokeWidth="10" />

                {/* Nitro Blue/Amber Exhaust Glow */}
                <motion.g
                  animate={{ scale: [1, 1.25, 1], opacity: [0.6, 0.95, 0.6] }}
                  transition={{ repeat: Infinity, duration: 0.25, ease: 'easeInOut' }}
                  transform="translate(100, 247)"
                >
                  <polygon points="0,0 -25,-6 -45,0 -25,6" fill="url(#neonCyan)" opacity="0.85" filter="url(#glowEffect)" />
                  <polygon points="0,0 -15,-3 -28,0 -15,3" fill="#F59E0B" opacity="0.9" />
                </motion.g>

                {/* --------------------
                    ENGINE & CHASSIS FRAME
                    -------------------- */}
                {/* Engine block with cooling fins */}
                <rect x="235" y="210" width="85" height="55" rx="10" fill="#0F172A" stroke="#334155" strokeWidth="3" />
                <line x1="240" y1="222" x2="310" y2="222" stroke="#475569" strokeWidth="2" />
                <line x1="240" y1="232" x2="310" y2="232" stroke="#475569" strokeWidth="2" />
                <line x1="240" y1="242" x2="310" y2="242" stroke="#475569" strokeWidth="2" />
                <line x1="240" y1="252" x2="310" y2="252" stroke="#475569" strokeWidth="2" />
                {/* Trellis Frame (Neon Cyan Accent) */}
                <path d="M220 185 L320 200 L300 240 L230 235 Z" fill="none" stroke="#06B6D4" strokeWidth="4" filter="url(#glowEffect)" opacity="0.8" />
                <path d="M220 185 L300 240" stroke="#06B6D4" strokeWidth="3" opacity="0.8" />
                <path d="M320 200 L230 235" stroke="#06B6D4" strokeWidth="3" opacity="0.8" />

                {/* --------------------
                    FRONT FORKS & SUSPENSION
                    -------------------- */}
                <line x1="420" y1="140" x2="450" y2="245" stroke="#F59E0B" strokeWidth="7" strokeLinecap="round" />
                <line x1="410" y1="145" x2="445" y2="245" stroke="#D97706" strokeWidth="5" />
                <circle cx="450" cy="245" r="7" fill="#080B12" stroke="#F59E0B" strokeWidth="2" />
                {/* Front Fender */}
                <path d="M410 215 Q445 195 480 220" stroke="#0F172A" strokeWidth="6" strokeLinecap="round" />

                {/* --------------------
                    BODYWORK / FUEL TANK / TAIL
                    -------------------- */}
                {/* Fuel Tank (Electric Amber Gradient) */}
                <path
                  d="M270 175 C310 160 360 165 390 185 C370 205 320 215 270 195 Z"
                  fill="url(#amberGlow)"
                  stroke="#F59E0B"
                  strokeWidth="2"
                  filter="url(#glowEffect)"
                />
                <path d="M300 170 L340 175" stroke="#FFF" strokeWidth="2" opacity="0.6" strokeLinecap="round" />

                {/* Tail Cowl */}
                <path d="M180 180 L260 185 L250 205 L165 195 Z" fill="#0F172A" stroke="#334155" strokeWidth="2" />
                <path d="M165 195 L155 192" stroke="#EF4444" strokeWidth="6" strokeLinecap="round" filter="url(#glowEffect)" /> {/* Tail Brake Light */}

                {/* Rider Seat */}
                <path d="M235 185 C255 185 270 188 280 198 L240 198 Z" fill="#020617" stroke="#1E293B" strokeWidth="2" />

                {/* Handlebars & Mirrors */}
                <path d="M395 150 L410 145 L415 130" stroke="#94A3B8" strokeWidth="4" strokeLinecap="round" />
                <circle cx="415" cy="130" r="5" fill="#06B6D4" />

                {/* Front Headlight Assembly */}
                <path d="M415 170 L435 178 L425 198 L405 185 Z" fill="#1E293B" stroke="#475569" strokeWidth="2" />
                {/* Twin LED Headlight Glow in Amber */}
                <circle cx="433" cy="180" r="6" fill="#F59E0B" filter="url(#glowEffect)" />
                <circle cx="431" cy="188" r="4" fill="#22D3EE" filter="url(#glowEffect)" />

                {/* --------------------
                    AERODYNAMIC RIDER
                    -------------------- */}
                {/* Rider Torso & Jacket (Leaning Forward) */}
                <path
                  d="M245 180 C240 145 285 130 330 135 C350 145 365 165 375 175 L335 185 Z"
                  fill="#0F172A"
                  stroke="#1E293B"
                  strokeWidth="2"
                />
                {/* Jacket Neon Racing Stripes */}
                <path d="M260 155 Q300 145 340 155" stroke="#F59E0B" strokeWidth="3" fill="none" opacity="0.9" />
                <path d="M275 165 Q310 155 350 168" stroke="#06B6D4" strokeWidth="2" fill="none" opacity="0.9" />

                {/* Rider Arm & Glove on Handlebar */}
                <path d="M325 145 L385 155 L410 145" stroke="#1E293B" strokeWidth="12" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M325 145 L385 155 L410 145" stroke="#334155" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
                <circle cx="410" cy="145" r="7" fill="#F59E0B" />

                {/* Rider Leg & Boot */}
                <path d="M270 185 L295 220 L310 235" stroke="#0F172A" strokeWidth="16" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M295 220 L315 238" stroke="#EF4444" strokeWidth="5" strokeLinecap="round" />
                <rect x="305" y="235" width="22" height="10" rx="3" fill="#020617" />

                {/* Full-Face Racing Helmet */}
                <ellipse cx="360" cy="120" rx="24" ry="20" fill="#0F172A" stroke="#334155" strokeWidth="3" />
                {/* Neon Cyan Helmet Tint / Visor */}
                <path
                  d="M365 110 C378 112 384 122 380 130 L360 130 Z"
                  fill="url(#neonCyan)"
                  opacity="0.95"
                  filter="url(#glowEffect)"
                />
                {/* Visor Glare Line */}
                <path d="M368 115 L378 122" stroke="#FFF" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </motion.div>
          </div>

          {/* Bottom Telemetry Bar */}
          <div className="mt-4 pt-4 border-t border-white/10 grid grid-cols-2 sm:grid-cols-4 gap-4 text-center font-mono text-xs">
            <div className="p-2 rounded-xl bg-white/5 border border-white/5">
              <span className="text-slate-400 block text-[10px] uppercase">Telemetry Speed</span>
              <span className="text-amber-400 font-bold text-sm">118 KM/H</span>
            </div>
            <div className="p-2 rounded-xl bg-white/5 border border-white/5">
              <span className="text-slate-400 block text-[10px] uppercase">Emergency Dispatch</span>
              <span className="text-cyan-400 font-bold text-sm">&lt; 15 MINS</span>
            </div>
            <div className="p-2 rounded-xl bg-white/5 border border-white/5">
              <span className="text-slate-400 block text-[10px] uppercase">Highway Coverage</span>
              <span className="text-emerald-400 font-bold text-sm">Ashulia / Savar / Dhaka</span>
            </div>
            <div className="p-2 rounded-xl bg-white/5 border border-white/5">
              <span className="text-slate-400 block text-[10px] uppercase">Service Status</span>
              <span className="text-crimson-400 font-bold text-sm flex items-center justify-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-crimson-400 animate-ping"></span>
                24/7 ONLINE
              </span>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};

export default HeroMotorcycle;
