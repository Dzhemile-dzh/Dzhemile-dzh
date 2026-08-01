import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { sendSubscribeEmails } from '../utils/sendEmails';
import { markNewsletterSubscribed } from '../utils/cookies';
import SuccessModal from './SuccessModal';
import './Footer.css';

const Footer = () => {
  const { t, language } = useLanguage();
  const [email, setEmail] = useState('');
  const [showSubscribeSuccess, setShowSubscribeSuccess] = useState(false);
  const [showAlreadySubscribed, setShowAlreadySubscribed] = useState(false);
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
      const response = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await response.json().catch(() => ({}));

      if (response.status === 409 || data.error === 'already_subscribed') {
        markNewsletterSubscribed();
        setShowAlreadySubscribed(true);
        setIsSubmitting(false);
        return;
      }

      if (!response.ok || data.ok !== true) {
        throw new Error(
          typeof data.error === 'string' ? data.error : 'Subscribe failed'
        );
      }

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

      markNewsletterSubscribed();
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
    <footer className="site-footer doarti-footer">
      <div className="container doarti-footer__inner">
        <div className="doarti-footer__grid">
          <section className="doarti-footer__col doarti-footer__col--subscribe">
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
          </section>

          <section className="doarti-footer__col">
            <h3 className="doarti-footer__heading">{t('footer.contact')}</h3>
            <ul className="doarti-footer__contacts">
              <li>
                <span>{t('footer.phone')}</span>
                <a href="tel:+359895627511">+359 895 627 511</a>
              </li>
              <li>
                <span>{t('footer.email')}</span>
                <a href="mailto:dzhemile.ahmet@gmail.com">dzhemile.ahmet@gmail.com</a>
              </li>
            </ul>
          </section>

          <section className="doarti-footer__col">
            <h3 className="doarti-footer__heading">{t('footer.socials')}</h3>
            <ul className="doarti-footer__socials">
              <li>
                <a
                  href="mailto:dzhemile.ahmet@gmail.com"
                  className="doarti-footer__social-link bi-envelope"
                  aria-label="Email"
                >
                  <span className="sr-only">Email</span>
                </a>
              </li>
              <li>
                <a
                  href="viber://chat?number=0895627511"
                  className="doarti-footer__social-link bi-cursor"
                  aria-label="Viber"
                >
                  <span className="sr-only">Viber</span>
                </a>
              </li>
              <li>
                <a
                  href="https://t.me/+359895627511"
                  className="doarti-footer__social-link bi-telegram"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Telegram"
                >
                  <span className="sr-only">Telegram</span>
                </a>
              </li>
              <li>
                <a
                  href="https://www.instagram.com/doarti42/"
                  className="doarti-footer__social-link bi-instagram"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                >
                  <span className="sr-only">Instagram</span>
                </a>
              </li>
            </ul>
          </section>
        </div>

        <div className="doarti-footer__bar">
          <div className="doarti-footer__brand">
            <img src="/images/logo-doarti.png" alt="Doarti" />
          </div>

          <nav className="doarti-footer__nav" aria-label="Footer">
            <Link to="/">{t('footer.homepage')}</Link>
            <Link to="/prints">{t('footer.prints_page')}</Link>
            <Link to="/shipping">{t('footer.shipping_page')}</Link>
            <Link to="/contact">{t('footer.contact_page')}</Link>
            <Link to="/about">{t('footer.about_page')}</Link>
          </nav>

          <p
            className="doarti-footer__copy"
            dangerouslySetInnerHTML={{ __html: t('footer.copyright') }}
          ></p>
        </div>
      </div>

      {showSubscribeSuccess && (
        <SuccessModal
          title={t('footer.subscribe_success_title')}
          message={t('footer.subscribe_success_message')}
          note={t('footer.subscribe_success_note')}
          closeLabel={t('footer.subscribe_success_close')}
          onClose={closeSubscribeSuccess}
        />
      )}

      {showAlreadySubscribed && (
        <SuccessModal
          variant="info"
          title={t('footer.subscribe_already_title')}
          message={t('footer.subscribe_already_message')}
          note={t('footer.subscribe_already_note')}
          closeLabel={t('footer.subscribe_success_close')}
          onClose={() => setShowAlreadySubscribed(false)}
        />
      )}
    </footer>
  );
};

export default Footer;
