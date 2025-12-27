import { useEffect, useRef } from 'react';

import { getMe } from './features/user/stores/userThunks';
import AppRouter from './routing/AppRouter';
import { useToast } from './shared/contexts/NotificationContext';
import { useOrderMigration } from './shared/hooks/useOrderMigration';
import { useAppDispatch } from './shared/hooks/useStore';

const App = () => {
  const toast = useToast();
  const dispatch = useAppDispatch();

  const flagRef = useRef(false);

  const accessToken = localStorage.getItem('accessToken');
  const clientId = import.meta.env.VITE_APP_GOOGLE_CLIENT_ID;

  useOrderMigration();

  useEffect(() => {
    if (!clientId) {
      toast.error('Google Client ID is missing!');
      return;
    }
  }, [clientId]);

  useEffect(() => {
    if (flagRef.current) return;
    if (accessToken) dispatch(getMe());

    flagRef.current = true;
  }, [accessToken, flagRef]);

  return <AppRouter />;
};

export default App;
