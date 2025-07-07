
import React from 'react';
import { cn } from '@/lib/utils';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  variant?: 'icon' | 'text' | 'full';
  className?: string;
}

export default function Logo({ size = 'md', variant = 'full', className }: LogoProps) {
  const sizeClasses = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-2xl'
  };

  const iconSizes = {
    sm: 'h-6 w-6',
    md: 'h-8 w-8', 
    lg: 'h-10 w-10'
  };

  if (variant === 'icon') {
    return (
      <div className={cn('bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold', iconSizes[size], className)}>
        M
      </div>
    );
  }

  if (variant === 'text') {
    return (
      <span className={cn('font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent', sizeClasses[size], className)}>
        MatchWise
      </span>
    );
  }

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <div className={cn('bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold', iconSizes[size])}>
        M
      </div>
      <span className={cn('font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent', sizeClasses[size])}>
        MatchWise
      </span>
    </div>
  );
}
