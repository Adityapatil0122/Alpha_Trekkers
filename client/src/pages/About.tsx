import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MAHARASHTRA_MONSOON_IMAGES } from '@alpha-trekkers/shared';
import {
  ArrowRight,
  Eye,
  Handshake,
  Mountains,
  ShieldCheck,
  Star,
  TreeEvergreen,
  Users,
} from '@phosphor-icons/react';

const values = [
  {
    Icon: Eye,
    title: 'Clear Travel Direction',
    copy: 'We plan journeys with enough detail that guests always know what comes next, without losing the thrill of the route.',
  },
  {
    Icon: ShieldCheck,
    title: 'Safety As A Standard',
    copy: 'Route checks, leader briefing, and emergency readiness are built into operations, not treated as add-ons.',
  },
  {
    Icon: Handshake,
    title: 'Human-Led Hosting',
    copy: 'Treks feel warmer when they are guided by people who know the history, terrain, and group rhythm deeply.',
  },
  {
    Icon: TreeEvergreen,
    title: 'Respect For The Trail',
    copy: 'We design for low-friction travel, cleaner camps, and more mindful movement through the hills.',
  },
];

const destinations = [
  {
    title: 'Rajgad',
    trips: '6 Routes',
    image: MAHARASHTRA_MONSOON_IMAGES.sections.aboutRajgad,
    badgeColor: '#f5b229',
  },
  {
    title: 'Harishchandragad',
    trips: '4 Routes',
    image: MAHARASHTRA_MONSOON_IMAGES.sections.aboutHarishchandragad,
    badgeColor: '#27e6cc',
  },
  {
    title: 'Torna',
    trips: '5 Routes',
    image: MAHARASHTRA_MONSOON_IMAGES.sections.aboutTorna,
    badgeColor: '#ff6a2a',
  },
  {
    title: 'Kalsubai',
    trips: '3 Routes',
    image: MAHARASHTRA_MONSOON_IMAGES.sections.aboutKalsubai,
    badgeColor: '#1ec7e8',
  },
  {
    title: 'Rajmachi',
    trips: 'Night Treks',
    image: MAHARASHTRA_MONSOON_IMAGES.sections.aboutRajmachi,
    badgeColor: '#e92fff',
  },
];

const storyStats = [
  { value: '2019', label: 'Operations Started' },
  { value: '12K+', label: 'Trekkers Hosted' },
  { value: 'Local-first', label: 'Maharashtra Focus' },
];

const teamMembers = [
  { name: 'Trek Leader', role: 'Head Guide', avatar: 'TL' },
  { name: 'Route Planner', role: 'Operations', avatar: 'RP' },
  { name: 'Safety Officer', role: 'Emergency Lead', avatar: 'SO' },
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.12 },
  },
};

const item = {
  hidden: { opacity: 0, y: 22 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: 'easeOut' } },
};

