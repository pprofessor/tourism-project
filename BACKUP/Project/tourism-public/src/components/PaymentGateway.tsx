import React, { useState } from 'react';

interface PaymentGatewayProps {
  amount: number;
  serviceName: string;
  onCancel: () => void;
}

interface BankGateway {
  id: string;
  name: string;
  logo: string;
  description: string;
}

const PaymentGateway: React.FC<PaymentGatewayProps> = ({ amount, serviceName, onCancel }) => {
  const [selectedGateway, setSelectedGateway] = useState<string>('');

  // لیست درگاه‌های بانکی
  const bankGateways: BankGateway[] = [
    {
      id: 'saman',
      name: 'درگاه سامان',
      logo: '🏦',
      description: 'پرداخت امن با کارت‌های عضو شتاب'
    },
    {
      id: 'mellat',
      name: 'درگاه ملت',
      logo: '💳',
      description: 'پشتیبانی از تمامی کارت‌های بانکی'
    },
    {
      id: 'parsian',
      name: 'درگاه پارسیان',
      logo: '🔐',
      description: 'امنیت بالا و سرعت مناسب'
    }
  ];

  const handleGatewaySelect = (gatewayId: string) => {
    setSelectedGateway(gatewayId);
  };

  const proceedToBank = () => {
    if (!selectedGateway) return;

    // شبیه‌سازی انتقال به درگاه بانک
    const paymentData = {
      amount,
      serviceName,
      gateway: selectedGateway,
      timestamp: new Date().toISOString()
    };

    // در حالت واقعی: window.location.href = bankUrl
    console.log('انتقال به درگاه بانک:', paymentData);
    
    // شبیه‌سازی پرداخت موفق
    setTimeout(() => {
      alert(`پرداخت موفق از طریق ${bankGateways.find(g => g.id === selectedGateway)?.name}`);
      onCancel();
    }, 2000);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full">
        {/* هدر */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-6 rounded-t-2xl">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold">انتخاب درگاه پرداخت</h2>
            <button onClick={onCancel} className="text-white hover:text-gray-200">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <p className="mt-2 opacity-90">{serviceName}</p>
        </div>

        {/* اطلاعات پرداخت */}
        <div className="p-6">
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">مبلغ قابل پرداخت:</span>
              <span className="text-2xl font-bold text-green-600">
                {amount.toLocaleString()} تومان
              </span>
            </div>
          </div>

          {/* لیست درگاه‌ها */}
          <div className="space-y-3 mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">درگاه پرداخت مورد نظر را انتخاب کنید:</h3>
            
            {bankGateways.map((gateway) => (
              <div
                key={gateway.id}
                onClick={() => handleGatewaySelect(gateway.id)}
                className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                  selectedGateway === gateway.id
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <span className="text-2xl ml-3">{gateway.logo}</span>
                    <div>
                      <div className="font-semibold text-gray-800">{gateway.name}</div>
                      <div className="text-sm text-gray-600">{gateway.description}</div>
                    </div>
                  </div>
                  {selectedGateway === gateway.id && (
                    <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* دکمه‌ها */}
          <div className="flex space-x-3 space-x-reverse">
            <button
              onClick={onCancel}
              className="flex-1 bg-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-400 transition font-medium"
            >
              انصراف
            </button>
            <button
              onClick={proceedToBank}
              disabled={!selectedGateway}
              className="flex-1 bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              انتقال به درگاه بانک
            </button>
          </div>

          {/* امنیت */}
          <div className="mt-6 pt-4 border-t border-gray-200 text-center">
            <div className="flex items-center justify-center text-gray-500 text-sm">
              <svg className="w-5 h-5 ml-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
              </svg>
              کلیه پرداخت‌ها مطابق با استانداردهای شاپرک
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentGateway;