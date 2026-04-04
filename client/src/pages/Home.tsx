import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, useInView } from 'framer-motion';
import {
  ArrowRight,
  ArrowLeft,
  CalendarBlank,
  CaretRight,
  Campfire,
  Compass,
  Globe,
  Handshake,
  MagnifyingGlass,
  MapPinLine,
  Mountains,
  Path,
  Play,
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

const heroSlides = [
  {
    image: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=1920',
    tagline: 'Explore the world',
    title: 'Tour Travel &\nAdventure',
    highlight: 'Trekking',
    description: 'Join guided treks across Maharashtra\'s historic forts, lush trails, and monsoon ridges with experienced local leaders.',
  },
  {
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920',
    tagline: 'Discover nature',
    title: 'Mountain Peaks &\nFort',
    highlight: 'Circuits',
    description: 'From Rajgad to Kalsubai, explore dramatic ridge walks and ancient fortifications in the Sahyadri ranges.',
  },
  {
    image: 'https://images.unsplash.com/photo-1534274988757-a28bf1a57c17?w=1920',
    tagline: 'Feel the rain',
    title: 'Monsoon Trails &\nGreen',
    highlight: 'Valleys',
    description: 'Experience the magic of western ghats during the monsoon season with cloud-wrapped peaks and waterfalls.',
  },
];

const aboutFeatures = [
  {
    Icon: Handshake,
    title: 'Trusted Travel Guide',
    description: 'Certified local trek leaders with deep knowledge of Maharashtra\'s trail systems and fort history.',
  },
  {
    Icon: Globe,
    title: 'Personalized Trips',
    description: 'Custom departures built around your group size, preferred dates, and adventure comfort level.',
  },
];

const trekCategories = ['All', 'Weekend', 'Monsoon', 'Night Trek', 'Fort Circuit'] as const;

const destinations = [
  'All Destinations',
  'Rajgad',
  'Torna',
  'Harishchandragad',
  'Kalsubai',
  'Lohagad',
  'Rajmachi',
];

const activityItems = [
  { Icon: Campfire, label: 'Camping' },
  { Icon: Mountains, label: 'Climbing' },
  { Icon: Path, label: 'Hiking' },
  { Icon: Tent, label: 'Night Treks' },
  { Icon: Compass, label: 'Exploration' },
];

const counterStats = [
  { end: 5489, label: 'Happy Traveller', suffix: '', icon: Mountains },
  { end: 100, label: 'Total Positive Reviews', suffix: '%', decimals: 0, icon: Star },
  { end: 190, label: 'Tour Completed', suffix: '+', icon: Trophy },
  { end: 5489, label: 'Awards Winning', suffix: '', icon: Trophy },
];

const destinationCards = [
  {
    name: 'Rajgad',
    tours: '6 tours',
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600',
  },
  {
    name: 'Harishchandragad',
    tours: '4 tours',
    image: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=600',
  },
  {
    name: 'Torna Fort',
    tours: '5 tours',
    image: 'https://images.unsplash.com/photo-1534274988757-a28bf1a57c17?w=600',
  },
  {
    name: 'Kalsubai',
    tours: '3 tours',
    image: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=600',
  },
  {
    name: 'Lohagad',
    tours: '4 tours',
    image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=600',
  },
  {
    name: 'Rajmachi',
    tours: '3 tours',
    image: 'https://images.unsplash.com/photo-1518173946687-a243e2bc1ae0?w=600',
  },
];

const testimonials = [
  {
    name: 'Aarohi Kulkarni',
    role: 'Weekend Traveler',
    quote: 'The whole journey felt more like a boutique expedition than a standard trek booking. Amazing experience from start to end.',
    stars: 5,
    avatar: 'AK',
  },
  {
    name: 'Nikhil Patil',
    role: 'Photography Enthusiast',
    quote: 'The routes, timing, and pacing were perfect. We got amazing views, incredible stories, and zero chaos throughout.',
    stars: 5,
    avatar: 'NP',
  },
  {
    name: 'Ritu Salunkhe',
    role: 'First-time Trekker',
    quote: 'I came in nervous and left planning my next three trips. The confidence-building was real and the guides were fantastic.',
    stars: 5,
    avatar: 'RS',
  },
];

const blogPosts = [
  {
    title: 'The 8 Best Fort Treks Near Pune for Beginners',
    category: 'Trekking',
    date: '02 Apr 2026',
    comments: 3,
    image: 'https://images.unsplash.com/photo-1501854140801-50d01698950b?w=600',
    excerpt: 'Discover the most beginner-friendly fort treks within 3 hours of Pune, complete with route tips and seasonal advice.',
  },
  {
    title: 'Monsoon Trekking Safety: Complete Guide',
    category: 'Safety',
    date: '15 Mar 2026',
    comments: 5,
    image: 'https://images.unsplash.com/photo-1534274988757-a28bf1a57c17?w=600',
    excerpt: 'Essential safety tips for trekking during Maharashtra\'s monsoon season, from gear to route planning.',
  },
  {
    title: 'Night Treks: Experience the Sahyadri After Dark',
    category: 'Adventure',
    date: '28 Feb 2026',
    comments: 2,
    image: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?w=600',
    excerpt: 'Why night treks offer a completely different perspective on the Western Ghats and how to prepare.',
  },
];

/* ─── Animated Counter Hook ─── */

function useCountUp(end: number, duration = 2200, decimals = 0, active = false) {
  const [count, setCount] = useState(0);
  const frameRef = useRef<number | null>(null);

  useEffect(() => {
    if (!active) return;
    const startTime = performance.now();

    function tick(now: number) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      const current = end * eased;
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
  icon: Icon,
}: {
  end: number;
  label: string;
  suffix: string;
  decimals?: number;
  active: boolean;
  icon: React.ComponentType<{ className?: string; weight?: string }>;
}) {
  const value = useCountUp(end, 2200, decimals, active);
  return (
    <div className="rounded-2xl bg-white p-8 text-center shadow-lg">
      <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full border-2 border-dashed border-accent-500/30">
        <Icon className="h-8 w-8 text-accent-500" weight="duotone" />
      </div>
      <p className="text-4xl font-bold text-primary-600 sm:text-5xl">
        {decimals > 0 ? value.toFixed(decimals) : value.toLocaleString('en-IN')}
        {suffix}
      </p>
      <div className="mx-auto my-3 w-12 border-t-2 border-dashed border-accent-500/30" />
      <p className="text-sm font-medium text-dark-500">{label}</p>
    </div>
  );
}

/* ─── Main Component ─── */

export default function Home() {
  const [featuredTrips, setFeaturedTrips] = useState<Trip[]>([]);
  const [heroImages, setHeroImages] = useState<HeroImage[]>([]);
  const [activeCategory, setActiveCategory] = useState<(typeof trekCategories)[number]>('All');
  const [searchDest, setSearchDest] = useState('All Destinations');
  const [currentSlide, setCurrentSlide] = useState(0);
  const navigate = useNavigate();

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

  // Auto-rotate hero slides
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const filteredTrips = useMemo(() => {
    if (activeCategory === 'All') return featuredTrips.slice(0, 8);
    return featuredTrips
      .filter((t) => {
        const cat = activeCategory.toUpperCase().replace(' ', '_');
        return t.category === cat || t.title.toLowerCase().includes(activeCategory.toLowerCase());
      })
      .slice(0, 8);
  }, [featuredTrips, activeCategory]);

  const handleSearch = useCallback(() => {
    const params = new URLSearchParams();
    if (searchDest !== 'All Destinations') params.set('search', searchDest);
    navigate(`/trips${params.toString() ? `?${params.toString()}` : ''}`);
  }, [navigate, searchDest]);

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);

  return (
    <>
      {/* ─── HERO SECTION with Carousel ─── */}
      <section className="relative h-[90vh] min-h-[600px] overflow-hidden">
        {heroSlides.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentSlide ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url(${slide.image})` }}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-dark-900/80 via-dark-900/50 to-transparent" />
          </div>
        ))}

        <div className="relative z-10 flex h-full items-center">
          <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl">
              <motion.p
                key={`tagline-${currentSlide}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="playful-text text-2xl text-primary-400 sm:text-3xl"
              >
                {heroSlides[currentSlide].tagline}
              </motion.p>

              <motion.h1
                key={`title-${currentSlide}`}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="mt-4 text-5xl font-extrabold leading-tight text-white sm:text-6xl lg:text-7xl"
                style={{ whiteSpace: 'pre-line' }}
              >
                {heroSlides[currentSlide].title}{' '}
                <span className="text-primary-400">{heroSlides[currentSlide].highlight}</span>
              </motion.h1>

              <motion.p
                key={`desc-${currentSlide}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="mt-6 max-w-xl text-lg leading-8 text-dark-300"
              >
                {heroSlides[currentSlide].description}
              </motion.p>

              <motion.div
                key={`cta-${currentSlide}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="mt-8 flex flex-wrap items-center gap-4"
              >
                <Link to="/trips">
                  <button className="rounded-lg bg-primary-500 px-8 py-4 text-sm font-bold uppercase tracking-wider text-white transition hover:bg-primary-600 hover:shadow-lg">
                    Let's Get Started
                  </button>
                </Link>
                <Link to="/about" className="flex items-center gap-2 text-sm font-semibold text-white transition hover:text-primary-400">
                  Who we are
                  <span className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-primary-400 text-primary-400">
                    <CaretRight className="h-3.5 w-3.5" weight="bold" />
                  </span>
                </Link>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Slide nav arrows */}
        <button
          onClick={prevSlide}
          className="absolute right-20 top-1/2 z-20 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-sm transition hover:bg-white/40"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-4 top-1/2 z-20 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-sm transition hover:bg-white/40"
        >
          <ArrowRight className="h-5 w-5" />
        </button>

        {/* Slide indicators */}
        <div className="absolute bottom-8 left-1/2 z-20 flex -translate-x-1/2 gap-2">
          {heroSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`h-3 rounded-full transition-all ${
                index === currentSlide ? 'w-8 bg-primary-500' : 'w-3 bg-white/50'
              }`}
            />
          ))}
        </div>

        {/* Booking badge */}
        <div className="absolute right-8 top-32 z-20 hidden lg:block">
          <div className="rounded-xl border border-white/20 bg-dark-900/60 px-6 py-4 text-center backdrop-blur-md">
            <p className="playful-text text-2xl text-white">Booking</p>
          </div>
        </div>
      </section>

      {/* ─── SEARCH BAR ─── */}
      <section className="relative z-20 -mt-12">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="flex flex-col gap-4 rounded-2xl bg-white p-6 shadow-2xl sm:flex-row sm:items-end sm:gap-3"
          >
            <div className="flex-1">
              <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-dark-500">
                <MapPinLine className="mr-1 inline h-3.5 w-3.5" weight="bold" />
                Destination
              </label>
              <select
                value={searchDest}
                onChange={(e) => setSearchDest(e.target.value)}
                className="travel-input"
              >
                {destinations.map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>

            <div className="flex-1">
              <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-dark-500">
                <CalendarBlank className="mr-1 inline h-3.5 w-3.5" weight="bold" />
                When
              </label>
              <input type="date" className="travel-input" />
            </div>

            <div className="flex-1">
              <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-dark-500">
                <UsersThree className="mr-1 inline h-3.5 w-3.5" weight="bold" />
                Guests
              </label>
              <select className="travel-input">
                <option>1 Person</option>
                <option>2 People</option>
                <option>3-5 People</option>
                <option>6-10 People</option>
                <option>10+ People</option>
              </select>
            </div>

            <button
              onClick={handleSearch}
              className="flex items-center justify-center gap-2 rounded-xl bg-primary-500 px-8 py-3.5 text-sm font-bold text-white transition hover:bg-primary-600"
            >
              <MagnifyingGlass className="h-4 w-4" weight="bold" />
              Search
            </button>
          </motion.div>
        </div>
      </section>

      {/* ─── ABOUT / INTRO SECTION ─── */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            <img
              src="https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=800"
              alt="Adventure travel"
              className="w-full rounded-2xl object-cover shadow-xl"
              style={{ height: '500px' }}
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <button className="flex h-20 w-20 items-center justify-center rounded-full bg-primary-500 text-white shadow-2xl transition hover:scale-110 hover:bg-primary-600">
                <Play className="h-8 w-8" weight="fill" />
              </button>
            </div>
            <div className="absolute -bottom-6 -right-6 hidden rounded-2xl bg-white p-4 shadow-xl lg:block">
              <p className="playful-text text-2xl text-primary-500">Enjoy Travel</p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <p className="text-sm font-semibold uppercase tracking-wider text-primary-500">
              Explore the world
            </p>
            <h2 className="mt-3 text-4xl font-bold leading-tight text-dark-900 sm:text-5xl">
              Great Opportunity For{' '}
              <span className="playful-text text-primary-500">Adventure</span> & Travels
            </h2>
            <p className="mt-5 leading-7 text-dark-500">
              Join guided treks across Maharashtra's historic forts and lush monsoon trails.
              We are a professional and reliable adventure company that offers a wide range
              of trekking services to help you explore the Sahyadri ranges.
            </p>

            <div className="mt-8 grid grid-cols-2 gap-6">
              {aboutFeatures.map(({ Icon, title, description }) => (
                <div key={title}>
                  <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-xl bg-primary-50">
                    <Icon className="h-7 w-7 text-primary-500" weight="duotone" />
                  </div>
                  <h3 className="text-lg font-bold text-dark-900">{title}</h3>
                  <p className="mt-1 text-sm leading-6 text-dark-500">{description}</p>
                </div>
              ))}
            </div>

            <div className="mt-8 flex items-center gap-6">
              <Link to="/about">
                <button className="rounded-lg bg-primary-500 px-8 py-3.5 text-sm font-bold uppercase tracking-wider text-white transition hover:bg-primary-600">
                  More About Us
                </button>
              </Link>
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-full bg-primary-500 text-sm font-bold text-white">
                  AT
                </div>
                <div>
                  <p className="font-bold text-dark-900">Alpha Trekkers</p>
                  <p className="text-sm text-primary-500">Founded 2019</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ─── FEATURED TOURS with Category Tabs ─── */}
      <section className="bg-dark-50 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-sm font-semibold uppercase tracking-wider text-primary-500">
              Explore the world
            </p>
            <h2 className="mt-3 text-4xl font-bold text-dark-900 sm:text-5xl">
              Amazing Featured Tour{' '}
              <span className="playful-text text-primary-500">Package</span> The World
            </h2>
          </div>

          <div className="mt-10 flex flex-wrap justify-center gap-3">
            {trekCategories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`vitour-tab ${activeCategory === cat ? 'active' : ''}`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {(filteredTrips.length > 0 ? filteredTrips : featuredTrips.slice(0, 8)).map((trip) => (
              <TripCard key={trip.id} trip={trip} />
            ))}
          </div>

          <div className="mt-10 text-center">
            <Link to="/trips">
              <button className="rounded-lg bg-primary-500 px-8 py-3.5 text-sm font-bold uppercase tracking-wider text-white transition hover:bg-primary-600">
                View All Tours
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* ─── ACTIVITY / ADVENTURE CTA SECTION ─── */}
      <section className="relative overflow-hidden bg-primary-500 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-[1fr_1.2fr] lg:items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative"
            >
              <img
                src="https://images.unsplash.com/photo-1580674684081-7617fbf3d745?w=800"
                alt="Adventure"
                className="h-[400px] w-full rounded-2xl object-cover shadow-xl"
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-white"
            >
              <p className="text-sm font-medium uppercase tracking-wider text-white/80">
                Welcome to Alpha Trekkers
              </p>
              <h2 className="mt-3 text-4xl font-bold leading-tight sm:text-5xl">
                Real Adventure & Enjoy Your Dream Tours
              </h2>

              <div className="mt-8 flex flex-wrap gap-6">
                {activityItems.slice(0, 2).map(({ Icon, label }) => (
                  <div key={label} className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/20">
                      <Icon className="h-6 w-6 text-white" weight="duotone" />
                    </div>
                    <span className="text-base font-semibold">{label}</span>
                  </div>
                ))}
              </div>

              <div className="my-8 border-t border-white/20" />

              <Link to="/trips">
                <button className="flex items-center gap-3 rounded-full bg-dark-800/40 px-8 py-4 text-sm font-bold text-white transition hover:bg-dark-800/60">
                  <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white/10">
                    <ArrowRight className="h-5 w-5" />
                  </span>
                  Get Started Today
                </button>
              </Link>
            </motion.div>
          </div>
        </div>

        <div className="pointer-events-none absolute right-20 top-10 hidden opacity-30 lg:block">
          <svg width="200" height="120" viewBox="0 0 200 120">
            <path d="M10 110 Q50 20 100 60 Q130 80 140 50 Q160 10 190 5" fill="none" stroke="white" strokeWidth="2" strokeDasharray="6 4" />
          </svg>
        </div>
      </section>

      {/* ─── STATS COUNTER SECTION ─── */}
      <section
        ref={counterRef}
        className="counter-section relative overflow-hidden py-24 sm:py-28"
      >
        <div className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center">
              <Mountains className="h-10 w-10 text-white" weight="duotone" />
            </div>
            <h2 className="text-3xl font-bold text-white sm:text-4xl">
              Ready To Adventure And Enjoy Natural
            </h2>
            <p className="mx-auto mt-3 max-w-lg text-white/70">
              Join thousands of happy travelers who have explored Maharashtra's hidden gems with us
            </p>
            <Link to="/contact" className="mt-6 inline-block">
              <button className="rounded-lg border-2 border-white bg-white px-8 py-3 text-sm font-bold uppercase tracking-wider text-primary-600 transition hover:bg-transparent hover:text-white">
                Let's Get Started
              </button>
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
            {counterStats.map(({ end, label, suffix, decimals, icon }) => (
              <CounterCard
                key={label}
                end={end}
                label={label}
                suffix={suffix}
                decimals={decimals}
                active={counterInView}
                icon={icon}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ─── DESTINATIONS SECTION ─── */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-primary-500">
            Top Destinations
          </p>
          <h2 className="mt-3 text-4xl font-bold text-dark-900 sm:text-5xl">
            Checkout Beautiful Places Around{' '}
            <span className="playful-text text-primary-500">Maharashtra</span>
          </h2>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {destinationCards.map((dest) => (
            <motion.div
              key={dest.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              whileHover={{ y: -8 }}
            >
              <Link
                to="/trips"
                className="group relative block h-72 overflow-hidden rounded-2xl"
              >
                <img
                  src={dest.image}
                  alt={dest.name}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-dark-900/70 via-transparent to-transparent" />
                <div className="absolute right-4 top-4 rounded-lg bg-primary-500 px-3 py-1.5 text-xs font-bold text-white">
                  {dest.tours}
                </div>
                <div className="absolute inset-x-0 bottom-0 p-6">
                  <p className="text-2xl font-bold text-white">{dest.name}</p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ─── TESTIMONIALS ─── */}
      <section className="bg-dark-50 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-sm font-semibold uppercase tracking-wider text-primary-500">
              Testimonials
            </p>
            <h2 className="mt-3 text-4xl font-bold text-dark-900 sm:text-5xl">
              What Our <span className="playful-text text-primary-500">Travelers</span> Say
            </h2>
          </div>

          <div className="mt-12 grid gap-8 md:grid-cols-3">
            {testimonials.map((item) => (
              <motion.div
                key={item.name}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45 }}
                className="rounded-2xl bg-white p-8 shadow-lg transition hover:shadow-xl"
              >
                <div className="mb-4 flex gap-1">
                  {Array.from({ length: item.stars }).map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-accent-500" weight="fill" />
                  ))}
                </div>
                <p className="leading-7 text-dark-500">"{item.quote}"</p>
                <div className="mt-6 flex items-center gap-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary-500 text-lg font-bold text-white">
                    {item.avatar}
                  </div>
                  <div>
                    <p className="font-bold text-dark-900">{item.name}</p>
                    <p className="text-sm text-primary-500">{item.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── BLOG SECTION ─── */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-primary-500">
            Our Blog
          </p>
          <h2 className="mt-3 text-4xl font-bold text-dark-900 sm:text-5xl">
            Latest News & Articles From The{' '}
            <span className="playful-text text-primary-500">Blog</span>
          </h2>
        </div>

        <div className="mt-12 grid gap-8 md:grid-cols-3">
          {blogPosts.map((post) => (
            <motion.article
              key={post.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="group overflow-hidden rounded-2xl bg-white shadow-lg transition hover:shadow-xl"
            >
              <div className="relative h-56 overflow-hidden">
                <img
                  src={post.image}
                  alt={post.title}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute left-4 top-4 rounded-lg bg-primary-500 px-3 py-1.5 text-xs font-bold text-white">
                  {post.category}
                </div>
              </div>
              <div className="p-6">
                <div className="mb-3 flex items-center gap-4 text-sm text-dark-400">
                  <span className="flex items-center gap-1">
                    <CalendarBlank className="h-3.5 w-3.5" />
                    {post.date}
                  </span>
                  <span>Comments ({post.comments.toString().padStart(2, '0')})</span>
                </div>
                <h3 className="text-xl font-bold text-dark-900 transition group-hover:text-primary-500">
                  {post.title}
                </h3>
                <p className="mt-2 text-sm leading-6 text-dark-500">{post.excerpt}</p>
                <Link
                  to="/trips"
                  className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-primary-500 transition hover:gap-3"
                >
                  Read More
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </motion.article>
          ))}
        </div>
      </section>
    </>
  );
}
