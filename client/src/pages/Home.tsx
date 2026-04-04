import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, useInView } from 'framer-motion';
import {
  ArrowRight,
  CalendarBlank,
  CompassTool,
  MagnifyingGlass,
  MapPinLine,
  MapTrifold,
  ShieldCheck,
  Star,
  Tent,
  Trophy,
  UsersThree,
} from '@phosphor-icons/react';
import { MAHARASHTRA_MONSOON_IMAGES } from '@alpha-trekkers/shared';
import type { ApiResponse, HeroImage, Trip } from '@alpha-trekkers/shared';
import api from '@/lib/axios';
import Button from '@/components/ui/Button';
import TripCard from '@/components/ui/TripCard';

/* ─── Static Data ─── */

const statItems = [
  { Icon: UsersThree, value: '12K+', label: 'Happy Trekkers' },
  { Icon: Star, value: '4.9', label: 'Average Rating' },
  { Icon: MapTrifold, value: '48', label: 'Trail Routes' },
  { Icon: Trophy, value: '365', label: 'Days Supported' },
];

const featureItems = [
  {
    Icon: ShieldCheck,
    title: 'Operationally safe',
    description:
      'Certified trek leaders, weather-aware departures, and emergency-first route planning.',
  },
  {
    Icon: CompassTool,
    title: 'Curated itineraries',
    description:
      'From sunrise fort climbs to monsoon ridge walks, every departure is paced around real trail conditions and group comfort.',
  },
  {
    Icon: Tent,
    title: 'Comfort in the wild',
    description:
      'Transport support, briefing flow, and on-ground coordination that feel premium without losing adventure.',
  },
];

const categoryTiles = [
  {
    title: 'Weekend Escapes',
    subtitle: 'Quick departures built for Friday night to Sunday return.',
    to: '/weekend-trips',
    image: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=800',
  },
  {
    title: 'Fort Circuits',
    subtitle: 'Historic ridge routes with strong storytelling and mountain context.',
    to: '/trips',
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800',
  },
  {
    title: 'Monsoon Trails',
    subtitle: 'Cloudbanks, green valleys, and dramatic seasonal terrain.',
    to: '/trips?category=MONSOON',
    image: 'https://images.unsplash.com/photo-1534274988757-a28bf1a57c17?w=800',
  },
];

const testimonials = [
  {
    name: 'Aarohi Kulkarni',
    role: 'Weekend traveler',
    quote: 'The whole journey felt more like a boutique expedition than a standard trek booking.',
    stars: 5,
    color: 'bg-forest-500',
  },
  {
    name: 'Nikhil Patil',
    role: 'Photography enthusiast',
    quote: 'The routes, timing, and pacing were perfect. We got views, stories, and zero chaos.',
    stars: 5,
    color: 'bg-gold-500',
  },
  {
    name: 'Ritu Salunkhe',
    role: 'First-time trekker',
    quote: 'I came in nervous and left planning my next three trips. The confidence-building was real.',
    stars: 4,
    color: 'bg-coral-500',
  },
];

const galleryImages = [
  'https://images.unsplash.com/photo-1580674684081-7617fbf3d745?w=400',
  'https://images.unsplash.com/photo-1501854140801-50d01698950b?w=400',
  'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400',
  'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=400',
  'https://images.unsplash.com/photo-1518173946687-a243e2bc1ae0?w=400',
  'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?w=400',
];

const counterStats = [
  { end: 5489, label: 'Happy Trekkers', suffix: '' },
  { end: 99.9, label: 'Positive Reviews', suffix: '%', decimals: 1 },
  { end: 190, label: 'Treks Done', suffix: '' },
  { end: 48, label: 'Fort Routes', suffix: '' },
];

const trekCategories = ['All', 'Weekend', 'Monsoon', 'Night Trek'] as const;

const destinations = [
  'All Destinations',
  'Rajgad',
  'Torna',
  'Harishchandragad',
  'Kalsubai',
  'Lohagad',
  'Rajmachi',
];

/* ─── Animated Counter Hook ─── */

