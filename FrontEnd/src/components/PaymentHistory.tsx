// PaymentHistory.tsx - کد کامل اصلاح شده
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

interface Payment {
  id: number;
  paymentId: string;
  amount: number;
  currency: string;
  status: string;
  paymentMethod?: string;
  description: string;
  serviceType: string;
  createdAt: string;
}

interface PaymentHistoryProps {
  userId?: number;
}

const PaymentHistory: React.FC<PaymentHistoryProps> = ({ userId }) => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const { t } = useTranslation();

  

  useEffect(() => {
  // داده‌های نمونه داخل useEffect
  const samplePayments: Payment[] = [
    {
      id: 1,
      paymentId: "pay_123456",
      amount: 2500000,
      currency: "IRT",
      status: "COMPLETED",
      paymentMethod: "CARD",
      description: "رزرو هتل دریا - شمال",
      serviceType: "HOTEL",
      createdAt: "2024-01-15T10:30:00"
    },
    {
      id: 2,
      paymentId: "pay_123457",
      amount: 1800000,
      currency: "IRT", 
      status: "COMPLETED",
      paymentMethod: "WALLET",
      description: "تور کیش - ۳ شب",
      serviceType: "TOUR",
      createdAt: "2024-01-10T14:20:00"
    },
    {
      id: 3,
      paymentId: "pay_123458",
      amount: 1200000,
      currency: "IRT",
      status: "FAILED",
      paymentMethod: "CARD",
      description: "بلیط پرواز تهران-مشهد",
      serviceType: "TICKET",
      createdAt: "2024-01-05T09:15:00"
    }
  ];

  setTimeout(() => {
    setPayments(samplePayments);
    setLoading(false);
  }, 1000);
}, [userId]); // فقط userId

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED': return 'bg-green-100 text-green-800';
      case 'PENDING': return 'bg-yellow-100 text-yellow-800';
      case 'FAILED': return 'bg-red-100 text-red-800';
      case 'REFUNDED': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'COMPLETED': return t('paymentStatus.completed');
      case 'PENDING': return t('paymentStatus.pending');
      case 'FAILED': return t('paymentStatus.failed');
      case 'REFUNDED': return t('paymentStatus.refunded');
      default: return status;
    }
  };

  const getServiceTypeIcon = (serviceType: string) => {
    switch (serviceType) {
      case 'HOTEL': return '🏨';
      case 'TOUR': return '✈️';
      case 'TICKET': return '🎫';
      default: return '📦';
    }
  };

  const getPaymentMethodText = (method?: string) => {
    if (!method) return '';
    switch (method) {
      case 'CARD': return '💳 ' + t('paymentMethod.card');
      case 'WALLET': return '👛 ' + t('paymentMethod.wallet');
      case 'BANK_TRANSFER': return '🏦 ' + t('paymentMethod.bankTransfer');
      default: return method;
    }
  };

  const formatPrice = (amount: number) => {
    return amount.toLocaleString() + ' ' + t('common.currency');
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fa-IR');
  };

  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4">{t('paymentHistory.title')}</h3>
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded mb-3"></div>
          <div className="h-4 bg-gray-200 rounded mb-3"></div>
          <div className="h-4 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <h3 className="text-xl font-bold text-gray-800 mb-6">{t('paymentHistory.title')}</h3>

      {payments.length === 0 ? (
        <div className="text-center py-8">
          <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
          </svg>
          <p className="text-gray-500">{t('paymentHistory.noPayments')}</p>
        </div>
      ) : (
        <div className="space-y-4">
          {payments.map((payment) => (
            <div key={payment.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3 space-x-reverse">
                  <span className="text-2xl">{getServiceTypeIcon(payment.serviceType)}</span>
                  <div>
                    <h4 className="font-semibold text-gray-800">{payment.description}</h4>
                    <p className="text-sm text-gray-500">{payment.paymentId}</p>
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(payment.status)}`}>
                  {getStatusText(payment.status)}
                </span>
              </div>

              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center space-x-4 space-x-reverse">
                  <span className="text-gray-600">
                    {formatDate(payment.createdAt)}
                  </span>
                  {payment.paymentMethod && (
                    <span className="text-gray-600">
                      {getPaymentMethodText(payment.paymentMethod)}
                    </span>
                  )}
                </div>
                <span className="font-bold text-gray-800">
                  {formatPrice(payment.amount)}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {payments.length > 0 && (
        <div className="mt-6 pt-4 border-t border-gray-200">
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-600">{t('paymentHistory.totalTransactions')}:</span>
            <span className="font-semibold text-gray-800">{payments.length} {t('paymentHistory.transactions')}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentHistory;