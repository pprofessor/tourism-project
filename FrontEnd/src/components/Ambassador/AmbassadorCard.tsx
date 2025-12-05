import React from "react";
import { useTranslation } from "react-i18next";
import { useTheme } from "../../context/ThemeContext";
import { Ambassador } from "../../services/ambassadorService";
import { formatNumber } from "../../utils/formatters";

interface AmbassadorCardProps {
  ambassador: Ambassador;
  onClick?: () => void;
  compact?: boolean;
}

const AmbassadorCard: React.FC<AmbassadorCardProps> = ({
  ambassador,
  onClick,
  compact = false,
}) => {
  const { t } = useTranslation(["ambassador", "common"]);
  const { theme } = useTheme();

  const cardClasses = `
    rounded-xl shadow-lg transition-all duration-300 hover:shadow-xl 
    ${
      theme === "dark"
        ? "bg-gray-800 border-gray-700 hover:border-gray-600"
        : "bg-white border-gray-200 hover:border-gray-300"
    }
    border cursor-pointer overflow-hidden
    ${compact ? "p-4" : "p-6"}
  `;

  const badgeClasses = (type: "verified" | "available" | "busy") => {
    const base = "px-2 py-1 rounded-full text-xs font-semibold";

    if (theme === "dark") {
      switch (type) {
        case "verified":
          return `${base} bg-green-900 text-green-300`;
        case "available":
          return `${base} bg-blue-900 text-blue-300`;
        case "busy":
          return `${base} bg-red-900 text-red-300`;
      }
    } else {
      switch (type) {
        case "verified":
          return `${base} bg-green-100 text-green-800`;
        case "available":
          return `${base} bg-blue-100 text-blue-800`;
        case "busy":
          return `${base} bg-red-100 text-red-800`;
      }
    }
  };

  const renderRatingStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 1; i <= 5; i++) {
      if (i <= fullStars) {
        stars.push(
          <span key={i} className="text-yellow-500">
            ★
          </span>
        );
      } else if (i === fullStars + 1 && hasHalfStar) {
        stars.push(
          <span key={i} className="text-yellow-500">
            ★
          </span>
        );
      } else {
        stars.push(
          <span
            key={i}
            className={theme === "dark" ? "text-gray-600" : "text-gray-300"}
          >
            ★
          </span>
        );
      }
    }

    return (
      <div className="flex items-center space-x-1">
        {stars}
        <span
          className={`text-sm ${
            theme === "dark" ? "text-gray-400" : "text-gray-600"
          }`}
        >
          ({rating.toFixed(1)})
        </span>
      </div>
    );
  };

  const renderServiceBadges = (services: string[]) => {
    const serviceTranslations: Record<string, string> = {
      "currency-exchange": t("ambassador.services.currencyExchange"),
      "local-tickets": t("ambassador.services.localTickets"),
      "tour-guide": t("ambassador.services.tourGuide"),
      "hotel-booking": t("ambassador.services.hotelBooking"),
      banking: t("ambassador.services.banking"),
      translation: t("ambassador.services.translation"),
      transport: t("ambassador.services.transport"),
    };

    return (
      <div className="flex flex-wrap gap-1 mt-2">
        {services.slice(0, 3).map((service, index) => (
          <span
            key={index}
            className={`px-2 py-1 rounded-full text-xs ${
              theme === "dark"
                ? "bg-gray-700 text-gray-300"
                : "bg-gray-100 text-gray-700"
            }`}
          >
            {serviceTranslations[service] || service}
          </span>
        ))}
        {services.length > 3 && (
          <span
            className={`text-xs ${
              theme === "dark" ? "text-gray-500" : "text-gray-400"
            }`}
          >
            +{services.length - 3} {t("common.more")}
          </span>
        )}
      </div>
    );
  };

  const renderLanguageBadges = (languages: string[]) => {
    const languageNames: Record<string, string> = {
      fa: "فارسی",
      en: "English",
      ar: "العربیة",
      tr: "Türkçe",
    };

    return (
      <div className="flex flex-wrap gap-1">
        {languages.map((lang, index) => (
          <span
            key={index}
            className={`px-2 py-1 rounded text-xs ${
              theme === "dark"
                ? "bg-purple-900 text-purple-300"
                : "bg-purple-100 text-purple-800"
            }`}
          >
            {languageNames[lang] || lang}
          </span>
        ))}
      </div>
    );
  };

  if (compact) {
    return (
      <div className={cardClasses} onClick={onClick}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {/* Avatar */}
            <div className="relative">
              <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-400 to-purple-500 flex items-center justify-center text-white font-bold">
                {ambassador.user.firstName?.charAt(0) || "A"}
              </div>
              {ambassador.isVerified && (
                <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs">✓</span>
                </div>
              )}
            </div>

            {/* Info */}
            <div>
              <h3
                className={`font-semibold ${
                  theme === "dark" ? "text-white" : "text-gray-800"
                }`}
              >
                {ambassador.user.firstName} {ambassador.user.lastName}
              </h3>
              <p
                className={`text-sm ${
                  theme === "dark" ? "text-gray-400" : "text-gray-600"
                }`}
              >
                {ambassador.city}, {ambassador.country}
              </p>
            </div>
          </div>

          <div className="text-right">
            <div className="font-bold text-lg">
              {formatNumber(ambassador.hourlyRate || 0)} {t("common.currency")}
              /h
            </div>
            <div className="flex items-center justify-end mt-1">
              {renderRatingStars(ambassador.rating || 0)}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={cardClasses} onClick={onClick}>
      <div className="flex flex-col md:flex-row md:items-start space-y-4 md:space-y-0 md:space-x-4">
        {/* Left Column - Avatar & Basic Info */}
        <div className="flex-shrink-0">
          <div className="relative">
            <div className="w-20 h-20 rounded-full bg-gradient-to-r from-blue-400 to-purple-500 flex items-center justify-center text-white text-2xl font-bold">
              {ambassador.user.firstName?.charAt(0) || "A"}
            </div>

            {/* Badges */}
            <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-1">
              {ambassador.isVerified && (
                <div className={badgeClasses("verified")}>
                  {t("ambassador.verified")}
                </div>
              )}
              <div
                className={badgeClasses(
                  ambassador.isAvailable ? "available" : "busy"
                )}
              >
                {ambassador.isAvailable
                  ? t("ambassador.available")
                  : t("ambassador.busy")}
              </div>
            </div>
          </div>
        </div>

        {/* Middle Column - Details */}
        <div className="flex-1">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between">
            <div>
              <h3
                className={`text-xl font-bold ${
                  theme === "dark" ? "text-white" : "text-gray-800"
                }`}
              >
                {ambassador.user.firstName} {ambassador.user.lastName}
              </h3>
              <p
                className={`text-lg ${
                  theme === "dark" ? "text-gray-300" : "text-gray-600"
                }`}
              >
                {ambassador.city}, {ambassador.country}
              </p>

              {/* Rating */}
              <div className="mt-2">
                {renderRatingStars(ambassador.rating || 0)}
                <span
                  className={`text-sm ml-2 ${
                    theme === "dark" ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  ({ambassador.completedTasks} {t("ambassador.completedTasks")})
                </span>
              </div>
            </div>

            {/* Price */}
            <div className="mt-2 md:mt-0">
              <div
                className={`text-2xl font-bold ${
                  theme === "dark" ? "text-white" : "text-gray-800"
                }`}
              >
                {formatNumber(ambassador.hourlyRate || 0)}{" "}
                {t("common.currency")}/h
              </div>
              <p
                className={`text-sm ${
                  theme === "dark" ? "text-gray-400" : "text-gray-600"
                }`}
              >
                {t("ambassador.hourlyRate")}
              </p>
            </div>
          </div>

          {/* Bio */}
          {ambassador.bio && (
            <p
              className={`mt-3 line-clamp-2 ${
                theme === "dark" ? "text-gray-300" : "text-gray-700"
              }`}
            >
              {ambassador.bio}
            </p>
          )}

          {/* Services */}
          <div className="mt-3">
            <h4
              className={`font-semibold mb-1 ${
                theme === "dark" ? "text-gray-300" : "text-gray-700"
              }`}
            >
              {t("ambassador.services.title")}:
            </h4>
            {renderServiceBadges(ambassador.services || [])}
          </div>

          {/* Languages */}
          <div className="mt-3">
            <h4
              className={`font-semibold mb-1 ${
                theme === "dark" ? "text-gray-300" : "text-gray-700"
              }`}
            >
              {t("ambassador.languages")}:
            </h4>
            {renderLanguageBadges(ambassador.languages || [])}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div
        className={`mt-4 pt-4 border-t ${
          theme === "dark" ? "border-gray-700" : "border-gray-200"
        }`}
      >
        <div className="flex justify-between items-center">
          <div
            className={`text-sm ${
              theme === "dark" ? "text-gray-400" : "text-gray-600"
            }`}
          >
            {t("ambassador.responseTime")}: {ambassador.responseTime || "--"}{" "}
            {t("common.minutes")}
          </div>
          <button
            className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
              theme === "dark"
                ? "bg-blue-600 hover:bg-blue-700 text-white"
                : "bg-blue-500 hover:bg-blue-600 text-white"
            }`}
          >
            {t("ambassador.requestService")}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AmbassadorCard;
