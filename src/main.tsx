import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';

import App from './App.tsx';
import { setupAxiosInterceptors } from './config/axios.ts';
import { NotificationProvider } from './shared/contexts/NotificationContext.tsx';
import { store } from './store/index.ts';

import './index.css';

setupAxiosInterceptors();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <NotificationProvider>
      <Provider store={store}>
        <App />
      </Provider>
    </NotificationProvider>
  </StrictMode>
);
