const API_BASE_URL = 'http://localhost:8083';

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