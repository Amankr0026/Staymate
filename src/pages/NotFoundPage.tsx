import React from 'react';
import { Link } from 'react-router-dom';
import { Home, Compass, GraduationCap } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-16 text-center text-white">
      <div className="max-w-md space-y-6">
        <div className="w-20 h-20 rounded-3xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center mx-auto text-3xl font-black">
          404
        </div>
        <h1 className="text-3xl font-black text-white">Page Not Found</h1>
        <p className="text-sm text-slate-400 leading-relaxed">
          The page you are looking for does not exist or has been relocated.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Link
            to="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm text-black bg-amber-500 hover:bg-amber-400 shadow-lg shadow-amber-500/20 transition-all cursor-pointer"
          >
            <Home className="w-4 h-4" />
            <span>Return Home</span>
          </Link>
          <Link
            to="/explore"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm text-slate-300 bg-[#161618] border border-white/10 hover:bg-white/5 transition-colors"
          >
            <Compass className="w-4 h-4" />
            <span>Explore PGs</span>
          </Link>
        </div>
      </div>
    </div>
  );
};
