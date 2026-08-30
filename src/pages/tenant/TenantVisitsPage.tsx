import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Clock, MapPin, ExternalLink, CheckCircle2, Phone } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useProperty } from '../../context/PropertyContext';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { StatusBadge } from '../../components/common/Badge';
import { EmptyState } from '../../components/common/EmptyState';

export const TenantVisitsPage: React.FC = () => {
  const { user } = useAuth();
  const { visitRequests } = useProperty();

  const userVisits = visitRequests.filter(
    (v) => v.tenantId === user?.uid || user?.email === v.tenantEmail
  );

  return (
    <DashboardLayout
      title="Scheduled Property Visits"
      subtitle="View confirmation status, date, and contact instructions for in-person campus PG visits."
    >
      {userVisits.length === 0 ? (
        <EmptyState
          icon={Calendar}
          title="No Scheduled Visits"
          description="Book a free visit to any PG before finalizing. Meet the manager and check room conditions."
          actionText="Discover PGs Near Campus"
          actionHref="/explore"
        />
      ) : (
        <div className="space-y-4 text-white">
          {userVisits.map((visit) => (
            <div
              key={visit.id}
              className="bg-[#161618] p-5 sm:p-6 rounded-3xl border border-white/10 shadow-lg space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <img
                    src={visit.propertyImage}
                    alt={visit.propertyName}
                    className="w-14 h-14 rounded-2xl object-cover shrink-0 border border-white/10"
                  />
                  <div>
                    <Link
                      to={`/property/${visit.propertyId}`}
                      className="font-bold text-sm sm:text-base text-white hover:text-amber-400 flex items-center gap-1.5 transition-colors"
                    >
                      <span>{visit.propertyName}</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </Link>
                    <div className="flex items-center gap-3 text-xs text-slate-400 mt-0.5">
                      <span className="flex items-center gap-1 text-amber-400 font-semibold">
                        <Calendar className="w-3.5 h-3.5" />
                        {visit.date}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        {visit.preferredTime}
                      </span>
                    </div>
                  </div>
                </div>

                <StatusBadge status={visit.status} />
              </div>

              {visit.notes && (
                <div className="p-3.5 bg-[#121214] rounded-2xl border border-white/10 text-xs text-slate-300">
                  <span className="font-bold text-white block mb-1">Your notes:</span>
                  <p className="italic text-slate-400">"{visit.notes}"</p>
                </div>
              )}

              <div className="flex flex-wrap items-center justify-between gap-3 pt-2 text-xs border-t border-white/10">
                <div className="text-slate-400 font-medium">
                  Status: <span className="font-bold text-white capitalize">{visit.status}</span>
                </div>

                <div className="flex items-center gap-2">
                  <Link
                    to={`/property/${visit.propertyId}`}
                    className="px-3.5 py-1.5 rounded-lg border border-white/10 font-semibold text-slate-300 hover:bg-white/5 hover:text-white transition-colors"
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
