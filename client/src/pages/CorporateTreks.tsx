import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  CalendarBlank,
  EnvelopeSimple,
  Handshake,
  MapPinLine,
  PaperPlaneTilt,
  PhoneCall,
  ShieldCheck,
  Star,
  Trophy,
  UsersThree,
} from '@phosphor-icons/react';
import { MAHARASHTRA_MONSOON_IMAGES } from '@alpha-trekkers/shared';
import toast from 'react-hot-toast';
import api from '@/lib/axios';
import Button from '@/components/ui/Button';

const offerings = [
  {
    Icon: UsersThree,
    title: 'Team Offsites',
    copy: 'One-day and weekend trek plans built for bonding, fresh energy, and better internal chemistry.',
  },
  {
    Icon: Trophy,
    title: 'Rewards & Recognition',
    copy: 'Celebrate high-performing teams with polished guided departures that feel memorable, not improvised.',
  },
  {
    Icon: Handshake,
    title: 'Leadership Retreats',
    copy: 'Smaller-format experiences for founders, managers, and leadership groups who want space to think clearly.',
  },
  {
    Icon: ShieldCheck,
    title: 'Safe Group Hosting',
    copy: 'Route planning, pacing, support touchpoints, and emergency readiness are built into every corporate plan.',
  },
];

const galleryImages = [
  {
    title: 'Summit team photo moments',
    src: MAHARASHTRA_MONSOON_IMAGES.trips.kalsubai[0],
  },
  {
    title: 'Guided fort trails for larger groups',
    src: MAHARASHTRA_MONSOON_IMAGES.trips.rajgad[0],
  },
  {
    title: 'Monsoon routes with transport coordination',
    src: MAHARASHTRA_MONSOON_IMAGES.sections.monsoonTrails,
  },
  {
    title: 'High-energy ridge walks and trail breaks',
    src: MAHARASHTRA_MONSOON_IMAGES.trips.torna[0],
  },
  {
    title: 'Well-paced day plans near Pune and Mumbai',
    src: MAHARASHTRA_MONSOON_IMAGES.trips.lohagad[0],
  },
  {
    title: 'Custom corporate group departures',
    src: MAHARASHTRA_MONSOON_IMAGES.trips.rajmachi[0],
  },
];

const companyLogos = [
  { name: 'TCS', subtext: 'Technology', color: '#1f4fa3' },
  { name: 'Infosys', subtext: 'IT Services', color: '#007cc3' },
  { name: 'Wipro', subtext: 'Consulting', color: '#6b3fa0' },
  { name: 'Accenture', subtext: 'Operations', color: '#7f39fb' },
  { name: 'Cognizant', subtext: 'Delivery', color: '#0047bb' },
  { name: 'Capgemini', subtext: 'Enterprise', color: '#00a3e0' },
];

const corporateSchema = z.object({
  contactName: z.string().min(2, 'Contact person is required'),
  companyName: z.string().min(2, 'Company name is required'),
  workEmail: z.string().email('Valid work email required'),
  phone: z
    .string()
    .trim()
    .refine((value) => value === '' || /^[6-9]\d{9}$/.test(value), 'Invalid Indian phone number'),
  teamSize: z.string().min(1, 'Select a team size'),
  preferredMonth: z.string().min(1, 'Select a preferred month'),
  departureCity: z.string().min(2, 'Departure city is required'),
  goals: z.string().min(3, 'Tell us the purpose of the outing'),
  notes: z.string().min(10, 'Add a few details so we can plan better'),
});

type CorporateFormData = z.infer<typeof corporateSchema>;

