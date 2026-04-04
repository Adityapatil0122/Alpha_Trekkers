import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import {
  CalendarBlank,
  Users,
  Minus,
  Plus,
  CaretRight,
  CurrencyInr,
} from '@phosphor-icons/react';
import toast from 'react-hot-toast';
import type {
  ApiResponse,
  CreateBookingRequest,
  Trip,
  TripSchedule,
} from '@alpha-trekkers/shared';
import api from '@/lib/axios';
import Button from '@/components/ui/Button';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

const participantSchema = z.object({
  fullName: z.string().min(2, 'Full name is required'),
  age: z.coerce.number().min(1, 'Age required').max(100),
  phone: z.string().min(10, 'Valid phone required'),
  emergencyName: z.string().optional(),
  emergencyPhone: z.string().optional(),
  medicalNotes: z.string().optional(),
});

const schema = z.object({
  specialRequests: z.string().optional(),
  promoCode: z.string().optional(),
  participants: z.array(participantSchema).min(1, 'At least one participant required'),
});

type FormData = z.infer<typeof schema>;

export default function BookingPage() {
  const { tripId, scheduleId } = useParams<{ tripId: string; scheduleId: string }>();
  const navigate = useNavigate();
  const [trip, setTrip] = useState<Trip | null>(null);
  const [schedule, setSchedule] = useState<TripSchedule | null>(null);
  const [loading, setLoading] = useState(true);

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
    },
  });

  const { fields, append, remove } = useFieldArray({ control, name: 'participants' });
  const participants = watch('participants');

  useEffect(() => {
    if (!tripId) return;
    api
      .get<ApiResponse<{ trip: Trip }>>(`/trips/id/${tripId}`)
      .then((res) => {
        const loadedTrip = res.data.data.trip;
        setTrip(loadedTrip);
        const s = loadedTrip.schedules?.find((sc) => sc.id === scheduleId);
        setSchedule(s || null);
      })
      .catch(() => navigate('/trips'))
      .finally(() => setLoading(false));
  }, [tripId, scheduleId, navigate]);

  const onSubmit = async (data: FormData) => {
    if (!tripId || !scheduleId) return;

    const payload: CreateBookingRequest = {
      tripId,
      scheduleId,
      numberOfPeople: data.participants.length,
      specialRequests: data.specialRequests,
      promoCode: data.promoCode,
      participants: data.participants.map((p) => ({
        fullName: p.fullName,
        age: p.age,
        phone: p.phone,
        emergencyName: p.emergencyName,
        emergencyPhone: p.emergencyPhone,
        medicalNotes: p.medicalNotes,
      })),
    };

    try {
      await api.post('/bookings', payload);
      toast.success('Booking created successfully!');
      navigate('/my-bookings');
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        'Booking failed. Please try again.';
      toast.error(message);
    }
  };

  if (loading) return <LoadingSpinner fullPage text="Loading booking details..." />;
  if (!trip) return null;

  const pricePerPerson = schedule?.priceOverride ?? trip.discountPrice ?? trip.basePrice;
  const totalPrice = pricePerPerson * (participants?.length || 1);

  return (
    <>
      {/* Breadcrumb */}
      <div className="bg-forest-900 pt-20">
        <div className="mx-auto flex max-w-7xl items-center gap-2 px-4 py-4 text-sm text-forest-400 sm:px-6 lg:px-8">
          <Link to="/" className="hover:text-forest-300">Home</Link>
          <CaretRight className="h-3 w-3" />
          <Link to={`/trips/${trip.slug}`} className="hover:text-forest-300">{trip.title}</Link>
          <CaretRight className="h-3 w-3" />
          <span className="text-forest-200">Booking</span>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="font-heading text-3xl font-bold text-forest-900">Complete Your Booking</h1>
          <p className="mt-2 text-forest-500">Fill in participant details to reserve your spots.</p>
        </motion.div>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="flex flex-col gap-8 lg:flex-row">
            {/* Main form */}
            <div className="flex-1 space-y-6">
              {/* Participants */}
              <div className="rounded-2xl border border-forest-100 bg-white p-6 shadow-sm">
                <div className="mb-5 flex items-center justify-between">
                  <h2 className="font-heading text-lg font-semibold text-forest-900">
                    <Users className="mr-2 inline h-5 w-5 text-forest-500" />
                    Participants ({fields.length})
                  </h2>
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    leftIcon={<Plus className="h-4 w-4" />}
                    onClick={() =>
                      append({ fullName: '', age: 0, phone: '', emergencyName: '', emergencyPhone: '', medicalNotes: '' })
                    }
                  >
                    Add
                  </Button>
                </div>

                <div className="space-y-6">
                  {fields.map((field, index) => (
                    <div
                      key={field.id}
                      className="rounded-xl border border-forest-100 bg-forest-50/50 p-5"
                    >
                      <div className="mb-4 flex items-center justify-between">
                        <span className="text-sm font-semibold text-forest-700">
                          Participant {index + 1}
                        </span>
                        {fields.length > 1 && (
                          <button
                            type="button"
                            onClick={() => remove(index)}
                            className="flex items-center gap-1 text-xs text-red-500 hover:text-red-600"
                          >
                            <Minus className="h-3 w-3" /> Remove
                          </button>
                        )}
                      </div>
                      <div className="grid gap-4 sm:grid-cols-3">
                        <div>
                          <label className="mb-1 block text-xs font-medium text-forest-600">
                            Full Name *
                          </label>
                          <input
                            {...register(`participants.${index}.fullName`)}
                            className="w-full rounded-lg border border-forest-200 bg-white px-3 py-2 text-sm focus:border-forest-500 focus:outline-none"
                            placeholder="Full name"
                          />
                          {errors.participants?.[index]?.fullName && (
                            <p className="mt-1 text-xs text-red-500">
                              {errors.participants[index]?.fullName?.message}
                            </p>
                          )}
                        </div>
                        <div>
                          <label className="mb-1 block text-xs font-medium text-forest-600">
                            Age *
                          </label>
                          <input
                            type="number"
                            {...register(`participants.${index}.age`)}
                            className="w-full rounded-lg border border-forest-200 bg-white px-3 py-2 text-sm focus:border-forest-500 focus:outline-none"
                            placeholder="Age"
                          />
                        </div>
                        <div>
                          <label className="mb-1 block text-xs font-medium text-forest-600">
                            Phone *
                          </label>
                          <input
                            {...register(`participants.${index}.phone`)}
                            className="w-full rounded-lg border border-forest-200 bg-white px-3 py-2 text-sm focus:border-forest-500 focus:outline-none"
                            placeholder="+91 98765 43210"
                          />
                        </div>
                      </div>
                      <div className="mt-3 grid gap-4 sm:grid-cols-3">
                        <div>
                          <label className="mb-1 block text-xs font-medium text-forest-600">
                            Emergency Contact
                          </label>
                          <input
                            {...register(`participants.${index}.emergencyName`)}
                            className="w-full rounded-lg border border-forest-200 bg-white px-3 py-2 text-sm focus:border-forest-500 focus:outline-none"
                            placeholder="Name"
                          />
                        </div>
                        <div>
                          <label className="mb-1 block text-xs font-medium text-forest-600">
                            Emergency Phone
                          </label>
                          <input
                            {...register(`participants.${index}.emergencyPhone`)}
                            className="w-full rounded-lg border border-forest-200 bg-white px-3 py-2 text-sm focus:border-forest-500 focus:outline-none"
                            placeholder="Phone"
                          />
                        </div>
                        <div>
                          <label className="mb-1 block text-xs font-medium text-forest-600">
                            Medical Notes
                          </label>
                          <input
                            {...register(`participants.${index}.medicalNotes`)}
                            className="w-full rounded-lg border border-forest-200 bg-white px-3 py-2 text-sm focus:border-forest-500 focus:outline-none"
                            placeholder="Allergies, conditions, etc."
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Special Requests */}
              <div className="rounded-2xl border border-forest-100 bg-white p-6 shadow-sm">
                <h2 className="mb-4 font-heading text-lg font-semibold text-forest-900">
                  Special Requests
                </h2>
                <textarea
                  {...register('specialRequests')}
                  rows={3}
                  placeholder="Any dietary requirements, accessibility needs, or other requests..."
                  className="w-full resize-none rounded-xl border border-forest-200 bg-white px-4 py-3 text-sm placeholder:text-forest-400 focus:border-forest-500 focus:outline-none"
                />
              </div>

              {/* Promo Code */}
              <div className="rounded-2xl border border-forest-100 bg-white p-6 shadow-sm">
                <h2 className="mb-4 font-heading text-lg font-semibold text-forest-900">
                  Promo Code
                </h2>
                <input
                  {...register('promoCode')}
                  placeholder="Enter promo code"
                  className="w-full rounded-xl border border-forest-200 bg-white px-4 py-3 text-sm placeholder:text-forest-400 focus:border-forest-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Sidebar Summary */}
            <aside className="lg:w-80 xl:w-96">
              <div className="sticky top-24 space-y-6">
                <div className="overflow-hidden rounded-2xl border border-forest-100 bg-white shadow-sm">
                  {/* Trip image */}
                  <div className="relative h-44">
                    <img
                      src={trip.images[0]?.url || 'https://images.unsplash.com/photo-1585409677983-0f6c41128c45?w=400'}
                      alt={trip.title}
                      className="h-full w-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                    <div className="absolute bottom-3 left-4 right-4">
                      <h3 className="font-heading text-lg font-bold text-white">{trip.title}</h3>
                    </div>
                  </div>

                  <div className="p-5">
                    {schedule && (
                      <div className="mb-4 flex items-center gap-2 text-sm text-forest-600">
                        <CalendarBlank className="h-4 w-4 text-forest-400" />
                        {new Date(schedule.date).toLocaleDateString('en-IN', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </div>
                    )}

                    <div className="space-y-3 border-t border-forest-100 pt-4">
                      <div className="flex justify-between text-sm">
                        <span className="text-forest-500">Price per person</span>
                        <span className="font-medium text-forest-800">
                          &#8377;{pricePerPerson.toLocaleString('en-IN')}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-forest-500">Participants</span>
                        <span className="font-medium text-forest-800">
                          x{participants?.length || 1}
                        </span>
                      </div>
                      <div className="flex justify-between border-t border-forest-100 pt-3">
                        <span className="font-heading text-base font-semibold text-forest-900">
                          Total
                        </span>
                        <span className="flex items-center font-heading text-xl font-bold text-forest-800">
                          <CurrencyInr className="h-5 w-5" />
                          {totalPrice.toLocaleString('en-IN')}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <Button type="submit" size="lg" fullWidth isLoading={isSubmitting}>
                  Proceed to Payment
                </Button>

                <p className="text-center text-xs text-forest-400">
                  By proceeding, you agree to our terms and cancellation policy.
                </p>
              </div>
            </aside>
          </div>
        </form>
      </div>
    </>
  );
}
