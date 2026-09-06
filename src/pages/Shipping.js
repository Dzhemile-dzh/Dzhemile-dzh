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

function readPackagingSteps(rawSteps) {
  if (!Array.isArray(rawSteps)) {
    return [];
  }

  return rawSteps.flatMap((step, index) => {
    const image = PACKAGING_STEP_IMAGES[index];
    if (!step || typeof step !== 'object' || !image) {
      return [];
    }

    const title = typeof step.title === 'string' ? step.title : '';
    const lines = Array.isArray(step.lines) ? step.lines : [];

    return [
      {
        image,
        title,
        lines,
        number: String(index + 1).padStart(2, '0'),
      },
    ];
  });
}

const Shipping = () => {
  const { t } = useLanguage();
  const [lightbox, setLightbox] = useState(null);

  const packagingSteps = readPackagingSteps(t('shipping.packaging_steps'));
  const hasPackagingSteps = packagingSteps.length > 0;

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
              <div className="col-12">
                <article className="shipping-pack" id="packaging">
                  <header className="shipping-pack__header">
                    <h3 className="shipping-pack__title">{t('shipping.packaging_title')}</h3>
                    <p className="shipping-pack__lead">{t('shipping.packaging_process_title')}</p>
                    <p className="shipping-pack__intro">{t('shipping.packaging_text')}</p>
                  </header>

                  <svg className="shipping-pack__defs" aria-hidden="true" focusable="false">
                    <filter
                      id="shipping-pack-ink"
                      x="-12%"
                      y="-12%"
                      width="124%"
                      height="124%"
                    >
                      <feTurbulence
                        type="fractalNoise"
                        baseFrequency="0.9"
                        numOctaves="4"
                        seed="6"
                        result="grain"
                      />
                      <feDisplacementMap
                        in="SourceGraphic"
                        in2="grain"
                        scale="2.8"
                        xChannelSelector="R"
                        yChannelSelector="G"
                        result="warped"
                      />
                      <feColorMatrix
                        in="grain"
                        type="matrix"
                        values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 0.55 0"
                        result="speckle"
                      />
                      <feComposite
                        in="warped"
                        in2="speckle"
                        operator="in"
                      />
                    </filter>
                    <filter
                      id="shipping-pack-grade"
                      colorInterpolationFilters="sRGB"
                      x="0"
                      y="0"
                      width="100%"
                      height="100%"
                    >
                      <feGaussianBlur
                        in="SourceGraphic"
                        stdDeviation="0.75"
                        result="soft"
                      />
                      <feComposite
                        in="SourceGraphic"
                        in2="soft"
                        operator="arithmetic"
                        k1="0"
                        k2="1.1"
                        k3="-0.1"
                        k4="0"
                        result="clarity"
                      />
                      <feComponentTransfer in="clarity" result="tone">
                        <feFuncR type="linear" slope="1.08" intercept="-0.03" />
                        <feFuncG type="linear" slope="1.08" intercept="-0.03" />
                        <feFuncB type="linear" slope="1.08" intercept="-0.03" />
                      </feComponentTransfer>
                      <feColorMatrix
                        in="tone"
                        type="saturate"
                        values="1.1"
                      />
                    </filter>
                  </svg>

                  <ol className="shipping-pack__lookbook">
                    {packagingSteps.map((step) => {
                      const alt = `${step.number} ${step.title}`;

                      return (
                        <li key={step.image} className="shipping-pack__item">
                          <button
                            type="button"
                            className="shipping-pack__photo"
                            onClick={() => setLightbox({ src: step.image, alt })}
                            aria-label={`${t('shipping.packaging_view')}: ${alt}`}
                          >
                            <img
                              src={step.image}
                              alt={alt}
                              loading="lazy"
                              decoding="async"
                            />
                            <span className="shipping-pack__caption">
                              <span className="shipping-pack__name">{step.title}</span>
                              {step.lines.map((line) => (
                                <span key={line} className="shipping-pack__line">
                                  {line}
                                </span>
                              ))}
                            </span>
                            <span className="shipping-pack__index" aria-hidden="true">
                              {Number.parseInt(step.number, 10)}
                            </span>
                          </button>
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
