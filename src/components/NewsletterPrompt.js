import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { sendSubscribeEmails } from '../utils/sendEmails';
import {
  markNewsletterDismissed,
  markNewsletterSubscribed,
  shouldShowNewsletterPrompt,
} from '../utils/cookies';
import SuccessModal from './SuccessModal';
import './NewsletterPrompt.css';

const SHOW_DELAY_MS = 4500;

const NewsletterPrompt = () => {
  const { t, language } = useLanguage();
  const location = useLocation();
  const [visible, setVisible] = useState(false);
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [showAlreadySubscribed, setShowAlreadySubscribed] = useState(false);

  useEffect(() => {
    if (location.pathname.startsWith('/checkout')) {
      setVisible(false);
      return undefined;
    }

    if (!shouldShowNewsletterPrompt()) {
      setVisible(false);
      return undefined;
    }

    const timer = window.setTimeout(() => {
      if (shouldShowNewsletterPrompt()) {
        setVisible(true);
      }
    }, SHOW_DELAY_MS);

    return () => window.clearTimeout(timer);
  }, [location.pathname]);

  const handleDismiss = () => {
    markNewsletterDismissed();
    setVisible(false);
    setError('');
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    const trimmed = email.trim();
    if (trimmed.length === 0) {
      setError(t('newsletter.error_empty'));
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmed)) {
      setError(t('newsletter.error_invalid'));
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: trimmed }),
      });
      const data = await response.json().catch(() => ({}));

      if (response.status === 409 || data.error === 'already_subscribed') {
        markNewsletterSubscribed();
        setVisible(false);
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
          subscriberEmail: trimmed,
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
        console.error('Newsletter prompt email error:', emailError);
      }

      markNewsletterSubscribed();
      setEmail('');
      setVisible(false);
      setShowSuccess(true);
    } catch (submitError) {
      console.error('Newsletter prompt error:', submitError);
      setError(t('newsletter.error_general'));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {visible && (
        <aside
          className="newsletter-prompt"
          role="dialog"
          aria-modal="false"
          aria-labelledby="newsletter-prompt-title"
        >
          <button
            type="button"
            className="newsletter-prompt__close"
            onClick={handleDismiss}
            aria-label={t('newsletter.dismiss')}
          >
            ×
          </button>

          <div className="newsletter-prompt__inner">
            <div className="newsletter-prompt__copy">
              <p className="newsletter-prompt__eyebrow">{t('newsletter.eyebrow')}</p>
              <h2 id="newsletter-prompt-title" className="newsletter-prompt__title">
                {t('newsletter.title')}
              </h2>
              <p className="newsletter-prompt__text">{t('newsletter.text')}</p>
            </div>

            <form className="newsletter-prompt__form" onSubmit={handleSubmit}>
              <label className="sr-only" htmlFor="newsletter-prompt-email">
                {t('newsletter.email_placeholder')}
              </label>
              <input
                id="newsletter-prompt-email"
                type="email"
                name="newsletter-email"
                autoComplete="email"
                placeholder={t('newsletter.email_placeholder')}
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (error.length > 0) {
                    setError('');
                  }
                }}
                required
              />
              <button type="submit" disabled={isSubmitting}>
                {isSubmitting ? t('newsletter.sending') : t('newsletter.subscribe')}
              </button>
            </form>

            {error.length > 0 && (
              <p className="newsletter-prompt__error" role="alert">
                {error}
              </p>
            )}

            <button
              type="button"
              className="newsletter-prompt__later"
              onClick={handleDismiss}
            >
              {t('newsletter.dismiss')}
            </button>
          </div>
        </aside>
      )}

      {showSuccess && (
        <SuccessModal
          title={t('footer.subscribe_success_title')}
          message={t('footer.subscribe_success_message')}
          note={t('footer.subscribe_success_note')}
          closeLabel={t('footer.subscribe_success_close')}
          onClose={() => setShowSuccess(false)}
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
    </>
  );
};

export default NewsletterPrompt;
