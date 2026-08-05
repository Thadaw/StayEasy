import { ShieldCheck } from "lucide-react";
import { Hotel } from "../../../data/hotels";

interface HostInfoProps {
  hotel: Hotel;
}

export function HostInfo({ hotel }: HostInfoProps) {
  return (
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
  );
}
