import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Footer } from '../components/Footer'

const faqData = [
  {
    q: 'Can I list a room I rent, not own?',
    a: 'Yes — anyone with the legal right to rent out a property can host, including tenants with permission, property managers, and authorized representatives. You\'ll need to confirm you have that right when you list.',
  },
  {
    q: 'Are guests screened before they can book?',
    a: 'Verified guests carry a badge on their profile, and we encourage hosts to prioritize them. Unverified guests can still book, so the final call on who stays is always yours.',
  },
  {
    q: 'How does payout timing work?',
    a: 'Completed stays are credited to your host wallet right away. Withdrawals are processed weekly, covering the previous Monday-through-Sunday period.',
  },
  {
    q: 'Can I change my price or availability later?',
    a: 'Anytime. Pricing, calendar availability, and booking preferences are fully adjustable from your dashboard — there\'s no lock-in period.',
  },
  {
    q: 'What happens if a guest cancels?',
    a: 'Refunds follow whichever cancellation policy you\'ve set — Flexible, Moderate, or Strict. The refunded amount goes back to the guest\'s wallet, not necessarily your earnings.',
  },
  {
    q: 'Can I message a guest before they book?',
    a: 'Yes, through in-platform chat. Sharing personal contact details before a confirmed booking isn\'t allowed, and doing so can put your account at risk.',
  },
]

const whyChoose = [
  {
    icon: '✓',
    title: 'Verified properties',
    desc: 'Every listing is manually reviewed and verified by our quality team before going live.',
  },
  {
    icon: '✦',
    title: 'Curated experiences',
    desc: 'Hand-picked hotels, villas and stays across 195+ countries for every type of traveller.',
  },
  {
    icon: '◐',
    title: '24/7 support',
    desc: 'Dedicated support in 12 languages, wherever you are in the world.',
  },
]

