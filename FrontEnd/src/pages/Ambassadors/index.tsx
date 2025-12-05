import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useTheme } from "../../context/ThemeContext";
import AmbassadorCard from "../../components/Ambassador/AmbassadorCard";
import {
  ambassadorService,
  Ambassador,
  SearchParams,
} from "../../services/ambassadorService";

const AmbassadorsPage: React.FC = () => {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const [ambassadors, setAmbassadors] = useState<Ambassador[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [filters, setFilters] = useState<SearchParams>({
    city: "",
    minRating: 4.0,
  });

  useEffect(() => {
    loadAmbassadors();
  }, [filters]);

  const loadAmbassadors = async () => {
    try {
      setLoading(true);
      const data = await ambassadorService.getAmbassadors(filters);
      setAmbassadors(data);
      setError(null);
    } catch (err) {
      setError(t("ambassador.errors.loadFailed"));
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key: keyof SearchParams, value: any) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">
            {t("common.loading")}...
          </p>
        </div>
      </div>
    );
  }

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
          <h1 className="text-3xl md:text-4xl font-bold text-center mb-4">
            {t("ambassador.title")}
          </h1>
          <p
            className={`text-center max-w-2xl mx-auto ${
              theme === "dark" ? "text-gray-300" : "text-gray-600"
            }`}
          >
            {t("ambassador.subtitle")}
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="container mx-auto px-4 py-6">
        <div
          className={`p-4 rounded-lg ${
            theme === "dark" ? "bg-gray-800" : "bg-white"
          } shadow-md`}
        >
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label
                className={`block text-sm font-medium mb-1 ${
                  theme === "dark" ? "text-gray-300" : "text-gray-700"
                }`}
              >
                {t("ambassador.filters.city")}
              </label>
              <input
                type="text"
                value={filters.city || ""}
                onChange={(e) => handleFilterChange("city", e.target.value)}
                className={`w-full px-3 py-2 rounded-lg border ${
                  theme === "dark"
                    ? "bg-gray-700 border-gray-600 text-white"
                    : "bg-white border-gray-300 text-gray-800"
                }`}
                placeholder={t("ambassador.filters.cityPlaceholder")}
              />
            </div>

            <div>
              <label
                className={`block text-sm font-medium mb-1 ${
                  theme === "dark" ? "text-gray-300" : "text-gray-700"
                }`}
              >
                {t("ambassador.filters.minRating")}
              </label>
              <select
                value={filters.minRating || ""}
                onChange={(e) =>
                  handleFilterChange(
                    "minRating",
                    e.target.value ? parseFloat(e.target.value) : undefined
                  )
                }
                className={`w-full px-3 py-2 rounded-lg border ${
                  theme === "dark"
                    ? "bg-gray-700 border-gray-600 text-white"
                    : "bg-white border-gray-300 text-gray-800"
                }`}
              >
                <option value="">{t("common.any")}</option>
                <option value="4.5">4.5+ ★</option>
                <option value="4.0">4.0+ ★</option>
                <option value="3.5">3.5+ ★</option>
                <option value="3.0">3.0+ ★</option>
              </select>
            </div>

            <div>
              <label
                className={`block text-sm font-medium mb-1 ${
                  theme === "dark" ? "text-gray-300" : "text-gray-700"
                }`}
              >
                {t("ambassador.filters.maxPrice")}
              </label>
              <input
                type="number"
                value={filters.maxRate || ""}
                onChange={(e) =>
                  handleFilterChange(
                    "maxRate",
                    e.target.value ? parseFloat(e.target.value) : undefined
                  )
                }
                className={`w-full px-3 py-2 rounded-lg border ${
                  theme === "dark"
                    ? "bg-gray-700 border-gray-600 text-white"
                    : "bg-white border-gray-300 text-gray-800"
                }`}
                placeholder={t("ambassador.filters.pricePlaceholder")}
              />
            </div>

            <div className="flex items-end">
              <button
                onClick={loadAmbassadors}
                className={`w-full py-2 rounded-lg font-semibold ${
                  theme === "dark"
                    ? "bg-blue-600 hover:bg-blue-700 text-white"
                    : "bg-blue-500 hover:bg-blue-600 text-white"
                }`}
              >
                {t("ambassador.filters.apply")}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="container mx-auto px-4 pb-12">
        {error && (
          <div
            className={`p-4 rounded-lg mb-6 ${
              theme === "dark"
                ? "bg-red-900 text-red-200"
                : "bg-red-100 text-red-800"
            }`}
          >
            {error}
          </div>
        )}

        {ambassadors.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🏙️</div>
            <h3
              className={`text-xl font-semibold mb-2 ${
                theme === "dark" ? "text-gray-300" : "text-gray-700"
              }`}
            >
              {t("ambassador.noResults.title")}
            </h3>
            <p className={theme === "dark" ? "text-gray-400" : "text-gray-600"}>
              {t("ambassador.noResults.description")}
            </p>
          </div>
        ) : (
          <>
            <div className="mb-6 flex justify-between items-center">
              <h2
                className={`text-xl font-semibold ${
                  theme === "dark" ? "text-gray-300" : "text-gray-700"
                }`}
              >
                {t("ambassador.resultsCount", { count: ambassadors.length })}
              </h2>
              <div
                className={`text-sm ${
                  theme === "dark" ? "text-gray-400" : "text-gray-600"
                }`}
              >
                {t("ambassador.sortBy")}:
                <select
                  className={`ml-2 px-2 py-1 rounded ${
                    theme === "dark"
                      ? "bg-gray-700 text-white"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  <option>{t("ambassador.sort.rating")}</option>
                  <option>{t("ambassador.sort.priceLow")}</option>
                  <option>{t("ambassador.sort.priceHigh")}</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {ambassadors.map((ambassador) => (
                <AmbassadorCard
                  key={ambassador.id}
                  ambassador={ambassador}
                  onClick={() => {
                    // Navigate to ambassador detail page
                    window.location.href = `/ambassadors/${ambassador.id}`;
                  }}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AmbassadorsPage;
