import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  GraduationCap,
  MapPin,
  Compass,
  Building2,
  Users,
  IndianRupee,
  ShieldCheck,
  ChevronRight,
  Filter,
  ArrowRight,
} from 'lucide-react';
import { useProperty } from '../context/PropertyContext';
import { PropertyCard } from '../components/property/PropertyCard';
import { InteractiveMap } from '../components/property/InteractiveMap';
import { EmptyState } from '../components/common/EmptyState';

export const CollegeDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { colleges, properties } = useProperty();

  const college = colleges.find((c) => c.id === id) || colleges[0];
  const collegeProperties = properties.filter((p) => p.nearbyCollegeId === college.id);

  const [genderFilter, setGenderFilter] = useState<'all' | 'boys' | 'girls' | 'unisex'>('all');
  const [maxRent, setMaxRent] = useState(25000);

  const filtered = collegeProperties.filter((p) => {
    const matchesGender = genderFilter === 'all' || p.genderPreference === genderFilter;
    const matchesRent = p.startingRent <= maxRent;
    return matchesGender && matchesRent;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 text-white">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-slate-400 font-medium">
        <Link to="/" className="hover:text-white transition-colors">Home</Link>
        <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
        <Link to="/colleges" className="hover:text-white transition-colors">Colleges</Link>
        <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
        <span className="text-amber-400 font-bold">{college.shortName}</span>
      </div>

      {/* College Hero Banner */}
      <div className="relative rounded-3xl overflow-hidden shadow-2xl bg-[#161618] border border-white/10 text-white min-h-[280px] sm:min-h-[340px] flex items-end p-6 sm:p-10">
        <img
          src={college.image}
          alt={college.name}
          className="absolute inset-0 w-full h-full object-cover opacity-25"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0B] via-[#0A0A0B]/70 to-transparent" />

        <div className="relative z-10 space-y-3 max-w-3xl">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="bg-amber-500 text-black text-xs font-black px-3 py-1 rounded-full">
              {college.city}, India
            </span>
            <span className="bg-white/10 backdrop-blur-md text-slate-200 border border-white/10 text-xs font-semibold px-3 py-1 rounded-full">
              {collegeProperties.length} Verified PGs Available
            </span>
          </div>

          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight text-white">
            PGs & Hostels near {college.name}
          </h1>

          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
            Discover student accommodations within walking distance of {college.shortName}. Average student rent in this zone is <span className="text-amber-400 font-semibold">{college.averageRentRange}</span>.
          </p>
        </div>
      </div>

      {/* Quick College Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-[#161618] p-4 rounded-2xl border border-white/10 shadow-lg">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Average Rent</span>
          <span className="text-base sm:text-lg font-black text-amber-400">{college.averageRentRange}</span>
        </div>
        <div className="bg-[#161618] p-4 rounded-2xl border border-white/10 shadow-lg">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Available Stays</span>
          <span className="text-base sm:text-lg font-black text-white">{collegeProperties.length} Stays</span>
        </div>
        <div className="bg-[#161618] p-4 rounded-2xl border border-white/10 shadow-lg">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Primary Hubs</span>
          <span className="text-xs sm:text-sm font-bold text-slate-300 truncate block">{college.topAreas.slice(0, 2).join(', ')}</span>
        </div>
        <div className="bg-[#161618] p-4 rounded-2xl border border-white/10 shadow-lg">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Campus Verification</span>
          <span className="text-xs sm:text-sm font-bold text-emerald-400 flex items-center gap-1 mt-0.5">
            <ShieldCheck className="w-4 h-4" />
            100% Inspected
          </span>
        </div>
      </div>

      {/* Quick Filters */}
      <div className="bg-[#161618] p-4 rounded-2xl border border-white/10 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2 flex-wrap text-xs">
          <span className="font-bold text-slate-400 mr-1">Resident Type:</span>
          {(['all', 'boys', 'girls', 'unisex'] as const).map((g) => (
            <button
              key={g}
              onClick={() => setGenderFilter(g)}
              className={`px-3 py-1.5 rounded-lg font-semibold capitalize transition-colors cursor-pointer border ${
                genderFilter === g
                  ? 'bg-amber-500 text-black border-amber-500 font-bold'
                  : 'bg-[#121214] text-slate-300 border-white/10 hover:bg-white/5'
              }`}
            >
              {g === 'all' ? 'All Stays' : `${g} PG`}
            </button>
          ))}
        </div>

        <Link
          to={`/explore?college=${college.id}`}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-400 hover:text-amber-300 transition-colors"
        >
          <Compass className="w-4 h-4" />
          <span>Open Full Interactive Map</span>
        </Link>
      </div>

      {/* Stays Grid */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-white">
            Available Stays ({filtered.length})
          </h2>
        </div>

        {filtered.length === 0 ? (
          <EmptyState
            title="No PGs match these filters"
            description="Try changing the gender filter or max budget."
            actionText="Show All Stays near this College"
            onAction={() => {
              setGenderFilter('all');
              setMaxRent(25000);
            }}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
