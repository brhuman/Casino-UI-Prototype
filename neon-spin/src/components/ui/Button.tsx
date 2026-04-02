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
  const baseClasses = "py-3 px-6 rounded-2xl font-bold tracking-widest uppercase transition-all disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2";
  
  const variants = {
    primary: "shadow-[0_0_20px_rgba(217,70,239,0.3)] bg-gradient-to-r from-neon-pink to-neon-purple text-white hover:scale-105",
    secondary: "bg-gradient-to-r from-neon-blue to-teal-400 text-black hover:scale-105 shadow-[0_0_20px_rgba(0,255,255,0.3)]",
    outline: "border border-white/20 bg-transparent text-white hover:border-neon-blue hover:bg-white/5",
    ghost: "bg-transparent text-white/80 hover:bg-white/10 hover:text-white"
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