function HostLandingPage() {
  const navigate = useNavigate()
  const [openFaq, setOpenFaq] = useState(0)

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-white"
    >
      {/* HERO */}
      <section className="bg-primary text-white overflow-hidden pt-16 pb-28 relative max-md:pb-44">
        <div
          className="absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage:
              'radial-gradient(circle at 1.5px 1.5px, white 1.5px, transparent 0)',
            backgroundSize: '28px 28px',
          }}
        ></div>
        <div className="absolute -left-24 top-1/3 w-[420px] h-[420px] rounded-full bg-[#E8B84B] opacity-[0.12] blur-3xl"></div>
        <div className="absolute right-0 -top-20 w-[360px] h-[360px] rounded-full bg-[#C45B3E] opacity-[0.15] blur-3xl"></div>

        <button
          onClick={() => navigate('/')}
          className="absolute top-6 left-8 text-white/80 hover:text-white flex items-center gap-1.5 text-sm font-medium transition-colors z-20"
        >
          ← Back
        </button>

        <div className="max-w-[1180px] mx-auto px-8 relative z-10">
          <div className="grid grid-cols-[1.1fr_0.9fr] gap-10 items-center max-lg:grid-cols-1">
            <div>
              <span className="text-xs tracking-[0.08em] uppercase text-[#FFD58A] font-bold mb-5 flex items-center gap-2.5">
                <span className="w-[7px] h-[7px] bg-[#FFD58A] rounded-full inline-block"></span>
                Hosting · Open enrollment
              </span>
              <h1 className="text-white text-[clamp(42px,6.4vw,74px)] leading-[1.03] font-bold tracking-tight mb-6">
                Your place,
                <br />
                <span className="text-[#FFB088]">your terms</span>,
                <br />
                zero cut.
              </h1>
              <p className="text-[#C9D6E0] text-lg leading-relaxed max-w-[480px] mb-9">
                List your space, set your own price, and keep every rupee you
                earn. No commission, no fine print — just a straightforward
                way to host travellers from 195+ countries.
              </p>
              <div className="flex items-center gap-5 flex-wrap">
                <button
                  onClick={() => navigate('/host/login')}
                  className="bg-[#E8B84B] hover:bg-[#F0C868] text-[#1C1B19] px-8 py-4 rounded-full font-bold text-[15px] border-none cursor-pointer inline-flex items-center gap-2.5 transition-all duration-200 hover:-translate-y-0.5 shadow-[0_12px_30px_-8px_rgba(232,184,75,0.6)]"
                >
                  List your space <span className="inline-block">→</span>
                </button>
                <span className="text-[13px] text-[#8DA9B9]">
                  Takes about 10 minutes to publish
                </span>
              </div>
            </div>

            <div className="relative flex items-center justify-center min-h-[420px]">
              {/* payout receipt — back layer */}
              <div className="absolute bg-white text-charcoal w-[230px] rounded-[6px] -rotate-[9deg] shadow-[0_20px_45px_-18px_rgba(28,27,25,0.4)] left-2 top-2 max-lg:hidden p-5 font-mono">
                <p className="text-[9px] uppercase tracking-[0.1em] text-gray-400 mb-3">
                  Weekly payout
                </p>
                <p className="text-[22px] font-bold text-primary mb-1">
                  ₹18,400
                </p>
                <p className="text-[10px] text-gray-400">Mon–Sun · 6 stays</p>
                <div className="mt-3 pt-3 border-t border-gray-100 flex justify-between text-[9px] text-gray-400">
                  <span>Commission</span>
                  <span className="text-[#C45B3E] font-bold">₹0</span>
                </div>
              </div>

              {/* guest message — floating */}
              <div className="absolute bg-white text-charcoal w-[190px] rounded-[6px] rotate-[6deg] shadow-[0_18px_40px_-16px_rgba(28,27,25,0.4)] right-0 -top-4 max-lg:hidden p-4">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-6 h-6 rounded-full bg-[#E8B84B] flex items-center justify-center text-[10px] font-bold text-charcoal">
                    R
                  </div>
                  <p className="text-[10px] font-semibold">Riya · Verified</p>
                </div>
                <p className="text-[11px] leading-snug text-gray-600">
                  "Loved the courtyard! Booking again in Feb 🌿"
                </p>
              </div>

              {/* listing card — front layer */}
              <div className="bg-white text-charcoal w-[300px] rounded-[6px] rotate-[3deg] shadow-[0_30px_60px_-20px_rgba(28,27,25,0.45)] relative z-10 max-lg:rotate-0">
                <div
                  className="h-[190px] relative"
                  style={{
                    background:
                      'linear-gradient(180deg, rgba(28,27,25,0) 40%, rgba(28,27,25,0.85) 100%), repeating-linear-gradient(115deg, #6b5d4f 0px, #6b5d4f 2px, #5a4d41 2px, #5a4d41 40px)',
                  }}
                >
                  <span className="absolute top-3.5 left-3.5 bg-[#E8B84B] text-[#1C1B19] text-[11px] px-2.5 py-1 rounded-[3px] uppercase tracking-[0.08em] font-bold">
                    Live listing
                  </span>
                </div>
                <div className="p-[18px_20px_22px]">
                  <h4 className="font-serif text-[17px] font-medium mb-1.5 text-charcoal">
                    The Quiet Courtyard House
                  </h4>
                  <p className="text-[12.5px] text-gray-400 mb-3.5">
                    2BHK · Sleeps 4 · Hosted since today
                  </p>
                  <div className="flex justify-between items-baseline border-t border-gray-100 pt-3.5">
                    <div className="font-serif text-xl text-primary">
                      ₹3,200
                      <span className="font-sans text-[11px] text-gray-400">
                        /night
                      </span>
                    </div>
                    <span className="text-[11px] uppercase tracking-[0.08em] text-[#C45B3E] font-bold">
                      You keep 100%
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="absolute -bottom-px left-0 w-full overflow-hidden leading-[0]">
          <svg
            viewBox="0 0 1440 60"
            preserveAspectRatio="none"
            className="w-full h-[44px] block"
          >
            <path d="M0,60 L0,30 Q360,0 720,30 T1440,30 L1440,60 Z" fill="#FAF6EE" />
          </svg>
        </div>
      </section>

      {/* TICKER */}
      <div className="border-b border-[#EFE6D2] bg-[#FAF6EE] py-3.5 overflow-hidden">
        <div className="flex gap-12 whitespace-nowrap w-max animate-[scroll-strip_28s_linear_infinite] will-change-transform">
          {[
            'No listing fees',
            'Set your own price',
            'Weekly payouts',
            'Cancel-policy control',
            'Verified guests',
            'No listing fees',
            'Set your own price',
            'Weekly payouts',
            'Cancel-policy control',
            'Verified guests',
          ].map((item, i) => (
            <span
              key={i}
              className="text-[13px] font-bold flex items-center gap-12 text-primary"
            >
              {item}
              <span className="text-[#C45B3E] font-bold">✦</span>
            </span>
          ))}
        </div>
      </div>

      {/* WHY HOST HERE */}
      <section className="py-32 bg-[#FAF6EE] relative">
        <div className="max-w-[1180px] mx-auto px-8">
          <div className="max-w-[700px] mx-auto text-center mb-16">
            <span className="text-sm uppercase tracking-[0.08em] text-[#C45B3E] font-bold mb-4 block relative inline-flex items-center gap-4 before:block before:w-8 before:h-px before:bg-[#C45B3E]/40 after:block after:w-8 after:h-px after:bg-[#C45B3E]/40">
              Why host here
            </span>
            <h2 className="text-primary text-[clamp(34px,5vw,52px)] font-bold tracking-tight leading-[1.08]">
              Hosting that doesn't take a cut
              <br className="max-md:hidden" /> to take an interest.
            </h2>
          </div>
          <div className="grid grid-cols-3 gap-6 max-lg:grid-cols-1 max-lg:max-w-lg max-lg:mx-auto">
            {[
              {
                num: '01',
                title: 'Nothing taken off the top',
                desc: 'No commission, no listing fee, no quiet deductions. <strong>Whatever a guest pays lands in your account in full</strong> — it\'s the simplest math in hosting.',
                accent: '#C45B3E',
              },
              {
                num: '02',
                title: 'Run it your way',
                desc: 'Change your rate tonight, block off next weekend, accept or decline a booking on your own schedule. <strong>The property stays entirely under your direction</strong>, with nothing to wait on.',
                accent: '#16233A',
              },
              {
                num: '03',
                title: 'Earn more, not just list',
                desc: 'You\'re placed in front of a steady stream of <strong>identity-checked travelers</strong>, and we actively push your listing through our own marketing — so visibility isn\'t something you have to chase alone.',
                accent: '#B8862E',
              },
            ].map((item) => (
              <div
                key={item.num}
                className="bg-white rounded-2xl px-10 py-12 border border-[#EFE6D2] shadow-[0_8px_24px_-12px_rgba(28,27,25,0.12)] hover:shadow-[0_20px_40px_-16px_rgba(28,27,25,0.22)] hover:-translate-y-1.5 transition-all duration-300 relative overflow-hidden"
              >
                <div
                  className="absolute top-0 left-0 w-full h-1.5"
                  style={{ backgroundColor: item.accent }}
                ></div>
                <div
                  className="font-mono text-sm font-bold mb-6"
                  style={{ color: item.accent }}
                >
                  {item.num}
                </div>
                <h3 className="font-serif text-[25px] font-semibold text-primary mb-4 leading-tight">
                  {item.title}
                </h3>
                <p
                  className="text-[15.5px] leading-relaxed text-gray-600"
                  dangerouslySetInnerHTML={{ __html: item.desc }}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WHY CHOOSE STAYEASY — gold panel */}
      <section className="py-28 bg-[#E8B84B] relative overflow-hidden">
        <div className="absolute -right-20 -bottom-24 w-72 h-72 rounded-full border-[3px] border-[#1C1B19]/10"></div>
        <div className="absolute left-10 top-10 w-24 h-24 rounded-full border-2 border-[#1C1B19]/10 max-md:hidden"></div>
        <div className="max-w-[1180px] mx-auto px-8 relative z-10">
          <div className="max-w-[640px] mb-16">
            <span className="text-xs uppercase tracking-[0.08em] text-[#1C1B19] font-bold mb-4 block">
              For your future guests
            </span>
            <h2 className="text-[#1C1B19] text-[clamp(32px,4.6vw,48px)] font-bold tracking-tight leading-[1.08]">
              Why choose StayEasy?
            </h2>
            <p className="text-[#3A3215] mt-4 text-[15.5px] leading-relaxed font-medium max-w-[480px]">
              The same trust that brings travellers to your listing is the
              reason hosts stay with us.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-6 max-lg:grid-cols-1">
            {whyChoose.map((item) => (
              <div
                key={item.title}
                className="bg-[#1C1B19] rounded-2xl px-8 py-10 text-white shadow-[0_20px_40px_-16px_rgba(28,27,25,0.5)]"
              >
                <div className="w-11 h-11 rounded-full bg-[#E8B84B] text-[#1C1B19] flex items-center justify-center text-lg font-bold mb-6">
                  {item.icon}
                </div>
                <h3 className="font-serif text-[21px] font-semibold mb-3 leading-tight">
                  {item.title}
                </h3>
                <p className="text-[14.5px] leading-relaxed text-[#C9C2B4]">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PROCESS */}
      <section className="bg-primary text-white py-24 relative overflow-hidden">
        <div className="absolute -left-32 top-0 w-80 h-80 rounded-full bg-[#C45B3E] opacity-[0.1] blur-3xl"></div>
        <div className="max-w-[1180px] mx-auto px-8 relative z-10">
          <div className="max-w-[560px] mb-14">
            <span className="text-xs uppercase tracking-[0.08em] text-[#FFD58A] font-bold mb-3.5 block">
              The process
            </span>
            <h2 className="text-white text-[clamp(30px,4vw,42px)] font-bold tracking-tight">
              From empty room to first booking.
            </h2>
            <p className="text-[#c9c5ba] mt-4 text-[15.5px] leading-relaxed">
              Three steps, no waiting on approval calls. Most hosts are live
              the same day they start.
            </p>
          </div>

          <div className="border-t border-white/20 max-w-[780px]">
            {[
              {
                step: '1',
                title: 'Open an account',
                desc: 'Sign up with email, phone, or a social login. Identity verification usually clears in under two minutes.',
                stat: '~2 MIN',
              },
              {
                step: '2',
                title: 'Publish your listing',
                desc: 'Add photos, amenities, house rules, and a price. Our step-by-step builder handles the rest — your space goes live and becomes searchable immediately.',
                stat: '~10 MIN',
              },
              {
                step: '3',
                title: 'Get paid',
                desc: 'Earnings land in your host wallet the moment a stay wraps up. Withdraw weekly to your linked bank account — no holding period games.',
                stat: 'WEEKLY',
              },
            ].map((item) => (
              <div
                key={item.step}
                className="grid grid-cols-[90px_1fr_140px] gap-6 items-start py-8 border-b border-white/20 max-sm:grid-cols-[50px_1fr]"
              >
                <div className="font-serif italic text-[34px] text-[#E8B84B]">
                  {item.step}
                </div>
                <div>
                  <h3 className="font-serif text-[21px] font-medium text-white mb-2">
                    {item.title}
                  </h3>
                  <p className="text-[14.5px] leading-relaxed text-[#c9c5ba] max-w-[480px]">
                    {item.desc}
                  </p>
                </div>
                <div className="font-mono text-xs text-[#FFB088] text-right pt-1.5 max-sm:hidden">
                  {item.stat}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-white py-24">
        <div className="max-w-[1180px] mx-auto px-8">
          <div className="max-w-[560px] mb-14">
            <span className="text-xs uppercase tracking-[0.08em] text-[#C45B3E] font-bold mb-3.5 block">
              Before you list
            </span>
            <h2 className="text-primary text-[clamp(28px,3.4vw,38px)] font-bold tracking-tight">
              Common questions
            </h2>
          </div>

          <div className="max-w-[760px]">
            {faqData.map((item, i) => (
              <div key={i} className="border-b border-gray-200">
                <div
                  onClick={() => setOpenFaq(openFaq === i ? -1 : i)}
                  className="w-full flex justify-between items-center gap-5 cursor-pointer py-[26px]"
                >
                  <span className="font-serif text-lg font-medium text-charcoal">
                    {item.q}
                  </span>
                  <span
                    className={`font-mono text-lg text-[#C45B3E] shrink-0 transition-transform duration-250 ${
                      openFaq === i ? 'rotate-45' : ''
                    }`}
                  >
                    +
                  </span>
                </div>
                <div
                  className={`overflow-hidden transition-all duration-300 ${
                    openFaq === i ? 'max-h-60' : 'max-h-0'
                  }`}
                >
                  <p className="pb-[26px] text-[15px] leading-relaxed text-gray-600 max-w-[640px]">
                    {item.a}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA BANNER */}
      <section className="mx-8 mb-24 max-sm:mx-5 max-sm:mb-[70px]">
        <div className="bg-primary text-white rounded-[20px] py-[70px] px-[60px] relative overflow-hidden max-sm:py-12 max-sm:px-7">
          <div className="absolute -right-16 -top-16 w-60 h-60 rounded-full bg-[#E8B84B] opacity-[0.15] blur-2xl"></div>
          <div className="absolute right-5 -bottom-[90px] w-[200px] h-[200px] border border-white/18 rounded-full"></div>
          <div className="absolute left-10 bottom-8 w-16 h-16 border-2 border-[#C45B3E]/30 rounded-full max-md:hidden"></div>
          <h2 className="text-white text-[clamp(28px,4vw,40px)] max-w-[520px] mb-7 font-bold tracking-tight relative z-10">
            Your first guest is closer than you think.
          </h2>
          <button
            onClick={() => navigate('/host/login')}
            className="bg-[#E8B84B] hover:bg-[#F0C868] text-[#1C1B19] px-8 py-4 rounded-full font-bold text-[15px] border-none cursor-pointer inline-flex relative z-10 transition-all duration-200 hover:-translate-y-0.5 items-center gap-2.5 shadow-[0_12px_30px_-8px_rgba(232,184,75,0.5)]"
          >
            List your space <span className="inline-block">→</span>
          </button>
        </div>
      </section>

      <Footer />
    </motion.div>
  )
}

export default HostLandingPage