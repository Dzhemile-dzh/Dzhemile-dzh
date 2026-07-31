import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';

const CheckoutCancel = () => {
  const { t } = useLanguage();

  return (
    <div className="container text-center py-5">
      <h2 className="mb-3">{t('shop.cancel_title')}</h2>
      <p className="mb-4">{t('shop.cancel_message')}</p>
      <Link to="/prints" className="btn custom-btn me-2">
        {t('prints.header')}
      </Link>
      <Link to="/contact" className="btn btn-outline-secondary">
        {t('header.contact')}
      </Link>
    </div>
  );
};

export default CheckoutCancel;
