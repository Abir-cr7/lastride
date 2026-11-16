import React, { useState } from 'react';
import { adminService } from '../../services/api';
import { Radio, Send, Trash2, AlertTriangle, RefreshCw, CheckCircle2 } from 'lucide-react';

const AlertBroadcastForm = ({ alerts = [], onRefresh, loading = false }) => {
  const [formData, setFormData] = useState({
    title: '',
    message: '',
    severity: 'warning',
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.message) return;
    setError(null);
    setSuccess(null);
    setSubmitting(true);

    try {
      await adminService.createAlert({
        title: formData.title.trim(),
        message: formData.message.trim(),
        severity: formData.severity,
      });

      setSuccess('Alert broadcasted successfully to all riders & landing hub.');
      setFormData({ title: '', message: '', severity: 'warning' });
      if (onRefresh) onRefresh();
    } catch (err) {
      setError(err.message || 'Failed to broadcast alert.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Delete broadcast "${title}"?`)) return;
    try {
      await adminService.deleteAlert(id);
      setSuccess(`Removed alert "${title}".`);
      if (onRefresh) onRefresh();
    } catch (err) {
      setError(err.message || 'Failed to remove alert.');
    }
  };

  return (
    <div className="glass-card rounded-3xl p-6 sm:p-7 border border-white/10 relative overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2.5">
          <div className="p-2.5 rounded-xl bg-crimson-500/20 border border-crimson-500/40 text-crimson-400">
            <Radio className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white uppercase tracking-wide">
              Emergency Broadcast Transmitter
            </h3>
            <p className="text-xs text-slate-400">
              Transmit urgent road hazard alerts to all active riders & public landing page
            </p>
          </div>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-3 rounded-xl bg-crimson-500/10 border border-crimson-500/30 text-crimson-300 text-xs flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="mb-4 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{success}</span>
        </div>
      )}

      {/* Broadcast Form */}
      <form onSubmit={handleSubmit} className="p-4 rounded-2xl bg-white/5 border border-white/10 mb-6 space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="sm:col-span-2">
            <label className="block text-[11px] font-mono text-slate-400 uppercase mb-1">
              Broadcast Headline
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Baipail Waterlogging & Crash Advisory"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-white text-xs placeholder-slate-500 focus:outline-none focus:border-amber-400"
            />
          </div>

          <div>
            <label className="block text-[11px] font-mono text-slate-400 uppercase mb-1">
              Severity Level
            </label>
            <select
              value={formData.severity}
              onChange={(e) => setFormData({ ...formData, severity: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-white text-xs font-mono focus:outline-none focus:border-amber-400"
            >
              <option value="warning">Warning (Amber)</option>
              <option value="critical">Critical (Crimson)</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-[11px] font-mono text-slate-400 uppercase mb-1">
            Detailed Alert Instructions
          </label>
          <textarea
            rows={2}
            required
            placeholder="e.g. Heavy oil spillage reported near Baipail flyover ramp. Reduce speed to under 30km/h."
            value={formData.message}
            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
            className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-white text-xs placeholder-slate-500 focus:outline-none focus:border-amber-400 resize-none"
          />
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs uppercase font-mono tracking-wider transition-all flex items-center justify-center gap-1.5 shadow-[0_0_15px_rgba(245,158,11,0.3)]"
        >
          {submitting ? (
            <RefreshCw className="w-4 h-4 animate-spin" />
          ) : (
            <>
              <Send className="w-3.5 h-3.5" />
              <span>Broadcast Alert Live</span>
            </>
          )}
        </button>
      </form>

      {/* Active Alerts List */}
      <div>
        <h4 className="text-xs font-mono uppercase font-bold text-slate-400 mb-3">
          Currently Broadcasting ({alerts.length})
        </h4>

        {alerts.length === 0 ? (
          <p className="text-xs text-slate-500 font-mono italic">
            No active custom broadcasts. Default highway clear banner is displayed.
          </p>
        ) : (
          <div className="space-y-2">
            {alerts.map((al) => {
              const isCrit = al.severity === 'critical';
              return (
                <div
                  key={al._id}
                  className={`p-3.5 rounded-2xl border flex items-center justify-between gap-3 ${
                    isCrit
                      ? 'bg-crimson-950/20 border-crimson-500/30'
                      : 'bg-amber-950/20 border-amber-500/30'
                  }`}
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-[9px] font-mono font-bold uppercase px-2 py-0.5 rounded border ${
                          isCrit
                            ? 'bg-crimson-500/20 text-crimson-300 border-crimson-500/40'
                            : 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                        }`}
                      >
                        {al.severity}
                      </span>
                      <h5 className="font-bold text-white text-xs">{al.title}</h5>
                    </div>
                    <p className="text-xs text-slate-300 mt-1 leading-relaxed">{al.message}</p>
                    <span className="text-[10px] font-mono text-slate-500 mt-1 block">
                      Published {new Date(al.createdAt).toLocaleString()}
                    </span>
                  </div>

                  <button
                    onClick={() => handleDelete(al._id, al.title)}
                    className="p-2 rounded-xl hover:bg-crimson-500/20 text-slate-400 hover:text-crimson-400 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default AlertBroadcastForm;
