import React from 'react';

export default function SmartCheckLogo({ size = 'md', className = '', showText = false, textClassName = '' }) {
  const sizeMap = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16'
  };

  const iconSize = sizeMap[size] || sizeMap.md;

  return (
    <div className={`inline-flex items-center gap-2.5 ${className}`}>
      {/* Blue shield with rounded corners and white checkmark */}
      <div className={`${iconSize} rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20 flex-shrink-0 transition-transform`}>
        <svg 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2.5" 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          className="w-3/5 h-3/5"
        >
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" fill="currentColor" fillOpacity="0.15" />
          <path d="M9 12l2 2 4-4" stroke="white" strokeWidth="2.5" />
        </svg>
      </div>

      {showText && (
        <span className={`font-bold text-slate-900 dark:text-white tracking-tight ${textClassName || 'text-xl'}`}>
          SmartCheck
        </span>
      )}
    </div>
  );
}
