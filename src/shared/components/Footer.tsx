import { Globe } from "lucide-react";
import { Link } from "react-router-dom";


const footerLinks = {
  Support: ["Help Center", "Contact Us", "Booking Help", "Cancellation & Refund", "Payment & Security", "Safety Information", "Accessibility"],
  Explore: ["Browse Properties", "Popular Destinations", "Hotels & Stays", "Offers & Deals", "Nearby Stays"],
  Hosting: ["List Your Property", "Host Dashboard", "Hosting Guide", "Host Resources", "Host Safety", "Host Support"],
  ServeIQ: ["About ServeIQ", "Features", "Careers", "Pricing & Plans", "Contact Us"],
  Legal: ["Privacy Policy", "Terms of Service", "Cancellation Policy", "Refund Policy", "Cookie Policy", "Sitemap"],
};

export function Footer() {
  return (
    <footer className="border-t border-border mt-16 bg-secondary">
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 py-12">
        <div className="mb-8">
          <Link to="/" className="shrink-0 flex items-center gap-2">
            <img src="/logo1.png" alt="ServeIQ" className="h-[34px] w-auto" />
            <span className="font-brand font-extrabold text-xl tracking-tight leading-none text-brand-primary">
              Serve<span className="text-brand-accent">IQ</span>
            </span>
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
          {Object.entries(footerLinks).map(([section, links]) => (
            <div key={section}>
              <h4 className="text-sm font-semibold mb-4 text-brand-dark">{section}</h4>
              <ul className="flex flex-col gap-2.5">
                {links.map(link => (
                  <li key={link}>
                    <a href="#" className="text-sm text-muted-foreground transition-colors hover:underline hover:text-primary">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-border pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <span className="text-sm text-muted-foreground">© 2026 ServeIQ. All rights reserved.</span>
          <div className="flex items-center gap-4">
            <button className="flex items-center gap-2 text-sm font-medium text-foreground transition-colors hover:underline">
              <Globe size={16} className="text-primary" /> English (US)
            </button>
            <button className="text-sm font-medium text-foreground transition-colors hover:underline">
              $ USD
            </button>
            <button className="text-sm font-medium text-foreground transition-colors hover:underline">
              Nepal
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
