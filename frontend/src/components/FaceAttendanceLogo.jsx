import React from 'react';

export default function FaceAttendanceLogo({ size = 'md', className = '', showText = true, textClassName = '', isDarkBrand = false }) {
  const sizeMap = {
    sm: 'w-7 h-7',
    md: 'w-9 h-9',
    lg: 'w-11 h-11',
    xl: 'w-14 h-14'
  };

  const iconSize = sizeMap[size] || sizeMap.md;

  return (
    <div className={`inline-flex items-center gap-2.5 ${className}`}>
      {/* Modern Biometric Face Icon */}
      <div className={`${iconSize} rounded-xl ${isDarkBrand ? 'bg-white text-blue-600' : 'bg-blue-600 text-white'} flex items-center justify-center shadow-sm shadow-blue-500/20 flex-shrink-0 transition-transform`}>
        <svg 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2.2" 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          className="w-3/5 h-3/5"
        >
          {/* Biometric Scan Frame Corners */}
          <path d="M4 8V5a1 1 0 0 1 1-1h3" />
          <path d="M16 4h3a1 1 0 0 1 1 1v3" />
          <path d="M20 16v3a1 1 0 0 1-1 1h-3" />
          <path d="M8 20H5a1 1 0 0 1-1-1v-3" />
          {/* Face Center */}
          <circle cx="9" cy="10" r="1" fill="currentColor" />
          <circle cx="15" cy="10" r="1" fill="currentColor" />
          <path d="M9.5 15a3.5 3.5 0 0 0 5 0" strokeWidth="2" />
        </svg>
      </div>

      {showText && (
        <span className={`font-bold tracking-tight ${isDarkBrand ? 'text-white' : 'text-slate-900 dark:text-white'} ${textClassName || 'text-lg'}`}>
          Face<span className="text-blue-600">Attendance</span>
        </span>
      )}
    </div>
  );
}
