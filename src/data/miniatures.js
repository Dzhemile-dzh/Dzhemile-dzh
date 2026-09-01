export const MINIATURE_PRICE_EUR = 90;
export const MINIATURE_SIZE = '20 x 20 cm';

export const miniatures = [1, 2, 3, 4, 5, 6, 7, 8, 9].map((day) => ({
  id: String(day),
  slug: `miniature-${day}`,
  image: `/images/miniatures/day-${day}.jpg`,
  priceEur: MINIATURE_PRICE_EUR,
  dimensions: MINIATURE_SIZE,
}));

export function getMiniatureBySlug(slug) {
  if (typeof slug !== 'string' || slug.length === 0) {
    return null;
  }
  return miniatures.find((item) => item.slug === slug) ?? null;
}
