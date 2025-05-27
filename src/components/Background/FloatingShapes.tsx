
import React from 'react';

export const FloatingShapes: React.FC = () => {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {/* Floating geometric shapes */}
      <div className="absolute top-20 left-10 w-20 h-20 bg-primary/10 rounded-full animate-bounce" style={{ animationDuration: '3s', animationDelay: '0s' }} />
      <div className="absolute top-40 right-20 w-16 h-16 bg-secondary/10 rounded-lg rotate-45 animate-pulse" style={{ animationDuration: '4s', animationDelay: '1s' }} />
      <div className="absolute bottom-32 left-1/4 w-12 h-12 bg-accent/10 rounded-full animate-ping" style={{ animationDuration: '5s', animationDelay: '2s' }} />
      <div className="absolute top-1/3 right-1/3 w-24 h-24 bg-primary/5 rounded-full animate-pulse" style={{ animationDuration: '6s', animationDelay: '0.5s' }} />
      <div className="absolute bottom-20 right-10 w-14 h-14 bg-secondary/10 rounded-lg animate-bounce" style={{ animationDuration: '4.5s', animationDelay: '1.5s' }} />
      
      {/* Gradient orbs */}
      <div className="absolute top-1/4 left-1/3 w-32 h-32 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-full blur-xl animate-pulse" style={{ animationDuration: '8s' }} />
      <div className="absolute bottom-1/4 right-1/4 w-40 h-40 bg-gradient-to-tr from-accent/15 to-primary/15 rounded-full blur-2xl animate-pulse" style={{ animationDuration: '10s', animationDelay: '3s' }} />
      
      {/* Moving lines */}
      <div className="absolute top-0 left-1/2 w-px h-full bg-gradient-to-b from-transparent via-primary/20 to-transparent animate-pulse" style={{ animationDuration: '7s' }} />
      <div className="absolute top-1/2 left-0 w-full h-px bg-gradient-to-r from-transparent via-secondary/20 to-transparent animate-pulse" style={{ animationDuration: '9s', animationDelay: '2s' }} />
    </div>
  );
};
