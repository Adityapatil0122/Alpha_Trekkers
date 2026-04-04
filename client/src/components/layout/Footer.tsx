import { Link } from 'react-router-dom';
import {
  Mountains,
  MapPin,
  Phone,
  EnvelopeSimple,
  InstagramLogo,
  FacebookLogo,
  TwitterLogo,
  YoutubeLogo,
  PaperPlaneTilt,
  Heart,
} from '@phosphor-icons/react';

const quickLinks = [
  { to: '/trips', label: 'All Treks' },
  { to: '/weekend-trips', label: 'Weekend Treks' },
  { to: '/weekday-trips', label: 'Weekday Treks' },
  { to: '/about', label: 'About Us' },
  { to: '/contact', label: 'Contact' },
];

const popularTreks = [
  'Rajgad Fort',
  'Torna Fort',
  'Harishchandragad',
  'Kalsubai Peak',
  'Lohagad Fort',
  'Sinhagad Fort',
];

export default function Footer() {
  return (
    <footer className="relative overflow-hidden bg-gradient-to-b from-forest-900 to-forest-950">
      {/* Top decorative line */}
      <div className="h-1 bg-gradient-to-r from-forest-700 via-forest-500 to-amber-500" />

      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
          {/* About Column */}
          <div>
            <Link to="/" className="mb-6 flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-forest-500/20">
                <Mountains className="h-6 w-6 text-forest-400" weight="duotone" />
              </div>
              <span className="font-heading text-xl font-bold text-white">
                Alpha <span className="text-forest-400">Trekkers</span>
              </span>
            </Link>
            <p className="mb-6 text-sm leading-relaxed text-forest-300/80">
              Discover the untamed beauty of Maharashtra&apos;s historic forts. Expert-led
              treks designed for adventurers of all levels, with safety and
              unforgettable experiences at the heart of everything we do.
            </p>
            <div className="flex gap-3">
              {[
                { Icon: InstagramLogo, href: '#' },
                { Icon: FacebookLogo, href: '#' },
                { Icon: TwitterLogo, href: '#' },
                { Icon: YoutubeLogo, href: '#' },
              ].map(({ Icon, href }, i) => (
                <a
                  key={i}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/5 text-forest-300 transition-all hover:bg-forest-500/20 hover:text-forest-400"
                >
                  <Icon className="h-5 w-5" weight="fill" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="mb-5 font-heading text-lg font-semibold text-white">
              Quick Links
            </h3>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-sm text-forest-300/70 transition-colors hover:text-forest-400"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Popular Treks */}
          <div>
            <h3 className="mb-5 font-heading text-lg font-semibold text-white">
              Popular Treks
            </h3>
            <ul className="space-y-3">
              {popularTreks.map((trek) => (
                <li key={trek}>
                  <Link
                    to="/trips"
                    className="text-sm text-forest-300/70 transition-colors hover:text-forest-400"
                  >
                    {trek}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact + Newsletter */}
          <div>
            <h3 className="mb-5 font-heading text-lg font-semibold text-white">
              Get in Touch
            </h3>
            <ul className="mb-6 space-y-3">
              <li className="flex items-start gap-3 text-sm text-forest-300/70">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-forest-400" />
                Pune, Maharashtra, India
              </li>
              <li className="flex items-center gap-3 text-sm text-forest-300/70">
                <Phone className="h-4 w-4 shrink-0 text-forest-400" />
                +91 98765 43210
              </li>
              <li className="flex items-center gap-3 text-sm text-forest-300/70">
                <EnvelopeSimple className="h-4 w-4 shrink-0 text-forest-400" />
                hello@alphatrekkers.com
              </li>
            </ul>

            {/* Newsletter */}
            <h4 className="mb-3 text-sm font-semibold text-white">
              Subscribe to Newsletter
            </h4>
            <form
              onSubmit={(e) => e.preventDefault()}
              className="flex overflow-hidden rounded-xl border border-forest-700 bg-forest-800/50 focus-within:border-forest-500"
            >
              <input
                type="email"
                placeholder="Your email"
                className="flex-1 bg-transparent px-4 py-2.5 text-sm text-white placeholder:text-forest-500 focus:outline-none"
              />
              <button
                type="submit"
                className="bg-forest-500 px-4 text-white transition-colors hover:bg-forest-400"
              >
                <PaperPlaneTilt className="h-4 w-4" weight="fill" />
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-forest-800">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 py-6 sm:flex-row sm:px-6 lg:px-8">
          <p className="text-xs text-forest-400/60">
            &copy; {new Date().getFullYear()} Alpha Trekkers. All rights reserved.
          </p>
          <p className="flex items-center gap-1 text-xs text-forest-400/60">
            Made with{' '}
            <Heart className="h-3.5 w-3.5 text-red-500" weight="fill" /> in
            Maharashtra
          </p>
        </div>
      </div>
    </footer>
  );
}
