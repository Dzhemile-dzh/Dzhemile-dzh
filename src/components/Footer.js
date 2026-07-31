import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { isEmailJsConfigured, sendSubscribeEmails } from '../utils/sendEmails';

const Footer = () => {
  const { t, language } = useLanguage();
  const [email, setEmail] = useState('');
  const [showSubscribeSuccess, setShowSubscribeSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (!email) {
      alert(t('footer.subscribe_error_empty'));
      setIsSubmitting(false);
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      alert(t('footer.subscribe_error_invalid'));
      setIsSubmitting(false);
      return;
    }

    try {
      const subscriptions = JSON.parse(localStorage.getItem('subscriptions') || '[]');
      const emailExists = subscriptions.some((sub) => sub.email === email || sub === email);
      if (!emailExists) {
        subscriptions.push({
          email,
          date: new Date().toISOString(),
        });
        localStorage.setItem('subscriptions', JSON.stringify(subscriptions));
      }

      if (isEmailJsConfigured()) {
        try {
          await sendSubscribeEmails({
            subscriberEmail: email,
            language,
            copy: {
              subject: t('emails.subscribe_subject'),
              preheader: t('emails.subscribe_preheader'),
              headline: t('emails.subscribe_headline'),
              intro: t('emails.subscribe_intro'),
              body: t('emails.subscribe_body'),
              closing: t('emails.subscribe_closing'),
              ctaLabel: t('emails.subscribe_cta'),
            },
          });
        } catch (emailError) {
          console.error('Subscribe email error:', emailError);
        }
      }

      setEmail('');
      setShowSubscribeSuccess(true);
    } catch (error) {
      console.error('Subscription error:', error);
      alert(t('footer.subscribe_error_general'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const closeSubscribeSuccess = () => {
    setShowSubscribeSuccess(false);
  };

  return (
    <footer className="site-footer">
      <div className="container">
        <div className="row mb-5">
          <div className="col-lg-4 col-12 mb-4 mb-lg-0">
            <div className="subscription-box">
              <div className="subscribe-form-wrap">
                <h6>{t('footer.subscribe')}</h6>
                <form className="subscribe-form" onSubmit={handleSubmit}>
                  <input
                    type="email"
                    name="subscribe-email"
                    id="subscribe-email"
                    placeholder={t('footer.email_placeholder')}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                  <button type="submit" id="submit" disabled={isSubmitting}>
                    {isSubmitting ? t('footer.subscribe_sending') : t('footer.subscribe_button')}
                  </button>
                </form>
              </div>
            </div>
          </div>

          <div className="col-lg-4 col-12 mb-4 mb-lg-0">
            <h4 className="site-footer-title mb-3">{t('footer.contact')}</h4>
            <p className="contact-info">
              <strong>{t('footer.phone')}</strong>
              <a href="tel:+359888123456">+359 895 627 511</a>
            </p>
            <p className="contact-info">
              <strong>{t('footer.email')}</strong>
              <a href="mailto:dzhemile.ahmet@gmail.com">dzhemile.ahmet@gmail.com</a>
            </p>
          </div>

          <div className="col-lg-4 col-12">
            <h4 className="site-footer-title mb-3">{t('footer.socials')}</h4>
            <ul className="social-icon">
              <li className="social-icon-item">
                <a
                  href="mailto:dzhemile.ahmet@gmail.com"
                  className="social-icon-link bi-envelope"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Email"
                >
                  <span className="sr-only">Email</span>
                </a>
              </li>
              <li className="social-icon-item">
                <a
                  href="viber://chat?number=0895627511"
                  className="social-icon-link bi-cursor"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Viber"
                >
                  <span className="sr-only">Viber</span>
                </a>
              </li>
              <li className="social-icon-item">
                <a
                  href="https://www.instagram.com/doarti42/"
                  className="social-icon-link bi-instagram"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                >
                  <span className="sr-only">Instagram</span>
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="row">
          <div className="col-lg-4 col-12 mb-3 mb-lg-0">
            <div className="footer-logo">
              <img src="/images/logo-doarti.png" alt="Doarti" className="logo-img" />
            </div>
          </div>

          <div className="col-lg-4 col-12 mb-3 mb-lg-0">
            <ul className="site-footer-links">
              <li className="site-footer-link-item">
                <Link to="/" className="site-footer-link">
                  {t('footer.homepage')}
                </Link>
              </li>
              <li className="site-footer-link-item">
                <Link to="/prints" className="site-footer-link">
                  {t('footer.prints_page')}
                </Link>
              </li>
              <li className="site-footer-link-item">
                <Link to="/shipping" className="site-footer-link">
                  {t('footer.shipping_page')}
                </Link>
              </li>
              <li className="site-footer-link-item">
                <Link to="/contact" className="site-footer-link">
                  {t('footer.contact_page')}
                </Link>
              </li>
              <li className="site-footer-link-item">
                <Link to="/about" className="site-footer-link">
                  {t('footer.about_page')}
                </Link>
              </li>
            </ul>
          </div>

          <div className="col-lg-4 col-12">
            <p
              className="copyright-text"
              dangerouslySetInnerHTML={{ __html: t('footer.copyright') }}
            ></p>
          </div>
        </div>
      </div>

      {showSubscribeSuccess && (
        <div className="popup-overlay" onClick={closeSubscribeSuccess}>
          <div className="success-popup-content" onClick={(e) => e.stopPropagation()}>
            <div className="success-popup-header">
              <div className="success-icon">✓</div>
              <h3>{t('footer.subscribe_success_title')}</h3>
            </div>
            <div className="success-popup-body">
              <p>{t('footer.subscribe_success_message')}</p>
              <p className="success-note">{t('footer.subscribe_success_note')}</p>
            </div>
            <div className="success-popup-footer">
              <button className="success-close-btn" onClick={closeSubscribeSuccess}>
                {t('footer.subscribe_success_close')}
              </button>
            </div>
          </div>
        </div>
      )}
    </footer>
  );
};

export default Footer;
