const { addSubscriber } = require('./_lib/subscribersStore');

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

  const email =
    req.body && typeof req.body.email === 'string' ? req.body.email : '';

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
    const status = error.statusCode === 400 ? 400 : 500;
    return res.status(status).json({
      error:
        status === 400
          ? 'Invalid email'
          : 'Unable to save subscription. Please try again.',
    });
  }
};
