import React, { useState, useEffect } from 'react';
import { fetchLiveWeather, DEFAULT_COORDS } from '../services/weatherService';
import {
  CloudSun,
  CloudRain,
  Sun,
  Cloud,
  CloudLightning,
  Wind,
  Droplets,
  MapPin,
  RefreshCw,
  Navigation,
  ShieldCheck,
  AlertTriangle,
} from 'lucide-react';
import { motion } from 'framer-motion';

const WeatherWidget = () => {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [useGps, setUseGps] = useState(false);
  const [gpsError, setGpsError] = useState(null);

  const loadWeather = async (coords = DEFAULT_COORDS, name = DEFAULT_COORDS.name) => {
    setLoading(true);
    setGpsError(null);
    const data = await fetchLiveWeather(coords.lat, coords.lng, name);
    setWeather(data);
    setLoading(false);
  };

  useEffect(() => {
    loadWeather();
  }, []);

  const handleToggleGps = () => {
    if (!useGps) {
      if ('geolocation' in navigator) {
        setLoading(true);
        navigator.geolocation.getCurrentPosition(
          (pos) => {
            setUseGps(true);
            loadWeather(
              { lat: pos.coords.latitude, lng: pos.coords.longitude },
              'Your GPS Coordinates'
            );
          },
          (err) => {
            console.warn('Geolocation permission denied:', err.message);
            setGpsError('GPS access denied. Showing Ashulia weather.');
            setUseGps(false);
            setLoading(false);
          }
        );
      } else {
        setGpsError('Geolocation is not supported by your browser.');
      }
    } else {
      setUseGps(false);
      loadWeather(DEFAULT_COORDS, DEFAULT_COORDS.name);
    }
  };

  const renderIcon = (iconName) => {
    switch (iconName) {
      case 'Sun':
        return <Sun className="w-10 h-10 text-amber-400 animate-spin-slow" />;
      case 'CloudSun':
        return <CloudSun className="w-10 h-10 text-cyan-400" />;
      case 'CloudRain':
      case 'CloudDrizzle':
        return <CloudRain className="w-10 h-10 text-cyan-400 animate-bounce" />;
      case 'CloudLightning':
        return <CloudLightning className="w-10 h-10 text-crimson-400 animate-pulse" />;
      default:
        return <Cloud className="w-10 h-10 text-slate-300" />;
    }
  };

  const getSeverityBadge = (severity) => {
    switch (severity) {
      case 'critical':
        return {
          bg: 'bg-crimson-500/10 border-crimson-500/30 text-crimson-400',
          icon: <AlertTriangle className="w-3.5 h-3.5 text-crimson-400" />,
        };
      case 'warning':
        return {
          bg: 'bg-amber-500/10 border-amber-500/30 text-amber-400',
          icon: <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />,
        };
      default:
        return {
          bg: 'bg-cyan-500/10 border-cyan-500/30 text-cyan-300',
          icon: <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />,
        };
    }
  };

  return (
    <div id="weather-hub" className="glass-card rounded-3xl p-6 sm:p-7 relative overflow-hidden flex flex-col justify-between h-full border border-white/10 group hover:border-cyan-500/30 transition-all duration-300">
      {/* Background Cyan Glow */}
      <div className="absolute top-0 right-0 w-48 h-48 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none group-hover:bg-cyan-500/20 transition-all duration-500"></div>

      <div>
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-xl bg-cyan-500/20 border border-cyan-500/40 text-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.3)]">
              <CloudSun className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white tracking-wide flex items-center gap-2">
                Live Highway Weather
                <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                  Open-Meteo
                </span>
              </h3>
              <p className="text-xs text-slate-400 flex items-center gap-1">
                <MapPin className="w-3 h-3 text-cyan-400" />
                {weather?.location || 'Ashulia, Dhaka'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleToggleGps}
              title={useGps ? 'Switch to Ashulia default' : 'Detect GPS location'}
              className={`p-2 rounded-xl border transition-all text-xs flex items-center gap-1.5 ${
                useGps
                  ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300'
                  : 'bg-white/5 hover:bg-white/10 border-white/10 text-slate-400 hover:text-white'
              }`}
            >
              <Navigation className={`w-3.5 h-3.5 ${useGps ? 'text-cyan-400 fill-cyan-400' : ''}`} />
              <span className="hidden sm:inline font-mono">{useGps ? 'Live GPS' : 'Use GPS'}</span>
            </button>

            <button
              onClick={() => loadWeather()}
              disabled={loading}
              title="Refresh weather"
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-400 hover:text-cyan-400 transition-colors"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-cyan-400' : ''}`} />
            </button>
          </div>
        </div>

        {gpsError && (
          <p className="text-[11px] text-amber-400 mb-2 font-mono">{gpsError}</p>
        )}

        {/* Current Condition Visual */}
        {weather && (
          <div className="my-3 p-4 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-2xl bg-cyan-500/10 border border-cyan-500/20">
                {renderIcon(weather.icon)}
              </div>
              <div>
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-black text-white font-mono tracking-tight">
                    {weather.temperature}°C
                  </span>
                  <span className="text-xs text-slate-400 font-mono">
                    Feels like {weather.apparentTemperature}°C
                  </span>
                </div>
                <p className="text-sm font-semibold text-cyan-300 mt-0.5">{weather.condition}</p>
              </div>
            </div>

            {/* Quick Metrics */}
            <div className="hidden sm:flex flex-col gap-1.5 text-right font-mono text-xs">
              <span className="text-slate-300 flex items-center justify-end gap-1.5">
                <Wind className="w-3.5 h-3.5 text-cyan-400" />
                {weather.windSpeed} km/h wind
              </span>
              <span className="text-slate-300 flex items-center justify-end gap-1.5">
                <Droplets className="w-3.5 h-3.5 text-cyan-400" />
                {weather.humidity}% humidity
              </span>
            </div>
          </div>
        )}

        {/* Rider Hazard Advisory Box */}
        {weather && (
          <div className={`p-3 rounded-xl border flex items-center gap-2.5 my-2 ${getSeverityBadge(weather.severity).bg}`}>
            {getSeverityBadge(weather.severity).icon}
            <div className="text-xs">
              <span className="font-semibold block">{weather.safetyNotice}</span>
            </div>
          </div>
        )}
      </div>

      {/* Footer Info */}
      <div className="pt-3 border-t border-white/10 flex items-center justify-between text-[11px] text-slate-400 font-mono">
        <span className="flex items-center gap-1">
          <Wind className="w-3.5 h-3.5 text-cyan-400" />
          Highway Gust Warning: Active
        </span>
        <span>Auto-synced via Satellite</span>
      </div>
    </div>
  );
};

export default WeatherWidget;
