import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const commonsFile = (file: string) =>
  `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(file)}`;

const futureTourDate = (day: number, monthIndex: number) => {
  const date = new Date(2026, monthIndex, day, 6, 0, 0, 0);
  while (date <= new Date()) {
    date.setFullYear(date.getFullYear() + 1);
  }
  return date;
};

const toursData = [
  {
    title: 'Mahabaleshwar',
    slug: 'mahabaleshwar',
    typeLabel: 'HILL_STATION' as const,
    departureDate: futureTourDate(13, 3),
    groupSize: '10 to 15 people',
    distance: '120 km from Pune',
    driveTime: '3 hrs drive',
    price: 1199,
    comparePrice: 1499,
    summary:
      "Maharashtra's most beloved hill station with cool air, strawberry farms, iconic viewpoints, and the calm of Venna Lake.",
    highlights: ['Venna Lake', "Arthur's Seat", 'Mapro Garden', 'Lingmala Falls'],
    bestSeason: 'Oct-Feb',
    tip: 'Start by 5 AM to beat traffic on NH48.',
    imageUrl: commonsFile('Mahabaleshwar (22).jpg'),
    isActive: true,
  },
  {
    title: 'Alibaug',
    slug: 'alibaug',
    typeLabel: 'BEACH' as const,
    departureDate: futureTourDate(12, 3),
    groupSize: '12 to 18 people',
    distance: '140 km from Pune',
    driveTime: '2.5 hrs drive',
    price: 999,
    comparePrice: 1299,
    summary:
      'A coastal reset with black-sand beach views, Kolaba Fort on the horizon, seafood stops, water sports, and an easy Konkan vibe.',
    highlights: ['Alibaug Beach', 'Kolaba Fort', 'Kashid Beach', 'Rewas Ferry'],
    bestSeason: 'Oct-Mar',
    tip: 'Take the Mumbai-Mandwa ferry route if going via Mumbai for a scenic start.',
    imageUrl: commonsFile('Beach in alibaug.jpg'),
    isActive: true,
  },
  {
    title: 'Lonavala & Khandala',
    slug: 'lonavala-khandala',
    typeLabel: 'HILL_STATION' as const,
    departureDate: futureTourDate(14, 3),
    groupSize: '20 to 25 people',
    distance: '65 km from Pune',
    driveTime: '1.5 hrs drive',
    price: 899,
    comparePrice: 1199,
    summary:
      'The closest hill escape from Pune, known for chikki, misty dams, waterfall viewpoints, old caves, and classic Sahyadri ridge scenes.',
    highlights: ['Bhushi Dam', "Tiger's Leap", 'Karla Caves', 'Rajmachi Fort'],
    bestSeason: 'Jul-Sep',
    tip: 'Weekdays are smoother because weekends are extremely crowded.',
    imageUrl: commonsFile('Bhushi Dam - Lonavala.jpg'),
    isActive: true,
  },
  {
    title: 'Bhimashankar',
    slug: 'bhimashankar',
    typeLabel: 'SPIRITUAL' as const,
    departureDate: futureTourDate(16, 3),
    groupSize: '10 to 12 people',
    distance: '110 km from Pune',
    driveTime: '3 hrs drive',
    price: 799,
    comparePrice: 999,
    summary:
      'One of the 12 Jyotirlingas set inside the Sahyadri hills, with dense forest, misty trails, temple energy, and wildlife sanctuary views.',
    highlights: ['Bhimashankar Temple', 'Gupt Bhimashankar Trek', 'Shidi Ghat', 'Wildlife Sanctuary'],
    bestSeason: 'Oct-Feb',
    tip: 'Reach before 7 AM for darshan without long queues.',
    imageUrl: commonsFile('Temple front view3.jpg'),
    isActive: true,
  },
  {
    title: 'Tamhini Ghat',
    slug: 'tamhini-ghat',
    typeLabel: 'NATURE' as const,
    departureDate: futureTourDate(18, 3),
    groupSize: '15 to 20 people',
    distance: '60 km from Pune',
    driveTime: '1.5 hrs drive',
    price: 699,
    comparePrice: 899,
    summary:
      'A lush Western Ghats road trip with misty valleys, waterfall pull-offs, Mulshi views, and one of the easiest scenic loops near Pune.',
    highlights: ['Mulshi Dam', 'Devkund Waterfall', 'Pingalwadi', 'Kolad Side Trip'],
    bestSeason: 'Jul-Oct',
    tip: 'Take the Tamhini-Mulshi-Lavasa loop and carry food for cleaner pacing.',
    imageUrl: commonsFile('View from Tamhini Ghat (51294774394).jpg'),
    isActive: true,
  },
  {
    title: 'Matheran',
    slug: 'matheran',
    typeLabel: 'HILL_STATION' as const,
    departureDate: futureTourDate(20, 3),
    groupSize: '10 to 15 people',
    distance: '120 km from Pune',
    driveTime: '2.5 hrs drive',
    price: 1149,
    comparePrice: 1399,
    summary:
      "India's only automobile-free hill station, where toy train nostalgia, red-soil trails, horseback paths, and panoramic viewpoints set the pace.",
    highlights: ['Panorama Point', 'Echo Point', 'Charlotte Lake', 'Toy Train'],
    bestSeason: 'Nov-Feb',
    tip: 'Book toy train tickets online in advance and carry cash inside.',
    imageUrl: commonsFile('View from Panorama Point, Matheran (51877071706).jpg'),
    isActive: true,
  },
  {
    title: 'Kolad River Rafting',
    slug: 'kolad-river-rafting',
    typeLabel: 'ADVENTURE' as const,
    departureDate: futureTourDate(22, 3),
    groupSize: '18 to 24 people',
    distance: '120 km from Pune',
    driveTime: '2.5 hrs drive',
    price: 1299,
    comparePrice: 1599,
    summary:
      "Maharashtra's best white-water rafting escape, with Grade 2-3 rapids on the Kundalika, lush Sahyadri scenery, and group-friendly adventure energy.",
    highlights: ['Kundalika River Rafting', 'Bhira Dam', 'Devkund Waterfall', 'Camping Sites'],
    bestSeason: 'Jun-Jan',
    tip: 'Book rafting slots in advance on weekends.',
    imageUrl: commonsFile('Kundalika River view point.jpg'),
    isActive: true,
  },
  {
    title: 'Sinhagad Fort',
    slug: 'sinhagad-fort',
    typeLabel: 'ADVENTURE' as const,
    departureDate: futureTourDate(24, 3),
    groupSize: '20 to 30 people',
    distance: '30 km from Pune',
    driveTime: '45 mins drive',
    price: 599,
    comparePrice: 799,
    summary:
      "Pune's fastest fort escape, pairing a short climb, Maratha history, sweeping Deccan views, and the classic pitla bhakri reward at the top.",
    highlights: ['Fort Trek', 'Kondanpur Dam View', 'Pune City Viewpoint', 'Fort Ruins'],
    bestSeason: 'Jul-Feb',
    tip: 'Start at 5:30 AM for sunrise from the fort top.',
    imageUrl: commonsFile('Inside Sinhagad Fort.jpg'),
    isActive: true,
  },
  {
    title: 'Wai (Dakshin Kashi)',
    slug: 'wai',
    typeLabel: 'SPIRITUAL' as const,
    departureDate: futureTourDate(26, 3),
    groupSize: '12 to 16 people',
    distance: '95 km from Pune',
    driveTime: '2 hrs drive',
    price: 849,
    comparePrice: 1049,
    summary:
      'An old temple town on the Krishna river, known as Dakshin Kashi, with serene ghats, Peshwa-era shrines, and a cinematic heritage feel.',
    highlights: ['Mahaganpati Temple', 'Krishna River Ghat', 'Kashi Vishweshwar Temple', 'Panchgani Nearby'],
    bestSeason: 'Oct-Mar',
    tip: 'Club it with Panchgani and do not miss Wai specials like mattha and bhakri.',
    imageUrl: commonsFile('Ghats of Wai town 01.jpg'),
    isActive: true,
  },
  {
    title: 'Igatpuri',
    slug: 'igatpuri',
    typeLabel: 'NATURE' as const,
    departureDate: futureTourDate(28, 3),
    groupSize: '14 to 18 people',
    distance: '145 km from Pune',
    driveTime: '2.5 hrs drive',
    price: 949,
    comparePrice: 1199,
    summary:
      'A greener, quieter alternative to the usual hill rush, with waterfalls, Kasara Ghat drama, Vipassana calm, and lush Western Ghats scenery.',
    highlights: ['Igatpuri Waterfall', 'Bhavali Dam', 'Camelot Adventure Resort', 'Kasara Ghat'],
    bestSeason: 'Jul-Oct',
    tip: 'Take the train from Pune for a scenic ghat ride.',
    imageUrl: commonsFile('Igatpuri waterfall.jpg'),
    isActive: true,
  },
  {
    title: 'Aare Ware Beach',
    slug: 'aare-ware-beach',
    typeLabel: 'BEACH' as const,
    departureDate: futureTourDate(30, 3),
    groupSize: '10 to 14 people',
    distance: '170 km from Pune',
    driveTime: '4.5 hrs drive',
    price: 1249,
    comparePrice: 1549,
    summary:
      'A quieter Konkan shoreline with cliffside road views, blue-green water, fewer crowds, and that long scenic-coast feeling all the way in.',
    highlights: ['Sea View Points', 'Coastal Drive', 'Konkan Food Stops', 'Sunset Stretch'],
    bestSeason: 'Oct-Mar',
    tip: 'Start before sunrise from Pune so you reach the coast with enough slow time by the water.',
    imageUrl: commonsFile('Aare Ware Beach.jpg'),
    isActive: true,
  },
  {
    title: 'Kashid Beach',
    slug: 'kashid-beach',
    typeLabel: 'BEACH' as const,
    departureDate: futureTourDate(2, 4),
    groupSize: '16 to 22 people',
    distance: '170 km from Pune',
    driveTime: '4 hrs drive',
    price: 1099,
    comparePrice: 1399,
    summary:
      'One of the most popular white-sand beaches on this side of the coast, ideal for easy group outings, sea views, and a polished beach-day vibe.',
    highlights: ['Kashid Beach', 'Phansad Detour', 'Sea-facing Cafes', 'Sunset Walk'],
    bestSeason: 'Oct-Mar',
    tip: 'Pair it with an early breakfast stop and return before late evening traffic builds.',
    imageUrl: commonsFile('Kashid beach.jpg'),
    isActive: true,
  },
];

async function main() {
  for (const tour of toursData) {
    await prisma.tour.upsert({
      where: { slug: tour.slug },
      create: tour,
      update: tour,
    });
    console.log(`Upserted tour: ${tour.title}`);
  }
}

main()
  .catch((error) => {
    console.error('Tour upsert failed:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
