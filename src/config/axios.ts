import axios, {
  AxiosError,
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from 'axios';
import { AuthApi } from '~/features/auth/api/auth';

import { PATH } from '~/shared/utils/path';
import toast from '~/shared/utils/toast';

export const instance: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_APP_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
  timeout: 5000,
  withCredentials: true,
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

      const authEndpoints = ['/auth/refresh', '/auth/sign-out'];
      const isAuthEndpoint = authEndpoints.some((endpoint) =>
        originalRequest.url?.includes(endpoint)
      );

      if (isAuthEndpoint) return Promise.reject(error);

      if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;

        try {
          const newAccessToken = await refreshAccessToken();
          localStorage.setItem('accessToken', newAccessToken);
          if (originalRequest.headers) {
            originalRequest.headers[
              'Authorization'
            ] = `Bearer ${newAccessToken}`;
          }
          return instance(originalRequest);
        } catch (refreshError) {
          console.error('Refresh token failed:', refreshError);

          await revokeSession();

          localStorage.removeItem('accessToken');
          window.location.href = PATH.HOME;

          toast.warning(
            'Phiên đăng nhập đã hết hạn. Xin vui lòng đăng nhập lại'
          );

          return Promise.reject(refreshError);
        }
      }

      return Promise.reject(error);
    }
  );
};

let isWarningShown = false;

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
      if (retries === 1) {
        if (!isWarningShown) {
          toast.warning('Hết thời gian truy cập. Xin vui lòng thử lại.');
          isWarningShown = true;
        }
        return Promise.reject(error);
      }

      if (retries === 0) {
        isWarningShown = true;
        return Promise.reject(error);
      }

      await new Promise((resolve) => setTimeout(resolve, delay));

      return retryRequest<T>(config, retries - 1, delay * 2);
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
