import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, X, Maximize2, Image as ImageIcon } from 'lucide-react';

interface ImageGalleryProps {
  images: string[];
  propertyName: string;
}

export const ImageGallery: React.FC<ImageGalleryProps> = ({ images, propertyName }) => {
  const [activeIdx, setActiveIdx] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  const validImages = images.length > 0 ? images : [
    'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=1200&q=80'
  ];

  const handlePrev = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setActiveIdx((prev) => (prev === 0 ? validImages.length - 1 : prev - 1));
  };

  const handleNext = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setActiveIdx((prev) => (prev === validImages.length - 1 ? 0 : prev + 1));
  };

  return (
    <div id="property-gallery" className="space-y-3">
      {/* Grid Layout on Desktop */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3 h-[320px] sm:h-[420px] rounded-2xl overflow-hidden">
        {/* Main Big Photo */}
        <div
          className="relative md:col-span-2 md:row-span-2 h-full bg-[#222226] cursor-pointer group overflow-hidden"
          onClick={() => {
            setActiveIdx(0);
            setIsLightboxOpen(true);
          }}
        >
          <img
            src={validImages[0]}
            alt={`${propertyName} - Main Photo`}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors" />
          <button
            className="absolute bottom-3 left-3 bg-black/80 backdrop-blur-md text-amber-400 text-xs font-semibold px-3 py-1.5 rounded-xl flex items-center gap-1.5 border border-amber-500/30 opacity-90 group-hover:opacity-100 transition-opacity cursor-pointer"
          >
            <Maximize2 className="w-3.5 h-3.5" />
            <span>View All Photos ({validImages.length})</span>
          </button>
        </div>

        {/* Thumbnail 1 */}
        {validImages[1] && (
          <div
            className="hidden md:block relative h-full bg-[#222226] cursor-pointer group overflow-hidden"
            onClick={() => {
              setActiveIdx(1);
              setIsLightboxOpen(true);
            }}
          >
            <img
              src={validImages[1]}
              alt={`${propertyName} - Room view`}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          </div>
        )}

        {/* Thumbnail 2 */}
        {validImages[2] && (
          <div
            className="hidden md:block relative h-full bg-[#222226] cursor-pointer group overflow-hidden"
            onClick={() => {
              setActiveIdx(2);
              setIsLightboxOpen(true);
            }}
          >
            <img
              src={validImages[2]}
              alt={`${propertyName} - Interior view`}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          </div>
        )}

        {/* Thumbnail 3 or Remaining Counter */}
        {validImages[3] ? (
          <div
            className="hidden md:block relative md:col-span-2 h-full bg-[#222226] cursor-pointer group overflow-hidden"
            onClick={() => {
              setActiveIdx(3);
              setIsLightboxOpen(true);
            }}
          >
            <img
              src={validImages[3]}
              alt={`${propertyName} - Facilities`}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            {validImages.length > 4 && (
              <div className="absolute inset-0 bg-black/70 backdrop-blur-xs flex items-center justify-center text-white font-bold text-base">
                +{validImages.length - 4} More Photos
              </div>
            )}
          </div>
        ) : (
          <div className="hidden md:flex md:col-span-2 h-full bg-[#161618] rounded-xl items-center justify-center text-slate-500 text-xs border border-white/10">
            <ImageIcon className="w-5 h-5 mr-1.5 text-amber-500" />
            <span>Verified Campus Stay</span>
          </div>
        )}
      </div>

      {/* Lightbox Modal */}
      {isLightboxOpen && (
        <div
          id="gallery-lightbox"
          className="fixed inset-0 z-50 bg-black/95 flex flex-col justify-between p-4 sm:p-8 animate-in fade-in duration-200"
          onClick={() => setIsLightboxOpen(false)}
        >
          {/* Header */}
          <div className="flex items-center justify-between text-white" onClick={(e) => e.stopPropagation()}>
            <div>
              <h3 className="font-bold text-lg text-white">{propertyName}</h3>
              <p className="text-xs text-slate-400">Photo {activeIdx + 1} of {validImages.length}</p>
            </div>
            <button
              onClick={() => setIsLightboxOpen(false)}
              className="p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors cursor-pointer"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Main Display Image */}
          <div
            className="relative flex-1 flex items-center justify-center my-4 overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={validImages[activeIdx]}
              alt={`Photo ${activeIdx + 1}`}
              className="max-h-[75vh] max-w-full object-contain rounded-xl shadow-2xl border border-white/10"
            />

            {/* Navigation Arrows */}
            <button
              onClick={handlePrev}
              className="absolute left-2 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/60 hover:bg-black/90 text-white backdrop-blur-md transition-colors cursor-pointer border border-white/10"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              onClick={handleNext}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/60 hover:bg-black/90 text-white backdrop-blur-md transition-colors cursor-pointer border border-white/10"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>

          {/* Bottom Thumbnails */}
          <div
            className="flex items-center justify-center gap-2 overflow-x-auto py-2"
            onClick={(e) => e.stopPropagation()}
          >
            {validImages.map((img, i) => (
              <button
                key={i}
                onClick={() => setActiveIdx(i)}
                className={`w-16 h-12 rounded-lg overflow-hidden shrink-0 border-2 transition-all cursor-pointer ${
                  activeIdx === i ? 'border-amber-500 scale-105' : 'border-transparent opacity-50 hover:opacity-100'
                }`}
              >
                <img src={img} alt={`Thumbnail ${i + 1}`} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
