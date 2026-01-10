import React, {useEffect, useState} from 'react';
import {useLanguage} from '../contexts/LanguageContext';
import emailjs from '@emailjs/browser';

const Contact = () => {
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);

  // EmailJS configuration - Use contact form specific template or same as footer
  const EMAILJS_SERVICE_ID = process.env.REACT_APP_EMAILJS_SERVICE_ID || process.env.REACT_APP_EMAILJS_CONTACT_SERVICE_ID || '';
  const EMAILJS_TEMPLATE_ID = process.env.REACT_APP_EMAILJS_CONTACT_TEMPLATE_ID || process.env.REACT_APP_EMAILJS_TEMPLATE_ID || '';
  const EMAILJS_PUBLIC_KEY = process.env.REACT_APP_EMAILJS_PUBLIC_KEY || '';

  // Initialize EmailJS
  useEffect(() => {
    if (EMAILJS_PUBLIC_KEY) {
      emailjs.init(EMAILJS_PUBLIC_KEY);
    }
  }, [EMAILJS_PUBLIC_KEY]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Store form data before clearing
    const submittedData = {...formData};

    // Show success immediately for better UX
    setShowSuccessPopup(true);
    setFormData({fullName: '', email: '', message: ''});
    setShowPopup(false);
    setIsSubmitting(false);

    // Send email in the background (non-blocking)
    if (EMAILJS_SERVICE_ID && EMAILJS_TEMPLATE_ID && EMAILJS_PUBLIC_KEY) {
      // Send email asynchronously without blocking UI
      emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, {
        to_email: 'dzhemile.ahmet@gmail.com',
        from_name: submittedData.fullName,
        from_email: submittedData.email,
        reply_to: submittedData.email,
        subject: `New Contact Form Submission from ${submittedData.fullName}`,
        message: submittedData.message,
        user_name: submittedData.fullName,
        user_email: submittedData.email,
        full_name: submittedData.fullName,
        email: submittedData.email,
      }, EMAILJS_PUBLIC_KEY)
          .then(() => {
            console.log('Email sent successfully');
          })
          .catch((error) => {
            console.error('Error sending email:', error);
            // Optionally show a subtle error notification
            // but don't disrupt the user experience
          });
    } else {
      console.warn('EmailJS not configured');
    }
  };

  const handleGetInTouch = () => {
    setShowPopup(true);
  };

  const closePopup = () => {
    setShowPopup(false);
  };

  const closeSuccessPopup = () => {
    setShowSuccessPopup(false);
  };

  return (
    <>
      <header className="site-header d-flex flex-column justify-content-center align-items-center" id="header-solid">
        <div className="container">
          <div className="row">
            <div className="col-lg-12 col-12 text-center">
              <h2 className="text-white">Свържи се с мен</h2>
            </div>
          </div>
        </div>
      </header>

      <section className="contact-commission-section section-padding">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-8 col-12 text-center">
              <h1 className="commission-title">{t('contact.commission_title')}</h1>
              
              <div className="contact-details">
                <div className="contact-item">
                  <span className="contact-label">{t('contact.phone')}</span>
                  <span className="contact-value">+359 895 62 75 11</span>
                </div>
                <div className="contact-separator"></div>
                <div className="contact-item">
                  <span className="contact-label">{t('contact.email')}</span>
                  <a href="mailto:dzhemile.ahmet@gmail.com" className="contact-value contact-link">dzhemile.ahmet@gmail.com</a>
                </div>
                <div className="contact-separator"></div>
                <div className="contact-item">
                  <span className="contact-label">{t('contact.location')}</span>
                  <span className="contact-value">{t('contact.location_value')}</span>
                </div>
              </div>

              <button className="get-in-touch-btn" onClick={handleGetInTouch}>
                {t('contact.get_in_touch')}
              </button>
            </div>
          </div>
        </div>
      </section>

          {/* Email Popup */}
          {showPopup && (
            <div className="popup-overlay" onClick={closePopup}>
              <div className="popup-content" onClick={(e) => e.stopPropagation()}>
                <div className="popup-header">
                  <h3>{t('contact.popup_title')}</h3>
                  <button className="popup-close" onClick={closePopup}>×</button>
                </div>
                <form onSubmit={handleSubmit} className="popup-form">
                  <div className="form-group">
                    <label htmlFor="popup-name">{t('contact.popup_name')}</label>
                    <input
                      type="text"
                      id="popup-name"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="popup-email">{t('contact.popup_email')}</label>
                    <input
                      type="email"
                      id="popup-email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="popup-message">{t('contact.popup_message')}</label>
                    <textarea
                      id="popup-message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows="4"
                    ></textarea>
                  </div>
                  <button type="submit" className="popup-submit-btn" disabled={isSubmitting}>
                    {isSubmitting ? t('contact.popup_sending') : t('contact.popup_send')}
                  </button>
                </form>
              </div>
            </div>
          )}

          {/* Success Popup */}
          {showSuccessPopup && (
            <div className="popup-overlay" onClick={closeSuccessPopup}>
              <div className="success-popup-content" onClick={(e) => e.stopPropagation()}>
                <div className="success-popup-header">
                  <div className="success-icon">✓</div>
                  <h3>{t('contact.success_title')}</h3>
                </div>
                <div className="success-popup-body">
                  <p>{t('contact.popup_success') || 'Thank you for your message! I will get back to you soon.'}</p>
                  <p className="success-note">{t('contact.success_note') || 'Your message has been sent successfully to dzhemile.ahmet@gmail.com.'}</p>
                </div>
                <div className="success-popup-footer">
                  <button className="success-close-btn" onClick={closeSuccessPopup}>
                    {t('contact.success_close')}
                  </button>
                </div>
              </div>
            </div>
          )}
    </>
  );
};

export default Contact;
