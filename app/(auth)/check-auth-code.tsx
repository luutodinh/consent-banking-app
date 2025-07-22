import { BANKING_APP_DEEP_LINK } from '@/constants/env';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Text } from '@react-navigation/elements';
import { useLocalSearchParams } from 'expo-router';
import React, { useEffect } from 'react';
import { Linking, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const CheckAuthCode = () => {
  const [wrongState, setWrongState] = React.useState(false);
  const [loading, setLoading] = React.useState(true);

  const { code, state, error, error_description } = useLocalSearchParams<{
    code: string;
    state: string;
    error: string;
    error_description: string;
  }>();

  useEffect(() => {
    const checkState = async () => {
      try {
        const storedState = await AsyncStorage.getItem('state');
        
        if (storedState !== state) {
          setWrongState(true);
          setLoading(false);
          return;
        }

        // Xử lý trường hợp lỗi từ ngân hàng
        if (error) {
          // Chuyển hướng về app banking với thông tin lỗi
          Linking.openURL(
            `${BANKING_APP_DEEP_LINK}/--/consent?error=${error}&error_description=${error_description || ''}&state=${state || ''}`
          );
          return;
        }

        // Xử lý trường hợp thành công có code
        if (code) {
          Linking.openURL(
            `${BANKING_APP_DEEP_LINK}/--/consent?code=${code}&state=${state}&error=${error || ''}`
          );
        } else {
          setLoading(false);
        }
      } catch (err) {
        console.error('Error during authentication process:', err);
        setLoading(false);
      }
    };

    checkState();
  }, [state, code, error, error_description]);

  // Hiển thị thông báo lỗi từ ngân hàng
  if (error === 'invalid_redirect_uri') {
    return (
      <SafeAreaView className='flex-1 justify-center items-center p-6'>
        <View className='bg-red-50 p-4 rounded-lg border border-red-300 w-full'>
          <Text className='text-red-800 font-bold text-lg mb-2'>Lỗi xác thực</Text>
          <Text className='text-red-700 mb-1'>Mã lỗi: {error}</Text>
          <Text className='text-red-700'>{error_description}</Text>
        </View>
        <Text className='mt-4 text-gray-600'>Đang chuyển hướng về ứng dụng...</Text>
      </SafeAreaView>
    );
  }

  if (loading) {
    return (
      <SafeAreaView className='flex-1 justify-center items-center'>
        <Text>Đang xử lý...</Text>
      </SafeAreaView>
    );
  }

  if (wrongState) {
    return (
      <SafeAreaView className='flex-1 justify-center items-center'>
        <Text>State mismatch. Vui lòng thử lại.</Text>
      </SafeAreaView>
    );
  }

  if (!code && !error) {
    return (
      <SafeAreaView className='flex-1 justify-center items-center'>
        <Text>Tham số không hợp lệ</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className='flex-1 justify-center items-center'>
      <Text>Đang mở ứng dụng ngân hàng...</Text>
    </SafeAreaView>
  );
};

export default CheckAuthCode;
