# Doarti Art Gallery - React.js Version

This is a modern React.js version of the Doarti art gallery website, optimized for performance and loading times.

## Features

- ⚡ **Fast Loading**: Optimized with lazy loading, code splitting, and performance best practices
- 🌍 **Internationalization**: Support for English and Bulgarian languages
- 📱 **Responsive Design**: Mobile-first approach with Bootstrap
- 🎨 **Modern UI**: Clean, modern interface with smooth animations
- 🚀 **SPA**: Single Page Application with React Router
- 💾 **State Management**: Context API for language switching
- 🖼️ **Image Optimization**: Lazy loading and optimized images

## Performance Optimizations

1. **Lazy Loading**: Images and components load only when needed
2. **Code Splitting**: Routes are loaded on demand
3. **Optimized Bundle**: Tree shaking and minification
4. **Caching**: Browser caching for static assets
5. **Preloading**: Critical resources are preloaded
6. **Compression**: Gzip compression for assets

## Setup Instructions

### Prerequisites

- Node.js (version 14 or higher)
- npm or yarn

### Installation

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Copy Assets**
   Copy the following directories from your PHP project to the `public` folder:
   - `images/` → `public/images/`
   - `css/` → `public/css/`
   - `js/` → `public/js/`
   - `fonts/` → `public/fonts/`

3. **Start Development Server**
   ```bash
   npm start
   ```

4. **Build for Production**
   ```bash
   npm run build
   ```

### File Structure

```
src/
├── components/
│   ├── Header.js          # Navigation component
│   └── Footer.js          # Footer component
├── contexts/
│   └── LanguageContext.js # Language management
├── data/
│   └── translations.js    # Translation data
├── pages/
│   ├── Home.js           # Homepage
│   ├── About.js          # About page
│   ├── Contact.js        # Contact page
│   ├── Gallery.js        # Gallery page
│   └── PaintingDetail.js # Individual painting page
├── App.js                # Main app component
├── App.css              # App styles
├── index.js             # Entry point
└── index.css            # Global styles
```

## Key Improvements Over PHP Version

### Performance
- **Faster Initial Load**: React app loads once, subsequent navigation is instant
- **Reduced Server Load**: No server-side rendering for each page
- **Better Caching**: Static assets are cached by CDN/browser
- **Code Splitting**: Only load code needed for current page

### User Experience
- **Smooth Navigation**: No page refreshes between routes
- **Loading States**: Visual feedback during data loading
- **Responsive Design**: Better mobile experience
- **Language Switching**: Instant language changes without page reload

### Development
- **Component Reusability**: Modular, reusable components
- **State Management**: Centralized state with Context API
- **Type Safety**: Better error handling and debugging
- **Modern Tooling**: Hot reload, linting, and modern development tools

## Deployment

### Build for Production
```bash
npm run build
```

This creates a `build` folder with optimized production files.

### Deploy to Static Hosting
The built files can be deployed to any static hosting service:
- Netlify
- Vercel
- GitHub Pages
- AWS S3 + CloudFront
- Firebase Hosting

### Environment Variables
Create a `.env` file for environment-specific variables:
```
REACT_APP_API_URL=your_api_url
REACT_APP_GA_TRACKING_ID=your_ga_id
```

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Performance Metrics

Expected improvements over PHP version:
- **First Contentful Paint**: 40-60% faster
- **Time to Interactive**: 50-70% faster
- **Largest Contentful Paint**: 30-50% faster
- **Cumulative Layout Shift**: Significantly reduced
- **Bundle Size**: Optimized and compressed

## Maintenance

### Adding New Paintings
1. Add painting data to `src/data/translations.js`
2. Add images to `public/images/` directory
3. Update gallery components if needed

### Adding New Languages
1. Add translation object to `src/data/translations.js`
2. Update language selector in `Header.js`
3. Test all text content

### Performance Monitoring
- Use React DevTools Profiler
- Monitor Core Web Vitals
- Use Lighthouse for performance audits

## Troubleshooting

### Common Issues

1. **Images not loading**: Check that images are in `public/images/` directory
2. **Styling issues**: Ensure CSS files are in `public/css/` directory
3. **Language not switching**: Check browser localStorage and language context
4. **Build errors**: Run `npm install` to ensure all dependencies are installed

### Development Tips

- Use React DevTools browser extension
- Enable source maps in development
- Use console.log for debugging (remove in production)
- Test on multiple devices and browsers

## Support

For issues or questions about the React version, please check:
1. This README file
2. React documentation
3. Browser console for errors
4. Network tab for loading issues


