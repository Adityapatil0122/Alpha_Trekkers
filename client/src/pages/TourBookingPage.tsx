import { useEffect, useState } from 'react';
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom';
import { useFieldArray, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  CalendarBlank,
  CaretRight,
  CurrencyInr,
  Info,
  Minus,
  Plus,
  UsersThree,
} from '@phosphor-icons/react';
import type { ApiResponse, CreateTourBookingRequest, Tour } from '@alpha-trekkers/shared';
import toast from 'react-hot-toast';
import api from '@/lib/axios';
import Button from '@/components/ui/Button';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

const indianPhonePattern = /^[6-9]\d{9}$/;
const optionalTextField = z
  .string()
  .transform((value) => value.trim())
  .optional();

const participantSchema = z.object({
  fullName: z.string().min(2, 'Full name is required'),
  age: z.coerce.number().min(5, 'Minimum age is 5').max(100),
  phone: z.string().regex(indianPhonePattern, 'Valid 10-digit Indian phone required'),
  emergencyName: optionalTextField.refine((value) => !value || value.length >= 2, 'Emergency contact must be at least 2 characters'),
  emergencyPhone: optionalTextField.refine((value) => !value || indianPhonePattern.test(value), 'Valid emergency phone required'),
  medicalNotes: optionalTextField,
});

const schema = z.object({
  specialRequests: optionalTextField,
  participants: z.array(participantSchema).min(1, 'At least one participant required'),
});

type FormData = z.infer<typeof schema>;

