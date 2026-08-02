const Stripe = require('stripe');

const PRINT_SIZE_PRICES = {
  '40 x 60 cm': 50,
  '60 x 80 cm': 70,
};

/** Flat shipping fees in euro (easy to tweak). */
const SHIPPING_FEES = {
  bgEur: 0,
  europeEur: 35,
  ukEur: 45,
};

const EU_COUNTRIES = [
  'AT',
  'BE',
  'HR',
  'CY',
  'CZ',
  'DK',
  'EE',
  'FI',
  'FR',
  'DE',
  'GR',
  'HU',
  'IE',
  'IT',
  'LV',
  'LT',
  'LU',
  'MT',
  'NL',
  'PL',
  'PT',
  'RO',
  'SK',
  'SI',
  'ES',
  'SE',
];

const SHIPPING_REGIONS = {
  bg: {
    countries: ['BG'],
    feeEur: SHIPPING_FEES.bgEur,
    courier: 'bg_free',
    minDays: 1,
    maxDays: 3,
  },
  eu: {
    countries: EU_COUNTRIES,
    feeEur: SHIPPING_FEES.europeEur,
    courier: 'tracked_eu',
    minDays: 5,
    maxDays: 12,
  },
  uk: {
    countries: ['GB'],
    feeEur: SHIPPING_FEES.ukEur,
    courier: 'tracked_uk',
    minDays: 5,
    maxDays: 14,
  },
};

function toCents(priceEur) {
  const value = Number(priceEur);
  if (!Number.isFinite(value) || value < 0) {
    return null;
  }
  return Math.round(value * 100);
}

function resolveProductImage(imagePath) {
  if (typeof imagePath !== 'string' || imagePath.length === 0) {
    return null;
  }

  // Stripe must fetch a public HTTPS URL (localhost images do not show on Checkout).
  const base = (
    process.env.SITE_URL ||
    process.env.PUBLIC_SITE_URL ||
    'https://www.doarti.com'
  ).replace(/\/$/, '');

  const path = imagePath.startsWith('/') ? imagePath : `/${imagePath}`;
  return `${base}${path}`;
}

function resolvePrintCheckout(sizeLabel, priceEur) {
  const label =
    typeof sizeLabel === 'string' && sizeLabel in PRINT_SIZE_PRICES
      ? sizeLabel
      : '40 x 60 cm';
  const expectedPrice = PRINT_SIZE_PRICES[label];
  const requested = Number(priceEur);

  if (requested !== expectedPrice) {
    const error = new Error('Invalid print price for selected size');
    error.statusCode = 400;
    throw error;
  }

  return { sizeLabel: label, priceEur: expectedPrice };
}

function resolveShippingRegion(shippingRegion) {
  const regionKey =
    typeof shippingRegion === 'string' && shippingRegion in SHIPPING_REGIONS
      ? shippingRegion
      : 'bg';
  return { key: regionKey, ...SHIPPING_REGIONS[regionKey] };
}

function checkoutCopy(locale, productType, sizeLabel, regionKey) {
  const isPrint = productType === 'print';
  const sizeText = sizeLabel || '40 x 60 cm';
  const europeFee = SHIPPING_FEES.europeEur;
  const ukFee = SHIPPING_FEES.ukEur;

  if (locale === 'bg') {
    const shippingLabel =
      regionKey === 'uk'
        ? `Проследяема доставка до Обединеното кралство - ${ukFee} €`
        : regionKey === 'eu'
          ? `Проследяема доставка в Европа - ${europeFee} €`
          : 'Безплатна доставка в България';

    const note =
      regionKey === 'uk'
        ? isPrint
          ? `Лимитиран принт, серия от 10. Fine-art хартия, ${sizeText}, с мой подпис. Доставката до UK е ${ukFee} €. Вносен ДДС/мита в UK са за сметка на купувача.`
          : `Оригинална маслена картина от мен. Доставката до UK е ${ukFee} €. Вносен ДДС/мита в UK са за сметка на купувача.`
        : regionKey === 'eu'
          ? isPrint
            ? `Лимитиран принт, серия от 10. Fine-art хартия, ${sizeText}, с мой подпис. Доставката в Европа е ${europeFee} €.`
            : `Оригинална маслена картина от мен. Доставката в Европа е ${europeFee} €.`
          : isPrint
            ? `Лимитиран принт, серия от 10. Fine-art хартия, ${sizeText}, с мой подпис. Безплатна доставка в България (1-3 работни дни).`
            : 'Оригинална маслена картина от мен. Безплатна доставка в България (1-3 работни дни).';

    return {
      shippingLabel,
      phone: 'Телефон за доставка',
      note,
      productNameSuffix: isPrint ? ' | Лимитирана серия от 10' : '',
      sizeMeta: isPrint ? sizeText : 'original',
    };
  }

  const shippingLabel =
    regionKey === 'uk'
      ? `Tracked shipping to the United Kingdom - €${ukFee}`
      : regionKey === 'eu'
        ? `Tracked shipping within Europe - €${europeFee}`
        : 'Free shipping within Bulgaria';

  const note =
    regionKey === 'uk'
      ? isPrint
        ? `Limited edition of 10. Fine-art paper, ${sizeText}, hand-signed by me. UK shipping is €${ukFee}. UK import VAT/duties are the buyer's responsibility.`
        : `Original oil painting by me. UK shipping is €${ukFee}. UK import VAT/duties are the buyer's responsibility.`
      : regionKey === 'eu'
        ? isPrint
          ? `Limited edition of 10. Fine-art paper, ${sizeText}, hand-signed by me. Europe shipping is €${europeFee}.`
          : `Original oil painting by me. Europe shipping is €${europeFee}.`
        : isPrint
          ? `Limited edition of 10. Fine-art paper, ${sizeText}, hand-signed by me. Free shipping within Bulgaria (1-3 business days).`
          : 'Original oil painting by me. Free shipping within Bulgaria (1-3 business days).';

  return {
    shippingLabel,
    phone: 'Phone number for delivery',
    note,
    productNameSuffix: isPrint ? ' | Limited edition of 10' : '',
    sizeMeta: isPrint ? sizeText : 'original',
  };
}

