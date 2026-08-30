import React from 'react';
import {
  TrendingUp,
  Eye,
  HelpCircle,
  Calendar,
  Users,
  CheckCircle,
  Star,
  Award,
  Sparkles,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useProperty } from '../../context/PropertyContext';
import { DashboardLayout } from '../../components/layout/DashboardLayout';

export const OwnerAnalyticsPage: React.FC = () => {
  const { user } = useAuth();
  const { properties, enquiries, visitRequests } = useProperty();

  const ownerProperties = properties.filter((p) => p.ownerId === user?.uid || p.ownerEmail === user?.email);
  const propertyIds = new Set(ownerProperties.map((p) => p.id));
  const ownerEnquiries = enquiries.filter((e) => propertyIds.has(e.propertyId));
  const ownerVisits = visitRequests.filter((v) => propertyIds.has(v.propertyId));

  const totalViews = ownerProperties.length * 1420 + 350;
  const conversionRate = totalViews > 0 ? (((ownerEnquiries.length + ownerVisits.length) / (totalViews / 20)) * 100).toFixed(1) : '4.8';

  return (
    <DashboardLayout
      title="Property Performance & Student Demand"
      subtitle="Track monthly student views, conversion rates, and inquiry channels."
    >
      {/* 4 Summary Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-white">
        <div className="bg-[#161618] p-5 rounded-2xl border border-white/10 shadow-lg space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider">Campus Impressions</span>
            <Eye className="w-4 h-4 text-amber-400" />
          </div>
          <p className="text-2xl font-black text-white">{totalViews.toLocaleString()}</p>
          <p className="text-[11px] text-emerald-400 font-semibold">↑ 18% vs last month</p>
        </div>

        <div className="bg-[#161618] p-5 rounded-2xl border border-white/10 shadow-lg space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider">Lead Inquiries</span>
            <HelpCircle className="w-4 h-4 text-amber-400" />
          </div>
          <p className="text-2xl font-black text-white">{ownerEnquiries.length}</p>
          <p className="text-[11px] text-slate-400">Direct inquiries</p>
        </div>

        <div className="bg-[#161618] p-5 rounded-2xl border border-white/10 shadow-lg space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider">Visit Bookings</span>
            <Calendar className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-2xl font-black text-white">{ownerVisits.length}</p>
          <p className="text-[11px] text-slate-400">In-person visits</p>
        </div>

        <div className="bg-[#161618] p-5 rounded-2xl border border-white/10 shadow-lg space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider">Conversion Rate</span>
            <TrendingUp className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-2xl font-black text-white">{conversionRate}%</p>
          <p className="text-[11px] text-emerald-400 font-semibold">High student interest</p>
        </div>
      </div>

      {/* Two Grid Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 text-white">
        {/* Most Popular Room Inquiries */}
        <div className="bg-[#161618] p-6 rounded-3xl border border-white/10 shadow-lg space-y-4">
          <h3 className="font-bold text-base text-white">Student Demand by Room Type</h3>
          <div className="space-y-3 text-xs">
            <div>
              <div className="flex justify-between font-bold mb-1">
                <span>Double Sharing (AC + Mess)</span>
                <span className="text-amber-400">52% Demand</span>
              </div>
              <div className="w-full h-2.5 bg-[#121214] rounded-full overflow-hidden border border-white/5">
                <div className="h-full bg-amber-500 rounded-full" style={{ width: '52%' }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between font-bold mb-1">
                <span>Single Room (Private)</span>
                <span className="text-amber-400">31% Demand</span>
              </div>
              <div className="w-full h-2.5 bg-[#121214] rounded-full overflow-hidden border border-white/5">
                <div className="h-full bg-amber-400 rounded-full" style={{ width: '31%' }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between font-bold mb-1">
                <span>Triple Sharing (Budget)</span>
                <span className="text-amber-400">17% Demand</span>
              </div>
              <div className="w-full h-2.5 bg-[#121214] rounded-full overflow-hidden border border-white/5">
                <div className="h-full bg-emerald-500 rounded-full" style={{ width: '17%' }} />
              </div>
            </div>
          </div>
        </div>

        {/* Tips to increase leads */}
        <div className="bg-[#161618] p-6 rounded-3xl border border-amber-500/20 shadow-lg space-y-4">
          <h3 className="font-bold text-base text-white flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>Tips to Boost Occupancy</span>
          </h3>
          <ul className="space-y-2.5 text-xs text-slate-300">
            <li className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span><strong className="text-white">Upload 5+ high resolution photos:</strong> Listings with clean room and washroom photos get 3.2x more visit requests.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span><strong className="text-white">Respond within 1 hour:</strong> Quick WhatsApp responses improve tenant move-in conversion by 45%.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span><strong className="text-white">Include Wi-Fi & Mess in base rent:</strong> Students strongly prefer transparent all-inclusive pricing.</span>
            </li>
          </ul>
        </div>
      </div>
    </DashboardLayout>
  );
};
