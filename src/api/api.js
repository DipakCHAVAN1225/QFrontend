
// // Get the API base URL based on environment
// const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000/api';

// console.log('🔗 API Base URL:', API_BASE_URL);

// /**
//  * apiFetch - A wrapper around fetch that handles:
//  * - Setting correct headers
//  * - Adding authentication token
//  * - Error handling
//  * - URL construction
//  */
// export async function apiFetch(endpoint, options = {}) {
//   // Construct full URL
//   const url = `${API_BASE_URL}${endpoint}`;
  
//   console.log(`📡 ${options.method || 'GET'} ${url}`);

//   try {
//     // Get token from localStorage (stored separately by AuthContext)
//     const token = localStorage.getItem('token');
//     const userDataString = localStorage.getItem('user');
//     const userData = userDataString ? JSON.parse(userDataString) : null;
//     const userId = userData?.id;

//     // Set up headers
//     const headers = {
//       'Content-Type': 'application/json',
//       ...options.headers,
//     };

//     // Add authorization token if available
//     if (token) {
//       headers['Authorization'] = `Bearer ${token}`;
//     }

//     // Add user ID header if available (required by some endpoints)
//     if (userId) {
//       headers['x-user-id'] = userId;
//     }

//     // Make the request
//     const response = await fetch(url, {
//       ...options,
//       headers,
//     });

//     // Parse response
//     const data = await response.json();

//     // Handle errors
//     if (!response.ok) {
//       console.error(`  API Error (${response.status}):`, data);
//       throw new Error(data.message || data.error || `API Error: ${response.status}`);
//     }

//     console.log(`  Success (${response.status}):`, data);
//     return data;
//   } catch (error) {
//     console.error(`  Fetch Error:`, error);
//     throw error;
//   }
// }

// /**
//  * Convenience methods for common operations
//  */
// export const api = {
//   // Auth endpoints
//   auth: {
//     register: (userData) => apiFetch('/auth/register', {
//       method: 'POST',
//       body: JSON.stringify(userData),
//     }),
    
//     login: (email, password) => apiFetch('/auth/login', {
//       method: 'POST',
//       body: JSON.stringify({ email, password }),
//     }),
    
//     getCurrentUser: () => apiFetch('/auth/me', {
//       method: 'GET',
//     }),
    
//     updateProfile: (profileData) => apiFetch('/auth/profile', {
//       method: 'PUT',
//       body: JSON.stringify(profileData),
//     }),
    
//     changePassword: (currentPassword, newPassword) => apiFetch('/auth/change-password', {
//       method: 'POST',
//       body: JSON.stringify({ currentPassword, newPassword }),
//     }),
//   },

//   // Service providers endpoints
//   providers: {
//     getAll: () => apiFetch('/service-providers', {
//       method: 'GET',
//     }),
    
//     getById: (id) => apiFetch(`/service-providers/${id}`, {
//       method: 'GET',
//     }),
//   },

//   // Booking endpoints
//   bookings: {
//     create: (bookingData) => apiFetch('/Bankookings', {
//       method: 'POST',
//       body: JSON.stringify(bookingData),
//     }),

//     getByUserId: (userId) => apiFetch(`/bookings/user/${userId}`, {
//       method: 'GET',
//     }),

//     getById: (bookingId) => apiFetch(`/bookings/${bookingId}`, {
//       method: 'GET',
//     }),

//     cancel: (bookingId) => apiFetch(`/bookings/${bookingId}`, {
//       method: 'DELETE',
//     }),

//     update: (bookingId, updateData) => apiFetch(`/bookings/${bookingId}`, {
//       method: 'PUT',
//       body: JSON.stringify(updateData),
//     }),
//   },
// };

// export default apiFetch;