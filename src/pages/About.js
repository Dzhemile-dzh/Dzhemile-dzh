import React, {useEffect, useRef, useState} from 'react';
import {useLanguage} from '../contexts/LanguageContext';
import ImageLoader from '../components/ImageLoader';
import '../components/ImageLoader.css';
import './About.css';

const About = () => {
  const { t } = useLanguage();
  const [isVisible, setIsVisible] = useState(false);
  const [lightboxImage, setLightboxImage] = useState(null);
  const sectionRef = useRef(null);

  const aboutImages = [
    { src: '4.jpg', size: 'medium' },
    { src: '1.jpg', size: 'large' },
    { src: '2.jpg', size: 'small' },
    { src: '3.jpg', size: 'medium' },
    { src: '8.jpg', size: 'small' },
    { src: '7.jpg', size: 'large' },
    { src: '6.jpg', size: 'medium' },
    { src: '9.jpg', size: 'small' }
  ];

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <>
      <header className="site-header d-flex flex-column justify-content-center align-items-center" id="header-solid">
        <div className="container">
          <div className="row">
            <div className="col-lg-12 col-12 text-center">
              <h2 className="text-white">{t('about.header')}</h2>
            </div>
          </div>
        </div>
      </header>
      <section className="about-section section-padding" id="section_2" style={{ paddingTop: '50px!important' }}>
        <div className="container">
          <div className="row">
            <div className="col-lg-12 col-12 mx-auto">
              <div className="pb-5 mb-5">
                <div className="section-title-wrap mb-4">
                  <h4 className="section-title">{t('about.header_about')}</h4>
                </div>
                <div className="row">
                  <div className="col-lg-5 col-md-12 about-text-content" style={{height: '100%!important'}}>
                    <p style={{ fontSize: '22px' }} dangerouslySetInnerHTML={{ __html: t('about.intro.paragraph1') }}></p>
                    <h3 className="about-section-heading-inline">{t('about.intro.section1_title')}</h3>
                    <p style={{ fontSize: '22px' }} dangerouslySetInnerHTML={{ __html: t('about.intro.paragraph2') }}></p>
                    <p style={{ fontSize: '22px' }} dangerouslySetInnerHTML={{ __html: t('about.intro.paragraph3') }}></p>
                  </div>
                  <div className="col-lg-7 col-md-12">
                    <img 
                      src="/images/about-me.png" 
                      className="about-image-main img-fluid" 
                      alt="About the artist" 
                      style={{ height: '100%!important' }}
                      loading="lazy"
                    />
                  </div>
                </div>
                <div className="row mt-5">
                  <div className="col-lg-12 col-md-12 about-text-full-width">
                    <h3 className="about-section-heading">{t('about.intro.section2_title')}</h3>
                    <p style={{fontSize: '22px'}} dangerouslySetInnerHTML={{__html: t('about.intro.paragraph4')}}></p>
                  </div>
                </div>
                <div className="row mt-5">
                  <div className="col-lg-12 col-md-12 about-text-full-width">
                    <h3 className="about-section-heading">{t('about.intro.section3_title')}</h3>
                    <p style={{fontSize: '22px'}} dangerouslySetInnerHTML={{__html: t('about.intro.paragraph5')}}></p>
                    {t('about.intro.paragraph5_list') && Array.isArray(t('about.intro.paragraph5_list')) && (
                        <ul className="about-modern-list">
                          {t('about.intro.paragraph5_list').map((item, index) => (
                              <li key={index} dangerouslySetInnerHTML={{__html: item}}></li>
                          ))}
                        </ul>
                    )}
                    <p style={{fontSize: '22px'}} dangerouslySetInnerHTML={{__html: t('about.intro.paragraph6')}}></p>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-lg-12 col-12">
              <div className="section-title-wrap mb-5">
                <h4 className="section-title">{t('about.studio_title')}</h4>
              </div>
              <p className="section-subtitle">{t('about.studio_subtitle') || 'A glimpse into the creative process and artistic journey'}</p>
            </div>

            <div className="studio-gallery" ref={sectionRef}>
              {aboutImages.map((image, index) => (
                <div 
                  key={index} 
                  className={`studio-gallery-item studio-gallery-item-${image.size} ${isVisible ? 'fade-in-visible' : 'fade-in'}`}
                  style={{ 
                    animationDelay: `${index * 0.1}s`
                  }}
                  onClick={() => setLightboxImage(`/images/about/${image.src}`)}
                >
                  <div className="studio-gallery-image-wrapper">
                    <ImageLoader
                      src={`/images/about/${image.src}`}
                      alt={`Studio & Exhibition ${index + 1}`}
                      className="studio-gallery-image"
                    />
                    <div className="studio-gallery-overlay">
                      <div className="studio-gallery-overlay-content">
                        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                          <polyline points="17 8 12 3 7 8"></polyline>
                          <line x1="12" y1="3" x2="12" y2="15"></line>
                        </svg>
                        <span className="studio-gallery-view-text">View Full Size</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Lightbox Modal */}
            {lightboxImage && (
              <div 
                className="studio-lightbox" 
                onClick={() => setLightboxImage(null)}
              >
                <div className="studio-lightbox-content" onClick={(e) => e.stopPropagation()}>
                  <button 
                    className="studio-lightbox-close"
                    onClick={() => setLightboxImage(null)}
                    aria-label="Close lightbox"
                  >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <line x1="18" y1="6" x2="6" y2="18"></line>
                      <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                  </button>
                  <img 
                    src={lightboxImage} 
                    alt="Studio & Exhibition" 
                    className="studio-lightbox-image"
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
};

export default About;
