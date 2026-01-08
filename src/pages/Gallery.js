import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import ImageLoader from '../components/ImageLoader';
import '../components/ImageLoader.css';

// Utility function to truncate text to 200 characters
const truncateText = (text, maxLength = 200) => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength).trim() + '...';
};

// Type guard helper function
const isPlainObject = (value) => {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
};

// Safe Object.keys wrapper
const getObjectKeys = (obj) => {
  if (isPlainObject(obj)) {
    return Object.keys(obj);
  }
  return [];
};

const Gallery = () => {
  const { year } = useParams();
  const { t, translations } = useLanguage();

  const getGalleryData = (year) => {
    if (!isPlainObject(translations)) {
      return { header: 'Loading...', paintings: [] };
    }
    
    // Type guard: ensure translations is a plain object
    const keys = getObjectKeys(translations);
    if (keys.length === 0) {
      return { header: 'Loading...', paintings: [] };
    }
    
    switch (year) {
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

  // Show loading state if translations are not loaded
  if (!isPlainObject(translations)) {
    return (
      <div className="container text-center py-5">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-3">Loading paintings...</p>
      </div>
    );
  }

  // Type guard: ensure translations is a plain object with keys
  const translationKeys = getObjectKeys(translations);
  if (translationKeys.length === 0) {
    return (
      <div className="container text-center py-5">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-3">Loading paintings...</p>
      </div>
    );
  }

  // Debug logging
  console.log('Gallery data for year', year, ':', galleryData);
  console.log('Paintings count:', paintings.length);
  console.log('Available translations keys:', translationKeys);
  console.log('Translations object:', translations);

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
              <h3>No paintings found for {year}</h3>
              <p>Please check back later or browse other years.</p>
              <Link to="/" className="btn custom-btn">Back to Home</Link>
            </div>
          ) : (
            <div className="row">
              {paintings.map((painting, index) => (
                <div key={index} className="col-lg-4 col-md-6 col-12 mb-4">
                      <div className="custom-block custom-block-full">
                        <div className="custom-block-image-wrap">
                          <Link to={`/painting/${year}/${painting.link.split('/').pop()}`}>
                            <ImageLoader
                              src={`/${painting.image}`}
                              alt={t(`${painting.link.split('/').pop()}_heading`) || painting.title}
                              className="custom-block-image img-fluid gallery-image-loader"
                              style={{ width: '100%', objectFit: 'cover' }}
                            />
                          </Link>
                          {painting.sold && (
                            <span className="badge-soldmin badgem position-absolute">
                              <strong>{t('sold_tag')}</strong>
                            </span>
                          )}
                        </div>
                    <div className="custom-block-info">
                      <h5 className="mb-2">
                        <Link to={`/painting/${year}/${painting.link.split('/').pop()}`}>
                          {t(`${painting.link.split('/').pop()}_heading`) || painting.title}
                        </Link>
                      </h5>
                      <div className="profile-block d-flex">
                        <p>
                          {t('oil_painting')}
                          <strong>{painting.dimensions}</strong>
                        </p>
                      </div>
                      <p className="mb-0">{truncateText(t(`${painting.link.split('/').pop()}_description`) || painting.description)}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
};

export default Gallery;