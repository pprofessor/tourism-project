const API_BASE_URL = 'http://localhost:8080/api';
const adminService = {
  // Hotel Management
  getHotels: () => fetch(`${API_BASE_URL}/hotels`),
  createHotel: (hotelData: any) => fetch(`${API_BASE_URL}/hotels`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(hotelData)
  }),
  updateHotel: (id: number, hotelData: any) => fetch(`${API_BASE_URL}/hotels/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(hotelData)
  }),
  deleteHotel: (id: number) => fetch(`${API_BASE_URL}/hotels/${id}`, { method: 'DELETE' }),

  // User Management
  getUsers: () => fetch(`${API_BASE_URL}/users`),
  updateUser: (id: number, userData: any) => fetch(`${API_BASE_URL}/users/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userData)
  }),


// حذف کاربر
deleteUser: async (userId: number) => {
  const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
    method: 'DELETE'
  });
  return await response.json();
},

  
  // 🔐 تغییر رمز عبور کاربر - تابع جدید
  changeUserPassword: async (userId: number, newPassword: string) => {
    const response = await fetch(`${API_BASE_URL}/users/${userId}/change-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ newPassword })
    });
    return await response.json();
  },
  
  // Booking Management
  getBookings: () => fetch(`${API_BASE_URL}/bookings`),
  updateBookingStatus: (id: number, status: string) => 
    fetch(`${API_BASE_URL}/bookings/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    }),

  // Data Export
  exportData: (type: string) => 
    fetch(`${API_BASE_URL}/admin/export/${type}`)
};

export default adminService;