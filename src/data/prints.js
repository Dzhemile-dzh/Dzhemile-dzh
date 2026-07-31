/**
 * Fine-art prints catalog.
 * One limited print edition per painting: 10 copies, Twirdo paper, signed.
 * Sizes: 40 x 60 cm (50 EUR, default) and 60 x 80 cm (70 EUR).
 */
import { translations } from './translations';

export const PRINT_SIZES = [
  { id: '40x60', label: '40 x 60 cm', priceEur: 50 },
  { id: '60x80', label: '60 x 80 cm', priceEur: 70 },
];

const PRINT_DEFAULT_SIZE = PRINT_SIZES[0];
const PRINT_PAPER = 'Twirdo';
const PRINT_EDITION_SIZE = 10;
const PRINT_EDITION = 'Limited edition of 10';

export const getPrintSizeById = (sizeId) => {
  if (typeof sizeId !== 'string' || sizeId.length === 0) {
    return PRINT_DEFAULT_SIZE;
  }
  return PRINT_SIZES.find((size) => size.id === sizeId) ?? PRINT_DEFAULT_SIZE;
};

export const getPrintSizeByLabel = (label) => {
  if (typeof label !== 'string' || label.length === 0) {
    return PRINT_DEFAULT_SIZE;
  }
  return PRINT_SIZES.find((size) => size.label === label) ?? PRINT_DEFAULT_SIZE;
};

const buildPrintsFromPaintings = () => {
  const en = translations.en;
  if (!en || typeof en !== 'object') {
    return [];
  }

  const galleries = [en.gallery, en.gallery2023, en.gallery2024, en.gallery2025, en.gallery2026];
  const seen = new Set();
  const result = [];

  for (const gallery of galleries) {
    if (!gallery || !Array.isArray(gallery.paintings)) {
      continue;
    }

    for (const painting of gallery.paintings) {
      if (typeof painting.link !== 'string' || painting.link.length === 0) {
        continue;
      }
      if (seen.has(painting.link)) {
        continue;
      }
      seen.add(painting.link);

      const [year, paintingSlug] = painting.link.split('/');
      if (!year || !paintingSlug) {
        continue;
      }
      if (typeof painting.image !== 'string' || painting.image.length === 0) {
        continue;
      }

      result.push({
        slug: `${paintingSlug}-print`,
        paintingSlug,
        year,
        image: painting.image,
        paintingTitle: painting.title,
        priceEur: PRINT_DEFAULT_SIZE.priceEur,
        edition: PRINT_EDITION,
        editionSize: PRINT_EDITION_SIZE,
        paper: PRINT_PAPER,
        sizes: PRINT_SIZES,
        defaultSize: PRINT_DEFAULT_SIZE.label,
        defaultSizeId: PRINT_DEFAULT_SIZE.id,
        inStock: true,
        paymentLink: null,
      });
    }
  }

  return result.sort((a, b) => {
    const yearDiff = Number(b.year) - Number(a.year);
    if (yearDiff !== 0) {
      return yearDiff;
    }
    return a.paintingSlug.localeCompare(b.paintingSlug);
  });
};

export const prints = buildPrintsFromPaintings();

export const getPrintBySlug = (slug) => {
  if (typeof slug !== 'string' || slug.length === 0) {
    return null;
  }
  return prints.find((item) => item.slug === slug) ?? null;
};

export const getPrintForPainting = (year, paintingSlug) => {
  if (typeof year !== 'string' || typeof paintingSlug !== 'string') {
    return null;
  }
  return (
    prints.find(
      (item) => item.year === year && item.paintingSlug === paintingSlug
    ) ?? null
  );
};

export const getPrintDisplayTitle = (print, t) => {
  if (!print) {
    return '';
  }

  const headingKey = `${print.paintingSlug}_heading`;
  const heading = t(headingKey);
  if (typeof heading === 'string' && heading !== headingKey) {
    return heading;
  }

  if (typeof print.paintingTitle === 'string' && print.paintingTitle.length > 0) {
    if (print.paintingTitle.includes('_heading')) {
      const fromTitleKey = t(print.paintingTitle);
      if (fromTitleKey !== print.paintingTitle) {
        return fromTitleKey;
      }
    }
    return print.paintingTitle;
  }

  return print.paintingSlug;
};

export const PRINT_SPECS = {
  priceEur: PRINT_DEFAULT_SIZE.priceEur,
  size: PRINT_DEFAULT_SIZE.label,
  sizes: PRINT_SIZES,
  paper: PRINT_PAPER,
  edition: PRINT_EDITION,
  editionSize: PRINT_EDITION_SIZE,
};
