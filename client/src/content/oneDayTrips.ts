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

export interface OneDayTripFact {
  label: string;
  value: string;
}

export interface OneDayTripPlanStop {
  title: string;
  detail: string;
}

export interface OneDayTripNearbyPick {
  name: string;
  description: string;
}

export interface OneDayTripGuide {
  intro: [string, string];
  quickFacts: [OneDayTripFact, OneDayTripFact, OneDayTripFact, OneDayTripFact];
  dayPlan: [OneDayTripPlanStop, OneDayTripPlanStop, OneDayTripPlanStop];
  nearbyPicks: [OneDayTripNearbyPick, OneDayTripNearbyPick];
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
    imageUrl: commonsFile('Temple front view3.jpg'),
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

type OneDayTripEditorialSeed = {
  intro: [string, string];
  routeStyle: string;
  bestFor: string;
  foodNote: string;
  nearbyPicks: [OneDayTripNearbyPick, OneDayTripNearbyPick];
};

const ONE_DAY_TRIP_EDITORIAL: Record<string, OneDayTripEditorialSeed> = {
  'mahabaleshwar': {
    intro: [
      'Mahabaleshwar works best as a slow scenic plateau circuit instead of a rushed checklist stop. The strength of the day is the mix of cool weather, easy movement between viewpoints, and familiar classics that still feel rewarding in person.',
      "Because the town spreads across multiple ridgelines, the route stays fuller than the current page suggests. You can shape the day around lake time, viewpoint time, food stops, and one or two strong detours without turning it into an overnight plan.",
    ],
    routeStyle: 'Viewpoint-led hill station circuit',
    bestFor: 'Families, couples, and first-time one-day travelers',
    foodNote: 'Strawberry produce, corn patties, and classic Mapro stopovers',
    nearbyPicks: [
      {
        name: 'Pratapgad Fort',
        description: 'A strong add-on when you want one heritage stop with valley views after the main hill-station circuit.',
      },
      {
        name: 'Panchgani Table Land',
        description: 'Pairs naturally with Mahabaleshwar when the group wants one extra scenic stop without changing the full-day format.',
      },
    ],
  },
  'alibaug': {
    intro: [
      'Alibaug is more than a quick beach stop. The route works because the day can mix open shoreline time, fort views, ferry-linked access, and a calmer Konkan rhythm than the usual city-side rush.',
      'For a one-day outing, the best version is a clean coastal loop with one main beach block, one fort-facing stop, and a lunch window that leans into local seafood instead of trying to cover too much shoreline.',
    ],
    routeStyle: 'Coastal drive with beach-and-fort pauses',
    bestFor: 'Small groups, easy weekend plans, and relaxed beach pacing',
    foodNote: 'Seafood lunches, coconut-heavy Konkan plates, and short cafe stops',
    nearbyPicks: [
      {
        name: 'Murud-Janjira side extension',
        description: 'A longer add-on for groups willing to push the road time in exchange for a stronger fort-and-sea finish.',
      },
      {
        name: 'Mandwa ferry approach',
        description: 'Useful when the Mumbai-side entry is part of the experience and you want the day to start with water views.',
      },
    ],
  },
  'lonavala-khandala': {
    intro: [
      'Lonavala and Khandala stay popular because they solve the one-day brief well: short drive, multiple viewpoint choices, and enough variety to fit both laid-back travelers and mixed groups.',
      'The day becomes stronger when you treat it as a ridge-and-waterfall circuit rather than just a highway hill stop. Caves, dams, valley edges, and fort views all sit close enough to keep the pace efficient.',
    ],
    routeStyle: 'Compact Sahyadri ridge and viewpoint circuit',
    bestFor: 'Mixed groups, weekday getaways, and first-timers near Pune',
    foodNote: 'Chikki stops, tea points, and highway-friendly breakfast breaks',
    nearbyPicks: [
      {
        name: 'Duke’s Nose belt',
        description: 'Adds a stronger ridge-view feel when the group wants a slightly more outdoors-focused version of Lonavala.',
      },
      {
        name: 'Pawna backwater side trip',
        description: 'A good detour when the weather is clear and the group prefers open water views over crowded market stops.',
      },
    ],
  },
  'bhimashankar': {
    intro: [
      'Bhimashankar is not only a temple stop. The route has a stronger full-day shape because darshan, forest atmosphere, and short walking sections can sit together without feeling forced.',
      'That makes it one of the better spiritual one-day plans from Pune: the group gets a clear anchor point, but the day still carries mountain air, sanctuary views, and a sense of movement rather than only queue time.',
    ],
    routeStyle: 'Temple-led forest circuit',
    bestFor: 'Spiritual travelers, smaller groups, and clear-weather visits',
    foodNote: 'Simple temple-town meals and tea stops near the shrine approach',
    nearbyPicks: [
      {
        name: 'Hanuman Lake viewpoint',
        description: 'Useful when you want to open the day out with one extra forest-side visual stop beyond the temple zone.',
      },
      {
        name: 'Gupt Bhimashankar section',
        description: 'A stronger add-on for trekkers who want the spiritual route to feel more like a nature-led outing.',
      },
    ],
  },
  'tamhini-ghat': {
    intro: [
      'Tamhini Ghat is best approached as a moving scenic route, not a single stop. The strength of the day is the sequence of valley openings, waterfall pull-offs, and Mulshi-side road sections that keep the landscape changing.',
      'It fills out well as a one-day nature escape because the physical effort is modest but the visual reward stays high, especially when the group wants monsoon atmosphere without committing to a hard trek.',
    ],
    routeStyle: 'Scenic ghat drive with waterfall and valley stops',
    bestFor: 'Monsoon drives, lighter nature days, and camera-friendly groups',
    foodNote: 'Roadside corn, tea stops, and food carried from Pune for cleaner pacing',
    nearbyPicks: [
      {
        name: 'Mulshi backwater edge',
        description: 'A strong pairing when you want calmer water views before entering the greener ghat stretch.',
      },
      {
        name: 'Plus Valley side region',
        description: 'Better as a visual reference stop or future plan for stronger hikers rather than a same-day full add-on.',
      },
    ],
  },
  'matheran': {
    intro: [
      'Matheran has a very different rhythm from the other one-day tours because the destination itself slows the day down. Once inside, the no-car format changes the pace into walking, viewpoints, toy train nostalgia, and long scenic pauses.',
      'That slower structure is exactly what the current page is missing. A Matheran day can cover lake time, forest-edge points, horseback stretches, and market pockets without ever feeling empty if the route is planned around movement between the classic viewpoints.',
    ],
    routeStyle: 'Automobile-free hill station walking circuit',
    bestFor: 'Leisure-focused groups, couples, and viewpoint-led day plans',
    foodNote: 'Market snacks, chikki, and slow tea breaks between viewpoint walks',
    nearbyPicks: [
      {
        name: 'Louisa Point belt',
        description: 'One of the best viewpoint extensions when the weather is clear and the group wants stronger cliff-edge views.',
      },
      {
        name: 'Garbett Plateau side approach',
        description: 'A more outdoors-heavy pairing for groups that want the Matheran day to carry a trekking edge.',
      },
    ],
  },
  'kolad-river-rafting': {
    intro: [
      'Kolad works because the day has a built-in structure. Unlike a hill station circuit, the rafting slot creates a clean center point around which breakfast, reporting, river time, and a slower lunch block can all be arranged.',
      'That makes it one of the easiest adventure-focused one-day products to understand and sell. The route is active enough to feel memorable, but still controlled enough for mixed-skill groups and corporate-style outings.',
    ],
    routeStyle: 'Activity-led river adventure day',
    bestFor: 'Friends, beginner rafting groups, and team outings',
    foodNote: 'Camp-style meals, simple riverside lunch plans, and quick tea stops',
    nearbyPicks: [
      {
        name: 'Sutarwadi camp stretch',
        description: 'Useful for groups considering a future overnight upgrade after trying the one-day rafting format first.',
      },
      {
        name: 'Devkund side region',
        description: 'A natural next-step plan when travelers want to pair Kolad with a waterfall day on another date.',
      },
    ],
  },
  'sinhagad-fort': {
    intro: [
      'Sinhagad is the most accessible fort escape in this lineup, but it still carries enough history and reward to work as more than a quick hill climb. The day stays full because the approach is short and the fort top gives multiple short walking segments once you arrive.',
      'That makes it especially strong for travelers who want a fort experience without committing to a bigger Sahyadri trek. Food, views, breeze, and heritage all come quickly, which is exactly why the route remains a repeat pick.',
    ],
    routeStyle: 'Short heritage fort climb',
    bestFor: 'Beginners, family groups, and fast fort outings from Pune',
    foodNote: 'Pitla-bhakri stalls, curd, and simple fort-top local food',
    nearbyPicks: [
      {
        name: 'Khadakwasla backwater stop',
        description: 'A practical add-on for sunrise groups that want a softer scenic stop on the return.',
      },
      {
        name: 'Panshet side drive',
        description: 'Useful when the group wants to stretch the outing into a longer scenic road loop after the fort visit.',
      },
    ],
  },
  'wai': {
    intro: [
      'Wai works as a one-day trip because it mixes temple-town calm with a strong old-Maharashtra atmosphere that most road-trip destinations do not have. The ghats, shrines, and riverfront sequence keep the day visual without needing a hard activity block.',
      'It also pairs well with nearby plateau and hill-station geography, which means the trip can stay spiritual and slow or become a wider heritage-plus-scenic circuit depending on the group.',
    ],
    routeStyle: 'Temple-town heritage circuit',
    bestFor: 'Spiritual day trips, heritage lovers, and slower-paced groups',
    foodNote: 'Traditional Maharashtrian meals, mattha, and highway breakfast stops',
    nearbyPicks: [
      {
        name: 'Menavali Ghat',
        description: 'An excellent heritage-side extension with strong riverside character and film-location familiarity.',
      },
      {
        name: 'Panchgani link',
        description: 'Useful when the group wants the second half of the day to shift from temple-town calm into plateau viewpoints.',
      },
    ],
  },
  'igatpuri': {
    intro: [
      'Igatpuri is a quieter nature-led option compared with the more commercial hill stations. The route works best when the day is built around ghat views, reservoir air, and a less crowded mountain atmosphere.',
      'Because the destination feels more spread out and less checklist-driven, it benefits from better supporting copy on the detail page. The appeal here is the calm, not just one main stop.',
    ],
    routeStyle: 'Cool-weather ghat and reservoir circuit',
    bestFor: 'Nature-first groups and travelers avoiding the usual hill crowds',
    foodNote: 'Highway breakfast, simple dam-side snack stops, and tea-point pacing',
    nearbyPicks: [
      {
        name: 'Tringalwadi side region',
        description: 'A stronger add-on for travelers who want to convert the day into a light fort-and-nature mix.',
      },
      {
        name: 'Camel Valley viewpoint belt',
        description: 'A useful visual stop in monsoon or post-monsoon months when the ghat faces are active and green.',
      },
    ],
  },
  'aare-ware-beach': {
    intro: [
      'Aare Ware is less about crowds and more about the long Konkan drive paying off properly once the sea opens up. The route works when the group wants a cleaner shoreline feel and is willing to trade shorter road time for a better coastal setting.',
      'That makes the day fuller than the current page suggests: the coastal road itself becomes part of the experience, not just the final beach stop.',
    ],
    routeStyle: 'Long coastal scenic drive',
    bestFor: 'Scenic-road travelers and groups wanting a quieter beach finish',
    foodNote: 'Konkan seafood, kokum drinks, and highway breakfast timing',
    nearbyPicks: [
      {
        name: 'Ganpatipule side coast',
        description: 'A stronger extension when the group wants to turn the day into a broader Ratnagiri shoreline circuit.',
      },
      {
        name: 'Pawas village detour',
        description: 'Useful for travelers who prefer a mixed coast-and-culture route rather than only beach time.',
      },
    ],
  },
  'kashid-beach': {
    intro: [
      'Kashid is one of the easiest beach one-day plans to understand because the day has a simple, polished rhythm: drive in, beach block, food stop, and clean return. That simplicity is exactly what makes it useful for groups.',
      'It still needs a little more depth on the detail page, though, because the shoreline can also be paired with nearby nature and fort-side detours without losing the one-day format.',
    ],
    routeStyle: 'Polished beach-day circuit',
    bestFor: 'Group outings, easy beach plans, and low-complexity road trips',
    foodNote: 'Beach shacks, fish thalis, and short sea-facing cafe stops',
    nearbyPicks: [
      {
        name: 'Phansad Wildlife Sanctuary edge',
        description: 'A good add-on when the group wants one nature break away from the main beach crowd.',
      },
      {
        name: 'Murud coast extension',
        description: 'Useful when the day needs a longer coastal finish beyond the central Kashid stretch.',
      },
    ],
  },
};

function getTravelPaceLabel(typeLabel: OneDayTripType) {
  switch (typeLabel) {
    case 'Hill Station':
      return 'Relaxed scenic pacing with multiple stops';
    case 'Beach':
      return 'Unhurried coastal pacing with meal and shoreline blocks';
    case 'Spiritual':
      return 'Early-start route with temple timing in mind';
    case 'Nature':
      return 'Flexible scenic pacing with viewpoint and waterfall pauses';
    case 'Adventure':
      return 'Activity-first schedule with tighter timing windows';
    default:
      return 'Comfortable one-day route pacing';
  }
}

export function buildOneDayTripGuide(trip: OneDayTrip): OneDayTripGuide {
  const editorial = ONE_DAY_TRIP_EDITORIAL[trip.slug];

  if (!editorial) {
    return {
      intro: [
        trip.summary,
        `${trip.title} works well as a one-day route because the key stops stay achievable inside a single travel block from Pune while still leaving space for food, photos, and a clean return.`,
      ],
      quickFacts: [
        { label: 'Trip style', value: trip.typeLabel },
        { label: 'Works best for', value: 'Small groups and same-day travel plans' },
        { label: 'Travel pace', value: getTravelPaceLabel(trip.typeLabel) },
        { label: 'Signature stop', value: trip.highlights[0] },
      ],
      dayPlan: [
        {
          title: 'Leave early',
          detail: `Use the ${trip.driveTimeLabel} approach to reach ${trip.highlights[0]} before the busiest part of the day.`,
        },
        {
          title: 'Cover the main route',
          detail: `Keep the middle of the day for ${trip.highlights[0]}, ${trip.highlights[1]}, and a slower stop around ${trip.highlights[2]}.`,
        },
        {
          title: 'Return cleanly',
          detail: `Wrap up around ${trip.highlights[3]} or a local food halt, then start the return before late traffic builds.`,
        },
      ],
      nearbyPicks: [
        {
          name: trip.highlights[1],
          description: `A natural supporting stop that helps ${trip.title} feel fuller without turning the day into an overnight plan.`,
        },
        {
          name: trip.highlights[2],
          description: `Useful when the group wants one extra pause between the main location and the drive back.`,
        },
      ],
    };
  }

  return {
    intro: editorial.intro,
    quickFacts: [
      { label: 'Trip style', value: editorial.routeStyle },
      { label: 'Works best for', value: editorial.bestFor },
      { label: 'Travel pace', value: getTravelPaceLabel(trip.typeLabel) },
      { label: 'Food / local note', value: editorial.foodNote },
    ],
    dayPlan: [
      {
        title: 'Start the day early',
        detail: `Use the ${trip.driveTimeLabel} approach to reach ${trip.highlights[0]} before the route gets busy and the best light disappears.`,
      },
      {
        title: 'Keep the middle focused',
        detail: `Build the main route around ${trip.highlights[0]}, ${trip.highlights[1]}, and a slower stop near ${trip.highlights[2]} so the day feels complete without rushing.`,
      },
      {
        title: 'Close with a slower finish',
        detail: `Use ${trip.highlights[3]} or a food stop as the final block, then begin the return with enough margin to avoid the heaviest traffic window.`,
      },
    ],
    nearbyPicks: editorial.nearbyPicks,
  };
}

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
