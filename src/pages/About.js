import React, { useState, useEffect, useRef } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import ImageLoader from '../components/ImageLoader';
import '../components/ImageLoader.css';

const About = () => {
  const { t } = useLanguage();
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  const aboutImages = [
    '4.jpg', '1.jpg', '2.jpg', '3.jpg', '8.jpg', '7.jpg', '6.jpg', '9.jpg'
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
                  <h4 className="section-title">{t('about.header')}</h4>
                </div>
                <div className="row">
                  <div className="col" style={{ height: '100%!important' }}>
                    <p style={{ fontSize: '22px' }} dangerouslySetInnerHTML={{ __html: t('about.intro.paragraph1') }}></p>
                    <p style={{ fontSize: '22px' }} dangerouslySetInnerHTML={{ __html: t('about.intro.paragraph2') }}></p>
                    <p style={{ fontSize: '22px' }} dangerouslySetInnerHTML={{ __html: t('about.intro.paragraph3') }}></p>
                  </div>
                  <div className="col-7">
                    <img 
                      src="/images/about-me.png" 
                      className="about-image-main img-fluid" 
                      alt="About the artist" 
                      style={{ height: '100%!important' }}
                      loading="lazy"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="col-lg-12 col-12">
              <div className="section-title-wrap mb-5">
                <h4 className="section-title">{t('about.studio_title')}</h4>
              </div>
            </div>

            <div className="row" ref={sectionRef}>
              {aboutImages.map((image, index) => (
                <div 
                  key={index} 
                  className={`col-lg-3 col-md-12 mb-4 mb-lg-0 ${isVisible ? 'fade-in-visible' : 'fade-in'}`}
                  style={{ 
                    animationDelay: `${index * 0.1}s`
                  }}
                >
                  <ImageLoader
                    src={`/images/about/${image}`}
                    alt={`Studio ${index + 1}`}
                    className="w-100 shadow-1-strong rounded mb-4 img-ab"
                    style={{ 
                      width: '100%', 
                      objectFit: 'cover'
                    }}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default About;
