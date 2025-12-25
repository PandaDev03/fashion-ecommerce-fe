export const PATH = {
  HOME: '/',
  NOT_FOUND: '/*',

  ACCOUNT_DETAILS: '/my-account/account-details',
  ACCOUNT_CHANGE_PASSWORD: '/my-account/change-password',
  ACCOUNT_ORDERS: '/my-account/orders',

  PRODUCTS: '/products/:slug?',
  PRODUCTS_WITHOUT_SLUG: '/products',
  PRODUCT_DETAILS: '/product/:slug',

  CHECKOUT: '/checkout',
  ORDER: '/order/:orderNumber',
  ORDER_WITHOUT_ORDER_NUMBER: '/order',

  ADMIN_DASHBOARD: '/admin/dashboard',
  ADMIN_PROFILE: '/admin/profile',
  ADMIN_CATEGORY_MANAGEMENT: '/admin/category-management',
  ADMIN_BRAND_MANAGEMENT: '/admin/brand-management',

  ADMIN_PRODUCT_MANAGEMENT: '/admin/product-management',
  ADMIN_PRODUCT_DETAILS: '/admin/product-management/:slug',
  ADMIN_PRODUCT_CREATE: '/admin/product-create',
};
