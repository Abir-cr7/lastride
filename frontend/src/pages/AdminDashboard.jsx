import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { adminService } from '../services/api';
import AdminStatsCards from '../components/admin/AdminStatsCards';
import FuelManager from '../components/admin/FuelManager';
import RiderRequestsQueue from '../components/admin/RiderRequestsQueue';
import UserManagementTable from '../components/admin/UserManagementTable';
import ServiceCenterManager from '../components/admin/ServiceCenterManager';
import AlertBroadcastForm from '../components/admin/AlertBroadcastForm';
import {
  ShieldAlert,
  ShieldCheck,
  Fuel,
  Users,
  Wrench,
  Radio,
  ArrowLeft,
  LogOut,
  RefreshCw,
  LayoutDashboard,
} from 'lucide-react';
import { Link } from 'react-router-dom';

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('overview'); // overview, queue, fuels, users, centers, alerts

  const [stats, setStats] = useState({});
  const [fuels, setFuels] = useState([]);
  const [requests, setRequests] = useState([]);
  const [users, setUsers] = useState([]);
  const [centers, setCenters] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAllData = async () => {
    setLoading(true);
    try {
      const [sRes, fRes, rRes, uRes, cRes, aRes] = await Promise.all([
        adminService.getStats(),
        adminService.getFuels(),
        adminService.getRequests(),
        adminService.getUsers(),
        adminService.getServiceCenters(),
        adminService.getAlerts(),
      ]);

      setStats(sRes.data?.data || {});
      setFuels(fRes.data?.data || fRes.data || []);
      setRequests(rRes.data?.data || rRes.data || []);
      setUsers(uRes.data?.data || uRes.data || []);
      setCenters(cRes.data?.data || cRes.data || []);
      setAlerts(aRes.data?.data || aRes.data || []);
    } catch (err) {
      console.warn('Error loading admin dashboard data:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
    const interval = setInterval(fetchAllData, 15000); // 15s refresh
    return () => clearInterval(interval);
  }, []);

  const pendingCount = requests.filter((r) => r.status === 'pending').length;

  return (
    <div className="min-h-screen bg-[#080B12] text-slate-100 flex flex-col font-sans selection:bg-cyan-500/30">
      
      {/* Top Header */}
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
              <div className="w-9 h-9 rounded-xl bg-cyan-500/20 border border-cyan-500/40 text-cyan-400 flex items-center justify-center font-bold shadow-[0_0_15px_rgba(6,182,212,0.3)]">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h1 className="text-base font-black tracking-wider uppercase font-mono text-white">
                  COMMAND<span className="text-cyan-400">HQ</span>
                </h1>
                <p className="text-[10px] text-slate-400 font-mono tracking-widest uppercase">
                  Central Admin Operations Panel
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/dashboard"
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-300 text-xs font-mono font-bold transition-all"
            >
              Rider Tactical View
            </Link>

            <button
              onClick={fetchAllData}
              disabled={loading}
              title="Refresh telemetry"
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-400 hover:text-cyan-400 transition-colors"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-cyan-400' : ''}`} />
            </button>

            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-xs font-mono">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
              <span className="text-white font-semibold">{user?.name}</span>
              <span className="text-cyan-400 uppercase font-bold text-[10px]">• Admin</span>
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

      {/* Main Workspace */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6 w-full flex-1">
        
        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none font-mono text-xs">
          {[
            { id: 'overview', label: 'All-in-One Command', icon: LayoutDashboard },
            { id: 'queue', label: `Dispatch Queue (${pendingCount})`, icon: ShieldAlert, badge: pendingCount > 0 },
            { id: 'fuels', label: 'Fuel Rates', icon: Fuel },
            { id: 'users', label: 'User Directory', icon: Users },
            { id: 'centers', label: 'Rescue Hubs', icon: Wrench },
            { id: 'alerts', label: 'Broadcasts', icon: Radio },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-2 px-4 rounded-xl border font-bold uppercase tracking-wider flex items-center gap-2 shrink-0 transition-all ${
                  isActive
                    ? 'bg-cyan-500 text-slate-950 border-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.4)]'
                    : 'bg-white/5 border-white/10 text-slate-400 hover:text-white hover:bg-white/10'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
                {tab.badge && (
                  <span className="w-2 h-2 rounded-full bg-crimson-400 animate-ping"></span>
                )}
              </button>
            );
          })}
        </div>

        {/* 1. KPI Overview Cards (Always present at top) */}
        <AdminStatsCards stats={stats} />

        {/* Dynamic Views based on Selected Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Queue & SOS Active */}
            <RiderRequestsQueue
              requests={requests}
              onRefresh={fetchAllData}
              loading={loading}
            />

            {/* Fuels & Alerts in Bento Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-6">
                <FuelManager
                  fuels={fuels}
                  onRefresh={fetchAllData}
                />
              </div>
              <div className="lg:col-span-6">
                <AlertBroadcastForm
                  alerts={alerts}
                  onRefresh={fetchAllData}
                  loading={loading}
                />
              </div>
            </div>

            {/* User Directory */}
            <UserManagementTable
              users={users}
              onRefresh={fetchAllData}
              loading={loading}
            />

            {/* Service Center Garages */}
            <ServiceCenterManager
              centers={centers}
              onRefresh={fetchAllData}
              loading={loading}
            />
          </div>
        )}

        {activeTab === 'queue' && (
          <RiderRequestsQueue
            requests={requests}
            onRefresh={fetchAllData}
            loading={loading}
          />
        )}

        {activeTab === 'fuels' && (
          <FuelManager
            fuels={fuels}
            onRefresh={fetchAllData}
          />
        )}

        {activeTab === 'users' && (
          <UserManagementTable
            users={users}
            onRefresh={fetchAllData}
            loading={loading}
          />
        )}

        {activeTab === 'centers' && (
          <ServiceCenterManager
            centers={centers}
            onRefresh={fetchAllData}
            loading={loading}
          />
        )}

        {activeTab === 'alerts' && (
          <AlertBroadcastForm
            alerts={alerts}
            onRefresh={fetchAllData}
            loading={loading}
          />
        )}

      </main>

      {/* Footer */}
      <footer className="py-6 border-t border-white/5 text-center text-xs font-mono text-slate-500">
        Rider Rescue Central Admin Terminal • Encrypted Operations
      </footer>
    </div>
  );
};

export default AdminDashboard;
