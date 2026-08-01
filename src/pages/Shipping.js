import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { SAATCHI_ART_URL } from '../components/ShippingInfo';
import './Shipping.css';

const Shipping = () => {
  const { t } = useLanguage();

  return (
    <>
      <header
        className="site-header d-flex flex-column justify-content-center align-items-center"
        id="header-solid"
      >
        <div className="container">
          <div className="row">
            <div className="col-lg-12 col-12 text-center">
              <h2 className="text-white">{t('shipping.page_title')}</h2>
            </div>
          </div>
        </div>
      </header>

      <section className="shipping-page section-padding">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-8 col-12">
              <p className="shipping-page__intro">{t('shipping.intro')}</p>
              <p className="shipping-page__scope">{t('shipping.scope')}</p>

              <div className="shipping-page__sections">
                <article className="shipping-block">
                  <h3 className="shipping-block__title">{t('shipping.free_title')}</h3>
                  <p className="shipping-block__text">{t('shipping.free_text')}</p>
                </article>

                <article className="shipping-block">
                  <h3 className="shipping-block__title">{t('shipping.packaging_title')}</h3>
                  <p className="shipping-block__text">{t('shipping.packaging_text')}</p>
                </article>

                <article className="shipping-block">
                  <h3 className="shipping-block__title">{t('shipping.timeframe_title')}</h3>
                  <p className="shipping-block__text">{t('shipping.timeframe_text')}</p>
                </article>

                <article className="shipping-block">
                  <h3 className="shipping-block__title">{t('shipping.couriers_title')}</h3>
                  <p className="shipping-block__text">{t('shipping.couriers_text')}</p>
                </article>

                <article className="shipping-block">
                  <h3 className="shipping-block__title">{t('shipping.bulgaria_title')}</h3>
                  <p className="shipping-block__text">{t('shipping.bulgaria_text')}</p>
                </article>

                <article className="shipping-block">
                  <h3 className="shipping-block__title">{t('shipping.abroad_title')}</h3>
                  <p className="shipping-block__text">
                    {t('shipping.abroad_text_before')}{' '}
                    <a
                      href={SAATCHI_ART_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="shipping-page__link"
                    >
                      {t('shipping.saatchi')}
                    </a>
                    {t('shipping.abroad_text_after')}
                  </p>
                </article>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Shipping;
