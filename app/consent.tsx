import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import {
    Alert,
    SafeAreaView,
    ScrollView,
    Text,
    View
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
  scope: string; // API scope
}

const PERMISSIONS: Permission[] = [
  {
    id: 'account_info',
    title: 'Thông tin tài khoản',
    description:
      'Truy cập thông tin tài khoản, số tài khoản, và thông tin cơ bản của bạn',
    icon: 'card-outline',
    required: true,
    enabled: true,
    scope: 'AIS',
  },
  {
    id: 'balance',
    title: 'Số dư tài khoản',
    description: 'Xem số dư tài khoản hiện tại và tiền khả dụng',
    icon: 'wallet-outline',
    required: true,
    enabled: true,
    scope: 'AIS',
  },
  {
    id: 'transactions',
    title: 'Lịch sử giao dịch',
    description: 'Truy cập lịch sử giao dịch của bạn trong 12 tháng qua',
    icon: 'list-outline',
    required: false,
    enabled: true,
    scope: 'AIS',
  },
  {
    id: 'payment_initiation',
    title: 'Khởi tạo thanh toán',
    description:
      'Cho phép thực hiện thanh toán từ tài khoản của bạn',
    icon: 'cash-outline',
    required: false,
    enabled: false,
    scope: 'PIS',
  },
  {
    id: 'ewallet_integration',
    title: 'Liên kết ví điện tử',
    description: 'Cho phép nạp tiền vào và rút tiền từ ví điện tử',
    icon: 'phone-portrait-outline',
    required: false,
    enabled: false,
    scope: 'EWLT',
  },
  {
    id: 'direct_debits',
    title: 'Ghi nợ trực tiếp',
    description:
      'Truy cập thông tin ghi nợ trực tiếp và lịch thanh toán',
    icon: 'arrow-down-circle-outline',
    required: false,
    enabled: false,
    scope: 'AIS',
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

  // Tạo danh sách các scope đã chọn
  const getSelectedScopes = () => {
    const enabledPermissions = permissions.filter((p) => p.enabled);
    // Loại bỏ trùng lặp scope
    return [...new Set(enabledPermissions.map((p) => p.scope))];
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
      // Lấy danh sách scope đã chọn
      const scopes = getSelectedScopes();
      console.log('Selected scopes:', scopes);

      // Giả định lưu thông tin đồng ý
      localStorage.setItem('approved_scopes', JSON.stringify(scopes));
      
      // Giả định kết nối với API OAuth
      await new Promise((resolve) => setTimeout(resolve, 2000));

      Alert.alert(
        'Cấp quyền thành công',
        'Bạn đã cấp quyền truy cập dữ liệu ngân hàng thành công. Bên thứ ba giờ đây có thể truy cập thông tin đã chọn.',
        [
          {
            text: 'Xem tài khoản',
            onPress: () => router.replace('/'),
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
    <SafeAreaView style={{ flex: 1, backgroundColor: '#ffffff' }}>
      <StatusBar style='dark' backgroundColor='#ffffff' />

      {/* Header */}
      <View style={{ backgroundColor: '#ffffff', borderBottomWidth: 1, borderBottomColor: '#e5e7eb', paddingHorizontal: 24, paddingVertical: 16 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <Logo
            size='sm'
            variant='horizontal'
            title='OpenBank API'
            subtitle='Ngân hàng mở'
          />
          <View style={{ backgroundColor: '#dcfce7', paddingHorizontal: 12, paddingVertical: 4, borderRadius: 9999 }}>
            <Text style={{ color: '#166534', fontSize: 12, fontWeight: '600' }}>SECURE</Text>
          </View>
        </View>
      </View>

      <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
        <View className='px-6 py-6'>
          {/* Title Section */}
          <View className='mb-6'>
            <Text className='text-2xl font-bold text-gray-900 mb-2'>
              Yêu cầu truy cập dữ liệu
            </Text>
            <Text className='text-gray-600 text-base leading-6'>
              <Text className='font-semibold'>Open Banking API</Text> đang
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
                  Open Banking API
                </Text>
                <Text className='text-blue-800 text-sm mb-2'>
                  Nhà cung cấp dịch vụ được cấp phép
                </Text>
                <Text className='text-blue-700 text-xs leading-4'>
                  Đăng ký: VN-TPP-123456789{'\n'}
                  Mục đích: Quản lý tài chính cá nhân
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
                {enabledCount} trên {permissions.length} đã chọn
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
                    label={permission.title}
                    description={permission.description}
                    size='md'
                    variant='primary'
                    className='flex-row items-start'
                    labelClassName='flex-1'
                  />
                  <View className="mt-1 bg-gray-100 self-start px-2 py-1 rounded">
                    <Text className="text-xs text-gray-600">
                      Phạm vi: {permission.scope}
                    </Text>
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
                  Cách dữ liệu của bạn sẽ được sử dụng
                </Text>
                <Text className='text-yellow-700 text-xs leading-4'>
                  • Dữ liệu sẽ chỉ được sử dụng cho quản lý tài chính cá nhân
                  {'\n'}• Thông tin sẽ được lưu trữ an toàn và mã hóa
                  {'\n'}• Bạn có thể thu hồi quyền truy cập bất cứ lúc nào{'\n'}
                  • Quyền truy cập sẽ hết hạn sau 90 ngày
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
                Bảo vệ bởi bảo mật tiêu chuẩn ngân hàng
              </Text>
            </View>
            <Text className='text-gray-500 text-xs text-center leading-4'>
              Việc đồng ý này tuân theo các quy định của Open Banking và tuân thủ PSD2. 
              Dữ liệu của bạn được bảo vệ theo GDPR và luật bảo mật ngân hàng.
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
