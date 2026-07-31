import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';

const CheckoutSuccess = () => {
  const { t } = useLanguage();

  return (
    <div className="container text-center py-5">
      <h2 className="mb-3">{t('shop.success_title')}</h2>
      <p className="mb-4">{t('shop.success_message')}</p>
      <Link to="/prints" className="btn custom-btn me-2">
        {t('prints.back')}
      </Link>
      <Link to="/" className="btn btn-outline-secondary">
        {t('back_to_home')}
      </Link>
    </div>
  );
};

export default CheckoutSuccess;
