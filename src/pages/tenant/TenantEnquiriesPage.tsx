import React from 'react';
import { Link } from 'react-router-dom';
import { HelpCircle, ExternalLink, Calendar, Phone, MessageSquare } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useProperty } from '../../context/PropertyContext';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { StatusBadge } from '../../components/common/Badge';
import { EmptyState } from '../../components/common/EmptyState';
import { formatDate } from '../../utils/formatters';

export const TenantEnquiriesPage: React.FC = () => {
  const { user } = useAuth();
  const { enquiries } = useProperty();

  const userEnquiries = enquiries.filter(
    (e) => e.tenantId === user?.uid || user?.email === e.tenantEmail
  );

  return (
    <DashboardLayout
      title="My Direct PG Enquiries"
      subtitle="Track messages and availability requests sent directly to PG owners."
    >
      {userEnquiries.length === 0 ? (
        <EmptyState
          icon={HelpCircle}
          title="No Active Enquiries"
          description="Send direct inquiries to property managers to check room vacancies, custom meal options, or move-in discounts."
          actionText="Browse Available Stays"
          actionHref="/explore"
        />
      ) : (
        <div className="space-y-4 text-white">
          {userEnquiries.map((enq) => (
            <div
              key={enq.id}
              className="bg-[#161618] p-5 sm:p-6 rounded-3xl border border-white/10 shadow-lg space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <img
                    src={enq.propertyImage}
                    alt={enq.propertyName}
                    className="w-14 h-14 rounded-2xl object-cover shrink-0 border border-white/10"
                  />
                  <div>
                    <Link
                      to={`/property/${enq.propertyId}`}
                      className="font-bold text-sm sm:text-base text-white hover:text-amber-400 flex items-center gap-1.5 transition-colors"
                    >
                      <span>{enq.propertyName}</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </Link>
                    <p className="text-xs text-slate-400">
                      Sent on {formatDate(enq.createdAt)} • Preferred: {enq.preferredRoomType}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <StatusBadge status={enq.status} />
                </div>
              </div>

              {/* Message Content */}
              <div className="p-3.5 bg-[#121214] rounded-2xl border border-white/10 text-xs text-slate-300">
                <span className="font-bold text-white block mb-1">Your message:</span>
                <p className="italic text-slate-400">"{enq.message}"</p>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3 pt-2 text-xs border-t border-white/10">
                <div className="text-slate-400 font-medium">
                  Move-in date: <span className="font-bold text-white">{enq.moveInDate || 'Immediate'}</span>
                </div>

                <div className="flex items-center gap-2">
                  <Link
                    to={`/property/${enq.propertyId}`}
                    className="px-3 py-1.5 rounded-lg border border-white/10 font-semibold text-slate-300 hover:bg-white/5 hover:text-white transition-colors"
                  >
                    View Stay Details
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
};
