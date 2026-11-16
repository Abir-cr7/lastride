import React, { useState } from 'react';
import { adminService } from '../../services/api';
import { Fuel, Plus, Edit2, Trash2, Check, X, RefreshCw, AlertCircle, CheckCircle2 } from 'lucide-react';

const FuelManager = ({ fuels = [], onRefresh }) => {
  const [editingId, setEditingId] = useState(null);
  const [editPrice, setEditPrice] = useState('');
  const [newFuel, setNewFuel] = useState({ name: 'Petrol', pricePerLiter: '', unit: 'Liter' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleStartEdit = (fuel) => {
    setEditingId(fuel._id);
    setEditPrice(fuel.pricePerLiter);
    setError(null);
    setSuccess(null);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditPrice('');
  };

  const handleSavePrice = async (id) => {
    if (!editPrice || editPrice <= 0) return;
    setLoading(true);
    setError(null);

    try {
      await adminService.updateFuel(id, { pricePerLiter: Number(editPrice) });
      setSuccess('Fuel price updated successfully.');
      setEditingId(null);
      if (onRefresh) onRefresh();
    } catch (err) {
      setError(err.message || 'Failed to update price.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddFuel = async (e) => {
    e.preventDefault();
    if (!newFuel.name || !newFuel.pricePerLiter) return;
    setLoading(true);
    setError(null);

    try {
      await adminService.addFuel({
        name: newFuel.name,
        pricePerLiter: Number(newFuel.pricePerLiter),
        unit: newFuel.unit || 'Liter',
      });
      setSuccess(`Added ${newFuel.name} at ৳${newFuel.pricePerLiter}/L.`);
      setNewFuel({ name: 'Petrol', pricePerLiter: '', unit: 'Liter' });
      if (onRefresh) onRefresh();
    } catch (err) {
      setError(err.message || 'Failed to add fuel.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteFuel = async (id, name) => {
    if (!window.confirm(`Delete ${name}?`)) return;
    setLoading(true);
    try {
      await adminService.deleteFuel(id);
      setSuccess(`Deleted ${name}.`);
      if (onRefresh) onRefresh();
    } catch (err) {
      setError(err.message || 'Failed to delete fuel.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass-card rounded-3xl p-6 sm:p-7 border border-white/10 relative overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2.5">
          <div className="p-2.5 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-400">
            <Fuel className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white uppercase tracking-wide">
              Fuel & Product Rates Manager
            </h3>
            <p className="text-xs text-slate-400">
              Set live per-liter rates dispatched across Ashulia & Dhaka
            </p>
          </div>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-3 rounded-xl bg-crimson-500/10 border border-crimson-500/30 text-crimson-300 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="mb-4 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{success}</span>
        </div>
      )}

      {/* 1. Add New Fuel Form */}
      <form
        onSubmit={handleAddFuel}
        className="p-4 rounded-2xl bg-white/5 border border-white/10 mb-6 grid grid-cols-1 sm:grid-cols-4 gap-3 items-end"
      >
        <div>
          <label className="block text-[11px] font-mono text-slate-400 uppercase mb-1">
            Fuel Name
          </label>
          <select
            value={newFuel.name}
            onChange={(e) => setNewFuel({ ...newFuel, name: e.target.value })}
            className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-white text-xs font-mono focus:outline-none focus:border-amber-400"
          >
            <option value="Petrol">Petrol</option>
            <option value="Octane">Octane</option>
            <option value="Diesel">Diesel</option>
          </select>
        </div>

        <div>
          <label className="block text-[11px] font-mono text-slate-400 uppercase mb-1">
            Price / Liter (৳ BDT)
          </label>
          <input
            type="number"
            min="1"
            required
            placeholder="e.g. 135"
            value={newFuel.pricePerLiter}
            onChange={(e) => setNewFuel({ ...newFuel, pricePerLiter: e.target.value })}
            className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-white text-xs font-mono focus:outline-none focus:border-amber-400"
          />
        </div>

        <div>
          <label className="block text-[11px] font-mono text-slate-400 uppercase mb-1">
            Unit
          </label>
          <input
            type="text"
            value={newFuel.unit}
            onChange={(e) => setNewFuel({ ...newFuel, unit: e.target.value })}
            className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-white text-xs font-mono focus:outline-none focus:border-amber-400"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="py-2.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs uppercase font-mono tracking-wider transition-all flex items-center justify-center gap-1.5 shadow-[0_0_15px_rgba(245,158,11,0.3)]"
        >
          <Plus className="w-4 h-4" />
          <span>Add / Save Fuel</span>
        </button>
      </form>

      {/* 2. Fuel Price Cards List */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {fuels.map((fuel) => {
          const isEditing = editingId === fuel._id;

          return (
            <div
              key={fuel._id}
              className="p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-amber-500/30 transition-all flex flex-col justify-between"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-mono font-bold text-white text-sm uppercase">
                  {fuel.name}
                </span>
                <span className="text-[10px] font-mono text-slate-400 bg-white/5 px-2 py-0.5 rounded">
                  1 {fuel.unit || 'Liter'}
                </span>
              </div>

              {isEditing ? (
                <div className="my-2 space-y-2">
                  <div className="flex items-center gap-1">
                    <span className="text-sm font-mono text-amber-400">৳</span>
                    <input
                      type="number"
                      value={editPrice}
                      onChange={(e) => setEditPrice(e.target.value)}
                      className="w-full px-2 py-1 rounded bg-black/50 border border-amber-400 text-white text-sm font-mono"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleSavePrice(fuel._id)}
                      className="flex-1 py-1 rounded bg-emerald-500 text-slate-950 text-xs font-bold font-mono flex items-center justify-center gap-1"
                    >
                      <Check className="w-3.5 h-3.5" /> Save
                    </button>
                    <button
                      onClick={handleCancelEdit}
                      className="p-1 rounded bg-white/10 text-slate-300 text-xs"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ) : (
                <div className="my-3">
                  <div className="text-3xl font-black text-amber-400 font-mono tracking-tight">
                    ৳{fuel.pricePerLiter}
                  </div>
                  <p className="text-[10px] text-slate-500 font-mono mt-0.5">
                    Updated {new Date(fuel.updatedAt || Date.now()).toLocaleDateString()}
                  </p>
                </div>
              )}

              {!isEditing && (
                <div className="pt-2 border-t border-white/10 flex items-center justify-between">
                  <button
                    onClick={() => handleStartEdit(fuel)}
                    className="text-xs font-mono text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
                  >
                    <Edit2 className="w-3 h-3" /> Edit Price
                  </button>
                  <button
                    onClick={() => handleDeleteFuel(fuel._id, fuel.name)}
                    className="text-xs font-mono text-slate-500 hover:text-crimson-400"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default FuelManager;
