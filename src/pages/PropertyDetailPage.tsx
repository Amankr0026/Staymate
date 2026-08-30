import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  MapPin,
  GraduationCap,
  Star,
  ShieldCheck,
  Heart,
  Layers,
  Phone,
  MessageCircle,
  Calendar,
  Bed,
  Check,
  X,
  Clock,
  Zap,
  Utensils,
  Share2,
  ChevronRight,
  UserCheck,
  Building,
  Info,
  Sparkles,
} from 'lucide-react';
import { useProperty } from '../context/PropertyContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { formatRent, formatCurrency } from '../utils/formatters';
import { ImageGallery } from '../components/property/ImageGallery';
import { GenderBadge, VerifiedBadge } from '../components/common/Badge';
import { renderAmenityIcon } from '../utils/amenities';
import { ReviewList } from '../components/property/ReviewList';
import { EnquiryModal } from '../components/property/EnquiryModal';
import { VisitRequestModal } from '../components/property/VisitRequestModal';
import { InteractiveMap } from '../components/property/InteractiveMap';
import { PropertyCard } from '../components/property/PropertyCard';

export const PropertyDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { properties, toggleFavorite, isFavorite, addToCompare, isCompared, getReviewsByProperty } = useProperty();
  const { user } = useAuth();
  const { success, info } = useToast();
  const navigate = useNavigate();

  const [isEnquiryModalOpen, setIsEnquiryModalOpen] = useState(false);
  const [isVisitModalOpen, setIsVisitModalOpen] = useState(false);
  const [selectedRoomIndex, setSelectedRoomIndex] = useState(0);

  const property = properties.find((p) => p.id === id) || properties[0];
  const reviews = getReviewsByProperty(property.id);

  const favorited = isFavorite(property.id);
  const compared = isCompared(property.id);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: property.name,
        text: `Check out ${property.name} on StayMate: ₹${property.startingRent}/mo near ${property.nearbyCollegeName}`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      success('Property link copied to clipboard!');
    }
  };

  const handleFavoriteToggle = () => {
    if (!user) {
      info('Please log in to save properties to your wishlist.');
      return;
    }
    toggleFavorite(property.id);
  };

  const handleCompareToggle = () => {
    if (compared) {
      navigate('/tenant/compare');
    } else {
      const added = addToCompare(property.id);
      if (added) {
        success('Added to comparison! Click Compare to view side-by-side.');
      } else {
        info('Max 4 properties in comparison.');
      }
    }
  };

  const similarProperties = properties
    .filter((p) => p.id !== property.id && p.nearbyCollegeId === property.nearbyCollegeId)
    .slice(0, 3);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8 text-slate-100">
      {/* Breadcrumbs */}
      <div className="flex items-center justify-between text-xs text-slate-400 font-medium">
        <div className="flex items-center gap-1.5 truncate">
          <Link to="/" className="hover:text-white">Home</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <Link to="/explore" className="hover:text-white">Explore</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <Link to={`/colleges/${property.nearbyCollegeId}`} className="hover:text-white">
            {property.nearbyCollegeName.split('(')[0]}
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-white font-bold truncate">{property.name}</span>
        </div>

        {/* Action icons */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={handleShare}
            className="p-2 rounded-xl border border-white/10 text-slate-300 hover:text-white hover:bg-white/5 transition-colors cursor-pointer flex items-center gap-1 text-xs font-semibold"
            title="Share"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Share</span>
          </button>
          <button
            onClick={handleCompareToggle}
            className={`p-2 rounded-xl border transition-colors cursor-pointer flex items-center gap-1 text-xs font-semibold ${
              compared
                ? 'bg-amber-500/10 border-amber-500/30 text-amber-400 font-bold'
                : 'border-white/10 text-slate-300 hover:bg-white/5 hover:text-white'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{compared ? 'In Compare' : 'Compare'}</span>
          </button>
          <button
            onClick={handleFavoriteToggle}
            className={`p-2 rounded-xl border transition-colors cursor-pointer flex items-center gap-1 text-xs font-semibold ${
              favorited
                ? 'bg-rose-500/10 border-rose-500/30 text-rose-400'
                : 'border-white/10 text-slate-300 hover:bg-white/5 hover:text-white'
            }`}
          >
            <Heart className={`w-3.5 h-3.5 ${favorited ? 'fill-rose-500 text-rose-500' : ''}`} />
            <span className="hidden sm:inline">{favorited ? 'Saved' : 'Save'}</span>
          </button>
        </div>
      </div>

      {/* Main Image Gallery */}
      <ImageGallery images={property.images} propertyName={property.name} />

      {/* Two Column Layout: Main Content + Sticky Owner Booking Box */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Main Details (8 cols) */}
        <div className="lg:col-span-8 space-y-8">
          {/* Header Block */}
          <div className="space-y-3 pb-6 border-b border-white/10">
            <div className="flex items-center gap-2 flex-wrap">
              <GenderBadge gender={property.genderPreference} size="md" />
              {property.isVerified && <VerifiedBadge size="md" />}
              <span className="text-xs font-bold text-slate-300 bg-white/5 border border-white/10 px-3 py-1 rounded-full">
                {property.type}
              </span>
              <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full">
                {property.availableBeds} beds available
              </span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
              {property.name}
            </h1>

            {property.tagline && (
              <p className="text-sm sm:text-base text-slate-400 font-medium">
                {property.tagline}
              </p>
            )}

            <div className="flex flex-wrap items-center gap-y-2 gap-x-4 text-xs sm:text-sm text-slate-400 pt-2">
              <div className="flex items-center gap-1.5 font-medium text-slate-300">
                <MapPin className="w-4 h-4 text-amber-500 shrink-0" />
                <span>{property.address}, {property.area}, {property.city}</span>
              </div>

              <div className="flex items-center gap-1.5 text-amber-400 font-semibold bg-amber-500/10 border border-amber-500/20 px-2.5 py-1 rounded-lg">
                <GraduationCap className="w-4 h-4" />
                <span>{property.distanceFromCollegeKm} km from {property.nearbyCollegeName} ({property.walkingTimeMins} mins walk)</span>
              </div>

              <div className="flex items-center gap-1 text-amber-400 font-bold bg-white/5 border border-white/10 px-2.5 py-1 rounded-lg">
                <Star className="w-4 h-4 fill-amber-400" />
                <span>{property.rating} ({property.reviewCount} student reviews)</span>
              </div>
            </div>
          </div>

          {/* Room Options & Sharing Matrix */}
          <div className="space-y-4">
            <h2 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
              <Bed className="w-5 h-5 text-amber-500" />
              <span>Available Room Options & Pricing</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {property.rooms.map((room, idx) => (
                <div
                  key={idx}
                  onClick={() => setSelectedRoomIndex(idx)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                    selectedRoomIndex === idx
                      ? 'border-amber-500 bg-amber-500/10 shadow-lg'
                      : 'border-white/10 bg-[#161618] hover:border-white/20'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-black uppercase text-amber-400">
                      {room.type} Sharing
                    </span>
                    <span className="text-[11px] font-bold text-slate-300 bg-white/10 px-2 py-0.5 rounded-md">
                      {room.availableBeds} vacant
                    </span>
                  </div>

                  <h3 className="font-bold text-sm text-white mb-1">{room.label}</h3>
                  <div className="text-lg font-black text-white mb-3">
                    {formatRent(room.rent)}
                  </div>

                  <div className="space-y-1.5 text-xs text-slate-300 border-t border-white/10 pt-2.5">
                    <div className="flex items-center gap-1.5">
                      <Check className={`w-3.5 h-3.5 ${room.hasAC ? 'text-amber-400' : 'text-slate-600'}`} />
                      <span>{room.hasAC ? 'Air Conditioned (AC)' : 'Non-AC Room'}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Check className={`w-3.5 h-3.5 ${room.hasAttachedBathroom ? 'text-amber-400' : 'text-slate-600'}`} />
                      <span>{room.hasAttachedBathroom ? 'Attached Washroom' : 'Shared Washroom'}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Check className={`w-3.5 h-3.5 ${room.isFurnished ? 'text-amber-400' : 'text-slate-600'}`} />
                      <span>Fully Furnished (Bed, Desk, Almirah)</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Pricing & Deposit Breakdown */}
          <div className="bg-[#161618] rounded-2xl p-5 sm:p-6 border border-white/10 space-y-4">
            <h2 className="text-base font-bold text-white">Rental & Deposit Details</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
              <div>
                <span className="text-slate-400 font-medium block">Monthly Rent</span>
                <span className="font-extrabold text-sm text-white">
                  {formatRent(property.rooms[selectedRoomIndex]?.rent || property.startingRent)}
                </span>
              </div>
              <div>
                <span className="text-slate-400 font-medium block">Security Deposit</span>
                <span className="font-extrabold text-sm text-white">
                  {formatCurrency(property.securityDeposit)} (Refundable)
                </span>
              </div>
              <div>
                <span className="text-slate-400 font-medium block">Notice Period</span>
                <span className="font-extrabold text-sm text-white">
                  {property.noticePeriodDays} Days
                </span>
              </div>
              <div>
                <span className="text-slate-400 font-medium block">Electricity Charges</span>
                <span className="font-extrabold text-sm text-white capitalize">
                  {property.electricityCharges.type === 'included'
                    ? '100% Free / Included'
                    : property.electricityCharges.type === 'metered'
                    ? `₹${property.electricityCharges.ratePerUnit}/unit Submeter`
                    : 'Fixed Monthly'}
                </span>
              </div>
            </div>
          </div>

          {/* Mess & Food Provision */}
          <div className="p-5 sm:p-6 bg-emerald-950/20 rounded-2xl border border-emerald-500/20 space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-emerald-300 flex items-center gap-2">
                <Utensils className="w-5 h-5 text-emerald-400" />
                <span>Food & Mess Facility</span>
              </h2>
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-500 text-black">
                {property.foodService.available ? 'Meals Available' : 'No Mess'}
              </span>
            </div>

            {property.foodService.available ? (
              <div className="space-y-2 text-xs text-emerald-200">
                <p className="font-medium">
                  {property.foodService.type === 'included'
                    ? '3 Freshly cooked homestyle hygienic meals daily (Breakfast, Lunch, Dinner) included in rent.'
                    : `Optional Mess Subscription available at ₹${property.foodService.costPerMonth}/month extra.`}
                </p>
                <div className="flex items-center gap-2 flex-wrap pt-1">
                  {property.foodService.mealsProvided.map((m, i) => (
                    <span key={i} className="bg-[#161618] text-emerald-300 border border-emerald-500/30 font-semibold px-2.5 py-1 rounded-md">
                      ✓ {m}
                    </span>
                  ))}
                  <span className="bg-[#161618] text-emerald-300 border border-emerald-500/30 font-semibold px-2.5 py-1 rounded-md">
                    ✓ Special Sunday Feast
                  </span>
                </div>
              </div>
            ) : (
              <p className="text-xs text-slate-400">Students have access to self-cooking kitchen or tiffin delivery.</p>
            )}
          </div>

          {/* Amenities Grid */}
          <div className="space-y-4">
            <h2 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-500" />
              <span>Amenities & Facilities</span>
            </h2>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {property.amenities.map((amenity, i) => (
                <div
                  key={i}
                  className="p-3.5 bg-[#161618] border border-white/10 rounded-2xl flex items-center gap-3"
                >
                  <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center border border-amber-500/20">
                    {renderAmenityIcon(amenity, 'w-4 h-4')}
                  </div>
                  <span className="text-xs font-bold text-slate-200">{amenity}</span>
                </div>
              ))}
            </div>
          </div>

          {/* House Rules & Curfew */}
          <div className="space-y-4">
            <h2 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
              <Clock className="w-5 h-5 text-amber-500" />
              <span>House Rules & Timing Policies</span>
            </h2>

            <div className="bg-[#161618] p-5 rounded-2xl border border-white/10 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="p-3 bg-[#101012] border border-white/10 rounded-xl space-y-1">
                  <span className="text-slate-400 font-semibold">Evening Curfew Time</span>
                  <p className="text-sm font-extrabold text-white">{property.rules.curfewTime}</p>
                </div>
                <div className="p-3 bg-[#101012] border border-white/10 rounded-xl space-y-1">
                  <span className="text-slate-400 font-semibold">Main Gate Closing</span>
                  <p className="text-sm font-extrabold text-white">{property.rules.gateClosingTime}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 text-xs font-semibold">
                <div className="flex items-center gap-2">
                  {property.rules.areVisitorsAllowed ? (
                    <Check className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <X className="w-4 h-4 text-rose-400" />
                  )}
                  <span className="text-slate-300">{property.rules.areVisitorsAllowed ? 'Visitors Allowed' : 'No Visitors'}</span>
                </div>

                <div className="flex items-center gap-2">
                  {property.rules.isNonVegAllowed ? (
                    <Check className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <X className="w-4 h-4 text-rose-400" />
                  )}
                  <span className="text-slate-300">{property.rules.isNonVegAllowed ? 'Non-Veg Allowed' : 'Pure Veg Only'}</span>
                </div>

                <div className="flex items-center gap-2">
                  {property.rules.isSmokingAllowed ? (
                    <Check className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <X className="w-4 h-4 text-rose-400" />
                  )}
                  <span className="text-slate-300">{property.rules.isSmokingAllowed ? 'Smoking Area' : 'No Smoking'}</span>
                </div>

                <div className="flex items-center gap-2">
                  {property.rules.isAlcoholAllowed ? (
                    <Check className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <X className="w-4 h-4 text-rose-400" />
                  )}
                  <span className="text-slate-300">{property.rules.isAlcoholAllowed ? 'Alcohol Permitted' : 'Strictly No Alcohol'}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Interactive Map & Campus Distance */}
          <div className="space-y-4">
            <h2 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
              <MapPin className="w-5 h-5 text-amber-500" />
              <span>Location & Campus Vicinity</span>
            </h2>

            <div className="h-80 rounded-2xl overflow-hidden border border-white/10 shadow-xl">
              <InteractiveMap
                properties={[property]}
                highlightedPropertyId={property.id}
                className="h-full"
              />
            </div>

            <div className="p-4 bg-[#161618] rounded-xl border border-white/10 text-xs text-slate-300 flex items-center justify-between">
              <div>
                <span className="font-bold text-white">Metro Station:</span> {property.nearestMetroStation}
              </div>
              <div className="text-amber-400 font-semibold">
                {property.distanceFromCollegeKm} km from main university gate
              </div>
            </div>
          </div>

          {/* Student Reviews Section */}
          <ReviewList property={property} reviews={reviews} />
        </div>

        {/* Sticky Booking & Owner Card (4 cols) */}
        <div className="lg:col-span-4 lg:sticky lg:top-24 space-y-5">
          <div className="bg-[#161618] rounded-3xl p-6 border border-white/10 shadow-2xl space-y-5">
            <div>
              <span className="text-xs uppercase tracking-wider font-bold text-slate-400">Monthly Rent</span>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-black text-white">
                  {formatRent(property.rooms[selectedRoomIndex]?.rent || property.startingRent)}
                </span>
                <span className="text-xs text-slate-400 font-semibold">/ student bed</span>
              </div>
              <p className="text-xs text-amber-400 font-semibold mt-1">
                Zero Brokerage • Direct Owner Booking
              </p>
            </div>

            {/* Selected Room Pill */}
            <div className="p-3 bg-[#101012] rounded-xl border border-white/10 flex items-center justify-between text-xs font-bold text-slate-200">
              <span>{property.rooms[selectedRoomIndex]?.label || 'Selected Room'}</span>
              <span className="text-amber-400">
                {property.rooms[selectedRoomIndex]?.availableBeds || property.availableBeds} beds vacant
              </span>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <button
                id="book-visit-btn"
                onClick={() => setIsVisitModalOpen(true)}
                className="w-full py-3.5 rounded-2xl bg-amber-500 hover:bg-amber-400 text-black font-black text-sm shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2 transition-all hover:scale-[1.01] cursor-pointer"
              >
                <Calendar className="w-4 h-4" />
                <span>Schedule Free Visit</span>
              </button>

              <button
                id="contact-owner-btn"
                onClick={() => setIsEnquiryModalOpen(true)}
                className="w-full py-3.5 rounded-2xl bg-white/5 hover:bg-white/10 text-white font-bold text-sm border border-white/10 flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <Phone className="w-4 h-4 text-amber-400" />
                <span>Contact PG Owner</span>
              </button>
            </div>

            {/* Owner Quick Profile */}
            <div className="pt-4 border-t border-white/10 flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/20 font-extrabold flex items-center justify-center text-lg">
                {property.ownerName.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <h4 className="text-xs font-bold text-white truncate">{property.ownerName}</h4>
                  <ShieldCheck className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                </div>
                <p className="text-[11px] text-slate-400">PG Manager • Verified Owner</p>
                <p className="text-[10px] text-amber-400 font-semibold mt-0.5">Typically responds in 1 hour</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Similar PGs Section */}
      {similarProperties.length > 0 && (
        <div className="pt-12 border-t border-white/10 space-y-6">
          <h2 className="text-xl font-bold text-white">
            Other Stays near {property.nearbyCollegeName.split('(')[0]}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {similarProperties.map((p) => (
              <PropertyCard key={p.id} property={p} />
            ))}
          </div>
        </div>
      )}

      {/* Modals */}
      <EnquiryModal
        isOpen={isEnquiryModalOpen}
        onClose={() => setIsEnquiryModalOpen(false)}
        property={property}
      />
      <VisitRequestModal
        isOpen={isVisitModalOpen}
        onClose={() => setIsVisitModalOpen(false)}
        property={property}
      />
    </div>
  );
};
