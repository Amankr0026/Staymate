import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  MapPin,
  SlidersHorizontal,
  Map as MapIcon,
  List,
  Compass,
  Grid,
  Sparkles,
  RotateCcw,
} from 'lucide-react';
import { useProperty } from '../context/PropertyContext';
import { PropertyCard } from '../components/property/PropertyCard';
import { PropertyFilter } from '../components/property/PropertyFilter';
import { InteractiveMap } from '../components/property/InteractiveMap';
import { EmptyState } from '../components/common/EmptyState';
import { PropertyCardSkeleton } from '../components/common/SkeletonLoader';
import type { Property, PropertyFilterState } from '../types';

export const ExplorePage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { filteredProperties, filter, setFilter, resetFilter, colleges, isLoading } = useProperty();

  const [mobileViewMode, setMobileViewMode] = useState<'list' | 'map'>('list');
  const [highlightedPropertyId, setHighlightedPropertyId] = useState<string | null>(null);

  // Initialize filter from URL query params
  useEffect(() => {
    const collegeParam = searchParams.get('college');
    const genderParam = searchParams.get('gender');
    const budgetParam = searchParams.get('budget');
    const queryParam = searchParams.get('q');

    if (collegeParam || genderParam || budgetParam || queryParam) {
      setFilter({
        ...filter,
        collegeId: collegeParam || filter.collegeId,
        gender: (genderParam as any) || filter.gender,
        maxRent: budgetParam ? Number(budgetParam) : filter.maxRent,
        searchQuery: queryParam || filter.searchQuery,
      });
    }
  }, []);

  const handleFilterChange = (newFilter: PropertyFilterState) => {
    setFilter(newFilter);
  };

  const selectedCollege = colleges.find((c) => c.id === filter.collegeId) || null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Top Filter Container */}
      <PropertyFilter
        filter={filter}
        onChange={handleFilterChange}
        onReset={resetFilter}
        totalResults={filteredProperties.length}
      />

      {/* Results Header Bar & Mobile View Mode Switcher */}
      <div className="flex items-center justify-between pb-2">
        <div className="flex items-center gap-2">
          <h2 className="text-base sm:text-lg font-black text-white tracking-tight">
            {selectedCollege ? `${selectedCollege.name} Stays` : 'All Accommodations'}
          </h2>
          <span className="text-xs font-bold text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2.5 py-0.5 rounded-full">
            {filteredProperties.length} Available
          </span>
        </div>

        {/* Mobile View Toggle (List vs Map) */}
        <div className="flex lg:hidden items-center bg-[#161618] p-1 rounded-xl border border-white/10 text-xs font-bold">
          <button
            onClick={() => setMobileViewMode('list')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
              mobileViewMode === 'list' ? 'bg-amber-500 text-black font-bold shadow-xs' : 'text-slate-400 hover:text-white'
            }`}
          >
            <List className="w-3.5 h-3.5" />
            <span>List</span>
          </button>
          <button
            onClick={() => setMobileViewMode('map')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
              mobileViewMode === 'map' ? 'bg-amber-500 text-black font-bold shadow-xs' : 'text-slate-400 hover:text-white'
            }`}
          >
            <MapIcon className="w-3.5 h-3.5" />
            <span>Map</span>
          </button>
        </div>
      </div>

      {/* Main Split Layout: Listings on Left, Map on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Listings Column */}
        <div
          className={`lg:col-span-7 xl:col-span-7 space-y-4 ${
            mobileViewMode === 'map' ? 'hidden lg:block' : 'block'
          }`}
        >
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[1, 2, 3, 4].map((n) => (
                <PropertyCardSkeleton key={n} />
              ))}
            </div>
          ) : filteredProperties.length === 0 ? (
            <EmptyState
              icon={Compass}
              title="No Accommodations Found"
              description="No properties match your current search and budget criteria. Try broadening your distance range or resetting filters."
              actionText="Reset All Filters"
              onAction={resetFilter}
            />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {filteredProperties.map((property) => (
                <PropertyCard
                  key={property.id}
                  property={property}
                  onHover={(id) => setHighlightedPropertyId(id)}
                />
              ))}
            </div>
          )}
        </div>

        {/* Interactive Map Column (Sticky on Desktop) */}
        <div
          className={`lg:col-span-5 xl:col-span-5 lg:sticky lg:top-24 h-[550px] sm:h-[650px] ${
            mobileViewMode === 'list' ? 'hidden lg:block' : 'block'
          }`}
        >
          <InteractiveMap
            properties={filteredProperties}
            selectedCollege={selectedCollege}
            highlightedPropertyId={highlightedPropertyId}
            className="h-full"
          />
        </div>
      </div>
    </div>
  );
};
