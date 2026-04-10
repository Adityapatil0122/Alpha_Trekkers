import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Clock, EnvelopeSimple, MapPinLine, PaperPlaneTilt, PhoneCall } from '@phosphor-icons/react';
import toast from 'react-hot-toast';
import { useSearchParams } from 'react-router-dom';
import api from '@/lib/axios';
import Button from '@/components/ui/Button';
import {
  buildOneDayTripInquiryMessage,
  buildOneDayTripInquirySubject,
  findOneDayTripBySlug,
} from '@/content/oneDayTrips';

const schema = z.object({
  name: z.string().min(2, 'Name is required'),
  email: z.string().email('Valid email required'),
  phone: z.string().optional(),
  subject: z.string().min(3, 'Subject is required'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
});

type FormData = z.infer<typeof schema>;

type InfoItem = {
  Icon: typeof PhoneCall;
  label: string;
  value: string;
  detail: string;
  href?: string;
};

const info: InfoItem[] = [
  {
    Icon: PhoneCall,
    label: 'Call us',
    value: '+91 98765 43210',
    detail: 'Best for urgent route questions and private departure planning.',
    href: 'tel:+919876543210',
  },
  {
    Icon: EnvelopeSimple,
    label: 'Email',
    value: 'hello@alphatrekkers.com',
    detail: 'Share your rough plan and we will shape the right trek for it.',
    href: 'mailto:hello@alphatrekkers.com',
  },
  {
    Icon: MapPinLine,
    label: 'Base camp',
    value: 'Pune, Maharashtra',
    detail: 'We coordinate departures across Sahyadri monsoon trails and fort circuits.',
  },
  {
    Icon: Clock,
    label: 'Support window',
    value: 'Mon to Sat, 9 AM to 7 PM',
    detail: 'Expect a quick reply for trek planning, slots, and custom outing requests.',
  },
] as const;

const contactHeroImage = `/destinations/${encodeURIComponent('Lohagad Fort panorama in Maharashtra.png')}`;

const inputClassName =
  'w-full rounded-[1.15rem] border border-[#d7e2df] bg-white/90 px-4 py-3.5 text-sm text-ink-900 shadow-[inset_0_1px_0_rgba(255,255,255,0.65)] outline-none transition placeholder:text-ink-600/55 focus:border-forest-500 focus:bg-white focus:shadow-[0_0_0_4px_rgba(92,184,92,0.12)]';

export default function Contact() {
  const [submitted, setSubmitted] = useState(false);
  const [searchParams] = useSearchParams();
  const tripSlug = searchParams.get('trip');
  const source = searchParams.get('source');
  const selectedTrip = useMemo(
    () => (source === 'one-day-trips' ? findOneDayTripBySlug(tripSlug) : undefined),
    [source, tripSlug],
  );
  const prefilledSubject = selectedTrip ? buildOneDayTripInquirySubject(selectedTrip) : '';
  const prefilledMessage = selectedTrip ? buildOneDayTripInquiryMessage(selectedTrip) : '';
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      subject: prefilledSubject,
      message: prefilledMessage,
    },
  });

  useEffect(() => {
    reset({
      name: '',
      email: '',
      phone: '',
      subject: prefilledSubject,
      message: prefilledMessage,
    });
  }, [prefilledMessage, prefilledSubject, reset]);

  const onSubmit = async (data: FormData) => {
    try {
      await api.post('/contact', data);
      setSubmitted(true);
      reset({
        name: '',
        email: '',
        phone: '',
        subject: prefilledSubject,
        message: prefilledMessage,
      });
      toast.success('Message sent. We will reach out shortly.');
    } catch {
      toast.error('Unable to send your message right now.');
    }
  };

  return (
    <>
      <section className="relative overflow-hidden bg-[#08131f] pt-24 text-white">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url("${contactHeroImage}")` }}
        />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(6,16,25,0.78)_0%,rgba(7,22,33,0.64)_38%,rgba(8,24,36,0.34)_66%,rgba(7,20,28,0.18)_100%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(12,42,33,0.18)_0%,rgba(7,18,28,0.1)_28%,rgba(7,16,25,0.42)_100%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_85%_14%,rgba(255,244,189,0.16),transparent_22%),radial-gradient(circle_at_18%_20%,rgba(112,205,126,0.1),transparent_28%)]" />

        <div className="relative mx-auto max-w-7xl px-4 pb-10 pt-10 sm:px-6 sm:pb-12 sm:pt-12 lg:px-8 lg:pb-14 lg:pt-14">
          <div className="max-w-4xl">
            <span className="playful-text text-2xl !text-primary-300 sm:text-3xl">
              Contact Alpha Trekkers
            </span>

            <div className="mt-6 max-w-5xl">
              <p className="font-heading font-semibold text-[2.3rem] leading-[0.9] !text-white drop-shadow-[0_10px_35px_rgba(0,0,0,0.28)] sm:text-[4rem] lg:text-[4.8rem]">
                Plan your next
              </p>
              <h1 className="mt-2 font-semibold text-[2.8rem] leading-[0.9] !text-white drop-shadow-[0_10px_35px_rgba(0,0,0,0.28)] sm:text-[4.8rem] lg:text-[5.8rem]">
                wild Sahyadri story.
              </h1>
            </div>

            <p className="mt-5 max-w-2xl text-base leading-8 text-sand-100/86 sm:text-lg">
              Whether you need a custom monsoon escape, a private fort circuit, or a fast answer before booking,
              we will help you shape the route, difficulty, and group flow with confidence.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <a
                href="tel:+919876543210"
                className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-forest-500 to-[#6ac86a] px-7 py-3.5 text-sm font-semibold uppercase tracking-[0.14em] text-white shadow-[0_22px_55px_rgba(58,138,74,0.38)] transition hover:-translate-y-0.5 hover:shadow-[0_26px_60px_rgba(58,138,74,0.48)]"
              >
                Call for trip planning
              </a>
              <a
                href="mailto:hello@alphatrekkers.com"
                className="inline-flex items-center justify-center rounded-full border border-white/18 bg-white/8 px-7 py-3.5 text-sm font-semibold uppercase tracking-[0.14em] text-white backdrop-blur-md transition hover:bg-white/14"
              >
                Email the route brief
              </a>
            </div>
          </div>
        </div>

      </section>

      <section className="relative overflow-hidden bg-white py-16 sm:py-20">
        <div className="absolute left-0 top-12 h-56 w-56 rounded-full bg-[#e1f0db] blur-3xl" />
        <div className="absolute bottom-10 right-0 h-64 w-64 rounded-full bg-[#f4ecd3] blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-[0.92fr_1.08fr]">
            <div className="space-y-5">
              {info.map(({ Icon, label, value, detail, href }) => {
                const Wrapper = href ? 'a' : 'div';

                return (
                  <Wrapper
                    key={label}
                    {...(href ? { href } : {})}
                    className="group block overflow-hidden rounded-[1.6rem] border border-[#dce7df] bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(246,249,246,0.94))] p-5 shadow-[0_16px_38px_rgba(15,23,42,0.05)] transition hover:-translate-y-0.5 hover:shadow-[0_20px_45px_rgba(34,94,58,0.08)]"
                  >
                    <div className="flex items-start gap-3.5">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[1.1rem] bg-[linear-gradient(180deg,#eff9ef,#e4f1e4)] text-forest-600 shadow-[inset_0_1px_0_rgba(255,255,255,0.9)]">
                        <Icon className="h-5.5 w-5.5" weight="duotone" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-forest-600/85">{label}</p>
                        <p className="mt-1.5 break-words text-[1.3rem] font-semibold leading-snug text-[#163254] sm:text-[1.5rem]">
                          {value}
                        </p>
                        <p className="mt-2 max-w-xl text-sm leading-6 text-ink-600">{detail}</p>
                      </div>
                    </div>
                  </Wrapper>
                );
              })}

            </div>

            <div className="relative">
              <div className="absolute -left-8 top-10 hidden h-36 w-36 rounded-full bg-forest-500/10 blur-3xl lg:block" />
              <div className="relative overflow-hidden rounded-[2.2rem] border border-white/80 bg-[linear-gradient(180deg,rgba(255,255,255,0.96),rgba(249,251,248,0.98))] p-8 shadow-[0_32px_90px_rgba(15,23,42,0.08)] sm:p-10">
                <div className="absolute inset-x-0 top-0 h-1 bg-[linear-gradient(90deg,#5cb85c,#d9b75f,#5cb85c)]" />
                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-forest-600">Send a message</p>
                <h2 className="mt-4 max-w-md font-heading text-5xl leading-[0.95] text-[#163254]">
                  Start the next adventure conversation.
                </h2>
                <p className="mt-4 max-w-2xl text-sm leading-7 text-ink-700">
                  Share your plan, even if it is rough. We can help with routes, timings, group comfort, and the best
                  monsoon-friendly options.
                </p>

                {selectedTrip ? (
                  <div className="mt-6 inline-flex flex-wrap items-center gap-3 rounded-[1.1rem] border border-forest-500/16 bg-forest-500/8 px-4 py-3 text-sm text-forest-700">
                    <span className="rounded-full bg-white px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-forest-600 shadow-sm">
                      Booking context
                    </span>
                    <span>
                      One-day trip selected: <strong>{selectedTrip.title}</strong>
                    </span>
                  </div>
                ) : null}

                <form onSubmit={handleSubmit(onSubmit)} className="mt-9 space-y-5">
                  <div className="grid gap-5 sm:grid-cols-2">
                    <div>
                      <label className="mb-2 block text-sm font-medium text-ink-700">Name</label>
                      <input
                        {...register('name')}
                        className={inputClassName}
                        placeholder="Your full name"
                      />
                      {errors.name ? <p className="mt-2 text-xs text-coral-600">{errors.name.message}</p> : null}
                    </div>
                    <div>
                      <label className="mb-2 block text-sm font-medium text-ink-700">Email</label>
                      <input
                        {...register('email')}
                        className={inputClassName}
                        autoComplete="email"
                        placeholder="you@example.com"
                      />
                      {errors.email ? <p className="mt-2 text-xs text-coral-600">{errors.email.message}</p> : null}
                    </div>
                  </div>

                  <div className="grid gap-5 sm:grid-cols-2">
                    <div>
                      <label className="mb-2 block text-sm font-medium text-ink-700">Phone</label>
                      <input
                        {...register('phone')}
                        className={inputClassName}
                        autoComplete="tel"
                        placeholder="+91"
                      />
                    </div>
                    <div>
                      <label className="mb-2 block text-sm font-medium text-ink-700">Subject</label>
                      <input
                        {...register('subject')}
                        className={inputClassName}
                        placeholder="Private trek / booking question"
                      />
                      {errors.subject ? <p className="mt-2 text-xs text-coral-600">{errors.subject.message}</p> : null}
                    </div>
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-ink-700">Message</label>
                    <textarea
                      {...register('message')}
                      rows={6}
                      className={`${inputClassName} min-h-[180px] resize-none`}
                      placeholder="Tell us your group size, preferred date, route style, and anything we should know."
                    />
                    {errors.message ? <p className="mt-2 text-xs text-coral-600">{errors.message.message}</p> : null}
                  </div>

                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <Button
                      type="submit"
                      size="lg"
                      isLoading={isSubmitting}
                      rightIcon={<PaperPlaneTilt className="h-5 w-5" />}
                      className="shadow-[0_24px_55px_rgba(62,148,78,0.26)]"
                    >
                      Send inquiry
                    </Button>
                  </div>

                  {submitted ? (
                    <p className="rounded-[1.2rem] border border-forest-500/18 bg-forest-500/10 px-4 py-3 text-sm text-forest-600">
                      Your message was submitted successfully.
                    </p>
                  ) : null}
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
