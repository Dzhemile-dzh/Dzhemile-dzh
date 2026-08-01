import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import {
  getPrintBySlug,
  getPrintDisplayTitle,
  getPrintSizeById,
} from '../data/prints';
import BuyButton from '../components/BuyButton';
import DoartiCta from '../components/DoartiCta';
import ShippingInfo from '../components/ShippingInfo';
import ImageLoader from '../components/ImageLoader';
import '../components/ImageLoader.css';
import './PaintingDetail.css';
import './Prints.css';

const PrintDetail = () => {
  const { slug } = useParams();
  const { t } = useLanguage();
  const print = getPrintBySlug(slug);
  const [selectedSizeId, setSelectedSizeId] = useState(
    print?.defaultSizeId ?? '40x60'
  );

  if (!print) {
    return (
      <div className="container text-center py-5">
        <h2>{t('prints.not_found')}</h2>
        <DoartiCta to="/prints" className="mt-3" icon="bi-grid">
          {t('prints.back')}
        </DoartiCta>
      </div>
    );
  }

  const title = getPrintDisplayTitle(print, t);
  const selectedSize = getPrintSizeById(selectedSizeId);

  return (
    <>
      <header
        className="site-header"
        id="header-solid"
        aria-hidden="true"
      />
      <section className="latest-podcast-section section-padding print-detail-section" id="section_2">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-10 col-12">
            <div className="row">
              <div className="col-lg-6 col-12">
                <div className="custom-block-icon-wrap">
                  <div className="custom-block-image-wrap custom-block-image-detail-page">
                    <ImageLoader
                      src={`/${print.image}`}
                      alt={title}
                      className="custom-block-image img-fluid"
                      style={{ height: '100%', width: '100%', objectFit: 'cover' }}
                    />
                    <span className="print-card__edition">{t('prints.edition_badge')}</span>
                  </div>
                </div>
              </div>

              <div className="col-lg-6 col-12">
                <div className="custom-block-info">
                  <div className="page-heading">
                    <h1 className="page-heading__title">{title}</h1>
                  </div>

                  <div className="painting-detail-tags">
                    <span className="painting-detail-tag painting-detail-tag--medium">
                      <i className="bi bi-collection" aria-hidden="true"></i>
                      {t('prints.edition_badge')}
                    </span>
                    <span className="painting-detail-tag painting-detail-tag--size">
                      <i className="bi bi-pen" aria-hidden="true"></i>
                      {t('prints.signed_badge')}
                    </span>
                    <span className="painting-detail-tag painting-detail-tag--year">
                      <i className="bi bi-file-earmark" aria-hidden="true"></i>
                      {t('prints.paper_value')}
                    </span>
                    <span className="painting-detail-tag painting-detail-tag--sizes">
                      <i className="bi bi-aspect-ratio" aria-hidden="true"></i>
                      {t('prints.sizes_chip')}
                    </span>
                  </div>

                  <p className="print-detail-note">{t('prints.item_description')}</p>
                  <p className="print-detail-note">{t('prints.paper_description')}</p>

                  <dl className="print-detail-facts">
                    <div className="print-detail-fact">
                      <dt>
                        <i className="bi bi-collection" aria-hidden="true"></i>
                        {t('prints.edition')}
                      </dt>
                      <dd>{t('prints.edition_value')}</dd>
                    </div>
                    <div className="print-detail-fact">
                      <dt>
                        <i className="bi bi-file-earmark" aria-hidden="true"></i>
                        {t('prints.paper')}
                      </dt>
                      <dd>{t('prints.paper_value')}</dd>
                    </div>
                    <div className="print-detail-fact">
                      <dt>
                        <i className="bi bi-pen" aria-hidden="true"></i>
                        {t('prints.signed')}
                      </dt>
                      <dd>{t('prints.signed_value')}</dd>
                    </div>
                    <div className="print-detail-fact">
                      <dt>
                        <i className="bi bi-link-45deg" aria-hidden="true"></i>
                        {t('prints.based_on')}
                      </dt>
                      <dd>
                        <Link to={`/painting/${print.year}/${print.paintingSlug}`}>
                          {title}
                        </Link>
                      </dd>
                    </div>
                  </dl>

                  <div className="print-size-picker" role="group" aria-label={t('prints.size')}>
                    <p className="print-size-picker__label">{t('prints.choose_size')}</p>
                    <div className="print-size-picker__options">
                      {print.sizes.map((size) => {
                        const isActive = size.id === selectedSize.id;
                        return (
                          <button
                            key={size.id}
                            type="button"
                            className={`print-size-option${isActive ? ' is-active' : ''}`}
                            onClick={() => setSelectedSizeId(size.id)}
                            aria-pressed={isActive}
                          >
                            <span className="print-size-option__size">{size.label}</span>
                            <span className="print-size-option__price">
                              {size.priceEur} {t('euro')}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="modern-price-cta-section mt-4">
                    <div className="price-card">
                      <div className="price-row">
                        <div className="price-left">
                          <span className="price-label-text">{t('price')}</span>
                          <div className="price-amount">
                            <span className="price-value">{selectedSize.priceEur}</span>
                            <span className="price-currency">{t('euro')}</span>
                          </div>
                          <span className="print-selected-size">{selectedSize.label}</span>
                        </div>
                        <div className="price-right">
                          {print.inStock === true ? (
                            <BuyButton
                              productType="print"
                              productId={print.slug}
                              title={`${title} - limited edition of 10 - ${selectedSize.label}`}
                              priceEur={selectedSize.priceEur}
                              imagePath={`/${print.image}`}
                              paymentLink={print.paymentLink}
                              sizeLabel={selectedSize.label}
                              className="buy-action-wrap"
                            />
                          ) : (
                            <p className="mb-0">{t('prints.out_of_stock')}</p>
                          )}
                        </div>
                      </div>

                      <ShippingInfo />
                    </div>
                  </div>

                  <Link to="/prints" className="d-inline-block mt-4">
                    ← {t('prints.back')}
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
    </>
  );
};

export default PrintDetail;
