import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  GraduationCap,
  Search,
  MapPin,
  Building2,
  ArrowRight,
  Sparkles,
  TrendingUp,
} from 'lucide-react';
import { useProperty } from '../context/PropertyContext';

export const CollegesPage: React.FC = () => {
  const { colleges } = useProperty();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCity, setSelectedCity] = useState('All');

  const cities = ['All', 'Delhi', 'Noida', 'Bangalore', 'Pune', 'Mumbai', 'Kota'];

  const filteredColleges = colleges.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.shortName.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCity =
      selectedCity === 'All' || c.city.toLowerCase() === selectedCity.toLowerCase();

    return matchesSearch && matchesCity;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header Banner */}
      <div className="bg-[#161618] border border-white/10 rounded-3xl p-8 sm:p-12 text-white space-y-4 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-xs font-bold text-amber-400">
          <GraduationCap className="w-4 h-4" />
          <span>India Campus Housing Directory</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white">
          Find Verified PGs Near Your College
        </h1>
        <p className="text-sm sm:text-base text-slate-400 max-w-2xl leading-relaxed">
          Select your university to browse verified student hostels, private rooms, and co-living spaces located within 15 minutes of your department.
        </p>

        {/* Search Bar inside Header */}
        <div className="pt-2 max-w-xl">
          <div className="relative">
            <Search className="w-5 h-5 text-slate-500 absolute left-3.5 top-3.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by college (e.g. DU, IIT, Amity, Christ, SPPU)..."
              className="w-full pl-11 pr-4 py-3 bg-[#121214] text-white placeholder-slate-500 rounded-2xl text-sm font-medium border border-white/10 shadow-lg outline-hidden focus:ring-2 focus:ring-amber-500"
            />
          </div>
        </div>
      </div>

      {/* City Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 text-xs font-bold">
        {cities.map((city) => (
          <button
            key={city}
            onClick={() => setSelectedCity(city)}
            className={`px-4 py-2 rounded-xl whitespace-nowrap transition-colors cursor-pointer border ${
              selectedCity === city
                ? 'bg-amber-500 text-black border-amber-500 shadow-md font-bold'
                : 'bg-[#161618] text-slate-300 border-white/10 hover:bg-white/5 hover:text-white'
            }`}
          >
            {city === 'All' ? 'All Indian Cities' : city}
          </button>
        ))}
      </div>

      {/* Colleges Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredColleges.map((college) => (
          <Link
            key={college.id}
            to={`/colleges/${college.id}`}
            className="group bg-[#161618] rounded-3xl border border-white/10 overflow-hidden shadow-lg hover:shadow-2xl hover:border-amber-500/40 transition-all duration-300 flex flex-col justify-between"
          >
            <div>
              <div className="relative h-48 overflow-hidden bg-[#222226]">
                <img
                  src={college.image}
                  alt={college.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#161618] via-black/30 to-transparent" />
                <div className="absolute top-3 right-3 bg-black/80 backdrop-blur-md text-amber-400 border border-amber-500/30 text-xs font-black px-2.5 py-1 rounded-xl shadow-xs">
                  {college.pgCount}+ Stays
                </div>
                <div className="absolute bottom-3 left-3 right-3 text-white">
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-amber-500 text-black px-2 py-0.5 rounded-md">
                    {college.city}
                  </span>
                  <h3 className="text-lg font-bold leading-tight mt-1 text-white">
                    {college.name}
                  </h3>
                </div>
              </div>

              <div className="p-5 space-y-3">
                <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium">
                  <MapPin className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                  <span>{college.city}, India</span>
                </div>

                <div className="flex items-center justify-between text-xs pt-1 border-t border-white/10">
                  <span className="text-slate-400 font-medium">Average Student Rent:</span>
                  <span className="font-extrabold text-amber-400">{college.averageRentRange}</span>
                </div>

                <div className="text-[11px] text-slate-400">
                  <span className="font-semibold text-slate-200">Top Hubs:</span>{' '}
                  {college.topAreas.slice(0, 3).join(', ')}
                </div>
              </div>
            </div>

            <div className="px-5 py-3.5 bg-[#121214] border-t border-white/10 flex items-center justify-between text-xs font-bold text-amber-400 group-hover:bg-amber-500/10 transition-colors">
              <span>View Accommodations</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};
