import React from 'react';
import { View, ViewProps } from 'react-native';
import { cn } from '@/utils/cn';

interface CardProps extends ViewProps {
  variant?: 'default' | 'elevated' | 'outlined' | 'ghost';
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  children: React.ReactNode;
  className?: string;
}

const Card: React.FC<CardProps> = ({
  variant = 'default',
  padding = 'md',
  children,
  className,
  ...props
}) => {
  const getCardStyles = (): string => {
    const baseStyles = 'bg-white rounded-lg';
    
    const variantStyles = {
      default: 'border border-gray-200',
      elevated: 'shadow-md elevation-3',
      outlined: 'border-2 border-gray-300',
      ghost: 'bg-transparent',
    };

    const paddingStyles = {
      none: '',
      sm: 'p-3',
      md: 'p-4',
      lg: 'p-6',
      xl: 'p-8',
    };

    return cn(
      baseStyles,
      variantStyles[variant],
      paddingStyles[padding],
      className
    );
  };

  return (
    <View className={getCardStyles()} {...props}>
      {children}
    </View>
  );
};

export default Card;
