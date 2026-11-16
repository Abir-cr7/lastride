import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { fetchLiveWeather } from '../services/weatherService';
import {
  ShieldAlert,
  Flame,
  PhoneCall,
  LogIn,
  UserPlus,
  LogOut,
  User,
  ShieldCheck,
  CloudSun,
  Menu,
  X,
  Radio,
  LayoutDashboard,
} from 'lucide-react';

const Navbar = () => {
  const { user, isAuthenticated, isAdmin, openLoginModal, openSignupModal, logout } = useAuth();
  const [weather, setWeather] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const loadWeather = async () => {
      const data = await fetchLiveWeather();
      if (isMounted) setWeather(data);
    };
    loadWeather();

    const interval = setInterval(loadWeather, 5 * 60 * 1000);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  const scrollToSection = (id) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-[#080B12]/80 backdrop-blur-xl border-b border-white/10 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        
        {/* Brand Logo */}
        <div 
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="relative flex items-center justify-center w-11 h-11 rounded-xl bg-gradient-to-br from-amber-500/20 to-cyan-500/10 border border-amber-500/40 group-hover:border-amber-400 group-hover:shadow-[0_0_20px_rgba(245,158,11,0.5)] transition-all duration-300">
            <ShieldAlert className="w-6 h-6 text-amber-400 group-hover:scale-110 transition-transform duration-300" />
            <span className="absolute -bottom-1 -right-1 w-3 h-3 bg-cyan-400 rounded-full animate-ping opacity-75"></span>
            <span className="absolute -bottom-1 -right-1 w-3 h-3 bg-cyan-400 rounded-full"></span>
          </div>

          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xl font-black tracking-wider uppercase text-white font-mono">
                RIDER<span className="text-amber-400">RESCUE</span>
              </span>
            </div>
            <p className="text-[10px] tracking-widest uppercase text-slate-400 font-semibold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              24/7 Roadside Network
            </p>
          </div>
        </div>

        {/* Center: Live Weather Badge & Quick Anchors */}
        <div className="hidden md:flex items-center gap-6">
          {/* Weather Pill */}
          {weather && (
            <div 
              onClick={() => scrollToSection('weather-hub')}
              title="Click to view live weather advisory"
              className="flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 hover:border-cyan-500/40 hover:bg-cyan-500/5 cursor-pointer transition-all duration-200 group"
            >
              <div className="relative">
                <CloudSun className="w-4 h-4 text-cyan-400 group-hover:rotate-12 transition-transform" />
              </div>
              <div className="flex items-center gap-1.5 text-xs">
                <span className="font-semibold text-white font-mono">{weather.temperature}°C</span>
                <span className="text-slate-400 text-[11px]">•</span>
                <span className="text-slate-300 text-[11px]">{weather.condition}</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300 font-mono">
                  Ashulia
                </span>
              </div>
            </div>
          )}

          {/* Quick Nav Anchors */}
          <nav className="flex items-center gap-5 text-sm font-medium text-slate-300">
            <button
              onClick={() => scrollToSection('live-hub')}
              className="hover:text-amber-400 transition-colors flex items-center gap-1.5"
            >
              <Radio className="w-4 h-4 text-amber-400/80" />
              Live Hub
            </button>
            <button
              onClick={() => scrollToSection('fuel-rates')}
              className="hover:text-amber-400 transition-colors flex items-center gap-1.5"
            >
              <Flame className="w-4 h-4 text-amber-400/80" />
              Fuel Rates
            </button>
            <button
              onClick={() => scrollToSection('emergency-helplines')}
              className="hover:text-crimson-400 transition-colors flex items-center gap-1.5"
            >
              <PhoneCall className="w-4 h-4 text-crimson-400/80" />
              Helplines
            </button>
          </nav>
        </div>

        {/* Right Action Buttons */}
        <div className="hidden sm:flex items-center gap-3">
          {!isAuthenticated ? (
            <>
              <button
                onClick={() => openLoginModal('user')}
                className="px-4 py-2 text-sm font-medium text-slate-200 hover:text-white rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 transition-all duration-200 flex items-center gap-2"
              >
                <LogIn className="w-4 h-4 text-cyan-400" />
                Login
              </button>

              <button
                onClick={openSignupModal}
                className="px-5 py-2 text-sm font-semibold text-slate-950 rounded-xl bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-300 hover:to-amber-500 shadow-[0_0_20px_rgba(245,158,11,0.4)] hover:shadow-[0_0_25px_rgba(245,158,11,0.6)] transition-all duration-200 flex items-center gap-2"
              >
                <UserPlus className="w-4 h-4" />
                Sign Up
              </button>
            </>
          ) : (
            <div className="flex items-center gap-3">
              {isAdmin ? (
                <Link
                  to="/admin"
                  className="px-3.5 py-2 text-xs font-mono font-bold text-cyan-300 rounded-xl bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-500/40 transition-all flex items-center gap-1.5 shadow-[0_0_15px_rgba(6,182,212,0.3)]"
                >
                  <ShieldCheck className="w-4 h-4" />
                  Admin HQ
                </Link>
              ) : (
                <Link
                  to="/dashboard"
                  className="px-3.5 py-2 text-xs font-mono font-bold text-amber-300 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/40 transition-all flex items-center gap-1.5 shadow-[0_0_15px_rgba(245,158,11,0.3)]"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  Rider Dashboard
                </Link>
              )}

              {/* User badge */}
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10">
                <div className="w-7 h-7 rounded-lg bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
                  {isAdmin ? <ShieldCheck className="w-4 h-4" /> : <User className="w-4 h-4" />}
                </div>
                <div className="text-left">
                  <p className="text-xs font-semibold text-white leading-tight">
                    {user?.name?.split(' ')[0]}
                  </p>
                  <span className={`text-[10px] font-mono uppercase font-bold ${isAdmin ? 'text-amber-400' : 'text-cyan-400'}`}>
                    {user?.role}
                  </span>
                </div>
              </div>

              {/* Logout button */}
              <button
                onClick={logout}
                title="Log out"
                className="p-2 rounded-xl bg-white/5 hover:bg-crimson-500/10 border border-white/10 hover:border-crimson-500/30 text-slate-400 hover:text-crimson-400 transition-all duration-200"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        {/* Mobile Hamburger toggle */}
        <div className="flex sm:hidden items-center gap-2">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-xl bg-white/5 border border-white/10 text-slate-300"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="sm:hidden px-4 pt-2 pb-6 bg-[#080B12]/95 border-b border-white/10 space-y-3">
          {weather && (
            <div className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/10">
              <div className="flex items-center gap-2">
                <CloudSun className="w-5 h-5 text-cyan-400" />
                <span className="text-xs text-slate-200 font-medium">Ashulia Live Weather</span>
              </div>
              <span className="text-sm font-bold text-amber-400 font-mono">{weather.temperature}°C</span>
            </div>
          )}

          <div className="grid grid-cols-2 gap-2 pt-2">
            <button
              onClick={() => scrollToSection('live-hub')}
              className="p-3 text-left rounded-xl bg-white/5 border border-white/10 text-xs text-slate-200"
            >
              Live Hub
            </button>
            <button
              onClick={() => scrollToSection('fuel-rates')}
              className="p-3 text-left rounded-xl bg-white/5 border border-white/10 text-xs text-slate-200"
            >
              Fuel Rates
            </button>
            <button
              onClick={() => scrollToSection('emergency-helplines')}
              className="col-span-2 p-3 text-left rounded-xl bg-crimson-500/10 border border-crimson-500/30 text-xs text-crimson-300 font-semibold"
            >
              Emergency Helplines (999)
            </button>
          </div>

          <div className="pt-2 border-t border-white/10 flex flex-col gap-2">
            {!isAuthenticated ? (
              <>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    openLoginModal('user');
                  }}
                  className="w-full py-2.5 text-center text-sm font-semibold rounded-xl bg-white/10 text-white"
                >
                  Login
                </button>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    openSignupModal();
                  }}
                  className="w-full py-2.5 text-center text-sm font-semibold rounded-xl bg-amber-500 text-slate-950"
                >
                  Sign Up
                </button>
              </>
            ) : (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  logout();
                }}
                className="w-full py-2.5 text-center text-sm font-semibold rounded-xl bg-crimson-500/20 text-crimson-300 border border-crimson-500/30"
              >
                Sign Out ({user?.name})
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
