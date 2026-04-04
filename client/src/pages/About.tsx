import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import {
  Mountains,
  Eye,
  Target,
  ShieldCheck,
  Users,
  TreeEvergreen,
  Handshake,
} from '@phosphor-icons/react';

function FadeIn({
  children,
  className = '',
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay, ease: 'easeOut' }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

const stats = [
  { value: '500+', label: 'Treks Organized' },
  { value: '10K+', label: 'Happy Trekkers' },
  { value: '50+', label: 'Fort Treks' },
  { value: '5+', label: 'Years Experience' },
];

const values = [
  { Icon: ShieldCheck, title: 'Safety', desc: 'Every trek is planned with safety protocols, first-aid kits, and experienced guides who know the terrain.' },
  { Icon: TreeEvergreen, title: 'Sustainability', desc: 'We practice zero-waste trekking, support local communities, and contribute to fort conservation efforts.' },
  { Icon: Users, title: 'Community', desc: 'More than a trekking company, we are a community of nature lovers who share a passion for the outdoors.' },
  { Icon: Handshake, title: 'Integrity', desc: 'Transparent pricing, honest trip descriptions, and genuine care for every trekker who joins us.' },
];

const team = [
  { name: 'Aarav Patel', role: 'Founder & Lead Guide', img: '' },
  { name: 'Priya Deshmukh', role: 'Operations Head', img: '' },
  { name: 'Rohan Joshi', role: 'Senior Trek Guide', img: '' },
  { name: 'Ananya Kulkarni', role: 'Community Manager', img: '' },
];

export default function About() {
  return (
    <>
      {/* Hero */}
      <section className="relative flex h-80 items-end overflow-hidden bg-forest-900 sm:h-96">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1454496522488-7a8e488e8606?w=1920&q=80')] bg-cover bg-center opacity-25" />
        <div className="absolute inset-0 bg-gradient-to-t from-forest-900 via-forest-900/60 to-transparent" />
        <div className="relative z-10 mx-auto w-full max-w-7xl px-4 pb-12 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <span className="mb-3 inline-block rounded-full bg-forest-500/15 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-forest-400">
              Our Story
            </span>
            <h1 className="font-heading text-4xl font-bold text-white sm:text-5xl">
              About Alpha Trekkers
            </h1>
            <p className="mt-3 max-w-xl text-forest-300/70">
              Born from a passion for the Sahyadri mountains, we bring Maharashtra&apos;s majestic
              forts and trails to life for adventurers everywhere.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <FadeIn>
              <div className="overflow-hidden rounded-2xl">
                <img
                  src="https://images.unsplash.com/photo-1551632811-561732d1e306?w=800&q=80"
                  alt="Trekkers on a mountain trail"
                  className="h-80 w-full object-cover lg:h-[450px]"
                />
              </div>
            </FadeIn>
            <FadeIn delay={0.15}>
              <span className="mb-3 inline-block rounded-full bg-forest-500/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-forest-600">
                Our Story
              </span>
              <h2 className="mb-4 font-heading text-3xl font-bold text-forest-900">
                From Summit Dreams to Reality
              </h2>
              <div className="space-y-4 text-sm leading-relaxed text-forest-600/80">
                <p>
                  Alpha Trekkers was founded by a group of passionate mountaineers who
                  grew up exploring the Sahyadri range. What started as weekend adventures
                  among friends quickly grew into a mission to share Maharashtra&apos;s
                  incredible trekking heritage with the world.
                </p>
                <p>
                  Today, we organize over 500 treks annually, taking adventurers to
                  ancient forts, hidden waterfalls, and stunning peaks. Our team of
                  certified guides ensures every trek is safe, educational, and
                  unforgettable.
                </p>
                <p>
                  We believe that the mountains belong to everyone. That&apos;s why we
                  keep our prices accessible while never compromising on safety or
                  experience quality.
                </p>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="bg-forest-900 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 md:grid-cols-2">
            <FadeIn>
              <div className="rounded-2xl border border-forest-700/50 bg-forest-800/50 p-8">
                <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-xl bg-forest-500/20">
                  <Target className="h-7 w-7 text-forest-400" weight="duotone" />
                </div>
                <h3 className="mb-3 font-heading text-2xl font-bold text-white">Our Mission</h3>
                <p className="text-sm leading-relaxed text-forest-300/70">
                  To make Maharashtra&apos;s trekking heritage accessible to everyone
                  while promoting responsible adventure tourism, preserving historical
                  forts, and building a community of mindful explorers.
                </p>
              </div>
            </FadeIn>
            <FadeIn delay={0.1}>
              <div className="rounded-2xl border border-forest-700/50 bg-forest-800/50 p-8">
                <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-xl bg-amber-500/20">
                  <Eye className="h-7 w-7 text-amber-400" weight="duotone" />
                </div>
                <h3 className="mb-3 font-heading text-2xl font-bold text-white">Our Vision</h3>
                <p className="text-sm leading-relaxed text-forest-300/70">
                  To become Maharashtra&apos;s most trusted trekking community, known for
                  safety, sustainability, and creating life-changing outdoor experiences
                  that inspire a deeper connection with nature and history.
                </p>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16">
        <div className="mx-auto max-w-5xl px-4">
          <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
            {stats.map((stat, i) => (
              <FadeIn key={stat.label} delay={i * 0.08} className="text-center">
                <p className="font-heading text-3xl font-bold text-forest-800">{stat.value}</p>
                <p className="mt-1 text-sm text-forest-500">{stat.label}</p>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="bg-forest-50/50 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <FadeIn className="mb-12 text-center">
            <span className="mb-3 inline-block rounded-full bg-forest-500/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-forest-600">
              Our Values
            </span>
            <h2 className="font-heading text-3xl font-bold text-forest-900 sm:text-4xl">
              What We Stand For
            </h2>
          </FadeIn>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {values.map(({ Icon, title, desc }, i) => (
              <FadeIn key={title} delay={i * 0.1}>
                <div className="rounded-2xl border border-forest-100 bg-white p-6 shadow-sm">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-forest-50">
                    <Icon className="h-6 w-6 text-forest-600" weight="duotone" />
                  </div>
                  <h3 className="mb-2 font-heading text-lg font-semibold text-forest-900">
                    {title}
                  </h3>
                  <p className="text-sm leading-relaxed text-forest-600/70">{desc}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <FadeIn className="mb-12 text-center">
            <span className="mb-3 inline-block rounded-full bg-forest-500/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-forest-600">
              Our Team
            </span>
            <h2 className="font-heading text-3xl font-bold text-forest-900 sm:text-4xl">
              Meet the Guides
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-sm text-forest-600/70">
              Experienced, certified, and passionate about the mountains.
            </p>
          </FadeIn>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {team.map((member, i) => (
              <FadeIn key={member.name} delay={i * 0.1}>
                <div className="group overflow-hidden rounded-2xl border border-forest-100 bg-white shadow-sm transition-shadow hover:shadow-lg">
                  <div className="flex h-48 items-center justify-center bg-gradient-to-br from-forest-100 to-forest-200">
                    <Mountains className="h-16 w-16 text-forest-300" weight="duotone" />
                  </div>
                  <div className="p-5 text-center">
                    <h3 className="font-heading text-base font-semibold text-forest-900">
                      {member.name}
                    </h3>
                    <p className="mt-1 text-sm text-forest-500">{member.role}</p>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
