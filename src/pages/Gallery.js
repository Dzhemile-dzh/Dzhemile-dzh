import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import ImageLoader from '../components/ImageLoader';
import DoartiCta from '../components/DoartiCta';
import '../components/ImageLoader.css';
import './Gallery.css';

const truncateText = (text, maxLength = 200) => {
  if (!text) return '';
  const cleaned = String(text).replace(/\n+/g, ' ').replace(/\s+/g, ' ').trim();
  if (cleaned.length <= maxLength) return cleaned;
  return cleaned.substring(0, maxLength).trim() + '...';
};

const isPlainObject = (value) => {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
};

const getObjectKeys = (obj) => {
  if (isPlainObject(obj)) {
    return Object.keys(obj);
  }
  return [];
};

const Gallery = () => {
  const { year } = useParams();
  const { t, translations } = useLanguage();

  const getGalleryData = (selectedYear) => {
    if (!isPlainObject(translations)) {
      return { header: 'Loading...', paintings: [] };
    }

    const keys = getObjectKeys(translations);
    if (keys.length === 0) {
      return { header: 'Loading...', paintings: [] };
    }

    switch (selectedYear) {
      case '2022':
        return translations.gallery || { header: '2022 Paintings', paintings: [] };
      case '2023':
        return translations.gallery2023 || { header: '2023 Paintings', paintings: [] };
      case '2024':
        return translations.gallery2024 || { header: '2024 Paintings', paintings: [] };
      case '2025':
        return translations.gallery2025 || { header: '2025 Paintings', paintings: [] };
      case '2026':
        return translations.gallery2026 || { header: '2026 Paintings', paintings: [] };
      default:
        return translations.gallery || { header: 'Paintings', paintings: [] };
    }
  };

  const galleryData = getGalleryData(year);
  const paintings = galleryData.paintings || [];

  if (!isPlainObject(translations) || getObjectKeys(translations).length === 0) {
    return (
      <div className="container text-center py-5">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-3">Loading paintings...</p>
      </div>
    );
  }

  return (
    <>
      <header className="site-header d-flex flex-column justify-content-center align-items-center" id="header-solid">
        <div className="container">
          <div className="row">
            <div className="col-lg-12 col-12 text-center">
              <h2 className="text-white">{galleryData.header}</h2>
            </div>
          </div>
        </div>
      </header>

      <section className="gallery-section section-padding">
        <div className="container">
          {paintings.length === 0 ? (
            <div className="text-center py-5">
              <h3>{t('no_paintings_found').replace('{year}', year)}</h3>
              <p>{t('check_back_later')}</p>
              <DoartiCta to="/" icon="bi-house-door">
                {t('back_to_home')}
              </DoartiCta>
            </div>
          ) : (
            <div className="gallery-grid">
              {paintings.map((painting) => {
                const slug = painting.link.split('/').pop();
                const title = t(`${slug}_heading`) || painting.title;
                const description = truncateText(
                  t(`${slug}_description`) || painting.description
                );

                return (
                  <Link
                    key={painting.link}
                    to={`/painting/${year}/${slug}`}
                    className="gallery-card"
                    aria-label={title}
                  >
                    <div className="gallery-card__frame">
                      {painting.sold ? (
                        <span className="status-tag status-tag--sold status-tag--compact">
                          {t('sold_tag')}
                        </span>
                      ) : (
                        <span className="status-tag status-tag--available status-tag--compact">
                          {t('available')}
                        </span>
                      )}
                      <ImageLoader
                        src={`/${painting.image}`}
                        alt={title}
                        className="img-fluid"
                      />
                      <div className="gallery-card__overlay">
                        <h3 className="gallery-card__title">{title}</h3>
                        <div className="gallery-card__tags">
                          <span className="gallery-card__tag">{t('oil_painting')}</span>
                          <span className="gallery-card__tag">{painting.dimensions}</span>
                        </div>
                        {description ? (
                          <p className="gallery-card__desc">{description}</p>
                        ) : null}
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </>
  );
};

export default Gallery;
