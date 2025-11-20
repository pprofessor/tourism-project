import React, { useState, useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useTheme } from "../context/ThemeContext";

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
  const { theme } = useTheme();

  // داده‌های نمونه با useMemo
  const samplePayments = useMemo(
    (): Payment[] => [
      {
        id: 1,
        paymentId: "pay_123456",
        amount: 2500000,
        currency: "IRT",
        status: "COMPLETED",
        paymentMethod: "CARD",
        description: "رزرو هتل دریا - شمال",
        serviceType: "HOTEL",
        createdAt: "2024-01-15T10:30:00",
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
        createdAt: "2024-01-10T14:20:00",
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
        createdAt: "2024-01-05T09:15:00",
      },
    ],
    []
  );

  useEffect(() => {
    setTimeout(() => {
      setPayments(samplePayments);
      setLoading(false);
    }, 1000);
  }, [userId, samplePayments]);

  // کلاس‌های شرطی برای تم
  const containerClasses = `rounded-2xl shadow-lg p-6 transition-colors duration-300 ${
    theme === "dark" ? "bg-gray-800" : "bg-white"
  }`;

  const textPrimaryClasses = theme === "dark" ? "text-white" : "text-gray-800";
  const textSecondaryClasses =
    theme === "dark" ? "text-gray-300" : "text-gray-600";
  const textMutedClasses = theme === "dark" ? "text-gray-400" : "text-gray-500";
  const borderClasses =
    theme === "dark" ? "border-gray-700" : "border-gray-200";
  const cardHoverClasses =
    theme === "dark"
      ? "hover:bg-gray-750 border-gray-700"
      : "hover:shadow-lg border-gray-200";

  // توابع helper با useMemo
  const getStatusColor = useMemo(
    () => (status: string) => {
      const colors = {
        COMPLETED:
          theme === "dark"
            ? "bg-green-900 text-green-200"
            : "bg-green-100 text-green-800",
        PENDING:
          theme === "dark"
            ? "bg-yellow-900 text-yellow-200"
            : "bg-yellow-100 text-yellow-800",
        FAILED:
          theme === "dark"
            ? "bg-red-900 text-red-200"
            : "bg-red-100 text-red-800",
        REFUNDED:
          theme === "dark"
            ? "bg-blue-900 text-blue-200"
            : "bg-blue-100 text-blue-800",
        default:
          theme === "dark"
            ? "bg-gray-900 text-gray-200"
            : "bg-gray-100 text-gray-800",
      };
      return colors[status as keyof typeof colors] || colors.default;
    },
    [theme]
  );

  const getStatusText = useMemo(
    () => (status: string) => {
      const statusMap: Record<string, string> = {
        COMPLETED: t("paymentStatus.completed"),
        PENDING: t("paymentStatus.pending"),
        FAILED: t("paymentStatus.failed"),
        REFUNDED: t("paymentStatus.refunded"),
      };
      return statusMap[status] || status;
    },
    [t]
  );

  const getServiceTypeIcon = useMemo(
    () => (serviceType: string) => {
      const icons: Record<string, string> = {
        HOTEL: "🏨",
        TOUR: "✈️",
        TICKET: "🎫",
      };
      return icons[serviceType] || "📦";
    },
    []
  );

  const getPaymentMethodText = useMemo(
    () => (method?: string) => {
      if (!method) return "";
      const methodMap: Record<string, string> = {
        CARD: "💳 " + t("paymentMethod.card"),
        WALLET: "👛 " + t("paymentMethod.wallet"),
        BANK_TRANSFER: "🏦 " + t("paymentMethod.bankTransfer"),
      };
      return methodMap[method] || method;
    },
    [t]
  );

  const formatPrice = useMemo(
    () => (amount: number) => {
      return amount.toLocaleString() + " " + t("common.currency");
    },
    [t]
  );

  const formatDate = useMemo(
    () => (dateString: string) => {
      return new Date(dateString).toLocaleDateString("fa-IR");
    },
    []
  );

  // آمار payments
  const paymentStats = useMemo(
    () => ({
      total: payments.length,
      completed: payments.filter((p) => p.status === "COMPLETED").length,
      failed: payments.filter((p) => p.status === "FAILED").length,
      pending: payments.filter((p) => p.status === "PENDING").length,
    }),
    [payments]
  );

  // Loading state بهینه‌شده
  if (loading) {
    return (
      <div className={containerClasses}>
        <h3 className={`text-xl font-bold mb-4 ${textPrimaryClasses}`}>
          {t("paymentHistory.title")}
        </h3>
        <div className="animate-pulse space-y-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className={`h-20 rounded-lg ${
                theme === "dark" ? "bg-gray-700" : "bg-gray-200"
              }`}
            ></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={containerClasses}>
      <h3 className={`text-xl font-bold mb-6 ${textPrimaryClasses}`}>
        {t("paymentHistory.title")}
      </h3>

      {payments.length === 0 ? (
        <div className="text-center py-8">
          <svg
            className={`w-16 h-16 mx-auto mb-4 ${textMutedClasses}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
            />
          </svg>
          <p className={textMutedClasses}>{t("paymentHistory.noPayments")}</p>
        </div>
      ) : (
        <div className="space-y-4">
          {payments.map((payment) => (
            <div
              key={payment.id}
              className={`border rounded-lg p-4 transition-all ${cardHoverClasses}`}
            >
              {/* هدر کارت */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3 space-x-reverse">
                  <span className="text-2xl">
                    {getServiceTypeIcon(payment.serviceType)}
                  </span>
                  <div>
                    <h4 className={`font-semibold ${textPrimaryClasses}`}>
                      {payment.description}
                    </h4>
                    <p className={`text-sm ${textMutedClasses}`}>
                      {payment.paymentId}
                    </p>
                  </div>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                    payment.status
                  )}`}
                >
                  {getStatusText(payment.status)}
                </span>
              </div>

              {/* اطلاعات پایین کارت */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between text-sm">
                <div className="flex flex-wrap items-center gap-4 mb-2 sm:mb-0">
                  <span className={textSecondaryClasses}>
                    {formatDate(payment.createdAt)}
                  </span>
                  {payment.paymentMethod && (
                    <span className={textSecondaryClasses}>
                      {getPaymentMethodText(payment.paymentMethod)}
                    </span>
                  )}
                </div>
                <span className={`font-bold ${textPrimaryClasses}`}>
                  {formatPrice(payment.amount)}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* آمار پایین */}
      {payments.length > 0 && (
        <div className={`mt-6 pt-4 border-t ${borderClasses}`}>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div className="text-center">
              <div className={textSecondaryClasses}>
                {t("paymentHistory.totalTransactions")}
              </div>
              <div className={`font-semibold ${textPrimaryClasses}`}>
                {paymentStats.total}
              </div>
            </div>
            <div className="text-center">
              <div className={textSecondaryClasses}>موفق</div>
              <div className="font-semibold text-green-500">
                {paymentStats.completed}
              </div>
            </div>
            <div className="text-center">
              <div className={textSecondaryClasses}>ناموفق</div>
              <div className="font-semibold text-red-500">
                {paymentStats.failed}
              </div>
            </div>
            <div className="text-center">
              <div className={textSecondaryClasses}>در انتظار</div>
              <div className="font-semibold text-yellow-500">
                {paymentStats.pending}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentHistory;
