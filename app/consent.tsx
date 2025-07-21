import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import {
  Alert,
  Linking,
  SafeAreaView,
  ScrollView,
  Text,
  View,
} from 'react-native';

import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Checkbox from '@/components/ui/Checkbox';
import Logo from '@/components/ui/Logo';

interface Permission {
  id: string;
  title: string;
  description: string;
  icon: keyof typeof Ionicons.glyphMap;
  required: boolean;
  enabled: boolean;
}

const PERMISSIONS: Permission[] = [
  {
    id: 'account_info',
    title: 'Account Information',
    description:
      'Access to your account details, account numbers, and basic account information',
    icon: 'card-outline',
    required: true,
    enabled: true,
  },
  {
    id: 'balance',
    title: 'Account Balance',
    description: 'View current account balances and available funds',
    icon: 'wallet-outline',
    required: true,
    enabled: true,
  },
  {
    id: 'transactions',
    title: 'Transaction History',
    description: 'Access to your transaction history for the past 12 months',
    icon: 'list-outline',
    required: false,
    enabled: true,
  },
  {
    id: 'standing_orders',
    title: 'Standing Orders',
    description: 'View and manage your recurring payments and standing orders',
    icon: 'repeat-outline',
    required: false,
    enabled: false,
  },
  {
    id: 'direct_debits',
    title: 'Direct Debits',
    description:
      'Access to your direct debit information and payment schedules',
    icon: 'arrow-down-circle-outline',
    required: false,
    enabled: false,
  },
  {
    id: 'beneficiaries',
    title: 'Saved Beneficiaries',
    description: 'Access to your saved payment recipients and beneficiary list',
    icon: 'people-outline',
    required: false,
    enabled: false,
  },
];

