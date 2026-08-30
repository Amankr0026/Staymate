import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import {
  Mail,
  Lock,
  User,
  Phone,
  GraduationCap,
  Building2,
  ArrowRight,
  ShieldCheck,
  Check,
  Home,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useProperty } from '../context/PropertyContext';
import { useToast } from '../context/ToastContext';

export const SignupPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const initialRole = (searchParams.get('role') === 'owner' ? 'owner' : 'tenant') as 'tenant' | 'owner';

  const [role, setRole] = useState<'tenant' | 'owner'>(initialRole);
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [college, setCollege] = useState('');
  const [course, setCourse] = useState('B.Tech');
  const [businessName, setBusinessName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { signup } = useAuth();
  const { colleges } = useProperty();
  const { success, error } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const roleParam = searchParams.get('role');
    if (roleParam === 'owner' || roleParam === 'tenant') {
      setRole(roleParam);
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!displayName || !email || !password || !phone) {
      error('Please fill in all required fields.');
      return;
    }

    setIsSubmitting(true);
    try {
      await signup(email, password, {
        displayName,
        phone,
        role,
        college: role === 'tenant' ? college || 'Delhi University' : undefined,
        course: role === 'tenant' ? course : undefined,
        businessName: role === 'owner' ? businessName || `${displayName}'s Accommodations` : undefined,
      });

      success(`Account created successfully! Welcome to StayMate.`);
      navigate(role === 'tenant' ? '/tenant/dashboard' : '/owner/dashboard');
    } catch (err: any) {
      error(err.message || 'Failed to sign up.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12 text-white">
      <div className="w-full max-w-lg space-y-6">
        <div className="text-center space-y-2">
          <Link to="/" className="inline-flex items-center gap-2 mb-2">
            <div className="w-10 h-10 rounded-xl bg-amber-500 flex items-center justify-center text-black font-black">
              <Home className="w-5 h-5" />
            </div>
            <span className="text-2xl font-black text-white tracking-tight">
              Stay<span className="text-amber-400">Mate</span>
            </span>
          </Link>
          <h1 className="text-2xl font-black text-white">
            {role === 'tenant' ? 'Create Student Account' : 'List Your PG on StayMate'}
          </h1>
          <p className="text-xs text-slate-400">
            {role === 'tenant'
              ? 'Find verified campus accommodations with zero brokerage'
              : 'Fill your rooms faster with verified college tenant enquiries'}
          </p>
        </div>

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
              <span>I am a Student</span>
            </button>
            <button
              type="button"
              onClick={() => setRole('owner')}
              className={`py-2 rounded-lg flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                role === 'owner' ? 'bg-amber-500 text-black font-black shadow-xs' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Building2 className="w-3.5 h-3.5" />
              <span>I am a PG Owner</span>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Full Name *</label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-500 absolute left-3 top-3.5" />
                  <input
                    type="text"
                    required
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    placeholder="e.g. Aarav Sharma"
                    className="w-full pl-9 pr-3 py-2.5 text-sm bg-[#121214] border border-white/10 text-white rounded-xl focus:border-amber-500 focus:ring-1 focus:ring-amber-500 outline-hidden placeholder-slate-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Phone Number *</label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-500 absolute left-3 top-3.5" />
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full pl-9 pr-3 py-2.5 text-sm bg-[#121214] border border-white/10 text-white rounded-xl focus:border-amber-500 focus:ring-1 focus:ring-amber-500 outline-hidden placeholder-slate-600"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Email Address *</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-3.5" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@email.com"
                  className="w-full pl-9 pr-3 py-2.5 text-sm bg-[#121214] border border-white/10 text-white rounded-xl focus:border-amber-500 focus:ring-1 focus:ring-amber-500 outline-hidden placeholder-slate-600"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Create Password *</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-3.5" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 6 characters"
                  className="w-full pl-9 pr-3 py-2.5 text-sm bg-[#121214] border border-white/10 text-white rounded-xl focus:border-amber-500 focus:ring-1 focus:ring-amber-500 outline-hidden placeholder-slate-600"
                />
              </div>
            </div>

            {/* Student specific fields */}
            {role === 'tenant' ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">College / University</label>
                  <select
                    value={college}
                    onChange={(e) => setCollege(e.target.value)}
                    className="w-full p-2.5 text-sm bg-[#121214] border border-white/10 text-white rounded-xl focus:border-amber-500 focus:ring-1 focus:ring-amber-500 outline-hidden"
                  >
                    <option value="" className="bg-[#161618] text-slate-400">Select College</option>
                    {colleges.map((c) => (
                      <option key={c.id} value={c.name} className="bg-[#161618] text-white">
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Degree / Course</label>
                  <input
                    type="text"
                    value={course}
                    onChange={(e) => setCourse(e.target.value)}
                    placeholder="e.g. B.Tech / B.Com / MBA"
                    className="w-full p-2.5 text-sm bg-[#121214] border border-white/10 text-white rounded-xl focus:border-amber-500 focus:ring-1 focus:ring-amber-500 outline-hidden placeholder-slate-600"
                  />
                </div>
              </div>
            ) : (
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">PG Business / Property Name</label>
                <div className="relative">
                  <Building2 className="w-4 h-4 text-slate-500 absolute left-3 top-3.5" />
                  <input
                    type="text"
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                    placeholder="e.g. Metro Living PG & Hostel"
                    className="w-full pl-9 pr-3 py-2.5 text-sm bg-[#121214] border border-white/10 text-white rounded-xl focus:border-amber-500 focus:ring-1 focus:ring-amber-500 outline-hidden placeholder-slate-600"
                  />
                </div>
              </div>
            )}

            <div className="p-3 bg-[#121214] rounded-xl border border-white/10 flex items-center gap-2 text-xs text-slate-400">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>We never share your contact information with spam telemarketers.</span>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              id="signup-submit-btn"
              className="w-full py-3 rounded-xl font-bold text-sm text-black bg-amber-500 hover:bg-amber-400 shadow-lg shadow-amber-500/20 disabled:opacity-50 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>{isSubmitting ? 'Creating Account...' : 'Get Started Free'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="text-center pt-2 border-t border-white/10 text-xs text-slate-400">
            Already have an account?{' '}
            <Link to="/login" className="font-bold text-amber-400 hover:text-amber-300 hover:underline">
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
