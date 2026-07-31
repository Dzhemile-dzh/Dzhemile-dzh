import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { isEmailJsConfigured, sendPurchaseEmails } from '../utils/sendEmails';

const emailSentKey = (sessionId) => `doarti_purchase_email_${sessionId}`;

const CheckoutSuccess = () => {
  const { t, language } = useLanguage();
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('session_id') || '';

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(sessionId.length > 0);
  const [loadError, setLoadError] = useState('');
  const [emailSent, setEmailSent] = useState(false);

  useEffect(() => {
    if (sessionId.length === 0) {
      setLoading(false);
      return;
    }

    let cancelled = false;

    const loadOrder = async () => {
      setLoading(true);
      setLoadError('');

      try {
        const response = await fetch(
          `/api/get-checkout-session?session_id=${encodeURIComponent(sessionId)}`
        );
        const data = await response.json().catch(() => ({}));

        if (!response.ok) {
          throw new Error(
            typeof data.error === 'string' ? data.error : 'Unable to load order'
          );
        }

        if (cancelled) {
          return;
        }

        setOrder(data);

        const alreadySent = sessionStorage.getItem(emailSentKey(sessionId)) === '1';
        if (alreadySent) {
          setEmailSent(true);
          return;
        }

        if (!isEmailJsConfigured()) {
          return;
        }

        const productTypeLabel =
          data.productType === 'print'
            ? t('emails.product_print')
            : t('emails.product_original');

        const sent = await sendPurchaseEmails({
          language,
          order: {
            ...data,
            productTypeLabel,
          },
          copy: {
            subject: t('emails.purchase_subject'),
            preheader: t('emails.purchase_preheader'),
            headline: t('emails.purchase_headline'),
            intro: t('emails.purchase_intro'),
            orderDetailsTitle: t('emails.purchase_order_title'),
            shippingTitle: t('emails.purchase_shipping_title'),
            closing: t('emails.purchase_closing'),
            ctaLabel: t('emails.purchase_cta'),
            customerFallback: t('emails.customer_fallback'),
            notApplicable: t('emails.not_applicable'),
          },
        });

        if (!cancelled && sent) {
          sessionStorage.setItem(emailSentKey(sessionId), '1');
          setEmailSent(true);
        }
      } catch (error) {
        console.error('Checkout success load error:', error);
        if (!cancelled) {
          setLoadError(
            typeof error.message === 'string' && error.message.length > 0
              ? error.message
              : t('shop.checkout_error')
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadOrder();

    return () => {
      cancelled = true;
    };
    // language only: `t` is recreated each render
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionId, language]);

  const na = t('emails.not_applicable');

  return (
    <div className="container py-5">
      <div className="text-center mb-4">
        <h2 className="mb-3">{t('shop.success_title')}</h2>
        <p className="mb-2">{t('shop.success_message')}</p>
        {emailSent && <p className="text-muted mb-0">{t('shop.success_email_sent')}</p>}
      </div>

      {loading && <p className="text-center text-muted">{t('shop.success_loading')}</p>}

      {!loading && loadError.length > 0 && (
        <p className="text-center text-danger">{loadError}</p>
      )}

      {!loading && order && (
        <div className="row justify-content-center mb-4">
          <div className="col-lg-8">
            <div className="mb-4">
              <h3 className="h5 mb-3">{t('shop.success_order_title')}</h3>
              <p className="mb-1">
                <strong>{order.productTitle}</strong>
              </p>
              {order.size && order.size.length > 0 && (
                <p className="mb-1 text-muted">{order.size}</p>
              )}
              <p className="mb-0" style={{ color: '#2563eb', fontWeight: 700 }}>
                {order.amountFormatted || na}
              </p>
            </div>

            <div className="mb-2">
              <h3 className="h5 mb-3">{t('shop.success_shipping_title')}</h3>
              <p className="mb-1">{order.shippingName || order.customerName || na}</p>
              <p className="mb-1">{order.shippingAddress || na}</p>
              <p className="mb-1">{order.shippingPhone || na}</p>
              <p className="mb-0">{order.shippingCourier || na}</p>
            </div>
          </div>
        </div>
      )}

      <div className="text-center">
        <Link to="/prints" className="btn custom-btn me-2">
          {t('prints.back')}
        </Link>
        <Link to="/" className="btn btn-outline-secondary">
          {t('back_to_home')}
        </Link>
      </div>
    </div>
  );
};

export default CheckoutSuccess;
