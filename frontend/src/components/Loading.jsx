import React from 'react';
import { Shield } from 'lucide-react';

const Loading = ({ size = 'default', text = 'Loading...' }) => {
  const sizeClasses = {
    small: 'h-4 w-4',
    default: 'h-8 w-8',
    large: 'h-12 w-12'
  };

  const textSizes = {
    small: 'text-sm',
    default: 'text-base',
    large: 'text-lg'
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-4">
      <div className="relative">
        <Shield className={`${sizeClasses[size]} text-blue-400 animate-pulse`} />
        <div className="absolute inset-0 animate-spin">
          <div className={`${sizeClasses[size]} border-2 border-transparent border-t-blue-400 rounded-full`}></div>
        </div>
      </div>
      <p className={`text-white/80 ${textSizes[size]} animate-pulse`}>{text}</p>
    </div>
  );
};

export const LoadingSpinner = ({ className = '' }) => (
  <div className={`animate-spin rounded-full border-2 border-transparent border-t-blue-400 ${className}`}></div>
);

export const LoadingOverlay = ({ children, loading, text = 'Loading...' }) => {
  if (!loading) return children;

  return (
    <div className="relative">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm z-10 flex items-center justify-center">
        <Loading text={text} />
      </div>
      <div className="opacity-50 pointer-events-none">
        {children}
      </div>
    </div>
  );
};

export default Loading;