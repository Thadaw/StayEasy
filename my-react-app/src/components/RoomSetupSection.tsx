import React from "react";
import { Trash2, Plus, PawPrint } from "lucide-react";

interface Room {
  id: string;
  name: string;
  type: string;
  beds: number;
  bathrooms: number;
  maxGuests: number;
  pricePerNight: number;
  petsAllowed: boolean;
  smokingAllowed: boolean;
  amenities: string[];
  description: string;
}

interface AmenityOption {
  id: string;
  label: string;
}

interface RoomSetupSectionProps {
  rooms: Room[];
  amenityOptions: AmenityOption[];
  onAddRoom: () => void;
  onUpdateRoom: (
    id: string,
    field: keyof Room,
    value: string | number | boolean | string[],
  ) => void;
  onRemoveRoom: (id: string) => void;
  onToggleRoomAmenity: (
    roomId: string,
    amenityId: string,
  ) => void;
}

export function RoomSetupSection({
  rooms,
  amenityOptions,
  onAddRoom,
  onUpdateRoom,
  onRemoveRoom,
  onToggleRoomAmenity,
}: RoomSetupSectionProps) {
  return (
    <div className="flex flex-col gap-4">
      {rooms.map((room, idx) => (
        <div
          key={room.id}
          className="bg-white rounded-2xl border border-border p-5"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-foreground">
              Room {idx + 1}
            </h3>
            {rooms.length > 1 && (
              <button
                type="button"
                onClick={() => onRemoveRoom(room.id)}
                className="text-red-500 hover:text-red-700 transition-colors"
              >
                <Trash2 size={15} />
              </button>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-muted-foreground">
                Room name
              </label>
              <input
                type="text"
                value={room.name}
                onChange={(e) =>
                  onUpdateRoom(room.id, "name", e.target.value)
                }
                className="px-3 py-2.5 rounded-xl border border-border bg-input-background text-sm outline-none"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-muted-foreground">
                Room type
              </label>
              <select
                value={room.type}
                onChange={(e) =>
                  onUpdateRoom(room.id, "type", e.target.value)
                }
                className="px-3 py-2.5 rounded-xl border border-border bg-input-background text-sm outline-none"
              >
                {[
                  "Standard",
                  "Deluxe",
                  "Suite",
                  "Junior Suite",
                  "Executive",
                  "Penthouse",
                  "Studio",
                  "Family Room",
                  "Connecting Room",
                ].map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-muted-foreground">
                Beds
              </label>
              <input
                type="number"
                min={1}
                max={10}
                value={room.beds}
                onChange={(e) =>
                  onUpdateRoom(
                    room.id,
                    "beds",
                    Number(e.target.value),
                  )
                }
                className="px-3 py-2.5 rounded-xl border border-border bg-input-background text-sm outline-none"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-muted-foreground">
                Bathrooms
              </label>
              <input
                type="number"
                min={1}
                max={5}
                value={room.bathrooms}
                onChange={(e) =>
                  onUpdateRoom(
                    room.id,
                    "bathrooms",
                    Number(e.target.value),
                  )
                }
                className="px-3 py-2.5 rounded-xl border border-border bg-input-background text-sm outline-none"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-muted-foreground">
                Max guests
              </label>
              <input
                type="number"
                min={1}
                max={20}
                value={room.maxGuests}
                onChange={(e) =>
                  onUpdateRoom(
                    room.id,
                    "maxGuests",
                    Number(e.target.value),
                  )
                }
                className="px-3 py-2.5 rounded-xl border border-border bg-input-background text-sm outline-none"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-muted-foreground">
                Price / night (USD)
              </label>
              <input
                type="number"
                min={1}
                value={room.pricePerNight}
                onChange={(e) =>
                  onUpdateRoom(
                    room.id,
                    "pricePerNight",
                    Number(e.target.value),
                  )
                }
                className="px-3 py-2.5 rounded-xl border border-border bg-input-background text-sm outline-none"
              />
            </div>
          </div>

          {/* Policies */}
          <div className="flex flex-wrap gap-3 mb-4">
            <button
              type="button"
              onClick={() =>
                onUpdateRoom(
                  room.id,
                  "petsAllowed",
                  !room.petsAllowed,
                )
              }
              className="flex items-center gap-2 cursor-pointer bg-transparent border-0 outline-none"
            >
              <div
                className={`w-11 h-6 rounded-full transition-all relative ${
                  room.petsAllowed ? "bg-primary" : "bg-muted"
                }`}
              >
                <div
                  className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all ${
                    room.petsAllowed ? "left-5" : "left-0.5"
                  }`}
                />
              </div>
              <span className="text-sm text-foreground flex items-center gap-1.5">
                <PawPrint
                  size={14}
                  className="text-muted-foreground"
                />{" "}
                Pets allowed
              </span>
            </button>

            <button
              type="button"
              onClick={() =>
                onUpdateRoom(
                  room.id,
                  "smokingAllowed",
                  !room.smokingAllowed,
                )
              }
              className="flex items-center gap-2 cursor-pointer bg-transparent border-0 outline-none"
            >
              <div
                className={`w-11 h-6 rounded-full transition-all relative ${
                  room.smokingAllowed
                    ? "bg-primary"
                    : "bg-muted"
                }`}
              >
                <div
                  className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all ${
                    room.smokingAllowed ? "left-5" : "left-0.5"
                  }`}
                />
              </div>
              <span className="text-sm text-foreground">
                🚬 Smoking allowed
              </span>
            </button>
          </div>

          {/* Room amenities */}
          <div>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
              Room amenities
            </p>
            <div className="flex flex-wrap gap-2">
              {amenityOptions.map(({ id, label }) => {
                const on = room.amenities.includes(id);
                return (
                  <button
                    key={id}
                    type="button"
                    onClick={() =>
                      onToggleRoomAmenity(room.id, id)
                    }
                    className="text-xs px-3 py-1.5 rounded-full border transition-all"
                    style={{
                      borderColor: on
                        ? "var(--primary)"
                        : "var(--border)",
                      backgroundColor: on
                        ? "#fff1f2"
                        : "transparent",
                      color: on
                        ? "var(--primary)"
                        : "var(--muted-foreground)",
                      fontWeight: on ? 600 : 400,
                    }}
                  >
                    {on && "✓ "}
                    {label}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="mt-4">
            <label className="text-xs font-medium text-muted-foreground">
              Room description (optional)
            </label>
            <textarea
              value={room.description}
              onChange={(e) =>
                onUpdateRoom(
                  room.id,
                  "description",
                  e.target.value,
                )
              }
              rows={2}
              placeholder="Describe this room..."
              className="mt-1.5 w-full px-3 py-2.5 rounded-xl border border-border bg-input-background text-sm outline-none resize-none placeholder:text-muted-foreground"
            />
          </div>
        </div>
      ))}

      <button
        type="button"
        onClick={onAddRoom}
        className="flex items-center justify-center gap-2 w-full py-3.5 border-2 border-dashed border-border rounded-2xl text-sm font-medium text-muted-foreground hover:border-primary hover:text-primary transition-all"
      >
        <Plus size={16} /> Add another room
      </button>
    </div>
  );
}