import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Clock,
  EnvelopeSimple,
  MapPinLine,
  PaperPlaneTilt,
  PhoneCall,
} from '@phosphor-icons/react';
import { MAHARASHTRA_MONSOON_IMAGES } from '@alpha-trekkers/shared';
import toast from 'react-hot-toast';
import api from '@/lib/axios';
import Button from '@/components/ui/Button';

const schema = z.object({
  name: z.string().min(2, 'Name is required'),
  email: z.string().email('Valid email required'),
  phone: z.string().optional(),
  subject: z.string().min(3, 'Subject is required'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
});

type FormData = z.infer<typeof schema>;

const info = [
  { Icon: PhoneCall, label: 'Call us', value: '+91 98765 43210' },
  { Icon: EnvelopeSimple, label: 'Email', value: 'hello@alphatrekkers.com' },
  { Icon: MapPinLine, label: 'Base city', value: 'Pune, Maharashtra' },
  { Icon: Clock, label: 'Support window', value: 'Mon to Sat, 9 AM to 7 PM' },
];

export default function Contact() {
  const [submitted, setSubmitted] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: FormData) => {
    try {
      await api.post('/contact', data);
      setSubmitted(true);
      reset();
      toast.success('Message sent. We will reach out shortly.');
    } catch {
      toast.error('Unable to send your message right now.');
    }
  };

  return (
    <>
      <section className="travel-dark relative overflow-hidden pt-28">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-22"
          style={{ backgroundImage: `url(${MAHARASHTRA_MONSOON_IMAGES.heroes.contact})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-ink-950/88 via-ink-900/74 to-transparent" />
        <div className="relative mx-auto max-w-7xl px-4 pb-[4.5rem] pt-20 sm:px-6 lg:px-8">
          <span className="section-label !bg-white/10 !text-sand-100 before:!bg-gold-400">
            Contact & planning
          </span>
          <h1 className="mt-6 max-w-3xl font-heading text-5xl leading-[0.95] text-white sm:text-6xl">
            Want a private departure, custom group plan, or a quick answer?
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-sand-100/76">
            This page now follows the same premium-tour visual system as the reference: softer editorial
            spacing, stronger cards, and a clearer conversion-first contact flow.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="space-y-4">
            {info.map(({ Icon, label, value }) => (
              <div key={label} className="travel-panel rounded-[1.9rem] p-6">
                <div className="flex items-start gap-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-forest-500/10">
                    <Icon className="h-6 w-6 text-forest-500" weight="duotone" />
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-[0.18em] text-forest-500">{label}</p>
                    <p className="mt-2 font-heading text-3xl text-ink-900">{value}</p>
                  </div>
                </div>
              </div>
            ))}

            <div className="travel-dark rounded-[2rem] p-7 text-white">
              <p className="text-xs uppercase tracking-[0.18em] text-gold-400">Fast path</p>
              <h2 className="mt-4 font-heading text-4xl">Need a custom team outing?</h2>
              <p className="mt-3 text-sm leading-7 text-sand-100/74">
                Send the group size, preferred month, and fort preference. We can shape a private departure plan.
              </p>
            </div>
          </div>

          <div className="travel-panel rounded-[2.3rem] p-8 sm:p-10">
            <p className="text-xs uppercase tracking-[0.18em] text-forest-500">Send a message</p>
            <p className="playful-text text-xl text-forest-500">~ drop us a line ~</p>
            <h2 className="mt-4 font-heading text-5xl text-ink-900">Start the conversation</h2>
            <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-5">
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium text-ink-700">Name</label>
                  <input {...register('name')} className="travel-input" />
                  {errors.name ? <p className="mt-2 text-xs text-coral-600">{errors.name.message}</p> : null}
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-ink-700">Email</label>
                  <input {...register('email')} className="travel-input" autoComplete="email" />
                  {errors.email ? <p className="mt-2 text-xs text-coral-600">{errors.email.message}</p> : null}
                </div>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium text-ink-700">Phone</label>
                  <input {...register('phone')} className="travel-input" autoComplete="tel" />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-ink-700">Subject</label>
                  <input {...register('subject')} className="travel-input" />
                  {errors.subject ? <p className="mt-2 text-xs text-coral-600">{errors.subject.message}</p> : null}
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-ink-700">Message</label>
                <textarea
                  {...register('message')}
                  rows={6}
                  className="travel-input resize-none"
                />
                {errors.message ? <p className="mt-2 text-xs text-coral-600">{errors.message.message}</p> : null}
              </div>

              <Button
                type="submit"
                size="lg"
                isLoading={isSubmitting}
                rightIcon={<PaperPlaneTilt className="h-5 w-5" />}
              >
                Send inquiry
              </Button>

              {submitted ? (
                <p className="rounded-[1.2rem] bg-forest-500/10 px-4 py-3 text-sm text-forest-500">
                  Your message was submitted successfully.
                </p>
              ) : null}
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