export default function ConsentScreen() {
  const [permissions, setPermissions] = useState<Permission[]>(PERMISSIONS);
  const [isLoading, setIsLoading] = useState(false);

  const togglePermission = (id: string) => {
    setPermissions((prev) =>
      prev.map((permission) =>
        permission.id === id && !permission.required
          ? { ...permission, enabled: !permission.enabled }
          : permission
      )
    );
  };

  const handleAllow = async () => {
    const enabledPermissions = permissions.filter((p) => p.enabled);

    if (enabledPermissions.length === 0) {
      Alert.alert(
        'Chưa chọn quyền nào',
        'Vui lòng chọn ít nhất một quyền để tiếp tục.',
        [{ text: 'OK' }]
      );
      return;
    }

    setIsLoading(true);

    try {
      // Simulate API call to grant permissions
      await new Promise((resolve) => setTimeout(resolve, 2000));

      Linking.openURL('spendingtracker://user-info?code=abc');

      Alert.alert(
        'Cấp quyền thành công',
        'Bạn đã cấp quyền truy cập dữ liệu ngân hàng thành công. Bên thứ ba giờ đây có thể truy cập thông tin đã chọn.',
        [
          {
            text: 'Xem thông tin',
            // onPress: () => router.replace('/'),
          },
        ]
      );
    } catch (error) {
      Alert.alert(
        'Lỗi',
        'Đã xảy ra lỗi khi xử lý quyền truy cập của bạn. Vui lòng thử lại.',
        [{ text: 'OK' }]
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeny = () => {
    Alert.alert(
      'Từ chối truy cập',
      'Bạn có chắc chắn muốn từ chối truy cập? Điều này sẽ ngăn bên thứ ba truy cập dữ liệu ngân hàng của bạn.',
      [
        { text: 'Hủy', style: 'cancel' },
        {
          text: 'Từ chối',
          style: 'destructive',
          onPress: () => router.replace('/(auth)/login'),
        },
      ]
    );
  };

  const enabledCount = permissions.filter((p) => p.enabled).length;
  const requiredCount = permissions.filter((p) => p.required).length;

  return (
    <SafeAreaView className='flex-1 bg-white'>
      <StatusBar style='dark' backgroundColor='#ffffff' />

      {/* Header */}
      <View className='bg-white border-b border-gray-200 px-6 py-4'>
        <View className='flex-row items-center justify-between'>
          <Logo
            size='sm'
            variant='horizontal'
            title='SecureBank'
            subtitle='Your trusted partner'
          />
          <View className='bg-green-100 px-3 py-1 rounded-full'>
            <Text className='text-green-800 text-xs font-semibold'>SECURE</Text>
          </View>
        </View>
      </View>

      <ScrollView className='flex-1' showsVerticalScrollIndicator={false}>
        <View className='px-6 py-6'>
          {/* Title Section */}
          <View className='mb-6'>
            <Text className='text-2xl font-bold text-gray-900 mb-2'>
              Yêu cầu truy cập dữ liệu
            </Text>
            <Text className='text-gray-600 text-base leading-6'>
              <Text className='font-semibold'>FinTech Solutions Ltd.</Text> đang
              yêu cầu truy cập dữ liệu ngân hàng của bạn. Vui lòng xem xét và
              chọn các quyền bạn muốn cấp.
            </Text>
          </View>

          {/* TPP Information */}
          <Card
            variant='outlined'
            padding='md'
            className='mb-6 border-blue-200 bg-blue-50'
          >
            <View className='flex-row items-start gap-2'>
              <View className='w-12 h-12 bg-blue-600 rounded-lg items-center justify-center mr-4'>
                <Ionicons name='business' size={24} color='#ffffff' />
              </View>
              <View className='flex-1'>
                <Text className='font-bold text-blue-900 text-lg mb-1'>
                  FinTech Solutions Ltd.
                </Text>
                <Text className='text-blue-800 text-sm mb-2'>
                  Licensed Third Party Provider
                </Text>
                <Text className='text-blue-700 text-xs leading-4'>
                  FCA Registration: 123456789{'\n'}
                  Purpose: Personal Finance Management
                </Text>
              </View>
            </View>
          </Card>

          {/* Permissions List */}
          <View className='mb-6'>
            <View className='flex-row items-center justify-between mb-4'>
              <Text className='text-lg font-semibold text-gray-900'>
                Quyền được yêu cầu
              </Text>
              <Text className='text-sm text-gray-600'>
                {enabledCount} of {permissions.length} selected
              </Text>
            </View>

            <View className='gap-3'>
              {permissions.map((permission) => (
                <Card
                  key={permission.id}
                  variant='outlined'
                  padding='md'
                  className={`${
                    permission.enabled
                      ? 'border-blue-300 bg-blue-50'
                      : 'border-gray-200 bg-white'
                  }`}
                >
                  <Checkbox
                    checked={permission.enabled}
                    onPress={() => togglePermission(permission.id)}
                    disabled={permission.required}
                    label={
                      <View className='flex-row items-center'>
                        <Text className='font-semibold text-gray-900'>
                          {permission.title}
                        </Text>
                        {permission.required && (
                          <View className='ml-2 bg-red-100 px-2 py-0.5 rounded'>
                            <Text className='text-red-800 text-xs font-medium'>
                              Required
                            </Text>
                          </View>
                        )}
                      </View>
                    }
                    description={permission.description}
                    size='md'
                    variant='primary'
                    className='flex-row items-start'
                    labelClassName='flex-1'
                  />
                </Card>
              ))}
            </View>
          </View>

          {/* Data Usage Information */}
          <Card
            variant='outlined'
            padding='md'
            className='mb-6 border-yellow-200 bg-yellow-50'
          >
            <View className='flex-row items-start'>
              <Ionicons
                name='information-circle'
                size={20}
                color='#d97706'
                className='mr-3 mt-0.5'
              />
              <View className='flex-1'>
                <Text className='font-semibold text-yellow-800 text-sm mb-2'>
                  Cách dữ liệu của bạn sẽ được sử dụng
                </Text>
                <Text className='text-yellow-700 text-xs leading-4'>
                  • Dữ liệu sẽ chỉ được sử dụng cho quản lý tài chính cá nhân
                  {'\n'}• Thông tin sẽ được lưu trữ an toàn và mã hóa
                  {'\n'}• Bạn có thể thu hồi quyền truy cập bất cứ lúc nào{'\n'}
                  • Dữ liệu sẽ không được chia sẻ với bên thứ ba khác
                </Text>
              </View>
            </View>
          </Card>

          {/* Action Buttons */}
          <View className='gap-3'>
            <Button
              title='Cho phép truy cập'
              onPress={handleAllow}
              isLoading={isLoading}
              disabled={enabledCount === 0}
              variant='primary'
              size='lg'
            />

            <Button
              title='Từ chối truy cập'
              onPress={handleDeny}
              variant='outline'
              size='lg'
              disabled={isLoading}
            />
          </View>

          {/* Footer */}
          <View className='mt-6 block pt-6 border-t border-gray-200'>
            <View className='flex-row items-center justify-center mb-2'>
              <Ionicons name='shield-checkmark' size={16} color='#059669' />
              <Text className='text-green-700 text-sm font-medium ml-2'>
                Protected by bank-grade security
              </Text>
            </View>
            <Text className='text-gray-500 text-xs text-center leading-4'>
              This consent is governed by Open Banking regulations and PSD2
              compliance. Your data is protected under GDPR and banking privacy
              laws.
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
