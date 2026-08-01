import React, { useEffect, useRef, useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
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
    { src: '9.jpg', size: 'small' },
    { src: '10.png', size: 'large' },
    { src: '11.png', size: 'medium' },
    { src: '12.png', size: 'large' },
  ];

  const listItems = t('about.intro.paragraph5_list');
  const hasList = Array.isArray(listItems) && listItems.length > 0;

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
      <header
        className="site-header d-flex flex-column justify-content-center align-items-center"
        id="header-solid"
      >
        <div className="container">
          <div className="row">
            <div className="col-lg-12 col-12 text-center">
              <h2 className="text-white">{t('about.header')}</h2>
            </div>
          </div>
        </div>
      </header>

      <section className="about-section section-padding" id="section_2">
        <div className="container about-page">
          <div className="about-hero">
            <div className="about-hero__copy">
              <div className="about-hero__heading">
                <h3 className="about-hero__title">{t('about.header_about')}</h3>
                <p className="about-hero__sub">{t('about.header_about_sub')}</p>
              </div>
              <p
                className="about-hero__lead"
                dangerouslySetInnerHTML={{ __html: t('about.intro.paragraph1') }}
              />
            </div>
            <div className="about-hero__portrait">
              <img
                src="/images/about-me.png"
                className="about-image-main"
                alt="Dzhemile Ahmed"
                loading="lazy"
              />
            </div>
          </div>

          <div className="about-story">
            <article className="about-block">
              <div className="about-block__heading">
                <h4 className="about-block__title">
                  {t('about.intro.section1_title')}
                </h4>
              </div>
              <div className="about-block__body">
                <p
                  dangerouslySetInnerHTML={{
                    __html: t('about.intro.paragraph2'),
                  }}
                />
              </div>
            </article>

            <article className="about-block">
              <div className="about-block__heading">
                <h4 className="about-block__title">
                  {t('about.intro.section2_title')}
                </h4>
              </div>
              <div className="about-block__body">
                <p
                  dangerouslySetInnerHTML={{
                    __html: t('about.intro.paragraph4'),
                  }}
                />
              </div>
            </article>

            <article className="about-block">
              <div className="about-block__heading">
                <h4 className="about-block__title">
                  {t('about.intro.section3_title')}
                </h4>
              </div>
              <div className="about-block__body">
                <p
                  dangerouslySetInnerHTML={{
                    __html: t('about.intro.paragraph5'),
                  }}
                />
                {hasList && (
                  <ul className="about-modern-list">
                    {listItems.map((item, index) => (
                      <li
                        key={index}
                        dangerouslySetInnerHTML={{ __html: item }}
                      />
                    ))}
                  </ul>
                )}
                <p
                  dangerouslySetInnerHTML={{
                    __html: t('about.intro.paragraph6'),
                  }}
                />
              </div>
            </article>
          </div>

          <div className="about-studio">
            <div className="about-studio__header">
              <h4 className="about-studio__title">{t('about.studio_title')}</h4>
              <p className="about-studio__subtitle">
                {t('about.studio_subtitle')}
              </p>
            </div>

            <div className="studio-gallery" ref={sectionRef}>
              {aboutImages.map((image, index) => (
                <button
                  key={image.src}
                  type="button"
                  className={`studio-gallery-item studio-gallery-item-${image.size} ${
                    isVisible ? 'fade-in-visible' : 'fade-in'
                  }`}
                  style={{ animationDelay: `${index * 0.07}s` }}
                  onClick={() => setLightboxImage(`/images/about/${image.src}`)}
                  aria-label={`View studio image ${index + 1}`}
                >
                  <div className="studio-gallery-image-wrapper">
                    <img
                      src={`/images/about/${image.src}`}
                      alt={`Studio & Exhibition ${index + 1}`}
                      className="studio-gallery-image"
                      loading="lazy"
                      decoding="async"
                    />
                    <span className="studio-gallery-veil" aria-hidden="true" />
                    <span className="studio-gallery-cue" aria-hidden="true">
                      <i className="bi bi-arrows-fullscreen"></i>
                      <span>{t('about.studio_view')}</span>
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {lightboxImage !== null && (
            <div
              className="studio-lightbox"
              onClick={() => setLightboxImage(null)}
              role="dialog"
              aria-modal="true"
            >
              <div
                className="studio-lightbox-content"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  className="studio-lightbox-close"
                  onClick={() => setLightboxImage(null)}
                  aria-label="Close lightbox"
                  type="button"
                >
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
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
      </section>
    </>
  );
};

export default About;
