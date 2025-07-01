import React from 'react';
import { ExternalLink } from 'lucide-react';
import { cn } from '@/lib/utils';

interface BoltBadgeProps {
  variant?: 'light' | 'dark';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function BoltBadge({ variant = 'light', size = 'md', className }: BoltBadgeProps) {
  const sizeClasses = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1.5 text-sm',
    lg: 'px-4 py-2 text-base'
  };

  const variantClasses = {
    light: 'bg-white/90 text-gray-800 border border-gray-200 hover:bg-white',
    dark: 'bg-gray-900/90 text-white border border-gray-700 hover:bg-gray-900'
  };

  return (
    <a
      href="https://bolt.new/"
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        'inline-flex items-center rounded-full font-medium transition-all duration-200 hover:scale-105 hover:shadow-lg backdrop-blur-sm',
        sizeClasses[size],
        variantClasses[variant],
        className
      )}
    >
      <span className="mr-1">⚡</span>
      <span>Built with Bolt</span>
      <ExternalLink className="ml-1 h-3 w-3 opacity-60" />
    </a>
  );
}