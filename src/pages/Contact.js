import React, { useEffect, useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import './Contact.css';

const CONTACT_EMAIL = 'dzhemile.ahmet@gmail.com';
const FORMSUBMIT_ENDPOINT = `https://formsubmit.co/ajax/${CONTACT_EMAIL}`;

const Contact = () => {
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [formError, setFormError] = useState('');
  const [entered, setEntered] = useState(false);

  useEffect(() => {
    const frame = requestAnimationFrame(() => setEntered(true));
    return () => cancelAnimationFrame(frame);
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    if (formError.length > 0) {
      setFormError('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFormError('');

    const submittedData = { ...formData };

    try {
      const response = await fetch(FORMSUBMIT_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          name: submittedData.fullName,
          email: submittedData.email,
          message: submittedData.message,
          _subject: `Doarti contact - ${submittedData.fullName}`,
          _replyto: submittedData.email,
          _captcha: 'false',
        }),
      });

      const result = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(
          typeof result.message === 'string' ? result.message : 'Send failed'
        );
      }

      setFormData({ fullName: '', email: '', message: '' });
      setShowSuccessPopup(true);
    } catch (error) {
      console.error('Error sending contact email:', error);
      setFormError(t('contact.popup_error'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const closeSuccessPopup = () => {
    setShowSuccessPopup(false);
  };

  return (
    <>
      <header
        className="site-header d-flex flex-column justify-content-center align-items-center"
        id="header-solid"
      >
        <div className="container">
          <div className="row">
            <div className="col-lg-12 col-12 text-center">
              <h2 className="text-white">{t('contact.contact_me_header')}</h2>
            </div>
          </div>
        </div>
      </header>

      <section
        className={`contact-page section-padding${entered ? ' contact-page--entered' : ''}`}
      >
        <div className="container">
          <div className="row g-5 align-items-start">
            <div className="col-lg-5 col-12">
              <div className="contact-page__intro contact-page__reveal contact-page__reveal--1">
                <p className="contact-page__eyebrow">{t('contact.commission_title')}</p>
                <h1 className="contact-page__title">{t('contact.page_title')}</h1>
                <p className="contact-page__lead">{t('contact.intro')}</p>
                <p className="contact-page__note">{t('contact.response_note')}</p>
              </div>

              <ul className="contact-channels contact-page__reveal contact-page__reveal--2">
                <li>
                  <a className="contact-channel" href={`mailto:${CONTACT_EMAIL}`}>
                    <span className="contact-channel__label">{t('contact.email')}</span>
                    <span className="contact-channel__value">{CONTACT_EMAIL}</span>
                  </a>
                </li>
                <li>
                  <a className="contact-channel" href="tel:+359895627511">
                    <span className="contact-channel__label">{t('contact.phone')}</span>
                    <span className="contact-channel__value">+359 895 627 511</span>
                  </a>
                </li>
                <li>
                  <a
                    className="contact-channel"
                    href="viber://chat?number=0895627511"
                  >
                    <span className="contact-channel__label">{t('contact.viber')}</span>
                    <span className="contact-channel__value">{t('contact.viber_value')}</span>
                  </a>
                </li>
                <li>
                  <a
                    className="contact-channel"
                    href="https://www.instagram.com/doarti42/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <span className="contact-channel__label">{t('contact.instagram')}</span>
                    <span className="contact-channel__value">@doarti42</span>
                  </a>
                </li>
              </ul>
            </div>

            <div className="col-lg-7 col-12">
              <div className="contact-form-panel contact-page__reveal contact-page__reveal--3">
                <h2 className="contact-form-panel__title">{t('contact.form_title')}</h2>
                <p className="contact-form-panel__subtitle">{t('contact.form_subtitle')}</p>

                <form onSubmit={handleSubmit} className="contact-form" noValidate>
                  <div className="contact-form__field">
                    <label htmlFor="contact-name">{t('contact.popup_name')}</label>
                    <input
                      type="text"
                      id="contact-name"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      autoComplete="name"
                      required
                    />
                  </div>

                  <div className="contact-form__field">
                    <label htmlFor="contact-email">{t('contact.popup_email')}</label>
                    <input
                      type="email"
                      id="contact-email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      autoComplete="email"
                      required
                    />
                  </div>

                  <div className="contact-form__field">
                    <label htmlFor="contact-message">{t('contact.popup_message')}</label>
                    <textarea
                      id="contact-message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows="6"
                    ></textarea>
                  </div>

                  {formError.length > 0 && (
                    <p className="contact-form__error" role="alert">
                      {formError}
                    </p>
                  )}

                  <button
                    type="submit"
                    className="contact-form__submit"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? t('contact.popup_sending') : t('contact.popup_send')}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      {showSuccessPopup && (
        <div className="popup-overlay contact-success-overlay" onClick={closeSuccessPopup}>
          <div
            className="contact-success-dialog"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="contact-success-title"
          >
            <div className="contact-success-dialog__icon" aria-hidden="true">
              ✓
            </div>
            <h3 id="contact-success-title">{t('contact.success_title')}</h3>
            <p>{t('contact.popup_success')}</p>
            <p className="contact-success-dialog__note">{t('contact.success_note')}</p>
            <button className="contact-form__submit" onClick={closeSuccessPopup}>
              {t('contact.success_close')}
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Contact;
