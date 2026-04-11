import { Link, Navigate, useParams } from 'react-router-dom';
import {
  ArrowRight,
  CalendarBlank,
  CaretRight,
  Clock,
  MapPinLine,
  UsersThree,
} from '@phosphor-icons/react';
import Button from '@/components/ui/Button';
import {
  buildOneDayTripGuide,
  findOneDayTripBySlug,
} from '@/content/oneDayTrips';

function buildBookingHref(slug: string) {
  return `/tour-booking/${slug}`;
}

export default function OneDayTripDetail() {
  const { slug } = useParams<{ slug: string }>();
  const trip = findOneDayTripBySlug(slug);

  if (!trip) {
    return <Navigate to="/trips" replace />;
  }

  const bookingHref = buildBookingHref(trip.slug);
  const guide = buildOneDayTripGuide(trip);

  return (
    <>
      <section className="relative overflow-hidden bg-[#08131f] pt-24 text-white">
        <img
          src={trip.imageUrl}
          alt={trip.title}
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(6,16,25,0.78)_0%,rgba(7,22,33,0.62)_38%,rgba(8,24,36,0.24)_72%,rgba(7,20,28,0.14)_100%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(12,42,33,0.2)_0%,rgba(7,18,28,0.14)_32%,rgba(7,16,25,0.46)_100%)]" />

        <div className="relative mx-auto max-w-7xl px-4 pb-16 pt-14 sm:px-6 lg:px-8 lg:pb-20">
          <div className="flex items-center gap-2 text-sm text-sand-100/72">
            <Link to="/" className="hover:text-white">Home</Link>
            <CaretRight className="h-3 w-3" />
            <Link to="/trips" className="hover:text-white">Tours</Link>
            <CaretRight className="h-3 w-3" />
            <span className="text-white">{trip.title}</span>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <span className="rounded-full border border-white/14 bg-white/10 px-4 py-2 text-sm font-semibold text-white/92 backdrop-blur-sm">
              {trip.typeLabel}
            </span>
            <span className="rounded-full border border-white/14 bg-white/10 px-4 py-2 text-sm font-semibold text-white/92 backdrop-blur-sm">
              {trip.bestSeason}
            </span>
          </div>

          <div className="mt-8 max-w-4xl">
            <p className="playful-text text-2xl !text-primary-300 sm:text-3xl">One day escape</p>
            <h1 className="mt-4 max-w-3xl font-heading text-4xl leading-[0.94] !text-white sm:text-5xl lg:text-6xl">
              {trip.title}
            </h1>
            <p className="mt-5 max-w-3xl text-base leading-7 text-sand-100/84 sm:text-lg sm:leading-8">
              {trip.summary}
            </p>
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-x-7 gap-y-3 text-sm text-white/88">
            <div className="inline-flex items-center gap-2">
              <UsersThree className="h-4 w-4 text-primary-300" weight="fill" />
              {trip.groupSizeLabel}
            </div>
            <div className="inline-flex items-center gap-2">
              <MapPinLine className="h-4 w-4 text-primary-300" weight="fill" />
              {trip.distanceLabel}
            </div>
            <div className="inline-flex items-center gap-2">
              <Clock className="h-4 w-4 text-primary-300" weight="fill" />
              {trip.driveTimeLabel}
            </div>
            <div className="inline-flex items-center gap-2">
              <CalendarBlank className="h-4 w-4 text-primary-300" weight="fill" />
              {trip.dateLabel}
            </div>
          </div>

          <div className="mt-8">
            <Link to={bookingHref}>
              <Button size="lg" rightIcon={<ArrowRight className="h-4 w-4" />}>
                Book this tour
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-[linear-gradient(180deg,#f7fbf8_0%,#ffffff_100%)] py-14 sm:py-16">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 sm:px-6 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:px-8">
          <div className="travel-panel rounded-[2rem] p-8">
            <div className="border-t border-ink-900/8 pb-8 pt-0 first:border-t-0">
              <p className="section-script">Overview</p>
              <h2 className="mt-2 font-heading text-3xl text-ink-900 sm:text-4xl">About this location</h2>
              <div className="mt-5 space-y-5 text-base leading-8 text-ink-700/78">
                {guide.intro.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
            </div>

            <div className="border-t border-ink-900/8 pb-8 pt-8">
              <h3 className="font-heading text-2xl text-ink-900 sm:text-3xl">Quick route facts</h3>
              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                {guide.quickFacts.map((fact) => (
                  <div key={fact.label} className="rounded-[1.5rem] bg-sand-100 px-5 py-4">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-forest-600/82">
                      {fact.label}
                    </p>
                    <p className="mt-2 text-sm leading-7 text-ink-800">{fact.value}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="border-t border-ink-900/8 pb-8 pt-8">
              <h3 className="font-heading text-2xl text-ink-900 sm:text-3xl">Trip highlights</h3>
              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                {trip.highlights.map((item) => (
                  <div key={item} className="rounded-[1.5rem] bg-sand-100 px-5 py-4 text-sm text-ink-800">
                    {item}
                  </div>
                ))}
              </div>
            </div>

            <div className="border-t border-ink-900/8 pb-8 pt-8">
              <h3 className="font-heading text-2xl text-ink-900 sm:text-3xl">How the day usually flows</h3>
              <div className="mt-5 space-y-4">
                {guide.dayPlan.map((step, index) => (
                  <div key={step.title} className="rounded-[1.5rem] border border-ink-900/8 bg-white px-5 py-4 shadow-[0_14px_30px_rgba(15,23,42,0.04)]">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-forest-600/82">
                      Stop {index + 1}
                    </p>
                    <h4 className="mt-2 text-lg font-semibold text-ink-900">{step.title}</h4>
                    <p className="mt-2 text-sm leading-7 text-ink-700/78">{step.detail}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="border-t border-ink-900/8 pb-8 pt-8">
              <h3 className="font-heading text-2xl text-ink-900 sm:text-3xl">Travel notes</h3>
              <div className="mt-5 space-y-4 text-base leading-8 text-ink-700/78">
                <p><strong className="text-ink-900">Best season:</strong> {trip.bestSeason}</p>
                <p><strong className="text-ink-900">Drive time:</strong> {trip.driveTimeLabel}</p>
                <p><strong className="text-ink-900">Works well for:</strong> {guide.quickFacts[1].value}</p>
                <p><strong className="text-ink-900">Tip:</strong> {trip.tip}</p>
              </div>
            </div>

            <div className="border-t border-ink-900/8 pt-8">
              <h3 className="font-heading text-2xl text-ink-900 sm:text-3xl">Good add-ons nearby</h3>
              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                {guide.nearbyPicks.map((item) => (
                  <div key={item.name} className="rounded-[1.5rem] bg-sand-100 px-5 py-4">
                    <h4 className="text-lg font-semibold text-ink-900">{item.name}</h4>
                    <p className="mt-2 text-sm leading-7 text-ink-700/78">{item.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <aside className="space-y-6">
            <div className="travel-panel overflow-hidden rounded-[2rem]">
              <img src={trip.imageUrl} alt={trip.title} className="h-64 w-full object-cover" />
              <div className="p-6">
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-forest-500">
                  Starting from
                </p>
                <p className="mt-3 font-heading text-4xl text-ink-900 sm:text-5xl">{trip.priceLabel}</p>
                <p className="mt-2 text-sm text-ink-600 line-through">{trip.comparePriceLabel}</p>

                <div className="mt-6 space-y-3 border-t border-ink-900/8 pt-5 text-sm text-ink-700">
                  <div className="flex items-start justify-between gap-4">
                    <span>Type</span>
                    <span className="font-medium text-ink-900">{trip.typeLabel}</span>
                  </div>
                  <div className="flex items-start justify-between gap-4">
                    <span>Group size</span>
                    <span className="font-medium text-ink-900">{trip.groupSizeLabel}</span>
                  </div>
                  <div className="flex items-start justify-between gap-4">
                    <span>Drive time</span>
                    <span className="font-medium text-ink-900">{trip.driveTimeLabel}</span>
                  </div>
                  <div className="flex items-start justify-between gap-4">
                    <span>Distance</span>
                    <span className="font-medium text-ink-900">{trip.distanceLabel}</span>
                  </div>
                </div>

                <div className="mt-6">
                  <Link to={bookingHref} className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary-500 px-5 py-4 text-sm font-semibold uppercase tracking-[0.18em] text-white transition hover:bg-primary-600">
                    Book Now
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            </div>

            <div className="travel-panel rounded-[2rem] p-6">
              <p className="section-script">Ready to book?</p>
              <h3 className="mt-2 font-heading text-2xl text-ink-900 sm:text-3xl">Open instant booking</h3>
              <p className="mt-3 text-sm leading-7 text-ink-700/76">
                Move into the dedicated reservation flow for {trip.title}, add traveler details, and confirm it directly without dropping into the general contact page.
              </p>
              <div className="mt-5">
                <Link to={bookingHref}>
                  <Button fullWidth rightIcon={<ArrowRight className="h-4 w-4" />}>
                    Continue to booking
                  </Button>
                </Link>
              </div>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}
