import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import { AccountInfo, getAccountInformation } from '@/services/account.service';
import { getAccountInfo } from '@/utils/local-storage';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';

export default function AccountDetailsScreen() {
  const { accountId } = useLocalSearchParams<{ accountId: string }>();
  const [accountInfo, setAccountInfo] = useState<AccountInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!accountId) {
      setError('Không tìm thấy thông tin tài khoản');
      setLoading(false);
      return;
    }

    loadAccountInfo();
  }, [accountId]);

  const loadAccountInfo = async () => {
    setLoading(true);
    try {
      // Kiểm tra dữ liệu trong localStorage trước
      const cachedInfo = getAccountInfo(accountId as string);
      if (cachedInfo) {
        setAccountInfo(cachedInfo);
      }

      // Sau đó gọi API để lấy dữ liệu mới
      const fetchedInfo = await getAccountInformation(accountId as string);
      setAccountInfo(fetchedInfo);
      setError(null);
    } catch (error) {
      console.error('Lỗi khi tải thông tin tài khoản:', error);
      setError('Không thể tải thông tin tài khoản. Vui lòng thử lại sau.');
    } finally {
      setLoading(false);
    }
  };

  const navigateToTransactions = () => {
    if (!accountId) return;
    
    // Sửa lỗi navigation
    router.push(`/transactions?accountId=${accountId}`);
  };

  const formatCurrency = (value: number, currency: string) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: currency || 'VND',
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar style="dark" />
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#111827" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Chi tiết tài khoản</Text>
          <View style={{ width: 24 }} />
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#3b82f6" />
          <Text style={styles.loadingText}>Đang tải thông tin tài khoản...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error || !accountInfo) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar style="dark" />
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#111827" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Chi tiết tài khoản</Text>
          <View style={{ width: 24 }} />
        </View>
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle-outline" size={48} color="#ef4444" />
          <Text style={styles.errorText}>{error || 'Không tìm thấy thông tin tài khoản'}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={loadAccountInfo}>
            <Text style={styles.retryButtonText}>Thử lại</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#111827" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Chi tiết tài khoản</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        <Card variant="outlined" padding="lg" className="mx-4 mt-4">
          <View style={styles.balanceContainer}>
            <Text style={styles.balanceLabel}>Số dư hiện tại</Text>
            <Text style={styles.balanceAmount}>
              {formatCurrency(accountInfo.balances.amount.value, accountInfo.balances.amount.currency)}
            </Text>
            <Text style={styles.balanceDate}>
              Cập nhật: {formatDate(accountInfo.balances.dateTime)}
            </Text>
          </View>
        </Card>

        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Thông tin tài khoản</Text>
          <Card variant="outlined" padding="md" className="mt-2">
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Chủ tài khoản</Text>
              <Text style={styles.infoValue}>{accountInfo.name}</Text>
            </View>
            <View style={styles.divider} />
            
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Số tài khoản</Text>
              <Text style={styles.infoValue}>{accountInfo.accountId}</Text>
            </View>
            <View style={styles.divider} />
            
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Ngân hàng</Text>
              <Text style={styles.infoValue}>{accountInfo.bankCode}</Text>
            </View>
            <View style={styles.divider} />
            
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Loại tài khoản</Text>
              <Text style={styles.infoValue}>
                {accountInfo.type === 'payment' ? 'Thanh toán' : accountInfo.type}
              </Text>
            </View>
            <View style={styles.divider} />
            
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Tiền tệ</Text>
              <Text style={styles.infoValue}>{accountInfo.currency}</Text>
            </View>
            <View style={styles.divider} />
            
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Ngày tạo</Text>
              <Text style={styles.infoValue}>{formatDate(accountInfo.creationDate)}</Text>
            </View>
          </Card>
        </View>

        <View style={styles.actionContainer}>
          <Button
            title="Xem lịch sử giao dịch"
            onPress={navigateToTransactions}
            variant="primary"
            size="lg"
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },
  backButton: {
    padding: 4,
  },
  scrollContainer: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#6b7280',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  errorText: {
    fontSize: 16,
    color: '#6b7280',
    marginTop: 16,
    marginBottom: 24,
    textAlign: 'center',
  },
  retryButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#3b82f6',
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  balanceContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
  },
  balanceLabel: {
    fontSize: 16,
    color: '#4b5563',
    marginBottom: 8,
  },
  balanceAmount: {
    fontSize: 28,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 8,
  },
  balanceDate: {
    fontSize: 12,
    color: '#6b7280',
  },
  sectionContainer: {
    paddingHorizontal: 16,
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 8,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  infoLabel: {
    fontSize: 14,
    color: '#6b7280',
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#111827',
  },
  divider: {
    height: 1,
    backgroundColor: '#e5e7eb',
  },
  actionContainer: {
    paddingHorizontal: 16,
    paddingVertical: 24,
    marginBottom: 16,
  },
}); 