import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import Logo from '@/components/ui/Logo';

interface LoginForm {
  username: string;
  password: string;
}

interface FormErrors {
  username?: string;
  password?: string;
}

export default function LoginScreen() {
  const [form, setForm] = useState<LoginForm>({
    username: '',
    password: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // Username validation
    if (!form.username.trim()) {
      newErrors.username = 'Username is required';
    } else if (form.username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters';
    }

    // Password validation
    if (!form.password) {
      newErrors.password = 'Password is required';
    } else if (form.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: keyof LoginForm, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleLogin = async () => {
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Mock authentication logic
      if (form.username === 'admin' && form.password === 'password') {
        // Navigate to consent page
        // router.replace('/consent');
        // Linking.openURL('consentbanking://open');/
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

  // useMemo(() => {
  // Linking.openURL('consentbanking://open');
  // Linking.openURL('exp://192.168.2.176:8082');
  // }, []);

  return (
    <SafeAreaView className='flex-1 bg-gray-50'>
      <StatusBar style='dark' />
      <KeyboardAvoidingView
        className='flex-1'
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          className='flex-1'
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps='handled'
          showsVerticalScrollIndicator={false}
        >
          <View className='flex-1 justify-center p-6'>
            {/* Header Section */}
            <View className='items-center mb-6'>
              <Logo
                size='xl'
                variant='vertical'
                title='Spending Tracker'
                subtitle='Analyze Your Money'
                className='mb-6'
              />

              <Text className='text-2xl font-bold text-gray-900 text-center mb-2'>
                Welcome Back
              </Text>
              <Text className='text-gray-600 text-center text-base'>
                Sign in to access spending tracker services
              </Text>
            </View>

            {/* Login Form */}
            <Card variant='elevated' padding='lg' className='mb-6'>
              <View className='space-y-4'>
                <Input
                  label='Username'
                  placeholder='Enter your username'
                  value={form.username}
                  onChangeText={(value) => handleInputChange('username', value)}
                  error={errors.username}
                  required
                  autoCapitalize='none'
                  autoCorrect={false}
                  leftIcon={
                    <Ionicons name='person-outline' size={20} color='#6B7280' />
                  }
                  containerClassName='mb-4'
                />

                <Input
                  label='Password'
                  placeholder='Enter your password'
                  value={form.password}
                  onChangeText={(value) => handleInputChange('password', value)}
                  error={errors.password}
                  required
                  isPassword
                  leftIcon={
                    <Ionicons
                      name='lock-closed-outline'
                      size={20}
                      color='#6B7280'
                    />
                  }
                  containerClassName='mb-6'
                />

                <Button
                  title='Sign In'
                  onPress={handleLogin}
                  isLoading={isLoading}
                  disabled={!form.username || !form.password}
                  className='mb-4'
                />
              </View>
            </Card>

            {/* Security Notice */}
            <Card
              variant='outlined'
              padding='md'
              className='border-blue-200 bg-blue-50'
            >
              <View className='flex-row items-start'>
                <Ionicons
                  name='shield-checkmark'
                  size={20}
                  color='#2563eb'
                  className='mr-3 mt-0.5'
                />
                <View className='flex-1'>
                  <Text className='text-blue-800 font-semibold text-sm mb-1'>
                    Secure Connection
                  </Text>
                  <Text className='text-blue-700 text-xs leading-4'>
                    Your connection is encrypted and secure. We protect your
                    personal and financial information.
                  </Text>
                </View>
              </View>
            </Card>

            {/* Demo Credentials */}
            <View className='mt-6 p-4 bg-yellow-50 rounded-lg border border-yellow-200'>
              <Text className='text-yellow-800 font-semibold text-sm mb-2'>
                Demo Credentials
              </Text>
              <Text className='text-yellow-700 text-xs'>
                Username: admin{'\n'}
                Password: password
              </Text>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
