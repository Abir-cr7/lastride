import React, { useState, useEffect } from 'react';
import { publicService } from '../services/api';
import { AlertTriangle, Radio, ShieldCheck, ChevronRight, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const AlertsBanner = () => {
  const [alerts, setAlerts] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        const res = await publicService.getAlerts();
        const data = res.data?.data || res.data || [];
        setAlerts(data);
      } catch (err) {
        console.warn('Could not load broadcast alerts:', err.message);
      }
    };

    fetchAlerts();
    const interval = setInterval(fetchAlerts, 60000); // 1 min poll
    return () => clearInterval(interval);
  }, []);

  if (dismissed) return null;

  // Fallback default highway broadcast if no active admin alert
  const currentAlert = alerts.length > 0 ? alerts[currentIndex] : {
    _id: 'default',
    title: 'Highway Corridors Clear',
    message: 'Rapid response patrols active along Baipail Bypass, Savar Highway, Uttara and Mirpur 10 corridors. Safe riding speeds recommended.',
    severity: 'warning',
    createdAt: new Date(),
  };

  const isCritical = currentAlert.severity === 'critical';

  return (
    <div className="w-full">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className={`w-full rounded-2xl p-4 sm:p-5 border transition-all duration-300 relative overflow-hidden backdrop-blur-xl ${
          isCritical
            ? 'bg-crimson-950/40 border-crimson-500/40 shadow-[0_0_25px_rgba(239,68,68,0.25)]'
            : 'bg-amber-950/30 border-amber-500/40 shadow-[0_0_25px_rgba(245,158,11,0.2)]'
        }`}
      >
        {/* Glow Strip */}
        <div
          className={`absolute left-0 top-0 bottom-0 w-1.5 ${
            isCritical ? 'bg-crimson-500' : 'bg-amber-400'
          }`}
        />

        <div className="flex items-start sm:items-center justify-between gap-4">
          <div className="flex items-start sm:items-center gap-3">
            {/* Blinking Broadcast Beacon */}
            <div
              className={`p-2.5 rounded-xl border flex items-center justify-center shrink-0 ${
                isCritical
                  ? 'bg-crimson-500/20 border-crimson-500/50 text-crimson-400'
                  : 'bg-amber-500/20 border-amber-500/50 text-amber-400'
              }`}
            >
              <Radio className="w-5 h-5 animate-pulse" />
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span
                  className={`text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-md border ${
                    isCritical
                      ? 'bg-crimson-500/20 text-crimson-300 border-crimson-500/40'
                      : 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                  }`}
                >
                  {isCritical ? 'CRITICAL BROADCAST' : 'ADMIN ADVISORY'}
                </span>
                <h4 className="text-sm font-bold text-white tracking-wide">
                  {currentAlert.title}
                </h4>
              </div>
              <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                {currentAlert.message}
              </p>
            </div>
          </div>

          {/* Controls: Next Alert / Dismiss */}
          <div className="flex items-center gap-2 shrink-0">
            {alerts.length > 1 && (
              <button
                onClick={() => setCurrentIndex((prev) => (prev + 1) % alerts.length)}
                className="text-xs font-mono text-slate-300 hover:text-white px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 flex items-center gap-1"
              >
                <span>{currentIndex + 1}/{alerts.length}</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            )}

            <button
              onClick={() => setDismissed(true)}
              title="Dismiss banner"
              className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AlertsBanner;
