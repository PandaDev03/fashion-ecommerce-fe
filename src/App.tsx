import { GoogleOAuthProvider } from '@react-oauth/google';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { App as AntApp } from 'antd';
import { useEffect, useRef } from 'react';

import { getMe } from './features/user';
import AppRouter from './routing/AppRouter';
import { NotificationProvider } from './shared/contexts/NotificationContext';
import { useAppDispatch } from './shared/hooks/useStore';
import toast from './shared/utils/toast';

const App = () => {
  const flagRef = useRef(false);
  const dispatch = useAppDispatch();

  const queryClient = new QueryClient();
  const clientId = import.meta.env.VITE_APP_CLIENT_ID;

  const accessToken = localStorage.getItem('accessToken');

  useEffect(() => {
    if (!clientId) {
      toast.error('Google Client ID is missing!');
      return;
    }
  }, [clientId]);

  useEffect(() => {
    if (flagRef.current || !accessToken) return;

    dispatch(getMe());
    flagRef.current = true;
  }, [accessToken, flagRef]);

  return (
    <GoogleOAuthProvider clientId={clientId}>
      <QueryClientProvider client={queryClient}>
        <NotificationProvider>
          <AntApp>
            <AppRouter />
          </AntApp>
        </NotificationProvider>
      </QueryClientProvider>
    </GoogleOAuthProvider>
  );
};

export default App;
