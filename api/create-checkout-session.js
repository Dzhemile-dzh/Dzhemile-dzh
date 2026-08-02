const { createCheckoutSession } = require('./_lib/buildCheckoutSession');

const ALLOWED_TYPES = new Set(['print', 'original']);

function readJsonBody(req) {
  if (req.body && typeof req.body === 'object') {
    return req.body;
  }
  return {};
}

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const secret = process.env.STRIPE_SECRET_KEY;
  if (typeof secret !== 'string' || secret.length === 0) {
    return res.status(503).json({
      error:
        'Payments are not configured yet. Add STRIPE_SECRET_KEY in Vercel environment variables.',
    });
  }

  const body = readJsonBody(req);
  const {
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
  } = body;

  if (!ALLOWED_TYPES.has(productType)) {
    return res.status(400).json({ error: 'Invalid product type' });
  }

  if (typeof productId !== 'string' || productId.length === 0) {
    return res.status(400).json({ error: 'Missing product id' });
  }

  if (typeof title !== 'string' || title.length === 0) {
    return res.status(400).json({ error: 'Missing product title' });
  }

  if (typeof successUrl !== 'string' || typeof cancelUrl !== 'string') {
    return res.status(400).json({ error: 'Missing return URLs' });
  }

  try {
    const session = await createCheckoutSession({
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
    });

    return res.status(200).json({ url: session.url, id: session.id });
  } catch (error) {
    console.error('Stripe checkout error:', error);
    const status = error.statusCode === 400 ? 400 : 500;
    return res.status(status).json({
      error:
        status === 400
          ? error.message
          : 'Unable to start checkout. Please try again or contact the artist.',
    });
  }
};
