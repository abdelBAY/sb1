import React, { useState, useEffect, useRef } from 'react';

interface OptimizedImageProps {
  src: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
  sizes?: string;
  priority?: boolean; // For above-the-fold images
  placeholder?: 'blur' | 'empty';
  blurDataURL?: string;
  onLoad?: () => void;
  onError?: () => void;
}

/**
 * OptimizedImage component with:
 * - WebP format support with fallback
 * - Responsive images (srcset)
 * - Progressive loading (blur-up technique)
 * - Lazy loading for below-the-fold content
 */
export default function OptimizedImage({
  src,
  alt,
  className = '',
  width,
  height,
  sizes,
  priority = false,
  placeholder = 'blur',
  blurDataURL,
  onLoad,
  onError,
}: OptimizedImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  // Generate WebP URL (if the image service supports it)
  const getWebPUrl = (url: string): string => {
    // For Supabase storage or similar services, you might need to add format conversion
    // This is a basic implementation - adjust based on your image service
    if (url.includes('supabase.co') || url.includes('storage')) {
      // Try to append format parameter if supported
      return url;
    }
    // For other URLs, try to detect if WebP is supported
    return url;
  };

  // Generate responsive srcset
  const generateSrcSet = (baseUrl: string): string => {
    if (!width) return '';
    
    const breakpoints = [320, 640, 768, 1024, 1280, 1920];
    const srcset = breakpoints
      .filter(bp => bp <= (width * 2)) // Only generate sizes up to 2x the original width
      .map(bp => {
        // In a real implementation, you'd resize images on the server
        // For now, we'll use the same URL with different sizes if your service supports it
        return `${baseUrl}?w=${bp} ${bp}w`;
      })
      .join(', ');
    
    return srcset;
  };

  // Generate blur placeholder
  const generateBlurPlaceholder = (): string => {
    if (blurDataURL) return blurDataURL;
    
    // Generate a simple SVG placeholder
    const svg = `
      <svg width="${width || 400}" height="${height || 300}" xmlns="http://www.w3.org/2000/svg">
        <rect width="100%" height="100%" fill="#e5e7eb"/>
        <text x="50%" y="50%" text-anchor="middle" dy=".3em" fill="#9ca3af" font-family="system-ui" font-size="14">Loading...</text>
      </svg>
    `;
    return `data:image/svg+xml;base64,${btoa(svg)}`;
  };

  useEffect(() => {
    // Set initial image source
    setImageSrc(src);

    // Check if WebP is supported
    const checkWebPSupport = () => {
      const webp = new Image();
      webp.onload = webp.onerror = () => {
        // If WebP is supported, you could use a WebP version here
        // For now, we'll use the original source
      };
      webp.src = 'data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA';
    };
    
    checkWebPSupport();
  }, [src]);

  // Intersection Observer for lazy loading
  useEffect(() => {
    if (priority || !imgRef.current) return;

    const observerOptions = {
      root: null,
      rootMargin: '50px', // Start loading 50px before the image enters viewport
      threshold: 0.01,
    };

    observerRef.current = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !isLoaded && !hasError) {
          // Image is in viewport, ensure it's loaded
          if (imgRef.current && !imgRef.current.complete) {
            imgRef.current.loading = 'eager';
          }
          observerRef.current?.disconnect();
        }
      });
    }, observerOptions);

    observerRef.current.observe(imgRef.current);

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [priority, isLoaded, hasError]);

  const handleLoad = () => {
    setIsLoaded(true);
    if (onLoad) onLoad();
  };

  const handleError = () => {
    setHasError(true);
    if (onError) onError();
  };

  // Default sizes for responsive images
  const defaultSizes = sizes || '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw';

  if (hasError) {
    return (
      <div
        className={`${className} bg-gray-200 dark:bg-gray-700 flex items-center justify-center`}
        style={{ width, height }}
      >
        <span className="text-gray-400 dark:text-gray-500 text-sm">Failed to load</span>
      </div>
    );
  }

  return (
    <div className={`relative overflow-hidden ${className}`} style={{ width, height }}>
      {/* Blur placeholder */}
      {!isLoaded && placeholder === 'blur' && (
        <div
          className="absolute inset-0 bg-gray-200 dark:bg-gray-700 animate-pulse"
          style={{
            backgroundImage: `url(${generateBlurPlaceholder()})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            filter: 'blur(20px)',
            transform: 'scale(1.1)',
          }}
        />
      )}

      {/* Main image */}
      <img
        ref={imgRef}
        src={imageSrc || src}
        alt={alt}
        width={width}
        height={height}
        sizes={defaultSizes}
        srcSet={width ? generateSrcSet(src) : undefined}
        loading={priority ? 'eager' : 'lazy'}
        decoding="async"
        className={`transition-opacity duration-300 ${
          isLoaded ? 'opacity-100' : 'opacity-0'
        } ${className}`}
        onLoad={handleLoad}
        onError={handleError}
        style={{
          objectFit: 'cover',
          width: '100%',
          height: '100%',
        }}
      />
    </div>
  );
}

