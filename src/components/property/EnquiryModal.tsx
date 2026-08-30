import React, { useState } from 'react';
import { Send, Calendar, User, Phone, Mail, MessageSquare, Bed, CheckCircle2 } from 'lucide-react';
import type { Property } from '../../types';
import { Modal } from '../common/Modal';
import { useAuth } from '../../context/AuthContext';
import { useProperty } from '../../context/PropertyContext';
import { useToast } from '../../context/ToastContext';

interface EnquiryModalProps {
  isOpen: boolean;
  onClose: () => void;
  property: Property;
}

export const EnquiryModal: React.FC<EnquiryModalProps> = ({ isOpen, onClose, property }) => {
  const { user } = useAuth();
  const { sendEnquiry } = useProperty();
  const { success, error } = useToast();

  const [formData, setFormData] = useState({
    tenantName: user?.displayName || '',
    tenantPhone: user?.phone || '',
    tenantEmail: user?.email || '',
    preferredMoveInDate: new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
    preferredRoomType: property.rooms[0]?.label || 'Single AC Room',
    message: 'Hi, I am interested in booking a stay here for the upcoming semester. Please share details regarding vacancy and meal timings.',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.tenantName || !formData.tenantPhone) {
      error('Please provide your name and contact phone number.');
      return;
    }

    setIsSubmitting(true);
    try {
      await sendEnquiry({
        propertyId: property.id,
        propertyName: property.name,
        propertyImage: property.coverImage || property.images[0],
        propertyArea: `${property.area}, ${property.city}`,
        ownerId: property.ownerId,
        tenantId: user?.uid || `guest-${Date.now()}`,
        tenantName: formData.tenantName,
        tenantPhone: formData.tenantPhone,
        tenantEmail: formData.tenantEmail || 'student@staymate.com',
        message: formData.message,
        preferredMoveInDate: formData.preferredMoveInDate,
        preferredRoomType: formData.preferredRoomType,
      });

      setSubmitted(true);
      success('Enquiry sent to PG Owner successfully!');
      setTimeout(() => {
        setSubmitted(false);
        onClose();
      }, 2000);
    } catch (err) {
      error('Failed to send enquiry. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Contact Owner — ${property.name}`}
      subtitle={`Owner: ${property.ownerName} (${property.ownerPhone})`}
      maxWidth="lg"
      id="enquiry-modal"
    >
      {submitted ? (
        <div className="py-8 text-center space-y-3 animate-in zoom-in-95">
          <div className="w-16 h-16 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold text-white">Enquiry Dispatched!</h3>
          <p className="text-sm text-slate-400 max-w-sm mx-auto">
            The owner has received your request and will contact you directly via phone or WhatsApp.
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="p-3 bg-[#101012] rounded-xl border border-white/10 flex items-center justify-between text-xs text-white">
            <div>
              <span className="font-bold block">{property.name}</span>
              <span className="text-slate-400">{property.area}, {property.city} • Starts from ₹{property.startingRent.toLocaleString('en-IN')}/mo</span>
            </div>
            <span className="bg-amber-500 text-black font-bold px-2 py-0.5 rounded text-[11px]">
              Direct Contact
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Your Full Name</label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                <input
                  type="text"
                  required
                  value={formData.tenantName}
                  onChange={(e) => setFormData({ ...formData, tenantName: e.target.value })}
                  placeholder="e.g. Aarav Sharma"
                  className="w-full pl-9 pr-3 py-2 text-sm bg-[#121214] border border-white/10 rounded-xl text-white placeholder-slate-500 focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-hidden"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Phone / WhatsApp Number</label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                <input
                  type="tel"
                  required
                  value={formData.tenantPhone}
                  onChange={(e) => setFormData({ ...formData, tenantPhone: e.target.value })}
                  placeholder="+91 98765 43210"
                  className="w-full pl-9 pr-3 py-2 text-sm bg-[#121214] border border-white/10 rounded-xl text-white placeholder-slate-500 focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-hidden"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Preferred Room Type</label>
              <div className="relative">
                <Bed className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                <select
                  value={formData.preferredRoomType}
                  onChange={(e) => setFormData({ ...formData, preferredRoomType: e.target.value })}
                  className="w-full pl-9 pr-3 py-2 text-sm bg-[#121214] border border-white/10 rounded-xl text-white focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-hidden"
                >
                  {property.rooms.map((r, i) => (
                    <option key={i} value={r.label} className="bg-[#161618] text-white">
                      {r.label} (₹{r.rent.toLocaleString('en-IN')}/mo)
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Expected Move-in Date</label>
              <div className="relative">
                <Calendar className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                <input
                  type="date"
                  value={formData.preferredMoveInDate}
                  onChange={(e) => setFormData({ ...formData, preferredMoveInDate: e.target.value })}
                  className="w-full pl-9 pr-3 py-2 text-sm bg-[#121214] border border-white/10 rounded-xl text-white focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-hidden"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">Message to PG Owner</label>
            <div className="relative">
              <MessageSquare className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
              <textarea
                rows={3}
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="w-full pl-9 pr-3 py-2 text-sm bg-[#121214] border border-white/10 rounded-xl text-white placeholder-slate-500 focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-hidden"
              />
            </div>
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
              <span>{isSubmitting ? 'Sending...' : 'Send Free Enquiry'}</span>
            </button>
          </div>
        </form>
      )}
    </Modal>
  );
};
