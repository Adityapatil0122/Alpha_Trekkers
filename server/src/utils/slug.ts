import { prisma } from '../config/database.js';

export async function generateSlug(title: string): Promise<string> {
  let slug = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');

  const existing = await prisma.trip.findUnique({ where: { slug } });
  if (!existing) return slug;

  let counter = 2;
  while (true) {
    const candidate = `${slug}-${counter}`;
    const exists = await prisma.trip.findUnique({ where: { slug: candidate } });
    if (!exists) return candidate;
    counter++;
  }
}
