import { MAHARASHTRA_MONSOON_IMAGES } from '@alpha-trekkers/shared';
import type { Trip, TripCategory } from '@alpha-trekkers/shared';

export type WaterfallId = 'devkund' | 'thoseghar' | 'kumbhe' | 'andharban';

export interface GuideFact {
  label: string;
  value: string;
}

export interface GuideGalleryItem {
  src: string;
  alt: string;
  caption: string;
}

export interface WaterfallSpotlight {
  id: WaterfallId;
  name: string;
  location: string;
  summary: string;
  bestFor: string;
  image: string;
  mapUrl: string;
}

export interface LocationGuide {
  eyebrow: string;
  routeFit: string;
  routeFitDescription: string;
  idealSeason: string;
  travelWindow: string;
  driveTime: string;
  intro: string[];
  quickFacts: GuideFact[];
  gallery: GuideGalleryItem[];
  waterfallIds: WaterfallId[];
}

export const WATERFALL_SPOTLIGHTS: Record<WaterfallId, WaterfallSpotlight> = {
  devkund: {
    id: 'devkund',
    name: 'Devkund Waterfall',
    location: 'Bhira, Raigad',
    summary:
      'A blue plunge pool hidden inside dense forest, best visited after the monsoon when the trail is green and the water flow is strong.',
    bestFor: 'Weekday nature resets and easy monsoon photography',
    image: MAHARASHTRA_MONSOON_IMAGES.waterfalls.devkund[0],
    mapUrl: 'https://www.google.com/maps/search/?api=1&query=18.4144,73.3819',
  },
  thoseghar: {
    id: 'thoseghar',
    name: 'Thoseghar Waterfalls',
    location: 'Satara',
    summary:
      'A dramatic chain of seasonal falls with accessible viewpoints, deep valley mist, and one of the cleanest monsoon road-trip experiences in western Maharashtra.',
    bestFor: 'Scenic weekday drives and monsoon viewpoint stops',
    image: MAHARASHTRA_MONSOON_IMAGES.waterfalls.thoseghar[0],
    mapUrl: 'https://www.google.com/maps/search/?api=1&query=17.5966,73.8458',
  },
  kumbhe: {
    id: 'kumbhe',
    name: 'Kumbhe Waterfall',
    location: 'Mangaon, Raigad',
    summary:
      'A wide multi-tier cascade near Mangaon that works well as a softer adventure add-on when you want waterfall scenery without a technical climb.',
    bestFor: 'Weekend add-ons from Raigad circuits and relaxed waterfall outings',
    image: MAHARASHTRA_MONSOON_IMAGES.waterfalls.kumbhe[0],
    mapUrl: 'https://www.google.com/maps/search/?api=1&query=18.3102,73.3718',
  },
  andharban: {
    id: 'andharban',
    name: 'Andharban Waterfall Pockets',
    location: 'Tamhini, Pune',
    summary:
      'The Andharban route is lined with streams, side cascades, and deep jungle viewpoints that turn the trail into a moving waterfall corridor during peak monsoon.',
    bestFor: 'Weekday forest hikes and cloud-heavy monsoon routes',
    image: MAHARASHTRA_MONSOON_IMAGES.waterfalls.andharban[0],
    mapUrl: 'https://www.google.com/maps/search/?api=1&query=18.4072,73.4208',
  },
};

