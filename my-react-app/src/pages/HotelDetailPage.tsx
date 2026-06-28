import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Star, Heart, Share2, ChevronLeft, ChevronRight, Wifi, Car, Utensils, Waves, Mountain, Dumbbell, ShieldCheck, ArrowLeft, Users, BedDouble, Bath } from "lucide-react";
import { hotels, reviewSamples } from "../data/hotels";
import { HotelCard } from "../components/HotelCard";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";

const amenityIcons: Record<string, typeof Wifi> = {
  "Free WiFi": Wifi,
  "Parking": Car,
  "Kitchen": Utensils,
  "Beach access": Waves,
  "Mountain view": Mountain,
  "Gym access": Dumbbell,
};

export default function HotelDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const hotel = hotels.find((h) => h.id === Number(id));
  const [currentImg, setCurrentImg] = useState(0);
  const [liked, setLiked] = useState(false);
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState(1);
  const [showAllAmenities, setShowAllAmenities] = useState(false);
  const [showAllPhotos, setShowAllPhotos] = useState(false);

  if (!hotel) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
        <p className="text-2xl">🏨</p>
        <p className="text-lg font-semibold text-foreground">Property not found</p>
        <Link to="/" className="px-5 py-2.5 bg-primary text-white rounded-full text-sm font-medium hover:opacity-90">
          Back to home
        </Link>
      </div>
    );
  }

  const nights = checkIn && checkOut
    ? Math.max(1, Math.round((new Date(checkOut).getTime() - new Date(checkIn).getTime()) / 86400000))
    : 5;
  const subtotal = hotel.price * nights;
  const cleaningFee = Math.round(hotel.price * 0.15);
  const serviceFee = Math.round(subtotal * 0.12);
  const total = subtotal + cleaningFee + serviceFee;

  const related = hotels.filter((h) => h.id !== hotel.id && h.category === hotel.category).slice(0, 4);

  function prevImg() { setCurrentImg((v) => (v === 0 ? hotel.images.length - 1 : v - 1)); }
  function nextImg() { setCurrentImg((v) => (v === hotel.images.length - 1 ? 0 : v + 1)); }

  const visibleAmenities = showAllAmenities ? hotel.amenities : hotel.amenities.slice(0, 8);

  return (
    <div className="min-h-screen bg-background" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      <Navbar />

      <div className="max-w-[1280px] mx-auto px-6 py-6">
        <button onClick={() => navigate(-1)} className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-4 transition-colors">
          <ArrowLeft size={15} /> All stays
        </button>

        <div className="flex items-start justify-between mb-4 gap-4">
          <div>
            <h1 style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: "clamp(1.5rem, 3vw, 2rem)", color: "var(--foreground)", lineHeight: 1.2 }}>
              {hotel.name}
            </h1>
            <div className="flex flex-wrap items-center gap-3 mt-2 text-sm">
              <span className="flex items-center gap-1">
                <Star size={13} className="fill-foreground stroke-foreground" />
                <span className="font-semibold">{hotel.rating}</span>
                <span className="text-muted-foreground">({hotel.reviews} reviews)</span>
              </span>
              {hotel.isSuperhost && (
                <span className="flex items-center gap-1 text-muted-foreground">
                  <ShieldCheck size={13} className="text-primary" />
                  Superhost
                </span>
              )}
              <span className="text-muted-foreground underline cursor-pointer">{hotel.location}</span>
            </div>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <button className="flex items-center gap-1.5 text-sm font-medium text-foreground hover:bg-muted px-3 py-2 rounded-xl transition-colors">
              <Share2 size={15} /> Share
            </button>
            <button onClick={() => setLiked(!liked)} className="flex items-center gap-1.5 text-sm font-medium text-foreground hover:bg-muted px-3 py-2 rounded-xl transition-colors">
              <Heart size={15} className={liked ? "fill-primary stroke-primary" : ""} /> Save
            </button>
          </div>
        </div>

        {showAllPhotos ? (
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
        ) : (
          <div className="relative mb-8 rounded-2xl overflow-hidden bg-muted">
            <div className="md:hidden relative aspect-[4/3]">
              <img src={hotel.images[currentImg]} alt={hotel.name} className="w-full h-full object-cover" />
              <button onClick={prevImg} className="absolute left-3 top-1/2 -translate-y-1/2 bg-white rounded-full p-2 shadow-md hover:shadow-lg"><ChevronLeft size={16} /></button>
              <button onClick={nextImg} className="absolute right-3 top-1/2 -translate-y-1/2 bg-white rounded-full p-2 shadow-md hover:shadow-lg"><ChevronRight size={16} /></button>
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1">
                {hotel.images.map((_, i) => (
                  <div key={i} className="w-1.5 h-1.5 rounded-full bg-white transition-opacity" style={{ opacity: i === currentImg ? 1 : 0.4 }} />
                ))}
              </div>
            </div>

            <div className="hidden md:grid grid-cols-4 grid-rows-2 gap-2 h-[500px]">
              <div className="col-span-2 row-span-2">
                <img src={hotel.images[0]} alt={hotel.name} className="w-full h-full object-cover" />
              </div>
              {hotel.images.slice(1, 5).map((img, i) => (
                <div key={i} className="overflow-hidden">
                  <img src={img} alt={`${hotel.name} ${i + 2}`} className="w-full h-full object-cover hover:scale-105 transition-transform duration-300 cursor-pointer" />
                </div>
              ))}
            </div>

            <button
              onClick={() => setShowAllPhotos(true)}
              className="absolute bottom-4 right-4 bg-white text-foreground text-sm font-semibold px-4 py-2 rounded-xl border border-border shadow-md hover:shadow-lg transition-all"
            >
              Show all photos
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-12">
          <div className="min-w-0">
            <div className="flex flex-wrap gap-4 pb-6 border-b border-border mb-6">
              <div className="flex items-center gap-2 text-sm text-foreground">
                <BedDouble size={18} className="text-muted-foreground" />
                <span><strong>{hotel.bedrooms}</strong> bedroom{hotel.bedrooms > 1 ? "s" : ""}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-foreground">
                <BedDouble size={18} className="text-muted-foreground" />
                <span><strong>{hotel.beds}</strong> bed{hotel.beds > 1 ? "s" : ""}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-foreground">
                <Bath size={18} className="text-muted-foreground" />
                <span><strong>{hotel.bathrooms}</strong> bathroom{hotel.bathrooms > 1 ? "s" : ""}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-foreground">
                <Users size={18} className="text-muted-foreground" />
                <span>Up to <strong>{hotel.maxGuests}</strong> guests</span>
              </div>
            </div>

            <div className="flex items-center gap-4 pb-6 border-b border-border mb-6">
              <img src={hotel.hostAvatar} alt={hotel.hostName} className="w-14 h-14 rounded-full object-cover border border-border" />
              <div>
                <p className="font-semibold text-foreground">Hosted by {hotel.hostName}</p>
                <p className="text-sm text-muted-foreground">Joined {hotel.hostJoined} · {hotel.hostReviews} reviews</p>
              </div>
              {hotel.isSuperhost && (
                <span className="ml-auto flex items-center gap-1 text-xs font-semibold text-primary border border-primary/20 bg-primary/5 px-3 py-1 rounded-full">
                  <ShieldCheck size={12} /> Superhost
                </span>
              )}
            </div>

            <div className="pb-6 border-b border-border mb-6">
              <p className="text-foreground leading-relaxed text-sm">{hotel.description}</p>
            </div>

            <div className="pb-6 border-b border-border mb-6">
              <h2 className="font-semibold text-foreground mb-4" style={{ fontSize: "1.125rem" }}>What this place offers</h2>
              <div className="grid grid-cols-2 gap-3">
                {visibleAmenities.map((a) => {
                  const Icon = amenityIcons[a];
                  return (
                    <div key={a} className="flex items-center gap-3 text-sm text-foreground py-1">
                      {Icon ? <Icon size={18} className="text-muted-foreground shrink-0" /> : <div className="w-4 h-4 rounded-full bg-muted shrink-0" />}
                      {a}
                    </div>
                  );
                })}
              </div>
              {hotel.amenities.length > 8 && (
                <button onClick={() => setShowAllAmenities((v) => !v)} className="mt-4 px-5 py-2.5 border border-foreground rounded-xl text-sm font-medium hover:bg-muted transition-colors">
                  {showAllAmenities ? "Show less" : `Show all ${hotel.amenities.length} amenities`}
                </button>
              )}
            </div>

            <div className="mb-6">
              <div className="flex items-center gap-2 mb-6">
                <Star size={18} className="fill-foreground stroke-foreground" />
                <span className="font-semibold text-foreground">{hotel.rating} · {hotel.reviews} reviews</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {reviewSamples.map((r) => (
                  <div key={r.id} className="flex flex-col gap-3">
                    <div className="flex items-center gap-3">
                      <img src={r.avatar} alt={r.author} className="w-10 h-10 rounded-full object-cover" />
                      <div>
                        <p className="text-sm font-semibold text-foreground">{r.author}</p>
                        <p className="text-xs text-muted-foreground">{r.date}</p>
                      </div>
                      <div className="ml-auto flex">
                        {[...Array(r.rating)].map((_, i) => <Star key={i} size={11} className="fill-foreground stroke-foreground" />)}
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">{r.text}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:sticky lg:top-24 self-start">
            <div className="border border-border rounded-2xl shadow-xl p-6 bg-white">
              <div className="flex items-baseline justify-between mb-5">
                <div>
                  <span className="text-2xl font-bold text-foreground">${hotel.price}</span>
                  <span className="text-muted-foreground text-sm"> / night</span>
                </div>
                <div className="flex items-center gap-1 text-sm">
                  <Star size={13} className="fill-foreground stroke-foreground" />
                  <span className="font-semibold">{hotel.rating}</span>
                  <span className="text-muted-foreground">({hotel.reviews})</span>
                </div>
              </div>

              <div className="border border-border rounded-xl overflow-hidden mb-3">
                <div className="grid grid-cols-2 divide-x divide-border">
                  <div className="p-3">
                    <label className="block text-xs font-semibold uppercase tracking-wide text-foreground mb-1">Check-in</label>
                    <input type="date" value={checkIn} onChange={(e) => setCheckIn(e.target.value)} className="w-full text-sm bg-transparent outline-none text-foreground" />
                  </div>
                  <div className="p-3">
                    <label className="block text-xs font-semibold uppercase tracking-wide text-foreground mb-1">Checkout</label>
                    <input type="date" value={checkOut} onChange={(e) => setCheckOut(e.target.value)} className="w-full text-sm bg-transparent outline-none text-foreground" />
                  </div>
                </div>
                <div className="border-t border-border p-3">
                  <label className="block text-xs font-semibold uppercase tracking-wide text-foreground mb-1">Guests</label>
                  <div className="flex items-center gap-3">
                    <button onClick={() => setGuests(Math.max(1, guests - 1))} className="w-7 h-7 rounded-full border border-border flex items-center justify-center text-foreground hover:bg-muted text-lg leading-none">−</button>
                    <span className="text-sm font-medium text-foreground">{guests} guest{guests > 1 ? "s" : ""}</span>
                    <button onClick={() => setGuests(Math.min(hotel.maxGuests, guests + 1))} className="w-7 h-7 rounded-full border border-border flex items-center justify-center text-foreground hover:bg-muted text-lg leading-none">+</button>
                  </div>
                </div>
              </div>

              <button className="w-full py-3.5 rounded-xl bg-primary text-white font-semibold text-sm hover:opacity-90 transition-all hover:shadow-lg mb-4">
                Reserve now
              </button>
              <p className="text-center text-xs text-muted-foreground mb-5">You won't be charged yet</p>

              <div className="flex flex-col gap-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground underline cursor-default">${hotel.price} × {nights} nights</span>
                  <span className="text-foreground">${subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground underline cursor-default">Cleaning fee</span>
                  <span className="text-foreground">${cleaningFee}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground underline cursor-default">StayEasy service fee</span>
                  <span className="text-foreground">${serviceFee}</span>
                </div>
                <div className="border-t border-border pt-3 flex justify-between font-semibold text-foreground">
                  <span>Total before taxes</span>
                  <span>${total.toLocaleString()}</span>
                </div>
              </div>
            </div>

            <p className="text-center text-xs text-muted-foreground mt-4 hover:underline cursor-pointer">Report this listing</p>
          </div>
        </div>

        {related.length > 0 && (
          <section className="mt-16 border-t border-border pt-10">
            <h2 className="font-semibold text-foreground mb-6" style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.5rem" }}>
              More places like this
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {related.map((h) => <HotelCard key={h.id} {...h} />)}
            </div>
          </section>
        )}
      </div>

      <Footer />
    </div>
  );
}
