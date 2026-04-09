import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import {
  ChatCircle,
  EnvelopeSimple,
  InstagramLogo,
  MapPinLine,
  Mountains,
  PaperPlaneTilt,
  PhoneCall,
  YoutubeLogo,
} from '@phosphor-icons/react';

const quickLinks = [
  { to: '/', label: 'Home' },
  { to: '/trips', label: 'Treks' },
  { to: '/corporate-treks', label: 'Corporate Treks' },
  { to: '/about', label: 'About' },
  { to: '/contact', label: 'Contact' },
  { to: '/trips', label: 'Book Now' },
const destinations = [
  { label: 'Rajgad', to: '/weekend-trips' },
  { label: 'Lohagad', to: '/weekend-trips' },
  { label: 'Harishchandragad', to: '/weekend-trips' },
  { label: 'Torna', to: '/weekend-trips' },
  { label: 'Kalsubai', to: '/weekday-trips' },
  { label: 'Rajmachi', to: '/weekday-trips' },
];

const companyLinks = [
  { to: '/about', label: 'Who We Are' },
  { to: '/weekend-trips', label: 'Weekend Trips' },
  { to: '/weekday-trips', label: 'Weekday Trips' },
  { to: '/weekend-trips', label: 'Weekend Plans' },
  { to: '/contact', label: 'Travel Support' },
];

function ScenicBadge({
  className,
  children,
}: {
  className: string;
  children: ReactNode;
}) {
  return (
    <div
      className={`absolute flex h-14 w-14 items-center justify-center rounded-full border border-[#cfe1d3] bg-white/82 text-[#5f9f6d] shadow-[0_14px_32px_rgba(86,126,94,0.08)] backdrop-blur-sm ${className}`}
    >
      {children}
    </div>
  );
}

function HikerMark() {
  return (
    <svg viewBox="0 0 24 24" className="h-7 w-7" fill="none" aria-hidden="true">
      <circle cx="11.5" cy="4.8" r="2.1" fill="currentColor" />
      <path d="M11.5 7.6V12.8" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" />
      <path d="M11.4 9.2L7.9 12.2" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" />
      <path d="M11.7 9L15.8 11.1" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" />
      <path d="M11.3 12.7L8.2 18.8" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" />
      <path d="M11.6 12.7L16.5 18.8" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" />
      <path d="M15.6 8.6L17.1 19.1" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" />
      <path d="M9.8 8.4C10.8 7.5 12.4 7.1 13.7 7.5" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" />
    </svg>
  );
}

function PineMark() {
  return (
    <svg viewBox="0 0 24 24" className="h-7 w-7" fill="none" aria-hidden="true">
      <path d="M12 3.5L8.7 8.3H10.9L7.8 12.6H10.6L7.4 17H16.6L13.4 12.6H16.2L13.1 8.3H15.3L12 3.5Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
      <path d="M12 17V20.2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function CanopyTreeMark() {
  return (
    <svg viewBox="0 0 24 24" className="h-7 w-7" fill="none" aria-hidden="true">
      <path d="M8.1 16C5.9 16 4.5 14.5 4.5 12.6C4.5 10.9 5.7 9.6 7.4 9.3C7.9 7.3 9.7 5.9 11.9 5.9C14.1 5.9 16 7.4 16.5 9.5C18.1 9.8 19.3 11 19.3 12.7C19.3 14.6 17.8 16 15.7 16H8.1Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
      <path d="M12 16V20" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

export default function Footer() {
  return (
    <footer className="relative mt-8 overflow-visible text-sand-100">
      <div className="pointer-events-none relative z-10">
        <div
          className="relative h-[8rem] overflow-hidden leading-none sm:h-[9rem] lg:h-[10rem]"
          style={{ marginTop: 0, marginBottom: 0 }}
        >
          <svg
            viewBox="0 0 1440 180"
            preserveAspectRatio="none"
            className="absolute inset-0 block h-full w-full"
            aria-hidden="true"
          >
            <path
              d="M184 54 C282 22, 396 24, 500 52"
              fill="none"
              stroke="#b6d1bb"
              strokeWidth="3"
              strokeDasharray="8 10"
              strokeLinecap="round"
            />
            <path
              d="M482 50 C594 82, 708 78, 812 44"
              fill="none"
              stroke="#d3e4d6"
              strokeWidth="3"
              strokeLinecap="round"
            />
            <path
              d="M980 54 C1080 18, 1188 22, 1288 56"
              fill="none"
              stroke="#bdd5c1"
              strokeWidth="3"
              strokeDasharray="6 10"
              strokeLinecap="round"
            />
            <circle cx="210" cy="46" r="18" fill="#f8fbf8" stroke="#cadecf" strokeWidth="3" />
            <circle cx="1182" cy="40" r="10" fill="#f8fbf8" stroke="#cadecf" strokeWidth="2.5" />
            <circle cx="872" cy="52" r="4.5" fill="#cfe0d2" />
            <circle cx="907" cy="60" r="3.5" fill="#dce8dd" />
          </svg>

          <div className="absolute left-[6.5%] top-[48%] text-[#7fb487] opacity-90">
            <PineMark />
          </div>
          <div className="absolute left-[19.8%] top-[42%] text-[#89bc90] opacity-88">
            <CanopyTreeMark />
          </div>
          <div className="absolute left-[39.5%] top-[46%] text-[#7aac81] opacity-88">
            <PineMark />
          </div>
          <div className="absolute left-[70.4%] top-[44%] text-[#86b98d] opacity-88">
            <PineMark />
          </div>
          <div className="absolute left-[85.6%] top-[39%] text-[#8cbe93] opacity-86">
            <CanopyTreeMark />
          </div>

          <ScenicBadge className="left-[50.6%] top-[30%]">
            <HikerMark />
          </ScenicBadge>
          <svg
            viewBox="0 0 1440 180"
            preserveAspectRatio="none"
            className="absolute inset-0 block h-full w-full"
            aria-hidden="true"
          >
            <path
              className="mountain-divider__ridge mountain-divider__ridge--back"
              d="M0 180 L0 122 L88 108 L162 72 L250 120 L334 96 L404 54 L486 108 L560 82 L646 126 L726 82 L814 118 L896 68 L978 126 L1060 94 L1148 136 L1234 74 L1322 114 L1400 88 L1440 102 L1440 180 Z"
            />
            <path
              className="mountain-divider__ridge mountain-divider__ridge--mid"
              d="M0 180 L0 144 L78 134 L156 102 L238 140 L322 116 L398 80 L482 132 L562 102 L644 148 L726 112 L810 140 L894 94 L982 144 L1064 114 L1150 156 L1234 98 L1322 138 L1404 124 L1440 130 L1440 180 Z"
            />
            <path
              className="mountain-divider__ridge mountain-divider__ridge--front"
              d="M0 180 L0 158 L68 150 L146 124 L230 156 L314 138 L392 108 L478 152 L560 126 L642 162 L724 134 L808 154 L896 118 L982 158 L1068 132 L1158 168 L1242 126 L1328 152 L1408 142 L1440 146 L1440 180 Z"
              style={{ fill: '#000000' }}
            />
          </svg>
        </div>
      </div>

      <div className="relative -mt-1 overflow-hidden bg-black shadow-[0_-18px_48px_rgba(3,7,12,0.12)]">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(92,184,92,0.1),transparent_24%),radial-gradient(circle_at_bottom_right,rgba(240,185,66,0.06),transparent_28%)]" />

        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="grid gap-10 border-b border-white/10 pb-12 lg:grid-cols-[1.25fr_0.9fr_0.9fr_1fr]">
            <div className="pr-6">
              <div className="flex items-start gap-3">
                <div className="mt-1 flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10">
                  <Mountains className="h-7 w-7 text-gold-400" weight="duotone" />
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.24em] text-gold-400">Alpha Trekkers</p>
                  <p className="max-w-sm font-heading text-3xl font-semibold leading-tight">
                    Monsoon routes, fort trails, and cleaner weekend getaways.
                  </p>
                </div>
              </div>
              <p className="mt-3 font-accent text-xl text-forest-500/90">
                Trekking through Maharashtra since 2019
              </p>
              <p className="mt-5 max-w-lg text-sm leading-7 text-sand-200/74">
                Built for weekend hikers, first-timers, and repeat fort explorers who want strong
                routes, practical planning, and a more polished booking flow.
              </p>
              <div className="mt-6 flex flex-wrap gap-2">
                <span className="rounded-full border border-white/10 bg-white/[0.05] px-3 py-1.5 text-xs font-medium text-sand-100/84">
                  Pune departures
                </span>
                <span className="rounded-full border border-white/10 bg-white/[0.05] px-3 py-1.5 text-xs font-medium text-sand-100/84">
                  Guided weekend trips
                </span>
                <span className="rounded-full border border-white/10 bg-white/[0.05] px-3 py-1.5 text-xs font-medium text-sand-100/84">
                  Monsoon-ready routes
                </span>
              </div>
              <div className="mt-7 flex flex-wrap gap-3">
                {[InstagramLogo, YoutubeLogo, ChatCircle].map((Icon, index) => (
                  <a
                    key={index}
                    href="#"
                    className="flex h-11 w-11 items-center justify-center rounded-full border border-white/12 bg-white/8 text-sand-100 hover:border-gold-400/40 hover:bg-white/12 hover:text-gold-400"
                  >
                    <Icon className="h-5 w-5" weight="fill" />
                  </a>
                ))}
              </div>
            </div>

            <div>
              <p className="font-heading text-2xl font-semibold">Popular Escapes</p>
              <ul className="mt-5 space-y-3 text-sm text-sand-200/78">
                {destinations.map((place) => (
                  <li key={place.label}>
                    <Link
                      to={place.to}
                      className="group inline-flex items-center gap-2 hover:text-forest-500"
                    >
                      <span>{place.label}</span>
                      <ArrowRight className="h-3.5 w-3.5 text-sand-200/36 transition group-hover:translate-x-0.5 group-hover:text-forest-500" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <p className="font-heading text-2xl font-semibold">Quick Access</p>
              <ul className="mt-5 space-y-3 text-sm text-sand-200/76">
                {companyLinks.map((link) => (
                  <li key={link.to}>
                    <Link to={link.to} className="hover:text-forest-500">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <p className="font-heading text-2xl font-semibold">Stay in the Loop</p>
              <div className="mt-5 space-y-4 text-sm text-sand-200/76">
                <p className="flex items-start gap-3">
                  <MapPinLine className="mt-0.5 h-4 w-4 shrink-0 text-forest-500" />
                  Pune base, with departures across the Sahyadri circuit
                </p>
                <p className="flex items-center gap-3">
                  <PhoneCall className="h-4 w-4 shrink-0 text-forest-500" />
                  +91 98765 43210
                </p>
                <p className="flex items-center gap-3">
                  <EnvelopeSimple className="h-4 w-4 shrink-0 text-forest-500" />
                  hello@alphatrekkers.com
                </p>
              </div>
              <form
                onSubmit={(event) => event.preventDefault()}
                className="mt-6 flex items-center gap-3 rounded-full border border-white/12 bg-white/8 p-2 pl-4"
              >
                <input
                  type="email"
                  aria-label="Email address"
                  autoComplete="email"
                  placeholder="Get route updates by email"
                  className="min-w-0 flex-1 bg-transparent text-sm text-white placeholder:text-sand-200/44 focus:outline-none"
                />
                <button
                  type="submit"
                  className="flex h-11 w-11 items-center justify-center rounded-full bg-gold-500 text-ink-950 hover:bg-gold-400"
                >
                  <PaperPlaneTilt className="h-4 w-4" weight="fill" />
                </button>
              </form>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10">
          <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-5 text-sm text-sand-200/58 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
            <p>&copy; {new Date().getFullYear()} Alpha Trekkers. All rights reserved.</p>
            <p>Monsoon-inspired adventure experiences across Maharashtra.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
