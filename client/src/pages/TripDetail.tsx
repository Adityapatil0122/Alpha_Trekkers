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
import { getStaticFortTrip } from '@/content/fortDirectory';
import {
  TRIP_LOCATION_GUIDES,
  WATERFALL_SPOTLIGHTS,
  buildFallbackLocationGuide,
  buildMapEmbedUrl,
  buildMapLink,
  getTripRouteLabel,
} from '@/content/locationGuide';
import { useAuthStore } from '@/stores/authStore';
import Button from '@/components/ui/Button';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import TripCard from '@/components/ui/TripCard';

const difficultyTone: Record<Difficulty, string> = {
  EASY: 'border border-white/12 bg-sea-500/28 text-white',
  MODERATE: 'border border-white/12 bg-forest-500/30 text-white',
  DIFFICULT: 'border border-white/12 bg-coral-500/28 text-white',
  EXTREME: 'border border-white/12 bg-white/12 text-white',
};

type TabKey = 'overview' | 'gallery' | 'itinerary' | 'map' | 'essentials' | 'reviews';

function formatDuration(durationHours: number) {
  if (durationHours >= 24) {
    const days = Math.round(durationHours / 24);
    return `${days} day${days > 1 ? 's' : ''}`;
  }

  return `${durationHours} hour${durationHours > 1 ? 's' : ''}`;
}

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
    const staticFort = getStaticFortTrip(slug);

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
      .catch(() => {
        if (staticFort) {
          setTrip(staticFort);
          setReviews([]);
          setRelatedTrips([]);
          return;
        }

        navigate('/trips');
      })
      .finally(() => setLoading(false));
  }, [slug, navigate]);

  const images =
    trip?.images.length
      ? trip.images
      : [
          {
            id: 'fallback',
            url: MAHARASHTRA_MONSOON_IMAGES.fallback.tripDetail,
            altText: trip?.title || 'Trip detail',
            isPrimary: true,
            sortOrder: 0,
          },
        ];
  const heroImageUrl = images[0]?.url || MAHARASHTRA_MONSOON_IMAGES.heroes.tripDetail;

  if (loading) return <LoadingSpinner fullPage text="Loading journey..." />;
  if (!trip) return null;

  const guide = TRIP_LOCATION_GUIDES[trip.slug] ?? buildFallbackLocationGuide(trip);
  const price = trip.discountPrice ?? trip.basePrice;
  const descriptionSections = trip.description.split(/\n\s*\n/).filter(Boolean);
  const mapEmbedUrl = buildMapEmbedUrl(trip);
  const mapLink = buildMapLink(trip);
  const locationName = trip.fortName || trip.title;
  const infoLabel = trip.fortName ? 'Fort' : 'Route';
  const waterfallCards = guide.waterfallIds
    .map((id) => WATERFALL_SPOTLIGHTS[id])
    .filter(Boolean);
  const galleryItems = Array.from(
    new Map(
      [
        ...images.map((image) => ({
          src: image.url,
          alt: image.altText || trip.title,
          caption: image.altText || trip.title,
        })),
        ...guide.gallery,
      ].map((item) => [item.src, item]),
    ).values(),
  );

  const tabs: { key: TabKey; label: string }[] = [
    { key: 'overview', label: 'Overview' },
    { key: 'gallery', label: 'Photo Gallery' },
    { key: 'itinerary', label: 'Itinerary' },
    { key: 'map', label: 'Map' },
    { key: 'essentials', label: 'Essentials' },
    { key: 'reviews', label: `Reviews (${reviews.length})` },
  ];

  return (
    <>
      <section className="travel-dark relative overflow-hidden pt-28">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url("${heroImageUrl}")` }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-dark-900/74 via-dark-900/48 to-dark-900/20" />
        <div className="relative mx-auto max-w-7xl px-4 pb-20 pt-[4.5rem] sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center gap-2 text-sm text-white/82">
            <Link to="/" className="text-white/82 hover:text-white">Home</Link>
            <CaretRight className="h-3 w-3" />
            <Link to="/trips" className="text-white/82 hover:text-white">
              {trip.category === 'WEEKEND' ? 'Weekend Trips' : trip.category === 'WEEKDAY' ? 'Weekdays Trips' : 'Tours'}
            </Link>
            <CaretRight className="h-3 w-3" />
            <span className="text-white">{trip.title}</span>
          </div>

          <div className="mt-7 max-w-4xl">
            <div className="flex flex-wrap items-center gap-3">
              <span className={`rounded-full px-4 py-1.5 text-sm font-semibold ${difficultyTone[trip.difficulty]}`}>
                {DIFFICULTIES[trip.difficulty].label}
              </span>
              <span className="rounded-full border border-white/12 bg-white/10 px-4 py-1.5 text-sm text-white">
                {trip.category.replace('_', ' ')}
              </span>
              <span className="rounded-full border border-white/12 bg-white/10 px-4 py-1.5 text-sm text-white">
                {trip.region}
              </span>
              <span className="rounded-full border border-white/12 bg-forest-500/30 px-4 py-1.5 text-sm font-medium text-white">
                {getTripRouteLabel(trip.category)}
              </span>
            </div>
            <p className="mt-6 text-xs uppercase tracking-[0.2em] text-white/92">{guide.eyebrow}</p>
            <h1 className="mt-3 font-heading text-4xl leading-[0.95] !text-white drop-shadow-[0_10px_30px_rgba(0,0,0,0.45)] sm:text-5xl lg:text-6xl">
              {trip.title}
            </h1>
            <p className="mt-5 max-w-3xl text-base leading-7 text-white/88 sm:text-lg sm:leading-8">{trip.shortDescription}</p>
            <div className="mt-6 flex flex-wrap gap-6 text-sm text-white">
              <span className="inline-flex items-center gap-2">
                <Clock className="h-4 w-4 text-white" />
                {formatDuration(trip.durationHours)}
              </span>
              <span className="inline-flex items-center gap-2">
                <MapPinLine className="h-4 w-4 text-white" />
                {trip.startLocation}
              </span>
              <span className="inline-flex items-center gap-2">
                <UsersThree className="h-4 w-4 text-white" />
                Up to {trip.maxGroupSize} people
              </span>
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_360px]">
          <div>
            <div className="overflow-hidden rounded-[2.4rem]">
              <img
                src={images[activeImage]?.url}
                alt={images[activeImage]?.altText || trip.title}
                className="h-[18rem] w-full object-cover sm:h-[26rem] lg:h-[32rem]"
              />
            </div>

            {images.length > 1 ? (
              <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
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

            <div className="mt-8 grid items-start gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
              {[
                { icon: Clock, label: 'Duration', value: formatDuration(trip.durationHours), valueClassName: 'text-[1.05rem] sm:text-[1.15rem]' },
                { icon: Mountains, label: 'Altitude', value: `${trip.maxAltitudeM} m`, valueClassName: 'text-[1.05rem] sm:text-[1.15rem]' },
                { icon: UsersThree, label: 'Group size', value: `Up to ${trip.maxGroupSize}`, valueClassName: 'text-[1.05rem] sm:text-[1.15rem]' },
                { icon: MapPinLine, label: 'Start point', value: trip.startLocation, valueClassName: 'text-[0.98rem] sm:text-[1.05rem]' },
                { icon: Clock, label: 'Best for', value: getTripRouteLabel(trip.category), valueClassName: 'text-[0.98rem] sm:text-[1.05rem]' },
              ].map((item) => (
                <div key={item.label} className="travel-panel self-start rounded-[1.15rem] px-3.5 py-3">
                  <div className="flex items-center gap-2">
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-forest-500/8">
                      <item.icon className="h-4 w-4 text-forest-500" weight="duotone" />
                    </span>
                    <p className="text-[0.62rem] uppercase tracking-[0.14em] text-ink-600/70">{item.label}</p>
                  </div>
                  <p className={`mt-2.5 font-heading leading-[1.1] text-ink-900 ${item.valueClassName}`}>
                    {item.value}
                  </p>
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
                <div className="space-y-10">
                  <div className="border-t border-ink-900/8 pt-8 first:border-t-0 first:pt-0">
                    <p className="section-script">About this location</p>
                    <h2 className="mt-2 font-heading text-4xl text-ink-900">Overview</h2>
                    <div className="mt-5 space-y-4 text-base leading-8 text-ink-700/76">
                      {guide.intro.map((paragraph) => (
                        <p key={paragraph}>{paragraph}</p>
                      ))}
                    </div>
                  </div>

                  <div className="border-t border-ink-900/8 pt-8">
                    <h3 className="font-heading text-3xl text-ink-900">{locationName} trek information:</h3>
                    <ul className="mt-5 space-y-3 text-base leading-8 text-ink-700/78">
                      <li><strong className="text-ink-900">{infoLabel} elevation:</strong> {trip.maxAltitudeM} m</li>
                      <li><strong className="text-ink-900">Trek difficulty:</strong> {DIFFICULTIES[trip.difficulty].label}</li>
                      <li><strong className="text-ink-900">Trek duration:</strong> {formatDuration(trip.durationHours)}</li>
                      <li><strong className="text-ink-900">Group size:</strong> Up to {trip.maxGroupSize} trekkers</li>
                      <li><strong className="text-ink-900">Location address:</strong> {trip.startLocation}</li>
                      {guide.quickFacts.slice(0, 3).map((fact) => (
                        <li key={fact.label}>
                          <strong className="text-ink-900">{fact.label}:</strong> {fact.value}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="border-t border-ink-900/8 pt-8">
                    <h3 className="font-heading text-3xl text-ink-900">Why visit this location:</h3>
                    <div className="mt-5 space-y-4 text-base leading-8 text-ink-700/76">
                      {descriptionSections.map((section) => (
                        <p key={section}>{section}</p>
                      ))}
                    </div>
                  </div>

                  <div className="border-t border-ink-900/8 pt-8">
                    <h3 className="font-heading text-3xl text-ink-900">Event fees:</h3>
                    <ul className="mt-5 space-y-3 text-base leading-8 text-ink-700/78">
                      <li><strong className="text-ink-900">Starting price:</strong> INR {price.toLocaleString('en-IN')}</li>
                      <li><strong className="text-ink-900">Per traveler:</strong> before add-ons and optional extras</li>
                    </ul>
                  </div>

                  <div className="border-t border-ink-900/8 pt-8">
                    <h3 className="font-heading text-3xl text-ink-900">Nearby Maharashtra waterfall picks:</h3>
                    <ul className="mt-5 space-y-3 text-base leading-8 text-ink-700/78">
                      {waterfallCards.map((waterfall) => (
                        <li key={waterfall.id}>
                          <a
                            href={waterfall.mapUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="font-medium text-forest-500 hover:underline"
                          >
                            {waterfall.name}
                          </a>
                          {`: ${waterfall.summary}`}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ) : null}

              {activeTab === 'gallery' ? (
                <div>
                  <p className="section-script">Photo gallery</p>
                  <h2 className="mt-2 font-heading text-4xl text-ink-900">Photo gallery</h2>
                  <div className="mt-6 grid gap-5 md:grid-cols-2">
                    {galleryItems.map((item, index) => (
                      <figure key={`${item.src}-${index}`} className="overflow-hidden rounded-[1.9rem] bg-sand-50">
                        <img src={item.src} alt={item.alt} className="h-72 w-full object-cover" />
                        <figcaption className="px-5 py-4 text-sm leading-7 text-ink-700/74">
                          {item.caption}
                        </figcaption>
                      </figure>
                    ))}
                  </div>
                </div>
              ) : null}

              {activeTab === 'itinerary' ? (
                <div>
                  <p className="section-script">Day flow</p>
                  <h2 className="mt-2 font-heading text-4xl text-ink-900">Itinerary</h2>
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

              {activeTab === 'map' ? (
                <div>
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                      <p className="section-script">Pickup point</p>
                      <h2 className="mt-2 font-heading text-4xl text-ink-900">Location map</h2>
                      <p className="mt-3 max-w-2xl text-sm leading-7 text-ink-700/72">
                        Navigate directly to the trip region and open the live map for meeting access.
                      </p>
                    </div>
                    {mapLink ? (
                      <a
                        href={mapLink}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-2 rounded-full bg-forest-500 px-5 py-3 text-sm font-medium text-white"
                      >
                        View on map
                        <ArrowRight className="h-4 w-4" />
                      </a>
                    ) : null}
                  </div>

                  <div className="mt-6 rounded-[1.8rem] border border-ink-900/8 bg-sand-50 p-4">
                    {mapEmbedUrl ? (
                      <iframe
                        title={`${trip.title} map`}
                        src={mapEmbedUrl}
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                        allowFullScreen
                        className="h-[28rem] w-full rounded-[1.3rem] border-0"
                      />
                    ) : (
                      <div className="flex h-[20rem] items-center justify-center rounded-[1.3rem] bg-white text-center text-sm text-ink-700/72">
                        Map coordinates are not available for this location yet.
                      </div>
                    )}
                  </div>
                </div>
              ) : null}

              {activeTab === 'essentials' ? (
                <div className="space-y-8">
                  <div className="grid gap-8 sm:grid-cols-2">
                    <div>
                      <p className="section-script">Included</p>
                      <h2 className="mt-2 font-heading text-4xl text-ink-900">Inclusions</h2>
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
                      <p className="section-script">Not included</p>
                      <h2 className="mt-2 font-heading text-4xl text-ink-900">Exclusions</h2>
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

                  <div>
                    <p className="section-script">Things to carry</p>
                    <h3 className="mt-2 font-heading text-3xl text-ink-900">Things to carry</h3>
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

              {activeTab === 'reviews' ? (
                <div>
                  <p className="section-script">Traveler feedback</p>
                  <h2 className="mt-2 font-heading text-4xl text-ink-900">Reviews</h2>
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
              <div className="travel-panel overflow-hidden rounded-[2rem]">
                <div className="bg-forest-500/10 px-6 py-7 text-ink-900 sm:px-8">
                  <p className="text-xs uppercase tracking-[0.18em] text-forest-600">Starting from</p>
                  <h2 className="mt-3 font-heading text-4xl text-forest-600 sm:text-5xl">INR {price.toLocaleString('en-IN')}</h2>
                  <p className="mt-2 text-sm text-ink-700/72">Per traveler, before add-ons</p>
                </div>
                <div className="p-6">
                  <div className="flex flex-col gap-2.5">
                  <Link to={trip.schedules?.[0] ? (isAuthenticated ? `/booking/${trip.id}/${trip.schedules[0].id}` : '/login') : '/contact'}>
                    <Button fullWidth size="sm">
                      Book Now
                    </Button>
                  </Link>
                  <Link to="/contact">
                    <Button fullWidth size="sm" variant="secondary">
                      Enquire Now
                    </Button>
                  </Link>
                  </div>
                  <div className="space-y-2 pt-2 text-sm text-ink-700">
                    <p className="flex items-start justify-between gap-4">
                      <span>Meeting point</span>
                      <span className="text-right font-medium text-ink-900">{trip.meetingPoint}</span>
                    </p>
                    <p className="flex items-start justify-between gap-4">
                      <span>Meeting time</span>
                      <span className="text-right font-medium text-ink-900">{trip.meetingTime}</span>
                    </p>
                    <p className="flex items-start justify-between gap-4">
                      <span>Min age</span>
                      <span className="text-right font-medium text-ink-900">{trip.minAge}+</span>
                    </p>
                  </div>
                </div>
              </div>

              <div className="travel-panel rounded-[2rem] p-6">
                <p className="section-script">Route fit</p>
                <h3 className="mt-2 font-heading text-2xl text-ink-900 sm:text-3xl">{guide.routeFit}</h3>
                <p className="mt-4 text-sm leading-7 text-ink-700/72">{guide.routeFitDescription}</p>
              </div>

              <div className="travel-panel rounded-[2rem] p-6">
                <h3 className="font-heading text-2xl text-ink-900 sm:text-3xl">Available dates</h3>
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

              <div className="travel-panel rounded-[2rem] p-6">
                <p className="section-script">Waterfall shortlist</p>
                <h3 className="mt-2 font-heading text-3xl text-ink-900">Maharashtra picks</h3>
                <div className="mt-5 space-y-5">
                  {waterfallCards.slice(0, 3).map((waterfall) => (
                    <div key={waterfall.id} className="border-b border-ink-900/8 pb-4 last:border-b-0 last:pb-0">
                      <p className="text-xs uppercase tracking-[0.16em] text-forest-500">{waterfall.location}</p>
                      <a
                        href={waterfall.mapUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="mt-1 block font-medium text-ink-900 hover:text-forest-500"
                      >
                        {waterfall.name}
                      </a>
                      <p className="mt-1 text-sm leading-6 text-ink-700/72">{waterfall.bestFor}</p>
                    </div>
                  ))}
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
