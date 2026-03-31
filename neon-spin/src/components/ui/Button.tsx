import React from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  fullWidth = false, 
  className = '', 
  ...props 
}) => {
  const baseClasses = "py-3 px-6 rounded-xl font-bold tracking-widest uppercase transition-transform transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2";
  
  const variants = {
    primary: "shadow-[0_0_20px_rgba(255,0,255,0.4)] bg-gradient-to-r from-neon-pink to-neon-purple text-white hover:scale-105",
    secondary: "bg-gradient-to-r from-neon-blue to-teal-400 text-black hover:scale-105 shadow-[0_0_20px_rgba(0,255,255,0.4)]",
    outline: "border border-gray-700 bg-transparent text-gray-300 hover:border-neon-blue hover:text-white",
    ghost: "bg-transparent text-gray-400 hover:bg-gray-800 hover:text-white"
  };

  return (
    <button 
      className={`${baseClasses} ${variants[variant]} ${fullWidth ? 'w-full' : ''} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};
