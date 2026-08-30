import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Search,
  MapPin,
  Calendar,
  CheckCircle2,
  Building2,
  ShieldCheck,
  Zap,
  Users,
  ChevronDown,
  ChevronUp,
  HelpCircle,
  Sparkles,
} from 'lucide-react';

export const HowItWorksPage: React.FC = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const studentSteps = [
    {
      step: '01',
      title: 'Find Your College Campus',
      desc: 'Select your university or search your campus locality. StayMate automatically filters PGs located within 1-2 km.',
      icon: Search,
    },
    {
      step: '02',
      title: 'Filter by Meals, AC & Budget',
      desc: 'Choose between boys, girls, or co-living stays. Toggle food inclusion, study desk availability, and AC preferences.',
      icon: MapPin,
    },
    {
      step: '03',
      title: 'Schedule a Free In-Person Visit',
      desc: 'Pick your preferred date and time slot. Meet the PG manager, check the Wi-Fi speed, and taste the food.',
      icon: Calendar,
    },
    {
      step: '04',
      title: 'Move In With Zero Brokerage',
      desc: 'Direct owner contact with no broker fee. Sign a simple rental agreement and start your college semester stress-free.',
      icon: CheckCircle2,
    },
  ];

  const ownerSteps = [
    {
      step: '01',
      title: 'Create Your Free Owner Profile',
      desc: 'Register in 2 minutes with your property name, location, and contact number.',
      icon: Building2,
    },
    {
      step: '02',
      title: 'List Rooms & Amenities',
      desc: 'Upload clear photos, set rent for single/double/triple sharing, and specify mess food menu & rules.',
      icon: Sparkles,
    },
    {
      step: '03',
      title: 'Receive Direct Student Enquiries',
      desc: 'Get student leads on your dashboard and WhatsApp without paying any commission.',
      icon: Users,
    },
  ];

  const faqs = [
    {
      q: 'Is StayMate completely free for college students?',
      a: 'Yes! StayMate is 100% free for students. There are zero brokerage charges, zero visit booking fees, and no hidden commission.',
    },
    {
      q: 'How does StayMate verify PGs and hostels?',
      a: 'Our campus team physically inspects listings to ensure accurate room photos, operational Wi-Fi, working power backup, and food hygiene standards before granting the "Verified" badge.',
    },
    {
      q: 'Can I request a visit before making any payment?',
      a: 'Absolutely. We encourage every student and parent to schedule a free visit using the "Schedule Free Visit" button on the property page to inspect rooms in person.',
    },
    {
      q: 'What is included in the monthly PG rent?',
      a: 'Most listed PGs include daily breakfast, lunch, dinner, high-speed Wi-Fi, housekeeping, water supply, and electricity (unless individual sub-metered as specified).',
    },
    {
      q: 'How can PG owners list their property?',
      a: 'Click "List Your Property" or "For PG Owners" in the top navigation, select Owner account during registration, and use our 7-step listing wizard.',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-20 text-white">
      {/* Hero Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 text-xs font-bold border border-amber-500/20">
          <HelpCircle className="w-4 h-4" />
          <span>Simple, Transparent Student Housing</span>
        </span>
        <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
          How StayMate Works
        </h1>
        <p className="text-base text-slate-400 leading-relaxed">
          We connect college students directly with verified accommodation owners near their campus, eliminating brokers and fraudulent listings.
        </p>
      </div>

      {/* For Students Section */}
      <div className="space-y-10">
        <div className="text-center max-w-xl mx-auto">
          <h2 className="text-2xl font-black text-white">For Students & Tenants</h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">Four simple steps to finding your ideal campus room.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {studentSteps.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="bg-[#161618] p-6 rounded-3xl border border-white/10 shadow-lg relative flex flex-col justify-between space-y-4 hover:border-amber-500/40 transition-colors"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center font-black">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-2xl font-black text-white/10">{item.step}</span>
                  </div>
                  <h3 className="font-bold text-base text-white">{item.title}</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* For PG Owners Section */}
      <div className="bg-[#161618] p-8 sm:p-12 rounded-3xl space-y-8 border border-white/10 shadow-2xl">
        <div className="text-center max-w-xl mx-auto">
          <h2 className="text-2xl font-black text-white">For PG & Hostel Owners</h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">List your accommodation and connect with students directly.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {ownerSteps.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div key={idx} className="bg-[#121214] p-6 rounded-2xl border border-white/10 space-y-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500 text-black flex items-center justify-center font-bold">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-sm text-white">{item.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">{item.desc}</p>
              </div>
            );
          })}
        </div>

        <div className="text-center pt-4">
          <Link
            to="/signup?role=owner"
            className="inline-flex items-center justify-center px-6 py-3.5 rounded-xl font-bold text-sm text-black bg-amber-500 hover:bg-amber-400 shadow-lg shadow-amber-500/20 transition-all cursor-pointer"
          >
            List Your PG on StayMate Free
          </Link>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-black text-white">Frequently Asked Questions</h2>
          <p className="text-xs sm:text-sm text-slate-400">Everything you need to know about bookings, visits, and safety.</p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div
                key={idx}
                className="bg-[#161618] rounded-2xl border border-white/10 overflow-hidden shadow-md"
              >
                <button
                  onClick={() => setOpenFaq(isOpen ? null : idx)}
                  className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 font-bold text-sm text-white hover:bg-white/5 transition-colors cursor-pointer"
                >
                  <span>{faq.q}</span>
                  {isOpen ? <ChevronUp className="w-4 h-4 text-amber-400 shrink-0" /> : <ChevronDown className="w-4 h-4 text-slate-500 shrink-0" />}
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 text-xs sm:text-sm text-slate-400 leading-relaxed border-t border-white/10 pt-3 animate-in fade-in">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
