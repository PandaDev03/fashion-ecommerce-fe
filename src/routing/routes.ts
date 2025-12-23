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
  {
    path: PATH.CART,
    layout: MainLayout,
    element: React.lazy(() => import('~/pages/public/Cart/CartPage')),
  },
  {
    path: PATH.CHECKOUT,
    layout: MainLayout,
    element: React.lazy(
      () => import("~/pages/public/Checkout/CheckoutPage")
    ),
  },
  {
    path: PATH.CONTACT,
    layout: MainLayout,
    element: React.lazy(() => import('~/pages/public/Contact/ContactPage')),
  },

  // PROTECTED ROUTES
  {
    isProtected: true,
    path: PATH.ACCOUNT,
    layout: MainLayout,
    element: React.lazy(() => import('~/pages/user/Account/AccountPage')),
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
];

export default routes;
