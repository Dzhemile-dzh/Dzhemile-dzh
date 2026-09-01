export const getCheckoutEndpoint = () => {
  const configured = process.env.REACT_APP_STRIPE_API_URL;
  if (typeof configured === 'string' && configured.length > 0) {
    return `${configured.replace(/\/$/, '')}/api/create-checkout-session`;
  }
  if (process.env.NODE_ENV === 'development') {
    return 'http://localhost:4242/api/create-checkout-session';
  }
  return '/api/create-checkout-session';
};

export const startCheckout = async ({
  items,
  shippingRegion,
  locale,
  successUrl,
  cancelUrl,
  fallbackError,
  apiOfflineError,
}) => {
  const first = Array.isArray(items) && items.length > 0 ? items[0] : null;
  const response = await fetch(getCheckoutEndpoint(), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      items,
      productType: first?.productType,
      productId: first?.productId,
      title: first?.title,
      priceEur: first?.priceEur,
      imagePath: first?.imagePath,
      sizeLabel: first?.sizeLabel,
      shippingRegion,
      locale,
      successUrl,
      cancelUrl,
    }),
  });

  const raw = await response.text();
  const contentType = response.headers.get('content-type') || '';
  const looksLikeHtml =
    raw.trimStart().startsWith('<!DOCTYPE') ||
    raw.trimStart().startsWith('<html') ||
    contentType.includes('text/html');

  if (looksLikeHtml) {
    throw new Error(apiOfflineError);
  }

  let data;
  try {
    data = JSON.parse(raw);
  } catch {
    throw new Error(fallbackError);
  }

  if (!response.ok || typeof data.url !== 'string') {
    throw new Error(
      typeof data.error === 'string' ? data.error : fallbackError
    );
  }

  window.location.href = data.url;
};
