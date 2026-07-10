import { useState, useRef, useEffect } from "react";
import {
  ChevronDown,
  ChevronUp,
  X,
  Plus,
  Minus,
  Check,
  Search,
  Camera,
  Info,
  Trash2,
  Coffee,
  Utensils,
  Cigarette,
} from "lucide-react";

// ─── Constants ──────────────────────────────────────────────────────────────

const ROOM_TYPES = [
  "Standard Room",
  "Deluxe Room",
  "Superior Room",
  "Suite",
  "Junior Suite",
  "Executive Suite",
  "Presidential Suite",
  "Studio",
  "Family Room",
  "Dormitory Bed",
];
const BED_TYPES = [
  "Single Bed",
  "Double Bed",
  "Queen Bed",
  "King Bed",
  "Twin Beds",
  "Bunk Beds",
  "Sofa Bed",
  "California King",
];
const ROOM_AMENITIES_LIST = [
  "Free WiFi",
  "Air Conditioning",
  "Smart TV",
  "Mini Bar",
  "Coffee Machine",
  "Electric Kettle",
  "Iron & Ironing Board",
  "Hair Dryer",
  "Soaking Bathtub",
  "Rain Shower",
  "Premium Toiletries",
  "In-room Safe",
  "Blackout Curtains",
  "Soundproofing",
  "Private Bathroom",
  "Work Desk",
  "Sofa",
  "Walk-in Wardrobe",
  "Private Balcony",
  "Ocean View",
  "City View",
  "Mountain View",
  "Kitchenette",
  "Microwave",
  "Mini Refrigerator",
  "Slippers & Bathrobe",
  "Wake-up Service",
  "Daily Housekeeping",
  "Streaming Services",
  "USB Charging Ports",
  "Laptop-friendly Workspace",
  "Interconnecting Rooms Available",
];
const ROOM_PHOTOS = [
  {
    id: "rp1",
    url: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=400&h=280&fit=crop&auto=format",
    name: "Room Overview",
  },
  {
    id: "rp2",
    url: "https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=400&h=280&fit=crop&auto=format",
    name: "Luxury Bathroom",
  },
  {
    id: "rp3",
    url: "https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?w=400&h=280&fit=crop&auto=format",
    name: "King Bedroom",
  },
  {
    id: "rp4",
    url: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=400&h=280&fit=crop&auto=format",
    name: "Seating Area",
  },
  {
    id: "rp5",
    url: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=280&fit=crop&auto=format",
    name: "Balcony View",
  },
];
const CANCELLATION_POLICIES = [
  {
    value: "flexible",
    label: "Flexible",
    desc: "Full refund 24 hrs before check-in",
  },
  {
    value: "moderate",
    label: "Moderate",
    desc: "Full refund 5 days before check-in",
  },
  {
    value: "strict",
    label: "Strict",
    desc: "50% refund up to 1 week before",
  },
  {
    value: "non_refundable",
    label: "Non-Refundable",
    desc: "No refund at any time",
  },
];

// ─── Types ───────────────────────────────────────────────────────────────────

interface Photo {
  id: string;
  url: string;
  name: string;
}

export interface Room {
  id: string;
  floor: string;
  name: string;
  type: string;
  customRoomType: string;
  bedType: string;
  customBedType: string;
  photos: Photo[];
  amenities: string[];
  amenityInput: string;
  maxAdults: number;
  maxChildren: number;
  petAllowed: boolean;
  maxPets: number;
  minRate: string;
  cancellationPolicy: string;
  customCancellationPolicy: string;
  breakfastIncluded: boolean;
  dinnerIncluded: boolean;
  smokingAllowed: boolean;
  expanded: boolean;
}

export function genId() {
  return Math.random().toString(36).slice(2, 9);
}

export function createRoom(): Room {
  return {
    id: genId(),
    floor: "1",
    name: "",
    type: "",
    customRoomType: "",
    bedType: "",
    customBedType: "",
    photos: [],
    amenities: [],
    amenityInput: "",
    maxAdults: 2,
    maxChildren: 0,
    petAllowed: false,
    maxPets: 0,
    minRate: "",
    cancellationPolicy: "moderate",
    customCancellationPolicy: "",
    breakfastIncluded: false,
    dinnerIncluded: false,
    smokingAllowed: false,
    expanded: true,
  };
}

// ─── Base UI Components ───────────────────────────────────────────────────────

