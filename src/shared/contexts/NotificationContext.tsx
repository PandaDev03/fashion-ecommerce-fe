import { createContext, ReactNode, useContext, useEffect } from 'react';

import useNotification from '../hooks/useNotification';
import { notificationEmitter } from '../utils/notificationEmitter';

interface NotificationContextType {
  toast: ReturnType<typeof useNotification>['toast'];
}

const NotificationContext = createContext<NotificationContextType | undefined>(
  undefined
);

export const NotificationProvider = ({ children }: { children: ReactNode }) => {
  const { toast, contextHolder } = useNotification();

  useEffect(() => {
    const unsubscribe = notificationEmitter.subscribe((type, message) => {
      toast[type](message);
    });

    return unsubscribe;
  }, [toast]);

  return (
    <NotificationContext.Provider value={{ toast }}>
      {contextHolder}
      {children}
    </NotificationContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(NotificationContext);
  if (!context)
    throw new Error('useToast must be used within NotificationProvider');

  return context.toast;
};
