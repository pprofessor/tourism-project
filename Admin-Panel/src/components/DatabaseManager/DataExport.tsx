import React, { useState } from 'react';
import adminService from '../../services/adminService';

const DataExport: React.FC = () => {
  const [exporting, setExporting] = useState(false);

  const handleExport = async (type: string) => {
    setExporting(true);
    try {
      const response = await adminService.exportData(type);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `tourism-${type}-${new Date().toISOString().split('T')[0]}.json`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      
      alert(`${type} data exported successfully!`);
    } catch (error) {
      console.error('Error exporting data:', error);
      alert(`Failed to export ${type} data`);
    } finally {
      setExporting(false);
    }
  };

  const exportAllData = async () => {
    setExporting(true);
    try {
      await Promise.all([
        handleExport('users'),
        handleExport('hotels'),
        handleExport('bookings')
      ]);
      alert('All data exported successfully!');
    } catch (error) {
      console.error('Error exporting all data:', error);
      alert('Failed to export all data');
    } finally {
      setExporting(false);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Data Export</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white border border-gray-200 rounded-lg p-6 text-center">
          <div className="text-3xl mb-3">👥</div>
          <h3 className="font-semibold mb-2">Users Data</h3>
          <p className="text-sm text-gray-500 mb-4">Export all user information</p>
          <button
            onClick={() => handleExport('users')}
            disabled={exporting}
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition font-medium"
          >
            {exporting ? 'Exporting...' : 'Export Users'}
          </button>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6 text-center">
          <div className="text-3xl mb-3">🏨</div>
          <h3 className="font-semibold mb-2">Hotels Data</h3>
          <p className="text-sm text-gray-500 mb-4">Export all hotel information</p>
          <button
            onClick={() => handleExport('hotels')}
            disabled={exporting}
            className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 disabled:opacity-50 transition font-medium"
          >
            {exporting ? 'Exporting...' : 'Export Hotels'}
          </button>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6 text-center">
          <div className="text-3xl mb-3">📅</div>
          <h3 className="font-semibold mb-2">Bookings Data</h3>
          <p className="text-sm text-gray-500 mb-4">Export all booking records</p>
          <button
            onClick={() => handleExport('bookings')}
            disabled={exporting}
            className="w-full bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 disabled:opacity-50 transition font-medium"
          >
            {exporting ? 'Exporting...' : 'Export Bookings'}
          </button>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6 text-center">
          <div className="text-3xl mb-3">💾</div>
          <h3 className="font-semibold mb-2">All Data</h3>
          <p className="text-sm text-gray-500 mb-4">Export complete database</p>
          <button
            onClick={exportAllData}
            disabled={exporting}
            className="w-full bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 disabled:opacity-50 transition font-medium"
          >
            {exporting ? 'Exporting...' : 'Export All'}
          </button>
        </div>
      </div>

      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
        <h3 className="font-semibold text-yellow-800 mb-2">Export Information</h3>
        <ul className="text-sm text-yellow-700 space-y-1">
          <li>• Data is exported in JSON format</li>
          <li>• Files include timestamps for tracking</li>
          <li>• Export may take a few moments for large datasets</li>
          <li>• Keep exported files secure - they contain sensitive information</li>
        </ul>
      </div>
    </div>
  );
};

export default DataExport;