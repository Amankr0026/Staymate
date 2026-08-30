import React, { useState } from 'react';
import { Calendar, Clock, User, Phone, CheckCircle2, Send, ShieldAlert } from 'lucide-react';
import type { Property } from '../../types';
import { Modal } from '../common/Modal';
import { useAuth } from '../../context/AuthContext';
import { useProperty } from '../../context/PropertyContext';
import { useToast } from '../../context/ToastContext';

interface VisitRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  property: Property;
}

export const VisitRequestModal: React.FC<VisitRequestModalProps> = ({ isOpen, onClose, property }) => {
  const { user } = useAuth();
  const { requestVisit } = useProperty();
  const { success, error } = useToast();

  const [date, setDate] = useState(new Date(Date.now() + 86400000).toISOString().split('T')[0]);
  const [preferredTime, setPreferredTime] = useState<'morning' | 'afternoon' | 'evening'>('morning');
  const [tenantName, setTenantName] = useState(user?.displayName || '');
  const [tenantPhone, setTenantPhone] = useState(user?.phone || '');
  const [message, setMessage] = useState('I would like to visit the premises to inspect the room, study table, and mess dining area.');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tenantName || !tenantPhone || !date) {
      error('Please complete all required fields for scheduling.');
      return;
    }

    setIsSubmitting(true);
    try {
      const timeSlotMap = {
        morning: '10:00 AM - 1:00 PM',
        afternoon: '2:00 PM - 5:00 PM',
        evening: '5:00 PM - 8:00 PM',
      };

      await requestVisit({
        propertyId: property.id,
        propertyName: property.name,
        propertyImage: property.coverImage || property.images[0],
        propertyArea: `${property.area}, ${property.city}`,
        ownerId: property.ownerId,
        tenantId: user?.uid || `guest-${Date.now()}`,
        tenantName,
        tenantPhone,
        tenantEmail: user?.email || 'student@staymate.com',
        date,
        preferredTime,
        timeSlotDetail: timeSlotMap[preferredTime],
        message,
      });

      setSubmitted(true);
      success('Visit request scheduled! Owner will confirm shortly.');
      setTimeout(() => {
        setSubmitted(false);
        onClose();
      }, 2000);
    } catch (err) {
      error('Failed to request visit. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Schedule In-Person Visit — ${property.name}`}
      subtitle="Free visit with zero obligation. PG manager will guide you around the property."
      maxWidth="lg"
      id="visit-modal"
    >
      {submitted ? (
        <div className="py-8 text-center space-y-3 animate-in zoom-in-95">
          <div className="w-16 h-16 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold text-white">Visit Scheduled!</h3>
          <p className="text-sm text-slate-400 max-w-sm mx-auto">
            Your request for <span className="font-semibold text-amber-400">{date} ({preferredTime})</span> has been submitted. You can track confirmation status in your dashboard.
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Your Full Name</label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                <input
                  type="text"
                  required
                  value={tenantName}
                  onChange={(e) => setTenantName(e.target.value)}
                  placeholder="e.g. Aarav Sharma"
                  className="w-full pl-9 pr-3 py-2 text-sm bg-[#121214] border border-white/10 rounded-xl text-white placeholder-slate-500 focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-hidden"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Contact Phone</label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                <input
                  type="tel"
                  required
                  value={tenantPhone}
                  onChange={(e) => setTenantPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                  className="w-full pl-9 pr-3 py-2 text-sm bg-[#121214] border border-white/10 rounded-xl text-white placeholder-slate-500 focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-hidden"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Select Visit Date</label>
              <div className="relative">
                <Calendar className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                <input
                  type="date"
                  required
                  min={new Date().toISOString().split('T')[0]}
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-sm bg-[#121214] border border-white/10 rounded-xl text-white focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-hidden"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Preferred Time Window</label>
              <div className="grid grid-cols-3 gap-2">
                {(['morning', 'afternoon', 'evening'] as const).map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setPreferredTime(t)}
                    className={`py-2 px-1 text-center rounded-xl text-xs font-bold capitalize transition-colors cursor-pointer border ${
                      preferredTime === t
                        ? 'bg-amber-500 text-black border-amber-500 shadow-xs'
                        : 'bg-[#121214] text-slate-300 border-white/10 hover:bg-white/5'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">Visit Notes or Requests</label>
            <textarea
              rows={2}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="e.g. Coming with parents, want to inspect triple sharing mess"
              className="w-full p-3 text-sm bg-[#121214] border border-white/10 rounded-xl text-white placeholder-slate-500 focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-hidden"
            />
          </div>

          <div className="p-3 bg-[#101012] rounded-xl border border-white/10 flex items-start gap-2.5 text-xs text-slate-400">
            <Clock className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
            <p>
              The manager typically approves requests within 2 hours. Address: <span className="font-semibold text-white">{property.address}, {property.area}</span>
            </p>
          </div>

          <div className="pt-2 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-semibold text-slate-400 hover:text-white rounded-xl hover:bg-white/5 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm text-black bg-amber-500 hover:bg-amber-400 shadow-md shadow-amber-500/20 disabled:opacity-50 transition-all cursor-pointer"
            >
              <Send className="w-4 h-4" />
              <span>{isSubmitting ? 'Booking...' : 'Confirm Visit Slot'}</span>
            </button>
          </div>
        </form>
      )}
    </Modal>
  );
};
