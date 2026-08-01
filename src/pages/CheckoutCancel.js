import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import DoartiCta from '../components/DoartiCta';

const CheckoutCancel = () => {
  const { t } = useLanguage();

  return (
    <div className="container text-center py-5">
      <h2 className="mb-3">{t('shop.cancel_title')}</h2>
      <p className="mb-4">{t('shop.cancel_message')}</p>
      <DoartiCta to="/prints" className="me-2" icon="bi-grid">
        {t('prints.header')}
      </DoartiCta>
      <Link to="/contact" className="btn btn-outline-secondary">
        {t('header.contact')}
      </Link>
    </div>
  );
};

export default CheckoutCancel;
