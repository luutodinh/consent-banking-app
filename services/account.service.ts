import { bankingApiClient } from '@/config/axios.config';
import { saveAccountInfo, saveAccountTransactions, saveUserAccounts } from '@/utils/local-storage';

export interface Account {
  bankCode: string;
  currency: string;
  identification: {
    accountId: string;
  };
  name: string;
  type: string;
}

export interface AccountInfo {
  accountId: string;
  balances: {
    amount: {
      currency: string;
      value: number;
    };
    dateTime: string;
  };
  bankCode: string;
  creationDate: string;
  currency: string;
  name: string;
  type: string;
}

export interface Transaction {
  additionalTransactionInformation: string;
  amount: {
    currency: string;
    value: number;
  };
  balances: {
    currency: string;
    value: number;
  };
  creditDebitIndicator: string;
  references: {
    instructionIdentification: string;
  };
  relatedParties: {
    creditor?: {
      name: string;
    };
    debtor?: {
      name: string;
    };
  };
  valueDate: string;
}

export interface TransactionResponse {
  pageCount: number;
  pageNumber: number;
  pageSize: number;
  totalCount: number;
  transactions: Transaction[];
}

/**
 * Lấy danh sách tài khoản của người dùng
 */
export const getAccounts = async (): Promise<Account[]> => {
  try {
    const response = await bankingApiClient.get('/v1/accounts');
    const accounts = response.data.accounts || [];
    await saveUserAccounts(accounts);
    return accounts;
  } catch (error) {
    console.error('Error fetching accounts:', error);
    throw error;
  }
};

/**
 * Lấy thông tin chi tiết và số dư của tài khoản
 * @param accountId - ID tài khoản cần lấy thông tin
 */
export const getAccountInformation = async (accountId: string): Promise<AccountInfo> => {
  try {
    const response = await bankingApiClient.post('/v1/accounts/information', { accountId });
    const accountInfo = response.data;
    await saveAccountInfo(accountId, accountInfo);
    return accountInfo;
  } catch (error) {
    console.error(`Error fetching account info for ${accountId}:`, error);
    throw error;
  }
};

/**
 * Lấy lịch sử giao dịch của tài khoản
 * @param accountId - ID tài khoản cần lấy lịch sử giao dịch
 * @param fromDate - Ngày bắt đầu khoảng thời gian (format: ISO string)
 * @param toDate - Ngày kết thúc khoảng thời gian (format: ISO string)
 * @param page - Số trang (mặc định: 1)
 * @param size - Số bản ghi trên mỗi trang (mặc định: 10)
 */
export const getAccountTransactions = async (
  accountId: string,
  fromDate: string,
  toDate: string,
  page: number = 1,
  size: number = 10
): Promise<TransactionResponse> => {
  try {
    const response = await bankingApiClient.post('/v1/accounts/transactions', {
      accountId,
      fromDate,
      toDate,
      page,
      size,
    });
    const transactionData = response.data;
    await saveAccountTransactions(accountId, transactionData);
    return transactionData;
  } catch (error) {
    console.error(`Error fetching transactions for ${accountId}:`, error);
    throw error;
  }
}; 