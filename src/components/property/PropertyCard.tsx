import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Heart,
  Star,
  MapPin,
  GraduationCap,
  Sparkles,
  Bed,
  Check,
  Eye,
  Phone,
  Layers,
  Calendar,
} from 'lucide-react';
import type { Property } from '../../types';
import { formatRent } from '../../utils/formatters';
import { VerifiedBadge, GenderBadge } from '../common/Badge';
import { renderAmenityIcon } from '../../utils/amenities';
import { useProperty } from '../../context/PropertyContext';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { EnquiryModal } from './EnquiryModal';
import { VisitRequestModal } from './VisitRequestModal';

interface PropertyCardProps {
  property: Property;
  compact?: boolean;
  onHover?: (id: string | null) => void;
}

export const PropertyCard: React.FC<PropertyCardProps> = ({
  property,
  compact = false,
  onHover,
}) => {
  const { toggleFavorite, isFavorite, addToCompare, isCompared, removeFromCompare } = useProperty();
  const { user } = useAuth();
  const { info, success } = useToast();
  const [isEnquiryOpen, setIsEnquiryOpen] = useState(false);
  const [isVisitOpen, setIsVisitOpen] = useState(false);

  const favorited = isFavorite(property.id);
  const compared = isCompared(property.id);

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
      info('Please log in as a student to save properties!');
      return;
    }
    toggleFavorite(property.id);
    if (!favorited) {
      success(`Saved "${property.name}" to your wishlist!`);
    }
  };

  const handleCompareClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (compared) {
      removeFromCompare(property.id);
      info(`Removed "${property.name}" from comparison`);
    } else {
      const added = addToCompare(property.id);
      if (added) {
        success(`Added "${property.name}" to comparison!`);
      } else {
        info('You can compare maximum 4 properties at a time.');
      }
    }
  };

  return (
    <>
      <div
        id={`property-card-${property.id}`}
        onMouseEnter={() => onHover && onHover(property.id)}
        onMouseLeave={() => onHover && onHover(null)}
        className="group bg-[#161618] rounded-2xl border border-white/5 overflow-hidden shadow-xl hover:border-amber-500/30 transition-all duration-300 flex flex-col justify-between"
      >
        <div>
          {/* Cover Image & Badges */}
          <div className="relative aspect-16/10 overflow-hidden bg-[#1A1A1D]">
            <img
              src={property.coverImage || property.images[0] || 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=800&q=80'}
              alt={property.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0B]/80 via-transparent to-black/30" />

            {/* Top Badges */}
            <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
              <div className="flex items-center gap-1.5 pointer-events-auto">
                <GenderBadge gender={property.genderPreference} />
                {property.isVerified && <VerifiedBadge />}
              </div>

              <div className="flex items-center gap-1.5 pointer-events-auto">
                {/* Compare toggle */}
                <button
                  id={`compare-btn-${property.id}`}
                  onClick={handleCompareClick}
                  className={`p-2 rounded-full backdrop-blur-md transition-colors cursor-pointer ${
                    compared
                      ? 'bg-amber-500 text-black shadow-md'
                      : 'bg-black/50 text-white hover:bg-black/80 hover:text-amber-400'
                  }`}
                  title={compared ? 'Remove from compare' : 'Add to compare'}
                  aria-label="Compare property"
                >
                  <Layers className="w-3.5 h-3.5" />
                </button>

                {/* Heart / Wishlist button */}
                <button
                  id={`favorite-btn-${property.id}`}
                  onClick={handleFavoriteClick}
                  className={`p-2 rounded-full backdrop-blur-md transition-colors cursor-pointer ${
                    favorited
                      ? 'bg-rose-500 text-white shadow-md'
                      : 'bg-black/50 text-white hover:bg-black/80 hover:text-rose-400'
                  }`}
                  title={favorited ? 'Remove from saved' : 'Save property'}
                  aria-label="Save property"
                >
                  <Heart className={`w-3.5 h-3.5 ${favorited ? 'fill-white' : ''}`} />
                </button>
              </div>
            </div>

            {/* Bottom on-image info */}
            <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white text-xs">
              <span className="bg-[#0A0A0B]/85 backdrop-blur-md px-2.5 py-1 rounded-lg font-medium flex items-center gap-1 border border-white/10 text-slate-300">
                <GraduationCap className="w-3.5 h-3.5 text-amber-400" />
                <span>{property.distanceFromCollegeKm} km to {property.nearbyCollegeName.split('(')[0].trim()}</span>
              </span>

              <span className="bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-lg font-bold flex items-center gap-1 text-amber-500 border border-white/5 text-xs">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                <span>{property.rating} <span className="text-slate-400 font-normal">({property.reviewCount})</span></span>
              </span>
            </div>
          </div>

          {/* Card Body */}
          <div className="p-4 sm:p-5 space-y-3">
            <div>
              <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium">
                <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                <span className="truncate">{property.area}, {property.city}</span>
              </div>

              <Link
                to={`/property/${property.id}`}
                className="block group-hover:text-amber-400 transition-colors"
              >
                <h3 className="text-base font-bold text-white leading-snug mt-1 line-clamp-1">
                  {property.name}
                </h3>
              </Link>

              {property.tagline && (
                <p className="text-xs text-slate-400 line-clamp-1 mt-0.5 font-normal">
                  {property.tagline}
                </p>
              )}
            </div>

            {/* Available Room Options */}
            <div className="flex items-center gap-1.5 flex-wrap">
              {property.rooms.map((room, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center gap-1 text-[11px] font-medium bg-white/5 border border-white/10 text-slate-300 px-2 py-0.5 rounded-md"
                >
                  <Bed className="w-3 h-3 text-slate-400" />
                  <span className="capitalize">{room.type}</span>
                </span>
              ))}
              {property.foodService.available && (
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold bg-amber-500/10 text-amber-400 px-2 py-0.5 rounded-md border border-amber-500/20">
                  <Check className="w-3 h-3 text-amber-500" />
                  Meals Included
                </span>
              )}
            </div>

            {/* Amenities Preview */}
            <div className="pt-2 border-t border-white/10 flex items-center gap-2 overflow-hidden text-slate-400">
              {property.amenities.slice(0, 4).map((amenity, i) => (
                <div
                  key={i}
                  className="flex items-center gap-1 text-[11px] bg-white/5 text-slate-300 px-2 py-1 rounded-md shrink-0 border border-white/5"
                  title={amenity}
                >
                  {renderAmenityIcon(amenity, 'w-3 h-3 text-amber-400')}
                  <span>{amenity}</span>
                </div>
              ))}
              {property.amenities.length > 4 && (
                <span className="text-[10px] text-slate-500 font-semibold">
                  +{property.amenities.length - 4} more
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Pricing & CTA footer */}
        <div className="px-4 sm:px-5 py-3.5 bg-[#121214] border-t border-white/5 flex items-center justify-between gap-3">
          <div>
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500 block">
              Starts From
            </span>
            <div className="text-base font-bold text-white">
              {formatRent(property.startingRent)}
              <span className="text-slate-500 text-[10px] font-normal"> /mo</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              id={`card-enquiry-btn-${property.id}`}
              onClick={() => setIsEnquiryOpen(true)}
              className="text-[10px] font-bold tracking-wider uppercase px-3 py-1.5 border border-white/10 rounded-md hover:bg-white/10 text-slate-300 transition-colors cursor-pointer"
            >
              Contact
            </button>
            <Link
              to={`/property/${property.id}`}
              id={`card-view-btn-${property.id}`}
              className="px-3.5 py-1.5 text-xs font-bold text-black bg-amber-500 hover:bg-amber-400 rounded-lg shadow-sm transition-colors"
            >
              Details
            </Link>
          </div>
        </div>
      </div>

      {/* Enquiry and Visit Modals */}
      <EnquiryModal
        isOpen={isEnquiryOpen}
        onClose={() => setIsEnquiryOpen(false)}
        property={property}
      />
      <VisitRequestModal
        isOpen={isVisitOpen}
        onClose={() => setIsVisitOpen(false)}
        property={property}
      />
    </>
  );
};