function useCountUp(end: number, duration = 2200, decimals = 0, active = false) {
  const [count, setCount] = useState(0);
  const frameRef = useRef<number | null>(null);

  useEffect(() => {
    if (!active) return;
    const start = 0;
    const startTime = performance.now();

    function tick(now: number) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // easeOutExpo
      const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      const current = start + (end - start) * eased;
      setCount(Number(current.toFixed(decimals)));
      if (progress < 1) {
        frameRef.current = requestAnimationFrame(tick);
      }
    }

    frameRef.current = requestAnimationFrame(tick);
    return () => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
    };
  }, [active, end, duration, decimals]);

  return count;
}

function CounterCard({
  end,
  label,
  suffix,
  decimals = 0,
  active,
}: {
  end: number;
  label: string;
  suffix: string;
  decimals?: number;
  active: boolean;
}) {
  const value = useCountUp(end, 2200, decimals, active);
  return (
    <div className="text-center">
      <p className="font-heading text-5xl leading-none text-white sm:text-6xl">
        {decimals > 0 ? value.toFixed(decimals) : value.toLocaleString('en-IN')}
        <span className="text-gold-400">{suffix}</span>
      </p>
      <p className="playful-text mt-3 text-xl text-sand-200/90 sm:text-2xl">{label}</p>
    </div>
  );
}

/* ─── Section Heading ─── */

function SectionHeading({
  label,
  title,
  copy,
  playfulSubtitle,
}: {
  label: string;
  title: string;
  copy: string;
  playfulSubtitle?: string;
}) {
  return (
    <div className="max-w-3xl">
      <span className="section-label">{label}</span>
      {playfulSubtitle && (
        <p className="playful-text mt-3 text-2xl text-forest-500">{playfulSubtitle}</p>
      )}
      <h2 className="mt-5 font-heading text-4xl leading-tight text-ink-900 sm:text-5xl">{title}</h2>
      <p className="mt-4 text-base leading-8 text-ink-700/72">{copy}</p>
    </div>
  );
}

/* ─── Main Component ─── */

