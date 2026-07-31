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

      <section className="section-padding">
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

          <div className="row">
            {prints.map((print) => {
              const title = getPrintDisplayTitle(print, t);

              return (
                <div key={print.slug} className="col-lg-4 col-md-6 col-12 mb-4">
                  <Link
                    to={`/prints/${print.slug}`}
                    style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}
                  >
                    <div
                      className="custom-block custom-block-full print-card"
                      style={{ cursor: 'pointer', transition: 'transform 0.2s ease', height: '100%' }}
                    >
                      <div className="custom-block-image-wrap" style={{ height: '400px', overflow: 'hidden' }}>
                        <ImageLoader
                          src={`/${print.image}`}
                          alt={title}
                          className="custom-block-image img-fluid"
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                        <span className="print-card__edition">{t('prints.edition_badge')}</span>
                      </div>
                      <div className="custom-block-info">
                        <span className="badge mb-2">{t('prints.fine_art_print')}</span>
                        <h5 className="mb-2" style={{ color: '#000' }}>{title}</h5>
                        <p className="print-card__meta mb-1">
                          {t('prints.paper_value')} - {t('prints.sizes_chip')}
                        </p>
                        <p className="print-card__meta mb-2">
                          {t('prints.signed_badge')}
                        </p>
                        <p className="mb-0">
                          <strong>
                            {t('prints.from_price')} {print.priceEur} {t('euro')}
                          </strong>
                        </p>
                      </div>
                    </div>
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

export default Prints;
