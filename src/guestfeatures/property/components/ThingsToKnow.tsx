import { CalendarX2, Search, ShieldCheck } from "lucide-react";

export function ThingsToKnow() {
  return (
    <section className="mt-16 border-t border-border pt-10 -mx-4 sm:-mx-6 px-4 sm:px-6">
      <h2 className="font-semibold text-foreground mb-8" style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.5rem" }}>
        Things to know
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-10 items-stretch">
        <div className="flex flex-col">
          <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center mb-4">
            <CalendarX2 size={20} className="text-foreground" />
          </div>
          <h3 className="text-sm font-bold text-foreground mb-2">Cancellation policy</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Free cancellation before July 23. Cancel before check-in on July 24 for a partial refund.
            Review this host's full policy for details.
          </p>
          <button className="mt-auto pt-3 text-sm font-semibold text-foreground underline underline-offset-2 hover:text-primary transition-colors self-start">
            Learn more
          </button>
        </div>
        <div className="flex flex-col">
          <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center mb-4">
            <Search size={20} className="text-foreground" />
          </div>
          <h3 className="text-sm font-bold text-foreground mb-2">House rules</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Check-in after 1:00 PM<br />
            Checkout before 11:00 AM<br />
            2 guests maximum
          </p>
          <button className="mt-auto pt-3 text-sm font-semibold text-foreground underline underline-offset-2 hover:text-primary transition-colors self-start">
            Learn more
          </button>
        </div>
        <div className="flex flex-col">
          <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center mb-4">
            <ShieldCheck size={20} className="text-foreground" />
          </div>
          <h3 className="text-sm font-bold text-foreground mb-2">Safety & property</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Carbon monoxide alarm not reported<br />
            Exterior security cameras on property<br />
            Smoke alarm
          </p>
          <button className="mt-auto pt-3 text-sm font-semibold text-foreground underline underline-offset-2 hover:text-primary transition-colors self-start">
            Learn more
          </button>
        </div>
      </div>
    </section>
  );
}
