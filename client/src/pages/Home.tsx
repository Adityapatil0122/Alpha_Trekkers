import { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion, useInView } from 'framer-motion';
import {
  ArrowRight,
  ArrowLeft,
  Bus,
  CalendarBlank,
  CaretRight,
  Globe,
  Handshake,
  Mountains,
  Star,
  Trophy,
} from '@phosphor-icons/react';
import type { IconProps } from '@phosphor-icons/react';
import { MAHARASHTRA_MONSOON_IMAGES } from '@alpha-trekkers/shared';
import type { ApiResponse, Trip } from '@alpha-trekkers/shared';
import api from '@/lib/axios';
import TripCard from '@/components/ui/TripCard';

/* ─── Static Data ─── */

const heroSlides = [
  {
    image: MAHARASHTRA_MONSOON_IMAGES.trips.lohagad[0],
    tagline: 'Explore the world',
    title: 'Tour Travel &\nAdventure',
    highlight: 'Trekking',
    description: 'Join guided treks across Maharashtra\'s historic forts, lush trails, and monsoon ridges with experienced local leaders.',
  },
  {
    image: MAHARASHTRA_MONSOON_IMAGES.trips.kalsubai[0],
    tagline: 'Discover nature',
    title: 'Mountain Peaks &\nFort',
    highlight: 'Circuits',
    description: 'From Rajgad to Kalsubai, explore dramatic ridge walks and ancient fortifications in the Sahyadri ranges.',
  },
  {
    image: MAHARASHTRA_MONSOON_IMAGES.trips.torna[0],
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
    image: '/destinations/rajgad.png',
    cardClass: 'lg:mt-8',
    imageWrapClass: 'h-[16rem] sm:h-[18rem] lg:h-[15rem] xl:h-[16rem]',
    imageClass: 'object-center',
  },
  {
    name: 'Harishchandragad',
    tours: '4 tours',
    image: '/destinations/harishchandragad.png',
    cardClass: 'lg:mt-14',
    imageWrapClass: 'h-[18rem] sm:h-[20rem] lg:h-[18rem] xl:h-[19rem]',
    imageClass: 'object-center',
  },
  {
    name: 'Torna Fort',
    tours: '5 tours',
    image: '/destinations/torna.png',
    cardClass: 'lg:mt-8',
    imageWrapClass: 'h-[16rem] sm:h-[18rem] lg:h-[15rem] xl:h-[16rem]',
    imageClass: 'object-center',
  },
  {
    name: 'Kalsubai',
    tours: '3 tours',
    image: '/destinations/kalsubai.png',
    cardClass: 'lg:mt-14',
    imageWrapClass: 'h-[18rem] sm:h-[20rem] lg:h-[18rem] xl:h-[19rem]',
    imageClass: 'object-center',
  },
  {
    name: 'Lohagad',
    tours: '4 tours',
    image: '/destinations/lohagad.png',
    cardClass: 'lg:mt-8',
    imageWrapClass: 'h-[16rem] sm:h-[18rem] lg:h-[15rem] xl:h-[16rem]',
    imageClass: 'object-center',
  },
  {
    name: 'Rajmachi',
    tours: '3 tours',
    image: '/destinations/rajmachi.png',
    cardClass: 'lg:mt-14',
    imageWrapClass: 'h-[18rem] sm:h-[20rem] lg:h-[18rem] xl:h-[19rem]',
    imageClass: 'object-center',
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
    title: 'Monsoon Trekking Safety: Complete Guide',
    category: 'Safety',
    date: '15 Mar 2026',
    comments: 5,
    image: MAHARASHTRA_MONSOON_IMAGES.sections.monsoonTrails,
    excerpt: 'Essential safety tips for trekking during Maharashtra\'s monsoon season, from gear to route planning.',
  },
  {
    title: 'The 8 Best Fort Treks Near Pune for Beginners',
    category: 'Trekking',
    date: '02 Apr 2026',
    comments: 3,
    image: MAHARASHTRA_MONSOON_IMAGES.sections.chooseUsRange,
    excerpt: 'Discover the most beginner-friendly fort treks within 3 hours of Pune, complete with route tips and seasonal advice.',
  },
  {
    title: 'Night Treks: Experience the Sahyadri After Dark',
    category: 'Adventure',
    date: '28 Feb 2026',
    comments: 2,
    image: MAHARASHTRA_MONSOON_IMAGES.trips.rajmachi[0],
    excerpt: 'Why night treks offer a completely different perspective on the Western Ghats and how to prepare.',
  },
];

