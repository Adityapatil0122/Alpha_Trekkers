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
import { WEEKDAY_LOCATION_GROUPS, WEEKEND_FORT_GROUPS } from '@/content/fortDirectory';

const quickLinks = [
  { to: '/', label: 'Home' },
  { to: '/trips', label: 'Treks' },
  { to: '/corporate-treks', label: 'Corporate Treks' },
  { to: '/about', label: 'About' },
  { to: '/contact', label: 'Contact' },
  { to: '/trips', label: 'Book Now' },
];

const weekendLocationGroups = WEEKEND_FORT_GROUPS.flatMap((group) => [
  { title: group.title, forts: group.forts },
  ...(group.sections ?? []),
]);

export default function Footer() {
  return (
    <footer className="relative overflow-hidden bg-black text-sand-100">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(92,184,92,0.1),transparent_24%),radial-gradient(circle_at_bottom_right,rgba(240,185,66,0.06),transparent_28%)]" />

      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-10 border-b border-white/10 pb-12 lg:grid-cols-[1.2fr_0.9fr_1fr]">
          <div className="pr-6">
            <div className="flex items-start gap-3">
              <div className="mt-1 flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10">
                <Mountains className="h-7 w-7 text-gold-400" weight="duotone" />
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.24em] text-gold-400">Alpha Trekkers</p>
                <p className="max-w-sm font-heading text-3xl font-semibold leading-tight">
                  Monsoon routes, fort trails, and cleaner Sahyadri getaways.
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
            <p className="font-heading text-2xl font-semibold">Quick Access</p>
            <ul className="mt-5 space-y-3 text-sm text-sand-200/78">
              {quickLinks.map((link) => (
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

        <div className="grid gap-12 pt-12 lg:grid-cols-2">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-gold-400">
              Weekend Locations
            </p>
            <div className="mt-6 grid gap-8 sm:grid-cols-2 xl:grid-cols-3">
              {weekendLocationGroups.map((group) => (
                <div key={group.title}>
                  <p className="font-heading text-xl font-semibold text-white">{group.title}</p>
                  <ul className="mt-4 space-y-2.5 text-sm text-sand-200/74">
                    {group.forts.map((fort) => (
                      <li key={fort.slug}>
                        <Link to={`/trips/${fort.slug}`} className="hover:text-forest-500">
                          {fort.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-gold-400">
              Weekday Locations
            </p>
            <div className="mt-6 grid gap-8 sm:grid-cols-2 xl:grid-cols-3">
              {WEEKDAY_LOCATION_GROUPS.map((group) => (
                <div key={group.title}>
                  <p className="font-heading text-xl font-semibold text-white">{group.title}</p>
                  <ul className="mt-4 space-y-2.5 text-sm text-sand-200/74">
                    {group.forts.map((fort) => (
                      <li key={fort.slug}>
                        <Link to={`/trips/${fort.slug}`} className="hover:text-forest-500">
                          {fort.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
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
