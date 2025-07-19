import { cn } from '@/utils/cn';
import React from 'react';
import {
  ActivityIndicator,
  Text,
  TouchableOpacity,
  TouchableOpacityProps,
} from 'react-native';

interface ButtonProps extends TouchableOpacityProps {
  title: string;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  disabled?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  className?: string;
  textClassName?: string;
}

const Button: React.FC<ButtonProps> = ({
  title,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled = false,
  leftIcon,
  rightIcon,
  className,
  textClassName,
  onPress,
  ...props
}) => {
  const isDisabled = disabled || isLoading;

  const getButtonStyles = (): string => {
    const baseStyles = 'flex-row items-center justify-center rounded-lg';

    const variantStyles = {
      primary: 'bg-blue-600 active:bg-blue-700',
      secondary: 'bg-gray-600 active:bg-gray-700',
      outline: 'border-2 border-blue-600 bg-transparent active:bg-blue-50',
      ghost: 'bg-transparent active:bg-gray-100',
      danger: 'bg-red-600 active:bg-red-700',
    };

    const sizeStyles = {
      sm: 'px-3 py-2 min-h-[36px]',
      md: 'px-4 py-3 min-h-[44px]',
      lg: 'px-6 py-4 min-h-[52px]',
    };

    const disabledStyles = isDisabled ? 'opacity-50' : '';

    return cn(
      baseStyles,
      variantStyles[variant],
      sizeStyles[size],
      disabledStyles,
      className
    );
  };

  const getTextStyles = (): string => {
    const baseTextStyles = 'font-semibold text-center';

    const variantTextStyles = {
      primary: 'text-white',
      secondary: 'text-white',
      outline: 'text-blue-600',
      ghost: 'text-gray-700',
      danger: 'text-white',
    };

    const sizeTextStyles = {
      sm: 'text-sm',
      md: 'text-base',
      lg: 'text-lg',
    };

    return cn(
      baseTextStyles,
      variantTextStyles[variant],
      sizeTextStyles[size],
      textClassName
    );
  };

  return (
    <TouchableOpacity
      className={getButtonStyles()}
      onPress={isDisabled ? undefined : onPress}
      disabled={isDisabled}
      activeOpacity={0.8}
      accessibilityRole='button'
      accessibilityState={{ disabled: isDisabled }}
      accessibilityLabel={title}
      {...props}
    >
      {isLoading ? (
        <ActivityIndicator
          size='small'
          color={
            variant === 'outline' || variant === 'ghost' ? '#2563eb' : '#ffffff'
          }
          className='mr-2'
        />
      ) : (
        leftIcon && <>{leftIcon}</>
      )}

      <Text className={getTextStyles()}>{title}</Text>

      {!isLoading && rightIcon && <>{rightIcon}</>}
    </TouchableOpacity>
  );
};

export default Button;
