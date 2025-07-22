import { Ionicons } from '@expo/vector-icons';
import * as Crypto from 'expo-crypto';
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
import {
  BANKING_APP_DEEP_LINK,
  CLIENT_ID,
  CLIENT_SECRET,
  CODE_CHALLENGE_METHOD,
  REALM,
  REDIRECT_URI,
  SCOPE,
} from '@/constants/env';
import { generatePKCE } from '@/utils/pkce';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface PermissionScope {
  id: string;
  title: string;
  description: string;
  icon: keyof typeof Ionicons.glyphMap;
  required: boolean;
  enabled: boolean;
  apis: string[];
}

const PERMISSION_SCOPES: PermissionScope[] = [
  {
    id: 'ais',
    title: 'AIS (Account Information Services)',
    description: 'Account Information Services - Dịch vụ thông tin tài khoản',
    icon: 'card-outline',
    required: true,
    enabled: true,
    apis: ['accounts', 'information', 'transactions'],
  },
  {
    id: 'pis',
    title: 'PIS (Payment Initiation Services)',
    description: 'Payment Initiation Services - Dịch vụ khởi tạo thanh toán',
    icon: 'send-outline',
    required: false,
    enabled: true,
    apis: ['payments', 'cash-in'],
  },
  {
    id: 'ewlt',
    title: 'EWLT (E-Wallet Services)',
    description: 'E-Wallet Services - Dịch vụ ví điện tử',
    icon: 'wallet-outline',
    required: false,
    enabled: false,
    apis: ['cash-out'],
  },
];

