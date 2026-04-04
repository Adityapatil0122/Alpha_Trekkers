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

const destinations = [
  'Sinhagad',
  'Rajgad',
  'Lohagad',
  'Harishchandragad',
  'Kalsubai',
  'Torna',
];

const companyLinks = [
  { to: '/about', label: 'Who We Are' },
  { to: '/trips', label: 'Curated Tours' },
  { to: '/weekend-trips', label: 'Weekend Plans' },
  { to: '/contact', label: 'Travel Support' },
];

const instagramImages = [
  'https://images.unsplash.com/photo-1580674684081-7617fbf3d745?w=200',
  'https://images.unsplash.com/photo-1501854140801-50d01698950b?w=200',
  'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=200',
  'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=200',
  'https://images.unsplash.com/photo-1518173946687-a243e2bc1ae0?w=200',
  'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?w=200',
];

export default function Footer() {
  return (
    <footer className="travel-dark relative overflow-hidden text-sand-100">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent" />

      <div className="mx-auto max-w-7xl px-4 py-18 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[1.35fr_1fr_1fr_1.15fr]">
          <div>
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10">
                <Mountains className="h-7 w-7 text-gold-400" weight="duotone" />
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.24em] text-gold-400">Alpha Trekkers</p>
                <p className="font-heading text-3xl font-semibold">Where Mist Meets Mountains</p>
              </div>
            </div>
            <p className="mt-2 font-accent text-base italic text-forest-500/80">
              Trekking through the rains since 2019
            </p>
            <p className="mt-5 max-w-md text-sm leading-7 text-sand-200/72">
              Crafted fort escapes across Maharashtra with guide-led storytelling, seamless planning,
              and a visual identity inspired by premium travel editorials.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              {[InstagramLogo, YoutubeLogo, ChatCircle].map((Icon, index) => (
                <a
                  key={index}
                  href="#"
                  className="flex h-11 w-11 items-center justify-center rounded-full border border-white/12 bg-white/8 text-sand-100 hover:border-gold-400/40 hover:text-gold-400"
                >
                  <Icon className="h-5 w-5" weight="fill" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <p className="font-heading text-2xl font-semibold">Top Destinations</p>
            <ul className="mt-5 space-y-3 text-sm text-sand-200/74">
              {destinations.map((place) => (
                <li key={place}>
                  <Link to="/trips" className="hover:text-forest-500">
                    {place} Experiences
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="font-heading text-2xl font-semibold">Quick Access</p>
            <ul className="mt-5 space-y-3 text-sm text-sand-200/74">
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
            <div className="mt-5 space-y-3 text-sm text-sand-200/74">
              <p className="flex items-start gap-3">
                <MapPinLine className="mt-0.5 h-4 w-4 text-forest-500" />
                Pune, with departures across the Sahyadri circuit
              </p>
              <p className="flex items-center gap-3">
                <PhoneCall className="h-4 w-4 text-forest-500" />
                +91 98765 43210
              </p>
              <p className="flex items-center gap-3">
                <EnvelopeSimple className="h-4 w-4 text-forest-500" />
                hello@alphatrekkers.com
              </p>
            </div>
            <form onSubmit={(event) => event.preventDefault()} className="mt-6 flex items-center gap-3 rounded-full border border-white/12 bg-white/8 p-2 pl-4">
              <input
                type="email"
                aria-label="Email address"
                autoComplete="email"
                className="min-w-0 flex-1 bg-transparent text-sm text-white placeholder:text-sand-200/44 focus:outline-none"
              />
              <button type="submit" className="flex h-11 w-11 items-center justify-center rounded-full bg-gold-500 text-ink-950 hover:bg-gold-400">
                <PaperPlaneTilt className="h-4 w-4" weight="fill" />
              </button>
            </form>
          </div>
        </div>

        {/* Instagram Gallery */}
        <div className="mt-14">
          <p className="mb-4 text-center font-heading text-lg font-semibold text-sand-100/80">
            @alphatrekkers on the trail
          </p>
          <div className="flex items-center justify-center gap-3">
            {instagramImages.map((src, index) => (
              <a
                key={index}
                href="#"
                className="group overflow-hidden rounded-xl"
              >
                <img
                  src={src}
                  alt={`Instagram photo ${index + 1}`}
                  className="h-20 w-20 rounded-xl object-cover transition-all duration-300 group-hover:scale-110 group-hover:opacity-80"
                />
              </a>
            ))}
          </div>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-5 text-sm text-sand-200/58 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
          <p>&copy; {new Date().getFullYear()} Alpha Trekkers. All rights reserved.</p>
          <p>Monsoon-inspired adventure experiences across Maharashtra.</p>
        </div>
      </div>
    </footer>
  );
}
