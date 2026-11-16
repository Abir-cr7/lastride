import React, { useState, useEffect } from 'react';
import { fetchLiveWeather } from '../../services/weatherService';
import { publicService } from '../../services/api';
import {
  CloudSun,
  Sun,
  CloudRain,
  CloudLightning,
  Wind,
  AlertTriangle,
  Radio,
  MapPin,
  RefreshCw,
  X,
  ShieldAlert,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const LiveWeatherAlertBar = ({ userCoords }) => {
  const [weather, setWeather] = useState(null);
  const [alerts, setAlerts] = useState([]);
  const [currentAlertIdx, setCurrentAlertIdx] = useState(0);
  const [alertDismissed, setAlertDismissed] = useState(false);

  useEffect(() => {
    let mounted = true;
    const loadData = async () => {
      const lat = userCoords?.lat || 23.9315;
      const lng = userCoords?.lng || 90.2707;
      const wData = await fetchLiveWeather(lat, lng, userCoords ? 'Your GPS Location' : 'Ashulia Corridor');
      if (mounted) setWeather(wData);

      try {
        const aRes = await publicService.getAlerts();
        const aData = aRes.data?.data || aRes.data || [];
        if (mounted) setAlerts(aData);
      } catch (err) {
        console.warn('Could not load alerts:', err.message);
      }
    };

    loadData();
    const interval = setInterval(loadData, 60000);
    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, [userCoords]);

  const activeAlert = alerts.length > 0 ? alerts[currentAlertIdx] : null;
  const isCritical = activeAlert?.severity === 'critical';

  return (
    <div className="space-y-3 w-full">
      {/* 1. Active Admin Broadcast Alert Bar (if any exists and not dismissed) */}
      <AnimatePresence>
        {activeAlert && !alertDismissed && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className={`w-full rounded-2xl p-3.5 sm:p-4 border backdrop-blur-xl flex items-center justify-between gap-3 ${
              isCritical
                ? 'bg-crimson-950/40 border-crimson-500/50 text-crimson-200 shadow-[0_0_20px_rgba(239,68,68,0.3)]'
                : 'bg-amber-950/30 border-amber-500/50 text-amber-200 shadow-[0_0_20px_rgba(245,158,11,0.25)]'
            }`}
          >
            <div className="flex items-center gap-3">
              <div
                className={`p-2 rounded-xl border flex items-center justify-center shrink-0 ${
                  isCritical
                    ? 'bg-crimson-500/20 border-crimson-500/60 text-crimson-400'
                    : 'bg-amber-500/20 border-amber-500/60 text-amber-400'
                }`}
              >
                <Radio className="w-4 h-4 animate-pulse" />
              </div>

              <div className="flex flex-wrap items-center gap-2 text-xs">
                <span
                  className={`font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded text-[10px] border ${
                    isCritical
                      ? 'bg-crimson-500/30 border-crimson-400 text-crimson-300'
                      : 'bg-amber-500/30 border-amber-400 text-amber-300'
                  }`}
                >
                  {isCritical ? 'CRITICAL BROADCAST' : 'ADMIN ADVISORY'}
                </span>
                <span className="font-bold text-white">{activeAlert.title}:</span>
                <span className="text-slate-200">{activeAlert.message}</span>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              {alerts.length > 1 && (
                <button
                  onClick={() => setCurrentAlertIdx((prev) => (prev + 1) % alerts.length)}
                  className="text-[11px] font-mono px-2 py-1 rounded bg-white/10 hover:bg-white/20 text-white"
                >
                  {currentAlertIdx + 1}/{alerts.length} Next
                </button>
              )}
              <button
                onClick={() => setAlertDismissed(true)}
                className="p-1 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 2. Top Live Weather & Telemetry Banner */}
      {weather && (
        <div className="glass-card rounded-2xl px-4 py-3 border border-white/10 flex flex-wrap items-center justify-between gap-3 text-xs">
          {/* Left: Weather Condition & Temperature */}
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 flex items-center justify-center">
              <CloudSun className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono font-black text-white text-base">
                  {weather.temperature}°C
                </span>
                <span className="text-slate-400 text-xs font-mono">• {weather.condition}</span>
                <span className="text-[10px] font-mono text-cyan-300 px-1.5 py-0.5 rounded bg-cyan-500/15 border border-cyan-500/25">
                  Feels like {weather.apparentTemperature}°C
                </span>
              </div>
              <p className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                <MapPin className="w-3 h-3 text-cyan-400" />
                {weather.location}
              </p>
            </div>
          </div>

          {/* Center: Rider Safety Advisory */}
          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-slate-300">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="font-semibold text-slate-200">{weather.safetyNotice}</span>
          </div>

          {/* Right: Wind & Humidity Telemetry */}
          <div className="flex items-center gap-4 font-mono text-slate-400">
            <span className="flex items-center gap-1 text-slate-300">
              <Wind className="w-3.5 h-3.5 text-cyan-400" />
              {weather.windSpeed} km/h Wind
            </span>
            <span className="text-emerald-400 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
              GPS Satellite Linked
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default LiveWeatherAlertBar;
