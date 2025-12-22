import axios, {
  AxiosError,
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from 'axios';
import queryString from 'query-string';

import { AuthApi } from '~/features/auth/api/auth';
import { notificationEmitter } from '~/shared/utils/notificationEmitter';
import { PATH } from '~/shared/utils/path';

export const instance: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_APP_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
  // timeout: 5000,
  timeout: 20000,
  withCredentials: true,
  paramsSerializer: (params) => {
    return queryString.stringify(params, {
      arrayFormat: 'none',
      skipNull: true,
      skipEmptyString: true,
    });
  },
});

interface CustomInternalAxiosRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

const refreshAccessToken = async () => {
  const response = await instance.post<{ accessToken: string }>(
    '/auth/refresh'
  );

  return response.data.accessToken;
};

const revokeSession = async () => {
  try {
    await AuthApi.signOut();
  } catch (error) {
    console.error('Logout failed after refresh failure:', error);
  }
};

let isRefreshing = false;
let failedQueue: Array<(token: string | null) => void> = [];

const processQueue = (
  error: AxiosError | null,
  token: string | null = null
) => {
  failedQueue.forEach((prom) => {
    if (error) prom(null);
    else prom(token);
  });

  failedQueue = [];
};

export const setupAxiosInterceptors = () => {
  instance.interceptors.request.use(
    (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
      const accessToken = localStorage.getItem('accessToken');
      if (accessToken && config.headers)
        config.headers.Authorization = `Bearer ${accessToken}`;

      return config;
    },
    (error: AxiosError): Promise<never> => {
      return Promise.reject(error);
    }
  );

  instance.interceptors.response.use(
    (response: AxiosResponse): any => {
      const accessToken = response.data?.data?.accessToken;
      if (accessToken) localStorage.setItem('accessToken', accessToken);

      return response.data;
    },
    async (error: AxiosError) => {
      const originalRequest = error.config as CustomInternalAxiosRequestConfig;
      const status = error.response?.status;

      const authEndpoints = ['/auth/refresh', '/auth/sign-out'];
      const isAuthEndpoint = authEndpoints.some((endpoint) =>
        originalRequest.url?.includes(endpoint)
      );

      if (isAuthEndpoint || status !== 401) return Promise.reject(error);

      if (status === 401 && !originalRequest._retry) {
        if (isRefreshing)
          return new Promise((resolve, reject) => {
            failedQueue.push((token) => {
              if (token) {
                originalRequest.headers!.Authorization = `Bearer ${token}`;
                resolve(instance(originalRequest));
              } else reject(error);
            });
          });

        isRefreshing = true;
        originalRequest._retry = true;

        try {
          const newAccessToken = await refreshAccessToken();
          localStorage.setItem('accessToken', newAccessToken);

          isRefreshing = false;
          processQueue(null, newAccessToken);

          originalRequest.headers!.Authorization = `Bearer ${newAccessToken}`;
          return instance(originalRequest);
        } catch (refreshError: any) {
          console.error('Refresh token failed:', refreshError);

          isRefreshing = false;
          processQueue(refreshError);

          await revokeSession();

          localStorage.removeItem('accessToken');
          window.location.href = PATH.HOME;

          notificationEmitter.emit(
            'warning',
            'Phiên đăng nhập đã hết hạn. Xin vui lòng đăng nhập lại'
          );

          return Promise.reject(refreshError);
        }
      }

      return Promise.reject(error);
    }
  );
};

const retryRequest = async <T>(
  config: InternalAxiosRequestConfig,
  retries = 3,
  delay = 3000
): Promise<T> => {
  try {
    const response = await instance(config);
    return response as T;
  } catch (error) {
    if (
      axios.isAxiosError(error) &&
      !error.response &&
      error.code === 'ECONNABORTED'
    ) {
      if (retries > 0) {
        await new Promise((resolve) => setTimeout(resolve, delay));
        return retryRequest<T>(config, retries - 1, delay * 2);
      }

      notificationEmitter.emit(
        'warning',
        'Hết thời gian truy cập. Xin vui lòng thử lại'
      );
    }

    return Promise.reject(error);
  }
};

const axiosApi = {
  get: <T = any>(url: string, config?: AxiosRequestConfig) =>
    retryRequest<T>({
      ...config,
      method: 'get',
      url,
    } as InternalAxiosRequestConfig),
  post: <T = any>(url: string, data?: any, config?: any) =>
    retryRequest<T>({
      ...config,
      method: 'post',
      url,
      data,
    } as InternalAxiosRequestConfig),
  put: <T = any>(
    url: string,
    data?: any,
    config?: InternalAxiosRequestConfig
  ) =>
    retryRequest<T>({
      ...config,
      method: 'put',
      url,
      data,
    } as InternalAxiosRequestConfig),
  delete: <T = any>(url: string, config?: InternalAxiosRequestConfig) =>
    retryRequest<T>({
      ...config,
      method: 'delete',
      url,
    } as InternalAxiosRequestConfig),
  patch: <T = any>(
    url: string,
    data?: any,
    config?: InternalAxiosRequestConfig
  ) =>
    retryRequest<T>({
      ...config,
      method: 'patch',
      url,
      data,
    } as InternalAxiosRequestConfig),
};

export default axiosApi;
