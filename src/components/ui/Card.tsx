import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  gradient?: boolean;
  hover?: boolean;
}

export const Card: React.FC<CardProps> = ({ 
  children, 
  className = '', 
  gradient = false,
  hover = true 
}) => {
  return (
    <div className={`
      bg-white rounded-2xl shadow-sm border border-gray-100 
      ${hover ? 'hover:shadow-lg transition-all duration-300' : ''}
      ${gradient ? 'bg-gradient-to-br from-white to-gray-50' : ''}
      ${className}
    `}>
      {children}
    </div>
  );
};