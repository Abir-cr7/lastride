import React, { useState } from 'react';
import { adminService } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { Users, Shield, ShieldOff, CheckCircle2, AlertTriangle, Search, Phone } from 'lucide-react';

const UserManagementTable = ({ users = [], onRefresh, loading = false }) => {
  const { user: currentUser } = useAuth();
  const [search, setSearch] = useState('');
  const [togglingId, setTogglingId] = useState(null);

  const filtered = users.filter((u) => {
    const q = search.toLowerCase();
    return u.name?.toLowerCase().includes(q) || u.email?.toLowerCase().includes(q) || u.phone?.includes(q);
  });

  const handleToggleRestrict = async (userId, currentRestricted) => {
    setTogglingId(userId);
    try {
      await adminService.toggleRestrictUser(userId, !currentRestricted);
      if (onRefresh) onRefresh();
    } catch (err) {
      alert(err.message || 'Failed to toggle restriction.');
    } finally {
      setTogglingId(null);
    }
  };

  return (
    <div className="glass-card rounded-3xl p-6 sm:p-7 border border-white/10 relative overflow-hidden">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-2.5">
          <div className="p-2.5 rounded-xl bg-cyan-500/20 border border-cyan-500/40 text-cyan-400">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white uppercase tracking-wide">
              User & Rider Directory
            </h3>
            <p className="text-xs text-slate-400">
              Manage rider access permissions, verification state & restrictions
            </p>
          </div>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by name, email, phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-xs placeholder-slate-500 focus:outline-none focus:border-cyan-400"
          />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs font-mono">
          <thead>
            <tr className="border-b border-white/10 text-slate-400 uppercase text-[11px]">
              <th className="pb-3 pl-2">User / Name</th>
              <th className="pb-3">Contact</th>
              <th className="pb-3">Role</th>
              <th className="pb-3">Verified</th>
              <th className="pb-3">Account Status</th>
              <th className="pb-3 text-right pr-2">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {filtered.map((u) => {
              const isSelf = currentUser?._id === u._id || currentUser?.id === u._id;
              const isRestricted = !!u.isRestricted;
              const isToggling = togglingId === u._id;

              return (
                <tr key={u._id} className="hover:bg-white/5 transition-colors">
                  <td className="py-3.5 pl-2 font-sans">
                    <p className="font-bold text-white text-sm">{u.name}</p>
                    <p className="text-[11px] text-slate-400 font-mono">{u.email}</p>
                  </td>

                  <td className="py-3.5 text-slate-300">
                    <span className="flex items-center gap-1 font-mono text-slate-300">
                      <Phone className="w-3 h-3 text-cyan-400" />
                      {u.phone}
                    </span>
                  </td>

                  <td className="py-3.5">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        u.role === 'admin'
                          ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                          : 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                      }`}
                    >
                      {u.role}
                    </span>
                  </td>

                  <td className="py-3.5">
                    {u.isVerified ? (
                      <span className="text-emerald-400 flex items-center gap-1 font-semibold text-[11px]">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Verified
                      </span>
                    ) : (
                      <span className="text-slate-500 flex items-center gap-1 text-[11px]">
                        Unverified
                      </span>
                    )}
                  </td>

                  <td className="py-3.5">
                    {isRestricted ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-crimson-500/20 text-crimson-400 border border-crimson-500/30 text-[10px] font-bold">
                        <AlertTriangle className="w-3 h-3" /> Restricted
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-bold">
                        ● Active Access
                      </span>
                    )}
                  </td>

                  <td className="py-3.5 text-right pr-2">
                    {isSelf ? (
                      <span className="text-[10px] text-slate-500 italic">Current User</span>
                    ) : (
                      <button
                        onClick={() => handleToggleRestrict(u._id, isRestricted)}
                        disabled={isToggling}
                        className={`px-3 py-1.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all flex items-center gap-1.5 ml-auto ${
                          isRestricted
                            ? 'bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40'
                            : 'bg-crimson-500/20 hover:bg-crimson-500/30 text-crimson-300 border border-crimson-500/40'
                        }`}
                      >
                        {isRestricted ? (
                          <>
                            <Shield className="w-3.5 h-3.5" />
                            <span>Unrestrict</span>
                          </>
                        ) : (
                          <>
                            <ShieldOff className="w-3.5 h-3.5" />
                            <span>Restrict</span>
                          </>
                        )}
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserManagementTable;
