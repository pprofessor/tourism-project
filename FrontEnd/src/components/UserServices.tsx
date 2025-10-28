// UserServices.tsx - کد کامل اصلاح شده
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

interface Booking {
  id: number;
  bookingId: string;
  bookingType: string;
  serviceName: string;
  serviceDescription?: string;
  price: number;
  status: string;
  checkInDate?: string;
  checkOutDate?: string;
  bookingDate: string;
  guests?: number;
}

interface UserServicesProps {
  userId?: number;
}

const UserServices: React.FC<UserServicesProps> = ({ userId }) => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const { t } = useTranslation();

  useEffect(() => {
    const sampleBookings: Booking[] = [
      {
        id: 1,
        bookingId: "HOTEL_12345",
        bookingType: "HOTEL",
        serviceName: "هتل دریا - شمال",
        serviceDescription: "سوئیت لوکس با ویو دریا",
        price: 2500000,
        status: "CONFIRMED",
        checkInDate: "2024-02-01",
        checkOutDate: "2024-02-04",
        bookingDate: "2024-01-15T10:30:00",
        guests: 2
      },
      {
        id: 2,
        bookingId: "TOUR_67890",
        bookingType: "TOUR",
        serviceName: "تور کیش - ۳ شب",
        serviceDescription: "پرواز رفت و برگشت + هتل ۴ ستاره",
        price: 1800000,
        status: "COMPLETED",
        bookingDate: "2024-01-10T14:20:00"
      },
      {
        id: 3,
        bookingId: "TICKET_54321",
        bookingType: "TICKET",
        serviceName: "بلیط پرواز تهران-مشهد",
        serviceDescription: "پرواز چارتر رفت و برگشت",
        price: 1200000,
        status: "CONFIRMED",
        bookingDate: "2024-01-20T09:15:00"
      },
      {
        id: 4,
        bookingId: "HOTEL_98765",
        bookingType: "HOTEL",
        serviceName: "هتل کوهستان - دماوند",
        serviceDescription: "اتاق دبل با ویو کوهستان",
        price: 1900000,
        status: "CANCELLED",
        checkInDate: "2024-02-10",
        checkOutDate: "2024-02-12",
        bookingDate: "2024-01-18T16:45:00",
        guests: 2
      }
    ];

    setTimeout(() => {
      setBookings(sampleBookings);
      setLoading(false);
    }, 1000);
  }, [userId]);

  const filteredBookings = bookings.filter(booking => 
    filter === 'all' || booking.bookingType === filter.toUpperCase()
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'CONFIRMED': return 'bg-green-100 text-green-800';
      case 'COMPLETED': return 'bg-blue-100 text-blue-800';
      case 'PENDING': return 'bg-yellow-100 text-yellow-800';
      case 'CANCELLED': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'CONFIRMED': return t('services.status.confirmed');
      case 'COMPLETED': return t('services.status.completed');
      case 'PENDING': return t('services.status.pending');
      case 'CANCELLED': return t('services.status.cancelled');
      default: return status;
    }
  };

  const getServiceIcon = (type: string) => {
    switch (type) {
      case 'HOTEL': return '🏨';
      case 'TOUR': return '✈️';
      case 'TICKET': return '🎫';
      default: return '📦';
    }
  };

  const getServiceTypeText = (type: string) => {
    switch (type) {
      case 'HOTEL': return t('services.type.hotel');
      case 'TOUR': return t('services.type.tour');
      case 'TICKET': return t('services.type.ticket');
      default: return type;
    }
  };

  const formatPrice = (amount: number) => {
    return amount.toLocaleString('fa-IR') + ' ' + t('common.currency');
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fa-IR');
  };

  const filterButtons = [
    { key: 'all', label: t('services.filter.all') },
    { key: 'hotel', label: t('services.filter.hotels') },
    { key: 'tour', label: t('services.filter.tours') },
    { key: 'ticket', label: t('services.filter.tickets') }
  ];

  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4">{t('services.title')}</h3>
        <div className="animate-pulse space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-20 bg-gray-200 rounded-lg"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4 md:mb-0">{t('services.title')}</h3>
        
        <div className="flex space-x-2">
          {filterButtons.map((filterType) => (
            <button
              key={filterType.key}
              onClick={() => setFilter(filterType.key)}
              className={`px-3 py-2 rounded-lg text-sm transition ${
                filter === filterType.key
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {filterType.label}
            </button>
          ))}
        </div>
      </div>

      {filteredBookings.length === 0 ? (
        <div className="text-center py-8">
          <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <p className="text-gray-500">{t('services.noServices')}</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredBookings.map((booking) => (
            <div key={booking.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-start space-x-3 space-x-reverse">
                  <span className="text-2xl mt-1">{getServiceIcon(booking.bookingType)}</span>
                  <div>
                    <h4 className="font-semibold text-gray-800">{booking.serviceName}</h4>
                    <p className="text-sm text-gray-500 mt-1">{booking.serviceDescription}</p>
                    <div className="flex items-center space-x-4 space-x-reverse mt-2">
                      <span className="text-xs text-gray-500">
                        {getServiceTypeText(booking.bookingType)}
                      </span>
                      <span className="text-xs text-gray-500">
                        {booking.bookingId}
                      </span>
                    </div>
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
                  {getStatusText(booking.status)}
                </span>
              </div>

              <div className="flex flex-col md:flex-row md:items-center justify-between text-sm">
                <div className="flex items-center space-x-4 space-x-reverse mb-2 md:mb-0">
                  <span className="text-gray-600">
                    📅 {formatDate(booking.bookingDate)}
                  </span>
                  {booking.checkInDate && booking.checkOutDate && (
                    <span className="text-gray-600">
                      🗓️ {formatDate(booking.checkInDate)} تا {formatDate(booking.checkOutDate)}
                    </span>
                  )}
                  {booking.guests && (
                    <span className="text-gray-600">
                      👥 {booking.guests} نفر
                    </span>
                  )}
                </div>
                <span className="font-bold text-gray-800 text-lg">
                  {formatPrice(booking.price)}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {bookings.length > 0 && (
        <div className="mt-6 pt-4 border-t border-gray-200">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div className="text-center">
              <div className="text-gray-600">{t('services.stats.total')}</div>
              <div className="font-semibold text-gray-800">{bookings.length}</div>
            </div>
            <div className="text-center">
              <div className="text-gray-600">{t('services.stats.active')}</div>
              <div className="font-semibold text-green-600">
                {bookings.filter(b => b.status === 'CONFIRMED').length}
              </div>
            </div>
            <div className="text-center">
              <div className="text-gray-600">{t('services.stats.completed')}</div>
              <div className="font-semibold text-blue-600">
                {bookings.filter(b => b.status === 'COMPLETED').length}
              </div>
            </div>
            <div className="text-center">
              <div className="text-gray-600">{t('services.stats.cancelled')}</div>
              <div className="font-semibold text-red-600">
                {bookings.filter(b => b.status === 'CANCELLED').length}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserServices;