import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { miniatures } from '../data/miniatures';
import ImageLoader from '../components/ImageLoader';
import '../components/ImageLoader.css';
import './Miniatures.css';

const Miniatures = () => {
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
              <h2 className="text-white">{t('miniatures.header')}</h2>
            </div>
          </div>
        </div>
      </header>

      <section className="section-padding miniatures-page">
        <div className="container">
          <div className="row justify-content-center mb-4">
            <div className="col-lg-8 col-12 text-center">
              <h1 className="miniatures-title">{t('miniatures.title')}</h1>
              <p className="miniatures-price-line">{t('miniatures.price_line')}</p>
            </div>
          </div>

          <div className="row">
            {miniatures.map((item) => {
              const label = t('miniatures.portrait_label').replace('{n}', item.id);
              return (
                <div key={item.id} className="col-lg-4 col-md-6 col-12 mb-4">
                  <Link
                    to={`/miniatures/${item.slug}`}
                    className="miniatures-card-link"
                    aria-label={label}
                  >
                    <article className="custom-block custom-block-full miniatures-card">
                      <div className="miniatures-frame">
                        <ImageLoader
                          src={item.image}
                          alt={label}
                          className="miniatures-frame-image"
                        />
                      </div>
                      <div className="custom-block-info">
                        <h5 className="mb-2">{label}</h5>
                        <p className="mb-2">
                          {t('oil_painting')}
                          <strong> {item.dimensions}</strong>
                        </p>
                        <p className="miniatures-card-price mb-0">
                          {item.priceEur} {t('euro')}
                        </p>
                      </div>
                    </article>
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
};

export default Miniatures;
