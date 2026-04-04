import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  Backpack,
  CaretRight,
  CheckCircle,
  Clock,
  MapPinLine,
  Mountains,
  Star,
  UsersThree,
  XCircle,
} from '@phosphor-icons/react';
import { MAHARASHTRA_MONSOON_IMAGES } from '@alpha-trekkers/shared';
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
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import TripCard from '@/components/ui/TripCard';

const difficultyTone: Record<Difficulty, string> = {
  EASY: 'bg-sea-500/12 text-sea-600',
  MODERATE: 'bg-gold-500/12 text-gold-600',
  DIFFICULT: 'bg-coral-500/12 text-coral-600',
  EXTREME: 'bg-ink-900/12 text-ink-900',
};

type TabKey = 'overview' | 'itinerary' | 'inclusions' | 'reviews';

export default function TripDetail() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();
  const [trip, setTrip] = useState<Trip | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [relatedTrips, setRelatedTrips] = useState<Trip[]>([]);
  const [activeTab, setActiveTab] = useState<TabKey>('overview');
  const [activeImage, setActiveImage] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);

    api
      .get<ApiResponse<{ trip: Trip }>>(`/trips/${slug}`)
      .then(async (tripResponse) => {
        const loadedTrip = tripResponse.data.data.trip;
        setTrip(loadedTrip);

        const [reviewResponse, relatedResponse] = await Promise.all([
          api
            .get<PaginatedResponse<{ reviews: Review[] }>>(`/reviews/trip/${loadedTrip.id}`)
            .catch(() => null),
          api
            .get<PaginatedResponse<{ trips: Trip[] }>>('/trips', {
              params: { category: loadedTrip.category, limit: 4, sortBy: 'avgRating', sortOrder: 'desc' },
            })
            .catch(() => null),
        ]);

        setReviews(reviewResponse?.data.data.reviews ?? []);
        setRelatedTrips(
          relatedResponse?.data.data.trips
            .filter((candidate) => candidate.id !== loadedTrip.id)
            .slice(0, 3) ?? [],
        );
      })
      .catch(() => navigate('/trips'))
      .finally(() => setLoading(false));
  }, [slug, navigate]);

  if (loading) return <LoadingSpinner fullPage text="Loading journey..." />;
  if (!trip) return null;

  const images =
    trip.images.length > 0
      ? trip.images
        : [
          {
            id: 'fallback',
            url: MAHARASHTRA_MONSOON_IMAGES.fallback.tripDetail,
            altText: trip.title,
            isPrimary: true,
            sortOrder: 0,
          },
        ];

  const price = trip.discountPrice ?? trip.basePrice;
  const tabs: { key: TabKey; label: string }[] = [
    { key: 'overview', label: 'Overview' },
    { key: 'itinerary', label: 'Itinerary' },
    { key: 'inclusions', label: 'Inclusions' },
    { key: 'reviews', label: `Reviews (${reviews.length})` },
  ];

  return (
    <>
      <section className="travel-dark relative overflow-hidden pt-28">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-22"
          style={{ backgroundImage: `url(${MAHARASHTRA_MONSOON_IMAGES.heroes.tripDetail})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-ink-950/92 via-ink-900/70 to-transparent" />
        <div className="relative mx-auto max-w-7xl px-4 pb-16 pt-[4.5rem] sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 text-sm text-sand-100/70">
            <Link to="/" className="hover:text-white">Home</Link>
            <CaretRight className="h-3 w-3" />
            <Link to="/trips" className="hover:text-white">Tours</Link>
            <CaretRight className="h-3 w-3" />
            <span className="text-white">{trip.title}</span>
          </div>

          <div className="mt-7 max-w-3xl">
            <div className="flex flex-wrap items-center gap-3">
              <span className={`rounded-full px-4 py-1.5 text-sm font-semibold ${difficultyTone[trip.difficulty]}`}>
                {DIFFICULTIES[trip.difficulty].label}
              </span>
              <span className="rounded-full bg-white/10 px-4 py-1.5 text-sm text-sand-100">
                {trip.category.replace('_', ' ')}
              </span>
              <span className="rounded-full bg-white/10 px-4 py-1.5 text-sm text-sand-100">
                {trip.region}
              </span>
            </div>
            <h1 className="mt-6 font-heading text-5xl leading-[0.95] text-white sm:text-6xl">
              {trip.title}
            </h1>
            <p className="mt-5 text-lg leading-8 text-sand-100/76">{trip.shortDescription}</p>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[1fr_360px]">
          <div>
            <div className="overflow-hidden rounded-[2.4rem]">
              <img
                src={images[activeImage]?.url}
                alt={images[activeImage]?.altText || trip.title}
                className="h-[26rem] w-full object-cover sm:h-[32rem]"
              />
            </div>

            {images.length > 1 ? (
              <div className="mt-4 grid grid-cols-4 gap-3">
                {images.slice(0, 4).map((image, index) => (
                  <button
                    key={image.id}
                    type="button"
                    onClick={() => setActiveImage(index)}
                    className={`overflow-hidden rounded-[1.5rem] border-2 ${
                      activeImage === index ? 'border-forest-500' : 'border-transparent'
                    }`}
                  >
                    <img src={image.url} alt={image.altText || trip.title} className="h-24 w-full object-cover" />
                  </button>
                ))}
              </div>
            ) : null}

            <div className="mt-8 grid gap-4 sm:grid-cols-4">
              {[
                { icon: Clock, label: 'Duration', value: `${trip.durationHours} hours` },
                { icon: Mountains, label: 'Elevation', value: `${trip.elevationM}m` },
                { icon: UsersThree, label: 'Group size', value: `Up to ${trip.maxGroupSize}` },
                { icon: MapPinLine, label: 'Start', value: trip.startLocation },
              ].map((item) => (
                <div key={item.label} className="travel-panel rounded-[1.6rem] p-5">
                  <item.icon className="h-6 w-6 text-forest-500" weight="duotone" />
                  <p className="mt-4 text-xs uppercase tracking-[0.16em] text-ink-600/70">{item.label}</p>
                  <p className="mt-2 font-heading text-2xl text-ink-900">{item.value}</p>
                </div>
              ))}
            </div>

            <div className="travel-panel mt-8 rounded-[2rem] p-3">
              <div className="flex flex-wrap gap-2">
                {tabs.map((tab) => (
                  <button
                    key={tab.key}
                    type="button"
                    onClick={() => setActiveTab(tab.key)}
                    className={`rounded-full px-5 py-3 text-sm font-medium ${
                      activeTab === tab.key
                        ? 'bg-forest-500 text-white'
                        : 'text-ink-700 hover:bg-sand-100'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25 }}
              className="travel-panel mt-6 rounded-[2rem] p-8"
            >
              {activeTab === 'overview' ? (
                <div className="space-y-8">
                  <div>
                    <h2 className="font-heading text-4xl text-ink-900">About this journey</h2>
                    <p className="mt-4 whitespace-pre-line text-base leading-8 text-ink-700/74">
                      {trip.description}
                    </p>
                  </div>
                  <div>
                    <h3 className="font-heading text-3xl text-ink-900">Highlights</h3>
                    <div className="mt-4 grid gap-3 sm:grid-cols-2">
                      {trip.highlights.map((item) => (
                        <div key={item} className="rounded-[1.5rem] bg-sand-100 px-5 py-4 text-sm text-ink-800">
                          {item}
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h3 className="font-heading text-3xl text-ink-900">Things to carry</h3>
                    <div className="mt-4 grid gap-3 sm:grid-cols-2">
                      {trip.thingsToCarry.map((item) => (
                        <div key={item} className="flex items-center gap-3 rounded-[1.5rem] bg-sand-100 px-5 py-4 text-sm text-ink-800">
                          <Backpack className="h-4 w-4 text-forest-500" />
                          {item}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : null}

              {activeTab === 'itinerary' ? (
                <div>
                  <h2 className="font-heading text-4xl text-ink-900">Day flow</h2>
                  <div className="mt-6 space-y-5">
                    {trip.itinerary.map((step, index) => (
                      <div key={`${step.time}-${index}`} className="rounded-[1.7rem] border border-ink-900/8 bg-sand-50 p-5">
                        <p className="text-xs uppercase tracking-[0.2em] text-forest-500">{step.time}</p>
                        <h3 className="mt-2 font-heading text-3xl text-ink-900">{step.title}</h3>
                        <p className="mt-2 text-sm leading-7 text-ink-700/72">{step.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ) : null}

              {activeTab === 'inclusions' ? (
                <div className="grid gap-8 sm:grid-cols-2">
                  <div>
                    <h2 className="font-heading text-4xl text-ink-900">Included</h2>
                    <div className="mt-5 space-y-3">
                      {trip.inclusions.map((item) => (
                        <div key={item} className="flex items-start gap-3 rounded-[1.4rem] bg-sand-100 px-5 py-4 text-sm text-ink-800">
                          <CheckCircle className="mt-0.5 h-4 w-4 text-forest-500" weight="fill" />
                          {item}
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h2 className="font-heading text-4xl text-ink-900">Not included</h2>
                    <div className="mt-5 space-y-3">
                      {trip.exclusions.map((item) => (
                        <div key={item} className="flex items-start gap-3 rounded-[1.4rem] bg-sand-100 px-5 py-4 text-sm text-ink-800">
                          <XCircle className="mt-0.5 h-4 w-4 text-coral-500" weight="fill" />
                          {item}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : null}

              {activeTab === 'reviews' ? (
                <div>
                  <h2 className="font-heading text-4xl text-ink-900">Traveler feedback</h2>
                  <div className="mt-6 space-y-4">
                    {reviews.length > 0 ? (
                      reviews.map((review) => (
                        <div key={review.id} className="rounded-[1.7rem] border border-ink-900/8 bg-sand-50 p-5">
                          <div className="flex items-start justify-between gap-4">
                            <div>
                              <p className="font-heading text-3xl text-ink-900">
                                {review.user?.firstName} {review.user?.lastName}
                              </p>
                              <div className="mt-2 flex items-center gap-1 text-gold-500">
                                {Array.from({ length: 5 }).map((_, index) => (
                                  <Star key={index} className="h-4 w-4" weight={index < review.rating ? 'fill' : 'regular'} />
                                ))}
                              </div>
                            </div>
                            <span className="text-sm text-ink-600/60">
                              {new Date(review.createdAt).toLocaleDateString('en-IN')}
                            </span>
                          </div>
                          {review.title ? <h3 className="mt-4 text-lg font-medium text-ink-900">{review.title}</h3> : null}
                          <p className="mt-2 text-sm leading-7 text-ink-700/72">{review.comment}</p>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm leading-7 text-ink-700/72">
                        No reviews yet for this departure.
                      </p>
                    )}
                  </div>
                </div>
              ) : null}
            </motion.div>
          </div>

          <aside>
            <div className="sticky top-[7.5rem] space-y-6">
              <div className="travel-panel rounded-[2rem] overflow-hidden">
                <div className="travel-dark p-8 text-white">
                  <p className="text-xs uppercase tracking-[0.18em] text-gold-400">Starting from</p>
                  <h2 className="mt-3 font-heading text-5xl">INR {price.toLocaleString('en-IN')}</h2>
                  <p className="mt-2 text-sm text-sand-100/74">Per traveler, before add-ons</p>
                </div>
                <div className="space-y-4 p-6 text-sm text-ink-700">
                  <div className="flex items-center justify-between">
                    <span>Meeting point</span>
                    <span className="font-medium text-ink-900">{trip.meetingPoint}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Meeting time</span>
                    <span className="font-medium text-ink-900">{trip.meetingTime}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Min age</span>
                    <span className="font-medium text-ink-900">{trip.minAge}+</span>
                  </div>
                </div>
              </div>

              <div className="travel-panel rounded-[2rem] p-6">
                <h3 className="font-heading text-3xl text-ink-900">Available dates</h3>
                <div className="mt-5 space-y-3">
                  {trip.schedules && trip.schedules.length > 0 ? (
                    trip.schedules
                      .filter((schedule) => schedule.status === 'OPEN')
                      .slice(0, 5)
                      .map((schedule) => (
                        <div key={schedule.id} className="rounded-[1.5rem] bg-sand-100 p-4">
                          <p className="text-sm font-medium text-ink-900">
                            {new Date(schedule.date).toLocaleDateString('en-IN', {
                              weekday: 'short',
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric',
                            })}
                          </p>
                          <p className="mt-1 text-xs uppercase tracking-[0.16em] text-ink-600/62">
                            {schedule.availableSpots} spots left
                          </p>
                          <Link
                            to={isAuthenticated ? `/booking/${trip.id}/${schedule.id}` : '/login'}
                            state={
                              isAuthenticated
                                ? undefined
                                : { from: { pathname: `/booking/${trip.id}/${schedule.id}` } }
                            }
                            className="mt-4 block"
                          >
                            <Button fullWidth size="md">
                              Book this date
                            </Button>
                          </Link>
                        </div>
                      ))
                  ) : (
                    <p className="text-sm leading-7 text-ink-700/72">No upcoming departures right now.</p>
                  )}
                </div>
              </div>
            </div>
          </aside>
        </div>

        {relatedTrips.length > 0 ? (
          <section className="mt-16">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-forest-500">Related tours</p>
                <h2 className="font-heading text-4xl text-ink-900">Similar travel moods</h2>
              </div>
              <Link to="/trips">
                <Button variant="secondary" rightIcon={<ArrowRight className="h-4 w-4" />}>
                  Browse all tours
                </Button>
              </Link>
            </div>
            <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {relatedTrips.map((item) => (
                <TripCard key={item.id} trip={item} />
              ))}
            </div>
          </section>
        ) : null}
      </div>
    </>
  );
}
