import React from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  glass?: boolean;
}

export const Card: React.FC<CardProps> = ({ children, glass = true, className = '', ...props }) => {
  return (
    <div 
      className={`rounded-2xl border border-gray-800 p-6 ${glass ? 'bg-gray-900/60 backdrop-blur-md' : 'bg-gray-900'} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};
