import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Grid,
  Card,
  CardContent,
  Typography,
  Alert,
  CircularProgress,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  ToggleButton,
  ToggleButtonGroup,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Avatar,
  Chip,
  LinearProgress,
  IconButton,
  Tooltip,
  Button,
  Rating as MuiRating
} from '@mui/material';
import {
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  People as PeopleIcon,
  AttachMoney as MoneyIcon,
  Work as WorkIcon,
  Star as StarIcon,
  AccessTime as TimeIcon,
  Message as MessageIcon,
  Visibility as ViewIcon,
  Download as DownloadIcon,
  Refresh as RefreshIcon,
  BarChart as BarChartIcon,
  PieChart as PieChartIcon,
  Timeline as TimelineIcon
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';

// ============ TYPES ============
interface AmbassadorAnalytics {
  registrationsByDate: Array<{ date: string; count: number }>;
  servicesByType: Array<{ service: string; count: number }>;
  earningsByMonth: Array<{ month: string; amount: number }>;
  topAmbassadors: Array<{
    id: number;
    name: string;
    completedServices: number;
    earnings: number;
    rating: number;
  }>;
}

interface AmbassadorStats {
  totalAmbassadors: number;
  activeAmbassadors: number;
  pendingRequests: number;
  totalEarnings: number;
  totalCompletedServices: number;
  avgRating: number;
  monthlyGrowth: number;
}

// ============ STYLED COMPONENTS ============
const MetricCard = styled(Card)(({ theme }) => ({
  height: '100%',
  borderRadius: 12,
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: theme.shadows[8],
  },
}));

const StyledToggleButtonGroup = styled(ToggleButtonGroup)(({ theme }) => ({
  '& .MuiToggleButton-root': {
    textTransform: 'none',
    borderRadius: 8,
    padding: '6px 16px',
    border: `1px solid ${theme.palette.divider}`,
    '&.Mui-selected': {
      backgroundColor: theme.palette.primary.main,
      color: theme.palette.primary.contrastText,
      '&:hover': {
        backgroundColor: theme.palette.primary.dark,
      },
    },
  },
}));

// ============ MOCK DATA ============
const mockAnalyticsData: AmbassadorAnalytics = {
  registrationsByDate: [
    { date: '2024-01-01', count: 5 },
    { date: '2024-01-02', count: 8 },
    { date: '2024-01-03', count: 12 },
    { date: '2024-01-04', count: 7 },
    { date: '2024-01-05', count: 10 },
  ],
  servicesByType: [
    { service: 'تور شهری', count: 45 },
    { service: 'راهنمای موزه', count: 30 },
    { service: 'ترانسفر فرودگاه', count: 25 },
    { service: 'راهنمای خرید', count: 20 },
    { service: 'مشاوره سفر', count: 15 },
  ],
  earningsByMonth: [
    { month: 'دی', amount: 25000000 },
    { month: 'بهمن', amount: 32000000 },
    { month: 'اسفند', amount: 28000000 },
    { month: 'فروردین', amount: 35000000 },
    { month: 'اردیبهشت', amount: 40000000 },
  ],
  topAmbassadors: [
    { id: 1, name: 'علی محمدی', completedServices: 45, earnings: 8500000, rating: 4.8 },
    { id: 2, name: 'فاطمه کریمی', completedServices: 38, earnings: 7200000, rating: 4.9 },
    { id: 3, name: 'رضا احمدی', completedServices: 32, earnings: 6500000, rating: 4.7 },
    { id: 4, name: 'سارا نوری', completedServices: 28, earnings: 5200000, rating: 4.6 },
    { id: 5, name: 'محمد حسینی', completedServices: 25, earnings: 4800000, rating: 4.5 },
  ]
};

const mockStatsData: AmbassadorStats = {
  totalAmbassadors: 125,
  activeAmbassadors: 98,
  pendingRequests: 12,
  totalEarnings: 150000000,
  totalCompletedServices: 845,
  avgRating: 4.7,
  monthlyGrowth: 15
};

// ============ SIMPLE CHART COMPONENTS ============
const BarChartSimple: React.FC<{ data: Array<{ label: string; value: number }> }> = ({ data }) => {
  const maxValue = Math.max(...data.map(d => d.value));
  
  return (
    <Box sx={{ height: 200, display: 'flex', alignItems: 'flex-end', gap: 2, mt: 3, px: 2 }}>
      {data.map((item, index) => (
        <Box key={index} sx={{ flex: 1, textAlign: 'center' }}>
          <Box 
            sx={{ 
              height: `${(item.value / maxValue) * 150}px`,
              bgcolor: 'primary.main',
              borderRadius: '4px 4px 0 0',
              mb: 1,
              transition: 'height 0.3s ease'
            }}
          />
          <Typography variant="caption">
            {item.label}
          </Typography>
          <Typography variant="caption" display="block" color="text.secondary">
            {item.value.toLocaleString('fa-IR')}
          </Typography>
        </Box>
      ))}
    </Box>
  );
};

