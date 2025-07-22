import { Image } from 'expo-image';
import { router } from 'expo-router';
import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';

import { HelloWave } from '@/components/HelloWave';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import Button from '@/components/ui/Button';
import { setAccessToken } from '@/utils/local-storage';

// Sử dụng token mặc định từ file yaml
const MOCK_TOKEN = 'mock-access-token';

export default function HomeScreen() {
  // Thêm token khi component mount
  useEffect(() => {
    // Tự động thêm token giả để test
    const setupToken = async () => {
      await setAccessToken(MOCK_TOKEN);
      console.log('Đã thêm mock token:', MOCK_TOKEN);
    };
    
    setupToken();
  }, []);

  const handleTestClick = () => {
    // Chuyển đến màn hình tài khoản
    router.push('/accounts');
  };

  const handleConsentClick = () => {
    // Chuyển đến màn hình cấp quyền
    router.push('/consent');
  };

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
      headerImage={
        <Image
          source={require('@/assets/images/partial-react-logo.png')}
          style={styles.reactLogo}
        />
      }>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Open Banking API Demo</ThemedText>
        <HelloWave />
      </ThemedView>

      <ThemedView style={styles.container}>
        <ThemedText type="subtitle">Chào mừng đến với Open Banking API</ThemedText>
        <ThemedText style={styles.description}>
          Ứng dụng này cho phép bạn truy cập vào dữ liệu ngân hàng thông qua Open Banking API. Bạn có thể xem thông tin tài khoản, số dư và lịch sử giao dịch.
        </ThemedText>

        <View style={styles.buttonContainer}>
          <Button 
            title="Xem tài khoản" 
            onPress={handleTestClick} 
            variant="primary"
            size="lg"
          />

          <Button 
            title="Màn hình cấp quyền" 
            onPress={handleConsentClick} 
            variant="outline"
            size="lg"
            style={styles.secondButton}
          />
        </View>

        <ThemedView style={styles.infoContainer}>
          <ThemedText type="defaultSemiBold" style={styles.infoTitle}>
            Thông tin đăng nhập:
          </ThemedText>
          <ThemedText style={styles.infoText}>
            - API URL: https://openapi.atomsolution.vn/open-banking/api
          </ThemedText>
          <ThemedText style={styles.infoText}>
            - Token: {MOCK_TOKEN}
          </ThemedText>
          <ThemedText style={styles.infoText}>
            - Tài khoản test: ACCT123456
          </ThemedText>
        </ThemedView>
      </ThemedView>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 24,
  },
  container: {
    gap: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
  description: {
    marginTop: 8,
    marginBottom: 24,
    lineHeight: 22,
  },
  buttonContainer: {
    marginTop: 16,
    marginBottom: 32,
  },
  secondButton: {
    marginTop: 12,
  },
  infoContainer: {
    backgroundColor: '#f0f9ff',
    padding: 16,
    borderRadius: 8,
    marginTop: 16,
    borderWidth: 1,
    borderColor: '#bae6fd',
  },
  infoTitle: {
    marginBottom: 8,
  },
  infoText: {
    marginBottom: 4,
  },
});
