import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import {
  Mail,
  Lock,
  ArrowRight,
  ShieldCheck,
  User,
  Building2,
  Sparkles,
  Home,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { FirebaseConfigNotice } from '../components/common/FirebaseConfigNotice';

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'tenant' | 'owner'>('tenant');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login, demoLogin } = useAuth();
  const { success, error } = useToast();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const redirectUrl = searchParams.get('redirect');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      error('Please enter your email and password.');
      return;
    }

    setIsSubmitting(true);
    try {
      await login(email, password, role);
      success(`Welcome back! Logged in as ${role === 'tenant' ? 'Student' : 'PG Owner'}.`);
      if (redirectUrl) {
        navigate(redirectUrl);
      } else {
        navigate(role === 'tenant' ? '/tenant/dashboard' : '/owner/dashboard');
      }
    } catch (err: any) {
      error(err.message || 'Failed to log in.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDemoSignIn = async (demoRole: 'tenant' | 'owner') => {
    try {
      await demoLogin(demoRole);
      success(`Logged in as demo ${demoRole === 'tenant' ? 'Student (Aarav)' : 'PG Owner (Rajesh)'}!`);
      if (redirectUrl) {
        navigate(redirectUrl);
      } else {
        navigate(demoRole === 'tenant' ? '/tenant/dashboard' : '/owner/dashboard');
      }
    } catch (err) {
      error('Demo login failed.');
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12 text-white">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <Link to="/" className="inline-flex items-center gap-2 mb-2">
            <div className="w-10 h-10 rounded-xl bg-amber-500 flex items-center justify-center text-black font-black">
              <Home className="w-5 h-5" />
            </div>
            <span className="text-2xl font-black text-white tracking-tight">
              Stay<span className="text-amber-400">Mate</span>
            </span>
          </Link>
          <h1 className="text-2xl font-black text-white">Welcome Back</h1>
          <p className="text-xs text-slate-400">Sign in to your StayMate student or owner portal</p>
        </div>

        <FirebaseConfigNotice compact />

        {/* Instant Demo Role Switcher */}
        <div className="bg-[#161618] border border-amber-500/30 rounded-2xl p-4 space-y-2 text-xs">
          <div className="flex items-center justify-between">
            <span className="font-bold text-amber-400 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>One-Click Instant Demo Login</span>
            </span>
            <span className="text-[10px] bg-amber-500/20 text-amber-400 border border-amber-500/30 font-bold px-2 py-0.5 rounded">
              Ready to Test
            </span>
          </div>
          <p className="text-slate-300 text-[11px]">
            Test drive student or owner experiences instantly with pre-populated data:
          </p>
          <div className="grid grid-cols-2 gap-2 pt-1">
            <button
              type="button"
              id="demo-student-btn"
              onClick={() => handleDemoSignIn('tenant')}
              className="py-2 px-3 bg-[#121214] text-white font-bold rounded-xl border border-white/10 hover:border-amber-500/50 hover:text-amber-400 shadow-md transition-colors flex items-center justify-center gap-1.5 cursor-pointer text-xs"
            >
              <User className="w-3.5 h-3.5 text-amber-400" />
              <span>Student Demo</span>
            </button>
            <button
              type="button"
              id="demo-owner-btn"
              onClick={() => handleDemoSignIn('owner')}
              className="py-2 px-3 bg-[#121214] text-white font-bold rounded-xl border border-white/10 hover:border-amber-500/50 hover:text-amber-400 shadow-md transition-colors flex items-center justify-center gap-1.5 cursor-pointer text-xs"
            >
              <Building2 className="w-3.5 h-3.5 text-amber-400" />
              <span>PG Owner Demo</span>
            </button>
          </div>
        </div>

        {/* Standard Form */}
        <div className="bg-[#161618] p-6 sm:p-8 rounded-3xl border border-white/10 shadow-2xl space-y-5">
          {/* Role selector tabs */}
          <div className="grid grid-cols-2 gap-2 p-1 bg-[#121214] rounded-xl text-xs font-bold border border-white/10">
            <button
              type="button"
              onClick={() => setRole('tenant')}
              className={`py-2 rounded-lg flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                role === 'tenant' ? 'bg-amber-500 text-black font-black shadow-xs' : 'text-slate-400 hover:text-white'
              }`}
            >
              <User className="w-3.5 h-3.5" />
              <span>Student / Tenant</span>
            </button>
            <button
              type="button"
              onClick={() => setRole('owner')}
              className={`py-2 rounded-lg flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                role === 'owner' ? 'bg-amber-500 text-black font-black shadow-xs' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Building2 className="w-3.5 h-3.5" />
              <span>PG Owner</span>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-3.5" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={role === 'tenant' ? 'student@campus.edu' : 'owner@staymate.com'}
                  className="w-full pl-9 pr-3 py-2.5 text-sm bg-[#121214] border border-white/10 text-white rounded-xl focus:border-amber-500 focus:ring-1 focus:ring-amber-500 outline-hidden placeholder-slate-600"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-3.5" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-3 py-2.5 text-sm bg-[#121214] border border-white/10 text-white rounded-xl focus:border-amber-500 focus:ring-1 focus:ring-amber-500 outline-hidden placeholder-slate-600"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              id="login-submit-btn"
              className="w-full py-3 rounded-xl font-bold text-sm text-black bg-amber-500 hover:bg-amber-400 shadow-lg shadow-amber-500/20 disabled:opacity-50 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>{isSubmitting ? 'Signing In...' : `Sign In as ${role === 'tenant' ? 'Student' : 'Owner'}`}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="text-center pt-2 border-t border-white/10 text-xs text-slate-400">
            Don't have an account yet?{' '}
            <Link to={`/signup?role=${role}`} className="font-bold text-amber-400 hover:text-amber-300 hover:underline">
              Create free account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
