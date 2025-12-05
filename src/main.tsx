import { GoogleOAuthProvider } from '@react-oauth/google';
import { QueryClientProvider } from '@tanstack/react-query';
import { App as AntApp } from 'antd';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';

import { setupAxiosInterceptors } from './config/axios.ts';
import { queryClient } from './config/queryClient.ts';
import { BreadcrumbProvider } from './shared/contexts/BreadcrumbContext.tsx';
import { NotificationProvider } from './shared/contexts/NotificationContext.tsx';
import { TitleProvider } from './shared/contexts/TitleContext.tsx';
import { store } from './store/index.ts';

import App from './App.tsx';
import './index.css';

setupAxiosInterceptors();
const clientId = import.meta.env.VITE_APP_GOOGLE_CLIENT_ID;

createRoot(document.getElementById('root')!).render(
  <NotificationProvider>
    <Provider store={store}>
      <GoogleOAuthProvider clientId={clientId}>
        <QueryClientProvider client={queryClient}>
          <TitleProvider>
            <BreadcrumbProvider>
              <AntApp>
                <App />
              </AntApp>
            </BreadcrumbProvider>
          </TitleProvider>
        </QueryClientProvider>
      </GoogleOAuthProvider>
    </Provider>
  </NotificationProvider>
);
