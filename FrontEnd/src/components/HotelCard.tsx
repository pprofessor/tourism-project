import React, { useState } from 'react';
import PaymentGateway from './PaymentGateway';
import { useTranslation } from 'react-i18next';

interface Hotel {
  id: number;
  name: string;
  location: string;
  price: number;
  image: string;
  rating: number;
}

interface HotelCardProps {
  hotel: Hotel;
}

const HotelCard: React.FC<HotelCardProps> = ({ hotel }) => {
  const [showPayment, setShowPayment] = useState(false);
  const { t } = useTranslation();

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center space-x-1 space-x-reverse">
        {[...Array(5)].map((_, index) => (
          <svg
            key={index}
            className={`w-4 h-4 ${
              index < Math.floor(rating) ? 'text-yellow-400' : 'text-gray-300'
            }`}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
        <span className="text-sm text-gray-600 mr-1">({rating})</span>
      </div>
    );
  };


  return (
    <>
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
        {/* تصویر هتل */}
        <div className="relative h-48 bg-gradient-to-br from-blue-400 to-purple-500">
          <div className="absolute inset-0 bg-black opacity-20"></div>
          <div className="absolute top-4 left-4 bg-white px-2 py-1 rounded-full text-sm font-semibold text-gray-800">
            ویژه
          </div>
        </div>

        {/* محتوای کارت */}
        <div className="p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-2">{hotel.name}</h3>
          <div className="flex items-center text-gray-600 mb-3">
            <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span>{hotel.location}</span>
          </div>

          {/* امتیاز */}
          {renderStars(hotel.rating)}

          {/* قیمت و دکمه با i18n */}
          <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200">
            <div>
              <span className="text-2xl font-bold text-gray-800">
                {hotel.price.toLocaleString()}
              </span>
              <span className="text-gray-600 text-sm mr-1">{t('common.currency')}</span>
            </div>
            <button 
              onClick={() => setShowPayment(true)}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition font-medium text-sm"
            >
              {t('hotel.bookNow')}
            </button>
          </div>
        </div>
      </div>

      {/* مودال پرداخت */}
      {showPayment && (
        <PaymentGateway
          amount={hotel.price}
          serviceName={hotel.name}
          onCancel={() => setShowPayment(false)}
        />
      )}
    </>
  );
};

export default HotelCard;