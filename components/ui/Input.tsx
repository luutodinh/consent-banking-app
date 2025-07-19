import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  TextInputProps,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { cn } from '@/utils/cn';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  isPassword?: boolean;
  required?: boolean;
  containerClassName?: string;
  inputClassName?: string;
  labelClassName?: string;
  errorClassName?: string;
}

const Input: React.FC<InputProps> = ({
  label,
  error,
  helperText,
  leftIcon,
  rightIcon,
  isPassword = false,
  required = false,
  containerClassName,
  inputClassName,
  labelClassName,
  errorClassName,
  value,
  onChangeText,
  ...props
}) => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const hasError = !!error;
  const hasValue = !!value;

  const getInputContainerStyles = (): string => {
    const baseStyles = 'flex-row items-center border rounded-lg px-3 py-3 bg-white';
    
    const focusStyles = isFocused 
      ? 'border-blue-500 shadow-sm' 
      : 'border-gray-300';
    
    const errorStyles = hasError 
      ? 'border-red-500' 
      : '';

    return cn(baseStyles, focusStyles, errorStyles);
  };

  const getInputStyles = (): string => {
    const baseStyles = 'flex-1 text-base text-gray-900 min-h-[20px]';
    return cn(baseStyles, inputClassName);
  };

  const getLabelStyles = (): string => {
    const baseStyles = 'text-sm font-medium mb-1';
    const colorStyles = hasError ? 'text-red-600' : 'text-gray-700';
    return cn(baseStyles, colorStyles, labelClassName);
  };

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  return (
    <View className={cn('mb-4', containerClassName)}>
      {label && (
        <Text className={getLabelStyles()}>
          {label}
          {required && <Text className="text-red-500 ml-1">*</Text>}
        </Text>
      )}
      
      <View className={getInputContainerStyles()}>
        {leftIcon && (
          <View className="mr-3">
            {leftIcon}
          </View>
        )}
        
        <TextInput
          className={getInputStyles()}
          value={value}
          onChangeText={onChangeText}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          secureTextEntry={isPassword && !isPasswordVisible}
          placeholderTextColor="#9CA3AF"
          accessibilityLabel={label}
          accessibilityHint={helperText}
          {...props}
        />
        
        {isPassword && (
          <TouchableOpacity
            onPress={togglePasswordVisibility}
            className="ml-3"
            accessibilityRole="button"
            accessibilityLabel={isPasswordVisible ? "Hide password" : "Show password"}
          >
            <Ionicons
              name={isPasswordVisible ? "eye-off" : "eye"}
              size={20}
              color="#6B7280"
            />
          </TouchableOpacity>
        )}
        
        {rightIcon && !isPassword && (
          <View className="ml-3">
            {rightIcon}
          </View>
        )}
      </View>
      
      {error && (
        <Text className={cn('text-red-500 text-sm mt-1', errorClassName)}>
          {error}
        </Text>
      )}
      
      {helperText && !error && (
        <Text className="text-gray-500 text-sm mt-1">
          {helperText}
        </Text>
      )}
    </View>
  );
};

export default Input;
