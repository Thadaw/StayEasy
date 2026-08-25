import { Globe } from "lucide-react";
import { Link } from "react-router-dom";
import logo1 from "../../assets/logo1.png";

const footerLinks: { section: string; links: { text: string; to: string }[] }[] = [
  {
    section: "Support",
    links: [
      { text: "Help Center", to: "/help-center" },
      { text: "Contact Us", to: "/contact" },
      { text: "Booking Help", to: "/booking-help" },
      { text: "Cancellation & Refund", to: "/cancellation-refund" },
      { text: "Payment & Security", to: "/payment-security" },
      { text: "Safety Information", to: "/safety" },
      { text: "Accessibility", to: "/accessibility" },
    ],
  },
  {
    section: "Explore",
    links: [
      { text: "Browse Properties", to: "/search" },
      { text: "Popular Destinations", to: "/destinations" },
      { text: "Hotels & Stays", to: "/hotels-stays" },
      { text: "Offers & Deals", to: "/offers" },
      { text: "Nearby Stays", to: "/nearby-stays" },
    ],
  },
  {
    section: "Hosting",
    links: [
      { text: "List Your Property", to: "/host/tenant-setup" },
      { text: "Host Dashboard", to: "/host/portal" },
      { text: "Hosting Guide", to: "/hosting-guide" },
      { text: "Host Resources", to: "/host-resources" },
      { text: "Host Safety", to: "/host-safety" },
      { text: "Host Support", to: "/host/support" },
    ],
  },
  {
    section: "ServeIQ",
    links: [
      { text: "About ServeIQ", to: "/about" },
      { text: "Features", to: "/features" },
      { text: "Careers", to: "/careers" },
      { text: "Pricing & Plans", to: "/host/pricing" },
      { text: "Contact Us", to: "/contact" },
    ],
  },
  {
    section: "Legal",
    links: [
      { text: "Privacy Policy", to: "/privacy" },
      { text: "Terms of Service", to: "/terms" },
      { text: "Cancellation Policy", to: "/cancellation-policy" },
      { text: "Refund Policy", to: "/refund-policy" },
      { text: "Cookie Policy", to: "/cookie-policy" },
      { text: "Sitemap", to: "/sitemap" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="border-t border-border mt-16 bg-secondary">
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 py-12">
        <div className="mb-8">
          <Link to="/" className="shrink-0 flex items-center gap-2">
            <img src={logo1} alt="ServeIQ" className="h-[34px] w-auto" />
            <span className="font-brand font-extrabold text-xl tracking-tight leading-none text-brand-primary">
              Serve<span className="text-brand-accent">IQ</span>
            </span>
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
          {footerLinks.map(({ section, links }) => (
            <div key={section}>
              <h4 className="text-sm font-semibold mb-4 text-brand-dark">{section}</h4>
              <ul className="flex flex-col gap-2.5">
                {links.map(link => (
                  <li key={link.text}>
                    <Link
                      to={link.to}
                      className="text-sm text-muted-foreground transition-colors hover:underline hover:text-primary"
                    >
                      {link.text}
                    </Link>
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