function Field({
  label,
  required,
  hint,
  children,
  className = "",
}: {
  label: string;
  required?: boolean;
  hint?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      <label className="text-sm font-semibold text-foreground">
        {label}
        {required && (
          <span className="text-red-500 ml-0.5">*</span>
        )}
      </label>
      {children}
      {hint && (
        <p className="text-xs text-muted-foreground">{hint}</p>
      )}
    </div>
  );
}

function TextInput({
  className = "",
  ...props
}: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={`w-full px-3.5 py-2.5 bg-white border border-border rounded-xl text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all ${className}`}
      {...props}
    />
  );
}

function SelectInput({
  children,
  className = "",
  ...props
}: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <div className="relative">
      <select
        className={`w-full px-3.5 py-2.5 bg-white border border-border rounded-xl text-sm text-foreground appearance-none focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all pr-9 ${className}`}
        {...props}
      >
        {children}
      </select>
      <ChevronDown
        size={15}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
      />
    </div>
  );
}

function NumberStepper({
  value,
  onChange,
  min = 0,
  max = 99,
}: {
  value: number;
  onChange: (v: number) => void;
  min?: number;
  max?: number;
}) {
  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={() => onChange(Math.max(min, value - 1))}
        disabled={value <= min}
        className="w-8 h-8 rounded-full border border-border flex items-center justify-center text-foreground hover:bg-muted disabled:opacity-40 transition-colors"
      >
        <Minus size={13} />
      </button>
      <span className="w-8 text-center text-sm font-bold text-foreground tabular-nums">
        {value}
      </span>
      <button
        type="button"
        onClick={() => onChange(Math.min(max, value + 1))}
        disabled={value >= max}
        className="w-8 h-8 rounded-full border border-border flex items-center justify-center text-foreground hover:bg-muted disabled:opacity-40 transition-colors"
      >
        <Plus size={13} />
      </button>
    </div>
  );
}

