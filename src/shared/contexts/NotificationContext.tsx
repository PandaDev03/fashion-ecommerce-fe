import { createContext, ReactNode, useContext } from 'react';
import useNotification from '../hooks/useNotification';

interface NotificationContextType {
  toast: ReturnType<typeof useNotification>['toast'];
}

const NotificationContext = createContext<NotificationContextType | undefined>(
  undefined
);

export const NotificationProvider = ({ children }: { children: ReactNode }) => {
  const { toast, contextHolder } = useNotification();

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
