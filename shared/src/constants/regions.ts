export const REGIONS = [
  'Sahyadri',
  'Western Ghats',
  'Konkan',
  'Pune District',
  'Nashik District',
  'Raigad District',
  'Satara District',
  'Kolhapur District',
] as const;

export type Region = (typeof REGIONS)[number];
