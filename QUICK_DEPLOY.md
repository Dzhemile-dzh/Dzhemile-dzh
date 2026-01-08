# Quick Deployment Guide for www.doarti.com

## ✅ Your app is ready for production!

The build has been created successfully. Here's what to do next:

## 🚀 Fastest Deployment Options

### Option 1: Netlify (5 minutes - Recommended)
1. Go to [netlify.com](https://www.netlify.com) and sign up (free)
2. Drag and drop your `build` folder onto Netlify
3. Add custom domain: `www.doarti.com`
4. Update DNS as instructed
5. Done! Your site is live.

### Option 2: Vercel (5 minutes)
1. Go to [vercel.com](https://vercel.com) and sign up (free)
2. Import your project or upload `build` folder
3. Add domain: `www.doarti.com`
4. Update DNS
5. Done!

### Option 3: Traditional Hosting (cPanel/FTP)
1. Upload ALL contents of `build` folder to your `public_html` or `www` directory
2. Make sure `.htaccess` file is uploaded (it's in the build folder)
3. Point your domain DNS to your hosting server
4. Done!

## 📋 Pre-Deployment Checklist

- ✅ Build completed successfully
- ✅ Environment variables set in `.env` file
- ✅ Homepage configured: `https://www.doarti.com`
- ✅ `.htaccess` file ready for Apache servers
- ✅ All images in `public/images/` included

## 🔑 Environment Variables (Already Set)

Your EmailJS configuration is in `.env`:
- ✅ REACT_APP_EMAILJS_PUBLIC_KEY
- ✅ REACT_APP_EMAILJS_SERVICE_ID  
- ✅ REACT_APP_EMAILJS_TEMPLATE_ID

These are baked into the build, so they're ready to go!

## 📁 What to Upload

**For traditional hosting:** Upload everything INSIDE the `build` folder to your web root:
```
build/
├── index.html
├── static/
├── images/
├── .htaccess
└── ... (all other files)
```

**For Netlify/Vercel:** Just drag the `build` folder or connect your Git repository.

## 🌐 DNS Configuration

Point your domain to your hosting:
- **A Record**: `www` → Your server IP (for traditional hosting)
- **CNAME**: `www` → Your Netlify/Vercel URL (for cloud hosting)

## ✅ Post-Deployment Testing

After deployment, test:
1. ✅ Homepage loads: `https://www.doarti.com`
2. ✅ All routes work (try `/gallery/2024`, `/about`, etc.)
3. ✅ Images display correctly
4. ✅ Language switching works
5. ✅ Contact form works
6. ✅ Email subscription works

## 🆘 Need Help?

See `DEPLOYMENT.md` for detailed instructions and troubleshooting.

## 🎉 You're Ready!

Your production build is in the `build` folder. Just upload it and configure your domain!
