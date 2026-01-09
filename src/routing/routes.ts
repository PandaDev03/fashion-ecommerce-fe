import React from 'react';

import { UserRole } from '~/shared/utils/enum';
import { PATH } from '~/shared/utils/path';

import AccountLayout from '~/layouts/AccountLayout/AccountLayout';
import AdminLayout from '~/layouts/AdminLayout/AdminLayout';
import BaseLayout from '~/layouts/BaseLayout';
import MainLayout from '~/layouts/MainLayout/MainLayout';
import SimpleLayout from '~/layouts/SimpleLayout/SimpleLayout';

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
    layout: BaseLayout,
    subLayout: MainLayout,
    element: React.lazy(() => import('~/pages/public/Home/HomePage')),
  },
  {
    path: PATH.PRODUCTS,
    layout: BaseLayout,
    subLayout: MainLayout,
    element: React.lazy(() => import('~/pages/public/Product/ProductPage')),
  },
  {
    path: PATH.PRODUCT_DETAILS,
    layout: BaseLayout,
    subLayout: MainLayout,
    element: React.lazy(
      () => import('~/pages/public/Product/ProductDetailPage')
    ),
  },
  {
    path: PATH.CHECKOUT,
    layout: BaseLayout,
    subLayout: MainLayout,
    element: React.lazy(() => import('~/pages/public/Checkout/CheckoutPage')),
  },
  {
    path: PATH.ORDER,
    layout: BaseLayout,
    subLayout: MainLayout,
    element: React.lazy(() => import('~/pages/public/Order/OrderPage')),
  },
  {
    path: PATH.ORDER_WITHOUT_ORDER_NUMBER,
    layout: BaseLayout,
    subLayout: MainLayout,
    element: React.lazy(() => import('~/pages/public/Order/OrderPage')),
  },
  {
    path: PATH.RESET_PASSWORD,
    layout: BaseLayout,
    subLayout: SimpleLayout,
    element: React.lazy(
      () => import('~/pages/user/ResetPassword/ResetPassword')
    ),
  },

  // PROTECTED ROUTES
  {
    isProtected: true,
    path: PATH.ACCOUNT_ORDERS,
    layout: BaseLayout,
    subLayout: AccountLayout,
    element: React.lazy(() => import('~/pages/user/Order/OrderPage')),
  },
  {
    isProtected: true,
    path: PATH.ACCOUNT_DETAILS,
    layout: BaseLayout,
    subLayout: AccountLayout,
    element: React.lazy(
      () => import('~/pages/user/Account/AccountDetailsPage')
    ),
  },
  {
    isProtected: true,
    path: PATH.ACCOUNT_CHANGE_PASSWORD,
    layout: BaseLayout,
    subLayout: AccountLayout,
    element: React.lazy(
      () => import('~/pages/user/Account/AccountChangePasswordPage')
    ),
  },

  // RBAC ROUTE
  {
    isProtected: true,
    layout: AdminLayout,
    path: PATH.ADMIN_DASHBOARD,
    requiredRoles: [UserRole.ADMIN],
    element: React.lazy(() => import('~/pages/admin/Dashboard/AdminDashboard')),
  },
  {
    isProtected: true,
    layout: AdminLayout,
    path: PATH.ADMIN_CATEGORY_MANAGEMENT,
    requiredRoles: [UserRole.ADMIN],
    element: React.lazy(
      () => import('~/pages/admin/Category/CategoryManagement')
    ),
  },
  {
    isProtected: true,
    layout: AdminLayout,
    path: PATH.ADMIN_BRAND_MANAGEMENT,
    requiredRoles: [UserRole.ADMIN],
    element: React.lazy(() => import('~/pages/admin/Brand/BrandManagement')),
  },
  {
    isProtected: true,
    layout: AdminLayout,
    path: PATH.ADMIN_PRODUCT_MANAGEMENT,
    requiredRoles: [UserRole.ADMIN],
    element: React.lazy(
      () => import('~/pages/admin/Product/ProductManagement')
    ),
  },
  {
    isProtected: true,
    layout: AdminLayout,
    path: PATH.ADMIN_PRODUCT_DETAILS,
    requiredRoles: [UserRole.ADMIN],
    element: React.lazy(
      () => import('~/pages/admin/Product/ProductDetailsManagement')
    ),
  },
  {
    isProtected: true,
    layout: AdminLayout,
    path: PATH.ADMIN_PRODUCT_CREATE,
    requiredRoles: [UserRole.ADMIN],
    element: React.lazy(() => import('~/pages/admin/Product/ProductCreate')),
  },
  {
    isProtected: true,
    layout: AdminLayout,
    path: PATH.ADMIN_ORDER_MANAGEMENT,
    requiredRoles: [UserRole.ADMIN],
    element: React.lazy(() => import('~/pages/admin/Order/OrderManagement')),
  },
  {
    isProtected: true,
    layout: AdminLayout,
    path: PATH.ADMIN_ORDER_DETAILS,
    requiredRoles: [UserRole.ADMIN],
    element: React.lazy(
      () => import('~/pages/admin/Order/OrderDetailManagement')
    ),
  },

  // NOT FOUND
  {
    path: PATH.NOT_FOUND,
    layout: MainLayout,
    element: React.lazy(() => import('~/pages/public/NotFount/NotFountPage')),
  },
];

export default routes;
