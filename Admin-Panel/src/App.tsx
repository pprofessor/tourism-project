import React from 'react';
import { Admin, Resource, CustomRoutes } from 'react-admin';
import { Route } from 'react-router-dom';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { faIR } from '@mui/material/locale';
import CssBaseline from '@mui/material/CssBaseline';

import { AuthProvider } from './contexts/AuthContext';
import Login from './Login';
import Dashboard from './Dashboard';
import MyLayout from './components/Layout/MyLayout';
import { dataProvider } from './dataProvider';

// کامپوننت‌های مدیریت
import DatabaseManager from './components/DatabaseManager/DatabaseManager';
import SliderManagement from './components/DatabaseManager/SliderManagement';
import MediaManager from './components/DatabaseManager/MediaManager';
import PaymentGatewayManagement from './components/DatabaseManager/PaymentGatewayManagement';
import HotelManagement from './components/DatabaseManager/HotelManagement';
import UserManagement from './components/DatabaseManager/UserManagement';

// Layoutهای ساده
const SimpleLayout = ({ children }: { children: React.ReactNode }) => (
  <div style={{ padding: '20px', backgroundColor: '#f8fafc', minHeight: '100vh' }}>
    {children}
  </div>
);

const DatabaseManagerWithSimpleLayout = () => (
  <SimpleLayout>
    <DatabaseManager />
  </SimpleLayout>
);

const SliderManagementWithSimpleLayout = () => (
  <SimpleLayout>
    <SliderManagement />
  </SimpleLayout>
);

const MediaManagerWithSimpleLayout = () => (
  <SimpleLayout>
    <MediaManager />
  </SimpleLayout>
);

const PaymentGatewayManagementWithSimpleLayout = () => (
  <SimpleLayout>
    <PaymentGatewayManagement />
  </SimpleLayout>
);

// تم مدرن برای پنل ادمین
const adminTheme = createTheme({
  direction: 'rtl',
  palette: {
    mode: 'light',
    primary: {
      main: '#2563eb',
      light: '#3b82f6',
      dark: '#1d4ed8',
    },
    secondary: {
      main: '#7c3aed',
    },
    background: {
      default: '#f8fafc',
      paper: '#ffffff',
    },
  },
  typography: {
    fontFamily: '"Vazirmatn", "Tahoma", sans-serif',
    h4: {
      fontWeight: 700,
      fontSize: '1.75rem',
    },
    h6: {
      fontWeight: 600,
    },
    button: {
      fontWeight: 500,
      textTransform: 'none',
    },
  },
  shape: {
    borderRadius: 8,
  },
}, faIR);

const queryClient = new QueryClient();

function App() {
  const token = localStorage.getItem('token');

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
            <CustomRoutes>
              <Route path="/database-manager" element={<DatabaseManagerWithSimpleLayout />} />
              <Route path="/slider-management" element={<SliderManagementWithSimpleLayout />} />
              <Route path="/media-management" element={<MediaManagerWithSimpleLayout />} />
              <Route path="/payment-gateways" element={<PaymentGatewayManagementWithSimpleLayout />} />
            </CustomRoutes>
            <Resource name="hotels" list={HotelManagement} />
            <Resource name="users" list={UserManagement} />
          </Admin>
        </QueryClientProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;