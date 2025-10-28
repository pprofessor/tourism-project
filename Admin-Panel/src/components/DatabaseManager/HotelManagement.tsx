import React, { useState, useEffect } from 'react';
import adminService from '../../services/adminService';

interface Hotel {
  id: number;
  name: string;
  location: string;
  price: number;
  imageUrl: string;
}

const HotelManagement: React.FC = () => {
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [editingHotel, setEditingHotel] = useState<Hotel | null>(null);
  const [newHotel, setNewHotel] = useState<Partial<Hotel>>({});
  const [loading, setLoading] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<{ show: boolean; hotelId: number | null; hotelName: string }>({
    show: false,
    hotelId: null,
    hotelName: ''
  });

  useEffect(() => {
    loadHotels();
  }, []);

  const loadHotels = async () => {
    setLoading(true);
    try {
      const response = await adminService.getHotels();
      const data = await response.json();
      setHotels(data);
    } catch (error) {
      console.error('Error loading hotels:', error);
      alert('Failed to load hotels');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateHotel = async () => {
    if (!newHotel.name || !newHotel.location || !newHotel.price) {
      alert('Please fill all required fields');
      return;
    }

    try {
      await adminService.createHotel(newHotel);
      setNewHotel({ name: '', location: '', price: 0, imageUrl: '' });
      loadHotels();
      alert('Hotel created successfully!');
    } catch (error) {
      console.error('Error creating hotel:', error);
      alert('Failed to create hotel');
    }
  };

  const handleUpdateHotel = async () => {
    if (!editingHotel) return;
    
    try {
      await adminService.updateHotel(editingHotel.id, editingHotel);
      setEditingHotel(null);
      loadHotels();
      alert('Hotel updated successfully!');
    } catch (error) {
      console.error('Error updating hotel:', error);
      alert('Failed to update hotel');
    }
  };

  const showDeleteConfirm = (hotelId: number, hotelName: string) => {
    setDeleteConfirm({
      show: true,
      hotelId,
      hotelName
    });
  };

  const handleDeleteHotel = async () => {
    if (!deleteConfirm.hotelId) return;
    
    try {
      await adminService.deleteHotel(deleteConfirm.hotelId);
      setDeleteConfirm({ show: false, hotelId: null, hotelName: '' });
      loadHotels();
      alert('Hotel deleted successfully!');
    } catch (error) {
      console.error('Error deleting hotel:', error);
      alert('Failed to delete hotel');
    }
  };

  const cancelDelete = () => {
    setDeleteConfirm({ show: false, hotelId: null, hotelName: '' });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Hotel Management</h2>
      
      <div className="mb-8 p-6 border border-gray-200 rounded-lg bg-gray-50">
        <h3 className="text-lg font-semibold mb-4">Add New Hotel</h3>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <input
            type="text"
            placeholder="Hotel Name"
            value={newHotel.name || ''}
            onChange={(e) => setNewHotel({...newHotel, name: e.target.value})}
            className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="text"
            placeholder="Location"
            value={newHotel.location || ''}
            onChange={(e) => setNewHotel({...newHotel, location: e.target.value})}
            className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="number"
            placeholder="Price"
            value={newHotel.price || ''}
            onChange={(e) => setNewHotel({...newHotel, price: Number(e.target.value)})}
            className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="text"
            placeholder="Image URL (optional)"
            value={newHotel.imageUrl || ''}
            onChange={(e) => setNewHotel({...newHotel, imageUrl: e.target.value})}
            className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={handleCreateHotel}
            className="bg-green-600 text-white p-3 rounded-lg hover:bg-green-700 transition font-medium"
          >
            Add Hotel
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Hotel Name
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Location
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Price
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {hotels.map((hotel) => (
              <tr key={hotel.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {hotel.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {hotel.location}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  ${hotel.price.toLocaleString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm space-x-2">
                  <button
                    onClick={() => setEditingHotel(hotel)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition font-medium"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => showDeleteConfirm(hotel.id, hotel.name)}
                    className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition font-medium"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {editingHotel && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            <h3 className="text-xl font-bold mb-4">Edit Hotel</h3>
            <div className="space-y-4">
              <input
                type="text"
                value={editingHotel.name}
                onChange={(e) => setEditingHotel({...editingHotel, name: e.target.value})}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Hotel Name"
              />
              <input
                type="text"
                value={editingHotel.location}
                onChange={(e) => setEditingHotel({...editingHotel, location: e.target.value})}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Location"
              />
              <input
                type="number"
                value={editingHotel.price}
                onChange={(e) => setEditingHotel({...editingHotel, price: Number(e.target.value)})}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Price"
              />
              <input
                type="text"
                value={editingHotel.imageUrl}
                onChange={(e) => setEditingHotel({...editingHotel, imageUrl: e.target.value})}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Image URL"
              />
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={handleUpdateHotel}
                className="flex-1 bg-green-600 text-white p-3 rounded-lg hover:bg-green-700 transition font-medium"
              >
                Update
              </button>
              <button
                onClick={() => setEditingHotel(null)}
                className="flex-1 bg-gray-600 text-white p-3 rounded-lg hover:bg-gray-700 transition font-medium"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {deleteConfirm.show && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            <h3 className="text-xl font-bold mb-4 text-red-600">Confirm Delete</h3>
            <p className="mb-6">
              Are you sure you want to delete the hotel <strong>"{deleteConfirm.hotelName}"</strong>? 
              This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={handleDeleteHotel}
                className="flex-1 bg-red-600 text-white p-3 rounded-lg hover:bg-red-700 transition font-medium"
              >
                Delete Hotel
              </button>
              <button
                onClick={cancelDelete}
                className="flex-1 bg-gray-600 text-white p-3 rounded-lg hover:bg-gray-700 transition font-medium"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HotelManagement;