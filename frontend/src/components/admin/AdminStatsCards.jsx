import React from 'react';
import { Users, Fuel, ShieldAlert, Wrench, Radio, CheckCircle2, TrendingUp } from 'lucide-react';

const AdminStatsCards = ({ stats = {} }) => {
  const users = stats.users || {};
  const requests = stats.requests || {};
  const infrastructure = stats.infrastructure || {};

  const cards = [
    {
      title: 'Total Registered Users',
      value: users.total ?? 0,
      subValue: `${users.restricted ?? 0} Restricted • ${users.active ?? 0} Active`,
      icon: Users,
      color: 'cyan',
      glow: 'shadow-[0_0_20px_rgba(6,182,212,0.25)]',
      border: 'border-cyan-500/30',
      badge: 'bg-cyan-500/10 text-cyan-300',
    },
    {
      title: 'Pending Fuel Orders',
      value: requests.fuelOrders ?? 0,
      subValue: `${requests.pending ?? 0} Total Pending In Queue`,
      icon: Fuel,
      color: 'amber',
      glow: 'shadow-[0_0_20px_rgba(245,158,11,0.25)]',
      border: 'border-amber-500/30',
      badge: 'bg-amber-500/10 text-amber-300',
    },
    {
      title: 'Active Emergency Rescues',
      value: requests.emergencyRescue ?? 0,
      subValue: 'High-Priority SOS Corridors',
      icon: ShieldAlert,
      color: 'crimson',
      glow: 'shadow-[0_0_20px_rgba(239,68,68,0.3)]',
      border: 'border-crimson-500/40',
      badge: 'bg-crimson-500/15 text-crimson-300',
    },
    {
      title: 'Total Service Centers',
      value: infrastructure.serviceCenters ?? 0,
      subValue: 'Ashulia & Savar Highway Hubs',
      icon: Wrench,
      color: 'emerald',
      glow: 'shadow-[0_0_20px_rgba(16,185,129,0.25)]',
      border: 'border-emerald-500/30',
      badge: 'bg-emerald-500/10 text-emerald-300',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card, idx) => {
        const Icon = card.icon;
        return (
          <div
            key={idx}
            className={`glass-card rounded-2xl p-5 border ${card.border} ${card.glow} relative overflow-hidden flex flex-col justify-between`}
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-mono font-bold uppercase text-slate-400">
                {card.title}
              </span>
              <div className={`p-2 rounded-xl border border-white/10 ${card.badge}`}>
                <Icon className="w-4 h-4" />
              </div>
            </div>

            <div>
              <div className="text-3xl font-black text-white font-mono tracking-tight">
                {card.value}
              </div>
              <p className="text-[11px] font-mono text-slate-400 mt-1">{card.subValue}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default AdminStatsCards;
