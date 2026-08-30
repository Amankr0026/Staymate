import React from 'react';
import {
  Calendar,
  Clock,
  Phone,
  MessageCircle,
  Mail,
  CheckCircle,
  XCircle,
  UserCheck,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useProperty } from '../../context/PropertyContext';
import { useToast } from '../../context/ToastContext';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { StatusBadge } from '../../components/common/Badge';
import { EmptyState } from '../../components/common/EmptyState';

export const OwnerVisitsPage: React.FC = () => {
  const { user } = useAuth();
  const { properties, visitRequests, updateVisitStatus } = useProperty();
  const { success } = useToast();

  const ownerProperties = properties.filter((p) => p.ownerId === user?.uid || p.ownerEmail === user?.email);
  const propertyIds = new Set(ownerProperties.map((p) => p.id));
  const ownerVisits = visitRequests.filter((v) => propertyIds.has(v.propertyId));

  const handleStatusChange = async (visitId: string, status: any) => {
    await updateVisitStatus(visitId, status);
    success(`Visit marked as ${status}.`);
  };

  return (
    <DashboardLayout
      title="Scheduled Student In-Person Visits"
      subtitle="Accept, reschedule, or confirm visits with visiting students and parents."
    >
      {ownerVisits.length === 0 ? (
        <EmptyState
          icon={Calendar}
          title="No Visit Requests Yet"
          description="When students book a free inspection slot, their schedule will appear here."
          actionText="View My Properties"
          actionHref="/owner/properties"
        />
      ) : (
        <div className="space-y-4 text-white">
          {ownerVisits.map((visit) => (
            <div
              key={visit.id}
              className="bg-[#161618] p-5 sm:p-6 rounded-3xl border border-white/10 shadow-lg space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 font-black flex items-center justify-center text-lg">
                    {visit.tenantName.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-bold text-base text-white">{visit.tenantName}</h3>
                    <p className="text-xs text-slate-400">
                      Visiting <span className="font-semibold text-slate-200">{visit.propertyName}</span>
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <StatusBadge status={visit.status} />
                  <div className="flex items-center gap-1.5">
                    {visit.status === 'pending' && (
                      <>
                        <button
                          onClick={() => handleStatusChange(visit.id, 'accepted')}
                          className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-colors cursor-pointer"
                        >
                          Confirm
                        </button>
                        <button
                          onClick={() => handleStatusChange(visit.id, 'cancelled')}
                          className="px-3 py-1.5 rounded-xl border border-rose-500/30 text-rose-400 hover:bg-rose-500/10 text-xs font-bold transition-colors cursor-pointer"
                        >
                          Decline
                        </button>
                      </>
                    )}
                    {visit.status === 'accepted' && (
                      <button
                        onClick={() => handleStatusChange(visit.id, 'completed')}
                        className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black text-xs font-bold transition-colors cursor-pointer"
                      >
                        Mark Completed
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Date & Time slot highlight */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-[#121214] rounded-xl border border-white/5 flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-amber-400" />
                  <div>
                    <span className="text-slate-400 block">Requested Date:</span>
                    <span className="font-bold text-white">{visit.date}</span>
                  </div>
                </div>
                <div className="p-3 bg-[#121214] rounded-xl border border-white/5 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-amber-400" />
                  <div>
                    <span className="text-slate-400 block">Time Slot:</span>
                    <span className="font-bold text-white">{visit.preferredTime}</span>
                  </div>
                </div>
              </div>

              {visit.notes && (
                <div className="p-3 bg-[#121214] rounded-xl border border-white/5 text-xs text-slate-300">
                  <span className="font-bold text-white">Student Note:</span> {visit.notes}
                </div>
              )}

              {/* Contact student */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-2 text-xs border-t border-white/10">
                <div className="flex items-center gap-3 text-slate-400">
                  <span>Student Phone: <strong className="text-slate-200">{visit.tenantPhone}</strong></span>
                  <span>Email: {visit.tenantEmail}</span>
                </div>

                <div className="flex items-center gap-2">
                  <a
                    href={`https://wa.me/${visit.tenantPhone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Hi ${visit.tenantName}, confirming your visit slot for ${visit.propertyName} on ${visit.date}...`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold flex items-center gap-1.5 transition-colors"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>WhatsApp Student</span>
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
};
