import { useState } from "react";
import { MapPin, Loader2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useNearbyProperties } from "../../search/hooks/useNearbyProperties";
import { useLocation } from "../../../context/LocationContext";
import { PropertyCard } from "./PropertyCard";
import { PropertySection } from "./PropertySection";

export function NearbySection() {
  const { t } = useTranslation();
  const { status } = useLocation();
  const { properties, isLoading, isError } = useNearbyProperties(10);

  const isGranted = status === "granted";

  // Nothing to show and nothing to offer. Previously this hid the section even
  // when a visitor had granted location but simply had no properties within
  // range, which is the normal case outside Nepal — they saw nothing at all.
  if (!isGranted && !isLoading) return null;

  return (
    <PropertySection
      title={t("staysNearby")}
      loading={isLoading}
      isEmpty={!isLoading && properties.length === 0}
      emptyMessage={isError ? t("nearbyError") : t("nearbyEmpty")}
    >
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-x-5 gap-y-8">
        {properties.map((property) => (
          <PropertyCard key={property.property_id} property={property} showDistance />
        ))}
      </div>
    </PropertySection>
  );
}

/**
 * Recovery affordance for when location isn't available: a transient failure
 * worth retrying, a real refusal, or an unsupported browser. Deliberately not a
 * modal — `HeroSection` already asks once, and this is the manual opt-in that
 * stays reachable without nagging.
 */
export function NearbyLocationBanner() {
  const { t } = useTranslation();
  const { status, isRequesting, requestLocation } = useLocation();
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;
  if (status === "granted" || status === "idle" || status === "prompting") return null;

  const isDenied = status === "denied";
  const isUnavailable = status === "unavailable";

  const title = isUnavailable ? t("nearbyUnavailableTitle") : t("nearbyEnableTitle");
  const body = isUnavailable
    ? t("nearbyUnavailableBody")
    : isDenied
      ? t("nearbyDeniedBody")
      : t("nearbyFailedBody");

  return (
    <section className="max-w-screen-2xl mx-auto px-4 sm:px-6 py-6 md:py-8">
      <div className="bg-brand-accent-light border border-brand-accent/20 rounded-2xl p-6 flex items-start gap-4">
        <div className="w-10 h-10 rounded-full bg-brand-accent/10 flex items-center justify-center shrink-0">
          {isRequesting ? (
            <Loader2 size={20} className="text-brand-accent animate-spin" />
          ) : (
            <MapPin size={20} className="text-brand-accent" />
          )}
        </div>
        <div className="flex-1">
          <h3 className="text-sm font-semibold text-brand-heading mb-1">{title}</h3>
          <p className="text-xs text-brand-text-secondary mb-3">{body}</p>
          <div className="flex items-center gap-3">
            {!isUnavailable && (
              <button
                onClick={requestLocation}
                disabled={isRequesting}
                className="px-4 py-1.5 text-xs font-semibold rounded-lg bg-brand-accent text-white hover:bg-brand-accent-hover transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isRequesting ? t("locating") : t("allowLocation")}
              </button>
            )}
            <button
              onClick={() => setDismissed(true)}
              className="px-4 py-1.5 text-xs font-semibold rounded-lg border border-brand-card-border text-brand-text-secondary hover:bg-brand-secondary-surface transition-colors"
            >
              {t("notNow")}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
