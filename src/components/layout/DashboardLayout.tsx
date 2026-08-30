import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Heart,
  HelpCircle,
  Calendar,
  Layers,
  User,
  Settings,
  Building2,
  PlusCircle,
  BarChart3,
  LogOut,
  Menu,
  X,
  ShieldCheck,
  ChevronRight,
  Sparkles,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useProperty } from '../../context/PropertyContext';
import { FirebaseConfigNotice } from '../common/FirebaseConfigNotice';

interface DashboardLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  children,
  title,
  subtitle,
  actions,
}) => {
  const { user, logout } = useAuth();
  const { favorites, enquiries, visitRequests } = useProperty();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const isTenant = user?.role === 'tenant';

  const tenantNavItems = [
    { label: 'Overview', path: '/tenant/dashboard', icon: LayoutDashboard },
    { label: 'Saved Stays', path: '/tenant/saved', icon: Heart, count: favorites.length },
    { label: 'My Enquiries', path: '/tenant/enquiries', icon: HelpCircle, count: enquiries.filter(e => e.status === 'responded').length },
    { label: 'Visit Requests', path: '/tenant/visits', icon: Calendar, count: visitRequests.filter(v => v.status === 'accepted').length },
    { label: 'Compare Stays', path: '/tenant/compare', icon: Layers },
    { label: 'My Profile', path: '/profile', icon: User },
  ];

  const ownerNavItems = [
    { label: 'Overview', path: '/owner/dashboard', icon: LayoutDashboard },
    { label: 'My Properties', path: '/owner/properties', icon: Building2 },
    { label: 'Add Property', path: '/owner/properties/new', icon: PlusCircle },
    { label: 'Enquiries', path: '/owner/enquiries', icon: HelpCircle, count: enquiries.filter(e => e.status === 'sent').length },
    { label: 'Visit Requests', path: '/owner/visits', icon: Calendar, count: visitRequests.filter(v => v.status === 'pending').length },
    { label: 'Analytics', path: '/owner/analytics', icon: BarChart3 },
    { label: 'Owner Profile', path: '/profile', icon: User },
  ];

  const navItems = isTenant ? tenantNavItems : ownerNavItems;

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-[#0A0A0B] text-white flex">
      {/* Mobile Backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/70 backdrop-blur-xs lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:sticky top-0 z-50 h-screen w-64 bg-[#121214] border-r border-white/10 flex flex-col justify-between transition-transform duration-300 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="p-5 overflow-y-auto">
          {/* Header in sidebar */}
          <div className="flex items-center justify-between pb-5 border-b border-white/10">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-amber-500 flex items-center justify-center text-black font-black">
                SM
              </div>
              <div>
                <span className="font-extrabold text-white text-lg tracking-tight">StayMate</span>
                <span className="block text-[10px] font-bold text-amber-400 uppercase tracking-wider">
                  {isTenant ? 'Student Portal' : 'Owner Portal'}
                </span>
              </div>
            </Link>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-1.5 text-slate-400 hover:text-white rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* User Brief card */}
          <div className="my-4 p-3 rounded-xl bg-[#161618] border border-white/10 flex items-center gap-3">
            <img
              src={user?.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.displayName || 'User')}&background=F59E0B&color=000`}
              alt={user?.displayName}
              className="w-10 h-10 rounded-lg object-cover border border-white/10"
            />
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-white truncate">{user?.displayName}</p>
              <p className="text-[11px] text-slate-400 truncate">{user?.college || user?.businessName || user?.email}</p>
            </div>
          </div>

          {/* Nav List */}
          <nav className="space-y-1">
            {navItems.map((item) => {
              const active = location.pathname === item.path;
              const Icon = item.icon;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-colors ${
                    active
                      ? 'bg-amber-500 text-black font-black shadow-md shadow-amber-500/20'
                      : 'text-slate-300 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${active ? 'text-black' : 'text-slate-400'}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.count !== undefined && item.count > 0 && (
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                        active ? 'bg-black text-amber-400' : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                      }`}
                    >
                      {item.count}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Footer Logout */}
        <div className="p-4 border-t border-white/10 space-y-2">
          <Link
            to="/explore"
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:bg-white/5 hover:text-amber-400 transition-colors"
          >
            <Sparkles className="w-4 h-4 text-amber-400" />
            Browse Public Stays
          </Link>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            Log Out
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto bg-[#0A0A0B]">
        {/* Top bar on dashboard */}
        <header className="bg-[#121214] border-b border-white/10 px-4 sm:px-8 py-4 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 text-slate-300 hover:text-white hover:bg-white/5 rounded-lg"
              aria-label="Open navigation sidebar"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div>
              <div className="flex items-center gap-2 text-xs text-slate-400 font-medium">
                <Link to="/" className="hover:text-white transition-colors">StayMate</Link>
                <ChevronRight className="w-3 h-3 text-slate-600" />
                <span className="capitalize text-amber-400">{isTenant ? 'Tenant' : 'Owner'}</span>
              </div>
              <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">{title}</h1>
              {subtitle && <p className="text-xs sm:text-sm text-slate-400 mt-0.5">{subtitle}</p>}
            </div>
          </div>

          <div className="flex items-center gap-3">
            {actions}
          </div>
        </header>

        {/* Inner Content */}
        <div className="p-4 sm:p-8 max-w-7xl w-full mx-auto space-y-6">
          <FirebaseConfigNotice compact />
          {children}
        </div>
      </main>
    </div>
  );
};
