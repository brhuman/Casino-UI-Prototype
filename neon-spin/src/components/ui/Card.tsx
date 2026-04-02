import React from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  glass?: boolean;
}

export const Card: React.FC<CardProps> = ({ children, glass = true, className = '', ...props }) => {
  return (
    <div 
      className={`rounded-[2.5rem] border border-white/10 p-6 ${glass ? 'bg-white/5 backdrop-blur-2xl' : 'bg-black'} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};
