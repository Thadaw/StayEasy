import { Globe } from "lucide-react";
import { Logo } from "./Logo";

const footerLinks = {
  Support:  ["Help Center", "AirCover", "Safety information", "Supporting people with disabilities", "Cancellation options"],
  Hosting:  ["Try hosting", "AirCover for Hosts", "Explore hosting resources", "Visit our community forum", "Responsible hosting"],
  StayEasy: ["Newsroom", "Features", "Careers", "Investors", "Pricing & Plans"],
  Legal:    ["Privacy Policy", "Terms of Service", "Cookie Policy", "Sitemap", "Company details"],
};

export function Footer() {
  return (
    <footer className="border-t border-border mt-16" style={{ backgroundColor: "var(--secondary)" }}>
      <div className="max-w-[1280px] mx-auto px-6 py-12">
        <div className="mb-8"><Logo size={32} /></div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          {Object.entries(footerLinks).map(([section, links]) => (
            <div key={section}>
              <h4 className="text-sm font-semibold mb-4" style={{ color: "var(--brand-dark)" }}>{section}</h4>
              <ul className="flex flex-col gap-2.5">
                {links.map(link => (
                  <li key={link}>
                    <a href="#" className="text-sm transition-colors hover:underline" style={{ color: "var(--muted-foreground)" }}
                      onMouseEnter={e => (e.currentTarget.style.color = "var(--primary)")}
                      onMouseLeave={e => (e.currentTarget.style.color = "var(--muted-foreground)")}>
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-border pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
            <span className="text-sm" style={{ color: "var(--muted-foreground)" }}>© 2026 StayEasy, Inc. All rights reserved.</span>
          </div>
          <div className="flex items-center gap-4">
            <button className="flex items-center gap-2 text-sm font-medium transition-colors hover:underline" style={{ color: "var(--foreground)" }}>
              <Globe size={16} style={{ color: "var(--primary)" }} /> English (US)
            </button>
            <button className="text-sm font-medium transition-colors hover:underline" style={{ color: "var(--foreground)" }}>
              $ USD
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer
