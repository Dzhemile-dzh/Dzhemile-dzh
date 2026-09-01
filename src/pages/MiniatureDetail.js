import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { Link, useParams } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { getMiniatureBySlug } from '../data/miniatures';
import BuyButton from '../components/BuyButton';
import DoartiCta from '../components/DoartiCta';
import ShippingInfo from '../components/ShippingInfo';
import ImageLoader from '../components/ImageLoader';
import '../components/ImageLoader.css';
import './PaintingDetail.css';
import './Miniatures.css';

const renderStoryChapter = (chapter) => (
  <article key={chapter.label} className="miniatures-chapter">
    <p className="miniatures-chapter-label">{chapter.label}</p>
    <h3 className="miniatures-chapter-title">{chapter.title}</h3>
    {chapter.paragraphs.map((paragraph) => (
      <p key={paragraph}>{paragraph}</p>
    ))}
  </article>
);

const MiniatureDetail = () => {
  const { slug } = useParams();
  const { t } = useLanguage();
  const item = getMiniatureBySlug(slug);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(100);
  const chapters = t('miniatures.chapters');
  const story = Array.isArray(chapters) ? chapters : [];
  const title = item
    ? t('miniatures.portrait_label').replace('{n}', item.id)
    : '';

  const handleZoomIn = () => {
    setZoomLevel((prev) => Math.min(prev + 25, 300));
  };

  const handleZoomOut = () => {
    setZoomLevel((prev) => Math.max(prev - 25, 50));
  };

  const handleResetZoom = () => {
    setZoomLevel(100);
  };

  const handleCloseLightbox = () => {
    setLightboxOpen(false);
    setZoomLevel(100);
  };

  useEffect(() => {
    if (!lightboxOpen) {
      return undefined;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    document.body.classList.add('painting-lightbox-open');

    const onKeyDown = (event) => {
      if (event.key === 'Escape') {
        setLightboxOpen(false);
        setZoomLevel(100);
      }
    };

    window.addEventListener('keydown', onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.body.classList.remove('painting-lightbox-open');
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [lightboxOpen]);

  if (!item) {
    return (
      <div className="container text-center py-5">
        <h2>{t('miniatures.not_found')}</h2>
        <DoartiCta to="/miniatures" className="mt-3" icon="bi-grid">
          {t('miniatures.back')}
        </DoartiCta>
      </div>
    );
  }

  return (
    <>
      <header className="site-header" id="header-solid" aria-hidden="true" />
      <section className="latest-podcast-section section-padding painting-detail-section" id="section_2">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-10 col-12">
              <div className="row">
                <div className="col-lg-6 col-12">
                  <div className="custom-block-icon-wrap">
                    <div className="custom-block-image-wrap custom-block-image-detail-page painting-image-container miniatures-detail-image">
                      <ImageLoader
                        src={item.image}
                        alt={title}
                        className="custom-block-image img-fluid painting-main-image"
                        natural
                      />
                      <button
                        type="button"
                        className="painting-view-fullsize-btn"
                        onClick={() => setLightboxOpen(true)}
                        aria-label={t('view_full_size')}
                      >
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"></path>
                        </svg>
                        <span>{t('view_full_size')}</span>
                      </button>
                    </div>
                  </div>
                </div>

                <div className="col-lg-6 col-12">
                  <div className="custom-block-info">
                    <div className="page-heading">
                      <h1 className="page-heading__title">{title}</h1>
                    </div>

                    <p className="miniatures-price-line mb-3">
                      {t('oil_painting')} · {item.dimensions}
                    </p>

                    <div className="miniatures-story miniatures-story--detail">
                      <h2 className="miniatures-story-heading">{t('miniatures.read_story')}</h2>
                      {story.slice(0, 2).map(renderStoryChapter)}
                      {story.length > 2 ? (
                        <details className="miniatures-story-more">
                          <summary>{t('miniatures.read_more')}</summary>
                          {story.slice(2).map(renderStoryChapter)}
                        </details>
                      ) : null}
                    </div>

                    <div className="modern-price-cta-section mt-4">
                      <div className="price-card">
                        <div className="price-row">
                          <div className="price-left">
                            <div className="price-left__main">
                              <span className="price-label-text">{t('price')}</span>
                              <div className="price-amount">
                                <span className="price-value">{item.priceEur}</span>
                                <span className="price-currency">{t('euro')}</span>
                              </div>
                            </div>
                          </div>
                          <div className="price-right">
                            <BuyButton
                              productType="original"
                              productId={item.slug}
                              title={title}
                              priceEur={item.priceEur}
                              imagePath={item.image}
                              sizeLabel={item.dimensions}
                              className="buy-action-wrap"
                            />
                          </div>
                        </div>
                        <ShippingInfo />
                      </div>
                    </div>

                    <Link to="/miniatures" className="miniatures-back-link">
                      <i className="bi bi-arrow-left" aria-hidden="true" />
                      {t('miniatures.back')}
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {lightboxOpen
        ? createPortal(
            <div
              className="painting-lightbox"
              onClick={handleCloseLightbox}
              role="dialog"
              aria-modal="true"
              aria-label={title}
            >
              <div
                className="painting-lightbox-content"
                onClick={(event) => event.stopPropagation()}
              >
                <div className="painting-lightbox-image-container">
                  <img
                    src={item.image}
                    alt={title}
                    className="painting-lightbox-image"
                    style={{ transform: `scale(${zoomLevel / 100})` }}
                  />
                </div>
                <div className="painting-lightbox-bar">
                  <div className="painting-lightbox-zoom-controls">
                    <button
                      type="button"
                      className="painting-zoom-btn"
                      onClick={handleZoomOut}
                      disabled={zoomLevel <= 50}
                      aria-label="Zoom out"
                    >
                      <i className="bi bi-zoom-out" aria-hidden="true" />
                    </button>
                    <span className="painting-zoom-level">{zoomLevel}%</span>
                    <button
                      type="button"
                      className="painting-zoom-btn"
                      onClick={handleZoomIn}
                      disabled={zoomLevel >= 300}
                      aria-label="Zoom in"
                    >
                      <i className="bi bi-zoom-in" aria-hidden="true" />
                    </button>
                    <button
                      type="button"
                      className="painting-zoom-btn"
                      onClick={handleResetZoom}
                      aria-label="Reset zoom"
                    >
                      <i className="bi bi-arrow-counterclockwise" aria-hidden="true" />
                    </button>
                  </div>
                  <button
                    type="button"
                    className="painting-lightbox-close"
                    onClick={handleCloseLightbox}
                    aria-label="Close lightbox"
                  >
                    <i className="bi bi-x-lg" aria-hidden="true" />
                  </button>
                </div>
              </div>
            </div>,
            document.body
          )
        : null}
    </>
  );
};

export default MiniatureDetail;
