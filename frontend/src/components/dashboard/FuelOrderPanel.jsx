import React, { useState, useEffect } from 'react';
import { requestService, publicService } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { Fuel, MapPin, RefreshCw, CheckCircle2, AlertCircle, ArrowRight, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

const FuelOrderPanel = ({ userCoords, onRequestCreated }) => {
  const { user } = useAuth();
  const [fuels, setFuels] = useState([]);
  const [selectedFuel, setSelectedFuel] = useState('Octane');
  const [quantity, setQuantity] = useState(5);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Fetch current fuel prices from backend
  useEffect(() => {
    const loadFuels = async () => {
      try {
        const res = await publicService.getFuels();
        const data = res.data?.data || res.data || [];
        setFuels(data);
        if (data.length > 0 && !selectedFuel) {
          setSelectedFuel(data[0].name);
        }
      } catch (err) {
        console.warn('Using fallback fuels for panel:', err.message);
        setFuels([
          { name: 'Octane', pricePerLiter: 130, unit: 'Liter' },
          { name: 'Petrol', pricePerLiter: 125, unit: 'Liter' },
          { name: 'Diesel', pricePerLiter: 105, unit: 'Liter' },
        ]);
      }
    };
    loadFuels();
  }, []);

  const currentFuelObj = fuels.find((f) => f.name === selectedFuel) || {
    pricePerLiter: 130,
    unit: 'Liter',
  };
  const totalPrice = (Number(quantity) * (currentFuelObj.pricePerLiter || 130)).toLocaleString();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    try {
      const lat = userCoords?.lat || 23.9315;
      const lng = userCoords?.lng || 90.2707;

      await requestService.createRequest({
        type: 'fuel_order',
        fuelType: selectedFuel,
        quantity: Number(quantity),
        lat,
        lng,
        userName: user?.name,
        userPhone: user?.phone,
      });

      setSuccess(`Success! Dispatched order for ${quantity}L ${selectedFuel}.`);
      if (onRequestCreated) onRequestCreated();
    } catch (err) {
      setError(err.message || 'Failed to place fuel order.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass-card rounded-3xl p-6 sm:p-7 border border-white/10 relative overflow-hidden flex flex-col justify-between group hover:border-amber-500/30 transition-all">
      {/* Background Amber Glow */}
      <div className="absolute top-0 right-0 w-44 h-44 bg-amber-500/10 rounded-full blur-3xl pointer-events-none group-hover:bg-amber-500/15 transition-all"></div>

      <div>
        {/* Header */}
        <div className="flex items-center gap-3 mb-5">
          <div className="p-3 rounded-2xl bg-amber-500/20 border border-amber-500/40 text-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.3)]">
            <Fuel className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white uppercase tracking-wide">
              Order Fuel Dispatch
            </h3>
            <p className="text-xs text-slate-400">
              Direct mobile delivery to your live GPS coordinates
            </p>
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
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Fuel Type Selector */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2 font-mono">
              Select Fuel Type
            </label>
            <div className="grid grid-cols-3 gap-2">
              {['Octane', 'Petrol', 'Diesel'].map((fuelName) => {
                const fuelData = fuels.find((f) => f.name === fuelName);
                const price = fuelData ? fuelData.pricePerLiter : 125;
                const isSelected = selectedFuel === fuelName;

                return (
                  <button
                    key={fuelName}
                    type="button"
                    onClick={() => setSelectedFuel(fuelName)}
                    className={`p-3 rounded-2xl border text-left transition-all ${
                      isSelected
                        ? 'bg-amber-500/20 border-amber-400 text-white shadow-[0_0_15px_rgba(245,158,11,0.3)]'
                        : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10'
                    }`}
                  >
                    <span className="block text-xs font-bold font-mono uppercase">{fuelName}</span>
                    <span className="text-sm font-black font-mono text-amber-400 mt-1 block">
                      ৳{price}
                      <span className="text-[10px] text-slate-400 font-normal">/L</span>
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Quantity Selector & Quick Chips */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider font-mono">
                Quantity (Liters)
              </label>
              <div className="flex gap-1.5 font-mono text-xs">
                {[2, 3, 5, 10].map((liters) => (
                  <button
                    key={liters}
                    type="button"
                    onClick={() => setQuantity(liters)}
                    className={`px-2 py-0.5 rounded-lg border transition-all ${
                      quantity === liters
                        ? 'bg-amber-500 text-slate-950 font-bold border-amber-400'
                        : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'
                    }`}
                  >
                    {liters}L
                  </button>
                ))}
              </div>
            </div>

            <input
              type="number"
              min="1"
              max="20"
              required
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-base font-mono font-bold focus:outline-none focus:border-amber-400 transition-all"
            />
          </div>

          {/* Delivery Coordinates Badge */}
          <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-xs text-slate-300 flex items-center justify-between font-mono">
            <span className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-cyan-400" />
              Pin: {userCoords?.lat?.toFixed(4) || '23.9315'}, {userCoords?.lng?.toFixed(4) || '90.2707'}
            </span>
            <span className="text-emerald-400 font-semibold">Live GPS Active</span>
          </div>

          {/* Live Price Estimation & Submit */}
          <div className="pt-2">
            <div className="flex items-baseline justify-between mb-3 font-mono">
              <span className="text-xs text-slate-400 uppercase">Estimated Total</span>
              <span className="text-2xl font-black text-amber-400">
                ৳{totalPrice} <span className="text-xs font-normal text-slate-400">BDT</span>
              </span>
            </div>

            <button
              type="submit"
              disabled={loading || !quantity || quantity <= 0}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 disabled:opacity-50 text-slate-950 font-bold text-sm uppercase tracking-wider shadow-[0_0_20px_rgba(245,158,11,0.4)] transition-all flex items-center justify-center gap-2"
            >
              {loading ? (
                <RefreshCw className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  <span>Dispatch {quantity}L {selectedFuel}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      <p className="mt-4 text-[11px] text-slate-500 text-center font-mono">
        Patrol units carry sealed emergency containers with calibrated meters
      </p>
    </div>
  );
};

export default FuelOrderPanel;
