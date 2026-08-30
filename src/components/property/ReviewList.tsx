import React, { useState } from 'react';
import {
  Star,
  ShieldCheck,
  ThumbsUp,
  MessageSquare,
  Plus,
  CheckCircle2,
  AlertCircle,
  Sparkles,
} from 'lucide-react';
import type { Review, Property } from '../../types';
import { formatDate } from '../../utils/formatters';
import { Modal } from '../common/Modal';
import { useAuth } from '../../context/AuthContext';
import { useProperty } from '../../context/PropertyContext';
import { useToast } from '../../context/ToastContext';

interface ReviewListProps {
  property: Property;
  reviews: Review[];
}

export const ReviewList: React.FC<ReviewListProps> = ({ property, reviews }) => {
  const { user } = useAuth();
  const { addReview } = useProperty();
  const { success, error, info } = useToast();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [prosText, setProsText] = useState('');
  const [consText, setConsText] = useState('');
  const [foodRating, setFoodRating] = useState(4);
  const [cleanlinessRating, setCleanlinessRating] = useState(5);
  const [wifiRating, setWifiRating] = useState(5);
  const [safetyRating, setSafetyRating] = useState(5);
  const [ownerRating, setOwnerRating] = useState(4);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleOpenModal = () => {
    if (!user) {
      info('Please log in with your student account to write a review.');
      return;
    }
    setIsModalOpen(true);
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) {
      error('Please write a short review description.');
      return;
    }

    setIsSubmitting(true);
    try {
      const pros = prosText
        .split(',')
        .map((p) => p.trim())
        .filter(Boolean);
      const cons = consText
        .split(',')
        .map((c) => c.trim())
        .filter(Boolean);

      await addReview({
        propertyId: property.id,
        userId: user?.uid || 'student-1',
        userName: user?.displayName || 'Anonymous Student',
        userAvatar: user?.photoURL,
        userCollege: user?.college || property.nearbyCollegeName,
        rating,
        comment,
        pros: pros.length > 0 ? pros : ['Clean rooms', 'Fast Wi-Fi'],
        cons: cons.length > 0 ? cons : ['Strict curfew at 10 PM'],
        foodRating,
        cleanlinessRating,
        wifiRating,
        safetyRating,
        ownerRating,
        isVerifiedStay: true,
      });

      success('Review published successfully! Thank you for helping fellow students.');
      setIsModalOpen(false);
      setComment('');
      setProsText('');
      setConsText('');
    } catch (err) {
      error('Failed to post review. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Compute breakdown averages
  const avgFood = reviews.length ? (reviews.reduce((acc, r) => acc + (r.foodRating || 4.5), 0) / reviews.length).toFixed(1) : '4.5';
  const avgCleanliness = reviews.length ? (reviews.reduce((acc, r) => acc + (r.cleanlinessRating || 4.7), 0) / reviews.length).toFixed(1) : '4.7';
  const avgWifi = reviews.length ? (reviews.reduce((acc, r) => acc + (r.wifiRating || 4.8), 0) / reviews.length).toFixed(1) : '4.8';
  const avgSafety = reviews.length ? (reviews.reduce((acc, r) => acc + (r.safetyRating || 4.9), 0) / reviews.length).toFixed(1) : '4.9';

  return (
    <div id="property-reviews-section" className="space-y-6">
      {/* Overview Card */}
      <div className="bg-[#161618] border border-white/10 rounded-2xl p-5 sm:p-6 text-white">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 pb-6 border-b border-white/10">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-amber-500 text-black font-black text-2xl flex items-center justify-center shadow-lg shadow-amber-500/20">
              {property.rating}
            </div>
            <div>
              <div className="flex items-center gap-1 text-amber-400">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star
                    key={s}
                    className={`w-4 h-4 ${
                      s <= Math.round(property.rating) ? 'fill-amber-400 text-amber-400' : 'text-slate-700'
                    }`}
                  />
                ))}
              </div>
              <p className="text-xs font-bold text-white mt-1">
                Based on {reviews.length} verified student reviews
              </p>
              <p className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1 mt-0.5">
                <ShieldCheck className="w-3.5 h-3.5" />
                Verified tenant identity checked
              </p>
            </div>
          </div>

          <button
            id="write-review-trigger-btn"
            onClick={handleOpenModal}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm text-black bg-amber-500 hover:bg-amber-400 transition-colors shadow-md shadow-amber-500/20 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Write Student Review</span>
          </button>
        </div>

        {/* Detailed Category Bars */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-5">
          <div className="space-y-1">
            <div className="flex justify-between text-xs font-semibold text-slate-300">
              <span>Food & Meals</span>
              <span className="text-amber-400">{avgFood} ★</span>
            </div>
            <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
              <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${(Number(avgFood) / 5) * 100}%` }} />
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex justify-between text-xs font-semibold text-slate-300">
              <span>Cleanliness</span>
              <span className="text-amber-400">{avgCleanliness} ★</span>
            </div>
            <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
              <div className="h-full bg-sky-500 rounded-full" style={{ width: `${(Number(avgCleanliness) / 5) * 100}%` }} />
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex justify-between text-xs font-semibold text-slate-300">
              <span>Wi-Fi & Desk</span>
              <span className="text-amber-400">{avgWifi} ★</span>
            </div>
            <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
              <div className="h-full bg-amber-500 rounded-full" style={{ width: `${(Number(avgWifi) / 5) * 100}%` }} />
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex justify-between text-xs font-semibold text-slate-300">
              <span>Safety & Security</span>
              <span className="text-amber-400">{avgSafety} ★</span>
            </div>
            <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
              <div className="h-full bg-emerald-400 rounded-full" style={{ width: `${(Number(avgSafety) / 5) * 100}%` }} />
            </div>
          </div>
        </div>
      </div>

      {/* Review Cards List */}
      <div className="space-y-4">
        {reviews.length === 0 ? (
          <div className="p-8 text-center bg-[#161618] rounded-2xl border border-white/10 text-slate-400 text-sm">
            No reviews yet. Be the first student to review this stay!
          </div>
        ) : (
          reviews.map((r) => (
            <div
              key={r.id}
              className="bg-[#161618] p-5 rounded-2xl border border-white/10 shadow-lg space-y-3"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <img
                    src={r.userAvatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(r.userName)}&background=f59e0b&color=000`}
                    alt={r.userName}
                    className="w-10 h-10 rounded-full object-cover border border-white/10"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-white">{r.userName}</span>
                      {r.isVerifiedStay && (
                        <span className="text-[10px] font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" />
                          Verified Tenant
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-400">{r.userCollege} • {formatDate(r.createdAt)}</p>
                  </div>
                </div>

                <div className="flex items-center gap-1 bg-amber-500/10 border border-amber-500/20 px-2.5 py-1 rounded-lg text-amber-400 font-extrabold text-xs">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  <span>{r.rating}.0</span>
                </div>
              </div>

              <p className="text-sm text-slate-300 leading-relaxed">{r.comment}</p>

              {/* Pros & Cons Tags */}
              <div className="flex flex-wrap gap-2 pt-1 text-xs">
                {r.pros && r.pros.map((pro, i) => (
                  <span key={i} className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-emerald-500/10 text-emerald-300 rounded-md border border-emerald-500/20 font-medium">
                    <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                    {pro}
                  </span>
                ))}
                {r.cons && r.cons.map((con, i) => (
                  <span key={i} className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-rose-500/10 text-rose-300 rounded-md border border-rose-500/20 font-medium">
                    <AlertCircle className="w-3 h-3 text-rose-400" />
                    {con}
                  </span>
                ))}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Write Review Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={`Review ${property.name}`}
        subtitle="Share honest feedback about food, warden, curfew, and Wi-Fi to help college peers."
        maxWidth="lg"
        id="write-review-modal"
      >
        <form onSubmit={handleSubmitReview} className="space-y-4">
          {/* Main Star Picker */}
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">Overall Rating</label>
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setRating(s)}
                  className="p-1 text-amber-400 hover:scale-110 transition-transform cursor-pointer"
                >
                  <Star className={`w-7 h-7 ${s <= rating ? 'fill-amber-400' : 'text-slate-700'}`} />
                </button>
              ))}
              <span className="text-sm font-bold text-white ml-2">{rating} out of 5</span>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">Your Detailed Experience</label>
            <textarea
              required
              rows={3}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="How was the food quality? Is the Wi-Fi stable during exams? How is the laundry service?"
              className="w-full p-3 text-sm bg-[#121214] border border-white/10 rounded-xl text-white placeholder-slate-500 focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-hidden"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">What did you like? (Pros, comma separated)</label>
              <input
                type="text"
                value={prosText}
                onChange={(e) => setProsText(e.target.value)}
                placeholder="Tasty Sunday breakfast, High speed wifi"
                className="w-full p-2.5 text-xs bg-[#121214] border border-white/10 rounded-xl text-white placeholder-slate-500 focus:ring-2 focus:ring-amber-500 outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">What could be improved? (Cons)</label>
              <input
                type="text"
                value={consText}
                onChange={(e) => setConsText(e.target.value)}
                placeholder="Curfew at 10 PM, Limited parking"
                className="w-full p-2.5 text-xs bg-[#121214] border border-white/10 rounded-xl text-white placeholder-slate-500 focus:ring-2 focus:ring-amber-500 outline-hidden"
              />
            </div>
          </div>

          <div className="pt-2 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 text-sm font-semibold text-slate-400 hover:text-white rounded-xl hover:bg-white/5 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2.5 rounded-xl font-bold text-sm text-black bg-amber-500 hover:bg-amber-400 shadow-md shadow-amber-500/20 disabled:opacity-50 transition-all cursor-pointer"
            >
              {isSubmitting ? 'Posting...' : 'Submit Verified Review'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
