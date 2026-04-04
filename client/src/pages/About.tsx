import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MAHARASHTRA_MONSOON_IMAGES } from '@alpha-trekkers/shared';
import {
  ArrowRight,
  Eye,
  Handshake,
  MapPinLine,
  Mountains,
  Play,
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
  },
  {
    title: 'Harishchandragad',
    trips: '4 Routes',
    image: MAHARASHTRA_MONSOON_IMAGES.sections.aboutHarishchandragad,
  },
  {
    title: 'Torna',
    trips: '5 Routes',
    image: MAHARASHTRA_MONSOON_IMAGES.sections.aboutTorna,
  },
  {
    title: 'Kalsubai',
    trips: '3 Routes',
    image: MAHARASHTRA_MONSOON_IMAGES.sections.aboutKalsubai,
  },
  {
    title: 'Rajmachi',
    trips: 'Night Treks',
    image: MAHARASHTRA_MONSOON_IMAGES.sections.aboutRajmachi,
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
      <section className="relative overflow-hidden bg-dark-900 pt-28">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-30"
          style={{ backgroundImage: `url(${MAHARASHTRA_MONSOON_IMAGES.heroes.about})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-dark-900/90 via-dark-900/70 to-dark-900/40" />

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          className="relative mx-auto max-w-7xl px-4 pb-20 pt-20 sm:px-6 lg:px-8"
        >
          <p className="text-sm font-semibold uppercase tracking-wider text-primary-400">
            About Alpha Trekkers
          </p>
          <div className="mt-6 grid gap-10 lg:grid-cols-2 lg:items-end">
            <div>
              <h1 className="max-w-2xl text-5xl font-extrabold leading-tight text-white sm:text-6xl">
                We Shape Maharashtra Treks To Feel{' '}
                <span className="text-primary-400">Rich & Worth Remembering</span>
              </h1>
              <p className="mt-6 max-w-xl text-lg leading-8 text-dark-300">
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
                  <button className="rounded-lg border-2 border-white/30 px-8 py-3.5 text-sm font-bold uppercase tracking-wider text-white transition hover:border-primary-400 hover:text-primary-400">
                    Talk To The Team
                  </button>
                </Link>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
                <p className="text-xs font-semibold uppercase tracking-wider text-primary-400">Brand Direction</p>
                <p className="mt-3 text-2xl font-bold text-white">
                  Editorial visuals with grounded trek operations.
                </p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
                <p className="text-xs font-semibold uppercase tracking-wider text-primary-400">Core Belief</p>
                <p className="mt-3 text-sm leading-7 text-dark-300">
                  Better journeys come from clearer pacing, sharper planning, and guides who know the hills deeply.
                </p>
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
            <p className="text-sm font-semibold uppercase tracking-wider text-primary-500">Our Story</p>
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
            className="relative"
          >
            <img
              src={MAHARASHTRA_MONSOON_IMAGES.sections.chooseUsRange}
              alt="Sahyadri mountain range"
              className="h-[450px] w-full rounded-2xl object-cover shadow-xl"
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <button className="flex h-16 w-16 items-center justify-center rounded-full bg-primary-500 text-white shadow-2xl transition hover:scale-110">
                <Play className="h-7 w-7" weight="fill" />
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ─── VALUES SECTION ─── */}
      <section className="bg-dark-50 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-sm font-semibold uppercase tracking-wider text-primary-500">Why Choose Us</p>
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
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="text-center">
          <p className="playful-text text-3xl text-primary-500">Explore Maharashtra</p>
          <h2 className="mt-2 text-4xl font-bold text-dark-900 sm:text-5xl">
            Popular Destinations
          </h2>
        </div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.12 }}
          className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          {destinations.map((destination) => (
            <motion.div
              key={destination.title}
              variants={item}
              whileHover={{ y: -8 }}
            >
              <Link
                to="/trips"
                className="group relative block h-72 overflow-hidden rounded-2xl"
              >
                <img
                  src={destination.image}
                  alt={destination.title}
                  className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-dark-900/70 via-transparent to-transparent" />
                <div className="absolute right-4 top-4 rounded-lg bg-primary-500 px-3 py-1.5 text-xs font-bold text-white">
                  {destination.trips}
                </div>
                <div className="absolute inset-x-0 bottom-0 p-6">
                  <div className="flex items-center gap-2">
                    <MapPinLine className="h-5 w-5 text-primary-400" weight="duotone" />
                    <p className="text-2xl font-bold text-white">{destination.title}</p>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* ─── WHO TRAVELS WITH US ─── */}
      <section className="bg-dark-900 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wider text-primary-400">Who Travels With Us</p>
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
                  <p className="leading-7 text-dark-300">
                    The direction may feel more premium now, but the core remains inclusive: easy
                    starts for beginners, structured departures for busy professionals, and enough
                    depth for serious trekkers who care about route details.
                  </p>
                  <div className="mt-6 flex flex-wrap gap-3">
                    {['First-time friendly', 'Local route knowledge', 'Better group pacing'].map((tag) => (
                      <span key={tag} className="rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm text-dark-300">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-10 rounded-2xl border border-white/10 bg-white/5 p-6">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary-500/20">
                <Mountains className="h-8 w-8 text-primary-400" weight="duotone" />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-primary-400">What Makes It Work</p>
                <p className="mt-2 leading-7 text-dark-300">
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
