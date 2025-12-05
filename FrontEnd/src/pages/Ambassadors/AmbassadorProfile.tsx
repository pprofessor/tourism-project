import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useTheme } from "../../context/ThemeContext";
import {
  ambassadorService,
  Ambassador,
  AmbassadorRequest,
} from "../../services/ambassadorService";
import { formatNumber, formatDate } from "../../utils/formatters";

const AmbassadorProfilePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { theme } = useTheme();

  const [ambassador, setAmbassador] = useState<Ambassador | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showRequestForm, setShowRequestForm] = useState(false);
  const [requestData, setRequestData] = useState({
    serviceType: "",
    startDate: "",
    endDate: "",
    startTime: "10:00",
    endTime: "12:00",
    notes: "",
  });

  useEffect(() => {
    if (id) {
      loadAmbassador();
    }
  }, [id]);

  const loadAmbassador = async () => {
    try {
      setLoading(true);
      const data = await ambassadorService.getAmbassadorById(parseInt(id!));
      setAmbassador(data);
    } catch (err) {
      setError(t("ambassador.errors.loadFailed"));
    } finally {
      setLoading(false);
    }
  };

  const handleRequestSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ambassador) return;

    try {
      const startDateTime = `${requestData.startDate}T${requestData.startTime}:00`;
      const endDateTime = `${requestData.endDate}T${requestData.endTime}:00`;

      const request = await ambassadorService.createRequest({
        ambassadorId: ambassador.id,
        serviceType: requestData.serviceType,
        startTime: startDateTime,
        endTime: endDateTime,
        notes: requestData.notes,
      });

      alert(t("ambassador.request.success"));
      setShowRequestForm(false);
      // navigate to requests page
      navigate("/my-ambassador-requests");
    } catch (err: any) {
      alert(err.message || t("ambassador.request.error"));
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error || !ambassador) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">😞</div>
          <h2 className="text-2xl font-bold mb-2">
            {t("ambassador.notFound")}
          </h2>
          <button
            onClick={() => navigate("/ambassadors")}
            className="mt-4 px-6 py-2 bg-blue-500 text-white rounded-lg"
          >
            {t("ambassador.backToList")}
          </button>
        </div>
      </div>
    );
  }

  const renderServiceList = () => {
    const services = [
      { key: "currency-exchange", icon: "💱" },
      { key: "local-tickets", icon: "🎫" },
      { key: "tour-guide", icon: "🏛️" },
      { key: "hotel-booking", icon: "🏨" },
      { key: "banking", icon: "🏦" },
      { key: "translation", icon: "🗣️" },
      { key: "transport", icon: "🚗" },
    ];

    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {services.map(
          (service) =>
            ambassador.services.includes(service.key) && (
              <div
                key={service.key}
                className={`p-4 rounded-lg text-center ${
                  theme === "dark" ? "bg-gray-800" : "bg-gray-100"
                }`}
              >
                <div className="text-2xl mb-2">{service.icon}</div>
                <div className="text-sm">
                  {t(`ambassador.services.${service.key}`)}
                </div>
              </div>
            )
        )}
      </div>
    );
  };

  const renderRatingStars = (rating: number) => {
    return (
      <div className="flex items-center">
        {[...Array(5)].map((_, i) => (
          <span
            key={i}
            className={`text-2xl ${
              i < Math.floor(rating) ? "text-yellow-500" : "text-gray-300"
            }`}
          >
            ★
          </span>
        ))}
        <span className="ml-2 text-lg font-semibold">{rating.toFixed(1)}</span>
      </div>
    );
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div
        className={`py-8 ${
          theme === "dark"
            ? "bg-gray-900"
            : "bg-gradient-to-r from-blue-50 to-purple-50"
        }`}
      >
        <div className="container mx-auto px-4">
          <button
            onClick={() => navigate("/ambassadors")}
            className={`mb-4 px-4 py-2 rounded-lg ${
              theme === "dark"
                ? "bg-gray-800 text-white"
                : "bg-white text-gray-800"
            }`}
          >
            ← {t("common.back")}
          </button>

          <div className="flex flex-col md:flex-row items-start md:items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-24 h-24 rounded-full bg-gradient-to-r from-blue-400 to-purple-500 flex items-center justify-center text-white text-3xl font-bold">
                {ambassador.user.firstName?.charAt(0)}
              </div>
              <div>
                <h1 className="text-3xl font-bold">
                  {ambassador.user.firstName} {ambassador.user.lastName}
                </h1>
                <div className="flex items-center space-x-2 mt-2">
                  <span
                    className={`px-3 py-1 rounded-full text-sm ${
                      theme === "dark"
                        ? "bg-green-900 text-green-300"
                        : "bg-green-100 text-green-800"
                    }`}
                  >
                    {ambassador.city}, {ambassador.country}
                  </span>
                  {ambassador.isVerified && (
                    <span
                      className={`px-3 py-1 rounded-full text-sm ${
                        theme === "dark"
                          ? "bg-blue-900 text-blue-300"
                          : "bg-blue-100 text-blue-800"
                      }`}
                    >
                      ✓ {t("ambassador.verified")}
                    </span>
                  )}
                  <span
                    className={`px-3 py-1 rounded-full text-sm ${
                      ambassador.isAvailable
                        ? theme === "dark"
                          ? "bg-green-900 text-green-300"
                          : "bg-green-100 text-green-800"
                        : theme === "dark"
                        ? "bg-red-900 text-red-300"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {ambassador.isAvailable
                      ? t("ambassador.available")
                      : t("ambassador.busy")}
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-4 md:mt-0 text-center md:text-right">
              <div className="text-4xl font-bold">
                {formatNumber(ambassador.hourlyRate)} {t("common.currency")}/h
              </div>
              <div className="mt-2">{renderRatingStars(ambassador.rating)}</div>
              <button
                onClick={() => setShowRequestForm(true)}
                disabled={!ambassador.isAvailable}
                className={`mt-4 px-8 py-3 rounded-lg font-semibold text-lg ${
                  ambassador.isAvailable
                    ? theme === "dark"
                      ? "bg-blue-600 hover:bg-blue-700 text-white"
                      : "bg-blue-500 hover:bg-blue-600 text-white"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
              >
                {t("ambassador.requestService")}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Info */}
          <div className="lg:col-span-2 space-y-8">
            {/* Bio */}
            <div
              className={`p-6 rounded-xl ${
                theme === "dark" ? "bg-gray-800" : "bg-white shadow"
              }`}
            >
              <h2 className="text-2xl font-bold mb-4">
                {t("ambassador.about")}
              </h2>
              <p className="leading-relaxed">
                {ambassador.bio || t("ambassador.noBio")}
              </p>
            </div>

            {/* Services */}
            <div
              className={`p-6 rounded-xl ${
                theme === "dark" ? "bg-gray-800" : "bg-white shadow"
              }`}
            >
              <h2 className="text-2xl font-bold mb-6">
                {t("ambassador.services.title")}
              </h2>
              {renderServiceList()}
            </div>

            {/* Stats */}
            <div
              className={`p-6 rounded-xl ${
                theme === "dark" ? "bg-gray-800" : "bg-white shadow"
              }`}
            >
              <h2 className="text-2xl font-bold mb-6">
                {t("ambassador.stats")}
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-3xl font-bold">
                    {ambassador.completedTasks}
                  </div>
                  <div className="text-sm mt-1">
                    {t("ambassador.completedTasks")}
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold">
                    {ambassador.responseTime || "--"}
                  </div>
                  <div className="text-sm mt-1">
                    {t("ambassador.responseTime")} (دقیقه)
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold">
                    {ambassador.languages.length}
                  </div>
                  <div className="text-sm mt-1">
                    {t("ambassador.languages")}
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold">
                    {ambassador.services.length}
                  </div>
                  <div className="text-sm mt-1">
                    {t("ambassador.services.title")}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Contact & Info */}
          <div className="space-y-6">
            {/* Contact */}
            <div
              className={`p-6 rounded-xl ${
                theme === "dark" ? "bg-gray-800" : "bg-white shadow"
              }`}
            >
              <h3 className="text-xl font-bold mb-4">
                {t("ambassador.contact")}
              </h3>
              {ambassador.whatsappNumber && (
                <a
                  href={`https://wa.me/${ambassador.whatsappNumber}`}
                  target="_blank"
                  className="flex items-center space-x-3 p-3 rounded-lg bg-green-100 text-green-800 mb-3"
                >
                  <span className="text-2xl">💬</span>
                  <span>WhatsApp</span>
                </a>
              )}
              {ambassador.telegramUsername && (
                <a
                  href={`https://t.me/${ambassador.telegramUsername}`}
                  target="_blank"
                  className="flex items-center space-x-3 p-3 rounded-lg bg-blue-100 text-blue-800"
                >
                  <span className="text-2xl">✈️</span>
                  <span>Telegram</span>
                </a>
              )}
            </div>

            {/* Languages */}
            <div
              className={`p-6 rounded-xl ${
                theme === "dark" ? "bg-gray-800" : "bg-white shadow"
              }`}
            >
              <h3 className="text-xl font-bold mb-4">
                {t("ambassador.languages")}
              </h3>
              <div className="flex flex-wrap gap-2">
                {ambassador.languages.map((lang) => {
                  const languageNames: Record<string, string> = {
                    fa: "فارسی",
                    en: "English",
                    ar: "العربیة",
                    tr: "Türkçe",
                  };
                  return (
                    <span
                      key={lang}
                      className={`px-3 py-1 rounded-full ${
                        theme === "dark"
                          ? "bg-purple-900 text-purple-300"
                          : "bg-purple-100 text-purple-800"
                      }`}
                    >
                      {languageNames[lang] || lang}
                    </span>
                  );
                })}
              </div>
            </div>

            {/* Certificates */}
            {ambassador.certificates.length > 0 && (
              <div
                className={`p-6 rounded-xl ${
                  theme === "dark" ? "bg-gray-800" : "bg-white shadow"
                }`}
              >
                <h3 className="text-xl font-bold mb-4">
                  {t("ambassador.certificates")}
                </h3>
                <ul className="space-y-2">
                  {ambassador.certificates.map((cert, index) => (
                    <li key={index} className="flex items-center">
                      <span className="mr-2">✓</span>
                      {cert}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Request Form Modal */}
      {showRequestForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div
            className={`rounded-xl w-full max-w-md ${
              theme === "dark" ? "bg-gray-800" : "bg-white"
            }`}
          >
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold">
                  {t("ambassador.request.title")}
                </h3>
                <button
                  onClick={() => setShowRequestForm(false)}
                  className="text-2xl"
                >
                  ×
                </button>
              </div>

              <form onSubmit={handleRequestSubmit}>
                <div className="space-y-4">
                  <div>
                    <label className="block mb-1">
                      {t("ambassador.request.serviceType")}
                    </label>
                    <select
                      value={requestData.serviceType}
                      onChange={(e) =>
                        setRequestData({
                          ...requestData,
                          serviceType: e.target.value,
                        })
                      }
                      className={`w-full p-2 rounded border ${
                        theme === "dark"
                          ? "bg-gray-700 border-gray-600"
                          : "bg-white border-gray-300"
                      }`}
                      required
                    >
                      <option value="">
                        {t("ambassador.request.selectService")}
                      </option>
                      {ambassador.services.map((service) => (
                        <option key={service} value={service}>
                          {t(`ambassador.services.${service}`)}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block mb-1">
                        {t("ambassador.request.startDate")}
                      </label>
                      <input
                        type="date"
                        value={requestData.startDate}
                        onChange={(e) =>
                          setRequestData({
                            ...requestData,
                            startDate: e.target.value,
                          })
                        }
                        className={`w-full p-2 rounded border ${
                          theme === "dark"
                            ? "bg-gray-700 border-gray-600"
                            : "bg-white border-gray-300"
                        }`}
                        required
                      />
                    </div>
                    <div>
                      <label className="block mb-1">
                        {t("ambassador.request.endDate")}
                      </label>
                      <input
                        type="date"
                        value={requestData.endDate}
                        onChange={(e) =>
                          setRequestData({
                            ...requestData,
                            endDate: e.target.value,
                          })
                        }
                        className={`w-full p-2 rounded border ${
                          theme === "dark"
                            ? "bg-gray-700 border-gray-600"
                            : "bg-white border-gray-300"
                        }`}
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block mb-1">
                        {t("ambassador.request.startTime")}
                      </label>
                      <input
                        type="time"
                        value={requestData.startTime}
                        onChange={(e) =>
                          setRequestData({
                            ...requestData,
                            startTime: e.target.value,
                          })
                        }
                        className={`w-full p-2 rounded border ${
                          theme === "dark"
                            ? "bg-gray-700 border-gray-600"
                            : "bg-white border-gray-300"
                        }`}
                        required
                      />
                    </div>
                    <div>
                      <label className="block mb-1">
                        {t("ambassador.request.endTime")}
                      </label>
                      <input
                        type="time"
                        value={requestData.endTime}
                        onChange={(e) =>
                          setRequestData({
                            ...requestData,
                            endTime: e.target.value,
                          })
                        }
                        className={`w-full p-2 rounded border ${
                          theme === "dark"
                            ? "bg-gray-700 border-gray-600"
                            : "bg-white border-gray-300"
                        }`}
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block mb-1">
                      {t("ambassador.request.notes")}
                    </label>
                    <textarea
                      value={requestData.notes}
                      onChange={(e) =>
                        setRequestData({
                          ...requestData,
                          notes: e.target.value,
                        })
                      }
                      className={`w-full p-2 rounded border ${
                        theme === "dark"
                          ? "bg-gray-700 border-gray-600"
                          : "bg-white border-gray-300"
                      }`}
                      rows={3}
                      placeholder={t("ambassador.request.notesPlaceholder")}
                    />
                  </div>

                  <div
                    className={`p-4 rounded-lg ${
                      theme === "dark" ? "bg-gray-700" : "bg-blue-50"
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <span>{t("ambassador.request.estimatedCost")}</span>
                      <span className="text-xl font-bold">
                        {formatNumber(ambassador.hourlyRate * 2)}{" "}
                        {t("common.currency")}
                      </span>
                    </div>
                    <p className="text-sm mt-2">
                      {t("ambassador.request.costNote")}
                    </p>
                  </div>

                  <div className="flex space-x-3">
                    <button
                      type="button"
                      onClick={() => setShowRequestForm(false)}
                      className={`flex-1 py-3 rounded-lg ${
                        theme === "dark"
                          ? "bg-gray-700 hover:bg-gray-600"
                          : "bg-gray-200 hover:bg-gray-300"
                      }`}
                    >
                      {t("common.cancel")}
                    </button>
                    <button
                      type="submit"
                      className="flex-1 py-3 rounded-lg bg-blue-500 text-white hover:bg-blue-600"
                    >
                      {t("ambassador.request.submit")}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AmbassadorProfilePage;
