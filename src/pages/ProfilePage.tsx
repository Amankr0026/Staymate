import React, { useState } from 'react';
import { User, Mail, Phone, GraduationCap, Building2, ShieldCheck, Check, Save } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { DashboardLayout } from '../components/layout/DashboardLayout';

export const ProfilePage: React.FC = () => {
  const { user, updateUserProfile } = useAuth();
  const { success, error } = useToast();

  const [displayName, setDisplayName] = useState(user?.displayName || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [college, setCollege] = useState(user?.college || '');
  const [course, setCourse] = useState(user?.course || '');
  const [businessName, setBusinessName] = useState(user?.businessName || '');
  const [isSaving, setIsSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await updateUserProfile({
        displayName,
        phone,
        college: user?.role === 'tenant' ? college : undefined,
        course: user?.role === 'tenant' ? course : undefined,
        businessName: user?.role === 'owner' ? businessName : undefined,
      });
      success('Profile details updated successfully!');
    } catch (err) {
      error('Failed to update profile.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <DashboardLayout
      title="User Profile & Settings"
      subtitle="Manage your personal details, campus affiliation, and contact preferences."
    >
      <div className="max-w-2xl bg-[#161618] p-6 sm:p-8 rounded-3xl border border-white/10 shadow-2xl space-y-6 text-white">
        <div className="flex items-center gap-4 pb-6 border-b border-white/10">
          <img
            src={user?.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName || 'User')}&background=F59E0B&color=000`}
            alt={displayName}
            className="w-16 h-16 rounded-2xl object-cover border border-white/10"
          />
          <div>
            <h3 className="text-lg font-bold text-white">{user?.displayName}</h3>
            <p className="text-xs text-slate-400">{user?.email}</p>
            <span className="mt-1 inline-block text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-400">
              {user?.role === 'tenant' ? '🎓 Verified Student' : '🏠 Verified PG Owner'}
            </span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Full Name</label>
              <input
                type="text"
                required
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="w-full p-2.5 text-sm bg-[#121214] border border-white/10 text-white rounded-xl focus:border-amber-500 focus:ring-1 focus:ring-amber-500 outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Phone Number</label>
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full p-2.5 text-sm bg-[#121214] border border-white/10 text-white rounded-xl focus:border-amber-500 focus:ring-1 focus:ring-amber-500 outline-hidden"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">Registered Email (Read only)</label>
            <input
              type="email"
              disabled
              value={user?.email || ''}
              className="w-full p-2.5 text-sm border border-white/10 rounded-xl bg-[#121214]/50 text-slate-500 outline-hidden cursor-not-allowed"
            />
          </div>

          {user?.role === 'tenant' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">College / Institute</label>
                <input
                  type="text"
                  value={college}
                  onChange={(e) => setCollege(e.target.value)}
                  placeholder="e.g. Delhi University"
                  className="w-full p-2.5 text-sm bg-[#121214] border border-white/10 text-white rounded-xl focus:border-amber-500 focus:ring-1 focus:ring-amber-500 outline-hidden placeholder-slate-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Course / Year</label>
                <input
                  type="text"
                  value={course}
                  onChange={(e) => setCourse(e.target.value)}
                  placeholder="e.g. B.Tech 2nd Year"
                  className="w-full p-2.5 text-sm bg-[#121214] border border-white/10 text-white rounded-xl focus:border-amber-500 focus:ring-1 focus:ring-amber-500 outline-hidden placeholder-slate-600"
                />
              </div>
            </div>
          ) : (
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Business Name</label>
              <input
                type="text"
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                className="w-full p-2.5 text-sm bg-[#121214] border border-white/10 text-white rounded-xl focus:border-amber-500 focus:ring-1 focus:ring-amber-500 outline-hidden placeholder-slate-600"
              />
            </div>
          )}

          <div className="pt-4 flex justify-end">
            <button
              type="submit"
              disabled={isSaving}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-sm text-black bg-amber-500 hover:bg-amber-400 shadow-lg shadow-amber-500/20 disabled:opacity-50 transition-all cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>{isSaving ? 'Saving...' : 'Save Profile Changes'}</span>
            </button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
};
