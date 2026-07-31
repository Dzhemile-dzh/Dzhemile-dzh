const { getCheckoutSessionSummary } = require('./_lib/getCheckoutSession');

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const secret = process.env.STRIPE_SECRET_KEY;
  if (typeof secret !== 'string' || secret.length === 0) {
    return res.status(503).json({
      error: 'Payments are not configured yet. Add STRIPE_SECRET_KEY in Vercel.',
    });
  }

  const sessionId =
    typeof req.query.session_id === 'string' ? req.query.session_id : '';

  try {
    const summary = await getCheckoutSessionSummary({ secret, sessionId });
    return res.status(200).json(summary);
  } catch (error) {
    console.error('Get checkout session error:', error);
    const status = error.statusCode === 400 ? 400 : 500;
    return res.status(status).json({
      error:
        status === 400
          ? error.message
          : 'Unable to load order details. Please contact the artist.',
    });
  }
};
