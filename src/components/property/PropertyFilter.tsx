import React, { useState } from 'react';
import {
  Search,
  SlidersHorizontal,
  GraduationCap,
  IndianRupee,
  Home,
  Users,
  ShieldCheck,
  Check,
  X,
  RotateCcw,
  Sparkles,
  ChevronDown,
} from 'lucide-react';
import type { GenderPreference, PropertyFilterState, PropertyType, RoomSharingType } from '../../types';
import { useProperty } from '../../context/PropertyContext';
import { ALL_AMENITIES, renderAmenityIcon } from '../../utils/amenities';

interface PropertyFilterProps {
  filter: PropertyFilterState;
  onChange: (newFilter: PropertyFilterState) => void;
  onReset: () => void;
  totalResults: number;
}

export const PropertyFilter: React.FC<PropertyFilterProps> = ({
  filter,
  onChange,
  onReset,
  totalResults,
}) => {
  const { colleges } = useProperty();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const handleTextChange = (key: keyof PropertyFilterState, value: any) => {
    onChange({ ...filter, [key]: value });
  };

  const togglePropertyType = (type: PropertyType) => {
    const exists = filter.propertyTypes.includes(type);
    const updated = exists
      ? filter.propertyTypes.filter((t) => t !== type)
      : [...filter.propertyTypes, type];
    onChange({ ...filter, propertyTypes: updated });
  };

  const toggleRoomType = (type: RoomSharingType) => {
    const exists = filter.roomTypes.includes(type);
    const updated = exists
      ? filter.roomTypes.filter((t) => t !== type)
      : [...filter.roomTypes, type];
    onChange({ ...filter, roomTypes: updated });
  };

  const toggleAmenity = (name: string) => {
    const exists = filter.amenities.includes(name);
    const updated = exists
      ? filter.amenities.filter((a) => a !== name)
      : [...filter.amenities, name];
    onChange({ ...filter, amenities: updated });
  };

  const activeFilterCount =
    (filter.collegeId ? 1 : 0) +
    filter.propertyTypes.length +
    filter.roomTypes.length +
    (filter.gender !== 'all' ? 1 : 0) +
    (filter.minRent > 3000 || filter.maxRent < 30000 ? 1 : 0) +
    (filter.maxDistanceKm < 10 ? 1 : 0) +
    filter.amenities.length +
    (filter.foodIncludedOnly ? 1 : 0) +
    (filter.acOnly ? 1 : 0) +
    (filter.verifiedOnly ? 1 : 0);

  const propertyTypes: PropertyType[] = ['PG', 'Hostel', 'Apartment', 'Private Room', 'Shared Room'];
  const roomTypes: { type: RoomSharingType; label: string }[] = [
    { type: 'single', label: 'Single' },
    { type: 'double', label: '2 Sharing' },
    { type: 'triple', label: '3 Sharing' },
    { type: 'four', label: '4 Sharing' },
  ];

  return (
    <div className="bg-[#161618] rounded-2xl border border-white/10 shadow-2xl p-4 sm:p-5 space-y-4 text-white">
      {/* Top Search Bar & Sort Row */}
      <div className="flex flex-col lg:flex-row gap-3 items-stretch lg:items-center justify-between">
        {/* Main Search Input */}
        <div className="relative flex-1">
          <Search className="w-5 h-5 text-slate-500 absolute left-3.5 top-3.5" />
          <input
            id="filter-search-input"
            type="text"
            value={filter.searchQuery}
            onChange={(e) => handleTextChange('searchQuery', e.target.value)}
            placeholder="Search by college, university, locality, city, or PIN..."
            className="w-full pl-11 pr-4 py-3 text-sm bg-[#101012] border border-white/10 rounded-xl text-white placeholder-slate-500 focus:bg-[#131316] focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-hidden transition-all"
          />
          {filter.searchQuery && (
            <button
              onClick={() => handleTextChange('searchQuery', '')}
              className="absolute right-3 top-3.5 text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* College Quick Dropdown */}
        <div className="relative min-w-[220px]">
          <GraduationCap className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5 pointer-events-none" />
          <select
            id="filter-college-select"
            value={filter.collegeId}
            onChange={(e) => handleTextChange('collegeId', e.target.value)}
            className="w-full pl-10 pr-8 py-3 text-xs sm:text-sm bg-[#101012] border border-white/10 rounded-xl focus:bg-[#131316] focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-hidden appearance-none cursor-pointer font-medium text-slate-200"
          >
            <option value="" className="bg-[#161618] text-white">All Campuses / Cities</option>
            {colleges.map((c) => (
              <option key={c.id} value={c.id} className="bg-[#161618] text-white">
                {c.name} ({c.city})
              </option>
            ))}
          </select>
          <ChevronDown className="w-4 h-4 text-slate-500 absolute right-3 top-3.5 pointer-events-none" />
        </div>

        {/* Sort Select */}
        <div className="flex items-center gap-2">
          <select
            id="filter-sort-select"
            value={filter.sortBy}
            onChange={(e) => handleTextChange('sortBy', e.target.value)}
            className="py-3 px-3.5 text-xs sm:text-sm bg-[#101012] border border-white/10 rounded-xl focus:bg-[#131316] focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-hidden font-semibold text-slate-200 cursor-pointer"
          >
            <option value="nearest" className="bg-[#161618] text-white">Nearest to Campus</option>
            <option value="lowest_rent" className="bg-[#161618] text-white">Lowest Rent First</option>
            <option value="highest_rated" className="bg-[#161618] text-white">Highest Rated (★)</option>
            <option value="most_popular" className="bg-[#161618] text-white">Most Popular</option>
            <option value="recently_added" className="bg-[#161618] text-white">Recently Added</option>
          </select>

          {/* Toggle Full Filters Button on Mobile */}
          <button
            id="mobile-filters-trigger"
            onClick={() => setIsDrawerOpen(!isDrawerOpen)}
            className={`lg:hidden flex items-center gap-2 px-3.5 py-3 rounded-xl border text-xs font-bold transition-colors cursor-pointer ${
              activeFilterCount > 0
                ? 'bg-amber-500/10 border-amber-500/30 text-amber-400'
                : 'bg-white/5 border-white/10 text-slate-300'
            }`}
          >
            <SlidersHorizontal className="w-4 h-4" />
            <span>Filters</span>
            {activeFilterCount > 0 && (
              <span className="w-4 h-4 rounded-full bg-amber-500 text-black font-bold flex items-center justify-center text-[10px]">
                {activeFilterCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Quick Filter Chips (Gender, Food, AC, Verified) */}
      <div className="flex items-center gap-2 flex-wrap pt-1 border-t border-white/10 text-xs">
        <span className="text-slate-500 font-bold uppercase tracking-wider text-[10px] mr-1 hidden sm:inline">
          Quick Filters:
        </span>

        {/* Gender Chips */}
        {(['all', 'boys', 'girls', 'unisex'] as const).map((g) => (
          <button
            key={g}
            onClick={() => handleTextChange('gender', g)}
            className={`px-3 py-1.5 rounded-lg font-semibold capitalize transition-colors cursor-pointer border ${
              filter.gender === g
                ? 'bg-amber-500 text-black font-bold border-amber-500 shadow-sm'
                : 'bg-white/5 text-slate-300 border-white/10 hover:bg-white/10'
            }`}
          >
            {g === 'all' ? 'All Genders' : g === 'boys' ? 'Boys PG' : g === 'girls' ? 'Girls PG' : 'Co-Living'}
          </button>
        ))}

        {/* Food Included chip */}
        <button
          onClick={() => handleTextChange('foodIncludedOnly', !filter.foodIncludedOnly)}
          className={`px-3 py-1.5 rounded-lg font-semibold flex items-center gap-1.5 transition-colors cursor-pointer border ${
            filter.foodIncludedOnly
              ? 'bg-emerald-500 text-black font-bold border-emerald-500'
              : 'bg-white/5 text-slate-300 border-white/10 hover:bg-white/10'
          }`}
        >
          {filter.foodIncludedOnly && <Check className="w-3.5 h-3.5" />}
          <span>Food Included</span>
        </button>

        {/* AC Only chip */}
        <button
          onClick={() => handleTextChange('acOnly', !filter.acOnly)}
          className={`px-3 py-1.5 rounded-lg font-semibold flex items-center gap-1.5 transition-colors cursor-pointer border ${
            filter.acOnly
              ? 'bg-sky-500 text-black font-bold border-sky-500'
              : 'bg-white/5 text-slate-300 border-white/10 hover:bg-white/10'
          }`}
        >
          {filter.acOnly && <Check className="w-3.5 h-3.5" />}
          <span>AC Rooms</span>
        </button>

        {/* Verified Only */}
        <button
          onClick={() => handleTextChange('verifiedOnly', !filter.verifiedOnly)}
          className={`px-3 py-1.5 rounded-lg font-semibold flex items-center gap-1.5 transition-colors cursor-pointer border ${
            filter.verifiedOnly
              ? 'bg-amber-500 text-black font-bold border-amber-500'
              : 'bg-white/5 text-slate-300 border-white/10 hover:bg-white/10'
          }`}
        >
          <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
          <span>Verified Only</span>
        </button>

        {/* Reset button */}
        {activeFilterCount > 0 && (
          <button
            onClick={onReset}
            className="ml-auto text-xs font-bold text-rose-400 hover:text-rose-300 flex items-center gap-1 py-1 px-2 rounded hover:bg-rose-500/10 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset ({activeFilterCount})</span>
          </button>
        )}
      </div>

      {/* Expanded Filter Panel */}
      <div className={`${isDrawerOpen ? 'block' : 'hidden lg:block'} pt-3 border-t border-white/10 space-y-4 animate-in fade-in duration-200`}>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* Monthly Budget Range */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold text-slate-300">Monthly Budget (INR)</label>
              <span className="text-xs font-extrabold text-amber-400">
                ₹{filter.maxRent.toLocaleString('en-IN')}/mo
              </span>
            </div>
            <input
              type="range"
              min={4000}
              max={25000}
              step={500}
              value={filter.maxRent}
              onChange={(e) => handleTextChange('maxRent', Number(e.target.value))}
              className="w-full h-1.5 bg-[#2A2A30] rounded-lg appearance-none cursor-pointer accent-amber-500"
            />
            <div className="flex justify-between text-[10px] font-semibold text-slate-500 mt-1">
              <span>₹4,000</span>
              <span>₹12,000</span>
              <span>₹25,000+</span>
            </div>
          </div>

          {/* Property Types */}
          <div>
            <label className="text-xs font-bold text-slate-300 block mb-1.5">Property Type</label>
            <div className="flex flex-wrap gap-1.5">
              {propertyTypes.map((type) => {
                const selected = filter.propertyTypes.includes(type);
                return (
                  <button
                    key={type}
                    onClick={() => togglePropertyType(type)}
                    className={`px-2.5 py-1 rounded-md text-xs font-medium border transition-colors cursor-pointer ${
                      selected
                        ? 'bg-amber-500 text-black border-amber-500 font-bold'
                        : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10'
                    }`}
                  >
                    {type}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Room Sharing Types */}
          <div>
            <label className="text-xs font-bold text-slate-300 block mb-1.5">Room Occupancy</label>
            <div className="flex flex-wrap gap-1.5">
              {roomTypes.map((r) => {
                const selected = filter.roomTypes.includes(r.type);
                return (
                  <button
                    key={r.type}
                    onClick={() => toggleRoomType(r.type)}
                    className={`px-2.5 py-1 rounded-md text-xs font-medium border transition-colors cursor-pointer ${
                      selected
                        ? 'bg-amber-500 text-black border-amber-500 font-bold'
                        : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10'
                    }`}
                  >
                    {r.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Max Distance from Campus */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold text-slate-300">Max Distance to Campus</label>
              <span className="text-xs font-extrabold text-amber-400">
                {filter.maxDistanceKm >= 5 ? 'Any distance' : `Within ${filter.maxDistanceKm} km`}
              </span>
            </div>
            <input
              type="range"
              min={0.5}
              max={5}
              step={0.5}
              value={filter.maxDistanceKm}
              onChange={(e) => handleTextChange('maxDistanceKm', Number(e.target.value))}
              className="w-full h-1.5 bg-[#2A2A30] rounded-lg appearance-none cursor-pointer accent-amber-500"
            />
            <div className="flex justify-between text-[10px] font-semibold text-slate-500 mt-1">
              <span>0.5 km (Walking)</span>
              <span>2.5 km</span>
              <span>5+ km</span>
            </div>
          </div>
        </div>

        {/* Amenities Selection Bar */}
        <div className="pt-2 border-t border-white/10">
          <label className="text-xs font-bold text-slate-300 block mb-2">Amenities & Facilities</label>
          <div className="flex flex-wrap gap-2">
            {ALL_AMENITIES.map((a) => {
              const selected = filter.amenities.includes(a.name);
              return (
                <button
                  key={a.name}
                  onClick={() => toggleAmenity(a.name)}
                  className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium border transition-colors cursor-pointer ${
                    selected
                      ? 'bg-amber-500 text-black border-amber-500 font-bold shadow-sm'
                      : 'bg-white/5 text-slate-300 border-white/10 hover:bg-white/10'
                  }`}
                >
                  {renderAmenityIcon(a.name, `w-3.5 h-3.5 ${selected ? 'text-black' : 'text-amber-500'}`)}
                  <span>{a.name}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
