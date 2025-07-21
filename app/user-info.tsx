import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  Text,
  View,
} from 'react-native';

import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Logo from '@/components/ui/Logo';

interface UserAccount {
  id: string;
  accountNumber: string;
  sortCode: string;
  accountType: string;
  balance: number;
  currency: string;
  accountName: string;
}

interface UserInfo {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: {
    street: string;
    city: string;
    postcode: string;
    country: string;
  };
  accounts: UserAccount[];
  lastLogin: string;
  consentGrantedAt: string;
}

// Mock data - trong thực tế sẽ lấy từ API
const MOCK_USER_DATA: UserInfo = {
  id: 'user_123456',
  name: 'Nguyễn Văn An',
  email: 'nguyen.van.an@email.com',
  phone: '+84 901 234 567',
  address: {
    street: '123 Đường Lê Lợi',
    city: 'Thành phố Hồ Chí Minh',
    postcode: '700000',
    country: 'Việt Nam',
  },
  accounts: [
    {
      id: 'acc_001',
      accountNumber: '1234567890',
      sortCode: '12-34-56',
      accountType: 'Current Account',
      balance: 15750000,
      currency: 'VND',
      accountName: 'Tài khoản thanh toán',
    },
    {
      id: 'acc_002',
      accountNumber: '0987654321',
      sortCode: '65-43-21',
      accountType: 'Savings Account',
      balance: 50000000,
      currency: 'VND',
      accountName: 'Tài khoản tiết kiệm',
    },
  ],
  lastLogin: '2024-01-19T10:30:00Z',
  consentGrantedAt: '2024-01-19T09:15:00Z',
};

