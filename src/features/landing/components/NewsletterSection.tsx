import { useState } from "react";

export function NewsletterSection() {
  const [email, setEmail] = useState("");

  return (
    <section className="py-12 md:py-16 bg-gradient-to-r from-brand-accent to-brand-accent-hover">
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="text-center md:text-left">
            <h2 className="text-2xl md:text-3xl font-bold mb-2 text-brand-text-white">
              Ready for your next adventure?
            </h2>
            <p className="text-sm text-white/80">
              Sign up now and receive exclusive deals straight to your inbox.
            </p>
          </div>
          <div className="w-full md:w-auto">
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="px-4 py-3 rounded-xl text-sm w-full sm:w-72 outline-none bg-brand-surface text-brand-heading"
              />
              <button
                className="px-6 py-3 rounded-xl text-sm font-semibold transition-colors whitespace-nowrap bg-brand-surface text-brand-primary"
              >
                Get started →
              </button>
            </div>
            <p className="text-xs mt-2 text-white/60">
              <input type="checkbox" className="mr-1.5" />
              I agree to receive email updates. Unsubscribe anytime.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