export default function CorporateTreks() {
  const [submitted, setSubmitted] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CorporateFormData>({
    resolver: zodResolver(corporateSchema),
    defaultValues: {
      contactName: '',
      companyName: '',
      workEmail: '',
      phone: '',
      teamSize: '',
      preferredMonth: '',
      departureCity: '',
      goals: '',
      notes: '',
    },
  });

  const onSubmit = async (data: CorporateFormData) => {
    const payload = {
      name: data.contactName,
      email: data.workEmail,
      phone: data.phone || undefined,
      subject: `Corporate Trek Enquiry - ${data.companyName}`,
      message: [
        `Company: ${data.companyName}`,
        `Team size: ${data.teamSize}`,
        `Preferred month: ${data.preferredMonth}`,
        `Departure city: ${data.departureCity}`,
        `Event goal: ${data.goals}`,
        '',
        'Additional planning notes:',
        data.notes,
      ].join('\n'),
    };

    try {
      await api.post('/contact', payload);
      setSubmitted(true);
      reset();
      toast.success('Corporate enquiry sent. Our team will get back to you shortly.');
    } catch {
      toast.error('Unable to submit the enquiry right now.');
    }
  };

  return (
    <>
      <section className="travel-dark relative overflow-hidden pt-28">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${MAHARASHTRA_MONSOON_IMAGES.sections.chooseUsRange})` }}
        />
        <div className="absolute inset-0 bg-[linear-gradient(100deg,rgba(8,15,24,0.92),rgba(8,15,24,0.74),rgba(8,15,24,0.38))]" />

        <div className="relative mx-auto grid max-w-7xl items-start gap-10 px-4 pb-16 pt-20 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:px-8">
          <div>
            <span className="section-label !bg-white/10 !text-sand-100 before:!bg-gold-400">
              Corporate Treks
            </span>
            <h1 className="mt-6 max-w-3xl font-heading text-5xl leading-[0.95] !text-white sm:text-6xl">
              Trek outings for companies that want more than a generic offsite.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 !text-white/85">
              We design guided trek experiences for startups, MNCs, and company teams across Maharashtra,
              with transport planning, paced routes, safety support, and a cleaner on-ground experience.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <a href="#corporate-enquiry">
                <Button size="lg">Send Enquiry</Button>
              </a>
              <a href="#corporate-gallery">
                <Button variant="secondary" size="lg">
                  View Gallery
                </Button>
              </a>
            </div>

          </div>

          <div className="pt-1 lg:pt-2">
            <p className="section-script !text-primary-300">Why this works</p>
            <h2 className="mt-4 font-heading text-4xl !text-white">Built for company groups</h2>
            <div className="mt-6 space-y-4">
              {[
                'Structured pre-event planning with one point of contact',
                'Routes matched to team energy, season, and travel time',
                'Options for breakfast, lunch, buses, and private departures',
                'Better photo moments, leader briefings, and group pacing',
              ].map((point) => (
                <div key={point} className="flex items-start gap-3 py-1">
                  <Star className="mt-0.5 h-5 w-5 text-gold-500" weight="fill" />
                  <p className="text-sm leading-6 !text-white/88">{point}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="section-script">Corporate formats</p>
            <h2 className="mt-3 font-heading text-5xl text-ink-900">Experiences shaped for teams</h2>
          </div>
          <p className="max-w-2xl text-sm leading-7 text-ink-600">
            Suitable for annual outings, milestone celebrations, employee engagement, and culture-building
            days that still feel organized and premium.
          </p>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {offerings.map(({ Icon, title, copy }) => (
            <div key={title} className="travel-panel rounded-[1.8rem] p-6">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-forest-500/10">
                <Icon className="h-7 w-7 text-forest-500" weight="duotone" />
              </div>
              <h3 className="mt-5 font-heading text-3xl text-ink-900">{title}</h3>
              <p className="mt-3 text-sm leading-7 text-ink-600">{copy}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-sand-50 py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="section-script">Company logos</p>
              <h2 className="mt-3 font-heading text-4xl text-ink-900">Trusted by modern teams and enterprise groups</h2>
            </div>
            <p className="max-w-2xl text-sm leading-7 text-ink-600">
              A branded corporate trek page should show social proof immediately, so this section gives the
              page a recognisable B2B layer instead of feeling like a standard public trek listing.
            </p>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-6">
            {companyLogos.map((company) => (
              <div key={company.name} className="rounded-[1.5rem] border border-dark-200 bg-white px-5 py-6 text-center shadow-sm">
                <p className="text-[1.65rem] font-black uppercase tracking-[0.08em]" style={{ color: company.color }}>
                  {company.name}
                </p>
                <p className="mt-2 text-xs uppercase tracking-[0.16em] text-ink-400">{company.subtext}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="corporate-gallery" className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="section-script">Gallery</p>
            <h2 className="mt-3 font-heading text-5xl text-ink-900">Corporate trek gallery</h2>
          </div>
          <p className="max-w-2xl text-sm leading-7 text-ink-600">
            Use this section to showcase how the outings look on-ground: team photos, guided movement,
            scenic breaks, and polished group experiences.
          </p>
        </div>

        <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {galleryImages.map((image, index) => (
            <div
              key={image.title}
              className={`group relative overflow-hidden rounded-[1.9rem] ${
                index === 0 || index === 4 ? 'md:col-span-2 xl:col-span-1' : ''
              }`}
            >
              <img
                src={image.src}
                alt={image.title}
                className="h-[18rem] w-full object-cover transition duration-500 group-hover:scale-[1.04] sm:h-[21rem]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-dark-900/88 via-dark-900/42 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-5">
                <p className="text-sm font-semibold uppercase tracking-[0.14em] !text-white/90">Gallery frame</p>
                <h3 className="mt-2 max-w-sm font-heading text-3xl !text-white">{image.title}</h3>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section id="corporate-enquiry" className="bg-dark-900 py-16 text-white">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 sm:px-6 lg:grid-cols-[0.88fr_1.12fr] lg:px-8">
          <div className="space-y-4">
            <p className="section-script !text-primary-300">Corporate enquiry</p>
            <h2 className="font-heading text-5xl !text-white">Plan your company trek</h2>
            <p className="max-w-xl text-sm leading-7 text-sand-100/76">
              Share your team size, preferred month, and the kind of outing you want. We will shape the
              route and logistics around your group.
            </p>

            <div className="space-y-4 pt-4">
              <div className="rounded-[1.6rem] border border-white/10 bg-white/5 p-5">
                <p className="flex items-center gap-3 text-sm text-sand-100">
                  <PhoneCall className="h-5 w-5 text-primary-300" />
                  +91 98765 43210
                </p>
              </div>
              <div className="rounded-[1.6rem] border border-white/10 bg-white/5 p-5">
                <p className="flex items-center gap-3 text-sm text-sand-100">
                  <EnvelopeSimple className="h-5 w-5 text-primary-300" />
                  hello@alphatrekkers.com
                </p>
              </div>
              <div className="rounded-[1.6rem] border border-white/10 bg-white/5 p-5">
                <p className="flex items-center gap-3 text-sm text-sand-100">
                  <MapPinLine className="h-5 w-5 text-primary-300" />
                  Departures planned from Pune, Mumbai, and nearby hubs
                </p>
              </div>
              <div className="rounded-[1.6rem] border border-white/10 bg-white/5 p-5">
                <p className="flex items-center gap-3 text-sm text-sand-100">
                  <CalendarBlank className="h-5 w-5 text-primary-300" />
                  Good fit for quarterly offsites, annual outings, and rewards trips
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-[2rem] bg-white p-8 text-ink-900 sm:p-10">
            <h3 className="font-heading text-4xl text-ink-900">Corporate Trek Enquiry Form</h3>
            <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-5">
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium text-ink-700">Contact person</label>
                  <input {...register('contactName')} className="travel-input" />
                  {errors.contactName ? <p className="mt-2 text-xs text-coral-600">{errors.contactName.message}</p> : null}
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-ink-700">Company name</label>
                  <input {...register('companyName')} className="travel-input" />
                  {errors.companyName ? <p className="mt-2 text-xs text-coral-600">{errors.companyName.message}</p> : null}
                </div>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium text-ink-700">Work email</label>
                  <input {...register('workEmail')} className="travel-input" autoComplete="email" />
                  {errors.workEmail ? <p className="mt-2 text-xs text-coral-600">{errors.workEmail.message}</p> : null}
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-ink-700">Phone</label>
                  <input {...register('phone')} className="travel-input" autoComplete="tel" />
                  {errors.phone ? <p className="mt-2 text-xs text-coral-600">{errors.phone.message}</p> : null}
                </div>
              </div>

              <div className="grid gap-5 sm:grid-cols-3">
                <div>
                  <label className="mb-2 block text-sm font-medium text-ink-700">Team size</label>
                  <select {...register('teamSize')} className="travel-input">
                    <option value="">Select</option>
                    <option value="10-25">10-25</option>
                    <option value="26-50">26-50</option>
                    <option value="51-100">51-100</option>
                    <option value="100+">100+</option>
                  </select>
                  {errors.teamSize ? <p className="mt-2 text-xs text-coral-600">{errors.teamSize.message}</p> : null}
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-ink-700">Preferred month</label>
                  <select {...register('preferredMonth')} className="travel-input">
                    <option value="">Select</option>
                    <option value="June-August">June-August</option>
                    <option value="September-November">September-November</option>
                    <option value="December-February">December-February</option>
                    <option value="March-May">March-May</option>
                  </select>
                  {errors.preferredMonth ? <p className="mt-2 text-xs text-coral-600">{errors.preferredMonth.message}</p> : null}
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-ink-700">Departure city</label>
                  <input {...register('departureCity')} className="travel-input" />
                  {errors.departureCity ? <p className="mt-2 text-xs text-coral-600">{errors.departureCity.message}</p> : null}
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-ink-700">Purpose of the outing</label>
                <input
                  {...register('goals')}
                  className="travel-input"
                  placeholder="Team bonding, rewards, leadership retreat, annual offsite..."
                />
                {errors.goals ? <p className="mt-2 text-xs text-coral-600">{errors.goals.message}</p> : null}
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-ink-700">Planning notes</label>
                <textarea
                  {...register('notes')}
                  rows={6}
                  className="travel-input resize-none"
                  placeholder="Share trek preferences, travel constraints, food requirements, or any logistics detail."
                />
                {errors.notes ? <p className="mt-2 text-xs text-coral-600">{errors.notes.message}</p> : null}
              </div>

              <Button
                type="submit"
                size="lg"
                isLoading={isSubmitting}
                rightIcon={<PaperPlaneTilt className="h-5 w-5" />}
              >
                Submit corporate enquiry
              </Button>

              {submitted ? (
                <p className="rounded-[1.2rem] bg-forest-500/10 px-4 py-3 text-sm text-forest-600">
                  Your corporate enquiry was submitted successfully.
                </p>
              ) : null}
            </form>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="travel-panel flex flex-col gap-6 rounded-[2rem] p-8 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="section-script">Need public departures instead?</p>
            <h2 className="mt-2 font-heading text-4xl text-ink-900">Explore one-day trips and quick getaways</h2>
          </div>
          <div className="flex flex-wrap gap-4">
            <Link to="/trips">
              <Button>Browse Day Trips</Button>
            </Link>
            <Link to="/contact">
              <Button variant="secondary">Contact Team</Button>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
