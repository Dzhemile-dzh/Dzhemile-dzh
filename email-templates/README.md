# EmailJS templates for Doarti

Paste these HTML files into EmailJS (Email Templates → Create template → HTML / Code editor).

## Required template settings

For each thank-you template:
- **To email:** `{{to_email}}`
- **Subject:** `{{subject}}`
- **From name:** Doarti / Dzhemile Ahmed

## Files

1. `subscribe-thank-you.html` → create template, copy ID to `REACT_APP_EMAILJS_SUBSCRIBE_TEMPLATE_ID`
2. `purchase-thank-you.html` → create template, copy ID to `REACT_APP_EMAILJS_PURCHASE_TEMPLATE_ID`

Optional artist notifications:
- `REACT_APP_EMAILJS_SUBSCRIBE_NOTIFY_TEMPLATE_ID` (new subscriber alert to you)
- `REACT_APP_EMAILJS_PURCHASE_NOTIFY_TEMPLATE_ID` (new paid order alert to you)

## Vercel / `.env`

```
REACT_APP_EMAILJS_SERVICE_ID=...
REACT_APP_EMAILJS_PUBLIC_KEY=...
REACT_APP_EMAILJS_SUBSCRIBE_TEMPLATE_ID=...
REACT_APP_EMAILJS_PURCHASE_TEMPLATE_ID=...
```

Redeploy after adding `REACT_APP_*` variables (they are baked into the frontend build).
