import React from 'react';

const NeonBackground: React.FC = () => {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {/* Main gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-blue-900/30 to-purple-900/30" />
      
      {/* Static neon orbs - more reliable */}
      <div className="absolute top-20 left-10 w-64 h-64 bg-blue-500/30 rounded-full blur-3xl" />
      <div className="absolute top-40 right-20 w-80 h-80 bg-purple-500/25 rounded-full blur-3xl" />
      <div className="absolute bottom-20 left-1/4 w-72 h-72 bg-pink-500/25 rounded-full blur-3xl" />
      <div className="absolute top-1/3 right-1/3 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl" />
      
      {/* Animated neon lines */}
      <div className="absolute top-1/4 left-0 w-full h-px bg-gradient-to-r from-transparent via-blue-500/30 to-transparent" />
      <div className="absolute top-1/2 right-0 w-full h-px bg-gradient-to-r from-transparent via-purple-500/30 to-transparent" />
      <div className="absolute bottom-1/4 left-0 w-full h-px bg-gradient-to-r from-transparent via-pink-500/30 to-transparent" />
      
      {/* Scanning effect */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-full h-0.5 bg-gradient-to-r from-transparent via-blue-500/40 to-transparent animate-pulse" />
      </div>
    </div>
  );
};

export default NeonBackground;
