import React from 'react';
import { Link } from 'react-router-dom';
import {
  HelpCircle,
  Phone,
  MessageCircle,
  Mail,
  Calendar,
  ExternalLink,
  CheckCircle,
  Clock,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useProperty } from '../../context/PropertyContext';
import { useToast } from '../../context/ToastContext';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { StatusBadge } from '../../components/common/Badge';
import { EmptyState } from '../../components/common/EmptyState';
import { formatDate } from '../../utils/formatters';

export const OwnerEnquiriesPage: React.FC = () => {
  const { user } = useAuth();
  const { properties, enquiries, updateEnquiryStatus } = useProperty();
  const { success } = useToast();

  const ownerProperties = properties.filter((p) => p.ownerId === user?.uid || p.ownerEmail === user?.email);
  const propertyIds = new Set(ownerProperties.map((p) => p.id));
  const ownerEnquiries = enquiries.filter((e) => propertyIds.has(e.propertyId));

  const handleStatusChange = async (enquiryId: string, newStatus: any) => {
    await updateEnquiryStatus(enquiryId, newStatus);
    success(`Enquiry status updated to ${newStatus}.`);
  };

  return (
    <DashboardLayout
      title="Student Leads & Room Enquiries"
      subtitle="Direct contact details and move-in requests from verified college students."
    >
      {ownerEnquiries.length === 0 ? (
        <EmptyState
          icon={HelpCircle}
          title="No Student Leads Yet"
          description="When students browse your PG listing and submit enquiries, their contact details will appear here."
          actionText="View My Listed PGs"
          actionHref="/owner/properties"
        />
      ) : (
        <div className="space-y-4 text-white">
          {ownerEnquiries.map((enq) => (
            <div
              key={enq.id}
              className="bg-[#161618] p-5 sm:p-6 rounded-3xl border border-white/10 shadow-lg space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 font-black flex items-center justify-center text-lg">
                    {enq.tenantName.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-bold text-base text-white">{enq.tenantName}</h3>
                    <p className="text-xs text-slate-400">
                      Enquired for <span className="font-semibold text-slate-200">{enq.propertyName}</span> • Preferred: {enq.preferredRoomType}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <StatusBadge status={enq.status} />
                  <select
                    value={enq.status}
                    onChange={(e) => handleStatusChange(enq.id, e.target.value)}
                    className="p-1.5 text-xs font-bold border border-white/10 rounded-lg bg-[#121214] text-slate-200 outline-hidden"
                  >
                    <option value="sent">Mark New</option>
                    <option value="viewed">Mark Contacted</option>
                    <option value="responded">Mark Converted</option>
                  </select>
                </div>
              </div>

              {/* Message */}
              <div className="p-4 bg-[#121214] rounded-2xl border border-white/5 text-xs text-slate-300 space-y-1">
                <span className="font-bold text-white block">Student Note:</span>
                <p className="italic">"{enq.message}"</p>
              </div>

              {/* Contact bar */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-2 text-xs border-t border-white/10">
                <div className="flex items-center gap-4 text-slate-400">
                  <span className="flex items-center gap-1">
                    <Phone className="w-3.5 h-3.5 text-slate-500" />
                    <span className="font-semibold text-slate-200">{enq.tenantPhone}</span>
                  </span>
                  <span className="flex items-center gap-1">
                    <Mail className="w-3.5 h-3.5 text-slate-500" />
                    <span>{enq.tenantEmail}</span>
                  </span>
                  <span>Received: {formatDate(enq.createdAt)}</span>
                </div>

                <div className="flex items-center gap-2">
                  <a
                    href={`https://wa.me/${enq.tenantPhone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Hi ${enq.tenantName}, regarding your inquiry for ${enq.propertyName} on StayMate...`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold flex items-center gap-1.5 transition-colors"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>WhatsApp</span>
                  </a>
                  <a
                    href={`tel:${enq.tenantPhone}`}
                    className="px-3.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/15 text-white font-bold flex items-center gap-1.5 transition-colors border border-white/10"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>Call</span>
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
