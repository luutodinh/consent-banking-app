import Card from '@/components/ui/Card';
import { getAccountTransactions, Transaction } from '@/services/account.service';
import { getAccountTransactions as getLocalTransactions } from '@/utils/local-storage';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    FlatList,
    SafeAreaView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';

export default function TransactionsScreen() {
  const { accountId } = useLocalSearchParams<{ accountId: string }>();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  // Ngày mặc định: 3 tháng gần nhất
  const toDate = new Date().toISOString();
  const fromDate = new Date(new Date().setMonth(new Date().getMonth() - 3)).toISOString();

  useEffect(() => {
    if (!accountId) {
      setError('Không tìm thấy thông tin tài khoản');
      setLoading(false);
      return;
    }

    loadTransactions();
  }, [accountId]);

  const loadTransactions = async (refresh = false) => {
    if (refresh) {
      setPage(1);
      setHasMore(true);
    }
    
    setLoading(true);
    try {
      // Kiểm tra dữ liệu trong localStorage trước
      const cachedTransactions = getLocalTransactions(accountId as string);
      if (cachedTransactions && !refresh) {
        setTransactions(cachedTransactions.transactions || []);
        setPage(cachedTransactions.pageNumber || 1);
        setHasMore((cachedTransactions.pageNumber || 1) < (cachedTransactions.pageCount || 1));
      }

      // Sau đó gọi API để lấy dữ liệu mới
      const response = await getAccountTransactions(
        accountId as string,
        fromDate,
        toDate,
        refresh ? 1 : page,
        10
      );
      
      if (refresh) {
        setTransactions(response.transactions);
      } else {
        setTransactions((prev) => [...prev, ...response.transactions]);
      }
      
      setHasMore(response.pageNumber < response.pageCount);
      setPage(response.pageNumber + 1);
      setError(null);
    } catch (error) {
      console.error('Lỗi khi tải lịch sử giao dịch:', error);
      setError('Không thể tải lịch sử giao dịch. Vui lòng thử lại sau.');
    } finally {
      setLoading(false);
    }
  };

  const loadMoreTransactions = async () => {
    if (!hasMore || isLoadingMore) return;

    setIsLoadingMore(true);
    try {
      const response = await getAccountTransactions(
        accountId as string,
        fromDate,
        toDate,
        page,
        10
      );
      
      setTransactions((prev) => [...prev, ...response.transactions]);
      setHasMore(response.pageNumber < response.pageCount);
      setPage(response.pageNumber + 1);
    } catch (error) {
      console.error('Lỗi khi tải thêm giao dịch:', error);
    } finally {
      setIsLoadingMore(false);
    }
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

  const renderTransactionItem = ({ item }: { item: Transaction }) => {
    const isCredit = item.creditDebitIndicator === 'CRDT';
    
    return (
      <Card variant="outlined" padding="md" className="mb-3">
        <View style={styles.transactionContent}>
          <View style={[
            styles.transactionIconContainer, 
            { backgroundColor: isCredit ? '#dcfce7' : '#fee2e2' }
          ]}>
            <Ionicons 
              name={isCredit ? 'arrow-down' : 'arrow-up'} 
              size={20} 
              color={isCredit ? '#16a34a' : '#dc2626'} 
            />
          </View>
          <View style={styles.transactionDetails}>
            <View style={styles.transactionHeader}>
              <Text style={styles.transactionParty}>
                {isCredit 
                  ? item.relatedParties?.creditor?.name || 'Nhận tiền' 
                  : item.relatedParties?.debtor?.name || 'Chuyển tiền'}
              </Text>
              <Text style={[
                styles.transactionAmount,
                { color: isCredit ? '#16a34a' : '#dc2626' }
              ]}>
                {isCredit ? '+' : '-'} {formatCurrency(item.amount.value, item.amount.currency)}
              </Text>
            </View>
            <Text style={styles.transactionNote} numberOfLines={1}>
              {item.additionalTransactionInformation || 'Không có ghi chú'}
            </Text>
            <View style={styles.transactionFooter}>
              <Text style={styles.transactionDate}>
                {formatDate(item.valueDate)}
              </Text>
              <Text style={styles.transactionRef}>
                {item.references?.instructionIdentification || ''}
              </Text>
            </View>
          </View>
        </View>
      </Card>
    );
  };

  if (loading && !transactions.length) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar style="dark" />
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#111827" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Lịch sử giao dịch</Text>
          <View style={{ width: 24 }} />
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#3b82f6" />
          <Text style={styles.loadingText}>Đang tải lịch sử giao dịch...</Text>
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
        <Text style={styles.headerTitle}>Lịch sử giao dịch</Text>
        <View style={{ width: 24 }} />
      </View>

      {error ? (
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle-outline" size={48} color="#ef4444" />
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={() => loadTransactions(true)}>
            <Text style={styles.retryButtonText}>Thử lại</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          <View style={styles.filterContainer}>
            <Text style={styles.filterText}>
              Hiển thị giao dịch trong 3 tháng gần đây
            </Text>
          </View>

          <FlatList
            data={transactions}
            renderItem={renderTransactionItem}
            keyExtractor={(item, index) => `${item.references?.instructionIdentification || ''}-${index}`}
            contentContainerStyle={styles.listContainer}
            onEndReached={loadMoreTransactions}
            onEndReachedThreshold={0.3}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Ionicons name="document-text-outline" size={48} color="#9ca3af" />
                <Text style={styles.emptyText}>Không có giao dịch nào</Text>
              </View>
            }
            ListFooterComponent={
              isLoadingMore && hasMore ? (
                <View style={styles.footerLoader}>
                  <ActivityIndicator size="small" color="#3b82f6" />
                  <Text style={styles.footerText}>Đang tải thêm...</Text>
                </View>
              ) : null
            }
            refreshing={loading && transactions.length > 0}
            onRefresh={() => loadTransactions(true)}
          />
        </>
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
  filterContainer: {
    backgroundColor: '#f3f4f6',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  filterText: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
  },
  listContainer: {
    padding: 16,
    flexGrow: 1,
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
  emptyContainer: {
    paddingVertical: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#6b7280',
    marginTop: 16,
  },
  transactionContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  transactionIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  transactionDetails: {
    flex: 1,
  },
  transactionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  transactionParty: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    flex: 1,
  },
  transactionAmount: {
    fontSize: 16,
    fontWeight: '600',
  },
  transactionNote: {
    fontSize: 14,
    color: '#4b5563',
    marginBottom: 6,
  },
  transactionFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  transactionDate: {
    fontSize: 12,
    color: '#6b7280',
  },
  transactionRef: {
    fontSize: 12,
    color: '#9ca3af',
  },
  footerLoader: {
    paddingVertical: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  footerText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#6b7280',
  },
}); 