export const PATH = {
  HOME: '/',
  NOT_FOUND: '/*',

  ACCOUNT: '/account',

  PRODUCTS: '/products/:slugId?',
  PRODUCTS_WITHOUT_SLUG: '/products',
  PRODUCT_DETAILS: '/product/:slugId',

  ADMIN_DASHBOARD: '/admin/dashboard',
  ADMIN_PROFILE: '/admin/profile',
  ADMIN_CATEGORY_MANAGEMENT: '/admin/category-management',
  ADMIN_BRAND_MANAGEMENT: '/admin/brand-management',

  ADMIN_PRODUCT_MANAGEMENT: '/admin/product-management',
  ADMIN_PRODUCT_DETAILS: '/admin/product-management/:slug',
  ADMIN_PRODUCT_CREATE: '/admin/product-create',
};
