import React, { useState, useEffect } from 'react';
import { publicService } from '../services/api';
import { Flame, RefreshCw, ArrowUpRight, CheckCircle2, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const FuelPricesCard = ({ onSelectFuel }) => {
  const [fuels, setFuels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastRefreshed, setLastRefreshed] = useState(null);

  const fetchFuels = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await publicService.getFuels();
      if (res.data?.data) {
        setFuels(res.data.data);
      } else {
        setFuels(res.data);
      }
      setLastRefreshed(new Date());
    } catch (err) {
      console.error('Error loading fuel prices:', err.message);
      setError('Could not fetch real-time prices. Using default rates.');
      // Realistic Bangladesh fallback rates
      setFuels([
        { _id: '1', name: 'Petrol', pricePerLiter: 125, unit: 'Liter', updatedAt: new Date() },
        { _id: '2', name: 'Octane', pricePerLiter: 130, unit: 'Liter', updatedAt: new Date() },
        { _id: '3', name: 'Diesel', pricePerLiter: 105, unit: 'Liter', updatedAt: new Date() },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFuels();
    const interval = setInterval(fetchFuels, 60000); // 1 min poll
    return () => clearInterval(interval);
  }, []);

  const getBadgeColor = (name) => {
    switch (name.toLowerCase()) {
      case 'octane':
        return 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30';
      case 'petrol':
        return 'text-amber-400 bg-amber-500/10 border-amber-500/30';
      case 'diesel':
        return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30';
      default:
        return 'text-slate-400 bg-slate-500/10 border-slate-500/30';
    }
  };

  return (
    <div id="fuel-rates" className="glass-card rounded-3xl p-6 sm:p-7 relative overflow-hidden flex flex-col justify-between h-full border border-white/10 group hover:border-amber-500/30 transition-all duration-300">
      {/* Background Amber Bloom */}
      <div className="absolute top-0 right-0 w-44 h-44 bg-amber-500/10 rounded-full blur-3xl pointer-events-none group-hover:bg-amber-500/20 transition-all duration-500"></div>

      <div>
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.3)]">
              <Flame className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white tracking-wide flex items-center gap-2">
                Live Fuel Rates
                <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  Live Feed
                </span>
              </h3>
              <p className="text-xs text-slate-400">Government pegged rates for Ashulia & Dhaka</p>
            </div>
          </div>

          <button
            onClick={fetchFuels}
            disabled={loading}
            title="Refresh prices"
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-400 hover:text-amber-400 transition-colors"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-amber-400' : ''}`} />
          </button>
        </div>

        {error && (
          <div className="mb-4 p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-300 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Fuel Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 my-4">
          {fuels.map((fuel) => (
            <motion.div
              key={fuel._id || fuel.name}
              whileHover={{ y: -3, scale: 1.02 }}
              transition={{ duration: 0.2 }}
              className="p-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-amber-500/40 transition-all flex flex-col justify-between"
            >
              <div className="flex items-center justify-between">
                <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded-md border ${getBadgeColor(fuel.name)}`}>
                  {fuel.name}
                </span>
                <span className="text-[10px] text-slate-400 font-mono">1 {fuel.unit || 'Liter'}</span>
              </div>

              <div className="my-3">
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-black text-white font-mono tracking-tight">
                    ৳{fuel.pricePerLiter}
                  </span>
                  <span className="text-xs text-slate-400 font-mono">BDT</span>
                </div>
              </div>

              <button
                onClick={() => onSelectFuel && onSelectFuel(fuel.name)}
                className="w-full py-1.5 text-center text-xs font-semibold rounded-lg bg-white/5 hover:bg-amber-500 hover:text-slate-950 text-slate-200 border border-white/10 hover:border-amber-400 transition-all duration-200 flex items-center justify-center gap-1 group/btn"
              >
                <span>Dispatch</span>
                <ArrowUpRight className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
              </button>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Footer Info */}
      <div className="pt-3 border-t border-white/10 flex items-center justify-between text-[11px] text-slate-400 font-mono">
        <span className="flex items-center gap-1 text-slate-300">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
          Certified Unadulterated Fuel
        </span>
        {lastRefreshed && (
          <span>
            Refreshed {lastRefreshed.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
        )}
      </div>
    </div>
  );
};

export default FuelPricesCard;
