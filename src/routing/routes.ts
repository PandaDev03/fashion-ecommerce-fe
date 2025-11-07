import React from 'react';

import AdminLayout from '~/layouts/AdminLayout';
import MainLayout from '~/layouts/MainLayout';
import { PATH } from '~/shared/utils/path';

export interface AppRoute {
  path: string;
  isProtected?: boolean;
  requiredRoles?: string[];
  layout: React.ComponentType<any>;
  element: React.LazyExoticComponent<React.ComponentType<any>>;
}

const routes: AppRoute[] = [
  // PUBLIC ROUTES
  {
    path: PATH.HOME,
    layout: MainLayout,
    element: React.lazy(() => import('~/pages/public/HomePage')),
  },
  {
    path: PATH.LOGIN,
    layout: MainLayout,
    element: React.lazy(() => import('~/pages/auth/LoginPage')),
  },

  // PROTECTED ROUTES
  {
    path: PATH.PROFILE,
    isProtected: true,
    layout: MainLayout,
    element: React.lazy(() => import('~/pages/user/ProfilePage')),
  },

  // RBAC ROUTE
  {
    path: PATH.ADMIN_DASHBOARD,
    isProtected: true,
    layout: AdminLayout,
    requiredRoles: ['ADMIN', 'MANAGER'],
    element: React.lazy(() => import('~/pages/admin/AdminDashboard')),
  },
];

export default routes;
