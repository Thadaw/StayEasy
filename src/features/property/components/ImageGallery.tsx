import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Hotel } from "../../../data/hotels";

interface ImageGalleryProps {
  hotel: Hotel;
}

export function ImageGallery({ hotel }: ImageGalleryProps) {
  const [currentImg, setCurrentImg] = useState(0);
  const [showAllPhotos, setShowAllPhotos] = useState(false);
  const [showPrevBtn, setShowPrevBtn] = useState(false);

  function prevImg() {
    setCurrentImg((v) => (v === 0 ? hotel.images.length - 1 : v - 1));
  }
  function nextImg() {
    setCurrentImg((v) => (v === hotel.images.length - 1 ? 0 : v + 1));
    setShowPrevBtn(true);
  }

  if (showAllPhotos) {
    return (
      <div className="mb-8">
        <button onClick={() => setShowAllPhotos(false)} className="flex items-center gap-1.5 text-sm font-medium mb-4 hover:underline">
          <ChevronLeft size={15} /> Back
        </button>
        <div className="columns-2 md:columns-3 gap-3 space-y-3">
          {hotel.images.map((img, i) => (
            <img key={i} src={img} alt={`${hotel.name} photo ${i + 1}`} className="w-full rounded-xl object-cover" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="relative mb-8 rounded-2xl overflow-hidden bg-muted">
      <div className="md:hidden relative aspect-[4/3]">
        <img src={hotel.images[currentImg]} alt={hotel.name} className="w-full h-full object-cover" />
        {showPrevBtn && (
          <button onClick={prevImg} className="absolute left-0 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white shadow-lg flex items-center justify-center hover:bg-gray-50 transition-colors z-10"><ChevronLeft size={20} className="text-gray-700" /></button>
        )}
        <button onClick={nextImg} className="absolute right-3 top-1/2 -translate-y-1/2 bg-white rounded-full p-2 shadow-md hover:shadow-lg"><ChevronRight size={16} /></button>
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1">
          {hotel.images.map((_, i) => (
            <div key={i} className="w-1.5 h-1.5 rounded-full bg-white transition-opacity" style={{ opacity: i === currentImg ? 1 : 0.4 }} />
          ))}
        </div>
      </div>

      <div className="hidden md:grid grid-cols-3 gap-2 h-[400px]">
        <div className="col-span-2 row-span-2 overflow-hidden">
          <img src={hotel.images[0]} alt={hotel.name} className="w-full h-full object-cover hover:scale-105 transition-transform duration-300 cursor-pointer" />
        </div>
        <div className="overflow-hidden">
          <img src={hotel.images[1]} alt={`${hotel.name} 2`} className="w-full h-full object-cover hover:scale-105 transition-transform duration-300 cursor-pointer" />
        </div>
        <div className="overflow-hidden">
          <img src={hotel.images[2]} alt={`${hotel.name} 3`} className="w-full h-full object-cover hover:scale-105 transition-transform duration-300 cursor-pointer" />
        </div>
      </div>

      <button
        onClick={() => setShowAllPhotos(true)}
        className="absolute bottom-4 right-4 bg-white text-foreground text-sm font-semibold px-4 py-2 rounded-xl border border-border shadow-md hover:shadow-lg transition-all"
      >
        Show all photos
      </button>
    </div>
  );
}