/**
 * Creates a Stripe Checkout Session with one automatic shipping rate
 * for the selected destination region (no courier choice on Checkout).
 */
async function createCheckoutSession({
  secret,
  productType,
  productId,
  title,
  priceEur,
  imagePath,
  sizeLabel,
  shippingRegion,
  locale,
  successUrl,
  cancelUrl,
}) {
  let resolvedPrice = priceEur;
  let resolvedSize = sizeLabel;

  if (productType === 'print') {
    const printCheckout = resolvePrintCheckout(sizeLabel, priceEur);
    resolvedPrice = printCheckout.priceEur;
    resolvedSize = printCheckout.sizeLabel;
  }

  const unitAmount = toCents(resolvedPrice);
  if (unitAmount === null || unitAmount <= 0) {
    const error = new Error('Invalid price');
    error.statusCode = 400;
    throw error;
  }

  const region = resolveShippingRegion(shippingRegion);
  const shippingCents = toCents(region.feeEur);
  if (shippingCents === null) {
    const error = new Error('Invalid shipping region');
    error.statusCode = 400;
    throw error;
  }

  const stripe = new Stripe(secret);
  const lang = locale === 'bg' ? 'bg' : 'en';
  const labels = checkoutCopy(lang, productType, resolvedSize, region.key);
  const imageUrl = resolveProductImage(imagePath);
  const images = imageUrl ? [imageUrl] : [];
  const productName = `${title}${labels.productNameSuffix}`;

  const session = await stripe.checkout.sessions.create({
    mode: 'payment',
    locale: lang,
    success_url: successUrl,
    cancel_url: cancelUrl,
    billing_address_collection: 'required',
    phone_number_collection: { enabled: true },
    name_collection: {
      individual: {
        enabled: true,
        optional: false,
      },
    },
    shipping_address_collection: {
      allowed_countries: region.countries,
    },
    custom_fields: [
      {
        key: 'delivery_phone',
        label: {
          type: 'custom',
          custom: labels.phone,
        },
        type: 'text',
        optional: false,
      },
    ],
    // Single rate only - Stripe applies it automatically (no method choice).
    shipping_options: [
      {
        shipping_rate_data: {
          type: 'fixed_amount',
          fixed_amount: { amount: shippingCents, currency: 'eur' },
          display_name: labels.shippingLabel,
          delivery_estimate: {
            minimum: { unit: 'business_day', value: region.minDays },
            maximum: { unit: 'business_day', value: region.maxDays },
          },
          metadata: {
            courier: region.courier,
            region: region.key,
          },
        },
      },
    ],
    custom_text: {
      shipping_address: {
        message: labels.note,
      },
    },
    line_items: [
      {
        quantity: 1,
        price_data: {
          currency: 'eur',
          unit_amount: unitAmount,
          product_data: {
            name: productName,
            description: labels.note,
            images,
            metadata: {
              productType,
              productId,
              size: labels.sizeMeta,
              shippingRegion: region.key,
            },
          },
        },
      },
    ],
    metadata: {
      productType,
      productId,
      size: labels.sizeMeta,
      shippingRegion: region.key,
    },
  });

  return session;
}

module.exports = {
  createCheckoutSession,
  resolveProductImage,
  toCents,
  PRINT_SIZE_PRICES,
  SHIPPING_FEES,
  SHIPPING_REGIONS,
};
