import { useEffect, useRef } from 'react';

import { getMe } from './features/user/stores/userThunks';
import AppRouter from './routing/AppRouter';
import { useToast } from './shared/contexts/NotificationContext';
import { useAppDispatch } from './shared/hooks/useStore';

const App = () => {
  const flagRef = useRef(false);
  const dispatch = useAppDispatch();

  const clientId = import.meta.env.VITE_APP_GOOGLE_CLIENT_ID;

  const toast = useToast();
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

  return <AppRouter />;
};

export default App;
