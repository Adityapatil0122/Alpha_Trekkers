import { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useInView, useScroll, useTransform } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';
import {
  ArrowRight,
  CaretDown,
  Mountains,
  Users,
  Star,
  ShieldCheck,
  Compass,
  Tent,
  CurrencyInr,
  Moon,
  CloudRain,
  Snowflake,
  Sun,
  CalendarBlank,
  Quotes,
  Lightning,
} from '@phosphor-icons/react';
import type { ApiResponse, Trip } from '@alpha-trekkers/shared';
import api from '@/lib/axios';
import TripCard from '@/components/ui/TripCard';
import Button from '@/components/ui/Button';

import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

/* ─────────────── Animated Counter ─────────────── */
function AnimatedCounter({
  target,
  suffix = '',
  prefix = '',
  duration = 2000,
}: {
  target: number;
  suffix?: string;
  prefix?: string;
  duration?: number;
}) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });

  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const increment = target / (duration / 16);
    const timer = setInterval(() => {
      start += increment;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [inView, target, duration]);

  return (
    <span ref={ref}>
      {prefix}
      {count.toLocaleString('en-IN')}
      {suffix}
    </span>
  );
}

/* ─────────────── Fade-in-on-scroll wrapper ─────────────── */
function FadeInSection({
  children,
  className = '',
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay, ease: 'easeOut' }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ─────────────── Section Header ─────────────── */
function SectionHeader({
  label,
  title,
  description,
}: {
  label: string;
  title: string;
  description?: string;
}) {
  return (
    <div className="mb-12 text-center">
      <span className="mb-3 inline-block rounded-full bg-forest-500/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-forest-600">
        {label}
      </span>
      <h2 className="font-heading text-3xl font-bold text-forest-900 sm:text-4xl lg:text-5xl">
        {title}
      </h2>
      {description && (
        <p className="mx-auto mt-4 max-w-2xl text-base text-forest-600/70 lg:text-lg">
          {description}
        </p>
      )}
      <div className="mx-auto mt-6 h-1 w-16 rounded-full bg-gradient-to-r from-forest-500 to-amber-500" />
    </div>
  );
}

/* ─────────────── Category Data ─────────────── */
const categories = [
  { key: 'WEEKEND', label: 'Weekend Treks', Icon: CalendarBlank, to: '/weekend-trips', color: 'from-forest-600 to-forest-800' },
  { key: 'WEEKDAY', label: 'Weekday Treks', Icon: Sun, to: '/weekday-trips', color: 'from-amber-500 to-orange-600' },
  { key: 'NIGHT_TREK', label: 'Night Treks', Icon: Moon, to: '/trips?category=NIGHT_TREK', color: 'from-indigo-600 to-purple-800' },
  { key: 'MONSOON', label: 'Monsoon Treks', Icon: CloudRain, to: '/trips?category=MONSOON', color: 'from-cyan-600 to-teal-800' },
  { key: 'WINTER_SPECIAL', label: 'Winter Special', Icon: Snowflake, to: '/trips?category=WINTER_SPECIAL', color: 'from-sky-500 to-blue-700' },
  { key: 'CAMPING', label: 'Camping Trips', Icon: Tent, to: '/trips?category=CAMPING', color: 'from-emerald-500 to-green-700' },
];

const whyChooseUs = [
  {
    Icon: Compass,
    title: 'Expert Guides',
    desc: 'Certified mountain guides with 10+ years of experience across the Sahyadri range.',
  },
  {
    Icon: ShieldCheck,
    title: 'Safety First',
    desc: 'Complete safety gear, first-aid trained staff, and real-time weather monitoring on every trek.',
  },
  {
    Icon: Users,
    title: 'Small Groups',
    desc: 'Maximum 20 trekkers per batch for a personalized, intimate adventure experience.',
  },
  {
    Icon: CurrencyInr,
    title: 'Best Prices',
    desc: 'Transparent pricing with no hidden fees. All-inclusive packages that fit every budget.',
  },
];

const testimonials = [
  {
    name: 'Priya Sharma',
    rating: 5,
    text: 'An absolutely unforgettable experience trekking to Rajgad. The guides were knowledgeable and the sunrise views were breathtaking!',
  },
  {
    name: 'Amit Deshmukh',
    rating: 5,
    text: 'Best trekking group in Maharashtra! Safety measures were top-notch and the group size was perfect. Already booked my next trek.',
  },
  {
    name: 'Sneha Kulkarni',
    rating: 5,
    text: 'From the meetup to the summit, everything was perfectly organized. The night trek to Harishchandragad was magical.',
  },
  {
    name: 'Rahul Patil',
    rating: 4,
    text: 'Great value for money. The camping setup was comfortable, food was amazing, and our guide made history come alive at every fort.',
  },
  {
    name: 'Meera Joshi',
    rating: 5,
    text: 'First time trekking and I felt completely safe. The team was encouraging and patient. Can\'t wait for the monsoon season treks!',
  },
];

/* ─────────────── HOME PAGE ─────────────── */
export default function Home() {
  const [featuredTrips, setFeaturedTrips] = useState<Trip[]>([]);
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });
  const heroY = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  useEffect(() => {
    api
      .get<ApiResponse<{ trips: Trip[] }>>('/trips/featured')
      .then((res) => setFeaturedTrips(res.data.data.trips))
      .catch(() => {});
  }, []);

  return (
    <>
      {/* ════════ HERO SECTION ════════ */}
      <section ref={heroRef} className="relative h-screen min-h-[700px] overflow-hidden">
        {/* Background with parallax */}
        <motion.div
          style={{ y: heroY }}
          className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1585409677983-0f6c41128c45?w=1920&q=80')] bg-cover bg-center"
        />
        {/* Gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-b from-forest-950/70 via-forest-900/40 to-forest-950/80" />
        <div className="absolute inset-0 bg-gradient-to-r from-forest-950/50 to-transparent" />

        {/* Content */}
        <motion.div
          style={{ opacity: heroOpacity }}
          className="relative z-10 flex h-full flex-col items-center justify-center px-4 text-center"
        >
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <span className="mb-6 inline-flex items-center gap-2 rounded-full border border-forest-400/30 bg-forest-500/10 px-5 py-2 text-sm font-medium text-forest-300 backdrop-blur-sm">
              <Mountains className="h-4 w-4" weight="duotone" />
              Premier Maharashtra Fort Treks
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mb-6 max-w-4xl font-heading text-4xl font-bold leading-tight text-white sm:text-5xl md:text-6xl lg:text-7xl"
          >
            Discover Maharashtra&apos;s{' '}
            <span className="bg-gradient-to-r from-forest-400 to-amber-400 bg-clip-text text-transparent">
              Hidden Fortresses
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="mb-10 max-w-2xl text-base text-forest-200/80 sm:text-lg md:text-xl"
          >
            Embark on expertly guided treks through ancient hill forts, lush
            valleys, and breathtaking peaks of the Sahyadri mountain range.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="flex flex-col gap-4 sm:flex-row"
          >
            <Link to="/trips">
              <Button size="lg" rightIcon={<ArrowRight className="h-5 w-5" />}>
                Explore Treks
              </Button>
            </Link>
            <Link to="/weekend-trips">
              <Button variant="secondary" size="lg" className="border-white/30 text-white hover:bg-white/10 hover:text-white">
                Weekend Trips
              </Button>
            </Link>
          </motion.div>
        </motion.div>

        {/* Scroll down indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
            className="flex flex-col items-center gap-2"
          >
            <span className="text-xs font-medium tracking-wider text-forest-300/60">
              SCROLL DOWN
            </span>
            <CaretDown className="h-5 w-5 text-forest-400/60" />
          </motion.div>
        </motion.div>
      </section>

      {/* ════════ STATS SECTION ════════ */}
      <section className="relative -mt-16 z-20 mx-auto max-w-5xl px-4">
        <div className="grid grid-cols-2 gap-4 rounded-2xl border border-forest-200/50 bg-white p-6 shadow-xl shadow-forest-900/5 sm:p-8 md:grid-cols-4">
          {[
            { value: 500, suffix: '+', label: 'Treks Completed' },
            { value: 10000, suffix: '+', label: 'Happy Trekkers' },
            { value: 50, suffix: '+', label: 'Fort Treks' },
            { value: 4.8, suffix: '', label: 'Average Rating', isStar: true },
          ].map((stat, i) => (
            <FadeInSection key={i} delay={i * 0.1} className="text-center">
              <p className="flex items-center justify-center gap-1 font-heading text-2xl font-bold text-forest-800 sm:text-3xl">
                {stat.isStar ? (
                  <>
                    <Star className="h-6 w-6 text-amber-500" weight="fill" />
                    {stat.value}
                  </>
                ) : (
                  <AnimatedCounter target={stat.value} suffix={stat.suffix} />
                )}
              </p>
              <p className="mt-1 text-xs text-forest-500 sm:text-sm">{stat.label}</p>
            </FadeInSection>
          ))}
        </div>
      </section>

      {/* ════════ FEATURED TRIPS ════════ */}
      <section className="py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <FadeInSection>
            <SectionHeader
              label="Featured Treks"
              title="Handpicked Adventures"
              description="Our most popular treks, chosen by thousands of adventurers across Maharashtra."
            />
          </FadeInSection>

          {featuredTrips.length > 0 ? (
            <Swiper
              modules={[Autoplay, Navigation]}
              spaceBetween={24}
              slidesPerView={1}
              navigation
              autoplay={{ delay: 5000, disableOnInteraction: false }}
              breakpoints={{
                640: { slidesPerView: 2 },
                1024: { slidesPerView: 3 },
                1280: { slidesPerView: 4 },
              }}
              className="!pb-4"
            >
              {featuredTrips.map((trip) => (
                <SwiperSlide key={trip.id}>
                  <TripCard trip={trip} />
                </SwiperSlide>
              ))}
            </Swiper>
          ) : (
            /* Placeholder cards when no data */
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className="animate-pulse rounded-2xl bg-white shadow-md"
                >
                  <div className="h-56 rounded-t-2xl bg-forest-100" />
                  <div className="space-y-3 p-5">
                    <div className="h-5 w-3/4 rounded bg-forest-100" />
                    <div className="h-3 w-full rounded bg-forest-50" />
                    <div className="h-3 w-5/6 rounded bg-forest-50" />
                    <div className="flex justify-between pt-4">
                      <div className="h-6 w-20 rounded bg-forest-100" />
                      <div className="h-6 w-24 rounded bg-forest-50" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          <FadeInSection className="mt-10 text-center">
            <Link to="/trips">
              <Button variant="secondary" rightIcon={<ArrowRight className="h-4 w-4" />}>
                View All Treks
              </Button>
            </Link>
          </FadeInSection>
        </div>
      </section>

      {/* ════════ CATEGORIES ════════ */}
      <section className="bg-forest-900 py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <FadeInSection>
            <div className="mb-12 text-center">
              <span className="mb-3 inline-block rounded-full bg-forest-500/20 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-forest-400">
                Categories
              </span>
              <h2 className="font-heading text-3xl font-bold text-white sm:text-4xl lg:text-5xl">
                Choose Your Adventure
              </h2>
              <p className="mx-auto mt-4 max-w-2xl text-base text-forest-300/60 lg:text-lg">
                From sunrise weekend treks to thrilling night expeditions — find your perfect trail.
              </p>
              <div className="mx-auto mt-6 h-1 w-16 rounded-full bg-gradient-to-r from-forest-500 to-amber-500" />
            </div>
          </FadeInSection>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map(({ key, label, Icon, to, color }, i) => (
              <FadeInSection key={key} delay={i * 0.08}>
                <Link
                  to={to}
                  className="group relative flex items-center gap-5 overflow-hidden rounded-2xl bg-forest-800/50 p-6 transition-all duration-300 hover:bg-forest-800/80"
                >
                  <div
                    className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${color} shadow-lg transition-transform duration-300 group-hover:scale-110`}
                  >
                    <Icon className="h-7 w-7 text-white" weight="duotone" />
                  </div>
                  <div>
                    <h3 className="font-heading text-lg font-semibold text-white">
                      {label}
                    </h3>
                    <p className="mt-0.5 text-sm text-forest-300/60">
                      Explore treks &rarr;
                    </p>
                  </div>
                  <ArrowRight className="ml-auto h-5 w-5 text-forest-500 opacity-0 transition-all duration-300 group-hover:translate-x-1 group-hover:opacity-100" />
                </Link>
              </FadeInSection>
            ))}
          </div>
        </div>
      </section>

      {/* ════════ WHY CHOOSE US ════════ */}
      <section className="py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <FadeInSection>
            <SectionHeader
              label="Why Alpha Trekkers"
              title="Why Trekkers Choose Us"
              description="We are committed to making every trek safe, memorable, and within reach."
            />
          </FadeInSection>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {whyChooseUs.map(({ Icon, title, desc }, i) => (
              <FadeInSection key={title} delay={i * 0.1}>
                <div className="group rounded-2xl border border-forest-100 bg-white p-7 text-center shadow-sm transition-all duration-300 hover:border-forest-200 hover:shadow-lg hover:shadow-forest-900/5">
                  <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-forest-50 transition-colors duration-300 group-hover:bg-forest-500">
                    <Icon className="h-8 w-8 text-forest-600 transition-colors duration-300 group-hover:text-white" weight="duotone" />
                  </div>
                  <h3 className="mb-2 font-heading text-lg font-semibold text-forest-900">
                    {title}
                  </h3>
                  <p className="text-sm leading-relaxed text-forest-600/70">{desc}</p>
                </div>
              </FadeInSection>
            ))}
          </div>
        </div>
      </section>

      {/* ════════ TESTIMONIALS ════════ */}
      <section className="bg-forest-50/80 py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <FadeInSection>
            <SectionHeader
              label="Testimonials"
              title="What Trekkers Say"
              description="Real stories from real adventurers who explored with us."
            />
          </FadeInSection>

          <Swiper
            modules={[Autoplay, Pagination]}
            spaceBetween={24}
            slidesPerView={1}
            pagination={{ clickable: true }}
            autoplay={{ delay: 4500, disableOnInteraction: false }}
            breakpoints={{
              640: { slidesPerView: 2 },
              1024: { slidesPerView: 3 },
            }}
            className="!pb-14"
          >
            {testimonials.map((t, i) => (
              <SwiperSlide key={i}>
                <div className="rounded-2xl border border-forest-100 bg-white p-7 shadow-sm">
                  <Quotes className="mb-4 h-8 w-8 text-forest-300" weight="fill" />
                  <p className="mb-6 text-sm leading-relaxed text-forest-700/80">
                    {t.text}
                  </p>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-heading text-sm font-semibold text-forest-900">
                        {t.name}
                      </p>
                      <div className="mt-1 flex gap-0.5">
                        {Array.from({ length: 5 }).map((_, s) => (
                          <Star
                            key={s}
                            className={`h-3.5 w-3.5 ${s < t.rating ? 'text-amber-400' : 'text-forest-200'}`}
                            weight="fill"
                          />
                        ))}
                      </div>
                    </div>
                    <Lightning className="h-5 w-5 text-forest-300" weight="duotone" />
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </section>

      {/* ════════ CTA SECTION ════════ */}
      <section className="relative overflow-hidden bg-gradient-to-r from-forest-800 via-forest-700 to-forest-800 py-20 lg:py-28">
        {/* Decorative elements */}
        <div className="absolute -left-20 -top-20 h-80 w-80 rounded-full bg-forest-500/10 blur-3xl" />
        <div className="absolute -bottom-20 -right-20 h-80 w-80 rounded-full bg-amber-500/10 blur-3xl" />

        <div className="relative z-10 mx-auto max-w-3xl px-4 text-center">
          <FadeInSection>
            <Mountains className="mx-auto mb-6 h-12 w-12 text-forest-400" weight="duotone" />
            <h2 className="mb-4 font-heading text-3xl font-bold text-white sm:text-4xl lg:text-5xl">
              Ready for Your Next Adventure?
            </h2>
            <p className="mb-10 text-base text-forest-200/70 lg:text-lg">
              Join thousands of trekkers exploring Maharashtra&apos;s magnificent
              forts. Your next unforgettable journey starts here.
            </p>
            <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              <Link to="/trips">
                <Button
                  size="lg"
                  variant="accent"
                  rightIcon={<ArrowRight className="h-5 w-5" />}
                >
                  Browse All Treks
                </Button>
              </Link>
              <Link to="/contact">
                <Button size="lg" variant="ghost" className="text-white hover:bg-white/10">
                  Contact Us
                </Button>
              </Link>
            </div>
          </FadeInSection>
        </div>
      </section>
    </>
  );
}
