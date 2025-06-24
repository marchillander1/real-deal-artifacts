
import React from 'react';
import { Brain } from 'lucide-react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  variant?: 'full' | 'icon';
  className?: string;
}

const Logo: React.FC<LogoProps> = ({ size = 'md', variant = 'full', className = '' }) => {
  const sizeClasses = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-2xl'
  };

  const iconSizes = {
    sm: 'h-5 w-5',
    md: 'h-6 w-6',
    lg: 'h-8 w-8'
  };

  if (variant === 'icon') {
    return (
      <div className={`bg-blue-600 p-2 rounded-lg ${className}`}>
        <Brain className={`${iconSizes[size]} text-white`} />
      </div>
    );
  }

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <div className="bg-blue-600 p-2 rounded-lg">
        <Brain className={`${iconSizes[size]} text-white`} />
      </div>
      <span className={`font-bold text-gray-900 ${sizeClasses[size]}`}>
        MatchWise
      </span>
    </div>
  );
};

export default Logo;
