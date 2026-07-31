const Stripe = require('stripe');

const PRINT_SIZE_PRICES = {
  '40 x 60 cm': 50,
  '60 x 80 cm': 70,
};

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

  if (locale === 'bg') {
    return {
      speedy: 'Speedy (Спиди) до адрес - безплатна доставка',
      econt: 'Econt (Еконт) до адрес - безплатна доставка',
      phone: 'Телефон за доставка',
      note: isPrint
        ? `Лимитиран принт, серия от 10. Хартия Twirdo, ${sizeText}, с мой подпис. Доставката е безплатна и само в България (1-3 работни дни). Адресът и телефонът са задължителни.`
        : 'Оригинална маслена картина от мен. Доставката е безплатна и само в България (1-3 работни дни). Адресът и телефонът са задължителни. Изберете куриер Speedy или Econt.',
      productNameSuffix: isPrint ? ' | Лимитирана серия от 10' : '',
      sizeMeta: isPrint ? sizeText : 'original',
    };
  }

  return {
    speedy: 'Speedy to your address - free shipping',
    econt: 'Econt to your address - free shipping',
    phone: 'Phone number for delivery',
    note: isPrint
      ? `Limited edition of 10. Twirdo paper, ${sizeText}, hand-signed by me. Free shipping within Bulgaria only (1-3 business days). Address and phone are required.`
      : 'Original oil painting by me. Free shipping within Bulgaria only (1-3 business days). Address and phone are required. Choose Speedy or Econt delivery.',
    productNameSuffix: isPrint ? ' | Limited edition of 10' : '',
    sizeMeta: isPrint ? sizeText : 'original',
  };
}

/**
 * Creates a Stripe Checkout Session with product image + Speedy/Econt shipping choice.
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
      // Site checkout ships only within Bulgaria. International buyers use Saatchi Art.
      allowed_countries: ['BG'],
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
          metadata: { courier: 'speedy' },
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
          metadata: { courier: 'econt' },
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
};