export default function TourBookingPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [tour, setTour] = useState<Tour | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      participants: [{ fullName: '', age: 0, phone: '', emergencyName: '', emergencyPhone: '', medicalNotes: '' }],
      specialRequests: '',
    },
  });

  const { fields, append, remove } = useFieldArray({ control, name: 'participants' });
  const participants = watch('participants');

  useEffect(() => {
    if (!slug) {
      setNotFound(true);
      setLoading(false);
      return;
    }

    setLoading(true);
    api
      .get<ApiResponse<{ tour: Tour }>>(`/tours/${slug}`)
      .then((response) => {
        setTour(response.data.data.tour);
        setNotFound(false);
      })
      .catch(() => {
        setTour(null);
        setNotFound(true);
      })
      .finally(() => setLoading(false));
  }, [slug]);

  const onSubmit = async (data: FormData) => {
    if (!tour) return;

    const normalizedParticipants = data.participants.map((participant) => ({
      fullName: participant.fullName.trim(),
      age: participant.age,
      phone: participant.phone.trim(),
      emergencyName: participant.emergencyName || undefined,
      emergencyPhone: participant.emergencyPhone || undefined,
      medicalNotes: participant.medicalNotes || undefined,
    }));

    const payload: CreateTourBookingRequest = {
      tourId: tour.id,
      numberOfPeople: normalizedParticipants.length,
      specialRequests: data.specialRequests || undefined,
      participants: normalizedParticipants,
    };

    try {
      await api.post<ApiResponse<{ booking: unknown }>>('/tour-bookings', payload);
      toast.success('Tour booked successfully');
      navigate('/my-bookings');
    } catch (error: unknown) {
      const message =
        (error as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        'Unable to complete the booking right now.';
      toast.error(message);
    }
  };

  if (loading) return <LoadingSpinner fullPage text="Loading booking journey..." />;
  if (notFound || !tour) return <Navigate to="/trips" replace />;

  const totalPrice = tour.price * (participants?.length || 1);

  return (
    <>
      <section className="travel-dark relative overflow-hidden pt-28">
        <img
          src={tour.imageUrl}
          alt={tour.title}
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(15,23,42,0.78),rgba(15,23,42,0.48),rgba(15,23,42,0.18))]" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(15,23,42,0.22),rgba(15,23,42,0.12),rgba(15,23,42,0.34))]" />
        <div className="relative mx-auto max-w-7xl px-4 pb-20 pt-[6.5rem] sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center gap-2 text-sm text-sand-100/72">
            <Link to="/" className="hover:text-white">Home</Link>
            <CaretRight className="h-3 w-3" />
            <Link to="/trips" className="hover:text-white">Tours</Link>
            <CaretRight className="h-3 w-3" />
            <Link to={`/tours/${tour.slug}`} className="hover:text-white">{tour.title}</Link>
            <CaretRight className="h-3 w-3" />
            <span className="text-white">Booking</span>
          </div>
          <h1 className="mt-6 font-heading text-4xl !text-white sm:text-5xl lg:text-6xl">Reserve this tour</h1>
          <p className="mt-3 playful-text text-xl !text-primary-400">~ instant confirmation ~</p>
          <p className="mt-4 max-w-2xl text-lg leading-8 text-sand-100/78">
            Complete traveler details for {tour.title} and confirm the booking instantly without sending a manual admin request.
          </p>
        </div>
      </section>

      <form onSubmit={handleSubmit(onSubmit)} className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_360px]">
          <div className="space-y-6">
            <div className="travel-panel rounded-[2rem] p-6 sm:p-8">
              <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="section-script">Travelers</p>
                  <h2 className="font-heading text-3xl text-ink-900 sm:text-4xl">Participant details</h2>
                </div>
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  leftIcon={<Plus className="h-4 w-4" />}
                  onClick={() =>
                    append({ fullName: '', age: 0, phone: '', emergencyName: '', emergencyPhone: '', medicalNotes: '' })
                  }
                >
                  Add traveler
                </Button>
              </div>

              <div className="space-y-5">
                {fields.map((field, index) => (
                  <div key={field.id} className="rounded-[1.8rem] bg-sand-100 p-5">
                    <div className="mb-4 flex items-center justify-between">
                      <h3 className="font-heading text-2xl text-ink-900 sm:text-3xl">Traveler {index + 1}</h3>
                      {fields.length > 1 ? (
                        <button type="button" onClick={() => remove(index)} className="inline-flex items-center gap-2 text-sm font-medium text-coral-600">
                          <Minus className="h-4 w-4" />
                          Remove
                        </button>
                      ) : null}
                    </div>

                    <div className="grid gap-4 sm:grid-cols-3">
                      <div>
                        <label className="mb-2 block text-sm font-medium text-ink-700">Full name</label>
                        <input {...register(`participants.${index}.fullName`)} className="travel-input" />
                        {errors.participants?.[index]?.fullName ? <p className="mt-2 text-xs text-coral-600">{errors.participants[index]?.fullName?.message}</p> : null}
                      </div>
                      <div>
                        <label className="mb-2 block text-sm font-medium text-ink-700">Age</label>
                        <input type="number" {...register(`participants.${index}.age`)} className="travel-input" />
                        {errors.participants?.[index]?.age ? <p className="mt-2 text-xs text-coral-600">{errors.participants[index]?.age?.message}</p> : null}
                      </div>
                      <div>
                        <label className="mb-2 block text-sm font-medium text-ink-700">Phone</label>
                        <input {...register(`participants.${index}.phone`)} className="travel-input" />
                        {errors.participants?.[index]?.phone ? <p className="mt-2 text-xs text-coral-600">{errors.participants[index]?.phone?.message}</p> : null}
                      </div>
                    </div>

                    <div className="mt-4 grid gap-4 sm:grid-cols-3">
                      <div>
                        <label className="mb-2 block text-sm font-medium text-ink-700">Emergency contact</label>
                        <input {...register(`participants.${index}.emergencyName`)} className="travel-input" />
                        {errors.participants?.[index]?.emergencyName ? <p className="mt-2 text-xs text-coral-600">{errors.participants[index]?.emergencyName?.message}</p> : null}
                      </div>
                      <div>
                        <label className="mb-2 block text-sm font-medium text-ink-700">Emergency phone</label>
                        <input {...register(`participants.${index}.emergencyPhone`)} className="travel-input" />
                        {errors.participants?.[index]?.emergencyPhone ? <p className="mt-2 text-xs text-coral-600">{errors.participants[index]?.emergencyPhone?.message}</p> : null}
                      </div>
                      <div>
                        <label className="mb-2 block text-sm font-medium text-ink-700">Medical notes</label>
                        <input {...register(`participants.${index}.medicalNotes`)} className="travel-input" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="travel-panel rounded-[2rem] p-6 sm:p-8">
              <p className="section-script">Need anything else?</p>
              <h2 className="mt-2 font-heading text-3xl text-ink-900 sm:text-4xl">Special requests</h2>
              <textarea
                {...register('specialRequests')}
                rows={4}
                className="travel-input mt-5 resize-none"
              />
            </div>

            <div className="travel-panel rounded-[2rem] p-6 sm:p-8">
              <div className="flex items-start gap-4 rounded-[1.6rem] border border-forest-500/20 bg-forest-500/5 p-5">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white text-forest-600 shadow-sm">
                  <Info className="h-5 w-5" weight="bold" />
                </span>
                <div>
                  <p className="text-base font-semibold text-ink-900">Instant confirmation</p>
                  <p className="mt-2 text-sm leading-6 text-ink-700">
                    This booking confirms immediately in your account, just like trek bookings. You can review it later from My Bookings.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <aside>
            <div className="sticky top-[7.5rem] space-y-6">
              <div className="travel-panel overflow-hidden rounded-[2rem]">
                <img
                  src={tour.imageUrl}
                  alt={tour.title}
                  className="h-52 w-full object-cover"
                />
                <div className="p-6">
                  <h3 className="font-heading text-3xl text-ink-900 sm:text-4xl">{tour.title}</h3>
                  <div className="mt-3 inline-flex items-center gap-2 rounded-full bg-sand-100 px-4 py-2 text-sm text-ink-700">
                    <CalendarBlank className="h-4 w-4 text-forest-500" />
                    {new Date(tour.departureDate).toLocaleDateString('en-IN', {
                      weekday: 'long',
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                    })}
                  </div>
                  <div className="mt-6 space-y-3 border-t border-ink-900/8 pt-5 text-sm text-ink-700">
                    <div className="flex items-center justify-between">
                      <span>Price per traveler</span>
                      <span className="font-medium text-ink-900">INR {tour.price.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="inline-flex items-center gap-2"><UsersThree className="h-4 w-4 text-forest-500" /> Travelers</span>
                      <span className="font-medium text-ink-900">{participants?.length || 1}</span>
                    </div>
                    <div className="flex items-center justify-between pt-2">
                      <span className="font-heading text-2xl text-ink-900">Total</span>
                      <span className="inline-flex items-center font-heading text-3xl text-ink-900">
                        <CurrencyInr className="h-5 w-5" />
                        {totalPrice.toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <Button type="submit" size="lg" fullWidth isLoading={isSubmitting}>
                Complete booking
              </Button>
            </div>
          </aside>
        </div>
      </form>
    </>
  );
}
