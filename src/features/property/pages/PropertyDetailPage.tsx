import { useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { ArrowLeft, BedDouble, Bath, Users } from "lucide-react";
import toast from "react-hot-toast";
import { Navbar } from "../../../shared/components/Navbar";
import { Footer } from "../../../shared/components/Footer";
import { PageMessage } from "../../../shared/components/PageMessage";
import { SearchBar } from "../../../shared/components/SearchBar";
import { StickySearchHeader } from "../../../shared/components/StickySearchHeader";
import { useAuth } from "../../../context/AuthContext";
import { useFavorites } from "../../../context/FavoritesContext";
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

  const { createBooking } = useBookingCreation();

  const liked = isFavorite(Number(id));

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

      <StickySearchHeader>
        <SearchBar />
      </StickySearchHeader>

      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 py-6">
        <button onClick={() => navigate(-1)} className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-4 transition-colors">
          <ArrowLeft size={15} /> All stays
        </button>

        <HotelHeader hotel={hotel} liked={liked} onToggleFavorite={() => {
          if (!user) { navigate('/signup'); } else { toggleFavorite(Number(id)); }
        }} />

        <ImageGallery hotel={hotel} />

        <div>
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
          />

          <ReviewSection hotel={hotel} />
        </div>

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
