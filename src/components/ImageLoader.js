import React, { useState, useRef, useEffect } from 'react';

const ImageLoader = ({ 
  src, 
  alt, 
  className = '', 
  placeholder = '/images/placeholder.jpg',
  onLoad,
  onError,
  ...props 
}) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const imgRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1, rootMargin: '50px' }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const handleImageLoad = () => {
    setImageLoaded(true);
    if (onLoad) onLoad();
  };

  const handleImageError = () => {
    setImageError(true);
    if (onError) onError();
  };

  return (
    <div 
      ref={containerRef}
      className={`image-loader-container ${className}`}
      style={{ position: 'relative', overflow: 'hidden' }}
    >
      {/* Placeholder/Skeleton */}
      {!imageLoaded && !imageError && (
        <div className="image-placeholder">
          <div className="skeleton-loader">
            <div className="skeleton-shimmer"></div>
          </div>
        </div>
      )}

      {/* Error State */}
      {imageError && (
        <div className="image-error">
          <div className="error-icon">⚠️</div>
          <p>Failed to load image</p>
        </div>
      )}

      {/* Actual Image */}
      {isInView && !imageError && (
        <img
          ref={imgRef}
          src={src}
          alt={alt}
          className={`image-loaded ${imageLoaded ? 'loaded' : 'loading'}`}
          onLoad={handleImageLoad}
          onError={handleImageError}
          style={{
            opacity: imageLoaded ? 1 : 0,
            transform: imageLoaded ? 'scale(1)' : 'scale(1.1)',
            transition: 'opacity 0.6s ease, transform 0.6s ease',
            width: '100%',
            height: 'auto'
          }}
          {...props}
        />
      )}
    </div>
  );
};

export default ImageLoader;
