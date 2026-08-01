import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import './NotFound.css';

const NotFound = () => {
  const { t } = useLanguage();

  return (
    <section className="not-found" aria-labelledby="not-found-title">
      <div className="not-found__atmosphere" aria-hidden="true">
        <span className="not-found__orb not-found__orb--a" />
        <span className="not-found__orb not-found__orb--b" />
        <span className="not-found__stroke not-found__stroke--1" />
        <span className="not-found__stroke not-found__stroke--2" />
      </div>

      <div className="not-found__stage">
        <div className="not-found__frame" aria-hidden="true">
          <div className="not-found__canvas">
            <span className="not-found__digit not-found__digit--1">4</span>
            <span className="not-found__digit not-found__digit--2">0</span>
            <span className="not-found__digit not-found__digit--3">4</span>
            <span className="not-found__drip" />
          </div>
        </div>

        <p className="not-found__brand">DOARTI</p>
        <h1 id="not-found-title" className="not-found__title">
          {t('notFound.title')}
        </h1>
        <p className="not-found__text">{t('notFound.message')}</p>

        <div className="not-found__actions">
          <Link to="/" className="not-found__btn not-found__btn--primary doarti-cta">
            <span className="doarti-cta__label">{t('notFound.home')}</span>
            <span className="doarti-cta__icon" aria-hidden="true">
              <i className="bi bi-house-door" />
            </span>
          </Link>
          <Link to="/gallery/2026" className="not-found__btn not-found__btn--ghost">
            {t('notFound.gallery')}
          </Link>
          <Link to="/prints" className="not-found__btn not-found__btn--ghost">
            {t('notFound.prints')}
          </Link>
        </div>
      </div>
    </section>
  );
};

export default NotFound;