const FEATURED_PAGE_SIZE = 4;
const HERO_AUTOPLAY_DELAY = 6500;
const siteLogo = '/destinations/alogo.jpg';

const heroImageVariants = {
  enter: (direction: number) => ({
    opacity: 0.65,
    scale: 1.12,
    x: direction > 0 ? '18%' : '-18%',
  }),
  center: {
    opacity: 1,
    scale: 1,
    x: '0%',
    transition: {
      duration: 1.15,
      ease: [0.22, 1, 0.36, 1],
    },
  },
  exit: (direction: number) => ({
    opacity: 0.45,
    scale: 1.04,
    x: direction > 0 ? '-14%' : '14%',
    transition: {
      duration: 1.05,
      ease: [0.4, 0, 0.2, 1],
    },
  }),
};

const heroContentVariants = {
  enter: (direction: number) => ({
    opacity: 0,
    x: direction > 0 ? 88 : -88,
  }),
  center: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.72,
      ease: [0.22, 1, 0.36, 1],
      staggerChildren: 0.12,
      delayChildren: 0.14,
    },
  },
  exit: (direction: number) => ({
    opacity: 0,
    x: direction > 0 ? -68 : 68,
    transition: {
      duration: 0.42,
      ease: [0.4, 0, 1, 1],
      staggerChildren: 0.05,
      staggerDirection: -1,
    },
  }),
};

const heroContentItemVariants = {
  enter: (direction: number) => ({
    opacity: 0,
    x: direction > 0 ? 40 : -40,
    y: 14,
  }),
  center: {
    opacity: 1,
    x: 0,
    y: 0,
    transition: {
      duration: 0.62,
      ease: [0.22, 1, 0.36, 1],
    },
  },
  exit: (direction: number) => ({
    opacity: 0,
    x: direction > 0 ? -28 : 28,
    y: -10,
    transition: {
      duration: 0.3,
      ease: [0.4, 0, 1, 1],
    },
  }),
};

const featuredPageVariants = {
  enter: (direction: number) => ({
    opacity: 0,
    x: direction > 0 ? 72 : -72,
    scale: 0.985,
  }),
  center: {
    opacity: 1,
    x: 0,
    scale: 1,
    transition: {
      duration: 0.58,
      ease: [0.22, 1, 0.36, 1],
      staggerChildren: 0.08,
      delayChildren: 0.04,
    },
  },
  exit: (direction: number) => ({
    opacity: 0,
    x: direction > 0 ? -56 : 56,
    scale: 0.985,
    transition: {
      duration: 0.38,
      ease: [0.4, 0, 1, 1],
    },
  }),
};

const featuredCardVariants = {
  enter: {
    opacity: 0,
    y: 20,
  },
  center: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.44,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};


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
  icon: React.ComponentType<IconProps>;
}) {
  const value = useCountUp(end, 2200, decimals, active);
  return (
    <div className="flex h-full flex-col rounded-[2rem] border border-white/15 bg-black/30 p-8 text-center shadow-[0_28px_70px_rgba(0,0,0,0.32)] backdrop-blur-sm">
      <div className="mx-auto mb-6 flex h-18 w-18 items-center justify-center rounded-full border border-primary-500/50">
        <Icon className="h-8 w-8 text-accent-500" weight="duotone" />
      </div>
      <p className="text-4xl font-bold text-primary-400 sm:text-5xl">
        {decimals > 0 ? value.toFixed(decimals) : value.toLocaleString('en-IN')}
        {suffix}
      </p>
      <div className="mx-auto my-5 w-14 border-t-2 border-primary-500/60" />
      <p className="mt-auto text-sm font-medium text-white">{label}</p>
    </div>
  );
}

/* ─── Main Component ─── */

