import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  Home,
  Compass,
  GraduationCap,
  HelpCircle,
  Building2,
  Heart,
  User,
  LogOut,
  Menu,
  X,
  PlusCircle,
  Layers,
  LayoutDashboard,
  ShieldCheck,
  ChevronDown,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useProperty } from '../../context/PropertyContext';

export const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const { favorites, comparedPropertyIds } = useProperty();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    await logout();
    setUserDropdownOpen(false);
    setMobileMenuOpen(false);
    navigate('/');
  };

  const isActive = (path: string) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <header className="sticky top-0 z-40 bg-[#0A0A0B]/85 backdrop-blur-md border-b border-white/10 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo */}
          <Link
            to="/"
            id="brand-logo"
            className="flex items-center gap-2.5 group"
            onClick={() => setMobileMenuOpen(false)}
          >
            <div className="w-8 h-8 sm:w-9 sm:h-9 bg-amber-500 rounded-lg flex items-center justify-center text-black shadow-md shadow-amber-500/20 group-hover:scale-105 transition-transform duration-200">
              <Home className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xl sm:text-2xl font-bold tracking-tight text-white font-sans">
                  Stay<span className="text-amber-500">Mate</span>
                </span>
                <span className="hidden sm:inline-block bg-amber-500/10 text-amber-400 text-[10px] font-bold px-1.5 py-0.5 rounded-md border border-amber-500/20 uppercase tracking-wider">
                  Campus
                </span>
              </div>
              <p className="text-[10px] font-medium text-slate-400 -mt-1 hidden sm:block">
                Your stay, your way.
              </p>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            <Link
              to="/explore"
              id="nav-link-explore"
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-medium transition-colors ${
                isActive('/explore')
                  ? 'bg-amber-500/10 text-amber-400 font-bold border border-amber-500/20'
                  : 'text-slate-300 hover:text-amber-500 hover:bg-white/5'
              }`}
            >
              <Compass className="w-4 h-4" />
              Explore
            </Link>

            <Link
              to="/colleges"
              id="nav-link-colleges"
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-medium transition-colors ${
                isActive('/colleges')
                  ? 'bg-amber-500/10 text-amber-400 font-bold border border-amber-500/20'
                  : 'text-slate-300 hover:text-amber-500 hover:bg-white/5'
              }`}
            >
              <GraduationCap className="w-4 h-4" />
              Colleges
            </Link>

            <Link
              to="/how-it-works"
              id="nav-link-how-it-works"
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-medium transition-colors ${
                isActive('/how-it-works')
                  ? 'bg-amber-500/10 text-amber-400 font-bold border border-amber-500/20'
                  : 'text-slate-300 hover:text-amber-500 hover:bg-white/5'
              }`}
            >
              <HelpCircle className="w-4 h-4" />
              How It Works
            </Link>

            {(!user || user.role === 'owner') && (
              <Link
                to={user?.role === 'owner' ? '/owner/properties/new' : '/signup?role=owner'}
                id="nav-link-owners"
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-medium transition-colors ${
                  isActive('/owner')
                    ? 'bg-amber-500/10 text-amber-400 font-bold border border-amber-500/20'
                    : 'text-amber-500/80 hover:text-amber-500 hover:bg-white/5'
                }`}
              >
                <Building2 className="w-4 h-4 text-amber-500" />
                For PG Owners
              </Link>
            )}
          </nav>

          {/* Right Action Area */}
          <div className="hidden md:flex items-center gap-3">
            {/* Compare Bar Trigger */}
            {comparedPropertyIds.length > 0 && (
              <Link
                to="/tenant/compare"
                id="nav-compare-badge"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500/10 text-amber-400 text-xs font-semibold hover:bg-amber-500/20 transition-colors border border-amber-500/20"
                title="Compare Selected PGs"
              >
                <Layers className="w-3.5 h-3.5" />
                <span>Compare</span>
                <span className="w-4 h-4 rounded-full bg-amber-500 text-black font-bold flex items-center justify-center text-[10px]">
                  {comparedPropertyIds.length}
                </span>
              </Link>
            )}

            {/* Saved Stays Icon for Tenants */}
            {user?.role === 'tenant' && (
              <Link
                to="/tenant/saved"
                id="nav-favorites-btn"
                className="relative p-2.5 rounded-xl text-slate-300 hover:text-rose-400 hover:bg-white/5 transition-colors"
                title="Saved Stays"
              >
                <Heart className={`w-5 h-5 ${favorites.length > 0 ? 'text-rose-500 fill-rose-500' : ''}`} />
                {favorites.length > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-rose-500 text-white rounded-full text-[10px] font-bold flex items-center justify-center">
                    {favorites.length}
                  </span>
                )}
              </Link>
            )}

            {/* User Dropdown or Auth Buttons */}
            {user ? (
              <div className="relative">
                <button
                  id="user-menu-btn"
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2.5 p-1.5 pl-2 rounded-xl border border-white/10 hover:border-amber-500/40 bg-[#161618] hover:bg-[#1A1A1D] text-white transition-colors cursor-pointer"
                >
                  <img
                    src={user.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.displayName)}&background=f59e0b&color=000`}
                    alt={user.displayName}
                    className="w-8 h-8 rounded-lg object-cover"
                  />
                  <div className="text-left hidden lg:block pr-1">
                    <p className="text-xs font-bold text-white leading-tight truncate max-w-[110px]">
                      {user.displayName}
                    </p>
                    <p className="text-[10px] font-medium text-slate-400 capitalize">
                      {user.role === 'tenant' ? '🎓 Student' : '🏠 Owner'}
                    </p>
                  </div>
                  <ChevronDown className="w-4 h-4 text-slate-400 mr-1" />
                </button>

                {/* Dropdown Menu */}
                {userDropdownOpen && (
                  <div
                    id="user-dropdown"
                    className="absolute right-0 mt-2 w-56 bg-[#161618] rounded-2xl shadow-2xl border border-white/10 py-2 z-50 animate-in fade-in zoom-in-95 duration-150 text-slate-200"
                  >
                    <div className="px-4 py-2.5 border-b border-white/10">
                      <p className="text-xs font-bold text-white">{user.displayName}</p>
                      <p className="text-[11px] text-slate-400 truncate">{user.email}</p>
                      <span className="mt-1 inline-block text-[10px] font-semibold px-2 py-0.5 rounded-md bg-amber-500/10 border border-amber-500/20 text-amber-400">
                        {user.role === 'tenant' ? 'Student Account' : 'PG Owner Account'}
                      </span>
                    </div>

                    <div className="py-1">
                      <Link
                        to={user.role === 'tenant' ? '/tenant/dashboard' : '/owner/dashboard'}
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-slate-300 hover:bg-white/5 hover:text-amber-400"
                      >
                        <LayoutDashboard className="w-4 h-4" />
                        Dashboard
                      </Link>

                      {user.role === 'owner' ? (
                        <>
                          <Link
                            to="/owner/properties"
                            onClick={() => setUserDropdownOpen(false)}
                            className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-slate-300 hover:bg-white/5 hover:text-amber-400"
                          >
                            <Building2 className="w-4 h-4" />
                            My Properties
                          </Link>
                          <Link
                            to="/owner/properties/new"
                            onClick={() => setUserDropdownOpen(false)}
                            className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-slate-300 hover:bg-white/5 hover:text-amber-400"
                          >
                            <PlusCircle className="w-4 h-4" />
                            Add New Property
                          </Link>
                        </>
                      ) : (
                        <>
                          <Link
                            to="/tenant/saved"
                            onClick={() => setUserDropdownOpen(false)}
                            className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-slate-300 hover:bg-white/5 hover:text-amber-400"
                          >
                            <Heart className="w-4 h-4" />
                            Saved Stays ({favorites.length})
                          </Link>
                          <Link
                            to="/tenant/enquiries"
                            onClick={() => setUserDropdownOpen(false)}
                            className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-slate-300 hover:bg-white/5 hover:text-amber-400"
                          >
                            <HelpCircle className="w-4 h-4" />
                            My Enquiries
                          </Link>
                        </>
                      )}

                      <Link
                        to="/profile"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-slate-300 hover:bg-white/5 hover:text-amber-400"
                      >
                        <User className="w-4 h-4" />
                        Edit Profile
                      </Link>
                    </div>

                    <div className="pt-1 border-t border-white/10">
                      <button
                        id="dropdown-logout-btn"
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-rose-400 hover:bg-rose-500/10 cursor-pointer"
                      >
                        <LogOut className="w-4 h-4" />
                        Log Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  to="/login"
                  id="nav-login-btn"
                  className="text-sm font-semibold text-slate-300 hover:text-white px-4 py-2 transition-colors"
                >
                  Log In
                </Link>
                <Link
                  to="/signup"
                  id="nav-signup-btn"
                  className="text-sm font-semibold bg-white text-black px-6 py-2 rounded-full hover:bg-amber-500 hover:text-black transition-all shadow-lg shadow-white/5"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Hamburger Toggle */}
          <div className="flex items-center gap-2 md:hidden">
            {user?.role === 'tenant' && (
              <Link
                to="/tenant/saved"
                className="p-2 text-slate-300 hover:text-rose-400"
                title="Saved Stays"
              >
                <Heart className={`w-5 h-5 ${favorites.length > 0 ? 'text-rose-500 fill-rose-500' : ''}`} />
              </Link>
            )}

            <button
              id="mobile-menu-toggle"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-300 hover:text-white hover:bg-white/5 rounded-xl"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div
          id="mobile-nav-drawer"
          className="md:hidden border-t border-white/10 bg-[#161618] px-4 pt-3 pb-6 space-y-3 animate-in slide-in-from-top duration-200 text-slate-200"
        >
          {user && (
            <div className="flex items-center gap-3 p-3 bg-white/5 border border-white/10 rounded-xl mb-3">
              <img
                src={user.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.displayName)}&background=f59e0b&color=000`}
                alt={user.displayName}
                className="w-10 h-10 rounded-lg object-cover"
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-white truncate">{user.displayName}</p>
                <p className="text-xs text-slate-400 capitalize">{user.role === 'tenant' ? '🎓 Student' : '🏠 PG Owner'}</p>
              </div>
            </div>
          )}

          <div className="space-y-1">
            <Link
              to="/explore"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-300 hover:bg-white/5 hover:text-amber-400"
            >
              <Compass className="w-5 h-5 text-amber-500" />
              Explore Stays & PGs
            </Link>
            <Link
              to="/colleges"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-300 hover:bg-white/5 hover:text-amber-400"
            >
              <GraduationCap className="w-5 h-5 text-amber-500" />
              College Directory
            </Link>
            <Link
              to="/how-it-works"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-300 hover:bg-white/5 hover:text-amber-400"
            >
              <HelpCircle className="w-5 h-5 text-amber-500" />
              How StayMate Works
            </Link>
            {(!user || user.role === 'owner') && (
              <Link
                to={user?.role === 'owner' ? '/owner/properties/new' : '/signup?role=owner'}
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-300 hover:bg-white/5 hover:text-amber-400"
              >
                <Building2 className="w-5 h-5 text-amber-500" />
                List Your Property
              </Link>
            )}
          </div>

          {user ? (
            <div className="pt-3 border-t border-white/10 space-y-1">
              <Link
                to={user.role === 'tenant' ? '/tenant/dashboard' : '/owner/dashboard'}
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-300 hover:bg-white/5 hover:text-amber-400"
              >
                <LayoutDashboard className="w-5 h-5 text-amber-500" />
                Dashboard Overview
              </Link>

              {user.role === 'tenant' && (
                <>
                  <Link
                    to="/tenant/saved"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-300 hover:bg-white/5 hover:text-amber-400"
                  >
                    <Heart className="w-5 h-5 text-rose-400" />
                    Saved Stays ({favorites.length})
                  </Link>
                  <Link
                    to="/tenant/enquiries"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-300 hover:bg-white/5 hover:text-amber-400"
                  >
                    <HelpCircle className="w-5 h-5 text-amber-500" />
                    My Enquiries
                  </Link>
                  <Link
                    to="/tenant/compare"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-300 hover:bg-white/5 hover:text-amber-400"
                  >
                    <Layers className="w-5 h-5 text-amber-500" />
                    Compare Properties ({comparedPropertyIds.length})
                  </Link>
                </>
              )}

              <Link
                to="/profile"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-300 hover:bg-white/5 hover:text-amber-400"
              >
                <User className="w-5 h-5 text-amber-500" />
                My Profile
              </Link>

              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-rose-400 hover:bg-rose-500/10 text-left cursor-pointer"
              >
                <LogOut className="w-5 h-5" />
                Log Out
              </button>
            </div>
          ) : (
            <div className="pt-3 border-t border-white/10 grid grid-cols-2 gap-2">
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="text-center py-2.5 rounded-xl text-sm font-bold text-slate-200 bg-white/5 hover:bg-white/10 border border-white/10"
              >
                Log In
              </Link>
              <Link
                to="/signup"
                onClick={() => setMobileMenuOpen(false)}
                className="text-center py-2.5 rounded-xl text-sm font-bold text-black bg-amber-500 hover:bg-amber-400"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
};
