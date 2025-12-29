import { notification } from 'antd';
import type { ArgsProps } from 'antd/es/notification/interface';

type NotificationType = 'success' | 'info' | 'warning' | 'error';

interface NotificationOptions {
  key?: string;
  message?: string;
  description?: string;
  duration?: number;
  placement?: ArgsProps['placement'];
  onClick?: () => void;
}

const defaultMessages: Record<NotificationType, string> = {
  success: 'Thành công',
  info: 'Thông tin',
  warning: 'Cảnh báo',
  error: 'Có lỗi xảy ra',
};

const generateKey = (type: NotificationType, description?: string): string => {
  return `${type}-${description}`;
};

const useNotification = () => {
  const [api, contextHolder] = notification.useNotification();

  const showNotification = (
    type: NotificationType,
    options: NotificationOptions = {}
  ) => {
    const {
      key,
      message,
      description,
      duration = 3,
      placement = 'topRight',
      onClick,
    } = options;

    const notificationKey = key || generateKey(type, description);

    api[type]({
      key: notificationKey,
      message: message || defaultMessages[type],
      description,
      duration,
      placement,
      className: 'cursor-pointer',
      onClick: onClick || (() => api.destroy()),
    });
  };

  const toast = {
    success: (
      description: string,
      options?: Omit<NotificationOptions, 'description'>
    ) => showNotification('success', { ...options, description }),

    info: (
      description: string,
      options?: Omit<NotificationOptions, 'description'>
    ) => showNotification('info', { ...options, description }),

    warning: (
      description: string,
      options?: Omit<NotificationOptions, 'description'>
    ) => showNotification('warning', { ...options, description }),

    error: (
      description: string,
      options?: Omit<NotificationOptions, 'description'>
    ) => showNotification('error', { ...options, description }),

    custom: (options: NotificationOptions & { type: NotificationType }) => {
      const { type, ...rest } = options;
      showNotification(type, rest);
    },

    destroy: (key?: string) => {
      if (key) {
        api.destroy(key);
      } else {
        api.destroy();
      }
    },
  };

  return { toast, contextHolder };
};

export default useNotification;
