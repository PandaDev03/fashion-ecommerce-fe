import { isRejectedWithValue, Middleware } from '@reduxjs/toolkit';
import { notificationEmitter } from '~/shared/utils/notificationEmitter';

export const errorMiddleware: Middleware = () => (next) => (action) => {
  if (isRejectedWithValue(action)) {
    const error: any = action.payload;

    if (error?.response?.status === 401) {
      console.log('401 Unauthorized - handled by axios interceptor');
      return next(action);
    }

    let errorMessage = 'Đã có lỗi không xác định xảy ra.';

    if (typeof error === 'string') errorMessage = error;
    else if (error && error.response)
      errorMessage =
        error.response.data?.message || 'Yêu cầu không thành công.';
    else if (
      error &&
      (error.code === 'ERR_NETWORK' || error.code === 'ECONNABORTED')
    )
      errorMessage = 'Lỗi kết nối mạng hoặc server không phản hồi.';
    else if (error && error.message) errorMessage = error.message;

    notificationEmitter.forceEmit('error', errorMessage);
  }

  return next(action);
};
