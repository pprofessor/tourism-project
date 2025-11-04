import React, { useState, useCallback, useMemo } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Alert,
  CircularProgress,
  useTheme,
  Chip
} from '@mui/material';
import {
  People,
  Hotel,
  CalendarToday,
  Storage,
  Security,
  Download
} from '@mui/icons-material';
import adminService from '../../services/adminService';

// نوع‌های صادرات
type ExportType = 'users' | 'hotels' | 'bookings';

interface ExportOption {
  type: ExportType;
  label: string;
  description: string;
  icon: React.ReactElement;
  color: 'primary' | 'success' | 'secondary' | 'error';
}

const DataExport: React.FC = () => {
  const theme = useTheme();
  const [exporting, setExporting] = useState<ExportType | 'all' | null>(null);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');

  // تابع کمکی برای دریافت نام فارسی
  const getExportLabel = useCallback((type: ExportType): string => {
    const labels = {
      'users': 'کاربران',
      'hotels': 'هتل‌ها',
      'bookings': 'رزروها'
    };
    return labels[type] || type;
  }, []);

  // گزینه‌های صادرات با useMemo
  const exportOptions = useMemo((): ExportOption[] => [
    {
      type: 'users',
      label: 'اطلاعات کاربران',
      description: 'خروجی کلیه اطلاعات کاربران سیستم',
      icon: <People fontSize="large" />,
      color: 'primary'
    },
    {
      type: 'hotels',
      label: 'اطلاعات هتل‌ها',
      description: 'خروجی کامل اطلاعات هتل‌ها و امکانات',
      icon: <Hotel fontSize="large" />,
      color: 'success'
    },
    {
      type: 'bookings',
      label: 'سوابق رزرو',
      description: 'خروجی تاریخچه رزروهای سیستم',
      icon: <CalendarToday fontSize="large" />,
      color: 'secondary'
    }
  ], []);

  // تابع کمکی برای دانلود فایل
  const downloadBlob = useCallback((blob: Blob, type: ExportType) => {
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `tourism-${type}-${new Date().toISOString().split('T')[0]}.json`);
    link.setAttribute('aria-label', `Download ${type} data`);
    
    // اضافه کردن ویژگی‌های امنیتی
    link.rel = 'noopener noreferrer';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // آزاد کردن منابع
    setTimeout(() => window.URL.revokeObjectURL(url), 1000);
  }, []);

  // تابع صادرات با useCallback برای بهینه‌سازی
  const handleExport = useCallback(async (type: ExportType | 'all') => {
    setExporting(type);
    setError('');
    setSuccess('');

    try {
      if (type === 'all') {
        // صادرات همه داده‌ها
        await Promise.all(
          exportOptions.map(option => 
            adminService.exportData(option.type)
              .then(blob => downloadBlob(blob, option.type))
          )
        );
        setSuccess('کلیه داده‌ها با موفقیت صادر شدند');
      } else {
        // صادرات تک‌نوع
        const blob = await adminService.exportData(type);
        downloadBlob(blob, type);
        setSuccess(`داده‌های ${getExportLabel(type)} با موفقیت صادر شد`);
      }
    } catch (error) {
      console.error('Export error:', error);
      setError(type === 'all' 
        ? 'خطا در صادرات کلیه داده‌ها' 
        : `خطا در صادرات داده‌های ${getExportLabel(type)}`
      );
    } finally {
      setExporting(null);
    }
  }, [exportOptions, downloadBlob, getExportLabel]);

  // پاک کردن پیام‌ها بعد از 6 ثانیه
  React.useEffect(() => {
    if (success || error) {
      const timer = setTimeout(() => {
        setSuccess('');
        setError('');
      }, 6000);
      return () => clearTimeout(timer);
    }
  }, [success, error]);

  return (
    <Box sx={{ p: 3 }}>
      {/* هدر صفحه */}
      <Box sx={{ mb: 4 }}>
        <Typography 
          variant="h4" 
          component="h1" 
          gutterBottom 
          fontWeight="bold"
          color="primary"
        >
          صادرات داده‌ها
        </Typography>
        <Typography variant="body1" color="text.secondary">
          مدیریت و صادرات اطلاعات سیستم در قالب‌های مختلف
        </Typography>
      </Box>

      {/* نمایش پیام‌ها */}
      {error && (
        <Alert 
          severity="error" 
          sx={{ mb: 3 }}
          onClose={() => setError('')}
        >
          {error}
        </Alert>
      )}
      
      {success && (
        <Alert 
          severity="success" 
          sx={{ mb: 3 }}
          onClose={() => setSuccess('')}
        >
          {success}
        </Alert>
      )}

      {/* کارت‌های صادرات */}
      <Box sx={{ 
        display: 'grid',
        gridTemplateColumns: { 
          xs: '1fr', 
          sm: 'repeat(2, 1fr)', 
          md: 'repeat(4, 1fr)' 
        },
        gap: 3,
        mb: 4
      }}>
        {exportOptions.map((option) => (
          <Card 
            key={option.type}
            sx={{ 
              height: '100%',
              transition: 'all 0.3s ease-in-out',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: theme.shadows[8],
                borderColor: theme.palette[option.color].main
              },
              border: `2px solid transparent`
            }}
          >
            <CardContent sx={{ 
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              height: '100%',
              p: 3
            }}>
              {/* آیکون */}
              <Box 
                sx={{ 
                  color: theme.palette[option.color].main,
                  mb: 2
                }}
              >
                {option.icon}
              </Box>

              {/* عنوان و توضیحات */}
              <Typography 
                variant="h6" 
                component="h2" 
                gutterBottom
                fontWeight="600"
              >
                {option.label}
              </Typography>
              
              <Typography 
                variant="body2" 
                color="text.secondary"
                sx={{ mb: 3, flexGrow: 1 }}
              >
                {option.description}
              </Typography>

              {/* دکمه صادرات */}
              <Button
                variant="contained"
                color={option.color}
                fullWidth
                startIcon={
                  exporting === option.type ? 
                  <CircularProgress size={16} color="inherit" /> : 
                  <Download />
                }
                onClick={() => handleExport(option.type)}
                disabled={!!exporting}
                sx={{
                  py: 1.5,
                  fontWeight: '600'
                }}
              >
                {exporting === option.type ? 'در حال صادرات...' : 'صادرات'}
              </Button>
            </CardContent>
          </Card>
        ))}

        {/* کارت صادرات کلی */}
        <Card 
          sx={{ 
            height: '100%',
            background: `linear-gradient(135deg, ${theme.palette.error.main}15, ${theme.palette.error.main}25)`,
            transition: 'all 0.3s ease-in-out',
            '&:hover': {
              transform: 'translateY(-4px)',
              boxShadow: theme.shadows[8]
            }
          }}
        >
          <CardContent sx={{ 
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            height: '100%',
            p: 3
          }}>
            {/* آیکون */}
            <Box 
              sx={{ 
                color: theme.palette.error.main,
                mb: 2
              }}
            >
              <Storage fontSize="large" />
            </Box>

            {/* عنوان و توضیحات */}
            <Typography 
              variant="h6" 
              component="h2" 
              gutterBottom
              fontWeight="600"
            >
              صادرات کامل
            </Typography>
            
            <Typography 
              variant="body2" 
              color="text.secondary"
              sx={{ mb: 3, flexGrow: 1 }}
            >
              صادرات کلیه اطلاعات سیستم در یک فایل ZIP
            </Typography>

            {/* دکمه صادرات */}
            <Button
              variant="contained"
              color="error"
              fullWidth
              startIcon={
                exporting === 'all' ? 
                <CircularProgress size={16} color="inherit" /> : 
                <Storage />
              }
              onClick={() => handleExport('all')}
              disabled={!!exporting}
              sx={{
                py: 1.5,
                fontWeight: '600'
              }}
            >
              {exporting === 'all' ? 'در حال صادرات...' : 'صادرات کامل'}
            </Button>
          </CardContent>
        </Card>
      </Box>

      {/* اطلاعات امنیتی */}
      <Card 
        sx={{ 
          border: `2px solid ${theme.palette.warning.light}`,
          background: theme.palette.warning.light + '15'
        }}
      >
        <CardContent sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Security color="warning" sx={{ mr: 1 }} />
            <Typography variant="h6" component="h3" color="warning.dark">
              نکات امنیتی صادرات داده‌ها
            </Typography>
          </Box>
          
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 1 }}>
              <Chip label="1" size="small" color="warning" sx={{ mr: 1, mt: 0.5 }} />
              <Typography variant="body2">
                داده‌ها در قالب JSON صادر می‌شوند
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 1 }}>
              <Chip label="2" size="small" color="warning" sx={{ mr: 1, mt: 0.5 }} />
              <Typography variant="body2">
                فایل‌ها شامل timestamp برای رهگیری هستند
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 1 }}>
              <Chip label="3" size="small" color="warning" sx={{ mr: 1, mt: 0.5 }} />
              <Typography variant="body2">
                صادرات داده‌های حجیم ممکن است زمان‌بر باشد
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
              <Chip label="4" size="small" color="warning" sx={{ mr: 1, mt: 0.5 }} />
              <Typography variant="body2">
                فایل‌های صادر شده حاوی اطلاعات حساس هستند
              </Typography>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default React.memo(DataExport);