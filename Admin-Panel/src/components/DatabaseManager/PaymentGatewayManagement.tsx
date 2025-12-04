import React, { useState, useMemo } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Switch,
  Chip,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  LinearProgress
} from '@mui/material';
import {
  Add,
  Edit,
  Search,
  TrendingUp
} from '@mui/icons-material';

interface PaymentGateway {
  id: string;
  name: string;
  type: 'bank' | 'crypto' | 'wallet';
  status: 'active' | 'inactive';
  apiKey: string;
  merchantId: string;
  transactionCount: number;
  totalRevenue: number;
  successRate: number;
  config: {
    sandbox: boolean;
    webhookUrl: string;
    callbackUrl: string;
  };
}

interface Transaction {
  id: string;
  referenceNumber: string;
  gatewayId: string;
  amount: number;
  currency: string;
  status: 'success' | 'failed' | 'pending';
  createdAt: string;
  customerEmail: string;
  description: string;
}

const PaymentGatewayManagement: React.FC = () => {
  const [gateways, setGateways] = useState<PaymentGateway[]>([
    {
      id: '1',
      name: 'درگاه زرین‌پال',
      type: 'bank',
      status: 'active',
      apiKey: '••••••••',
      merchantId: 'ZP123456',
      transactionCount: 1247,
      totalRevenue: 245000000,
      successRate: 98.2,
      config: {
        sandbox: false,
        webhookUrl: 'https://api.tourism.com/webhook/zarinpal',
        callbackUrl: 'https://tourism.com/payment/callback'
      }
    },
    {
      id: '2',
      name: 'درگاه پرداخت اول',
      type: 'bank',
      status: 'active',
      apiKey: '••••••••',
      merchantId: 'PP123789',
      transactionCount: 892,
      totalRevenue: 167000000,
      successRate: 96.5,
      config: {
        sandbox: true,
        webhookUrl: 'https://api.tourism.com/webhook/paypal',
        callbackUrl: 'https://tourism.com/payment/callback'
      }
    }
  ]);

  const [transactions] = useState<Transaction[]>([
    {
      id: '1',
      referenceNumber: 'REF-2024-001',
      gatewayId: '1',
      amount: 2500000,
      currency: 'IRT',
      status: 'success',
      createdAt: '2024-01-15T10:30:00Z',
      customerEmail: 'customer1@example.com',
      description: 'رزرو هتل در کیش'
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [gatewayFilter, setGatewayFilter] = useState<string>('all');
  const [openDialog, setOpenDialog] = useState(false);
  const [editingGateway, setEditingGateway] = useState<PaymentGateway | null>(null);

  // فیلتر کردن تراکنش‌ها
  const filteredTransactions = useMemo(() => {
    return transactions.filter(transaction => {
      const matchesSearch = 
        transaction.referenceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        transaction.customerEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
        transaction.description.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === 'all' || transaction.status === statusFilter;
      const matchesGateway = gatewayFilter === 'all' || transaction.gatewayId === gatewayFilter;
      
      return matchesSearch && matchesStatus && matchesGateway;
    });
  }, [transactions, searchTerm, statusFilter, gatewayFilter]);

  const toggleGatewayStatus = (gatewayId: string) => {
    setGateways(prev => prev.map(gateway => 
      gateway.id === gatewayId 
        ? { ...gateway, status: gateway.status === 'active' ? 'inactive' : 'active' }
        : gateway
    ));
  };

  const getGatewayTypeColor = (type: string) => {
    switch (type) {
      case 'bank': return 'primary';
      case 'crypto': return 'secondary';
      case 'wallet': return 'success';
      default: return 'default';
    }
  };

  const getStatusColor = (status: string) => {
    return status === 'active' ? 'success' : 'error';
  };

  const getTransactionStatusColor = (status: string) => {
    switch (status) {
      case 'success': return 'success';
      case 'failed': return 'error';
      case 'pending': return 'warning';
      default: return 'default';
    }
  };

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('fa-IR').format(amount) + ' ' + currency;
  };

  const totalRevenue = gateways.reduce((sum, gateway) => sum + gateway.totalRevenue, 0);
  const totalTransactions = gateways.reduce((sum, gateway) => sum + gateway.transactionCount, 0);
  const averageSuccessRate = gateways.reduce((sum, gateway) => sum + gateway.successRate, 0) / gateways.length;

  return (
    <Box>
      {/* آمار کلی */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                کل درآمد
              </Typography>
              <Typography variant="h5" component="div">
                {formatCurrency(totalRevenue, 'IRT')}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                <TrendingUp sx={{ color: 'success.main', mr: 1 }} />
                <Typography variant="body2" color="success.main">
                  +12.5%
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                تراکنش‌ها
              </Typography>
              <Typography variant="h5" component="div">
                {totalTransactions.toLocaleString('fa-IR')}
              </Typography>
              <LinearProgress 
                variant="determinate" 
                value={75} 
                sx={{ mt: 1, height: 6, borderRadius: 3 }}
              />
            </CardContent>
          </Card>
        </Grid>
        
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                نرخ موفقیت
              </Typography>
              <Typography variant="h5" component="div">
                {averageSuccessRate.toFixed(1)}%
              </Typography>
              <Chip 
                label="عالی" 
                size="small" 
                color="success" 
                sx={{ mt: 1 }}
              />
            </CardContent>
          </Card>
        </Grid>
        
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                درگاه‌های فعال
              </Typography>
              <Typography variant="h5" component="div">
                {gateways.filter(g => g.status === 'active').length}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                از {gateways.length} درگاه
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        {/* لیست درگاه‌های پرداخت */}
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card>
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <Typography variant="h6">
                  درگاه‌های پرداخت
                </Typography>
                <Button
                  variant="contained"
                  startIcon={<Add />}
                  onClick={() => setOpenDialog(true)}
                >
                  افزودن درگاه
                </Button>
              </Box>

              {gateways.map((gateway) => (
                <Card key={gateway.id} sx={{ mb: 2, p: 2 }}>
                  <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Box>
                      <Typography variant="h6" gutterBottom>
                        {gateway.name}
                      </Typography>
                      <Box display="flex" gap={1} mb={1}>
                        <Chip 
                          label={gateway.type} 
                          size="small" 
                          color={getGatewayTypeColor(gateway.type) as any}
                        />
                        <Chip 
                          label={gateway.status === 'active' ? 'فعال' : 'غیرفعال'} 
                          size="small" 
                          color={getStatusColor(gateway.status)}
                        />
                        {gateway.config.sandbox && (
                          <Chip label="Sandbox" size="small" color="warning" />
                        )}
                      </Box>
                      <Typography variant="body2" color="textSecondary">
                        Merchant ID: {gateway.merchantId}
                      </Typography>
                    </Box>
                    
                    <Box display="flex" alignItems="center" gap={1}>
                      <Switch
                        checked={gateway.status === 'active'}
                        onChange={() => toggleGatewayStatus(gateway.id)}
                        color="success"
                      />
                      <IconButton size="small" onClick={() => setEditingGateway(gateway)}>
                        <Edit />
                      </IconButton>
                    </Box>
                  </Box>
                  
                  <Box display="flex" justifyContent="space-between" mt={2}>
                    <Typography variant="body2">
                      تراکنش: {gateway.transactionCount.toLocaleString('fa-IR')}
                    </Typography>
                    <Typography variant="body2">
                      موفقیت: {gateway.successRate}%
                    </Typography>
                    <Typography variant="body2">
                      درآمد: {formatCurrency(gateway.totalRevenue, 'IRT')}
                    </Typography>
                  </Box>
                </Card>
              ))}
            </CardContent>
          </Card>
        </Grid>

        {/* لیست تراکنش‌ها */}
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                تراکنش‌ها
              </Typography>
              
              {/* فیلترها */}
              <Box display="flex" gap={2} mb={3} flexWrap="wrap">
                <TextField
                  size="small"
                  placeholder="جستجو با شماره مرجع، ایمیل یا توضیحات..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  InputProps={{
                    startAdornment: <Search sx={{ mr: 1, color: 'text.secondary' }} />
                  }}
                  sx={{ minWidth: 200, flex: 1 }}
                />
                
                <FormControl size="small" sx={{ minWidth: 120 }}>
                  <InputLabel>وضعیت</InputLabel>
                  <Select
                    value={statusFilter}
                    label="وضعیت"
                    onChange={(e) => setStatusFilter(e.target.value)}
                  >
                    <MenuItem value="all">همه</MenuItem>
                    <MenuItem value="success">موفق</MenuItem>
                    <MenuItem value="failed">ناموفق</MenuItem>
                    <MenuItem value="pending">در انتظار</MenuItem>
                  </Select>
                </FormControl>
                
                <FormControl size="small" sx={{ minWidth: 120 }}>
                  <InputLabel>درگاه</InputLabel>
                  <Select
                    value={gatewayFilter}
                    label="درگاه"
                    onChange={(e) => setGatewayFilter(e.target.value)}
                  >
                    <MenuItem value="all">همه</MenuItem>
                    {gateways.map(gateway => (
                      <MenuItem key={gateway.id} value={gateway.id}>
                        {gateway.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>

              <TableContainer component={Paper} sx={{ maxHeight: 400 }}>
                <Table stickyHeader size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>شماره مرجع</TableCell>
                      <TableCell>مبلغ</TableCell>
                      <TableCell>وضعیت</TableCell>
                      <TableCell>تاریخ</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredTransactions.map((transaction) => (
                      <TableRow key={transaction.id} hover>
                        <TableCell>
                          <Typography variant="body2" fontWeight="bold">
                            {transaction.referenceNumber}
                          </Typography>
                          <Typography variant="caption" color="textSecondary">
                            {transaction.customerEmail}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          {formatCurrency(transaction.amount, transaction.currency)}
                        </TableCell>
                        <TableCell>
                          <Chip 
                            label={
                              transaction.status === 'success' ? 'موفق' :
                              transaction.status === 'failed' ? 'ناموفق' : 'در انتظار'
                            }
                            size="small"
                            color={getTransactionStatusColor(transaction.status)}
                          />
                        </TableCell>
                        <TableCell>
                          {new Date(transaction.createdAt).toLocaleDateString('fa-IR')}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>

              {filteredTransactions.length === 0 && (
                <Alert severity="info" sx={{ mt: 2 }}>
                  هیچ تراکنشی یافت نشد.
                </Alert>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* دیالوگ افزودن/ویرایش درگاه */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          {editingGateway ? 'ویرایش درگاه پرداخت' : 'افزودن درگاه پرداخت جدید'}
        </DialogTitle>
        <DialogContent>
          <Box display="flex" flexDirection="column" gap={3} mt={2}>
            <TextField
              label="نام درگاه"
              fullWidth
              defaultValue={editingGateway?.name}
            />
            <FormControl fullWidth>
              <InputLabel>نوع درگاه</InputLabel>
              <Select label="نوع درگاه" defaultValue={editingGateway?.type || 'bank'}>
                <MenuItem value="bank">درگاه بانکی</MenuItem>
                <MenuItem value="crypto">ارز دیجیتال</MenuItem>
                <MenuItem value="wallet">کیف پول</MenuItem>
              </Select>
            </FormControl>
            <TextField
              label="Merchant ID"
              fullWidth
              defaultValue={editingGateway?.merchantId}
            />
            <TextField
              label="API Key"
              type="password"
              fullWidth
              defaultValue={editingGateway?.apiKey}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>لغو</Button>
          <Button variant="contained">
            {editingGateway ? 'بروزرسانی' : 'ذخیره'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default PaymentGatewayManagement;