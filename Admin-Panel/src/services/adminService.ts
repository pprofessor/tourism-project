const API_BASE_URL = 'http://localhost:8080/api';

// اینترفیس‌های کامل برای نوع‌دهی بهتر
interface Hotel {
  id: number;
  name: string;
  description: string;
  address: string;
  city: string;
  country: string;
  postalCode: string;
  latitude: number;
  longitude: number;
  phone: string;
  email: string;
  website: string;
  basePrice: number;
  totalRooms: number;
  availableRooms: number;
  starRating: number;
  amenities: string[];
  imageUrls: string[];
  mainImageUrl: string;
  isActive: boolean;
  discountPercentage: number;
  discountCode: string;
  discountExpiry: string;
  seoTitle: string;
  seoDescription: string;
  seoKeywords: string;
  createdAt: string;
  updatedAt: string;
}

interface User {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  isActive: boolean;
  role: string;
  createdAt: string;
}

interface Booking {
  id: number;
  userId: number;
  hotelId: number;
  checkIn: string;
  checkOut: string;
  guests: number;
  totalPrice: number;
  status: string;
  createdAt: string;
}

// تابع کمکی برای مدیریت درخواست‌ها
const handleRequest = async (url: string, options: RequestInit = {}) => {
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    // برای درخواست‌های DELETE که ممکن است بدنه نداشته باشند
    if (response.status === 204 || options.method === 'DELETE') {
      return { success: true };
    }

    return await response.json();
  } catch (error) {
    console.error('API Request failed:', error);
    throw error;
  }
};

const adminService = {
  // 🏨 Hotel Management - کامل و بهینه
  getHotels: (): Promise<Hotel[]> => 
    handleRequest(`${API_BASE_URL}/hotels`),

  getActiveHotels: (): Promise<Hotel[]> => 
    handleRequest(`${API_BASE_URL}/hotels/active`),

  getHotelById: (id: number): Promise<Hotel> => 
    handleRequest(`${API_BASE_URL}/hotels/${id}`),

  createHotel: (hotelData: Partial<Hotel>): Promise<Hotel> => 
    handleRequest(`${API_BASE_URL}/hotels`, {
      method: 'POST',
      body: JSON.stringify(hotelData),
    }),

  updateHotel: (id: number, hotelData: Partial<Hotel>): Promise<Hotel> => 
    handleRequest(`${API_BASE_URL}/hotels/${id}`, {
      method: 'PUT',
      body: JSON.stringify(hotelData),
    }),

  deleteHotel: (id: number): Promise<{ success: boolean }> => 
    handleRequest(`${API_BASE_URL}/hotels/${id}`, {
      method: 'DELETE',
    }),

  deactivateHotel: (id: number): Promise<Hotel> => 
    handleRequest(`${API_BASE_URL}/hotels/${id}/deactivate`, {
      method: 'PUT',
    }),

  // جستجوی پیشرفته هتل‌ها
  searchHotels: (params: {
    city?: string;
    minPrice?: number;
    maxPrice?: number;
    minRating?: number;
    hasAvailableRooms?: boolean;
  }): Promise<Hotel[]> => {
    const queryParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        queryParams.append(key, value.toString());
      }
    });
    
    return handleRequest(`${API_BASE_URL}/hotels/search?${queryParams}`);
  },

  // آپدیت اتاق‌های موجود
  updateAvailableRooms: (id: number, availableRooms: number): Promise<Hotel> => 
    handleRequest(`${API_BASE_URL}/hotels/${id}/rooms?availableRooms=${availableRooms}`, {
      method: 'PUT',
    }),

  // اعمال تخفیف
  applyDiscount: (
    id: number, 
    discountPercentage: number, 
    discountCode?: string, 
    discountExpiry?: string
  ): Promise<Hotel> => 
    handleRequest(`${API_BASE_URL}/hotels/${id}/discount?discountPercentage=${discountPercentage}${discountCode ? `&discountCode=${discountCode}` : ''}${discountExpiry ? `&discountExpiry=${discountExpiry}` : ''}`, {
      method: 'PUT',
    }),

  // آمار هتل‌ها
  getHotelStats: (): Promise<{
    totalHotels: number;
    activeHotels: number;
    averagePrice: number;
  }> => handleRequest(`${API_BASE_URL}/hotels/stats`),

  // 👥 User Management - بهبود یافته
  getUsers: (): Promise<User[]> => 
    handleRequest(`${API_BASE_URL}/users`),

  getUserById: (id: number): Promise<User> => 
    handleRequest(`${API_BASE_URL}/users/${id}`),

  updateUser: (id: number, userData: Partial<User>): Promise<User> => 
    handleRequest(`${API_BASE_URL}/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(userData),
    }),

  deleteUser: (userId: number): Promise<{ success: boolean }> => 
    handleRequest(`${API_BASE_URL}/users/${userId}`, {
      method: 'DELETE',
    }),

  // 🔐 تغییر رمز عبور کاربر
  changeUserPassword: (userId: number, newPassword: string): Promise<{ success: boolean }> => 
    handleRequest(`${API_BASE_URL}/users/${userId}/change-password`, {
      method: 'POST',
      body: JSON.stringify({ newPassword }),
    }),

  // 📅 Booking Management - بهبود یافته
  getBookings: (): Promise<Booking[]> => 
    handleRequest(`${API_BASE_URL}/bookings`),

  getBookingById: (id: number): Promise<Booking> => 
    handleRequest(`${API_BASE_URL}/bookings/${id}`),

  updateBookingStatus: (id: number, status: string): Promise<Booking> => 
    handleRequest(`${API_BASE_URL}/bookings/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    }),

  // 📊 Data Export & Statistics
exportData: async (type: string): Promise<Blob> => {
  const response = await fetch(`${API_BASE_URL}/admin/export/${type}`);
  if (!response.ok) throw new Error('Export failed');
  return await response.blob();
},

  // سیستم مدیریت رسانه
  uploadMedia: (file: File, category: string = 'hotels'): Promise<{ url: string; filename: string }> => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('category', category);

    return fetch(`${API_BASE_URL}/media/upload`, {
      method: 'POST',
      body: formData,
    }).then(response => {
      if (!response.ok) throw new Error('Upload failed');
      return response.json();
    });
  },

  // سیستم لاگ و مانیتورینگ
  getSystemLogs: (): Promise<any[]> => 
    handleRequest(`${API_BASE_URL}/admin/logs`),

  getSystemStats: (): Promise<{
    memoryUsage: number;
    activeUsers: number;
    totalBookings: number;
    revenue: number;
  }> => handleRequest(`${API_BASE_URL}/admin/stats`),
};

export default adminService;