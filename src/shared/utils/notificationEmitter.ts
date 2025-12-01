type ToastType = 'success' | 'info' | 'warning' | 'error';

class NotificationEmitter {
  private listeners: ((type: ToastType, message: string) => void)[] = [];

  subscribe(callback: (type: ToastType, message: string) => void) {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== callback);
    };
  }

  emit(type: ToastType, message: string) {
    this.listeners.forEach((listener) => listener(type, message));
  }
}

export const notificationEmitter = new NotificationEmitter();
