import Card from '@/components/ui/Card';
import { Account, getAccounts } from '@/services/account.service';
import { getUserAccounts } from '@/utils/local-storage';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    FlatList,
    RefreshControl,
    SafeAreaView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';

export default function AccountsScreen() {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadAccounts();
  }, []);

  const loadAccounts = async () => {
    setLoading(true);
    try {
      // Kiểm tra dữ liệu trong localStorage trước
      const cachedAccounts = await getUserAccounts();
      
      if (cachedAccounts) {
        setAccounts(cachedAccounts);
        setLoading(false);
      }
      
      // Sau đó gọi API để lấy dữ liệu mới
      const fetchedAccounts = await getAccounts();
      setAccounts(fetchedAccounts);
    } catch (error) {
      console.error('Lỗi khi tải danh sách tài khoản:', error);
      Alert.alert(
        'Lỗi kết nối',
        'Không thể tải danh sách tài khoản. Vui lòng thử lại sau.'
      );
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadAccounts();
    setRefreshing(false);
  };

  const navigateToAccountDetails = (account: Account) => {
    // Sửa lỗi navigation
    router.push(`/account-details?accountId=${account.identification.accountId}`);
  };

  // Format số tiền hiển thị
  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: currency,
    }).format(amount);
  };

  const renderAccountItem = ({ item }: { item: Account }) => (
    <TouchableOpacity onPress={() => navigateToAccountDetails(item)}>
      <Card variant="outlined" padding="md" className="mb-3">
        <View style={styles.cardContent}>
          <View style={styles.accountIconContainer}>
            <Ionicons 
              name={item.type === 'payment' ? 'card-outline' : 'wallet-outline'} 
              size={24} 
              color="#3b82f6" 
            />
          </View>
          <View style={styles.accountDetails}>
            <Text style={styles.accountName}>{item.name}</Text>
            <Text style={styles.accountNumber}>
              Số TK: {item.identification.accountId}
            </Text>
            <Text style={styles.bankCode}>
              {item.bankCode} • {item.type === 'payment' ? 'Thanh toán' : item.type}
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
        </View>
      </Card>
    </TouchableOpacity>
  );

  if (loading && !refreshing) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar style="dark" />
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Tài khoản của tôi</Text>
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#3b82f6" />
          <Text style={styles.loadingText}>Đang tải danh sách tài khoản...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Tài khoản của tôi</Text>
      </View>
      {accounts && accounts.length > 0 ? (
        <FlatList
          data={accounts}
          renderItem={renderAccountItem}
          keyExtractor={(item) => item.identification.accountId}
          contentContainerStyle={styles.listContainer}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Ionicons name="wallet-outline" size={48} color="#9ca3af" />
          <Text style={styles.emptyText}>Không tìm thấy tài khoản nào</Text>
          <TouchableOpacity style={styles.refreshButton} onPress={loadAccounts}>
            <Text style={styles.refreshButtonText}>Thử lại</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  header: {
    paddingHorizontal: 24,
    paddingVertical: 16,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
  },
  listContainer: {
    padding: 16,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  accountIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#eff6ff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  accountDetails: {
    flex: 1,
  },
  accountName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  accountNumber: {
    fontSize: 14,
    color: '#4b5563',
    marginBottom: 2,
  },
  bankCode: {
    fontSize: 12,
    color: '#6b7280',
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
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  emptyText: {
    fontSize: 16,
    color: '#6b7280',
    marginTop: 16,
    marginBottom: 24,
    textAlign: 'center',
  },
  refreshButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#3b82f6',
    borderRadius: 8,
  },
  refreshButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
}); 