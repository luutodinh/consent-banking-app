import AsyncStorage from '@react-native-async-storage/async-storage';

const ACCESS_TOKEN = 'accessToken'
const REFRESH_TOKEN = 'refreshToken'
const USER_ACCOUNTS = 'userAccounts'
const ACCOUNT_INFO = 'accountInfo'
const ACCOUNT_TRANSACTIONS = 'accountTransactions'

export async function getAccessToken() {
  try {
    return await AsyncStorage.getItem(ACCESS_TOKEN);
  } catch (error) {
    console.error('Error getting access token:', error);
    return null;
  }
}

export async function setAccessToken(accessToken: string) {
  if (accessToken) {
    try {
      await AsyncStorage.setItem(ACCESS_TOKEN, accessToken);
    } catch (error) {
      console.error('Error setting access token:', error);
    }
  }
}

export async function getRefreshToken() {
  try {
    return await AsyncStorage.getItem(REFRESH_TOKEN);
  } catch (error) {
    console.error('Error getting refresh token:', error);
    return null;
  }
}

export async function setRefreshToken(refreshToken: string) {
  if (refreshToken) {
    try {
      await AsyncStorage.setItem(REFRESH_TOKEN, refreshToken);
    } catch (error) {
      console.error('Error setting refresh token:', error);
    }
  }
}

export async function clearToken() {
  try {
    await AsyncStorage.removeItem(ACCESS_TOKEN);
    await AsyncStorage.removeItem(REFRESH_TOKEN);
  } catch (error) {
    console.error('Error clearing tokens:', error);
  }
}

// Lưu danh sách tài khoản
export async function saveUserAccounts(accounts: any) {
  if (accounts) {
    try {
      await AsyncStorage.setItem(USER_ACCOUNTS, JSON.stringify(accounts));
    } catch (error) {
      console.error('Error saving user accounts:', error);
    }
  }
}

// Lấy danh sách tài khoản
export async function getUserAccounts() {
  try {
    const accounts = await AsyncStorage.getItem(USER_ACCOUNTS);
    return accounts ? JSON.parse(accounts) : null;
  } catch (error) {
    console.error('Error getting user accounts:', error);
    return null;
  }
}

// Lưu thông tin chi tiết tài khoản
export async function saveAccountInfo(accountId: string, info: any) {
  try {
    const accountsInfoStr = await AsyncStorage.getItem(ACCOUNT_INFO);
    const accountsInfo = accountsInfoStr ? JSON.parse(accountsInfoStr) : {};
    accountsInfo[accountId] = info;
    await AsyncStorage.setItem(ACCOUNT_INFO, JSON.stringify(accountsInfo));
  } catch (error) {
    console.error('Error saving account info:', error);
  }
}

// Lấy thông tin chi tiết tài khoản
export async function getAccountInfo(accountId: string) {
  try {
    const accountsInfo = await getAccountsInfo();
    return accountsInfo ? accountsInfo[accountId] : null;
  } catch (error) {
    console.error('Error getting account info:', error);
    return null;
  }
}

// Lấy tất cả thông tin tài khoản
export async function getAccountsInfo() {
  try {
    const info = await AsyncStorage.getItem(ACCOUNT_INFO);
    return info ? JSON.parse(info) : null;
  } catch (error) {
    console.error('Error getting accounts info:', error);
    return null;
  }
}

// Lưu lịch sử giao dịch
export async function saveAccountTransactions(accountId: string, transactions: any) {
  try {
    const allTransactionsStr = await AsyncStorage.getItem(ACCOUNT_TRANSACTIONS);
    const allTransactions = allTransactionsStr ? JSON.parse(allTransactionsStr) : {};
    allTransactions[accountId] = transactions;
    await AsyncStorage.setItem(ACCOUNT_TRANSACTIONS, JSON.stringify(allTransactions));
  } catch (error) {
    console.error('Error saving account transactions:', error);
  }
}

// Lấy lịch sử giao dịch của tài khoản
export async function getAccountTransactions(accountId: string) {
  try {
    const allTransactions = await getAccountsTransactions();
    return allTransactions ? allTransactions[accountId] : null;
  } catch (error) {
    console.error('Error getting account transactions:', error);
    return null;
  }
}

// Lấy tất cả lịch sử giao dịch
export async function getAccountsTransactions() {
  try {
    const transactions = await AsyncStorage.getItem(ACCOUNT_TRANSACTIONS);
    return transactions ? JSON.parse(transactions) : null;
  } catch (error) {
    console.error('Error getting accounts transactions:', error);
    return null;
  }
}

// Xóa tất cả dữ liệu
export async function clearAllData() {
  try {
    await clearToken();
    await AsyncStorage.removeItem(USER_ACCOUNTS);
    await AsyncStorage.removeItem(ACCOUNT_INFO);
    await AsyncStorage.removeItem(ACCOUNT_TRANSACTIONS);
  } catch (error) {
    console.error('Error clearing all data:', error);
  }
}
