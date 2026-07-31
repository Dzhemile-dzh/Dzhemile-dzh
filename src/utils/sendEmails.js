/**
 * Shared EmailJS helpers for Doarti (subscribe + purchase thank-you emails).
 */
import emailjs from '@emailjs/browser';

const ARTIST_EMAIL = 'dzhemile.ahmet@gmail.com';

export const getEmailJsConfig = () => ({
  serviceId: process.env.REACT_APP_EMAILJS_SERVICE_ID || '',
  publicKey: process.env.REACT_APP_EMAILJS_PUBLIC_KEY || '',
  contactTemplateId:
    process.env.REACT_APP_EMAILJS_CONTACT_TEMPLATE_ID ||
    process.env.REACT_APP_EMAILJS_TEMPLATE_ID ||
    '',
  // Dedicated thank-you templates (paste HTML from /email-templates).
  subscribeThankYouTemplateId:
    process.env.REACT_APP_EMAILJS_SUBSCRIBE_TEMPLATE_ID || '',
  purchaseThankYouTemplateId:
    process.env.REACT_APP_EMAILJS_PURCHASE_TEMPLATE_ID || '',
  // Artist alerts: optional dedicated IDs, else legacy TEMPLATE_ID.
  subscribeNotifyTemplateId:
    process.env.REACT_APP_EMAILJS_SUBSCRIBE_NOTIFY_TEMPLATE_ID ||
    process.env.REACT_APP_EMAILJS_TEMPLATE_ID ||
    '',
  purchaseNotifyTemplateId:
    process.env.REACT_APP_EMAILJS_PURCHASE_NOTIFY_TEMPLATE_ID ||
    process.env.REACT_APP_EMAILJS_TEMPLATE_ID ||
    '',
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
 * Thank-you email to the subscriber + optional artist notification.
 */
export const sendSubscribeEmails = async ({ subscriberEmail, language, copy }) => {
  const config = getEmailJsConfig();
  const locale = language === 'bg' ? 'bg' : 'en';
  let thankYouSent = false;

  if (config.subscribeThankYouTemplateId.length > 0) {
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
  }

  if (config.subscribeNotifyTemplateId.length > 0) {
    try {
      await sendTemplate(config.subscribeNotifyTemplateId, {
        to_email: ARTIST_EMAIL,
        reply_to: subscriberEmail,
        subscriber_email: subscriberEmail,
        subject: 'New newsletter subscription - Doarti',
        message: `New subscription from: ${subscriberEmail}\nDate: ${new Date().toLocaleString()}`,
      });
    } catch (error) {
      console.error('Subscribe notify email failed:', error);
    }
  }

  return thankYouSent;
};

/**
 * Thank-you email to the buyer + optional artist order notification.
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

  const thankYouSent = await sendTemplate(
    config.purchaseThankYouTemplateId,
    thankYouParams
  );

  if (config.purchaseNotifyTemplateId.length > 0) {
    try {
      await sendTemplate(config.purchaseNotifyTemplateId, {
        to_email: ARTIST_EMAIL,
        reply_to: customerEmail,
        customer_email: customerEmail,
        customer_name: thankYouParams.customer_name,
        product_title: order.productTitle,
        amount: order.amountFormatted,
        size: thankYouParams.size,
        shipping_address: thankYouParams.shipping_address,
        shipping_courier: thankYouParams.shipping_courier,
        order_id: order.orderId,
        subject: `New order - ${order.productTitle}`,
        message: `New paid order\n${order.productTitle}\n${order.amountFormatted}\n${customerEmail}\n${thankYouParams.shipping_address}`,
      });
    } catch (error) {
      console.error('Purchase notify email failed:', error);
    }
  }

  return thankYouSent;
};
