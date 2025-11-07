import axios, {
  AxiosError,
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from 'axios';

import { logOut } from '~/features/user';
import toast from '~/shared/utils/toast';
import { AppStore } from '~/store';

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
  const refreshToken = localStorage.getItem('refreshToken');

  const response = await instance.post<{ accessToken: string }>(
    '/auth/refresh',
    { refreshToken: refreshToken }
  );

  return response.data.accessToken;
};

// Thêm type cho store
export const setupAxiosInterceptors = (store: AppStore) => {
  instance.interceptors.request.use(
    (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
      const accessToken = localStorage.getItem('accessToken');
      if (accessToken && config.headers)
        config.headers.Authorization = `Bearer ${accessToken}`;

      // Nếu truyền refresh token qua header: Cần xem lại header 'Cookies' có chuẩn không
      const refreshToken = localStorage.getItem('refreshToken');
      if (refreshToken && config.headers) {
        config.headers['X-Refresh-Token'] = refreshToken;
      }

      return config;
    },
    (error: AxiosError): Promise<never> => {
      return Promise.reject(error);
    }
  );

  instance.interceptors.response.use(
    (response: AxiosResponse): any => {
      const { accessToken, refreshToken } = response.data;

      if (accessToken) localStorage.setItem('accessToken', accessToken);
      if (refreshToken) localStorage.setItem('refreshToken', refreshToken);

      return response.data;
    },
    async (error: AxiosError) => {
      const originalRequest = error.config as CustomInternalAxiosRequestConfig;

      if (
        error.response?.status === 401 &&
        (error.response.data as any)?.action === 'REFRESH_TOKEN' &&
        !originalRequest._retry
      ) {
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

          store.dispatch(logOut());

          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          // window.location.href = PATH.USER_SIGN_IN;

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
