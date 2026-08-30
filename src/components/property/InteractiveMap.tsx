import React, { useState, useEffect, useRef } from 'react';
import {
  MapPin,
  GraduationCap,
  Navigation,
  Plus,
  Minus,
  Maximize2,
  ExternalLink,
  Star,
  Bed,
  Check,
  Heart,
  Layers,
  X,
} from 'lucide-react';
import type { College, Property } from '../../types';
import { formatRent } from '../../utils/formatters';
import { Link } from 'react-router-dom';

interface InteractiveMapProps {
  properties: Property[];
  selectedCollege?: College | null;
  highlightedPropertyId?: string | null;
  onSelectProperty?: (property: Property) => void;
  className?: string;
}

export const InteractiveMap: React.FC<InteractiveMapProps> = ({
  properties,
  selectedCollege,
  highlightedPropertyId,
  onSelectProperty,
  className = '',
}) => {
  const [activeProperty, setActiveProperty] = useState<Property | null>(null);
  const [zoomLevel, setZoomLevel] = useState(14);
  const [mapCenter, setMapCenter] = useState({
    lat: selectedCollege ? selectedCollege.latitude : 28.6892,
    lng: selectedCollege ? selectedCollege.longitude : 77.2104,
  });

  useEffect(() => {
    if (selectedCollege) {
      setMapCenter({ lat: selectedCollege.latitude, lng: selectedCollege.longitude });
    } else if (properties.length > 0) {
      // center on first property
      setMapCenter({ lat: properties[0].latitude, lng: properties[0].longitude });
    }
  }, [selectedCollege, properties]);

  useEffect(() => {
    if (highlightedPropertyId) {
      const match = properties.find((p) => p.id === highlightedPropertyId);
      if (match) {
        setActiveProperty(match);
      }
    }
  }, [highlightedPropertyId, properties]);

  // Transform lat/lng coordinates to percentage offsets relative to map center and zoom
  const getCoordinatesOffset = (lat: number, lng: number) => {
    const latDiff = (lat - mapCenter.lat) * (zoomLevel / 14);
    const lngDiff = (lng - mapCenter.lng) * (zoomLevel / 14);

    // Scaling factors for view bounds
    const xPercent = 50 + lngDiff * 1400;
    const yPercent = 50 - latDiff * 1600;

    return {
      x: Math.max(5, Math.min(95, xPercent)),
      y: Math.max(5, Math.min(95, yPercent)),
    };
  };

  const handleZoomIn = () => setZoomLevel((z) => Math.min(18, z + 1));
  const handleZoomOut = () => setZoomLevel((z) => Math.max(10, z - 1));
  const handleRecenter = () => {
    if (selectedCollege) {
      setMapCenter({ lat: selectedCollege.latitude, lng: selectedCollege.longitude });
    } else if (properties.length > 0) {
      setMapCenter({ lat: properties[0].latitude, lng: properties[0].longitude });
    }
  };

  const collegePos = selectedCollege
    ? getCoordinatesOffset(selectedCollege.latitude, selectedCollege.longitude)
    : null;

  return (
    <div
      id="interactive-map-container"
      className={`relative w-full h-full min-h-[420px] bg-[#121214] rounded-2xl overflow-hidden border border-white/10 shadow-2xl flex flex-col justify-between ${className}`}
    >
      {/* Map Background with OpenStreetMap tiles / Campus grid in Dark mode */}
      <div className="absolute inset-0 z-0 bg-[#0E0E10] overflow-hidden pointer-events-none select-none opacity-95">
        {/* Stylized vector dark map layer */}
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid-pattern" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#222226" strokeWidth="0.8" />
            </pattern>
            <pattern id="dots-pattern" width="20" height="20" patternUnits="userSpaceOnUse">
              <circle cx="2" cy="2" r="1" fill="#333338" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid-pattern)" />
          
          {/* Arterial road lines */}
          <path d="M 0 150 Q 200 180 500 140 T 1000 220" fill="none" stroke="#1F1F24" strokeWidth="12" />
          <path d="M 0 150 Q 200 180 500 140 T 1000 220" fill="none" stroke="#f59e0b" strokeWidth="3" opacity="0.6" />

          <path d="M 250 0 Q 300 250 280 600" fill="none" stroke="#1F1F24" strokeWidth="10" />
          <path d="M 250 0 Q 300 250 280 600" fill="none" stroke="#2A2A30" strokeWidth="4" />

          <path d="M 100 450 Q 400 380 900 480" fill="none" stroke="#1F1F24" strokeWidth="14" />
          <path d="M 100 450 Q 400 380 900 480" fill="none" stroke="#f59e0b" strokeWidth="3" opacity="0.5" />

          {/* Green Parks (Darker emerald) */}
          <rect x="60%" y="15%" width="120" height="100" rx="15" fill="#064e3b" opacity="0.3" stroke="#047857" strokeWidth="1" />
          <text x="63%" y="22%" fill="#34d399" fontSize="10" fontWeight="bold">Campus Green Park</text>

          <rect x="15%" y="60%" width="150" height="120" rx="20" fill="#064e3b" opacity="0.3" stroke="#047857" strokeWidth="1" />
          <text x="18%" y="68%" fill="#34d399" fontSize="10" fontWeight="bold">University Sports Complex</text>

          {/* Metro line */}
          <path d="M 50 500 L 450 100" fill="none" stroke="#f43f5e" strokeWidth="2.5" strokeDasharray="6,4" />

          {/* Distance line from College to Active Property */}
          {collegePos && activeProperty && (
            <line
              x1={`${collegePos.x}%`}
              y1={`${collegePos.y}%`}
              x2={`${getCoordinatesOffset(activeProperty.latitude, activeProperty.longitude).x}%`}
              y2={`${getCoordinatesOffset(activeProperty.latitude, activeProperty.longitude).y}%`}
              stroke="#f59e0b"
              strokeWidth="2.5"
              strokeDasharray="4,4"
              className="animate-pulse"
            />
          )}
        </svg>
      </div>

      {/* Floating Header Info */}
      <div className="relative z-10 p-3 flex items-center justify-between gap-2 pointer-events-none">
        <div className="bg-[#161618]/90 backdrop-blur-md px-3.5 py-2 rounded-xl border border-white/10 shadow-lg flex items-center gap-2 pointer-events-auto text-xs text-white">
          <MapPin className="w-4 h-4 text-amber-500" />
          <span className="font-bold">
            {selectedCollege ? `${selectedCollege.shortName} Area` : `${properties.length} Stays Available`}
          </span>
          <span className="text-[10px] text-amber-400 bg-amber-500/10 border border-amber-500/20 px-1.5 py-0.5 rounded font-medium">
            Live Markers
          </span>
        </div>

        {/* Map Control Tools */}
        <div className="flex items-center gap-1.5 pointer-events-auto">
          <button
            id="map-recenter-btn"
            onClick={handleRecenter}
            className="p-2 rounded-xl bg-[#161618]/90 text-slate-300 hover:text-amber-400 hover:bg-white/10 border border-white/10 shadow-md transition-colors cursor-pointer"
            title="Recenter Map on Campus"
          >
            <Navigation className="w-4 h-4" />
          </button>
          <div className="flex flex-col bg-[#161618]/90 border border-white/10 rounded-xl shadow-md overflow-hidden">
            <button
              id="map-zoom-in-btn"
              onClick={handleZoomIn}
              className="p-1.5 text-slate-300 hover:text-white hover:bg-white/10 transition-colors border-b border-white/10 cursor-pointer"
              title="Zoom In"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
            <button
              id="map-zoom-out-btn"
              onClick={handleZoomOut}
              className="p-1.5 text-slate-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              title="Zoom Out"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Interactive Markers Overlay */}
      <div className="relative z-10 flex-1 w-full h-full">
        {/* College Campus Hub Marker */}
        {collegePos && selectedCollege && (
          <div
            id={`college-marker-${selectedCollege.id}`}
            style={{ left: `${collegePos.x}%`, top: `${collegePos.y}%` }}
            className="absolute -translate-x-1/2 -translate-y-1/2 z-20 group cursor-pointer"
          >
            <div className="flex flex-col items-center">
              <div className="px-2.5 py-1 rounded-full bg-amber-500 text-black font-extrabold text-[10px] shadow-lg border border-white flex items-center gap-1 whitespace-nowrap group-hover:scale-110 transition-transform">
                <GraduationCap className="w-3.5 h-3.5 text-black stroke-[2.5]" />
                <span>{selectedCollege.shortName}</span>
              </div>
              <div className="w-3 h-3 bg-amber-500 rotate-45 -mt-1.5 border-r border-b border-white" />
            </div>
          </div>
        )}

        {/* Property Pins */}
        {properties.map((prop) => {
          const pos = getCoordinatesOffset(prop.latitude, prop.longitude);
          const isSelected = activeProperty?.id === prop.id;
          const isHovered = highlightedPropertyId === prop.id;

          return (
            <div
              key={prop.id}
              id={`map-pin-${prop.id}`}
              style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
              onClick={() => {
                setActiveProperty(prop);
                if (onSelectProperty) onSelectProperty(prop);
              }}
              className={`absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all duration-200 z-15 ${
                isSelected || isHovered ? 'z-30 scale-110' : 'hover:scale-105'
              }`}
            >
              <div className="flex flex-col items-center">
                <div
                  className={`px-2.5 py-1 rounded-full text-xs font-black shadow-md border flex items-center gap-1 transition-all whitespace-nowrap ${
                    isSelected
                      ? 'bg-amber-500 text-black border-white ring-4 ring-amber-500/30'
                      : isHovered
                      ? 'bg-white text-black border-amber-400 ring-2 ring-amber-400/50'
                      : 'bg-[#1E1E22] text-slate-100 border-white/20 hover:border-amber-500 hover:text-amber-400'
                  }`}
                >
                  <span>₹{(prop.startingRent / 1000).toFixed(1)}k</span>
                </div>
                <div
                  className={`w-2.5 h-2.5 rotate-45 -mt-1 ${
                    isSelected
                      ? 'bg-amber-500 border-r border-b border-white'
                      : isHovered
                      ? 'bg-white'
                      : 'bg-[#1E1E22] border-r border-b border-white/20'
                  }`}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom Floating Active Property Card Popup */}
      {activeProperty && (
        <div className="relative z-30 p-3">
          <div
            id="map-popup-card"
            className="bg-[#161618] rounded-2xl p-3 shadow-2xl border border-white/10 flex items-center gap-3 animate-in slide-in-from-bottom-3 duration-200 relative text-white"
          >
            <button
              onClick={() => setActiveProperty(null)}
              className="absolute top-2 right-2 p-1 text-slate-400 hover:text-white rounded-lg hover:bg-white/5"
              aria-label="Close Preview"
            >
              <X className="w-4 h-4" />
            </button>

            <img
              src={activeProperty.coverImage || activeProperty.images[0]}
              alt={activeProperty.name}
              className="w-20 h-20 rounded-xl object-cover shrink-0"
            />

            <div className="flex-1 min-w-0 pr-5">
              <div className="flex items-center gap-1.5 text-[11px] text-slate-400 font-medium">
                <MapPin className="w-3 h-3 text-slate-500" />
                <span className="truncate">{activeProperty.area}</span>
                <span>•</span>
                <span className="text-amber-400 font-semibold">{activeProperty.distanceFromCollegeKm} km from campus</span>
              </div>

              <h4 className="text-sm font-bold text-white truncate mt-0.5">
                {activeProperty.name}
              </h4>

              <div className="flex items-center justify-between mt-1.5">
                <div className="text-xs font-bold text-white">
                  {formatRent(activeProperty.startingRent)}
                </div>

                <Link
                  to={`/property/${activeProperty.id}`}
                  className="inline-flex items-center gap-1 text-xs font-bold text-black bg-amber-500 hover:bg-amber-400 px-3 py-1.5 rounded-lg transition-colors"
                >
                  <span>View Stay</span>
                  <ExternalLink className="w-3 h-3" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
