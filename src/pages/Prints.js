import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { getPrintDisplayTitle, prints } from '../data/prints';
import ImageLoader from '../components/ImageLoader';
import '../components/ImageLoader.css';
import './Prints.css';

const Prints = () => {
  const { t } = useLanguage();

  return (
    <>
      <header className="site-header d-flex flex-column justify-content-center align-items-center" id="header-solid">
        <div className="container">
          <div className="row">
            <div className="col-lg-12 col-12 text-center">
              <h2 className="text-white">{t('prints.header')}</h2>
            </div>
          </div>
        </div>
      </header>

      <section className="section-padding prints-page">
        <div className="container">
          <div className="print-intro mx-auto mb-5">
            <p className="print-intro__lead">{t('prints.intro')}</p>
            <div className="print-specs-row">
              <div className="print-spec-chip">{t('prints.edition_badge')}</div>
              <div className="print-spec-chip">{t('prints.paper_value')}</div>
              <div className="print-spec-chip">{t('prints.sizes_chip')}</div>
              <div className="print-spec-chip">{t('prints.signed_badge')}</div>
            </div>
            <p className="print-intro__paper mb-0">{t('prints.paper_description')}</p>
          </div>

          <div className="prints-grid">
            {prints.map((print) => {
              const title = getPrintDisplayTitle(print, t);

              return (
                <Link
                  key={print.slug}
                  to={`/prints/${print.slug}`}
                  className="print-card"
                  aria-label={title}
                >
                  <div className="print-card__frame">
                    <span className="print-card__badge">{t('prints.fine_art_print')}</span>
                    <ImageLoader
                      src={`/${print.image}`}
                      alt={title}
                      className="img-fluid"
                    />
                    <div className="print-card__overlay">
                      <h3 className="print-card__title">{title}</h3>
                      <p className="print-card__price">
                        {t('prints.from_price')}{' '}
                        <strong>
                          {print.priceEur} {t('euro')}
                        </strong>
                      </p>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
};

export default Prints;
