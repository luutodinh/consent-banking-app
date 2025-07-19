import React, { useState } from 'react';
import { View, Alert } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';

// Validation schema with Zod
const loginSchema = z.object({
  username: z
    .string()
    .min(1, 'Username is required')
    .min(3, 'Username must be at least 3 characters')
    .max(50, 'Username must be less than 50 characters'),
  password: z
    .string()
    .min(1, 'Password is required')
    .min(6, 'Password must be at least 6 characters')
    .max(100, 'Password must be less than 100 characters'),
});

type LoginFormData = z.infer<typeof loginSchema>;

interface LoginFormProps {
  onSubmit?: (data: LoginFormData) => Promise<void>;
}

export default function LoginForm({ onSubmit }: LoginFormProps) {
  const [isLoading, setIsLoading] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
    watch,
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    mode: 'onChange',
    defaultValues: {
      username: '',
      password: '',
    },
  });

  const watchedValues = watch();
  const hasValues = watchedValues.username && watchedValues.password;

  const handleLogin = async (data: LoginFormData) => {
    if (onSubmit) {
      await onSubmit(data);
      return;
    }

    setIsLoading(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock authentication logic
      if (data.username === 'admin' && data.password === 'password') {
        router.replace('/consent');
      } else {
        Alert.alert(
          'Login Failed',
          'Invalid username or password. Please try again.',
          [{ text: 'OK' }]
        );
      }
    } catch (error) {
      Alert.alert(
        'Error',
        'An error occurred during login. Please try again.',
        [{ text: 'OK' }]
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View className="space-y-4">
      <Controller
        control={control}
        name="username"
        render={({ field: { onChange, onBlur, value } }) => (
          <Input
            label="Username"
            placeholder="Enter your username"
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            error={errors.username?.message}
            required
            autoCapitalize="none"
            autoCorrect={false}
            autoComplete="username"
            textContentType="username"
            leftIcon={
              <Ionicons name="person-outline" size={20} color="#6B7280" />
            }
            containerClassName="mb-4"
          />
        )}
      />

      <Controller
        control={control}
        name="password"
        render={({ field: { onChange, onBlur, value } }) => (
          <Input
            label="Password"
            placeholder="Enter your password"
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            error={errors.password?.message}
            required
            isPassword
            autoComplete="current-password"
            textContentType="password"
            leftIcon={
              <Ionicons name="lock-closed-outline" size={20} color="#6B7280" />
            }
            containerClassName="mb-6"
          />
        )}
      />

      <Button
        title="Sign In"
        onPress={handleSubmit(handleLogin)}
        isLoading={isLoading}
        disabled={!hasValues || !isValid}
        className="mb-4"
      />
    </View>
  );
}
