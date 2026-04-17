import type { Tour } from '@alpha-trekkers/shared';

const tourImageOverrides: Record<string, { src: string; alt: string }> = {
  bhimashankar: {
    src: 'https://commons.wikimedia.org/wiki/Special:FilePath/Temple%20front%20view3.jpg',
    alt: 'Bhimashankar Temple',
  },
};

export function getTourDisplayImage(tour: Pick<Tour, 'slug' | 'imageUrl' | 'title'>) {
  return tourImageOverrides[tour.slug] ?? {
    src: tour.imageUrl,
    alt: tour.title,
  };
}
