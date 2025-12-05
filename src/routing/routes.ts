import React from 'react';

import { PATH } from '~/shared/utils/path';

import AdminLayout from '~/layouts/AdminLayout/AdminLayout';
import MainLayout from '~/layouts/MainLayout/MainLayout';

export interface AppRoute {
  path: string;
  isProtected?: boolean;
  requiredRoles?: string[];
  layout: React.ComponentType<any>;
  element: React.LazyExoticComponent<React.ComponentType<any>>;
}

const routes: AppRoute[] = [
  // NOT FOUND
  {
    path: PATH.NOT_FOUND,
    layout: MainLayout,
    element: React.lazy(() => import('~/pages/public/NotFount/NotFountPage')),
  },

  // PUBLIC ROUTES
  {
    path: PATH.HOME,
    layout: MainLayout,
    element: React.lazy(() => import('~/pages/public/Home/HomePage')),
  },
  {
    path: PATH.PRODUCTS,
    layout: MainLayout,
    element: React.lazy(() => import('~/pages/public/Product/ProductPage')),
  },
  {
    path: PATH.PRODUCT_DETAILS,
    layout: MainLayout,
    element: React.lazy(
      () => import('~/pages/public/Product/ProductDetailPage')
    ),
  },

  // PROTECTED ROUTES
  {
    path: PATH.ACCOUNT,
    isProtected: true,
    layout: MainLayout,
    element: React.lazy(() => import('~/pages/user/Account/AccountPage')),
  },

  // RBAC ROUTE
  {
    layout: AdminLayout,
    path: PATH.ADMIN_DASHBOARD,
    requiredRoles: ['ADMIN', 'MANAGER'],
    element: React.lazy(
      () => import('~/pages/admin/Dashboard.tsx/AdminDashboard')
    ),
  },
  {
    layout: AdminLayout,
    path: PATH.ADMIN_CATEGORY_MANAGEMENT,
    requiredRoles: ['ADMIN', 'MANAGER'],
    element: React.lazy(
      () => import('~/pages/admin/Category/CategoryManagement')
    ),
  },
];

export default routes;
