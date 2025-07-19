import axios from 'axios';
import {
  getAccessToken,
  getRefreshToken,
  setAccessToken,
  setRefreshToken,
} from '../utils/local-storage';

const headers = {
  // 'Access-Control-Allow-Origin': '*',
  // 'Content-Type': 'application/json',
  // Accept: 'application/json',
};

const baseURL = String('http://localhost:3000/api');

export const axiosClient = createAxiosInstance(baseURL);

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
    (config) => {
      const token = getAccessToken();
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

        return new Promise((resolve, reject) => {
          axios
            .post(`${baseURL}/user/refresh-token`, {
              refresh_token: getRefreshToken(),
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
        });
      }
      return Promise.reject(error);
    }
  );

  return instance;
}
