import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MAHARASHTRA_MONSOON_IMAGES } from '@alpha-trekkers/shared';
import {
  ArrowRight,
  Eye,
  Handshake,
  MapPinLine,
  Mountains,
  ShieldCheck,
  TreeEvergreen,
  Users,
} from '@phosphor-icons/react';
import Button from '@/components/ui/Button';

const values = [
  {
    Icon: Eye,
    title: 'Clear travel direction',
    copy: 'We plan journeys with enough detail that guests always know what comes next, without losing the thrill of the route.',
  },
  {
    Icon: ShieldCheck,
    title: 'Safety as a standard',
    copy: 'Route checks, leader briefing, and emergency readiness are built into operations, not treated as add-ons.',
  },
  {
    Icon: Handshake,
    title: 'Human-led hosting',
    copy: 'Treks feel warmer when they are guided by people who know the history, terrain, and group rhythm deeply.',
  },
  {
    Icon: TreeEvergreen,
    title: 'Respect for the trail',
    copy: 'We design for low-friction travel, cleaner camps, and more mindful movement through the hills.',
  },
];

const destinations = [
  {
    title: 'Rajgad',
    subtitle: 'Travel To',
    trips: '6 Routes',
    image: MAHARASHTRA_MONSOON_IMAGES.sections.aboutRajgad,
  },
  {
    title: 'Harishchandragad',
    subtitle: 'Travel To',
    trips: '4 Routes',
    image: MAHARASHTRA_MONSOON_IMAGES.sections.aboutHarishchandragad,
  },
  {
    title: 'Torna',
    subtitle: 'Travel To',
    trips: '5 Routes',
    image: MAHARASHTRA_MONSOON_IMAGES.sections.aboutTorna,
  },
  {
    title: 'Kalsubai',
    subtitle: 'Travel To',
    trips: '3 Routes',
    image: MAHARASHTRA_MONSOON_IMAGES.sections.aboutKalsubai,
  },
  {
    title: 'Rajmachi',
    subtitle: 'Travel To',
    trips: 'Night Treks',
    image: MAHARASHTRA_MONSOON_IMAGES.sections.aboutRajmachi,
  },
];

const storyStats = [
  { value: '2019', label: 'Operations started' },
  { value: '12K+', label: 'Trekkers hosted' },
  { value: 'Local-first', label: 'Maharashtra trail focus' },
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 22 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: 'easeOut' } },
};

export default function About() {
  return (
    <>
      <section className="travel-dark relative overflow-hidden pt-28">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-28"
          style={{ backgroundImage: `url(${MAHARASHTRA_MONSOON_IMAGES.heroes.about})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-ink-950/88 via-ink-900/74 to-ink-900/24" />
        <div className="absolute -left-16 top-32 h-48 w-48 rounded-full bg-gold-500/14 blur-3xl" />
        <div className="absolute right-0 top-20 h-64 w-64 rounded-full bg-forest-500/18 blur-3xl" />

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          className="relative mx-auto max-w-7xl px-4 pb-[5.5rem] pt-20 sm:px-6 lg:px-8"
        >
          <span className="section-label !bg-white/10 !text-sand-100 before:!bg-gold-400">
            About Alpha Trekkers
          </span>
          <div className="mt-8 grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-end">
            <div>
              <h1 className="max-w-4xl font-heading text-5xl leading-[0.94] text-white sm:text-6xl lg:text-7xl">
                We shape Maharashtra treks to feel rich, calm, and worth remembering.
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-sand-100/78">
                Alpha Trekkers is built around guided fort journeys, trail timing, and local route
                knowledge. The goal is simple: make outdoor travel feel premium without making it
                feel artificial.
              </p>
              <div className="mt-8 flex flex-col gap-4 sm:flex-row">
                <Link to="/trips">
                  <Button size="lg" variant="accent" rightIcon={<ArrowRight className="h-5 w-5" />}>
                    Explore departures
                  </Button>
                </Link>
                <Link to="/contact">
                  <Button
                    size="lg"
                    variant="secondary"
                    className="border-white/20 bg-white/10 text-white hover:bg-white/16 hover:text-white"
                  >
                    Talk to the team
                  </Button>
                </Link>
              </div>
            </div>

            <motion.div
              variants={container}
              initial="hidden"
              animate="show"
              className="grid gap-4 sm:grid-cols-2"
            >
              <motion.div
                variants={item}
                className="rounded-[2rem] border border-white/12 bg-white/10 p-6 backdrop-blur-md"
              >
                <p className="text-xs uppercase tracking-[0.18em] text-gold-400">Brand direction</p>
                <p className="mt-4 font-heading text-4xl text-white">
                  Editorial visuals with grounded trek operations.
                </p>
              </motion.div>
              <motion.div
                variants={item}
                className="rounded-[2rem] border border-white/12 bg-white/10 p-6 backdrop-blur-md"
              >
                <p className="text-xs uppercase tracking-[0.18em] text-gold-400">Core belief</p>
                <p className="mt-4 text-base leading-8 text-sand-100/76">
                  Better journeys come from clearer pacing, sharper planning, and guides who know the hills deeply.
                </p>
              </motion.div>
              <motion.div
                variants={item}
                className="rounded-[2rem] border border-white/12 bg-white/10 p-6 backdrop-blur-md sm:col-span-2"
              >
                <div className="flex flex-wrap gap-3 text-sm text-sand-100/84">
                  <span className="rounded-full border border-white/14 bg-white/8 px-4 py-2">
                    Fort history and route storytelling
                  </span>
                  <span className="rounded-full border border-white/14 bg-white/8 px-4 py-2">
                    Weekend and night departures
                  </span>
                  <span className="rounded-full border border-white/14 bg-white/8 px-4 py-2">
                    Local support from pickup to descent
                  </span>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </motion.div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[1.02fr_0.98fr] lg:items-center">
          <motion.div
            initial={{ opacity: 0, x: -22 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="travel-panel relative overflow-hidden rounded-[2.6rem] p-8 sm:p-10"
          >
            <div className="absolute -right-8 top-0 h-40 w-40 rounded-full bg-forest-500/10 blur-3xl" />
            <p className="playful-text text-xl text-forest-500 mb-2">~ Our Story ~</p>
            <p className="text-xs uppercase tracking-[0.2em] text-forest-500">Our perspective</p>
            <h2 className="mt-4 font-heading text-5xl leading-tight text-ink-900">
              Adventure should feel polished, not chaotic.
            </h2>
            <p className="mt-5 text-base leading-8 text-ink-700/74">
              We are not trying to make the mountains look like a resort product. We are trying to
              make the full journey feel better organized, more visually appealing, and easier to
              trust from the first click to the final descent.
            </p>
            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              {storyStats.map((stat) => (
                <motion.div
                  key={stat.label}
                  whileHover={{ y: -6 }}
                  className="rounded-[1.7rem] bg-sand-100 p-5 shadow-[0_18px_36px_rgba(17,32,51,0.06)]"
                >
                  <p className="font-heading text-4xl text-ink-900">{stat.value}</p>
                  <p className="mt-2 text-sm leading-6 text-ink-700/70">{stat.label}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
            className="grid gap-4"
          >
            {values.map(({ Icon, title, copy }) => (
              <motion.div
                key={title}
                variants={item}
                whileHover={{ y: -6, scale: 1.01 }}
                className="travel-panel rounded-[1.9rem] p-6"
              >
                <div className="flex items-start gap-4">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-forest-500/10">
                    <Icon className="h-7 w-7 text-forest-500" weight="duotone" />
                  </div>
                  <div>
                    <h3 className="font-heading text-3xl text-ink-900">{title}</h3>
                    <p className="mt-2 text-sm leading-7 text-ink-700/72">{copy}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="text-center"
        >
          <p className="playful-text text-3xl text-forest-500">Explore Maharashtra</p>
          <h2 className="mt-2 font-body text-5xl font-semibold text-ink-900 sm:text-6xl">
            Popular Destinations
          </h2>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.12 }}
          className="mt-12 grid gap-5 lg:grid-cols-12"
        >
          {destinations.map((destination, index) => {
            const wide = index === 0 || index === 1 || index === 4;

            return (
              <motion.div
                key={destination.title}
                variants={item}
                whileHover={{ y: -8 }}
                className={wide ? 'lg:col-span-4' : 'lg:col-span-4'}
              >
                <Link
                  to="/trips"
                  className={`group relative block overflow-hidden rounded-[1.35rem] ${
                    wide ? 'min-h-[18rem] lg:min-h-[20rem]' : 'min-h-[18rem]'
                  }`}
                >
                  <img
                    src={destination.image}
                    alt={destination.title}
                    className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105 group-hover:rotate-[0.4deg]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink-950 via-ink-950/35 to-transparent" />
                  <div className="absolute right-4 top-4 rounded-lg bg-gold-500 px-4 py-2 text-xs font-semibold uppercase tracking-[0.06em] text-white">
                    {destination.trips}
                  </div>
                  <div className="absolute inset-x-0 bottom-0 p-6">
                    <p className="playful-text text-2xl text-sand-100">{destination.subtitle}</p>
                    <div className="mt-2 flex items-center gap-3">
                      <MapPinLine className="h-5 w-5 text-gold-400" weight="duotone" />
                      <p className="font-body text-3xl font-semibold text-white">{destination.title}</p>
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </motion.div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="travel-dark relative overflow-hidden rounded-[2.8rem] p-8 text-white sm:p-10 lg:p-12"
        >
          <div className="absolute right-0 top-0 h-56 w-56 rounded-full bg-forest-500/18 blur-3xl" />
          <div className="absolute bottom-0 left-0 h-56 w-56 rounded-full bg-gold-500/16 blur-3xl" />
          <div className="relative grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-gold-400">Who travels with us</p>
              <h2 className="mt-4 max-w-3xl font-heading text-5xl leading-tight">
                Weekend hikers, first-timers, repeat fort nerds, and everyone between.
              </h2>
            </div>
            <motion.div
              whileHover={{ y: -6 }}
              className="rounded-[2rem] border border-white/12 bg-white/8 p-6"
            >
              <div className="flex items-start gap-4">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white/10">
                  <Users className="h-8 w-8 text-gold-400" weight="duotone" />
                </div>
                <div>
                  <p className="text-base leading-8 text-sand-100/76">
                    The direction may feel more premium now, but the core remains inclusive: easy
                    starts for beginners, structured departures for busy professionals, and enough
                    depth for serious trekkers who care about route details and place history.
                  </p>
                  <div className="mt-6 flex flex-wrap gap-3 text-sm text-sand-100/84">
                    <span className="rounded-full border border-white/12 bg-white/8 px-4 py-2">
                      First-time friendly
                    </span>
                    <span className="rounded-full border border-white/12 bg-white/8 px-4 py-2">
                      Strong local route knowledge
                    </span>
                    <span className="rounded-full border border-white/12 bg-white/8 px-4 py-2">
                      Better group pacing
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.55, ease: 'easeOut', delay: 0.12 }}
            className="relative mt-10 rounded-[2rem] border border-white/10 bg-white/6 p-6"
          >
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gold-500/14">
                <Mountains className="h-8 w-8 text-gold-400" weight="duotone" />
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-gold-400">What makes it work</p>
                <p className="mt-2 max-w-3xl text-base leading-8 text-sand-100/76">
                  We keep the visual tone elevated, but the product itself stays practical: route
                  clarity, meeting-point confidence, trained leaders, and better use of the terrain we already know well.
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </section>
    </>
  );
}
