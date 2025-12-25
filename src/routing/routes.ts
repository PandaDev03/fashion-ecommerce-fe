import React from 'react';

import { PATH } from '~/shared/utils/path';

import AccountLayout from '~/layouts/AccountLayout/AccountLayout';
import AdminLayout from '~/layouts/AdminLayout/AdminLayout';
import MainLayout from '~/layouts/MainLayout/MainLayout';

export interface AppRoute {
  path: string;
  isProtected?: boolean;
  requiredRoles?: string[];
  layout: React.ComponentType<any>;
  subLayout?: React.ComponentType<any>;
  element: React.LazyExoticComponent<React.ComponentType<any>>;
}

const routes: AppRoute[] = [
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
  {
    path: PATH.CHECKOUT,
    layout: MainLayout,
    element: React.lazy(() => import('~/pages/public/Checkout/CheckoutPage')),
  },
  {
    path: PATH.ORDER,
    layout: MainLayout,
    element: React.lazy(() => import('~/pages/public/Order/OrderPage')),
  },
  {
    path: PATH.ORDER_WITHOUT_ORDER_NUMBER,
    layout: MainLayout,
    element: React.lazy(() => import('~/pages/public/Order/OrderPage')),
  },

  // PROTECTED ROUTES
  {
    isProtected: true,
    path: PATH.ACCOUNT_ORDERS,
    layout: MainLayout,
    subLayout: AccountLayout,
    element: React.lazy(() => import('~/pages/user/Order/OrderPage')),
  },
  {
    isProtected: true,
    path: PATH.ACCOUNT_DETAILS,
    layout: MainLayout,
    subLayout: AccountLayout,
    element: React.lazy(
      () => import('~/pages/user/Account/AccountDetailsPage')
    ),
  },
  {
    isProtected: true,
    path: PATH.ACCOUNT_CHANGE_PASSWORD,
    layout: MainLayout,
    subLayout: AccountLayout,
    element: React.lazy(
      () => import('~/pages/user/Account/AccountChangePasswordPage')
    ),
  },

  // RBAC ROUTE
  {
    // isProtected: true,
    layout: AdminLayout,
    path: PATH.ADMIN_DASHBOARD,
    // requiredRoles: [],
    element: React.lazy(
      () => import('~/pages/admin/Dashboard.tsx/AdminDashboard')
    ),
  },
  {
    // isProtected: true,
    layout: AdminLayout,
    path: PATH.ADMIN_CATEGORY_MANAGEMENT,
    // requiredRoles: [],
    element: React.lazy(
      () => import('~/pages/admin/Category/CategoryManagement')
    ),
  },
  {
    // isProtected: true,
    layout: AdminLayout,
    path: PATH.ADMIN_BRAND_MANAGEMENT,
    // requiredRoles: [],
    element: React.lazy(() => import('~/pages/admin/Brand/BrandManagement')),
  },
  {
    // isProtected: true,
    layout: AdminLayout,
    path: PATH.ADMIN_PRODUCT_MANAGEMENT,
    // requiredRoles: [],
    element: React.lazy(
      () => import('~/pages/admin/Product/ProductManagement')
    ),
  },
  {
    // isProtected: true,
    layout: AdminLayout,
    path: PATH.ADMIN_PRODUCT_DETAILS,
    // requiredRoles: [],
    element: React.lazy(
      () => import('~/pages/admin/Product/ProductDetailsManagement')
    ),
  },
  {
    // isProtected: true,
    layout: AdminLayout,
    path: PATH.ADMIN_PRODUCT_CREATE,
    // requiredRoles: [],
    element: React.lazy(() => import('~/pages/admin/Product/ProductCreate')),
  },

  // NOT FOUND
  {
    path: PATH.NOT_FOUND,
    layout: MainLayout,
    element: React.lazy(() => import('~/pages/public/NotFount/NotFountPage')),
  },
];

export default routes;
