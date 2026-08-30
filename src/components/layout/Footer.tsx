import React from 'react';
import { Link } from 'react-router-dom';
import { Home, ShieldCheck, Mail, Phone, MapPin, Heart, ArrowUpRight } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#0A0A0B] text-slate-400 pt-16 pb-12 border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-white/10">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-lg bg-amber-500 flex items-center justify-center text-black shadow-md shadow-amber-500/20">
                <Home className="w-5 h-5 stroke-[2.5]" />
              </div>
              <span className="text-2xl font-bold tracking-tight text-white">
                Stay<span className="text-amber-500">Mate</span>
              </span>
            </Link>
            <p className="text-sm text-slate-400 max-w-sm leading-relaxed">
              India's student-focused accommodation discovery platform. Find verified PGs, hostels, and rooms within walking distance of your campus.
            </p>
            <div className="flex items-center gap-2 text-xs text-amber-400 bg-amber-500/10 border border-amber-500/20 px-3 py-1.5 rounded-lg w-fit">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>100% Physically Verified PG Guarantee</span>
            </div>
          </div>

          {/* Quick Discoveries */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">Top Campuses</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>
                <Link to="/colleges/du-north" className="hover:text-amber-400 transition-colors flex items-center gap-1">
                  Delhi University (North)
                </Link>
              </li>
              <li>
                <Link to="/colleges/iit-delhi" className="hover:text-amber-400 transition-colors flex items-center gap-1">
                  IIT Delhi (Hauz Khas)
                </Link>
              </li>
              <li>
                <Link to="/colleges/amity-noida" className="hover:text-amber-400 transition-colors flex items-center gap-1">
                  Amity Noida (Sec 125)
                </Link>
              </li>
              <li>
                <Link to="/colleges/christ-bangalore" className="hover:text-amber-400 transition-colors flex items-center gap-1">
                  Christ University (Blr)
                </Link>
              </li>
              <li>
                <Link to="/colleges/pune-uni" className="hover:text-amber-400 transition-colors flex items-center gap-1">
                  Pune University (SPPU)
                </Link>
              </li>
            </ul>
          </div>

          {/* For Tenants & Owners */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">For Students & Owners</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>
                <Link to="/explore" className="hover:text-amber-400 transition-colors">
                  Explore Stays Near Me
                </Link>
              </li>
              <li>
                <Link to="/signup?role=owner" className="hover:text-amber-400 transition-colors flex items-center gap-1">
                  List Your PG / Hostel
                  <ArrowUpRight className="w-3.5 h-3.5 text-amber-500" />
                </Link>
              </li>
              <li>
                <Link to="/login" className="hover:text-amber-400 transition-colors">
                  Owner Portal Login
                </Link>
              </li>
              <li>
                <Link to="/how-it-works" className="hover:text-amber-400 transition-colors">
                  How StayMate Works
                </Link>
              </li>
              <li>
                <Link to="/colleges" className="hover:text-amber-400 transition-colors">
                  All 100+ Colleges Directory
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact & Support */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">Student Helpdesk</h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-amber-500 shrink-0" />
                <span>support@staymate.in</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-amber-500 shrink-0" />
                <span>+91 1800-STAYMATE</span>
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-amber-500 shrink-0" />
                <span>Student Hub, New Delhi, India</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} STAYMATE. YOUR STAY, YOUR WAY.</p>
          <div className="flex items-center gap-6 text-[11px]">
            <span className="hover:text-slate-300 transition-colors cursor-pointer">Popular Colleges</span>
            <span className="hover:text-slate-300 transition-colors cursor-pointer">Nearby Transport</span>
            <span className="hover:text-slate-300 transition-colors cursor-pointer">Safety Guidelines</span>
            <span className="flex items-center gap-1 text-slate-400">
              Made with <Heart className="w-3 h-3 text-amber-500 fill-amber-500" /> for students
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
