import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { SAATCHI_ART_URL } from '../components/ShippingInfo';
import './Shipping.css';

const PACKAGING_STEP_IMAGES = [
  '/images/shipping/01-overview.jpg',
  '/images/shipping/02-varnish.jpg',
  '/images/shipping/03-hanging-nodrill.jpg',
  '/images/shipping/04-certificate.jpg',
  '/images/shipping/05-glassine-note.jpg',
  '/images/shipping/06-certificate-pack.jpg',
  '/images/shipping/07-bubble-only.jpg',
  '/images/shipping/08-box-closed.jpg',
];

const Shipping = () => {
  const { t } = useLanguage();
  const [lightbox, setLightbox] = useState(null);

  const packagingSteps = t('shipping.packaging_steps');
  const hasPackagingSteps = Array.isArray(packagingSteps) && packagingSteps.length > 0;

  const closeLightbox = () => setLightbox(null);

  useEffect(() => {
    if (lightbox === null) {
      return undefined;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    document.body.classList.add('shipping-lightbox-open');

    const onKeyDown = (event) => {
      if (event.key === 'Escape') {
        closeLightbox();
      }
    };

    window.addEventListener('keydown', onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.body.classList.remove('shipping-lightbox-open');
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [lightbox]);

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
                  <h3 className="shipping-block__title">{t('shipping.bulgaria_title')}</h3>
                  <p className="shipping-block__text">{t('shipping.bulgaria_text')}</p>
                </article>

                <article className="shipping-block">
                  <h3 className="shipping-block__title">{t('shipping.europe_title')}</h3>
                  <p className="shipping-block__text">{t('shipping.europe_text')}</p>
                </article>

                <article className="shipping-block">
                  <h3 className="shipping-block__title">{t('shipping.uk_title')}</h3>
                  <p className="shipping-block__text">{t('shipping.uk_text')}</p>
                </article>

                <article className="shipping-block">
                  <h3 className="shipping-block__title">{t('shipping.us_title')}</h3>
                  <p className="shipping-block__text">
                    {t('shipping.us_text_before')}{' '}
                    <a
                      href={SAATCHI_ART_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="shipping-page__link"
                    >
                      {t('shipping.saatchi')}
                    </a>
                    {t('shipping.us_text_after')}
                  </p>
                </article>

                <article className="shipping-block">
                  <h3 className="shipping-block__title">{t('shipping.timeframe_title')}</h3>
                  <p className="shipping-block__text">{t('shipping.timeframe_text')}</p>
                </article>

                <article className="shipping-block">
                  <h3 className="shipping-block__title">{t('shipping.couriers_title')}</h3>
                  <p className="shipping-block__text">{t('shipping.couriers_text')}</p>
                </article>
              </div>
            </div>
          </div>

          {hasPackagingSteps && (
            <div className="row justify-content-center">
              <div className="col-lg-10 col-12">
                <article className="shipping-block shipping-pack" id="packaging">
                  <h3 className="shipping-block__title">{t('shipping.packaging_title')}</h3>
                  <p className="shipping-block__text">{t('shipping.packaging_text')}</p>
                  <p className="shipping-pack__lead">{t('shipping.packaging_process_title')}</p>

                  <ol className="shipping-pack__grid">
                    {packagingSteps.map((step, index) => {
                      const image = PACKAGING_STEP_IMAGES[index];
                      if (!step || typeof step !== 'object' || !image) {
                        return null;
                      }

                      const title = typeof step.title === 'string' ? step.title : '';
                      const lines = Array.isArray(step.lines) ? step.lines : [];
                      const number = String(index + 1).padStart(2, '0');
                      const alt = title
                        ? `${number} ${title}`
                        : t('shipping.packaging_process_title');

                      return (
                        <li key={image} className="shipping-pack-step">
                          <button
                            type="button"
                            className="shipping-pack-step__photo"
                            onClick={() => setLightbox({ src: image, alt })}
                            aria-label={`${t('shipping.packaging_view')}: ${alt}`}
                          >
                            <img
                              src={image}
                              alt={alt}
                              loading="lazy"
                              decoding="async"
                            />
                            <span className="shipping-pack-step__cue" aria-hidden="true">
                              <i className="bi bi-arrows-fullscreen"></i>
                              <span>{t('shipping.packaging_view')}</span>
                            </span>
                          </button>
                          <div className="shipping-pack-step__copy">
                            <p className="shipping-pack-step__num">{number}</p>
                            <h4 className="shipping-pack-step__title">{title}</h4>
                            {lines.map((line) => (
                              <p key={line} className="shipping-pack-step__text">
                                {line}
                              </p>
                            ))}
                          </div>
                        </li>
                      );
                    })}
                  </ol>
                </article>
              </div>
            </div>
          )}
        </div>
      </section>

      {lightbox !== null &&
        createPortal(
          <div
            className="shipping-lightbox"
            onClick={closeLightbox}
            role="dialog"
            aria-modal="true"
            aria-label={lightbox.alt}
          >
            <div
              className="shipping-lightbox__content"
              onClick={(event) => event.stopPropagation()}
            >
              <img
                src={lightbox.src}
                alt={lightbox.alt}
                className="shipping-lightbox__image"
              />
              <div className="shipping-lightbox__bar">
                <button
                  className="shipping-lightbox__close"
                  onClick={closeLightbox}
                  aria-label={t('shipping.packaging_close')}
                  type="button"
                >
                  <i className="bi bi-x-lg" aria-hidden="true" />
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}
    </>
  );
};

export default Shipping;
