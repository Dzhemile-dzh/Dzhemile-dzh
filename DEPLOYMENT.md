# Production Deployment Guide for www.doarti.com

## Pre-Deployment Checklist

### 1. Environment Variables
Make sure your `.env` / Vercel Environment Variables contain production values:
```
REACT_APP_EMAILJS_PUBLIC_KEY=your_production_key
REACT_APP_EMAILJS_SERVICE_ID=your_service_id
REACT_APP_EMAILJS_TEMPLATE_ID=your_template_id
REACT_APP_EMAILJS_SUBSCRIBE_TEMPLATE_ID=your_subscribe_thank_you_template_id
REACT_APP_EMAILJS_PURCHASE_TEMPLATE_ID=your_purchase_thank_you_template_id

# Stripe Checkout (required for Buy Now on prints & originals)
STRIPE_SECRET_KEY=sk_live_or_sk_test_...
REACT_APP_STRIPE_PUBLISHABLE_KEY=pk_live_or_pk_test_...
```

**EmailJS thank-you emails:**
1. In EmailJS, create two templates from `email-templates/subscribe-thank-you.html` and `email-templates/purchase-thank-you.html`.
2. Set **To email** to `{{to_email}}` and **Subject** to `{{subject}}`.
3. Add `REACT_APP_EMAILJS_SUBSCRIBE_TEMPLATE_ID` and `REACT_APP_EMAILJS_PURCHASE_TEMPLATE_ID` in Vercel.
4. Keep `REACT_APP_EMAILJS_TEMPLATE_ID` only if you still use it elsewhere; artist alerts for new subscribers/orders are plain FormSubmit emails (no EmailJS template).
5. Redeploy after changing any `REACT_APP_*` value (they are baked into the frontend build).

**Contact form:** sends to `dzhemile.ahmet@gmail.com` via FormSubmit - no EmailJS template. Confirm the address once if FormSubmit asks.

**Stripe setup (Vercel):**
1. Create a Stripe account and get API keys from the Dashboard.
2. Add `STRIPE_SECRET_KEY` as a Vercel environment variable (Production + Preview).
3. Redeploy. The `/api/create-checkout-session` function creates hosted Checkout sessions. After payment, `/api/get-checkout-session` loads order details for the success page and purchase email.
4. Optional: set a `paymentLink` on any print in `src/data/prints.js` to use a Stripe Payment Link instead of the API.
5. Test with `sk_test_...` keys first (card `4242 4242 4242 4242`).

**Note:** The contact form sends messages directly to dzhemile.ahmet@gmail.com via FormSubmit (no EmailJS template). On first use, FormSubmit may email you once to confirm the address. Subscribe and purchase thank-you emails still use EmailJS templates.

### 2. Build the Production Version
```bash
npm run build
```

This creates an optimized `build` folder with:
- Minified JavaScript and CSS
- Optimized images
- Production-ready static files

## Deployment Options

### Option 1: Netlify (Recommended - Free & Easy)

1. **Sign up** at [netlify.com](https://www.netlify.com)

2. **Connect your repository** (GitHub/GitLab/Bitbucket) or drag & drop the `build` folder

3. **Configure build settings:**
   - Build command: `npm run build`
   - Publish directory: `build`
   - Environment variables: Add your EmailJS keys in Netlify dashboard

4. **Custom domain setup:**
   - Go to Domain settings
   - Add custom domain: `www.doarti.com`
   - Follow DNS instructions to point your domain to Netlify

5. **Deploy!** Your site will be live at www.doarti.com

### Option 2: Vercel (Recommended - Free & Fast)

1. **Sign up** at [vercel.com](https://vercel.com)

2. **Import your project** from Git or upload the `build` folder

3. **Configure:**
   - Framework Preset: Create React App
   - Build Command: `npm run build`
   - Output Directory: `build`
   - Environment Variables: Add your EmailJS keys

4. **Add custom domain:**
   - Go to Project Settings → Domains
   - Add `www.doarti.com`
   - Update your DNS records as instructed

### Option 3: Traditional Web Hosting (cPanel/Apache)

If you have traditional hosting (like cPanel):

1. **Build the project:**
   ```bash
   npm run build
   ```

2. **Upload files:**
   - Upload ALL contents of the `build` folder to your `public_html` or `www` directory
   - Make sure `.htaccess` is uploaded (it's in the build folder)

3. **Configure DNS:**
   - Point `www.doarti.com` to your hosting server's IP
   - Add A record: `www` → your server IP
   - Add CNAME record: `doarti.com` → `www.doarti.com` (optional)

4. **Verify .htaccess:**
   - Ensure `.htaccess` file is in the root directory
   - It handles React Router client-side routing

5. **Set environment variables:**
   - For EmailJS, the variables are baked into the build
   - Make sure your `.env` file has production values before building

### Option 4: GitHub Pages (Free)

1. **Install gh-pages:**
   ```bash
   npm install --save-dev gh-pages
   ```

2. **Update package.json:**
   ```json
   "scripts": {
     "predeploy": "npm run build",
     "deploy": "gh-pages -d build"
   }
   ```

3. **Deploy:**
   ```bash
   npm run deploy
   ```

4. **Configure custom domain** in GitHub Pages settings

## Post-Deployment Steps

### 1. Test Your Site
- [ ] Homepage loads correctly
- [ ] All images display properly
- [ ] Navigation works (all routes)
- [ ] Language switching works
- [ ] Contact form works
- [ ] Email subscription works
- [ ] All paintings display correctly
- [ ] Mobile responsive design works

### 2. SEO Verification
- [ ] Google Search Console: Add and verify www.doarti.com
- [ ] Submit sitemap: `https://www.doarti.com/sitemap.xml`
- [ ] Test meta tags with [Facebook Debugger](https://developers.facebook.com/tools/debug/)
- [ ] Test with [Google Rich Results Test](https://search.google.com/test/rich-results)

### 3. Performance
- [ ] Test with [PageSpeed Insights](https://pagespeed.web.dev/)
- [ ] Verify images are optimized
- [ ] Check loading times

### 4. SSL Certificate
- [ ] Ensure HTTPS is enabled (most hosting providers do this automatically)
- [ ] Test: `https://www.doarti.com`

## Important Notes

1. **React Router**: The `.htaccess` file handles client-side routing. Make sure it's uploaded.

2. **Environment Variables**: EmailJS keys are baked into the build. Update `.env` before building.

3. **Images**: All images in `public/images/` are included in the build.

4. **Build Folder**: Only upload the contents of the `build` folder, not the folder itself.

5. **Domain Configuration**: 
   - Point `www.doarti.com` to your hosting
   - Consider redirecting `doarti.com` → `www.doarti.com` (or vice versa)

## Troubleshooting

### Images Not Loading
- Check image paths are correct
- Verify images are in `public/images/` folder
- Check browser console for 404 errors

### 404 Errors on Routes
- Ensure `.htaccess` is uploaded and working
- For Netlify: Create `_redirects` file in `public` folder with: `/* /index.html 200`
- For Vercel: Create `vercel.json` with rewrite rules

### EmailJS Not Working
- Verify environment variables are set in hosting dashboard
- Check EmailJS dashboard for service status
- Test with browser console for errors

## Quick Build Command

```bash
# Build for production
npm run build

# The build folder is ready to deploy!
```

## Support

If you encounter issues:
1. Check browser console for errors
2. Verify all files are uploaded correctly
3. Check hosting provider logs
4. Test locally first: `npm run build && npx serve -s build`
