import { MutationCache, QueryCache, QueryClient } from '@tanstack/react-query';
import axios from 'axios';

import { notificationEmitter } from '~/shared/utils/notificationEmitter';

const globalErrorHandler = (error: any) => {
  let errorMessage = 'Đã có lỗi không xác định xảy ra.';

  if (axios.isAxiosError(error)) {
    if (error.response)
      errorMessage =
        error.response.data?.message || 'Yêu cầu không thành công.';
    else if (error.code === 'ERR_NETWORK')
      errorMessage = 'Lỗi kết nối mạng hoặc server không phản hồi.';
  }

  notificationEmitter.emit('error', errorMessage);
};

export const queryClient = new QueryClient({
  queryCache: new QueryCache({
    onError: (error) => globalErrorHandler(error),
  }),
  mutationCache: new MutationCache({
    onError: (error) => globalErrorHandler(error),
  }),
  defaultOptions: {
    queries: {
      retry: false,
      refetchOnWindowFocus: false,
    },
  },
});
