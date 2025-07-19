import React from 'react';
import { View, Text, Image, ImageSourcePropType } from 'react-native';
import { cn } from '@/utils/cn';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'horizontal' | 'vertical' | 'icon-only';
  showText?: boolean;
  title?: string;
  subtitle?: string;
  imageSource?: ImageSourcePropType;
  className?: string;
  imageClassName?: string;
  textClassName?: string;
  subtitleClassName?: string;
}

const Logo: React.FC<LogoProps> = ({
  size = 'md',
  variant = 'horizontal',
  showText = true,
  title = 'Banking App',
  subtitle = 'Secure & Trusted',
  imageSource,
  className,
  imageClassName,
  textClassName,
  subtitleClassName,
}) => {
  const getSizeStyles = () => {
    const sizes = {
      sm: {
        container: 'gap-2',
        image: 'w-8 h-8',
        title: 'text-lg',
        subtitle: 'text-xs',
      },
      md: {
        container: 'gap-3',
        image: 'w-12 h-12',
        title: 'text-xl',
        subtitle: 'text-sm',
      },
      lg: {
        container: 'gap-4',
        image: 'w-16 h-16',
        title: 'text-2xl',
        subtitle: 'text-base',
      },
      xl: {
        container: 'gap-5',
        image: 'w-20 h-20',
        title: 'text-3xl',
        subtitle: 'text-lg',
      },
    };
    return sizes[size];
  };

  const getVariantStyles = () => {
    const variants = {
      horizontal: 'flex-row items-center',
      vertical: 'flex-col items-center',
      'icon-only': 'flex-row items-center justify-center',
    };
    return variants[variant];
  };

  const sizeStyles = getSizeStyles();
  const variantStyles = getVariantStyles();

  const renderDefaultIcon = () => (
    <View className={cn(
      'rounded-full bg-gradient-to-br from-blue-500 to-blue-700 items-center justify-center',
      sizeStyles.image,
      imageClassName
    )}>
      <Text className="text-white font-bold text-lg">B</Text>
    </View>
  );

  const renderImage = () => {
    if (imageSource) {
      return (
        <Image
          source={imageSource}
          className={cn(sizeStyles.image, 'rounded-full', imageClassName)}
          resizeMode="contain"
        />
      );
    }
    return renderDefaultIcon();
  };

  const renderText = () => {
    if (!showText || variant === 'icon-only') return null;

    return (
      <View className={variant === 'vertical' ? 'items-center' : 'flex-1'}>
        <Text className={cn(
          'font-bold text-gray-900',
          sizeStyles.title,
          textClassName
        )}>
          {title}
        </Text>
        {subtitle && (
          <Text className={cn(
            'text-gray-600 font-medium',
            sizeStyles.subtitle,
            subtitleClassName
          )}>
            {subtitle}
          </Text>
        )}
      </View>
    );
  };

  return (
    <View className={cn(
      variantStyles,
      sizeStyles.container,
      className
    )}>
      {renderImage()}
      {renderText()}
    </View>
  );
};

export default Logo;
