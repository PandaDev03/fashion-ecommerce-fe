import { GoogleOAuthProvider } from '@react-oauth/google';
import { App as AntApp } from 'antd';
import { useEffect } from 'react';

import AppRouter from './routing/AppRouter';
import toast from './shared/utils/toast';

const App = () => {
  const clientId = import.meta.env.VITE_APP_CLIENT_ID;

  useEffect(() => {
    if (!clientId) {
      toast.error('Google Client ID is missing!');
      return;
    }
  }, [clientId]);

  return (
    <GoogleOAuthProvider clientId={clientId}>
      <AntApp>
        <AppRouter />
      </AntApp>
    </GoogleOAuthProvider>
  );
};

export default App;