export const TRIP_LOCATION_GUIDES: Record<string, LocationGuide> = {
  'rajgad-fort-trek': {
    eyebrow: 'Historic fort capital',
    routeFit: 'Best for full weekend fort history circuits',
    routeFitDescription:
      'Rajgad needs time for the climb, the machis, and the fort story. It works better as a weekend plan than as a rushed midweek escape.',
    idealSeason: 'July to February',
    travelWindow: '1 full day or weekend sunrise plan',
    driveTime: 'Around 1.5 to 2 hours from Pune',
    intro: [
      'Rajgad rewards trekkers who want both history and terrain. The fort is broad, layered, and large enough that each machi feels like a separate viewpoint.',
      'Because the climb is longer and the fort sprawl is substantial, this location makes the most sense for trekkers planning a proper weekend outing rather than a short weekday run.',
    ],
    quickFacts: [
      { label: 'Base village', value: 'Gunjavane' },
      { label: 'Known for', value: 'Padmavati Machi and Balle Killa' },
      { label: 'Fort mood', value: 'Large fortification circuit with history-led exploration' },
      { label: 'Ideal pace', value: 'Slow weekend climb with time for all machis' },
    ],
    gallery: [
      { src: MAHARASHTRA_MONSOON_IMAGES.trips.rajgad[1], alt: 'Rajgad ridge section', caption: 'The long ridge approach makes Rajgad feel expansive from the very first hour.' },
      { src: MAHARASHTRA_MONSOON_IMAGES.trips.rajgad[3], alt: 'Rajgad after rain', caption: 'Monsoon clouds wrap the fort walls and open wide valley views in between.' },
    ],
    waterfallIds: ['thoseghar', 'devkund'],
  },
  'torna-fort-trek': {
    eyebrow: 'First conquest fort',
    routeFit: 'Best for strong weekend summit plans',
    routeFitDescription:
      'Torna is long enough and steep enough that it deserves a dedicated weekend departure, especially in the rains when the trail slows down.',
    idealSeason: 'August to February',
    travelWindow: '1 day with an early start',
    driveTime: 'Around 2 hours from Pune',
    intro: [
      'Torna has a bigger mountain feel than many Pune forts. The approach opens into exposed sections and long ridges that feel dramatic in cloud cover.',
      'This is a good weekend pick for trekkers who already have a few beginner forts behind them and want a fort that carries both legacy and distance.',
    ],
    quickFacts: [
      { label: 'Base village', value: 'Velhe' },
      { label: 'Known for', value: 'Prachandagad ridges and Mengai temple' },
      { label: 'Fort mood', value: 'Longer climb with exposed final sections' },
      { label: 'Ideal pace', value: 'Weekend trek for intermediate hikers' },
    ],
    gallery: [
      { src: MAHARASHTRA_MONSOON_IMAGES.trips.torna[2], alt: 'Torna bastion', caption: 'Stone bastions and cloud breaks give Torna one of Pune district’s strongest summit personalities.' },
      { src: MAHARASHTRA_MONSOON_IMAGES.trips.torna[3], alt: 'Torna in monsoon', caption: 'The post-monsoon ridge is one of the most photogenic fort lines near Pune.' },
    ],
    waterfallIds: ['thoseghar', 'andharban'],
  },
  'harishchandragad-trek': {
    eyebrow: 'Iconic cliff edge camp',
    routeFit: 'Best for serious weekend trekkers',
    routeFitDescription:
      'Harishchandragad is a full-scale Sahyadri experience. The length, altitude, and camp-friendly format make it a weekend-only destination for most groups.',
    idealSeason: 'September to February',
    travelWindow: 'Overnight or long-day trek',
    driveTime: '4 to 5 hours from Pune depending on route',
    intro: [
      'Konkan Kada is not the kind of place you should race through. This fort works when the schedule leaves room for caves, the plateau, and cliff-edge sunrise.',
      'Among Maharashtra forts, Harishchandragad stands out for geology as much as history, which is why it fits trekkers looking for a bigger weekend experience.',
    ],
    quickFacts: [
      { label: 'Base village', value: 'Khireshwar or Pachnai' },
      { label: 'Known for', value: 'Konkan Kada and Kedareshwar cave' },
      { label: 'Fort mood', value: 'Large plateau with dramatic cliff geology' },
      { label: 'Ideal pace', value: 'Overnight weekend trek with sunrise stop' },
    ],
    gallery: [
      { src: MAHARASHTRA_MONSOON_IMAGES.trips.harishchandragad[1], alt: 'Kokankada trail', caption: 'Cloud breaks along the Kokankada side produce the classic Harishchandragad frames.' },
      { src: MAHARASHTRA_MONSOON_IMAGES.trips.harishchandragad[2], alt: 'Kedareshwar cave', caption: 'The cave temples are a major reason this fort feels deeper than a normal summit-only trek.' },
    ],
    waterfallIds: ['andharban', 'thoseghar'],
  },
  'kalsubai-peak-trek': {
    eyebrow: 'Highest point in Maharashtra',
    routeFit: 'Best for milestone weekends',
    routeFitDescription:
      'Kalsubai is the peak people usually save for a dedicated day. It is achievable, but it still feels like a milestone trek and belongs in the weekend bucket.',
    idealSeason: 'July to February',
    travelWindow: '1 day summit push',
    driveTime: '3.5 to 4.5 hours from Mumbai or Pune',
    intro: [
      'The ladder sections, the summit temple, and the long climb give Kalsubai a more goal-driven energy than a relaxed fort wander.',
      'It is best booked as a weekend departure when you can leave early, climb steadily, and still have time to enjoy the summit views rather than rushing back.',
    ],
    quickFacts: [
      { label: 'Base village', value: 'Bari' },
      { label: 'Known for', value: 'Iron ladders and summit temple' },
      { label: 'Trail mood', value: 'Steady altitude gain with reward-at-the-top energy' },
      { label: 'Ideal pace', value: 'Weekend summit target with sunrise potential' },
    ],
    gallery: [
      { src: MAHARASHTRA_MONSOON_IMAGES.trips.kalsubai[1], alt: 'Kalsubai ridge', caption: 'The upper slopes open into clean summit lines with reservoir views on clear days.' },
      { src: MAHARASHTRA_MONSOON_IMAGES.trips.kalsubai[3], alt: 'Kalsubai temple area', caption: 'The summit area mixes pilgrimage energy with trek-celebration energy.' },
    ],
    waterfallIds: ['thoseghar', 'kumbhe'],
  },
  'lohagad-fort-trek': {
    eyebrow: 'Beginner monsoon fort',
    routeFit: 'Best for short weekends and first-timers',
    routeFitDescription:
      'Lohagad is the easiest fort in this mix to finish comfortably in a day, which makes it a strong weekend choice for families and beginners.',
    idealSeason: 'June to February',
    travelWindow: 'Half day to full day',
    driveTime: 'Around 25 minutes from Lonavala',
    intro: [
      'Lohagad is where many trekkers discover that a fort trek can be dramatic without being exhausting. The paved route keeps it approachable even in wet weather.',
      'Because the access is simpler, it also works as a soft-entry weekend plan for mixed groups that want views, gates, and monsoon atmosphere without a punishing climb.',
    ],
    quickFacts: [
      { label: 'Base village', value: 'Lohagadwadi' },
      { label: 'Known for', value: 'Vinchukata ridge and four darwajas' },
      { label: 'Fort mood', value: 'Easy heritage climb with broad monsoon visuals' },
      { label: 'Ideal pace', value: 'Easy weekend outing for mixed fitness groups' },
    ],
    gallery: [
      { src: MAHARASHTRA_MONSOON_IMAGES.trips.lohagad[1], alt: 'Lohagad steps', caption: 'The stone approach is one of the reasons Lohagad remains beginner friendly.' },
      { src: MAHARASHTRA_MONSOON_IMAGES.trips.lohagad[3], alt: 'Visapur and Lohagad landscape', caption: 'The twin-fort zone makes this one of the easiest heritage circuits to enjoy in rain.' },
    ],
    waterfallIds: ['andharban', 'devkund'],
  },
  'rajmachi-fort-night-trek': {
    eyebrow: 'Night trek classic',
    routeFit: 'Best for long weekend nights',
    routeFitDescription:
      'Rajmachi becomes special when the trek itself is the experience. The night approach, sunrise timing, and twin forts make it more of a planned weekend adventure.',
    idealSeason: 'June to February',
    travelWindow: 'Night trek into sunrise',
    driveTime: 'Around 45 minutes from Karjat to base',
    intro: [
      'Rajmachi is less about rushing to a summit and more about the mood change from dark forest to sunrise bastions.',
      'If you want a trek with atmosphere, village culture, and a high-energy overnight format, Rajmachi stays one of the strongest Sahyadri weekend picks.',
    ],
    quickFacts: [
      { label: 'Base village', value: 'Kondivade or Udhewadi side' },
      { label: 'Known for', value: 'Shrivardhan and Manaranjan twin forts' },
      { label: 'Fort mood', value: 'Night approach with sunrise payoff' },
      { label: 'Ideal pace', value: 'Weekend overnight group adventure' },
    ],
    gallery: [
      { src: MAHARASHTRA_MONSOON_IMAGES.trips.rajmachi[1], alt: 'Rajmachi trail', caption: 'The climb is atmospheric even before dawn, especially in cloud-heavy months.' },
      { src: MAHARASHTRA_MONSOON_IMAGES.trips.rajmachi[3], alt: 'Rajmachi fort view', caption: 'The twin-fort geometry is what keeps Rajmachi memorable even after many repeat visits.' },
    ],
    waterfallIds: ['devkund', 'kumbhe'],
  },
  'harihar-fort-trek': {
    eyebrow: 'Vertical stairway fort',
    routeFit: 'Best for sharp weekday challenge treks',
    routeFitDescription:
      'Harihar is compact, photogenic, and intense in a very focused way. It is ideal for trekkers who want a memorable weekday climb without committing to an overnight trip.',
    idealSeason: 'July to January',
    travelWindow: '1 compact day trek',
    driveTime: 'Around 1 hour from Nashik and 2 hours from Igatpuri',
    intro: [
      'Harihar is famous for one reason first: the near-vertical rock-cut staircase. That staircase gives the fort an instantly recognizable identity and a stronger adrenaline edge than its duration suggests.',
      'Because the climb is relatively short but visually dramatic, it fits weekday departures exceptionally well, especially for trekkers who can leave early and return the same evening.',
    ],
    quickFacts: [
      { label: 'Base village', value: 'Nirgudpada' },
      { label: 'Known for', value: 'Rock-cut staircase and triangular massif' },
      { label: 'Fort mood', value: 'Short climb with high visual drama' },
      { label: 'Ideal pace', value: 'Weekday challenge with early start' },
    ],
    gallery: [
      { src: MAHARASHTRA_MONSOON_IMAGES.trips.harihar[1], alt: 'Harihar rock face', caption: 'The fort walls rise abruptly from the massif and make the entire approach feel cinematic.' },
      { src: MAHARASHTRA_MONSOON_IMAGES.trips.harihar[2], alt: 'Harihar stairs', caption: 'The iconic staircase is the defining image of the Harihar experience.' },
      { src: MAHARASHTRA_MONSOON_IMAGES.trips.harihar[3], alt: 'Harihar summit view', caption: 'Once on top, the fort opens into broad Sahyadri lines that feel much larger than the climb length.' },
    ],
    waterfallIds: ['thoseghar', 'kumbhe'],
  },
  'devkund-waterfall-trek': {
    eyebrow: 'Blue pool waterfall route',
    routeFit: 'Best for midweek waterfall escapes',
    routeFitDescription:
      'Devkund is a cleaner weekday choice than a heavy fort circuit. The trail is scenic, the destination is immediate, and the outing works well as a fast reset.',
    idealSeason: 'July to January',
    travelWindow: 'Half day to full day',
    driveTime: 'About 3 hours from Pune or Mumbai',
    intro: [
      'Devkund is one of the waterfall routes people choose when the goal is scenery first and summit effort second. The forest trail stays engaging without feeling technical.',
      'For weekday plans, it works because the experience is compact: trail, stream crossings, waterfall amphitheatre, and return before the day feels overextended.',
    ],
    quickFacts: [
      { label: 'Base village', value: 'Bhira' },
      { label: 'Known for', value: 'Turquoise plunge pool and forest approach' },
      { label: 'Trail mood', value: 'River crossings and monsoon greenery' },
      { label: 'Ideal pace', value: 'Weekday waterfall outing with light trekking' },
    ],
    gallery: [
      { src: MAHARASHTRA_MONSOON_IMAGES.trips.devkund[1], alt: 'Devkund waterfall', caption: 'The pool and rock walls create one of Maharashtra’s most recognizable monsoon frames.' },
      { src: MAHARASHTRA_MONSOON_IMAGES.trips.devkund[2], alt: 'Devkund valley', caption: 'Even before the main drop, the entire trail feels water-shaped and lush.' },
    ],
    waterfallIds: ['devkund', 'kumbhe', 'andharban'],
  },
  'andharban-jungle-trek': {
    eyebrow: 'Forest traverse classic',
    routeFit: 'Best for cloud-heavy weekdays',
    routeFitDescription:
      'Andharban is perfect when the group wants movement, mist, and jungle texture rather than fort exploration. It is one of the strongest weekday monsoon routes.',
    idealSeason: 'June to September',
    travelWindow: 'Full day forest traverse',
    driveTime: 'Around 2.5 hours from Pune',
    intro: [
      'Andharban is less about a single summit and more about sustained atmosphere. The trail stays dark, wet, and green for long stretches, which is exactly why people keep choosing it in monsoon.',
      'It works for weekday plans because you get a full immersive trail experience without needing an overnight fort program or a slow heritage exploration schedule.',
    ],
    quickFacts: [
      { label: 'Start point', value: 'Pimpri near Tamhini' },
      { label: 'Known for', value: 'Dense canopy, valley views, and side waterfalls' },
      { label: 'Trail mood', value: 'Long descending forest traverse' },
      { label: 'Ideal pace', value: 'Weekday monsoon hike for trail lovers' },
    ],
    gallery: [
      { src: MAHARASHTRA_MONSOON_IMAGES.trips.andharban[1], alt: 'Andharban view', caption: 'The valley opens suddenly after long green tunnel sections.' },
      { src: MAHARASHTRA_MONSOON_IMAGES.trips.andharban[2], alt: 'Andharban waterfall', caption: 'Seasonal side cascades are part of what makes the route feel alive in peak rain.' },
    ],
    waterfallIds: ['andharban', 'devkund', 'thoseghar'],
  },
  'thoseghar-waterfalls-trail': {
    eyebrow: 'Scenic waterfall drive-and-walk',
    routeFit: 'Best for relaxed weekdays and monsoon road trips',
    routeFitDescription:
      'Thoseghar is more scenic than strenuous. It is a strong weekday choice for travelers who want monsoon visuals, valley air, and an easier walking profile.',
    idealSeason: 'July to October',
    travelWindow: 'Half day to full day',
    driveTime: '45 minutes from Satara',
    intro: [
      'Thoseghar is the type of location that works for mixed groups. You still get the volume and spectacle of a monsoon waterfall, but without turning the day into a heavy trek.',
      'That makes it especially useful for weekdays, office groups, and travelers who want the monsoon look and feel with less physical load.',
    ],
    quickFacts: [
      { label: 'Base access', value: 'Thoseghar village viewpoint zone' },
      { label: 'Known for', value: 'Series of seasonal drops into a deep valley' },
      { label: 'Trail mood', value: 'Scenic walk with viewpoint stops' },
      { label: 'Ideal pace', value: 'Relaxed weekday monsoon outing' },
    ],
    gallery: [
      { src: MAHARASHTRA_MONSOON_IMAGES.trips.thoseghar[1], alt: 'Thoseghar falls', caption: 'The waterfall system becomes dramatic once the Satara monsoon settles in.' },
      { src: MAHARASHTRA_MONSOON_IMAGES.trips.thoseghar[2], alt: 'Thoseghar viewpoint', caption: 'Wide viewpoints make Thoseghar strong for first-time waterfall travelers.' },
    ],
    waterfallIds: ['thoseghar', 'devkund', 'kumbhe'],
  },
};

