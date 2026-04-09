const commonsFile = (file: string) =>
  `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(file)}`;

export type OneDayTripType =
  | 'Hill Station'
  | 'Beach'
  | 'Spiritual'
  | 'Nature'
  | 'Adventure';

export interface OneDayTrip {
  slug: string;
  title: string;
  typeLabel: OneDayTripType;
  dateLabel: string;
  groupSizeLabel: string;
  distanceLabel: string;
  driveTimeLabel: string;
  priceLabel: string;
  comparePriceLabel: string;
  summary: string;
  highlights: [string, string, string, string];
  bestSeason: string;
  tip: string;
  imageUrl: string;
}

export const ONE_DAY_TRIP_FILTERS: ['All', ...OneDayTripType[]] = [
  'All',
  'Hill Station',
  'Beach',
  'Spiritual',
  'Nature',
  'Adventure',
];

export const oneDayTrips: OneDayTrip[] = [
  {
    slug: 'mahabaleshwar',
    title: 'Mahabaleshwar',
    typeLabel: 'Hill Station',
    dateLabel: '10/4/2026',
    groupSizeLabel: '10 to 15 people',
    distanceLabel: '120 km from Pune',
    driveTimeLabel: '3 hrs drive',
    priceLabel: 'INR 1,199',
    comparePriceLabel: 'INR 1,499',
    summary:
      "Maharashtra's most beloved hill station with cool air, strawberry farms, iconic viewpoints like Arthur's Seat and Elephant's Head, and the calm of Venna Lake.",
    highlights: ['Venna Lake', "Arthur's Seat", 'Mapro Garden', 'Lingmala Falls'],
    bestSeason: 'Oct-Feb (avoid monsoon crowds)',
    tip: 'Start by 5 AM to beat traffic on NH48.',
    imageUrl: commonsFile('Mahabaleshwar (22).jpg'),
  },
  {
    slug: 'alibaug',
    title: 'Alibaug',
    typeLabel: 'Beach',
    dateLabel: '12/4/2026',
    groupSizeLabel: '12 to 18 people',
    distanceLabel: '140 km from Pune',
    driveTimeLabel: '2.5 hrs drive',
    priceLabel: 'INR 999',
    comparePriceLabel: 'INR 1,299',
    summary:
      'A coastal reset with black-sand beach views, Kolaba Fort on the horizon, seafood stops, water sports, and an easy Konkan vibe.',
    highlights: ['Alibaug Beach', 'Kolaba Fort', 'Kashid Beach', 'Rewas Ferry'],
    bestSeason: 'Oct-Mar',
    tip: 'Take the Mumbai-Mandwa ferry route if going via Mumbai for a scenic start.',
    imageUrl: commonsFile('Beach in alibaug.jpg'),
  },
  {
    slug: 'lonavala-khandala',
    title: 'Lonavala & Khandala',
    typeLabel: 'Hill Station',
    dateLabel: '14/4/2026',
    groupSizeLabel: '20 to 25 people',
    distanceLabel: '65 km from Pune',
    driveTimeLabel: '1.5 hrs drive',
    priceLabel: 'INR 899',
    comparePriceLabel: 'INR 1,199',
    summary:
      'The closest hill escape from Pune, known for chikki, misty dams, waterfall viewpoints, old caves, and classic Sahyadri ridge scenes.',
    highlights: ['Bhushi Dam', "Tiger's Leap", 'Karla Caves', 'Rajmachi Fort'],
    bestSeason: 'Jul-Sep (monsoon magic)',
    tip: 'Weekdays only - weekends are extremely crowded.',
    imageUrl: commonsFile('Bhushi Dam - Lonavala.jpg'),
  },
  {
    slug: 'bhimashankar',
    title: 'Bhimashankar',
    typeLabel: 'Spiritual',
    dateLabel: '16/4/2026',
    groupSizeLabel: '10 to 12 people',
    distanceLabel: '110 km from Pune',
    driveTimeLabel: '3 hrs drive',
    priceLabel: 'INR 799',
    comparePriceLabel: 'INR 999',
    summary:
      'One of the 12 Jyotirlingas set inside the Sahyadri hills, with dense forest, misty trails, temple energy, and wildlife sanctuary views.',
    highlights: [
      'Bhimashankar Temple',
      'Gupt Bhimashankar Trek',
      'Shidi Ghat',
      'Wildlife Sanctuary',
    ],
    bestSeason: 'Oct-Feb (clear paths)',
    tip: 'Reach before 7 AM for darshan without long queues and combine it with the Gupt Bhimashankar trail.',
    imageUrl: commonsFile('Bhimashankr.jpg'),
  },
  {
    slug: 'tamhini-ghat',
    title: 'Tamhini Ghat',
    typeLabel: 'Nature',
    dateLabel: '18/4/2026',
    groupSizeLabel: '15 to 20 people',
    distanceLabel: '60 km from Pune',
    driveTimeLabel: '1.5 hrs drive',
    priceLabel: 'INR 699',
    comparePriceLabel: 'INR 899',
    summary:
      'A lush Western Ghats road trip with misty valleys, waterfall pull-offs, Mulshi views, and one of the easiest scenic loops near Pune.',
    highlights: ['Mulshi Dam', 'Devkund Waterfall', 'Pingalwadi', 'Kolad Side Trip'],
    bestSeason: 'Jul-Oct (waterfall season)',
    tip: 'Take the Tamhini-Mulshi-Lavasa loop and carry your own food because dhabas are limited midway.',
    imageUrl: commonsFile('View from Tamhini Ghat (51294774394).jpg'),
  },
  {
    slug: 'matheran',
    title: 'Matheran',
    typeLabel: 'Hill Station',
    dateLabel: '20/4/2026',
    groupSizeLabel: '10 to 15 people',
    distanceLabel: '120 km from Pune',
    driveTimeLabel: '2.5 hrs drive',
    priceLabel: 'INR 1,149',
    comparePriceLabel: 'INR 1,399',
    summary:
      "India's only automobile-free hill station, where toy train nostalgia, red-soil trails, horseback paths, and panoramic viewpoints set the pace.",
    highlights: ['Panorama Point', 'Echo Point', 'Charlotte Lake', 'Toy Train'],
    bestSeason: 'Nov-Feb (clear skies)',
    tip: 'Book toy train tickets online in advance and carry cash because ATMs are limited inside.',
    imageUrl: commonsFile('View from Panorama Point, Matheran (51877071706).jpg'),
  },
  {
    slug: 'kolad-river-rafting',
    title: 'Kolad River Rafting',
    typeLabel: 'Adventure',
    dateLabel: '22/4/2026',
    groupSizeLabel: '18 to 24 people',
    distanceLabel: '120 km from Pune',
    driveTimeLabel: '2.5 hrs drive',
    priceLabel: 'INR 1,299',
    comparePriceLabel: 'INR 1,599',
    summary:
      "Maharashtra's best white-water rafting escape, with Grade 2-3 rapids on the Kundalika, lush Sahyadri scenery, and easy group-friendly adventure energy.",
    highlights: ['Kundalika River Rafting', 'Bhira Dam', 'Devkund Waterfall', 'Camping Sites'],
    bestSeason: 'Jun-Jan',
    tip: 'Book rafting slots in advance on weekends and combine it with the nearby Devkund waterfall trek.',
    imageUrl: commonsFile('Kundalika River view point.jpg'),
  },
  {
    slug: 'sinhagad-fort',
    title: 'Sinhagad Fort',
    typeLabel: 'Adventure',
    dateLabel: '24/4/2026',
    groupSizeLabel: '20 to 30 people',
    distanceLabel: '30 km from Pune',
    driveTimeLabel: '45 mins drive',
    priceLabel: 'INR 599',
    comparePriceLabel: 'INR 799',
    summary:
      "Pune's fastest fort escape, pairing a short climb, Maratha history, sweeping Deccan views, and the classic pitla bhakri reward at the top.",
    highlights: ['Fort Trek', 'Kondanpur Dam View', 'Pune City Viewpoint', 'Fort Ruins'],
    bestSeason: 'Jul-Feb',
    tip: 'Start at 5:30 AM for sunrise from the fort top and the calmest climb window.',
    imageUrl: commonsFile('Inside Sinhagad Fort.jpg'),
  },
  {
    slug: 'wai',
    title: 'Wai (Dakshin Kashi)',
    typeLabel: 'Spiritual',
    dateLabel: '26/4/2026',
    groupSizeLabel: '12 to 16 people',
    distanceLabel: '95 km from Pune',
    driveTimeLabel: '2 hrs drive',
    priceLabel: 'INR 849',
    comparePriceLabel: 'INR 1,049',
    summary:
      'An old temple town on the Krishna river, known as Dakshin Kashi, with serene ghats, Peshwa-era shrines, and a cinematic heritage feel.',
    highlights: [
      'Mahaganpati Temple',
      'Krishna River Ghat',
      'Kashi Vishweshwar Temple',
      'Panchgani Nearby',
    ],
    bestSeason: 'Oct-Mar',
    tip: 'Club it with Panchgani, just 18 km further, and do not miss Wai specials like mattha and bhakri.',
    imageUrl: commonsFile('Ghats of Wai town 01.jpg'),
  },
  {
    slug: 'igatpuri',
    title: 'Igatpuri',
    typeLabel: 'Nature',
    dateLabel: '28/4/2026',
    groupSizeLabel: '14 to 18 people',
    distanceLabel: '145 km from Pune',
    driveTimeLabel: '2.5 hrs drive',
    priceLabel: 'INR 949',
    comparePriceLabel: 'INR 1,199',
    summary:
      'A greener, quieter alternative to the usual hill rush, with waterfalls, Kasara Ghat drama, Vipassana calm, and lush Western Ghats scenery.',
    highlights: ['Igatpuri Waterfall', 'Bhavali Dam', 'Camelot Adventure Resort', 'Kasara Ghat'],
    bestSeason: 'Jul-Oct',
    tip: 'Take the train from Pune for a scenic ghat ride and a less crowded alternative to Lonavala.',
    imageUrl: commonsFile('Igatpuri waterfall.jpg'),
  },
  {
    slug: 'aare-ware-beach',
    title: 'Aare Ware Beach',
    typeLabel: 'Beach',
    dateLabel: '30/4/2026',
    groupSizeLabel: '10 to 14 people',
    distanceLabel: '170 km from Pune',
    driveTimeLabel: '4.5 hrs drive',
    priceLabel: 'INR 1,249',
    comparePriceLabel: 'INR 1,549',
    summary:
      'A quieter Konkan shoreline with cliffside road views, blue-green water, fewer crowds, and that long scenic-coast feeling all the way in.',
    highlights: ['Sea View Points', 'Coastal Drive', 'Konkan Food Stops', 'Sunset Stretch'],
    bestSeason: 'Oct-Mar',
    tip: 'Start before sunrise from Pune so you reach the coast with enough slow time by the water.',
    imageUrl: commonsFile('Aare Ware Beach.jpg'),
  },
  {
    slug: 'kashid-beach',
    title: 'Kashid Beach',
    typeLabel: 'Beach',
    dateLabel: '2/5/2026',
    groupSizeLabel: '16 to 22 people',
    distanceLabel: '170 km from Pune',
    driveTimeLabel: '4 hrs drive',
    priceLabel: 'INR 1,099',
    comparePriceLabel: 'INR 1,399',
    summary:
      'One of the most popular white-sand beaches on this side of the coast, ideal for easy group outings, sea views, and a polished beach-day vibe.',
    highlights: ['Kashid Beach', 'Phansad Detour', 'Sea-facing Cafes', 'Sunset Walk'],
    bestSeason: 'Oct-Mar',
    tip: 'Pair it with an early breakfast stop on the route and keep the return before late evening traffic builds.',
    imageUrl: commonsFile('Kashid beach.jpg'),
  },
];

export function findOneDayTripBySlug(slug?: string | null) {
  if (!slug) return undefined;
  return oneDayTrips.find((trip) => trip.slug === slug);
}

export function buildOneDayTripInquirySubject(trip: OneDayTrip) {
  return `Book Now: ${trip.title}`;
}

export function buildOneDayTripInquiryMessage(trip: OneDayTrip) {
  return `Hi Alpha Trekkers, I want to book the ${trip.title} one-day trip. Please share availability, pickup options, and final pricing.`;
}
