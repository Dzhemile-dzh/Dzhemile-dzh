import React, { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';

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

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Create email content with a proper subject and heading
      const subject = `New Contact Form Submission from ${formData.fullName}`;
      const emailBody = `
Hello Dzhemile,

You have received a new contact form submission:

Name: ${formData.fullName}
Email: ${formData.email}

Message:
${formData.message}

---
This message was sent from your art website contact form.
      `.trim();

      // Open the default email client
      window.location.href = `mailto:dzhemile.ahmet@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(emailBody)}`;
      
      // Show custom success popup
      setShowSuccessPopup(true);
      setFormData({ fullName: '', email: '', message: '' });
      setShowPopup(false);
    } catch (error) {
      console.error('Error submitting form:', error);
      alert(t('contact.popup_error'));
    } finally {
      setIsSubmitting(false);
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
                  <p className="success-note">{t('contact.success_note') || 'Your email client should have opened with a pre-filled message. Please send the email to complete the process.'}</p>
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
