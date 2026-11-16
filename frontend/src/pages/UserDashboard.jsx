import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { publicService, requestService } from '../services/api';
import LiveWeatherAlertBar from '../components/dashboard/LiveWeatherAlertBar';
import RiderMap from '../components/dashboard/RiderMap';
import FuelOrderPanel from '../components/dashboard/FuelOrderPanel';
import EmergencySosButton from '../../src/components/dashboard/EmergencySosButton';
import MyRequestsList from '../components/dashboard/MyRequestsList';
import { ShieldAlert, LogOut, ArrowLeft, User, Navigation, ShieldCheck } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const UserDashboard = () => {
  const { user, isAdmin, logout } = useAuth();
  const navigate = useNavigate();

  const [userCoords, setUserCoords] = useState({ lat: 23.9315, lng: 90.2707 });
  const [serviceCenters, setServiceCenters] = useState([]);
  const [fuels, setFuels] = useState([]);
  const [requests, setRequests] = useState([]);
  const [loadingRequests, setLoadingRequests] = useState(false);

  // 1. Detect and Watch Live GPS Coordinates
  useEffect(() => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setUserCoords({
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
          });
        },
        (err) => {
          console.warn('Geolocation fallback to Ashulia, Dhaka:', err.message);
        },
        { enableHighAccuracy: true }
      );
    }
  }, []);

  const handleRecenter = () => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition((pos) => {
        setUserCoords({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        });
      });
    }
  };

  // 2. Fetch service centers & fuels
  useEffect(() => {
    const loadInfrastructure = async () => {
      try {
        const [cRes, fRes] = await Promise.all([
          publicService.getServiceCenters(),
          publicService.getFuels(),
        ]);
        setServiceCenters(cRes.data?.data || cRes.data || []);
        setFuels(fRes.data?.data || fRes.data || []);
      } catch (err) {
        console.warn('Error loading infrastructure:', err.message);
      }
    };
    loadInfrastructure();
  }, []);

  // 3. Fetch user's requests
  const loadMyRequests = async () => {
    try {
      setLoadingRequests(true);
      const res = await requestService.getMyRequests();
      setRequests(res.data?.data || res.data || []);
    } catch (err) {
      console.warn('Error loading my requests:', err.message);
    } finally {
      setLoadingRequests(false);
    }
  };

  useEffect(() => {
    loadMyRequests();
    const interval = setInterval(loadMyRequests, 15000); // 15s poll
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-[#080B12] text-slate-100 flex flex-col font-sans selection:bg-amber-500/30">
      
      {/* Top Navbar */}
      <header className="sticky top-0 z-40 w-full bg-[#080B12]/85 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          
          <div className="flex items-center gap-4">
            <Link
              to="/"
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors flex items-center gap-1.5 text-xs font-mono"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Landing</span>
            </Link>

            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-400 flex items-center justify-center font-bold">
                <ShieldAlert className="w-5 h-5" />
              </div>
              <div>
                <h1 className="text-base font-black tracking-wider uppercase font-mono text-white">
                  Rider<span className="text-amber-400">Hub</span>
                </h1>
                <p className="text-[10px] text-slate-400 font-mono tracking-widest uppercase">
                  Telemetry & Dispatch Terminal
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {isAdmin && (
              <Link
                to="/admin"
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 text-xs font-mono font-bold transition-all"
              >
                <ShieldCheck className="w-4 h-4" />
                Admin Dashboard
              </Link>
            )}

            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-xs font-mono">
              <User className="w-3.5 h-3.5 text-amber-400" />
              <span className="text-white font-semibold">{user?.name}</span>
              <span className="text-slate-500">•</span>
              <span className="text-cyan-400 uppercase font-bold">{user?.role}</span>
            </div>

            <button
              onClick={logout}
              title="Logout"
              className="p-2 rounded-xl bg-white/5 hover:bg-crimson-500/20 text-slate-400 hover:text-crimson-400 border border-white/10 transition-colors"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Dashboard Workspace */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6 w-full flex-1">
        
        {/* 1. Top Live Weather & Admin Alert Bar */}
        <LiveWeatherAlertBar userCoords={userCoords} />

        {/* 2. Large Interactive Dark-Mode Map (React-Leaflet with CartoDB Dark Matter) */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-300 font-mono flex items-center gap-2">
              <Navigation className="w-4 h-4 text-cyan-400" />
              Live Highway Tactical Map (Ashulia / Dhaka)
            </h2>
            <span className="text-xs font-mono text-slate-400">
              CartoDB Dark Matter Tiles • GPS Active
            </span>
          </div>

          <RiderMap
            userCoords={userCoords}
            serviceCenters={serviceCenters}
            fuels={fuels}
            onRecenter={handleRecenter}
            onSelectLocation={(lat, lng) => setUserCoords({ lat, lng })}
          />
        </div>

        {/* 3. Action Panels: Order Fuel & Emergency SOS */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7">
            <FuelOrderPanel
              userCoords={userCoords}
              onRequestCreated={loadMyRequests}
            />
          </div>
          <div className="lg:col-span-5">
            <EmergencySosButton
              userCoords={userCoords}
              onRequestCreated={loadMyRequests}
            />
          </div>
        </div>

        {/* 4. My Requests List & Rating/Review Form */}
        <div>
          <MyRequestsList
            requests={requests}
            loading={loadingRequests}
            onRefresh={loadMyRequests}
          />
        </div>

      </main>

      {/* Minimal Footer */}
      <footer className="py-6 border-t border-white/5 text-center text-xs font-mono text-slate-500">
        Rider Rescue Telemetry Grid • Connected to MongoDB Atlas & Satellite Weather
      </footer>
    </div>
  );
};

export default UserDashboard;
