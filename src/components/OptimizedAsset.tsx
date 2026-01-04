import React from 'react';

interface OptimizedAssetProps {
  src: string;
  webpSrc?: string;
  fallbackSrc?: string;
  alt: string;
  className?: string;
  loading?: 'lazy' | 'eager';
  onError?: (e: React.SyntheticEvent<HTMLImageElement, Event>) => void;
}

/**
 * OptimizedAsset component that uses WebP format with PNG fallback
 * Automatically handles browser compatibility
 */
const OptimizedAsset: React.FC<OptimizedAssetProps> = ({
  src,
  webpSrc,
  fallbackSrc,
  alt,
  className = '',
  loading = 'lazy',
  onError,
}) => {
  const handleError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    const target = e.currentTarget as HTMLImageElement;
    // Try fallback if provided
    if (fallbackSrc && target.src !== fallbackSrc) {
      target.src = fallbackSrc;
      return;
    }
    // Call custom error handler if provided
    if (onError) {
      onError(e);
    }
  };

  // If WebP source is provided, use picture element for better browser support
  if (webpSrc) {
    return (
      <picture>
        <source srcSet={webpSrc} type="image/webp" />
        <img
          src={fallbackSrc || src}
          alt={alt}
          className={className}
          loading={loading}
          decoding="async"
          onError={handleError}
        />
      </picture>
    );
  }

  // Fallback to regular img tag if no WebP version
  return (
    <img
      src={src}
      alt={alt}
      className={className}
      loading={loading}
      decoding="async"
      onError={handleError}
    />
  );
};

export default OptimizedAsset;

