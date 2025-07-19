import { cn } from '@/utils/cn';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

interface CheckboxProps {
  checked: boolean;
  onPress: () => void;
  label?: string;
  description?: string;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'danger';
  className?: string;
  labelClassName?: string;
  descriptionClassName?: string;
}

const Checkbox: React.FC<CheckboxProps> = ({
  checked,
  onPress,
  label,
  description,
  disabled = false,
  size = 'md',
  variant = 'primary',
  className,
  labelClassName,
  descriptionClassName,
}) => {
  const getSizeStyles = () => {
    const sizes = {
      sm: {
        checkbox: 'w-4 h-4',
        icon: 14,
        label: 'text-sm',
        description: 'text-xs',
        gap: 'gap-2',
      },
      md: {
        checkbox: 'w-5 h-5',
        icon: 16,
        label: 'text-base',
        description: 'text-sm',
        gap: 'gap-3',
      },
      lg: {
        checkbox: 'w-6 h-6',
        icon: 18,
        label: 'text-lg',
        description: 'text-base',
        gap: 'gap-4',
      },
    };
    return sizes[size];
  };

  const getVariantStyles = () => {
    const variants = {
      default: {
        checked: 'bg-gray-600 border-gray-600',
        unchecked: 'bg-white border-gray-300',
        icon: '#ffffff',
      },
      primary: {
        checked: 'bg-blue-600 border-blue-600',
        unchecked: 'bg-white border-gray-300',
        icon: '#ffffff',
      },
      success: {
        checked: 'bg-green-600 border-green-600',
        unchecked: 'bg-white border-gray-300',
        icon: '#ffffff',
      },
      warning: {
        checked: 'bg-yellow-600 border-yellow-600',
        unchecked: 'bg-white border-gray-300',
        icon: '#ffffff',
      },
      danger: {
        checked: 'bg-red-600 border-red-600',
        unchecked: 'bg-white border-gray-300',
        icon: '#ffffff',
      },
    };
    return variants[variant];
  };

  const sizeStyles = getSizeStyles();
  const variantStyles = getVariantStyles();

  const getCheckboxStyles = (): string => {
    const baseStyles = 'border-2 rounded items-center justify-center';
    const stateStyles = checked
      ? variantStyles.checked
      : variantStyles.unchecked;
    const disabledStyles = disabled ? 'opacity-50' : '';

    return cn(baseStyles, sizeStyles.checkbox, stateStyles, disabledStyles);
  };

  return (
    <TouchableOpacity
      onPress={disabled ? undefined : onPress}
      disabled={disabled}
      className={cn('flex-row items-start', sizeStyles.gap, className)}
      activeOpacity={0.7}
      accessibilityRole='checkbox'
      accessibilityState={{ checked, disabled }}
      accessibilityLabel={label}
    >
      <View className={getCheckboxStyles()}>
        {checked && (
          <Ionicons
            name='checkmark'
            size={sizeStyles.icon}
            color={variantStyles.icon}
          />
        )}
      </View>

      {(label || description) && (
        <View className='flex-1'>
          {label && (
            <Text
              className={cn(
                'font-medium text-gray-900',
                sizeStyles.label,
                disabled && 'text-gray-400',
                labelClassName
              )}
            >
              {label}
            </Text>
          )}
          {description && (
            <Text
              className={cn(
                'text-gray-600 mt-1',
                sizeStyles.description,
                disabled && 'text-gray-400',
                descriptionClassName
              )}
            >
              {description}
            </Text>
          )}
        </View>
      )}
    </TouchableOpacity>
  );
};

export default Checkbox;