export const ROUTE_COLLECTIONS: Record<
  Extract<TripCategory, 'WEEKEND' | 'WEEKDAY'>,
  {
    title: string;
    description: string;
    featuredSlugs: string[];
  }
> = {
  WEEKEND: {
    title: 'Best locations for weekend trips',
    description:
      'These routes justify a full day or an overnight plan because the climb, heritage exploration, or summit payoff needs more than a quick in-and-out schedule.',
    featuredSlugs: [
      'rajgad-fort-trek',
      'harishchandragad-trek',
      'kalsubai-peak-trek',
      'lohagad-fort-trek',
    ],
  },
  WEEKDAY: {
    title: 'Best locations for weekdays trips',
    description:
      'These picks work well when you need fast access, a cleaner one-day return, or a compact monsoon nature break without committing the full weekend.',
    featuredSlugs: [
      'harihar-fort-trek',
      'devkund-waterfall-trek',
      'andharban-jungle-trek',
      'thoseghar-waterfalls-trail',
    ],
  },
};

export function getTripRouteLabel(category: TripCategory) {
  switch (category) {
    case 'WEEKDAY':
      return 'Weekday quick escape';
    case 'WEEKEND':
      return 'Weekend getaway';
    case 'NIGHT_TREK':
      return 'Night trek special';
    default:
      return 'Seasonal adventure';
  }
}

