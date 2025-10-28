import React, { useState, useMemo } from 'react';
import { 
  Box, 
  Tabs, 
  Tab, 
  Paper,
  useTheme,
  useMediaQuery
} from '@mui/material';
import HotelManagement from './HotelManagement';
import UserManagement from './UserManagement';
import DataExport from './DataExport';
import { Hotel, People, Backup } from '@mui/icons-material';
import TerminalIcon from '@mui/icons-material/Terminal';
import DatabaseTerminal from './DatabaseTerminal';
import PaymentIcon from '@mui/icons-material/Payment';
import PaymentGatewayManagement from './PaymentGatewayManagement';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel: React.FC<TabPanelProps> = ({ children, value, index, ...other }) => (
  <div
    role="tabpanel"
    hidden={value !== index}
    id={`database-tabpanel-${index}`}
    aria-labelledby={`database-tab-${index}`}
    {...other}
  >
    {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
  </div>
);

const DatabaseManager: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [activeTab, setActiveTab] = useState(0);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const tabs = useMemo(() => [
  {
  label: 'درگاه‌های پرداخت',
  icon: <PaymentIcon />,
  component: <PaymentGatewayManagement />
},
  {
  label: 'ترمینال دیتابیس',
  icon: <TerminalIcon />,
  component: <DatabaseTerminal />
},
        {
      label: 'مدیریت هتل‌ها',
      icon: <Hotel />,
      component: <HotelManagement />
    },
    {
      label: 'مدیریت کاربران',
      icon: <People />,
      component: <UserManagement />
    },
    {
      label: 'خروجی داده‌ها',
      icon: <Backup />,
      component: <DataExport />
    }
  ], []);

  return (
    <Paper 
      elevation={0}
      sx={{
        borderRadius: 2,
        border: `1px solid ${theme.palette.divider}`,
        overflow: 'hidden',
        background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)'
      }}
    >
      {/* Header */}
      <Box
        sx={{
          background: `linear-gradient(135deg, ${theme.palette.primary.main}15, ${theme.palette.primary.main}25)`,
          borderBottom: `1px solid ${theme.palette.divider}`,
          p: 3
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
          <Backup sx={{ color: theme.palette.primary.main, fontSize: 32 }} />
          <Box>
            <h1 className="text-2xl font-bold text-gray-900">
              مدیریت پایگاه داده
            </h1>
            <p className="text-gray-600 mt-1">
              مدیریت جامع داده‌های سیستم توریسم
            </p>
          </Box>
        </Box>
      </Box>

      {/* Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', px: 3 }}>
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          variant={isMobile ? "scrollable" : "standard"}
          scrollButtons={isMobile ? "auto" : false}
          allowScrollButtonsMobile
          sx={{
            '& .MuiTab-root': {
              minHeight: 64,
              fontSize: '0.875rem',
              fontWeight: 600,
              textTransform: 'none',
              '&.Mui-selected': {
                color: theme.palette.primary.main,
              }
            }
          }}
        >
          {tabs.map((tab, index) => (
            <Tab
              key={index}
              icon={tab.icon}
              iconPosition="start"
              label={tab.label}
              id={`database-tab-${index}`}
              aria-controls={`database-tabpanel-${index}`}
            />
          ))}
        </Tabs>
      </Box>

      {/* Tab Content */}
      <Box sx={{ px: 3 }}>
        {tabs.map((tab, index) => (
          <TabPanel key={index} value={activeTab} index={index}>
            {tab.component}
          </TabPanel>
        ))}
      </Box>

      {/* Quick Stats Footer */}
      <Box
        sx={{
          background: theme.palette.grey[50],
          borderTop: `1px solid ${theme.palette.divider}`,
          p: 2,
          display: 'flex',
          justifyContent: 'space-around',
          flexWrap: 'wrap',
          gap: 2
        }}
      >
        <Box sx={{ textAlign: 'center' }}>
          <div className="text-sm text-gray-500">داده‌های فعال</div>
          <div className="font-semibold text-gray-900">4 بخش</div>
        </Box>
        <Box sx={{ textAlign: 'center' }}>
          <div className="text-sm text-gray-500">آخرین بروزرسانی</div>
          <div className="font-semibold text-gray-900">هم‌اکنون</div>
        </Box>
        <Box sx={{ textAlign: 'center' }}>
          <div className="text-sm text-gray-500">وضعیت</div>
          <div className="font-semibold text-green-600">فعال</div>
        </Box>
      </Box>
    </Paper>
  );
};

export default DatabaseManager;