export default function UserInfoScreen() {
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadUserInfo = async () => {
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setUserInfo(MOCK_USER_DATA);
    } catch (error) {
      Alert.alert(
        'Lỗi',
        'Không thể tải thông tin người dùng. Vui lòng thử lại.',
        [{ text: 'OK' }]
      );
    } finally {
      setIsLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadUserInfo();
    setRefreshing(false);
  };

  useEffect(() => {
    loadUserInfo();
  }, []);

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: currency === 'VND' ? 'VND' : 'USD',
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleRevokeConsent = () => {
    Alert.alert(
      'Thu hồi quyền truy cập',
      'Bạn có chắc chắn muốn thu hồi quyền truy cập? Điều này sẽ ngăn bên thứ ba truy cập dữ liệu ngân hàng của bạn.',
      [
        { text: 'Hủy', style: 'cancel' },
        {
          text: 'Thu hồi',
          style: 'destructive',
          onPress: () => {
            Alert.alert(
              'Đã thu hồi quyền truy cập',
              'Quyền truy cập đã được thu hồi thành công.',
              [
                {
                  text: 'OK',
                  onPress: () => router.replace('/(auth)/login'),
                },
              ]
            );
          },
        },
      ]
    );
  };

  if (isLoading) {
    return (
      <SafeAreaView className='flex-1 bg-white'>
        <StatusBar style='dark' backgroundColor='#ffffff' />
        <View className='flex-1 items-center justify-center'>
          <Text className='text-gray-600 text-lg'>Đang tải thông tin...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!userInfo) {
    return (
      <SafeAreaView className='flex-1 bg-white'>
        <StatusBar style='dark' backgroundColor='#ffffff' />
        <View className='flex-1 items-center justify-center px-6'>
          <Ionicons name='alert-circle-outline' size={64} color='#ef4444' />
          <Text className='text-gray-900 text-xl font-bold mt-4 mb-2'>
            Không thể tải thông tin
          </Text>
          <Text className='text-gray-600 text-center mb-6'>
            Đã xảy ra lỗi khi tải thông tin người dùng. Vui lòng thử lại.
          </Text>
          <Button
            title='Thử lại'
            onPress={loadUserInfo}
            variant='primary'
            size='lg'
          />
        </View>
      </SafeAreaView>
    );
  }

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
            <Text className='text-green-800 text-xs font-semibold'>
              CONNECTED
            </Text>
          </View>
        </View>
      </View>

      <ScrollView
        className='flex-1'
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View className='px-6 py-6'>
          {/* Title Section */}
          <View className='mb-6'>
            <Text className='text-2xl font-bold text-gray-900 mb-2'>
              Thông tin người dùng
            </Text>
            <Text className='text-gray-600 text-base leading-6'>
              Dưới đây là thông tin tài khoản và dữ liệu mà bạn đã cấp quyền
              truy cập.
            </Text>
          </View>

          {/* User Profile */}
          <Card
            variant='outlined'
            padding='md'
            className='mb-6 border-blue-200 bg-blue-50'
          >
            <View className='flex-row items-start'>
              <View className='w-16 h-16 bg-blue-600 rounded-full items-center justify-center mr-4'>
                <Ionicons name='person' size={32} color='#ffffff' />
              </View>
              <View className='flex-1'>
                <Text className='font-bold text-blue-900 text-xl mb-1'>
                  {userInfo.name}
                </Text>
                <Text className='text-blue-800 text-sm mb-1'>
                  ID: {userInfo.id}
                </Text>
                <Text className='text-blue-700 text-sm'>{userInfo.email}</Text>
                <Text className='text-blue-700 text-sm'>{userInfo.phone}</Text>
              </View>
            </View>
          </Card>

          {/* Address Information */}
          <Card variant='outlined' padding='md' className='mb-6'>
            <View className='flex-row items-start mb-3'>
              <Ionicons
                name='location-outline'
                size={20}
                color='#374151'
                className='mr-3 mt-1'
              />
              <Text className='font-semibold text-gray-900 text-lg'>
                Địa chỉ
              </Text>
            </View>
            <View className='ml-8'>
              <Text className='text-gray-700 text-base leading-6'>
                {userInfo.address.street}
                {'\n'}
                {userInfo.address.city} {userInfo.address.postcode}
                {'\n'}
                {userInfo.address.country}
              </Text>
            </View>
          </Card>

          {/* Account Information */}
          <View className='mb-6'>
            <View className='flex-row items-center mb-4'>
              <Ionicons
                name='card-outline'
                size={20}
                color='#374151'
                className='mr-2'
              />
              <Text className='text-lg font-semibold text-gray-900'>
                Tài khoản ngân hàng
              </Text>
              <Text className='text-sm text-gray-600 ml-auto'>
                {userInfo.accounts.length} tài khoản
              </Text>
            </View>

            <View className='gap-3'>
              {userInfo.accounts.map((account) => (
                <Card
                  key={account.id}
                  variant='outlined'
                  padding='md'
                  className='border-gray-200 bg-white'
                >
                  <View className='flex-row items-start justify-between mb-3'>
                    <View className='flex-1'>
                      <Text className='font-semibold text-gray-900 text-base mb-1'>
                        {account.accountName}
                      </Text>
                      <Text className='text-gray-600 text-sm'>
                        {account.accountType}
                      </Text>
                    </View>
                    <View className='bg-green-100 px-3 py-1 rounded-full'>
                      <Text className='text-green-800 text-xs font-semibold'>
                        ACTIVE
                      </Text>
                    </View>
                  </View>

                  <View className='border-t border-gray-100 pt-3'>
                    <View className='flex-row justify-between items-center mb-2'>
                      <Text className='text-gray-600 text-sm'>
                        Số tài khoản:
                      </Text>
                      <Text className='text-gray-900 font-mono text-sm'>
                        {account.accountNumber}
                      </Text>
                    </View>
                    <View className='flex-row justify-between items-center mb-2'>
                      <Text className='text-gray-600 text-sm'>
                        Mã ngân hàng:
                      </Text>
                      <Text className='text-gray-900 font-mono text-sm'>
                        {account.sortCode}
                      </Text>
                    </View>
                    <View className='flex-row justify-between items-center'>
                      <Text className='text-gray-600 text-sm'>Số dư:</Text>
                      <Text className='text-gray-900 font-semibold text-base'>
                        {formatCurrency(account.balance, account.currency)}
                      </Text>
                    </View>
                  </View>
                </Card>
              ))}
            </View>
          </View>

          {/* Consent Information */}
          <Card
            variant='outlined'
            padding='md'
            className='mb-6 border-yellow-200 bg-yellow-50'
          >
            <View className='flex-row items-start mb-3'>
              <Ionicons
                name='shield-checkmark-outline'
                size={20}
                color='#d97706'
                className='mr-3 mt-1'
              />
              <Text className='font-semibold text-yellow-800 text-lg'>
                Thông tin quyền truy cập
              </Text>
            </View>
            <View className='ml-8'>
              <View className='flex-row justify-between items-center mb-2'>
                <Text className='text-yellow-700 text-sm'>Cấp quyền lúc:</Text>
                <Text className='text-yellow-800 text-sm font-medium'>
                  {formatDate(userInfo.consentGrantedAt)}
                </Text>
              </View>
              <View className='flex-row justify-between items-center'>
                <Text className='text-yellow-700 text-sm'>Đăng nhập cuối:</Text>
                <Text className='text-yellow-800 text-sm font-medium'>
                  {formatDate(userInfo.lastLogin)}
                </Text>
              </View>
            </View>
          </Card>

          {/* Action Buttons */}
          <View className='gap-3'>
            <Button
              title='Làm mới dữ liệu'
              onPress={onRefresh}
              variant='outline'
              size='lg'
              disabled={refreshing}
            />

            <Button
              title='Thu hồi quyền truy cập'
              onPress={handleRevokeConsent}
              variant='danger'
              size='lg'
            />
          </View>

          {/* Footer */}
          <View className='mt-6 pt-6 border-t border-gray-200'>
            <View className='flex-row items-center justify-center mb-2'>
              <Ionicons name='shield-checkmark' size={16} color='#059669' />
              <Text className='text-green-700 text-sm font-medium ml-2'>
                Dữ liệu được bảo mật cấp ngân hàng
              </Text>
            </View>
            <Text className='text-gray-500 text-xs text-center leading-4'>
              Thông tin này được bảo vệ theo quy định Open Banking và tuân thủ
              PSD2. Dữ liệu của bạn được bảo vệ theo GDPR và luật bảo mật ngân
              hàng.
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
