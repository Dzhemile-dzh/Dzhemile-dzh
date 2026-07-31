/**
 * Local Stripe Checkout API for Create React App (`npm start`).
 * Production uses /api/* on Vercel instead.
 */
const http = require('http');
const fs = require('fs');
const path = require('path');
const { createCheckoutSession } = require('../api/_lib/buildCheckoutSession');
const { getCheckoutSessionSummary } = require('../api/_lib/getCheckoutSession');

const PORT = Number(process.env.STRIPE_DEV_API_PORT) || 4242;
const ROOT = path.join(__dirname, '..');

function loadEnvFile() {
  const envPath = path.join(ROOT, '.env');
  if (!fs.existsSync(envPath)) {
    return;
  }

  const lines = fs.readFileSync(envPath, 'utf8').split(/\r?\n/);
  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed.length === 0 || trimmed.startsWith('#')) {
      continue;
    }
    const eq = trimmed.indexOf('=');
    if (eq <= 0) {
      continue;
    }
    const key = trimmed.slice(0, eq).trim();
    let value = trimmed.slice(eq + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    if (typeof process.env[key] !== 'string' || process.env[key].length === 0) {
      process.env[key] = value;
    }
  }
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    req.on('data', (chunk) => chunks.push(chunk));
    req.on('end', () => {
      const raw = Buffer.concat(chunks).toString('utf8');
      if (raw.length === 0) {
        resolve({});
        return;
      }
      try {
        resolve(JSON.parse(raw));
      } catch (error) {
        reject(error);
      }
    });
    req.on('error', reject);
  });
}

function sendJson(res, status, payload) {
  const body = JSON.stringify(payload);
  res.writeHead(status, {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  });
  res.end(body);
}

loadEnvFile();

const ALLOWED_TYPES = new Set(['print', 'original']);

const server = http.createServer(async (req, res) => {
  if (req.method === 'OPTIONS') {
    sendJson(res, 204, {});
    return;
  }

  const url = new URL(req.url || '/', `http://${req.headers.host || 'localhost'}`);
  const isCheckout =
    url.pathname === '/api/create-checkout-session' ||
    url.pathname === '/create-checkout-session';
  const isGetSession =
    url.pathname === '/api/get-checkout-session' ||
    url.pathname === '/get-checkout-session';

  if (isGetSession) {
    if (req.method !== 'GET') {
      sendJson(res, 405, { error: 'Method not allowed' });
      return;
    }

    const secret = process.env.STRIPE_SECRET_KEY;
    if (typeof secret !== 'string' || secret.length === 0) {
      sendJson(res, 503, { error: 'STRIPE_SECRET_KEY is missing in .env' });
      return;
    }

    const sessionId = url.searchParams.get('session_id') || '';

    try {
      const summary = await getCheckoutSessionSummary({ secret, sessionId });
      sendJson(res, 200, summary);
    } catch (error) {
      console.error('Get checkout session error:', error.message || error);
      const status = error.statusCode === 400 ? 400 : 500;
      sendJson(res, status, {
        error:
          status === 400
            ? error.message
            : 'Unable to load order details. Please contact the artist.',
      });
    }
    return;
  }

  if (!isCheckout) {
    sendJson(res, 404, { error: 'Not found' });
    return;
  }

  if (req.method !== 'POST') {
    sendJson(res, 405, { error: 'Method not allowed' });
    return;
  }

  const secret = process.env.STRIPE_SECRET_KEY;
  if (typeof secret !== 'string' || secret.length === 0) {
    sendJson(res, 503, { error: 'STRIPE_SECRET_KEY is missing in .env' });
    return;
  }

  let body;
  try {
    body = await readBody(req);
  } catch {
    sendJson(res, 400, { error: 'Invalid JSON body' });
    return;
  }

  const {
    productType,
    productId,
    title,
    priceEur,
    imagePath,
    sizeLabel,
    locale,
    successUrl,
    cancelUrl,
  } = body;

  if (!ALLOWED_TYPES.has(productType)) {
    sendJson(res, 400, { error: 'Invalid product type' });
    return;
  }

  if (typeof productId !== 'string' || productId.length === 0) {
    sendJson(res, 400, { error: 'Missing product id' });
    return;
  }

  if (typeof title !== 'string' || title.length === 0) {
    sendJson(res, 400, { error: 'Missing product title' });
    return;
  }

  if (typeof successUrl !== 'string' || typeof cancelUrl !== 'string') {
    sendJson(res, 400, { error: 'Missing return URLs' });
    return;
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
      locale,
      successUrl,
      cancelUrl,
    });

    sendJson(res, 200, { url: session.url, id: session.id });
  } catch (error) {
    console.error('Stripe checkout error:', error.message || error);
    const status = error.statusCode === 400 ? 400 : 500;
    sendJson(res, status, {
      error:
        status === 400
          ? error.message
          : 'Unable to start checkout. Check STRIPE_SECRET_KEY and try again.',
    });
  }
});

server.listen(PORT, () => {
  const hasSecret =
    typeof process.env.STRIPE_SECRET_KEY === 'string' &&
    process.env.STRIPE_SECRET_KEY.length > 0;
  console.log(`Stripe local API on http://localhost:${PORT}`);
  console.log(`STRIPE_SECRET_KEY loaded: ${hasSecret ? 'yes' : 'no'}`);
});
