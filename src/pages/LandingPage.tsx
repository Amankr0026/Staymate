import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Search,
  MapPin,
  GraduationCap,
  IndianRupee,
  ShieldCheck,
  Zap,
  Users,
  Building2,
  ArrowRight,
  Star,
  CheckCircle2,
  Heart,
  ChevronRight,
  Sparkles,
  Award,
  Clock,
  Compass,
} from 'lucide-react';
import { useProperty } from '../context/PropertyContext';
import { PropertyCard } from '../components/property/PropertyCard';
import { formatRent } from '../utils/formatters';

export const LandingPage: React.FC = () => {
  const { properties, colleges } = useProperty();
  const navigate = useNavigate();

  const [searchCollege, setSearchCollege] = useState('');
  const [selectedGender, setSelectedGender] = useState('all');
  const [budget, setBudget] = useState(15000);

  const handleHeroSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchCollege) params.set('college', searchCollege);
    if (selectedGender !== 'all') params.set('gender', selectedGender);
    if (budget) params.set('budget', budget.toString());
    navigate(`/explore?${params.toString()}`);
  };

  const featuredProperties = properties.slice(0, 6);

  const topCampuses = colleges.slice(0, 6);

  const testimonials = [
    {
      name: 'Riya Sen',
      college: 'Delhi University (Hindu College)',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      text: 'Found a super clean girls PG in Hudson Lane just 600 meters from my college. The food and Wi-Fi are exactly as reviewed!',
      rating: 5,
    },
    {
      name: 'Aditya Mehta',
      college: 'IIT Delhi',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
      text: 'StayMate saved me thousands on brokerage. Scheduled a free visit directly with the owner and moved in the next week.',
      rating: 5,
    },
    {
      name: 'Ananya Sharma',
      college: 'Christ University, Bangalore',
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&q=80',
      text: 'The college distance filter and walking time badges are a game changer. Super easy for first-year students moving to a new city.',
      rating: 5,
    },
  ];

  return (
    <div className="space-y-20 pb-20 bg-[#0A0A0B] text-slate-100 min-h-screen">
      {/* HERO SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#141417] via-[#0D0D0F] to-[#0A0A0B] text-white pt-12 pb-24 sm:pt-20 sm:pb-32 px-4 sm:px-6 lg:px-8 border-b border-white/5">
        {/* Ambient Glows */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-amber-500/10 blur-3xl pointer-events-none rounded-full" />
        <div className="absolute -top-24 right-0 w-80 h-80 bg-amber-600/10 blur-3xl pointer-events-none" />

        <div className="relative max-w-5xl mx-auto text-center space-y-6">
          {/* Trust Pill */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold backdrop-blur-md shadow-xs animate-in fade-in">
            <ShieldCheck className="w-4 h-4 text-amber-400" />
            <span>Over 5,000+ Students Housed Near India's Top Campuses</span>
          </div>

          {/* Main Hero Headline */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-[1.1] text-white">
            Your Stay, <span className="bg-gradient-to-r from-amber-400 via-amber-200 to-amber-500 bg-clip-text text-transparent">Your Way.</span>
          </h1>

          <p className="text-base sm:text-xl text-slate-300 max-w-2xl mx-auto font-normal leading-relaxed">
            Discover verified PGs, hostels, and student rooms within walking distance of your college. Zero brokerage, homestyle food, and 100% verified owners.
          </p>

          {/* Search Box Card */}
          <div className="pt-6">
            <form
              onSubmit={handleHeroSearch}
              id="hero-search-form"
              className="bg-[#161618]/95 backdrop-blur-xl p-3 sm:p-4 rounded-3xl shadow-2xl border border-white/10 text-white max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-left"
            >
              {/* College Picker */}
              <div className="p-2 sm:p-3 bg-[#101012] rounded-2xl border border-white/10">
                <label className="block text-[11px] font-extrabold uppercase tracking-wider text-slate-400 mb-1 flex items-center gap-1">
                  <GraduationCap className="w-3.5 h-3.5 text-amber-400" />
                  <span>College / Campus</span>
                </label>
                <select
                  value={searchCollege}
                  onChange={(e) => setSearchCollege(e.target.value)}
                  className="w-full bg-transparent text-xs font-bold text-slate-200 outline-hidden cursor-pointer"
                >
                  <option value="" className="bg-[#161618] text-white">Select College / City</option>
                  {colleges.map((c) => (
                    <option key={c.id} value={c.id} className="bg-[#161618] text-white">
                      {c.name} ({c.city})
                    </option>
                  ))}
                </select>
              </div>

              {/* Gender Preference */}
              <div className="p-2 sm:p-3 bg-[#101012] rounded-2xl border border-white/10">
                <label className="block text-[11px] font-extrabold uppercase tracking-wider text-slate-400 mb-1 flex items-center gap-1">
                  <Users className="w-3.5 h-3.5 text-amber-400" />
                  <span>Resident Type</span>
                </label>
                <select
                  value={selectedGender}
                  onChange={(e) => setSelectedGender(e.target.value)}
                  className="w-full bg-transparent text-xs font-bold text-slate-200 outline-hidden cursor-pointer"
                >
                  <option value="all" className="bg-[#161618] text-white">All (Boys / Girls / Co-living)</option>
                  <option value="boys" className="bg-[#161618] text-white">Boys PG Only</option>
                  <option value="girls" className="bg-[#161618] text-white">Girls PG Only</option>
                  <option value="unisex" className="bg-[#161618] text-white">Co-Living / Unisex</option>
                </select>
              </div>

              {/* Budget */}
              <div className="p-2 sm:p-3 bg-[#101012] rounded-2xl border border-white/10">
                <label className="block text-[11px] font-extrabold uppercase tracking-wider text-slate-400 mb-1 flex items-center gap-1">
                  <IndianRupee className="w-3.5 h-3.5 text-amber-400" />
                  <span>Max Budget: ₹{budget.toLocaleString('en-IN')}/mo</span>
                </label>
                <input
                  type="range"
                  min={5000}
                  max={25000}
                  step={1000}
                  value={budget}
                  onChange={(e) => setBudget(Number(e.target.value))}
                  className="w-full h-1.5 bg-[#2A2A30] rounded-lg appearance-none cursor-pointer accent-amber-500 mt-2"
                />
              </div>

              {/* Submit CTA */}
              <div className="flex items-center">
                <button
                  type="submit"
                  id="hero-search-btn"
                  className="w-full h-full min-h-[50px] bg-amber-500 hover:bg-amber-400 text-black font-extrabold text-sm rounded-2xl shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2 transition-all hover:scale-[1.02] cursor-pointer"
                >
                  <Search className="w-4 h-4 text-black stroke-[2.5]" />
                  <span>Find My Stay</span>
                </button>
              </div>
            </form>
          </div>

          {/* Quick Stats Badges */}
          <div className="pt-8 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-3xl mx-auto text-slate-300 text-xs">
            <div className="p-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xs">
              <span className="block text-xl font-black text-amber-400">500+</span>
              <span className="text-slate-400">Verified PGs & Hostels</span>
            </div>
            <div className="p-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xs">
              <span className="block text-xl font-black text-amber-400">&lt; 10 min</span>
              <span className="text-slate-400">Average Walk to Campus</span>
            </div>
            <div className="p-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xs">
              <span className="block text-xl font-black text-amber-400">₹0</span>
              <span className="text-slate-400">Zero Brokerage Guarantee</span>
            </div>
            <div className="p-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xs">
              <span className="block text-xl font-black text-amber-400">4.8 / 5</span>
              <span className="text-slate-400">Verified Student Rating</span>
            </div>
          </div>
        </div>
      </section>

      {/* POPULAR COLLEGE HUBS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-8 gap-4">
          <div>
            <div className="flex items-center gap-2 text-amber-400 font-bold text-xs uppercase tracking-wider mb-1">
              <GraduationCap className="w-4 h-4 text-amber-500" />
              <span>Campus Directory</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Find PGs Near Top Universities
            </h2>
          </div>
          <Link
            to="/colleges"
            className="inline-flex items-center gap-1 text-sm font-bold text-amber-400 hover:text-amber-300 hover:underline"
          >
            <span>View All 100+ Colleges</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {topCampuses.map((col) => (
            <Link
              key={col.id}
              to={`/colleges/${col.id}`}
              className="group bg-[#161618] rounded-2xl border border-white/10 overflow-hidden shadow-xl hover:border-amber-500/50 transition-all duration-300 flex flex-col justify-between"
            >
              <div className="relative h-44 overflow-hidden bg-[#101012]">
                <img
                  src={col.image}
                  alt={col.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#161618] via-black/30 to-transparent" />
                <div className="absolute bottom-3 left-3 right-3 text-white">
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-amber-500 text-black px-2 py-0.5 rounded-md">
                    {col.city}
                  </span>
                  <h3 className="text-base font-bold leading-tight mt-1 line-clamp-1 text-white">
                    {col.name}
                  </h3>
                </div>
              </div>

              <div className="p-4 flex items-center justify-between text-xs text-slate-300 bg-[#161618]">
                <div>
                  <span className="font-bold text-white">{col.pgCount}+ PGs Listed</span>
                  <span className="block text-[11px] text-slate-400">Avg {col.averageRentRange}</span>
                </div>
                <span className="inline-flex items-center gap-1 font-bold text-amber-400 group-hover:translate-x-1 transition-transform">
                  Explore Stays <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* FEATURED VERIFIED STAYS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-8 gap-4">
          <div>
            <div className="flex items-center gap-2 text-amber-400 font-bold text-xs uppercase tracking-wider mb-1">
              <ShieldCheck className="w-4 h-4 text-amber-400" />
              <span>Handpicked & Verified</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Trending Stays Near Campus
            </h2>
            <p className="text-sm text-slate-400 mt-1">High-speed Wi-Fi, 3 daily meals, and safe neighborhoods.</p>
          </div>
          <Link
            to="/explore"
            className="inline-flex items-center gap-1 text-sm font-bold text-amber-400 hover:text-amber-300 hover:underline"
          >
            <span>Browse All Listings</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredProperties.map((property) => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>
      </section>

      {/* VALUE PROPOSITION: WHY STAYMATE */}
      <section className="bg-[#121214] py-16 px-4 sm:px-6 lg:px-8 border-y border-white/10">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Designed For Students, Trusted By Parents
            </h2>
            <p className="text-sm text-slate-400">
              Moving to college shouldn't mean dealing with shady brokers or surprise charges.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-[#161618] p-6 rounded-3xl border border-white/10 shadow-xl space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-400 flex items-center justify-center border border-amber-500/20">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white">100% Physically Verified</h3>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                Every listed property is inspected for security cameras, functional Wi-Fi, hygienic food kitchens, and accurate room photos.
              </p>
            </div>

            <div className="bg-[#161618] p-6 rounded-3xl border border-white/10 shadow-xl space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center border border-emerald-500/20">
                <Zap className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white">Zero Brokerage Fees</h3>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                Connect directly with property managers. No middlemen, no 15-day broker commission, and completely transparent monthly rental receipts.
              </p>
            </div>

            <div className="bg-[#161618] p-6 rounded-3xl border border-white/10 shadow-xl space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-400 flex items-center justify-center border border-amber-500/20">
                <Clock className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white">Free In-Person Visit</h3>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                Schedule visit slots online. Walk around the accommodation, meet fellow students, taste the food, and decide with 100% confidence.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* STUDENT TESTIMONIALS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
          <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">Peer Reviews</span>
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Hear From Fellow Campus Residents
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t, idx) => (
            <div key={idx} className="bg-[#161618] p-6 rounded-3xl border border-white/10 shadow-xl space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center gap-1 text-amber-400">
                  {[...Array(t.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400" />
                  ))}
                </div>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed italic">
                  "{t.text}"
                </p>
              </div>

              <div className="flex items-center gap-3 pt-4 border-t border-white/10">
                <img src={t.avatar} alt={t.name} className="w-10 h-10 rounded-full object-cover" />
                <div>
                  <h4 className="text-xs font-bold text-white">{t.name}</h4>
                  <p className="text-[11px] text-slate-400">{t.college}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* OWNER CTA BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-[#1A1A1D] via-[#161618] to-[#121214] rounded-3xl p-8 sm:p-12 text-white flex flex-col lg:flex-row items-center justify-between gap-8 shadow-2xl border border-white/10 relative overflow-hidden">
          <div className="space-y-3 max-w-xl text-center lg:text-left z-10">
            <span className="bg-amber-500/10 text-amber-400 text-xs font-bold px-3 py-1 rounded-full border border-amber-500/20">
              For PG & Hostel Owners
            </span>
            <h2 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight text-white">
              List Your Property & Fill Vacancies Faster
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed">
              Reach thousands of college students seeking reliable accommodation every semester. Direct tenant leads with zero platform listing charges.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 z-10 w-full sm:w-auto">
            <Link
              to="/signup?role=owner"
              id="owner-banner-cta-btn"
              className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-amber-500 text-black font-extrabold text-sm hover:bg-amber-400 shadow-xl shadow-amber-500/20 transition-all text-center cursor-pointer"
            >
              List Your PG Free
            </Link>
            <Link
              to="/how-it-works"
              className="w-full sm:w-auto px-5 py-3.5 rounded-2xl bg-white/5 hover:bg-white/10 text-white font-bold text-sm border border-white/10 transition-colors text-center"
            >
              Learn More
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
