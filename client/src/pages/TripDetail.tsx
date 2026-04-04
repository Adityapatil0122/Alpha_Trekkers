import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Thumbs, Autoplay } from 'swiper/modules';
import type { Swiper as SwiperType } from 'swiper';
import {
  Star,
  Clock,
  MapPin,
  Mountains,
  Users,
  CalendarBlank,
  CheckCircle,
  XCircle,
  Backpack,
  Path,
  CaretRight,
  Lightning,
  ArrowRight,
} from '@phosphor-icons/react';
import type {
  ApiResponse,
  Difficulty,
  PaginatedResponse,
  Review,
  Trip,
} from '@alpha-trekkers/shared';
import { DIFFICULTIES } from '@alpha-trekkers/shared';
import api from '@/lib/axios';
import { useAuthStore } from '@/stores/authStore';
import Button from '@/components/ui/Button';
import TripCard from '@/components/ui/TripCard';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/thumbs';

type TabKey = 'overview' | 'itinerary' | 'inclusions' | 'reviews';

const difficultyBg: Record<Difficulty, string> = {
  EASY: 'bg-green-500',
  MODERATE: 'bg-amber-500',
  DIFFICULT: 'bg-orange-500',
  EXTREME: 'bg-red-500',
};

export default function TripDetail() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();

  const [trip, setTrip] = useState<Trip | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [relatedTrips, setRelatedTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<TabKey>('overview');
  const [thumbsSwiper, setThumbsSwiper] = useState<SwiperType | null>(null);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    api
      .get<ApiResponse<{ trip: Trip }>>(`/trips/${slug}`)
      .then(async (tripRes) => {
        const loadedTrip = tripRes.data.data.trip;
        setTrip(loadedTrip);

        const [reviewRes, relatedRes] = await Promise.all([
          api
            .get<PaginatedResponse<{ reviews: Review[] }>>(`/reviews/trip/${loadedTrip.id}`)
            .catch(() => null),
          api
            .get<PaginatedResponse<{ trips: Trip[] }>>('/trips', {
              params: {
                category: loadedTrip.category,
                limit: 4,
                sortBy: 'avgRating',
                sortOrder: 'desc',
              },
            })
            .catch(() => null),
        ]);

        setReviews(reviewRes?.data.data.reviews ?? []);
        setRelatedTrips(
          relatedRes?.data.data.trips
            .filter((candidate) => candidate.id !== loadedTrip.id)
            .slice(0, 3) ?? [],
        );
      })
      .catch(() => navigate('/trips'))
      .finally(() => setLoading(false));
  }, [slug, navigate]);

  if (loading) return <LoadingSpinner fullPage text="Loading trek details..." />;
  if (!trip) return null;

  const images = trip.images.length > 0 ? trip.images : [{ id: '0', url: 'https://images.unsplash.com/photo-1585409677983-0f6c41128c45?w=800', altText: trip.title, isPrimary: true, sortOrder: 0 }];
  const hasDiscount = trip.discountPrice != null && trip.discountPrice < trip.basePrice;
  const displayPrice = hasDiscount ? trip.discountPrice! : trip.basePrice;

  const tabs: { key: TabKey; label: string }[] = [
    { key: 'overview', label: 'Overview' },
    { key: 'itinerary', label: 'Itinerary' },
    { key: 'inclusions', label: 'Inclusions' },
    { key: 'reviews', label: `Reviews (${trip.totalReviews})` },
  ];

  return (
    <>
      {/* Breadcrumb */}
      <div className="bg-forest-900 pt-20">
        <div className="mx-auto flex max-w-7xl items-center gap-2 px-4 py-4 text-sm text-forest-400 sm:px-6 lg:px-8">
          <Link to="/" className="hover:text-forest-300">Home</Link>
          <CaretRight className="h-3 w-3" />
          <Link to="/trips" className="hover:text-forest-300">Treks</Link>
          <CaretRight className="h-3 w-3" />
          <span className="text-forest-200">{trip.title}</span>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-8 lg:flex-row">
          {/* ── Left Content ── */}
          <div className="flex-1">
            {/* Image Gallery */}
            <div className="mb-8 overflow-hidden rounded-2xl">
              <Swiper
                modules={[Navigation, Thumbs, Autoplay]}
                navigation
                thumbs={{ swiper: thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null }}
                autoplay={{ delay: 5000, disableOnInteraction: false }}
                className="h-72 sm:h-96 lg:h-[480px]"
              >
                {images
                  .sort((a, b) => a.sortOrder - b.sortOrder)
                  .map((img) => (
                    <SwiperSlide key={img.id}>
                      <img
                        src={img.url}
                        alt={img.altText || trip.title}
                        className="h-full w-full object-cover"
                      />
                    </SwiperSlide>
                  ))}
              </Swiper>
              {images.length > 1 && (
                <Swiper
                  modules={[Thumbs]}
                  onSwiper={setThumbsSwiper}
                  spaceBetween={8}
                  slidesPerView={5}
                  watchSlidesProgress
                  className="mt-3 h-20"
                >
                  {images
                    .sort((a, b) => a.sortOrder - b.sortOrder)
                    .map((img) => (
                      <SwiperSlide key={img.id} className="cursor-pointer overflow-hidden rounded-lg opacity-60 transition-opacity hover:opacity-100 [&.swiper-slide-thumb-active]:opacity-100">
                        <img
                          src={img.url}
                          alt={img.altText || trip.title}
                          className="h-full w-full object-cover"
                        />
                      </SwiperSlide>
                    ))}
                </Swiper>
              )}
            </div>

            {/* Title & Meta */}
            <div className="mb-6">
              <div className="mb-3 flex flex-wrap items-center gap-2">
                <span className={`rounded-full px-3 py-1 text-xs font-semibold text-white ${difficultyBg[trip.difficulty]}`}>
                  {DIFFICULTIES[trip.difficulty].label}
                </span>
                <span className="rounded-full bg-forest-100 px-3 py-1 text-xs font-medium text-forest-700">
                  {trip.category.replace('_', ' ')}
                </span>
                <span className="rounded-full bg-forest-50 px-3 py-1 text-xs text-forest-600">
                  {trip.region}
                </span>
              </div>
              <h1 className="font-heading text-3xl font-bold text-forest-900 sm:text-4xl">
                {trip.title}
              </h1>
              {trip.avgRating > 0 && (
                <div className="mt-3 flex items-center gap-2">
                  <div className="flex gap-0.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${i < Math.round(trip.avgRating) ? 'text-amber-400' : 'text-forest-200'}`}
                        weight="fill"
                      />
                    ))}
                  </div>
                  <span className="text-sm font-medium text-forest-700">
                    {trip.avgRating.toFixed(1)}
                  </span>
                  <span className="text-sm text-forest-400">
                    ({trip.totalReviews} reviews)
                  </span>
                </div>
              )}
            </div>

            {/* Quick Stats */}
            <div className="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
              {[
                { Icon: Clock, label: 'Duration', value: `${trip.durationHours} hours` },
                { Icon: Path, label: 'Distance', value: `${trip.distanceKm} km` },
                { Icon: Mountains, label: 'Elevation', value: `${trip.elevationM}m` },
                { Icon: Users, label: 'Group Size', value: `Max ${trip.maxGroupSize}` },
              ].map(({ Icon, label, value }) => (
                <div key={label} className="rounded-xl border border-forest-100 bg-white p-4 text-center shadow-sm">
                  <Icon className="mx-auto mb-2 h-6 w-6 text-forest-500" weight="duotone" />
                  <p className="text-xs text-forest-400">{label}</p>
                  <p className="font-heading text-sm font-semibold text-forest-800">{value}</p>
                </div>
              ))}
            </div>

            {/* Tabs */}
            <div className="mb-6 flex gap-1 overflow-x-auto rounded-xl border border-forest-100 bg-forest-50 p-1">
              {tabs.map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`relative whitespace-nowrap rounded-lg px-5 py-2.5 text-sm font-medium transition-all ${
                    activeTab === tab.key
                      ? 'bg-white text-forest-800 shadow-sm'
                      : 'text-forest-500 hover:text-forest-700'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              {activeTab === 'overview' && (
                <div className="space-y-8">
                  <div>
                    <h3 className="mb-3 font-heading text-xl font-semibold text-forest-900">About This Trek</h3>
                    <p className="whitespace-pre-line text-sm leading-relaxed text-forest-600/80">{trip.description}</p>
                  </div>
                  {trip.highlights.length > 0 && (
                    <div>
                      <h3 className="mb-3 font-heading text-xl font-semibold text-forest-900">Highlights</h3>
                      <div className="grid gap-2 sm:grid-cols-2">
                        {trip.highlights.map((h, i) => (
                          <div key={i} className="flex items-start gap-2 rounded-lg bg-forest-50 p-3">
                            <Lightning className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" weight="fill" />
                            <span className="text-sm text-forest-700">{h}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  {trip.thingsToCarry.length > 0 && (
                    <div>
                      <h3 className="mb-3 font-heading text-xl font-semibold text-forest-900">Things to Carry</h3>
                      <div className="grid gap-2 sm:grid-cols-2">
                        {trip.thingsToCarry.map((item, i) => (
                          <div key={i} className="flex items-center gap-2 text-sm text-forest-600">
                            <Backpack className="h-4 w-4 text-forest-400" />
                            {item}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'itinerary' && (
                <div className="space-y-1">
                  {trip.itinerary.map((step, i) => (
                    <div key={i} className="relative flex gap-4 pb-8 last:pb-0">
                      {/* Timeline line */}
                      {i < trip.itinerary.length - 1 && (
                        <div className="absolute left-[19px] top-10 h-[calc(100%-20px)] w-0.5 bg-forest-200" />
                      )}
                      {/* Timeline dot */}
                      <div className="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-forest-500 text-sm font-bold text-white shadow-lg shadow-forest-500/20">
                        {i + 1}
                      </div>
                      <div className="flex-1 rounded-xl border border-forest-100 bg-white p-5 shadow-sm">
                        <p className="mb-1 text-xs font-medium text-forest-400">{step.time}</p>
                        <h4 className="mb-2 font-heading text-base font-semibold text-forest-900">
                          {step.title}
                        </h4>
                        <p className="text-sm leading-relaxed text-forest-600/70">{step.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 'inclusions' && (
                <div className="grid gap-8 sm:grid-cols-2">
                  <div>
                    <h3 className="mb-4 font-heading text-lg font-semibold text-forest-900">Inclusions</h3>
                    <div className="space-y-2">
                      {trip.inclusions.map((item, i) => (
                        <div key={i} className="flex items-start gap-2 text-sm text-forest-700">
                          <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-green-500" weight="fill" />
                          {item}
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h3 className="mb-4 font-heading text-lg font-semibold text-forest-900">Exclusions</h3>
                    <div className="space-y-2">
                      {trip.exclusions.map((item, i) => (
                        <div key={i} className="flex items-start gap-2 text-sm text-forest-600">
                          <XCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-400" weight="fill" />
                          {item}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'reviews' && (
                <div className="space-y-4">
                  {reviews.length > 0 ? (
                    reviews.map((review) => (
                      <div key={review.id} className="rounded-xl border border-forest-100 bg-white p-5 shadow-sm">
                        <div className="mb-3 flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-forest-100 text-sm font-bold text-forest-700">
                              {review.user?.firstName?.[0] || 'U'}
                            </div>
                            <div>
                              <p className="text-sm font-medium text-forest-800">
                                {review.user?.firstName} {review.user?.lastName}
                              </p>
                              <div className="flex gap-0.5">
                                {Array.from({ length: 5 }).map((_, s) => (
                                  <Star
                                    key={s}
                                    className={`h-3 w-3 ${s < review.rating ? 'text-amber-400' : 'text-forest-200'}`}
                                    weight="fill"
                                  />
                                ))}
                              </div>
                            </div>
                          </div>
                          <span className="text-xs text-forest-400">
                            {new Date(review.createdAt).toLocaleDateString('en-IN', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric',
                            })}
                          </span>
                        </div>
                        {review.title && (
                          <h4 className="mb-1 text-sm font-semibold text-forest-800">{review.title}</h4>
                        )}
                        <p className="text-sm leading-relaxed text-forest-600/80">{review.comment}</p>
                      </div>
                    ))
                  ) : (
                    <div className="py-12 text-center">
                      <Star className="mx-auto mb-3 h-10 w-10 text-forest-200" />
                      <p className="text-sm text-forest-500">No reviews yet. Be the first to share your experience!</p>
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          </div>

          {/* ── Sticky Sidebar ── */}
          <aside className="lg:w-80 xl:w-96">
            <div className="sticky top-24 space-y-6">
              {/* Price Card */}
              <div className="overflow-hidden rounded-2xl border border-forest-100 bg-white shadow-lg shadow-forest-900/5">
                <div className="bg-gradient-to-r from-forest-800 to-forest-700 p-6">
                  <p className="mb-1 text-sm text-forest-300">Starting from</p>
                  <div className="flex items-baseline gap-2">
                    {hasDiscount && (
                      <span className="text-lg text-forest-400 line-through">
                        &#8377;{trip.basePrice.toLocaleString('en-IN')}
                      </span>
                    )}
                    <span className="font-heading text-3xl font-bold text-white">
                      &#8377;{displayPrice.toLocaleString('en-IN')}
                    </span>
                    <span className="text-sm text-forest-300">/person</span>
                  </div>
                  {hasDiscount && (
                    <span className="mt-2 inline-block rounded-full bg-amber-500/20 px-3 py-1 text-xs font-semibold text-amber-300">
                      Save &#8377;{(trip.basePrice - trip.discountPrice!).toLocaleString('en-IN')}
                    </span>
                  )}
                </div>

                <div className="space-y-3 p-6">
                  <div className="flex items-center gap-2 text-sm text-forest-600">
                    <MapPin className="h-4 w-4 text-forest-400" />
                    <span>Meeting: {trip.meetingPoint}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-forest-600">
                    <Clock className="h-4 w-4 text-forest-400" />
                    <span>Time: {trip.meetingTime}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-forest-600">
                    <Users className="h-4 w-4 text-forest-400" />
                    <span>Min age: {trip.minAge}+</span>
                  </div>
                </div>
              </div>

              {/* Schedules */}
              {trip.schedules && trip.schedules.length > 0 && (
                <div className="rounded-2xl border border-forest-100 bg-white p-6 shadow-sm">
                  <h3 className="mb-4 font-heading text-lg font-semibold text-forest-900">
                    Available Dates
                  </h3>
                  <div className="space-y-2">
                    {trip.schedules
                      .filter((s) => s.status === 'OPEN')
                      .slice(0, 5)
                      .map((schedule) => (
                        <div
                          key={schedule.id}
                          className="flex items-center justify-between rounded-xl border border-forest-100 p-4 transition-colors hover:bg-forest-50"
                        >
                          <div>
                            <div className="flex items-center gap-2">
                              <CalendarBlank className="h-4 w-4 text-forest-500" />
                              <span className="text-sm font-medium text-forest-800">
                                {new Date(schedule.date).toLocaleDateString('en-IN', {
                                  weekday: 'short',
                                  month: 'short',
                                  day: 'numeric',
                                })}
                              </span>
                            </div>
                            <p className="mt-1 text-xs text-forest-400">
                              {schedule.availableSpots} spots left
                            </p>
                          </div>
                          <Link
                            to={isAuthenticated ? `/booking/${trip.id}/${schedule.id}` : '/login'}
                            state={
                              isAuthenticated
                                ? undefined
                                : { from: { pathname: `/booking/${trip.id}/${schedule.id}` } }
                            }
                          >
                            <Button size="sm">Book Now</Button>
                          </Link>
                        </div>
                      ))}
                  </div>
                </div>
              )}

              {/* No schedules fallback */}
              {(!trip.schedules || trip.schedules.length === 0) && (
                <div className="rounded-2xl border border-forest-100 bg-white p-6 text-center shadow-sm">
                  <CalendarBlank className="mx-auto mb-3 h-10 w-10 text-forest-300" />
                  <p className="mb-1 text-sm font-medium text-forest-700">
                    No upcoming dates
                  </p>
                  <p className="text-xs text-forest-400">
                    New dates will be announced soon. Contact us for custom bookings.
                  </p>
                </div>
              )}
            </div>
          </aside>
        </div>

        {/* Related Trips */}
        {relatedTrips.length > 0 && (
          <section className="mt-16 border-t border-forest-100 pt-12">
            <div className="mb-8 flex items-center justify-between">
              <h2 className="font-heading text-2xl font-bold text-forest-900">Similar Treks</h2>
              <Link
                to="/trips"
                className="flex items-center gap-1 text-sm font-medium text-forest-600 transition-colors hover:text-forest-800"
              >
                View all <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {relatedTrips.map((t) => (
                <TripCard key={t.id} trip={t} />
              ))}
            </div>
          </section>
        )}
      </div>
    </>
  );
}
