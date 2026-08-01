import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import '../pages/Shipping.css';

export const SAATCHI_ART_URL = 'https://www.saatchiart.com/en-bg/doarti42';

/**
 * Short delivery teaser with link to the full Shipping page.
 * Applies to original paintings and limited prints.
 */
const ShippingInfo = () => {
  const { t } = useLanguage();

  return (
    <div className="shipping-teaser">
      <p className="shipping-teaser__text">{t('shipping.teaser')}</p>
      <Link to="/shipping" className="shipping-teaser__link">
        {t('shipping.teaser_link')}
      </Link>
    </div>
  );
};

export default ShippingInfo;
