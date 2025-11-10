import React from 'react';
import logo from '../assets/logo.png'; // adjust path if needed

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
    <img
      src={logo}
      alt="Logo"
      loading={size === 'lg' ? 'lazy' : 'eager'}
      className={`${sizes[size]} ${className} object-contain`}
    />
  );
};

export default Logo;