export default function Home() {
  const [featuredTrips, setFeaturedTrips] = useState<Trip[]>([]);
  const [activeCategory, setActiveCategory] = useState<(typeof trekCategories)[number]>('All');
  const [featuredStart, setFeaturedStart] = useState(0);
  const [featuredDirection, setFeaturedDirection] = useState(1);
  const [heroDirection, setHeroDirection] = useState(1);
  const [currentSlide, setCurrentSlide] = useState(0);

  const counterRef = useRef<HTMLDivElement>(null);
  const counterInView = useInView(counterRef, { once: true, amount: 0.4 });

  useEffect(() => {
    api
      .get<ApiResponse<{ trips: Trip[] }>>('/trips/featured')
      .then((response) => setFeaturedTrips(response.data.data.trips))
      .catch(() => setFeaturedTrips([]));
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setHeroDirection(1);
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, HERO_AUTOPLAY_DELAY);

    return () => window.clearTimeout(timer);
  }, [currentSlide]);

  const filteredTrips = useMemo(() => {
    if (activeCategory === 'All') return featuredTrips.slice(0, 8);
    return featuredTrips
      .filter((t) => {
        const cat = activeCategory.toUpperCase().replace(' ', '_');
        return t.category === cat || t.title.toLowerCase().includes(activeCategory.toLowerCase());
      })
      .slice(0, 8);
  }, [featuredTrips, activeCategory]);

  useEffect(() => {
    setFeaturedStart(0);
    setFeaturedDirection(1);
  }, [activeCategory]);

  const featuredSource = useMemo(() => {
    return filteredTrips.length > 0 ? filteredTrips : featuredTrips.slice(0, 8);
  }, [featuredTrips, filteredTrips]);

  const featuredPages = useMemo(() => {
    return Array.from(
      { length: Math.max(1, Math.ceil(featuredSource.length / FEATURED_PAGE_SIZE)) },
      (_, index) => featuredSource.slice(index * FEATURED_PAGE_SIZE, index * FEATURED_PAGE_SIZE + FEATURED_PAGE_SIZE),
    );
  }, [featuredSource]);

  const featuredPageCount = Math.max(
    1,
    Math.ceil(featuredSource.length / FEATURED_PAGE_SIZE),
  );

  const featuredPage = Math.floor(featuredStart / FEATURED_PAGE_SIZE);

  const nextFeaturedPage = () => {
    const total = featuredSource.length;
    const nextStart = featuredStart + FEATURED_PAGE_SIZE >= total ? 0 : featuredStart + FEATURED_PAGE_SIZE;
    setFeaturedDirection(1);
    setFeaturedStart(nextStart);
  };

  const prevFeaturedPage = () => {
    const total = featuredSource.length;
    const prevStart = featuredStart - FEATURED_PAGE_SIZE < 0
      ? Math.max(total - ((total % FEATURED_PAGE_SIZE) || FEATURED_PAGE_SIZE), 0)
      : featuredStart - FEATURED_PAGE_SIZE;
    setFeaturedDirection(-1);
    setFeaturedStart(prevStart);
  };

  const jumpToFeaturedPage = (pageIndex: number) => {
    const nextStart = pageIndex * FEATURED_PAGE_SIZE;
    setFeaturedDirection(nextStart >= featuredStart ? 1 : -1);
    setFeaturedStart(pageIndex * FEATURED_PAGE_SIZE);
  };

  const changeHeroSlide = (nextIndex: number, direction: number) => {
    setHeroDirection(direction);
    setCurrentSlide((nextIndex + heroSlides.length) % heroSlides.length);
  };

  const getHeroJumpDirection = (nextIndex: number) => {
    if (currentSlide === heroSlides.length - 1 && nextIndex === 0) return 1;
    if (currentSlide === 0 && nextIndex === heroSlides.length - 1) return -1;
    return nextIndex > currentSlide ? 1 : -1;
  };

  const nextSlide = () => changeHeroSlide(currentSlide + 1, 1);
  const prevSlide = () => changeHeroSlide(currentSlide - 1, -1);
  const activeHeroSlide = heroSlides[currentSlide];

  return (
    <>
      {/* ─── HERO SECTION with Carousel ─── */}
      <section className="relative h-[90vh] min-h-[600px] overflow-hidden">
        <div className="absolute inset-0">
          <AnimatePresence custom={heroDirection} initial={false}>
            <motion.div
              key={activeHeroSlide.image}
              custom={heroDirection}
              variants={heroImageVariants}
              initial="enter"
              animate="center"
              exit="exit"
              className="absolute inset-0"
            >
              <div
                className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                style={{ backgroundImage: `url(${activeHeroSlide.image})` }}
              />
            </motion.div>
          </AnimatePresence>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.18),transparent_34%),linear-gradient(90deg,rgba(4,10,22,0.8)_0%,rgba(4,10,22,0.56)_36%,rgba(4,10,22,0.12)_100%)]" />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(4,10,22,0.1)_0%,rgba(4,10,22,0.16)_55%,rgba(4,10,22,0.38)_100%)]" />
        </div>

        <div className="relative z-10 flex h-full items-center">
          <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="hero-copy max-w-3xl overflow-hidden">
              <AnimatePresence custom={heroDirection} initial={false} mode="wait">
                <motion.div
                  key={currentSlide}
                  custom={heroDirection}
                  variants={heroContentVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  className="min-h-[24rem] sm:min-h-[27rem] lg:min-h-[29rem]"
                >
                  <motion.p
                    variants={heroContentItemVariants}
                    className="playful-text text-2xl !text-primary-300 sm:text-3xl"
                  >
                    {activeHeroSlide.tagline}
                  </motion.p>

                  <motion.h1
                    variants={heroContentItemVariants}
                    className="mt-4 text-5xl font-extrabold leading-[0.96] tracking-[-0.04em] text-white sm:text-6xl lg:text-7xl"
                    style={{ whiteSpace: 'pre-line' }}
                  >
                    {activeHeroSlide.title}{' '}
                    <span className="text-primary-400">{activeHeroSlide.highlight}</span>
                  </motion.h1>

                  <motion.p
                    variants={heroContentItemVariants}
                    className="mt-6 max-w-xl text-lg leading-8 text-white/78"
                  >
                    {activeHeroSlide.description}
                  </motion.p>

                  <motion.div
                    variants={heroContentItemVariants}
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
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Slide nav arrows */}
        <button
          type="button"
          onClick={prevSlide}
          className="absolute left-4 top-1/2 z-20 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-primary-500 text-white transition hover:bg-primary-600 sm:left-8"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <button
          type="button"
          onClick={nextSlide}
          className="absolute right-4 top-1/2 z-20 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-primary-500 text-white transition hover:bg-primary-600 sm:right-8"
        >
          <ArrowRight className="h-5 w-5" />
        </button>

        {/* Slide indicators */}
        <div className="absolute bottom-8 left-1/2 z-20 flex -translate-x-1/2 gap-2">
          {heroSlides.map((_, index) => (
            <button
              key={index}
              type="button"
              onClick={() => {
                if (index === currentSlide) return;
                changeHeroSlide(index, getHeroJumpDirection(index));
              }}
              className={`h-3 rounded-full transition-all ${
                index === currentSlide ? 'w-8 bg-primary-500' : 'w-3 bg-white/50'
              }`}
            />
          ))}
        </div>

        {/* Animated hanging Booking sign */}
        <div className="absolute right-8 top-24 z-20 hidden lg:block">
          {/* Rope */}
          <div className="mx-auto h-10 w-[2px] bg-gradient-to-b from-transparent via-amber-400/70 to-amber-400" />
          {/* Sign board */}
          <motion.div
            animate={{ rotate: [0, 3, -3, 2, -2, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            style={{ transformOrigin: 'top center' }}
            className="relative"
          >
            <div className="booking-hang-sign rounded-xl px-8 py-5 text-center shadow-2xl">
              <p className="playful-text text-3xl text-white drop-shadow-lg">Booking</p>
              <p className="mt-1 text-[10px] font-medium uppercase tracking-[0.25em] text-white/60">Open Now</p>
            </div>
            {/* Nail dots */}
            <div className="absolute -top-1 left-1/2 h-3 w-3 -translate-x-1/2 rounded-full border border-amber-400/60 bg-amber-500 shadow-md" />
          </motion.div>
        </div>
      </section>

      {/* ─── ABOUT / INTRO SECTION ─── */}
      <section className="mx-auto max-w-7xl px-4 pb-2 pt-4 sm:px-6 sm:pb-4 sm:pt-6 lg:px-8 lg:pb-6 lg:pt-8">
        <div className="grid gap-8 lg:grid-cols-2 lg:items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative home-about-visual lg:-ml-8 xl:-ml-10"
          >
            <div className="home-about-route pointer-events-none absolute inset-0 hidden lg:block">
              <svg viewBox="0 0 760 820" className="home-about-route__paths h-full w-full">
                <path d="M136 74 C172 74, 204 94, 218 124 C236 164, 220 212, 188 234 C160 252, 126 248, 106 228 C88 210, 92 182, 112 168 C130 156, 156 160, 170 178 C190 204, 182 244, 154 280 C120 324, 94 370, 74 420 C62 450, 52 480, 42 514" />
                <circle cx="136" cy="74" r="5" />
                <circle cx="42" cy="514" r="5" />
              </svg>
              <div className="home-about-route__icon home-about-route__icon--bus">
                <Bus className="h-7 w-7" weight="fill" />
              </div>
            </div>
            <img
              src="/destinations/Exploring Maharashtra's ancient hilltop forts.png"
              alt="Exploring Maharashtra's ancient hilltop forts"
              className="mx-auto w-full max-w-[52rem] object-contain drop-shadow-[0_28px_52px_rgba(0,0,0,0.2)]"
              style={{ height: '780px' }}
            />
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
                <img
                  src={siteLogo}
                  alt="Alpha Trekkers logo"
                  className="h-12 w-auto object-contain"
                />
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
      <section className="bg-dark-50 pb-32 pt-20 sm:pb-36">
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

          <div className="relative mt-10">
            <button
              onClick={prevFeaturedPage}
              className="absolute left-0 top-1/2 z-10 hidden h-14 w-14 -translate-x-[135%] -translate-y-1/2 items-center justify-center rounded-full border border-primary-500 bg-white text-primary-500 shadow-[0_14px_35px_rgba(15,23,42,0.08)] transition hover:bg-primary-500 hover:text-white xl:flex"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <button
              onClick={nextFeaturedPage}
              className="absolute right-0 top-1/2 z-10 hidden h-14 w-14 translate-x-[135%] -translate-y-1/2 items-center justify-center rounded-full bg-primary-500 text-white shadow-[0_14px_35px_rgba(52,152,75,0.22)] transition hover:bg-primary-600 xl:flex"
            >
              <ArrowRight className="h-5 w-5" />
            </button>

            <div className="overflow-hidden rounded-[2rem]">
              <AnimatePresence custom={featuredDirection} initial={false} mode="wait">
                <motion.div
                  key={`${activeCategory}-${featuredPage}`}
                  custom={featuredDirection}
                  variants={featuredPageVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  className="grid w-full gap-6 md:grid-cols-2 xl:grid-cols-4"
                >
                  {(featuredPages[featuredPage] ?? []).map((trip, tripIndex) => (
                    <motion.div
                      key={trip.id}
                      variants={featuredCardVariants}
                    >
                      <TripCard
                        trip={trip}
                        variant="featuredCompact"
                        revealOnScroll
                        revealIndex={tripIndex}
                      />
                    </motion.div>
                  ))}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          <div className="mt-8 flex justify-center gap-2">
            {Array.from({ length: featuredPageCount }).map((_, index) => (
              <button
                key={index}
                type="button"
                onClick={() => jumpToFeaturedPage(index)}
                className={`h-3 rounded-full transition-all ${
                  index === featuredPage ? 'w-8 bg-primary-500' : 'w-3 bg-dark-300'
                }`}
              />
            ))}
          </div>

          <div className="mt-10 text-center">
            <Link to="/trips">
              <button className="rounded-lg bg-primary-500 px-8 py-3.5 text-sm font-bold uppercase tracking-wider text-white transition hover:bg-primary-600">
                Explore One-Day Trips
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* ─── STATS CTA SECTION ─── */}
      <section ref={counterRef} className="relative overflow-visible bg-white px-4 pb-20 pt-0 sm:px-6 lg:px-8">
        <div className="relative mx-auto max-w-7xl">
          <div className="absolute left-1/2 top-0 z-20 w-full max-w-[1280px] -translate-x-1/2 -translate-y-1/2 px-4 sm:px-6 lg:px-8">
            <div className="mx-4 overflow-hidden rounded-xl bg-primary-600 px-8 py-5 shadow-[0_24px_70px_rgba(64,162,64,0.25)] sm:mx-6 sm:px-10 sm:py-6 lg:mx-8">
              <div className="relative flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                <div className="max-w-3xl">
                  <h2 className="text-[2.2rem] font-bold leading-none text-dark-900 sm:text-[2.6rem]">
                    Ready To Adventure And Enjoy Natural
                  </h2>
                  <p className="mt-2 max-w-2xl text-sm text-white/85 sm:text-base">
                    Join thousands of happy travelers who have explored Maharashtra&apos;s hidden gems with us.
                  </p>
                </div>
                <Link to="/contact" className="relative z-10 inline-flex shrink-0 items-center justify-center rounded-lg bg-white px-9 py-3.5 text-sm font-bold uppercase tracking-[0.08em] text-primary-600 transition hover:bg-white/90">
                  Let&apos;s Get Started
                </Link>
                <div className="pointer-events-none absolute right-20 top-1/2 hidden h-36 w-56 -translate-y-1/2 opacity-80 lg:block">
                  <svg viewBox="0 0 220 140" className="h-full w-full">
                    <path
                      d="M18 120 C30 56, 90 24, 126 52 C150 72, 144 102, 164 114 C180 122, 196 104, 202 74"
                      fill="none"
                      stroke="rgba(255,255,255,0.7)"
                      strokeWidth="2.2"
                      strokeDasharray="5 6"
                      strokeLinecap="round"
                    />
                  </svg>
                  <span className="absolute right-0 top-0 text-2xl text-white">✈</span>
                </div>
              </div>
            </div>
          </div>

          <div className="relative left-1/2 mt-0 w-screen -translate-x-1/2 overflow-hidden bg-[#0f0e09] pb-28 pt-32 sm:pb-32 sm:pt-36 lg:pb-36 lg:pt-32">
            <img
              src="/destinations/Devkund Waterfall in lush surroundings.png"
              alt="Devkund Waterfall background"
              className="absolute inset-0 h-full w-full object-cover opacity-40"
            />
            <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(15,14,9,0.7),rgba(15,14,9,0.34)),linear-gradient(180deg,rgba(15,14,9,0.06),rgba(15,14,9,0.26))]" />

            <div className="relative mx-auto max-w-7xl">
              <div className="relative grid auto-rows-fr grid-cols-2 gap-6 px-6 pt-10 sm:px-8 sm:pt-12 lg:grid-cols-4 lg:px-10 lg:pt-14 xl:px-16">
                {counterStats.map(({ end, label, suffix, decimals, icon }) => (
                  <motion.div key={label} className="h-full" initial={{ opacity: 0, y: 26 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.45 }}>
                    <CounterCard
                      end={end}
                      label={label}
                      suffix={suffix}
                      decimals={decimals}
                      active={counterInView}
                      icon={icon}
                    />
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── DESTINATIONS SECTION — Staggered Grid ─── */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="text-center">
          <p className="playful-text text-3xl text-primary-500 sm:text-[2.4rem]">
            Top Destinations
          </p>
          <h2 className="mt-4 text-4xl font-bold text-dark-900 sm:text-5xl">
            Checkout Beautiful Places Around{' '}
            <span className="playful-text text-primary-500">Maharashtra</span>
          </h2>
        </div>

        <div className="mx-auto mt-14 grid max-w-[84rem] grid-cols-2 gap-x-5 gap-y-10 sm:grid-cols-3 md:gap-x-6 lg:grid-cols-6 lg:items-start lg:gap-x-5 lg:gap-y-0 xl:gap-x-6">
          {destinationCards.map((dest, idx) => (
            <motion.div
              key={dest.name}
              initial={{ opacity: 0, y: 36 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55, delay: idx * 0.08 }}
              whileHover={{ y: -8 }}
              className={`mx-auto w-full max-w-[15rem] ${dest.cardClass}`}
            >
              <Link to="/trips" className="group block text-center">
                <div className={`overflow-hidden shadow-[0_18px_38px_rgba(15,23,42,0.1)] ${dest.imageWrapClass}`}>
                  <img
                    src={dest.image}
                    alt={dest.name}
                    className={`h-full w-full ${dest.imageClass} object-cover transition-transform duration-700 ease-out group-hover:scale-110`}
                  />
                </div>
                <div className="mt-5">
                  <p className="text-[1.15rem] font-bold leading-tight text-dark-900 sm:text-[1.35rem]">
                    {dest.name}
                  </p>
                  <p className="mt-2 text-xl font-medium text-primary-500 sm:text-2xl">
                    ({dest.tours.replace(' tours', ' Tour').replace(' tour', ' Tour')})
                  </p>
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
