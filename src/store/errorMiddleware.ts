import { isRejectedWithValue, Middleware } from '@reduxjs/toolkit';
import { notificationEmitter } from '~/shared/utils/notificationEmitter';

export const errorMiddleware: Middleware = () => (next) => (action) => {
  if (isRejectedWithValue(action)) {
    let errorMessage = 'Đã có lỗi không xác định xảy ra.';
    const error: any = action.payload;

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

    notificationEmitter.emit('error', errorMessage);
  }

  return next(action);
};
