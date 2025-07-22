import axios from 'axios';
import {
    getAccessToken,
    getRefreshToken,
    setAccessToken,
    setRefreshToken,
} from '../utils/local-storage';

const headers = {
  'Content-Type': 'application/json',
  'Accept': 'application/json',
};

// Cập nhật baseURL từ config.py
const baseURL = 'https://openapi.atomsolution.vn/open-banking/api';

// Access token mặc định để test từ file yaml
const DEFAULT_ACCESS_TOKEN = 'mock-access-token';

export const axiosClient = createAxiosInstance(baseURL);

// Tạo instance mới dành riêng cho Open Banking API
export const bankingApiClient = createOpenBankingInstance(baseURL);

function createAxiosInstance(baseURL: string) {
  // For multiple requests
  let isRefreshing = false;
  let failedQueue: {
    resolve: (value?: unknown) => void;
    reject: (reason?: unknown) => void;
  }[] = [];

  const processQueue = (error: unknown, token: unknown = null) => {
    failedQueue.forEach((prom) => {
      if (error) prom.reject(error);
      else prom.resolve(token);
    });
    failedQueue = [];
  };

  const instance = axios.create({ baseURL, headers });

  // Request interceptor config
  instance.interceptors.request.use(
    async (config) => {
      // Lấy token, nếu không có thì dùng token mặc định
      let token;
      try {
        token = await getAccessToken();
      } catch (error) {
        console.error('Error getting access token:', error);
      }
      
      // Nếu không tìm thấy token, dùng token mặc định
      token = token || DEFAULT_ACCESS_TOKEN;
      
      if (token) {
        config.headers.Authorization = 'Bearer ' + token;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  // Response interceptor config
  instance.interceptors.response.use(
    (response) => Promise.resolve(response),
    async (error) => {
      const originalRequest = error.config;

      if (
        error.response.status === 403 &&
        !originalRequest._retry &&
        originalRequest.url !== '/user/forgot-password'
      ) {
        if (isRefreshing) {
          return new Promise((resolve, reject) => {
            failedQueue.push({ resolve, reject });
          })
            .then((token) => {
              originalRequest.headers['Authorization'] = 'Bearer ' + token;
              return instance.request(originalRequest);
            })
            .catch((err) => Promise.reject(err));
        }

        originalRequest._retry = true;
        isRefreshing = true;

        return new Promise(async (resolve, reject) => {
          try {
            const refreshToken = await getRefreshToken();
            axios
              .post(`${baseURL}/user/refresh-token`, {
                refresh_token: refreshToken,
              })
              .then(({ data }) => {
                // Store token to localStorage
                setAccessToken(data.access_token);
                setRefreshToken(data.refresh_token);

                // Change Authorization header
                const auth = `Bearer ${data.access_token}`;
                instance.defaults.headers.common['Authorization'] = auth;
                originalRequest.headers['Authorization'] = auth;

                processQueue(null, data.access_token);

                // Return originalRequest object with Axios
                resolve(instance.request(originalRequest));
              })
              .catch((err) => {
                processQueue(err, null);
                reject(err);
              })
              .finally(() => (isRefreshing = false));
          } catch (error) {
            processQueue(error, null);
            reject(error);
          }
        });
      }
      return Promise.reject(error);
    }
  );

  return instance;
}

// Tạo instance với cấu hình đặc biệt cho Open Banking API
function createOpenBankingInstance(baseURL: string) {
  const instance = axios.create({ baseURL, headers });
  
  // Request interceptor thêm các header bắt buộc cho Open Banking API
  instance.interceptors.request.use(
    async (config) => {
      // Lấy token, nếu không có thì dùng token mặc định
      let token;
      try {
        token = await getAccessToken();
      } catch (error) {
        console.error('Error getting access token:', error);
      }
      
      // Nếu không tìm thấy token, dùng token mặc định
      token = token || DEFAULT_ACCESS_TOKEN;
      
      if (token) {
        config.headers.Authorization = 'Bearer ' + token;
      }
      
      // Thêm các header bắt buộc theo yêu cầu của Open Banking API
      config.headers['Request-DateTime'] = new Date().toISOString();
      config.headers['Request-ID'] = generateUUID();
      config.headers['TPP-ID'] = 'DEMO-TPP';
      config.headers['Provider-ID'] = 'BANK-API';
      config.headers['JWS-Signature'] = 'mock-signature';
      
      return config;
    },
    (error) => Promise.reject(error)
  );

  return instance;
}

// Hàm tạo UUID cho Request-ID
function generateUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = (Math.random() * 16) | 0,
      v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}
