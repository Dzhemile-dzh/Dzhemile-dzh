import React, { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';

const getCheckoutEndpoint = () => {
  const configured = process.env.REACT_APP_STRIPE_API_URL;
  if (typeof configured === 'string' && configured.length > 0) {
    return `${configured.replace(/\/$/, '')}/api/create-checkout-session`;
  }
  if (process.env.NODE_ENV === 'development') {
    return 'http://localhost:4242/api/create-checkout-session';
  }
  return '/api/create-checkout-session';
};

/**
 * Starts Stripe Checkout via /api/create-checkout-session.
 * Local: run `npm run start:api` (or `npm run dev`) so port 4242 is up.
 * Production (Vercel): uses /api/create-checkout-session.js
 */
const BuyButton = ({
  productType,
  productId,
  title,
  priceEur,
  imagePath,
  paymentLink = null,
  sold = false,
  className = '',
  sizeLabel = null,
}) => {
  const { t, language } = useLanguage();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  if (sold === true) {
    return null;
  }

  const numericPrice = Number(priceEur);
  const canBuy = Number.isFinite(numericPrice) && numericPrice > 0;

  const handleBuy = async () => {
    setError(null);

    if (typeof paymentLink === 'string' && paymentLink.startsWith('http')) {
      window.location.href = paymentLink;
      return;
    }

    if (!canBuy) {
      setError(t('shop.price_unavailable'));
      return;
    }

    setLoading(true);

    try {
      const origin = window.location.origin;
      const response = await fetch(getCheckoutEndpoint(), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productType,
          productId,
          title,
          priceEur: numericPrice,
          imagePath,
          sizeLabel,
          locale: language === 'bg' ? 'bg' : 'en',
          successUrl: `${origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
          cancelUrl: `${origin}/checkout/cancel`,
        }),
      });

      const raw = await response.text();
      const contentType = response.headers.get('content-type') || '';
      const looksLikeHtml =
        raw.trimStart().startsWith('<!DOCTYPE') ||
        raw.trimStart().startsWith('<html') ||
        contentType.includes('text/html');

      if (looksLikeHtml) {
        throw new Error(t('shop.api_offline'));
      }

      let data;
      try {
        data = JSON.parse(raw);
      } catch {
        throw new Error(t('shop.checkout_error'));
      }

      if (!response.ok || typeof data.url !== 'string') {
        throw new Error(
          typeof data.error === 'string' ? data.error : t('shop.checkout_error')
        );
      }

      window.location.href = data.url;
    } catch (err) {
      if (err instanceof TypeError) {
        setError(t('shop.api_offline'));
      } else {
        setError(err instanceof Error ? err.message : t('shop.checkout_error'));
      }
      setLoading(false);
    }
  };

  return (
    <div className={className}>
      <button
        type="button"
        className={`btn buy-action-btn doarti-cta${loading ? ' is-loading' : ''}`}
        onClick={handleBuy}
        disabled={loading || !canBuy}
        aria-busy={loading}
      >
        <span className="doarti-cta__label buy-action-btn__label">
          {loading ? t('shop.processing') : t('shop.buy_now')}
        </span>
        <span className="doarti-cta__icon buy-action-btn__icon" aria-hidden="true">
          <i className={`bi ${loading ? 'bi-hourglass-split' : 'bi-bag-check'}`} />
        </span>
      </button>
      {error !== null && (
        <p className="text-danger small mt-2 mb-0">{error}</p>
      )}
    </div>
  );
};

export default BuyButton;
