import { useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion, useInView } from 'framer-motion';
import {
  Phone,
  EnvelopeSimple,
  MapPin,
  Clock,
  PaperPlaneTilt,
  CaretDown,
} from '@phosphor-icons/react';
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

const contactInfo = [
  { Icon: Phone, label: 'Phone', value: '+91 98765 43210', href: 'tel:+919876543210' },
  { Icon: EnvelopeSimple, label: 'Email', value: 'hello@alphatrekkers.com', href: 'mailto:hello@alphatrekkers.com' },
  { Icon: MapPin, label: 'Address', value: 'Pune, Maharashtra, India', href: '#' },
  { Icon: Clock, label: 'Hours', value: 'Mon-Sat: 9AM - 7PM', href: '#' },
];

const faqs = [
  {
    q: 'What should I carry for a trek?',
    a: 'Each trek page has a specific packing list. Generally, carry comfortable shoes, water, snacks, a rain poncho, torch, and personal medication. We provide detailed lists upon booking.',
  },
  {
    q: 'Is prior trekking experience required?',
    a: 'Not for Easy and Moderate treks! Our guides accommodate all fitness levels. Difficult and Extreme treks do require prior experience and good physical fitness.',
  },
  {
    q: 'What is your cancellation policy?',
    a: 'Full refund if cancelled 7+ days before the trek. 50% refund for 3-6 days before. No refund within 48 hours. We offer one free reschedule per booking.',
  },
  {
    q: 'Do you provide transportation?',
    a: 'Transportation is included in most of our treks from the designated meeting point. Check individual trip details for specific transportation arrangements.',
  },
  {
    q: 'What safety measures are in place?',
    a: 'Every trek has certified guides, first-aid kits, emergency contacts, walkie-talkies, and we monitor weather conditions 24 hours before each trek. Groups are kept small for better safety.',
  },
];

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
      transition={{ duration: 0.6, delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-forest-100">
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between py-5 text-left"
      >
        <span className="pr-4 font-heading text-base font-semibold text-forest-800">{q}</span>
        <CaretDown
          className={`h-5 w-5 shrink-0 text-forest-400 transition-transform duration-300 ${
            open ? 'rotate-180' : ''
          }`}
        />
      </button>
      <motion.div
        initial={false}
        animate={{ height: open ? 'auto' : 0, opacity: open ? 1 : 0 }}
        transition={{ duration: 0.3 }}
        className="overflow-hidden"
      >
        <p className="pb-5 text-sm leading-relaxed text-forest-600/70">{a}</p>
      </motion.div>
    </div>
  );
}

export default function Contact() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: FormData) => {
    try {
      await api.post('/contact', data);
      toast.success('Message sent! We will get back to you soon.');
      reset();
    } catch {
      toast.error('Failed to send message. Please try again.');
    }
  };

  const inputClass =
    'w-full rounded-xl border border-forest-200 bg-white px-4 py-3 text-sm text-forest-800 placeholder:text-forest-400 focus:border-forest-500 focus:outline-none transition-colors';

  return (
    <>
      {/* Hero */}
      <section className="relative flex h-64 items-end overflow-hidden bg-forest-900 sm:h-72">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1519681393784-d120267933ba?w=1920&q=80')] bg-cover bg-center opacity-20" />
        <div className="absolute inset-0 bg-gradient-to-t from-forest-900 to-transparent" />
        <div className="relative z-10 mx-auto w-full max-w-7xl px-4 pb-8 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="font-heading text-3xl font-bold text-white sm:text-4xl">Contact Us</h1>
            <p className="mt-2 text-forest-300/70">
              Have a question or ready to book? We&apos;d love to hear from you.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-5">
            {/* Contact Form */}
            <FadeIn className="lg:col-span-3">
              <div className="rounded-2xl border border-forest-100 bg-white p-6 shadow-sm sm:p-8">
                <h2 className="mb-6 font-heading text-2xl font-bold text-forest-900">
                  Send a Message
                </h2>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                  <div className="grid gap-5 sm:grid-cols-2">
                    <div>
                      <label className="mb-1.5 block text-sm font-medium text-forest-700">Name</label>
                      <input {...register('name')} placeholder="Your name" className={inputClass} />
                      {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name.message}</p>}
                    </div>
                    <div>
                      <label className="mb-1.5 block text-sm font-medium text-forest-700">Email</label>
                      <input {...register('email')} placeholder="you@example.com" className={inputClass} />
                      {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>}
                    </div>
                  </div>

                  <div className="grid gap-5 sm:grid-cols-2">
                    <div>
                      <label className="mb-1.5 block text-sm font-medium text-forest-700">
                        Phone <span className="text-forest-400">(optional)</span>
                      </label>
                      <input {...register('phone')} placeholder="+91 98765 43210" className={inputClass} />
                    </div>
                    <div>
                      <label className="mb-1.5 block text-sm font-medium text-forest-700">Subject</label>
                      <input {...register('subject')} placeholder="How can we help?" className={inputClass} />
                      {errors.subject && <p className="mt-1 text-xs text-red-500">{errors.subject.message}</p>}
                    </div>
                  </div>

                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-forest-700">Message</label>
                    <textarea
                      {...register('message')}
                      rows={5}
                      placeholder="Tell us more about your inquiry..."
                      className={`${inputClass} resize-none`}
                    />
                    {errors.message && <p className="mt-1 text-xs text-red-500">{errors.message.message}</p>}
                  </div>

                  <Button
                    type="submit"
                    size="lg"
                    isLoading={isSubmitting}
                    rightIcon={<PaperPlaneTilt className="h-5 w-5" />}
                  >
                    Send Message
                  </Button>
                </form>
              </div>
            </FadeIn>

            {/* Contact Info */}
            <FadeIn delay={0.15} className="lg:col-span-2">
              <div className="space-y-4">
                {contactInfo.map(({ Icon, label, value, href }) => (
                  <a
                    key={label}
                    href={href}
                    className="flex items-start gap-4 rounded-xl border border-forest-100 bg-white p-5 shadow-sm transition-shadow hover:shadow-md"
                  >
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-forest-50">
                      <Icon className="h-5 w-5 text-forest-600" weight="duotone" />
                    </div>
                    <div>
                      <p className="text-xs font-medium text-forest-400">{label}</p>
                      <p className="text-sm font-medium text-forest-800">{value}</p>
                    </div>
                  </a>
                ))}
              </div>

              {/* Map Placeholder */}
              <div className="mt-6 flex h-52 items-center justify-center rounded-2xl border border-forest-100 bg-forest-50">
                <div className="text-center">
                  <MapPin className="mx-auto mb-2 h-8 w-8 text-forest-300" />
                  <p className="text-sm text-forest-400">Map integration coming soon</p>
                </div>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="border-t border-forest-100 bg-forest-50/50 py-16 lg:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <FadeIn className="mb-10 text-center">
            <span className="mb-3 inline-block rounded-full bg-forest-500/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-forest-600">
              FAQ
            </span>
            <h2 className="font-heading text-3xl font-bold text-forest-900">
              Frequently Asked Questions
            </h2>
          </FadeIn>

          <FadeIn>
            <div className="rounded-2xl border border-forest-100 bg-white px-6 shadow-sm">
              {faqs.map((faq, i) => (
                <FAQItem key={i} q={faq.q} a={faq.a} />
              ))}
            </div>
          </FadeIn>
        </div>
      </section>
    </>
  );
}
