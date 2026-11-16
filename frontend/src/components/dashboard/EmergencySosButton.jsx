import React, { useState } from 'react';
import { requestService } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { ShieldAlert, RefreshCw, CheckCircle2, AlertTriangle, PhoneCall } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const EmergencySosButton = ({ userCoords, onRequestCreated }) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  const handleSos = async () => {
    if (loading) return;
    setLoading(true);
    setError(null);

    try {
      const lat = userCoords?.lat || 23.9315;
      const lng = userCoords?.lng || 90.2707;

      await requestService.createRequest({
        type: 'emergency_rescue',
        lat,
        lng,
        userName: user?.name,
        userPhone: user?.phone,
      });

      setSuccess(true);
      if (onRequestCreated) onRequestCreated();
      setTimeout(() => setSuccess(false), 5000);
    } catch (err) {
      setError(err.message || 'Failed to dispatch SOS beacon.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass-card rounded-3xl p-6 sm:p-7 border border-crimson-500/30 relative overflow-hidden flex flex-col items-center justify-between text-center group hover:border-crimson-500/60 transition-all shadow-[0_0_30px_rgba(239,68,68,0.15)]">
      {/* Background Deep Crimson Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-crimson-600/15 rounded-full blur-3xl pointer-events-none group-hover:bg-crimson-600/25 transition-all"></div>

      {/* Header */}
      <div className="w-full">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-crimson-500/10 border border-crimson-500/30 text-crimson-400 text-xs font-mono mb-2">
          <span className="w-2 h-2 rounded-full bg-crimson-500 animate-ping"></span>
          HIGH-PRIORITY HIGHWAY SQUAD
        </div>
        <h3 className="text-xl font-black text-white uppercase tracking-wide">
          Emergency Rescue SOS
        </h3>
        <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto">
          One-click instant dispatch for road accidents, major mechanical breakdowns & medical trauma
        </p>
      </div>

      {/* Pulsing Crimson SOS Master Beacon */}
      <div className="relative my-6 flex items-center justify-center">
        {/* Radar concentric waves */}
        <span className="absolute w-44 h-44 rounded-full bg-crimson-500/20 animate-radar-slow"></span>
        <span className="absolute w-36 h-36 rounded-full bg-crimson-500/30 animate-radar-fast"></span>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleSos}
          disabled={loading}
          className="relative z-10 w-28 h-28 sm:w-32 sm:h-32 rounded-full bg-gradient-to-br from-crimson-500 via-crimson-600 to-crimson-700 text-white font-black text-xl sm:text-2xl uppercase tracking-widest shadow-[0_0_40px_rgba(239,68,68,0.7)] flex flex-col items-center justify-center gap-1 border-4 border-crimson-400/80 active:shadow-[0_0_60px_rgba(239,68,68,1)]"
        >
          {loading ? (
            <RefreshCw className="w-8 h-8 animate-spin" />
          ) : success ? (
            <>
              <CheckCircle2 className="w-8 h-8 text-white" />
              <span className="text-[10px] font-mono tracking-wider">SENT!</span>
            </>
          ) : (
            <>
              <ShieldAlert className="w-7 h-7 sm:w-8 sm:h-8 animate-bounce" />
              <span className="drop-shadow-md">SOS</span>
              <span className="text-[9px] font-mono tracking-wider opacity-90">1-TAP DIAL</span>
            </>
          )}
        </motion.button>
      </div>

      {/* Status & Feedback */}
      <div className="w-full">
        {error && (
          <div className="mb-3 p-2.5 rounded-xl bg-crimson-500/10 border border-crimson-500/30 text-crimson-300 text-xs flex items-center justify-center gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="mb-3 p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center justify-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>Rescue beacon broadcasting to Ashulia patrol unit!</span>
          </div>
        )}

        <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 pt-3 border-t border-white/10">
          <span className="text-slate-300">Target: {userCoords?.lat?.toFixed(3) || '23.931'}, {userCoords?.lng?.toFixed(3) || '90.270'}</span>
          <a
            href="tel:999"
            className="text-crimson-400 hover:underline flex items-center gap-1 font-bold"
          >
            <PhoneCall className="w-3 h-3" />
            Direct 999
          </a>
        </div>
      </div>
    </div>
  );
};

export default EmergencySosButton;
