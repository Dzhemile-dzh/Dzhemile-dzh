import React, { useEffect, useId, useRef, useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import './BuyButton.css';

const SHIP_REGIONS = [
  { id: 'bg', feeKey: 'ship_bg' },
  { id: 'eu', feeKey: 'ship_eu' },
  { id: 'uk', feeKey: 'ship_uk' },
];

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

export const ShippingRegionSelect = ({
  id,
  value,
  onChange,
  disabled = false,
}) => {
  const { t } = useLanguage();
  const reactId = useId();
  const rootRef = useRef(null);
  const [open, setOpen] = useState(false);
  const listId = id ? `${id}-list` : `ship-region-list-${reactId}`;
  const buttonId = id || `ship-region-${reactId}`;
  const selected =
    SHIP_REGIONS.find((region) => region.id === value) || SHIP_REGIONS[0];

  useEffect(() => {
    if (!open) {
      return undefined;
    }

    const onPointerDown = (event) => {
      if (rootRef.current && !rootRef.current.contains(event.target)) {
        setOpen(false);
      }
    };

    const onKeyDown = (event) => {
      if (event.key === 'Escape') {
        setOpen(false);
      }
    };

    document.addEventListener('pointerdown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);

    return () => {
      document.removeEventListener('pointerdown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [open]);

  useEffect(() => {
    if (disabled) {
      setOpen(false);
    }
  }, [disabled]);

  const chooseRegion = (regionId) => {
    onChange(regionId);
    setOpen(false);
  };

  return (
    <div
      ref={rootRef}
      className={`buy-ship-region${open ? ' is-open' : ''}${
        disabled ? ' is-disabled' : ''
      }`}
    >
      <span className="buy-ship-region__label" id={`${buttonId}-label`}>
        {t('shop.ship_to')}
      </span>
      <div className="buy-ship-region__select-wrap">
        <button
          type="button"
          id={buttonId}
          className="buy-ship-region__trigger"
          aria-haspopup="listbox"
          aria-expanded={open}
          aria-controls={listId}
          aria-labelledby={`${buttonId}-label ${buttonId}`}
          disabled={disabled}
          onClick={() => setOpen((current) => !current)}
        >
          <span className="buy-ship-region__value">{t(`shop.${selected.feeKey}`)}</span>
          <i
            className={`bi ${open ? 'bi-chevron-up' : 'bi-chevron-down'} buy-ship-region__chevron`}
            aria-hidden="true"
          />
        </button>

        {open && (
          <ul
            id={listId}
            className="buy-ship-region__menu"
            role="listbox"
            aria-labelledby={`${buttonId}-label`}
          >
            {SHIP_REGIONS.map((region) => {
              const isActive = region.id === selected.id;
              return (
                <li key={region.id} role="presentation">
                  <button
                    type="button"
                    role="option"
                    aria-selected={isActive}
                    className={`buy-ship-region__option${isActive ? ' is-active' : ''}`}
                    onClick={() => chooseRegion(region.id)}
                  >
                    <span>{t(`shop.${region.feeKey}`)}</span>
                    {isActive ? (
                      <i className="bi bi-check2" aria-hidden="true" />
                    ) : null}
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
};

/**
 * Starts Stripe Checkout via /api/create-checkout-session.
 * Destination region sets a single automatic shipping rate (no courier choice on Stripe).
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
  shippingRegion: shippingRegionProp = null,
  onShippingRegionChange = null,
  showShippingSelect = true,
}) => {
  const { t, language } = useLanguage();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [internalRegion, setInternalRegion] = useState('bg');

  const isControlled =
    typeof shippingRegionProp === 'string' && typeof onShippingRegionChange === 'function';
  const shippingRegion = isControlled ? shippingRegionProp : internalRegion;
  const setShippingRegion = isControlled ? onShippingRegionChange : setInternalRegion;

  if (sold === true) {
    return null;
  }

  const numericPrice = Number(priceEur);
  const canBuy = Number.isFinite(numericPrice) && numericPrice > 0;
  const selectId = `ship-region-${productType}-${productId}`.replace(
    /[^a-zA-Z0-9_-]/g,
    '-'
  );

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
          shippingRegion,
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
    <div className={`buy-button-block ${className}`.trim()}>
      {showShippingSelect === true && (
        <ShippingRegionSelect
          id={selectId}
          value={shippingRegion}
          onChange={setShippingRegion}
          disabled={loading}
        />
      )}

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
