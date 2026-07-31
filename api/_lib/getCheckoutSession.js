const Stripe = require('stripe');

function formatAmount(amountTotal, currency) {
  if (typeof amountTotal !== 'number' || !Number.isFinite(amountTotal)) {
    return '';
  }
  const value = (amountTotal / 100).toFixed(2);
  const code = typeof currency === 'string' ? currency.toUpperCase() : 'EUR';
  return `${value} ${code}`;
}

function getShippingDetails(session) {
  if (session.shipping_details && typeof session.shipping_details === 'object') {
    return session.shipping_details;
  }
  if (
    session.collected_information &&
    session.collected_information.shipping_details &&
    typeof session.collected_information.shipping_details === 'object'
  ) {
    return session.collected_information.shipping_details;
  }
  return null;
}

function formatAddress(shippingDetails) {
  if (!shippingDetails || typeof shippingDetails !== 'object') {
    return '';
  }
  const address = shippingDetails.address;
  if (!address || typeof address !== 'object') {
    return typeof shippingDetails.name === 'string' ? shippingDetails.name : '';
  }

  const parts = [
    shippingDetails.name,
    address.line1,
    address.line2,
    [address.postal_code, address.city].filter(Boolean).join(' '),
    address.state,
    address.country,
  ].filter((part) => typeof part === 'string' && part.trim().length > 0);

  return parts.join(', ');
}

function readCustomField(session, key) {
  if (!Array.isArray(session.custom_fields)) {
    return '';
  }
  const field = session.custom_fields.find((item) => item && item.key === key);
  if (!field || !field.text || typeof field.text.value !== 'string') {
    return '';
  }
  return field.text.value;
}

function readCourier(session) {
  const details = session.shipping_cost && session.shipping_cost.shipping_rate;
  if (details && typeof details === 'object') {
    if (typeof details.display_name === 'string' && details.display_name.length > 0) {
      return details.display_name;
    }
    if (details.metadata && typeof details.metadata.courier === 'string') {
      return details.metadata.courier;
    }
  }
  return '';
}

/**
 * Loads a paid Checkout Session summary for the success page / thank-you email.
 */
async function getCheckoutSessionSummary({ secret, sessionId }) {
  if (typeof sessionId !== 'string' || !sessionId.startsWith('cs_')) {
    const error = new Error('Invalid session id');
    error.statusCode = 400;
    throw error;
  }

  const stripe = new Stripe(secret);
  const session = await stripe.checkout.sessions.retrieve(sessionId, {
    expand: ['line_items', 'shipping_cost.shipping_rate'],
  });

  if (session.payment_status !== 'paid' && session.status !== 'complete') {
    const error = new Error('Payment is not completed');
    error.statusCode = 400;
    throw error;
  }

  const lineItem =
    session.line_items &&
    Array.isArray(session.line_items.data) &&
    session.line_items.data.length > 0
      ? session.line_items.data[0]
      : null;

  const productTitle =
    (lineItem && lineItem.description) ||
    (session.metadata && session.metadata.productId) ||
    'Doarti order';

  const shippingDetails = getShippingDetails(session);
  const customPhone = readCustomField(session, 'delivery_phone');
  const customerPhone =
    session.customer_details && typeof session.customer_details.phone === 'string'
      ? session.customer_details.phone
      : '';

  return {
    orderId: session.id,
    paymentStatus: session.payment_status,
    customerEmail:
      session.customer_details && typeof session.customer_details.email === 'string'
        ? session.customer_details.email
        : session.customer_email || '',
    customerName:
      session.customer_details && typeof session.customer_details.name === 'string'
        ? session.customer_details.name
        : '',
    productTitle,
    productType:
      session.metadata && typeof session.metadata.productType === 'string'
        ? session.metadata.productType
        : '',
    size:
      session.metadata && typeof session.metadata.size === 'string'
        ? session.metadata.size
        : '',
    amountFormatted: formatAmount(session.amount_total, session.currency),
    shippingName:
      shippingDetails && typeof shippingDetails.name === 'string'
        ? shippingDetails.name
        : '',
    shippingAddress: formatAddress(shippingDetails),
    shippingPhone: customPhone || customerPhone,
    shippingCourier: readCourier(session),
  };
}

module.exports = {
  getCheckoutSessionSummary,
  formatAmount,
  formatAddress,
};
