import React from 'react';

export const PropertyCardSkeleton: React.FC<{ id?: string }> = ({ id = 'skeleton-card' }) => {
  return (
    <div id={id} className="bg-[#161618] rounded-2xl border border-white/10 overflow-hidden shadow-xl animate-pulse">
      <div className="h-52 bg-[#222226]" />
      <div className="p-5 space-y-3">
        <div className="flex justify-between items-center">
          <div className="h-4 bg-[#222226] rounded-sm w-1/3" />
          <div className="h-4 bg-[#222226] rounded-sm w-1/5" />
        </div>
        <div className="h-6 bg-[#222226] rounded-md w-3/4" />
        <div className="h-4 bg-[#222226] rounded-sm w-1/2" />
        <div className="pt-2 flex gap-2">
          <div className="h-6 bg-[#222226] rounded-full w-16" />
          <div className="h-6 bg-[#222226] rounded-full w-16" />
          <div className="h-6 bg-[#222226] rounded-full w-16" />
        </div>
        <div className="pt-3 border-t border-white/10 flex justify-between items-center">
          <div className="h-7 bg-[#222226] rounded-md w-28" />
          <div className="h-9 bg-[#222226] rounded-xl w-24" />
        </div>
      </div>
    </div>
  );
};

export const DashboardStatsSkeleton: React.FC = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 animate-pulse">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="bg-[#161618] p-5 rounded-2xl border border-white/10 space-y-2">
          <div className="h-4 bg-[#222226] rounded-sm w-1/2" />
          <div className="h-8 bg-[#222226] rounded-md w-1/3" />
        </div>
      ))}
    </div>
  );
};
