import React from 'react';
import logoWebp from '../assets/optimized/logo.webp';
import logoFallback from '../assets/logo.png';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

const Logo: React.FC<LogoProps> = ({ className = '', size = 'md' }) => {
  const sizes = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-20 h-20'
  };

  return (
    <picture>
      <source srcSet={logoWebp} type="image/webp" />
      <img
        src={logoFallback}
        alt="Logo"
        loading={size === 'lg' ? 'lazy' : 'eager'}
        className={`${sizes[size]} ${className} object-contain`}
      />
    </picture>
  );
};

export default Logo;
