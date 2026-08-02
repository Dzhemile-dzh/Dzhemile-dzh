const Stripe = require('stripe');

const PRINT_SIZE_PRICES = {
  '40 x 60 cm': 50,
  '60 x 80 cm': 70,
};

/** Flat shipping fees in euro cents (easy to tweak). */
const SHIPPING_FEES = {
  europeEur: 35,
  ukEur: 45,
};

/**
 * Site checkout ships to Bulgaria (free), EU, and UK.
 * United States stays on Saatchi Art - not listed here.
 */
const CHECKOUT_COUNTRIES = [
  'AT',
  'BE',
  'BG',
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
  'GB',
];

function toCents(priceEur) {
  const value = Number(priceEur);
  if (!Number.isFinite(value) || value <= 0) {
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

function checkoutCopy(locale, productType, sizeLabel) {
  const isPrint = productType === 'print';
  const sizeText = sizeLabel || '40 x 60 cm';
  const europeFee = SHIPPING_FEES.europeEur;
  const ukFee = SHIPPING_FEES.ukEur;

  if (locale === 'bg') {
    return {
      speedy: 'България - Speedy (Спиди) до адрес - безплатно',
      econt: 'България - Econt (Еконт) до адрес - безплатно',
      europe: `Европа (извън България) - проследяема доставка - ${europeFee} €`,
      uk: `Обединено кралство - проследяема доставка - ${ukFee} €`,
      phone: 'Телефон за доставка',
      note: isPrint
        ? `Лимитиран принт, серия от 10. Fine-art хартия, ${sizeText}, с мой подпис. България: безплатно (Speedy/Econt). Европа: ${europeFee} €. UK: ${ukFee} € (вносен ДДС/мита в UK са за сметка на купувача). САЩ: през Saatchi Art. Изберете опция, която съответства на държавата на адреса.`
        : `Оригинална маслена картина от мен. България: безплатно (Speedy/Econt). Европа: ${europeFee} €. UK: ${ukFee} € (вносен ДДС/мита в UK са за сметка на купувача). САЩ: през Saatchi Art. Изберете опция, която съответства на държавата на адреса.`,
      productNameSuffix: isPrint ? ' | Лимитирана серия от 10' : '',
      sizeMeta: isPrint ? sizeText : 'original',
    };
  }

  return {
    speedy: 'Bulgaria - Speedy to your address - free',
    econt: 'Bulgaria - Econt to your address - free',
    europe: `Europe (outside Bulgaria) - tracked shipping - €${europeFee}`,
    uk: `United Kingdom - tracked shipping - €${ukFee}`,
    phone: 'Phone number for delivery',
    note: isPrint
      ? `Limited edition of 10. Fine-art paper, ${sizeText}, hand-signed by me. Bulgaria: free (Speedy/Econt). Europe: €${europeFee}. UK: €${ukFee} (UK import VAT/duties are the buyer's responsibility). US: via Saatchi Art. Choose the option that matches your shipping country.`
      : `Original oil painting by me. Bulgaria: free (Speedy/Econt). Europe: €${europeFee}. UK: €${ukFee} (UK import VAT/duties are the buyer's responsibility). US: via Saatchi Art. Choose the option that matches your shipping country.`,
    productNameSuffix: isPrint ? ' | Limited edition of 10' : '',
    sizeMeta: isPrint ? sizeText : 'original',
  };
}

/**
 * Creates a Stripe Checkout Session with product image + shipping choices.
 */
async function createCheckoutSession({
  secret,
  productType,
  productId,
  title,
  priceEur,
  imagePath,
  sizeLabel,
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
  if (unitAmount === null) {
    const error = new Error('Invalid price');
    error.statusCode = 400;
    throw error;
  }

  const stripe = new Stripe(secret);
  const lang = locale === 'bg' ? 'bg' : 'en';
  const labels = checkoutCopy(lang, productType, resolvedSize);
  const imageUrl = resolveProductImage(imagePath);
  const images = imageUrl ? [imageUrl] : [];
  const productName = `${title}${labels.productNameSuffix}`;
  const europeCents = toCents(SHIPPING_FEES.europeEur);
  const ukCents = toCents(SHIPPING_FEES.ukEur);

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
      allowed_countries: CHECKOUT_COUNTRIES,
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
    shipping_options: [
      {
        shipping_rate_data: {
          type: 'fixed_amount',
          fixed_amount: { amount: 0, currency: 'eur' },
          display_name: labels.speedy,
          delivery_estimate: {
            minimum: { unit: 'business_day', value: 1 },
            maximum: { unit: 'business_day', value: 3 },
          },
          metadata: { courier: 'speedy', region: 'bg' },
        },
      },
      {
        shipping_rate_data: {
          type: 'fixed_amount',
          fixed_amount: { amount: 0, currency: 'eur' },
          display_name: labels.econt,
          delivery_estimate: {
            minimum: { unit: 'business_day', value: 1 },
            maximum: { unit: 'business_day', value: 3 },
          },
          metadata: { courier: 'econt', region: 'bg' },
        },
      },
      {
        shipping_rate_data: {
          type: 'fixed_amount',
          fixed_amount: { amount: europeCents, currency: 'eur' },
          display_name: labels.europe,
          delivery_estimate: {
            minimum: { unit: 'business_day', value: 5 },
            maximum: { unit: 'business_day', value: 12 },
          },
          metadata: { courier: 'tracked_eu', region: 'eu' },
        },
      },
      {
        shipping_rate_data: {
          type: 'fixed_amount',
          fixed_amount: { amount: ukCents, currency: 'eur' },
          display_name: labels.uk,
          delivery_estimate: {
            minimum: { unit: 'business_day', value: 5 },
            maximum: { unit: 'business_day', value: 14 },
          },
          metadata: { courier: 'tracked_uk', region: 'uk' },
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
            },
          },
        },
      },
    ],
    metadata: {
      productType,
      productId,
      size: labels.sizeMeta,
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
  CHECKOUT_COUNTRIES,
};
