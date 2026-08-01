const ONE_DAY_SECONDS = 60 * 60 * 24;

export const NEWSLETTER_COOKIE = {
  subscribed: 'doarti_nl_subscribed',
  dismissed: 'doarti_nl_dismissed',
};

export const getCookie = (name) => {
  if (typeof document === 'undefined' || typeof name !== 'string' || name.length === 0) {
    return '';
  }

  const encodedName = `${encodeURIComponent(name)}=`;
  const parts = document.cookie.split(';');

  for (const part of parts) {
    const trimmed = part.trim();
    if (trimmed.startsWith(encodedName)) {
      return decodeURIComponent(trimmed.slice(encodedName.length));
    }
  }

  return '';
};

export const setCookie = (name, value, days) => {
  if (typeof document === 'undefined' || typeof name !== 'string' || name.length === 0) {
    return;
  }

  const maxAge =
    typeof days === 'number' && Number.isFinite(days)
      ? Math.max(0, Math.floor(days * ONE_DAY_SECONDS))
      : ONE_DAY_SECONDS * 30;

  const secure =
    typeof window !== 'undefined' && window.location.protocol === 'https:'
      ? '; Secure'
      : '';

  document.cookie = `${encodeURIComponent(name)}=${encodeURIComponent(
    value
  )}; Path=/; Max-Age=${maxAge}; SameSite=Lax${secure}`;
};

export const hasNewsletterSubscribed = () =>
  getCookie(NEWSLETTER_COOKIE.subscribed) === '1';

export const hasNewsletterDismissed = () =>
  getCookie(NEWSLETTER_COOKIE.dismissed) === '1';

export const markNewsletterSubscribed = () => {
  setCookie(NEWSLETTER_COOKIE.subscribed, '1', 365);
  setCookie(NEWSLETTER_COOKIE.dismissed, '1', 365);
};

export const markNewsletterDismissed = () => {
  setCookie(NEWSLETTER_COOKIE.dismissed, '1', 14);
};

export const shouldShowNewsletterPrompt = () =>
  !hasNewsletterSubscribed() && !hasNewsletterDismissed();
