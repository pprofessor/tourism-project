import React from "react";
import { Admin, Resource, CustomRoutes } from "react-admin";
import { Route } from "react-router-dom";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { faIR } from "@mui/material/locale";
import CssBaseline from "@mui/material/CssBaseline";

import { AuthProvider } from "./contexts/AuthContext";
import Login from "./Login";
import Dashboard from "./Dashboard";
import MyLayout from "./components/Layout/MyLayout";
import { dataProvider } from "./dataProvider";

// ============ کامپوننت‌های مدیریت اصلی ============
import DatabaseManager from "./components/DatabaseManager/DatabaseManager";
import SliderManagement from "./components/DatabaseManager/SliderManagement";
import MediaManager from "./components/DatabaseManager/MediaManager";
import PaymentGatewayManagement from "./components/DatabaseManager/PaymentGatewayManagement";
import HotelManagement from "./components/DatabaseManager/HotelManagement";
import UserManagement from "./components/DatabaseManager/UserManagement";

// ============ کامپوننت‌های مدیریت سفیران ============
// فقط AmbassadorManagement را import می‌کنیم، بقیه توسط آن مدیریت می‌شوند
import AmbassadorManagement from "./components/pages/AmbassadorManagement";

// ============ Layoutهای ساده برای صفحات مدیریت ============

/**
 * کامپوننت Layout ساده برای صفحاتی که نیازی به منوی کامل ندارند
 */
const SimpleLayout = ({ children }: { children: React.ReactNode }) => (
  <div
    style={{ padding: "20px", backgroundColor: "#f8fafc", minHeight: "100vh" }}
  >
    {children}
  </div>
);

/**
 * Wrapper برای DatabaseManager با Layout ساده
 */
const DatabaseManagerWithSimpleLayout = () => (
  <SimpleLayout>
    <DatabaseManager />
  </SimpleLayout>
);

/**
 * Wrapper برای SliderManagement با Layout ساده
 */
const SliderManagementWithSimpleLayout = () => (
  <SimpleLayout>
    <SliderManagement />
  </SimpleLayout>
);

/**
 * Wrapper برای MediaManager با Layout ساده
 */
const MediaManagerWithSimpleLayout = () => (
  <SimpleLayout>
    <MediaManager />
  </SimpleLayout>
);

/**
 * Wrapper برای PaymentGatewayManagement با Layout ساده
 */
const PaymentGatewayManagementWithSimpleLayout = () => (
  <SimpleLayout>
    <PaymentGatewayManagement />
  </SimpleLayout>
);

/**
 * Wrapper برای AmbassadorManagement با Layout ساده
 */
const AmbassadorManagementWithSimpleLayout = () => (
  <SimpleLayout>
    <AmbassadorManagement />
  </SimpleLayout>
);

// ============ تم مدرن برای پنل ادمین ============

/**
 * تم سفارشی برای پنل ادمین با پشتیبانی از RTL
 */
const adminTheme = createTheme(
  {
    direction: "rtl",
    palette: {
      mode: "light",
      primary: {
        main: "#2563eb",
        light: "#3b82f6",
        dark: "#1d4ed8",
      },
      secondary: {
        main: "#7c3aed",
      },
      background: {
        default: "#f8fafc",
        paper: "#ffffff",
      },
    },
    typography: {
      fontFamily: '"Vazirmatn", "Tahoma", sans-serif',
      h4: {
        fontWeight: 700,
        fontSize: "1.75rem",
      },
      h6: {
        fontWeight: 600,
      },
      button: {
        fontWeight: 500,
        textTransform: "none",
      },
    },
    shape: {
      borderRadius: 8,
    },
  },
  faIR
);

// ============ Query Client برای React Query ============

const queryClient = new QueryClient();

// ============ کامپوننت اصلی App ============

function App() {
  const token = localStorage.getItem("token");

  // اگر کاربر لاگین نکرده باشد، صفحه Login نمایش داده می‌شود
  if (!token) {
    return <Login />;
  }

  return (
    <ThemeProvider theme={adminTheme}>
      <CssBaseline />
      <AuthProvider>
        <QueryClientProvider client={queryClient}>
          <Admin
            dashboard={Dashboard}
            dataProvider={dataProvider}
            layout={MyLayout}
            disableTelemetry
          >
            {/* ============ Custom Routes برای صفحات مدیریت ============ */}
            <CustomRoutes>
              {/* مسیرهای مدیریت سیستم */}
              <Route
                path="/database-manager"
                element={<DatabaseManagerWithSimpleLayout />}
              />
              <Route
                path="/slider-management"
                element={<SliderManagementWithSimpleLayout />}
              />
              <Route
                path="/media-management"
                element={<MediaManagerWithSimpleLayout />}
              />
              <Route
                path="/payment-gateways"
                element={<PaymentGatewayManagementWithSimpleLayout />}
              />

              {/* ============ مسیرهای مدیریت سفیران ============ */}

              {/* صفحه اصلی مدیریت سفیران (تمام تب‌ها در این صفحه هستند) */}
              <Route
                path="/ambassadors"
                element={<AmbassadorManagementWithSimpleLayout />}
              />

              {/* صفحه درخواست‌های جدید سفیران - با صفحه اصلی یکسان است */}
              <Route
                path="/ambassador-requests"
                element={<AmbassadorManagementWithSimpleLayout />}
              />

              {/* صفحه آمار و گزارشات سفیران - با صفحه اصلی یکسان است */}
              <Route
                path="/ambassador-analytics"
                element={<AmbassadorManagementWithSimpleLayout />}
              />

              {/* صفحه ارسال پیام به سفیران - با صفحه اصلی یکسان است */}
              <Route
                path="/ambassador-messaging"
                element={<AmbassadorManagementWithSimpleLayout />}
              />
            </CustomRoutes>

            {/* ============ Resources برای صفحات لیست با React-Admin ============ */}
            <Resource name="hotels" list={HotelManagement} />
            <Resource name="users" list={UserManagement} />
          </Admin>
        </QueryClientProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;