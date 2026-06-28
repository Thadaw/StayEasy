import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router";
import { useAuth } from "../context/AuthContext";
import { Logo } from "../components/Logo";
import {
  Eye,
  EyeOff,
  ArrowLeft,
  Wifi,
  Car,
  Dumbbell,
  Waves,
  UtensilsCrossed,
  Wind,
  Tv,
  Coffee,
  Check,
  ChevronRight,
  ChevronLeft,
} from "lucide-react";
import { PhoneInput } from "../components/PhoneInput";
import { CountrySelect } from "../components/CountrySelect";
import {
  Room,
  RoomsPage,
  createRoom
} from "../components/RoomSetup";

type Step =
  | "auth"
  | "property"
  | "rooms"
  | "facilities"
  | "done";

const amenityOptions = [
  { id: "wifi", icon: Wifi, label: "Free WiFi" },
  { id: "parking", icon: Car, label: "Free Parking" },
  { id: "gym", icon: Dumbbell, label: "Gym" },
  { id: "pool", icon: Waves, label: "Swimming Pool" },
  {
    id: "kitchen",
    icon: UtensilsCrossed,
    label: "Full Kitchen",
  },
  { id: "ac", icon: Wind, label: "Air Conditioning" },
  { id: "tv", icon: Tv, label: "Smart TV" },
  {
    id: "breakfast",
    icon: Coffee,
    label: "Breakfast Included",
  },
];

const propertyTypes = [
  { id: "hotel", icon: "🏨", label: "Hotel" },
  { id: "villa", icon: "🏡", label: "Villa" },
  { id: "apartment", icon: "🏢", label: "Apartment" },
  { id: "resort", icon: "🌴", label: "Resort" },
  { id: "cottage", icon: "🛖", label: "Cottage" },
  { id: "hostel", icon: "🛏️", label: "Hostel" },
  { id: "guesthouse", icon: "🏠", label: "Guest House" },
  { id: "boutique", icon: "✨", label: "Boutique Hotel" },
];

