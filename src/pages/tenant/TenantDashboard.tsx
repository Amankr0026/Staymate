import React from 'react';
import { Link } from 'react-router-dom';
import {
  Heart,
  HelpCircle,
  Calendar,
  Layers,
  ArrowRight,
  GraduationCap,
  Sparkles,
  MapPin,
  Clock,
  CheckCircle2,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useProperty } from '../../context/PropertyContext';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { PropertyCard } from '../../components/property/PropertyCard';
import { StatusBadge } from '../../components/common/Badge';
import { formatDate } from '../../utils/formatters';

export const TenantDashboard: React.FC = () => {
  const { user } = useAuth();
  const { favorites, enquiries, visitRequests, properties } = useProperty();

  const userEnquiries = enquiries.filter((e) => e.tenantId === user?.uid || user?.email === e.tenantEmail);
  const userVisits = visitRequests.filter((v) => v.tenantId === user?.uid || user?.email === v.tenantEmail);
  const savedProperties = properties.filter((p) => favorites.includes(p.id));
  const recommendedProperties = properties.slice(0, 2);

  return (
    <DashboardLayout
      title={`Hi, ${user?.displayName?.split(' ')[0] || 'Student'}! 👋`}
      subtitle={`Enrolled at ${user?.college || 'Delhi University'} • Managing your college stay hunt.`}
      actions={
        <Link
          to="/explore"
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-black bg-amber-500 hover:bg-amber-400 shadow-lg shadow-amber-500/20 transition-all"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Explore Stays</span>
        </Link>
      }
    >
      {/* 4 Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-white">
        <Link
          to="/tenant/saved"
          className="bg-[#161618] p-5 rounded-2xl border border-white/10 shadow-lg hover:border-amber-500/40 transition-all space-y-1 block"
        >
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider">Wishlist</span>
            <Heart className="w-4 h-4 text-rose-400" />
          </div>
          <p className="text-2xl font-black text-white">{favorites.length}</p>
          <p className="text-[11px] text-slate-400">Saved accommodations</p>
        </Link>

        <Link
          to="/tenant/enquiries"
          className="bg-[#161618] p-5 rounded-2xl border border-white/10 shadow-lg hover:border-amber-500/40 transition-all space-y-1 block"
        >
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider">Enquiries</span>
            <HelpCircle className="w-4 h-4 text-amber-400" />
          </div>
          <p className="text-2xl font-black text-white">{userEnquiries.length}</p>
          <p className="text-[11px] text-slate-400">Direct owner requests</p>
        </Link>

        <Link
          to="/tenant/visits"
          className="bg-[#161618] p-5 rounded-2xl border border-white/10 shadow-lg hover:border-amber-500/40 transition-all space-y-1 block"
        >
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider">Visits</span>
            <Calendar className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-2xl font-black text-white">{userVisits.length}</p>
          <p className="text-[11px] text-slate-400">Scheduled inspections</p>
        </Link>

        <Link
          to="/tenant/compare"
          className="bg-[#161618] p-5 rounded-2xl border border-white/10 shadow-lg hover:border-amber-500/40 transition-all space-y-1 block"
        >
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider">Compare</span>
            <Layers className="w-4 h-4 text-amber-400" />
          </div>
          <p className="text-2xl font-black text-white">Side-by-Side</p>
          <p className="text-[11px] text-slate-400">Evaluate amenities</p>
        </Link>
      </div>

      {/* Main Two Column section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 text-white">
        {/* Recent Enquiries Box */}
        <div className="bg-[#161618] p-6 rounded-3xl border border-white/10 shadow-lg space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-base text-white">Recent PG Enquiries</h3>
            <Link to="/tenant/enquiries" className="text-xs font-bold text-amber-400 hover:underline">
              View All
            </Link>
          </div>

          {userEnquiries.length === 0 ? (
            <div className="p-8 text-center bg-[#121214] rounded-2xl border border-dashed border-white/10 text-xs text-slate-400 space-y-2">
              <p>You haven't sent any owner enquiries yet.</p>
              <Link to="/explore" className="font-bold text-amber-400 inline-block">
                Browse Campus Stays →
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {userEnquiries.slice(0, 3).map((enq) => (
                <div
                  key={enq.id}
                  className="p-3.5 bg-[#121214] rounded-2xl border border-white/10 flex items-center justify-between gap-3 text-xs"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <img src={enq.propertyImage} alt={enq.propertyName} className="w-12 h-12 rounded-xl object-cover border border-white/10" />
                    <div className="min-w-0">
                      <h4 className="font-bold text-white truncate">{enq.propertyName}</h4>
                      <p className="text-slate-400 truncate">{enq.preferredRoomType} • {formatDate(enq.createdAt)}</p>
                    </div>
                  </div>
                  <StatusBadge status={enq.status} />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Scheduled In-Person Visits */}
        <div className="bg-[#161618] p-6 rounded-3xl border border-white/10 shadow-lg space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-base text-white">Scheduled Visits</h3>
            <Link to="/tenant/visits" className="text-xs font-bold text-amber-400 hover:underline">
              View All
            </Link>
          </div>

          {userVisits.length === 0 ? (
            <div className="p-8 text-center bg-[#121214] rounded-2xl border border-dashed border-white/10 text-xs text-slate-400 space-y-2">
              <p>No upcoming property visits scheduled.</p>
              <Link to="/explore" className="font-bold text-amber-400 inline-block">
                Book a Free Visit →
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {userVisits.slice(0, 3).map((visit) => (
                <div
                  key={visit.id}
                  className="p-3.5 bg-[#121214] rounded-2xl border border-white/10 flex items-center justify-between gap-3 text-xs"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <img src={visit.propertyImage} alt={visit.propertyName} className="w-12 h-12 rounded-xl object-cover border border-white/10" />
                    <div className="min-w-0">
                      <h4 className="font-bold text-white truncate">{visit.propertyName}</h4>
                      <p className="text-slate-400 truncate">{visit.date} ({visit.preferredTime})</p>
                    </div>
                  </div>
                  <StatusBadge status={visit.status} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Recommended Section */}
      <div className="space-y-4 pt-4 text-white">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-black text-white">Handpicked Stays Near Your College</h3>
          <Link to="/explore" className="text-xs font-bold text-amber-400 hover:underline">
            See More
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {recommendedProperties.map((p) => (
            <PropertyCard key={p.id} property={p} />
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
};
