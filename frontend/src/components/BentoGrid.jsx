import React from 'react';
import AlertsBanner from './AlertsBanner';
import FuelPricesCard from './FuelPricesCard';
import WeatherWidget from './WeatherWidget';
import EmergencyHelplines from './EmergencyHelplines';
import { Radio, ShieldAlert } from 'lucide-react';

const BentoGrid = ({ onSelectFuel }) => {
  return (
    <section id="live-hub" className="py-12 sm:py-20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-mono mb-2">
              <Radio className="w-3.5 h-3.5 animate-pulse" />
              TELEMETRY & DISPATCH GRID
            </div>
            <h2 className="text-3xl sm:text-4xl font-black uppercase text-white tracking-tight">
              Bento Grid <span className="text-amber-400">Live Hub</span>
            </h2>
            <p className="text-sm text-slate-400 mt-1 max-w-xl">
              Live highway telemetry, government fuel pricing, weather safety radar, and instant 
              emergency calling for motorcycle riders.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
            Real-time synchronization active
          </div>
        </div>

        {/* 1. Broadcast Alerts Banner */}
        <AlertsBanner />

        {/* 2. Bento Grid: Live Fuel Prices & Weather Widget */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7">
            <FuelPricesCard onSelectFuel={onSelectFuel} />
          </div>
          <div className="lg:col-span-5">
            <WeatherWidget />
          </div>
        </div>

        {/* 3. Emergency Helplines Radar Hub */}
        <EmergencyHelplines />

      </div>
    </section>
  );
};

export default BentoGrid;
