import { useEffect, useCallback } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Users, Building2, DoorOpen, CalendarDays, Phone, Mail, Coins, Globe, Languages } from "lucide-react";
import toast from "react-hot-toast";
import { Navbar } from "../../../shared/components/Navbar";
import { Footer } from "../../../shared/components/Footer";
import { PageMessage } from "../../../shared/components/PageMessage";
import { useAuth } from "../../../auth/AuthContext";
import { useFavorites } from "../../../context/FavoritesContext";
import type { SearchProperty } from "../../../shared/types/api";
import { HotelHeader } from "../components/HotelHeader";
import { ImageGallery } from "../components/ImageGallery";
import { HostInfo } from "../components/HostInfo";
import { AmenitiesSection } from "../components/AmenitiesSection";
import { RoomSelectionPanel } from "../components/RoomSelectionPanel";
import { ReviewSection } from "../components/ReviewSection";
import { ThingsToKnow } from "../components/ThingsToKnow";
import { RoomDetailModal } from "../components/RoomDetailModal";
import { RecommendedRoom } from "../components/RecommendedRoom";
import { usePropertyDetails } from "../hooks/usePropertyDetails";
import { useBookingCreation } from "../../booking/hooks/useBookingCreation";

export default function PropertyDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => { window.scrollTo(0, 0) }, []);
  const { user } = useAuth();
  const { isFavorite, toggleFavorite } = useFavorites();

  const {
    hotel,
    isLoading,
    currency,
    checkIn,
    checkOut,
    guests,
    roomQuantities,
    roomGuestCounts,
    selectedRoomId,
    detailRoomId,
    nights,
    capacityError,
    recommendedRooms,
    hotelMatchesFilters,
    setCheckIn,
    setCheckOut,
    setGuests,
    setDetailRoomId,
    handleQtyChange,
    handleSelectRoom,
  } = usePropertyDetails(id);

  const { createBooking, isCreating } = useBookingCreation();

  const liked = isFavorite(id ?? "");

  const hotelToSearchProperty = useCallback((h: NonNullable<typeof hotel>): SearchProperty => ({
    property_id: String(h.id),
    name: h.name,
    type: h.category || "Hotel",
    country: h.country,
    state: "",
    city: h.city || "",
    address: h.location,
    currency: h.currency || "USD",
    cover_photo: h.imageUrl || h.images?.[0] || "",
    total_price: h.price,
    lowest_rate: h.price,
    description: h.description,
    total_rooms: h.totalRooms,
    amenities: h.amenities,
  }), [hotel]);

  const handleShare = useCallback(async () => {
    const url = window.location.href;
    const shareData = {
      title: hotel?.name ?? "Check out this property",
      text: `Stay at ${hotel?.name} in ${hotel?.location}`,
      url,
    };
    try {
      await navigator.share(shareData);
      toast.success("Shared successfully");
    } catch {
      try {
        await navigator.clipboard.writeText(url);
        toast.success("Link copied to clipboard");
      } catch {
        toast.error("Could not copy link");
      }
    }
  }, [hotel]);

  if (isLoading) {
    return <PageMessage loading title="Loading property..." />;
  }

  if (!hotel) {
    return (
      <PageMessage
        icon="🏨"
        title="Property not found"
        action={
          <Link to="/" className="px-5 py-2.5 bg-primary text-white rounded-full text-sm font-medium hover:opacity-90">
            Back to home
          </Link>
        }
      />
    );
  }

  const guestCount = (() => {
    const total = guests.adults + guests.children
    return total > 0 ? total : 2
  })();

  const handleSearch = () => {
    const params = new URLSearchParams();
    params.set("where", hotel.name);
    if (checkIn) params.set("checkin", checkIn);
    if (checkOut) params.set("checkout", checkOut);
    const totalGuests = guests.adults + guests.children;
    if (totalGuests > 0) params.set("guests", String(totalGuests));
    navigate(`/search?${params.toString()}`);
  };

  const handleOpenDetail = (roomId: string) => {
    setDetailRoomId(roomId);
  };

  const handleReserveFromModal = (roomId: string) => {
    setDetailRoomId(null);
    handleSelectRoom(roomId);
  };

  const handleReserve = async () => {
    const selected = Object.entries(roomQuantities).filter(([, q]) => q > 0);
    if (selected.length === 0) return;

    if (!user) {
      const params = new URLSearchParams();
      if (checkIn) params.set('checkin', checkIn);
      if (checkOut) params.set('checkout', checkOut);
      params.set('guests', String(guests.adults + guests.children));
      params.set('adults', String(guests.adults));
      params.set('children', String(guests.children));
      params.set('rooms', String(guests.rooms));
      navigate('/login?redirect=' + encodeURIComponent('/hotel/' + id + '?' + params.toString()));
      return;
    }

    const roomIds = selected.flatMap(([roomId, qty]) => Array(qty).fill(roomId));

    let refNumber = '';
    try {
      refNumber = await createBooking({
        property_id: id!,
        room_ids: roomIds,
        check_in: checkIn,
        check_out: checkOut,
        adults: guests.adults,
        children: guests.children,
      });
    } catch {
      toast.error('Could not create booking. Please try again.');
      return;
    }

    if (!refNumber) {
      toast.error('Could not create booking. Please try again.');
      return;
    }

    const params = new URLSearchParams();
    if (checkIn) params.set('checkIn', checkIn);
    if (checkOut) params.set('checkOut', checkOut);
    params.set('rooms', JSON.stringify(Object.fromEntries(selected)));
    params.set('guestCounts', JSON.stringify(
      Object.fromEntries(Object.entries(roomGuestCounts).filter(([roomId]) => selected.some(([sId]) => sId === roomId)))
    ));
    params.set('adults', String(guests.adults));
    params.set('children', String(guests.children));
    if (refNumber) params.set('ref', refNumber);
    navigate('/booking-details/' + id + '?' + params.toString());
  };

  const detailRoom = detailRoomId ? hotel.roomTypes.find(rt => rt.id === detailRoomId) : null;

  return (
    <div className="min-h-screen bg-background font-jakarta">
      <Navbar />

      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 py-6">
        <button onClick={() => navigate(-1)} className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-4 transition-colors">
          <ArrowLeft size={15} /> All stays
        </button>

        <HotelHeader hotel={hotel} liked={liked} onToggleFavorite={() => {
          if (!user) { navigate('/signup'); } else { toggleFavorite(id ?? "", hotelToSearchProperty(hotel)); }
        }} onShare={handleShare} />

        <ImageGallery hotel={hotel} />

        <div className="flex flex-wrap gap-4 pb-6 border-b border-border mb-6">
          <div className="flex items-center gap-2 text-sm text-foreground">
            <DoorOpen size={18} className="text-muted-foreground" />
            <span><strong>{hotel.totalRooms ?? hotel.roomTypes.length}</strong> room{hotel.totalRooms ? hotel.totalRooms > 1 ? "s" : "" : hotel.roomTypes.length > 1 ? "s" : ""}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-foreground">
            <Building2 size={18} className="text-muted-foreground" />
            <span><strong>{hotel.numberOfFloors ?? "—"}</strong> floor{hotel.numberOfFloors != null && hotel.numberOfFloors > 1 ? "s" : ""}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-foreground">
            <CalendarDays size={18} className="text-muted-foreground" />
            <span>Built in <strong>{hotel.yearBuilt ?? "—"}</strong></span>
          </div>
          <div className="flex items-center gap-2 text-sm text-foreground">
            <Users size={18} className="text-muted-foreground" />
            <span>Up to <strong>{hotel.maxGuests}</strong> guests</span>
          </div>
        </div>

        {(hotel.phoneNumber || hotel.email || hotel.currency || hotel.timezone || hotel.language) && (
          <div className="flex flex-wrap gap-x-6 gap-y-3 pb-6 border-b border-border mb-6">
            {hotel.phoneNumber && (
              <a href={`tel:${hotel.phoneNumber}`} className="flex items-center gap-2 group">
                <Phone size={16} className="text-brand-accent" />
                <span className="text-sm font-medium text-foreground group-hover:text-brand-accent transition-colors">{hotel.phoneNumber}</span>
              </a>
            )}
            {hotel.email && (
              <a href={`mailto:${hotel.email}`} className="flex items-center gap-2 group">
                <Mail size={16} className="text-brand-accent" />
                <span className="text-sm font-medium text-foreground group-hover:text-brand-accent transition-colors">{hotel.email}</span>
              </a>
            )}
            {hotel.currency && (
              <div className="flex items-center gap-2">
                <Coins size={16} className="text-brand-accent" />
                <span className="text-sm font-medium text-foreground">{hotel.currency}</span>
              </div>
            )}
            {hotel.timezone && (
              <div className="flex items-center gap-2">
                <Globe size={16} className="text-brand-accent" />
                <span className="text-sm font-medium text-foreground">{hotel.timezone}</span>
              </div>
            )}
            {hotel.language && (
              <div className="flex items-center gap-2">
                <Languages size={16} className="text-brand-accent" />
                <span className="text-sm font-medium text-foreground">{hotel.language}</span>
              </div>
            )}
          </div>
        )}

        <HostInfo hotel={hotel} />

        <AmenitiesSection hotel={hotel} />

        {hotelMatchesFilters && recommendedRooms.length > 0 && (
          <div className="mb-6">
            <h3 className="text-lg font-bold text-foreground mb-3 font-brand">
              Recommended for {guestCount} guest{guestCount > 1 ? "s" : ""}
            </h3>
            <div className="space-y-3">
              {recommendedRooms.map((rt) => (
                <RecommendedRoom key={rt.id} room={rt} onReserve={handleSelectRoom} currency={currency} roomQuantities={roomQuantities} />
              ))}
            </div>
          </div>
        )}

        <RoomSelectionPanel
          hotel={hotel}
          checkIn={checkIn}
          checkOut={checkOut}
          onCheckInChange={setCheckIn}
          onCheckOutChange={setCheckOut}
          guests={guests}
          onGuestsChange={setGuests}
          onSearch={handleSearch}
          roomQuantities={roomQuantities}
          roomGuestCounts={roomGuestCounts}
          selectedRoomId={selectedRoomId}
          nights={nights}
          onQtyChange={handleQtyChange}
          onOpenDetail={handleOpenDetail}
          onReserve={handleReserve}
          currency={currency}
          capacityError={capacityError}
          user={user}
          isCreating={isCreating}
        />

        <ReviewSection hotel={hotel} />

        <ThingsToKnow />
      </div>

      {detailRoom && (
        <RoomDetailModal
          room={detailRoom}
          hotel={hotel}
          roomGuestCounts={roomGuestCounts}
          onClose={() => setDetailRoomId(null)}
          onReserve={handleReserveFromModal}
        />
      )}

      <Footer />
    </div>
  );
}
