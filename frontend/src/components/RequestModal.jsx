import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { requestService } from '../services/api';
import {
  X,
  ShieldAlert,
  Fuel,
  MapPin,
  Phone,
  User,
  CheckCircle2,
  RefreshCw,
  AlertCircle,
  Navigation,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const RequestModal = ({ isOpen, onClose, initialType = 'fuel_order', initialFuel = 'Octane' }) => {
  const { user, isAuthenticated, openLoginModal } = useAuth();

  const [type, setType] = useState(initialType);
  const [fuelType, setFuelType] = useState(initialFuel);
  const [quantity, setQuantity] = useState(3);
  const [lat, setLat] = useState(23.9315);
  const [lng, setLng] = useState(90.2707);
  const [locationLabel, setLocationLabel] = useState('Baipail, Ashulia, Dhaka');
  const [detectingGps, setDetectingGps] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [createdRequest, setCreatedRequest] = useState(null);

  useEffect(() => {
    if (isOpen) {
      setType(initialType);
      if (initialFuel) setFuelType(initialFuel);
      setError(null);
      setCreatedRequest(null);
    }
  }, [isOpen, initialType, initialFuel]);

  if (!isOpen) return null;

  const handleDetectGps = () => {
    if ('geolocation' in navigator) {
      setDetectingGps(true);
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setLat(pos.coords.latitude);
          setLng(pos.coords.longitude);
          setLocationLabel(`Live GPS (${pos.coords.latitude.toFixed(4)}, ${pos.coords.longitude.toFixed(4)})`);
          setDetectingGps(false);
        },
        (err) => {
          console.warn('GPS error:', err.message);
          setDetectingGps(false);
          setError('GPS location denied. Defaulting to Ashulia coordinates.');
        }
      );
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      onClose();
      openLoginModal('user');
      return;
    }

    setError(null);
    setLoading(true);

    try {
      const payload = {
        type,
        lat: Number(lat),
        lng: Number(lng),
        userName: user?.name,
        userPhone: user?.phone,
        ...(type === 'fuel_order' ? { fuelType, quantity: Number(quantity) } : {}),
      };

      const res = await requestService.createRequest(payload);
      setCreatedRequest(res.data.data);
    } catch (err) {
      setError(err.message || 'Failed to submit dispatch request');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/85 backdrop-blur-xl"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 15 }}
          className="relative w-full max-w-lg rounded-3xl bg-[#0D111A]/95 border border-white/10 p-6 sm:p-8 shadow-2xl z-10 overflow-hidden"
        >
          {/* Close */}
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>

          {createdRequest ? (
            /* Success State */
            <div className="text-center py-6">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-black text-white uppercase">
                Dispatch Dispatched!
              </h3>
              <p className="text-xs text-slate-300 mt-2 max-w-xs mx-auto">
                Your request has been routed to the nearest patrol unit in Ashulia/Dhaka.
              </p>

              <div className="my-6 p-4 rounded-2xl bg-white/5 border border-white/10 text-left font-mono text-xs space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-400">Request ID:</span>
                  <span className="text-white font-bold">{createdRequest._id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Type:</span>
                  <span className="text-amber-400 uppercase font-bold">{createdRequest.type}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Status:</span>
                  <span className="text-cyan-400 uppercase font-bold">{createdRequest.status}</span>
                </div>
                {createdRequest.fuelType && (
                  <div className="flex justify-between">
                    <span className="text-slate-400">Fuel:</span>
                    <span className="text-white">{createdRequest.quantity}L {createdRequest.fuelType}</span>
                  </div>
                )}
              </div>

              <button
                onClick={onClose}
                className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs uppercase tracking-wider"
              >
                Close & Track Patrol
              </button>
            </div>
          ) : (
            /* Request Form */
            <div>
              <div className="text-center mb-6">
                <div
                  className={`inline-flex items-center justify-center w-12 h-12 rounded-2xl border mb-3 ${
                    type === 'emergency_rescue'
                      ? 'bg-crimson-500/20 border-crimson-500/40 text-crimson-400'
                      : 'bg-amber-500/20 border-amber-500/40 text-amber-400'
                  }`}
                >
                  {type === 'emergency_rescue' ? (
                    <ShieldAlert className="w-6 h-6 animate-pulse" />
                  ) : (
                    <Fuel className="w-6 h-6" />
                  )}
                </div>
                <h3 className="text-2xl font-black text-white uppercase tracking-wide">
                  {type === 'emergency_rescue' ? 'Emergency Roadside SOS' : 'On-Demand Fuel Delivery'}
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Verified patrol dispatched directly to your GPS coordinates
                </p>
              </div>

              {/* Toggle Request Type */}
              <div className="grid grid-cols-2 gap-2 p-1.5 rounded-2xl bg-white/5 border border-white/10 mb-5">
                <button
                  type="button"
                  onClick={() => setType('fuel_order')}
                  className={`py-2 px-3 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all ${
                    type === 'fuel_order'
                      ? 'bg-amber-500 text-slate-950 shadow-[0_0_15px_rgba(245,158,11,0.4)]'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Fuel className="w-4 h-4" />
                  <span>Fuel Delivery</span>
                </button>
                <button
                  type="button"
                  onClick={() => setType('emergency_rescue')}
                  className={`py-2 px-3 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all ${
                    type === 'emergency_rescue'
                      ? 'bg-crimson-600 text-white shadow-[0_0_15px_rgba(239,68,68,0.4)]'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <ShieldAlert className="w-4 h-4" />
                  <span>Breakdown SOS</span>
                </button>
              </div>

              {error && (
                <div className="mb-4 p-3 rounded-xl bg-crimson-500/10 border border-crimson-500/30 text-crimson-300 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                {type === 'fuel_order' && (
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 uppercase mb-1 font-mono">
                        Fuel Type
                      </label>
                      <select
                        value={fuelType}
                        onChange={(e) => setFuelType(e.target.value)}
                        className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-amber-400 font-mono"
                      >
                        <option value="Octane" className="bg-[#0D111A]">Octane</option>
                        <option value="Petrol" className="bg-[#0D111A]">Petrol</option>
                        <option value="Diesel" className="bg-[#0D111A]">Diesel</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 uppercase mb-1 font-mono">
                        Quantity (Liters)
                      </label>
                      <input
                        type="number"
                        min="1"
                        max="20"
                        value={quantity}
                        onChange={(e) => setQuantity(e.target.value)}
                        className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-amber-400 font-mono"
                      />
                    </div>
                  </div>
                )}

                {/* GPS Location Bar */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-semibold text-slate-300 uppercase font-mono">
                      Dispatch Location
                    </label>
                    <button
                      type="button"
                      onClick={handleDetectGps}
                      disabled={detectingGps}
                      className="text-[11px] font-mono text-cyan-400 hover:underline flex items-center gap-1"
                    >
                      <Navigation className="w-3 h-3" />
                      {detectingGps ? 'Pinpointing...' : 'Detect GPS'}
                    </button>
                  </div>
                  <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-xs text-slate-200 flex items-center justify-between font-mono">
                    <span className="flex items-center gap-1.5 truncate">
                      <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                      {locationLabel}
                    </span>
                    <span className="text-[10px] text-slate-400">
                      {lat.toFixed(3)}, {lng.toFixed(3)}
                    </span>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full py-3.5 rounded-xl font-bold text-sm uppercase tracking-wider transition-all flex items-center justify-center gap-2 ${
                    type === 'emergency_rescue'
                      ? 'bg-crimson-600 hover:bg-crimson-500 text-white shadow-[0_0_20px_rgba(239,68,68,0.5)]'
                      : 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-[0_0_20px_rgba(245,158,11,0.5)]'
                  }`}
                >
                  {loading ? (
                    <RefreshCw className="w-5 h-5 animate-spin" />
                  ) : (
                    <span>
                      {type === 'emergency_rescue' ? 'Confirm Emergency Rescue' : 'Confirm Fuel Order'}
                    </span>
                  )}
                </button>
              </form>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default RequestModal;
