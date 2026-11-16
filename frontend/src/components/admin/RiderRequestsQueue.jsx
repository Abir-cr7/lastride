import React, { useState } from 'react';
import { adminService } from '../../services/api';
import {
  ShieldAlert,
  Fuel,
  Phone,
  MapPin,
  Check,
  CheckCircle2,
  RefreshCw,
  Clock,
  Filter,
  ExternalLink,
} from 'lucide-react';
import { motion } from 'framer-motion';

const RiderRequestsQueue = ({ requests = [], onRefresh, loading = false }) => {
  const [filter, setFilter] = useState('all'); // all, emergency, fuel, pending
  const [actingId, setActingId] = useState(null);

  const filtered = requests.filter((r) => {
    if (filter === 'emergency') return r.type === 'emergency_rescue';
    if (filter === 'fuel') return r.type === 'fuel_order';
    if (filter === 'pending') return r.status === 'pending';
    return true;
  });

  const handleAccept = async (id) => {
    setActingId(id);
    try {
      await adminService.acceptRequest(id);
      if (onRefresh) onRefresh();
    } catch (err) {
      alert(err.message || 'Failed to accept request.');
    } finally {
      setActingId(null);
    }
  };

  const handleComplete = async (id) => {
    setActingId(id);
    try {
      await adminService.updateRequestStatus(id, 'completed');
      if (onRefresh) onRefresh();
    } catch (err) {
      alert(err.message || 'Failed to complete request.');
    } finally {
      setActingId(null);
    }
  };

  return (
    <div className="glass-card rounded-3xl p-6 sm:p-7 border border-white/10 relative overflow-hidden">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-2.5">
          <div className="p-2.5 rounded-xl bg-crimson-500/20 border border-crimson-500/40 text-crimson-400 shadow-[0_0_15px_rgba(239,68,68,0.3)]">
            <ShieldAlert className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white uppercase tracking-wide flex items-center gap-2">
              Rider Requests & SOS Queue
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-crimson-500/20 text-crimson-400 border border-crimson-500/30">
                {requests.filter((r) => r.status === 'pending').length} Pending
              </span>
            </h3>
            <p className="text-xs text-slate-400">
              Live highway dispatch queue with rider coordinates & phone contact
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-white/5 border border-white/10 text-xs font-mono">
          {[
            { id: 'all', label: 'All' },
            { id: 'pending', label: 'Pending Only' },
            { id: 'emergency', label: 'SOS Only' },
            { id: 'fuel', label: 'Fuel Orders' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilter(tab.id)}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                filter === tab.id
                  ? 'bg-amber-500 text-slate-950 font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Queue Content */}
      {filtered.length === 0 ? (
        <div className="text-center py-12 rounded-2xl bg-white/5 border border-white/5">
          <Clock className="w-10 h-10 text-slate-500 mx-auto mb-2 opacity-50" />
          <p className="text-sm font-semibold text-slate-300">No requests in this view</p>
          <p className="text-xs text-slate-500 mt-1">
            New requests from riders will appear here in real time.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((req) => {
            const isEmergency = req.type === 'emergency_rescue';
            const isPending = req.status === 'pending';
            const isAccepted = req.status === 'accepted';
            const isActing = actingId === req._id;

            return (
              <div
                key={req._id}
                className={`p-4 rounded-2xl border transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                  isEmergency
                    ? 'bg-crimson-950/20 border-crimson-500/30 hover:border-crimson-500/50'
                    : 'bg-white/5 border-white/10 hover:border-white/20'
                }`}
              >
                {/* Left: Info & User */}
                <div className="flex items-start gap-3.5">
                  <div
                    className={`p-2.5 rounded-xl border shrink-0 ${
                      isEmergency
                        ? 'bg-crimson-500/20 border-crimson-500/50 text-crimson-400'
                        : 'bg-amber-500/20 border-amber-500/50 text-amber-400'
                    }`}
                  >
                    {isEmergency ? <ShieldAlert className="w-5 h-5 animate-bounce" /> : <Fuel className="w-5 h-5" />}
                  </div>

                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className={`text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded border ${
                          isEmergency
                            ? 'bg-crimson-500/20 text-crimson-300 border-crimson-500/40'
                            : 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                        }`}
                      >
                        {isEmergency ? 'EMERGENCY SOS RESCUE' : `${req.quantity}L ${req.fuelType}`}
                      </span>

                      <span
                        className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full ${
                          isPending
                            ? 'bg-amber-500/20 text-amber-400 animate-pulse'
                            : isAccepted
                            ? 'bg-emerald-500/20 text-emerald-400'
                            : 'bg-cyan-500/20 text-cyan-400'
                        }`}
                      >
                        ● {req.status.toUpperCase()}
                      </span>
                    </div>

                    <div className="mt-1 flex flex-wrap items-center gap-3 text-xs">
                      <span className="font-bold text-white">{req.userName}</span>
                      <a
                        href={`tel:${req.userPhone}`}
                        className="text-amber-400 font-mono font-bold hover:underline flex items-center gap-1"
                      >
                        <Phone className="w-3.5 h-3.5" />
                        {req.userPhone}
                      </a>
                      <span className="text-slate-400 font-mono flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-cyan-400" />
                        {req.lat?.toFixed(4)}, {req.lng?.toFixed(4)}
                      </span>
                    </div>

                    <p className="text-[10px] font-mono text-slate-500 mt-1">
                      Received: {new Date(req.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>

                {/* Right: Actions */}
                <div className="flex items-center gap-2 self-end md:self-center shrink-0">
                  {isPending && (
                    <button
                      onClick={() => handleAccept(req._id)}
                      disabled={isActing}
                      className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-slate-950 font-bold text-xs font-mono uppercase tracking-wider transition-all flex items-center gap-1.5 shadow-[0_0_15px_rgba(16,185,129,0.3)]"
                    >
                      {isActing ? (
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          <span>Accept Request</span>
                        </>
                      )}
                    </button>
                  )}

                  {isAccepted && (
                    <button
                      onClick={() => handleComplete(req._id)}
                      disabled={isActing}
                      className="px-3.5 py-2 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 font-bold text-xs font-mono uppercase tracking-wider transition-all flex items-center gap-1.5"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
                      <span>Mark Complete</span>
                    </button>
                  )}

                  <a
                    href={`https://www.google.com/maps?q=${req.lat},${req.lng}`}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
                    title="Open in Google Maps"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default RiderRequestsQueue;