export default function HostPortalPage() {
  const navigate = useNavigate();
  const { credentialLogin, signup: authSignup, user } = useAuth();
  const [step, setStep] = useState<Step>(user ? "property" : "auth");
  const [isLogin, setIsLogin] = useState(false);
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user && step === "auth") setStep("property");
  }, [user]);

  // Auth — sign up fields
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [dialCode, setDialCode] = useState("+1");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);

  // Auth — login fields
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginPhone, setLoginPhone] = useState("");
  const [loginDialCode, setLoginDialCode] = useState("+1");

  // Property
  const [propertyType, setPropertyType] = useState("");
  const [propertyName, setPropertyName] = useState("");
  const [propertyAddress, setPropertyAddress] = useState("");
  const [propertyCity, setPropertyCity] = useState("");
  const [propertyCountry, setPropertyCountry] = useState("");
  const [propertyDesc, setPropertyDesc] = useState("");
  const [selectedAmenities, setSelectedAmenities] = useState<
    string[]
  >([]);

  // Rooms State
  const [rooms, setRooms] = useState<Room[]>([createRoom()]);

  async function handleAuth(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (isLogin) {
      if (!loginEmail || !loginPassword) {
        setError("Please enter your email and password.");
        return;
      }
      setLoading(true);
      const ok = await credentialLogin(loginEmail, loginPassword);
      setLoading(false);
      if (ok) setStep("property");
      else setError("Incorrect email or password.");
    } else {
      if (!firstName.trim()) {
        setError("First name is required.");
        return;
      }
      if (!lastName.trim()) {
        setError("Last name is required.");
        return;
      }
      if (!email) {
        setError("Email is required.");
        return;
      }
      if (!phone.trim()) {
        setError("Phone number is required.");
        return;
      }
      if (password.length < 6) {
        setError("Password must be at least 6 characters.");
        return;
      }
      if (password !== confirmPw) {
        setError("Passwords do not match.");
        return;
      }
      setLoading(true);
      const fullName = `${firstName.trim()} ${lastName.trim()}`;
      const ok = await authSignup(fullName, email, password);
      setLoading(false);
      if (ok) {
        navigate('/host/login');
        return;
      }
      setError("Could not create account. Please try again.");
    }
  }

  function addRoom() {
    setRooms((prev) => [...prev, createRoom()]);
  }

  function updateRoom(id: string, updates: Partial<Room>) {
    setRooms((prev) =>
      prev.map((r) => (r.id === id ? { ...r, ...updates } : r)),
    );
  }

  function removeRoom(id: string) {
    setRooms((prev) => prev.filter((r) => r.id !== id));
  }

  const steps: { id: Step; label: string }[] = [
    { id: "auth", label: "Account" },
    { id: "property", label: "Property" },
    { id: "rooms", label: "Rooms" },
    { id: "facilities", label: "Facilities" },
    { id: "done", label: "Done" },
  ];
  const stepIdx = steps.findIndex((s) => s.id === step);

  return (
    <div
      className="min-h-screen bg-[#fafaf8] flex flex-col"
      style={{ fontFamily: "'Inter', sans-serif" }}
    >
      {/* Top bar */}
      <header className="bg-white border-b border-border px-6 py-4 flex items-center justify-between sticky top-0 z-30">
        <Link to="/">
          <Logo size={32} />
        </Link>
        {step !== "done" && (
          <div className="hidden sm:flex items-center gap-2">
            {steps.map((s, i) => (
              <div
                key={s.id}
                className="flex items-center gap-2"
              >
                <div className="flex items-center gap-1.5">
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-all ${i < stepIdx ? "bg-green-500 text-white" : i === stepIdx ? "bg-primary text-white" : "bg-muted text-muted-foreground"}`}
                  >
                    {i < stepIdx ? <Check size={12} /> : i + 1}
                  </div>
                  <span
                    className={`text-xs font-medium hidden md:inline ${i === stepIdx ? "text-foreground" : "text-muted-foreground"}`}
                  >
                    {s.label}
                  </span>
                </div>
                {i < steps.length - 1 && (
                  <div className="w-6 h-px bg-border" />
                )}
              </div>
            ))}
          </div>
        )}
        <Link
          to="/"
          className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1"
        >
          <ArrowLeft size={14} /> Exit
        </Link>
      </header>

      <div className="flex-1 max-w-2xl mx-auto w-full px-6 py-10">
        {/* ── STEP 1: Auth ── */}
        {step === "auth" && (
          <div>
            <div className="text-center mb-8">
              <div className="text-5xl mb-4">🏨</div>
              <h1
                style={{
                  fontFamily: "'Sora', 'Inter', sans-serif",
                  fontWeight: 700,
                  fontSize: "1.875rem",
                  color: "var(--brand-dark)"
                }}
              >
                {isLogin
                  ? "Welcome back, Host"
                  : "Become a Host"}
              </h1>
              <p className="text-muted-foreground text-sm mt-2">
                {isLogin
                  ? "Sign in to manage your properties"
                  : "List your property and start earning today"}
              </p>
            </div>

            <div className="bg-white rounded-2xl border border-border p-6">
              <div
                className="flex rounded-xl p-1 mb-6 gap-1"
                style={{ backgroundColor: "var(--secondary)" }}
              >
                {(
                  [
                    { v: true, l: "Login" },
                    { v: false, l: "Sign Up" },
                  ] as { v: boolean; l: string }[]
                ).map(({ v, l }) => (
                  <button
                    key={String(v)}
                    onClick={() => {
                      setIsLogin(v);
                      setError("");
                    }}
                    className="flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all"
                    style={{
                      backgroundColor:
                        isLogin === v ? "white" : "transparent",
                      color:
                        isLogin === v
                          ? "var(--brand-dark)"
                          : "var(--muted-foreground)",
                      boxShadow:
                        isLogin === v
                          ? "0 1px 4px rgba(0,0,0,0.1)"
                          : "none",
                    }}
                  >
                    {l}
                  </button>
                ))}
              </div>

              <form
                onSubmit={handleAuth}
                className="flex flex-col gap-4"
              >
                {isLogin && (
                  <>
                    <div className="flex flex-col gap-1.5">
                      <label
                        className="text-sm font-semibold"
                        style={{ color: "var(--foreground)" }}
                      >
                        Email address
                      </label>
                      <input
                        type="email"
                        value={loginEmail}
                        onChange={(e) =>
                          setLoginEmail(e.target.value)
                        }
                        placeholder="host@example.com"
                        autoComplete="email"
                        className="w-full px-4 py-3 rounded-xl border border-border bg-input-background text-sm outline-none transition-all placeholder:text-muted-foreground"
                      />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label
                        className="text-sm font-semibold"
                        style={{ color: "var(--foreground)" }}
                      >
                        Phone number
                      </label>
                      <PhoneInput
                        value={loginPhone}
                        onChange={setLoginPhone}
                        dialCode={loginDialCode}
                        onDialCodeChange={(dc) =>
                          setLoginDialCode(dc)
                        }
                        placeholder="000 000 0000"
                      />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <div className="flex items-center justify-between">
                        <label
                          className="text-sm font-semibold"
                          style={{ color: "var(--foreground)" }}
                        >
                          Password
                        </label>
                        <a
                          href="#"
                          className="text-xs font-medium hover:underline"
                          style={{ color: "var(--primary)" }}
                        >
                          Forgot password?
                        </a>
                      </div>
                      <div className="relative">
                        <input
                          type={showPw ? "text" : "password"}
                          value={loginPassword}
                          onChange={(e) =>
                            setLoginPassword(e.target.value)
                          }
                          placeholder="••••••••"
                          autoComplete="current-password"
                          className="w-full px-4 py-3 pr-11 rounded-xl border border-border bg-input-background text-sm outline-none transition-all placeholder:text-muted-foreground"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPw((v) => !v)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                        >
                          {showPw ? (
                            <EyeOff size={16} />
                          ) : (
                            <Eye size={16} />
                          )}
                        </button>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        setLoginEmail("host@example.com");
                        setLoginPassword("host123");
                        setLoginPhone("+1 555 000 0000");
                      }}
                      className="text-xs text-left hover:underline"
                      style={{
                        color: "var(--muted-foreground)",
                      }}
                    >
                      Use demo: host@example.com / host123
                    </button>
                  </>
                )}

                {!isLogin && (
                  <>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="flex flex-col gap-1.5">
                        <label
                          className="text-sm font-semibold"
                          style={{ color: "var(--foreground)" }}
                        >
                          First Name{" "}
                          <span
                            style={{ color: "var(--primary)" }}
                          >
                            *
                          </span>
                        </label>
                        <input
                          type="text"
                          value={firstName}
                          onChange={(e) =>
                            setFirstName(e.target.value)
                          }
                          placeholder="e.g. Sarah"
                          autoComplete="given-name"
                          className="w-full px-4 py-3 rounded-xl border border-border bg-input-background text-sm outline-none transition-all placeholder:text-muted-foreground"
                        />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label
                          className="text-sm font-semibold"
                          style={{ color: "var(--foreground)" }}
                        >
                          Last Name{" "}
                          <span
                            style={{ color: "var(--primary)" }}
                          >
                            *
                          </span>
                        </label>
                        <input
                          type="text"
                          value={lastName}
                          onChange={(e) =>
                            setLastName(e.target.value)
                          }
                          placeholder="e.g. Johnson"
                          autoComplete="family-name"
                          className="w-full px-4 py-3 rounded-xl border border-border bg-input-background text-sm outline-none transition-all placeholder:text-muted-foreground"
                        />
                      </div>
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label
                        className="text-sm font-semibold"
                        style={{ color: "var(--foreground)" }}
                      >
                        Email address{" "}
                        <span
                          style={{ color: "var(--primary)" }}
                        >
                          *
                        </span>
                      </label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) =>
                          setEmail(e.target.value)
                        }
                        placeholder="host@example.com"
                        autoComplete="email"
                        className="w-full px-4 py-3 rounded-xl border border-border bg-input-background text-sm outline-none transition-all placeholder:text-muted-foreground"
                      />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label
                        className="text-sm font-semibold"
                        style={{ color: "var(--foreground)" }}
                      >
                        Phone number{" "}
                        <span
                          style={{ color: "var(--primary)" }}
                        >
                          *
                        </span>
                      </label>
                      <PhoneInput
                        value={phone}
                        onChange={setPhone}
                        dialCode={dialCode}
                        onDialCodeChange={(dc) =>
                          setDialCode(dc)
                        }
                        placeholder="000 000 0000"
                        required
                      />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label
                        className="text-sm font-semibold"
                        style={{ color: "var(--foreground)" }}
                      >
                        Password{" "}
                        <span
                          style={{ color: "var(--primary)" }}
                        >
                          *
                        </span>
                      </label>
                      <div className="relative">
                        <input
                          type={showPw ? "text" : "password"}
                          value={password}
                          onChange={(e) =>
                            setPassword(e.target.value)
                          }
                          placeholder="At least 6 characters"
                          autoComplete="new-password"
                          className="w-full px-4 py-3 pr-11 rounded-xl border border-border bg-input-background text-sm outline-none transition-all placeholder:text-muted-foreground"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPw((v) => !v)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                        >
                          {showPw ? (
                            <EyeOff size={16} />
                          ) : (
                            <Eye size={16} />
                          )}
                        </button>
                      </div>
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label
                        className="text-sm font-semibold"
                        style={{ color: "var(--foreground)" }}
                      >
                        Confirm password{" "}
                        <span
                          style={{ color: "var(--primary)" }}
                        >
                          *
                        </span>
                      </label>
                      <div className="relative">
                        <input
                          type={
                            showConfirm ? "text" : "password"
                          }
                          value={confirmPw}
                          onChange={(e) =>
                            setConfirmPw(e.target.value)
                          }
                          placeholder="Repeat your password"
                          autoComplete="new-password"
                          className="w-full px-4 py-3 pr-11 rounded-xl border text-sm outline-none transition-all placeholder:text-muted-foreground"
                          style={{
                            borderColor:
                              confirmPw &&
                              confirmPw !== password
                                ? "#C0392B"
                                : "var(--border)",
                            backgroundColor:
                              "var(--input-background)",
                          }}
                        />
                        <button
                          type="button"
                          onClick={() =>
                            setShowConfirm((v) => !v)
                          }
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                        >
                          {showConfirm ? (
                            <EyeOff size={16} />
                          ) : (
                            <Eye size={16} />
                          )}
                        </button>
                      </div>
                    </div>
                  </>
                )}

                {error && (
                  <div
                    className="text-sm px-4 py-3 rounded-xl"
                    style={{
                      color: "#C0392B",
                      backgroundColor: "#FDEDEC",
                      border: "1px solid #E74C3C44",
                    }}
                  >
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 rounded-xl text-white text-sm font-semibold hover:opacity-90 transition-all disabled:opacity-60"
                  style={{ backgroundColor: "var(--primary)" }}
                >
                  {loading
                    ? "Please wait…"
                    : isLogin
                      ? "Login as Host"
                      : "Sign Up"}
                </button>
              </form>
            </div>
          </div>
        )}

        {/* ── STEP 2: Property ── */}
        {step === "property" && (
          <div>
            <h1
              style={{
                fontFamily: "'Playfair Display', serif",
                fontWeight: 700,
                fontSize: "1.75rem",
                color: "var(--foreground)",
                marginBottom: "0.25rem",
              }}
            >
              Tell us about your property
            </h1>
            <p className="text-muted-foreground text-sm mb-8">
              Share the details that will attract the right
              guests
            </p>

            <div className="bg-white rounded-2xl border border-border p-6 flex flex-col gap-5">
              <div>
                <label className="text-sm font-semibold text-foreground mb-3 block">
                  Property type
                </label>
                <div className="grid grid-cols-4 gap-3">
                  {propertyTypes.map((pt) => (
                    <button
                      key={pt.id}
                      onClick={() => setPropertyType(pt.id)}
                      className="flex flex-col items-center gap-2 p-3 rounded-xl border-2 transition-all hover:border-primary/40"
                      style={{
                        borderColor:
                          propertyType === pt.id
                            ? "var(--primary)"
                            : "var(--border)",
                        backgroundColor:
                          propertyType === pt.id
                            ? "#fff1f2"
                            : "transparent",
                      }}
                    >
                      <span className="text-2xl">
                        {pt.icon}
                      </span>
                      <span className="text-xs font-medium text-foreground">
                        {pt.label}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-foreground">
                    Property name
                  </label>
                  <input
                    value={propertyName}
                    onChange={(e) =>
                      setPropertyName(e.target.value)
                    }
                    placeholder="e.g. Sunset Beach Resort"
                    className="px-4 py-3 rounded-xl border border-border bg-input-background text-sm outline-none placeholder:text-muted-foreground"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-foreground">
                    Address
                  </label>
                  <input
                    value={propertyAddress}
                    onChange={(e) =>
                      setPropertyAddress(e.target.value)
                    }
                    placeholder="Street address"
                    className="px-4 py-3 rounded-xl border border-border bg-input-background text-sm outline-none placeholder:text-muted-foreground"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-foreground">
                    City
                  </label>
                  <input
                    value={propertyCity}
                    onChange={(e) =>
                      setPropertyCity(e.target.value)
                    }
                    placeholder="e.g. Kathmandu"
                    className="px-4 py-3 rounded-xl border border-border bg-input-background text-sm outline-none placeholder:text-muted-foreground"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-foreground">
                    Country
                  </label>
                  <CountrySelect
                    value={propertyCountry}
                    onChange={setPropertyCountry}
                    placeholder="e.g. Nepal"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-foreground">
                  Description
                </label>
                <textarea
                  value={propertyDesc}
                  onChange={(e) =>
                    setPropertyDesc(e.target.value)
                  }
                  rows={4}
                  placeholder="Describe your property — its style, setting, what makes it special..."
                  className="px-4 py-3 rounded-xl border border-border bg-input-background text-sm outline-none resize-none placeholder:text-muted-foreground"
                />
              </div>

              <div>
                <label className="text-sm font-semibold text-foreground mb-3 block">
                  Property-wide amenities
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {amenityOptions.map(
                    ({ id, icon: Icon, label }) => {
                      const on = selectedAmenities.includes(id);
                      return (
                        <button
                          key={id}
                          onClick={() =>
                            setSelectedAmenities((prev) =>
                              on
                                ? prev.filter((a) => a !== id)
                                : [...prev, id],
                            )
                          }
                          className="flex items-center gap-2 px-3 py-2.5 rounded-xl border-2 text-sm transition-all"
                          style={{
                            borderColor: on
                              ? "var(--primary)"
                              : "var(--border)",
                            backgroundColor: on
                              ? "#fff1f2"
                              : "transparent",
                            color: on
                              ? "var(--primary)"
                              : "var(--foreground)",
                          }}
                        >
                          <Icon size={15} />
                          {label}
                        </button>
                      );
                    },
                  )}
                </div>
              </div>
            </div>

            <div className="flex justify-end mt-6">
              <button
                onClick={() => setStep("rooms")}
                className="flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-xl text-sm font-semibold hover:opacity-90 transition-all"
              >
                Continue <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}

        {/* ── STEP 3: Rooms ── */}
        {step === "rooms" && (
          <div>
            <h1
              style={{
                fontFamily: "'Playfair Display', serif",
                fontWeight: 700,
                fontSize: "1.75rem",
                color: "var(--foreground)",
                marginBottom: "0.25rem",
              }}
            >
              Set up your rooms
            </h1>
            <p className="text-muted-foreground text-sm mb-8">
              Add each room or unit you want to list
            </p>

            <RoomsPage
              rooms={rooms}
              floors={3}
              onChange={updateRoom}
              onAdd={addRoom}
              onRemove={removeRoom}
            />

            <div className="flex justify-between mt-6">
              <button
                onClick={() => setStep("property")}
                className="flex items-center gap-2 border border-border px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-muted transition-all"
              >
                <ChevronLeft size={15} /> Back
              </button>
              <button
                onClick={() => setStep("facilities")}
                className="flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-xl text-sm font-semibold hover:opacity-90 transition-all"
              >
                Next: Set pricing <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}

        {/* ── STEP 4: Facilities & Policies ── */}
        {step === "facilities" && (
          <div>
            <h1
              style={{
                fontFamily: "'Playfair Display', serif",
                fontWeight: 700,
                fontSize: "1.75rem",
                color: "var(--foreground)",
                marginBottom: "0.25rem",
              }}
            >
              Facilities & policies
            </h1>
            <p className="text-muted-foreground text-sm mb-8">
              Set the rules and requirements for your property
            </p>

            <div className="bg-white rounded-2xl border border-border p-6 flex flex-col gap-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-foreground">
                    Check-in time
                  </label>
                  <select className="px-4 py-3 rounded-xl border border-border bg-input-background text-sm outline-none">
                    {[
                      "12:00 PM",
                      "1:00 PM",
                      "2:00 PM",
                      "3:00 PM",
                      "4:00 PM",
                      "Flexible",
                    ].map((t) => (
                      <option key={t}>{t}</option>
                    ))}
                  </select>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-foreground">
                    Check-out time
                  </label>
                  <select className="px-4 py-3 rounded-xl border border-border bg-input-background text-sm outline-none">
                    {[
                      "10:00 AM",
                      "11:00 AM",
                      "12:00 PM",
                      "1:00 PM",
                      "Flexible",
                    ].map((t) => (
                      <option key={t}>{t}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-foreground">
                  Cancellation policy
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    {
                      id: "flexible",
                      l: "Flexible",
                      d: "Full refund 1 day before check-in",
                    },
                    {
                      id: "moderate",
                      l: "Moderate",
                      d: "Full refund 5 days before check-in",
                    },
                    {
                      id: "strict",
                      l: "Strict",
                      d: "50% refund 7 days before check-in",
                    },
                  ].map(({ id, l, d }) => (
                    <label
                      key={id}
                      className="flex flex-col gap-1 p-3 rounded-xl border-2 cursor-pointer hover:border-primary/40 transition-all"
                      style={{ borderColor: "var(--border)" }}
                    >
                      <input
                        type="radio"
                        name="cancellation"
                        value={id}
                        className="sr-only"
                      />
                      <span className="text-sm font-semibold text-foreground">
                        {l}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {d}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-sm font-semibold text-foreground mb-3 block">
                  House rules
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { label: "🐾 Pets allowed", key: "pets" },
                    {
                      label: "🚬 Smoking allowed",
                      key: "smoking",
                    },
                    {
                      label: "🎉 Events/parties allowed",
                      key: "events",
                    },
                    {
                      label: "👶 Children welcome",
                      key: "children",
                    },
                    {
                      label: "♿ Wheelchair accessible",
                      key: "accessible",
                    },
                    {
                      label: "🌿 Eco-friendly property",
                      key: "eco",
                    },
                    {
                      label: "📶 24/7 check-in",
                      key: "checkin24",
                    },
                    {
                      label: "🔒 Security deposit required",
                      key: "deposit",
                    },
                  ].map(({ label, key }) => (
                    <label
                      key={key}
                      className="flex items-center gap-3 p-3 rounded-xl border border-border cursor-pointer hover:bg-muted/40 transition-colors"
                    >
                      <input
                        type="checkbox"
                        className="w-4 h-4 accent-primary"
                      />
                      <span className="text-sm text-foreground">
                        {label}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-foreground">
                    Minimum stay (nights)
                  </label>
                  <input
                    type="number"
                    min={1}
                    defaultValue={1}
                    className="px-4 py-3 rounded-xl border border-border bg-input-background text-sm outline-none"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-foreground">
                    Maximum stay (nights)
                  </label>
                  <input
                    type="number"
                    min={1}
                    defaultValue={30}
                    className="px-4 py-3 rounded-xl border border-border bg-input-background text-sm outline-none"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-foreground">
                  Languages spoken by staff
                </label>
                <div className="flex flex-wrap gap-2">
                  {[
                    "English",
                    "Hindi",
                    "Nepali",
                    "French",
                    "Spanish",
                    "Arabic",
                    "Mandarin",
                    "Japanese",
                    "German",
                    "Italian",
                    "Portuguese",
                  ].map((lang) => (
                    <label
                      key={lang}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-border text-sm cursor-pointer hover:border-primary/50 transition-all has-[:checked]:border-primary has-[:checked]:bg-primary/5 has-[:checked]:text-primary"
                    >
                      <input
                        type="checkbox"
                        className="w-3 h-3 accent-primary"
                      />
                      {lang}
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex justify-between mt-6">
              <button
                onClick={() => setStep("rooms")}
                className="flex items-center gap-2 border border-border px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-muted transition-all"
              >
                <ChevronLeft size={15} /> Back
              </button>
              <button
                onClick={() => setStep("done")}
                className="flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-xl text-sm font-semibold hover:opacity-90 transition-all"
              >
                Submit listing <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}

        {/* ── STEP 5: Done ── */}
        {step === "done" && (
          <div className="text-center py-16">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Check size={36} className="text-green-600" />
            </div>
            <h1
              style={{
                fontFamily: "'Playfair Display', serif",
                fontWeight: 700,
                fontSize: "2rem",
                color: "var(--foreground)",
                marginBottom: "0.75rem",
              }}
            >
              You're all set! 🎉
            </h1>
            <p className="text-muted-foreground max-w-md mx-auto mb-4">
              <strong className="text-foreground">
                {propertyName || "Your property"}
              </strong>{" "}
              in{" "}
              <strong className="text-foreground">
                {propertyCity || "your city"}
              </strong>{" "}
              has been submitted for review. You'll receive a
              confirmation email within 24 hours.
            </p>
            <div className="bg-white border border-border rounded-2xl p-5 mb-8 text-left max-w-sm mx-auto">
              <p className="text-sm font-semibold text-foreground mb-3">
                Listing summary
              </p>
              <div className="flex flex-col gap-2 text-sm text-muted-foreground">
                <div className="flex justify-between">
                  <span>Property</span>
                  <span className="font-medium text-foreground">
                    {propertyName || "—"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Type</span>
                  <span className="font-medium text-foreground capitalize">
                    {propertyType || "—"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Location</span>
                  <span className="font-medium text-foreground">
                    {propertyCity}
                    {propertyCountry
                      ? `, ${propertyCountry}`
                      : ""}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Rooms</span>
                  <span className="font-medium text-foreground">
                    {rooms.length}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Rooms configured</span>
                  <span className="font-medium text-foreground">
                    {rooms.length}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={() => navigate("/")}
                className="px-6 py-3 rounded-xl border border-border text-sm font-medium hover:bg-muted transition-all"
              >
                Back to home
              </button>
              <button
                onClick={() => setStep("property")}
                className="px-6 py-3 rounded-xl bg-primary text-white text-sm font-semibold hover:opacity-90 transition-all"
              >
                Add another property
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}