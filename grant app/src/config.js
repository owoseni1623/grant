const API_CONFIG = {
  // Use the full URL to your backend API
  BASE_URL: 'https://grant-api.onrender.com',
  // Make sure to use the proper paths without duplicate /api
  ENDPOINTS: {
    ADMIN_LOGIN: '/api/admin/login',
    ADMIN_VERIFY: '/api/admin/verify-token',
    ADMIN_APPLICATIONS: '/api/admin/applications',
    ADMIN_DOCUMENTS: '/api/admin/documents'
  }
};

export default API_CONFIG;