export function buildMapLink(trip: Pick<Trip, 'routeMapUrl' | 'latitude' | 'longitude'>) {
  if (trip.routeMapUrl) return trip.routeMapUrl;
  if (trip.latitude && trip.longitude) {
    return `https://www.google.com/maps/search/?api=1&query=${trip.latitude},${trip.longitude}`;
  }

  return undefined;
}

export function buildMapEmbedUrl(trip: Pick<Trip, 'latitude' | 'longitude'>) {
  if (!trip.latitude || !trip.longitude) return undefined;

  return `https://maps.google.com/maps?q=${trip.latitude},${trip.longitude}&z=13&output=embed`;
}

export function buildFallbackLocationGuide(trip: Trip): LocationGuide {
  return {
    eyebrow: trip.fortName ? 'Trail spotlight' : 'Journey spotlight',
    routeFit: `Best for ${getTripRouteLabel(trip.category).toLowerCase()}`,
    routeFitDescription:
      trip.category === 'WEEKDAY'
        ? 'This route is short enough to work as a same-day break while still giving a strong trail payoff.'
        : 'This route benefits from a slower schedule so you can enjoy the climb, viewpoints, and return properly.',
    idealSeason: 'July to February',
    travelWindow: trip.category === 'WEEKDAY' ? 'Compact one-day outing' : 'Full day outdoor plan',
    driveTime: 'Varies by departure point',
    intro: [
      trip.shortDescription,
      'This location page is driven from the live trip data and uses a fallback guide when a custom editorial guide is not defined yet.',
    ],
    quickFacts: [
      { label: 'Start', value: trip.startLocation },
      { label: 'Finish', value: trip.endLocation },
      { label: 'Duration', value: `${trip.durationHours} hours` },
      { label: 'Elevation gain', value: `${trip.elevationM} m` },
    ],
    gallery: trip.images.slice(1, 3).map((image) => ({
      src: image.url,
      alt: image.altText || trip.title,
      caption: trip.title,
    })),
    waterfallIds: trip.category === 'WEEKDAY' ? ['devkund', 'andharban'] : ['thoseghar', 'kumbhe'],
  };
}
