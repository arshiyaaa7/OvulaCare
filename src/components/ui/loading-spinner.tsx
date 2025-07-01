import React from 'react';
import { Loader2, Heart } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function LoadingSpinner({ size = 'md', className }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8'
  };

  return (
    <Loader2 className={cn('animate-spin text-pink-500', sizeClasses[size], className)} />
  );
}

interface FullPageLoaderProps {
  text?: string;
}

export function FullPageLoader({ text = 'Loading...' }: FullPageLoaderProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-lavender-50 to-teal-50 flex items-center justify-center">
      <div className="text-center space-y-6">
        {/* Animated heart logo */}
        <div className="relative">
          <div className="h-16 w-16 mx-auto rounded-full bg-gradient-to-br from-pink-500 to-lavender-500 flex items-center justify-center shadow-lg animate-pulse">
            <Heart className="h-8 w-8 text-white" />
          </div>
          <div className="absolute inset-0 h-16 w-16 mx-auto rounded-full bg-gradient-to-br from-pink-500 to-lavender-500 animate-ping opacity-20"></div>
        </div>
        
        {/* Loading text */}
        <div className="space-y-2">
          <div className="flex items-center justify-center space-x-2">
            <LoadingSpinner size="md" />
            <span className="text-lg font-medium text-gray-700">{text}</span>
          </div>
          <p className="text-sm text-gray-500">Please wait while we prepare your experience</p>
        </div>
        
        {/* Progress dots */}
        <div className="flex justify-center space-x-2">
          <div className="h-2 w-2 rounded-full bg-pink-400 animate-bounce"></div>
          <div className="h-2 w-2 rounded-full bg-lavender-400 animate-bounce" style={{ animationDelay: '0.1s' }}></div>
          <div className="h-2 w-2 rounded-full bg-teal-400 animate-bounce" style={{ animationDelay: '0.2s' }}></div>
        </div>
      </div>
    </div>
  );
}