export default function ConsentScreen() {
  const [permissions, setPermissions] =
    useState<PermissionScope[]>(PERMISSION_SCOPES);
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
    // const enabledPermissions = permissions.filter((p) => p.enabled);

    // if (enabledPermissions.length === 0) {
    //   Alert.alert(
    //     'Chưa Chọn Quyền Nào',
    //     'Vui lòng chọn ít nhất một quyền để tiếp tục.',
    //     [{ text: 'Đồng Ý' }]
    //   );
    //   return;
    // }

    setIsLoading(true);

    try {
      // Simulate API call to grant permissions
      await new Promise((resolve) => setTimeout(resolve, 2000));
      const { code_verifier, code_challenge } = await generatePKCE();

      const state = Crypto.randomUUID(); // Use Crypto.randomUUID() for state generation

      await AsyncStorage.setItem('state', state);
      await AsyncStorage.setItem('code_verifier', code_verifier);

      Linking.openURL(
        `${BANKING_APP_DEEP_LINK}/--/?client_id=${CLIENT_ID}&redirect_uri=${encodeURIComponent(
          REDIRECT_URI
        )}&realm=${REALM}&client_secret=${CLIENT_SECRET}&code_challenge=${code_challenge}&code_challenge_method=${CODE_CHALLENGE_METHOD}&state=${state}&scope=${SCOPE}`
      );
      // Linking.openURL(
      //   `http://localhost:8082?client_id=${CLIENT_ID}&redirect_uri=${encodeURIComponent(
      //     REDIRECT_URI
      //   )}&keycloak_url=${encodeURIComponent(
      //     KEYCLOAK_URL
      //   )}&realm=${REALM}&client_secret=${CLIENT_SECRET}&code_challenge=${CODE_CHALLENGE}`
      // );

      // Alert.alert(
      //   'Cấp Quyền Thành Công',
      //   'Bạn đã cấp quyền truy cập dữ liệu ngân hàng thành công. Ứng dụng MoneyTracker giờ đây có thể truy cập các thông tin đã chọn.',
      //   [
      //     {
      //       text: 'Tiếp Tục',
      //       onPress: () => router.replace('/(tabs)'),
      //     },
      //   ]
      // );
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

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#ffffff' }}>
      <StatusBar style='dark' backgroundColor='#ffffff' />

      {/* Header */}
      <View className='bg-white border-b border-gray-200 px-6 py-4'>
        <View className='flex-row items-center justify-between'>
          <Logo
            size='sm'
            variant='horizontal'
            title='TPP App'
            subtitle='Tracking your finances'
          />
          <View className='bg-green-100 px-3 py-1 rounded-full'>
            <Text className='text-green-800 text-xs font-semibold'>
              BẢO MẬT
            </Text>
          </View>
        </View>
      </View>

      <ScrollView className='flex-1' showsVerticalScrollIndicator={false}>
        <View className='px-6 py-6'>
          {/* Title Section */}
          <View className='mb-6'>
            <Text className='text-2xl font-bold text-gray-900 mb-2'>
              Yêu Cầu Truy Cập Dữ Liệu
            </Text>
            <Text className='text-gray-600 text-base leading-6'>
              <Text className='font-semibold'>TPP App</Text> cần truy cập vào dữ
              liệu ngân hàng của bạn để cung cấp các dịch vụ quản lý tài chính
              cá nhân. Vui lòng xem xét các quyền truy cập dưới đây và đồng ý
              nếu bạn đồng ý với các điều khoản.
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
                <Ionicons name='wallet' size={24} color='#ffffff' />
              </View>
              <View className='flex-1'>
                <Text className='font-bold text-blue-900 text-lg mb-1'>
                  TPP App
                </Text>
                <Text className='text-blue-800 text-sm mb-2'>
                  Ứng dụng Quản lý Tài chính Cá nhân
                </Text>
                <Text className='text-blue-700 text-xs leading-4'>
                  Đăng ký TPP: MT-2024-001{'\n'}
                  Mục đích: Theo dõi và phân tích chi tiêu cá nhân{'\n'}
                  Nhà phát triển: FinTech Vietnam Co., Ltd.
                </Text>
              </View>
            </View>
          </Card>

          {/* Permissions List */}
          <View className='mb-6'>
            <View className='flex-row items-center justify-between mb-4'>
              <Text className='text-lg font-semibold text-gray-900'>
                Phạm Vi Quyền Truy Cập
              </Text>
              <Text className='text-sm text-gray-600'>
                {enabledCount} / {permissions.length} được chọn
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
                  <View className='flex-row items-start gap-3'>
                    <Checkbox
                      // checked={permission.enabled}
                      checked={true}
                      onPress={() => togglePermission(permission.id)}
                      // disabled={permission.required}
                      size='md'
                      variant='primary'
                    />
                    <View className='flex-1'>
                      <View className='flex-row items-center mb-1'>
                        <Text className='font-semibold text-gray-900 flex-1'>
                          {permission.title}
                        </Text>
                        {/* {permission.required && (
                          <View className='ml-2 bg-red-100 px-2 py-0.5 rounded'>
                            <Text className='text-red-800 text-xs font-medium'>
                              Bắt buộc
                            </Text>
                          </View>
                        )} */}
                      </View>
                      <Text className='text-gray-600 text-sm leading-4 mb-2'>
                        {permission.description}
                      </Text>
                      <View className='flex-row flex-wrap gap-1'>
                        <Text className='text-xs font-medium text-gray-700 mr-1'>
                          APIs yêu cầu:
                        </Text>
                        {permission.apis.map((api) => (
                          <View
                            key={api}
                            className='bg-gray-100 px-2 py-0.5 rounded'
                          >
                            <Text className='text-xs text-gray-700 font-mono'>
                              {api}
                            </Text>
                          </View>
                        ))}
                      </View>
                    </View>
                  </View>
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
                  Dữ liệu của bạn sẽ được sử dụng như thế nào
                </Text>
                <Text className='text-yellow-700 text-xs leading-4'>
                  • Dữ liệu chỉ được sử dụng cho mục đích quản lý tài chính cá
                  nhân
                  {'\n'}• Thông tin sẽ được lưu trữ an toàn và mã hóa
                  {'\n'}• Bạn có thể thu hồi quyền truy cập bất cứ lúc nào
                  {'\n'}• Dữ liệu sẽ không được chia sẻ với bên thứ ba khác
                  {'\n'}• Tuân thủ đầy đủ các quy định về bảo mật ngân hàng
                </Text>
              </View>
            </View>
          </Card>

          {/* Action Buttons */}
          <View className='gap-3'>
            <Button
              title='Cho Phép Truy Cập'
              onPress={handleAllow}
              isLoading={isLoading}
              disabled={enabledCount === 0}
              variant='primary'
              size='lg'
            />

            <Button
              title='Từ Chối Truy Cập'
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
                Được bảo vệ bởi bảo mật cấp ngân hàng
              </Text>
            </View>
            <Text className='text-gray-500 text-xs text-center leading-4'>
              Sự đồng ý này được điều chỉnh bởi các quy định Open Banking và
              tuân thủ PSD2. Dữ liệu của bạn được bảo vệ theo GDPR và luật bảo
              mật ngân hàng Việt Nam.
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
