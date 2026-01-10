import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import ImageLoader from '../components/ImageLoader';
import '../components/ImageLoader.css';
import './PaintingDetail.css';

// Utility function to truncate text to 200 characters
const truncateText = (text, maxLength = 200) => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength).trim() + '...';
};

const PaintingDetail = () => {
  const { year, slug } = useParams();
  const { t, translations } = useLanguage();
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(100);

  // This would typically come from an API or more detailed data structure
  const getPaintingData = (year, slug) => {
    if (!translations || Object.keys(translations).length === 0) {
      return null;
    }
    
    const galleries = {
      '2022': translations.gallery,
      '2023': translations.gallery2023,
      '2024': translations.gallery2024,
      '2025': translations.gallery2025,
      '2026': translations.gallery2026
    };
    
    const gallery = galleries[year];
    if (!gallery || !gallery.paintings) return null;
    
    return gallery.paintings.find(painting => 
      painting.link === `${year}/${slug}`
    );
  };

  const painting = getPaintingData(year, slug);

  // Show loading state if translations are not loaded
  if (!translations || Object.keys(translations).length === 0) {
    return (
      <div className="container text-center py-5">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-3">Loading painting details...</p>
      </div>
    );
  }

  if (!painting) {
    console.log('Painting not found for:', { year, slug, translations: Object.keys(translations) });
    return (
      <div className="container text-center py-5">
        <h2>Painting not found</h2>
        <p>Year: {year}, Slug: {slug}</p>
        <Link to="/" className="btn custom-btn">Back to Home</Link>
      </div>
    );
  }

  // Get related paintings for "You can also like" section
  const getRelatedPaintings = () => {
    if (!translations || Object.keys(translations).length === 0) return [];
    
    const galleries = {
      '2022': translations.gallery,
      '2023': translations.gallery2023,
      '2024': translations.gallery2024,
      '2025': translations.gallery2025
    };
    
    const allPaintings = [];
    Object.values(galleries).forEach(gallery => {
      if (gallery && gallery.paintings) {
        allPaintings.push(...gallery.paintings);
      }
    });
    
    // Filter out current painting, shuffle, and return up to 3 random paintings
    const filteredPaintings = allPaintings.filter(p => p.link !== `${year}/${slug}`);
    
    // Shuffle array and take first 3
    const shuffled = filteredPaintings.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 3);
  };

  const relatedPaintings = getRelatedPaintings();

  const handleZoomIn = () => {
    setZoomLevel(prev => Math.min(prev + 25, 300));
  };

  const handleZoomOut = () => {
    setZoomLevel(prev => Math.max(prev - 25, 50));
  };

  const handleResetZoom = () => {
    setZoomLevel(100);
  };

  const handleCloseLightbox = () => {
    setLightboxOpen(false);
    setZoomLevel(100);
  };

  return (
    <>
      <header className="site-header d-flex flex-column justify-content-center align-items-center" id="header-solid">
        <div className="container">
          <div className="row">
            <div className="col-lg-12 col-12 text-center">
              <h2 className="text-white">
                {(() => {
                  const headingKey = `${slug}_heading`;
                  let heading = t(headingKey);
                  // If translation returns the key itself, it wasn't found - use fallback
                  if (heading === headingKey) {
                    // Try to get title from painting data, or translate it if it's a key
                    const title = painting?.title;
                    if (title && title.includes('_heading')) {
                      // Title is a translation key reference, try to translate it
                      heading = t(title);
                      if (heading === title) {
                        return title; // Return the key if translation still not found
                      }
                    }
                    return title || 'Painting';
                  }
                  return heading;
                })()}
              </h2>
            </div>
          </div>
        </div>
      </header>

      <main>
        <section className="latest-podcast-section section-padding pb-0" id="section_2">
          <div className="container">
            <div className="row justify-content-center">
              <div className="col-lg-10 col-12">
                <div className="section-title-wrap mb-5">
                  <h4 className="section-title">{t('details')}</h4>
                </div>
                <div className="row">
                  <div className="col-lg-6 col-12">
                        <div className="custom-block-icon-wrap">
                          <div className="custom-block-image-wrap custom-block-image-detail-page painting-image-container">
                            <ImageLoader
                              src={`/${painting.image}`}
                              alt={painting.title}
                              className="custom-block-image img-fluid painting-main-image"
                              style={{ height: '100%', width: '100%', objectFit: 'cover' }}
                            />
                            <button 
                              className="painting-view-fullsize-btn"
                              onClick={() => setLightboxOpen(true)}
                              aria-label="View full size"
                            >
                              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"></path>
                              </svg>
                              <span>{t('view_full_size') || 'View Full Size'}</span>
                            </button>
                          </div>
                      <span className={`position-absolute ${painting.sold ? 'badge-sold-left' : 'badge-left badgem'}`}>
                        {painting.sold ? t('sold') : t('available')}
                      </span>
                    </div>
                  </div>
                  <div className="col-lg-6 col-12">
                    <div className="custom-block-info">
                      <div className="custom-block-top d-flex mb-1">
                        <small className="me-4">
                          <span>
                            <i className="bi-play"></i>
                            {painting.dimensions}
                          </span>
                        </small>

                        <small>
                          <i className="bi-clock-fill custom-icon"></i>
                          {painting.year || year}
                        </small>

                        <small className="ms-auto">
                          <span className="badge">{t('oil_painting')}</span>
                        </small>
                      </div>

                      {painting.framed && (
                        <div className="mb-3">
                          <span className="badge" style={{ 
                            backgroundColor: '#8B4513', 
                            color: '#fff', 
                            fontSize: '14px', 
                            padding: '8px 16px',
                            fontWeight: 'bold',
                            border: '2px solid #654321'
                          }}>
                            {t('framed')}
                          </span>
                        </div>
                      )}

                      <p style={{ whiteSpace: 'pre-line' }}>
                        {(() => {
                          const descKey = `${slug}_description`;
                          let description = t(descKey);
                          // If translation returns the key itself, it wasn't found - use fallback
                          if (description === descKey) {
                            // Try to get description from painting data, or translate it if it's a key
                            const desc = painting?.description;
                            if (desc && desc.includes('_description')) {
                              // Description is a translation key reference, try to translate it
                              description = t(desc);
                              if (description === desc) {
                                return desc; // Return the key if translation still not found
                              }
                            }
                            return desc || '';
                          }
                          return description;
                        })()}
                      </p>

                      {painting.recreatedBy && (
                        <div className="mb-3 mt-3">
                          <span className="badge" style={{ 
                            backgroundColor: '#6c757d', 
                            color: '#fff', 
                            fontSize: '13px', 
                            padding: '6px 12px',
                            fontWeight: 'normal',
                            fontStyle: 'italic'
                          }}>
                            {t(`created_by_${painting.recreatedBy}`)}
                          </span>
                        </div>
                      )}

                      <div className="profile-block profile-detail-block d-flex flex-wrap align-items-center mt-5">
                        <div className="row" style={{ display: 'contents' }}>
                          <div>
                            <strong>
                              {painting.sold ? (
                                <div style={{ fontSize: '20px' }}>
                                  <div style={{ color: '#333333' }}>{t('sold')}</div>
                                  <div style={{ fontSize: '14px', marginTop: '5px', color: '#666666' }}>
                                    {t('not_available')}
                                  </div>
                                </div>
                              ) : (
                                <>
                                  {t('price')}:
                                  <span style={{ color: '#49e98e', fontSize: '20px', marginLeft: '8px' }}>
                                    {painting.price ? `${painting.price} ${t('euro')}` : `Contact for price`}
                                  </span>
                                </>
                              )}
                            </strong>
                          </div>
                        </div>
                        {!painting.sold && (
                          <>
                            <div className="d-flex mb-3 mb-lg-0 mb-md-0">
                              <p>{t('contact_for_orders')}</p>
                            </div>

                            <ul className="social-icon ms-lg-auto ms-md-auto">
                              <li className="social-icon-item">
                                <a 
                                  href="mailto:dzhemile.ahmet@gmail.com"
                                  className="social-icon-link bi-envelope" 
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  aria-label="Email"
                                >
                                  <span className="sr-only">Email</span>
                                </a>
                              </li>
                              <li className="social-icon-item">
                                <a 
                                  href="viber://chat?number=0895627511"
                                  className="social-icon-link bi-cursor" 
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  aria-label="Viber"
                                >
                                  <span className="sr-only">Viber</span>
                                </a>
                              </li>
                            </ul>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* You can also like section */}
        {relatedPaintings.length > 0 && (
          <section className="related-podcast-section section-padding">
            <div className="container">
              <div className="row">
                <div className="col-lg-12 col-12">
                  <div className="section-title-wrap mb-5">
                    <h4 className="section-title">{t('you_may_also_like')}</h4>
                  </div>
                </div>
                <div className="row">
                  {relatedPaintings.map((relatedPainting, index) => (
                    <div key={index} className="col-lg-4 col-12 mb-4 mb-lg-0">
                      <div className="custom-block custom-block-full">
                            <div className="custom-block-image-wrap">
                              <Link to={`/painting/${relatedPainting.link}`}>
                                <ImageLoader
                                  src={`/${relatedPainting.image}`}
                                  alt={relatedPainting.title}
                                  className="custom-block-image img-fluid gallery-image-loader"
                                  style={{ width: '100%', objectFit: 'cover' }}
                                />
                                {relatedPainting.sold && (
                                  <span className="badge-soldmin badgem position-absolute">
                                    <strong>{t('sold')}</strong>
                                  </span>
                                )}
                              </Link>
                            </div>
                        <div className="custom-block-info">
                          <h5 className="mb-2">
                            <Link to={`/painting/${relatedPainting.link}`}>
                              {t(`${relatedPainting.link.split('/').pop()}_heading`) || relatedPainting.title}
                            </Link>
                          </h5>
                          <div className="profile-block d-flex">
                            <p>{t('oil_painting')} <strong>{relatedPainting.dimensions}</strong></p>
                          </div>
                          <p className="mb-0" style={{ whiteSpace: 'pre-line' }}>{truncateText(t(`${relatedPainting.link.split('/').pop()}_description`) || relatedPainting.description)}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>
        )}
      </main>

      {/* Full Size Lightbox with Zoom */}
      {lightboxOpen && (
        <div 
          className="painting-lightbox" 
          onClick={handleCloseLightbox}
        >
          <div className="painting-lightbox-content" onClick={(e) => e.stopPropagation()}>
            <button 
              className="painting-lightbox-close"
              onClick={handleCloseLightbox}
              aria-label="Close lightbox"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
            
            <div className="painting-lightbox-zoom-controls">
              <button 
                className="painting-zoom-btn"
                onClick={handleZoomOut}
                disabled={zoomLevel <= 50}
                aria-label="Zoom out"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="11" cy="11" r="8"></circle>
                  <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                  <line x1="8" y1="11" x2="14" y2="11"></line>
                </svg>
              </button>
              <span className="painting-zoom-level">{zoomLevel}%</span>
              <button 
                className="painting-zoom-btn"
                onClick={handleZoomIn}
                disabled={zoomLevel >= 300}
                aria-label="Zoom in"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="11" cy="11" r="8"></circle>
                  <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                  <line x1="11" y1="8" x2="11" y2="14"></line>
                  <line x1="8" y1="11" x2="14" y2="11"></line>
                </svg>
              </button>
              <button 
                className="painting-zoom-btn"
                onClick={handleResetZoom}
                aria-label="Reset zoom"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"></path>
                  <path d="M21 3v5h-5"></path>
                  <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"></path>
                  <path d="M3 21v-5h5"></path>
                </svg>
              </button>
            </div>

            <div className="painting-lightbox-image-container">
              <img 
                src={`/${painting.image}`} 
                alt={painting.title} 
                className="painting-lightbox-image"
                style={{ transform: `scale(${zoomLevel / 100})` }}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default PaintingDetail;
