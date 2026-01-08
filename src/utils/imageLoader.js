// Modern Image Loading Utilities

// Preload images for better performance
export const preloadImages = (imageUrls) => {
  const promises = imageUrls.map(url => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(url);
      img.onerror = () => reject(url);
      img.src = url;
    });
  });
  
  return Promise.allSettled(promises);
};

// Progressive image loading with blur-to-sharp effect
export const createProgressiveImage = (lowResSrc, highResSrc, container) => {
  const lowResImg = new Image();
  const highResImg = new Image();
  
  lowResImg.onload = () => {
    container.style.backgroundImage = `url(${lowResSrc})`;
    container.style.filter = 'blur(5px)';
    container.style.transition = 'filter 0.3s ease';
  };
  
  highResImg.onload = () => {
    container.style.backgroundImage = `url(${highResSrc})`;
    container.style.filter = 'blur(0px)';
  };
  
  lowResImg.src = lowResSrc;
  highResImg.src = highResSrc;
};

// Image optimization with WebP support
export const getOptimizedImageUrl = (originalUrl, width = null, quality = 80) => {
  if (!originalUrl) return originalUrl;
  
  // Check if browser supports WebP
  const supportsWebP = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 1;
    canvas.height = 1;
    return canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0;
  };
  
  // For now, return original URL
  // In production, you would integrate with an image optimization service
  return originalUrl;
};

// Lazy loading with intersection observer
export const createLazyImageLoader = (callback, options = {}) => {
  const defaultOptions = {
    root: null,
    rootMargin: '50px',
    threshold: 0.1,
    ...options
  };
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        callback(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, defaultOptions);
  
  return observer;
};

// Image loading with retry mechanism
export const loadImageWithRetry = (src, maxRetries = 3, delay = 1000) => {
  return new Promise((resolve, reject) => {
    let retries = 0;
    
    const attemptLoad = () => {
      const img = new Image();
      
      img.onload = () => resolve(img);
      img.onerror = () => {
        retries++;
        if (retries < maxRetries) {
          setTimeout(attemptLoad, delay * retries);
        } else {
          reject(new Error(`Failed to load image after ${maxRetries} attempts`));
        }
      };
      
      img.src = src;
    };
    
    attemptLoad();
  });
};

// Batch image loading with progress callback
export const loadImagesBatch = async (imageUrls, onProgress = null) => {
  const results = [];
  const total = imageUrls.length;
  let loaded = 0;
  
  for (let i = 0; i < imageUrls.length; i++) {
    try {
      const img = await loadImageWithRetry(imageUrls[i]);
      results.push({ success: true, img, url: imageUrls[i] });
    } catch (error) {
      results.push({ success: false, error, url: imageUrls[i] });
    }
    
    loaded++;
    if (onProgress) {
      onProgress(loaded, total, (loaded / total) * 100);
    }
  }
  
  return results;
};

// Image compression utility (client-side)
export const compressImage = (file, maxWidth = 1920, quality = 0.8) => {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    
    img.onload = () => {
      const ratio = Math.min(maxWidth / img.width, maxWidth / img.height);
      canvas.width = img.width * ratio;
      canvas.height = img.height * ratio;
      
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      
      canvas.toBlob(resolve, 'image/jpeg', quality);
    };
    
    img.src = URL.createObjectURL(file);
  });
};

// Generate placeholder image data URL
export const generatePlaceholder = (width = 300, height = 200, color = '#f0f0f0') => {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  
  canvas.width = width;
  canvas.height = height;
  
  ctx.fillStyle = color;
  ctx.fillRect(0, 0, width, height);
  
  // Add a subtle pattern
  ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
  for (let i = 0; i < width; i += 20) {
    for (let j = 0; j < height; j += 20) {
      if ((i + j) % 40 === 0) {
        ctx.fillRect(i, j, 10, 10);
      }
    }
  }
  
  return canvas.toDataURL();
};

