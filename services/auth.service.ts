import { clearAllData, clearToken, setAccessToken, setRefreshToken } from '@/utils/local-storage';
import axios from 'axios';

const KEYCLOAK_URL = 'https://kc.oneapi.vn';
const REALM = 'open-api';
const CLIENT_ID = 'open-banking-api';
const REDIRECT_URI = 'exp://192.168.1.7:8081'; // Cần cập nhật theo địa chỉ thực tế của ứng dụng
const CLIENT_SECRET = '2BoCoSWeZ1K10FtkGZCPnHbvrJiksqTr'; // Nên lưu trong .env

/**
 * Tạo code verifier cho PKCE
 */
export const generateCodeVerifier = (): string => {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return btoa(String.fromCharCode.apply(null, Array.from(array)))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '');
};

/**
 * Tạo code challenge từ code verifier
 */
export const generateCodeChallenge = async (verifier: string): Promise<string> => {
  const encoder = new TextEncoder();
  const data = encoder.encode(verifier);
  const digest = await crypto.subtle.digest('SHA-256', data);
  return btoa(String.fromCharCode.apply(null, Array.from(new Uint8Array(digest))))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '');
};

/**
 * Tạo state ngẫu nhiên
 */
export const generateRandomString = (length: number): string => {
  const array = new Uint8Array(length);
  crypto.getRandomValues(array);
  return btoa(String.fromCharCode.apply(null, Array.from(array))).substring(0, length);
};

/**
 * Bắt đầu quá trình xác thực
 */
export const initiateAuth = async (): Promise<string> => {
  try {
    const codeVerifier = generateCodeVerifier();
    const codeChallenge = await generateCodeChallenge(codeVerifier);
    const state = generateRandomString(16);

    // Lưu vào localStorage để sử dụng sau
    localStorage.setItem('code_verifier', codeVerifier);
    localStorage.setItem('oauth_state', state);

    const authUrl = new URL(`${KEYCLOAK_URL}/realms/${REALM}/protocol/openid-connect/auth`);
    authUrl.searchParams.set('response_type', 'code');
    authUrl.searchParams.set('client_id', CLIENT_ID);
    authUrl.searchParams.set('redirect_uri', REDIRECT_URI);
    authUrl.searchParams.set('scope', 'openid AIS PIS EWLT');
    authUrl.searchParams.set('state', state);
    authUrl.searchParams.set('code_challenge', codeChallenge);
    authUrl.searchParams.set('code_challenge_method', 'S256');

    return authUrl.toString();
  } catch (error) {
    console.error('Error initiating authentication:', error);
    throw error;
  }
};

/**
 * Xử lý callback sau khi xác thực
 */
export const handleAuthCallback = async (url: string): Promise<any> => {
  try {
    const urlObj = new URL(url);
    const params = new URLSearchParams(urlObj.search);
    const code = params.get('code');
    const state = params.get('state');
    const error = params.get('error');

    if (error) {
      throw new Error(`Authentication failed: ${error}`);
    }

    if (!code) {
      throw new Error('No code parameter found in the URL');
    }

    const storedState = localStorage.getItem('oauth_state');
    if (state !== storedState) {
      throw new Error('Invalid state parameter');
    }

    const tokens = await exchangeCodeForTokens(code);
    return tokens;
  } catch (error) {
    console.error('Error handling authentication callback:', error);
    throw error;
  }
};

/**
 * Đổi mã authorization code lấy token
 */
export const exchangeCodeForTokens = async (code: string): Promise<any> => {
  try {
    const codeVerifier = localStorage.getItem('code_verifier');
    if (!codeVerifier) {
      throw new Error('Code verifier not found');
    }

    const response = await axios.post(
      `${KEYCLOAK_URL}/realms/${REALM}/protocol/openid-connect/token`,
      new URLSearchParams({
        grant_type: 'authorization_code',
        client_id: CLIENT_ID,
        code: code,
        redirect_uri: REDIRECT_URI,
        client_secret: CLIENT_SECRET,
        code_verifier: codeVerifier,
      }),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    );

    // Lưu token
    setAccessToken(response.data.access_token);
    setRefreshToken(response.data.refresh_token);

    return response.data;
  } catch (error) {
    console.error('Error exchanging code for tokens:', error);
    throw error;
  }
};

/**
 * Làm mới token khi hết hạn
 */
export const refreshAuthToken = async (): Promise<any> => {
  try {
    const refreshToken = localStorage.getItem('refreshToken');
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    const response = await axios.post(
      `${KEYCLOAK_URL}/realms/${REALM}/protocol/openid-connect/token`,
      new URLSearchParams({
        grant_type: 'refresh_token',
        client_id: CLIENT_ID,
        refresh_token: refreshToken,
        client_secret: CLIENT_SECRET,
      }),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    );

    // Cập nhật token mới
    setAccessToken(response.data.access_token);
    setRefreshToken(response.data.refresh_token);

    return response.data;
  } catch (error) {
    console.error('Error refreshing token:', error);
    clearToken(); // Xóa token khi refresh thất bại
    throw error;
  }
};

/**
 * Đăng xuất
 */
export const logout = async (): Promise<void> => {
  try {
    const refreshToken = localStorage.getItem('refreshToken');
    if (refreshToken) {
      await axios.post(
        `${KEYCLOAK_URL}/realms/${REALM}/protocol/openid-connect/logout`,
        new URLSearchParams({
          client_id: CLIENT_ID,
          refresh_token: refreshToken,
          client_secret: CLIENT_SECRET,
        }),
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        }
      );
    }
  } catch (error) {
    console.error('Error during logout:', error);
  } finally {
    clearAllData(); // Xóa tất cả dữ liệu
  }
}; 