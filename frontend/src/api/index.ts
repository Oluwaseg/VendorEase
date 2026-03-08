export const ApiRoutes = {
  auth: {
    login: '/auth/login',
    register: '/auth/register',
    logout: '/auth/logout',
    forgetPassword: '/auth/forget-password',
    verifyEmail: '/auth/verify-email',
    resendVerification: '/auth/resend-verification',
    resetPassword: '/auth/reset-password',
    googleAuth: '/auth/google',
    me: '/auth/me',
  },
  categories: {
    list: '/categories',
    details: (slug: string) => `/categories/slug/${slug}`,
    byId: (id: string) => `/categories/${id}`,
  },
  subcategories: {
    list: '/subcategories',
    details: (slug: string) => `/subcategories/slug/${slug}`,
    byId: (id: string) => `/subcategories/${id}`,
  },
  products: {
    list: '/products',
    details: (slug: string) => `/products/slug/${slug}`,
    bySku: (sku: string) => `/products/sku/${sku}`,
    byId: (id: string) => `/products/${id}`,
    others: (slug: string) => `/products/slug/${slug}/other`,
  },
  reviews: {
    listByProduct: (productId: string) => `/reviews/product/${productId}`,
    details: (id: string) => `/reviews/${id}`,
  },
  cart: {
    list: '/cart',
    addItem: '/cart',
    update: '/cart',
    removeItem: (itemId: string) => `/cart/item/${itemId}`,
    clear: '/cart/clear',
    merge: '/cart/merge',
  },
  checkout: {
    create: '/checkout',
  },
  coupon: {
    my: '/coupons/my',
    validate: (code: string) => `/coupons/validate/${code}`,
  },
  referrals: {
    stats: '/referrals/stats',
    get_referral_link: '/referrals/link',
    invite: '/referrals/invite',
  },
  orders: {
    list: '/orders',
    details: (orderId: string) => `/orders/${orderId}`,
  },
  admin: {
    users: '/admin/users',
  },
};
