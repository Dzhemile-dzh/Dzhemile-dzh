/**
 * Shared email helpers for Doarti (subscribe + purchase thank-you emails).
 */
import emailjs from '@emailjs/browser';

const ARTIST_EMAIL = 'dzhemile.ahmet@gmail.com';
const FORMSUBMIT_ENDPOINT = `https://formsubmit.co/ajax/${ARTIST_EMAIL}`;

export const getEmailJsConfig = () => ({
  serviceId: process.env.REACT_APP_EMAILJS_SERVICE_ID || '',
  publicKey: process.env.REACT_APP_EMAILJS_PUBLIC_KEY || '',
  // Dedicated thank-you templates (paste HTML from /email-templates).
  subscribeThankYouTemplateId:
    process.env.REACT_APP_EMAILJS_SUBSCRIBE_TEMPLATE_ID || '',
  purchaseThankYouTemplateId:
    process.env.REACT_APP_EMAILJS_PURCHASE_TEMPLATE_ID || '',
});

export const isEmailJsConfigured = () => {
  const { serviceId, publicKey } = getEmailJsConfig();
  return serviceId.length > 0 && publicKey.length > 0;
};

const sendTemplate = async (templateId, params) => {
  const { serviceId, publicKey } = getEmailJsConfig();
  if (!isEmailJsConfigured() || typeof templateId !== 'string' || templateId.length === 0) {
    return false;
  }

  await emailjs.send(serviceId, templateId, params, publicKey);
  return true;
};

/**
 * Plain artist notification (no EmailJS template).
 */
const notifyArtist = async ({ subject, message, replyTo }) => {
  const response = await fetch(FORMSUBMIT_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({
      _subject: subject,
      message,
      email: typeof replyTo === 'string' && replyTo.length > 0 ? replyTo : ARTIST_EMAIL,
      _replyto: typeof replyTo === 'string' && replyTo.length > 0 ? replyTo : ARTIST_EMAIL,
      _captcha: 'false',
    }),
  });

  if (!response.ok) {
    throw new Error('Artist notification failed');
  }

  return true;
};

/**
 * Thank-you email to the subscriber + plain artist notification with subscriber email.
 */
export const sendSubscribeEmails = async ({ subscriberEmail, language, copy }) => {
  const config = getEmailJsConfig();
  const locale = language === 'bg' ? 'bg' : 'en';
  let thankYouSent = false;

  if (config.subscribeThankYouTemplateId.length > 0) {
    try {
      thankYouSent = await sendTemplate(config.subscribeThankYouTemplateId, {
        to_email: subscriberEmail,
        reply_to: ARTIST_EMAIL,
        subscriber_email: subscriberEmail,
        locale,
        subject: copy.subject,
        preheader: copy.preheader,
        headline: copy.headline,
        intro: copy.intro,
        body: copy.body,
        closing: copy.closing,
        cta_label: copy.ctaLabel,
        cta_url: 'https://www.doarti.com',
        site_name: 'Doarti',
        year: String(new Date().getFullYear()),
      });
    } catch (error) {
      console.error('Subscribe thank-you email failed:', error);
    }
  }

  try {
    await notifyArtist({
      subject: 'New Doarti newsletter subscription',
      replyTo: subscriberEmail,
      message: `New newsletter subscription on doarti.com

Subscriber email: ${subscriberEmail}
Date: ${new Date().toLocaleString()}`,
    });
  } catch (error) {
    console.error('Subscribe notify email failed:', error);
  }

  return thankYouSent;
};

/**
 * Thank-you email to the buyer + plain artist order notification.
 */
export const sendPurchaseEmails = async ({ order, language, copy }) => {
  const config = getEmailJsConfig();
  const locale = language === 'bg' ? 'bg' : 'en';
  const customerEmail = order.customerEmail;

  if (typeof customerEmail !== 'string' || customerEmail.length === 0) {
    return false;
  }

  const thankYouParams = {
    to_email: customerEmail,
    reply_to: ARTIST_EMAIL,
    customer_email: customerEmail,
    customer_name: order.customerName || copy.customerFallback,
    product_title: order.productTitle,
    product_type: order.productTypeLabel,
    amount: order.amountFormatted,
    size: order.size || copy.notApplicable,
    shipping_name: order.shippingName || order.customerName || copy.notApplicable,
    shipping_address: order.shippingAddress || copy.notApplicable,
    shipping_phone: order.shippingPhone || copy.notApplicable,
    shipping_courier: order.shippingCourier || copy.notApplicable,
    order_id: order.orderId,
    locale,
    subject: copy.subject,
    preheader: copy.preheader,
    headline: copy.headline,
    intro: copy.intro,
    order_details_title: copy.orderDetailsTitle,
    shipping_title: copy.shippingTitle,
    closing: copy.closing,
    cta_label: copy.ctaLabel,
    cta_url: 'https://www.doarti.com',
    site_name: 'Doarti',
    year: String(new Date().getFullYear()),
  };

  let thankYouSent = false;
  try {
    thankYouSent = await sendTemplate(
      config.purchaseThankYouTemplateId,
      thankYouParams
    );
  } catch (error) {
    console.error('Purchase thank-you email failed:', error);
  }

  try {
    await notifyArtist({
      subject: `New Doarti order - ${order.productTitle}`,
      replyTo: customerEmail,
      message: `New paid order on doarti.com

Customer: ${thankYouParams.customer_name}
Email: ${customerEmail}
Product: ${order.productTitle}
Type: ${order.productTypeLabel || ''}
Size: ${thankYouParams.size}
Amount: ${order.amountFormatted}
Shipping: ${thankYouParams.shipping_address}
Courier: ${thankYouParams.shipping_courier}
Phone: ${thankYouParams.shipping_phone}
Order ID: ${order.orderId}`,
    });
  } catch (error) {
    console.error('Purchase notify email failed:', error);
  }

  return thankYouSent;
};
