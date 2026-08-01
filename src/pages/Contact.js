import React, { useEffect, useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import SuccessModal from '../components/SuccessModal';
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

  const channels = [
    {
      key: 'email',
      href: `mailto:${CONTACT_EMAIL}`,
      label: t('contact.email'),
      value: CONTACT_EMAIL,
      icon: 'bi-envelope',
      external: false,
    },
    {
      key: 'phone',
      href: 'tel:+359895627511',
      label: t('contact.phone'),
      value: '+359 895 627 511',
      icon: 'bi-telephone',
      external: false,
    },
    {
      key: 'viber',
      href: 'viber://chat?number=0895627511',
      label: t('contact.viber'),
      value: t('contact.viber_value'),
      icon: 'bi-chat-dots',
      external: false,
    },
    {
      key: 'telegram',
      href: 'https://t.me/+359895627511',
      label: t('contact.telegram'),
      value: '+359 895 627 511',
      icon: 'bi-telegram',
      external: true,
    },
    {
      key: 'instagram',
      href: 'https://www.instagram.com/doarti42/',
      label: t('contact.instagram'),
      value: '@doarti42',
      icon: 'bi-instagram',
      external: true,
    },
  ];

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
        className={`contact-page${entered ? ' contact-page--entered' : ''}`}
      >
        <div className="contact-page__atmosphere" aria-hidden="true">
          <span className="contact-page__orb contact-page__orb--a" />
          <span className="contact-page__orb contact-page__orb--b" />
          <span className="contact-page__stroke contact-page__stroke--1" />
          <span className="contact-page__stroke contact-page__stroke--2" />
        </div>

        <div className="container contact-page__shell">
          <div className="contact-page__grid">
            <div className="contact-page__aside contact-page__reveal contact-page__reveal--1">
              <p className="contact-page__eyebrow">{t('contact.commission_title')}</p>
              <h1 className="contact-page__title">{t('contact.page_title')}</h1>
              <p className="contact-page__lead">{t('contact.intro')}</p>
              <p className="contact-page__note">{t('contact.response_note')}</p>

              <ul className="contact-channels contact-page__reveal contact-page__reveal--2">
                {channels.map((channel) => (
                  <li key={channel.key}>
                    <a
                      className="contact-channel"
                      href={channel.href}
                      {...(channel.external
                        ? { target: '_blank', rel: 'noopener noreferrer' }
                        : {})}
                    >
                      <span className="contact-channel__icon" aria-hidden="true">
                        <i className={`bi ${channel.icon}`} />
                      </span>
                      <span className="contact-channel__text">
                        <span className="contact-channel__label">{channel.label}</span>
                        <span className="contact-channel__value">{channel.value}</span>
                      </span>
                      <span className="contact-channel__arrow" aria-hidden="true">
                        →
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div className="contact-form-panel contact-page__reveal contact-page__reveal--3">
              <div className="contact-form-panel__header">
                <h2 className="contact-form-panel__title">{t('contact.form_title')}</h2>
                <p className="contact-form-panel__sub">{t('contact.form_subtitle')}</p>
              </div>

              <form onSubmit={handleSubmit} className="contact-form" noValidate>
                <div className="contact-form__row">
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
      </section>

      {showSuccessPopup && (
        <SuccessModal
          title={t('contact.success_title')}
          message={t('contact.popup_success')}
          note={t('contact.success_note')}
          closeLabel={t('contact.success_close')}
          onClose={closeSuccessPopup}
        />
      )}
    </>
  );
};

export default Contact;
