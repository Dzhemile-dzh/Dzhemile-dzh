import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { useLanguage } from '../contexts/LanguageContext';
import DoartiCta from '../components/DoartiCta';
import ShippingInfo from '../components/ShippingInfo';
import { ShippingRegionSelect } from '../components/ShippingRegionSelect';
import { startCheckout } from '../utils/checkout';
import './Basket.css';

const Basket = () => {
  const { t, language } = useLanguage();
  const {
    items,
    itemCount,
    shippingRegion,
    setShippingRegion,
    shippingEur,
    subtotalEur,
    totalEur,
    removeItem,
  } = useCart();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleCheckout = async () => {
    setError(null);
    setLoading(true);

    try {
      const origin = window.location.origin;
      await startCheckout({
        items: items.map((item) => ({
          productType: item.productType,
          productId: item.productId,
          title: item.title,
          priceEur: item.priceEur,
          imagePath: item.imagePath,
          sizeLabel: item.sizeLabel,
          quantity: item.quantity,
        })),
        shippingRegion,
        locale: language === 'bg' ? 'bg' : 'en',
        successUrl: `${origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
        cancelUrl: `${origin}/basket`,
        fallbackError: t('shop.checkout_error'),
        apiOfflineError: t('shop.api_offline'),
      });
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
    <>
      <header
        className="site-header d-flex flex-column justify-content-center align-items-center"
        id="header-solid"
      >
        <div className="container">
          <div className="row">
            <div className="col-lg-12 col-12 text-center">
              <h2 className="text-white">{t('shop.basket')}</h2>
            </div>
          </div>
        </div>
      </header>

      <section className="section-padding basket-page">
        <div className="container">
          {itemCount === 0 ? (
            <div className="text-center">
              <p className="basket-empty">{t('shop.basket_empty')}</p>
              <DoartiCta to="/miniatures" className="me-2" icon="bi-grid">
                {t('header.miniatures')}
              </DoartiCta>
              <Link to="/prints" className="home-link-btn">
                {t('header.prints')}
              </Link>
            </div>
          ) : (
            <div className="row justify-content-center">
              <div className="col-lg-8 col-12">
                <ul className="basket-list">
                  {items.map((item) => (
                    <li key={item.id} className="basket-item">
                      <img
                        src={item.imagePath}
                        alt=""
                        className="basket-item__image"
                      />
                      <div className="basket-item__info">
                        <h3 className="basket-item__title">{item.title}</h3>
                        {item.sizeLabel ? (
                          <p className="basket-item__meta">{item.sizeLabel}</p>
                        ) : null}
                        <p className="basket-item__price">
                          {item.priceEur} {t('euro')}
                          {item.quantity > 1 ? ` × ${item.quantity}` : ''}
                        </p>
                      </div>
                      <button
                        type="button"
                        className="basket-item__remove"
                        onClick={() => removeItem(item.id)}
                      >
                        {t('shop.remove')}
                      </button>
                    </li>
                  ))}
                </ul>

                <div className="price-card basket-summary">
                  <ShippingRegionSelect
                    id="basket-ship-region"
                    value={shippingRegion}
                    onChange={setShippingRegion}
                    disabled={loading}
                  />
                  <ShippingInfo />
                  <dl className="basket-totals">
                    <div>
                      <dt>{t('shop.subtotal')}</dt>
                      <dd>
                        {subtotalEur} {t('euro')}
                      </dd>
                    </div>
                    <div>
                      <dt>{t('shop.shipping')}</dt>
                      <dd>
                        {shippingEur} {t('euro')}
                      </dd>
                    </div>
                    <div className="basket-totals__total">
                      <dt>{t('shop.total')}</dt>
                      <dd>
                        {totalEur} {t('euro')}
                      </dd>
                    </div>
                  </dl>
                  <button
                    type="button"
                    className={`btn buy-action-btn doarti-cta${
                      loading ? ' is-loading' : ''
                    }`}
                    onClick={handleCheckout}
                    disabled={loading}
                    aria-busy={loading}
                  >
                    <span className="doarti-cta__label buy-action-btn__label">
                      {loading ? t('shop.processing') : t('shop.checkout')}
                    </span>
                    <span
                      className="doarti-cta__icon buy-action-btn__icon"
                      aria-hidden="true"
                    >
                      <i
                        className={`bi ${
                          loading ? 'bi-hourglass-split' : 'bi-bag-check'
                        }`}
                      />
                    </span>
                  </button>
                  {error !== null && (
                    <p className="text-danger small mt-3 mb-0">{error}</p>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  );
};

export default Basket;