function AmenityInput({
  value,
  amenities,
  allAmenities,
  onInput,
  onAdd,
  onRemove,
}: {
  value: string;
  amenities: string[];
  allAmenities: string[];
  onInput: (v: string) => void;
  onAdd: (a: string) => void;
  onRemove: (a: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);

  const suggestions =
    value.length > 0
      ? allAmenities
          .filter(
            (a) =>
              a.toLowerCase().includes(value.toLowerCase()) &&
              !amenities.includes(a),
          )
          .slice(0, 7)
      : [];

  useEffect(() => {
    function outside(e: MouseEvent) {
      if (
        wrapRef.current &&
        !wrapRef.current.contains(e.target as Node)
      )
        setOpen(false);
    }
    document.addEventListener("mousedown", outside);
    return () =>
      document.removeEventListener("mousedown", outside);
  }, []);

  return (
    <div className="flex flex-col gap-3">
      {amenities.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {amenities.map((a) => (
            <span
              key={a}
              className="inline-flex items-center gap-1.5 bg-primary/10 text-primary rounded-full pl-3 pr-1 py-1 text-sm font-medium"
            >
              {a}
              <button
                type="button"
                onClick={() => onRemove(a)}
                className="w-4 h-4 rounded-full bg-primary/20 flex items-center justify-center hover:bg-primary hover:text-white transition-colors flex-shrink-0"
                aria-label={`Remove ${a}`}
              >
                <X size={9} />
              </button>
            </span>
          ))}
        </div>
      )}
      <div ref={wrapRef} className="relative">
        <div className="relative">
          <Search
            size={15}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
          />
          <input
            type="text"
            value={value}
            onChange={(e) => {
              onInput(e.target.value);
              setOpen(true);
            }}
            onFocus={() => setOpen(true)}
            placeholder="Type to search amenities (e.g. WiFi, Pool, Spa…)"
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-border rounded-xl text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
          />
        </div>
        {open && suggestions.length > 0 && (
          <div className="absolute top-full left-0 right-0 z-50 mt-1 bg-white border border-border rounded-xl shadow-lg overflow-hidden">
            {suggestions.map((s) => (
              <button
                key={s}
                type="button"
                onMouseDown={() => {
                  onAdd(s);
                  onInput("");
                  setOpen(false);
                }}
                className="w-full text-left px-4 py-2.5 text-sm text-foreground hover:bg-primary/5 hover:text-primary transition-colors flex items-center gap-2.5"
              >
                <Plus
                  size={13}
                  className="text-primary flex-shrink-0"
                />
                {s}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function PhotoUploadGrid({
  photos,
  samplePool,
  onAdd,
  onRemove,
}: {
  photos: Photo[];
  samplePool: Photo[];
  onAdd: (p: Photo) => void;
  onRemove: (id: string) => void;
}) {
  const available = samplePool.filter(
    (p) => !photos.find((ph) => ph.id === p.id),
  );
  const MAX = 5;

  return (
    <div className="flex flex-col gap-3">
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2.5">
        {photos.map((p, i) => (
          <div
            key={p.id}
            className="relative aspect-[4/3] rounded-xl overflow-hidden group bg-muted"
          >
            <img
              src={p.url}
              alt={p.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <button
                type="button"
                onClick={() => onRemove(p.id)}
                className="w-8 h-8 rounded-full bg-white/90 flex items-center justify-center text-red-500 hover:bg-white transition-colors shadow"
              >
                <X size={14} />
              </button>
            </div>
            {i === 0 && (
              <div className="absolute bottom-1.5 left-1.5 bg-primary text-white text-[10px] px-1.5 py-0.5 rounded font-semibold tracking-wide">
                COVER
              </div>
            )}
          </div>
        ))}
        {photos.length < MAX && (
          <div className="relative aspect-[4/3] rounded-xl border-2 border-dashed border-border bg-muted/40 group">
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-1.5">
              <Camera
                size={18}
                className="text-muted-foreground"
              />
              <span className="text-xs text-muted-foreground font-medium">
                Add Photo
              </span>
            </div>
            {available.length > 0 && (
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity bg-white rounded-xl border-2 border-primary flex flex-col overflow-auto p-1.5 gap-0.5">
                {available.map((ph) => (
                  <button
                    key={ph.id}
                    type="button"
                    onClick={() => onAdd(ph)}
                    className="text-[11px] text-left px-2.5 py-1.5 hover:bg-primary/10 hover:text-primary rounded-lg text-foreground font-medium transition-colors"
                  >
                    + {ph.name}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
      <p className="text-xs text-muted-foreground flex items-center gap-1.5">
        <Camera size={11} />
        {photos.length}/{MAX} photos · Hover a card to remove ·
        First photo is the cover image
      </p>
    </div>
  );
}

// ─── Room Card ────────────────────────────────────────────────────────────────

function RoomCard({
  room,
  index,
  floors,
  onChange,
  onRemove,
}: {
  room: Room;
  index: number;
  floors: number;
  onChange: (u: Partial<Room>) => void;
  onRemove: () => void;
}) {
  const floorNumbers = Array.from(
    { length: floors },
    (_, i) => i + 1,
  );

  return (
    <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
      {/* Header */}
      <div
        className="flex items-center justify-between px-6 py-4 cursor-pointer hover:bg-muted/30 transition-colors select-none"
        onClick={() => onChange({ expanded: !room.expanded })}
      >
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-primary text-white flex items-center justify-center text-sm font-bold flex-shrink-0">
            {index + 1}
          </div>
          <div>
            <p className="font-semibold text-foreground text-sm">
              {room.name || `Room ${index + 1}`}
            </p>
            <p className="text-xs text-muted-foreground">
              {[
                room.type === "custom" ? room.customRoomType || "Custom Type" : room.type,
                room.bedType === "custom" ? room.customBedType || "Custom Bed" : room.bedType,
                room.floor ? `Floor ${room.floor}` : "",
              ]
                .filter(Boolean)
                .join(" · ") || "Configure room details below"}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {index > 0 && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onRemove();
              }}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-muted-foreground hover:text-red-500 hover:bg-red-50 transition-colors"
              title="Remove room"
            >
              <Trash2 size={14} />
            </button>
          )}
          <div className="w-7 h-7 flex items-center justify-center text-muted-foreground">
            {room.expanded ? (
              <ChevronUp size={17} />
            ) : (
              <ChevronDown size={17} />
            )}
          </div>
        </div>
      </div>

      {/* Body */}
      {room.expanded && (
        <div className="px-6 pb-6 border-t border-border pt-5 flex flex-col gap-6">
          {/* Identification */}
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-4">
              Room Identification
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              <Field label="Floor" required>
                <SelectInput
                  value={room.floor}
                  onChange={(e) =>
                    onChange({ floor: e.target.value })
                  }
                >
                  {floorNumbers.map((n) => (
                    <option key={n} value={String(n)}>
                      Floor {n}
                    </option>
                  ))}
                </SelectInput>
              </Field>
              <Field label="Room Name" required>
                <TextInput
                  value={room.name}
                  onChange={(e) =>
                    onChange({ name: e.target.value })
                  }
                  placeholder="e.g. Ocean Suite A"
                />
              </Field>
              <Field label="Room Type" required>
                <SelectInput
                  value={room.type}
                  onChange={(e) =>
                    onChange({ type: e.target.value, customRoomType: "" })
                  }
                >
                  <option value="">Select type</option>
                  {ROOM_TYPES.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                  <option value="custom">+ Customize...</option>
                </SelectInput>
                {room.type === "custom" && (
                  <TextInput
                    value={room.customRoomType}
                    onChange={(e) =>
                      onChange({ customRoomType: e.target.value })
                    }
                    placeholder="Enter your room type (e.g. Treehouse Suite)"
                    className="mt-2"
                  />
                )}
              </Field>
            </div>
          </div>

          {/* Bed */}
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-4">
              Bed Configuration
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Bed Type" required>
                <SelectInput
                  value={room.bedType}
                  onChange={(e) =>
                    onChange({ bedType: e.target.value, customBedType: "" })
                  }
                >
                  <option value="">Select bed type</option>
                  {BED_TYPES.map((b) => (
                    <option key={b} value={b}>
                      {b}
                    </option>
                  ))}
                  <option value="custom">+ Customize...</option>
                </SelectInput>
                {room.bedType === "custom" && (
                  <TextInput
                    value={room.customBedType}
                    onChange={(e) =>
                      onChange({ customBedType: e.target.value })
                    }
                    placeholder="Enter your bed type (e.g. Futon, Hammock Bed)"
                    className="mt-2"
                  />
                )}
              </Field>
            </div>
          </div>

          {/* Photos */}
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-4">
              Room Photos (max 5)
            </p>
            <PhotoUploadGrid
              photos={room.photos}
              samplePool={ROOM_PHOTOS}
              onAdd={(p) =>
                onChange({ photos: [...room.photos, p] })
              }
              onRemove={(id) =>
                onChange({
                  photos: room.photos.filter(
                    (ph) => ph.id !== id,
                  ),
                })
              }
            />
          </div>

          {/* Room Amenities (Meals & Smoking moved here) */}
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-4">
              Room Amenities
            </p>
            <AmenityInput
              value={room.amenityInput}
              amenities={room.amenities}
              allAmenities={ROOM_AMENITIES_LIST}
              onInput={(v) => onChange({ amenityInput: v })}
              onAdd={(a) =>
                onChange({
                  amenities: [...room.amenities, a],
                  amenityInput: "",
                })
              }
              onRemove={(a) =>
                onChange({
                  amenities: room.amenities.filter(
                    (x) => x !== a,
                  ),
                })
              }
            />

            {/* Specific Inclusions & Policies inside Amenities */}
            <div className="flex flex-wrap gap-3 mt-4">
              <label
                className={`flex items-center gap-2.5 px-4 py-3 rounded-xl border-2 cursor-pointer transition-all ${
                  room.breakfastIncluded
                    ? "border-amber-400 bg-amber-50"
                    : "border-border hover:border-amber-200"
                }`}
              >
                <div
                  className={`w-4 h-4 rounded border-2 flex items-center justify-center flex-shrink-0 ${
                    room.breakfastIncluded
                      ? "border-amber-500 bg-amber-500"
                      : "border-muted-foreground"
                  }`}
                >
                  {room.breakfastIncluded && (
                    <Check size={9} className="text-white" />
                  )}
                </div>
                <input
                  type="checkbox"
                  className="sr-only"
                  checked={room.breakfastIncluded}
                  onChange={(e) =>
                    onChange({
                      breakfastIncluded: e.target.checked,
                    })
                  }
                />
                <Coffee size={15} className="text-amber-500" />
                <span className="text-sm font-semibold text-foreground">
                  Breakfast Included
                </span>
              </label>

              <label
                className={`flex items-center gap-2.5 px-4 py-3 rounded-xl border-2 cursor-pointer transition-all ${
                  room.dinnerIncluded
                    ? "border-orange-400 bg-orange-50"
                    : "border-border hover:border-orange-200"
                }`}
              >
                <div
                  className={`w-4 h-4 rounded border-2 flex items-center justify-center flex-shrink-0 ${
                    room.dinnerIncluded
                      ? "border-orange-500 bg-orange-500"
                      : "border-muted-foreground"
                  }`}
                >
                  {room.dinnerIncluded && (
                    <Check size={9} className="text-white" />
                  )}
                </div>
                <input
                  type="checkbox"
                  className="sr-only"
                  checked={room.dinnerIncluded}
                  onChange={(e) =>
                    onChange({
                      dinnerIncluded: e.target.checked,
                    })
                  }
                />
                <Utensils
                  size={15}
                  className="text-orange-500"
                />
                <span className="text-sm font-semibold text-foreground">
                  Dinner Included
                </span>
              </label>

              <label
                className={`flex items-center gap-2.5 px-4 py-3 rounded-xl border-2 cursor-pointer transition-all ${
                  room.smokingAllowed
                    ? "border-red-400 bg-red-50"
                    : "border-border hover:border-red-200"
                }`}
              >
                <div
                  className={`w-4 h-4 rounded border-2 flex items-center justify-center flex-shrink-0 ${
                    room.smokingAllowed
                      ? "border-red-500 bg-red-500"
                      : "border-muted-foreground"
                  }`}
                >
                  {room.smokingAllowed && (
                    <Check size={9} className="text-white" />
                  )}
                </div>
                <input
                  type="checkbox"
                  className="sr-only"
                  checked={room.smokingAllowed}
                  onChange={(e) =>
                    onChange({
                      smokingAllowed: e.target.checked,
                    })
                  }
                />
                <Cigarette size={15} className="text-red-500" />
                <span className="text-sm font-semibold text-foreground">
                  Smoking Allowed
                </span>
              </label>
            </div>
          </div>

          {/* Occupancy */}
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-4">
              Maximum Occupancy
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="flex items-center justify-between p-4 bg-muted/40 rounded-xl border border-border">
                <div>
                  <p className="text-sm font-semibold text-foreground">
                    Adults
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Age 18+
                  </p>
                </div>
                <NumberStepper
                  value={room.maxAdults}
                  onChange={(v) => onChange({ maxAdults: v })}
                  min={1}
                  max={20}
                />
              </div>
              <div className="flex items-center justify-between p-4 bg-muted/40 rounded-xl border border-border">
                <div>
                  <p className="text-sm font-semibold text-foreground">
                    Children
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Age 2–17
                  </p>
                </div>
                <NumberStepper
                  value={room.maxChildren}
                  onChange={(v) => onChange({ maxChildren: v })}
                  min={0}
                  max={10}
                />
              </div>
              <div
                className={`flex flex-col gap-3 p-4 bg-muted/40 rounded-xl border transition-colors ${room.petAllowed ? "border-primary/30 bg-primary/5" : "border-border"}`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-foreground">
                      Pets Allowed
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Toggle to enable
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      onChange({
                        petAllowed: !room.petAllowed,
                        maxPets: !room.petAllowed
                          ? Math.max(1, room.maxPets)
                          : 0,
                      })
                    }
                    className={`relative w-11 h-6 rounded-full transition-colors flex-shrink-0 ${room.petAllowed ? "bg-primary" : "bg-muted-foreground/30"}`}
                  >
                    <span
                      className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow-sm transition-transform ${room.petAllowed ? "translate-x-6" : "translate-x-1"}`}
                    />
                  </button>
                </div>
                {room.petAllowed && (
                  <div className="flex items-center justify-between pt-2 border-t border-primary/20">
                    <p className="text-xs font-medium text-foreground">
                      Max pets allowed
                    </p>
                    <NumberStepper
                      value={room.maxPets}
                      onChange={(v) => onChange({ maxPets: v })}
                      min={1}
                      max={10}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Rates & Policy */}
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-4">
              Rates & Policies
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <Field label="Minimum Rate per Night" required>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground text-sm font-semibold">
                    $
                  </span>
                  <TextInput
                    type="number"
                    value={room.minRate}
                    onChange={(e) =>
                      onChange({ minRate: e.target.value })
                    }
                    placeholder="0.00"
                    className="pl-8"
                    min="0"
                    step="0.01"
                  />
                </div>
              </Field>

              <div>
                <p className="text-sm font-semibold text-foreground mb-2">
                  Cancellation Policy{" "}
                  <span className="text-red-500">*</span>
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {CANCELLATION_POLICIES.map((p) => (
                    <label
                      key={p.value}
                      className={`flex flex-col gap-1 p-3 rounded-xl border-2 cursor-pointer transition-all ${
                        room.cancellationPolicy === p.value
                          ? "border-primary bg-primary/5"
                          : "border-border hover:border-primary/40"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-3.5 h-3.5 rounded-full border-2 flex-shrink-0 flex items-center justify-center ${
                            room.cancellationPolicy === p.value
                              ? "border-primary bg-primary"
                              : "border-muted-foreground"
                          }`}
                        >
                          {room.cancellationPolicy ===
                            p.value && (
                            <div className="w-1.5 h-1.5 rounded-full bg-white" />
                          )}
                        </div>
                        <input
                          type="radio"
                          className="sr-only"
                          checked={
                            room.cancellationPolicy === p.value
                          }
                          onChange={() =>
                            onChange({
                              cancellationPolicy: p.value,
                            })
                          }
                        />
                        <span className="text-xs font-bold text-foreground">
                          {p.label}
                        </span>
                      </div>
                      <p className="text-[11px] text-muted-foreground leading-tight pl-5">
                        {p.desc}
                      </p>
                    </label>
                  ))}
                  {/* Custom policy option */}
                  <label
                    className={`flex flex-col gap-1 p-3 rounded-xl border-2 cursor-pointer transition-all ${
                      room.cancellationPolicy === "custom"
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/40"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-3.5 h-3.5 rounded-full border-2 flex-shrink-0 flex items-center justify-center ${
                          room.cancellationPolicy === "custom"
                            ? "border-primary bg-primary"
                            : "border-muted-foreground"
                        }`}
                      >
                        {room.cancellationPolicy === "custom" && (
                          <div className="w-1.5 h-1.5 rounded-full bg-white" />
                        )}
                      </div>
                      <input
                        type="radio"
                        className="sr-only"
                        checked={room.cancellationPolicy === "custom"}
                        onChange={() =>
                          onChange({ cancellationPolicy: "custom" })
                        }
                      />
                      <span className="text-xs font-bold text-foreground">
                        Custom
                      </span>
                    </div>
                    <p className="text-[11px] text-muted-foreground leading-tight pl-5">
                      Define your own policy terms
                    </p>
                  </label>
                </div>
                {room.cancellationPolicy === "custom" && (
                  <div className="mt-3 flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-foreground">
                      Custom Cancellation Terms
                      <span className="text-red-500 ml-0.5">*</span>
                    </label>
                    <textarea
                      value={room.customCancellationPolicy}
                      onChange={(e) =>
                        onChange({ customCancellationPolicy: e.target.value })
                      }
                      rows={3}
                      placeholder="e.g. Full refund if cancelled 48 hours before check-in. 50% refund within 48 hours. No refund for no-shows."
                      className="w-full px-3.5 py-2.5 bg-white border border-border rounded-xl text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none"
                    />
                    <p className="text-xs text-muted-foreground">
                      Clearly describe refund conditions, timeframes, and any exceptions.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Rooms Page ────────────────────────────────────────────────────────────────

export function RoomsPage({
  rooms,
  floors,
  onChange,
  onAdd,
  onRemove,
}: {
  rooms: Room[];
  floors: number;
  onChange: (id: string, u: Partial<Room>) => void;
  onAdd: () => void;
  onRemove: (id: string) => void;
}) {
  return (
    <div className="flex flex-col gap-4">
      <div className="bg-primary/5 border border-primary/20 rounded-xl px-5 py-4 flex items-start gap-3">
        <Info
          size={17}
          className="text-primary flex-shrink-0 mt-0.5"
        />
        <div>
          <p className="text-sm font-semibold text-primary">
            Configure Each Room Type
          </p>
          <p className="text-sm text-muted-foreground mt-0.5">
            Add each room or room type you offer. Your property
            has {floors} floor{floors !== 1 ? "s" : ""}{" "}
            configured. You can assign rooms to specific floors
            using the dropdown in each room card.
          </p>
        </div>
      </div>

      {rooms.map((room, i) => (
        <RoomCard
          key={room.id}
          room={room}
          index={i}
          floors={floors}
          onChange={(updates) => onChange(room.id, updates)}
          onRemove={() => onRemove(room.id)}
        />
      ))}

      <button
        type="button"
        onClick={onAdd}
        className="w-full py-4 rounded-2xl border-2 border-dashed border-primary/40 text-primary font-semibold text-sm hover:bg-primary/5 hover:border-primary transition-all flex items-center justify-center gap-2 group"
      >
        <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
          <Plus size={16} />
        </div>
        Add Another Room
      </button>
    </div>
  );
}