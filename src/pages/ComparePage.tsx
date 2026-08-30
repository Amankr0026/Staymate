import React from 'react';
import { Link } from 'react-router-dom';
import {
  Layers,
  Trash2,
  Check,
  X,
  Star,
  ShieldCheck,
  Plus,
  ArrowRight,
  ExternalLink,
} from 'lucide-react';
import { useProperty } from '../context/PropertyContext';
import { formatRent, formatCurrency } from '../utils/formatters';
import { GenderBadge } from '../components/common/Badge';
import { EmptyState } from '../components/common/EmptyState';
import { ALL_AMENITIES, renderAmenityIcon } from '../utils/amenities';

export const ComparePage: React.FC = () => {
  const { comparedPropertyIds, getComparedProperties, removeFromCompare, clearCompare } = useProperty();
  const comparedProperties = getComparedProperties();

  if (comparedProperties.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16">
        <EmptyState
          icon={Layers}
          title="No Properties in Comparison"
          description="Click the compare icon on any PG card to compare rent, amenities, food service, and distance side-by-side."
          actionText="Browse Stays"
          actionHref="/explore"
        />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 text-white">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Compare Selected Accommodations
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Evaluating {comparedProperties.length} stays side-by-side
          </p>
        </div>

        <div className="flex items-center gap-3">
          {comparedProperties.length < 4 && (
            <Link
              to="/explore"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-bold hover:bg-amber-500/20 transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Add Another PG</span>
            </Link>
          )}
          <button
            onClick={clearCompare}
            className="px-3.5 py-2 rounded-xl border border-rose-500/30 text-rose-400 hover:bg-rose-500/10 text-xs font-bold transition-colors cursor-pointer"
          >
            Clear All
          </button>
        </div>
      </div>

      {/* Comparison Table */}
      <div className="bg-[#161618] rounded-3xl border border-white/10 shadow-2xl overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[700px]">
          <thead>
            <tr className="border-b border-white/10 bg-[#121214]">
              <th className="p-4 sm:p-6 w-48 text-xs font-extrabold uppercase text-slate-400">
                Property
              </th>
              {comparedProperties.map((p) => (
                <th key={p.id} className="p-4 sm:p-6 min-w-[220px] align-top">
                  <div className="relative space-y-2">
                    <button
                      onClick={() => removeFromCompare(p.id)}
                      className="absolute -top-2 -right-2 p-1.5 rounded-full bg-white/10 hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 transition-colors cursor-pointer border border-white/10"
                      title="Remove"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                    <img
                      src={p.coverImage || p.images[0]}
                      alt={p.name}
                      className="w-full h-28 object-cover rounded-xl border border-white/10"
                    />
                    <h3 className="font-bold text-sm text-white line-clamp-1">{p.name}</h3>
                    <p className="text-xs text-slate-400 truncate">{p.area}, {p.city}</p>
                    <Link
                      to={`/property/${p.id}`}
                      className="inline-flex items-center gap-1 text-xs font-bold text-amber-400 hover:text-amber-300 transition-colors"
                    >
                      <span>View Details</span>
                      <ExternalLink className="w-3 h-3" />
                    </Link>
                  </div>
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y divide-white/10 text-xs sm:text-sm">
            {/* Rent */}
            <tr>
              <td className="p-4 sm:p-5 font-bold text-slate-300 bg-[#121214]/50">Starting Rent</td>
              {comparedProperties.map((p) => (
                <td key={p.id} className="p-4 sm:p-5 font-extrabold text-amber-400 text-base">
                  {formatRent(p.startingRent)}
                </td>
              ))}
            </tr>

            {/* Distance */}
            <tr>
              <td className="p-4 sm:p-5 font-bold text-slate-300 bg-[#121214]/50">Distance to Campus</td>
              {comparedProperties.map((p) => (
                <td key={p.id} className="p-4 sm:p-5 text-slate-200">
                  <span className="font-bold text-white">{p.distanceFromCollegeKm} km</span> ({p.walkingTimeMins} mins walk)
                </td>
              ))}
            </tr>

            {/* Gender */}
            <tr>
              <td className="p-4 sm:p-5 font-bold text-slate-300 bg-[#121214]/50">Gender Type</td>
              {comparedProperties.map((p) => (
                <td key={p.id} className="p-4 sm:p-5">
                  <GenderBadge gender={p.genderPreference} />
                </td>
              ))}
            </tr>

            {/* Security Deposit */}
            <tr>
              <td className="p-4 sm:p-5 font-bold text-slate-300 bg-[#121214]/50">Security Deposit</td>
              {comparedProperties.map((p) => (
                <td key={p.id} className="p-4 sm:p-5 text-slate-200 font-semibold">
                  {formatCurrency(p.securityDeposit)}
                </td>
              ))}
            </tr>

            {/* Food Service */}
            <tr>
              <td className="p-4 sm:p-5 font-bold text-slate-300 bg-[#121214]/50">Meals / Food</td>
              {comparedProperties.map((p) => (
                <td key={p.id} className="p-4 sm:p-5 text-slate-200">
                  {p.foodService.available ? (
                    <span className="inline-flex items-center gap-1 text-emerald-400 font-semibold bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded">
                      <Check className="w-3.5 h-3.5" />
                      {p.foodService.type === 'included' ? 'Included (3x/day)' : `Optional (₹${p.foodService.costPerMonth}/mo)`}
                    </span>
                  ) : (
                    <span className="text-slate-500">Self Cooking</span>
                  )}
                </td>
              ))}
            </tr>

            {/* Curfew */}
            <tr>
              <td className="p-4 sm:p-5 font-bold text-slate-300 bg-[#121214]/50">Curfew Time</td>
              {comparedProperties.map((p) => (
                <td key={p.id} className="p-4 sm:p-5 text-slate-200 font-medium">
                  {p.rules.curfewTime}
                </td>
              ))}
            </tr>

            {/* Rating */}
            <tr>
              <td className="p-4 sm:p-5 font-bold text-slate-300 bg-[#121214]/50">Student Rating</td>
              {comparedProperties.map((p) => (
                <td key={p.id} className="p-4 sm:p-5 text-slate-200">
                  <div className="flex items-center gap-1 font-bold text-amber-400">
                    <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                    <span>{p.rating} / 5 ({p.reviewCount})</span>
                  </div>
                </td>
              ))}
            </tr>

            {/* Key Amenities */}
            {['Wi-Fi', 'AC', 'Washing Machine', 'Power Backup', 'CCTV', 'Attached Bathroom'].map((amenity) => (
              <tr key={amenity}>
                <td className="p-4 sm:p-5 font-bold text-slate-300 bg-[#121214]/50 flex items-center gap-2">
                  {renderAmenityIcon(amenity, 'w-3.5 h-3.5 text-amber-400')}
                  <span>{amenity}</span>
                </td>
                {comparedProperties.map((p) => {
                  const hasAmenity = p.amenities.includes(amenity);
                  return (
                    <td key={p.id} className="p-4 sm:p-5">
                      {hasAmenity ? (
                        <Check className="w-5 h-5 text-emerald-400" />
                      ) : (
                        <X className="w-5 h-5 text-slate-600" />
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