export default function Home() {
  const [featuredTrips, setFeaturedTrips] = useState<Trip[]>([]);
  const [heroImages, setHeroImages] = useState<HeroImage[]>([]);
  const [activeCategory, setActiveCategory] = useState<(typeof trekCategories)[number]>('All');
  const [searchDest, setSearchDest] = useState('All Destinations');
  const navigate = useNavigate();

  // Counter intersection observer
  const counterRef = useRef<HTMLDivElement>(null);
  const counterInView = useInView(counterRef, { once: true, amount: 0.4 });

  useEffect(() => {
    api
      .get<ApiResponse<{ trips: Trip[] }>>('/trips/featured')
      .then((response) => setFeaturedTrips(response.data.data.trips))
      .catch(() => setFeaturedTrips([]));
  }, []);

  useEffect(() => {
    api
      .get<ApiResponse<{ heroImages: HeroImage[] }>>('/site/hero-images')
      .then((response) => setHeroImages(response.data.data.heroImages))
      .catch(() => setHeroImages([]));
  }, []);

  const spotlightTrip = useMemo(() => featuredTrips[0] ?? null, [featuredTrips]);
  const activeHero = useMemo(() => heroImages[0] ?? null, [heroImages]);
  const heroBackground = activeHero?.url ?? MAHARASHTRA_MONSOON_IMAGES.heroes.home;
  const heroTitle = activeHero?.title ?? 'Trek the real Sahyadri ranges of Maharashtra.';
  const heroSubtitle =
    activeHero?.subtitle ??
    'Join weekend fort climbs, monsoon trails, and sunrise departures led by teams who know these mountains on the ground. From Rajgad and Torna to Harishchandragad and Kalsubai, every trip is built for a strong route, safe pacing, and a better day out.';
  const heroPrimaryActionLink =
    activeHero?.ctaLink && activeHero.ctaLink.startsWith('/') ? activeHero.ctaLink : '/trips';
  const heroPrimaryActionText = activeHero?.ctaText ?? 'Explore treks';

  const filteredTrips = useMemo(() => {
    if (activeCategory === 'All') return featuredTrips.slice(0, 6);
    return featuredTrips
      .filter((t) => {
        const cat = activeCategory.toUpperCase().replace(' ', '_');
        return t.category === cat || t.title.toLowerCase().includes(activeCategory.toLowerCase());
      })
      .slice(0, 6);
  }, [featuredTrips, activeCategory]);

  const handleSearch = useCallback(() => {
    const params = new URLSearchParams();
    if (searchDest !== 'All Destinations') params.set('search', searchDest);
    navigate(`/trips${params.toString() ? `?${params.toString()}` : ''}`);
  }, [navigate, searchDest]);

  return (
    <>
      {/* ─── HERO SECTION ─── */}
      <section className="relative overflow-hidden pt-24 lg:pt-36">
        {/* Background image */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${heroBackground})` }}
        />
        {/* Dramatic gradient overlay */}
        <div className="hero-sheen absolute inset-0" />
        {/* Rain overlay effect */}
        <div className="hero-rain-overlay absolute inset-0" />

        {/* Floating mist elements */}
        <div
          className="pointer-events-none absolute inset-0 z-[2]"
          aria-hidden="true"
        >
          <div
            className="absolute bottom-0 left-0 h-40 w-[120%] opacity-30"
            style={{
              background:
                'linear-gradient(to top, rgba(244,248,246,0.4), transparent)',
              animation: 'mist-drift 8s ease-in-out infinite',
            }}
          />
          <div
            className="absolute bottom-12 left-[10%] h-28 w-[80%] opacity-20"
            style={{
              background:
                'radial-gradient(ellipse, rgba(255,255,255,0.3), transparent 70%)',
              animation: 'mist-drift 12s ease-in-out infinite reverse',
            }}
          />
        </div>

        <div className="relative z-10 mx-auto max-w-7xl px-4 pb-36 pt-16 sm:px-6 lg:px-8 lg:pb-44">
          <div className="max-w-4xl">
            {/* Animated badge pills */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="flex flex-wrap gap-2"
            >
              <span className="section-label !bg-white/10 !text-sand-100 before:!bg-gold-400">
                Guided Sahyadri Treks
              </span>
              <span className="inline-flex items-center rounded-full border border-white/14 bg-white/10 px-3 py-1.5 text-xs font-semibold uppercase tracking-widest text-gold-400">
                Monsoon Season 2026
              </span>
            </motion.div>

            {/* Playful Caveat subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15, duration: 0.5 }}
              className="playful-text mt-5 text-2xl text-gold-400/90 sm:text-3xl"
            >
              Where clouds meet ancient forts...
            </motion.p>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25, duration: 0.6 }}
              className="mt-4 font-heading text-5xl leading-[0.92] text-white sm:text-6xl lg:text-8xl"
            >
              {heroTitle}
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="mt-6 max-w-3xl text-lg leading-8 text-sand-100/82"
            >
              {heroSubtitle}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.55, duration: 0.5 }}
              className="mt-9 flex flex-col gap-4 sm:flex-row"
            >
              <Link to={heroPrimaryActionLink}>
                <Button size="lg" variant="accent" rightIcon={<ArrowRight className="h-5 w-5" />}>
                  {heroPrimaryActionText}
                </Button>
              </Link>
              <Link to="/contact">
                <Button
                  size="lg"
                  variant="secondary"
                  className="border-white/20 bg-white/10 text-white hover:bg-white/16 hover:text-white"
                >
                  Talk to our team
                </Button>
              </Link>
            </motion.div>

            {/* Animated badge pills row */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7, duration: 0.5 }}
              className="mt-8 flex flex-wrap gap-3 text-sm font-medium text-sand-100/86"
            >
              {[
                'Fort treks across Maharashtra',
                'Weekend and night departures',
                'Local trek leaders and support',
              ].map((badge, i) => (
                <motion.span
                  key={badge}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.75 + i * 0.1 }}
                  className="rounded-full border border-white/14 bg-white/10 px-4 py-2 backdrop-blur-sm"
                >
                  {badge}
                </motion.span>
              ))}
            </motion.div>
          </div>
        </div>

        {/* Search/filter quick-bar overlay */}
        <div className="absolute inset-x-0 bottom-0 z-20 translate-y-1/2">
          <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9, duration: 0.5 }}
              className="mist-glass flex flex-col gap-4 rounded-[1.5rem] p-4 shadow-2xl sm:flex-row sm:items-center sm:gap-3 sm:p-5"
            >
              <div className="flex-1">
                <label className="mb-1 block text-xs font-semibold uppercase tracking-widest text-forest-600">
                  <MapPinLine className="mr-1 inline h-3.5 w-3.5" weight="bold" />
                  Destination
                </label>
                <select
                  value={searchDest}
                  onChange={(e) => setSearchDest(e.target.value)}
                  className="travel-input !rounded-xl !py-2.5"
                >
                  {destinations.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex-1">
                <label className="mb-1 block text-xs font-semibold uppercase tracking-widest text-forest-600">
                  <CalendarBlank className="mr-1 inline h-3.5 w-3.5" weight="bold" />
                  When
                </label>
                <input
                  type="date"
                  className="travel-input !rounded-xl !py-2.5"
                  placeholder="Pick a date"
                />
              </div>

              <div className="flex items-end sm:self-end">
                <button
                  onClick={handleSearch}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-forest-500 px-8 py-3 text-sm font-semibold text-white transition hover:bg-forest-600 sm:w-auto"
                >
                  <MagnifyingGlass className="h-4 w-4" weight="bold" />
                  Search Treks
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ─── STATS SECTION ─── */}
      <div className="relative z-20 mt-8 sm:mt-4">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div
            className="grid gap-6 md:grid-cols-2 xl:grid-cols-4"
            style={{
              backgroundImage:
                'radial-gradient(circle at 30% 50%, rgba(26,92,58,0.04), transparent 60%)',
            }}
          >
            {statItems.map(({ Icon, value, label }) => (
              <div key={label} className="stat-card rounded-[2rem] p-5 sm:p-6">
                <div className="stat-card__inner rounded-[1.7rem] px-6 py-8 text-center">
                  <div className="stat-card__icon mx-auto">
                    <div className="stat-card__icon-inner flex h-18 w-18 items-center justify-center rounded-full bg-gold-500/10 text-gold-500">
                      <Icon className="h-9 w-9" weight="duotone" />
                    </div>
                  </div>
                  <p className="mt-6 text-5xl font-semibold leading-none text-forest-600">
                    {value}
                  </p>
                  <div className="mx-auto mt-5 h-px w-14 bg-[linear-gradient(90deg,rgba(223,157,53,0),rgba(223,157,53,0.95),rgba(223,157,53,0))]" />
                  <p className="playful-text mx-auto mt-5 max-w-[10rem] text-2xl font-semibold leading-8 text-ink-900">
                    {label}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ─── WHY CHOOSE US SECTION ─── */}
      <section className="mx-auto max-w-7xl px-4 py-[4.5rem] sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-start">
          <div>
            <SectionHeading
              label="Why Trekkers Choose Us"
              playfulSubtitle="Why Trek With Us?"
              title="Guided departures built for the way people actually trek in Maharashtra."
              copy="You need clear coordination, dependable leaders, and routes that match the season. We focus on planning, support, and pacing so the experience stays smooth from pickup to descent."
            />

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.55, ease: 'easeOut' }}
              className="relative mt-8 overflow-hidden rounded-[2.3rem]"
            >
              <img
                src={MAHARASHTRA_MONSOON_IMAGES.sections.chooseUsRange}
                alt="Rainy Sahyadri mountain range at Bhimashankar, Maharashtra"
                className="h-[24rem] w-full object-cover sm:h-[27rem]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink-950 via-ink-950/18 to-transparent" />
              <div className="absolute left-5 top-5 rounded-full border border-white/16 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-sand-100 backdrop-blur-sm">
                Bhimashankar Monsoon Range
              </div>
              <div className="absolute inset-x-0 bottom-0 p-6 sm:p-7">
                <p className="text-xs uppercase tracking-[0.18em] text-gold-400">
                  Real Maharashtra terrain
                </p>
                <h3 className="mt-3 max-w-xl font-heading text-4xl leading-tight text-white">
                  Cloud-wrapped Sahyadri ridges set the tone for the journeys we run.
                </h3>
                <p className="mt-3 max-w-xl text-sm leading-7 text-sand-100/74">
                  Route timing, leader pacing, and seasonal choices are built around the actual
                  mountain conditions people face during the rains.
                </p>
              </div>
            </motion.div>

            {/* Info panels with rain-drop decorative elements */}
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <div className="travel-panel relative overflow-hidden rounded-[1.7rem] p-5">
                {/* Rain-drop decoration */}
                <div
                  className="pointer-events-none absolute right-3 top-3 h-2 w-2 rounded-full bg-forest-500/20"
                  aria-hidden="true"
                />
                <div
                  className="pointer-events-none absolute right-8 top-6 h-1.5 w-1.5 rounded-full bg-forest-500/15"
                  aria-hidden="true"
                />
                <div
                  className="pointer-events-none absolute right-5 top-10 h-1 w-1 rounded-full bg-forest-500/10"
                  aria-hidden="true"
                />
                <p className="text-xs uppercase tracking-[0.18em] text-forest-600">
                  Season-aware planning
                </p>
                <p className="mt-3 font-heading text-3xl text-ink-900">
                  Monsoon-ready routes, not generic templates.
                </p>
              </div>
              <div className="travel-panel relative overflow-hidden rounded-[1.7rem] p-5">
                <div
                  className="pointer-events-none absolute right-3 top-3 h-2 w-2 rounded-full bg-forest-500/20"
                  aria-hidden="true"
                />
                <div
                  className="pointer-events-none absolute right-8 top-6 h-1.5 w-1.5 rounded-full bg-forest-500/15"
                  aria-hidden="true"
                />
                <p className="text-xs uppercase tracking-[0.18em] text-forest-600">Ground truth</p>
                <p className="mt-3 text-sm leading-7 text-ink-700/72">
                  Pickup flow, trail rhythm, and weather response are shaped around Maharashtra forts
                  and ridges specifically.
                </p>
              </div>
            </div>
          </div>

          {/* Feature cards */}
          <div className="grid gap-4">
            {featureItems.map(({ Icon, title, description }) => (
              <div key={title} className="travel-panel rounded-[1.75rem] p-6">
                <div className="flex items-start gap-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-forest-500/10">
                    <Icon className="h-7 w-7 text-forest-600" weight="duotone" />
                  </div>
                  <div>
                    <h3 className="font-heading text-3xl text-ink-900">{title}</h3>
                    <p className="mt-2 text-sm leading-7 text-ink-700/72">{description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FEATURED TOURS with Category Tabs ─── */}
      <section className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <SectionHeading
            label="Featured Tours"
            playfulSubtitle="Handpicked adventures await..."
            title="Popular treks across forts, ridges, and high peaks."
            copy="Browse the departures people book most often, with fixed schedules, route details, and transparent pricing."
          />
          <Link to="/trips">
            <Button variant="secondary" rightIcon={<ArrowRight className="h-4 w-4" />}>
              View complete collection
            </Button>
          </Link>
        </div>

        {/* Category tab switcher */}
        <div className="mt-8 flex flex-wrap gap-2">
          {trekCategories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`rounded-full px-5 py-2.5 text-sm font-semibold transition ${
                activeCategory === cat
                  ? 'bg-forest-500 text-white shadow-lg shadow-forest-500/25'
                  : 'bg-sand-50 text-ink-700 hover:bg-sand-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {(filteredTrips.length > 0 ? filteredTrips : featuredTrips.slice(0, 6)).map((trip) => (
            <TripCard key={trip.id} trip={trip} />
          ))}
        </div>
      </section>

      {/* ─── CATEGORY TILES with Misty Overlay ─── */}
      <section className="mx-auto max-w-7xl px-4 py-[4.5rem] sm:px-6 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-3">
          {categoryTiles.map((tile) => (
            <Link
              key={tile.title}
              to={tile.to}
              className="group relative min-h-[25rem] overflow-hidden rounded-[2rem]"
            >
              <img
                src={tile.image}
                alt={tile.title}
                className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105"
              />
              {/* Misty overlay effect */}
              <div className="absolute inset-0 bg-gradient-to-t from-ink-950 via-ink-950/35 to-transparent" />
              <div
                className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                style={{
                  background:
                    'linear-gradient(to top, transparent 30%, rgba(244,248,246,0.12) 70%, rgba(244,248,246,0.18) 100%)',
                }}
              />
              <div className="absolute inset-x-0 bottom-0 p-7">
                <span className="section-label !bg-white/10 !text-sand-100 before:!bg-gold-400">
                  Trek category
                </span>
                <h3 className="mt-5 font-heading text-4xl text-white">{tile.title}</h3>
                <p className="mt-3 max-w-sm text-sm leading-7 text-sand-100/78">{tile.subtitle}</p>
                <span className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-gold-400">
                  See departures <ArrowRight className="h-4 w-4" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ─── SPOTLIGHT TRIP with Mist-Glass & Rain Pattern ─── */}
      {spotlightTrip ? (
        <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="travel-dark relative overflow-hidden rounded-[2.5rem]">
            {/* Rain pattern background */}
            <div
              className="pointer-events-none absolute inset-0 opacity-30"
              aria-hidden="true"
              style={{
                backgroundImage:
                  'repeating-linear-gradient(transparent, transparent 6px, rgba(255,255,255,0.02) 6px, rgba(255,255,255,0.02) 7px)',
                animation: 'rain-fall 1.2s linear infinite',
              }}
            />
            <div className="relative grid gap-0 lg:grid-cols-[0.95fr_1.05fr]">
              <img
                src={
                  spotlightTrip.images[0]?.url ??
                  MAHARASHTRA_MONSOON_IMAGES.fallback.tripDetail
                }
                alt={spotlightTrip.title}
                className="h-full min-h-[22rem] w-full object-cover"
              />
              <div className="mist-glass !border-0 !bg-transparent p-8 sm:p-10 lg:p-12">
                <span className="section-label !bg-white/10 !text-sand-100 before:!bg-gold-400">
                  Spotlight Departure
                </span>
                <p className="playful-text mt-3 text-xl text-gold-400/80">
                  Our top pick this season
                </p>
                <h2 className="mt-4 font-heading text-5xl leading-tight text-white">
                  {spotlightTrip.title}
                </h2>
                <p className="mt-4 text-base leading-8 text-sand-200/72">
                  {spotlightTrip.description}
                </p>
                <div className="mt-8 grid gap-4 sm:grid-cols-2">
                  <div className="rounded-[1.5rem] border border-white/12 bg-white/8 p-5 text-sand-100 backdrop-blur-sm">
                    <p className="text-xs uppercase tracking-[0.18em] text-gold-400">Duration</p>
                    <p className="mt-2 font-heading text-3xl">
                      {spotlightTrip.durationHours} hours
                    </p>
                  </div>
                  <div className="rounded-[1.5rem] border border-white/12 bg-white/8 p-5 text-sand-100 backdrop-blur-sm">
                    <p className="text-xs uppercase tracking-[0.18em] text-gold-400">
                      Starting from
                    </p>
                    <p className="mt-2 font-heading text-3xl">
                      INR{' '}
                      {(
                        spotlightTrip.discountPrice ?? spotlightTrip.basePrice
                      ).toLocaleString('en-IN')}
                    </p>
                  </div>
                </div>
                <div className="mt-8">
                  <Link to={`/trips/${spotlightTrip.slug}`}>
                    <Button
                      variant="accent"
                      size="lg"
                      rightIcon={<ArrowRight className="h-5 w-5" />}
                    >
                      Open tour detail
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      ) : null}

      {/* ─── INSTAGRAM-STYLE MONSOON GALLERY ─── */}
      <section className="mx-auto max-w-7xl px-4 py-[4.5rem] sm:px-6 lg:px-8">
        <div className="text-center">
          <span className="section-label">Monsoon Gallery</span>
          <p className="playful-text mt-3 text-2xl text-forest-500">
            Through the lens of the Western Ghats
          </p>
          <h2 className="mt-4 font-heading text-4xl leading-tight text-ink-900 sm:text-5xl">
            Scenes from the trail
          </h2>
        </div>

        <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:gap-4">
          {galleryImages.map((src, i) => (
            <motion.div
              key={src}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, duration: 0.4 }}
              className="group relative aspect-square overflow-hidden rounded-2xl"
            >
              <img
                src={src}
                alt={`Monsoon trail scene ${i + 1}`}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-ink-950/0 transition-colors duration-300 group-hover:bg-ink-950/20" />
              {/* Misty hover overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-forest-700/40 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            </motion.div>
          ))}
        </div>
      </section>

      {/* ─── ANIMATED STATS COUNTER BAR ─── */}
      <section
        ref={counterRef}
        className="monsoon-gradient relative overflow-hidden py-16 sm:py-20"
      >
        {/* Rain pattern overlay */}
        <div
          className="pointer-events-none absolute inset-0 opacity-20"
          aria-hidden="true"
          style={{
            backgroundImage:
              'repeating-linear-gradient(transparent, transparent 4px, rgba(255,255,255,0.03) 4px, rgba(255,255,255,0.03) 5px)',
            animation: 'rain-fall 0.9s linear infinite',
          }}
        />
        <div className="relative mx-auto grid max-w-6xl grid-cols-2 gap-8 px-4 sm:px-6 md:grid-cols-4 lg:gap-12 lg:px-8">
          {counterStats.map(({ end, label, suffix, decimals }) => (
            <CounterCard
              key={label}
              end={end}
              label={label}
              suffix={suffix}
              decimals={decimals}
              active={counterInView}
            />
          ))}
        </div>
      </section>

      {/* ─── TESTIMONIALS ─── */}
      <section className="mx-auto max-w-7xl px-4 py-[4.5rem] sm:px-6 lg:px-8">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <SectionHeading
            label="Guest Stories"
            playfulSubtitle="Real voices, real trails..."
            title="What trekkers say after traveling with Alpha Trekkers."
            copy="The details that matter are simple: the route runs well, the team stays prepared, and people come back ready for the next one."
          />
          <div className="flex items-center gap-2 text-gold-500">
            {Array.from({ length: 5 }).map((_, index) => (
              <Star key={index} className="h-5 w-5" weight="fill" />
            ))}
          </div>
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-3">
          {testimonials.map((item) => (
            <motion.div
              key={item.name}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45 }}
              className="travel-panel relative rounded-[2rem] p-7"
            >
              {/* Quote mark decoration */}
              <span
                className="playful-text absolute right-6 top-4 text-6xl leading-none text-forest-500/10"
                aria-hidden="true"
              >
                &ldquo;
              </span>

              {/* Star rating */}
              <div className="mb-4 flex gap-1">
                {Array.from({ length: item.stars }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 text-gold-500" weight="fill" />
                ))}
                {Array.from({ length: 5 - item.stars }).map((_, i) => (
                  <Star key={`e-${i}`} className="h-4 w-4 text-sand-200" weight="regular" />
                ))}
              </div>

              <p className="text-lg leading-8 text-ink-700/78">&ldquo;{item.quote}&rdquo;</p>

              <div className="mt-8 flex items-center gap-4">
                {/* Avatar circle with colored initials */}
                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-full text-lg font-bold text-white ${item.color}`}
                >
                  {item.name
                    .split(' ')
                    .map((n) => n[0])
                    .join('')}
                </div>
                <div>
                  <p className="font-heading text-2xl text-ink-900">{item.name}</p>
                  <p className="text-sm uppercase tracking-[0.16em] text-forest-600">
                    {item.role}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>
    </>
  );
}