const PieChartSimple: React.FC<{ data: Array<{ name: string; value: number }> }> = ({ data }) => {
  const total = data.reduce((sum, item) => sum + item.value, 0);
  const colors = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];
  
  return (
    <Box sx={{ height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Box sx={{ position: 'relative', width: 200, height: 200 }}>
        {/* Pie chart simulation */}
        <Box sx={{ position: 'relative', width: '100%', height: '100%' }}>
          {data.map((item, index) => {
            const percentage = (item.value / total) * 100;
            const rotation = data.slice(0, index).reduce((sum, d) => sum + (d.value / total) * 360, 0);
            
            return (
              <Box
                key={index}
                sx={{
                  position: 'absolute',
                  width: '100%',
                  height: '100%',
                  clipPath: `polygon(50% 50%, 50% 0%, ${50 + Math.cos((rotation * Math.PI) / 180) * 50}% ${50 + Math.sin((rotation * Math.PI) / 180) * 50}%, ${50 + Math.cos(((rotation + percentage * 3.6) * Math.PI) / 180) * 50}% ${50 + Math.sin(((rotation + percentage * 3.6) * Math.PI) / 180) * 50}%)`,
                  backgroundColor: colors[index % colors.length],
                  opacity: 0.8,
                }}
              />
            );
          })}
        </Box>
        
        {/* Legend */}
        <Box sx={{ position: 'absolute', right: -120, top: 0 }}>
          {data.map((item, index) => (
            <Box key={index} sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <Box sx={{ width: 12, height: 12, bgcolor: colors[index % colors.length], mr: 1, borderRadius: '2px' }} />
              <Typography variant="body2">
                {item.name} ({((item.value / total) * 100).toFixed(0)}%)
              </Typography>
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  );
};

// ============ MAIN COMPONENT ============
const AmbassadorAnalyticsPage: React.FC = () => {
  const [analytics, setAnalytics] = useState<AmbassadorAnalytics | null>(null);
  const [stats, setStats] = useState<AmbassadorStats | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  const [period, setPeriod] = useState<'daily' | 'weekly' | 'monthly' | 'yearly'>('monthly');
  const [chartType, setChartType] = useState<'bar' | 'line' | 'area'>('bar');
  const [timeRange, setTimeRange] = useState<'7days' | '30days' | '90days' | '1year'>('30days');

  useEffect(() => {
    fetchData();
  }, [period, timeRange]);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setAnalytics(mockAnalyticsData);
      setStats(mockStatsData);
    } catch (err) {
      console.error('Error fetching analytics:', err);
      setError('خطا در دریافت اطلاعات آماری');
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    fetchData();
  };

  const handlePeriodChange = (event: any) => {
    setPeriod(event.target.value);
  };

  const handleChartTypeChange = (event: any, newChartType: typeof chartType | null) => {
    if (newChartType !== null) {
      setChartType(newChartType);
    }
  };

  const handleTimeRangeChange = (event: any, newTimeRange: typeof timeRange | null) => {
    if (newTimeRange !== null) {
      setTimeRange(newTimeRange);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fa-IR', {
      style: 'currency',
      currency: 'IRR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('fa-IR').format(num);
  };

  const getChartData = () => {
    if (!analytics) return [{ label: '', value: 0 }];
    
    return analytics.registrationsByDate.map((item, index) => ({
      label: `${index + 1}`,
      value: item.count,
    }));
  };

  const getServicesData = () => {
    if (!analytics) return [];
    return analytics.servicesByType;
  };

  const getEarningsData = () => {
    if (!analytics) return [{ label: '', value: 0 }];
    
    return analytics.earningsByMonth.map(item => ({
      label: item.month,
      value: item.amount,
    }));
  };

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" fontWeight="bold">
          آمار و گزارشات سفیران
        </Typography>
        
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Tooltip title="بروزرسانی داده‌ها">
            <IconButton onClick={handleRefresh} disabled={loading}>
              <RefreshIcon />
            </IconButton>
          </Tooltip>
          
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>بازه زمانی</InputLabel>
            <Select value={period} label="بازه زمانی" onChange={handlePeriodChange}>
              <MenuItem value="daily">روزانه</MenuItem>
              <MenuItem value="weekly">هفتگی</MenuItem>
              <MenuItem value="monthly">ماهانه</MenuItem>
              <MenuItem value="yearly">سالانه</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </Box>

      {/* Error Alert */}
      {error && (
        <Alert 
          severity="error" 
          sx={{ mb: 3 }} 
          onClose={() => setError(null)}
          action={
            <Button color="inherit" size="small" onClick={fetchData}>
              تلاش مجدد
            </Button>
          }
        >
          {error}
        </Alert>
      )}

      {/* Loading State */}
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          {/* Stats Cards */}
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: '1fr 1fr 1fr 1fr' }, gap: 3, mb: 4 }}>
            <MetricCard>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <Box>
                    <Typography variant="h3" fontWeight="bold" color="primary.main">
                      {stats ? formatNumber(stats.totalAmbassadors) : '0'}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                      کل سفیران
                    </Typography>
                  </Box>
                  <PeopleIcon sx={{ fontSize: 40, color: 'primary.light', opacity: 0.8 }} />
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
                  {stats?.monthlyGrowth && stats.monthlyGrowth > 0 ? (
                    <>
                      <TrendingUpIcon sx={{ color: 'success.main', mr: 0.5 }} />
                      <Typography variant="body2" color="success.main">
                        {stats.monthlyGrowth}% رشد نسبت به ماه قبل
                      </Typography>
                    </>
                  ) : (
                    <>
                      <TrendingDownIcon sx={{ color: 'error.main', mr: 0.5 }} />
                      <Typography variant="body2" color="error.main">
                        {stats?.monthlyGrowth || 0}% کاهش نسبت به ماه قبل
                      </Typography>
                    </>
                  )}
                </Box>
              </CardContent>
            </MetricCard>

            <MetricCard>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <Box>
                    <Typography variant="h3" fontWeight="bold" color="success.main">
                      {stats ? formatNumber(stats.activeAmbassadors) : '0'}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                      سفیران فعال
                    </Typography>
                  </Box>
                  <WorkIcon sx={{ fontSize: 40, color: 'success.light', opacity: 0.8 }} />
                </Box>
                <LinearProgress 
                  variant="determinate" 
                  value={stats ? (stats.activeAmbassadors / stats.totalAmbassadors) * 100 : 0}
                  sx={{ mt: 2, height: 6, borderRadius: 3 }}
                  color="success"
                />
                <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                  {stats ? Math.round((stats.activeAmbassadors / stats.totalAmbassadors) * 100) : 0}% از کل سفیران
                </Typography>
              </CardContent>
            </MetricCard>

            <MetricCard>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <Box>
                    <Typography variant="h3" fontWeight="bold" color="warning.main">
                      {stats ? formatCurrency(stats.totalEarnings) : '۰'}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                      مجموع درآمدها
                    </Typography>
                  </Box>
                  <MoneyIcon sx={{ fontSize: 40, color: 'warning.light', opacity: 0.8 }} />
                </Box>
                <Typography variant="body2" sx={{ mt: 2, display: 'flex', alignItems: 'center' }}>
                  <TimeIcon fontSize="small" sx={{ mr: 0.5, color: 'text.secondary' }} />
                  میانگین ماهانه: {stats ? formatCurrency(stats.totalEarnings / 12) : '۰'}
                </Typography>
              </CardContent>
            </MetricCard>

            <MetricCard>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <Box>
                    <Typography variant="h3" fontWeight="bold" color="info.main">
                      {stats ? stats.avgRating.toFixed(1) : '۰'}
                      <Typography component="span" variant="h6" color="text.secondary">
                        /۵
                      </Typography>
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                      میانگین امتیاز
                    </Typography>
                  </Box>
                  <StarIcon sx={{ fontSize: 40, color: 'info.light', opacity: 0.8 }} />
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
                  <MuiRating 
                    value={stats?.avgRating || 0} 
                    readOnly 
                    precision={0.1}
                    size="small"
                  />
                  <Typography variant="caption" color="text.secondary" sx={{ mr: 1 }}>
                    ({stats?.avgRating.toFixed(1)})
                  </Typography>
                </Box>
              </CardContent>
            </MetricCard>
          </Box>

          {/* Charts Section */}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            {/* First Row */}
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: '2fr 1fr' }, gap: 3 }}>
              {/* Registrations Chart */}
              <Paper sx={{ p: 3, borderRadius: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                  <Typography variant="h6" fontWeight="bold">
                    روند ثبت‌نام سفیران
                  </Typography>
                  
                  <StyledToggleButtonGroup
                    value={chartType}
                    exclusive
                    onChange={handleChartTypeChange}
                    size="small"
                  >
                    <ToggleButton value="bar">
                      <BarChartIcon fontSize="small" />
                    </ToggleButton>
                    <ToggleButton value="line">
                      <TimelineIcon fontSize="small" />
                    </ToggleButton>
                    <ToggleButton value="area">
                      <PieChartIcon fontSize="small" />
                    </ToggleButton>
                  </StyledToggleButtonGroup>
                </Box>
                
                <BarChartSimple data={getChartData()} />
              </Paper>

              {/* Services Distribution */}
              <Paper sx={{ p: 3, borderRadius: 3 }}>
                <Typography variant="h6" fontWeight="bold" mb={3}>
                  توزیع خدمات
                </Typography>
                
                <PieChartSimple 
                  data={getServicesData().map(item => ({ name: item.service, value: item.count }))} 
                />
              </Paper>
            </Box>

            {/* Earnings Chart */}
            <Paper sx={{ p: 3, borderRadius: 3 }}>
              <Typography variant="h6" fontWeight="bold" mb={3}>
                درآمد سفیران بر اساس ماه
              </Typography>
              
              <BarChartSimple data={getEarningsData()} />
            </Paper>

            {/* Top Ambassadors Table */}
            <Paper sx={{ p: 3, borderRadius: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h6" fontWeight="bold">
                  برترین سفیران
                </Typography>
                
                <StyledToggleButtonGroup
                  value={timeRange}
                  exclusive
                  onChange={handleTimeRangeChange}
                  size="small"
                >
                  <ToggleButton value="7days">۷ روز</ToggleButton>
                  <ToggleButton value="30days">۳۰ روز</ToggleButton>
                  <ToggleButton value="90days">۹۰ روز</ToggleButton>
                  <ToggleButton value="1year">یک سال</ToggleButton>
                </StyledToggleButtonGroup>
              </Box>
              
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow sx={{ backgroundColor: 'grey.50' }}>
                      <TableCell width="5%">رتبه</TableCell>
                      <TableCell width="25%">سفیر</TableCell>
                      <TableCell width="15%" align="center">خدمات انجام شده</TableCell>
                      <TableCell width="15%" align="center">مجموع درآمد</TableCell>
                      <TableCell width="15%" align="center">میانگین امتیاز</TableCell>
                      <TableCell width="15%" align="center">نرخ پاسخگویی</TableCell>
                      <TableCell width="10%" align="center">عملیات</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {analytics?.topAmbassadors && analytics.topAmbassadors.length > 0 ? (
                      analytics.topAmbassadors.map((ambassador, index) => (
                        <TableRow key={ambassador.id} hover>
                          <TableCell>
                            <Chip 
                              label={index + 1} 
                              color={
                                index === 0 ? 'primary' :
                                index === 1 ? 'secondary' :
                                index === 2 ? 'success' : 'default'
                              }
                              size="small"
                            />
                          </TableCell>
                          <TableCell>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                              <Avatar sx={{ bgcolor: 'primary.main' }}>
                                {ambassador.name?.[0]}
                              </Avatar>
                              <Box>
                                <Typography fontWeight="medium">
                                  {ambassador.name}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                  ID: {ambassador.id}
                                </Typography>
                              </Box>
                            </Box>
                          </TableCell>
                          <TableCell align="center">
                            <Typography fontWeight="bold" color="info.main">
                              {formatNumber(ambassador.completedServices)}
                            </Typography>
                          </TableCell>
                          <TableCell align="center">
                            <Typography fontWeight="bold" color="success.main">
                              {formatCurrency(ambassador.earnings)}
                            </Typography>
                          </TableCell>
                          <TableCell align="center">
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
                              <MuiRating 
                                value={ambassador.rating} 
                                readOnly 
                                size="small"
                                precision={0.1}
                              />
                              <Typography variant="body2" color="text.secondary">
                                ({ambassador.rating.toFixed(1)})
                              </Typography>
                            </Box>
                          </TableCell>
                          <TableCell align="center">
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                              <LinearProgress 
                                variant="determinate" 
                                value={85}
                                sx={{ 
                                  width: '80%', 
                                  height: 8, 
                                  borderRadius: 4,
                                  backgroundColor: 'grey.200'
                                }}
                                color="primary"
                              />
                              <Typography variant="body2" sx={{ ml: 1, minWidth: 40 }}>
                                85%
                              </Typography>
                            </Box>
                          </TableCell>
                          <TableCell align="center">
                            <Tooltip title="مشاهده پروفایل">
                              <IconButton size="small" color="primary">
                                <ViewIcon />
                              </IconButton>
                            </Tooltip>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                          <Typography color="text.secondary">
                            اطلاعاتی برای نمایش وجود ندارد
                          </Typography>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          </Box>
        </>
      )}
    </Box>
  );
};

export default AmbassadorAnalyticsPage;