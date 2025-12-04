import React, { useState, useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useTheme } from "../context/ThemeContext";

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
  const [filter, setFilter] = useState("all");
  const { t } = useTranslation();
  const { theme } = useTheme();

  // داده‌های نمونه
  const sampleBookings = useMemo(
    (): Booking[] => [
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
        guests: 2,
      },
      {
        id: 2,
        bookingId: "TOUR_67890",
        bookingType: "TOUR",
        serviceName: "تور کیش - ۳ شب",
        serviceDescription: "پرواز رفت و برگشت + هتل ۴ ستاره",
        price: 1800000,
        status: "COMPLETED",
        bookingDate: "2024-01-10T14:20:00",
      },
      {
        id: 3,
        bookingId: "TICKET_54321",
        bookingType: "TICKET",
        serviceName: "بلیط پرواز تهران-مشهد",
        serviceDescription: "پرواز چارتر رفت و برگشت",
        price: 1200000,
        status: "CONFIRMED",
        bookingDate: "2024-01-20T09:15:00",
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
        guests: 2,
      },
    ],
    []
  );

  useEffect(() => {
    setTimeout(() => {
      setBookings(sampleBookings);
      setLoading(false);
    }, 1000);
  }, [userId, sampleBookings]);

  // فیلتر bookings
  const filteredBookings = useMemo(
    () =>
      bookings.filter(
        (booking) =>
          filter === "all" || booking.bookingType === filter.toUpperCase()
      ),
    [bookings, filter]
  );

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

  // توابع helper
  const getStatusColor = (status: string) => {
    const colors = {
      CONFIRMED:
        theme === "dark"
          ? "bg-green-900 text-green-200"
          : "bg-green-100 text-green-800",
      COMPLETED:
        theme === "dark"
          ? "bg-blue-900 text-blue-200"
          : "bg-blue-100 text-blue-800",
      PENDING:
        theme === "dark"
          ? "bg-yellow-900 text-yellow-200"
          : "bg-yellow-100 text-yellow-800",
      CANCELLED:
        theme === "dark"
          ? "bg-red-900 text-red-200"
          : "bg-red-100 text-red-800",
      default:
        theme === "dark"
          ? "bg-gray-900 text-gray-200"
          : "bg-gray-100 text-gray-800",
    };
    return colors[status as keyof typeof colors] || colors.default;
  };

  const getStatusText = (status: string) => {
    const statusMap: Record<string, string> = {
      CONFIRMED: t("services.status.confirmed"),
      COMPLETED: t("services.status.completed"),
      PENDING: t("services.status.pending"),
      CANCELLED: t("services.status.cancelled"),
    };
    return statusMap[status] || status;
  };

  const getServiceIcon = (type: string) => {
    const icons: Record<string, string> = {
      HOTEL: "🏨",
      TOUR: "✈️",
      TICKET: "🎫",
    };
    return icons[type] || "📦";
  };

  const getServiceTypeText = (type: string) => {
    const typeMap: Record<string, string> = {
      HOTEL: t("services.type.hotel"),
      TOUR: t("services.type.tour"),
      TICKET: t("services.type.ticket"),
    };
    return typeMap[type] || type;
  };

  const formatPrice = (amount: number) => {
    return amount.toLocaleString("fa-IR") + " " + t("common.currency");
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("fa-IR");
  };

  // دکمه‌های فیلتر
  const filterButtons = useMemo(
    () => [
      { key: "all", label: t("services.filter.all") },
      { key: "hotel", label: t("services.filter.hotels") },
      { key: "tour", label: t("services.filter.tours") },
      { key: "ticket", label: t("services.filter.tickets") },
    ],
    [t]
  );

  // آمار bookings
  const bookingStats = useMemo(
    () => ({
      total: bookings.length,
      active: bookings.filter((b) => b.status === "CONFIRMED").length,
      completed: bookings.filter((b) => b.status === "COMPLETED").length,
      cancelled: bookings.filter((b) => b.status === "CANCELLED").length,
    }),
    [bookings]
  );

  // Loading state
  if (loading) {
    return (
      <div className={containerClasses}>
        <h3 className={`text-xl font-bold mb-4 ${textPrimaryClasses}`}>
          {t("services.title")}
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
      {/* هدر با فیلترها */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <h3 className={`text-xl font-bold mb-4 md:mb-0 ${textPrimaryClasses}`}>
          {t("services.title")}
        </h3>

        <div className="flex flex-wrap gap-2">
          {filterButtons.map((filterType) => (
            <button
              key={filterType.key}
              onClick={() => setFilter(filterType.key)}
              className={`px-3 py-2 rounded-lg text-sm transition ${
                filter === filterType.key
                  ? "bg-blue-600 text-white"
                  : theme === "dark"
                  ? "bg-gray-700 text-gray-300 hover:bg-gray-600"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {filterType.label}
            </button>
          ))}
        </div>
      </div>

      {/* لیست bookings */}
      {filteredBookings.length === 0 ? (
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
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          <p className={textMutedClasses}>{t("services.noServices")}</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredBookings.map((booking) => (
            <div
              key={booking.id}
              className={`border rounded-lg p-4 transition-all ${cardHoverClasses}`}
            >
              {/* هدر کارت */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-start space-x-3 space-x-reverse">
                  <span className="text-2xl mt-1">
                    {getServiceIcon(booking.bookingType)}
                  </span>
                  <div className="flex-1">
                    <h4 className={`font-semibold ${textPrimaryClasses}`}>
                      {booking.serviceName}
                    </h4>
                    {booking.serviceDescription && (
                      <p className={`text-sm mt-1 ${textMutedClasses}`}>
                        {booking.serviceDescription}
                      </p>
                    )}
                    <div className="flex items-center space-x-4 space-x-reverse mt-2">
                      <span className={`text-xs ${textMutedClasses}`}>
                        {getServiceTypeText(booking.bookingType)}
                      </span>
                      <span className={`text-xs ${textMutedClasses}`}>
                        {booking.bookingId}
                      </span>
                    </div>
                  </div>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                    booking.status
                  )}`}
                >
                  {getStatusText(booking.status)}
                </span>
              </div>

              {/* اطلاعات پایین کارت */}
              <div className="flex flex-col md:flex-row md:items-center justify-between text-sm">
                <div className="flex flex-wrap items-center gap-4 mb-2 md:mb-0">
                  <span className={textSecondaryClasses}>
                    📅 {formatDate(booking.bookingDate)}
                  </span>
                  {booking.checkInDate && booking.checkOutDate && (
                    <span className={textSecondaryClasses}>
                      🗓️ {formatDate(booking.checkInDate)} تا{" "}
                      {formatDate(booking.checkOutDate)}
                    </span>
                  )}
                  {booking.guests && (
                    <span className={textSecondaryClasses}>
                      👥 {booking.guests} نفر
                    </span>
                  )}
                </div>
                <span className={`font-bold text-lg ${textPrimaryClasses}`}>
                  {formatPrice(booking.price)}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* آمار پایین */}
      {bookings.length > 0 && (
        <div className={`mt-6 pt-4 border-t ${borderClasses}`}>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div className="text-center">
              <div className={textSecondaryClasses}>
                {t("services.stats.total")}
              </div>
              <div className={`font-semibold ${textPrimaryClasses}`}>
                {bookingStats.total}
              </div>
            </div>
            <div className="text-center">
              <div className={textSecondaryClasses}>
                {t("services.stats.active")}
              </div>
              <div className="font-semibold text-green-500">
                {bookingStats.active}
              </div>
            </div>
            <div className="text-center">
              <div className={textSecondaryClasses}>
                {t("services.stats.completed")}
              </div>
              <div className="font-semibold text-blue-500">
                {bookingStats.completed}
              </div>
            </div>
            <div className="text-center">
              <div className={textSecondaryClasses}>
                {t("services.stats.cancelled")}
              </div>
              <div className="font-semibold text-red-500">
                {bookingStats.cancelled}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserServices;
