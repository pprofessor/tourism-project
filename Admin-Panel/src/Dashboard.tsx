import React, { useState, useEffect, useMemo } from 'react';
import { 
  Card, 
  CardContent, 
  Typography, 
  Button, 
  Box,
  CircularProgress,
  useTheme
} from '@mui/material';
import { Link } from 'react-router-dom';
import { 
  Hotel, 
  People, 
  Storage, 
  BarChart,
  TrendingUp,
  Security,
  Slideshow,
  Folder,
  Payment
} from '@mui/icons-material';

interface StatsCardProps {
  title: string;
  value: string | number;
  description: string;
  icon: React.ReactNode;
  color: string;
  to?: string;
}

const StatsCard: React.FC<StatsCardProps> = ({ 
  title, 
  value, 
  description, 
  icon, 
  color,
  to 
}) => (
  <Card 
    sx={{ 
      height: '100%',
      background: `linear-gradient(135deg, ${color}20, ${color}40)`,
      border: `1px solid ${color}30`,
      transition: 'all 0.3s ease-in-out',
      '&:hover': {
        transform: 'translateY(-4px)',
        boxShadow: `0 8px 25px ${color}40`
      }
    }}
  >
    <CardContent sx={{ p: 3, position: 'relative' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
        <Box>
          <Typography variant="h4" component="div" fontWeight="bold" color={color}>
            {value}
          </Typography>
          <Typography variant="h6" component="h2" gutterBottom fontWeight="600">
            {title}
          </Typography>
        </Box>
        <Box sx={{ color: color, fontSize: 40 }}>
          {icon}
        </Box>
      </Box>
      
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2, lineHeight: 1.6 }}>
        {description}
      </Typography>
      
      {to && (
        <Button 
          component={Link}
          to={to}
          variant="outlined"
          size="small"
          sx={{ 
            borderColor: color,
            color: color,
            '&:hover': {
              backgroundColor: `${color}20`,
              borderColor: color
            }
          }}
        >
          مدیریت
        </Button>
      )}
    </CardContent>
  </Card>
);

const Dashboard: React.FC = () => {
  const theme = useTheme();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalHotels: 0,
    totalBookings: 0,
    revenue: 0
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      setStats({
        totalUsers: 1247,
        totalHotels: 89,
        totalBookings: 356,
        revenue: 12456000
      });
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const statsCards = useMemo(() => [
    {
      title: 'کاربران',
      value: loading ? '...' : stats.totalUsers.toLocaleString(),
      description: 'تعداد کل کاربران ثبت‌نام شده',
      icon: <People fontSize="inherit" />,
      color: theme.palette.primary.main,
      to: '/users'
    },
    {
      title: 'هتل‌ها',
      value: loading ? '...' : stats.totalHotels.toLocaleString(),
      description: 'تعداد هتل‌های فعال در سیستم',
      icon: <Hotel fontSize="inherit" />,
      color: theme.palette.success.main,
      to: '/hotels'
    },
    {
      title: 'رزروها',
      value: loading ? '...' : stats.totalBookings.toLocaleString(),
      description: 'تعداد رزروهای انجام شده',
      icon: <BarChart fontSize="inherit" />,
      color: theme.palette.info.main,
      to: '/bookings'
    },
    {
      title: 'درآمد',
      value: loading ? '...' : `$${(stats.revenue / 1000000).toFixed(1)}M`,
      description: 'درآمد کل سیستم',
      icon: <TrendingUp fontSize="inherit" />,
      color: theme.palette.warning.main
    }
  ], [stats, loading, theme]);

  const quickActions = [
    {
      title: 'اسلایدشو',
      description: 'مدیریت اسلایدهای صفحه اصلی',
      icon: <Slideshow sx={{ fontSize: 48 }} />,
      to: '/slider-management',
      color: theme.palette.primary.main
    },
    {
      title: 'مدیریت دیتابیس',
      description: 'مدیریت پیشرفته داده‌ها',
      icon: <Storage sx={{ fontSize: 48 }} />,
      to: '/database-manager',
      color: theme.palette.secondary.main
    },
    {
      title: 'گزارش‌های امنیتی',
      description: 'بررسی لاگ‌های سیستم',
      icon: <Security sx={{ fontSize: 48 }} />,
      to: '/security',
      color: theme.palette.error.main
    },
     {
    title: 'مدیریت رسانه',
    description: 'مدیریت فایل‌های رسانه‌ای',
    icon: <Folder sx={{ fontSize: 48 }} />,
    to: '/media-management',
    color: theme.palette.info.main
  },
  {
    title: 'درگاه‌های پرداخت',
    description: 'مدیریت درگاه‌های پرداخت',
    icon: <Payment sx={{ fontSize: 48 }} />,
    to: '/payment-gateways',
    color: theme.palette.success.main
  }
  ];

  if (loading) {
    return (
      <Box 
        display="flex" 
        justifyContent="center" 
        alignItems="center" 
        minHeight="60vh"
      >
        <CircularProgress size={60} />
      </Box>
    );
  }

  return (
    <Box sx={{ p: { xs: 2, sm: 3, md: 4 } }}>
      <Box sx={{ mb: 6 }}>
        <Typography 
          variant="h3" 
          component="h1"
          gutterBottom
          fontWeight="700"
          color="primary.main"
        >
          داشبورد مدیریت
        </Typography>
        <Typography variant="h6" color="text.secondary">
          خوش آمدید! وضعیت سیستم را در یک نگاه مشاهده کنید.
        </Typography>
      </Box>

      {/* آمار */}
      <Box sx={{ 
        display: 'grid',
        gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', lg: '1fr 1fr 1fr 1fr' },
        gap: 3,
        mb: 6
      }}>
        {statsCards.map((card, index) => (
          <Box key={index}>
            <StatsCard {...card} />
          </Box>
        ))}
      </Box>

      {/* اقدامات سریع - آیکن‌های بزرگ بدون کارت */}
      <Box sx={{ mb: 6 }}>
        <Typography variant="h5" component="h2" gutterBottom fontWeight="600" sx={{ mb: 3 }}>
          اقدامات سریع
        </Typography>
        <Box sx={{ 
          display: 'flex',
          gap: 3,
          flexWrap: 'wrap'
        }}>
          {quickActions.map((action, index) => (
            <Button
              key={index}
              component={Link}
              to={action.to}
              sx={{
                flex: '0 1 auto',
                minWidth: 140,
                height: 140,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 1,
                background: `linear-gradient(135deg, ${action.color}15, ${action.color}25)`,
                border: `2px solid ${action.color}30`,
                borderRadius: 3,
                color: action.color,
                transition: 'all 0.3s ease-in-out',
                '&:hover': {
                  background: `linear-gradient(135deg, ${action.color}25, ${action.color}35)`,
                  border: `2px solid ${action.color}50`,
                  transform: 'translateY(-4px)',
                  boxShadow: `0 8px 25px ${action.color}30`
                }
              }}
            >
              {action.icon}
              <Typography variant="body1" fontWeight="600" textAlign="center">
                {action.title}
              </Typography>
              <Typography variant="caption" textAlign="center" sx={{ opacity: 0.8 }}>
                {action.description}
              </Typography>
            </Button>
          ))}
        </Box>
      </Box>
    </Box>
  );
};

export default Dashboard;