import React from 'react';
import { ExternalLink } from 'lucide-react';

interface BoltBadgeProps {
  className?: string;
}

export function BoltBadge({ className = "" }: BoltBadgeProps) {
  return (
    <a
      href="https://bolt.new"
      target="_blank"
      rel="noopener noreferrer"
      className={`fixed top-4 right-4 z-50 ${className}`}
    >
      <img
        src="/black_circle_360x360.png"
        alt="Powered by Bolt.new"
        className="w-16 h-16 md:w-20 md:h-20 hover:scale-105 transition-all duration-300 drop-shadow-lg"
      />
    </a>
  );
}

interface BuiltWithBoltButtonProps {
  className?: string;
}

export function BuiltWithBoltButton({ className = "" }: BuiltWithBoltButtonProps) {
  return (
    <a
      href="https://bolt.new"
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium bg-gradient-to-r from-pink-500 to-purple-500 text-white hover:from-pink-600 hover:to-purple-600 transition-all duration-300 shadow-lg hover:shadow-xl ${className}`}
    >
      <span className="text-yellow-300 text-base">⚡</span>
      Built with Bolt
      <ExternalLink className="w-4 h-4" />
    </a>
  );
}