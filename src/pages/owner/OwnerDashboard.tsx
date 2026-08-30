import React from 'react';
import { Link } from 'react-router-dom';
import {
  Building2,
  Bed,
  HelpCircle,
  Calendar,
  Plus,
  ArrowRight,
  Sparkles,
  TrendingUp,
  Phone,
  MessageCircle,
  Eye,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useProperty } from '../../context/PropertyContext';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { StatusBadge } from '../../components/common/Badge';
import { formatRent, formatDate } from '../../utils/formatters';

export const OwnerDashboard: React.FC = () => {
  const { user } = useAuth();
  const { properties, enquiries, visitRequests } = useProperty();

  const ownerProperties = properties.filter((p) => p.ownerId === user?.uid || p.ownerEmail === user?.email);
  const totalBeds = ownerProperties.reduce((acc, p) => acc + p.totalBeds, 0);
  const availableBeds = ownerProperties.reduce((acc, p) => acc + p.availableBeds, 0);

  // Filter enquiries for owner's properties
  const propertyIds = new Set(ownerProperties.map((p) => p.id));
  const ownerEnquiries = enquiries.filter((e) => propertyIds.has(e.propertyId));
  const ownerVisits = visitRequests.filter((v) => propertyIds.has(v.propertyId));

  return (
    <DashboardLayout
      title={`Welcome, ${user?.businessName || user?.displayName || 'Owner'}! 🏢`}
      subtitle="Manage student listings, respond to vacancy enquiries, and track scheduled visits."
      actions={
        <Link
          to="/owner/properties/new"
          id="owner-add-pg-btn"
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-black bg-amber-500 hover:bg-amber-400 shadow-lg shadow-amber-500/20 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Accommodation</span>
        </Link>
      }
    >
      {/* 4 Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-white">
        <Link
          to="/owner/properties"
          className="bg-[#161618] p-5 rounded-2xl border border-white/10 shadow-lg hover:border-amber-500/40 transition-all space-y-1 block"
        >
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider">Properties</span>
            <Building2 className="w-4 h-4 text-amber-400" />
          </div>
          <p className="text-2xl font-black text-white">{ownerProperties.length}</p>
          <p className="text-[11px] text-slate-400">Active campus listings</p>
        </Link>

        <div className="bg-[#161618] p-5 rounded-2xl border border-white/10 shadow-lg space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider">Bed Vacancy</span>
            <Bed className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-2xl font-black text-white">
            {availableBeds} <span className="text-xs font-normal text-slate-500">/ {totalBeds} total</span>
          </p>
          <p className="text-[11px] text-emerald-400 font-semibold">Vacant beds ready</p>
        </div>

        <Link
          to="/owner/enquiries"
          className="bg-[#161618] p-5 rounded-2xl border border-white/10 shadow-lg hover:border-amber-500/40 transition-all space-y-1 block"
        >
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider">Student Leads</span>
            <HelpCircle className="w-4 h-4 text-amber-400" />
          </div>
          <p className="text-2xl font-black text-white">{ownerEnquiries.length}</p>
          <p className="text-[11px] text-slate-400">Incoming room enquiries</p>
        </Link>

        <Link
          to="/owner/visits"
          className="bg-[#161618] p-5 rounded-2xl border border-white/10 shadow-lg hover:border-amber-500/40 transition-all space-y-1 block"
        >
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider">Visits</span>
            <Calendar className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-2xl font-black text-white">{ownerVisits.length}</p>
          <p className="text-[11px] text-slate-400">In-person inspections</p>
        </Link>
      </div>

      {/* Two Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 text-white">
        {/* Recent Student Leads */}
        <div className="bg-[#161618] p-6 rounded-3xl border border-white/10 shadow-lg space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-base text-white">Recent Student Enquiries</h3>
            <Link to="/owner/enquiries" className="text-xs font-bold text-amber-400 hover:underline">
              View All
            </Link>
          </div>

          {ownerEnquiries.length === 0 ? (
            <div className="p-8 text-center bg-[#121214] rounded-2xl border border-dashed border-white/10 text-xs text-slate-400 space-y-2">
              <p>No student inquiries received yet.</p>
              <p className="text-[11px] text-slate-500">Enquiries will appear here when students reach out from your listing.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {ownerEnquiries.slice(0, 3).map((enq) => (
                <div
                  key={enq.id}
                  className="p-3.5 bg-[#121214] rounded-2xl border border-white/10 space-y-2 text-xs"
                >
                  <div className="flex items-center justify-between">
                    <div className="font-bold text-white">{enq.tenantName}</div>
                    <StatusBadge status={enq.status} />
                  </div>
                  <p className="text-slate-400 italic">"{enq.message}"</p>
                  <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1 border-t border-white/10">
                    <span>Phone: {enq.tenantPhone}</span>
                    <a
                      href={`https://wa.me/${enq.tenantPhone.replace(/[^0-9]/g, '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-emerald-400 font-bold hover:underline flex items-center gap-1"
                    >
                      <MessageCircle className="w-3 h-3" /> WhatsApp
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* My Listed Properties Overview */}
        <div className="bg-[#161618] p-6 rounded-3xl border border-white/10 shadow-lg space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-base text-white">My Properties ({ownerProperties.length})</h3>
            <Link to="/owner/properties" className="text-xs font-bold text-amber-400 hover:underline">
              Manage All
            </Link>
          </div>

          <div className="space-y-3">
            {ownerProperties.map((p) => (
              <div
                key={p.id}
                className="p-3 bg-[#121214] rounded-2xl border border-white/10 flex items-center justify-between gap-3 text-xs"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <img src={p.coverImage || p.images[0]} alt={p.name} className="w-12 h-12 rounded-xl object-cover border border-white/10" />
                  <div className="min-w-0">
                    <h4 className="font-bold text-white truncate">{p.name}</h4>
                    <p className="text-slate-400">{p.area} • {p.availableBeds} beds vacant</p>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <div className="font-extrabold text-amber-400">{formatRent(p.startingRent)}</div>
                  <Link
                    to={`/property/${p.id}`}
                    className="text-[11px] text-slate-400 hover:text-white font-semibold transition-colors"
                  >
                    Preview Live →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};
