import React, { useState } from 'react';
import { adminService } from '../../services/api';
import { Wrench, Plus, Trash2, MapPin, Phone, RefreshCw, AlertCircle, CheckCircle2 } from 'lucide-react';

const ServiceCenterManager = ({ centers = [], onRefresh, loading = false }) => {
  const [formData, setFormData] = useState({
    name: '',
    contactNumber: '',
    address: '',
    lat: '',
    lng: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAddCenter = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setSubmitting(true);

    try {
      await adminService.addServiceCenter({
        name: formData.name.trim(),
        contactNumber: formData.contactNumber.trim(),
        address: formData.address.trim(),
        lat: Number(formData.lat),
        lng: Number(formData.lng),
      });

      setSuccess(`Added "${formData.name}" to rescue network.`);
      setFormData({ name: '', contactNumber: '', address: '', lat: '', lng: '' });
      if (onRefresh) onRefresh();
    } catch (err) {
      setError(err.message || 'Failed to add service center.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete "${name}"?`)) return;
    try {
      await adminService.deleteServiceCenter(id);
      setSuccess(`Deleted ${name}.`);
      if (onRefresh) onRefresh();
    } catch (err) {
      setError(err.message || 'Failed to delete service center.');
    }
  };

  return (
    <div className="glass-card rounded-3xl p-6 sm:p-7 border border-white/10 relative overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2.5">
          <div className="p-2.5 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400">
            <Wrench className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white uppercase tracking-wide">
              Service Center & Garage Manager
            </h3>
            <p className="text-xs text-slate-400">
              Add and manage authorized physical rescue hubs around Ashulia & Dhaka
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

      {/* Form */}
      <form
        onSubmit={handleAddCenter}
        className="p-4 rounded-2xl bg-white/5 border border-white/10 mb-6 space-y-3"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-[11px] font-mono text-slate-400 uppercase mb-1">
              Center Name
            </label>
            <input
              type="text"
              name="name"
              required
              placeholder="e.g. Ashulia Highway Moto Garage"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-white text-xs placeholder-slate-500 focus:outline-none focus:border-emerald-400"
            />
          </div>

          <div>
            <label className="block text-[11px] font-mono text-slate-400 uppercase mb-1">
              Contact Number
            </label>
            <input
              type="tel"
              name="contactNumber"
              required
              placeholder="+88017XXXXXXXX"
              value={formData.contactNumber}
              onChange={handleChange}
              className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-white text-xs font-mono placeholder-slate-500 focus:outline-none focus:border-emerald-400"
            />
          </div>
        </div>

        <div>
          <label className="block text-[11px] font-mono text-slate-400 uppercase mb-1">
            Physical Address
          </label>
          <input
            type="text"
            name="address"
            required
            placeholder="e.g. Baipail Bypass, Ashulia, Dhaka 1344"
            value={formData.address}
            onChange={handleChange}
            className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-white text-xs placeholder-slate-500 focus:outline-none focus:border-emerald-400"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-end">
          <div>
            <label className="block text-[11px] font-mono text-slate-400 uppercase mb-1">
              Latitude (lat)
            </label>
            <input
              type="number"
              step="any"
              name="lat"
              required
              placeholder="e.g. 23.9315"
              value={formData.lat}
              onChange={handleChange}
              className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-white text-xs font-mono placeholder-slate-500 focus:outline-none focus:border-emerald-400"
            />
          </div>

          <div>
            <label className="block text-[11px] font-mono text-slate-400 uppercase mb-1">
              Longitude (lng)
            </label>
            <input
              type="number"
              step="any"
              name="lng"
              required
              placeholder="e.g. 90.2707"
              value={formData.lng}
              onChange={handleChange}
              className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-white text-xs font-mono placeholder-slate-500 focus:outline-none focus:border-emerald-400"
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="py-2.5 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs uppercase font-mono tracking-wider transition-all flex items-center justify-center gap-1.5 shadow-[0_0_15px_rgba(16,185,129,0.3)]"
          >
            {submitting ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <>
                <Plus className="w-4 h-4" />
                <span>Register Center</span>
              </>
            )}
          </button>
        </div>
      </form>

      {/* Centers Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {centers.map((center) => (
          <div
            key={center._id}
            className="p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-emerald-500/30 transition-all flex items-start justify-between gap-3"
          >
            <div>
              <h4 className="font-bold text-white text-sm">{center.name}</h4>
              <p className="text-xs text-slate-400 mt-1 flex items-start gap-1">
                <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                <span>{center.address}</span>
              </p>
              <div className="flex items-center gap-3 mt-2 text-xs font-mono text-slate-300">
                <a
                  href={`tel:${center.contactNumber}`}
                  className="text-amber-400 font-bold hover:underline flex items-center gap-1"
                >
                  <Phone className="w-3 h-3" />
                  {center.contactNumber}
                </a>
                <span className="text-[11px] text-slate-500">
                  {center.lat?.toFixed(4)}, {center.lng?.toFixed(4)}
                </span>
              </div>
            </div>

            <button
              onClick={() => handleDelete(center._id, center.name)}
              className="p-2 rounded-xl hover:bg-crimson-500/20 text-slate-500 hover:text-crimson-400 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ServiceCenterManager;
