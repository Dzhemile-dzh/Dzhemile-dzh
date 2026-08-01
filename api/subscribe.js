const { addSubscriber } = require('./_lib/subscribersStore');

function readJsonBody(req) {
  if (!req.body) {
    return {};
  }
  if (typeof req.body === 'string') {
    try {
      return JSON.parse(req.body);
    } catch {
      return {};
    }
  }
  if (Buffer.isBuffer(req.body)) {
    try {
      return JSON.parse(req.body.toString('utf8'));
    } catch {
      return {};
    }
  }
  if (typeof req.body === 'object') {
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

  const body = readJsonBody(req);
  const email = typeof body.email === 'string' ? body.email : '';

  try {
    const result = await addSubscriber(email);

    if (result.alreadySubscribed) {
      return res.status(409).json({
        error: 'already_subscribed',
        email: result.email,
      });
    }

    return res.status(200).json({
      ok: true,
      email: result.email,
    });
  } catch (error) {
    console.error('Subscribe error:', error);
    const status =
      error.statusCode === 400 ? 400 : error.statusCode === 503 ? 503 : 500;
    return res.status(status).json({
      error:
        status === 400
          ? 'Invalid email'
          : status === 503
            ? 'Subscription storage is temporarily unavailable. Please try again later.'
            : 'Unable to save subscription. Please try again.',
    });
  }
};