export default function About() {
  return (
    <>
      {/* ─── HERO BANNER ─── */}
      <section className="relative min-h-[600px] overflow-hidden bg-white pt-24 lg:min-h-[82vh]">
        <img
          src="/destinations/Devkund Waterfall in lush surroundings.png"
          alt="Devkund waterfall"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(15,23,42,0.88),rgba(15,23,42,0.62),rgba(15,23,42,0.22))]" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(15,23,42,0.2),rgba(15,23,42,0.1),rgba(15,23,42,0.45))]" />

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          className="hero-copy relative mx-auto flex min-h-[600px] max-w-7xl items-center px-4 py-16 sm:px-6 lg:min-h-[82vh] lg:px-8"
        >
          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-primary-400">
              About Alpha Trekkers
            </p>
            <div className="mt-6 max-w-2xl">
              <h1 className="text-5xl font-extrabold leading-tight text-white sm:text-6xl">
                We Shape Maharashtra Treks To Feel Rich &amp; Worth Remembering
              </h1>
              <p className="mt-6 max-w-xl text-lg leading-8 text-white/82">
                Alpha Trekkers is built around guided fort journeys, trail timing, and local route
                knowledge. The goal is simple: make outdoor travel feel premium without making it
                feel artificial.
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <Link to="/trips">
                  <button className="rounded-lg bg-primary-500 px-8 py-3.5 text-sm font-bold uppercase tracking-wider text-white transition hover:bg-primary-600">
                    Explore Departures
                  </button>
                </Link>
                <Link to="/contact">
                  <button className="rounded-lg border-2 border-white/18 bg-white/10 px-8 py-3.5 text-sm font-bold uppercase tracking-wider text-white transition hover:border-primary-400 hover:bg-white/16 hover:text-white">
                    Talk To The Team
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* ─── OUR STORY SECTION ─── */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          <motion.div
            initial={{ opacity: 0, x: -22 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
          >
            <p className="section-script">Our story</p>
            <h2 className="mt-3 text-4xl font-bold leading-tight text-dark-900 sm:text-5xl">
              Adventure Should Feel{' '}
              <span className="playful-text text-primary-500">Polished</span>, Not Chaotic
            </h2>
            <p className="mt-5 leading-7 text-dark-500">
              We are not trying to make the mountains look like a resort product. We are trying to
              make the full journey feel better organized, more visually appealing, and easier to
              trust from the first click to the final descent.
            </p>
            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              {storyStats.map((stat) => (
                <motion.div
                  key={stat.label}
                  whileHover={{ y: -6 }}
                  className="rounded-xl border border-dark-200 bg-dark-50 p-5 text-center shadow-sm"
                >
                  <p className="text-3xl font-bold text-primary-600">{stat.value}</p>
                  <p className="mt-2 text-sm text-dark-500">{stat.label}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 22 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="relative about-story-visual"
          >
            <div className="story-route-frame relative mx-auto max-w-[40rem] overflow-hidden shadow-[0_28px_70px_rgba(15,23,42,0.24)]">
              <img
                src={MAHARASHTRA_MONSOON_IMAGES.sections.chooseUsRange}
                alt="Sahyadri mountain range"
                className="story-route-frame__image h-[450px] w-full object-cover"
              />
              <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(15,23,42,0.12),rgba(15,23,42,0.06),rgba(15,23,42,0.28))]" />
            </div>
          </motion.div>
        </div>
      </section>

      {/* ─── VALUES SECTION ─── */}
      <section className="bg-dark-50 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="section-script">Why choose us</p>
            <h2 className="mt-3 text-4xl font-bold text-dark-900 sm:text-5xl">
              What Makes <span className="playful-text text-primary-500">Alpha Trekkers</span> Different
            </h2>
          </div>

          <motion.div
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
            className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-4"
          >
            {values.map(({ Icon, title, copy }) => (
              <motion.div
                key={title}
                variants={item}
                whileHover={{ y: -8 }}
                className="rounded-2xl bg-white p-8 shadow-lg transition hover:shadow-xl"
              >
                <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-xl bg-primary-50">
                  <Icon className="h-8 w-8 text-primary-500" weight="duotone" />
                </div>
                <h3 className="text-xl font-bold text-dark-900">{title}</h3>
                <p className="mt-3 text-sm leading-7 text-dark-500">{copy}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ─── DESTINATIONS SECTION ─── */}
      <section className="relative overflow-hidden bg-white py-20">
        <div className="about-destinations-pattern pointer-events-none absolute inset-0" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <p className="playful-text text-3xl text-primary-500 sm:text-[2.7rem]">Explore Maharashtra</p>
              <h2 className="mt-3 text-4xl font-bold text-dark-900 sm:text-5xl lg:text-[4rem] lg:leading-none">
                Popular <span className="playful-text text-primary-300">Destinations</span>
              </h2>
            </div>
            <Link
              to="/trips"
              className="inline-flex items-center gap-3 self-start pt-2 text-sm font-semibold uppercase tracking-[0.08em] text-dark-900 transition hover:text-primary-500"
            >
              View All Destination
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary-500 text-white">
                <ArrowRight className="h-4 w-4" weight="bold" />
              </span>
            </Link>
          </div>

          <motion.div
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.12 }}
            className="mt-14 grid grid-cols-2 gap-x-6 gap-y-12 sm:grid-cols-3 lg:grid-cols-5 lg:gap-x-8"
          >
            {destinations.map((destination) => (
              <motion.div
                key={destination.title}
                variants={item}
                whileHover={{ y: -10 }}
                className="text-center"
              >
                <Link to="/trips" className="group block">
                  <div className="relative mx-auto h-[10.5rem] w-[10.5rem] sm:h-[11.5rem] sm:w-[11.5rem]">
                    <img
                      src={destination.image}
                      alt={destination.title}
                      className="h-full w-full rounded-full object-cover shadow-[0_24px_48px_rgba(15,23,42,0.12)] transition duration-700 ease-out group-hover:scale-[1.06]"
                    />
                    <div
                      className="about-destination-chip absolute bottom-0 left-1/2 -translate-x-1/2 text-[0.95rem] font-semibold text-dark-900"
                      style={{ backgroundColor: destination.badgeColor }}
                    >
                      {destination.trips}
                    </div>
                  </div>
                  <p className="mt-8 text-[1.2rem] font-semibold text-dark-900 sm:text-[1.3rem]">
                    {destination.title}
                  </p>
                </Link>
              </motion.div>
            ))}
          </motion.div>

          <p className="mt-14 text-center text-base text-dark-600 sm:text-lg">
            Explore Maharashtra&apos;s top destinations chosen for forts, ridgelines, valleys, and memorable monsoon routes.
          </p>
        </div>
      </section>

      {/* ─── WHO TRAVELS WITH US ─── */}
      <section className="bg-dark-900 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-16 lg:grid-cols-2 lg:items-start lg:gap-x-20">
            <div>
              <p className="section-script text-primary-400">Who travels with us</p>
              <h2 className="mt-4 text-4xl font-bold leading-tight text-white sm:text-5xl">
                Weekend Hikers, First-Timers & Repeat Fort Explorers
              </h2>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-8">
              <div className="flex items-start gap-4">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-primary-500/20">
                  <Users className="h-8 w-8 text-primary-400" weight="duotone" />
                </div>
                <div>
                  <p className="leading-7 text-white/88">
                    The direction may feel more premium now, but the core remains inclusive: easy
                    starts for beginners, structured departures for busy professionals, and enough
                    depth for serious trekkers who care about route details.
                  </p>
                  <div className="mt-6 flex flex-wrap gap-3">
                    {['First-time friendly', 'Local route knowledge', 'Better group pacing'].map((tag) => (
                      <span key={tag} className="rounded-full border border-white/18 bg-white/6 px-4 py-2 text-sm text-white/84">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-20 rounded-2xl border border-white/10 bg-white/5 p-6">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary-500/20">
                <Mountains className="h-8 w-8 text-primary-400" weight="duotone" />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-primary-400">What Makes It Work</p>
                <p className="mt-2 leading-7 text-white/84">
                  Route clarity, meeting-point confidence, trained leaders, and better use of the terrain we already know well.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
