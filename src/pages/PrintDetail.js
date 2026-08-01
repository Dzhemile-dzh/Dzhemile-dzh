import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import {
  getPrintBySlug,
  getPrintDisplayTitle,
  getPrintSizeById,
} from '../data/prints';
import BuyButton from '../components/BuyButton';
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
        <Link to="/prints" className="btn custom-btn mt-3">
          {t('prints.back')}
        </Link>
      </div>
    );
  }

  const title = getPrintDisplayTitle(print, t);
  const selectedSize = getPrintSizeById(selectedSizeId);

  return (
    <section className="latest-podcast-section section-padding" id="section_2">
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
                  <div className="d-flex flex-wrap gap-2 mb-3">
                    <span className="badge">{t('prints.fine_art_print')}</span>
                    <span className="badge">{t('prints.signed_badge')}</span>
                  </div>

                  <h2 className="mb-3" style={{ fontSize: '2rem', fontWeight: '600' }}>
                    {title}
                  </h2>

                  <p className="print-detail-note">{t('prints.item_description')}</p>
                  <p className="print-detail-note">{t('prints.paper_description')}</p>

                  <ul className="list-unstyled print-detail-specs">
                    <li>
                      <strong>{t('prints.edition')}:</strong> {t('prints.edition_value')}
                    </li>
                    <li>
                      <strong>{t('prints.paper')}:</strong> {t('prints.paper_value')}
                    </li>
                    <li>
                      <strong>{t('prints.signed')}:</strong> {t('prints.signed_value')}
                    </li>
                    <li>
                      <strong>{t('prints.based_on')}:</strong>{' '}
                      <Link to={`/painting/${print.year}/${print.paintingSlug}`}>
                        {title}
                      </Link>
                    </li>
                  </ul>

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
  );
};

export default PrintDetail;
